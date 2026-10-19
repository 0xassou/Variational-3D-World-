import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';
import { BRAND_BLUE, EMBLEM_PATH, LOGO_VIEWBOX, WORDMARK_PATHS, type LogoPath } from '@/lib/brand';

/* ------------------------------------------------------------------ */
/* Dessin du logo officiel sur canvas 2D (tracés SVG via Path2D)       */
/* ------------------------------------------------------------------ */

/** Début du wordmark dans le viewBox (l'emblème occupe x ∈ [0, 34]). */
const WORD_X0 = 35.8;
export const WORDMARK_ASPECT = (LOGO_VIEWBOX.width - WORD_X0) / LOGO_VIEWBOX.height;
export const LOGO_ASPECT = LOGO_VIEWBOX.width / LOGO_VIEWBOX.height;
export const EMBLEM_ASPECT = 34.05 / LOGO_VIEWBOX.height;

let emblemPath: Path2D | null = null;
let wordPaths: Path2D[] | null = null;

function paths() {
  if (!emblemPath || !wordPaths) {
    emblemPath = new Path2D(EMBLEM_PATH.d);
    wordPaths = WORDMARK_PATHS.map((p) => new Path2D(p.d));
  }
  return { emblem: emblemPath, words: wordPaths };
}

function fillPath(ctx: CanvasRenderingContext2D, path: Path2D, def: LogoPath) {
  ctx.fill(path, def.evenOdd ? 'evenodd' : 'nonzero');
}

/** Emblème « vague » : (x, y) = coin haut-gauche, `height` en px. */
export function drawEmblem(ctx: CanvasRenderingContext2D, x: number, y: number, height: number, color = BRAND_BLUE) {
  const s = height / LOGO_VIEWBOX.height;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = color;
  fillPath(ctx, paths().emblem, EMBLEM_PATH);
  ctx.restore();
}

/** Wordmark « Variational » seul. */
export function drawWordmark(ctx: CanvasRenderingContext2D, x: number, y: number, height: number, color: string) {
  const s = height / LOGO_VIEWBOX.height;
  const { words } = paths();
  ctx.save();
  ctx.translate(x - WORD_X0 * s, y);
  ctx.scale(s, s);
  ctx.fillStyle = color;
  words.forEach((p, i) => fillPath(ctx, p, WORDMARK_PATHS[i]));
  ctx.restore();
}

/** Logo horizontal complet (emblème + wordmark). */
export function drawLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  height: number,
  colors: { emblem: string; text: string },
) {
  drawEmblem(ctx, x, y, height, colors.emblem);
  drawWordmark(ctx, x + WORD_X0 * (height / LOGO_VIEWBOX.height), y, height, colors.text);
}

/* ------------------------------------------------------------------ */
/* Textures mises en cache                                              */
/* ------------------------------------------------------------------ */

interface CachedTexture {
  texture: CanvasTexture;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

const cache = new Map<string, CachedTexture>();
let fontHookInstalled = false;

/** Redessine les textures quand la police Inter est disponible (sinon la police de secours resterait figée). */
function installFontHook() {
  if (fontHookInstalled || typeof document === 'undefined' || !document.fonts) return;
  fontHookInstalled = true;
  const redraw = () => {
    cache.forEach(({ texture, draw }) => {
      const canvas = texture.image as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      draw(ctx);
      texture.needsUpdate = true;
    });
  };
  Promise.all(['400 32px Inter', '600 32px Inter', '700 32px Inter', '800 32px Inter'].map((f) => document.fonts.load(f)))
    .then(redraw)
    .catch(() => undefined);
}

function makeTexture(key: string, w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const hit = cache.get(key);
  if (hit) return hit.texture;
  installFontHook();
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (ctx) draw(ctx);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  cache.set(key, { texture, draw });
  return texture;
}

export type LogoVariant = 'onLight' | 'onDark' | 'mono';

const VARIANT_COLORS: Record<LogoVariant, { emblem: string; text: string }> = {
  onLight: { emblem: BRAND_BLUE, text: '#0b1f3a' },
  onDark: { emblem: BRAND_BLUE, text: '#ffffff' },
  mono: { emblem: '#ffffff', text: '#ffffff' },
};

/** Logo horizontal sur fond transparent (ratio 173:24). */
export function getLogoTexture(variant: LogoVariant): CanvasTexture {
  const h = 160;
  const w = Math.round(h * LOGO_ASPECT) + 16;
  return makeTexture(`logo-${variant}`, w, h + 16, (ctx) => drawLogo(ctx, 8, 8, h, VARIANT_COLORS[variant]));
}

/** Logo empilé (emblème au-dessus du wordmark) pour le torse des t-shirts du staff. */
export function getShirtLogoTexture(): CanvasTexture {
  return makeTexture('shirt', 512, 512, (ctx) => {
    const emblemH = 228;
    drawEmblem(ctx, 256 - (emblemH * EMBLEM_ASPECT) / 2, 52, emblemH, '#ffffff');
    const wordH = 70;
    drawWordmark(ctx, 256 - (wordH * WORDMARK_ASPECT) / 2, 334, wordH, '#ffffff');
  });
}

/** Écran de borne interactive : fond accent, emblème, libellé, invite. */
export function getKioskTexture(accent: string, label: string): CanvasTexture {
  return makeTexture(`kiosk-${accent}-${label}`, 512, 340, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 512, 340);
    g.addColorStop(0, accent);
    g.addColorStop(1, '#0b1f3a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 340);
    drawLogo(ctx, 32, 28, 34, VARIANT_COLORS.mono);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 40px Inter, Arial, sans-serif';
    ctx.textBaseline = 'top';
    wrapText(ctx, label, 32, 110, 448, 48, 3);
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = '600 24px Inter, Arial, sans-serif';
    ctx.fillText('E  ·  CLICK  ·  INFO', 32, 290);
  });
}

export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const words = text.split(' ');
  let line = '';
  let lines = 0;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y + lines * lineHeight);
      lines += 1;
      line = word;
      if (lines >= maxLines) return;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, y + lines * lineHeight);
}

/**
 * Visuel vertical de kakemono / totem : logo, accroche et vague de marque.
 * `theme` = 'dark' (fond bleu nuit) ou 'light' (fond blanc).
 */
export function getBannerTexture(lines: string[], theme: 'dark' | 'light'): CanvasTexture {
  const W = 512;
  const H = 1280;
  return makeTexture(`banner-${theme}-${lines.join('|')}`, W, H, (ctx) => {
    const dark = theme === 'dark';
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, dark ? '#0b1f3a' : '#ffffff');
    bg.addColorStop(1, dark ? '#13325e' : '#e3effd');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Emblème principal.
    const emblemH = 220;
    drawEmblem(ctx, (W - emblemH * EMBLEM_ASPECT) / 2, 120, emblemH, BRAND_BLUE);
    const wordH = 62;
    drawWordmark(ctx, (W - wordH * WORDMARK_ASPECT) / 2, 400, wordH, dark ? '#ffffff' : '#0b1f3a');

    // Accroche.
    ctx.fillStyle = dark ? '#ffffff' : '#0b1f3a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    lines.forEach((line, i) => {
      ctx.font = i === 0 ? '800 64px Inter, Arial, sans-serif' : '600 38px Inter, Arial, sans-serif';
      if (i > 0) ctx.fillStyle = dark ? '#9cc8fb' : '#1f6bd1';
      ctx.fillText(line, W / 2, 610 + (i === 0 ? 0 : 40 + i * 58));
    });

    // Vagues décoratives.
    ctx.strokeStyle = BRAND_BLUE;
    for (let k = 0; k < 3; k++) {
      ctx.globalAlpha = 0.5 - k * 0.14;
      ctx.lineWidth = 6;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 8) {
        const y = 1010 + k * 42 + Math.sin(x / 70 + k) * 18;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = dark ? 'rgba(255,255,255,0.7)' : '#64748b';
    ctx.font = '700 30px Inter, Arial, sans-serif';
    ctx.fillText('SUMMIT · ARBITRUM', W / 2, 1180);
    ctx.textAlign = 'left';
  });
}

/** Enseigne circulaire suspendue (texture enroulée autour d'un cylindre ouvert, répétée 2×). */
export function getHangingSignTexture(title: string, number: string, accent: string): CanvasTexture {
  const tex = makeTexture(`hang-${number}-${title}-${accent}`, 2048, 256, (ctx) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 2048, 256);
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, 2048, 20);
    ctx.fillRect(0, 236, 2048, 20);
    ctx.fillRect(0, 20, 220, 216);
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${number.length > 2 ? 62 : 120}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number, 110, 132);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0b1f3a';
    let size = 92;
    ctx.font = `800 ${size}px Inter, Arial, sans-serif`;
    while (ctx.measureText(title).width > 1180 && size > 40) {
      size -= 4;
      ctx.font = `800 ${size}px Inter, Arial, sans-serif`;
    }
    ctx.fillText(title, 270, 132);
    drawLogo(ctx, 1490, 92, 76, VARIANT_COLORS.onLight);
  });
  tex.wrapS = RepeatWrapping;
  tex.repeat.set(2, 1);
  return tex;
}

/* ------------------------------------------------------------------ */
/* Matières (bois, marbre) et signalétique du café / des toilettes      */
/* ------------------------------------------------------------------ */

/** Bois chêne clair : lames verticales avec veinage. */
export function getWoodTexture(): CanvasTexture {
  const tex = makeTexture('wood', 512, 512, (ctx) => {
    ctx.fillStyle = '#c89b6d';
    ctx.fillRect(0, 0, 512, 512);
    for (let p = 0; p < 8; p++) {
      const x0 = p * 64;
      ctx.fillStyle = p % 2 ? 'rgba(120,80,40,0.10)' : 'rgba(255,240,220,0.08)';
      ctx.fillRect(x0, 0, 64, 512);
      ctx.strokeStyle = 'rgba(90,55,25,0.18)';
      ctx.lineWidth = 1.5;
      for (let k = 0; k < 7; k++) {
        ctx.beginPath();
        const off = (k * 9 + p * 13) % 60;
        for (let y = 0; y <= 512; y += 16) {
          const x = x0 + 4 + off * 0.9 + Math.sin(y / 40 + k + p) * 3;
          if (y === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(70,40,15,0.35)';
      ctx.fillRect(x0, 0, 2, 512);
    }
  });
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  return tex;
}

/** Parquet (lames horizontales décalées) pour le sol du café. */
export function getParquetTexture(): CanvasTexture {
  const tex = makeTexture('parquet', 512, 512, (ctx) => {
    const rows = 8;
    const h = 512 / rows;
    for (let r = 0; r < rows; r++) {
      const off = (r % 2) * 128;
      for (let c = -1; c < 3; c++) {
        const shade = 180 + ((r * 7 + c * 13) % 5) * 8;
        ctx.fillStyle = `rgb(${shade + 20}, ${shade - 20}, ${shade - 70})`;
        ctx.fillRect(c * 256 + off, r * h, 256, h);
        ctx.strokeStyle = 'rgba(80,50,20,0.35)';
        ctx.strokeRect(c * 256 + off, r * h, 256, h);
      }
    }
  });
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  return tex;
}

/** Marbre blanc veiné gris. */
export function getMarbleTexture(): CanvasTexture {
  const tex = makeTexture('marble', 512, 512, (ctx) => {
    ctx.fillStyle = '#f5f4f1';
    ctx.fillRect(0, 0, 512, 512);
    for (let k = 0; k < 14; k++) {
      ctx.strokeStyle = `rgba(120,120,130,${0.08 + (k % 4) * 0.04})`;
      ctx.lineWidth = 1 + (k % 3);
      ctx.beginPath();
      let x = (k * 97) % 512;
      let y = 0;
      ctx.moveTo(x, y);
      while (y < 512) {
        x += Math.sin(y / 30 + k) * 14 + ((k % 2) * 2 - 1) * 4;
        y += 18;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  });
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  return tex;
}

/** Ardoise du café : simulateur FDV → prix théorique par point $VAR au TGE. */
export function getMenuTexture(): CanvasTexture {
  return makeTexture('menu-fdv', 1024, 700, (ctx) => {
    ctx.fillStyle = '#1f2326';
    ctx.fillRect(0, 0, 1024, 700);
    ctx.strokeStyle = '#b08d57';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 1014, 690);
    drawLogo(ctx, 60, 44, 48, { emblem: BRAND_BLUE, text: '#ffffff' });
    ctx.fillStyle = '#f5e6c8';
    ctx.font = '800 40px Inter, Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('$VAR · TGE MENU', 964, 84);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#9fb6d6';
    ctx.font = '600 26px Inter, Arial, sans-serif';
    ctx.fillText('FDV  →  price per point', 70, 150);
    const rows: [string, string][] = [
      ['FDV $1B', '$28.6 / point'],
      ['FDV $2B', '$57.1 / point'],
      ['FDV $3B', '$85.7 / point'],
      ['FDV $5B', '$142.9 / point'],
      ['FDV $8B', '$228.6 / point'],
      ['FDV $30B', '$857.0 / point'],
    ];
    rows.forEach(([name, price], i) => {
      const y = 220 + i * 70;
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 40px Inter, Arial, sans-serif';
      ctx.fillText(name, 70, y);
      ctx.fillStyle = '#c4b5fd';
      ctx.textAlign = 'right';
      ctx.fillText(price, 954, y);
      ctx.textAlign = 'left';
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 10]);
      ctx.beginPath();
      ctx.moveTo(70 + ctx.measureText(name).width + 24, y - 12);
      ctx.lineTo(954 - ctx.measureText(price).width - 24, y - 12);
      ctx.stroke();
      ctx.setLineDash([]);
    });
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '500 22px Inter, Arial, sans-serif';
    ctx.fillText('32% Genesis airdrop · theoretical simulation · not financial advice', 70, 655);
  });
}

/** Pictogramme lumineux des toilettes (homme / femme / accessible), blanc sur bleu nuit. */
export function getRestroomSignTexture(kind: 'man' | 'woman'): CanvasTexture {
  return makeTexture(`wc-${kind}`, 256, 256, (ctx) => {
    ctx.fillStyle = '#0b1f3a';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(128, 62, 26, 0, Math.PI * 2);
    ctx.fill();
    if (kind === 'man') {
      ctx.fillRect(96, 98, 64, 78);
      ctx.fillRect(100, 176, 24, 54);
      ctx.fillRect(132, 176, 24, 54);
    } else {
      ctx.beginPath();
      ctx.moveTo(128, 96);
      ctx.lineTo(176, 186);
      ctx.lineTo(80, 186);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(106, 186, 18, 44);
      ctx.fillRect(132, 186, 18, 44);
    }
  });
}

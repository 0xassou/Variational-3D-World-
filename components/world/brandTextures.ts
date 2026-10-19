import { CanvasTexture, SRGBColorSpace } from 'three';
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
  return makeTexture('shirt', 256, 256, (ctx) => {
    const emblemH = 112;
    drawEmblem(ctx, 128 - (emblemH * EMBLEM_ASPECT) / 2, 28, emblemH, '#ffffff');
    const wordH = 34;
    drawWordmark(ctx, 128 - (wordH * WORDMARK_ASPECT) / 2, 168, wordH, '#ffffff');
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

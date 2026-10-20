'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { CanvasTexture, SRGBColorSpace } from 'three';
import { BRAND_BLUE } from '@/lib/brand';
import { CONTENT, VIDEOS, type VideoClip } from '@/lib/content';
import { BRAND, interactivePoint, STAGE } from '@/lib/layout';
import { useWorld } from '@/lib/store';
import { drawEmblem, drawLogo, wrapText } from './brandTextures';
import { FONT_BOLD, FONT_REGULAR, FONT_SEMI } from './Hall';
import { Kiosk } from './Kiosk';
import { LogoPlane } from './Logo';
import { Person, type PersonSpec } from './people';

const TOP = STAGE.height;
const FRONT_Z = STAGE.z + STAGE.depth / 2;
const BACK_Z = STAGE.z - STAGE.depth / 2;

/* ------------------------------------------------------------------ */
/* Bannière d'attente HD (canvas 1920×1080 redessiné périodiquement)    */
/* ------------------------------------------------------------------ */

const BANNER_W = 1920;
const BANNER_H = 1080;
const CLIP_IDS = Object.keys(VIDEOS);
const SLIDE_SECONDS = 6;
const PHOTO_SECONDS = 9;

/**
 * Photos réelles de Lucas Schuermann : miniatures officielles de ses interviews YouTube
 * (servies avec CORS par i.ytimg.com). Recadrées sur la moitié droite, où il apparaît.
 */
const SPEAKER_PHOTOS = [
  { youtubeId: 'Y_pWv3VayqU', credit: 'Photo: When Shift Happens (YouTube)' },
  { youtubeId: 'AC8p7kjlFas', credit: 'Photo: The Rollup (YouTube)' },
];

interface LoadedPhoto {
  img: HTMLImageElement;
  credit: string;
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  anchor: 'right' | 'center' = 'right',
) {
  // Recadrage « cover », ancré à droite par défaut (le visage est sur la droite des miniatures).
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const scale = Math.max(w / iw, h / ih);
  const sw = w / scale;
  const sh = h / scale;
  const sx = anchor === 'right' ? Math.max(0, iw - sw) : (iw - sw) / 2;
  const sy = (ih - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawBanner(ctx: CanvasRenderingContext2D, time: number, photos: LoadedPhoto[]) {
  const W = BANNER_W;
  const H = BANNER_H;

  // Fond bleu nuit de marque.
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0b1f3a');
  bg.addColorStop(1, '#13325e');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Filigrane emblème.
  ctx.save();
  ctx.globalAlpha = 0.08 + Math.sin(time * 0.6) * 0.02;
  drawEmblem(ctx, 1240, 120, 820, BRAND_BLUE);
  ctx.restore();

  // Vagues lumineuses en bas.
  ctx.save();
  ctx.strokeStyle = BRAND_BLUE;
  for (let k = 0; k < 3; k++) {
    ctx.globalAlpha = 0.35 - k * 0.09;
    ctx.lineWidth = 5 - k;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 16) {
      const y = 990 + k * 26 + Math.sin(x / 210 + time * 0.8 + k) * 16;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();

  /* --- Panneau photo de l'intervenant --- */
  const px = 80;
  const py = 90;
  const pw = 720;
  const ph = 860;
  ctx.save();
  roundRect(ctx, px, py, pw, ph, 36);
  ctx.clip();
  ctx.fillStyle = '#16345f';
  ctx.fillRect(px, py, pw, ph);
  if (photos.length) {
    const idx = Math.floor(time / PHOTO_SECONDS) % photos.length;
    const phase = (time % PHOTO_SECONDS) / PHOTO_SECONDS;
    drawCover(ctx, photos[idx].img, px, py, pw, ph);
    // Fondu enchaîné vers la photo suivante.
    if (photos.length > 1 && phase > 0.88) {
      ctx.globalAlpha = (phase - 0.88) / 0.12;
      drawCover(ctx, photos[(idx + 1) % photos.length].img, px, py, pw, ph);
      ctx.globalAlpha = 1;
    }
  } else {
    drawEmblem(ctx, px + 170, py + 250, 360, BRAND_BLUE);
  }
  // Dégradé bas + identité.
  const fade = ctx.createLinearGradient(0, py + ph * 0.55, 0, py + ph);
  fade.addColorStop(0, 'rgba(11,31,58,0)');
  fade.addColorStop(1, 'rgba(11,31,58,0.95)');
  ctx.fillStyle = fade;
  ctx.fillRect(px, py, pw, ph);
  ctx.restore();
  ctx.strokeStyle = BRAND_BLUE;
  ctx.lineWidth = 6;
  roundRect(ctx, px, py, pw, ph, 36);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 64px Inter, Arial, sans-serif';
  ctx.fillText('Lucas Schuermann', px + 44, py + ph - 110);
  ctx.fillStyle = '#9cc8fb';
  ctx.font = '600 36px Inter, Arial, sans-serif';
  ctx.fillText('Founder & CEO, Variational', px + 44, py + ph - 60);
  if (photos.length) {
    const idx = Math.floor(time / PHOTO_SECONDS) % photos.length;
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '500 22px Inter, Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(photos[idx].credit, px + pw - 30, py + 44);
    ctx.textAlign = 'left';
  }

  /* --- Colonne de droite --- */
  const rx = 880;
  drawLogo(ctx, rx, 110, 70, { emblem: BRAND_BLUE, text: '#ffffff' });

  const pulse = 0.5 + 0.5 * Math.sin(time * 4);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  roundRect(ctx, rx, 230, 400, 76, 38);
  ctx.fill();
  ctx.fillStyle = `rgba(239, 68, 68, ${0.55 + pulse * 0.45})`;
  ctx.beginPath();
  ctx.arc(rx + 46, 268, 13 + pulse * 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 34px Inter, Arial, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('KEYNOTE · LIVE', rx + 80, 270);
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 96px Inter, Arial, sans-serif';
  ctx.fillText('Variational', rx, 430);
  ctx.fillText('Summit 2026', rx, 530);
  ctx.fillStyle = '#9cc8fb';
  ctx.font = '700 40px Inter, Arial, sans-serif';
  ctx.fillText('RFQ · 0% fees · 575+ markets · RWA', rx + 2, 600);

  // Vignette « Up next ».
  const slide = Math.floor(time / SLIDE_SECONDS) % CLIP_IDS.length;
  const progress = (time % SLIDE_SECONDS) / SLIDE_SECONDS;
  const clip = VIDEOS[CLIP_IDS[slide]];
  const cardX = rx;
  const cardY = 660;
  const cardW = 920;
  const cardH = 210;
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, cardX, cardY, cardW, cardH, 26);
  ctx.fill();
  ctx.fillStyle = BRAND_BLUE;
  roundRect(ctx, cardX, cardY, 12, cardH, 6);
  ctx.fill();
  ctx.fillStyle = '#64748b';
  ctx.font = '700 26px Inter, Arial, sans-serif';
  ctx.fillText(`UP NEXT · ${slide + 1}/${CLIP_IDS.length} · ${clip.show.toUpperCase()}`, cardX + 44, cardY + 54);
  ctx.fillStyle = '#0b1f3a';
  ctx.font = '700 42px Inter, Arial, sans-serif';
  ctx.textBaseline = 'top';
  wrapText(ctx, clip.title.en, cardX + 44, cardY + 76, cardW - 220, 50, 2);
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#e2e8f0';
  roundRect(ctx, cardX + 44, cardY + cardH - 26, cardW - 88, 8, 4);
  ctx.fill();
  ctx.fillStyle = BRAND_BLUE;
  roundRect(ctx, cardX + 44, cardY + cardH - 26, (cardW - 88) * progress, 8, 4);
  ctx.fill();

  // Horloge locale.
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  ctx.fillStyle = '#0b1f3a';
  ctx.font = '800 64px Inter, Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`${hh}:${mm}`, cardX + cardW - 36, cardY + 96);
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '600 28px Inter, Arial, sans-serif';
  ctx.fillText('Main Stage · Hall A', rx, 940);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function SummitBanner() {
  const { texture, ctx } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = BANNER_W;
    canvas.height = BANNER_H;
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 8;
    return { texture: tex, ctx: canvas.getContext('2d') };
  }, []);
  const lastDraw = useRef(-1);
  const photos = useRef<LoadedPhoto[]>([]);

  useEffect(() => () => texture.dispose(), [texture]);

  // Chargement des photos réelles (CORS) ; en cas d'échec, l'emblème reste affiché.
  useEffect(() => {
    let cancelled = false;
    SPEAKER_PHOTOS.forEach(({ youtubeId, credit }) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (!cancelled) photos.current = [...photos.current, { img, credit }];
      };
      img.src = `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // ~10 rafraîchissements/s suffisent pour l'animation et restent légers.
    if (!ctx || t - lastDraw.current < 0.1) return;
    lastDraw.current = t;
    drawBanner(ctx, t, photos.current);
    texture.needsUpdate = true;
  });

  return (
    <mesh position={[0, 0, 0.01]}>
      <planeGeometry args={[STAGE.screenWidth, STAGE.screenHeight]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Écran « en direct » pendant la diffusion d'une vidéo                 */
/* ------------------------------------------------------------------ */

/**
 * La vidéo elle-même est lue dans le lecteur 2D (StagePlayer) : un iframe YouTube intégré à la
 * scène 3D reste noir sur une partie des navigateurs. L'écran montre la vignette officielle
 * de la vidéo, un bandeau LIVE animé et le titre.
 */
function drawNowPlaying(ctx: CanvasRenderingContext2D, time: number, clip: VideoClip, thumb: HTMLImageElement | null) {
  const W = BANNER_W;
  const H = BANNER_H;
  ctx.fillStyle = '#0b1f3a';
  ctx.fillRect(0, 0, W, H);
  if (thumb) {
    // Léger zoom lent façon « Ken Burns » pour que l'écran vive.
    const zoom = 1.04 + Math.sin(time * 0.15) * 0.04;
    const zw = W * zoom;
    const zh = H * zoom;
    drawCover(ctx, thumb, (W - zw) / 2, (H - zh) / 2, zw, zh, 'center');
  } else {
    drawEmblem(ctx, W / 2 - 260, H / 2 - 300, 520, BRAND_BLUE);
  }

  // Dégradé bas pour la lisibilité du titre.
  const fade = ctx.createLinearGradient(0, H * 0.45, 0, H);
  fade.addColorStop(0, 'rgba(11,31,58,0)');
  fade.addColorStop(1, 'rgba(11,31,58,0.95)');
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, W, H);

  // Pastille LIVE.
  const pulse = 0.5 + 0.5 * Math.sin(time * 4);
  ctx.fillStyle = 'rgba(11,31,58,0.8)';
  roundRect(ctx, 60, 60, 420, 84, 42);
  ctx.fill();
  ctx.fillStyle = `rgba(239, 68, 68, ${0.55 + pulse * 0.45})`;
  ctx.beginPath();
  ctx.arc(110, 102, 15 + pulse * 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 38px Inter, Arial, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('LIVE · ON STAGE', 148, 104);
  ctx.textBaseline = 'alphabetic';
  drawLogo(ctx, W - 520, 70, 64, { emblem: BRAND_BLUE, text: '#ffffff' });

  // Égaliseur animé.
  const barsX = 80;
  for (let i = 0; i < 5; i++) {
    const h = 30 + (0.5 + 0.5 * Math.sin(time * 6 + i * 1.3)) * 60;
    ctx.fillStyle = BRAND_BLUE;
    roundRect(ctx, barsX + i * 26, 830 - h, 16, h, 8);
    ctx.fill();
  }

  ctx.fillStyle = '#9cc8fb';
  ctx.font = '700 40px Inter, Arial, sans-serif';
  ctx.fillText(clip.show.toUpperCase(), barsX + 160, 826);
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 64px Inter, Arial, sans-serif';
  ctx.textBaseline = 'top';
  wrapText(ctx, clip.title.en, barsX, 870, W - 160, 76, 2);
  ctx.textBaseline = 'alphabetic';
}

function NowPlaying({ clip }: { clip: VideoClip }) {
  const { texture, ctx } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = BANNER_W;
    canvas.height = BANNER_H;
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 8;
    return { texture: tex, ctx: canvas.getContext('2d') };
  }, []);
  const lastDraw = useRef(-1);
  const thumb = useRef<HTMLImageElement | null>(null);

  useEffect(() => () => texture.dispose(), [texture]);

  // Vignette officielle (CORS) ; maxresdefault n'existe pas toujours, d'où le repli sur hqdefault.
  useEffect(() => {
    let cancelled = false;
    const load = (quality: string, fallback?: string) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // YouTube renvoie une image grise 120 px quand la résolution demandée n'existe pas.
        if (img.naturalWidth <= 120 && fallback) load(fallback);
        else if (!cancelled) thumb.current = img;
      };
      img.onerror = () => {
        if (fallback) load(fallback);
      };
      img.src = `https://i.ytimg.com/vi/${clip.youtubeId}/${quality}.jpg`;
    };
    load('maxresdefault', 'hqdefault');
    return () => {
      cancelled = true;
    };
  }, [clip.youtubeId]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!ctx || t - lastDraw.current < 0.1) return;
    lastDraw.current = t;
    drawNowPlaying(ctx, t, clip, thumb.current);
    texture.needsUpdate = true;
  });

  return (
    <mesh position={[0, 0, 0.01]}>
      <planeGeometry args={[STAGE.screenWidth, STAGE.screenHeight]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */

function StageScreen() {
  const videoId = useWorld((s) => s.stageVideoId);
  const clip = videoId ? VIDEOS[videoId] : undefined;
  const z = BACK_Z + 0.45;

  return (
    <group position={[0, STAGE.screenY, z]}>
      {/* Cadre de l'écran */}
      <mesh position={[0, 0, -0.12]} castShadow>
        <boxGeometry args={[STAGE.screenWidth + 0.5, STAGE.screenHeight + 0.5, 0.18]} />
        <meshStandardMaterial color="#111827" roughness={0.4} metalness={0.3} />
      </mesh>
      {clip ? <NowPlaying key={clip.id} clip={clip} /> : <SummitBanner />}
      <Text
        font={FONT_SEMI}
        position={[0, -STAGE.screenHeight / 2 - 0.65, -0.02]}
        fontSize={0.42}
        color="#475569"
        anchorX="center"
        anchorY="middle"
      >
        {clip ? `${clip.show} · ${clip.title.en}` : 'Variational Summit · Main Stage'}
      </Text>
    </group>
  );
}

function LoungeChair({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.5, 0.85]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.85, -0.38]} rotation={[-0.08, 0, 0]} castShadow>
        <boxGeometry args={[0.9, 0.8, 0.14]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.85} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.48, 0.6, 0]} castShadow>
          <boxGeometry args={[0.1, 0.22, 0.85]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.4} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

/** Pied de micro orienté vers -Z local (vers l'intervenant), tête à hauteur de bouche assise. */
function MicStand({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.03, 20]} />
        <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 1.2, 8]} />
        <meshStandardMaterial color="#4b5563" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Perche inclinée */}
      <mesh position={[0, 1.24, -0.12]} rotation={[-1.1, 0, 0]} castShadow>
        <cylinderGeometry args={[0.009, 0.009, 0.3, 6]} />
        <meshStandardMaterial color="#4b5563" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.3, -0.27]} rotation={[-1.2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.028, 0.1, 4, 8]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
    </group>
  );
}

function Lectern({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, -0.25, 0]}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 1.1, 0.6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.13, 0.05]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[1, 0.06, 0.7]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      <mesh position={[0, 0.65, 0.302]}>
        <planeGeometry args={[0.8, 0.34]} />
        <meshStandardMaterial color={BRAND.dark} />
      </mesh>
      <LogoPlane variant="onDark" width={0.68} position={[0, 0.65, 0.306]} />
      <mesh position={[0.2, 1.35, 0.15]} rotation={[0.6, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.4, 6]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Intervenants assis (conférence en direct)                            */
/* ------------------------------------------------------------------ */

interface Speaker {
  name: string;
  role: string;
  x: number;
  z: number;
  rotY: number;
  look: Pick<PersonSpec, 'shirt' | 'skin' | 'pants' | 'hair'>;
  talking: boolean;
}

const SPEAKERS: Speaker[] = [
  {
    name: 'Host',
    role: 'Interviewer',
    x: -3.4,
    z: STAGE.z - 0.6,
    rotY: 0.55,
    look: { shirt: '#e7dccb', skin: '#e0ac86', pants: '#1f2937', hair: '#1c1917' },
    talking: false,
  },
  {
    name: 'Lucas Schuermann',
    role: 'CEO · Variational',
    x: 0,
    z: STAGE.z - 1.1,
    rotY: 0,
    look: { shirt: '#1f2a44', skin: '#f2d0b5', pants: '#111827', hair: '#3b2416' },
    talking: true,
  },
  {
    name: 'Guest Speaker',
    role: 'Panelist',
    x: 3.4,
    z: STAGE.z - 0.6,
    rotY: -0.55,
    look: { shirt: '#dbe4f0', skin: '#8d5a3b', pants: '#334155', hair: '#292524' },
    talking: false,
  },
];

function Speakers() {
  return (
    <group>
      {SPEAKERS.map((s, i) => {
        const spec: PersonSpec = { position: [s.x, TOP, s.z], rotY: s.rotY, pose: 'sit', ...s.look };
        // Micro posé devant l'intervenant, tourné vers lui.
        const micX = s.x + Math.sin(s.rotY) * 0.62;
        const micZ = s.z + Math.cos(s.rotY) * 0.62;
        // Carton nominatif au bord de l'estrade.
        const plateX = s.x + Math.sin(s.rotY) * 1.6;
        return (
          <group key={s.name}>
            <LoungeChair position={[s.x, TOP, s.z]} rotationY={s.rotY} />
            <Person spec={spec} animated gesture={s.talking} phase={i * 1.7} />
            <MicStand position={[micX, TOP, micZ]} rotationY={s.rotY} />
            <group position={[plateX, TOP, FRONT_Z - 0.55]}>
              <mesh position={[0, 0.2, 0]} castShadow>
                <boxGeometry args={[1.9, 0.4, 0.06]} />
                <meshStandardMaterial color="#ffffff" roughness={0.4} />
              </mesh>
              <mesh position={[0, 0.02, 0]}>
                <boxGeometry args={[1.9, 0.04, 0.3]} />
                <meshStandardMaterial color="#cbd5e1" />
              </mesh>
              <Text font={FONT_BOLD} position={[0, 0.26, 0.035]} fontSize={0.13} color="#0b1f3a" anchorX="center" anchorY="middle">
                {s.name}
              </Text>
              <Text font={FONT_REGULAR} position={[0, 0.11, 0.035]} fontSize={0.085} color="#1f6bd1" anchorX="center" anchorY="middle">
                {s.role}
              </Text>
            </group>
          </group>
        );
      })}
      {/* Tables basses avec verres d'eau */}
      {[-1.75, 1.75].map((x) => (
        <group key={`table-${x}`} position={[x, TOP, STAGE.z - 0.5]}>
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.5, 24]} />
            <meshStandardMaterial color="#cbd5e1" />
          </mesh>
          <mesh position={[0.08, 0.56, 0]}>
            <cylinderGeometry args={[0.04, 0.035, 0.12, 12]} />
            <meshStandardMaterial color="#e0f2fe" transparent opacity={0.7} roughness={0.05} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Stage() {
  const kiosk = interactivePoint('stage');

  return (
    <group>
      {/* Estrade */}
      <mesh position={[STAGE.x, TOP / 2, STAGE.z]} castShadow receiveShadow>
        <boxGeometry args={[STAGE.width, TOP, STAGE.depth]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      {/* Tapis de scène */}
      <mesh position={[0, TOP + 0.005, STAGE.z - 0.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5.2, 64]} />
        <meshStandardMaterial color="#e3edfb" roughness={0.95} />
      </mesh>
      {/* Liseré lumineux en façade */}
      <mesh position={[STAGE.x, TOP - 0.12, FRONT_Z + 0.01]}>
        <planeGeometry args={[STAGE.width, 0.06]} />
        <meshBasicMaterial color={BRAND.primary} toneMapped={false} />
      </mesh>
      <LogoPlane variant="onLight" width={3.2} position={[0, TOP / 2, FRONT_Z + 0.012]} />
      {/* Marches latérales (décor) */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * (STAGE.width / 2 + 0.9), 0, FRONT_Z - 2]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[-s * i * 0.4, (i + 1) * 0.2, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.8 - i * 0.4 + 0.4, (i + 1) * 0.4, 2]} />
              <meshStandardMaterial color="#f3f4f6" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Mur de fond de scène */}
      <mesh position={[0, 7, BACK_Z + 0.15]} receiveShadow>
        <boxGeometry args={[STAGE.width + 6, 14, 0.3]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} />
      </mesh>
      {/* Kakemonos de scène bleus avec logo */}
      {[-1, 1].map((s) => (
        <group key={`fin-${s}`} position={[s * (STAGE.screenWidth / 2 + 2.6), 6.5, BACK_Z + 0.4]}>
          <mesh castShadow>
            <boxGeometry args={[2.2, 10, 0.12]} />
            <meshStandardMaterial color={BRAND.dark} roughness={0.6} />
          </mesh>
          <LogoPlane variant="onDark" width={1.8} position={[0, 3.6, 0.07]} />
          <Text font={FONT_BOLD} position={[0, 0.4, 0.07]} fontSize={0.34} maxWidth={1.8} textAlign="center" lineHeight={1.2} color="#ffffff" anchorX="center" anchorY="middle">
            {s < 0 ? 'RFQ\nOMNI\nPRO' : 'SUMMIT\n2026'}
          </Text>
          <mesh position={[0, -4.2, 0.07]}>
            <planeGeometry args={[2.2, 0.12]} />
            <meshBasicMaterial color={BRAND_BLUE} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* Bannière principale : logo officiel au-dessus de l'écran */}
      {/* Le logo tient entre le haut de l'écran (12,65 m avec cadre) et le plafond (14 m). */}
      <LogoPlane
        variant="onLight"
        width={6}
        position={[0, STAGE.screenY + STAGE.screenHeight / 2 + 0.75, BACK_Z + 0.32]}
      />

      <StageScreen />

      {/* Plateau : intervenants, fauteuils, micros, pupitre */}
      <Speakers />
      <Lectern position={[9, TOP, STAGE.z + 2.5]} />

      {/* Borne « programme » de la scène */}
      <Kiosk
        id="stage"
        accent={CONTENT.stage.accent}
        label="Main Stage · Videos"
        position={[kiosk.x, 0, kiosk.z]}
        rotationY={-0.4}
      />

      {/* Collisions de la scène */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[STAGE.width / 2, TOP / 2 + 1, STAGE.depth / 2]} position={[STAGE.x, TOP / 2 + 1, STAGE.z]} />
        {[-1, 1].map((s) => (
          <CuboidCollider
            key={s}
            args={[1.1, 1, 1]}
            position={[s * (STAGE.width / 2 + 0.9), 1, FRONT_Z - 2]}
          />
        ))}
        <CuboidCollider args={[STAGE.width / 2 + 3, 7, 0.3]} position={[0, 7, BACK_Z + 0.15]} />
      </RigidBody>
    </group>
  );
}

'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { CanvasTexture, SRGBColorSpace } from 'three';
import { BRAND_BLUE } from '@/lib/brand';
import { CONTENT, VIDEOS, youtubeEmbedUrl } from '@/lib/content';
import { BRAND, interactivePoint, STAGE } from '@/lib/layout';
import { useWorld } from '@/lib/store';
import { drawEmblem, drawLogo, wrapText } from './brandTextures';
import { FONT_BOLD, FONT_REGULAR, FONT_SEMI } from './Hall';
import { Kiosk } from './Kiosk';
import { LogoPlane } from './Logo';
import { Person, type PersonSpec } from './people';

/** Résolution CSS de l'iframe ; convertie en unités 3D via `distanceFactor`. */
const SCREEN_PX_W = 1280;
const SCREEN_PX_H = 720;
// En mode `transform`, drei applique 1 px CSS = distanceFactor / 400 unités.
const SCREEN_DISTANCE_FACTOR = (STAGE.screenWidth * 400) / SCREEN_PX_W;

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

function drawBanner(ctx: CanvasRenderingContext2D, time: number) {
  const W = BANNER_W;
  const H = BANNER_H;

  // Fond clair avec dégradé bleu de marque.
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#ffffff');
  bg.addColorStop(0.55, '#eef5ff');
  bg.addColorStop(1, '#d6e8fe');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Grand emblème filigrane qui « respire » légèrement.
  ctx.save();
  ctx.globalAlpha = 0.1 + Math.sin(time * 0.6) * 0.02;
  drawEmblem(ctx, 1080, 140 + Math.sin(time * 0.4) * 10, 760, BRAND_BLUE);
  ctx.restore();

  // Vagues décoratives en bas.
  ctx.save();
  ctx.strokeStyle = BRAND_BLUE;
  for (let k = 0; k < 3; k++) {
    ctx.globalAlpha = 0.18 - k * 0.04;
    ctx.lineWidth = 6 - k;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 16) {
      const y = 930 + k * 34 + Math.sin(x / 210 + time * 0.8 + k) * 22;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();

  // Logo officiel.
  drawLogo(ctx, 110, 96, 84, { emblem: BRAND_BLUE, text: '#0b1f3a' });

  // Pastille « LIVE » animée.
  const pulse = 0.5 + 0.5 * Math.sin(time * 4);
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#dbe7f7';
  ctx.lineWidth = 3;
  roundRect(ctx, 1450, 96, 360, 84, 42);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = `rgba(239, 68, 68, ${0.55 + pulse * 0.45})`;
  ctx.beginPath();
  ctx.arc(1500, 138, 14 + pulse * 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0b1f3a';
  ctx.font = '800 38px Inter, Arial, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('LIVE · ON STAGE', 1532, 140);

  // Titre principal.
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#0b1f3a';
  ctx.font = '800 132px Inter, Arial, sans-serif';
  ctx.fillText('Variational Summit', 110, 400);
  ctx.fillStyle = '#1f6bd1';
  ctx.font = '700 52px Inter, Arial, sans-serif';
  ctx.fillText('Onchain brokerage · RFQ · 0% fees · Arbitrum', 112, 480);
  ctx.fillStyle = '#334155';
  ctx.font = '400 44px Inter, Arial, sans-serif';
  ctx.fillText('Fireside chat with Lucas Schuermann, CEO of Variational', 112, 560);

  // Vignette dynamique « Up next » qui fait défiler les extraits.
  const slide = Math.floor(time / SLIDE_SECONDS) % CLIP_IDS.length;
  const progress = (time % SLIDE_SECONDS) / SLIDE_SECONDS;
  const clip = VIDEOS[CLIP_IDS[slide]];
  const cardX = 110;
  const cardY = 640;
  const cardW = 1080;
  const cardH = 230;
  ctx.save();
  ctx.shadowColor = 'rgba(15, 23, 42, 0.12)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = BRAND_BLUE;
  roundRect(ctx, cardX, cardY, 14, cardH, 7);
  ctx.fill();
  ctx.fillStyle = '#64748b';
  ctx.font = '700 30px Inter, Arial, sans-serif';
  ctx.fillText(`UP NEXT · ${slide + 1}/${CLIP_IDS.length} · ${clip.show.toUpperCase()}`, cardX + 50, cardY + 62);
  ctx.fillStyle = '#0b1f3a';
  ctx.font = '700 48px Inter, Arial, sans-serif';
  ctx.textBaseline = 'top';
  wrapText(ctx, clip.title.en, cardX + 50, cardY + 90, cardW - 100, 58, 2);
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#e2e8f0';
  roundRect(ctx, cardX + 50, cardY + cardH - 30, cardW - 100, 8, 4);
  ctx.fill();
  ctx.fillStyle = BRAND_BLUE;
  roundRect(ctx, cardX + 50, cardY + cardH - 30, (cardW - 100) * progress, 8, 4);
  ctx.fill();

  // Horloge locale.
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  ctx.fillStyle = '#0b1f3a';
  ctx.font = '800 96px Inter, Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`${hh}:${mm}`, 1810, 760);
  ctx.fillStyle = '#64748b';
  ctx.font = '600 34px Inter, Arial, sans-serif';
  ctx.fillText('Main Stage · Hall A', 1810, 820);
  ctx.textAlign = 'left';
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

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // ~10 rafraîchissements/s suffisent pour l'animation et restent légers.
    if (!ctx || t - lastDraw.current < 0.1) return;
    lastDraw.current = t;
    drawBanner(ctx, t);
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
      {clip ? (
        <Html
          transform
          occlude="blending"
          distanceFactor={SCREEN_DISTANCE_FACTOR}
          zIndexRange={[20, 0]}
          position={[0, 0, 0.01]}
          style={{ width: SCREEN_PX_W, height: SCREEN_PX_H, background: '#000' }}
        >
          <iframe
            key={clip.id}
            title={clip.title.en}
            width={SCREEN_PX_W}
            height={SCREEN_PX_H}
            src={youtubeEmbedUrl(clip, { autoplay: true, mute: true })}
            allow="autoplay; encrypted-media; picture-in-picture"
            style={{ border: 0, display: 'block' }}
          />
        </Html>
      ) : (
        <SummitBanner />
      )}
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

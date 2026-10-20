'use client';

import { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';
import { BRAND, METRICS_STAND, STAGE, seededRandom } from '@/lib/layout';
import { FONT_BOLD, FONT_SEMI } from './Hall';
import { LogoPlane } from './Logo';

/* Habillage du sol : allée centrale en moquette, médaillon d'accueil et balisage vers les stands. */

const CARPET_COLOR = '#ffffff';
const CARPET_HALF_W = 2;
const CARPET_START_Z = STAGE.z + STAGE.depth / 2;
const CARPET_END_Z = 38;
const HALO_RADIUS = METRICS_STAND.radius + 1.4;
const MEDALLION = { z: 27.5, radius: 2.8 } as const;

/** Branches de balisage : départ au bord de l'allée, direction ±X, longueur jusqu'au stand. */
const BRANCHES: { label: string; z: number; dir: 1 | -1; length: number }[] = [
  { label: 'RFQ', z: 16.5, dir: -1, length: 20.5 },
  { label: 'OMNI', z: 16.5, dir: 1, length: 20.5 },
  { label: 'PRO', z: -1.5, dir: -1, length: 20.5 },
  { label: 'SWAPS', z: -1.5, dir: 1, length: 20.5 },
  { label: 'TOKENOMICS', z: -26.5, dir: -1, length: 16 },
  { label: 'VISION', z: -26.5, dir: 1, length: 16 },
];

function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) draw(ctx);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
}

/** Moquette bleu nuit : fibres fines aléatoires sur fond uni (1 tuile = 2 m). */
function useCarpetTexture() {
  return useMemo(() => {
    const rand = seededRandom(7);
    const t = canvasTexture(256, 256, (ctx) => {
      ctx.fillStyle = '#16325c';
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 2600; i++) {
        const light = rand() > 0.5;
        ctx.fillStyle = light ? 'rgba(120, 160, 220, 0.16)' : 'rgba(4, 14, 32, 0.22)';
        ctx.fillRect(rand() * 256, rand() * 256, 1 + rand() * 2, 1);
      }
    });
    t.repeat.set(CARPET_HALF_W, (CARPET_END_Z - CARPET_START_Z) / 2);
    return t;
  }, []);
}

/** Chevrons de balisage pointant vers le haut de la texture (sens de la marche). */
function useChevronTexture() {
  return useMemo(
    () =>
      canvasTexture(128, 128, (ctx) => {
        ctx.clearRect(0, 0, 128, 128);
        ctx.strokeStyle = BRAND.primary;
        ctx.lineWidth = 16;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(28, 84);
        ctx.lineTo(64, 44);
        ctx.lineTo(100, 84);
        ctx.stroke();
      }),
    [],
  );
}

function BlueLine({ x, z0, z1, width = 0.1 }: { x: number; z0: number; z1: number; width?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.009, (z0 + z1) / 2]}>
      <planeGeometry args={[width, z1 - z0]} />
      <meshBasicMaterial color={BRAND.primary} toneMapped={false} polygonOffset polygonOffsetFactor={-2} />
    </mesh>
  );
}

function Aisle() {
  const carpet = useCarpetTexture();
  const haloCarpet = useMemo(() => {
    const t = carpet.clone();
    t.repeat.set(HALO_RADIUS, HALO_RADIUS);
    t.needsUpdate = true;
    return t;
  }, [carpet]);
  const length = CARPET_END_Z - CARPET_START_Z;
  // Liserés interrompus par le halo du stand Metrics et par le médaillon.
  const segments: [number, number][] = [
    [CARPET_START_Z, METRICS_STAND.z - HALO_RADIUS],
    [METRICS_STAND.z + HALO_RADIUS, MEDALLION.z - MEDALLION.radius],
    [MEDALLION.z + MEDALLION.radius, CARPET_END_Z],
  ];
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, CARPET_START_Z + length / 2]} receiveShadow>
        <planeGeometry args={[CARPET_HALF_W * 2, length]} />
        <meshStandardMaterial map={carpet} color={CARPET_COLOR} roughness={1} />
      </mesh>
      {segments.map(([z0, z1]) =>
        [-1, 1].map((s) => <BlueLine key={`${z0}-${s}`} x={s * (CARPET_HALF_W - 0.25)} z0={z0} z1={z1} />),
      )}

      {/* Halo de moquette autour de l'îlot Metrics */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[METRICS_STAND.x, 0.007, METRICS_STAND.z]} receiveShadow>
        <circleGeometry args={[HALO_RADIUS, 96]} />
        <meshStandardMaterial map={haloCarpet} color={CARPET_COLOR} roughness={1} polygonOffset polygonOffsetFactor={-1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[METRICS_STAND.x, 0.009, METRICS_STAND.z]}>
        <ringGeometry args={[HALO_RADIUS - 0.3, HALO_RADIUS - 0.18, 128]} />
        <meshBasicMaterial color={BRAND.primary} toneMapped={false} polygonOffset polygonOffsetFactor={-2} />
      </mesh>
    </group>
  );
}

/** Médaillon d'accueil incrusté dans l'allée, face au point d'apparition. */
function Medallion() {
  const r = MEDALLION.radius;
  return (
    <group position={[0, 0, MEDALLION.z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]} receiveShadow>
        <circleGeometry args={[r, 96]} />
        <meshStandardMaterial color={BRAND.dark} roughness={0.5} metalness={0.2} polygonOffset polygonOffsetFactor={-1} />
      </mesh>
      {[
        [r - 0.14, r],
        [r - 0.42, r - 0.36],
      ].map(([a, b]) => (
        <mesh key={a} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[a, b, 128]} />
          <meshBasicMaterial color={BRAND.primary} toneMapped={false} polygonOffset polygonOffsetFactor={-2} />
        </mesh>
      ))}
      <LogoPlane variant="onDark" width={3.4} position={[0, 0.012, -0.25]} rotation={[-Math.PI / 2, 0, 0]} />
      <Text
        font={FONT_SEMI}
        position={[0, 0.02, 0.9]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.24}
        letterSpacing={0.18}
        color="#cfe3fd"
        anchorX="center"
        anchorY="middle"
      >
        WELCOME · BIENVENUE
      </Text>
    </group>
  );
}

/** Bande de chevrons + nom du stand, posée depuis le bord de l'allée vers le stand. */
function Wayfinding() {
  const chevrons = useChevronTexture();
  const strips = useMemo(
    () =>
      BRANCHES.map((b) => {
        const t = chevrons.clone();
        t.repeat.set(1, (b.length - 2.4) / 1.1);
        t.needsUpdate = true;
        return t;
      }),
    [chevrons],
  );

  return (
    <group>
      {BRANCHES.map((b, i) => {
        const run = b.length - 2.4;
        return (
          // Dans ce groupe, -Z local = sens de la marche vers le stand.
          <group key={b.label} position={[b.dir * CARPET_HALF_W, 0, b.z]} rotation={[0, -b.dir * (Math.PI / 2), 0]}>
            <Text
              font={FONT_BOLD}
              position={[0, 0.02, -1.1]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.42}
              letterSpacing={0.12}
              color={BRAND.primary}
              anchorX="center"
              anchorY="middle"
            >
              {b.label}
            </Text>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -2.4 - run / 2]}>
              <planeGeometry args={[0.7, run]} />
              <meshStandardMaterial
                map={strips[i]}
                emissive={BRAND.primary}
                emissiveMap={strips[i]}
                emissiveIntensity={0.7}
                transparent
                opacity={0.95}
                depthWrite={false}
                polygonOffset
                polygonOffsetFactor={-2}
              />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={s} rotation={[-Math.PI / 2, 0, 0]} position={[s * 0.5, 0.009, -2.4 - run / 2]}>
                <planeGeometry args={[0.04, run]} />
                <meshBasicMaterial color={BRAND.primary} transparent opacity={0.5} polygonOffset polygonOffsetFactor={-2} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

export function FloorDecor() {
  return (
    <group>
      <Aisle />
      <Medallion />
      <Wayfinding />
    </group>
  );
}

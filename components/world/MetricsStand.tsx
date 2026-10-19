'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier';
import { BackSide, CanvasTexture, Group, Mesh, RepeatWrapping, SRGBColorSpace } from 'three';
import { CONTENT } from '@/lib/content';
import { BRAND, interactivePoint, METRICS_STAND } from '@/lib/layout';
import type { MetricsData } from '@/lib/metrics';
import { useWorld } from '@/lib/store';
import { FONT_BOLD } from './Hall';
import { interactiveHandlers, Kiosk } from './Kiosk';
import { LogoPlane } from './Logo';
import { drawKpiScreen, drawOiScreen, drawRwaScreen, drawTicker, drawTopScreen, SCREEN_H, SCREEN_W } from './metricsTextures';
import { Person, type PersonSpec } from './people';

type ScreenDraw = (ctx: CanvasRenderingContext2D, m: MetricsData, live: boolean, pulse: number) => void;

const TOWER = 1.7;
const SCREEN_HEIGHT = 2.5;
const SCREEN_WIDTH = (SCREEN_HEIGHT * SCREEN_W) / SCREEN_H;

/** Écran vertical dont la texture canvas suit les métriques du store. */
function MetricScreen({ draw, rotationY }: { draw: ScreenDraw; rotationY: number }) {
  const { texture, ctx } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = SCREEN_W;
    canvas.height = SCREEN_H;
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 8;
    return { texture: tex, ctx: canvas.getContext('2d') };
  }, []);
  const last = useRef(-1);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // 4 rafraîchissements/s : suffisant pour la pastille LIVE et les nouvelles données.
    if (!ctx || t - last.current < 0.25) return;
    last.current = t;
    const { metrics, metricsStatus } = useWorld.getState();
    draw(ctx, metrics, metricsStatus === 'live', 0.5 + 0.5 * Math.sin(t * 4));
    texture.needsUpdate = true;
  });

  const d = TOWER / 2 + 0.03;
  return (
    <group rotation={[0, rotationY, 0]}>
      <mesh position={[0, 2.65, d - 0.02]}>
        <boxGeometry args={[SCREEN_WIDTH + 0.12, SCREEN_HEIGHT + 0.12, 0.04]} />
        <meshStandardMaterial color="#111827" roughness={0.3} />
      </mesh>
      <mesh position={[0, 2.65, d + 0.002]}>
        <planeGeometry args={[SCREEN_WIDTH, SCREEN_HEIGHT]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Anneau-ticker défilant au sommet de la tour. */
function TickerRing() {
  const ring = useRef<Mesh>(null);
  const { texture, ctx, canvas } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 2048;
    c.height = 128;
    const tex = new CanvasTexture(c);
    tex.colorSpace = SRGBColorSpace;
    tex.wrapS = RepeatWrapping;
    tex.repeat.set(1, 1);
    return { texture: tex, ctx: c.getContext('2d'), canvas: c };
  }, []);
  const lastData = useRef<MetricsData | null>(null);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((_, dt) => {
    const m = useWorld.getState().metrics;
    if (ctx && m !== lastData.current) {
      lastData.current = m;
      drawTicker(ctx, m, canvas.width, canvas.height);
      texture.needsUpdate = true;
    }
    texture.offset.x = (texture.offset.x + dt * 0.03) % 1;
  });

  return (
    <group position={[0, 4.75, 0]}>
      <mesh ref={ring}>
        <cylinderGeometry args={[1.45, 1.45, 0.5, 64, 1, true]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[1.43, 1.43, 0.5, 64, 1, true]} />
        <meshStandardMaterial color="#0b1f3a" side={BackSide} />
      </mesh>
    </group>
  );
}

/** Sculpture de barres 3D : open interest des 12 dernières semaines, pousse au chargement. */
function OiBars({ position, rotationY }: { position: [number, number, number]; rotationY: number }) {
  const group = useRef<Group>(null);
  const grow = useRef(0);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    grow.current = Math.min(1, grow.current + dt * 0.5);
    const hist = useWorld.getState().metrics.openInterestHistory.slice(-12);
    const max = Math.max(...hist.map((h) => h[1]), 1);
    g.children.forEach((child, i) => {
      const v = hist[i]?.[1] ?? 0;
      const target = 0.25 + (v / max) * 1.9;
      const h = target * (0.15 + 0.85 * grow.current);
      child.scale.y = h;
      child.position.y = 0.14 + h / 2;
    });
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.07, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.3, 0.14, 0.5]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
      </mesh>
      <group ref={group}>
        {Array.from({ length: 12 }, (_, i) => (
          <mesh key={i} position={[-1.05 + i * 0.19, 0.6, 0]} castShadow>
            <boxGeometry args={[0.13, 1, 0.13]} />
            <meshStandardMaterial
              color={i === 11 ? BRAND.primary : '#9cc8fb'}
              emissive={i === 11 ? BRAND.primary : '#000000'}
              emissiveIntensity={i === 11 ? 0.25 : 0}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>
      <Text font={FONT_BOLD} position={[0, 0.07, 0.26]} rotation={[-0.3, 0, 0]} fontSize={0.09} color="#0b1f3a" anchorX="center" anchorY="middle">
        OPEN INTEREST · 12 WEEKS
      </Text>
    </group>
  );
}

/** Anneau 3D de répartition RWA / crypto du volume 24h. */
function RwaDonut({ position }: { position: [number, number, number] }) {
  const rwaRef = useRef<Mesh>(null);
  const cryptoRef = useRef<Mesh>(null);
  const spin = useRef<Group>(null);
  const share = useWorld((s) => s.metrics.rwaVolumeShare);
  const arcR = Math.max(0.05, share * Math.PI * 2 - 0.08);
  const arcC = Math.max(0.05, (1 - share) * Math.PI * 2 - 0.08);

  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.z += dt * 0.25;
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.12, 0.9, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.3} />
      </mesh>
      <group position={[0, 1.55, 0]} rotation={[0, 0.3, 0]}>
        <group ref={spin}>
          <mesh ref={rwaRef}>
            <torusGeometry args={[0.55, 0.14, 16, 64, arcR]} />
            <meshStandardMaterial color="#0f9488" roughness={0.35} />
          </mesh>
          <mesh ref={cryptoRef} rotation={[0, 0, share * Math.PI * 2]}>
            <torusGeometry args={[0.55, 0.14, 16, 64, arcC]} />
            <meshStandardMaterial color="#2f80ed" roughness={0.35} />
          </mesh>
        </group>
        <Text font={FONT_BOLD} position={[0, 0.05, 0]} fontSize={0.22} color="#0b1f3a" anchorX="center" anchorY="middle">
          {`${Math.round(share * 100)}%`}
        </Text>
        <Text font={FONT_BOLD} position={[0, -0.17, 0]} fontSize={0.08} color="#475569" anchorX="center" anchorY="middle">
          RWA VOLUME
        </Text>
      </group>
    </group>
  );
}

export function MetricsStand() {
  const { x, z, radius } = METRICS_STAND;
  const kiosk = interactivePoint('metrics');
  const handlers = interactiveHandlers('metrics');
  const accent = CONTENT.metrics.accent;

  const staff: PersonSpec[] = [
    { position: [-2.3, 0.12, 2.4], rotY: 0.6, pose: 'stand', shirt: BRAND.dark, skin: '#e0ac86', pants: '#1f2937', hair: '#1c1917' },
    { position: [2.3, 0.12, 2.4], rotY: -0.6, pose: 'stand', shirt: BRAND.dark, skin: '#c68863', pants: '#334155', hair: '#292524' },
  ];

  return (
    <group position={[x, 0, z]}>
      {/* Îlot circulaire */}
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <cylinderGeometry args={[radius, radius + 0.05, 0.12, 64]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.121, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.18, radius - 0.06, 96]} />
        <meshBasicMaterial color={BRAND.primary} toneMapped={false} />
      </mesh>

      {/* Tour centrale à 4 écrans live */}
      <group {...handlers}>
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[TOWER, 5, TOWER]} />
          <meshStandardMaterial color="#ffffff" roughness={0.45} />
        </mesh>
        <MetricScreen draw={drawKpiScreen} rotationY={0} />
        <MetricScreen draw={drawOiScreen} rotationY={Math.PI / 2} />
        <MetricScreen draw={drawTopScreen} rotationY={Math.PI} />
        <MetricScreen draw={drawRwaScreen} rotationY={-Math.PI / 2} />
        {/* Titre et logo sur chaque face, sous les écrans */}
        {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((r) => (
          <group key={r} rotation={[0, r, 0]}>
            <LogoPlane variant="onLight" width={1.2} position={[0, 0.95, TOWER / 2 + 0.01]} />
          </group>
        ))}
        <TickerRing />
        <mesh position={[0, 5.05, 0]}>
          <boxGeometry args={[TOWER + 0.1, 0.1, TOWER + 0.1]} />
          <meshStandardMaterial color={BRAND.dark} />
        </mesh>
      </group>

      {/* Sculptures de données */}
      <OiBars position={[-2.2, 0, -0.6]} rotationY={Math.PI / 2.6} />
      <OiBars position={[2.2, 0, -0.6]} rotationY={-Math.PI / 2.6} />
      <RwaDonut position={[0, 0.12, -2.6]} />

      {staff.map((s, i) => (
        <Person key={i} spec={s} logo phase={i * 2.3} />
      ))}

      <Kiosk id="metrics" accent={accent} label="Live Metrics & Volume" position={[kiosk.x - x, 0, kiosk.z - z]} />

      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[TOWER / 2 + 0.05, 2.6, TOWER / 2 + 0.05]} position={[0, 2.6, 0]} />
        <CylinderCollider args={[0.9, 1.25]} position={[-2.2, 0.9, -0.6]} />
        <CylinderCollider args={[0.9, 1.25]} position={[2.2, 0.9, -0.6]} />
        <CylinderCollider args={[1.1, 0.75]} position={[0, 1.1, -2.6]} />
        {staff.map((s, i) => (
          <CylinderCollider key={i} args={[0.9, 0.3]} position={[s.position[0], 1, s.position[2]]} />
        ))}
      </RigidBody>
    </group>
  );
}

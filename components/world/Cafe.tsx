'use client';

import { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier';
import { DoubleSide, ExtrudeGeometry, Shape, type Texture } from 'three';
import { BRAND, HALF_D, HALF_W } from '@/lib/layout';
import { getMarbleTexture, getMenuTexture, getParquetTexture, getWoodTexture } from './brandTextures';
import { BarStool, Plant } from './Decor';
import { FONT_BOLD } from './Hall';
import { LogoPlane } from './Logo';
import { Person } from './people';

/* Café chaleureux : comptoir arrondi bois + marbre, machine à espresso, vitrine, menu ardoise. */

type Vec3 = [number, number, number];

/** Centre de l'arc du comptoir (contre le mur gauche). */
export const CAFE = { cx: -HALF_W + 1.6, cz: HALF_D - 10.5, inner: 2.45, outer: 3.2, arc: (100 * Math.PI) / 180 } as const;

/** Tables du café : centre + 2 chaises (rotY regarde la table). */
export const CAFE_TABLES: { x: number; z: number }[] = [
  { x: -23.2, z: 28.6 },
  { x: -23.2, z: 34.4 },
];

/** Places assises des tables du café [x, z, rotY] (personnes assises générées par Crowd). */
export const CAFE_SEATS: [number, number, number][] = CAFE_TABLES.flatMap(({ x, z }) => [
  [x - 0.75, z, Math.PI / 2],
  [x + 0.75, z, -Math.PI / 2],
]);

/** Clients debout au comptoir [x, z, rotY]. */
export const CAFE_CUSTOMERS: [number, number, number][] = [-0.42, 0.42].map((a) => {
  const r = CAFE.outer + 0.95;
  const x = CAFE.cx + Math.cos(a) * r;
  const z = CAFE.cz + Math.sin(a) * r;
  return [x, z, Math.atan2(CAFE.cx - x, CAFE.cz - z)];
});

function withRepeat(tex: Texture, x: number, y: number) {
  const t = tex.clone();
  t.repeat.set(x, y);
  t.needsUpdate = true;
  return t;
}

/** Secteur d'anneau extrudé (comptoir courbe). Axe : centre de l'arc, ouverture vers +X. */
function useArcGeometry(inner: number, outer: number, arc: number, height: number) {
  return useMemo(() => {
    const shape = new Shape();
    const a0 = -arc / 2;
    const a1 = arc / 2;
    shape.absarc(0, 0, outer, a0, a1, false);
    shape.absarc(0, 0, inner, a1, a0, true);
    shape.closePath();
    const geo = new ExtrudeGeometry(shape, { depth: height, bevelEnabled: false, curveSegments: 48 });
    return geo;
  }, [inner, outer, arc, height]);
}

function Counter() {
  const body = useArcGeometry(CAFE.inner, CAFE.outer, CAFE.arc, 1.02);
  const top = useArcGeometry(CAFE.inner - 0.05, CAFE.outer + 0.1, CAFE.arc + 0.06, 0.06);
  const wood = useMemo(() => withRepeat(getWoodTexture(), 0.6, 0.25), []);
  const marble = useMemo(() => withRepeat(getMarbleTexture(), 0.3, 0.3), []);

  return (
    <group position={[CAFE.cx, 0, CAFE.cz]}>
      {/* Extrusion le long de +Z local → rotation pour monter le long de Y. */}
      <mesh geometry={body} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial map={wood} roughness={0.6} />
      </mesh>
      <mesh geometry={top} rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.02, 0]} castShadow receiveShadow>
        <meshStandardMaterial map={marble} roughness={0.15} metalness={0.05} />
      </mesh>
      {/* Plinthe lumineuse chaude sous le comptoir */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[CAFE.outer + 0.02, CAFE.outer + 0.08, 48, 1, -CAFE.arc / 2, CAFE.arc]} />
        <meshBasicMaterial color="#ffcf8f" toneMapped={false} side={DoubleSide} />
      </mesh>
      {/* Logo sur la façade courbe (face +X) */}
      <LogoPlane variant="onLight" width={1.6} position={[CAFE.outer + 0.012, 0.62, 0]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
}

function Cup({ position, color = '#ffffff' }: { position: Vec3; color?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.008, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.012, 20]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.042, 0.034, 0.075, 16]} />
        <meshStandardMaterial color={color} roughness={0.2} />
      </mesh>
      <mesh position={[0.046, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.018, 0.006, 6, 12]} />
        <meshStandardMaterial color={color} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.036, 16]} />
        <meshStandardMaterial color="#6f4a2e" roughness={0.4} />
      </mesh>
    </group>
  );
}

/** Machine à espresso deux groupes, face vers +X. */
function EspressoMachine({ position }: { position: Vec3 }) {
  const chrome = { color: '#d9dde3', metalness: 0.9, roughness: 0.18 };
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.55, 0.6, 1.0]} />
        <meshStandardMaterial {...chrome} />
      </mesh>
      {/* Façade bleu nuit avec logo */}
      <mesh position={[0.28, 0.42, 0]}>
        <boxGeometry args={[0.01, 0.26, 0.92]} />
        <meshStandardMaterial color={BRAND.dark} roughness={0.4} />
      </mesh>
      <LogoPlane variant="onDark" width={0.56} position={[0.29, 0.42, 0]} rotation={[0, Math.PI / 2, 0]} />
      {/* Manomètres */}
      {[-0.22, 0.22].map((z) => (
        <mesh key={z} position={[0.29, 0.5, z]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.035, 16]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      ))}
      {/* Groupes + porte-filtres */}
      {[-0.22, 0.22].map((z) => (
        <group key={`g${z}`} position={[0.33, 0.2, z]}>
          <mesh>
            <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} />
            <meshStandardMaterial {...chrome} />
          </mesh>
          <mesh position={[0.12, -0.03, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 0.2, 8]} />
            <meshStandardMaterial color="#3b2416" roughness={0.6} />
          </mesh>
          <Cup position={[0.02, -0.19, 0]} />
        </group>
      ))}
      {/* Grille d'égouttage */}
      <mesh position={[0.36, 0.005, 0]}>
        <boxGeometry args={[0.18, 0.02, 0.9]} />
        <meshStandardMaterial color="#4b5563" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Buse vapeur */}
      <mesh position={[0.36, 0.22, 0.45]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.008, 0.008, 0.3, 6]} />
        <meshStandardMaterial {...chrome} />
      </mesh>
      {/* Chauffe-tasses */}
      {[-0.3, -0.12, 0.06, 0.24].map((z) => (
        <Cup key={`t${z}`} position={[0, 0.6, z]} />
      ))}
    </group>
  );
}

function Grinder({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.22, 0.4, 0.22]} />
        <meshStandardMaterial color="#1f2937" metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <coneGeometry args={[0.13, 0.26, 20, 1, true]} />
        <meshStandardMaterial color="#5b3a22" transparent opacity={0.75} roughness={0.2} side={DoubleSide} />
      </mesh>
    </group>
  );
}

/** Vitrine à pâtisseries en verre. */
function PastryDisplay({ position, rotationY }: { position: Vec3; rotationY: number }) {
  const items: [number, number, string][] = [
    [-0.18, -0.08, '#d9a35b'],
    [0, 0.06, '#c98b43'],
    [0.18, -0.06, '#e2b56f'],
    [-0.05, -0.12, '#8b5a2b'],
  ];
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.6, 0.04, 0.42]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      {items.map(([x, z, c], i) => (
        <mesh key={i} position={[x, 0.08, z]} rotation={[Math.PI / 2, 0, i]} castShadow>
          <torusGeometry args={[0.055, 0.03, 8, 16]} />
          <meshStandardMaterial color={c} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.6, 0.32, 0.42]} />
        <meshStandardMaterial color="#e0f2fe" transparent opacity={0.18} roughness={0.05} metalness={0.1} depthWrite={false} />
      </mesh>
    </group>
  );
}

function CafeTable({ x, z, wood }: { x: number; z: number; wood: Texture }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.04, 32]} />
        <meshStandardMaterial map={wood} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.37, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.72, 10]} />
        <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.03, 24]} />
        <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.3} />
      </mesh>
      <Cup position={[0.12, 0.76, 0.05]} />
      <Cup position={[-0.14, 0.76, -0.06]} color={BRAND.primary} />
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.75, 0, 0]} rotation={[0, s > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.46, 0.05, 0.44]} />
            <meshStandardMaterial map={wood} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.72, -0.22]} rotation={[-0.12, 0, 0]} castShadow>
            <boxGeometry args={[0.46, 0.42, 0.04]} />
            <meshStandardMaterial map={wood} roughness={0.5} />
          </mesh>
          {[
            [-0.19, -0.18],
            [0.19, -0.18],
            [-0.19, 0.18],
            [0.19, 0.18],
          ].map(([lx, lz]) => (
            <mesh key={`${lx}${lz}`} position={[lx, 0.22, lz]}>
              <cylinderGeometry args={[0.015, 0.015, 0.44, 6]} />
              <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.3} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/** Suspension dôme métal noir avec ampoule chaude. */
function Pendant({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <mesh position={[0, (14 - position[1]) / 2, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 14 - position[1], 4]} />
        <meshBasicMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <coneGeometry args={[0.28, 0.3, 24, 1, true]} />
        <meshStandardMaterial color="#111827" metalness={0.6} roughness={0.35} side={DoubleSide} />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <sphereGeometry args={[0.09, 16, 12]} />
        <meshStandardMaterial color="#fff1d6" emissive="#ffc77a" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

export function Cafe() {
  const parquet = useMemo(() => withRepeat(getParquetTexture(), 3, 2.5), []);
  const wood = useMemo(() => withRepeat(getWoodTexture(), 1, 1), []);
  const menu = useMemo(() => getMenuTexture(), []);
  const backX = -HALF_W + 0.35;
  const { cx, cz } = CAFE;

  return (
    <group>
      {/* Sol parquet de la zone café */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-26.7, 0.012, cz]} receiveShadow>
        <planeGeometry args={[10.4, 8.6]} />
        <meshStandardMaterial map={parquet} roughness={0.55} />
      </mesh>

      <Counter />

      {/* Arrière-bar : meuble bois, machine, moulin, étagères */}
      <mesh position={[backX, 0.47, cz]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.94, 4.6]} />
        <meshStandardMaterial map={wood} roughness={0.55} />
      </mesh>
      <mesh position={[backX, 0.955, cz]}>
        <boxGeometry args={[0.64, 0.03, 4.7]} />
        <meshStandardMaterial color="#f5f4f1" roughness={0.2} />
      </mesh>
      <EspressoMachine position={[backX - 0.02, 0.97, cz - 0.6]} />
      <Grinder position={[backX, 0.97, cz + 0.6]} />
      {[1.9, 2.5].map((y) => (
        <mesh key={y} position={[-HALF_W + 0.2, y, cz + 0.2]} castShadow>
          <boxGeometry args={[0.32, 0.04, 2.6]} />
          <meshStandardMaterial map={wood} roughness={0.55} />
        </mesh>
      ))}
      {[-0.9, -0.55, -0.2, 0.15, 0.5, 0.85, 1.2].map((dz, i) => (
        <Cup key={dz} position={[-HALF_W + 0.22, i % 2 ? 1.92 : 2.52, cz + dz]} color={i % 3 === 0 ? BRAND.primary : '#ffffff'} />
      ))}

      {/* Menu ardoise + enseigne */}
      <mesh position={[-HALF_W + 0.04, 3.55, cz]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[3.2, 2.19]} />
        <meshBasicMaterial map={menu} toneMapped={false} />
      </mesh>
      <Text font={FONT_BOLD} position={[-HALF_W + 0.05, 5.05, cz]} rotation={[0, Math.PI / 2, 0]} fontSize={0.42} letterSpacing={0.2} color="#b08d57" anchorX="center" anchorY="middle">
        COFFEE · CAFÉ
      </Text>

      {/* Sur le comptoir : tasses, vitrine */}
      <Cup position={[cx + 2.85, 1.08, cz - 0.9]} />
      <Cup position={[cx + 2.95, 1.08, cz + 0.3]} color={BRAND.primary} />
      <Cup position={[cx + 2.7, 1.08, cz + 1.3]} />
      <PastryDisplay position={[cx + 2.6, 1.08, cz - 1.75]} rotationY={0.55} />

      {/* Tabourets design le long de l'arc */}
      {[-0.66, -0.22, 0.22, 0.66].map((a) => {
        const r = CAFE.outer + 0.55;
        return (
          <BarStool
            key={a}
            position={[cx + Math.cos(a) * r, 0, cz + Math.sin(a) * r]}
            rotationY={-a + Math.PI / 2}
            seatColor="#8b5a2b"
          />
        );
      })}

      {/* Tables bistrot */}
      {CAFE_TABLES.map((t) => (
        <CafeTable key={`${t.x}-${t.z}`} x={t.x} z={t.z} wood={wood} />
      ))}

      {/* Suspensions au-dessus du comptoir */}
      {[-0.35, 0, 0.35].map((a) => (
        <Pendant key={a} position={[cx + Math.cos(a) * 2.85, 3.1, cz + Math.sin(a) * 2.85]} />
      ))}

      <Plant position={[-22.2, 0, cz - 3.8]} kind="tall" />
      <Plant position={[-31.3, 0, cz + 3.2]} kind="bush" scale={0.9} />

      {/* Barista */}
      <Person
        spec={{ position: [cx + 1.1, 0, cz + 0.3], rotY: Math.PI / 2, pose: 'stand', shirt: BRAND.dark, skin: '#c68863', pants: '#1f2937', hair: '#1c1917' }}
        logo
        phase={4.2}
      />

      <RigidBody type="fixed" colliders={false}>
        {/* Comptoir courbe approximé par 5 segments */}
        {[-2, -1, 0, 1, 2].map((k) => {
          const a = (k / 4) * (CAFE.arc - 0.2);
          const r = (CAFE.inner + CAFE.outer) / 2;
          return (
            <CuboidCollider
              key={k}
              args={[0.42, 0.55, 0.62]}
              position={[cx + Math.cos(a) * r, 0.55, cz + Math.sin(a) * r]}
              rotation={[0, -a, 0]}
            />
          );
        })}
        <CuboidCollider args={[0.32, 0.6, 2.35]} position={[backX, 0.6, cz]} />
        <CylinderCollider args={[0.9, 0.3]} position={[cx + 1.1, 0.9, cz + 0.3]} />
        {CAFE_TABLES.map((t) => (
          <CuboidCollider key={`${t.x}-${t.z}`} args={[1.0, 0.45, 0.45]} position={[t.x, 0.45, t.z]} />
        ))}
        {[-0.66, -0.22, 0.22, 0.66].map((a) => {
          const r = CAFE.outer + 0.55;
          return <CylinderCollider key={a} args={[0.4, 0.22]} position={[cx + Math.cos(a) * r, 0.4, cz + Math.sin(a) * r]} />;
        })}
      </RigidBody>
    </group>
  );
}

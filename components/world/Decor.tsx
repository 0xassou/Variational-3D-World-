'use client';

import { useMemo } from 'react';
import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier';
import { BRAND } from '@/lib/layout';
import { getBannerTexture } from './brandTextures';

/* Mobilier d'exposition moderne réutilisable. Chaque pièce porte sa propre collision. */

type Vec3 = [number, number, number];

const LEAF = '#5f9468';
const LEAF_LIGHT = '#7fb386';
const LEAF_DARK = '#3f6f4a';

/* ------------------------------------------------------------------ */
/* Plantes                                                              */
/* ------------------------------------------------------------------ */

export type PlantKind = 'bush' | 'tall' | 'snake';

/** Plante d'intérieur en pot design. `bush` = boule, `tall` = ficus haut, `snake` = sansevieria. */
export function Plant({ position, kind = 'bush', scale = 1 }: { position: Vec3; kind?: PlantKind; scale?: number }) {
  const leaves = useMemo(() => {
    // Feuillage du ficus : amas facettés répartis dans une couronne (disposition déterministe).
    const out: { p: Vec3; s: number; c: string }[] = [];
    for (let i = 0; i < 16; i++) {
      const a = i * 2.39996;
      const t = i / 16;
      const r = 0.12 + 0.3 * Math.abs(Math.sin(i * 1.7));
      out.push({
        p: [Math.cos(a) * r, 1.3 + t * 1.05 + Math.sin(i * 3.1) * 0.08, Math.sin(a) * r],
        s: 0.2 + 0.12 * Math.abs(Math.cos(i * 2.3)),
        c: i % 3 === 0 ? LEAF_LIGHT : i % 3 === 1 ? LEAF : LEAF_DARK,
      });
    }
    return out;
  }, []);

  const potH = kind === 'tall' ? 0.75 : kind === 'snake' ? 0.5 : 0.6;
  const collider = kind === 'tall' ? 0.36 : 0.32;

  return (
    <group position={position} scale={scale}>
      {/* Pot */}
      {kind === 'bush' ? (
        <mesh position={[0, potH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, potH, 0.6]} />
          <meshStandardMaterial color="#d6d3cd" roughness={0.9} />
        </mesh>
      ) : (
        <mesh position={[0, potH / 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.24, potH, 28]} />
          <meshStandardMaterial color={kind === 'tall' ? '#f8fafc' : '#1f2937'} roughness={0.5} />
        </mesh>
      )}
      <mesh position={[0, potH + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.26, 24]} />
        <meshStandardMaterial color="#4a3b2f" roughness={1} />
      </mesh>

      {kind === 'bush' && (
        <>
          <mesh position={[0, potH + 0.45, 0]} castShadow>
            <sphereGeometry args={[0.48, 18, 14]} />
            <meshStandardMaterial color={LEAF} roughness={0.9} />
          </mesh>
          <mesh position={[0.15, potH + 0.82, 0.08]} castShadow>
            <sphereGeometry args={[0.3, 14, 10]} />
            <meshStandardMaterial color={LEAF_LIGHT} roughness={0.9} />
          </mesh>
        </>
      )}

      {kind === 'tall' && (
        <>
          <mesh position={[0, potH + 0.7, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.035, 1.5, 8]} />
            <meshStandardMaterial color="#6b4f3a" />
          </mesh>
          {leaves.map((l, i) => (
            <mesh key={i} position={[l.p[0], l.p[1] + 0.2, l.p[2]]} scale={l.s} rotation={[i, i * 0.7, 0]} castShadow>
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color={l.c} roughness={0.85} flatShading />
            </mesh>
          ))}
        </>
      )}

      {kind === 'snake' &&
        [0, 1, 2, 3, 4, 5, 6].map((i) => {
          const a = (i / 7) * Math.PI * 2;
          const h = 0.75 + (i % 3) * 0.18;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.1, potH + h / 2, Math.sin(a) * 0.1]}
              rotation={[Math.sin(a) * 0.15, a, Math.cos(a) * 0.15]}
              castShadow
            >
              <boxGeometry args={[0.09, h, 0.02]} />
              <meshStandardMaterial color={i % 2 ? LEAF_DARK : LEAF} roughness={0.7} />
            </mesh>
          );
        })}

      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider args={[0.6, collider]} position={[0, 0.6, 0]} />
      </RigidBody>
    </group>
  );
}

/** Bac rectangulaire végétalisé (séparateur d'espace). */
export function PlanterBox({ position, rotationY = 0, length = 2.4 }: { position: Vec3; rotationY?: number; length?: number }) {
  const count = Math.max(3, Math.round(length / 0.55));
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.6, 0.6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.605, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length - 0.08, 0.52]} />
        <meshStandardMaterial color="#4a3b2f" roughness={1} />
      </mesh>
      <mesh position={[0, 0.12, 0.302]}>
        <planeGeometry args={[length, 0.04]} />
        <meshBasicMaterial color={BRAND.primary} toneMapped={false} />
      </mesh>
      {Array.from({ length: count }, (_, i) => {
        const x = -length / 2 + 0.3 + (i * (length - 0.6)) / (count - 1);
        const big = i % 2 === 0;
        return (
          <mesh key={i} position={[x, 0.6 + (big ? 0.3 : 0.22), 0]} castShadow>
            <sphereGeometry args={[big ? 0.32 : 0.25, 14, 10]} />
            <meshStandardMaterial color={big ? LEAF : LEAF_LIGHT} roughness={0.9} />
          </mesh>
        );
      })}
      {/* Graminées */}
      {Array.from({ length: count * 2 }, (_, i) => {
        const x = -length / 2 + 0.2 + (i * (length - 0.4)) / (count * 2 - 1);
        return (
          <mesh key={`g${i}`} position={[x, 1.0, i % 2 ? 0.14 : -0.14]} rotation={[0, 0, (i % 3) * 0.12 - 0.12]}>
            <coneGeometry args={[0.035, 0.6, 5]} />
            <meshStandardMaterial color={LEAF_DARK} roughness={0.8} />
          </mesh>
        );
      })}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[length / 2, 0.6, 0.3]} position={[0, 0.6, 0]} />
      </RigidBody>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Tables hautes & tabourets                                            */
/* ------------------------------------------------------------------ */

export function BarStool({ position, rotationY = 0, seatColor = BRAND.dark }: { position: Vec3; rotationY?: number; seatColor?: string }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.015, 0]} receiveShadow>
        <cylinderGeometry args={[0.2, 0.22, 0.03, 20]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.72, 10]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.15, 0.012, 6, 20]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.76, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.18, 0.07, 24]} />
        <meshStandardMaterial color={seatColor} roughness={0.7} />
      </mesh>
    </group>
  );
}

/** Table haute de discussion entourée de tabourets. */
export function BistroSet({ position, stools = 3, rotationY = 0 }: { position: Vec3; stools?: number; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.04, 24]} />
        <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.53, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.02, 12]} />
        <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.06, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
        <meshStandardMaterial color="#f5efe6" roughness={0.35} />
      </mesh>
      {/* Petit chevalet de table aux couleurs de la marque */}
      <mesh position={[0, 1.16, 0]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.18, 0.14, 0.02]} />
        <meshStandardMaterial color={BRAND.primary} />
      </mesh>
      {Array.from({ length: stools }, (_, i) => {
        const a = (i / stools) * Math.PI * 2 + 0.3;
        return <BarStool key={i} position={[Math.sin(a) * 0.82, 0, Math.cos(a) * 0.82]} rotationY={a} />;
      })}
      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider args={[0.55, 1.05]} position={[0, 0.55, 0]} />
      </RigidBody>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Signalétique : kakemonos & totems                                    */
/* ------------------------------------------------------------------ */

/** Kakemono (roll-up) avec visuel de marque recto, dos gris. */
export function Kakemono({
  position,
  rotationY = 0,
  lines,
  theme = 'dark',
}: {
  position: Vec3;
  rotationY?: number;
  lines: string[];
  theme?: 'dark' | 'light';
}) {
  const map = useMemo(() => getBannerTexture(lines, theme), [lines, theme]);
  const w = 0.95;
  const h = w * 2.5;
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[w + 0.1, 0.1, 0.3]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.1 + h / 2, -0.02]} castShadow>
        <boxGeometry args={[w, h, 0.02]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      <mesh position={[0, 0.1 + h / 2, -0.008]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.1 + h, -0.02]}>
        <boxGeometry args={[w + 0.04, 0.03, 0.04]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.3} />
      </mesh>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[w / 2 + 0.05, 1.2, 0.18]} position={[0, 1.2, 0]} />
      </RigidBody>
    </group>
  );
}

/** Totem triangulaire de 3,2 m, un visuel de marque par face. */
export function Totem({ position, rotationY = 0, faces }: { position: Vec3; rotationY?: number; faces: string[][] }) {
  const radius = 0.78;
  const apothem = radius / 2;
  const faceW = radius * Math.sqrt(3);
  const height = 3.2;
  const maps = useMemo(() => faces.map((lines, i) => getBannerTexture(lines, i % 2 ? 'light' : 'dark')), [faces]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <cylinderGeometry args={[radius + 0.08, radius + 0.08, 0.12, 3]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      <mesh position={[0, height / 2 + 0.12, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 3]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      {maps.slice(0, 3).map((map, i) => {
        // Faces du prisme : normales à 60°, 180°, 300° (cylindre à 3 segments).
        const a = Math.PI / 3 + (i * 2 * Math.PI) / 3;
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * (apothem + 0.004), height / 2 + 0.12, Math.cos(a) * (apothem + 0.004)]}
            rotation={[0, a, 0]}
          >
            <planeGeometry args={[faceW * 0.96, height * 0.97]} />
            <meshBasicMaterial map={map} toneMapped={false} />
          </mesh>
        );
      })}
      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider args={[1.6, radius * 0.9]} position={[0, 1.7, 0]} />
      </RigidBody>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Assises lounge                                                        */
/* ------------------------------------------------------------------ */

const UPHOLSTERY = '#c9d6e8';
const UPHOLSTERY_DARK = '#a9bbd3';

/** Canapé 3 places (assise à 0,5 m), regarde vers +Z local. */
export function Sofa({ position, rotationY = 0, color = UPHOLSTERY }: { position: Vec3; rotationY?: number; color?: string }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.5, 0.95]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.72, -0.4]} castShadow>
        <boxGeometry args={[2.6, 0.55, 0.18]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 1.25, 0.6, 0]} castShadow>
          <boxGeometry args={[0.16, 0.3, 0.95]} />
          <meshStandardMaterial color={UPHOLSTERY_DARK} roughness={0.95} />
        </mesh>
      ))}
      {/* Coussins */}
      {[-0.75, 0.75].map((x) => (
        <mesh key={x} position={[x, 0.72, -0.27]} rotation={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.45, 0.4, 0.12]} />
          <meshStandardMaterial color={x < 0 ? BRAND.primary : '#f1f5f9'} roughness={0.9} />
        </mesh>
      ))}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[1.35, 0.5, 0.5]} position={[0, 0.5, 0]} />
      </RigidBody>
    </group>
  );
}

/** Fauteuil lounge (assise à 0,48 m), regarde vers +Z local. */
export function Armchair({ position, rotationY = 0, color = UPHOLSTERY }: { position: Vec3; rotationY?: number; color?: string }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.95, 0.48, 0.9]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.72, -0.38]} castShadow>
        <boxGeometry args={[0.95, 0.55, 0.16]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.44, 0.58, 0]} castShadow>
          <boxGeometry args={[0.1, 0.24, 0.9]} />
          <meshStandardMaterial color={UPHOLSTERY_DARK} roughness={0.95} />
        </mesh>
      ))}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.5, 0.5, 0.47]} position={[0, 0.5, 0]} />
      </RigidBody>
    </group>
  );
}

/** Table basse ronde avec magazines. */
export function CoffeeTable({ position, radius = 0.55 }: { position: Vec3; radius?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius * 0.9, 0.4, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[0.12, 0.41, 0.05]} rotation={[-Math.PI / 2, 0, 0.3]}>
        <planeGeometry args={[0.28, 0.36]} />
        <meshStandardMaterial color={BRAND.primary} />
      </mesh>
      <mesh position={[-0.15, 0.42, -0.08]} rotation={[-Math.PI / 2, 0, -0.2]}>
        <planeGeometry args={[0.26, 0.34]} />
        <meshStandardMaterial color="#0b1f3a" />
      </mesh>
      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider args={[0.25, radius]} position={[0, 0.25, 0]} />
      </RigidBody>
    </group>
  );
}

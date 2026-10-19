'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  BoxGeometry,
  BufferGeometry,
  CapsuleGeometry,
  Color,
  Euler,
  Group,
  InstancedMesh,
  Matrix4,
  Quaternion,
  SphereGeometry,
  Vector3,
} from 'three';
import { getShirtLogoTexture } from './brandTextures';

/* ------------------------------------------------------------------ */
/* Modèle de personnage low-poly partagé (foule instanciée, staff, PNJ) */
/* ------------------------------------------------------------------ */

export type Pose = 'stand' | 'sit';
type ColorSlot = 'shirt' | 'skin' | 'pants' | 'hair';

export interface PersonSpec {
  position: [number, number, number];
  /** Rotation autour de Y. 0 = regarde vers +Z. */
  rotY: number;
  pose: Pose;
  shirt: string;
  skin: string;
  pants: string;
  hair: string;
}

interface PartDef {
  key: string;
  geometry: () => BufferGeometry;
  offset: [number, number, number];
  slot: ColorSlot;
  /** Partie appartenant à la tête (animée chez certains PNJ). */
  head?: boolean;
}

const HEAD_PIVOT: Record<Pose, number> = { stand: 1.5, sit: 1.26 };

const TORSO = () => new CapsuleGeometry(0.21, 0.4, 4, 12);
const ARM = () => new CapsuleGeometry(0.065, 0.42, 4, 8);
const HEAD = () => new SphereGeometry(0.13, 16, 12);
const HAIR = () => new SphereGeometry(0.137, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);

const PARTS: Record<Pose, PartDef[]> = {
  stand: [
    { key: 'legs', geometry: () => new BoxGeometry(0.36, 0.86, 0.22), offset: [0, 0.43, 0], slot: 'pants' },
    { key: 'torso', geometry: TORSO, offset: [0, 1.15, 0], slot: 'shirt' },
    { key: 'armL', geometry: ARM, offset: [-0.275, 1.12, 0], slot: 'shirt' },
    { key: 'armR', geometry: ARM, offset: [0.275, 1.12, 0], slot: 'shirt' },
    { key: 'head', geometry: HEAD, offset: [0, 1.62, 0], slot: 'skin', head: true },
    { key: 'hair', geometry: HAIR, offset: [0, 1.645, -0.005], slot: 'hair', head: true },
  ],
  sit: [
    { key: 'thighs', geometry: () => new BoxGeometry(0.36, 0.17, 0.5), offset: [0, 0.54, 0.18], slot: 'pants' },
    { key: 'shins', geometry: () => new BoxGeometry(0.34, 0.48, 0.16), offset: [0, 0.24, 0.42], slot: 'pants' },
    { key: 'torso', geometry: TORSO, offset: [0, 0.92, -0.02], slot: 'shirt' },
    { key: 'armL', geometry: ARM, offset: [-0.275, 0.9, 0.02], slot: 'shirt' },
    { key: 'armR', geometry: ARM, offset: [0.275, 0.9, 0.02], slot: 'shirt' },
    { key: 'head', geometry: HEAD, offset: [0, 1.38, -0.02], slot: 'skin', head: true },
    { key: 'hair', geometry: HAIR, offset: [0, 1.405, -0.025], slot: 'hair', head: true },
  ],
};

/* Palettes « tenue de conférence » : couleurs sobres et claires. */
export const SHIRT_COLORS = ['#ffffff', '#dbe4f0', '#9fb3c8', '#1f2a44', '#6b7280', '#e7dccb', '#c7d2fe', '#334155', '#f1f5f9'];
export const PANTS_COLORS = ['#1f2937', '#334155', '#3f3f46', '#1e3a5f', '#a8a29e', '#57534e'];
export const SKIN_COLORS = ['#f2d0b5', '#e0ac86', '#c68863', '#8d5a3b', '#5c3a26', '#f5dcc8'];
export const HAIR_COLORS = ['#1c1917', '#3b2416', '#6b4423', '#a16207', '#d6d3d1', '#292524'];

export function pick<T>(list: readonly T[], r: number): T {
  return list[Math.floor(r * list.length) % list.length];
}

/* ------------------------------------------------------------------ */
/* Foule instanciée (un InstancedMesh par partie du corps)              */
/* ------------------------------------------------------------------ */

const tmpMatrix = new Matrix4();
const tmpPos = new Vector3();
const tmpQuat = new Quaternion();
const tmpEuler = new Euler();
const tmpOffset = new Vector3();
const unitScale = new Vector3(1, 1, 1);
const tmpColor = new Color();

function InstancedPart({ part, people }: { part: PartDef; people: PersonSpec[] }) {
  const ref = useRef<InstancedMesh>(null);
  const geometry = useMemo(() => part.geometry(), [part]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    people.forEach((p, i) => {
      tmpEuler.set(0, p.rotY, 0);
      tmpQuat.setFromEuler(tmpEuler);
      tmpOffset.set(...part.offset).applyQuaternion(tmpQuat);
      tmpPos.set(...p.position).add(tmpOffset);
      tmpMatrix.compose(tmpPos, tmpQuat, unitScale);
      mesh.setMatrixAt(i, tmpMatrix);
      mesh.setColorAt(i, tmpColor.set(p[part.slot]));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [people, part]);

  useLayoutEffect(() => () => geometry.dispose(), [geometry]);

  if (people.length === 0) return null;
  return (
    <instancedMesh ref={ref} args={[geometry, undefined, people.length]} castShadow receiveShadow>
      <meshStandardMaterial roughness={part.slot === 'skin' ? 0.6 : 0.85} />
    </instancedMesh>
  );
}

/** Rend une foule statique d'une même pose avec ~7 draw calls quel que soit le nombre de PNJ. */
export function CrowdInstances({ people, pose }: { people: PersonSpec[]; pose: Pose }) {
  return (
    <group>
      {PARTS[pose].map((part) => (
        <InstancedPart key={`${pose}-${part.key}-${people.length}`} part={part} people={people} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Personnage individuel (staff, PNJ animés)                            */
/* ------------------------------------------------------------------ */

interface PersonProps {
  spec: PersonSpec;
  /** Micro-animation d'oscillation de la tête. */
  animated?: boolean;
  /** Affiche le logo Variational sur la poitrine (staff). */
  logo?: boolean;
  /** Décalage de phase pour désynchroniser les animations. */
  phase?: number;
  /** Gestes du bras droit (intervenant qui parle). */
  gesture?: boolean;
}

export function Person({ spec, animated = false, logo = false, phase = 0, gesture = false }: PersonProps) {
  const headRef = useRef<Group>(null);
  const bodyRef = useRef<Group>(null);
  const armRef = useRef<Group>(null);
  const parts = PARTS[spec.pose];
  const pivotY = HEAD_PIVOT[spec.pose];
  const geometries = useMemo(() => parts.map((p) => p.geometry()), [parts]);
  const logoMap = useMemo(() => (logo ? getShirtLogoTexture() : null), [logo]);

  useLayoutEffect(() => () => geometries.forEach((g) => g.dispose()), [geometries]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phase;
    if (animated && headRef.current) {
      // Oscillation subtile : léger hochement + rotation latérale.
      headRef.current.rotation.y = Math.sin(t * 0.9) * 0.35;
      headRef.current.rotation.x = Math.sin(t * 1.7) * 0.08;
    }
    if (gesture && armRef.current) {
      // Bras qui accompagne la parole : levées lentes et irrégulières.
      const lift = Math.max(0, Math.sin(t * 1.3) + Math.sin(t * 2.1) * 0.5);
      armRef.current.rotation.x = -lift * 0.55;
      armRef.current.rotation.z = lift * 0.15;
    }
    if (spec.pose === 'stand' && bodyRef.current) {
      // Respiration très légère pour le staff.
      bodyRef.current.scale.y = 1 + Math.sin(t * 1.4) * 0.006;
    }
  });

  const torso = parts.find((p) => p.key === 'torso');

  return (
    <group position={spec.position} rotation={[0, spec.rotY, 0]}>
      <group ref={bodyRef}>
        {parts.map((part, i) => {
          if (part.head) return null;
          const mesh = (
            <mesh
              key={part.key}
              geometry={geometries[i]}
              position={gesture && part.key === 'armR' ? [0, -0.24, 0] : part.offset}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color={spec[part.slot]} roughness={0.8} />
            </mesh>
          );
          if (!(gesture && part.key === 'armR')) return mesh;
          // Pivot à l'épaule pour animer le bras.
          return (
            <group key={part.key} ref={armRef} position={[part.offset[0], part.offset[1] + 0.24, part.offset[2]]}>
              {mesh}
            </group>
          );
        })}
        {logoMap && torso && (
          <mesh position={[torso.offset[0], torso.offset[1] + 0.08, torso.offset[2] + 0.214]}>
            <planeGeometry args={[0.26, 0.26]} />
            <meshStandardMaterial map={logoMap} transparent roughness={0.7} polygonOffset polygonOffsetFactor={-1} />
          </mesh>
        )}
      </group>
      <group ref={headRef} position={[0, pivotY, 0]}>
        {parts.map((part, i) =>
          part.head ? (
            <mesh
              key={part.key}
              geometry={geometries[i]}
              position={[part.offset[0], part.offset[1] - pivotY, part.offset[2]]}
              castShadow
            >
              <meshStandardMaterial color={spec[part.slot]} roughness={0.6} />
            </mesh>
          ) : null,
        )}
      </group>
    </group>
  );
}

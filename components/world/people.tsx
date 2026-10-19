'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  BufferGeometry,
  CapsuleGeometry,
  CylinderGeometry,
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
type ColorSlot = 'shirt' | 'skin' | 'pants' | 'hair' | 'shoe';

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

type Vec3 = [number, number, number];

interface PartDef {
  key: string;
  geometry: () => BufferGeometry;
  offset: Vec3;
  rotation?: Vec3;
  scale?: Vec3;
  slot: ColorSlot;
  /** Partie appartenant à la tête (animée chez certains PNJ). */
  head?: boolean;
}

const SHOE_COLOR = '#1f2328';

function colorOf(p: PersonSpec, slot: ColorSlot) {
  return slot === 'shoe' ? SHOE_COLOR : p[slot];
}

const HEAD_PIVOT: Record<Pose, number> = { stand: 1.48, sit: 1.16 };

/* Géométries stylisées partagées (silhouette arrondie, proportions homogènes). */
const TORSO = () => new CylinderGeometry(0.205, 0.155, 0.5, 18, 1);
const SHOULDER = () => new SphereGeometry(0.085, 14, 10);
const PELVIS = () => new SphereGeometry(1, 16, 10);
const LIMB_LEG = () => new CapsuleGeometry(0.072, 0.62, 4, 10);
const THIGH = () => new CapsuleGeometry(0.078, 0.34, 4, 10);
const SHIN = () => new CapsuleGeometry(0.066, 0.32, 4, 10);
const ARM = () => new CapsuleGeometry(0.054, 0.44, 4, 10);
const HAND = () => new SphereGeometry(0.05, 10, 8);
const NECK = () => new CylinderGeometry(0.048, 0.055, 0.1, 10);
const HEAD = () => new SphereGeometry(0.118, 20, 16);
const HAIR = () => new SphereGeometry(0.126, 20, 10, 0, Math.PI * 2, 0, Math.PI / 1.85);
const SHOE = () => new CapsuleGeometry(0.052, 0.14, 4, 8);

/** Torse aplati en profondeur (épaules larges, taille fine). */
const TORSO_SCALE: Vec3 = [1, 1, 0.68];

const PARTS: Record<Pose, PartDef[]> = {
  stand: [
    { key: 'shoeL', geometry: SHOE, offset: [-0.1, 0.05, 0.04], rotation: [Math.PI / 2, 0, 0], slot: 'shoe' },
    { key: 'shoeR', geometry: SHOE, offset: [0.1, 0.05, 0.04], rotation: [Math.PI / 2, 0, 0], slot: 'shoe' },
    { key: 'legL', geometry: LIMB_LEG, offset: [-0.1, 0.46, 0], slot: 'pants' },
    { key: 'legR', geometry: LIMB_LEG, offset: [0.1, 0.46, 0], slot: 'pants' },
    { key: 'pelvis', geometry: PELVIS, offset: [0, 0.88, 0], scale: [0.19, 0.1, 0.13], slot: 'pants' },
    { key: 'torso', geometry: TORSO, offset: [0, 1.16, 0], scale: TORSO_SCALE, slot: 'shirt' },
    { key: 'shoulderL', geometry: SHOULDER, offset: [-0.2, 1.37, 0], slot: 'shirt' },
    { key: 'shoulderR', geometry: SHOULDER, offset: [0.2, 1.37, 0], slot: 'shirt' },
    { key: 'armL', geometry: ARM, offset: [-0.255, 1.1, 0], rotation: [0, 0, -0.07], slot: 'shirt' },
    { key: 'armR', geometry: ARM, offset: [0.255, 1.1, 0], rotation: [0, 0, 0.07], slot: 'shirt' },
    { key: 'handL', geometry: HAND, offset: [-0.275, 0.82, 0.01], slot: 'skin' },
    { key: 'handR', geometry: HAND, offset: [0.275, 0.82, 0.01], slot: 'skin' },
    { key: 'neck', geometry: NECK, offset: [0, 1.45, 0], slot: 'skin' },
    { key: 'head', geometry: HEAD, offset: [0, 1.6, 0.005], scale: [1, 1.08, 1.02], slot: 'skin', head: true },
    { key: 'hair', geometry: HAIR, offset: [0, 1.625, -0.006], slot: 'hair', head: true },
  ],
  sit: [
    { key: 'shoeL', geometry: SHOE, offset: [-0.1, 0.05, 0.5], rotation: [Math.PI / 2, 0, 0], slot: 'shoe' },
    { key: 'shoeR', geometry: SHOE, offset: [0.1, 0.05, 0.5], rotation: [Math.PI / 2, 0, 0], slot: 'shoe' },
    { key: 'shinL', geometry: SHIN, offset: [-0.1, 0.27, 0.42], slot: 'pants' },
    { key: 'shinR', geometry: SHIN, offset: [0.1, 0.27, 0.42], slot: 'pants' },
    { key: 'thighL', geometry: THIGH, offset: [-0.1, 0.52, 0.2], rotation: [Math.PI / 2, 0, 0], slot: 'pants' },
    { key: 'thighR', geometry: THIGH, offset: [0.1, 0.52, 0.2], rotation: [Math.PI / 2, 0, 0], slot: 'pants' },
    { key: 'pelvis', geometry: PELVIS, offset: [0, 0.54, -0.02], scale: [0.19, 0.1, 0.14], slot: 'pants' },
    { key: 'torso', geometry: TORSO, offset: [0, 0.83, -0.03], scale: TORSO_SCALE, slot: 'shirt' },
    { key: 'shoulderL', geometry: SHOULDER, offset: [-0.2, 1.04, -0.03], slot: 'shirt' },
    { key: 'shoulderR', geometry: SHOULDER, offset: [0.2, 1.04, -0.03], slot: 'shirt' },
    { key: 'armL', geometry: ARM, offset: [-0.245, 0.83, 0.07], rotation: [-0.55, 0, -0.05], slot: 'shirt' },
    { key: 'armR', geometry: ARM, offset: [0.245, 0.83, 0.07], rotation: [-0.55, 0, 0.05], slot: 'shirt' },
    { key: 'handL', geometry: HAND, offset: [-0.21, 0.6, 0.24], slot: 'skin' },
    { key: 'handR', geometry: HAND, offset: [0.21, 0.6, 0.24], slot: 'skin' },
    { key: 'neck', geometry: NECK, offset: [0, 1.12, -0.03], slot: 'skin' },
    { key: 'head', geometry: HEAD, offset: [0, 1.27, -0.025], scale: [1, 1.08, 1.02], slot: 'skin', head: true },
    { key: 'hair', geometry: HAIR, offset: [0, 1.295, -0.031], slot: 'hair', head: true },
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
const tmpPartQuat = new Quaternion();
const tmpEuler = new Euler();
const tmpOffset = new Vector3();
const tmpScale = new Vector3();
const tmpColor = new Color();

function InstancedPart({ part, people }: { part: PartDef; people: PersonSpec[] }) {
  const ref = useRef<InstancedMesh>(null);
  const geometry = useMemo(() => part.geometry(), [part]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    tmpPartQuat.setFromEuler(tmpEuler.set(...(part.rotation ?? [0, 0, 0])));
    tmpScale.set(...(part.scale ?? [1, 1, 1]));
    people.forEach((p, i) => {
      tmpQuat.setFromEuler(tmpEuler.set(0, p.rotY, 0));
      tmpOffset.set(...part.offset).applyQuaternion(tmpQuat);
      tmpPos.set(...p.position).add(tmpOffset);
      tmpMatrix.compose(tmpPos, tmpQuat.multiply(tmpPartQuat), tmpScale);
      mesh.setMatrixAt(i, tmpMatrix);
      mesh.setColorAt(i, tmpColor.set(colorOf(p, part.slot)));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [people, part]);

  useLayoutEffect(() => () => geometry.dispose(), [geometry]);

  if (people.length === 0) return null;
  return (
    <instancedMesh ref={ref} args={[geometry, undefined, people.length]} castShadow receiveShadow>
      <meshStandardMaterial roughness={part.slot === 'skin' ? 0.55 : part.slot === 'shoe' ? 0.4 : 0.8} />
    </instancedMesh>
  );
}

/** Rend une foule statique d'une même pose (un draw call par partie du corps, quel que soit le nombre de PNJ). */
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
  const armR = parts.find((p) => p.key === 'armR');
  // Pivot d'épaule du bras droit animé (intervenant qui parle).
  const shoulder: Vec3 = armR ? [armR.offset[0], armR.offset[1] + 0.24, armR.offset[2]] : [0, 0, 0];
  const gestureKeys = gesture ? ['armR', 'handR'] : [];

  const renderPart = (part: PartDef, i: number, origin: Vec3 = [0, 0, 0]) => (
    <mesh
      key={part.key}
      geometry={geometries[i]}
      position={[part.offset[0] - origin[0], part.offset[1] - origin[1], part.offset[2] - origin[2]]}
      rotation={part.rotation}
      scale={part.scale}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={colorOf(spec, part.slot)} roughness={part.slot === 'skin' ? 0.55 : 0.8} />
    </mesh>
  );

  return (
    <group position={spec.position} rotation={[0, spec.rotY, 0]}>
      <group ref={bodyRef}>
        {parts.map((part, i) => (part.head || gestureKeys.includes(part.key) ? null : renderPart(part, i)))}
        {gesture && (
          <group ref={armRef} position={shoulder}>
            {parts.map((part, i) => (gestureKeys.includes(part.key) ? renderPart(part, i, shoulder) : null))}
          </group>
        )}
        {logoMap && torso && (
          <mesh position={[torso.offset[0], torso.offset[1] + 0.08, torso.offset[2] + 0.134]}>
            <planeGeometry args={[0.22, 0.22]} />
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
              rotation={part.rotation}
              scale={part.scale}
              castShadow
            >
              <meshStandardMaterial color={colorOf(spec, part.slot)} roughness={0.55} />
            </mesh>
          ) : null,
        )}
      </group>
    </group>
  );
}

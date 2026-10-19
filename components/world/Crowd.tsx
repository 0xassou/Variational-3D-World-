'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier';
import { BoxGeometry, InstancedMesh, Matrix4, Quaternion, Vector3 } from 'three';
import { AUDIENCE, INTERACTIVE_POINTS, seededRandom, standCenterX, STANDS, TWITTER_WALL } from '@/lib/layout';
import { BAR, COCKTAIL_TABLES } from './Amenities';
import {
  CrowdInstances,
  HAIR_COLORS,
  PANTS_COLORS,
  Person,
  pick,
  SHIRT_COLORS,
  SKIN_COLORS,
  type PersonSpec,
} from './people';

/** Environ 1 PNJ sur 100 exécute une micro-animation (oscillation de la tête). */
const ANIMATED_EVERY = 100;
const ANIMATED_OFFSET = 42;

interface Seat {
  x: number;
  z: number;
}

interface CrowdData {
  seats: Seat[];
  seated: PersonSpec[];
  standing: PersonSpec[];
  animated: PersonSpec[];
  rowBlocks: { x: number; z: number; halfWidth: number }[];
}

function blockSeatX(sign: number, i: number) {
  return sign * (AUDIENCE.innerX + 0.5 + i * AUDIENCE.seatSpacing);
}

function buildCrowd(): CrowdData {
  const rand = seededRandom(20260619);
  const seats: Seat[] = [];
  const all: PersonSpec[] = [];
  const rowBlocks: CrowdData['rowBlocks'] = [];

  const person = (position: [number, number, number], rotY: number, pose: PersonSpec['pose']): PersonSpec => ({
    position,
    rotY,
    pose,
    shirt: pick(SHIRT_COLORS, rand()),
    skin: pick(SKIN_COLORS, rand()),
    pants: pick(PANTS_COLORS, rand()),
    hair: pick(HAIR_COLORS, rand()),
  });

  /* Public assis face à la scène (regarde vers -Z => rotY = PI). */
  for (let r = 0; r < AUDIENCE.rows; r++) {
    const z = AUDIENCE.firstRowZ + r * AUDIENCE.rowSpacing;
    for (const sign of [-1, 1]) {
      const first = blockSeatX(sign, 0);
      const last = blockSeatX(sign, AUDIENCE.seatsPerBlock - 1);
      rowBlocks.push({ x: (first + last) / 2, z, halfWidth: Math.abs(last - first) / 2 + 0.35 });
      for (let i = 0; i < AUDIENCE.seatsPerBlock; i++) {
        const x = blockSeatX(sign, i);
        seats.push({ x, z });
        if (rand() < 0.85) {
          all.push(person([x, 0, z], Math.PI + (rand() - 0.5) * 0.15, 'sit'));
        }
      }
    }
  }

  /* Groupes autour des mange-debout. */
  for (const [tx, tz] of COCKTAIL_TABLES) {
    const count = 2 + Math.floor(rand() * 2);
    const base = rand() * Math.PI * 2;
    for (let k = 0; k < count; k++) {
      const a = base + (k / count) * Math.PI * 2;
      const px = tx + Math.sin(a) * 0.85;
      const pz = tz + Math.cos(a) * 0.85;
      // Regarde vers la table.
      all.push(person([px, 0, pz], Math.atan2(tx - px, tz - pz), 'stand'));
    }
  }

  /* Visiteurs devant chaque stand (face au comptoir). */
  for (const s of STANDS) {
    const cx = standCenterX(s.side);
    const dir = s.side === 'left' ? 1 : -1;
    const zs = s.side === 'left' ? 1 : -1;
    const counterZ = s.z + zs * -1.2;
    for (const dz of [-0.9, 0.7]) {
      const px = cx + dir * 2.0;
      const pz = counterZ + dz;
      all.push(person([px, 0, pz], dir > 0 ? -Math.PI / 2 : Math.PI / 2, 'stand'));
    }
  }

  /* Lecteurs du Twitter Alpha Wall (regardent vers +Z). */
  for (const dx of [-5.2, -3.8, 3.6, 5]) {
    all.push(person([TWITTER_WALL.x + dx, 0, TWITTER_WALL.z - 2.6 - rand() * 0.6], (rand() - 0.5) * 0.4, 'stand'));
  }

  /* Clients du coffee bar (regardent vers le comptoir, -X). */
  for (const dz of [-1.2, 1.4]) {
    all.push(person([BAR.x + 1.3, 0, BAR.z + dz], -Math.PI / 2, 'stand'));
  }

  /* Petits groupes de discussion dispersés. */
  const pairs: [number, number][] = [
    [-17, 4],
    [17, 24],
    [-18, -20],
    [18, -16],
    [-3.5, 27],
    [16, 5],
  ];
  for (const [gx, gz] of pairs) {
    all.push(person([gx - 0.45, 0, gz], Math.PI / 2, 'stand'));
    all.push(person([gx + 0.45, 0, gz], -Math.PI / 2, 'stand'));
  }

  /* Sécurité : aucun PNJ ne doit bloquer une borne interactive. */
  const clear = all.filter(
    (p) => !INTERACTIVE_POINTS.some((k) => Math.hypot(p.position[0] - k.x, p.position[2] - k.z) < 1.6),
  );

  const seated: PersonSpec[] = [];
  const standing: PersonSpec[] = [];
  const animated: PersonSpec[] = [];
  clear.forEach((p, i) => {
    if (i % ANIMATED_EVERY === ANIMATED_OFFSET) animated.push(p);
    else if (p.pose === 'sit') seated.push(p);
    else standing.push(p);
  });

  return { seats, seated, standing, animated, rowBlocks };
}

/* ------------------------------------------------------------------ */

const chairMatrix = new Matrix4();
const chairQuat = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI);
const chairScale = new Vector3(1, 1, 1);
const chairPos = new Vector3();

/** Chaises du public instanciées (assise + dossier). */
function Chairs({ seats }: { seats: Seat[] }) {
  const seatRef = useRef<InstancedMesh>(null);
  const backRef = useRef<InstancedMesh>(null);
  const legRef = useRef<InstancedMesh>(null);
  const seatGeo = useMemo(() => new BoxGeometry(0.5, 0.06, 0.48), []);
  const backGeo = useMemo(() => new BoxGeometry(0.5, 0.55, 0.05), []);
  const legGeo = useMemo(() => new BoxGeometry(0.42, 0.42, 0.4), []);

  useLayoutEffect(() => {
    const parts: [InstancedMesh | null, [number, number, number]][] = [
      [seatRef.current, [0, 0.45, 0.05]],
      // Dossier derrière la personne : z local négatif => +Z monde après rotation PI.
      [backRef.current, [0, 0.75, -0.2]],
      [legRef.current, [0, 0.21, 0.05]],
    ];
    for (const [mesh, offset] of parts) {
      if (!mesh) continue;
      seats.forEach((s, i) => {
        const local = new Vector3(...offset).applyQuaternion(chairQuat);
        chairPos.set(s.x, 0, s.z).add(local);
        chairMatrix.compose(chairPos, chairQuat, chairScale);
        mesh.setMatrixAt(i, chairMatrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    }
  }, [seats]);

  useLayoutEffect(
    () => () => {
      seatGeo.dispose();
      backGeo.dispose();
      legGeo.dispose();
    },
    [seatGeo, backGeo, legGeo],
  );

  return (
    <group>
      <instancedMesh ref={seatRef} args={[seatGeo, undefined, seats.length]} castShadow receiveShadow>
        <meshStandardMaterial color="#4f5bd5" roughness={0.7} />
      </instancedMesh>
      <instancedMesh ref={backRef} args={[backGeo, undefined, seats.length]} castShadow receiveShadow>
        <meshStandardMaterial color="#4f5bd5" roughness={0.7} />
      </instancedMesh>
      <instancedMesh ref={legRef} args={[legGeo, undefined, seats.length]} castShadow>
        <meshStandardMaterial color="#d1d5db" metalness={0.4} roughness={0.4} />
      </instancedMesh>
    </group>
  );
}

export function Crowd() {
  const data = useMemo(buildCrowd, []);

  return (
    <group>
      <Chairs seats={data.seats} />
      <CrowdInstances people={data.seated} pose="sit" />
      <CrowdInstances people={data.standing} pose="stand" />
      {data.animated.map((spec, i) => (
        <Person key={i} spec={spec} animated phase={i * 2.1} />
      ))}

      {/* Collisions de la foule : un bloc par rangée de sièges, un cylindre par PNJ debout. */}
      <RigidBody type="fixed" colliders={false}>
        {data.rowBlocks.map((b, i) => (
          <CuboidCollider key={`row-${i}`} args={[b.halfWidth, 0.7, 0.45]} position={[b.x, 0.7, b.z]} />
        ))}
        {[...data.standing, ...data.animated]
          .filter((p) => p.pose === 'stand')
          .map((p, i) => (
            <CylinderCollider key={`p-${i}`} args={[0.9, 0.28]} position={[p.position[0], 0.9, p.position[2]]} />
          ))}
      </RigidBody>
    </group>
  );
}

'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { Text } from '@react-three/drei';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { BoxGeometry, InstancedMesh, Matrix4, Quaternion, Vector3 } from 'three';
import { BRAND, HALF_D, HALF_W } from '@/lib/layout';
import { getRestroomSignTexture, getWoodTexture } from './brandTextures';
import { Plant } from './Decor';
import { FONT_BOLD } from './Hall';

/* Bloc toilettes intégré au hall : bardage à lames bois, portes modernes, signalétique rétroéclairée. */

export const TOILETS = { minX: HALF_W - 9, maxX: HALF_W, minZ: HALF_D - 11, maxZ: HALF_D } as const;

const H = 3.2;
const DOORS = [
  { z: TOILETS.minZ + 3.2, kind: 'man' as const },
  { z: TOILETS.minZ + 7.6, kind: 'woman' as const },
];
const FIN_Z = (DOORS[0].z + DOORS[1].z) / 2;

/** Lames verticales de bardage le long d'une ligne, avec ouvertures. */
function SlatWall({
  from,
  to,
  axis,
  at,
  gaps = [],
}: {
  from: number;
  to: number;
  /** 'z' = lames réparties le long de Z (façade), 'x' = le long de X. */
  axis: 'x' | 'z';
  /** Coordonnée fixe de la ligne de lames. */
  at: number;
  gaps?: [number, number][];
}) {
  const ref = useRef<InstancedMesh>(null);
  const positions = useMemo(() => {
    const out: number[] = [];
    for (let v = from + 0.06; v < to - 0.03; v += 0.14) {
      if (!gaps.some(([a, b]) => v > a && v < b)) out.push(v);
    }
    return out;
  }, [from, to, gaps]);
  const geo = useMemo(() => (axis === 'z' ? new BoxGeometry(0.05, H - 0.15, 0.07) : new BoxGeometry(0.07, H - 0.15, 0.05)), [axis]);
  const map = useMemo(() => getWoodTexture(), []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new Matrix4();
    const q = new Quaternion();
    const s = new Vector3(1, 1, 1);
    positions.forEach((v, i) => {
      const p = axis === 'z' ? new Vector3(at, (H - 0.15) / 2, v) : new Vector3(v, (H - 0.15) / 2, at);
      m.compose(p, q, s);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [positions, axis, at]);

  useLayoutEffect(() => () => geo.dispose(), [geo]);

  return (
    <instancedMesh key={positions.length} ref={ref} args={[geo, undefined, positions.length]} castShadow receiveShadow>
      <meshStandardMaterial map={map} roughness={0.6} />
    </instancedMesh>
  );
}

function Door({ z, kind }: { z: number; kind: 'man' | 'woman' }) {
  const x = TOILETS.minX;
  const sign = useMemo(() => getRestroomSignTexture(kind), [kind]);
  return (
    <group>
      {/* Encadrement */}
      <mesh position={[x - 0.03, 1.25, z]}>
        <boxGeometry args={[0.08, 2.5, 1.3]} />
        <meshStandardMaterial color="#1f2937" roughness={0.5} />
      </mesh>
      {/* Vantail anthracite mat */}
      <mesh position={[x - 0.08, 1.2, z]} castShadow>
        <boxGeometry args={[0.05, 2.36, 1.12]} />
        <meshStandardMaterial color="#374151" roughness={0.55} />
      </mesh>
      {/* Poignée bâton inox */}
      <mesh position={[x - 0.14, 1.15, z + 0.42]}>
        <cylinderGeometry args={[0.018, 0.018, 0.9, 10]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Pictogramme rétroéclairé */}
      <mesh position={[x - 0.125, 2.75, z]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.46, 0.46]} />
        <meshBasicMaterial map={sign} toneMapped={false} />
      </mesh>
      <mesh position={[x - 0.1, 2.75, z]}>
        <boxGeometry args={[0.03, 0.52, 0.52]} />
        <meshBasicMaterial color={BRAND.primary} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function Restrooms() {
  const { minX, maxX, minZ, maxZ } = TOILETS;
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  const doorGaps = DOORS.map((d): [number, number] => [d.z - 0.7, d.z + 0.7]);

  return (
    <group>
      {/* Volume intérieur blanc */}
      <mesh position={[minX + 0.1, H / 2, cz]} receiveShadow>
        <boxGeometry args={[0.2, H, maxZ - minZ]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
      </mesh>
      <mesh position={[cx, H / 2, minZ + 0.1]} receiveShadow>
        <boxGeometry args={[maxX - minX, H, 0.2]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
      </mesh>
      {/* Bardage bois sur les deux faces visibles */}
      <SlatWall from={minZ} to={maxZ} axis="z" at={minX - 0.04} gaps={doorGaps} />
      <SlatWall from={minX} to={maxX} axis="x" at={minZ - 0.04} />

      {/* Corniche bleu nuit + bandeau LED + signalétique */}
      <mesh position={[cx - 0.1, H + 0.15, cz - 0.1]} castShadow>
        <boxGeometry args={[maxX - minX + 0.3, 0.32, maxZ - minZ + 0.3]} />
        <meshStandardMaterial color={BRAND.dark} roughness={0.6} />
      </mesh>
      <mesh position={[minX - 0.26, H - 0.04, cz]}>
        <boxGeometry args={[0.02, 0.04, maxZ - minZ]} />
        <meshBasicMaterial color="#9cc8fb" toneMapped={false} />
      </mesh>
      <mesh position={[cx, H - 0.04, minZ - 0.26]}>
        <boxGeometry args={[maxX - minX, 0.04, 0.02]} />
        <meshBasicMaterial color="#9cc8fb" toneMapped={false} />
      </mesh>
      <Text
        font={FONT_BOLD}
        position={[minX - 0.27, H + 0.15, cz]}
        rotation={[0, -Math.PI / 2, 0]}
        fontSize={0.2}
        letterSpacing={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        RESTROOMS · TOILETTES
      </Text>

      {DOORS.map((d) => (
        <Door key={d.kind} z={d.z} kind={d.kind} />
      ))}

      {/* Paroi d'intimité entre les deux portes */}
      <mesh position={[minX - 0.8, 1.3, FIN_Z]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 2.6, 0.12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.7} />
      </mesh>
      <mesh position={[minX - 0.8, 0.25, FIN_Z]} castShadow>
        <boxGeometry args={[1.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.45} />
      </mesh>
      {[-0.45, 0, 0.45].map((dx) => (
        <mesh key={dx} position={[minX - 0.8 + dx, 0.68, FIN_Z]} castShadow>
          <sphereGeometry args={[0.26, 14, 10]} />
          <meshStandardMaterial color="#5f9468" roughness={0.9} />
        </mesh>
      ))}

      <Plant position={[minX - 0.9, 0, minZ + 0.9]} kind="tall" />
      <Plant position={[minX - 0.7, 0, maxZ - 0.9]} kind="snake" />

      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[(maxX - minX) / 2 + 0.05, H / 2, (maxZ - minZ) / 2 + 0.05]} position={[cx, H / 2, cz]} />
        <CuboidCollider args={[0.75, 1.3, 0.25]} position={[minX - 0.8, 1.3, FIN_Z]} />
      </RigidBody>
    </group>
  );
}

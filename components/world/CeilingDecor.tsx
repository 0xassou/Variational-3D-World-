'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { AdditiveBlending, BackSide, BoxGeometry, DoubleSide, InstancedMesh, Matrix4, Quaternion, Vector3 } from 'three';
import { CONTENT } from '@/lib/content';
import { BRAND, HALF_D, HALL, interactivePoint, METRICS_STAND, STAND_SIZE, STANDS, standToWorld } from '@/lib/layout';
import { LOUNGES } from './Amenities';
import { getHangingSignTexture } from './brandTextures';

/* Décor de plafond : poutres, ponts lumineux, halo, enseignes suspendues, suspensions. */

const H = HALL.height;
const METAL = '#cbd5e1';
const DARK_METAL = '#334155';

type Vec3 = [number, number, number];

/** Câble vertical entre le plafond et un point suspendu. */
function Cable({ from }: { from: Vec3 }) {
  const len = H - from[1];
  return (
    <mesh position={[from[0], from[1] + len / 2, from[2]]}>
      <cylinderGeometry args={[0.012, 0.012, len, 4]} />
      <meshBasicMaterial color="#94a3b8" />
    </mesh>
  );
}

/** Projecteur orientable avec lentille lumineuse et faisceau additif très doux. */
function Spot({ position, tilt = 0, yaw = 0, beam = 5 }: { position: Vec3; tilt?: number; yaw?: number; beam?: number }) {
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <group rotation={[tilt, 0, 0]}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.14, 0.32, 16]} />
          <meshStandardMaterial color={DARK_METAL} metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.345, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.12, 20]} />
          <meshBasicMaterial color="#fff7e6" toneMapped={false} side={DoubleSide} />
        </mesh>
        <mesh position={[0, -0.35 - beam / 2, 0]}>
          <coneGeometry args={[beam * 0.22, beam, 24, 1, true]} />
          <meshBasicMaterial
            color="#fff4d6"
            transparent
            opacity={0.028}
            blending={AdditiveBlending}
            depthWrite={false}
            side={DoubleSide}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

/** Pont lumineux (truss) en échelle : deux longerons + barreaux instanciés, le long de l'axe X local. */
function Truss({ position, length, rotationY = 0, spots = 6, spotTilt = 0 }: { position: Vec3; length: number; rotationY?: number; spots?: number; spotTilt?: number }) {
  const rungRef = useRef<InstancedMesh>(null);
  const rungCount = Math.floor(length / 0.6);
  const rungGeo = useMemo(() => new BoxGeometry(0.03, 0.03, 0.42), []);

  useLayoutEffect(() => {
    const mesh = rungRef.current;
    if (!mesh) return;
    const m = new Matrix4();
    const q = new Quaternion();
    const s = new Vector3(1, 1, 1);
    for (let i = 0; i < rungCount; i++) {
      const x = -length / 2 + 0.3 + i * 0.6;
      m.compose(new Vector3(x, i % 2 ? 0.2 : -0.2, 0), q, s);
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [length, rungCount]);

  useLayoutEffect(() => () => rungGeo.dispose(), [rungGeo]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {[
        [0.2, 0.2],
        [0.2, -0.2],
        [-0.2, 0.2],
        [-0.2, -0.2],
      ].map(([y, z]) => (
        <mesh key={`${y}${z}`} position={[0, y, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, length, 8]} />
          <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      <instancedMesh ref={rungRef} args={[rungGeo, undefined, rungCount]}>
        <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.3} />
      </instancedMesh>
      {Array.from({ length: spots }, (_, i) => (
        <Spot key={i} position={[-length / 2 + (length / (spots + 1)) * (i + 1), -0.25, 0]} tilt={spotTilt} />
      ))}
    </group>
  );
}

function Beams() {
  return (
    <group>
      {[-30, -18, -6, 6, 18, 30].map((z) => (
        <mesh key={z} position={[0, H - 0.3, z]} castShadow>
          <boxGeometry args={[HALL.width, 0.6, 0.4]} />
          <meshStandardMaterial color="#bcc6d1" roughness={0.8} />
        </mesh>
      ))}
      {[-16, 16].map((x) => (
        <mesh key={x} position={[x, H - 0.2, 0]}>
          <boxGeometry args={[0.35, 0.4, HALL.depth]} />
          <meshStandardMaterial color="#bcc6d1" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/** Halo lumineux suspendu au-dessus du stand Live Metrics. */
function Halo() {
  const { x, z } = METRICS_STAND;
  const y = 9.6;
  return (
    <group position={[x, y, z]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[5, 0.16, 12, 96]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
        <torusGeometry args={[5, 0.05, 8, 96]} />
        <meshBasicMaterial color={BRAND.primary} toneMapped={false} />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        return <Cable key={i} from={[Math.sin(a) * 5, 0, Math.cos(a) * 5]} />;
      })}
    </group>
  );
}

/** Enseigne circulaire suspendue au-dessus d'un stand. */
function HangingSign({ position, title, number, accent }: { position: Vec3; title: string; number: string; accent: string }) {
  const map = useMemo(() => getHangingSignTexture(title, number, accent), [title, number, accent]);
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[1.9, 1.9, 1.1, 64, 1, true]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
      {/* Doublure intérieure unie : évite de voir le texte à l'envers à travers l'enseigne. */}
      <mesh>
        <cylinderGeometry args={[1.88, 1.88, 1.1, 64, 1, true]} />
        <meshStandardMaterial color="#e2e8f0" side={BackSide} />
      </mesh>
      {[0.56, -0.56].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.9, 0.03, 6, 64]} />
          <meshStandardMaterial color={DARK_METAL} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2;
        return <Cable key={i} from={[Math.sin(a) * 1.9, 0.55, Math.cos(a) * 1.9]} />;
      })}
    </group>
  );
}

/** Grappe de suspensions globes au-dessus d'un salon (ambiance chaleureuse). */
function PendantCluster({ position }: { position: Vec3 }) {
  const lamps: Vec3[] = [
    [0, 4.2, 0],
    [0.55, 4.6, 0.3],
    [-0.5, 4.8, -0.35],
    [0.2, 5.1, -0.6],
    [-0.3, 4.4, 0.55],
  ];
  return (
    <group position={position}>
      {lamps.map((p, i) => (
        <group key={i}>
          <Cable from={[p[0], p[1] + 0.18, p[2]]} />
          <mesh position={p}>
            <sphereGeometry args={[0.2, 20, 14]} />
            <meshStandardMaterial color="#fff1d6" emissive="#ffd9a0" emissiveIntensity={1.4} roughness={0.2} />
          </mesh>
          <mesh position={[p[0], p[1] + 0.2, p[2]]}>
            <cylinderGeometry args={[0.05, 0.05, 0.06, 10]} />
            <meshStandardMaterial color="#b08d57" metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function CeilingDecor() {
  const stage = interactivePoint('stage');
  return (
    <group>
      <Beams />

      {/* Pont de face de scène, projecteurs orientés vers l'estrade */}
      <Truss position={[0, 10.6, -27]} length={26} spots={8} spotTilt={0.45} />
      {[-12, 0, 12].map((x) => (
        <Cable key={x} from={[x, 10.8, -27]} />
      ))}
      {/* Ponts latéraux au-dessus des allées */}
      {[-12, 12].map((x) => (
        <group key={x}>
          <Truss position={[x, 11.2, 4]} length={40} rotationY={Math.PI / 2} spots={7} />
          {[-12, 4, 20].map((z) => (
            <Cable key={z} from={[x, 11.4, z]} />
          ))}
        </group>
      ))}

      <Halo />

      {/* Enseignes suspendues au-dessus des stands */}
      {STANDS.map((s) => {
        const c = CONTENT[s.id];
        const [hx, hz] = standToWorld(s, STAND_SIZE.depth / 2 - 1.6, 0);
        return (
          <HangingSign
            key={s.id}
            position={[hx, 8.6, hz]}
            title={c.signTitle}
            number={c.number ?? ''}
            accent={c.accent}
          />
        );
      })}
      <HangingSign position={[METRICS_STAND.x, 7.6, METRICS_STAND.z]} title="Live Metrics" number="LIVE" accent={BRAND.dark} />
      <HangingSign position={[stage.x + 2, 8.4, stage.z + 3]} title="Main Stage" number="★" accent={BRAND.primary} />

      {LOUNGES.map((l) => (
        <PendantCluster key={`${l.x}-${l.z}`} position={[l.x, 0, l.z - 0.4]} />
      ))}

      {/* Lumières chaudes d'ambiance (sans ombres) */}
      <pointLight position={[-9, 6, 21]} color="#ffd9a0" intensity={18} distance={14} decay={2} />
      <pointLight position={[9, 6, 21]} color="#ffd9a0" intensity={18} distance={14} decay={2} />
      <pointLight position={[-27, 4.5, HALF_D - 10]} color="#ffcf8f" intensity={22} distance={12} decay={2} />
    </group>
  );
}

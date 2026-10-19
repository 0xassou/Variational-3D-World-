'use client';

import { useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { BRAND } from '@/lib/layout';

export interface AvatarMotion {
  /** Vitesse horizontale normalisée (0 = arrêt, 1 = marche, ~1.8 = course). */
  speed: number;
}

const SKIN = '#e9b996';
const JACKET = BRAND.primary;
const PANTS = '#1f2937';

/** Avatar du joueur : pieds en y = 0, regarde vers +Z. Animation de marche procédurale. */
export function Avatar({ motion }: { motion: RefObject<AvatarMotion> }) {
  const legL = useRef<Group>(null);
  const legR = useRef<Group>(null);
  const armL = useRef<Group>(null);
  const armR = useRef<Group>(null);
  const body = useRef<Group>(null);
  const phase = useRef(0);

  useFrame((_, dt) => {
    const speed = motion.current?.speed ?? 0;
    phase.current += dt * (4 + speed * 5) * Math.min(speed * 3, 1);
    const swing = Math.sin(phase.current) * Math.min(speed, 1.6) * 0.55;
    if (legL.current) legL.current.rotation.x = swing;
    if (legR.current) legR.current.rotation.x = -swing;
    if (armL.current) armL.current.rotation.x = -swing * 0.8;
    if (armR.current) armR.current.rotation.x = swing * 0.8;
    if (body.current) body.current.position.y = Math.abs(Math.cos(phase.current)) * 0.04 * Math.min(speed, 1.5);
  });

  return (
    <group ref={body}>
      {/* Jambes (pivot à la hanche) */}
      {[
        { ref: legL, x: -0.1 },
        { ref: legR, x: 0.1 },
      ].map(({ ref, x }) => (
        <group key={x} ref={ref} position={[x, 0.9, 0]}>
          <mesh position={[0, -0.43, 0]} castShadow>
            <capsuleGeometry args={[0.076, 0.66, 4, 10]} />
            <meshStandardMaterial color={PANTS} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.85, 0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <capsuleGeometry args={[0.055, 0.16, 4, 8]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} />
          </mesh>
        </group>
      ))}
      {/* Torse */}
      <mesh position={[0, 1.18, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.42, 4, 16]} />
        <meshStandardMaterial color={JACKET} roughness={0.6} />
      </mesh>
      {/* Badge conférence */}
      <mesh position={[0.1, 1.28, 0.215]}>
        <planeGeometry args={[0.12, 0.08]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Bras (pivot à l'épaule) */}
      {[
        { ref: armL, x: -0.3 },
        { ref: armR, x: 0.3 },
      ].map(({ ref, x }) => (
        <group key={x} ref={ref} position={[x, 1.45, 0]}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <capsuleGeometry args={[0.07, 0.42, 4, 8]} />
            <meshStandardMaterial color={JACKET} roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.6, 0]} castShadow>
            <sphereGeometry args={[0.065, 12, 8]} />
            <meshStandardMaterial color={SKIN} />
          </mesh>
        </group>
      ))}
      {/* Tête */}
      <mesh position={[0, 1.66, 0]} castShadow>
        <sphereGeometry args={[0.14, 20, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.69, -0.01]} castShadow>
        <sphereGeometry args={[0.148, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2b1d14" roughness={0.9} />
      </mesh>
      {/* Indicateur joueur au sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.42, 0.5, 40]} />
        <meshBasicMaterial color={JACKET} transparent opacity={0.6} depthWrite={false} />
      </mesh>
    </group>
  );
}

'use client';

import { useMemo, useRef, type ReactNode } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import type { Group, Mesh, MeshStandardMaterial } from 'three';
import type { InteractiveId } from '@/lib/content';
import { t } from '@/lib/i18n';
import { useWorld } from '@/lib/store';
import { getKioskTexture } from './brandTextures';
import { LogoPlane } from './Logo';

/** Ouvre le modal si le joueur est à portée, sinon affiche un rappel. */
export function tryInteract(id: InteractiveId) {
  const { nearbyId, activeId, started, open, showToast, lang } = useWorld.getState();
  if (!started || activeId) return;
  if (nearbyId === id) open(id);
  else showToast(t('tooFar', lang));
}

/** Props d'événements à étaler sur n'importe quel groupe cliquable (clic vs glisser caméra). */
export function interactiveHandlers(id: InteractiveId) {
  return {
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      // `delta` = distance parcourue par le pointeur depuis le pointerdown : on ignore les glisser-caméra.
      if (e.delta > 6) return;
      tryInteract(id);
    },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      document.body.style.cursor = 'pointer';
    },
    onPointerOut: () => {
      document.body.style.cursor = '';
    },
  };
}

interface KioskProps {
  id: InteractiveId;
  accent: string;
  label: string;
  position: [number, number, number];
  rotationY?: number;
  children?: ReactNode;
}

/** Borne interactive : totem avec écran incliné, anneau au sol et marqueur flottant à proximité. */
export function Kiosk({ id, accent, label, position, rotationY = 0 }: KioskProps) {
  const isNear = useWorld((s) => s.nearbyId === id);
  const marker = useRef<Group>(null);
  const crystal = useRef<MeshStandardMaterial>(null);
  const ring = useRef<Mesh>(null);
  const screenMap = useMemo(() => getKioskTexture(accent, label), [accent, label]);

  useFrame(({ clock }, dt) => {
    const time = clock.elapsedTime;
    if (marker.current) {
      // Cristal « Plumbob » : toujours visible, flotte et tourne ; grossit et brille à portée.
      const target = isNear ? 1.25 : 1;
      const s = marker.current.scale.x + (target - marker.current.scale.x) * Math.min(1, dt * 6);
      marker.current.scale.setScalar(s);
      marker.current.position.y = 2.75 + Math.sin(time * 1.8 + position[0]) * 0.1;
      marker.current.rotation.y = time * 0.9;
    }
    if (crystal.current) {
      crystal.current.emissiveIntensity = (isNear ? 1.1 : 0.55) + Math.sin(time * 3) * 0.15;
    }
    if (ring.current) {
      const mat = ring.current.material as MeshStandardMaterial;
      mat.opacity = isNear ? 0.55 + Math.sin(time * 4) * 0.2 : 0.18;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group {...interactiveHandlers(id)}>
        {/* Socle */}
        <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.48, 0.1, 32]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.4} />
        </mesh>
        {/* Colonne */}
        <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 1.3, 0.3]} />
          <meshStandardMaterial color="#ffffff" roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.45, 0.152]}>
          <boxGeometry args={[0.08, 0.7, 0.01]} />
          <meshStandardMaterial color={accent} />
        </mesh>
        {/* Logo sur la colonne */}
        <LogoPlane variant="onLight" width={0.42} position={[0, 1.02, 0.156]} />
        {/* Écran incliné avec visuel de marque */}
        <group position={[0, 1.42, 0.05]} rotation={[-0.45, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.85, 0.58, 0.06]} />
            <meshStandardMaterial color="#1f2937" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.032]}>
            <planeGeometry args={[0.79, 0.525]} />
            <meshBasicMaterial map={screenMap} toneMapped={false} />
          </mesh>
        </group>
      </group>

      {/* Anneau de proximité */}
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[0.95, 1.1, 48]} />
        <meshStandardMaterial color={accent} transparent opacity={0.18} depthWrite={false} />
      </mesh>

      {/* Cristal vert type « Plumbob » (Les Sims) : indicateur d'interactivité */}
      <group ref={marker} position={[0, 2.75, 0]}>
        <mesh scale={[1, 1.9, 1]} castShadow>
          <octahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial
            ref={crystal}
            color="#3ee07a"
            emissive="#1fd65f"
            emissiveIntensity={0.55}
            roughness={0.15}
            metalness={0.1}
            transparent
            opacity={0.92}
            flatShading
          />
        </mesh>
        {/* Halo doux */}
        <mesh scale={[1, 1.9, 1]}>
          <octahedronGeometry args={[0.27, 0]} />
          <meshBasicMaterial color="#5cff9a" transparent opacity={0.16} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>

      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.45, 0.9, 0.3]} position={[0, 0.9, 0]} />
      </RigidBody>
    </group>
  );
}

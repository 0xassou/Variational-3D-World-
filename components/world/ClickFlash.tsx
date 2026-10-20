'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, type Mesh, type MeshBasicMaterial, type PointLight } from 'three';
import { onFlash, type FlashEvent } from '@/lib/fx';

const DURATION = 0.6;

/** Un flash : sphère lumineuse qui s'étend, anneau d'onde et lumière ponctuelle qui décroît. */
function Flash({ event, onDone }: { event: FlashEvent; onDone: (id: number) => void }) {
  const glow = useRef<Mesh>(null);
  const ring = useRef<Mesh>(null);

  useFrame(({ camera }) => {
    const k = (performance.now() - event.start) / 1000 / DURATION;
    if (k >= 1) {
      onDone(event.id);
      return;
    }
    const ease = 1 - Math.pow(1 - k, 3);
    if (glow.current) {
      glow.current.scale.setScalar(0.15 + ease * 0.55);
      (glow.current.material as MeshBasicMaterial).opacity = 0.55 * (1 - k);
    }
    if (ring.current) {
      ring.current.scale.setScalar(0.2 + ease * 1.4);
      (ring.current.material as MeshBasicMaterial).opacity = 0.7 * (1 - k);
    }
    // L'anneau fait toujours face à la caméra.
    if (ring.current) ring.current.lookAt(camera.position);
  });

  return (
    <group position={event.position}>
      <mesh ref={glow}>
        <sphereGeometry args={[1, 20, 14]} />
        <meshBasicMaterial color={event.color} transparent opacity={0.5} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.85, 1, 40]} />
        <meshBasicMaterial color={event.color} transparent opacity={0.7} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Affiche les flashs émis par `flashAt` (clics sur bornes, stands, boutons 3D). */
export function ClickFlash() {
  const [events, setEvents] = useState<FlashEvent[]>([]);
  // Une seule lumière persistante (ajouter/retirer des lumières forcerait la recompilation des shaders).
  const light = useRef<PointLight>(null);
  const last = useRef<FlashEvent | null>(null);

  useFrame(() => {
    const l = light.current;
    const e = last.current;
    if (!l) return;
    const k = e ? (performance.now() - e.start) / 1000 / DURATION : 1;
    l.intensity = k < 1 ? 16 * (1 - k) : 0;
  });

  useEffect(
    () =>
      onFlash((e) => {
        // Au plus 4 flashs simultanés.
        last.current = e;
        if (light.current) {
          light.current.position.set(...e.position);
          light.current.color.set(e.color);
        }
        setEvents((list) => [...list.slice(-3), e]);
      }),
    [],
  );

  const remove = (id: number) => setEvents((list) => list.filter((e) => e.id !== id));

  return (
    <>
      <pointLight ref={light} intensity={0} distance={5} decay={2} />
      {events.map((e) => (
        <Flash key={e.id} event={e} onDone={remove} />
      ))}
    </>
  );
}

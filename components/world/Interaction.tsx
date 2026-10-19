'use client';

import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import type { InteractiveId } from '@/lib/content';
import { INTERACTIVE_POINTS } from '@/lib/layout';
import { playerState, useWorld } from '@/lib/store';

/**
 * Détection de proximité : à chaque frame, trouve la borne la plus proche du joueur
 * dans son rayon de déclenchement. Gère aussi les raccourcis E (interagir) et Échap (fermer).
 */
export function Interaction() {
  useFrame(() => {
    const p = playerState.position;
    let best: InteractiveId | null = null;
    let bestDist = Infinity;
    for (const pt of INTERACTIVE_POINTS) {
      const d = Math.hypot(p.x - pt.x, p.z - pt.z);
      if (d < pt.radius && d < bestDist) {
        best = pt.id;
        bestDist = d;
      }
    }
    useWorld.getState().setNearby(best);
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const { activeId, nearbyId, started, open, close } = useWorld.getState();
      if (e.code === 'Escape' && activeId) {
        close();
      } else if (e.code === 'KeyE' && started && !activeId && nearbyId) {
        open(nearbyId);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return null;
}

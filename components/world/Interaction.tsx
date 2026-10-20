'use client';

import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import type { InteractiveId } from '@/lib/content';
import { INTERACTIVE_POINTS } from '@/lib/layout';
import { audio } from '@/lib/audio';
import { FLASH_LEAD_MS, flashAt } from '@/lib/fx';
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
        // Flash sur la borne la plus proche portant cet identifiant.
        const p = playerState.position;
        const kiosk = INTERACTIVE_POINTS.filter((pt) => pt.id === nearbyId).sort(
          (a, b) => Math.hypot(p.x - a.x, p.z - a.z) - Math.hypot(p.x - b.x, p.z - b.z),
        )[0];
        audio.click();
        if (kiosk) flashAt([kiosk.x, 1.5, kiosk.z]);
        const id = nearbyId;
        setTimeout(() => {
          if (!useWorld.getState().activeId) open(id);
        }, FLASH_LEAD_MS);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return null;
}

'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { audio } from '@/lib/audio';
import { readSoundPref, useWorld } from '@/lib/store';
import { HUD } from './ui/HUD';
import { Modal } from './ui/Modal';

// Three.js / Rapier (WASM) ne s'exécutent que côté navigateur.
const Experience = dynamic(() => import('./Experience'), { ssr: false });

const METRICS_REFRESH_MS = 60_000;

export default function World() {
  const loadMetrics = useWorld((s) => s.loadMetrics);

  // Préférence son lue après hydratation (évite un écart entre rendu serveur et client).
  useEffect(() => {
    useWorld.setState({ soundOn: readSoundPref() });
  }, []);

  // Retour au clic sur l'UI 2D : petit « pop » + halo lumineux sur le bouton ou lien cliqué.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('button, a, [role=tab], [role=radio]');
      if (!el || el.dataset.silent !== undefined) return;
      audio.click();
      el.animate(
        [
          { boxShadow: '0 0 0 0 rgba(76, 154, 248, 0.65)', filter: 'brightness(1.25)' },
          { boxShadow: '0 0 0 12px rgba(76, 154, 248, 0)', filter: 'brightness(1)' },
        ],
        { duration: 450, easing: 'ease-out' },
      );
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // Métriques live (stand central + pop-up) : chargement initial puis rafraîchissement périodique.
  useEffect(() => {
    void loadMetrics();
    const id = setInterval(() => void loadMetrics(), METRICS_REFRESH_MS);
    return () => clearInterval(id);
  }, [loadMetrics]);

  return (
    <main className="relative h-dvh w-screen overflow-hidden">
      <Experience />
      <HUD />
      <Modal />
    </main>
  );
}

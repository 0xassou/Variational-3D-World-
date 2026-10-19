'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useWorld } from '@/lib/store';
import { HUD } from './ui/HUD';
import { Modal } from './ui/Modal';

// Three.js / Rapier (WASM) ne s'exécutent que côté navigateur.
const Experience = dynamic(() => import('./Experience'), { ssr: false });

const METRICS_REFRESH_MS = 60_000;

export default function World() {
  const loadMetrics = useWorld((s) => s.loadMetrics);

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

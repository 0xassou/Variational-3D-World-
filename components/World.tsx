'use client';

import dynamic from 'next/dynamic';
import { HUD } from './ui/HUD';
import { Modal } from './ui/Modal';

// Three.js / Rapier (WASM) ne s'exécutent que côté navigateur.
const Experience = dynamic(() => import('./Experience'), { ssr: false });

export default function World() {
  return (
    <main className="relative h-dvh w-screen overflow-hidden">
      <Experience />
      <HUD />
      <Modal />
    </main>
  );
}

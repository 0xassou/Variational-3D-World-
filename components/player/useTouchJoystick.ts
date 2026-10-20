'use client';

import { useEffect, useRef } from 'react';
import { useWorld } from '@/lib/store';

export interface TouchStick {
  /** Direction normalisée : x vers la droite de l'écran, y vers le haut (avant). */
  x: number;
  y: number;
  /** Intensité 0–1 (au-delà de 1 : course). */
  strength: number;
  active: boolean;
}

/** Rayon du joystick virtuel invisible (px) et zone morte avant de bouger. */
const RADIUS = 60;
const DEAD_ZONE = 10;

/**
 * Joystick virtuel tactile (invisible) : on pose le doigt n'importe où dans la scène, on maintient
 * et on glisse dans la direction voulue. Un tap court reste un clic (bornes, liens).
 * Un second doigt sert à tourner la caméra (géré par l'orbite).
 */
export function useTouchJoystick() {
  const stick = useRef<TouchStick>({ x: 0, y: 0, strength: 0, active: false });
  const pointerId = useRef<number | null>(null);

  useEffect(() => {
    let originX = 0;
    let originY = 0;

    const reset = () => {
      pointerId.current = null;
      stick.current = { x: 0, y: 0, strength: 0, active: false };
    };

    const inWorld = (e: Event) => !!(e.target as HTMLElement | null)?.closest?.('[data-world]');

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'touch' || pointerId.current !== null) return;
      if (!inWorld(e) || useWorld.getState().activeId) return;
      pointerId.current = e.pointerId;
      originX = e.clientX;
      originY = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== pointerId.current) return;
      const dx = e.clientX - originX;
      const dy = e.clientY - originY;
      const dist = Math.hypot(dx, dy);
      if (dist < DEAD_ZONE) {
        stick.current = { x: 0, y: 0, strength: 0, active: false };
        return;
      }
      stick.current = { x: dx / dist, y: -dy / dist, strength: dist / RADIUS, active: true };
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId === pointerId.current) reset();
    };

    // Ouvrir un pop-up relâche le joystick.
    const unsub = useWorld.subscribe((s) => {
      if (s.activeId && pointerId.current !== null) reset();
    });

    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('blur', reset);
    return () => {
      unsub();
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('blur', reset);
    };
  }, []);

  return { stick, pointerId };
}

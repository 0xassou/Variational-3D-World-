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

/** Rayon du joystick virtuel (px) et zone morte avant de bouger. */
const RADIUS = 60;
const DEAD_ZONE = 10;

/**
 * Joystick virtuel tactile : on pose le doigt n'importe où dans la scène, on maintient
 * et on glisse dans la direction voulue. Un tap court reste un clic (bornes, liens).
 * Un second doigt sert à tourner la caméra (géré par l'orbite).
 */
export function useTouchJoystick() {
  const stick = useRef<TouchStick>({ x: 0, y: 0, strength: 0, active: false });
  const pointerId = useRef<number | null>(null);

  useEffect(() => {
    let originX = 0;
    let originY = 0;

    // Visuel discret créé à la volée (pas de re-render React à chaque mouvement).
    const base = document.createElement('div');
    base.setAttribute('aria-hidden', 'true');
    base.style.cssText = `position:fixed;z-index:25;width:${RADIUS * 2}px;height:${RADIUS * 2}px;margin:-${RADIUS}px 0 0 -${RADIUS}px;border-radius:9999px;background:rgba(255,255,255,0.35);border:2px solid rgba(47,128,237,0.55);box-shadow:0 4px 18px rgba(11,31,58,0.18);pointer-events:none;display:none;`;
    const knob = document.createElement('div');
    knob.style.cssText =
      'position:absolute;left:50%;top:50%;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:9999px;background:rgba(47,128,237,0.85);box-shadow:0 2px 8px rgba(11,31,58,0.3);';
    base.appendChild(knob);
    document.body.appendChild(base);

    const reset = () => {
      pointerId.current = null;
      stick.current = { x: 0, y: 0, strength: 0, active: false };
      base.style.display = 'none';
    };

    const inWorld = (e: Event) => !!(e.target as HTMLElement | null)?.closest?.('[data-world]');

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'touch' || pointerId.current !== null) return;
      if (!inWorld(e) || useWorld.getState().activeId) return;
      pointerId.current = e.pointerId;
      originX = e.clientX;
      originY = e.clientY;
      base.style.left = `${originX}px`;
      base.style.top = `${originY}px`;
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
      const k = Math.min(dist, RADIUS) / dist;
      knob.style.transform = `translate(${dx * k}px, ${dy * k}px)`;
      base.style.display = 'block';
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
      base.remove();
    };
  }, []);

  return { stick, pointerId };
}

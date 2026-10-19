'use client';

import { useEffect, useRef } from 'react';

export interface MoveKeys {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  run: boolean;
}

/**
 * Mapping basé sur `event.code` (position physique de la touche) :
 * ZQSD sur AZERTY et WASD sur QWERTY correspondent aux mêmes codes KeyW/KeyA/KeyS/KeyD.
 */
const CODE_MAP: Record<string, keyof MoveKeys> = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
  ShiftLeft: 'run',
  ShiftRight: 'run',
};

const EMPTY: MoveKeys = { forward: false, backward: false, left: false, right: false, run: false };

function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
}

/** État clavier mutable (ref), lu dans useFrame sans re-render. */
export function useMoveKeys() {
  const keys = useRef<MoveKeys>({ ...EMPTY });

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      const action = CODE_MAP[e.code];
      if (!action) return;
      if (e.code.startsWith('Arrow')) e.preventDefault();
      keys.current[action] = true;
    };
    const onUp = (e: KeyboardEvent) => {
      const action = CODE_MAP[e.code];
      if (action) keys.current[action] = false;
    };
    // Évite les touches « collées » quand la fenêtre perd le focus.
    const reset = () => {
      keys.current = { ...EMPTY };
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', reset);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', reset);
    };
  }, []);

  return keys;
}

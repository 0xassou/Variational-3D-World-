/** Bus d'effets visuels : flash lumineux 3D à l'endroit d'un clic interactif. */

export interface FlashEvent {
  id: number;
  position: [number, number, number];
  color: string;
  start: number;
}

/** Délai entre le flash et l'ouverture d'un pop-up (la 3D se met en pause pendant la lecture). */
export const FLASH_LEAD_MS = 220;

type Listener = (e: FlashEvent) => void;

const listeners = new Set<Listener>();
let nextId = 1;

export function onFlash(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function flashAt(position: [number, number, number], color = '#4C9AF8') {
  const event: FlashEvent = { id: nextId++, position, color, start: performance.now() };
  listeners.forEach((l) => l(event));
}

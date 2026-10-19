import type { InteractiveId } from './content';

/** Dimensions du hall (unités = mètres). Le hall est centré sur l'origine. */
export const HALL = {
  width: 64,
  depth: 84,
  height: 14,
  wallThickness: 1,
} as const;

export const HALF_W = HALL.width / 2;
export const HALF_D = HALL.depth / 2;

export const STAGE = {
  /** Centre de l'estrade. */
  x: 0,
  z: -35,
  width: 28,
  depth: 12,
  height: 1.2,
  screenWidth: 18,
  screenHeight: 10.125,
  screenY: 8.2,
} as const;

/** Zone public assis devant la scène. */
export const AUDIENCE = {
  rows: 8,
  seatsPerBlock: 10,
  seatSpacing: 1.1,
  rowSpacing: 1.7,
  firstRowZ: -24,
  /** Abscisse du bord intérieur des blocs (allée centrale de 2 × innerX). */
  innerX: 2.2,
} as const;

export type Side = 'left' | 'right';

export interface StandLayout {
  id: Exclude<InteractiveId, 'twitter' | 'stage'>;
  side: Side;
  z: number;
}

export const STANDS: StandLayout[] = [
  { id: 'rfq', side: 'left', z: -6 },
  { id: 'omni', side: 'left', z: 14 },
  { id: 'pro', side: 'right', z: -6 },
  { id: 'tokenomics', side: 'right', z: 14 },
];

export const STAND_SIZE = { width: 12, depth: 8 } as const;

/** Position x du centre d'un stand (adossé au mur latéral). */
export function standCenterX(side: Side): number {
  const x = HALF_W - STAND_SIZE.depth / 2 - 0.5;
  return side === 'left' ? -x : x;
}

export const TWITTER_WALL = { x: -12, z: HALF_D - 0.6, width: 16, height: 6.5 } as const;
export const SPAWN: [number, number, number] = [0, 1.2, 33];

export interface InteractivePoint {
  id: InteractiveId;
  /** Position (x, z) de la borne. */
  x: number;
  z: number;
  radius: number;
}

/** Bornes interactives : distance de déclenchement mesurée sur le plan horizontal. */
export const INTERACTIVE_POINTS: InteractivePoint[] = [
  ...STANDS.map((s) => {
    const cx = standCenterX(s.side);
    const dir = s.side === 'left' ? 1 : -1;
    return { id: s.id, x: cx + dir * (STAND_SIZE.depth / 2 - 0.2), z: s.z + 3.6, radius: 6 };
  }),
  { id: 'stage', x: 14.5, z: STAGE.z + STAGE.depth / 2 + 2.2, radius: 5 },
  { id: 'twitter', x: TWITTER_WALL.x, z: TWITTER_WALL.z - 3.2, radius: 6 },
];

export function interactivePoint(id: InteractiveId): InteractivePoint {
  const p = INTERACTIVE_POINTS.find((pt) => pt.id === id);
  if (!p) throw new Error(`Unknown interactive point: ${id}`);
  return p;
}

/** Générateur pseudo-aléatoire déterministe (mulberry32) pour une foule stable entre rendus. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const BRAND = {
  /** Bleu officiel de l'emblème Variational. */
  primary: '#4C9AF8',
  dark: '#0b1f3a',
  light: '#eaf3fe',
} as const;

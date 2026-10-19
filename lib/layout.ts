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
  screenWidth: 16,
  screenHeight: 9,
  screenY: 7.9,
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

export type StandId = Exclude<InteractiveId, 'twitter' | 'stage' | 'metrics'>;

/**
 * Stand rectangulaire. Repère local : +X = façade (côté visiteurs), Z = largeur du stand.
 * `rotY` oriente ce repère dans le hall ; `zs` (±1) choisit de quel côté de la façade se trouve la borne.
 */
export interface StandLayout {
  id: StandId;
  x: number;
  z: number;
  rotY: number;
  zs: 1 | -1;
}

export const STAND_SIZE = { width: 12, depth: 8 } as const;

const WALL_X = HALF_W - STAND_SIZE.depth / 2 - 0.5;
const BACK_Z = -HALF_D + STAND_SIZE.depth / 2 + 0.5;

/**
 * Parcours de visite : les stands produits (01 → 03, 05) longent l'allée depuis l'entrée,
 * puis Tokenomics (04) et Vision (06) encadrent l'estrade au fond de la salle.
 */
export const STANDS: StandLayout[] = [
  { id: 'rfq', x: -WALL_X, z: 14, rotY: 0, zs: 1 },
  { id: 'omni', x: WALL_X, z: 14, rotY: Math.PI, zs: -1 },
  { id: 'pro', x: -WALL_X, z: -6, rotY: 0, zs: 1 },
  { id: 'swaps', x: WALL_X, z: -6, rotY: Math.PI, zs: -1 },
  { id: 'tokenomics', x: -23, z: BACK_Z, rotY: -Math.PI / 2, zs: -1 },
  { id: 'vision', x: 23, z: BACK_Z, rotY: -Math.PI / 2, zs: 1 },
];

/** Convertit un point du repère local d'un stand (x façade, z largeur) en coordonnées monde (x, z). */
export function standToWorld(s: StandLayout, lx: number, lz: number): [number, number] {
  const c = Math.cos(s.rotY);
  const n = Math.sin(s.rotY);
  return [s.x + lx * c + lz * n, s.z - lx * n + lz * c];
}

/** Position locale de la borne d'un stand (coin avant, côté `zs`). */
export function standKioskLocal(s: StandLayout): [number, number] {
  return [STAND_SIZE.depth / 2 - 0.2, 3.6 * s.zs];
}

/** Stand central « Live Metrics & Volume » (îlot circulaire). */
export const METRICS_STAND = { x: 0, z: 4.5, radius: 3.8 } as const;

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
    const [x, z] = standToWorld(s, ...standKioskLocal(s));
    return { id: s.id, x, z, radius: 6 };
  }),
  { id: 'metrics', x: METRICS_STAND.x, z: METRICS_STAND.z + METRICS_STAND.radius + 0.9, radius: 6 },
  { id: 'stage', x: 14.5, z: STAGE.z + STAGE.depth / 2 + 2.2, radius: 5 },
  { id: 'twitter', x: TWITTER_WALL.x, z: TWITTER_WALL.z - 3.2, radius: 6 },
  // Second point de déclenchement : totem « Follow & Access » à droite du mur.
  { id: 'twitter', x: TWITTER_WALL.x + TWITTER_WALL.width / 2 + 1.9, z: TWITTER_WALL.z - 3.4, radius: 4 },
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

/**
 * Chiffres officiels Variational d'octobre 2026, fournis pour le stand central
 * (affichés en tête du stand et du pop-up, en complément des données live de l'API).
 */
export const OFFICIAL_METRICS = {
  asOf: { fr: 'octobre 2026', en: 'October 2026', ko: '2026년 10월' },
  totalVolume: 417_920_000_000,
  openInterest: 2_040_000_000,
  tvl: 290_880_000,
  markets: 575,
  netRevenue2w: 3_682_137,
  treasuryUsdc: 11_077_933,
} as const;

/** TVL officielle formatée au centime de million, comme dans le rapport. */
export function formatMillions(v: number): string {
  return `$${(v / 1e6).toFixed(2)}M`;
}

/**
 * Barème officiel du simulateur FDV (café) : prix théorique par point au TGE.
 * Il correspond à 32 % de la supply répartis sur ~11,2 M de points.
 */
export const GENESIS_SHARE = 0.32;
export const TOTAL_POINTS = 11_200_000;
export const FDV_TABLE = [
  { fdv: 1e9, price: 28.6 },
  { fdv: 2e9, price: 57.1 },
  { fdv: 3e9, price: 85.7 },
  { fdv: 5e9, price: 142.9 },
  { fdv: 8e9, price: 228.6 },
  { fdv: 30e9, price: 857.0 },
] as const;

/** Répartition de la supply $VAR. */
export const VAR_ALLOCATION = [
  { key: 'genesis', pct: 32, color: '#7c3aed', label: { fr: 'Genesis Distribution', en: 'Genesis Distribution', ko: 'Genesis Distribution' }, note: { fr: 'Airdrop aux points · 100 % débloqué au TGE', en: 'Points airdrop · 100% unlocked at TGE', ko: '포인트 에어드랍 · TGE 시 100% 언락' } },
  { key: 'ecosystem', pct: 18, color: '#0f9488', label: { fr: 'Ecosystem Reserve', en: 'Ecosystem Reserve', ko: 'Ecosystem Reserve' }, note: { fr: 'Gérée par la Fondation', en: 'Managed by the Foundation', ko: '재단 관리' } },
  { key: 'team', pct: 50, color: '#2f80ed', label: { fr: 'Team & Investors', en: 'Team & Investors', ko: 'Team & Investors' }, note: { fr: 'Lock 12 mois puis 3 ans min.', en: '12-month lock, then ≥3 years', ko: '12개월 락업 후 최소 3년' } },
] as const;

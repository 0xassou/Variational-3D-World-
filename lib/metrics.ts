/**
 * Métriques Variational en direct.
 * - Stats globales et par marché : API publique Variational (CORS ouvert).
 * - Historique d'open interest : API publique DefiLlama.
 * En cas d'échec réseau, l'UI garde l'instantané `METRICS_SNAPSHOT`.
 */

export interface MarketRow {
  ticker: string;
  name: string;
  volume24h: number;
  openInterest: number;
  rwa: boolean;
}

export interface MetricsData {
  /** Horodatage ISO des données. */
  fetchedAt: string;
  volume24h: number;
  cumulativeVolume: number;
  tvl: number;
  openInterest: number;
  numMarkets: number;
  rwaMarkets: number;
  /** Part du volume 24h réalisée sur des marchés RWA (0-1). */
  rwaVolumeShare: number;
  topMarkets: MarketRow[];
  /** [timestamp unix (s), open interest USD], un point par semaine. */
  openInterestHistory: [number, number][];
}

export const STATS_URL = 'https://omni-client-api.prod.ap-northeast-1.variational.io/metadata/stats';
export const OI_HISTORY_URL = 'https://api.llama.fi/summary/open-interest/variational';

/**
 * Heuristique de classement RWA à partir du nom du marché : swaps sur indices / matières
 * premières / devises, actions (Inc., Corp., ETF…), métaux et sociétés pré-IPO.
 */
const RWA_PATTERN =
  /^Swap on |\b(Inc\.?|Corp\.?|Corporation|Company|Holdings|plc|Ltd|ETF|Group|Trust|Incorporated|Common Stock)\b|^(Gold|Silver|Platinum|Palladium|Copper|OpenAI|Anthropic|SpaceX|xAI)$/i;

export function isRwa(name: string): boolean {
  return RWA_PATTERN.test(name);
}

interface RawListing {
  ticker: string;
  name: string;
  volume_24h: string;
  open_interest?: { long_open_interest?: string; short_open_interest?: string };
  quotes?: { updated_at?: string };
}

interface RawStats {
  total_volume_24h: string;
  cumulative_volume: string;
  tvl: string;
  open_interest: string;
  num_markets: number;
  listings: RawListing[];
}

function num(v: string | number | undefined): number {
  const n = typeof v === 'number' ? v : Number.parseFloat(v ?? '');
  return Number.isFinite(n) ? n : 0;
}

export function parseStats(raw: RawStats, history: [number, number][]): MetricsData {
  const rows: MarketRow[] = raw.listings.map((l) => ({
    ticker: l.ticker,
    name: l.name,
    volume24h: num(l.volume_24h),
    openInterest: num(l.open_interest?.long_open_interest) + num(l.open_interest?.short_open_interest),
    rwa: isRwa(l.name),
  }));
  const totalVol = rows.reduce((s, r) => s + r.volume24h, 0);
  const rwaVol = rows.filter((r) => r.rwa).reduce((s, r) => s + r.volume24h, 0);
  const updated = raw.listings
    .map((l) => l.quotes?.updated_at ?? '')
    .filter(Boolean)
    .sort()
    .pop();
  return {
    fetchedAt: updated ? updated.slice(0, 19) + 'Z' : new Date().toISOString(),
    volume24h: num(raw.total_volume_24h),
    cumulativeVolume: num(raw.cumulative_volume),
    tvl: num(raw.tvl),
    openInterest: num(raw.open_interest),
    numMarkets: raw.num_markets || rows.length,
    rwaMarkets: rows.filter((r) => r.rwa).length,
    rwaVolumeShare: totalVol ? rwaVol / totalVol : 0,
    topMarkets: [...rows].sort((a, b) => b.volume24h - a.volume24h).slice(0, 10),
    openInterestHistory: history,
  };
}

/** Sous-échantillonne une série journalière en un point par semaine (+ dernier point). */
export function weekly(series: [number, number][]): [number, number][] {
  return series.filter((_, i) => i % 7 === 0 || i === series.length - 1);
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal, cache: 'no-store' });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return (await res.json()) as T;
}

export async function fetchLiveMetrics(fallbackHistory: [number, number][], signal?: AbortSignal): Promise<MetricsData> {
  const [stats, oi] = await Promise.allSettled([
    getJson<RawStats>(STATS_URL, signal),
    getJson<{ totalDataChart?: [number, number][] }>(OI_HISTORY_URL, signal),
  ]);
  if (stats.status === 'rejected') throw stats.reason;
  const history = oi.status === 'fulfilled' && oi.value.totalDataChart?.length ? weekly(oi.value.totalDataChart) : fallbackHistory;
  return parseStats(stats.value, history);
}

export function formatUsd(n: number, digits = 2): string {
  const abs = Math.abs(n);
  if (abs >= 1e9) return `$${(n / 1e9).toFixed(digits)}B`;
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(digits >= 2 ? 1 : digits)}M`;
  if (abs >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

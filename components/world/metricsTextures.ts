import { BRAND_BLUE } from '@/lib/brand';
import { formatUsd, type MetricsData } from '@/lib/metrics';
import { formatMillions, OFFICIAL_METRICS } from '@/lib/officialMetrics';
import { drawLogo } from './brandTextures';

/* Visuels canvas des écrans du stand « Live Metrics » (redessinés à chaque mise à jour des données). */

export const SCREEN_W = 600;
export const SCREEN_H = 960;

const BG_TOP = '#0b1f3a';
const BG_BOTTOM = '#10294d';
const CRYPTO = '#4C9AF8';
const RWA = '#2dd4bf';
const MUTED = '#9fb6d6';

function background(ctx: CanvasRenderingContext2D, title: string, live: boolean, pulse: number) {
  const g = ctx.createLinearGradient(0, 0, 0, SCREEN_H);
  g.addColorStop(0, BG_TOP);
  g.addColorStop(1, BG_BOTTOM);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  drawLogo(ctx, 36, 36, 34, { emblem: BRAND_BLUE, text: '#ffffff' });
  // Pastille LIVE / SNAPSHOT
  ctx.fillStyle = live ? `rgba(16,185,129,${0.6 + pulse * 0.4})` : '#f59e0b';
  ctx.beginPath();
  ctx.arc(SCREEN_W - 150, 53, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 24px Inter, Arial, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(live ? 'LIVE' : 'SNAPSHOT', SCREEN_W - 132, 54);
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 44px Inter, Arial, sans-serif';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(title, 36, 150);
  ctx.fillStyle = CRYPTO;
  ctx.fillRect(36, 170, 80, 6);
}

function footer(ctx: CanvasRenderingContext2D, text: string) {
  ctx.fillStyle = MUTED;
  ctx.font = '500 20px Inter, Arial, sans-serif';
  ctx.fillText(text, 36, SCREEN_H - 36);
}

/** Écran principal : chiffres officiels d'octobre 2026 (6 indicateurs). */
export function drawKpiScreen(ctx: CanvasRenderingContext2D, _m: MetricsData, live: boolean, pulse: number) {
  background(ctx, 'Official · Oct 2026', live, pulse);
  const o = OFFICIAL_METRICS;
  const rows: [string, string][] = [
    ['TOTAL VOLUME', formatUsd(o.totalVolume)],
    ['OPEN INTEREST', formatUsd(o.openInterest)],
    ['TVL', formatMillions(o.tvl)],
    ['MARKETS', `${o.markets}`],
    ['2-WEEK NET REVENUE', `$${(o.netRevenue2w / 1e6).toFixed(2)}M`],
    ['TREASURY', `${(o.treasuryUsdc / 1e6).toFixed(2)}M USDC`],
  ];
  rows.forEach(([label, value], i) => {
    const y = 210 + i * 118;
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(36, y, SCREEN_W - 72, 102);
    ctx.fillStyle = MUTED;
    ctx.font = '700 22px Inter, Arial, sans-serif';
    ctx.fillText(label, 58, y + 36);
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${value.length > 11 ? 38 : 46}px Inter, Arial, sans-serif`;
    ctx.fillText(value, 58, y + 84);
  });
  footer(ctx, 'Official Variational figures · October 2026');
}

export function drawOiScreen(ctx: CanvasRenderingContext2D, m: MetricsData, live: boolean, pulse: number) {
  background(ctx, 'Open Interest', live, pulse);
  const h = m.openInterestHistory;
  const x0 = 50;
  const x1 = SCREEN_W - 40;
  const y0 = 820;
  const y1 = 300;
  const max = Math.max(...h.map((p) => p[1]), 1);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 2;
  for (let k = 0; k <= 4; k++) {
    const y = y0 - (k / 4) * (y0 - y1);
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y);
    ctx.stroke();
  }
  const px = (i: number) => x0 + (i / Math.max(h.length - 1, 1)) * (x1 - x0);
  const py = (v: number) => y0 - (v / max) * (y0 - y1);
  ctx.beginPath();
  h.forEach((p, i) => (i ? ctx.lineTo(px(i), py(p[1])) : ctx.moveTo(px(i), py(p[1]))));
  ctx.lineTo(px(h.length - 1), y0);
  ctx.lineTo(px(0), y0);
  ctx.closePath();
  const fill = ctx.createLinearGradient(0, y1, 0, y0);
  fill.addColorStop(0, 'rgba(76,154,248,0.45)');
  fill.addColorStop(1, 'rgba(76,154,248,0.02)');
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.beginPath();
  h.forEach((p, i) => (i ? ctx.lineTo(px(i), py(p[1])) : ctx.moveTo(px(i), py(p[1]))));
  ctx.strokeStyle = CRYPTO;
  ctx.lineWidth = 5;
  ctx.lineJoin = 'round';
  ctx.stroke();
  const last = h[h.length - 1];
  if (last) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(px(h.length - 1), py(last[1]), 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '800 56px Inter, Arial, sans-serif';
    ctx.fillText(formatUsd(last[1]), 36, 250);
  }
  footer(ctx, 'Weekly · source DefiLlama');
}

export function drawTopScreen(ctx: CanvasRenderingContext2D, m: MetricsData, live: boolean, pulse: number) {
  background(ctx, 'Top markets 24h', live, pulse);
  const rows = m.topMarkets.slice(0, 8);
  const max = Math.max(...rows.map((r) => r.volume24h), 1);
  rows.forEach((r, i) => {
    const y = 230 + i * 80;
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 26px Inter, Arial, sans-serif';
    ctx.fillText(r.ticker.slice(0, 8), 36, y + 34);
    const w = Math.max(8, (r.volume24h / max) * 300);
    ctx.fillStyle = r.rwa ? RWA : CRYPTO;
    ctx.fillRect(170, y + 12, w, 30);
    ctx.fillStyle = MUTED;
    ctx.font = '600 22px Inter, Arial, sans-serif';
    ctx.fillText(formatUsd(r.volume24h, 1), 180 + w, y + 36);
  });
  ctx.fillStyle = CRYPTO;
  ctx.fillRect(36, 880, 22, 22);
  ctx.fillStyle = RWA;
  ctx.fillRect(190, 880, 22, 22);
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 22px Inter, Arial, sans-serif';
  ctx.fillText('Crypto', 68, 899);
  ctx.fillText('RWA', 222, 899);
}

export function drawRwaScreen(ctx: CanvasRenderingContext2D, m: MetricsData, live: boolean, pulse: number) {
  background(ctx, 'RWA vs Crypto', live, pulse);
  const cx = SCREEN_W / 2;
  const cy = 500;
  const r = 190;
  const share = m.rwaVolumeShare;
  ctx.lineWidth = 64;
  ctx.strokeStyle = CRYPTO;
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2 + share * Math.PI * 2 + 0.03, Math.PI * 1.5 - 0.03);
  ctx.stroke();
  ctx.strokeStyle = RWA;
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2 + 0.03, -Math.PI / 2 + share * Math.PI * 2 - 0.03);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = '800 84px Inter, Arial, sans-serif';
  ctx.fillText(`${Math.round(share * 100)}%`, cx, cy + 20);
  ctx.fillStyle = MUTED;
  ctx.font = '600 26px Inter, Arial, sans-serif';
  ctx.fillText('of 24h volume on RWA', cx, cy + 66);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 30px Inter, Arial, sans-serif';
  ctx.fillText(`${m.rwaMarkets} RWA markets`, 36, 800);
  ctx.fillText(`${m.numMarkets - m.rwaMarkets} crypto markets`, 36, 850);
  footer(ctx, 'Indices · commodities · FX · equities');
}

/** Bandeau défilant de l'anneau supérieur (texture répétée horizontalement). */
export function drawTicker(ctx: CanvasRenderingContext2D, m: MetricsData, w: number, h: number) {
  ctx.fillStyle = BG_TOP;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${Math.round(h * 0.5)}px Inter, Arial, sans-serif`;
  ctx.textBaseline = 'middle';
  const o = OFFICIAL_METRICS;
  const text = `TOTAL VOLUME ${formatUsd(o.totalVolume)}   ·   OPEN INTEREST ${formatUsd(o.openInterest)}   ·   TVL ${formatMillions(o.tvl)}   ·   ${o.markets} MARKETS   ·   LIVE 24H VOLUME ${formatUsd(m.volume24h)}   ·   `;
  let x = 20;
  while (x < w) {
    ctx.fillText(text, x, h / 2 + 2);
    x += ctx.measureText(text).width;
  }
  ctx.fillStyle = CRYPTO;
  ctx.fillRect(0, 0, w, 6);
  ctx.fillRect(0, h - 6, w, 6);
}

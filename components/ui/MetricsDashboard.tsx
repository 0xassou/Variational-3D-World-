'use client';

import { useMemo, useState } from 'react';
import { Activity, ChartLine, Coins, Layers, RefreshCw, Wallet } from 'lucide-react';
import type { Lang } from '@/lib/content';
import { t } from '@/lib/i18n';
import { formatUsd, type MarketRow, type MetricsData } from '@/lib/metrics';
import { useWorld } from '@/lib/store';

/* Palette catégorielle validée (validate_palette.js, mode clair) : crypto / RWA. */
const CRYPTO = '#2f80ed';
const RWA = '#0f9488';
const GRID = '#e5e7eb';
const INK_MUTED = '#64748b';

function Kpi({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

/** Aire de l'open interest hebdomadaire, avec réticule + infobulle au survol. */
function OpenInterestChart({ history, lang }: { history: [number, number][]; lang: Lang }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 640;
  const H = 220;
  const pad = { l: 56, r: 16, t: 14, b: 28 };
  const max = Math.max(...history.map((h) => h[1]), 1);
  const yMax = Math.ceil(max / 5e8) * 5e8;
  const x = (i: number) => pad.l + (i / Math.max(history.length - 1, 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / yMax) * (H - pad.t - pad.b);
  const line = history.map((h, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(h[1]).toFixed(1)}`).join(' ');
  const area = `${line} L${x(history.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * yMax);
  const fmtDate = (ts: number) =>
    new Date(ts * 1000).toLocaleDateString(lang === 'ko' ? 'ko-KR' : lang === 'en' ? 'en-US' : 'fr-FR', {
      month: 'short',
      day: 'numeric',
    });
  const months = history.filter((_, i) => i % Math.max(1, Math.round(history.length / 6)) === 0);
  const last = history.length - 1;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={t('oiHistory', lang)}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - rect.left) / rect.width) * W;
          const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * last);
          setHover(i >= 0 && i <= last ? i : null);
        }}
      >
        {ticks.map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke={GRID} strokeWidth={1} />
            <text x={pad.l - 8} y={y(v) + 4} textAnchor="end" fontSize={11} fill={INK_MUTED}>
              {formatUsd(v, 1)}
            </text>
          </g>
        ))}
        {months.map((h) => {
          const i = history.indexOf(h);
          return (
            <text key={h[0]} x={x(i)} y={H - 8} textAnchor="middle" fontSize={11} fill={INK_MUTED}>
              {fmtDate(h[0])}
            </text>
          );
        })}
        <path d={area} fill={CRYPTO} opacity={0.1} />
        <path d={line} fill="none" stroke={CRYPTO} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={x(last)} cy={y(history[last][1])} r={4} fill={CRYPTO} stroke="#fff" strokeWidth={2} />
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={y(0)} stroke="#94a3b8" strokeWidth={1} />
            <circle cx={x(hover)} cy={y(history[hover][1])} r={5} fill={CRYPTO} stroke="#fff" strokeWidth={2} />
          </g>
        )}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow"
          style={{ left: `${Math.min(80, Math.max(8, (x(hover) / W) * 100))}%`, transform: 'translateX(-50%)' }}
        >
          <span className="text-slate-300">{fmtDate(history[hover][0])}</span>
          <span className="ml-2 font-semibold tabular-nums">{formatUsd(history[hover][1])}</span>
        </div>
      )}
    </div>
  );
}

/** Top marchés par volume 24h : barres horizontales, couleur selon crypto / RWA. */
function TopMarkets({ rows, lang }: { rows: MarketRow[]; lang: Lang }) {
  const max = Math.max(...rows.map((r) => r.volume24h), 1);
  return (
    <div>
      <div className="mb-2 flex gap-4 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: CRYPTO }} /> {t('crypto', lang)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: RWA }} /> RWA
        </span>
      </div>
      <ul className="space-y-1.5">
        {rows.map((r) => (
          <li key={r.ticker} className="group grid grid-cols-[72px_1fr_76px] items-center gap-2 text-xs" title={`${r.name} · OI ${formatUsd(r.openInterest)}`}>
            <span className="truncate font-semibold text-slate-700">{r.ticker}</span>
            <span className="h-3.5 rounded-r bg-slate-100">
              <span
                className="block h-full rounded-r transition-opacity group-hover:opacity-80"
                style={{ width: `${Math.max(2, (r.volume24h / max) * 100)}%`, backgroundColor: r.rwa ? RWA : CRYPTO }}
              />
            </span>
            <span className="text-right tabular-nums text-slate-600">{formatUsd(r.volume24h, 1)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Part RWA / crypto du volume 24h (anneau + étiquettes directes). */
function RwaShare({ data, lang }: { data: MetricsData; lang: Lang }) {
  const share = data.rwaVolumeShare;
  const r = 52;
  const c = 2 * Math.PI * r;
  const gap = 4;
  const rwaLen = Math.max(0, share * c - gap);
  const cryptoLen = Math.max(0, (1 - share) * c - gap);
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 140 140" className="h-32 w-32 shrink-0" role="img" aria-label={t('rwaShare', lang)}>
        <g transform="rotate(-90 70 70)">
          <circle cx={70} cy={70} r={r} fill="none" stroke={RWA} strokeWidth={16} strokeDasharray={`${rwaLen} ${c}`} />
          <circle
            cx={70}
            cy={70}
            r={r}
            fill="none"
            stroke={CRYPTO}
            strokeWidth={16}
            strokeDasharray={`${cryptoLen} ${c}`}
            strokeDashoffset={-(share * c)}
          />
        </g>
        <text x={70} y={68} textAnchor="middle" fontSize={22} fontWeight={800} fill="#0f172a">
          {Math.round(share * 100)}%
        </text>
        <text x={70} y={86} textAnchor="middle" fontSize={10} fill={INK_MUTED}>
          RWA
        </text>
      </svg>
      <ul className="space-y-2 text-sm text-slate-700">
        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: RWA }} />
          RWA · {Math.round(share * 100)}% · {data.rwaMarkets} {t('markets', lang).toLowerCase()}
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: CRYPTO }} />
          {t('crypto', lang)} · {Math.round((1 - share) * 100)}% · {data.numMarkets - data.rwaMarkets} {t('markets', lang).toLowerCase()}
        </li>
      </ul>
    </div>
  );
}

export function MetricsDashboard({ lang }: { lang: Lang }) {
  const data = useWorld((s) => s.metrics);
  const status = useWorld((s) => s.metricsStatus);
  const loadMetrics = useWorld((s) => s.loadMetrics);
  const [refreshing, setRefreshing] = useState(false);
  const updated = useMemo(
    () =>
      new Date(data.fetchedAt).toLocaleString(lang === 'ko' ? 'ko-KR' : lang === 'en' ? 'en-US' : 'fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    [data.fetchedAt, lang],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            status === 'live' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${status === 'live' ? 'animate-pulse bg-emerald-500' : 'bg-amber-500'}`} />
          {status === 'live' ? t('live', lang) : t('snapshot', lang)} · {t('updatedAt', lang)} {updated}
        </span>
        <button
          type="button"
          onClick={async () => {
            setRefreshing(true);
            await loadMetrics();
            setRefreshing(false);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} aria-hidden />
          {t('refresh', lang)}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi icon={<Activity className="h-3.5 w-3.5" aria-hidden />} label={t('volume24h', lang)} value={formatUsd(data.volume24h)} sub={`${t('cumulative', lang)} ${formatUsd(data.cumulativeVolume, 1)}`} />
        <Kpi icon={<ChartLine className="h-3.5 w-3.5" aria-hidden />} label={t('openInterest', lang)} value={formatUsd(data.openInterest)} />
        <Kpi icon={<Wallet className="h-3.5 w-3.5" aria-hidden />} label="TVL" value={formatUsd(data.tvl)} />
        <Kpi icon={<Layers className="h-3.5 w-3.5" aria-hidden />} label={t('markets', lang)} value={String(data.numMarkets)} sub={`${data.rwaMarkets} RWA`} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h4 className="mb-2 text-sm font-bold text-slate-800">{t('oiHistory', lang)}</h4>
        <OpenInterestChart history={data.openInterestHistory} lang={lang} />
      </div>

      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h4 className="mb-2 text-sm font-bold text-slate-800">{t('topMarkets', lang)}</h4>
          <TopMarkets rows={data.topMarkets} lang={lang} />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h4 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-slate-800">
            <Coins className="h-4 w-4 text-slate-500" aria-hidden />
            {t('rwaShare', lang)}
          </h4>
          <RwaShare data={data} lang={lang} />
        </div>
      </div>
      <p className="text-xs text-slate-500">{t('metricsNote', lang)}</p>
    </div>
  );
}

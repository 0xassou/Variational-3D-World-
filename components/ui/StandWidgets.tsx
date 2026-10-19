'use client';

import { useState } from 'react';
import { BadgeCheck, CircleCheck, CircleDot, Clock, Coins, Landmark } from 'lucide-react';
import type { Lang, Localized, StandContent } from '@/lib/content';
import { t } from '@/lib/i18n';
import { formatUsd } from '@/lib/metrics';
import { FDV_TABLE, formatMillions, GENESIS_SHARE, OFFICIAL_METRICS, TOTAL_POINTS, VAR_ALLOCATION } from '@/lib/officialMetrics';
import { useWorld } from '@/lib/store';

const LOCALE: Record<Lang, string> = { fr: 'fr-FR', en: 'en-US', ko: 'ko-KR' };

/** Phrase d'introduction en grand : l'idée du stand en une phrase. */
export function LeadCard({ text, accent }: { text: string; accent: string }) {
  return (
    <p
      className="rounded-2xl border-l-4 bg-white px-5 py-4 text-lg font-medium leading-8 text-slate-800 shadow-sm"
      style={{ borderColor: accent }}
    >
      {text}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Chiffres officiels (octobre 2026)                                    */
/* ------------------------------------------------------------------ */

export function OfficialKpis({ lang }: { lang: Lang }) {
  const nf = new Intl.NumberFormat(LOCALE[lang], { maximumFractionDigits: 0 });
  const items: { label: Localized; value: string }[] = [
    { label: { fr: 'Volume total échangé', en: 'Total volume traded', ko: '누적 거래량' }, value: formatUsd(OFFICIAL_METRICS.totalVolume) },
    { label: { fr: 'Open interest (2 côtés)', en: 'Dual-sided open interest', ko: '양방향 미결제약정' }, value: formatUsd(OFFICIAL_METRICS.openInterest) },
    { label: { fr: 'Valeur verrouillée (TVL)', en: 'Total value locked (TVL)', ko: '총 예치 자산 (TVL)' }, value: formatMillions(OFFICIAL_METRICS.tvl) },
    { label: { fr: 'Marchés listés (Crypto + RWA)', en: 'Markets listed (Crypto + RWA)', ko: '상장 마켓 (크립토 + RWA)' }, value: String(OFFICIAL_METRICS.markets) },
    { label: { fr: 'Revenu net sur 2 semaines', en: '2-week net revenue', ko: '2주 순수익' }, value: `$${nf.format(OFFICIAL_METRICS.netRevenue2w)}` },
    { label: { fr: 'Trésorerie', en: 'Treasury holdings', ko: '재무 보유액' }, value: `${nf.format(OFFICIAL_METRICS.treasuryUsdc)} USDC` },
  ];
  return (
    <div>
      <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
        <BadgeCheck className="h-3.5 w-3.5 text-brand-400" aria-hidden />
        {lang === 'fr' ? 'Chiffres officiels' : lang === 'en' ? 'Official figures' : '공식 수치'} · {OFFICIAL_METRICS.asOf[lang]}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((k) => (
          <div key={k.label.en} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{k.label[lang]}</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{k.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tokenomics : répartition + simulateur FDV                            */
/* ------------------------------------------------------------------ */

export function AllocationDonut({ lang }: { lang: Lang }) {
  const r = 58;
  const c = 2 * Math.PI * r;
  const gap = 3;
  let offset = 0;
  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row">
      <svg viewBox="0 0 160 160" className="h-40 w-40 shrink-0" role="img" aria-label="$VAR allocation">
        <g transform="rotate(-90 80 80)">
          {VAR_ALLOCATION.map((a) => {
            const len = (a.pct / 100) * c;
            const el = (
              <circle
                key={a.key}
                cx={80}
                cy={80}
                r={r}
                fill="none"
                stroke={a.color}
                strokeWidth={22}
                strokeDasharray={`${Math.max(0, len - gap)} ${c}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return el;
          })}
        </g>
        <text x={80} y={78} textAnchor="middle" fontSize={20} fontWeight={800} fill="#0f172a">
          $VAR
        </text>
        <text x={80} y={96} textAnchor="middle" fontSize={10} fill="#64748b">
          supply
        </text>
      </svg>
      <ul className="w-full space-y-3">
        {VAR_ALLOCATION.map((a) => (
          <li key={a.key} className="flex items-start gap-3">
            <span className="mt-1.5 h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: a.color }} />
            <span className="flex-1">
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-semibold text-slate-800">{a.label[lang]}</span>
                <span className="text-lg font-extrabold tabular-nums text-slate-900">{a.pct}%</span>
              </span>
              <span className="block text-sm text-slate-500">{a.note[lang]}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const FDV_TEXT = {
  title: { fr: 'Simulateur FDV → prix par point', en: 'FDV simulator → price per point', ko: 'FDV 시뮬레이터 → 포인트당 가격' },
  perPoint: { fr: 'par point', en: 'per point', ko: '포인트당' },
  hypothesis: {
    fr: 'Hypothèse : 32 % de la supply répartis sur ~11,2 M de points (barème officiel du café). Simulation théorique — pas une prévision ni un conseil financier.',
    en: 'Assumption: 32% of supply spread over ~11.2M points (official café price list). Theoretical simulation — not a forecast or financial advice.',
    ko: '가정: 공급량 32%를 약 1,120만 포인트에 분배(카페 공식 가격표). 이론적 시뮬레이션이며 예측이나 투자 조언이 아닙니다.',
  },
  yourPoints: { fr: 'Tes points', en: 'Your points', ko: '내 포인트' },
  yourValue: { fr: 'Valeur théorique', en: 'Theoretical value', ko: '이론적 가치' },
} satisfies Record<string, Localized>;

export function FdvSimulator({ lang }: { lang: Lang }) {
  const [step, setStep] = useState(0);
  const [points, setPoints] = useState(1000);
  const { price } = FDV_TABLE[step];
  const nf = new Intl.NumberFormat(LOCALE[lang], { maximumFractionDigits: 1 });
  const usd = new Intl.NumberFormat(LOCALE[lang], { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="flex items-center gap-2 text-sm font-bold text-slate-800">
        <Coins className="h-4 w-4 text-violet-600" aria-hidden />
        {FDV_TEXT.title[lang]}
      </p>
      <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="FDV">
        {FDV_TABLE.map(({ fdv: v }, i) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={i === step}
            onClick={() => setStep(i)}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
              i === step ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            FDV {formatUsd(v, 0)}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-violet-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">$ {FDV_TEXT.perPoint[lang]}</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums text-violet-900">${price.toFixed(1)}</p>
        </div>
        <label className="rounded-xl bg-slate-50 p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{FDV_TEXT.yourPoints[lang]}</span>
          <input
            type="number"
            min={0}
            step={100}
            value={points}
            onChange={(e) => setPoints(Math.max(0, Number(e.target.value) || 0))}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-lg font-bold tabular-nums text-slate-900"
          />
        </label>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{FDV_TEXT.yourValue[lang]}</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums text-slate-900">{usd.format(points * price)}</p>
        </div>
      </div>
      <table className="mt-5 w-full text-left text-sm">
        <thead className="text-slate-500">
          <tr>
            <th className="py-1.5 font-semibold">FDV</th>
            <th className="py-1.5 text-right font-semibold">$ {FDV_TEXT.perPoint[lang]}</th>
          </tr>
        </thead>
        <tbody>
          {FDV_TABLE.map(({ fdv: v, price: p }, i) => (
            <tr key={v} className={`border-t border-slate-100 ${i === step ? 'bg-violet-50/70 font-semibold' : ''}`}>
              <td className="py-1.5">{formatUsd(v, 0)}</td>
              <td className="py-1.5 text-right tabular-nums">${p.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-slate-500">
        {FDV_TEXT.hypothesis[lang]} ({Math.round(GENESIS_SHARE * 100)} % · {nf.format(TOTAL_POINTS / 1e6)} M pts)
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Swaps TradFi en direct                                               */
/* ------------------------------------------------------------------ */

export function SwapsTable({ lang }: { lang: Lang }) {
  const rows = useWorld((s) => s.metrics.swapMarkets);
  const status = useWorld((s) => s.metricsStatus);
  const max = Math.max(...rows.map((r) => r.volume24h), 1);
  const head = {
    title: { fr: 'Swaps en direct — volume 24h', en: 'Live swaps — 24h volume', ko: '실시간 스왑 — 24시간 거래량' },
    market: { fr: 'Marché', en: 'Market', ko: '마켓' },
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="flex items-center justify-between gap-2 text-sm font-bold text-slate-800">
        <span className="flex items-center gap-2">
          <Landmark className="h-4 w-4 text-amber-600" aria-hidden />
          {head.title[lang]}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-[11px] ${status === 'live' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>
          {status === 'live' ? t('live', lang) : t('snapshot', lang)}
        </span>
      </p>
      <table className="mt-3 w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="py-1.5 font-semibold">{head.market[lang]}</th>
            <th className="hidden py-1.5 font-semibold sm:table-cell" />
            <th className="py-1.5 text-right font-semibold">{t('volume24h', lang)}</th>
            <th className="py-1.5 text-right font-semibold">OI</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.ticker} className="border-t border-slate-100">
              <td className="py-1.5">
                <span className="font-semibold text-slate-800">{r.ticker}</span>
                <span className="block text-xs text-slate-500">{r.name.replace(/^Swap on /, '')}</span>
              </td>
              <td className="hidden w-1/3 py-1.5 sm:table-cell">
                <span className="block h-2.5 rounded-r bg-amber-500" style={{ width: `${Math.max(2, (r.volume24h / max) * 100)}%` }} />
              </td>
              <td className="py-1.5 text-right tabular-nums text-slate-700">{formatUsd(r.volume24h, 1)}</td>
              <td className="py-1.5 text-right tabular-nums text-slate-500">{formatUsd(r.openInterest, 1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Feuille de route (Vision)                                            */
/* ------------------------------------------------------------------ */

export function Timeline({ items, lang }: { items: NonNullable<StandContent['timeline']>; lang: Lang }) {
  const icon = {
    live: <CircleCheck className="h-5 w-5 text-emerald-600" aria-hidden />,
    next: <CircleDot className="h-5 w-5 text-brand-500" aria-hidden />,
    later: <Clock className="h-5 w-5 text-slate-400" aria-hidden />,
  };
  return (
    <ol className="relative space-y-5 border-l-2 border-slate-200 pl-6">
      {items.map((it) => (
        <li key={it.when.en} className="relative">
          <span className="absolute -left-[37px] top-0.5 rounded-full bg-white p-0.5">{icon[it.status]}</span>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{it.when[lang]}</p>
          <p className="mt-0.5 text-[15px] leading-7 text-slate-800">{it.what[lang]}</p>
        </li>
      ))}
    </ol>
  );
}

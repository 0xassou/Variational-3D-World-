'use client';

import { useState } from 'react';
import {
  ArrowRight,
  AtSign,
  BadgeCheck,
  CirclePlay,
  ExternalLink,
  MonitorPlay,
  Rocket,
  Square,
  TriangleAlert,
  UserRound,
} from 'lucide-react';
import {
  formatTime,
  youtubeEmbedUrl,
  youtubeWatchUrl,
  type ComparisonTable,
  type Lang,
  type Quote,
  type VideoClip,
} from '@/lib/content';
import { t } from '@/lib/i18n';
import { accessUrl, CEO_URL, CREATOR_X, REFERRAL_CODE, VARIATIONAL_X } from '@/lib/links';
import { useWorld } from '@/lib/store';
import type { Highlight } from '@/lib/visuals';

export function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 first:mt-2">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
        {icon}
        {title}
      </h3>
      {children}
    </section>
  );
}

/** Bandeau de chiffres clés en tête de l'onglet « Essentiel ». */
export function Highlights({ items, accent, lang }: { items: Highlight[]; accent: string; lang: Lang }) {
  return (
    <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${items.length > 3 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
      {items.map((h) => (
        <div
          key={h.value + h.label.en}
          className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4"
        >
          <span className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: accent }} />
          <p className="text-2xl font-extrabold tracking-tight text-slate-900">{h.value}</p>
          <p className="mt-0.5 text-sm text-slate-600">{h.label[lang]}</p>
          {h.unverified && (
            <span className="mt-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
              {t('unverified', lang)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/** Explications débutant en cartes numérotées (plus lisibles qu'un bloc de texte). */
export function StepCards({ items, accent }: { items: string[]; accent: string }) {
  return (
    <ol className="grid gap-3 md:grid-cols-2">
      {items.map((p, i) => (
        <li key={p} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: accent }}
          >
            {i + 1}
          </span>
          <p className="text-[15px] leading-7 text-slate-700">{p}</p>
        </li>
      ))}
    </ol>
  );
}

/** Schéma en étapes reliées par des flèches. */
export function Flow({ steps, accent }: { steps: string[]; accent: string }) {
  return (
    <ol className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
      {steps.map((step, i) => (
        <li key={step} className="flex flex-1 flex-col items-center gap-2 md:flex-row">
          <div
            className="flex w-full flex-1 flex-col items-start gap-1.5 rounded-xl border bg-white px-3 py-3 text-sm font-medium text-slate-700 shadow-sm"
            style={{ borderColor: `${accent}66`, backgroundImage: `linear-gradient(180deg, ${accent}10, transparent)` }}
          >
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: accent }}
            >
              {i + 1}
            </span>
            {step}
          </div>
          {i < steps.length - 1 && <ArrowRight className="h-4 w-4 shrink-0 rotate-90 text-slate-400 md:rotate-0" aria-hidden />}
        </li>
      ))}
    </ol>
  );
}

/** Points techniques en cartes sombres à deux colonnes. */
export function TechCards({ items, accent }: { items: string[]; accent: string }) {
  const dot = accent === '#0f172a' || accent === '#0b1f3a' ? '#4C9AF8' : accent;
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {items.map((item) => {
        const [head, ...rest] = item.split(' : ').length > 1 ? item.split(' : ') : item.split(': ');
        const hasHead = rest.length > 0 && head.length < 48;
        return (
          <li key={item} className="rounded-xl bg-slate-900 p-4 text-sm leading-relaxed text-slate-200">
            <span className="mb-2 block h-1 w-8 rounded-full" style={{ backgroundColor: dot }} />
            {hasHead ? (
              <>
                <span className="block font-semibold text-white">{head}</span>
                <span>{rest.join(' : ')}</span>
              </>
            ) : (
              item
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function CompareTable({ table, lang }: { table: ComparisonTable; lang: Lang }) {
  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2" />
              {table.columns[lang].map((c, i) => (
                <th key={c} className={`px-3 py-2 font-semibold ${i === 0 ? 'text-brand-700' : ''}`}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.label.en} className="border-t border-slate-200">
                <th className="px-3 py-2 font-semibold text-slate-700">{row.label[lang]}</th>
                {row.values[lang].map((v, i) => (
                  <td key={i} className={`px-3 py-2 ${i === 0 ? 'bg-brand-50/60 font-medium text-slate-900' : 'text-slate-500'}`}>
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <a
        href={table.source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1.5 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-brand-600"
      >
        {table.source.label}
        <ExternalLink className="h-3 w-3" aria-hidden />
      </a>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Citations, vidéos, avertissements                                    */
/* ------------------------------------------------------------------ */

export function Quotes({ quotes, accent, lang, grid }: { quotes: Quote[]; accent: string; lang: Lang; grid?: boolean }) {
  return (
    <div className={grid ? 'grid gap-3 sm:grid-cols-2' : 'space-y-3'}>
      {quotes.map((q) => {
        const inner = (
          <>
            <p className="text-[15px] italic leading-relaxed text-slate-800">“{q.text}”</p>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{q.author}</span>
              <span>· {q.context}</span>
              {!q.verified && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-700">{t('unverified', lang)}</span>
              )}
              {q.url && <ExternalLink className="h-3 w-3" aria-hidden />}
            </p>
          </>
        );
        const cls = 'block rounded-xl border-l-4 bg-slate-50 p-4';
        return q.url ? (
          <a
            key={q.text}
            href={q.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${cls} transition hover:bg-slate-100`}
            style={{ borderColor: accent }}
          >
            {inner}
          </a>
        ) : (
          <blockquote key={q.text} className={cls} style={{ borderColor: accent }}>
            {inner}
          </blockquote>
        );
      })}
    </div>
  );
}

export function VideoItem({ clip, lang }: { clip: VideoClip; lang: Lang }) {
  const [inline, setInline] = useState(false);
  const stageVideoId = useWorld((s) => s.stageVideoId);
  const setStageVideo = useWorld((s) => s.setStageVideo);
  const close = useWorld((s) => s.close);
  const onScreen = stageVideoId === clip.id;
  const range = clip.start !== undefined ? `${formatTime(clip.start)} → ${formatTime(clip.end)}` : '';

  return (
    <li className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-stretch gap-3">
        {/* Vignette YouTube officielle */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://i.ytimg.com/vi/${clip.youtubeId}/mqdefault.jpg`}
          alt=""
          loading="lazy"
          className="h-auto w-full bg-slate-100 object-cover sm:w-40"
        />
        <div className="min-w-0 flex-1 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            {clip.show}
            {range && <span className="ml-2 font-mono font-normal text-slate-500">{range}</span>}
          </p>
          <p className="mt-0.5 font-semibold text-slate-800">{clip.title[lang]}</p>
          <p className="mt-0.5 text-xs text-slate-500">{clip.note[lang]}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {clip.embeddable === false ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                {t('youtubeOnly', lang)}
              </span>
            ) : onScreen ? (
              <button
                type="button"
                onClick={() => setStageVideo(null)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-200"
              >
                <Square className="h-3.5 w-3.5" aria-hidden />
                {t('nowOnScreen', lang)} · {t('stopScreen', lang)}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  // Ferme le pop-up pour voir la scène et le lecteur.
                  setStageVideo(clip.id);
                  close();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-600"
              >
                <MonitorPlay className="h-3.5 w-3.5" aria-hidden />
                {t('playOnScreen', lang)}
              </button>
            )}
            {clip.embeddable !== false && (
              <button
                type="button"
                onClick={() => setInline((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <CirclePlay className="h-3.5 w-3.5" aria-hidden />
                {inline ? t('hideVideo', lang) : t('watchHere', lang)}
              </button>
            )}
            <a
              href={youtubeWatchUrl(clip)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              {t('openYoutube', lang)}
            </a>
          </div>
        </div>
      </div>
      {inline && (
        <div className="aspect-video w-full overflow-hidden bg-black">
          <iframe
            className="h-full w-full"
            src={youtubeEmbedUrl(clip, { autoplay: true })}
            title={clip.title[lang]}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      )}
    </li>
  );
}

export function ToVerify({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Liens sociaux & accès protocole (Twitter Alpha Wall)                 */
/* ------------------------------------------------------------------ */

export function SocialLinks({ lang }: { lang: Lang }) {
  const links = [
    { href: CEO_URL.url, icon: <UserRound className="h-5 w-5" aria-hidden />, title: t('socialCeo', lang), sub: CEO_URL.url.replace(/^https?:\/\//, '').replace(/\/$/, '') },
    { href: VARIATIONAL_X.url, icon: <AtSign className="h-5 w-5" aria-hidden />, title: t('socialVariational', lang), sub: VARIATIONAL_X.label },
  ];
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-500"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">{l.icon}</span>
          <span className="min-w-0">
            <span className="flex items-center gap-1 text-sm font-bold text-slate-900">
              {l.title}
              <BadgeCheck className="h-4 w-4 text-brand-500" aria-hidden />
            </span>
            <span className="block truncate text-xs text-slate-500">{l.sub}</span>
          </span>
        </a>
      ))}
      <a
        href={accessUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-xl bg-brand-500 p-4 text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <Rocket className="h-5 w-5" aria-hidden />
        </span>
        <span>
          <span className="block text-sm font-bold">{t('socialAccess', lang)}</span>
          <span className="block text-xs text-white/80">{REFERRAL_CODE ? `ref: ${REFERRAL_CODE}` : 'omni.variational.io'}</span>
        </span>
      </a>
      <p className="text-xs text-slate-500 md:col-span-3">{t('socialAccessNote', lang)}</p>
      {/* Créateur du Summit */}
      <a
        href={CREATOR_X.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-[#13325e] p-5 text-white shadow-sm transition hover:shadow-md md:col-span-3"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
          <AtSign className="h-6 w-6 text-brand-400" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-400">{t('creatorTitle', lang)}</span>
          <span className="mt-1 block text-[15px] leading-6 text-slate-100">{t('creatorMessage', lang)}</span>
        </span>
        <span className="hidden shrink-0 items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold transition group-hover:bg-white/20 sm:inline-flex">
          {CREATOR_X.label}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </span>
      </a>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CirclePlay,
  Cpu,
  ExternalLink,
  GraduationCap,
  MonitorPlay,
  Quote as QuoteIcon,
  Table2,
  TriangleAlert,
  X,
} from 'lucide-react';
import {
  CONTENT,
  formatTime,
  VIDEOS,
  youtubeEmbedUrl,
  youtubeWatchUrl,
  type Lang,
  type StandContent,
  type VideoClip,
} from '@/lib/content';
import { t } from '@/lib/i18n';
import { useWorld } from '@/lib/store';
import { LanguageSwitcher } from './LanguageSwitcher';

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
        {icon}
        {title}
      </h3>
      {children}
    </section>
  );
}

function Flow({ steps, accent }: { steps: string[]; accent: string }) {
  return (
    <ol className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
      {steps.map((step, i) => (
        <li key={step} className="flex flex-1 flex-col items-center gap-2 md:flex-row">
          <div
            className="flex w-full flex-1 items-center gap-2 rounded-xl border bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm"
            style={{ borderColor: `${accent}55` }}
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
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

function VideoItem({ clip, lang }: { clip: VideoClip; lang: Lang }) {
  const [inline, setInline] = useState(false);
  const stageVideoId = useWorld((s) => s.stageVideoId);
  const setStageVideo = useWorld((s) => s.setStageVideo);
  const onScreen = stageVideoId === clip.id;
  const range = clip.start !== undefined ? `${formatTime(clip.start)} → ${formatTime(clip.end)}` : '';

  return (
    <li className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            {clip.show}
            {range && <span className="ml-2 font-mono font-normal text-slate-500">{range}</span>}
          </p>
          <p className="mt-0.5 font-semibold text-slate-800">{clip.title[lang]}</p>
          <p className="mt-0.5 text-xs text-slate-500">{clip.note[lang]}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStageVideo(clip.id)}
            disabled={onScreen}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              onScreen ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-500 text-white hover:bg-brand-600'
            }`}
          >
            <MonitorPlay className="h-3.5 w-3.5" aria-hidden />
            {onScreen ? t('nowOnScreen', lang) : t('playOnScreen', lang)}
          </button>
          <button
            type="button"
            onClick={() => setInline((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            <CirclePlay className="h-3.5 w-3.5" aria-hidden />
            {inline ? t('hideVideo', lang) : t('watchHere', lang)}
          </button>
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
      {inline && (
        <div className="mt-3 aspect-video w-full overflow-hidden rounded-lg bg-black">
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

function ModalBody({ content, lang }: { content: StandContent; lang: Lang }) {
  const videos = content.videoIds.map((id) => VIDEOS[id]).filter((v): v is VideoClip => Boolean(v));
  const isTweetWall = content.id === 'twitter';

  return (
    <>
      <Section icon={<GraduationCap className="h-4 w-4" aria-hidden />} title={t('beginner', lang)}>
        <div className="space-y-2.5 text-[15px] leading-relaxed text-slate-700">
          {content.beginner[lang].map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Section>

      {content.flow && (
        <Section icon={<BookOpen className="h-4 w-4" aria-hidden />} title={t('flow', lang)}>
          <Flow steps={content.flow[lang]} accent={content.accent} />
        </Section>
      )}

      <Section icon={<Cpu className="h-4 w-4" aria-hidden />} title={t('deepTech', lang)}>
        <ul className="space-y-2 rounded-xl bg-slate-900 p-4 text-sm leading-relaxed text-slate-100">
          {content.deepTech[lang].map((item) => (
            <li key={item} className="flex gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: content.accent === '#0f172a' ? '#94a3b8' : content.accent }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {content.table && (
        <Section icon={<Table2 className="h-4 w-4" aria-hidden />} title={content.table.caption[lang]}>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2" />
                  {content.table.columns[lang].map((c) => (
                    <th key={c} className="px-3 py-2 font-semibold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {content.table.rows.map((row) => (
                  <tr key={row.label.en} className="border-t border-slate-200">
                    <th className="px-3 py-2 font-semibold text-slate-700">{row.label[lang]}</th>
                    {row.values[lang].map((v, i) => (
                      <td key={i} className={`px-3 py-2 ${i === 0 ? 'text-slate-900' : 'text-slate-500'}`}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <a
            href={content.table.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-brand-600"
          >
            {content.table.source.label}
            <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        </Section>
      )}

      {content.quotes.length > 0 && (
        <Section icon={<QuoteIcon className="h-4 w-4" aria-hidden />} title={t('quotes', lang)}>
          <div className={isTweetWall ? 'grid gap-3 sm:grid-cols-2' : 'space-y-3'}>
            {content.quotes.map((q) => {
              const inner = (
                <>
                  <p className="text-[15px] italic leading-relaxed text-slate-800">“{q.text}”</p>
                  <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{q.author}</span>
                    <span>· {q.context}</span>
                    {!q.verified && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-700">
                        {t('unverified', lang)}
                      </span>
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
                  style={{ borderColor: content.accent }}
                >
                  {inner}
                </a>
              ) : (
                <blockquote key={q.text} className={cls} style={{ borderColor: content.accent }}>
                  {inner}
                </blockquote>
              );
            })}
          </div>
        </Section>
      )}

      {videos.length > 0 && (
        <Section icon={<CirclePlay className="h-4 w-4" aria-hidden />} title={t('videos', lang)}>
          <ul className="space-y-2.5">
            {videos.map((clip) => (
              <VideoItem key={clip.id} clip={clip} lang={lang} />
            ))}
          </ul>
        </Section>
      )}

      {content.toVerify && (
        <Section icon={<TriangleAlert className="h-4 w-4 text-amber-500" aria-hidden />} title={t('toVerify', lang)}>
          <ul className="space-y-1.5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {content.toVerify[lang].map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden>⚠️</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {content.sources.length > 0 && (
        <Section icon={<ExternalLink className="h-4 w-4" aria-hidden />} title={t('sources', lang)}>
          <ul className="grid gap-2 sm:grid-cols-2">
            {content.sources.map((s) => (
              <li key={s.url + s.label}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:border-brand-500 hover:text-brand-600"
                >
                  <span className="truncate">{s.label}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}

/** Pop-up 2D plein écran affichant le contenu Notion du stand actif. */
export function Modal() {
  const activeId = useWorld((s) => s.activeId);
  const lang = useWorld((s) => s.lang);
  const close = useWorld((s) => s.close);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!activeId) return;
    scrollRef.current?.scrollTo({ top: 0 });
    closeRef.current?.focus({ preventScroll: true });
  }, [activeId]);

  if (!activeId) return null;
  const content = CONTENT[activeId];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        lang={lang}
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
      >
        <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: content.accent }} />
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-5 pb-4 pt-4 sm:px-7">
          <div className="flex min-w-0 items-start gap-3">
            {content.number && (
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-extrabold text-white"
                style={{ backgroundColor: content.accent }}
              >
                {content.number}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Variational · Summit</p>
              <h2 id="modal-title" className="text-xl font-extrabold leading-tight text-slate-900 sm:text-2xl">
                {content.title[lang]}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{content.tagline[lang]}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher />
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label={t('close', lang)}
              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div ref={scrollRef} className="overflow-y-auto px-5 pb-6 sm:px-7">
          <ModalBody content={content} lang={lang} />
        </div>

        <footer className="shrink-0 border-t border-slate-100 bg-slate-50 px-5 py-2.5 text-xs text-slate-500 sm:px-7">
          {t('disclaimer', lang)}
        </footer>
      </div>
    </div>
  );
}

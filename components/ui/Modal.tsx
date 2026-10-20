'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BadgeCheck,
  BookOpen,
  ChartPie as PieChart,
  CirclePlay,
  Coins,
  Cpu,
  ExternalLink,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  Map as MapIcon,
  Link2,
  Quote as QuoteIcon,
  Sparkles,
  Table2,
  X,
} from 'lucide-react';
import { CONTENT, VIDEOS, type InteractiveId, type Lang, type StandContent, type VideoClip } from '@/lib/content';
import { t, type UIKey } from '@/lib/i18n';
import { useWorld } from '@/lib/store';
import { HIGHLIGHTS } from '@/lib/visuals';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MetricsDashboard } from './MetricsDashboard';
import { AllocationDonut, FdvSimulator, LeadCard, OfficialKpis, SwapsTable, Timeline } from './StandWidgets';
import {
  CompareTable,
  Flow,
  Highlights,
  Quotes,
  Section,
  SocialLinks,
  StepCards,
  TechCards,
  VideoItem,
} from './ModalParts';
import { VariationalLogo } from './VariationalLogo';

type Tab = 'overview' | 'deep' | 'media';

const TAB_LABEL: Record<Tab, UIKey> = {
  overview: 'tabOverview',
  deep: 'tabDeep',
  media: 'tabMedia',
};

function availableTabs(id: InteractiveId, content: StandContent): Tab[] {
  const tabs: Tab[] = ['overview'];
  if (content.deepTech.fr.length || content.table) tabs.push('deep');
  if ((content.quotes.length && id !== 'twitter') || content.sources.length || (content.videoIds.length && id !== 'stage')) {
    tabs.push('media');
  }
  return tabs;
}

function Overview({ id, content, lang }: { id: InteractiveId; content: StandContent; lang: Lang }) {
  const highlights = HIGHLIGHTS[id];
  const videos = content.videoIds.map((v) => VIDEOS[v]).filter((v): v is VideoClip => Boolean(v));
  const steps = { fr: 'Comprendre en', en: 'Understand in', ko: '단계로 이해하기' };
  const stepsTitle = lang === 'ko' ? `${content.beginner.ko.length}${steps.ko}` : `${steps[lang]} ${content.beginner[lang].length} ${lang === 'fr' ? 'étapes' : 'steps'}`;

  return (
    <>
      {content.lead && (
        <section className="mt-2">
          <LeadCard text={content.lead[lang]} accent={content.accent === '#0b1f3a' ? '#4C9AF8' : content.accent} />
        </section>
      )}
      {id === 'metrics' && (
        <>
          <Section icon={<BadgeCheck className="h-4 w-4" aria-hidden />} title={t('keyFigures', lang)}>
            <OfficialKpis lang={lang} />
          </Section>
          <Section icon={<LayoutDashboard className="h-4 w-4" aria-hidden />} title={t('dashboard', lang)}>
            <MetricsDashboard lang={lang} />
          </Section>
        </>
      )}
      {highlights && (
        <Section icon={<Sparkles className="h-4 w-4" aria-hidden />} title={t('keyFigures', lang)}>
          <Highlights items={highlights} accent={content.accent} lang={lang} />
        </Section>
      )}
      {id === 'tokenomics' && (
        <>
          <Section icon={<PieChart className="h-4 w-4" aria-hidden />} title={lang === 'ko' ? '$VAR 분배' : lang === 'en' ? '$VAR allocation' : 'Répartition du $VAR'}>
            <AllocationDonut lang={lang} />
          </Section>
          <Section icon={<Coins className="h-4 w-4" aria-hidden />} title="FDV">
            <FdvSimulator lang={lang} />
          </Section>
        </>
      )}
      {id === 'swaps' && (
        <Section icon={<Landmark className="h-4 w-4" aria-hidden />} title="TradFi swaps">
          <SwapsTable lang={lang} />
        </Section>
      )}
      {id === 'vision' && content.timeline && (
        <Section icon={<MapIcon className="h-4 w-4" aria-hidden />} title="Roadmap">
          <Timeline items={content.timeline} lang={lang} />
        </Section>
      )}
      {id === 'twitter' && (
        <>
          <Section icon={<Link2 className="h-4 w-4" aria-hidden />} title={t('socialTitle', lang)}>
            <SocialLinks lang={lang} />
          </Section>
          <Section icon={<QuoteIcon className="h-4 w-4" aria-hidden />} title="X">
            <Quotes quotes={content.quotes} accent="#2f80ed" lang={lang} grid />
          </Section>
        </>
      )}
      <Section icon={<GraduationCap className="h-4 w-4" aria-hidden />} title={stepsTitle}>
        <StepCards items={content.beginner[lang]} accent={content.accent === '#0b1f3a' ? '#2f80ed' : content.accent} />
      </Section>
      {content.flow && (
        <Section icon={<BookOpen className="h-4 w-4" aria-hidden />} title={t('flow', lang)}>
          <Flow steps={content.flow[lang]} accent={content.accent} />
        </Section>
      )}
      {id === 'stage' && videos.length > 0 && (
        <Section icon={<CirclePlay className="h-4 w-4" aria-hidden />} title={t('videos', lang)}>
          <ul className="space-y-2.5">
            {videos.map((clip) => (
              <VideoItem key={clip.id} clip={clip} lang={lang} />
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}

function DeepTech({ content, lang }: { content: StandContent; lang: Lang }) {
  return (
    <>
      <Section icon={<Cpu className="h-4 w-4" aria-hidden />} title={t('deepTech', lang)}>
        <TechCards items={content.deepTech[lang]} accent={content.accent} />
      </Section>
      {content.table && (
        <Section icon={<Table2 className="h-4 w-4" aria-hidden />} title={content.table.caption[lang]}>
          <CompareTable table={content.table} lang={lang} />
        </Section>
      )}
    </>
  );
}

function Media({ id, content, lang }: { id: InteractiveId; content: StandContent; lang: Lang }) {
  const videos = content.videoIds.map((v) => VIDEOS[v]).filter((v): v is VideoClip => Boolean(v));
  return (
    <>
      {content.quotes.length > 0 && id !== 'twitter' && (
        <Section icon={<QuoteIcon className="h-4 w-4" aria-hidden />} title={t('quotes', lang)}>
          <Quotes quotes={content.quotes} accent={content.accent} lang={lang} />
        </Section>
      )}
      {videos.length > 0 && id !== 'stage' && (
        <Section icon={<CirclePlay className="h-4 w-4" aria-hidden />} title={t('videos', lang)}>
          <ul className="space-y-2.5">
            {videos.map((clip) => (
              <VideoItem key={clip.id} clip={clip} lang={lang} />
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

/** Pop-up 2D plein écran : onglets Essentiel / Deep Tech / Visuels / Citations & sources. */
export function Modal() {
  const activeId = useWorld((s) => s.activeId);
  const lang = useWorld((s) => s.lang);
  const close = useWorld((s) => s.close);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [tab, setTab] = useState<Tab>('overview');

  useEffect(() => {
    if (!activeId) return;
    setTab('overview');
    closeRef.current?.focus({ preventScroll: true });
  }, [activeId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [tab, activeId]);

  const tabs = useMemo(() => (activeId ? availableTabs(activeId, CONTENT[activeId]) : []), [activeId]);

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
        className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
      >
        <div className="h-1.5 w-full shrink-0" style={{ background: `linear-gradient(90deg, ${content.accent}, #4C9AF8)` }} />
        <header className="shrink-0 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-5 pt-4 sm:px-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
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
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <VariationalLogo className="h-3.5 w-auto" />
                  Summit
                </p>
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
          </div>
          {tabs.length > 1 && (
            <nav className="-mb-px mt-3 flex gap-1 overflow-x-auto" role="tablist">
              {tabs.map((k) => (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={tab === k}
                  onClick={() => setTab(k)}
                  className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-semibold ${
                    tab === k ? 'border-brand-500 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t(TAB_LABEL[k], lang)}
                </button>
              ))}
            </nav>
          )}
        </header>

        <div ref={scrollRef} className="overflow-y-auto bg-slate-50/40 px-5 pb-6 pt-4 sm:px-7">
          {tab === 'overview' && <Overview id={activeId} content={content} lang={lang} />}
          {tab === 'deep' && <DeepTech content={content} lang={lang} />}
          {tab === 'media' && <Media id={activeId} content={content} lang={lang} />}
        </div>

        <footer className="shrink-0 border-t border-slate-100 bg-slate-50 px-5 py-2.5 text-xs text-slate-500 sm:px-7">
          {t('disclaimer', lang)}
        </footer>
      </div>
    </div>
  );
}

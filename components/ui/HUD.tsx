'use client';

import { Info, Keyboard, MousePointerClick, Presentation } from 'lucide-react';
import { useState } from 'react';
import { CONTENT } from '@/lib/content';
import { t } from '@/lib/i18n';
import { useWorld } from '@/lib/store';
import { LanguageSwitcher } from './LanguageSwitcher';

function Intro() {
  const lang = useWorld((s) => s.lang);
  const loaded = useWorld((s) => s.loaded);
  const start = useWorld((s) => s.start);

  return (
    <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-white/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
            <Presentation className="h-4 w-4" aria-hidden />
            Variational · Arbitrum
          </span>
          <LanguageSwitcher compact />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold leading-tight text-slate-900">{t('welcomeTitle', lang)}</h1>
        <p className="mt-2 text-slate-600">{t('welcomeBody', lang)}</p>
        <ul className="mt-5 space-y-1.5 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
          <li>⌨️ {t('controlsMove', lang)}</li>
          <li>🏃 {t('controlsRun', lang)}</li>
          <li>🖱️ {t('controlsCamera', lang)}</li>
          <li>💬 {t('controlsInteract', lang)}</li>
        </ul>
        <button
          type="button"
          disabled={!loaded}
          onClick={start}
          className="mt-6 w-full rounded-xl bg-brand-500 py-3 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600 disabled:cursor-wait disabled:opacity-60"
        >
          {loaded ? t('enter', lang) : t('loading', lang)}
        </button>
        <p className="mt-3 text-center text-xs text-slate-400">{t('disclaimer', lang)}</p>
      </div>
    </div>
  );
}

function InteractPrompt() {
  const lang = useWorld((s) => s.lang);
  const nearbyId = useWorld((s) => s.nearbyId);
  const activeId = useWorld((s) => s.activeId);
  const open = useWorld((s) => s.open);
  if (!nearbyId || activeId) return null;
  const content = CONTENT[nearbyId];

  return (
    <button
      type="button"
      onClick={() => open(nearbyId)}
      className="pointer-events-auto fixed bottom-8 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 text-left shadow-xl ring-1 ring-slate-200 transition hover:ring-brand-500"
    >
      <kbd className="flex h-9 w-9 items-center justify-center rounded-lg border-b-2 border-slate-300 bg-slate-100 font-mono text-base font-bold text-slate-700">
        E
      </kbd>
      <span>
        <span className="block text-sm font-bold text-slate-900">{content.title[lang]}</span>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <MousePointerClick className="h-3.5 w-3.5" aria-hidden />
          {t('interactPrompt', lang)}
        </span>
      </span>
    </button>
  );
}

function Toast() {
  const toast = useWorld((s) => s.toast);
  if (!toast) return null;
  return (
    <div
      role="status"
      className="fixed left-1/2 top-20 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900/85 px-4 py-2 text-sm text-white shadow-lg"
    >
      <Info className="h-4 w-4" aria-hidden />
      {toast}
    </div>
  );
}

function ControlsHelp() {
  const lang = useWorld((s) => s.lang);
  const [open, setOpen] = useState(true);
  return (
    <div className="pointer-events-auto fixed bottom-4 left-4 z-30 max-w-xs">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow ring-1 ring-slate-200"
        aria-expanded={open}
      >
        <Keyboard className="h-4 w-4" aria-hidden />
        {t('controlsTitle', lang)}
      </button>
      {open && (
        <ul className="mt-2 space-y-1 rounded-xl bg-white/90 p-3 text-xs text-slate-600 shadow ring-1 ring-slate-200">
          <li>{t('controlsMove', lang)}</li>
          <li>{t('controlsRun', lang)}</li>
          <li>{t('controlsCamera', lang)}</li>
          <li>{t('controlsInteract', lang)}</li>
        </ul>
      )}
    </div>
  );
}

/** Calque 2D au-dessus du canvas : branding, langue, aide, invite d'interaction. */
export function HUD() {
  const started = useWorld((s) => s.started);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 select-none">
      <div className="pointer-events-auto fixed left-4 top-4 flex items-center gap-2 rounded-full bg-white/90 py-1.5 pl-2 pr-4 shadow ring-1 ring-slate-200">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-sm font-black text-white">V</span>
        <span className="text-sm font-bold text-slate-800">Variational Summit</span>
        <span className="hidden text-xs text-slate-400 sm:inline">· Omni & Pro on Arbitrum</span>
      </div>
      <div className="pointer-events-auto fixed right-4 top-4">
        <LanguageSwitcher />
      </div>
      {started ? (
        <>
          <ControlsHelp />
          <InteractPrompt />
          <Toast />
        </>
      ) : (
        <Intro />
      )}
    </div>
  );
}

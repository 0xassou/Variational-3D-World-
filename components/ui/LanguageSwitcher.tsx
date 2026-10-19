'use client';

import { Languages } from 'lucide-react';
import { LANGS, type Lang } from '@/lib/content';
import { t } from '@/lib/i18n';
import { useWorld } from '@/lib/store';

const LABELS: Record<Lang, string> = { fr: 'FR', en: 'EN', ko: 'KO' };
const NATIVE: Record<Lang, string> = { fr: 'Français', en: 'English', ko: '한국어' };

/** Sélecteur de langue FR / EN / KO (bascule instantanée de tout le contenu). */
export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const lang = useWorld((s) => s.lang);
  const setLang = useWorld((s) => s.setLang);

  return (
    <div
      role="radiogroup"
      aria-label={t('language', lang)}
      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/90 p-1 shadow-sm"
    >
      {!compact && <Languages className="ml-1.5 mr-0.5 h-4 w-4 text-slate-400" aria-hidden />}
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          role="radio"
          aria-checked={lang === l}
          title={NATIVE[l]}
          onClick={() => setLang(l)}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
            lang === l ? 'bg-brand-500 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}

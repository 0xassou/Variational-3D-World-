'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Maximize2, Minimize2, X } from 'lucide-react';
import { audio } from '@/lib/audio';
import { VIDEOS, youtubeEmbedUrl, youtubeWatchUrl } from '@/lib/content';
import { t } from '@/lib/i18n';
import { useWorld } from '@/lib/store';

/**
 * Lecteur de la vidéo diffusée sur la scène. Un iframe YouTube placé dans la scène 3D reste noir
 * sur une partie des navigateurs : le lecteur est donc affiché en 2D, avec le son et les commandes,
 * pendant que l'écran 3D montre la vignette « en direct ».
 */
export function StagePlayer() {
  const lang = useWorld((s) => s.lang);
  const videoId = useWorld((s) => s.stageVideoId);
  const setStageVideo = useWorld((s) => s.setStageVideo);
  const [large, setLarge] = useState(false);
  const clip = videoId ? VIDEOS[videoId] : undefined;

  // La musique d'ambiance s'efface le temps de la vidéo.
  useEffect(() => {
    audio.setMusicDucked(Boolean(clip));
    return () => audio.setMusicDucked(false);
  }, [clip]);

  if (!clip) return null;

  return (
    <div
      className={`pointer-events-auto fixed z-40 overflow-hidden rounded-2xl bg-slate-950 shadow-2xl ring-1 ring-black/20 transition-[width] ${
        large
          ? 'left-1/2 top-1/2 w-[min(92vw,1100px)] -translate-x-1/2 -translate-y-1/2'
          : 'bottom-4 right-4 w-[min(calc(100vw-2rem),420px)]'
      }`}
    >
      <div className="flex items-center gap-2 px-3 py-2 text-white">
        <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-500" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-brand-400">
            {t('liveOnStage', lang)} · {clip.show}
          </p>
          <p className="truncate text-sm font-semibold">{clip.title[lang]}</p>
        </div>
        <a
          href={youtubeWatchUrl(clip)}
          target="_blank"
          rel="noopener noreferrer"
          title={t('openYoutube', lang)}
          aria-label={t('openYoutube', lang)}
          className="rounded-lg p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
        <button
          type="button"
          onClick={() => setLarge((v) => !v)}
          title={large ? t('shrink', lang) : t('expand', lang)}
          aria-label={large ? t('shrink', lang) : t('expand', lang)}
          className="rounded-lg p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          {large ? <Minimize2 className="h-4 w-4" aria-hidden /> : <Maximize2 className="h-4 w-4" aria-hidden />}
        </button>
        <button
          type="button"
          onClick={() => setStageVideo(null)}
          title={t('close', lang)}
          aria-label={t('close', lang)}
          className="rounded-lg p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <div className="aspect-video w-full bg-black">
        <iframe
          key={clip.id}
          className="h-full w-full"
          src={youtubeEmbedUrl(clip, { autoplay: true })}
          title={clip.title[lang]}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
}

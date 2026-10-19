import { create } from 'zustand';
import { Vector3 } from 'three';
import type { InteractiveId, Lang } from './content';
import { fetchLiveMetrics, type MetricsData } from './metrics';
import { METRICS_SNAPSHOT } from './metricsSnapshot';

interface WorldState {
  lang: Lang;
  /** Ressources 3D chargées (police, moteur physique). */
  loaded: boolean;
  started: boolean;
  /** Borne actuellement ouverte dans le modal. */
  activeId: InteractiveId | null;
  /** Borne la plus proche à portée d'interaction. */
  nearbyId: InteractiveId | null;
  /** Extrait diffusé sur l'écran de scène ; null = bannière d'attente du Summit. */
  stageVideoId: string | null;
  toast: string | null;
  metrics: MetricsData;
  /** 'snapshot' = instantané embarqué, 'live' = API en direct, 'error' = API injoignable. */
  metricsStatus: 'snapshot' | 'live' | 'error';
  setLang: (lang: Lang) => void;
  setLoaded: (loaded: boolean) => void;
  start: () => void;
  open: (id: InteractiveId) => void;
  close: () => void;
  setNearby: (id: InteractiveId | null) => void;
  setStageVideo: (id: string | null) => void;
  showToast: (message: string) => void;
  loadMetrics: () => Promise<void>;
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useWorld = create<WorldState>((set) => ({
  lang: 'fr',
  loaded: false,
  started: false,
  activeId: null,
  nearbyId: null,
  stageVideoId: null,
  toast: null,
  metrics: METRICS_SNAPSHOT,
  metricsStatus: 'snapshot',
  setLang: (lang) => set({ lang }),
  setLoaded: (loaded) => set({ loaded }),
  start: () => set({ started: true }),
  open: (id) => set({ activeId: id }),
  close: () => set({ activeId: null }),
  setNearby: (id) => set((s) => (s.nearbyId === id ? s : { nearbyId: id })),
  setStageVideo: (id) => set({ stageVideoId: id }),
  showToast: (message) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: message });
    toastTimer = setTimeout(() => set({ toast: null }), 2200);
  },
  loadMetrics: async () => {
    try {
      const metrics = await fetchLiveMetrics(METRICS_SNAPSHOT.openInterestHistory);
      set({ metrics, metricsStatus: 'live' });
    } catch {
      set((s) => (s.metricsStatus === 'live' ? s : { metricsStatus: 'error' }));
    }
  },
}));

/**
 * État mutable du joueur, lu à chaque frame (proximité, caméra) sans provoquer
 * de re-render React.
 */
export const playerState = {
  position: new Vector3(0, 1, 32),
};

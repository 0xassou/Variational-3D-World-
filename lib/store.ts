import { create } from 'zustand';
import { Vector3 } from 'three';
import type { InteractiveId, Lang } from './content';

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
  setLang: (lang: Lang) => void;
  setLoaded: (loaded: boolean) => void;
  start: () => void;
  open: (id: InteractiveId) => void;
  close: () => void;
  setNearby: (id: InteractiveId | null) => void;
  setStageVideo: (id: string | null) => void;
  showToast: (message: string) => void;
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
}));

/**
 * État mutable du joueur, lu à chaque frame (proximité, caméra) sans provoquer
 * de re-render React.
 */
export const playerState = {
  position: new Vector3(0, 1, 32),
};

import type { Lang } from './content';

/** Libellés de l'interface 2D (HUD + modal), séparés du contenu des stands. */
export const UI = {
  beginner: { fr: 'Pour les débutants', en: 'For beginners', ko: '입문자용' },
  deepTech: { fr: 'Deep Tech / Alpha', en: 'Deep Tech / Alpha', ko: '딥테크 / 알파' },
  flow: { fr: 'Schéma simplifié', en: 'Simplified diagram', ko: '간단한 구조도' },
  quotes: { fr: 'Citations', en: 'Quotes', ko: '인용' },
  videos: { fr: 'Extraits vidéo', en: 'Video clips', ko: '영상 클립' },
  sources: { fr: 'Sources', en: 'Sources', ko: '출처' },
  toVerify: { fr: 'À vérifier avant affichage', en: 'To verify before display', ko: '표시 전 확인 필요' },
  unverified: { fr: 'à recouper', en: 'to cross-check', ko: '교차 확인 필요' },
  playOnScreen: { fr: 'Diffuser sur l’écran', en: 'Play on screen', ko: '스크린에서 재생' },
  nowOnScreen: { fr: 'À l’écran', en: 'On screen', ko: '재생 중' },
  watchHere: { fr: 'Regarder ici', en: 'Watch here', ko: '여기서 보기' },
  hideVideo: { fr: 'Masquer', en: 'Hide', ko: '숨기기' },
  openYoutube: { fr: 'YouTube', en: 'YouTube', ko: 'YouTube' },
  close: { fr: 'Fermer', en: 'Close', ko: '닫기' },
  language: { fr: 'Langue', en: 'Language', ko: '언어' },
  disclaimer: {
    fr: 'Contenu éducatif issu de recherches non vérifiées. Pas de conseil financier.',
    en: 'Educational content from unverified research. Not financial advice.',
    ko: '검증되지 않은 리서치 기반의 교육용 콘텐츠입니다. 투자 조언이 아닙니다.',
  },
  interactPrompt: {
    fr: 'Appuie sur E ou clique sur la borne',
    en: 'Press E or click the kiosk',
    ko: 'E 키를 누르거나 키오스크를 클릭하세요',
  },
  tooFar: {
    fr: 'Approche-toi de la borne pour interagir',
    en: 'Walk closer to the kiosk to interact',
    ko: '상호작용하려면 키오스크에 더 가까이 가세요',
  },
  controlsTitle: { fr: 'Commandes', en: 'Controls', ko: '조작법' },
  controlsMove: {
    fr: 'ZQSD / WASD / flèches : se déplacer',
    en: 'WASD / ZQSD / arrows: move',
    ko: 'WASD / ZQSD / 방향키: 이동',
  },
  controlsRun: { fr: 'Maj : courir', en: 'Shift: run', ko: 'Shift: 달리기' },
  controlsCamera: {
    fr: 'Clic gauche maintenu + souris : caméra · molette : zoom',
    en: 'Hold left click + mouse: camera · wheel: zoom',
    ko: '왼쪽 클릭 유지 + 마우스: 카메라 · 휠: 줌',
  },
  controlsInteract: { fr: 'E / clic : interagir · Échap : fermer', en: 'E / click: interact · Esc: close', ko: 'E / 클릭: 상호작용 · Esc: 닫기' },
  welcomeTitle: { fr: 'Bienvenue au Variational Summit', en: 'Welcome to the Variational Summit', ko: 'Variational Summit에 오신 것을 환영합니다' },
  welcomeBody: {
    fr: 'Explore le hall, visite les 4 stands, regarde Lucas Schuermann sur la scène principale et passe par le Twitter Alpha Wall.',
    en: 'Explore the hall, visit the 4 booths, watch Lucas Schuermann on the main stage and stop by the Twitter Alpha Wall.',
    ko: '홀을 둘러보고, 4개의 부스를 방문하고, 메인 스테이지에서 Lucas Schuermann을 보고, 트위터 알파 월에도 들러보세요.',
  },
  enter: { fr: 'Entrer dans le hall', en: 'Enter the hall', ko: '홀 입장' },
  loading: { fr: 'Chargement du hall…', en: 'Loading the hall…', ko: '홀 불러오는 중…' },
} satisfies Record<string, Record<Lang, string>>;

export type UIKey = keyof typeof UI;

export function t(key: UIKey, lang: Lang): string {
  return UI[key][lang];
}

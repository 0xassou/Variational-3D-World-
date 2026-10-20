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
  stopScreen: { fr: 'Arrêter', en: 'Stop', ko: '정지' },
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
    fr: 'Suis le parcours : les stands produits (RFQ, Omni, Pro, Swaps) et le stand central Live Metrics, puis termine au fond de la salle avec la Tokenomics $VAR et la Vision, de part et d’autre de la scène.',
    en: 'Follow the route: the product booths (RFQ, Omni, Pro, Swaps) and the central Live Metrics stand, then finish at the back with $VAR Tokenomics and Vision, on either side of the stage.',
    ko: '관람 동선을 따라가세요: 제품 부스(RFQ, Omni, Pro, Swaps)와 중앙 Live Metrics 부스를 둘러본 뒤, 무대 양옆의 $VAR 토크노믹스와 비전 부스에서 마무리하세요.',
  },
  enter: { fr: 'Entrer dans le hall', en: 'Enter the hall', ko: '홀 입장' },
  loading: { fr: 'Chargement du hall…', en: 'Loading the hall…', ko: '홀 불러오는 중…' },
  tabOverview: { fr: 'Essentiel', en: 'Overview', ko: '개요' },
  tabDeep: { fr: 'Deep Tech', en: 'Deep Tech', ko: '딥테크' },
  tabMedia: { fr: 'Citations & sources', en: 'Quotes & sources', ko: '인용 및 출처' },
  keyFigures: { fr: 'Chiffres clés', en: 'Key figures', ko: '핵심 수치' },
  dashboard: { fr: 'Tableau de bord', en: 'Dashboard', ko: '대시보드' },
  volume24h: { fr: 'Volume 24h', en: '24h volume', ko: '24시간 거래량' },
  cumulative: { fr: 'Cumulé', en: 'All-time', ko: '누적' },
  openInterest: { fr: 'Open interest', en: 'Open interest', ko: '미결제약정' },
  markets: { fr: 'Marchés', en: 'Markets', ko: '마켓' },
  crypto: { fr: 'Crypto', en: 'Crypto', ko: '크립토' },
  oiHistory: { fr: 'Open interest — historique hebdomadaire', en: 'Open interest — weekly history', ko: '미결제약정 — 주간 추이' },
  topMarkets: { fr: 'Top 10 marchés par volume 24h', en: 'Top 10 markets by 24h volume', ko: '24시간 거래량 상위 10개 마켓' },
  rwaShare: { fr: 'Part RWA du volume 24h', en: 'RWA share of 24h volume', ko: '24시간 거래량 중 RWA 비중' },
  live: { fr: 'En direct', en: 'Live', ko: '실시간' },
  snapshot: { fr: 'Instantané', en: 'Snapshot', ko: '스냅샷' },
  updatedAt: { fr: 'mis à jour', en: 'updated', ko: '업데이트' },
  refresh: { fr: 'Actualiser', en: 'Refresh', ko: '새로고침' },
  metricsNote: {
    fr: 'Sources : API publique Variational (volume, TVL, OI, marchés) et DefiLlama (historique OI). Classement RWA indicatif. Pas de conseil financier.',
    en: 'Sources: public Variational API (volume, TVL, OI, markets) and DefiLlama (OI history). RWA split is indicative. Not financial advice.',
    ko: '출처: Variational 공개 API(거래량, TVL, OI, 마켓) 및 DefiLlama(OI 추이). RWA 분류는 참고용입니다. 투자 조언이 아닙니다.',
  },
  soundOn: { fr: 'Activer le son', en: 'Turn sound on', ko: '소리 켜기' },
  soundOff: { fr: 'Couper le son', en: 'Mute sound', ko: '소리 끄기' },
  socialTitle: { fr: 'Suivre & accéder', en: 'Follow & access', ko: '팔로우 & 접속' },
  creatorTitle: { fr: 'Créateur du Summit', en: 'Summit creator', ko: 'Summit 제작자' },
  creatorMessage: {
    fr: 'Curieux d’en savoir plus sur ce sommet ou d’échanger sur l’écosystème ? Mes DMs sont ouverts (@0x_assou).',
    en: 'Curious to learn more about this summit or to talk about the ecosystem? My DMs are open (@0x_assou).',
    ko: '이 서밋에 대해 더 알고 싶거나 생태계에 대해 이야기하고 싶으신가요? DM은 언제나 열려 있습니다 (@0x_assou).',
  },
  socialCeo: { fr: 'Lucas Schuermann — CEO', en: 'Lucas Schuermann — CEO', ko: 'Lucas Schuermann — CEO' },
  socialVariational: { fr: 'Compte X officiel', en: 'Official X account', ko: '공식 X 계정' },
  socialAccess: { fr: 'Accéder à Omni', en: 'Open Omni', ko: 'Omni 열기' },
  socialAccessNote: {
    fr: 'Lien direct vers le protocole (lien d’affiliation si un code est configuré).',
    en: 'Direct link to the protocol (affiliate link when a code is configured).',
    ko: '프로토콜 바로가기 (코드가 설정되면 추천 링크).',
  },
} satisfies Record<string, Record<Lang, string>>;

export type UIKey = keyof typeof UI;

export function t(key: UIKey, lang: Lang): string {
  return UI[key][lang];
}

/**
 * Contenu multilingue (FR / EN / KO) des stands, de la scène et du mur Twitter.
 *
 * Source de vérité : page Notion « Variationnal 3D World ».
 * Les citations sont conservées dans leur langue d'origine (anglais) pour rester exactes.
 */

export type Lang = 'fr' | 'en' | 'ko';
export const LANGS: Lang[] = ['fr', 'en', 'ko'];

export type Localized<T = string> = Record<Lang, T>;

export type InteractiveId = 'rfq' | 'omni' | 'pro' | 'swaps' | 'tokenomics' | 'vision' | 'metrics' | 'twitter' | 'stage';

export interface Quote {
  text: string;
  author: string;
  /** Contexte de la citation (podcast, rapport, post X…). */
  context: string;
  url?: string;
}

export interface VideoClip {
  id: string;
  youtubeId: string;
  /** Début de l'extrait en secondes (paramètre ?start=). */
  start?: number;
  /** Fin de l'extrait en secondes (paramètre ?end=). */
  end?: number;
  show: string;
  title: Localized;
  note: Localized;
  /** false = l'auteur interdit la lecture hors de YouTube (lien externe uniquement). */
  embeddable?: false;
}

export interface SourceLink {
  label: string;
  url: string;
}

export interface ComparisonTable {
  caption: Localized;
  columns: Localized<[string, string]>;
  rows: { label: Localized; values: Localized<[string, string]> }[];
  source: SourceLink;
}

export interface StandContent {
  id: InteractiveId;
  /** Numéro affiché sur le stand (ex. « 01 »), absent pour la scène et le mur. */
  number?: string;
  /** Couleur d'accent du stand (t-shirts du staff, bandeaux). */
  accent: string;
  /** Titre court affiché en 3D sur le stand (alphabet latin, police embarquée). */
  signTitle: string;
  title: Localized;
  tagline: Localized;
  /** Phrase d'introduction pédagogique, affichée en grand en tête de l'onglet « Essentiel ». */
  lead?: Localized;
  beginner: Localized<string[]>;
  deepTech: Localized<string[]>;
  /** Schéma simplifié en étapes, rendu sous forme de flèches dans le modal. */
  flow?: Localized<string[]>;
  table?: ComparisonTable;
  quotes: Quote[];
  videoIds: string[];
  sources: SourceLink[];
  /** Feuille de route (stand Vision). */
  timeline?: { when: Localized; what: Localized; status: 'live' | 'next' | 'later' }[];
}

/* ------------------------------------------------------------------ */
/* Vidéos (extraits de 2 min listés dans le Notion)                     */
/* ------------------------------------------------------------------ */

export const VIDEOS: Record<string, VideoClip> = {
  'bankless-broker': {
    id: 'bankless-broker',
    youtubeId: 'fSt4qmz1C_M',
    start: 53,
    end: 173,
    show: 'Bankless',
    title: {
      fr: 'Modèle broker, pas d’order book : on agrège la liquidité',
      en: 'Broker-like model, no order book: aggregating liquidity',
      ko: '브로커형 모델, 오더북 없음: 유동성을 모은다',
    },
    note: {
      fr: 'Extrait 00:53 → 02:53. Vérifié sur le transcript Bankless.',
      en: 'Clip 00:53 → 02:53. Checked against the Bankless transcript.',
      ko: '00:53 → 02:53 구간. Bankless 스크립트로 확인됨.',
    },
  },
  'gwart-rfq': {
    id: 'gwart-rfq',
    youtubeId: 'tfS9k2w1WhM',
    start: 528,
    end: 648,
    show: 'The Gwart Show',
    title: {
      fr: 'Modèle broker, RFQ vs OLP, pas d’order book',
      en: 'Broker model, RFQ vs OLP, no order book',
      ko: '브로커 모델, RFQ vs OLP, 오더북 없음',
    },
    note: {
      fr: 'Extrait 08:48 → 10:48. Vérifié sur l’audio, décalage YouTube possible.',
      en: 'Clip 08:48 → 10:48. Checked on audio, YouTube offset possible.',
      ko: '08:48 → 10:48 구간. 오디오로 확인, YouTube 시간차 가능.',
    },
  },
  'castle-rfq-clob': {
    id: 'castle-rfq-clob',
    youtubeId: 'tucl1jCTy6E',
    embeddable: false,
    show: 'Castle Labs',
    title: {
      fr: 'RFQ vs CLOB (vidéo complète)',
      en: 'RFQ vs CLOB (full video)',
      ko: 'RFQ vs CLOB (전체 영상)',
    },
    note: {
      fr: 'Vidéo complète, sans extrait minuté.',
      en: 'Full video, no timed excerpt.',
      ko: '구간 지정 없이 전체 영상 제공.',
    },
  },
  'fwm-zero-fees': {
    id: 'fwm-zero-fees',
    youtubeId: '_5bYsyJUx68',
    start: 345,
    end: 465,
    show: 'Flirting with Models',
    title: {
      fr: 'Zéro fees et spreads plus serrés',
      en: 'Zero fees and tighter spreads',
      ko: '수수료 0%와 더 좁은 스프레드',
    },
    note: {
      fr: 'Extrait 05:45 → 07:45. Vérifié sur le transcript (06:10 → 06:39).',
      en: 'Clip 05:45 → 07:45. Checked against the transcript (06:10 → 06:39).',
      ko: '05:45 → 07:45 구간. 스크립트로 확인 (06:10 → 06:39).',
    },
  },
  'wsh-fees-scam': {
    id: 'wsh-fees-scam',
    youtubeId: 'Y_pWv3VayqU',
    start: 2073,
    end: 2193,
    show: 'When Shift Happens',
    title: {
      fr: '« Are trading fees a scam? »',
      en: '“Are trading fees a scam?”',
      ko: '“거래 수수료는 사기인가?”',
    },
    note: {
      fr: 'Extrait 34:33 → 36:33. Vérifié sur le transcript.',
      en: 'Clip 34:33 → 36:33. Checked against the transcript.',
      ko: '34:33 → 36:33 구간. 스크립트로 확인됨.',
    },
  },
  'rollup-series-a': {
    id: 'rollup-series-a',
    youtubeId: 'AC8p7kjlFas',
    show: 'The Rollup',
    title: {
      fr: 'Série A de 50 M$, perps RWA et TradFi on-chain',
      en: '$50M Series A, RWA perps and TradFi onchain',
      ko: '5천만 달러 시리즈 A, RWA 무기한, 온체인 TradFi',
    },
    note: {
      fr: 'Vidéo complète (hors Notion), titre repris de YouTube.',
      en: 'Full video (not in the Notion), title as on YouTube.',
      ko: '전체 영상 (노션 외), 제목은 YouTube 기준.',
    },
  },
  'bankless-funds': {
    id: 'bankless-funds',
    youtubeId: 'fSt4qmz1C_M',
    start: 1960,
    end: 2080,
    show: 'Bankless',
    title: {
      fr: 'Fonds utilisateurs ségrégués on-chain sur Arbitrum',
      en: 'User funds segregated onchain on Arbitrum',
      ko: 'Arbitrum 온체인에 분리 보관되는 사용자 자금',
    },
    note: {
      fr: 'Extrait 32:40 → 34:40.',
      en: 'Clip 32:40 → 34:40.',
      ko: '32:40 → 34:40 구간.',
    },
  },
};

export function youtubeEmbedUrl(
  clip: VideoClip,
  opts: { autoplay?: boolean; mute?: boolean } = {},
): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });
  if (clip.start !== undefined) params.set('start', String(clip.start));
  if (clip.end !== undefined) params.set('end', String(clip.end));
  if (opts.autoplay) params.set('autoplay', '1');
  if (opts.mute) params.set('mute', '1');
  return `https://www.youtube-nocookie.com/embed/${clip.youtubeId}?${params.toString()}`;
}

export function youtubeWatchUrl(clip: VideoClip): string {
  const t = clip.start ? `&t=${clip.start}s` : '';
  return `https://www.youtube.com/watch?v=${clip.youtubeId}${t}`;
}

export function formatTime(seconds?: number): string {
  if (seconds === undefined) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/* ------------------------------------------------------------------ */
/* Citations partagées                                                 */
/* ------------------------------------------------------------------ */

const DEFILLAMA_REPORT = 'https://defillama.com/research/report/variational-and-the-shift-to-onchain-brokerage';

const Q_MAIN: Quote = {
  text:
    'The RFQ model solves the cold start problem of bootstrapping liquidity that limits order books. Order books require subsidizing external market makers to build depth for each new asset. Variational’s RFQ model, combined with a single vertically integrated liquidity provider, bypasses this requirement entirely. […] RFQ is the only way to bridge that gap without decades of bootstrapping and millions in subsidies to market makers.',
  author: 'Lucas Schuermann',
  context: 'DefiLlama Research, 2026',
  url: DEFILLAMA_REPORT,
};

const Q_AGGREGATING: Quote = {
  text: 'We’re not rebuilding liquidity. We’re aggregating.',
  author: 'Lucas Schuermann',
  context: 'Flirting with Models / Scuttlebutt',
  url: 'https://www.youtube.com/watch?v=_5bYsyJUx68',
};

const Q_BROKER: Quote = {
  text:
    'We’re building a broker-like model as opposed to an order book or an exchange using RFQ to match versus our users.',
  author: 'Lucas Schuermann',
  context: 'Flirting with Models / Scuttlebutt',
  url: 'https://www.youtube.com/watch?v=_5bYsyJUx68',
};

const Q_FEES: Quote = {
  text:
    'For most users, execution costs = fees + spread. On Variational, zero-fee trading meets TradFi-quality liquidity.',
  author: 'Lucas Schuermann',
  context: 'Post X',
};

const Q_REHYPO: Quote = {
  text:
    'We do not rehypothecate user balances. User funds sit in isolated smart contracts — we call them settlement pools.',
  author: 'Lucas Schuermann',
  context: 'Flirting with Models',
  url: 'https://www.youtube.com/watch?v=_5bYsyJUx68',
};

const Q_NO_COUNTER: Quote = {
  text: 'We don’t counter trade users.',
  author: 'Lucas Schuermann',
  context: 'Flirting with Models',
  url: 'https://www.youtube.com/watch?v=_5bYsyJUx68',
};

const Q_SINGLE_FILL: Quote = {
  text:
    'The trader gets a single fill price with no slippage while the market maker absorbs and hedges the position risk offchain.',
  author: 'Alea Research',
  context: 'Analyst note',
};

/* Space X officiel de Variational, 20 oct. 2026 (Lucas Schuermann, interviewé par Andy de The Rollup). */
const SPACE_SOURCE: SourceLink = {
  label: 'Space X Variational × The Rollup — 20 Oct 2026 (Lucas Schuermann)',
  url: 'https://x.com/variational_io',
};
const SPACE_CONTEXT = 'Space X Variational × The Rollup, 20 Oct 2026';

const Q_PRO_INSTITUTIONS: Quote = {
  text: '[Pro is] primarily targeted at institutions.',
  author: 'Lucas Schuermann',
  context: SPACE_CONTEXT,
};

const Q_NOT_EXCHANGE: Quote = {
  text: '[Variational] is not an exchange.',
  author: 'Lucas Schuermann',
  context: SPACE_CONTEXT,
};

const Q_PRO_FIRST_STEPS: Quote = {
  text: 'We’re going into pro next year.',
  author: 'Lucas Schuermann',
  context: SPACE_CONTEXT,
};

const Q_PRO_LARGER: Quote = {
  text: 'Pro will eventually be the larger business.',
  author: 'Lucas Schuermann',
  context: SPACE_CONTEXT,
};

/* ------------------------------------------------------------------ */
/* Stands                                                               */
/* ------------------------------------------------------------------ */

export const CONTENT: Record<InteractiveId, StandContent> = {
  rfq: {
    id: 'rfq',
    lead: {
      fr: 'Au lieu d’attendre qu’un carnet d’ordres se remplisse, tu demandes un prix et Variational te répond avec un prix ferme pour toute ta taille.',
      en: 'Instead of waiting for an order book to fill, you ask for a price and Variational answers with a firm price for your whole size.',
      ko: '오더북이 채워지기를 기다리는 대신, 가격을 요청하면 Variational이 전체 수량에 대한 확정 가격으로 응답합니다.',
    },
    number: '01',
    accent: '#4C9AF8',
    signTitle: 'RFQ Engine vs Orderbooks',
    title: {
      fr: 'Moteur RFQ vs Orderbooks',
      en: 'RFQ Engine vs Orderbooks',
      ko: 'RFQ 엔진 vs 오더북',
    },
    tagline: {
      fr: 'Agréger la liquidité existante au lieu de la reconstruire.',
      en: 'Aggregate existing liquidity instead of rebuilding it.',
      ko: '유동성을 새로 만들지 않고, 이미 있는 유동성을 모은다.',
    },
    beginner: {
      fr: [
        'Sur un exchange classique (orderbook) ou un AMM type GMX, il faut créer de la profondeur pour chaque nouveau marché : on subventionne des market makers externes et du capital reste bloqué en permanence.',
        'Variational fonctionne en RFQ (« Request For Quote ») : tu demandes un prix pour une taille précise, un fournisseur de liquidité unique (l’OLP) te répond avec un prix ferme.',
        'Résultat : pas de « cold start » pour lister un nouvel actif. Variational liste 575+ marchés dérivés (crypto + RWA, y compris long-tail et pré-listings).',
      ],
      en: [
        'On a classic exchange (orderbook) or a GMX-style AMM, depth has to be bootstrapped for every new market: external market makers are subsidised and capital stays locked permanently.',
        'Variational uses RFQ (“Request For Quote”): you ask for a price for a precise size, and a single liquidity provider (the OLP) answers with a firm price.',
        'Result: no “cold start” to list a new asset. Variational lists 575+ derivatives markets (crypto + RWA, including long-tail and pre-listings).',
      ],
      ko: [
        '일반적인 거래소(오더북)나 GMX 같은 AMM에서는 새 마켓마다 유동성 깊이를 만들어야 합니다. 외부 마켓메이커에게 보조금을 주고 자본이 계속 묶여 있습니다.',
        'Variational은 RFQ(“Request For Quote”, 견적 요청) 방식입니다. 원하는 수량의 가격을 요청하면 단일 유동성 공급자(OLP)가 확정 가격으로 응답합니다.',
        '결과: 새 자산 상장에 “콜드 스타트”가 없습니다. Variational은 575개 이상의 파생상품 마켓(크립토 + RWA, 롱테일과 프리상장 포함)을 상장하고 있습니다.',
      ],
    },
    deepTech: {
      fr: [
        'RFQ + OLP (Omni Liquidity Provider) verticalement intégré : l’OLP agrège CEX, DEX, OTC et dealers TradFi et ne quote que lorsqu’il y a une demande, sans profondeur d’orderbook à maintenir par paire.',
        'Slippage orderbook : un gros ordre « marche le book », slippage progressif et intention visible de tous.',
        'Slippage AMM : le price impact dépend de la courbe et de la taille du pool, il est structurel.',
        'Slippage RFQ : quote ferme pour la taille demandée (single fill), puis l’OLP hedge off-chain (Binance, CME, dealers TradFi).',
        'Flow d’un trade RFQ (docs) : ordre → quote → acceptation → last look → collatéral → settlement.',
        'Lucas Schuermann (Space X du 20 oct. 2026) : Variational « is not an exchange », c’est une plateforme technologique de négociation RFQ et de settlement/clearing.',
      ],
      en: [
        'RFQ + a vertically integrated OLP (Omni Liquidity Provider): the OLP aggregates CEXs, DEXs, OTC desks and TradFi dealers and only quotes when there is demand — no per-pair orderbook depth to maintain.',
        'Orderbook slippage: a large order “walks the book”, progressive slippage and intent visible to everyone.',
        'AMM slippage: price impact depends on the curve and pool size — it is structural.',
        'RFQ slippage: firm quote for the requested size (single fill), then the OLP hedges offchain (Binance, CME, TradFi dealers).',
        'RFQ trade flow (docs): order → quote → acceptance → last look → collateral → settlement.',
        'Lucas Schuermann (X Space, 20 Oct 2026): Variational “is not an exchange”, it is a technology platform for RFQ negotiation and settlement/clearing.',
      ],
      ko: [
        'RFQ + 수직 통합된 OLP(Omni Liquidity Provider): OLP는 CEX, DEX, OTC, TradFi 딜러의 유동성을 모으고, 수요가 있을 때만 호가를 냅니다. 페어별 오더북 깊이를 유지할 필요가 없습니다.',
        '오더북 슬리피지: 큰 주문은 “호가창을 먹어 들어가며” 점진적 슬리피지가 생기고 의도가 모두에게 노출됩니다.',
        'AMM 슬리피지: 가격 영향이 커브와 풀 크기에 달려 있어 구조적입니다.',
        'RFQ 슬리피지: 요청 수량에 대한 확정 호가(단일 체결) 후 OLP가 오프체인에서 헤지합니다(Binance, CME, TradFi 딜러).',
        'RFQ 거래 흐름(문서): 주문 → 호가 → 수락 → 라스트 룩 → 담보 → 정산.',
        'Lucas Schuermann(2026년 10월 20일 X 스페이스): Variational은 “is not an exchange”, 즉 거래소가 아니라 RFQ 협상과 정산/청산을 위한 기술 플랫폼입니다.',
      ],
    },
    flow: {
      fr: ['Trader : demande de quote', 'OLP : prix ferme', 'Single fill on-chain', 'Hedge off-chain (CEX, CME, dealers)'],
      en: ['Trader: quote request', 'OLP: firm price', 'Single fill onchain', 'Offchain hedge (CEX, CME, dealers)'],
      ko: ['트레이더: 견적 요청', 'OLP: 확정 가격', '온체인 단일 체결', '오프체인 헤지 (CEX, CME, 딜러)'],
    },
    quotes: [Q_MAIN, Q_AGGREGATING, Q_BROKER, Q_NOT_EXCHANGE, Q_SINGLE_FILL],
    videoIds: ['bankless-broker', 'gwart-rfq', 'castle-rfq-clob'],
    sources: [
      { label: 'DefiLlama Research — Variational and the shift to onchain brokerage', url: DEFILLAMA_REPORT },
      { label: 'Docs — Trading via RFQ', url: 'https://docs.variational.io/variational-protocol/key-concepts/trading-via-rfq' },
      { label: 'Docs — P2P trading protocol vs DEX', url: 'https://docs.variational.io/variational-protocol/key-concepts/p2p-trading-protocol-vs-dex' },
      { label: 'Docs — The Omni Liquidity Provider (OLP)', url: 'https://docs.variational.io/omni/the-omni-liquidity-provider-olp' },
    ],
  },

  omni: {
    id: 'omni',
    lead: {
      fr: 'Omni, c’est l’app de trading de Variational : 0 % de frais, un seul coût à surveiller — le spread.',
      en: 'Omni is Variational’s trading app: 0% fees, only one cost to watch — the spread.',
      ko: 'Omni는 Variational의 거래 앱입니다. 수수료 0%, 신경 쓸 비용은 스프레드 하나뿐입니다.',
    },
    number: '02',
    accent: '#0ea5a4',
    signTitle: 'Variational Omni · 0% Fees',
    title: {
      fr: 'Variational Omni & 0 % de fees',
      en: 'Variational Omni & 0% Fees',
      ko: 'Variational Omni & 수수료 0%',
    },
    tagline: {
      fr: 'Coût d’exécution = fees + spread. Omni supprime les fees.',
      en: 'Execution cost = fees + spread. Omni removes the fees.',
      ko: '실행 비용 = 수수료 + 스프레드. Omni는 수수료를 없앱니다.',
    },
    beginner: {
      fr: [
        'Omni est le produit retail actuel de Variational, sur Arbitrum : perps et swaps sur des sous-jacents crypto et TradFi, avec 0 % de frais de trading.',
        'Comment c’est possible ? Le market maker (l’OLP) fait partie de Variational. Au lieu de payer des market makers externes, Variational capte le spread : c’est sa seule source de revenus.',
        'Pour toi, le coût réel d’un trade, c’est fees + spread. Sur Omni, il ne reste que le spread.',
        'Selon Lucas Schuermann (Space X du 20 oct. 2026), Omni traite 3 à 4 milliards de dollars par jour.',
      ],
      en: [
        'Omni is Variational’s current retail product on Arbitrum: perps and swaps on crypto and TradFi underlyings, with 0% trading fees.',
        'How is that possible? The market maker (the OLP) is part of Variational. Instead of paying external market makers, Variational captures the spread — its only source of revenue.',
        'For you, the real cost of a trade is fees + spread. On Omni, only the spread remains.',
        'According to Lucas Schuermann (X Space, 20 Oct 2026), Omni handles $3 to 4 billion a day.',
      ],
      ko: [
        'Omni는 Arbitrum 위에서 동작하는 Variational의 현재 리테일 상품으로, 크립토와 TradFi 기초자산의 무기한 선물(perps)과 스왑을 거래 수수료 0%로 제공합니다.',
        '어떻게 가능할까요? 마켓메이커(OLP)가 Variational 내부에 있기 때문입니다. 외부 마켓메이커에게 비용을 지불하는 대신 스프레드를 수익으로 가져가며, 이것이 유일한 수익원입니다.',
        '사용자에게 실제 거래 비용은 수수료 + 스프레드입니다. Omni에서는 스프레드만 남습니다.',
        'Lucas Schuermann(2026년 10월 20일 X 스페이스)에 따르면 Omni의 하루 거래량은 30억~40억 달러입니다.',
      ],
    },
    deepTech: {
      fr: [
        'L’OLP internalise le flow retail et ne hedge que le résiduel sur des venues à fees bas.',
        'Boucle vertueuse : plus de volume → moins de coût de hedge → spreads plus serrés.',
        'Les market makers externes ne peuvent pas extraire de valeur du flow retail (argument repris sur le mur Twitter).',
        'Un seul fill par trade grâce au RFQ : pas de « walk the book » sur les grosses tailles.',
        '575+ marchés dérivés listés (crypto + RWA, long-tail, pré-listings) sans profondeur d’orderbook à subventionner.',
        'Même infrastructure que Variational Pro : les fournisseurs de liquidité institutionnels de Pro seront aussi intégrés à Omni, pour plus de profondeur et plus de produits.',
        'Une partie de Pro doit s’ouvrir plus tard aux utilisateurs d’Omni, par exemple les options. La forme exacte n’est pas encore décidée.',
      ],
      en: [
        'The OLP internalises retail flow and only hedges the residual on low-fee venues.',
        'Flywheel: more volume → lower hedging cost → tighter spreads.',
        'External market makers cannot extract value from retail flow (argument echoed on the Twitter wall).',
        'One fill per trade thanks to RFQ: no “walking the book” on large sizes.',
        '575+ derivatives markets listed (crypto + RWA, long-tail, pre-listings) with no orderbook depth to subsidise.',
        'Same infrastructure as Variational Pro: Pro’s institutional liquidity providers will also be integrated into Omni, for more depth and more products.',
        'Part of Pro is planned to open later to Omni users, options for example. The exact form is not decided yet.',
      ],
      ko: [
        'OLP는 리테일 주문 흐름을 내부화하고, 남는 포지션만 수수료가 낮은 거래소에서 헤지합니다.',
        '선순환: 거래량 증가 → 헤지 비용 감소 → 더 좁은 스프레드.',
        '외부 마켓메이커가 리테일 흐름에서 가치를 빼내지 못합니다(트위터 월에서도 언급된 논점).',
        'RFQ 덕분에 거래당 한 번의 체결: 큰 주문도 호가창을 먹어 들어가지 않습니다.',
        '보조금이 필요한 오더북 없이 575개 이상의 파생상품 마켓 상장(크립토 + RWA, 롱테일, 프리상장).',
        'Variational Pro와 같은 인프라: Pro의 기관 유동성 공급자들이 Omni에도 통합되어 더 많은 깊이와 상품을 제공합니다.',
        'Pro의 일부(예: 옵션)는 나중에 Omni 사용자에게도 열릴 예정입니다. 정확한 형태는 아직 정해지지 않았습니다.',
      ],
    },
    flow: {
      fr: ['Flow retail', 'Internalisé par l’OLP', 'Résiduel hedgé (fees bas)', 'Spread plus serré'],
      en: ['Retail flow', 'Internalised by the OLP', 'Residual hedged (low fees)', 'Tighter spread'],
      ko: ['리테일 흐름', 'OLP가 내부화', '잔여분 헤지 (저수수료)', '더 좁은 스프레드'],
    },
    quotes: [Q_FEES, Q_NO_COUNTER, Q_AGGREGATING],
    videoIds: ['fwm-zero-fees', 'wsh-fees-scam'],
    sources: [
      { label: 'Omni — markets list', url: 'https://omni.variational.io/markets' },
      { label: 'Docs — The Omni Liquidity Provider (OLP)', url: 'https://docs.variational.io/omni/the-omni-liquidity-provider-olp' },
      { label: 'DefiLlama Research — revenue, volume, open interest', url: DEFILLAMA_REPORT },
      SPACE_SOURCE,
    ],
  },

  pro: {
    id: 'pro',
    lead: {
      fr: 'Variational Pro amène les dérivés OTC institutionnels on-chain : une plateforme RFQ automatisée et multi-dealers, avec un règlement en stablecoins via des smart contracts.',
      en: 'Variational Pro brings institutional OTC derivatives onchain: an automated, multi-dealer RFQ platform with settlement in stablecoins through smart contracts.',
      ko: 'Variational Pro는 기관용 장외(OTC) 파생상품을 온체인으로 가져옵니다. 자동화된 멀티 딜러 RFQ 플랫폼이며, 스마트 컨트랙트를 통해 스테이블코인으로 정산합니다.',
    },
    number: '03',
    accent: '#334155',
    signTitle: 'Variational Pro · OTC',
    title: {
      fr: 'Variational Pro (dérivés OTC institutionnels)',
      en: 'Variational Pro (institutional OTC derivatives)',
      ko: 'Variational Pro (기관용 OTC 파생상품)',
    },
    tagline: {
      fr: 'Du coup de fil au desk à un RFQ multi-dealers réglé on-chain.',
      en: 'From calling a desk to a multi-dealer RFQ settled onchain.',
      ko: '데스크에 전화하던 방식에서 온체인으로 정산되는 멀티 딜러 RFQ로.',
    },
    beginner: {
      fr: [
        'Omni est le produit retail actuel de Variational (perps et swaps sur des sous-jacents crypto et TradFi). Pro est consacré aux dérivés OTC institutionnels : il est « primarily targeted at institutions » qui tradent aujourd’hui via des flux manuels.',
        'Produits visés : dérivés de taux, FX, crédit (CDS), options, produits structurés et trades d’options multi-jambes.',
        'Le problème : beaucoup de ces marchés, surtout en Asie, ne passent ni par une bourse ni par un système électronique. On appelle un desk, le prix vient d’un seul interlocuteur, puis viennent DocuSign, les confirmations par email, le règlement à T+2 et les appels de marge manuels.',
        'Avec Pro, l’institution décrit le produit, envoie une demande et reçoit des cotations d’autres institutions. Après acceptation, la marge, le clearing et le règlement sont gérés on-chain.',
        'Calendrier : 2027 marquera « our first few steps towards bringing institutional derivatives and OTC on chain ». Date exacte de lancement : non vérifiée.',
      ],
      en: [
        'Omni is Variational’s current retail product (perps and swaps on crypto and TradFi underlyings). Pro is dedicated to institutional OTC derivatives: it is “primarily targeted at institutions” that trade through manual workflows today.',
        'Target products: rates derivatives, FX, credit (CDS), options, structured products and multi-leg options trades.',
        'The problem: many of these markets, especially in Asia, run through neither an exchange nor an electronic system. You call a desk, the price comes from a single counterparty, then come DocuSign, email confirmations, T+2 settlement and manual margin calls.',
        'With Pro, the institution describes the product, sends a request and receives quotes from other institutions. Once accepted, margin, clearing and settlement are handled onchain.',
        'Timeline: 2027 will be “our first few steps towards bringing institutional derivatives and OTC on chain”. Exact launch date: unverified.',
      ],
      ko: [
        'Omni는 Variational의 현재 리테일 상품입니다(크립토와 TradFi 기초자산의 무기한 선물과 스왑). Pro는 기관용 OTC 파생상품 전용이며, “primarily targeted at institutions”, 즉 현재 수작업 흐름으로 거래하는 기관을 주요 대상으로 합니다.',
        '대상 상품: 금리 파생상품, 외환(FX), 신용(CDS), 옵션, 구조화 상품, 멀티 레그 옵션 거래.',
        '문제점: 이런 시장의 상당수, 특히 아시아 시장은 거래소도 전자 시스템도 거치지 않습니다. 데스크에 전화하면 단 한 곳의 상대방이 가격을 주고, 이어서 DocuSign, 이메일 확인, T+2 결제, 수작업 마진콜이 뒤따릅니다.',
        'Pro에서는 기관이 상품을 설명하고 요청을 보내면 다른 기관들로부터 호가를 받습니다. 수락 후에는 마진, 청산(clearing), 결제가 온체인에서 처리됩니다.',
        '일정: 2027년은 “our first few steps towards bringing institutional derivatives and OTC on chain”(기관 파생상품과 OTC를 온체인으로 가져오는 첫걸음)이 됩니다. 정확한 출시일: 미확인.',
      ],
    },
    deepTech: {
      fr: [
        'Flux Pro : l’institution décrit le produit → demande RFQ → cotations d’autres institutions → à l’acceptation, un settlement pool est créé (les mêmes pools que sur Omni).',
        'Le système gère l’ouverture, le pricing, la marge, le clearing et le règlement à l’échéance, on-chain, en stablecoins et via des smart contracts.',
        'Variational « is not an exchange » : c’est une plateforme technologique (négociation RFQ + settlement/clearing) pensée pour s’insérer dans les flux existants et compatible avec ISDA.',
        'Pro et Omni partagent exactement la même infrastructure. Les fournisseurs de liquidité institutionnels de Pro seront aussi intégrés à Omni : plus de profondeur et plus de produits pour le retail.',
        'Une partie de Pro est prévue pour être ouverte plus tard aux utilisateurs d’Omni, par exemple les options. La forme exacte n’est pas encore décidée.',
        'Partenaires : il y en a des deux côtés, liquidité et premiers clients (« design partners »). Aucun nom n’est encore partagé ; Lucas annonce « some pretty big clients on pro very soon ».',
        'Contexte marché (ordres de grandeur cités par Lucas) : environ 850 000 milliards de dollars d’encours de dérivés OTC (chiffre d’il y a environ un an), environ 100 milliards de dollars d’open interest sur les dérivés Bitcoin, et un FX qui tourne à « probably 10 trillion a day ».',
        'Non vérifié, rien n’a été annoncé : date exacte de lancement, noms des partenaires, frais de Pro, conditions d’accès et KYC.',
      ],
      en: [
        'Pro flow: the institution describes the product → RFQ request → quotes from other institutions → on acceptance, a settlement pool is created (the same pools as on Omni).',
        'The system handles opening, pricing, margin, clearing and settlement at maturity, onchain, in stablecoins and through smart contracts.',
        'Variational “is not an exchange”: it is a technology platform (RFQ negotiation + settlement/clearing) designed to fit into existing workflows and compatible with ISDA.',
        'Pro and Omni share exactly the same infrastructure. Pro’s institutional liquidity providers will also be integrated into Omni: more depth and more products for retail.',
        'Part of Pro is planned to open later to Omni users, options for example. The exact form is not decided yet.',
        'Partners: there are partners on both sides, liquidity and early clients (“design partners”). No names are shared yet; Lucas mentions “some pretty big clients on pro very soon”.',
        'Market context (orders of magnitude cited by Lucas): about $850 trillion of outstanding OTC derivatives (a figure from about a year ago), about $100 billion of open interest in Bitcoin derivatives, and FX running at “probably 10 trillion a day”.',
        'Unverified, nothing announced: exact launch date, partner names, Pro fees, access conditions and KYC.',
      ],
      ko: [
        'Pro 흐름: 기관이 상품을 설명 → RFQ 요청 → 다른 기관들의 호가 → 수락 시 정산 풀(settlement pool) 생성 (Omni와 같은 풀).',
        '시스템이 포지션 개시, 가격 산정, 마진, 청산, 만기 결제를 온체인에서 스테이블코인과 스마트 컨트랙트로 처리합니다.',
        'Variational은 “is not an exchange”, 즉 거래소가 아닙니다. 기존 업무 흐름에 들어가도록 설계되고 ISDA와 호환되는 기술 플랫폼(RFQ 협상 + 정산/청산)입니다.',
        'Pro와 Omni는 완전히 같은 인프라를 공유합니다. Pro의 기관 유동성 공급자들은 Omni에도 통합되어 리테일에 더 많은 깊이와 상품을 제공합니다.',
        'Pro의 일부(예: 옵션)는 나중에 Omni 사용자에게도 열릴 예정입니다. 정확한 형태는 아직 정해지지 않았습니다.',
        '파트너: 유동성과 초기 고객(“design partners”) 양쪽에 파트너가 있습니다. 아직 이름은 공개되지 않았으며, Lucas는 “some pretty big clients on pro very soon”이라고 말했습니다.',
        '시장 규모(Lucas가 언급한 대략적 수치): 장외 파생상품 잔액 약 850조 달러(약 1년 전 수치), 비트코인 파생상품 미결제약정 약 1,000억 달러, 외환(FX) 거래 “probably 10 trillion a day”(하루 약 10조 달러).',
        '미확인, 발표된 내용 없음: 정확한 출시일, 파트너 이름, Pro 수수료, 이용 조건과 KYC.',
      ],
    },
    flow: {
      fr: ['Institution : décrit le produit', 'Demande RFQ multi-dealers', 'Cotations d’autres institutions', 'Acceptation → settlement pool', 'Marge, clearing, règlement on-chain'],
      en: ['Institution: describes the product', 'Multi-dealer RFQ request', 'Quotes from other institutions', 'Acceptance → settlement pool', 'Margin, clearing, onchain settlement'],
      ko: ['기관: 상품 설명', '멀티 딜러 RFQ 요청', '다른 기관들의 호가', '수락 → 정산 풀', '마진, 청산, 온체인 결제'],
    },
    table: {
      caption: {
        fr: 'OTC aujourd’hui vs avec Variational Pro',
        en: 'OTC today vs with Variational Pro',
        ko: '현재의 OTC vs Variational Pro',
      },
      columns: {
        fr: ['OTC aujourd’hui (flux manuels)', 'Avec Variational Pro'],
        en: ['OTC today (manual workflows)', 'With Variational Pro'],
        ko: ['현재의 OTC (수작업 흐름)', 'Variational Pro 사용 시'],
      },
      rows: [
        {
          label: { fr: 'Prix', en: 'Price', ko: '가격' },
          values: {
            fr: ['Un seul interlocuteur, en appelant un desk', 'Cotations de plusieurs institutions via RFQ'],
            en: ['A single counterparty, by calling a desk', 'Quotes from several institutions via RFQ'],
            ko: ['데스크에 전화해 단 한 곳의 상대방에게서', 'RFQ로 여러 기관의 호가'],
          },
        },
        {
          label: { fr: 'Contrat et confirmations', en: 'Contract and confirmations', ko: '계약과 확인' },
          values: {
            fr: ['DocuSign et confirmations par email', 'Ouverture et pricing gérés par le système'],
            en: ['DocuSign and email confirmations', 'Opening and pricing handled by the system'],
            ko: ['DocuSign과 이메일 확인', '시스템이 개시와 가격 산정을 처리'],
          },
        },
        {
          label: { fr: 'Marge', en: 'Margin', ko: '마진' },
          values: {
            fr: ['Appels de marge manuels', 'Marge gérée on-chain'],
            en: ['Manual margin calls', 'Margin handled onchain'],
            ko: ['수작업 마진콜', '온체인에서 마진 관리'],
          },
        },
        {
          label: { fr: 'Règlement', en: 'Settlement', ko: '결제' },
          values: {
            fr: ['T+2', 'Clearing et règlement on-chain, en stablecoins'],
            en: ['T+2', 'Onchain clearing and settlement, in stablecoins'],
            ko: ['T+2', '스테이블코인으로 온체인 청산 및 결제'],
          },
        },
      ],
      source: SPACE_SOURCE,
    },
    quotes: [Q_PRO_INSTITUTIONS, Q_NOT_EXCHANGE, Q_PRO_FIRST_STEPS, Q_PRO_LARGER],
    videoIds: ['rollup-series-a', 'bankless-funds'],
    sources: [
      SPACE_SOURCE,
      { label: 'Docs — Settlement Pools', url: 'https://docs.variational.io/variational-protocol/key-concepts/settlement-pools' },
      { label: 'Omni — app', url: 'https://omni.variational.io' },
    ],
  },

  swaps: {
    id: 'swaps',
    number: '05',
    accent: '#ea8a1a',
    signTitle: 'Variational Swaps · TradFi',
    title: {
      fr: 'Variational Swaps — TradFi en Total Return',
      en: 'Variational Swaps — TradFi Total Return',
      ko: 'Variational Swaps — TradFi 총수익 스왑',
    },
    tagline: {
      fr: 'Indices, matières premières et devises en swaps de rendement total, on-chain.',
      en: 'Indices, commodities and FX as total return swaps, onchain.',
      ko: '지수, 원자재, 외환을 온체인 총수익 스왑으로.',
    },
    lead: {
      fr: 'Un swap te donne la performance d’un actif traditionnel (Nasdaq, or, pétrole…) sans avoir à l’acheter — avec 0 % de frais et un prix ferme.',
      en: 'A swap gives you the performance of a traditional asset (Nasdaq, gold, oil…) without buying it — with 0% fees and a firm price.',
      ko: '스왑은 전통 자산(나스닥, 금, 원유 등)을 직접 사지 않고도 그 성과를 얻게 해 줍니다. 수수료 0%, 확정 가격으로.',
    },
    beginner: {
      fr: [
        'Un swap de rendement total (Total Return Swap) te donne l’exposition à la variation de prix d’un actif sans le détenir : tu gagnes s’il évolue dans ton sens, tu perds sinon.',
        'Sur Omni, ces marchés portent les étiquettes « SWAP · TradFi » : US100, US30, US500, or (XAU), argent (XAG), indice dollar (DXI), pétrole (USOIL, UKOIL), cuivre, cacao, volatilité (VXI)…',
        'Le levier va jusqu’à 10x (5x sur le cacao). Le coût de portage se lit dans le funding annualisé, affiché séparément pour les longs (L) et les shorts (S).',
        'Comme tout Omni : 0 % de frais de trading, un prix ferme en RFQ et un spread serré, puisque l’OLP couvre sa position sur les marchés traditionnels.',
      ],
      en: [
        'A total return swap gives you exposure to an asset’s price moves without owning it: you gain if it moves your way, you lose otherwise.',
        'On Omni these markets are tagged “SWAP · TradFi”: US100, US30, US500, gold (XAU), silver (XAG), dollar index (DXI), oil (USOIL, UKOIL), copper, cocoa, volatility (VXI)…',
        'Leverage goes up to 10x (5x on cocoa). The carry cost shows in the annualised funding, displayed separately for longs (L) and shorts (S).',
        'Like all of Omni: 0% trading fees, a firm RFQ price and a tight spread, as the OLP hedges on traditional markets.',
      ],
      ko: [
        '총수익 스왑은 자산을 보유하지 않고도 가격 변동에 노출되게 합니다. 예상한 방향으로 움직이면 이익, 반대면 손실입니다.',
        'Omni에서 이 마켓들은 “SWAP · TradFi” 태그가 붙어 있습니다: US100, US30, US500, 금(XAU), 은(XAG), 달러 인덱스(DXI), 원유(USOIL, UKOIL), 구리, 코코아, 변동성(VXI) 등.',
        '레버리지는 최대 10배(코코아는 5배)입니다. 보유 비용은 롱(L)과 숏(S)에 따로 표시되는 연환산 펀딩으로 확인합니다.',
        'Omni의 다른 마켓처럼 거래 수수료 0%, RFQ 확정 가격, 좁은 스프레드가 적용되며, OLP가 전통 시장에서 헤지합니다.',
      ],
    },
    deepTech: {
      fr: [
        'Attraction des volumes : sur le graphique Blockworks « Perp DEXs: RWA – Futures Notional Volume » (hebdomadaire), la part de Variational monte à environ 13 Md$ par semaine fin septembre – octobre 2026, deuxième derrière Trade[XYZ].',
        'Relevé Omni (oct. 2026) : US100 ≈ 599,8 M$ de volume 24h pour 118,4 M$ d’open interest ; US30 ≈ 238,7 M$ ; US500 ≈ 226,3 M$ ; or (XAU) ≈ 122,8 M$ pour 97,3 M$ d’OI.',
        'Funding asymétrique : les longs et les shorts paient des taux annualisés différents (ex. 4,89 % L / 2,89 % S sur les indices US, 5,85 % L / 2,57 % S sur l’or), reflet du coût de couverture de l’OLP.',
        'Certains marchés affichent un funding annualisé négatif (USOIL −17,13 %, UKOIL −34,34 %) : vérifie le sens du paiement sur l’interface Omni avant d’ouvrir une position.',
        'Le tableau « Swaps en direct » de cet onglet est chargé depuis l’API publique Variational (marchés « Swap on … »).',
        'D’après Lucas Schuermann (Space X du 20 oct. 2026), les swaps font « 70 or 80% » du volume quotidien « on a lot of products », et une grosse roadmap de nouveaux listings de swaps arrive.',
      ],
      en: [
        'Volume traction: on Blockworks’ weekly “Perp DEXs: RWA – Futures Notional Volume” chart, Variational’s share rises to roughly $13B per week in late September – October 2026, second only to Trade[XYZ].',
        'Omni snapshot (Oct 2026): US100 ≈ $599.8M 24h volume with $118.4M open interest; US30 ≈ $238.7M; US500 ≈ $226.3M; gold (XAU) ≈ $122.8M with $97.3M OI.',
        'Asymmetric funding: longs and shorts pay different annualised rates (e.g. 4.89% L / 2.89% S on US indices, 5.85% L / 2.57% S on gold), reflecting the OLP’s hedging cost.',
        'Some markets show negative annualised funding (USOIL −17.13%, UKOIL −34.34%): check which side pays on the Omni interface before opening a position.',
        'The “Live swaps” table in this tab is loaded from the public Variational API (“Swap on …” markets).',
        'According to Lucas Schuermann (X Space, 20 Oct 2026), swaps make up “70 or 80%” of daily volume “on a lot of products”, and a big roadmap of new swap listings is coming.',
      ],
      ko: [
        '거래량 견인력: Blockworks의 주간 차트 “Perp DEXs: RWA – Futures Notional Volume”에서 Variational의 비중은 2026년 9월 말~10월 주당 약 130억 달러로 Trade[XYZ]에 이어 2위입니다.',
        'Omni 스냅샷(2026년 10월): US100 24시간 거래량 약 5억 9,980만 달러, 미결제약정 1억 1,840만 달러; US30 약 2억 3,870만 달러; US500 약 2억 2,630만 달러; 금(XAU) 약 1억 2,280만 달러, OI 9,730만 달러.',
        '비대칭 펀딩: 롱과 숏의 연환산 펀딩이 다릅니다(예: 미국 지수 4.89% L / 2.89% S, 금 5.85% L / 2.57% S). OLP의 헤지 비용을 반영합니다.',
        '일부 마켓은 음수 연환산 펀딩을 표시합니다(USOIL −17.13%, UKOIL −34.34%). 포지션을 열기 전에 Omni 화면에서 지급 방향을 확인하세요.',
        '이 탭의 “실시간 스왑” 표는 Variational 공개 API(“Swap on …” 마켓)에서 불러옵니다.',
        'Lucas Schuermann(2026년 10월 20일 X 스페이스)에 따르면 스왑은 “on a lot of products”(많은 상품에서) 일일 거래량의 “70 or 80%”를 차지하며, 새로운 스왑 상장 로드맵이 대규모로 준비되어 있습니다.',
      ],
    },
    flow: {
      fr: ['Choisis un actif TradFi', 'Prix ferme en RFQ', 'Exposition total return (≤ 10x)', 'Funding long / short'],
      en: ['Pick a TradFi asset', 'Firm RFQ price', 'Total return exposure (≤ 10x)', 'Long / short funding'],
      ko: ['TradFi 자산 선택', 'RFQ 확정 가격', '총수익 노출 (≤ 10배)', '롱 / 숏 펀딩'],
    },
    quotes: [Q_MAIN, Q_FEES],
    videoIds: ['rollup-series-a', 'gwart-rfq'],
    sources: [
      { label: 'Omni — markets list', url: 'https://omni.variational.io/markets' },
      { label: 'Variational API — /metadata/stats', url: 'https://omni-client-api.prod.ap-northeast-1.variational.io/metadata/stats' },
      { label: 'Docs — Trading via RFQ', url: 'https://docs.variational.io/variational-protocol/key-concepts/trading-via-rfq' },
      SPACE_SOURCE,
    ],
  },

  tokenomics: {
    id: 'tokenomics',
    number: '04',
    accent: '#7c3aed',
    signTitle: 'Tokenomics · $VAR TGE Soon',
    title: {
      fr: 'Tokenomics $VAR & Points',
      en: '$VAR Tokenomics & Points',
      ko: '$VAR 토크노믹스 & 포인트',
    },
    tagline: {
      fr: 'Distribution, déblocages et buy & burn du token $VAR — TGE « coming very soon ».',
      en: 'Distribution, unlocks and buy & burn of the $VAR token — TGE “coming very soon”.',
      ko: '$VAR 토큰의 분배, 언락, 바이백 & 소각 — TGE “coming very soon”.',
    },
    lead: {
      fr: 'Tes points Omni deviennent des $VAR au TGE : 32 % de la supply revient aux utilisateurs, et 100 % des revenus de trésorerie rachètent et brûlent le token.',
      en: 'Your Omni points turn into $VAR at TGE: 32% of supply goes to users, and 100% of treasury revenue buys back and burns the token.',
      ko: 'Omni 포인트는 TGE 때 $VAR로 전환됩니다. 공급량의 32%가 사용자에게 돌아가고, 재무 수익의 100%가 토큰을 바이백하고 소각합니다.',
    },
    beginner: {
      fr: [
        'Le token $VAR sera lancé lors du TGE (Token Generation Event), « coming very soon » selon Lucas Schuermann (Space X du 20 oct. 2026). Le Q4 a été évoqué par l’animateur, sans date confirmée : non vérifié.',
        'Genesis Distribution : 32 % de la supply sont distribués en airdrop, en proportion des points accumulés, et 100 % débloqués dès le TGE. Il faut au moins 1 point pour signer les conditions d’utilisation (ToS).',
        'Jusqu’au TGE, 150 000 points sont distribués chaque semaine aux traders d’Omni.',
        'Buy & burn : 100 % des revenus de la trésorerie servent à racheter du $VAR sur le marché puis à le détruire.',
        'L’équipe veut un token $VAR le plus liquide possible, sur la plateforme et sur de nombreux autres marchés.',
      ],
      en: [
        'The $VAR token launches at the TGE (Token Generation Event), “coming very soon” according to Lucas Schuermann (X Space, 20 Oct 2026). Q4 was mentioned by the host, with no confirmed date: unverified.',
        'Genesis Distribution: 32% of supply is airdropped in proportion to accumulated points, 100% unlocked at TGE. At least 1 point is required to sign the Terms of Service (ToS).',
        'Until TGE, 150,000 points are distributed every week to Omni traders.',
        'Buy & burn: 100% of treasury revenue is used to buy $VAR back on the market and destroy it.',
        'The team wants the $VAR token to be as liquid as possible, on the platform and on many other markets.',
      ],
      ko: [
        '$VAR 토큰은 TGE(토큰 생성 이벤트)에서 출시되며, Lucas Schuermann에 따르면 “coming very soon”입니다(2026년 10월 20일 X 스페이스). 4분기는 진행자가 언급했을 뿐 확정된 날짜가 없습니다: 미확인.',
        'Genesis Distribution: 공급량의 32%가 누적 포인트에 비례해 에어드랍되며 TGE 시점에 100% 언락됩니다. 이용약관(ToS) 서명에는 최소 1포인트가 필요합니다.',
        'TGE 전까지 매주 150,000 포인트가 Omni 트레이더에게 분배됩니다.',
        '바이백 & 소각: 재무 수익의 100%로 시장에서 $VAR를 사들여 소각합니다.',
        '팀은 $VAR 토큰이 플랫폼과 다른 여러 시장에서 최대한 높은 유동성을 갖기를 원합니다.',
      ],
    },
    deepTech: {
      fr: [
        'Genesis Distribution [32 %] : airdrop proportionnel aux points, 100 % unlocked au TGE (minimum 1 point pour signer les ToS).',
        'Ecosystem Reserve [18 %] : gérée par la Fondation pour la croissance de l’écosystème.',
        'Team & Investors [50 %] : verrouillés 12 mois, puis déblocage linéaire sur 3 ans minimum.',
        'Buy & Burn : 100 % des revenus de la trésorerie alloués au rachat et à la destruction de $VAR.',
        'Revenus : le spread capté par l’OLP (trading à 0 % de fees). Revenu net sur 2 semaines : 3 682 137 $ ; trésorerie : 11 077 933 USDC (oct. 2026).',
        'Simulateur FDV : le barème du café correspond à environ 11,2 M de points pour 32 % de la supply (ex. FDV 1 Md$ → ≈ 28,6 $ par point). Simulation théorique, pas une prévision.',
        'Space X du 20 oct. 2026 : aucun nouveau détail n’a été annoncé sur l’airdrop, les points ou le mécanisme de value accrual du token.',
      ],
      en: [
        'Genesis Distribution [32%]: airdrop proportional to points, 100% unlocked at TGE (minimum 1 point to sign the ToS).',
        'Ecosystem Reserve [18%]: managed by the Foundation for ecosystem growth.',
        'Team & Investors [50%]: locked for 12 months, then linear unlock over at least 3 years.',
        'Buy & Burn: 100% of treasury revenue allocated to buying back and destroying $VAR.',
        'Revenue: the spread captured by the OLP (0% fee trading). 2-week net revenue: $3,682,137; treasury: 11,077,933 USDC (Oct 2026).',
        'FDV simulator: the café price list implies about 11.2M points for 32% of supply (e.g. $1B FDV → ≈ $28.6 per point). Theoretical simulation, not a forecast.',
        'X Space, 20 Oct 2026: no new details were announced on the airdrop, points or the token’s value accrual mechanism.',
      ],
      ko: [
        'Genesis Distribution [32%]: 포인트에 비례한 에어드랍, TGE 시 100% 언락 (ToS 서명에 최소 1포인트).',
        'Ecosystem Reserve [18%]: 생태계 성장을 위해 재단이 관리합니다.',
        'Team & Investors [50%]: 12개월 락업 후 최소 3년에 걸쳐 언락.',
        'Buy & Burn: 재무 수익의 100%를 $VAR 바이백 및 소각에 사용합니다.',
        '수익: OLP가 얻는 스프레드(거래 수수료 0%). 2주 순수익 3,682,137달러, 재무 보유액 11,077,933 USDC (2026년 10월).',
        'FDV 시뮬레이터: 카페 가격표는 공급량 32%에 약 1,120만 포인트를 가정합니다(예: FDV 10억 달러 → 포인트당 약 28.6달러). 이론적 시뮬레이션이며 예측이 아닙니다.',
        '2026년 10월 20일 X 스페이스: 에어드랍, 포인트, 토큰 가치 귀속(value accrual) 메커니즘에 대한 새로운 세부 사항은 발표되지 않았습니다.',
      ],
    },
    flow: {
      fr: ['Trade sur Omni (0 % fees)', '150k points / semaine', 'TGE $VAR (« very soon ») : airdrop 32 %', 'Revenus → buy & burn'],
      en: ['Trade on Omni (0% fees)', '150k points / week', '$VAR TGE (“very soon”): 32% airdrop', 'Revenue → buy & burn'],
      ko: ['Omni 거래 (수수료 0%)', '주당 15만 포인트', '$VAR TGE (“very soon”): 32% 에어드랍', '수익 → 바이백 & 소각'],
    },
    quotes: [Q_FEES],
    videoIds: ['wsh-fees-scam', 'rollup-series-a'],
    sources: [
      { label: 'Omni — app', url: 'https://omni.variational.io' },
      { label: 'Variational — X (@variational_io)', url: 'https://x.com/variational_io' },
      SPACE_SOURCE,
    ],
  },

  vision: {
    id: 'vision',
    number: '06',
    accent: '#0891b2',
    signTitle: 'Vision & Roadmap',
    title: {
      fr: 'Avenir & Vision du Protocole',
      en: 'Protocol Future & Vision',
      ko: '프로토콜의 미래와 비전',
    },
    tagline: {
      fr: 'Amener la liquidité de la finance traditionnelle on-chain, sans carnet d’ordres.',
      en: 'Bringing traditional finance liquidity onchain, without an order book.',
      ko: '오더북 없이 전통 금융의 유동성을 온체인으로.',
    },
    lead: {
      fr: 'Après Omni pour le retail, Variational veut amener les dérivés institutionnels et l’OTC on-chain avec Pro. Pour Lucas Schuermann, « Pro will eventually be the larger business ».',
      en: 'After Omni for retail, Variational wants to bring institutional derivatives and OTC onchain with Pro. For Lucas Schuermann, “Pro will eventually be the larger business”.',
      ko: '리테일용 Omni에 이어, Variational은 Pro로 기관 파생상품과 OTC를 온체인으로 가져오려 합니다. Lucas Schuermann은 “Pro will eventually be the larger business”(결국 Pro가 더 큰 사업이 될 것)라고 말합니다.',
    },
    beginner: {
      fr: [
        'Le pari : un modèle de broker (RFQ + un fournisseur de liquidité intégré) plutôt qu’un exchange à carnet d’ordres. Variational « is not an exchange ».',
        'Aujourd’hui : Omni, le produit retail (perps et swaps crypto et TradFi), 0 % de frais, 575+ marchés, 3 à 4 milliards de dollars par jour.',
        'Avant Pro : le public mainnet, l’API (« coming soon »), le TGE du token $VAR (« coming very soon ») et une grosse roadmap de nouveaux listings de swaps.',
        'Ensuite, 2027 : « our first few steps towards bringing institutional derivatives and OTC on chain » avec Variational Pro. Date exacte : non vérifiée.',
        'D’autres annonces sont prévues « in the coming few weeks and months ».',
      ],
      en: [
        'The bet: a broker model (RFQ + one integrated liquidity provider) rather than an order-book exchange. Variational “is not an exchange”.',
        'Today: Omni, the retail product (crypto and TradFi perps and swaps), 0% fees, 575+ markets, $3 to 4 billion a day.',
        'Before Pro: public mainnet, the API (“coming soon”), the $VAR token TGE (“coming very soon”) and a big roadmap of new swap listings.',
        'Then, 2027: “our first few steps towards bringing institutional derivatives and OTC on chain” with Variational Pro. Exact date: unverified.',
        'More announcements are planned “in the coming few weeks and months”.',
      ],
      ko: [
        '핵심 전략: 오더북 거래소가 아닌 브로커 모델(RFQ + 통합 유동성 공급자). Variational은 “is not an exchange”, 즉 거래소가 아닙니다.',
        '현재: 리테일 상품 Omni(크립토와 TradFi 무기한 선물·스왑), 수수료 0%, 575개 이상의 마켓, 하루 30억~40억 달러.',
        'Pro 이전: 퍼블릭 메인넷, API(“coming soon”), $VAR 토큰 TGE(“coming very soon”), 대규모 신규 스왑 상장 로드맵.',
        '그다음 2027년: Variational Pro와 함께 “our first few steps towards bringing institutional derivatives and OTC on chain”(기관 파생상품과 OTC를 온체인으로 가져오는 첫걸음). 정확한 날짜: 미확인.',
        '추가 발표가 “in the coming few weeks and months”(앞으로 몇 주, 몇 달 안에) 예정되어 있습니다.',
      ],
    },
    deepTech: {
      fr: [
        'Pourquoi le RFQ : lister un nouvel actif ne demande ni subventions aux market makers ni profondeur de carnet par marché — c’est ce qui rend possible l’élargissement vers les RWA.',
        'Pourquoi des pools isolés : chaque utilisateur a son pool de settlement bilatéral, sans réhypothécation — une base adaptée aux exigences des institutions.',
        'Pourquoi le buy & burn : relier directement les revenus du protocole (le spread) au token $VAR.',
        'Signal de marché : la part de Variational dans le volume RWA des perp DEX progresse fortement fin 2026 (graphique Blockworks).',
        'Pourquoi Pro : Omni et Pro partagent exactement la même infrastructure, et les fournisseurs de liquidité institutionnels de Pro seront aussi intégrés à Omni.',
        'Taille du marché visé (ordres de grandeur cités par Lucas) : environ 850 000 milliards de dollars d’encours de dérivés OTC (chiffre d’il y a environ un an), environ 100 milliards de dollars d’open interest sur les dérivés Bitcoin, et un FX à « probably 10 trillion a day ».',
        'Repère : 400 milliards de dollars compensés depuis le lancement du protocole.',
      ],
      en: [
        'Why RFQ: listing a new asset needs neither market-maker subsidies nor per-market book depth — which is what makes expanding into RWAs possible.',
        'Why isolated pools: each user has its own bilateral settlement pool, with no rehypothecation — a base suited to institutional requirements.',
        'Why buy & burn: to tie protocol revenue (the spread) directly to the $VAR token.',
        'Market signal: Variational’s share of perp DEX RWA volume rises sharply in late 2026 (Blockworks chart).',
        'Why Pro: Omni and Pro share exactly the same infrastructure, and Pro’s institutional liquidity providers will also be integrated into Omni.',
        'Target market size (orders of magnitude cited by Lucas): about $850 trillion of outstanding OTC derivatives (a figure from about a year ago), about $100 billion of open interest in Bitcoin derivatives, and FX at “probably 10 trillion a day”.',
        'Milestone: $400 billion cleared since the protocol launched.',
      ],
      ko: [
        'RFQ인 이유: 새 자산 상장에 마켓메이커 보조금도, 마켓별 오더북 깊이도 필요 없어 RWA로의 확장이 가능합니다.',
        '분리된 풀인 이유: 사용자마다 재담보 없는 양자간 정산 풀을 가져 기관의 요구에 맞는 기반이 됩니다.',
        '바이백 & 소각인 이유: 프로토콜 수익(스프레드)을 $VAR 토큰과 직접 연결합니다.',
        '시장 신호: 2026년 말 무기한 DEX RWA 거래량에서 Variational의 비중이 크게 늘었습니다(Blockworks 차트).',
        'Pro인 이유: Omni와 Pro는 완전히 같은 인프라를 공유하며, Pro의 기관 유동성 공급자들은 Omni에도 통합됩니다.',
        '목표 시장 규모(Lucas가 언급한 대략적 수치): 장외 파생상품 잔액 약 850조 달러(약 1년 전 수치), 비트코인 파생상품 미결제약정 약 1,000억 달러, 외환(FX) “probably 10 trillion a day”(하루 약 10조 달러).',
        '이정표: 프로토콜 출시 이후 4,000억 달러 청산.',
      ],
    },
    timeline: [
      {
        when: { fr: 'Aujourd’hui', en: 'Today', ko: '현재' },
        what: {
          fr: 'Omni, le produit retail : perps et swaps crypto & TradFi, 0 % de frais, 575+ marchés, 3 à 4 Md$ par jour.',
          en: 'Omni, the retail product: crypto & TradFi perps and swaps, 0% fees, 575+ markets, $3–4B a day.',
          ko: '리테일 상품 Omni: 크립토 & TradFi 무기한 선물과 스왑, 수수료 0%, 575개 이상의 마켓, 하루 30억~40억 달러.',
        },
        status: 'live',
      },
      {
        when: { fr: 'Jusqu’au TGE', en: 'Until TGE', ko: 'TGE 전까지' },
        what: {
          fr: '150 000 points distribués chaque semaine.',
          en: '150,000 points distributed every week.',
          ko: '매주 150,000 포인트 분배.',
        },
        status: 'live',
      },
      {
        when: { fr: 'Bientôt', en: 'Soon', ko: '곧' },
        what: {
          fr: 'Public mainnet, API (« coming soon ») et grosse roadmap de nouveaux listings de swaps.',
          en: 'Public mainnet, API (“coming soon”) and a big roadmap of new swap listings.',
          ko: '퍼블릭 메인넷, API(“coming soon”), 대규모 신규 스왑 상장 로드맵.',
        },
        status: 'next',
      },
      {
        when: { fr: 'Très bientôt', en: 'Very soon', ko: '아주 곧' },
        what: {
          fr: 'TGE du token $VAR (« coming very soon »). Q4 évoqué par l’animateur, date non vérifiée.',
          en: '$VAR token TGE (“coming very soon”). Q4 mentioned by the host, date unverified.',
          ko: '$VAR 토큰 TGE(“coming very soon”). 4분기는 진행자가 언급, 날짜 미확인.',
        },
        status: 'next',
      },
      {
        when: { fr: '2027', en: '2027', ko: '2027년' },
        what: {
          fr: 'Variational Pro : premiers pas des dérivés institutionnels et de l’OTC on-chain. Date exacte non vérifiée.',
          en: 'Variational Pro: first steps for institutional derivatives and OTC onchain. Exact date unverified.',
          ko: 'Variational Pro: 기관 파생상품과 OTC 온체인화의 첫걸음. 정확한 날짜 미확인.',
        },
        status: 'later',
      },
      {
        when: { fr: 'Plus tard', en: 'Later', ko: '이후' },
        what: {
          fr: 'Une partie de Pro ouverte aux utilisateurs d’Omni, par exemple les options. Forme pas encore décidée.',
          en: 'Part of Pro opened to Omni users, options for example. Form not decided yet.',
          ko: 'Pro의 일부(예: 옵션)를 Omni 사용자에게 개방. 형태는 아직 미정.',
        },
        status: 'later',
      },
    ],
    quotes: [Q_PRO_LARGER, Q_PRO_FIRST_STEPS, Q_MAIN, Q_AGGREGATING],
    videoIds: ['rollup-series-a', 'bankless-broker'],
    sources: [
      SPACE_SOURCE,
      { label: 'DefiLlama Research — Variational report', url: DEFILLAMA_REPORT },
      { label: 'Docs — Settlement Pools', url: 'https://docs.variational.io/variational-protocol/key-concepts/settlement-pools' },
      { label: 'Variational — X (@variational_io)', url: 'https://x.com/variational_io' },
    ],
  },

  metrics: {
    id: 'metrics',
    lead: {
      fr: 'Les chiffres officiels d’octobre 2026, complétés par les données en direct de l’API publique.',
      en: 'Official October 2026 figures, complemented by live data from the public API.',
      ko: '2026년 10월 공식 수치와 공개 API의 실시간 데이터를 함께 보여줍니다.',
    },
    accent: '#0b1f3a',
    signTitle: 'Live Metrics & Volume',
    title: {
      fr: 'Live Metrics & Volume',
      en: 'Live Metrics & Volume',
      ko: '라이브 지표 & 거래량',
    },
    tagline: {
      fr: 'Volume, open interest, TVL et marchés RWA/Perps, en direct.',
      en: 'Volume, open interest, TVL and RWA/perps markets, live.',
      ko: '거래량, 미결제약정, TVL, RWA/무기한 마켓을 실시간으로.',
    },
    beginner: {
      fr: [
        'Volume 24h : la valeur totale des trades exécutés sur les dernières 24 heures.',
        'Open interest (OI) : la valeur totale des positions encore ouvertes. Il mesure l’exposition réelle des traders.',
        'TVL : les fonds déposés sur le protocole (pools de settlement et OLP).',
        'Les chiffres du tableau de bord sont chargés en direct depuis l’API publique de Variational et DefiLlama ; un instantané daté s’affiche si le réseau est indisponible.',
      ],
      en: [
        '24h volume: the total value of trades executed over the last 24 hours.',
        'Open interest (OI): the total value of positions still open. It measures traders’ real exposure.',
        'TVL: the funds deposited in the protocol (settlement pools and OLP).',
        'Dashboard figures are loaded live from the public Variational API and DefiLlama; a dated snapshot is shown if the network is unavailable.',
      ],
      ko: [
        '24시간 거래량: 지난 24시간 동안 체결된 거래의 총 가치입니다.',
        '미결제약정(OI): 아직 열려 있는 포지션의 총 가치로, 트레이더의 실제 노출을 보여줍니다.',
        'TVL: 프로토콜(정산 풀과 OLP)에 예치된 자금입니다.',
        '대시보드 수치는 Variational 공개 API와 DefiLlama에서 실시간으로 불러오며, 네트워크를 사용할 수 없으면 날짜가 표시된 스냅샷을 보여줍니다.',
      ],
    },
    deepTech: {
      fr: [
        'Les marchés RWA (indices, matières premières, devises, actions, pré-IPO) sont repérés par une heuristique sur le nom du marché ; le classement est indicatif.',
        'L’open interest historique vient de DefiLlama (un point par semaine) ; le volume et la TVL viennent de l’API Variational.',
        'Les graphiques DefiLlama Research (volume, OI, listings) couvrent la période du 24 janvier au 4 juin 2026.',
        'Repères donnés par Lucas Schuermann (Space X du 20 oct. 2026) : 400 milliards de dollars compensés depuis le lancement du protocole, et 3 à 4 milliards de dollars par jour sur Omni.',
      ],
      en: [
        'RWA markets (indices, commodities, FX, equities, pre-IPO) are detected with a heuristic on the market name; the split is indicative.',
        'Historical open interest comes from DefiLlama (one point per week); volume and TVL come from the Variational API.',
        'DefiLlama Research charts (volume, OI, listings) cover 24 January to 4 June 2026.',
        'Milestones given by Lucas Schuermann (X Space, 20 Oct 2026): $400 billion cleared since the protocol launched, and $3 to 4 billion a day on Omni.',
      ],
      ko: [
        'RWA 마켓(지수, 원자재, 외환, 주식, 프리IPO)은 마켓 이름 기반 휴리스틱으로 분류하므로 참고용입니다.',
        '과거 미결제약정은 DefiLlama(주 1회 데이터)에서, 거래량과 TVL은 Variational API에서 가져옵니다.',
        'DefiLlama Research 차트(거래량, OI, 상장 수)는 2026년 1월 24일부터 6월 4일까지를 다룹니다.',
        'Lucas Schuermann이 밝힌 수치(2026년 10월 20일 X 스페이스): 프로토콜 출시 이후 4,000억 달러 청산, Omni 하루 30억~40억 달러.',
      ],
    },
    quotes: [],
    videoIds: [],
    sources: [
      { label: 'Variational API — /metadata/stats', url: 'https://omni-client-api.prod.ap-northeast-1.variational.io/metadata/stats' },
      { label: 'DefiLlama — Variational open interest', url: 'https://defillama.com/protocol/variational' },
      { label: 'DefiLlama Research — Variational report', url: DEFILLAMA_REPORT },
      { label: 'Omni — markets list', url: 'https://omni.variational.io/markets' },
      SPACE_SOURCE,
    ],
  },

  twitter: {
    id: 'twitter',
    lead: {
      fr: 'Ce que disent les analystes du modèle RFQ — et les liens pour suivre Variational.',
      en: 'What analysts say about the RFQ model — and links to follow Variational.',
      ko: '애널리스트들이 말하는 RFQ 모델, 그리고 Variational 팔로우 링크.',
    },
    accent: '#0f172a',
    signTitle: 'Twitter Alpha Wall',
    title: {
      fr: 'Twitter Alpha Wall',
      en: 'Twitter Alpha Wall',
      ko: '트위터 알파 월',
    },
    tagline: {
      fr: 'Ce que la communauté dit du RFQ et de Variational.',
      en: 'What the community says about RFQ and Variational.',
      ko: '커뮤니티가 말하는 RFQ와 Variational.',
    },
    beginner: {
      fr: [
        'Une sélection de posts X d’analystes et de traders sur le débat RFQ vs orderbooks, les RWA et le flow retail.',
        'Clique sur une carte pour ouvrir le post d’origine.',
      ],
      en: [
        'A selection of X posts from analysts and traders on the RFQ vs orderbook debate, RWAs and retail flow.',
        'Click a card to open the original post.',
      ],
      ko: [
        'RFQ vs 오더북 논쟁, RWA, 리테일 흐름에 대한 애널리스트와 트레이더의 X 게시물 모음입니다.',
        '카드를 클릭하면 원문 게시물이 열립니다.',
      ],
    },
    deepTech: {
      fr: [
        'Fil rouge : les CLOB on-chain peinent à couvrir l’étendue des actifs (RWA, long-tail) qu’un modèle RFQ peut lister sans cold start.',
      ],
      en: [
        'Common thread: onchain CLOBs struggle to cover the asset breadth (RWAs, long-tail) that an RFQ model can list without a cold start.',
      ],
      ko: [
        '공통 논점: 온체인 CLOB는 RFQ 모델이 콜드 스타트 없이 상장할 수 있는 자산 범위(RWA, 롱테일)를 감당하기 어렵습니다.',
      ],
    },
    quotes: [
      {
        text: 'CLOBs are not going to take us to the RWA promised land.',
        author: 'Haseeb Qureshi (@hosseeb)',
        context: 'X',
        url: 'https://x.com/hosseeb/status/2057100263526138163',
      },
      {
        text: 'onchain orderbooks can never match RFQs on asset breadth and depth.',
        author: 'as required. (@0xasrequired)',
        context: 'X',
        url: 'https://x.com/0xasrequired/status/2111462988074856949',
      },
      {
        text: 'That’s exactly why Variational already has 500 pairs.',
        author: 'Joestar (@JoestarCrypto)',
        context: 'X',
        url: 'https://x.com/JoestarCrypto/status/2006157857515819340',
      },
      {
        text: 'For less liquid RWAs, RFQ is awesome.',
        author: 'Ignas (@DefiIgnas)',
        context: 'X',
        url: 'https://x.com/DefiIgnas/status/2057104680048865297',
      },
      {
        text: 'external MMs cannot extract value from the retail flows.',
        author: 'yh (@yh_0x)',
        context: 'X',
        url: 'https://x.com/yh_0x/status/1979560430600380743',
      },
    ],
    videoIds: [],
    sources: [],
  },

  stage: {
    id: 'stage',
    lead: {
      fr: 'Les interventions de Lucas Schuermann, fondateur et CEO de Variational, en extraits de 2 minutes.',
      en: 'Talks by Lucas Schuermann, founder and CEO of Variational, in 2-minute clips.',
      ko: 'Variational 창업자이자 CEO인 Lucas Schuermann의 발언을 2분 클립으로.',
    },
    accent: '#4C9AF8',
    signTitle: 'Main Stage',
    title: {
      fr: 'Scène principale — Lucas Schuermann',
      en: 'Main Stage — Lucas Schuermann',
      ko: '메인 스테이지 — Lucas Schuermann',
    },
    tagline: {
      fr: 'Les interventions du fondateur de Variational, en extraits de 2 minutes.',
      en: 'Talks by Variational’s founder, in 2-minute clips.',
      ko: 'Variational 창업자의 발언을 2분 클립으로.',
    },
    beginner: {
      fr: [
        'Par défaut, le grand écran affiche la bannière du Summit. Choisis un extrait ci-dessous et clique sur « Diffuser sur l’écran » : l’écran passe en LIVE et la vidéo se lit avec le son dans le lecteur en bas à droite.',
        'Ferme le lecteur pour revenir à la bannière. Tu peux aussi utiliser « Regarder ici » ou ouvrir la vidéo sur YouTube.',
      ],
      en: [
        'By default the big screen shows the Summit banner. Pick a clip below and click “Play on screen”: the screen goes LIVE and the video plays with sound in the player at the bottom right.',
        'Close the player to go back to the banner. You can also use “Watch here” or open the video on YouTube.',
      ],
      ko: [
        '기본적으로 대형 스크린에는 Summit 배너가 표시됩니다. 아래에서 클립을 선택해 “스크린에서 재생”을 누르면 스크린이 LIVE로 바뀌고, 오른쪽 아래 플레이어에서 소리와 함께 영상이 재생됩니다.',
        '플레이어를 닫으면 배너로 돌아갑니다. “여기서 보기”를 누르거나 YouTube에서 열 수도 있습니다.',
      ],
    },
    deepTech: {
      fr: [
        'Flirting with Models S7E34 : 05:45 spreads et zero fees, 09:35 segmentation du flow, 27:31 « aggregating ».',
        'Bankless (Robinhood of Onchain Trading) : broker vs exchange, OLP (~34:00), fonds utilisateurs (~37:03).',
        'The Gwart Show : structure de marché (10:45), RWA (13:41), OLP (33:52).',
        'When Shift Happens E186 : zero fees (29:54), « are trading fees a scam? » (34:33).',
        'Space X officiel du 20 oct. 2026 (Lucas Schuermann, interviewé par Andy de The Rollup) : Variational Pro et l’OTC institutionnel on-chain. Les points clés sont sur les stands Pro et Vision.',
      ],
      en: [
        'Flirting with Models S7E34: 05:45 spreads and zero fees, 09:35 flow segmentation, 27:31 “aggregating”.',
        'Bankless (Robinhood of Onchain Trading): broker vs exchange, OLP (~34:00), user funds (~37:03).',
        'The Gwart Show: market structure (10:45), RWAs (13:41), OLP (33:52).',
        'When Shift Happens E186: zero fees (29:54), “are trading fees a scam?” (34:33).',
        'Official X Space, 20 Oct 2026 (Lucas Schuermann, interviewed by Andy from The Rollup): Variational Pro and institutional OTC onchain. Key points are on the Pro and Vision stands.',
      ],
      ko: [
        'Flirting with Models S7E34: 05:45 스프레드와 수수료 0%, 09:35 주문 흐름 세분화, 27:31 “aggregating”.',
        'Bankless (Robinhood of Onchain Trading): 브로커 vs 거래소, OLP (~34:00), 사용자 자금 (~37:03).',
        'The Gwart Show: 시장 구조 (10:45), RWA (13:41), OLP (33:52).',
        'When Shift Happens E186: 수수료 0% (29:54), “거래 수수료는 사기인가?” (34:33).',
        '2026년 10월 20일 공식 X 스페이스(Lucas Schuermann, The Rollup의 Andy 진행): Variational Pro와 온체인 기관 OTC. 핵심 내용은 Pro와 Vision 부스에 있습니다.',
      ],
    },
    quotes: [Q_MAIN, Q_AGGREGATING],
    videoIds: ['bankless-broker', 'gwart-rfq', 'fwm-zero-fees', 'wsh-fees-scam', 'bankless-funds', 'rollup-series-a', 'castle-rfq-clob'],
    sources: [
      { label: 'Flirting with Models S7E34', url: 'https://www.youtube.com/watch?v=_5bYsyJUx68' },
      { label: 'Bankless — Robinhood of Onchain Trading', url: 'https://www.youtube.com/watch?v=fSt4qmz1C_M' },
      { label: 'The Gwart Show', url: 'https://www.youtube.com/watch?v=tfS9k2w1WhM' },
      { label: 'When Shift Happens E186', url: 'https://www.youtube.com/watch?v=Y_pWv3VayqU' },
      { label: 'Castle Labs (bonus)', url: 'https://www.youtube.com/watch?v=tucl1jCTy6E' },
    ],
  },
};

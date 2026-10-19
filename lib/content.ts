/**
 * Contenu multilingue (FR / EN / KO) des stands, de la scène et du mur Twitter.
 *
 * Source de vérité : page Notion « Variationnal 3D World ».
 * La page précise que les citations, chiffres et liens proviennent d'une recherche
 * non vérifiée : chaque élément sensible porte donc un indicateur `verified`
 * et l'UI affiche un avertissement « à recouper ».
 * Les citations sont conservées dans leur langue d'origine (anglais) pour rester exactes.
 */

export type Lang = 'fr' | 'en' | 'ko';
export const LANGS: Lang[] = ['fr', 'en', 'ko'];

export type Localized<T = string> = Record<Lang, T>;

export type InteractiveId = 'rfq' | 'omni' | 'pro' | 'tokenomics' | 'twitter' | 'stage';

export interface Quote {
  text: string;
  author: string;
  /** Contexte de la citation (podcast, rapport, post X…). */
  context: string;
  url?: string;
  /** false = citation listée « à vérifier » dans le Notion. */
  verified: boolean;
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
  beginner: Localized<string[]>;
  deepTech: Localized<string[]>;
  /** Schéma simplifié en étapes, rendu sous forme de flèches dans le modal. */
  flow?: Localized<string[]>;
  table?: ComparisonTable;
  quotes: Quote[];
  videoIds: string[];
  sources: SourceLink[];
  /** Points marqués « À vérifier avant affichage » dans le Notion. */
  toVerify?: Localized<string[]>;
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
    show: 'Castle Labs',
    title: {
      fr: 'RFQ vs CLOB (vidéo complète)',
      en: 'RFQ vs CLOB (full video)',
      ko: 'RFQ vs CLOB (전체 영상)',
    },
    note: {
      fr: 'Aucun transcript accessible : pas d’extrait vérifié, vidéo complète.',
      en: 'No transcript available: no verified clip, full video.',
      ko: '스크립트 없음: 검증된 구간이 없어 전체 영상 제공.',
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
      fr: 'Extrait 32:40 → 34:40. Timing estimé (~+3 min de décalage), à confirmer.',
      en: 'Clip 32:40 → 34:40. Estimated timing (~+3 min offset), to be confirmed.',
      ko: '32:40 → 34:40 구간. 추정 시간(약 +3분 차이), 확인 필요.',
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
  verified: false,
};

const Q_AGGREGATING: Quote = {
  text: 'We’re not rebuilding liquidity. We’re aggregating.',
  author: 'Lucas Schuermann',
  context: 'Flirting with Models / Scuttlebutt',
  url: 'https://www.youtube.com/watch?v=_5bYsyJUx68',
  verified: false,
};

const Q_BROKER: Quote = {
  text:
    'We’re building a broker-like model as opposed to an order book or an exchange using RFQ to match versus our users.',
  author: 'Lucas Schuermann',
  context: 'Flirting with Models / Scuttlebutt',
  url: 'https://www.youtube.com/watch?v=_5bYsyJUx68',
  verified: false,
};

const Q_FEES: Quote = {
  text:
    'For most users, execution costs = fees + spread. On Variational, zero-fee trading meets TradFi-quality liquidity.',
  author: 'Lucas Schuermann',
  context: 'Post X',
  verified: false,
};

const Q_REHYPO: Quote = {
  text:
    'We do not rehypothecate user balances. User funds sit in isolated smart contracts — we call them settlement pools.',
  author: 'Lucas Schuermann',
  context: 'Flirting with Models',
  url: 'https://www.youtube.com/watch?v=_5bYsyJUx68',
  verified: false,
};

const Q_NO_COUNTER: Quote = {
  text: 'We don’t counter trade users.',
  author: 'Lucas Schuermann',
  context: 'Flirting with Models',
  url: 'https://www.youtube.com/watch?v=_5bYsyJUx68',
  verified: false,
};

const Q_SINGLE_FILL: Quote = {
  text:
    'The trader gets a single fill price with no slippage while the market maker absorbs and hedges the position risk offchain.',
  author: 'Alea Research',
  context: 'Analyst note',
  verified: false,
};

/* ------------------------------------------------------------------ */
/* Stands                                                               */
/* ------------------------------------------------------------------ */

export const CONTENT: Record<InteractiveId, StandContent> = {
  rfq: {
    id: 'rfq',
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
        'Résultat : pas de « cold start » pour lister un nouvel actif. Variational revendique plus de 500 paires (crypto et RWA, y compris long-tail et pré-listings).',
      ],
      en: [
        'On a classic exchange (orderbook) or a GMX-style AMM, depth has to be bootstrapped for every new market: external market makers are subsidised and capital stays locked permanently.',
        'Variational uses RFQ (“Request For Quote”): you ask for a price for a precise size, and a single liquidity provider (the OLP) answers with a firm price.',
        'Result: no “cold start” to list a new asset. Variational claims 500+ pairs (crypto and RWAs, including long-tail and pre-listings).',
      ],
      ko: [
        '일반적인 거래소(오더북)나 GMX 같은 AMM에서는 새 마켓마다 유동성 깊이를 만들어야 합니다. 외부 마켓메이커에게 보조금을 주고 자본이 계속 묶여 있습니다.',
        'Variational은 RFQ(“Request For Quote”, 견적 요청) 방식입니다. 원하는 수량의 가격을 요청하면 단일 유동성 공급자(OLP)가 확정 가격으로 응답합니다.',
        '결과: 새 자산 상장에 “콜드 스타트”가 없습니다. Variational은 500개 이상의 페어(크립토 및 RWA, 롱테일과 프리상장 포함)를 내세웁니다.',
      ],
    },
    deepTech: {
      fr: [
        'RFQ + OLP (Omni Liquidity Provider) verticalement intégré : l’OLP agrège CEX, DEX, OTC et dealers TradFi et ne quote que lorsqu’il y a une demande, sans profondeur d’orderbook à maintenir par paire.',
        'Slippage orderbook : un gros ordre « marche le book », slippage progressif et intention visible de tous.',
        'Slippage AMM : le price impact dépend de la courbe et de la taille du pool, il est structurel.',
        'Slippage RFQ : quote ferme pour la taille demandée (single fill), puis l’OLP hedge off-chain (Binance, CME, dealers TradFi).',
        'Flow d’un trade RFQ (docs) : ordre → quote → acceptation → last look → collatéral → settlement.',
      ],
      en: [
        'RFQ + a vertically integrated OLP (Omni Liquidity Provider): the OLP aggregates CEXs, DEXs, OTC desks and TradFi dealers and only quotes when there is demand — no per-pair orderbook depth to maintain.',
        'Orderbook slippage: a large order “walks the book”, progressive slippage and intent visible to everyone.',
        'AMM slippage: price impact depends on the curve and pool size — it is structural.',
        'RFQ slippage: firm quote for the requested size (single fill), then the OLP hedges offchain (Binance, CME, TradFi dealers).',
        'RFQ trade flow (docs): order → quote → acceptance → last look → collateral → settlement.',
      ],
      ko: [
        'RFQ + 수직 통합된 OLP(Omni Liquidity Provider): OLP는 CEX, DEX, OTC, TradFi 딜러의 유동성을 모으고, 수요가 있을 때만 호가를 냅니다. 페어별 오더북 깊이를 유지할 필요가 없습니다.',
        '오더북 슬리피지: 큰 주문은 “호가창을 먹어 들어가며” 점진적 슬리피지가 생기고 의도가 모두에게 노출됩니다.',
        'AMM 슬리피지: 가격 영향이 커브와 풀 크기에 달려 있어 구조적입니다.',
        'RFQ 슬리피지: 요청 수량에 대한 확정 호가(단일 체결) 후 OLP가 오프체인에서 헤지합니다(Binance, CME, TradFi 딜러).',
        'RFQ 거래 흐름(문서): 주문 → 호가 → 수락 → 라스트 룩 → 담보 → 정산.',
      ],
    },
    flow: {
      fr: ['Trader : demande de quote', 'OLP : prix ferme', 'Single fill on-chain', 'Hedge off-chain (CEX, CME, dealers)'],
      en: ['Trader: quote request', 'OLP: firm price', 'Single fill onchain', 'Offchain hedge (CEX, CME, dealers)'],
      ko: ['트레이더: 견적 요청', 'OLP: 확정 가격', '온체인 단일 체결', '오프체인 헤지 (CEX, CME, 딜러)'],
    },
    quotes: [Q_MAIN, Q_AGGREGATING, Q_BROKER, Q_SINGLE_FILL],
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
        'Omni est l’application de trading de perps de Variational, sur Arbitrum : 0 % de frais de trading.',
        'Comment c’est possible ? Le market maker (l’OLP) fait partie de Variational. Au lieu de payer des market makers externes, Variational capte le spread : c’est sa seule source de revenus.',
        'Pour toi, le coût réel d’un trade, c’est fees + spread. Sur Omni, il ne reste que le spread.',
      ],
      en: [
        'Omni is Variational’s perps trading app on Arbitrum: 0% trading fees.',
        'How is that possible? The market maker (the OLP) is part of Variational. Instead of paying external market makers, Variational captures the spread — its only source of revenue.',
        'For you, the real cost of a trade is fees + spread. On Omni, only the spread remains.',
      ],
      ko: [
        'Omni는 Arbitrum 위에서 동작하는 Variational의 무기한 선물(perps) 거래 앱으로, 거래 수수료가 0%입니다.',
        '어떻게 가능할까요? 마켓메이커(OLP)가 Variational 내부에 있기 때문입니다. 외부 마켓메이커에게 비용을 지불하는 대신 스프레드를 수익으로 가져가며, 이것이 유일한 수익원입니다.',
        '사용자에게 실제 거래 비용은 수수료 + 스프레드입니다. Omni에서는 스프레드만 남습니다.',
      ],
    },
    deepTech: {
      fr: [
        'L’OLP internalise le flow retail et ne hedge que le résiduel sur des venues à fees bas.',
        'Boucle vertueuse : plus de volume → moins de coût de hedge → spreads plus serrés.',
        'Les market makers externes ne peuvent pas extraire de valeur du flow retail (argument repris sur le mur Twitter).',
        'Un seul fill par trade grâce au RFQ : pas de « walk the book » sur les grosses tailles.',
        'Plus de 500 marchés listés (crypto + RWA, long-tail, pré-listings) sans profondeur d’orderbook à subventionner.',
      ],
      en: [
        'The OLP internalises retail flow and only hedges the residual on low-fee venues.',
        'Flywheel: more volume → lower hedging cost → tighter spreads.',
        'External market makers cannot extract value from retail flow (argument echoed on the Twitter wall).',
        'One fill per trade thanks to RFQ: no “walking the book” on large sizes.',
        '500+ listed markets (crypto + RWA, long-tail, pre-listings) with no orderbook depth to subsidise.',
      ],
      ko: [
        'OLP는 리테일 주문 흐름을 내부화하고, 남는 포지션만 수수료가 낮은 거래소에서 헤지합니다.',
        '선순환: 거래량 증가 → 헤지 비용 감소 → 더 좁은 스프레드.',
        '외부 마켓메이커가 리테일 흐름에서 가치를 빼내지 못합니다(트위터 월에서도 언급된 논점).',
        'RFQ 덕분에 거래당 한 번의 체결: 큰 주문도 호가창을 먹어 들어가지 않습니다.',
        '보조금이 필요한 오더북 없이 500개 이상의 마켓 상장(크립토 + RWA, 롱테일, 프리상장).',
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
    ],
  },

  pro: {
    id: 'pro',
    number: '03',
    accent: '#334155',
    signTitle: 'Variational Pro · OTC',
    title: {
      fr: 'Variational Pro (OTC institutionnel)',
      en: 'Variational Pro (institutional OTC)',
      ko: 'Variational Pro (기관용 OTC)',
    },
    tagline: {
      fr: 'Le protocole peer-to-peer : pools de settlement isolés, contrepartie explicite.',
      en: 'The peer-to-peer protocol: isolated settlement pools, explicit counterparty.',
      ko: 'P2P 프로토콜: 분리된 정산 풀, 명확한 거래 상대방.',
    },
    beginner: {
      fr: [
        'Variational Pro s’adresse aux institutions et aux traders OTC, en s’appuyant sur le Variational Protocol (peer-to-peer).',
        'Chaque utilisateur a son propre pool de settlement : un smart contract d’escrow isolé entre lui et sa contrepartie (l’OLP).',
        'Pas de mélange des fonds : la faillite d’un pool n’affecte pas les autres, et les dépôts ne sont pas réhypothéqués.',
      ],
      en: [
        'Variational Pro targets institutions and OTC traders, built on the Variational Protocol (peer-to-peer).',
        'Each user has their own settlement pool: an isolated escrow smart contract between them and their counterparty (the OLP).',
        'No commingling: one pool failing does not affect the others, and deposits are not rehypothecated.',
      ],
      ko: [
        'Variational Pro는 기관과 OTC 트레이더를 위한 서비스로, P2P 방식의 Variational Protocol 위에 구축됩니다.',
        '사용자마다 자신만의 정산 풀이 있습니다. 사용자와 거래 상대방(OLP) 사이의 분리된 에스크로 스마트 컨트랙트입니다.',
        '자금이 섞이지 않습니다. 한 풀의 파산이 다른 풀에 영향을 주지 않으며, 예치금은 재담보(rehypothecation)되지 않습니다.',
      ],
    },
    deepTech: {
      fr: [
        'Pool bilatéral User ↔ OLP par utilisateur : pas de contagion, pas de réhypothécation, contrepartie connue.',
        'L’OLP n’envoie jamais les fonds des traders vers des venues externes : il hedge uniquement avec son propre capital.',
        'Nuance importante : si l’OLP devient insolvable, le PnL non settlé du trader devient de la bad debt. Le risque est isolé et transparent, pas éliminé.',
        'Architecture OLP (docs) : Vault, Market Making Engine, Risk Management System, connectés à Omni et au Variational Protocol, avec un oracle de prix dédié.',
      ],
      en: [
        'One bilateral User ↔ OLP pool per user: no contagion, no rehypothecation, known counterparty.',
        'The OLP never sends traders’ funds to external venues: it hedges only with its own capital.',
        'Important nuance: if the OLP became insolvent, the trader’s unsettled PnL would become bad debt. The risk is isolated and transparent, not eliminated.',
        'OLP architecture (docs): Vault, Market Making Engine, Risk Management System, connected to Omni and the Variational Protocol, with a dedicated pricing oracle.',
      ],
      ko: [
        '사용자마다 하나의 양자간 User ↔ OLP 풀: 전염 위험 없음, 재담보 없음, 알려진 거래 상대방.',
        'OLP는 트레이더의 자금을 외부 거래소로 보내지 않으며, 자체 자본으로만 헤지합니다.',
        '중요한 단서: OLP가 지급 불능이 되면 트레이더의 미정산 손익은 부실 채권(bad debt)이 됩니다. 위험은 제거된 것이 아니라 분리되고 투명해진 것입니다.',
        'OLP 아키텍처(문서): Vault, Market Making Engine, Risk Management System이 Omni 및 Variational Protocol과 연결되며 전용 가격 오라클을 사용합니다.',
      ],
    },
    flow: {
      fr: ['Dépôt utilisateur', 'Pool de settlement isolé', 'Trade RFQ avec l’OLP', 'Settlement on-chain (Arbitrum)'],
      en: ['User deposit', 'Isolated settlement pool', 'RFQ trade with the OLP', 'Onchain settlement (Arbitrum)'],
      ko: ['사용자 예치', '분리된 정산 풀', 'OLP와 RFQ 거래', '온체인 정산 (Arbitrum)'],
    },
    table: {
      caption: {
        fr: 'Peer-to-peer vs modèle exchange',
        en: 'Peer-to-peer vs exchange model',
        ko: 'P2P 모델 vs 거래소 모델',
      },
      columns: {
        fr: ['Modèle peer-to-peer', 'Modèle exchange'],
        en: ['Peer to peer model', 'Exchange model'],
        ko: ['P2P 모델', '거래소 모델'],
      },
      rows: [
        {
          label: { fr: 'Fonds utilisateurs', en: 'User funds', ko: '사용자 자금' },
          values: {
            fr: ['Isolés et ségrégués dans des settlement pools', 'Mélangés dans un seul pool'],
            en: ['Isolated and segregated into settlement pools', 'Commingled into one pool'],
            ko: ['정산 풀에 분리·격리', '하나의 풀에 혼합'],
          },
        },
        {
          label: { fr: 'Découverte de liquidité', en: 'Liquidity discovery', ko: '유동성 발견' },
          values: {
            fr: ['Request-for-quote', 'Central limit orderbook (CLOB)'],
            en: ['Request-for-quote', 'Central limit orderbook (CLOB)'],
            ko: ['견적 요청 (RFQ)', '중앙 지정가 오더북 (CLOB)'],
          },
        },
        {
          label: { fr: 'Contrepartie', en: 'Counterparty', ko: '거래 상대방' },
          values: {
            fr: ['Contrepartie explicite de l’autre côté du trade', 'Contrepartie anonyme sur l’orderbook'],
            en: ['Explicit counterparty who is on other side of trade', 'Anonymous counterparty on the orderbooks'],
            ko: ['거래 반대편의 명시적 상대방', '오더북 상의 익명 상대방'],
          },
        },
      ],
      source: {
        label: 'Docs Variational — P2P Trading Protocol vs DEX',
        url: 'https://docs.variational.io/variational-protocol/key-concepts/p2p-trading-protocol-vs-dex',
      },
    },
    quotes: [Q_REHYPO, Q_NO_COUNTER, Q_BROKER],
    videoIds: ['bankless-funds', 'gwart-rfq'],
    sources: [
      { label: 'Docs — Settlement Pools', url: 'https://docs.variational.io/variational-protocol/key-concepts/settlement-pools' },
      { label: 'Docs — P2P trading protocol vs DEX', url: 'https://docs.variational.io/variational-protocol/key-concepts/p2p-trading-protocol-vs-dex' },
      { label: 'DefiLlama Research — How Variational Pro works', url: DEFILLAMA_REPORT },
    ],
    toVerify: {
      fr: ['Lancement de Variational Pro en 2027.'],
      en: ['Variational Pro launch in 2027.'],
      ko: ['Variational Pro 2027년 출시.'],
    },
  },

  tokenomics: {
    id: 'tokenomics',
    number: '04',
    accent: '#7c3aed',
    signTitle: 'Tokenomics & Omni Points',
    title: {
      fr: 'Tokenomics & Points Omni',
      en: 'Tokenomics & Omni Points',
      ko: '토크노믹스 & Omni 포인트',
    },
    tagline: {
      fr: 'Un modèle économique fondé sur le spread, pas sur les fees.',
      en: 'An economic model built on spread, not fees.',
      ko: '수수료가 아닌 스프레드 기반의 경제 모델.',
    },
    beginner: {
      fr: [
        'Les utilisateurs d’Omni accumulent des points en tradant. Ce programme de points précède le token annoncé (ticker VAR).',
        'Côté protocole, les revenus viennent du spread capté par l’OLP, puisque le trading est à 0 % de fees.',
        'Les chiffres sur le token (part de l’airdrop, fin des points, date du ticker) ne sont pas confirmés : ils sont listés plus bas comme « à vérifier ».',
      ],
      en: [
        'Omni users accumulate points by trading. This points programme precedes the announced token (ticker VAR).',
        'At protocol level, revenue comes from the spread captured by the OLP, since trading is 0% fees.',
        'Token figures (airdrop share, end of points, ticker date) are not confirmed: they are listed below as “to verify”.',
      ],
      ko: [
        'Omni 사용자는 거래를 통해 포인트를 쌓습니다. 이 포인트 프로그램은 발표된 토큰(티커 VAR)에 앞서 진행됩니다.',
        '거래 수수료가 0%이므로 프로토콜 수익은 OLP가 얻는 스프레드에서 나옵니다.',
        '토큰 관련 수치(에어드랍 비율, 포인트 종료, 티커 일정)는 확정되지 않았으며 아래 “확인 필요” 항목에 정리되어 있습니다.',
      ],
    },
    deepTech: {
      fr: [
        'Revenus : le spread est la seule source de revenus. DefiLlama Research publie des revenus par période (4/4 → 4/17 et 5/2 → 5/15/2026).',
        'Traction : volume de trading et open interest suivis par DefiLlama du 24 janvier au 4 juin 2026.',
        'Différenciation : nombre de perps listés et de marchés RWA perps parmi les plus élevés des perp DEX (graphiques DefiLlama).',
        'Aucun conseil financier : ce stand présente des faits et des sources, pas de promesse de gains.',
      ],
      en: [
        'Revenue: spread is the only revenue source. DefiLlama Research publishes revenue per period (4/4 → 4/17 and 5/2 → 5/15/2026).',
        'Traction: trading volume and open interest tracked by DefiLlama from 24 January to 4 June 2026.',
        'Differentiation: number of listed perps and RWA perp markets among the highest of perp DEXs (DefiLlama charts).',
        'No financial advice: this booth presents facts and sources, not promises of returns.',
      ],
      ko: [
        '수익: 스프레드가 유일한 수익원입니다. DefiLlama Research는 기간별 수익을 공개합니다 (4/4 → 4/17, 5/2 → 5/15/2026).',
        '성장: DefiLlama가 2026년 1월 24일부터 6월 4일까지 거래량과 미결제약정을 추적했습니다.',
        '차별점: 상장된 perps 수와 RWA perps 마켓 수가 perp DEX 중 최상위권입니다 (DefiLlama 차트).',
        '투자 조언이 아닙니다: 이 부스는 사실과 출처를 소개할 뿐, 수익을 약속하지 않습니다.',
      ],
    },
    flow: {
      fr: ['Trading à 0 % de fees', 'Spread capté par l’OLP', 'Revenus du protocole', 'Points Omni → token VAR (à vérifier)'],
      en: ['0% fee trading', 'Spread captured by the OLP', 'Protocol revenue', 'Omni points → VAR token (to verify)'],
      ko: ['수수료 0% 거래', 'OLP가 스프레드 확보', '프로토콜 수익', 'Omni 포인트 → VAR 토큰 (확인 필요)'],
    },
    quotes: [Q_FEES, Q_MAIN],
    videoIds: ['wsh-fees-scam', 'fwm-zero-fees'],
    sources: [
      { label: 'DefiLlama Research — revenue, volume, open interest, listings', url: DEFILLAMA_REPORT },
      { label: 'Omni — markets list', url: 'https://omni.variational.io/markets' },
    ],
    toVerify: {
      fr: [
        'Airdrop d’environ 32 % de la supply.',
        'Fin du programme de points.',
        'Date du ticker VAR.',
      ],
      en: ['Airdrop of roughly 32% of supply.', 'End of the points programme.', 'VAR ticker date.'],
      ko: ['공급량의 약 32% 에어드랍.', '포인트 프로그램 종료.', 'VAR 티커 일정.'],
    },
  },

  twitter: {
    id: 'twitter',
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
        verified: false,
      },
      {
        text: 'onchain orderbooks can never match RFQs on asset breadth and depth.',
        author: 'as required. (@0xasrequired)',
        context: 'X',
        url: 'https://x.com/0xasrequired/status/2111462988074856949',
        verified: false,
      },
      {
        text: 'That’s exactly why Variational already has 500 pairs.',
        author: 'Joestar (@JoestarCrypto)',
        context: 'X',
        url: 'https://x.com/JoestarCrypto/status/2006157857515819340',
        verified: false,
      },
      {
        text: 'For less liquid RWAs, RFQ is awesome.',
        author: 'Ignas (@DefiIgnas)',
        context: 'X',
        url: 'https://x.com/DefiIgnas/status/2057104680048865297',
        verified: false,
      },
      {
        text: 'external MMs cannot extract value from the retail flows.',
        author: 'yh (@yh_0x)',
        context: 'X',
        url: 'https://x.com/yh_0x/status/1979560430600380743',
        verified: false,
      },
    ],
    videoIds: [],
    sources: [],
  },

  stage: {
    id: 'stage',
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
        'Par défaut, le grand écran affiche la bannière du Summit. Choisis un extrait ci-dessous et clique sur « Diffuser sur l’écran » pour le lancer (lecture muette automatique), puis « Arrêter » pour revenir à la bannière.',
        'Pour écouter avec le son, utilise « Regarder ici » ou ouvre la vidéo sur YouTube.',
      ],
      en: [
        'By default the big screen shows the Summit banner. Pick a clip below and click “Play on screen” to start it (muted autoplay), then “Stop” to go back to the banner.',
        'To listen with sound, use “Watch here” or open the video on YouTube.',
      ],
      ko: [
        '기본적으로 대형 스크린에는 Summit 배너가 표시됩니다. 아래에서 클립을 선택해 “스크린에서 재생”을 누르면 재생되고(음소거 자동 재생), “정지”를 누르면 배너로 돌아갑니다.',
        '소리와 함께 보려면 “여기서 보기”를 누르거나 YouTube에서 여세요.',
      ],
    },
    deepTech: {
      fr: [
        'Flirting with Models S7E34 : 05:45 spreads et zero fees, 09:35 segmentation du flow, 27:31 « aggregating ».',
        'Bankless (Robinhood of Onchain Trading) : broker vs exchange, OLP (~34:00), fonds utilisateurs (~37:03).',
        'The Gwart Show : structure de marché (10:45), RWA (13:41), OLP (33:52).',
        'When Shift Happens E186 : zero fees (29:54), « are trading fees a scam? » (34:33).',
      ],
      en: [
        'Flirting with Models S7E34: 05:45 spreads and zero fees, 09:35 flow segmentation, 27:31 “aggregating”.',
        'Bankless (Robinhood of Onchain Trading): broker vs exchange, OLP (~34:00), user funds (~37:03).',
        'The Gwart Show: market structure (10:45), RWAs (13:41), OLP (33:52).',
        'When Shift Happens E186: zero fees (29:54), “are trading fees a scam?” (34:33).',
      ],
      ko: [
        'Flirting with Models S7E34: 05:45 스프레드와 수수료 0%, 09:35 주문 흐름 세분화, 27:31 “aggregating”.',
        'Bankless (Robinhood of Onchain Trading): 브로커 vs 거래소, OLP (~34:00), 사용자 자금 (~37:03).',
        'The Gwart Show: 시장 구조 (10:45), RWA (13:41), OLP (33:52).',
        'When Shift Happens E186: 수수료 0% (29:54), “거래 수수료는 사기인가?” (34:33).',
      ],
    },
    quotes: [Q_MAIN, Q_AGGREGATING],
    videoIds: ['bankless-broker', 'gwart-rfq', 'fwm-zero-fees', 'wsh-fees-scam', 'bankless-funds', 'castle-rfq-clob'],
    sources: [
      { label: 'Flirting with Models S7E34', url: 'https://www.youtube.com/watch?v=_5bYsyJUx68' },
      { label: 'Bankless — Robinhood of Onchain Trading', url: 'https://www.youtube.com/watch?v=fSt4qmz1C_M' },
      { label: 'The Gwart Show', url: 'https://www.youtube.com/watch?v=tfS9k2w1WhM' },
      { label: 'When Shift Happens E186', url: 'https://www.youtube.com/watch?v=Y_pWv3VayqU' },
      { label: 'Castle Labs (bonus)', url: 'https://www.youtube.com/watch?v=tucl1jCTy6E' },
    ],
    toVerify: {
      fr: ['Timestamps des podcasts et exactitude des citations.'],
      en: ['Podcast timestamps and quote accuracy.'],
      ko: ['팟캐스트 타임스탬프와 인용문의 정확성.'],
    },
  },
};

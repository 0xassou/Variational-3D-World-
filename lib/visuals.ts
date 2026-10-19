import type { InteractiveId, Localized } from './content';

/** Chiffre clé affiché en tête de pop-up. */
export interface Highlight {
  value: string;
  label: Localized;
  /** Valeur listée « à vérifier » dans le Notion. */
  unverified?: boolean;
}

/** Visuel réel (capture de rapport / schéma de docs), servi depuis /public/research. */
export interface Figure {
  src: string;
  caption: Localized;
  credit: string;
}

const DL = 'DefiLlama Research';
const DOCS = 'Docs Variational';

export const HIGHLIGHTS: Partial<Record<InteractiveId, Highlight[]>> = {
  rfq: [
    { value: '500+', label: { fr: 'paires listées (crypto + RWA)', en: 'listed pairs (crypto + RWA)', ko: '상장 페어 (크립토 + RWA)' } },
    { value: '1 fill', label: { fr: 'prix ferme par trade', en: 'firm price per trade', ko: '거래당 확정 가격' } },
    { value: '0', label: { fr: 'cold start par marché', en: 'per-market cold start', ko: '마켓별 콜드 스타트' } },
  ],
  omni: [
    { value: '0%', label: { fr: 'frais de trading', en: 'trading fees', ko: '거래 수수료' } },
    { value: 'Spread', label: { fr: 'seule source de revenus', en: 'only revenue source', ko: '유일한 수익원' } },
    { value: 'Arbitrum', label: { fr: 'settlement on-chain', en: 'onchain settlement', ko: '온체인 정산' } },
  ],
  pro: [
    { value: '1 pool', label: { fr: 'isolé par utilisateur', en: 'isolated per user', ko: '사용자별 분리 풀' } },
    { value: '0', label: { fr: 'réhypothécation', en: 'rehypothecation', ko: '재담보' } },
    { value: 'P2P', label: { fr: 'contrepartie explicite', en: 'explicit counterparty', ko: '명시적 상대방' } },
  ],
  tokenomics: [
    { value: 'VAR', label: { fr: 'ticker annoncé', en: 'announced ticker', ko: '발표된 티커' }, unverified: true },
    { value: '~32%', label: { fr: 'de la supply en airdrop', en: 'of supply airdropped', ko: '공급량 에어드랍' }, unverified: true },
    { value: 'Spread', label: { fr: 'modèle de revenus', en: 'revenue model', ko: '수익 모델' } },
  ],
};

export const FIGURES: Partial<Record<InteractiveId, Figure[]>> = {
  rfq: [
    {
      src: '/research/dl_rfq_exchanges.png',
      caption: { fr: 'Fonctionnement d’un exchange RFQ', en: 'How an RFQ exchange works', ko: 'RFQ 거래소의 작동 방식' },
      credit: `${DL} (crédit Hummingbot)`,
    },
    {
      src: '/research/dl_omni_aggregates.png',
      caption: { fr: 'Omni agrège la liquidité mondiale', en: 'Omni aggregates global liquidity', ko: 'Omni의 글로벌 유동성 집계' },
      credit: `${DL} (crédit Variational)`,
    },
    {
      src: '/research/dl_slippage_crude.png',
      caption: {
        fr: 'Slippage sur le pétrole : on-chain (Hyperliquid) vs CME',
        en: 'Crude oil slippage: onchain (Hyperliquid) vs CME',
        ko: '원유 슬리피지: 온체인(Hyperliquid) vs CME',
      },
      credit: `${DL} (données Castle Labs)`,
    },
  ],
  omni: [
    {
      src: '/research/olp_omni_diagram.png',
      caption: { fr: 'Architecture de l’OLP', en: 'OLP architecture', ko: 'OLP 아키텍처' },
      credit: `${DOCS} — page OLP`,
    },
    {
      src: '/research/dl_perp_listings.png',
      caption: { fr: 'Nombre de perps listés par perp DEX', en: 'Perps listed per perp DEX', ko: '무기한 DEX별 상장 수' },
      credit: `${DL} (crédit Variational)`,
    },
    {
      src: '/research/dl_revenue.png',
      caption: { fr: 'Revenus par période (spread)', en: 'Revenue per period (spread)', ko: '기간별 수익 (스프레드)' },
      credit: DL,
    },
  ],
  pro: [
    {
      src: '/research/settlement_pools_diagram.png',
      caption: { fr: 'L’OLP et un pool isolé par utilisateur', en: 'The OLP and one isolated pool per user', ko: 'OLP와 사용자별 분리 풀' },
      credit: `${DOCS} — Settlement Pools`,
    },
    {
      src: '/research/dl_pro_works.png',
      caption: { fr: 'Comment fonctionne Variational Pro', en: 'How Variational Pro works', ko: 'Variational Pro 작동 방식' },
      credit: DL,
    },
    {
      src: '/research/dl_protocol_infra.png',
      caption: { fr: 'Infrastructure du Variational Protocol', en: 'Variational Protocol infrastructure', ko: 'Variational Protocol 인프라' },
      credit: DL,
    },
    {
      src: '/research/olp_vault_comparisons.png',
      caption: { fr: 'Vaults comparés : HLP, JLP, OLP', en: 'Vaults compared: HLP, JLP, OLP', ko: '볼트 비교: HLP, JLP, OLP' },
      credit: `${DOCS} — page OLP`,
    },
    {
      src: '/research/dl_pricing_oracle.png',
      caption: { fr: 'Oracle de prix Variational', en: 'Variational pricing oracle', ko: 'Variational 가격 오라클' },
      credit: `${DL} (crédit Variational)`,
    },
  ],
  tokenomics: [
    {
      src: '/research/dl_revenue.png',
      caption: { fr: 'Revenus par période', en: 'Revenue per period', ko: '기간별 수익' },
      credit: DL,
    },
    {
      src: '/research/dl_trading_volume.png',
      caption: { fr: 'Volume de trading, 24 janv. → 4 juin 2026', en: 'Trading volume, 24 Jan → 4 Jun 2026', ko: '거래량, 2026.1.24 → 6.4' },
      credit: DL,
    },
    {
      src: '/research/dl_open_interest.png',
      caption: { fr: 'Open interest, 24 janv. → 4 juin 2026', en: 'Open interest, 24 Jan → 4 Jun 2026', ko: '미결제약정, 2026.1.24 → 6.4' },
      credit: DL,
    },
  ],
  metrics: [
    {
      src: '/research/dl_trading_volume.png',
      caption: { fr: 'Volume de trading quotidien', en: 'Daily trading volume', ko: '일일 거래량' },
      credit: `${DL} — 24 janv. → 4 juin 2026`,
    },
    {
      src: '/research/dl_open_interest.png',
      caption: { fr: 'Open interest', en: 'Open interest', ko: '미결제약정' },
      credit: `${DL} — 24 janv. → 4 juin 2026`,
    },
    {
      src: '/research/dl_perp_listings.png',
      caption: { fr: 'Perps listés par perp DEX', en: 'Perps listed per perp DEX', ko: '무기한 DEX별 상장 수' },
      credit: `${DL} (crédit Variational)`,
    },
    {
      src: '/research/dl_rwa_perp_markets.png',
      caption: { fr: 'Nombre de marchés RWA perps', en: 'Number of RWA perps markets', ko: 'RWA 무기한 마켓 수' },
      credit: '© DefiLlama',
    },
    {
      src: '/research/dl_total_perp_volume.png',
      caption: { fr: 'Volume total des perp DEX, toutes chains', en: 'Total perp DEX volume, all chains', ko: '전체 체인 무기한 DEX 거래량' },
      credit: '© DefiLlama',
    },
  ],
};

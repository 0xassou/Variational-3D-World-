import type { InteractiveId, Localized } from './content';

/** Chiffre clé affiché en tête de l'onglet « Essentiel ». */
export interface Highlight {
  value: string;
  label: Localized;
  /** Valeur à recouper (lecture approximative, annonce non confirmée…). */
  unverified?: boolean;
}

export const HIGHLIGHTS: Partial<Record<InteractiveId, Highlight[]>> = {
  rfq: [
    { value: '575+', label: { fr: 'marchés dérivés listés (Crypto + RWA)', en: 'derivatives markets listed (Crypto + RWA)', ko: '상장된 파생상품 마켓 (크립토 + RWA)' } },
    { value: '1 fill', label: { fr: 'prix ferme pour toute la taille', en: 'firm price for the whole size', ko: '전체 수량에 확정 가격' } },
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
  swaps: [
    { value: '10x', label: { fr: 'levier max (5x sur le cacao)', en: 'max leverage (5x on cocoa)', ko: '최대 레버리지 (코코아 5배)' } },
    { value: '0%', label: { fr: 'frais de trading', en: 'trading fees', ko: '거래 수수료' } },
    { value: '~13 Md$', label: { fr: 'volume RWA / semaine (Blockworks, oct. 2026)', en: 'RWA volume / week (Blockworks, Oct 2026)', ko: '주간 RWA 거래량 (Blockworks, 2026년 10월)' }, unverified: true },
  ],
  tokenomics: [
    { value: '32%', label: { fr: 'airdrop Genesis, 100 % débloqué au TGE', en: 'Genesis airdrop, 100% unlocked at TGE', ko: 'Genesis 에어드랍, TGE 시 100% 언락' } },
    { value: '150k', label: { fr: 'points distribués par semaine', en: 'points distributed per week', ko: '주간 분배 포인트' } },
    { value: '100%', label: { fr: 'des revenus de trésorerie en buy & burn', en: 'of treasury revenue to buy & burn', ko: '재무 수익 바이백 & 소각' } },
    { value: 'Q4 2026', label: { fr: 'TGE du token $VAR', en: '$VAR token TGE', ko: '$VAR 토큰 TGE' } },
  ],
  vision: [
    { value: '575+', label: { fr: 'marchés aujourd’hui', en: 'markets today', ko: '현재 마켓 수' } },
    { value: 'Q4 2026', label: { fr: 'TGE $VAR', en: '$VAR TGE', ko: '$VAR TGE' } },
    { value: '2027', label: { fr: 'Variational Pro (OTC)', en: 'Variational Pro (OTC)', ko: 'Variational Pro (OTC)' }, unverified: true },
  ],
};

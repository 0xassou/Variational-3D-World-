import type { InteractiveId, Localized } from './content';

/** Chiffre clé affiché en tête de l'onglet « Essentiel ». */
export interface Highlight {
  value: string;
  label: Localized;
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
    { value: '$3–4B', label: { fr: 'par jour sur Omni (Space X, 20 oct. 2026)', en: 'per day on Omni (X Space, 20 Oct 2026)', ko: 'Omni 하루 거래량 (2026년 10월 20일 X 스페이스)' } },
  ],
  pro: [
    { value: '$400B', label: { fr: 'compensés depuis le lancement du protocole', en: 'cleared since the protocol launched', ko: '프로토콜 출시 이후 청산액' } },
    { value: '~$850T', label: { fr: 'd’encours de dérivés OTC (ordre de grandeur cité par Lucas)', en: 'of outstanding OTC derivatives (order of magnitude cited by Lucas)', ko: '장외 파생상품 잔액 (Lucas가 언급한 대략적 수치)' } },
    { value: 'Multi-dealers', label: { fr: 'RFQ automatisé entre institutions', en: 'automated RFQ between institutions', ko: '기관 간 자동화된 RFQ' } },
    { value: '2027', label: { fr: 'premiers pas de Pro (date exacte non vérifiée)', en: 'Pro’s first steps (exact date unverified)', ko: 'Pro의 첫걸음 (정확한 날짜 미확인)' } },
  ],
  swaps: [
    { value: '10x', label: { fr: 'levier max (5x sur le cacao)', en: 'max leverage (5x on cocoa)', ko: '최대 레버리지 (코코아 5배)' } },
    { value: '0%', label: { fr: 'frais de trading', en: 'trading fees', ko: '거래 수수료' } },
    { value: '~13 Md$', label: { fr: 'volume RWA / semaine (Blockworks, oct. 2026)', en: 'RWA volume / week (Blockworks, Oct 2026)', ko: '주간 RWA 거래량 (Blockworks, 2026년 10월)' } },
  ],
  tokenomics: [
    { value: '32%', label: { fr: 'airdrop Genesis, 100 % débloqué au TGE', en: 'Genesis airdrop, 100% unlocked at TGE', ko: 'Genesis 에어드랍, TGE 시 100% 언락' } },
    { value: '150k', label: { fr: 'points distribués par semaine', en: 'points distributed per week', ko: '주간 분배 포인트' } },
    { value: '100%', label: { fr: 'des revenus de trésorerie en buy & burn', en: 'of treasury revenue to buy & burn', ko: '재무 수익 바이백 & 소각' } },
    { value: 'Very soon', label: { fr: 'TGE du token $VAR (date exacte non vérifiée)', en: '$VAR token TGE (exact date unverified)', ko: '$VAR 토큰 TGE (정확한 날짜 미확인)' } },
  ],
  vision: [
    { value: '575+', label: { fr: 'marchés aujourd’hui', en: 'markets today', ko: '현재 마켓 수' } },
    { value: 'Very soon', label: { fr: 'TGE $VAR (date exacte non vérifiée)', en: '$VAR TGE (exact date unverified)', ko: '$VAR TGE (정확한 날짜 미확인)' } },
    { value: '2027', label: { fr: 'premiers pas de Variational Pro', en: 'Variational Pro’s first steps', ko: 'Variational Pro의 첫걸음' } },
    { value: 'Pro > Omni', label: { fr: 'à terme, selon Lucas Schuermann', en: 'eventually, according to Lucas Schuermann', ko: '장기적으로 (Lucas Schuermann)' } },
  ],
};

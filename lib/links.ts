/**
 * Liens sociaux et d'accès affichés sur le Twitter Alpha Wall (panneau « Follow & Access »).
 *
 * - VARIATIONAL_X : compte officiel, lié depuis variational.io et docs.variational.io.
 * - CEO_URL : aucun compte X personnel de Lucas Schuermann n'est lié depuis ses pages
 *   officielles (lucasschuermann.com ne liste que GitHub et LinkedIn). Le site officiel est
 *   utilisé par défaut ; remplace-le par l'URL de son compte X une fois vérifiée.
 * - REFERRAL_CODE : renseigne ton code de parrainage Omni pour transformer le bouton
 *   d'accès en lien d'affiliation (ajouté en ?ref=CODE). Vide = lien direct vers Omni.
 */

export const VARIATIONAL_X = { label: '@variational_io', url: 'https://x.com/variational_io' } as const;

export const CEO_URL = { label: 'Lucas Schuermann', url: 'https://lucasschuermann.com/' } as const;

export const OMNI_URL = 'https://omni.variational.io';

export const REFERRAL_CODE = '';

export function accessUrl(): string {
  return REFERRAL_CODE ? `${OMNI_URL}/?ref=${encodeURIComponent(REFERRAL_CODE)}` : OMNI_URL;
}

export function openExternal(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

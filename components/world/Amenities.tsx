'use client';

import { Text } from '@react-three/drei';
import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier';
import { CONTENT } from '@/lib/content';
import { t } from '@/lib/i18n';
import { BRAND, interactivePoint, TWITTER_WALL } from '@/lib/layout';
import { accessUrl, CEO_URL, CREATOR_X, openExternal, REFERRAL_CODE, VARIATIONAL_X } from '@/lib/links';
import { audio } from '@/lib/audio';
import { flashAt } from '@/lib/fx';
import { useWorld } from '@/lib/store';
import { FONT_BOLD, FONT_REGULAR, FONT_SEMI } from './Hall';
import { interactiveHandlers, Kiosk } from './Kiosk';
import { Cafe } from './Cafe';
import { Restrooms } from './Restrooms';
import { Armchair, BistroSet, CoffeeTable, Kakemono, Plant, PlanterBox, Sofa, Totem, type PlantKind } from './Decor';
import { LogoPlane } from './Logo';

/* ------------------------------------------------------------------ */
/* Positions partagées avec la foule (Crowd.tsx)                        */
/* ------------------------------------------------------------------ */

/** Mange-debout de l'espace networking. */
export const COCKTAIL_TABLES: [number, number][] = [
  [-12, 0],
  [-6, 2],
  [6, 2],
  [12, 0],
  [-12, 9],
  [-6, 11],
  [6, 11],
  [12, 9],
  [-10.5, -3.5],
  [10.5, -3.5],
  [-2.6, 12.5],
  [2.6, 12.5],
];

/** Tables hautes de discussion avec tabourets. */
export const BISTRO_SETS: [number, number][] = [
  [-17, -4],
  [17, -4],
  [-17, 11],
  [17, 11],
  [-7, -7.5],
  [7, -7.5],
];

export interface LoungeLayout {
  x: number;
  z: number;
}

/** Salons (canapé + 2 fauteuils + table basse), orientés vers +Z. */
export const LOUNGES: LoungeLayout[] = [
  { x: -9, z: 21 },
  { x: 9, z: 21 },
  { x: -17, z: 25 },
  { x: 17, z: 25 },
];

/** Places assises d'un salon, en coordonnées locales : [x, z, rotY]. */
export const LOUNGE_SEATS: [number, number, number][] = [
  [-0.8, -1.55, 0],
  [0.8, -1.55, 0],
  [-1.55, 0.75, Math.PI - 0.5],
  [1.55, 0.75, Math.PI + 0.5],
];


/* ------------------------------------------------------------------ */
/* Espace networking                                                    */
/* ------------------------------------------------------------------ */

function CocktailTable({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.04, 24]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.05, 12]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.04, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>
      {/* Gobelets */}
      <mesh position={[0.12, 1.15, 0.08]}>
        <cylinderGeometry args={[0.035, 0.03, 0.1, 12]} />
        <meshStandardMaterial color={BRAND.primary} />
      </mesh>
      <mesh position={[-0.15, 1.15, -0.05]}>
        <cylinderGeometry args={[0.035, 0.03, 0.1, 12]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function Lounge({ x, z }: LoungeLayout) {
  return (
    <group position={[x, 0, z]}>
      {/* Tapis */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[2.9, 48]} />
        <meshStandardMaterial color="#e6edf7" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <ringGeometry args={[2.75, 2.9, 64]} />
        <meshStandardMaterial color={BRAND.primary} roughness={1} />
      </mesh>
      <Sofa position={[0, 0, LOUNGE_SEATS[0][1] - 0.05]} />
      <Armchair position={[LOUNGE_SEATS[2][0], 0, LOUNGE_SEATS[2][1]]} rotationY={LOUNGE_SEATS[2][2]} />
      <Armchair position={[LOUNGE_SEATS[3][0], 0, LOUNGE_SEATS[3][1]]} rotationY={LOUNGE_SEATS[3][2]} />
      <CoffeeTable position={[0, 0, -0.35]} />
      <Plant position={[2.1, 0, -1.9]} kind="tall" scale={0.9} />
      <Plant position={[-2.1, 0, -1.9]} kind="snake" />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Mobilier central : totems, kakemonos, bacs végétalisés, plantes      */
/* ------------------------------------------------------------------ */

const TOTEM_FACES: string[][] = [
  ['0% FEES', 'Spread-only model', 'Omni on Arbitrum'],
  ['RFQ', 'Aggregated liquidity', 'No cold start'],
  ['575+ MARKETS', 'Crypto & RWA', 'Derivatives listed'],
];

const KAKEMONOS: { p: [number, number, number]; r: number; lines: string[]; theme: 'dark' | 'light' }[] = [
  { p: [-2.6, 0, -10.4], r: 0, lines: ['OMNI', 'Trade with 0% fees'], theme: 'dark' },
  { p: [2.6, 0, -10.4], r: 0, lines: ['RFQ', 'Single fill, firm price'], theme: 'light' },
  { p: [-5.2, 0, 26.5], r: 0, lines: ['WELCOME', 'Variational Summit'], theme: 'light' },
  { p: [5.2, 0, 26.5], r: 0, lines: ['PRO', 'Institutional OTC'], theme: 'dark' },
  { p: [2.4, 0, 39.2], r: Math.PI, lines: ['SUMMIT', 'Main hall · Stage A'], theme: 'dark' },
  { p: [9.6, 0, 39.2], r: Math.PI, lines: ['ARBITRUM', 'Onchain settlement'], theme: 'light' },
];

function CentralDecor() {
  return (
    <group>
      {/* Totems de marque au milieu du hall */}
      <Totem position={[-14, 0, -10]} rotationY={0.5} faces={[TOTEM_FACES[1], TOTEM_FACES[2], TOTEM_FACES[0]]} />
      <Totem position={[14, 0, -10]} rotationY={-0.5} faces={[TOTEM_FACES[2], TOTEM_FACES[0], TOTEM_FACES[1]]} />

      {KAKEMONOS.map((k) => (
        <Kakemono key={k.lines[0]} position={k.p} rotationY={k.r} lines={k.lines} theme={k.theme} />
      ))}

      {/* Tables hautes et tabourets */}
      {BISTRO_SETS.map(([x, z], i) => (
        <BistroSet key={`${x}-${z}`} position={[x, 0, z]} stools={i % 2 ? 3 : 4} rotationY={i * 0.7} />
      ))}

      {/* Bacs végétalisés (séparateurs) */}
      <PlanterBox position={[-4.6, 0, 29.5]} />
      <PlanterBox position={[4.6, 0, 29.5]} />
      <PlanterBox position={[-9, 0, 14.6]} length={3} />
      <PlanterBox position={[9, 0, 14.6]} length={3} />
      <PlanterBox position={[-20.5, 0, -27]} rotationY={Math.PI / 2} />
      <PlanterBox position={[20.5, 0, -27]} rotationY={Math.PI / 2} />

      {/* Plantes hautes le long des murs et autour des totems */}
      {(
        [
          [-30.6, -40.4, 'tall'],
          [30.6, -40.4, 'tall'],
          [-30.6, 4, 'tall'],
          [30.6, 4, 'tall'],
          [-30.6, 23.5, 'tall'],
          [30.6, 23.5, 'tall'],
          [-13.4, -12.4, 'bush'],
          [13.4, -12.4, 'bush'],
          [1.2, 40.6, 'bush'],
          [10.9, 40.6, 'bush'],
        ] as [number, number, PlantKind][]
      ).map(([x, z, kind]) => (
        <Plant key={`${x}-${z}`} position={[x, 0, z]} kind={kind} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Twitter Alpha Wall                                                   */
/* ------------------------------------------------------------------ */

/** Bouton 3D du totem social : ouvre le lien si le joueur est à portée du mur. */
function LinkButton({ y, label, sub, url, primary = false }: { y: number; label: string; sub: string; url: string; primary?: boolean }) {
  return (
    <group
      position={[0, y, 0.09]}
      onClick={(e) => {
        e.stopPropagation();
        if (e.delta > 6) return;
        const { nearbyId, showToast, lang, activeId } = useWorld.getState();
        if (activeId) return;
        audio.click();
        flashAt([e.point.x, e.point.y, e.point.z], primary ? '#4C9AF8' : '#ffffff');
        if (nearbyId === 'twitter') openExternal(url);
        else showToast(t('tooFar', lang));
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = '';
      }}
    >
      <mesh>
        <boxGeometry args={[1.56, 0.5, 0.06]} />
        <meshStandardMaterial color={primary ? BRAND.primary : '#ffffff'} roughness={0.4} />
      </mesh>
      <Text font={FONT_BOLD} position={[0, 0.07, 0.035]} fontSize={0.12} color={primary ? '#ffffff' : '#0b1f3a'} anchorX="center" anchorY="middle" maxWidth={1.45}>
        {label}
      </Text>
      <Text font={FONT_REGULAR} position={[0, -0.1, 0.035]} fontSize={0.075} color={primary ? '#e0efff' : '#475569'} anchorX="center" anchorY="middle" maxWidth={1.45}>
        {sub}
      </Text>
    </group>
  );
}

/** Totem « Follow & Access » : liens CEO, compte X officiel et accès direct au protocole. */
function SocialTotem({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 4.4, 0.14]} />
        <meshStandardMaterial color={BRAND.dark} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[2.1, 0.12, 0.6]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.3} />
      </mesh>
      <LogoPlane variant="onDark" width={1.5} position={[0, 4.05, 0.075]} />
      <Text font={FONT_BOLD} position={[0, 3.68, 0.075]} fontSize={0.15} letterSpacing={0.15} color="#9cc8fb" anchorX="center" anchorY="middle">
        FOLLOW & ACCESS
      </Text>
      <LinkButton y={3.2} label="Lucas Schuermann · CEO" sub={CEO_URL.url.replace(/^https?:\/\//, '').replace(/\/$/, '')} url={CEO_URL.url} />
      <LinkButton y={2.62} label={`X ${VARIATIONAL_X.label}`} sub="Official account" url={VARIATIONAL_X.url} />
      <LinkButton y={2.04} label="Trade on Omni →" sub={REFERRAL_CODE ? `ref: ${REFERRAL_CODE}` : 'omni.variational.io'} url={accessUrl()} primary />
      {/* Section créateur du Summit */}
      <mesh position={[0, 1.62, 0.075]}>
        <planeGeometry args={[1.5, 0.008]} />
        <meshBasicMaterial color="#35507a" />
      </mesh>
      <Text font={FONT_BOLD} position={[0, 1.45, 0.075]} fontSize={0.085} letterSpacing={0.18} color="#9cc8fb" anchorX="center" anchorY="middle">
        SUMMIT CREATOR
      </Text>
      <LinkButton y={1.08} label={`X ${CREATOR_X.label}`} sub="DMs open" url={CREATOR_X.url} />
      <Text font={FONT_REGULAR} position={[0, 0.62, 0.075]} fontSize={0.068} lineHeight={1.3} color="#cbd5e1" anchorX="center" anchorY="middle" maxWidth={1.65} textAlign="center">
        Curious about this summit or the ecosystem? My DMs are open.
      </Text>
      <Text font={FONT_REGULAR} position={[0, 0.3, 0.075]} fontSize={0.058} color="#7f93b0" anchorX="center" anchorY="middle" maxWidth={1.7} textAlign="center">
        Click when near the wall · Not financial advice
      </Text>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[1.05, 2.2, 0.3]} position={[0, 2.2, 0]} />
      </RigidBody>
    </group>
  );
}

function TwitterWall() {
  const tweets = CONTENT.twitter.quotes;
  const kiosk = interactivePoint('twitter');
  const cols = 3;
  const cardW = 4.6;
  const cardH = 2.1;

  return (
    <group>
      <group position={[TWITTER_WALL.x, 0, TWITTER_WALL.z]} rotation={[0, Math.PI, 0]} {...interactiveHandlers('twitter')}>
        <mesh position={[0, 3.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[TWITTER_WALL.width, TWITTER_WALL.height, 0.2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        <mesh position={[0, 3.9 + TWITTER_WALL.height / 2 - 0.45, 0.11]}>
          <planeGeometry args={[TWITTER_WALL.width, 0.9]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <Text font={FONT_BOLD} position={[0, 3.9 + TWITTER_WALL.height / 2 - 0.45, 0.12]} fontSize={0.42} letterSpacing={0.1} color="#ffffff" anchorX="center" anchorY="middle">
          X · TWITTER ALPHA WALL
        </Text>
        {tweets.map((tw, i) => {
          const row = Math.floor(i / cols);
          const inRow = row === 0 ? cols : tweets.length - cols;
          const col = i % cols;
          const x = (col - (inRow - 1) / 2) * (cardW + 0.35);
          const y = 5.15 - row * (cardH + 0.3);
          return (
            <group key={tw.author} position={[x, y, 0.12]}>
              {tw.author.includes('Joestar') && (
                <mesh position={[0, 0, -0.005]}>
                  <planeGeometry args={[cardW + 0.12, cardH + 0.12]} />
                  <meshBasicMaterial color={BRAND.primary} toneMapped={false} />
                </mesh>
              )}
              <mesh>
                <planeGeometry args={[cardW, cardH]} />
                <meshStandardMaterial color="#f1f5f9" />
              </mesh>
              <mesh position={[-cardW / 2 + 0.35, cardH / 2 - 0.35, 0.005]}>
                <circleGeometry args={[0.18, 24]} />
                <meshStandardMaterial color={BRAND.primary} />
              </mesh>
              <Text font={FONT_SEMI} position={[-cardW / 2 + 0.65, cardH / 2 - 0.35, 0.01]} fontSize={0.17} color="#0f172a" anchorX="left" anchorY="middle" maxWidth={cardW - 0.9}>
                {tw.author}
              </Text>
              <Text font={FONT_REGULAR} position={[-cardW / 2 + 0.25, cardH / 2 - 0.7, 0.01]} fontSize={0.2} lineHeight={1.25} color="#1e293b" anchorX="left" anchorY="top" maxWidth={cardW - 0.5}>
                {`“${tw.text}”`}
              </Text>
            </group>
          );
        })}
      </group>
      <Kiosk id="twitter" accent="#0f172a" label="Twitter Alpha Wall" position={[kiosk.x, 0, kiosk.z]} rotationY={Math.PI} />
      <SocialTotem position={[TWITTER_WALL.x + TWITTER_WALL.width / 2 + 1.9, 0, TWITTER_WALL.z - 1.6]} />
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[TWITTER_WALL.width / 2, 3.5, 0.2]} position={[TWITTER_WALL.x, 3.5, TWITTER_WALL.z]} />
      </RigidBody>
    </group>
  );
}

/* ------------------------------------------------------------------ */

export function Amenities() {
  return (
    <group>
      {COCKTAIL_TABLES.map(([x, z]) => (
        <CocktailTable key={`${x}-${z}`} x={x} z={z} />
      ))}
      {LOUNGES.map((l) => (
        <Lounge key={`${l.x}-${l.z}`} {...l} />
      ))}
      <CentralDecor />
      <Text font={FONT_SEMI} position={[0, 0.02, 17.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.6} letterSpacing={0.2} color="#cbd5e1" anchorX="center" anchorY="middle">
        NETWORKING
      </Text>
      <TwitterWall />
      <Restrooms />
      <Cafe />
      <RigidBody type="fixed" colliders={false}>
        {COCKTAIL_TABLES.map(([x, z]) => (
          <CylinderCollider key={`ct-${x}-${z}`} args={[0.55, 0.45]} position={[x, 0.55, z]} />
        ))}
      </RigidBody>
    </group>
  );
}

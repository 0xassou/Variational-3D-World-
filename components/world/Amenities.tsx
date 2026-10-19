'use client';

import { Text } from '@react-three/drei';
import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier';
import { CONTENT } from '@/lib/content';
import { BRAND, HALF_D, HALF_W, interactivePoint, TWITTER_WALL } from '@/lib/layout';
import { FONT_BOLD, FONT_REGULAR, FONT_SEMI } from './Hall';
import { interactiveHandlers, Kiosk } from './Kiosk';
import { Person } from './people';
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

export const TOILETS = { minX: HALF_W - 9, maxX: HALF_W, minZ: HALF_D - 11, maxZ: HALF_D } as const;
export const BAR = { x: -HALF_W + 3, z: 31, length: 5 } as const;

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
  ['500+ PAIRS', 'Crypto & RWA', 'Long-tail markets'],
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
      <Totem position={[0, 0, 5]} faces={TOTEM_FACES} />
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
          [-1.4, 3.2, 'snake'],
          [1.4, 6.8, 'snake'],
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
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[TWITTER_WALL.width / 2, 3.5, 0.2]} position={[TWITTER_WALL.x, 3.5, TWITTER_WALL.z]} />
      </RigidBody>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Toilettes d'exposition                                               */
/* ------------------------------------------------------------------ */

function Pictogram({ kind, position }: { kind: 'man' | 'woman'; position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, -Math.PI / 2, 0]}>
      <mesh>
        <circleGeometry args={[0.32, 32]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[0, 0.12, 0.01]}>
        <circleGeometry args={[0.06, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {kind === 'man' ? (
        <mesh position={[0, -0.08, 0.01]}>
          <planeGeometry args={[0.12, 0.26]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ) : (
        <mesh position={[0, -0.08, 0.01]}>
          <circleGeometry args={[0.13, 3, Math.PI / 2]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      )}
    </group>
  );
}

function Restrooms() {
  const { minX, maxX, minZ, maxZ } = TOILETS;
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  const h = 3.2;
  return (
    <group>
      {/* Façade côté hall */}
      <mesh position={[minX, h / 2, cz]} castShadow receiveShadow>
        <boxGeometry args={[0.25, h, maxZ - minZ]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>
      {/* Cloison côté sud */}
      <mesh position={[cx, h / 2, minZ]} castShadow receiveShadow>
        <boxGeometry args={[maxX - minX, h, 0.25]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>
      {/* Toit */}
      <mesh position={[cx, h + 0.05, cz]} castShadow>
        <boxGeometry args={[maxX - minX, 0.1, maxZ - minZ]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      {/* Portes + pictogrammes */}
      {[
        { z: minZ + 3.2, kind: 'man' as const },
        { z: minZ + 7.4, kind: 'woman' as const },
      ].map((door) => (
        <group key={door.kind}>
          <mesh position={[minX - 0.13, 1.1, door.z]}>
            <boxGeometry args={[0.04, 2.2, 1.1]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
          </mesh>
          <mesh position={[minX - 0.16, 1.1, door.z + 0.38]}>
            <boxGeometry args={[0.04, 0.05, 0.18]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} />
          </mesh>
          <Pictogram kind={door.kind} position={[minX - 0.14, 2.6, door.z]} />
        </group>
      ))}
      <Text font={FONT_SEMI} position={[minX - 0.14, 2.6, minZ + 5.3]} rotation={[0, -Math.PI / 2, 0]} fontSize={0.3} color="#475569" anchorX="center" anchorY="middle">
        WC
      </Text>
      <Plant position={[minX - 0.8, 0, minZ + 1]} kind="snake" />
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[(maxX - minX) / 2, h / 2, (maxZ - minZ) / 2]} position={[cx, h / 2, cz]} />
      </RigidBody>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Coffee bar                                                           */
/* ------------------------------------------------------------------ */

function CoffeeBar() {
  const { x, z, length } = BAR;
  return (
    <group>
      <mesh position={[x, 0.55, z]} castShadow receiveShadow>
        <boxGeometry args={[1, 1.1, length]} />
        <meshStandardMaterial color="#ffffff" roughness={0.35} />
      </mesh>
      <mesh position={[x + 0.51, 0.55, z]}>
        <boxGeometry args={[0.02, 0.6, length - 0.4]} />
        <meshStandardMaterial color={BRAND.primary} />
      </mesh>
      <mesh position={[x, 1.12, z]} castShadow>
        <boxGeometry args={[1.1, 0.04, length + 0.1]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.25} />
      </mesh>
      {/* Machine à café */}
      <mesh position={[x - 0.15, 1.42, z - 1.4]} castShadow>
        <boxGeometry args={[0.55, 0.55, 0.7]} />
        <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Étagère murale */}
      <mesh position={[-HALF_W + 0.25, 2.2, z]} castShadow>
        <boxGeometry args={[0.4, 0.05, length]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      <Text font={FONT_BOLD} position={[-HALF_W + 0.08, 3.2, z]} rotation={[0, Math.PI / 2, 0]} fontSize={0.5} letterSpacing={0.1} color={BRAND.dark} anchorX="center" anchorY="middle">
        COFFEE · CAFÉ
      </Text>
      <LogoPlane variant="onLight" width={2.6} position={[-HALF_W + 0.08, 4.1, z]} rotation={[0, Math.PI / 2, 0]} />
      <Person
        spec={{ position: [-HALF_W + 1.2, 0, z + 0.8], rotY: Math.PI / 2, pose: 'stand', shirt: BRAND.primary, skin: '#c68863', pants: '#1f2937', hair: '#1c1917' }}
        logo
        phase={4.2}
      />
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.55, 0.6, length / 2 + 0.05]} position={[x, 0.6, z]} />
        <CylinderCollider args={[0.9, 0.3]} position={[-HALF_W + 1.2, 0.9, z + 0.8]} />
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
      <CoffeeBar />
      <RigidBody type="fixed" colliders={false}>
        {COCKTAIL_TABLES.map(([x, z]) => (
          <CylinderCollider key={`ct-${x}-${z}`} args={[0.55, 0.45]} position={[x, 0.55, z]} />
        ))}
      </RigidBody>
    </group>
  );
}

'use client';

import { Text } from '@react-three/drei';
import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier';
import { CONTENT } from '@/lib/content';
import { interactivePoint, STAND_SIZE, standCenterX, STANDS, type StandLayout } from '@/lib/layout';
import { FONT_BOLD, FONT_REGULAR, FONT_SEMI } from './Hall';
import { interactiveHandlers, Kiosk } from './Kiosk';
import { Person, type PersonSpec } from './people';

const W = STAND_SIZE.width; // le long du mur (axe z local)
const D = STAND_SIZE.depth; // profondeur (axe x local, +x = vers le centre du hall)
const BACK_X = -D / 2 + 0.15;

/** Plante décorative en pot. */
export function Plant({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.22, 0.6, 20]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.05, 0]} castShadow>
        <sphereGeometry args={[0.48, 16, 12]} />
        <meshStandardMaterial color="#6b9a72" roughness={0.9} />
      </mesh>
      <mesh position={[0.12, 1.45, 0.05]} castShadow>
        <sphereGeometry args={[0.32, 14, 10]} />
        <meshStandardMaterial color="#7fae84" roughness={0.9} />
      </mesh>
    </group>
  );
}

/** Mini graphique décoratif (barres) sur un panneau du stand. */
function ChartPanel({ accent, position, zs }: { accent: string; position: [number, number, number]; zs: number }) {
  const bars = [0.35, 0.55, 0.45, 0.75, 0.9, 1.1];
  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      <mesh>
        <planeGeometry args={[2.6, 1.8]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {bars.map((h, i) => (
        <mesh key={i} position={[zs * (-0.95 + i * 0.38), -0.7 + h / 2, 0.01]}>
          <planeGeometry args={[0.22, h]} />
          <meshStandardMaterial color={accent} transparent opacity={0.35 + i * 0.1} />
        </mesh>
      ))}
    </group>
  );
}

function Stand({ layout }: { layout: StandLayout }) {
  const content = CONTENT[layout.id];
  const accent = content.accent;
  const cx = standCenterX(layout.side);
  // Les stands de droite sont tournés de 180° : on miroite l'axe z local pour garder la borne côté entrée.
  const rotationY = layout.side === 'left' ? 0 : Math.PI;
  const zs = layout.side === 'left' ? 1 : -1;
  const kiosk = interactivePoint(layout.id);
  const handlers = interactiveHandlers(layout.id);

  const staff: PersonSpec[] = [
    { position: [-0.5, 0, zs * -2.1], rotY: Math.PI / 2, pose: 'stand', shirt: accent, skin: '#e0ac86', pants: '#1f2937', hair: '#1c1917' },
    { position: [-0.5, 0, zs * -0.3], rotY: Math.PI / 2, pose: 'stand', shirt: accent, skin: '#8d5a3b', pants: '#334155', hair: '#292524' },
    { position: [2.4, 0, zs * 2.2], rotY: Math.PI / 2 + zs * 0.5, pose: 'stand', shirt: accent, skin: '#f2d0b5', pants: '#1e3a5f', hair: '#a16207' },
  ];

  return (
    <group position={[cx, 0, layout.z]} rotation={[0, rotationY, 0]}>
      {/* Moquette du stand */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} receiveShadow>
        <planeGeometry args={[D, W]} />
        <meshStandardMaterial color="#eceff4" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[D / 2 - 0.1, 0.014, 0]}>
        <planeGeometry args={[0.2, W]} />
        <meshStandardMaterial color={accent} />
      </mesh>

      {/* Mur de fond cliquable avec signalétique */}
      <group {...handlers}>
        <mesh position={[BACK_X, 2.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.3, 5.2, W]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
        <mesh position={[BACK_X + 0.16, 4.75, 0]}>
          <boxGeometry args={[0.02, 0.9, W]} />
          <meshStandardMaterial color={accent} />
        </mesh>
        <group position={[BACK_X + 0.18, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <Text font={FONT_BOLD} position={[zs * (W / 2 - 0.7), 4.75, 0]} fontSize={0.55} color="#ffffff" anchorX={zs > 0 ? 'right' : 'left'} anchorY="middle">
            {content.number ?? ''}
          </Text>
          <Text font={FONT_SEMI} position={[zs * -(W / 2 - 0.6), 4.75, 0]} fontSize={0.28} letterSpacing={0.12} color="#ffffff" anchorX={zs > 0 ? 'left' : 'right'} anchorY="middle">
            VARIATIONAL
          </Text>
          <Text font={FONT_BOLD} position={[0, 3.75, 0]} fontSize={0.62} maxWidth={W - 1.5} textAlign="center" color="#111827" anchorX="center" anchorY="middle">
            {content.signTitle}
          </Text>
          <Text font={FONT_REGULAR} position={[0, 3.05, 0]} fontSize={0.26} maxWidth={W - 2} textAlign="center" color="#475569" anchorX="center" anchorY="middle">
            {content.tagline.en}
          </Text>
        </group>
        <ChartPanel accent={accent} position={[BACK_X + 0.17, 1.6, zs * 3]} zs={zs} />
        {/* Écran mural */}
        <group position={[BACK_X + 0.2, 1.75, zs * -3]}>
          <mesh>
            <boxGeometry args={[0.06, 1.6, 2.7]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
          <mesh position={[0.035, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[2.55, 1.45]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.35} />
          </mesh>
          <Text font={FONT_BOLD} position={[0.04, 0, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.22} maxWidth={2.3} textAlign="center" color="#ffffff" anchorX="center" anchorY="middle">
            {content.title.en}
          </Text>
        </group>
      </group>

      {/* Cloison latérale (côté opposé à la borne) */}
      <mesh position={[-D / 4, 1.5, zs * -(W / 2 - 0.1)]} castShadow receiveShadow>
        <boxGeometry args={[D / 2, 3, 0.2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-D / 4, 2.9, zs * -(W / 2 - 0.1)]}>
        <boxGeometry args={[D / 2 + 0.01, 0.2, 0.22]} />
        <meshStandardMaterial color={accent} />
      </mesh>

      {/* Comptoir d'accueil */}
      <group position={[0.6, 0, zs * -1.2]} {...handlers}>
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 1.1, 3.4]} />
          <meshStandardMaterial color="#ffffff" roughness={0.35} />
        </mesh>
        <mesh position={[0.46, 0.55, 0]}>
          <boxGeometry args={[0.02, 0.7, 3.0]} />
          <meshStandardMaterial color={accent} />
        </mesh>
        <Text font={FONT_BOLD} position={[0.48, 0.55, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={0.2} letterSpacing={0.1} color="#ffffff" anchorX="center" anchorY="middle">
          VARIATIONAL
        </Text>
        <mesh position={[0, 1.12, 0]} castShadow>
          <boxGeometry args={[1.0, 0.04, 3.5]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.3} />
        </mesh>
        {/* Brochures */}
        {[-0.8, -0.4, 0.8].map((z) => (
          <mesh key={z} position={[0.2, 1.16, z]} rotation={[-Math.PI / 2, 0, 0.2]}>
            <planeGeometry args={[0.22, 0.3]} />
            <meshStandardMaterial color={z > 0 ? '#ffffff' : accent} />
          </mesh>
        ))}
      </group>

      {/* Staff en t-shirt Variational (couleur du stand + logo) */}
      {staff.map((spec, i) => (
        <Person key={i} spec={spec} logo phase={i * 1.3 + layout.z} />
      ))}

      <Plant position={[-D / 2 + 0.7, 0, zs * (W / 2 - 0.7)]} />
      <Plant position={[D / 2 - 0.6, 0, zs * -(W / 2 - 0.6)]} scale={0.85} />

      {/* Borne interactive (coordonnées locales déduites de la position monde) */}
      <Kiosk
        id={layout.id}
        accent={accent}
        label={content.signTitle}
        position={[(kiosk.x - cx) * (layout.side === 'left' ? 1 : -1), 0, (kiosk.z - layout.z) * zs]}
        rotationY={Math.PI / 2}
      />

      {/* Collisions du stand */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.15, 2.6, W / 2]} position={[BACK_X, 2.6, 0]} />
        <CuboidCollider args={[D / 4, 1.5, 0.1]} position={[-D / 4, 1.5, zs * -(W / 2 - 0.1)]} />
        <CuboidCollider args={[0.5, 0.6, 1.75]} position={[0.6, 0.6, zs * -1.2]} />
        {staff.map((s, i) => (
          <CylinderCollider key={i} args={[0.9, 0.3]} position={[s.position[0], 0.9, s.position[2]]} />
        ))}
        <CylinderCollider args={[0.6, 0.35]} position={[-D / 2 + 0.7, 0.6, zs * (W / 2 - 0.7)]} />
        <CylinderCollider args={[0.6, 0.3]} position={[D / 2 - 0.6, 0.6, zs * -(W / 2 - 0.6)]} />
      </RigidBody>
    </group>
  );
}

export function Stands() {
  return (
    <group>
      {STANDS.map((s) => (
        <Stand key={s.id} layout={s} />
      ))}
    </group>
  );
}

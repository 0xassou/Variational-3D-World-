'use client';

import { Html, Text } from '@react-three/drei';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { CONTENT, VIDEOS, youtubeEmbedUrl } from '@/lib/content';
import { BRAND, interactivePoint, STAGE } from '@/lib/layout';
import { useWorld } from '@/lib/store';
import { FONT_BOLD, FONT_SEMI } from './Hall';
import { Kiosk } from './Kiosk';

/** Résolution CSS de l'iframe ; convertie en unités 3D via `distanceFactor`. */
const SCREEN_PX_W = 1280;
const SCREEN_PX_H = 720;
// En mode `transform`, drei applique 1 px CSS = distanceFactor / 400 unités.
const SCREEN_DISTANCE_FACTOR = (STAGE.screenWidth * 400) / SCREEN_PX_W;

const TOP = STAGE.height;
const FRONT_Z = STAGE.z + STAGE.depth / 2;
const BACK_Z = STAGE.z - STAGE.depth / 2;

function StageScreen() {
  const videoId = useWorld((s) => s.stageVideoId);
  const clip = VIDEOS[videoId];
  const z = BACK_Z + 0.45;

  return (
    <group position={[0, STAGE.screenY, z]}>
      {/* Cadre de l'écran */}
      <mesh position={[0, 0, -0.12]} castShadow>
        <boxGeometry args={[STAGE.screenWidth + 0.5, STAGE.screenHeight + 0.5, 0.18]} />
        <meshStandardMaterial color="#111827" roughness={0.4} metalness={0.3} />
      </mesh>
      {clip && (
        <Html
          transform
          occlude="blending"
          distanceFactor={SCREEN_DISTANCE_FACTOR}
          zIndexRange={[20, 0]}
          position={[0, 0, 0.01]}
          style={{ width: SCREEN_PX_W, height: SCREEN_PX_H, background: '#000' }}
        >
          <iframe
            key={clip.id}
            title={clip.title.en}
            width={SCREEN_PX_W}
            height={SCREEN_PX_H}
            src={youtubeEmbedUrl(clip, { autoplay: true, mute: true })}
            allow="autoplay; encrypted-media; picture-in-picture"
            style={{ border: 0, display: 'block' }}
          />
        </Html>
      )}
      <Text
        font={FONT_SEMI}
        position={[0, -STAGE.screenHeight / 2 - 0.65, -0.02]}
        fontSize={0.42}
        color="#475569"
        anchorX="center"
        anchorY="middle"
      >
        {clip ? `${clip.show} · ${clip.title.en}` : ''}
      </Text>
    </group>
  );
}

function LoungeChair({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.5, 0.85]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.75, -0.36]} castShadow>
        <boxGeometry args={[0.9, 0.6, 0.14]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.8} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.48, 0.45, 0]} castShadow>
          <boxGeometry args={[0.1, 0.32, 0.85]} />
          <meshStandardMaterial color="#d1d5db" />
        </mesh>
      ))}
    </group>
  );
}

function MicStand({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.03, 20]} />
        <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 1.3, 8]} />
        <meshStandardMaterial color="#4b5563" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.32, 0.06]} rotation={[0.5, 0, 0]} castShadow>
        <capsuleGeometry args={[0.03, 0.12, 4, 8]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
    </group>
  );
}

function Lectern({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, -0.25, 0]}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 1.1, 0.6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.13, 0.05]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[1, 0.06, 0.7]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      <mesh position={[0, 0.65, 0.302]}>
        <planeGeometry args={[0.7, 0.32]} />
        <meshStandardMaterial color={BRAND.primary} />
      </mesh>
      <Text font={FONT_BOLD} position={[0, 0.65, 0.31]} fontSize={0.09} color="#ffffff" anchorX="center" anchorY="middle">
        VARIATIONAL
      </Text>
      <mesh position={[0.2, 1.35, 0.15]} rotation={[0.6, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.4, 6]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
    </group>
  );
}

export function Stage() {
  const kiosk = interactivePoint('stage');

  return (
    <group>
      {/* Estrade */}
      <mesh position={[STAGE.x, TOP / 2, STAGE.z]} castShadow receiveShadow>
        <boxGeometry args={[STAGE.width, TOP, STAGE.depth]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      {/* Liseré lumineux en façade */}
      <mesh position={[STAGE.x, TOP - 0.12, FRONT_Z + 0.01]}>
        <planeGeometry args={[STAGE.width, 0.06]} />
        <meshBasicMaterial color={BRAND.primary} toneMapped={false} />
      </mesh>
      {/* Marches latérales (décor) */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * (STAGE.width / 2 + 0.9), 0, FRONT_Z - 2]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[-s * i * 0.4, (i + 1) * 0.2, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.8 - i * 0.4 + 0.4, (i + 1) * 0.4, 2]} />
              <meshStandardMaterial color="#f3f4f6" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Mur de fond de scène */}
      <mesh position={[0, 7, BACK_Z + 0.15]} receiveShadow>
        <boxGeometry args={[STAGE.width + 6, 14, 0.3]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={`fin-${s}`} position={[s * (STAGE.screenWidth / 2 + 2.4), 6.5, BACK_Z + 0.4]} castShadow>
          <boxGeometry args={[0.5, 11, 0.4]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
      ))}
      <Text
        font={FONT_BOLD}
        position={[0, STAGE.screenY + STAGE.screenHeight / 2 + 0.95, BACK_Z + 0.32]}
        fontSize={0.95}
        letterSpacing={0.1}
        color={BRAND.dark}
        anchorX="center"
        anchorY="middle"
      >
        VARIATIONAL
      </Text>

      <StageScreen />

      {/* Plateau : fauteuils, tables basses, micros, pupitre */}
      <LoungeChair position={[-4.5, TOP, STAGE.z - 1]} rotationY={0.25} />
      <LoungeChair position={[-1.5, TOP, STAGE.z - 1.4]} rotationY={0.08} />
      <LoungeChair position={[1.5, TOP, STAGE.z - 1.4]} rotationY={-0.08} />
      <LoungeChair position={[4.5, TOP, STAGE.z - 1]} rotationY={-0.25} />
      {[-3, 3].map((x) => (
        <mesh key={`table-${x}`} position={[x, TOP + 0.25, STAGE.z - 0.8]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.5, 24]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      ))}
      {[-4.5, -1.5, 1.5, 4.5].map((x) => (
        <MicStand key={`mic-${x}`} position={[x, TOP, STAGE.z + 0.2]} />
      ))}
      <Lectern position={[9, TOP, STAGE.z + 2.5]} />

      {/* Borne « programme » de la scène */}
      <Kiosk
        id="stage"
        accent={CONTENT.stage.accent}
        label="Main Stage · Videos"
        position={[kiosk.x, 0, kiosk.z]}
        rotationY={-0.4}
      />

      {/* Collisions de la scène */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[STAGE.width / 2, TOP / 2 + 1, STAGE.depth / 2]} position={[STAGE.x, TOP / 2 + 1, STAGE.z]} />
        {[-1, 1].map((s) => (
          <CuboidCollider
            key={s}
            args={[1.1, 1, 1]}
            position={[s * (STAGE.width / 2 + 0.9), 1, FRONT_Z - 2]}
          />
        ))}
        <CuboidCollider args={[STAGE.width / 2 + 3, 7, 0.3]} position={[0, 7, BACK_Z + 0.15]} />
      </RigidBody>
    </group>
  );
}

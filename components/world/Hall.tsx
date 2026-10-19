'use client';

import { useMemo } from 'react';
import { MeshReflectorMaterial, Text } from '@react-three/drei';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';
import { BRAND, HALF_D, HALF_W, HALL } from '@/lib/layout';
import { LogoPlane } from './Logo';

export const FONT_BOLD = '/fonts/inter-latin-800-normal.woff';
export const FONT_SEMI = '/fonts/inter-latin-700-normal.woff';
export const FONT_REGULAR = '/fonts/inter-latin-400-normal.woff';

const WALL_COLOR = '#f3f4f6';
const TRIM_COLOR = '#e2e5ea';

/** Texture de carrelage clair (joints fins) générée sur canvas. */
function useTileTexture() {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f7f8fa';
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = '#dfe3e8';
      ctx.lineWidth = 3;
      ctx.strokeRect(0, 0, size, size);
    }
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    // Une dalle = 2 m.
    texture.repeat.set(HALL.width / 2, HALL.depth / 2);
    texture.anisotropy = 8;
    return texture;
  }, []);
}

function Floor() {
  const tiles = useTileTexture();
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[HALL.width, HALL.depth]} />
      <MeshReflectorMaterial
        map={tiles}
        color="#ffffff"
        roughness={0.35}
        metalness={0.05}
        blur={[400, 120]}
        resolution={512}
        mixBlur={1}
        mixStrength={0.9}
        mixContrast={1}
        mirror={0.35}
        depthScale={0.6}
        minDepthThreshold={0.6}
        maxDepthThreshold={1.3}
      />
    </mesh>
  );
}

function Walls() {
  const h = HALL.height;
  const t = HALL.wallThickness;
  return (
    <group>
      {/* Murs (visuels) */}
      <mesh position={[0, h / 2, -HALF_D - t / 2]} receiveShadow>
        <boxGeometry args={[HALL.width + 2 * t, h, t]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>
      <mesh position={[0, h / 2, HALF_D + t / 2]} receiveShadow>
        <boxGeometry args={[HALL.width + 2 * t, h, t]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>
      <mesh position={[-HALF_W - t / 2, h / 2, 0]} receiveShadow>
        <boxGeometry args={[t, h, HALL.depth]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>
      <mesh position={[HALF_W + t / 2, h / 2, 0]} receiveShadow>
        <boxGeometry args={[t, h, HALL.depth]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>

      {/* Plinthes */}
      {[-1, 1].map((s) => (
        <mesh key={`plinth-x${s}`} position={[s * (HALF_W - 0.04), 0.12, 0]}>
          <boxGeometry args={[0.08, 0.24, HALL.depth]} />
          <meshStandardMaterial color={TRIM_COLOR} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={`plinth-z${s}`} position={[0, 0.12, s * (HALF_D - 0.04)]}>
          <boxGeometry args={[HALL.width, 0.24, 0.08]} />
          <meshStandardMaterial color={TRIM_COLOR} />
        </mesh>
      ))}

      {/* Bandeau haut gris clair sur les murs latéraux */}
      {[-1, 1].map((s) => (
        <mesh key={`band-${s}`} position={[s * (HALF_W - 0.05), h - 1.6, 0]}>
          <boxGeometry args={[0.1, 0.5, HALL.depth]} />
          <meshStandardMaterial color="#e5e7eb" />
        </mesh>
      ))}

      {/* Pilastres réguliers */}
      {[-30, -18, 26, 36].map((z) =>
        [-1, 1].map((s) => (
          <mesh key={`pilaster-${z}-${s}`} position={[s * (HALF_W - 0.35), h / 2, z]} castShadow receiveShadow>
            <boxGeometry args={[0.7, h, 1.2]} />
            <meshStandardMaterial color="#fafafa" roughness={0.85} />
          </mesh>
        )),
      )}

      {/* Grandes baies vitrées hautes (lumière naturelle) */}
      {[-24, -12, 0, 12, 24].map((x) => (
        <mesh key={`window-${x}`} position={[x, h - 3.6, HALF_D - 0.02]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[8, 3]} />
          <meshStandardMaterial color="#e8f1fb" emissive="#e8f1fb" emissiveIntensity={0.6} />
        </mesh>
      ))}

      {/* Signalétique murale */}
      {[-1, 1].map((s) => (
        <LogoPlane
          key={`summit-${s}`}
          variant="onLight"
          width={11}
          position={[s * (HALF_W - 0.12), h - 3.3, 5]}
          rotation={[0, -s * (Math.PI / 2), 0]}
        />
      ))}
      {[-1, 1].map((s) => (
        <Text
          key={`sub-${s}`}
          font={FONT_SEMI}
          position={[s * (HALF_W - 0.12), h - 4.9, 5]}
          rotation={[0, -s * (Math.PI / 2), 0]}
          fontSize={0.55}
          letterSpacing={0.12}
          color={BRAND.primary}
          anchorX="center"
          anchorY="middle"
        >
          SUMMIT · OMNI · PRO · BUILT ON ARBITRUM
        </Text>
      ))}

      {/* Entrée (mur du fond, derrière le point d'apparition) */}
      <group position={[6, 0, HALF_D - 0.06]}>
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[4.2, 3.2, 0.1]} />
          <meshStandardMaterial color="#d1d5db" />
        </mesh>
        <mesh position={[0, 1.55, -0.06]}>
          <boxGeometry args={[3.8, 3.0, 0.04]} />
          <meshStandardMaterial color="#eaf2fb" roughness={0.1} metalness={0.2} />
        </mesh>
        {/* Portique d'entrée aux couleurs de la marque */}
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 2.5, 1.85, -0.2]} castShadow>
            <boxGeometry args={[0.3, 3.7, 0.3]} />
            <meshStandardMaterial color={BRAND.dark} roughness={0.6} />
          </mesh>
        ))}
        <mesh position={[0, 4.05, -0.2]} castShadow>
          <boxGeometry args={[5.3, 0.95, 0.3]} />
          <meshStandardMaterial color={BRAND.dark} roughness={0.6} />
        </mesh>
        <LogoPlane variant="onDark" width={3.6} position={[0, 4.1, -0.36]} rotation={[0, Math.PI, 0]} />
        <Text
          font={FONT_SEMI}
          position={[0, 3.3, -0.1]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.26}
          letterSpacing={0.1}
          color="#475569"
          anchorX="center"
          anchorY="middle"
        >
          ENTRANCE · ENTRÉE
        </Text>
        <LogoPlane variant="onLight" width={8} position={[0, 7.2, -0.02]} rotation={[0, Math.PI, 0]} />
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.15, 1.85, 0.15]} position={[-2.5, 1.85, -0.2]} />
          <CuboidCollider args={[0.15, 1.85, 0.15]} position={[2.5, 1.85, -0.2]} />
        </RigidBody>
      </group>
    </group>
  );
}

function Ceiling() {
  const panels = useMemo(() => {
    const out: [number, number][] = [];
    for (let x = -24; x <= 24; x += 12) {
      for (let z = -34; z <= 34; z += 10) out.push([x, z]);
    }
    return out;
  }, []);

  return (
    <group>
      <mesh position={[0, HALL.height, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[HALL.width, HALL.depth]} />
        <meshStandardMaterial color="#fbfbfc" roughness={1} />
      </mesh>
      {panels.map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, HALL.height - 0.02, z]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 2.2]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Collisions des limites du hall (sol + 4 murs). */
function HallColliders() {
  const h = HALL.height;
  const t = HALL.wallThickness;
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[HALF_W + 2, 0.5, HALF_D + 2]} position={[0, -0.5, 0]} />
      <CuboidCollider args={[HALF_W + t, h / 2, t / 2]} position={[0, h / 2, -HALF_D - t / 2]} />
      <CuboidCollider args={[HALF_W + t, h / 2, t / 2]} position={[0, h / 2, HALF_D + t / 2]} />
      <CuboidCollider args={[t / 2, h / 2, HALF_D + t]} position={[-HALF_W - t / 2, h / 2, 0]} />
      <CuboidCollider args={[t / 2, h / 2, HALF_D + t]} position={[HALF_W + t / 2, h / 2, 0]} />
      {/* Pilastres */}
      {[-30, -18, 26, 36].map((z) =>
        [-1, 1].map((s) => (
          <CuboidCollider key={`pc-${z}-${s}`} args={[0.35, h / 2, 0.6]} position={[s * (HALF_W - 0.35), h / 2, z]} />
        )),
      )}
    </RigidBody>
  );
}

export function Hall() {
  return (
    <group>
      <Floor />
      <Walls />
      <Ceiling />
      <HallColliders />
    </group>
  );
}

'use client';

import { useMemo } from 'react';
import { DoubleSide } from 'three';
import { getLogoTexture, type LogoVariant } from './brandTextures';

interface LogoPlaneProps {
  variant?: LogoVariant;
  /** Largeur en mètres ; la hauteur suit le ratio du logo. */
  width: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  doubleSide?: boolean;
}

/** Logo officiel Variational posé sur un plan (texture canvas, couleurs de marque non tone-mappées). */
export function LogoPlane({ variant = 'onLight', width, position, rotation, doubleSide = false }: LogoPlaneProps) {
  const map = useMemo(() => getLogoTexture(variant), [variant]);
  const image = map.image as HTMLCanvasElement;
  const height = (width * image.height) / image.width;
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={map}
        transparent
        toneMapped={false}
        depthWrite={false}
        side={doubleSide ? DoubleSide : undefined}
        polygonOffset
        polygonOffsetFactor={-2}
      />
    </mesh>
  );
}

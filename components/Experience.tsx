'use client';

import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { HALL } from '@/lib/layout';
import { useWorld } from '@/lib/store';
import { Player } from './player/Player';
import { Amenities } from './world/Amenities';
import { CeilingDecor } from './world/CeilingDecor';
import { ClickFlash } from './world/ClickFlash';
import { Crowd } from './world/Crowd';
import { FloorDecor } from './world/FloorDecor';
import { Hall } from './world/Hall';
import { Interaction } from './world/Interaction';
import { MetricsStand } from './world/MetricsStand';
import { Stage } from './world/Stage';
import { Stands } from './world/Stands';

const BACKGROUND = '#c9d1da';

/** Éclairage corporate : lumière douce et diffuse, une directionnelle principale avec ombres douces. */
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.36} />
      <hemisphereLight args={['#f4f7fb', '#a9b4c1', 0.75]} />
      <directionalLight
        position={[18, 32, 14]}
        intensity={1.3}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
        shadow-radius={6}
        shadow-camera-left={-HALL.width / 2 - 6}
        shadow-camera-right={HALL.width / 2 + 6}
        shadow-camera-top={HALL.depth / 2 + 6}
        shadow-camera-bottom={-HALL.depth / 2 - 6}
        shadow-camera-near={1}
        shadow-camera-far={90}
      />
      <directionalLight position={[-20, 18, -10]} intensity={0.35} />
      {/* Environnement local (aucun HDR téléchargé) pour des reflets propres */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={1.3} position={[0, 10, 0]} rotation-x={Math.PI / 2} scale={[40, 40, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[0, 5, -30]} scale={[30, 8, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[0, 5, 30]} rotation-y={Math.PI} scale={[30, 8, 1]} />
        <Lightformer form="rect" intensity={0.8} position={[-30, 5, 0]} rotation-y={Math.PI / 2} scale={[40, 6, 1]} />
        <Lightformer form="rect" intensity={0.8} position={[30, 5, 0]} rotation-y={-Math.PI / 2} scale={[40, 6, 1]} />
      </Environment>
    </>
  );
}

/** Signale au HUD que les ressources suspendues (police, WASM Rapier) sont prêtes. */
function Ready() {
  const setLoaded = useWorld((s) => s.setLoaded);
  useEffect(() => {
    setLoaded(true);
  }, [setLoaded]);
  return null;
}

export default function Experience() {
  // Pause du rendu 3D pendant la lecture d'un pop-up : l'UI reste fluide, la scène est floutée derrière.
  const paused = useWorld((s) => s.activeId !== null);

  return (
    <div data-world className="absolute inset-0 isolate">
      <Canvas
        shadows="soft"
        frameloop={paused ? 'demand' : 'always'}
        dpr={[1, 1.75]}
        camera={{ fov: 55, near: 0.1, far: 220, position: [0, 6, 42] }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(BACKGROUND, 1);
        }}
      >
        <color attach="background" args={[BACKGROUND]} />
        <fog attach="fog" args={[BACKGROUND, 70, 160]} />
        <Lighting />
        <Suspense fallback={null}>
          <Physics gravity={[0, -20, 0]}>
            <Hall />
            <FloorDecor />
            <Stage />
            <Stands />
            <MetricsStand />
            <CeilingDecor />
            <Amenities />
            <Crowd />
            <Player />
          </Physics>
          <Interaction />
          <ClickFlash />
          <Ready />
        </Suspense>
      </Canvas>
    </div>
  );
}

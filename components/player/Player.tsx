'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CapsuleCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier';
import { Group, MathUtils, Vector3 } from 'three';
import { HALF_D, HALF_W, HALL, SPAWN } from '@/lib/layout';
import { playerState, useWorld } from '@/lib/store';
import { Avatar, type AvatarMotion } from './Avatar';
import { useMoveKeys } from './useKeyboard';
import { useTouchJoystick } from './useTouchJoystick';

const WALK_SPEED = 4.2;
const RUN_SPEED = 7.5;
const ACCELERATION = 12;
const TURN_SPEED = 12;

const CAPSULE_HALF_HEIGHT = 0.55;
const CAPSULE_RADIUS = 0.35;
/** Distance du centre de la capsule au sol. */
const FEET_OFFSET = CAPSULE_HALF_HEIGHT + CAPSULE_RADIUS;

const PITCH_MIN = 0.08;
const PITCH_MAX = 1.25;
const DIST_MIN = 3;
const DIST_MAX = 14;

const forward = new Vector3();
const right = new Vector3();
const move = new Vector3();
const target = new Vector3();
const desiredCam = new Vector3();

/**
 * Orbite caméra pilotée au clic-glisser + molette (pas de pointer lock, l'UI reste cliquable).
 * Au tactile, le premier doigt est réservé au joystick : seul un second doigt tourne la caméra.
 */
function useOrbitInput(joystickPointer: { current: number | null }) {
  const orbit = useRef({ yaw: 0, pitch: 0.38, distance: 7.5 });

  useEffect(() => {
    let dragging = false;
    let dragPointer = -1;
    let lastX = 0;
    let lastY = 0;

    const inWorld = (e: Event) => !!(e.target as HTMLElement | null)?.closest?.('[data-world]');

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || !inWorld(e) || useWorld.getState().activeId) return;
      if (e.pointerType === 'touch' && (joystickPointer.current === null || joystickPointer.current === e.pointerId)) return;
      dragging = true;
      dragPointer = e.pointerId;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== dragPointer) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      orbit.current.yaw -= dx * 0.005;
      orbit.current.pitch = MathUtils.clamp(orbit.current.pitch + dy * 0.004, PITCH_MIN, PITCH_MAX);
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId === dragPointer) dragging = false;
    };
    const onWheel = (e: WheelEvent) => {
      if (!inWorld(e) || useWorld.getState().activeId) return;
      orbit.current.distance = MathUtils.clamp(orbit.current.distance + e.deltaY * 0.01, DIST_MIN, DIST_MAX);
    };

    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('wheel', onWheel);
    };
  }, [joystickPointer]);

  return orbit;
}

export function Player() {
  const body = useRef<RapierRigidBody>(null);
  const avatar = useRef<Group>(null);
  const motion = useRef<AvatarMotion>({ speed: 0 });
  const keys = useMoveKeys();
  const touch = useTouchJoystick();
  const orbit = useOrbitInput(touch.pointerId);
  const camera = useThree((s) => s.camera);

  // Caméra initiale derrière le joueur.
  useEffect(() => {
    camera.position.set(SPAWN[0], SPAWN[1] + 4, SPAWN[2] + 7);
    camera.lookAt(SPAWN[0], SPAWN[1] + 1, SPAWN[2] - 5);
  }, [camera]);

  useFrame((_, rawDt) => {
    const rb = body.current;
    if (!rb) return;
    const dt = Math.min(rawDt, 0.05);
    const { activeId, started } = useWorld.getState();
    const canMove = started && !activeId;
    const k = keys.current;
    const { yaw, pitch, distance } = orbit.current;

    // Directions relatives à la caméra (plan horizontal).
    forward.set(-Math.sin(yaw), 0, -Math.cos(yaw));
    right.set(Math.cos(yaw), 0, -Math.sin(yaw));
    move.set(0, 0, 0);
    if (canMove) {
      if (k.forward) move.add(forward);
      if (k.backward) move.sub(forward);
      if (k.right) move.add(right);
      if (k.left) move.sub(right);
    }
    let speed = k.run ? RUN_SPEED : WALK_SPEED;
    const stick = touch.stick.current;
    if (canMove && stick.active && move.lengthSq() === 0) {
      // Joystick tactile : vitesse proportionnelle à l'amplitude, course en glissant loin.
      move.addScaledVector(forward, stick.y).addScaledVector(right, stick.x);
      speed = stick.strength > 1.5 ? RUN_SPEED : WALK_SPEED * Math.min(1, Math.max(0.35, stick.strength));
    }
    if (move.lengthSq() > 0) move.normalize().multiplyScalar(speed);

    // Accélération lissée, vitesse verticale conservée (gravité gérée par Rapier).
    const vel = rb.linvel();
    const blend = 1 - Math.exp(-ACCELERATION * dt);
    const vx = MathUtils.lerp(vel.x, move.x, blend);
    const vz = MathUtils.lerp(vel.z, move.z, blend);
    rb.setLinvel({ x: vx, y: vel.y, z: vz }, true);

    const pos = rb.translation();

    // Sécurité : retour au point d'apparition en cas de chute hors du monde.
    if (pos.y < -5) {
      rb.setTranslation({ x: SPAWN[0], y: SPAWN[1], z: SPAWN[2] }, true);
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    playerState.position.set(pos.x, pos.y - FEET_OFFSET, pos.z);

    // Orientation de l'avatar dans le sens du déplacement.
    const horizontal = Math.hypot(vx, vz);
    motion.current.speed = horizontal / WALK_SPEED;
    if (avatar.current && horizontal > 0.3) {
      const targetAngle = Math.atan2(vx, vz);
      let delta = targetAngle - avatar.current.rotation.y;
      delta = Math.atan2(Math.sin(delta), Math.cos(delta));
      avatar.current.rotation.y += delta * Math.min(1, TURN_SPEED * dt);
    }

    // Caméra 3e personne lissée, maintenue à l'intérieur du hall.
    target.set(pos.x, pos.y + 0.75, pos.z);
    desiredCam.set(
      target.x + Math.sin(yaw) * Math.cos(pitch) * distance,
      target.y + Math.sin(pitch) * distance,
      target.z + Math.cos(yaw) * Math.cos(pitch) * distance,
    );
    desiredCam.x = MathUtils.clamp(desiredCam.x, -HALF_W + 0.6, HALF_W - 0.6);
    desiredCam.z = MathUtils.clamp(desiredCam.z, -HALF_D + 0.6, HALF_D - 0.6);
    desiredCam.y = MathUtils.clamp(desiredCam.y, 0.8, HALL.height - 0.6);
    camera.position.lerp(desiredCam, 1 - Math.exp(-10 * dt));
    camera.lookAt(target);
  });

  return (
    <RigidBody
      ref={body}
      colliders={false}
      position={SPAWN}
      enabledRotations={[false, false, false]}
      linearDamping={0.5}
      ccd
      canSleep={false}
      name="player"
    >
      <CapsuleCollider args={[CAPSULE_HALF_HEIGHT, CAPSULE_RADIUS]} friction={0} restitution={0} />
      <group ref={avatar} position={[0, -FEET_OFFSET, 0]} rotation={[0, Math.PI, 0]}>
        <Avatar motion={motion} />
      </group>
    </RigidBody>
  );
}

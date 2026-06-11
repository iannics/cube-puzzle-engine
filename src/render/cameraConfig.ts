import * as THREE from 'three'
import type { Face } from '../domain/types'

export const DEFAULT_CAMERA_FOV = 38
export const DEFAULT_CAMERA_TARGET = new THREE.Vector3(0, 0, 0)

export const ORBIT_MIN_DISTANCE = 4.0
export const ORBIT_MAX_DISTANCE = 10.0
export const ORBIT_MIN_POLAR_ANGLE = 0.08
export const ORBIT_MAX_POLAR_ANGLE = Math.PI - 0.08
export const ORBIT_DAMPING_FACTOR = 0.08

export const CAMERA_RESET_DURATION_MS = 400

function scaleToOrbitDistance(position: [number, number, number]): [number, number, number] {
  const length = Math.hypot(position[0], position[1], position[2])
  if (length === 0) return position
  const scale = ORBIT_MAX_DISTANCE / length
  return [position[0] * scale, position[1] * scale, position[2] * scale]
}

const DEFAULT_VIEW_DIRECTION: [number, number, number] = [5.2, 4.2, 5.2]

export const DEFAULT_CAMERA_POSITION = scaleToOrbitDistance(DEFAULT_VIEW_DIRECTION)

const VIEW_DISTANCE = 7.5

export const FACE_VIEW_POSITIONS: Record<Face, [number, number, number]> = {
  U: [0, VIEW_DISTANCE, 0.01],
  D: [0, -VIEW_DISTANCE, 0.01],
  F: [0, 0, VIEW_DISTANCE],
  B: [0, 0, -VIEW_DISTANCE],
  R: [VIEW_DISTANCE, 0, 0],
  L: [-VIEW_DISTANCE, 0, 0],
}

const FACE_UP_VECTORS: Record<Face, [number, number, number]> = {
  U: [0, 0, -1],
  D: [0, 0, 1],
  F: [0, 1, 0],
  B: [0, 1, 0],
  R: [0, 1, 0],
  L: [0, 1, 0],
}

const RESET_ANGLES: Record<Face, [number, number, number]> = {
  U: scaleToOrbitDistance([5.2, 4.2, 5.2]),
  D: scaleToOrbitDistance([5.2, -4.2, 5.2]),
  F: scaleToOrbitDistance([5.2, 4.2, 5.2]),
  B: scaleToOrbitDistance([-5.2, 4.2, -5.2]),
  R: scaleToOrbitDistance([5.2, 4.2, 5.2]),
  L: scaleToOrbitDistance([-5.2, 4.2, 5.2]),
}

export interface CameraPose {
  position: [number, number, number]
  up: [number, number, number]
}

export function getCameraPoseForFace(face: Face): CameraPose {
  return {
    position: FACE_VIEW_POSITIONS[face],
    up: FACE_UP_VECTORS[face],
  }
}

export function getResetCameraPose(upFace: Face): CameraPose {
  return {
    position: RESET_ANGLES[upFace],
    up: [0, 1, 0],
  }
}

export function applyCameraUp(camera: THREE.Camera, up: [number, number, number]): void {
  camera.up.set(up[0], up[1], up[2])
}

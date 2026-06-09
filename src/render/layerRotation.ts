import * as THREE from 'three'
import type { Face, Move } from '../domain'

const FACE_NORMALS: Record<Face, THREE.Vector3> = {
  R: new THREE.Vector3(1, 0, 0),
  L: new THREE.Vector3(-1, 0, 0),
  U: new THREE.Vector3(0, 1, 0),
  D: new THREE.Vector3(0, -1, 0),
  F: new THREE.Vector3(0, 0, 1),
  B: new THREE.Vector3(0, 0, -1),
}

// Clockwise face turn sign when viewed from outside the face (matches domain notation).
export const FACE_CW_SIGN: Record<Face, number> = {
  R: -1,
  L: 1,
  U: -1,
  D: 1,
  F: -1,
  B: 1,
}

const DRAG_SENSITIVITY = 0.02

export function getFaceNormal(face: Face): THREE.Vector3 {
  return FACE_NORMALS[face].clone()
}

export function getRotationAxis(face: Face): THREE.Vector3 {
  return FACE_NORMALS[face].clone()
}

export function getMoveAngle(move: Move, progress: number): number {
  const sign = FACE_CW_SIGN[move.face]
  const quarterTurns = move.turn === 2 ? 2 : move.turn === 3 ? -1 : 1
  return sign * quarterTurns * progress * (Math.PI / 2)
}

export function getAnimatedLayerAngle(
  move: Move,
  progress: number,
  mode: 'idle' | 'playing' | 'dragging',
): number {
  if (mode === 'dragging') {
    return FACE_CW_SIGN[move.face] * progress * (Math.PI / 2)
  }

  return getMoveAngle(move, progress)
}

export function getDragTurn(progress: number): 1 | 3 {
  return progress >= 0 ? 1 : 3
}

function projectOntoPlane(vector: THREE.Vector3, normal: THREE.Vector3): THREE.Vector3 {
  const n = normal.clone().normalize()
  return vector.clone().sub(n.multiplyScalar(vector.dot(n)))
}

function screenDeltaToWorld(
  deltaX: number,
  deltaY: number,
  camera: THREE.Camera,
  faceNormal: THREE.Vector3,
): THREE.Vector3 {
  const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
  const cameraUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion)
  const screenDelta = new THREE.Vector3()
    .addScaledVector(cameraRight, deltaX)
    .addScaledVector(cameraUp, -deltaY)

  return projectOntoPlane(screenDelta, faceNormal)
}

export function dragProgressFromScreenDelta(
  face: Face,
  deltaX: number,
  deltaY: number,
  camera: THREE.Camera,
  faceWorldNormal: THREE.Vector3,
  anchorPoint: THREE.Vector3,
): number {
  const axis = getRotationAxis(face).normalize()
  const sign = FACE_CW_SIGN[face]
  const dragOnPlane = screenDeltaToWorld(deltaX, deltaY, camera, faceWorldNormal)

  const torque = new THREE.Vector3().crossVectors(anchorPoint, dragOnPlane)
  const omega = axis.dot(torque) / Math.max(anchorPoint.lengthSq(), 1e-6)

  return omega * sign * DRAG_SENSITIVITY
}

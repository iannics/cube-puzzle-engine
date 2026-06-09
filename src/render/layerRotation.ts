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

export function getDragTurn(progress: number): 1 | 3 {
  return progress >= 0 ? 1 : 3
}

export function dragProgressFromScreenDelta(
  face: Face,
  deltaX: number,
  deltaY: number,
  camera: THREE.Camera,
  faceWorldNormal: THREE.Vector3,
): number {
  const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
  const cameraUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion)

  const tangent = new THREE.Vector3()
    .addScaledVector(cameraRight, deltaX)
    .addScaledVector(cameraUp, -deltaY)

  const axis = getRotationAxis(face)
  const torque = new THREE.Vector3().crossVectors(faceWorldNormal, tangent)
  const sign = FACE_CW_SIGN[face]
  const magnitude = torque.dot(axis) * sign

  return magnitude / 80
}

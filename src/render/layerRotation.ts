import * as THREE from 'three'
import type { Face, Move, Slice } from '../domain'

const FACE_NORMALS: Record<Face, THREE.Vector3> = {
  R: new THREE.Vector3(1, 0, 0),
  L: new THREE.Vector3(-1, 0, 0),
  U: new THREE.Vector3(0, 1, 0),
  D: new THREE.Vector3(0, -1, 0),
  F: new THREE.Vector3(0, 0, 1),
  B: new THREE.Vector3(0, 0, -1),
}

// Clockwise turn sign when viewed from outside the face (matches domain notation).
export const FACE_CW_SIGN: Record<Face, number> = {
  R: -1,
  L: 1,
  U: -1,
  D: 1,
  F: -1,
  B: 1,
}

const SLICE_CW_SIGN: Record<Slice, number> = {
  M: FACE_CW_SIGN.L,
  E: FACE_CW_SIGN.D,
  S: FACE_CW_SIGN.F,
}

const SLICE_DRAG_FACE: Record<Slice, Face> = {
  M: 'L',
  E: 'D',
  S: 'F',
}

const DRAG_SENSITIVITY = 0.02

export function getFaceNormal(face: Face): THREE.Vector3 {
  return FACE_NORMALS[face].clone()
}

export function getDragReferenceFace(move: Move): Face {
  return move.kind === 'face' ? move.face : SLICE_DRAG_FACE[move.slice]
}

function getMoveCwSign(move: Move): number {
  return move.kind === 'face' ? FACE_CW_SIGN[move.face] : SLICE_CW_SIGN[move.slice]
}

export function getRotationAxis(move: Move): THREE.Vector3 {
  return getFaceNormal(getDragReferenceFace(move))
}

function isMirrorFace(face: Face): boolean {
  const axis = FACE_NORMALS[face]
  return axis.x < 0 || axis.y < 0 || axis.z < 0
}

function getCanonicalAxis(move: Move): THREE.Vector3 {
  const face = getDragReferenceFace(move)
  const axis = FACE_NORMALS[face]
  return new THREE.Vector3(Math.abs(axis.x), Math.abs(axis.y), Math.abs(axis.z))
}

/**
 * Drag torque sign: mirror faces (L, D, B) use the partner-face sign so screen
 * motion matches layer motion the same way it does on R, U, and F.
 */
function dragSignForFace(face: Face): number {
  return isMirrorFace(face) ? -FACE_CW_SIGN[face] : FACE_CW_SIGN[face]
}

export function getMoveAngle(move: Move, progress: number): number {
  const sign = getMoveCwSign(move)
  const quarterTurns = move.turn === 2 ? 2 : move.turn === 3 ? -1 : 1
  return sign * quarterTurns * progress * (Math.PI / 2)
}

/** Mirror faces need inverted release mapping so drag-follows-finger angles stay continuous. */
function invertDragRelease(face: Face): boolean {
  return face === 'L' || face === 'D' || face === 'B'
}

export function getDragTurn(move: Move, progress: number): 1 | 3 {
  const positiveProgressIsTurn1 = !invertDragRelease(getDragReferenceFace(move))
  return (progress >= 0) === positiveProgressIsTurn1 ? 1 : 3
}

export function getAnimatedLayerAngle(
  move: Move,
  progress: number,
  mode: 'idle' | 'playing' | 'dragging',
): number {
  if (mode === 'dragging') {
    const face = getDragReferenceFace(move)
    let angle = FACE_CW_SIGN[face] * progress * (Math.PI / 2)
    if (invertDragRelease(face)) {
      angle = -angle
    }
    return angle
  }

  return getMoveAngle(move, progress)
}

/**
 * Euler rotation components matching the original renderer: always rotate on the
 * positive X/Y/Z channel for the face axis, with direction encoded in angle.
 */
export function getLayerEulerRotation(move: Move, angle: number): [number, number, number] {
  const face = getDragReferenceFace(move)
  const axis = FACE_NORMALS[face]
  return [
    axis.x !== 0 ? angle : 0,
    axis.y !== 0 ? angle : 0,
    axis.z !== 0 ? angle : 0,
  ]
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
  move: Move,
  deltaX: number,
  deltaY: number,
  camera: THREE.Camera,
  faceWorldNormal: THREE.Vector3,
  anchorPoint: THREE.Vector3,
): number {
  const axis = getCanonicalAxis(move)
  const dragOnPlane = screenDeltaToWorld(deltaX, deltaY, camera, faceWorldNormal)
  const face = getDragReferenceFace(move)

  const torque = new THREE.Vector3().crossVectors(anchorPoint, dragOnPlane)
  const omega = axis.dot(torque) / Math.max(anchorPoint.lengthSq(), 1e-6)

  return omega * dragSignForFace(face) * DRAG_SENSITIVITY
}

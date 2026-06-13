import * as THREE from 'three'
import {
  dragSignForFace,
  FACE_CW_SIGN,
  getDragReferenceFace,
  getMoveCwSign,
  invertDragRelease,
  type Face,
  type Move,
} from '../domain'
import { easeOutCubic } from './animationEasing'

const FACE_NORMALS: Record<Face, THREE.Vector3> = {
  R: new THREE.Vector3(1, 0, 0),
  L: new THREE.Vector3(-1, 0, 0),
  U: new THREE.Vector3(0, 1, 0),
  D: new THREE.Vector3(0, -1, 0),
  F: new THREE.Vector3(0, 0, 1),
  B: new THREE.Vector3(0, 0, -1),
}

const DRAG_SENSITIVITY = 0.02

export { FACE_CW_SIGN, getDragReferenceFace }

export function getFaceNormal(face: Face): THREE.Vector3 {
  return FACE_NORMALS[face].clone()
}

export function getRotationAxis(move: Move): THREE.Vector3 {
  return getFaceNormal(getDragReferenceFace(move))
}

function getCanonicalAxis(move: Move): THREE.Vector3 {
  const face = getDragReferenceFace(move)
  const axis = FACE_NORMALS[face]
  return new THREE.Vector3(Math.abs(axis.x), Math.abs(axis.y), Math.abs(axis.z))
}

export function mapPlayingVisualProgress(linearProgress: number, startProgress: number): number {
  if (startProgress >= 1) return 1
  const segment = (linearProgress - startProgress) / (1 - startProgress)
  const easedSegment = easeOutCubic(Math.max(0, Math.min(1, segment)))
  return startProgress + (1 - startProgress) * easedSegment
}

export function getMoveAngle(
  move: Move,
  progress: number,
  startProgress = 0,
  eased = true,
): number {
  const visualProgress = eased
    ? mapPlayingVisualProgress(progress, startProgress)
    : progress
  const sign = getMoveCwSign(move)
  const quarterTurns = move.turn === 2 ? 2 : move.turn === 3 ? -1 : 1
  return sign * quarterTurns * visualProgress * (Math.PI / 2)
}

export function getAnimatedLayerAngle(
  move: Move,
  progress: number,
  mode: 'idle' | 'playing' | 'dragging',
  playStartProgress = 0,
): number {
  if (mode === 'dragging') {
    const face = getDragReferenceFace(move)
    let angle = FACE_CW_SIGN[face] * progress * (Math.PI / 2)
    if (invertDragRelease(face)) {
      angle = -angle
    }
    return angle
  }

  return getMoveAngle(move, progress, playStartProgress, true)
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

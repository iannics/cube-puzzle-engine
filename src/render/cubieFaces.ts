import * as THREE from 'three'
import type { Color, Face } from '../domain'
import { CUBIE_SIZE } from './mapCubies'

export const MATERIAL_ORDER: Face[] = ['R', 'L', 'U', 'D', 'F', 'B']

/** Slightly smaller than cubie body so gaps remain visible between stickers. */
export const STICKER_SIZE = 0.88

/** Gap between cubie center shell and sticker outer surface. */
const STICKER_OFFSET = 0.01
/** Thin depth so stickers stay visible when edge-on during layer turns. */
export const STICKER_DEPTH = 0.025
const HALF = CUBIE_SIZE / 2

/** Opaque black core filling the volume under the sticker shells. */
export const BODY_SIZE = 2 * (HALF + STICKER_OFFSET - STICKER_DEPTH) - 0.008

export function listStickerFaces(faceColors: Record<Face, Color | null>): Face[] {
  return MATERIAL_ORDER.filter((face) => faceColors[face] !== null)
}

export function stickerOuterRadiusAlongNormal(): number {
  return HALF + STICKER_OFFSET
}

export function stickerInnerRadiusAlongNormal(): number {
  return HALF + STICKER_OFFSET - STICKER_DEPTH
}

const FACE_NORMALS: Record<Face, THREE.Vector3> = {
  R: new THREE.Vector3(1, 0, 0),
  L: new THREE.Vector3(-1, 0, 0),
  U: new THREE.Vector3(0, 1, 0),
  D: new THREE.Vector3(0, -1, 0),
  F: new THREE.Vector3(0, 0, 1),
  B: new THREE.Vector3(0, 0, -1),
}

const PLANE_NORMAL = new THREE.Vector3(0, 0, 1)
const alignQuaternion = new THREE.Quaternion()

export interface StickerTransform {
  position: [number, number, number]
  quaternion: [number, number, number, number]
}

export function getStickerTransform(face: Face): StickerTransform {
  const normal = FACE_NORMALS[face]
  const centerDistance = HALF + STICKER_OFFSET - STICKER_DEPTH / 2
  const position = normal.clone().multiplyScalar(centerDistance)
  alignQuaternion.setFromUnitVectors(PLANE_NORMAL, normal)

  return {
    position: [position.x, position.y, position.z],
    quaternion: [alignQuaternion.x, alignQuaternion.y, alignQuaternion.z, alignQuaternion.w],
  }
}

export function faceFromIndex(faceIndex: number | null | undefined): Face | null {
  if (faceIndex === undefined || faceIndex === null) return null
  return MATERIAL_ORDER[Math.floor(faceIndex / 2)] ?? null
}

export function faceFromNormal(x: number, y: number, z: number): Face {
  const absX = Math.abs(x)
  const absY = Math.abs(y)
  const absZ = Math.abs(z)

  if (absX >= absY && absX >= absZ) {
    return x > 0 ? 'R' : 'L'
  }

  if (absY >= absX && absY >= absZ) {
    return y > 0 ? 'U' : 'D'
  }

  return z > 0 ? 'F' : 'B'
}

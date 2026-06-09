import * as THREE from 'three'
import type { Face } from '../domain'
import { dragProgressFromScreenDelta, getFaceNormal } from './layerRotation'

export interface CubieGrid {
  x: number
  y: number
  z: number
}

export function getOuterFaces(grid: CubieGrid, size: number): Face[] {
  const faces: Face[] = []
  if (grid.x === 0) faces.push('L')
  if (grid.x === size - 1) faces.push('R')
  if (grid.y === 0) faces.push('D')
  if (grid.y === size - 1) faces.push('U')
  if (grid.z === 0) faces.push('B')
  if (grid.z === size - 1) faces.push('F')
  return faces
}

export function selectLayerFromDrag(
  grid: CubieGrid,
  size: number,
  deltaX: number,
  deltaY: number,
  camera: THREE.Camera,
  anchorPoint: THREE.Vector3,
): Face {
  const candidates = getOuterFaces(grid, size)
  if (candidates.length === 0) {
    throw new Error('Interior cubie cannot be dragged')
  }

  if (candidates.length === 1) {
    return candidates[0]
  }

  let bestFace = candidates[0]
  let bestMagnitude = 0

  for (const face of candidates) {
    const worldNormal = getFaceNormal(face)
    const magnitude = Math.abs(
      dragProgressFromScreenDelta(face, deltaX, deltaY, camera, worldNormal, anchorPoint),
    )
    if (magnitude > bestMagnitude) {
      bestMagnitude = magnitude
      bestFace = face
    }
  }

  return bestFace
}

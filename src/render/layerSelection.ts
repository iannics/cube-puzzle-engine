import * as THREE from 'three'
import { faceMove, sliceMove, type Face, type Move, type Slice } from '../domain'
import { dragProgressFromScreenDelta, getDragReferenceFace, getFaceNormal } from './layerRotation'

export interface CubieGrid {
  x: number
  y: number
  z: number
}

function middleLayerIndex(size: number): number {
  return Math.floor((size - 1) / 2)
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

export function getApplicableSlices(grid: CubieGrid, size: number): Slice[] {
  if (size < 3) return []

  const mid = middleLayerIndex(size)
  const slices: Slice[] = []
  if (grid.x === mid) slices.push('M')
  if (grid.y === mid) slices.push('E')
  if (grid.z === mid) slices.push('S')
  return slices
}

export function getCandidateMoves(grid: CubieGrid, size: number): Move[] {
  const moves: Move[] = getOuterFaces(grid, size).map((face) => faceMove(face, 1))
  for (const slice of getApplicableSlices(grid, size)) {
    moves.push(sliceMove(slice, 1))
  }
  return moves
}

export function selectMoveFromDrag(
  grid: CubieGrid,
  size: number,
  deltaX: number,
  deltaY: number,
  camera: THREE.Camera,
  anchorPoint: THREE.Vector3,
): Move {
  const candidates = getCandidateMoves(grid, size)
  if (candidates.length === 0) {
    throw new Error('Cubie has no draggable layers')
  }

  if (candidates.length === 1) {
    return candidates[0]
  }

  let bestMove = candidates[0]
  let bestMagnitude = 0

  for (const move of candidates) {
    const worldNormal = getFaceNormal(getDragReferenceFace(move))
    const magnitude = Math.abs(
      dragProgressFromScreenDelta(move, deltaX, deltaY, camera, worldNormal, anchorPoint),
    )
    if (magnitude > bestMagnitude) {
      bestMagnitude = magnitude
      bestMove = move
    }
  }

  return bestMove
}

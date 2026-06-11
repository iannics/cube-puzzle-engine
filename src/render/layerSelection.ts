import * as THREE from 'three'
import { getCandidateMovesForCubie, type Move } from '../domain'
import { dragProgressFromScreenDelta, getDragReferenceFace, getFaceNormal } from './layerRotation'

export interface CubieGrid {
  x: number
  y: number
  z: number
}

export function selectMoveFromDrag(
  grid: CubieGrid,
  size: number,
  deltaX: number,
  deltaY: number,
  camera: THREE.Camera,
  anchorPoint: THREE.Vector3,
): Move {
  const candidates = getCandidateMovesForCubie(grid.x, grid.y, grid.z, size)
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

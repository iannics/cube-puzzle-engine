import type { Face, Move, Slice } from './types'

const SLICE_DRAG_FACE: Record<Slice, Face> = {
  M: 'L',
  E: 'D',
  S: 'F',
}

/** Mirror faces need inverted release mapping so drag-follows-finger angles stay continuous. */
export function invertDragRelease(face: Face): boolean {
  return face === 'L' || face === 'D' || face === 'B'
}

export function getDragReferenceFace(move: Move): Face {
  return move.kind === 'face' ? move.face : SLICE_DRAG_FACE[move.slice]
}

export function getDragTurn(move: Move, progress: number): 1 | 3 {
  const positiveProgressIsTurn1 = !invertDragRelease(getDragReferenceFace(move))
  return (progress >= 0) === positiveProgressIsTurn1 ? 1 : 3
}

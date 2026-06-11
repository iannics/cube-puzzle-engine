import { faceMove, isInFaceLayer, isInSliceLayer, sliceMove } from './moves'
import type { CubieState, Face, Move, Slice } from './types'

const FACES: Face[] = ['U', 'D', 'L', 'R', 'F', 'B']
const SLICES: Slice[] = ['M', 'E', 'S']

function cubieAt(x: number, y: number, z: number): CubieState {
  return { x, y, z, stickers: {} }
}

export function getCandidateMovesForCubie(x: number, y: number, z: number, size: number): Move[] {
  const cubie = cubieAt(x, y, z)
  const moves: Move[] = []

  for (const face of FACES) {
    if (isInFaceLayer(cubie, face, size)) {
      moves.push(faceMove(face, 1))
    }
  }

  for (const slice of SLICES) {
    if (isInSliceLayer(cubie, slice, size)) {
      moves.push(sliceMove(slice, 1))
    }
  }

  return moves
}

import { createSolvedCube } from './cube'
import { applyMove, faceMove, inverse, sliceMove } from './moves'
import type { CubeState, Face, Move, Slice } from './types'

const FACES: Face[] = ['U', 'D', 'L', 'R', 'F', 'B']
const SLICES: Slice[] = ['M', 'E', 'S']

function movesEqual(a: Move, b: Move): boolean {
  if (a.kind !== b.kind) return false
  if (a.kind === 'face' && b.kind === 'face') {
    return a.face === b.face && a.turn === b.turn
  }
  if (a.kind === 'slice' && b.kind === 'slice') {
    return a.slice === b.slice && a.turn === b.turn
  }
  return false
}

function randomInt(max: number, rng: () => number): number {
  return Math.floor(rng() * max)
}

function pickRandomMove(size: number, rng: () => number): Move {
  if (size < 3) {
    const face = FACES[randomInt(FACES.length, rng)]
    const turn = ([1, 1, 1, 3] as const)[randomInt(4, rng)]
    return faceMove(face, turn)
  }

  const pool: Move[] = [
    ...FACES.map((face) => faceMove(face, 1)),
    ...SLICES.map((slice) => sliceMove(slice, 1)),
  ]
  return pool[randomInt(pool.length, rng)]
}

export function scrambleCube(
  size: number,
  moveCount: number,
  rng: () => number = Math.random,
): CubeState {
  if (!Number.isInteger(moveCount) || moveCount < 0) {
    throw new Error(`moveCount must be a non-negative integer, got ${moveCount}`)
  }

  let cube = createSolvedCube(size)
  let lastMove: Move | null = null

  for (let i = 0; i < moveCount; i++) {
    let move = pickRandomMove(size, rng)
    let attempts = 0
    while (lastMove !== null && movesEqual(move, inverse(lastMove)) && attempts < 20) {
      move = pickRandomMove(size, rng)
      attempts++
    }
    cube = applyMove(cube, move)
    lastMove = move
  }

  return cube
}

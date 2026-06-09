import type { Color, CubeState, CubieState, Face } from './types'

const FACE_COLORS: Record<Face, Color> = {
  U: 'white',
  D: 'yellow',
  R: 'red',
  L: 'orange',
  F: 'green',
  B: 'blue',
}

function isOnFace(axis: 'x' | 'y' | 'z', index: number, size: number): Face | null {
  const last = size - 1
  if (axis === 'x') {
    if (index === 0) return 'L'
    if (index === last) return 'R'
  }
  if (axis === 'y') {
    if (index === 0) return 'D'
    if (index === last) return 'U'
  }
  if (axis === 'z') {
    if (index === 0) return 'B'
    if (index === last) return 'F'
  }
  return null
}

function createCubie(x: number, y: number, z: number, size: number): CubieState {
  const stickers: Partial<Record<Face, Color>> = {}

  const faces: Array<[axis: 'x' | 'y' | 'z', index: number]> = [
    ['x', x],
    ['y', y],
    ['z', z],
  ]

  for (const [axis, index] of faces) {
    const face = isOnFace(axis, index, size)
    if (face) {
      stickers[face] = FACE_COLORS[face]
    }
  }

  return { x, y, z, stickers }
}

export function createSolvedCube(size: number): CubeState {
  if (!Number.isInteger(size) || size < 2) {
    throw new Error(`Cube size must be an integer >= 2, got ${size}`)
  }

  const cubies: CubieState[] = []

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        cubies.push(createCubie(x, y, z, size))
      }
    }
  }

  return { size, cubies }
}

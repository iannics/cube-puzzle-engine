import type { Color, CubieState, CubeState, Face } from './types'

const FACES: Face[] = ['U', 'D', 'L', 'R', 'F', 'B']

function isValidColor(value: unknown): value is Color {
  return (
    value === 'white' ||
    value === 'yellow' ||
    value === 'red' ||
    value === 'orange' ||
    value === 'blue' ||
    value === 'green'
  )
}

function isValidCubie(value: unknown, size: number): value is CubieState {
  if (typeof value !== 'object' || value === null) return false
  const cubie = value as Record<string, unknown>
  if (
    typeof cubie.x !== 'number' ||
    typeof cubie.y !== 'number' ||
    typeof cubie.z !== 'number' ||
    cubie.x < 0 ||
    cubie.y < 0 ||
    cubie.z < 0 ||
    cubie.x >= size ||
    cubie.y >= size ||
    cubie.z >= size
  ) {
    return false
  }
  if (typeof cubie.stickers !== 'object' || cubie.stickers === null) return false
  const stickers = cubie.stickers as Record<string, unknown>
  for (const [face, color] of Object.entries(stickers)) {
    if (!FACES.includes(face as Face) || !isValidColor(color)) return false
  }
  return true
}

function isValidCubeState(value: unknown): value is CubeState {
  if (typeof value !== 'object' || value === null) return false
  const cube = value as Record<string, unknown>
  if (typeof cube.size !== 'number' || !Number.isInteger(cube.size) || cube.size < 2) {
    return false
  }
  if (!Array.isArray(cube.cubies)) return false
  const expected = cube.size ** 3
  if (cube.cubies.length !== expected) return false
  return cube.cubies.every((cubie) => isValidCubie(cubie, cube.size as number))
}

export function serializeCube(state: CubeState): string {
  return JSON.stringify(state)
}

export function deserializeCube(json: string): CubeState {
  const parsed: unknown = JSON.parse(json)
  if (!isValidCubeState(parsed)) {
    throw new Error('Invalid cube state JSON')
  }
  return parsed
}

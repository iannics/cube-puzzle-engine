import type { Color, CubeState, CubieState, Face } from '../domain/types'

const CUBIE_SIZE = 0.95
const CUBIE_GAP = 0.05

export interface RenderCubie {
  key: string
  position: [number, number, number]
  faceColors: Record<Face, Color | null>
}

function toWorldPosition(x: number, y: number, z: number, size: number): [number, number, number] {
  const spacing = CUBIE_SIZE + CUBIE_GAP
  const offset = (size - 1) / 2
  return [(x - offset) * spacing, (y - offset) * spacing, (z - offset) * spacing]
}

function toFaceColors(stickers: Partial<Record<Face, Color>>): Record<Face, Color | null> {
  return {
    U: stickers.U ?? null,
    D: stickers.D ?? null,
    L: stickers.L ?? null,
    R: stickers.R ?? null,
    F: stickers.F ?? null,
    B: stickers.B ?? null,
  }
}

function cubieKey(cubie: CubieState): string {
  return `${cubie.x}-${cubie.y}-${cubie.z}`
}

export function mapCubies(state: CubeState): RenderCubie[] {
  return state.cubies
    .filter((cubie) => Object.keys(cubie.stickers).length > 0)
    .map((cubie) => ({
      key: cubieKey(cubie),
      position: toWorldPosition(cubie.x, cubie.y, cubie.z, state.size),
      faceColors: toFaceColors(cubie.stickers),
    }))
}

export { CUBIE_SIZE }

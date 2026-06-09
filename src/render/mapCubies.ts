import type { Color, CubeState, Face } from '../domain/types'
import type { CubieGrid } from './layerSelection'

const CUBIE_SIZE = 0.95
const CUBIE_GAP = 0.05

export interface RenderCubie {
  /** Stable domain array index — does not change when cubie positions update. */
  key: string
  grid: CubieGrid
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

export function mapCubies(state: CubeState): RenderCubie[] {
  const result: RenderCubie[] = []

  state.cubies.forEach((cubie, index) => {
    if (Object.keys(cubie.stickers).length === 0) return

    result.push({
      key: String(index),
      grid: { x: cubie.x, y: cubie.y, z: cubie.z },
      position: toWorldPosition(cubie.x, cubie.y, cubie.z, state.size),
      faceColors: toFaceColors(cubie.stickers),
    })
  })

  return result
}

export { CUBIE_SIZE }

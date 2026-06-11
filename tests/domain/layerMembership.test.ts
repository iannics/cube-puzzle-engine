import { describe, expect, it } from 'vitest'
import {
  faceMove,
  getCandidateMovesForCubie,
  isInFaceLayer,
  isInMoveLayer,
  isInSliceLayer,
  sliceMove,
  type CubieState,
} from '../../src/domain'

function cubie(x: number, y: number, z: number): CubieState {
  return { x, y, z, stickers: {} }
}

describe('isInFaceLayer', () => {
  it('identifies outer faces on a 3x3', () => {
    expect(isInFaceLayer(cubie(2, 1, 1), 'R', 3)).toBe(true)
    expect(isInFaceLayer(cubie(2, 1, 1), 'L', 3)).toBe(false)
    expect(isInFaceLayer(cubie(1, 2, 1), 'U', 3)).toBe(true)
    expect(isInFaceLayer(cubie(1, 0, 1), 'D', 3)).toBe(true)
  })
})

describe('isInSliceLayer', () => {
  it('identifies middle slices on a 3x3', () => {
    expect(isInSliceLayer(cubie(1, 1, 1), 'M', 3)).toBe(true)
    expect(isInSliceLayer(cubie(1, 1, 1), 'E', 3)).toBe(true)
    expect(isInSliceLayer(cubie(1, 1, 1), 'S', 3)).toBe(true)
    expect(isInSliceLayer(cubie(0, 1, 1), 'M', 3)).toBe(false)
  })

  it('returns false for 2x2 cubes', () => {
    expect(isInSliceLayer(cubie(0, 0, 0), 'M', 2)).toBe(false)
  })
})

describe('isInMoveLayer', () => {
  it('matches face and slice moves', () => {
    expect(isInMoveLayer(cubie(2, 1, 1), faceMove('R', 1), 3)).toBe(true)
    expect(isInMoveLayer(cubie(2, 1, 1), sliceMove('M', 1), 3)).toBe(false)
    expect(isInMoveLayer(cubie(1, 1, 1), sliceMove('M', 1), 3)).toBe(true)
  })
})

describe('getCandidateMovesForCubie', () => {
  it('returns outer faces for a corner cubie', () => {
    const moves = getCandidateMovesForCubie(2, 2, 2, 3)
    const faces = moves.filter((m) => m.kind === 'face').map((m) => (m.kind === 'face' ? m.face : null))
    expect(faces).toEqual(['U', 'R', 'F'])
  })

  it('includes middle slices for center-layer cubies on a 3x3', () => {
    const moves = getCandidateMovesForCubie(1, 2, 1, 3)
    const slices = moves.filter((m) => m.kind === 'slice').map((m) => (m.kind === 'slice' ? m.slice : null))
    expect(slices).toEqual(['M', 'S'])
    expect(moves).toHaveLength(3)
  })

  it('returns only face moves on a 2x2', () => {
    const moves = getCandidateMovesForCubie(0, 0, 0, 2)
    expect(moves).toHaveLength(3)
    expect(moves.every((m) => m.kind === 'face')).toBe(true)
  })

  it('covers every face and slice layer on a 3x3 edge cubie', () => {
    const moves = getCandidateMovesForCubie(2, 1, 1, 3)
    expect(moves).toHaveLength(3)
    expect(moves).toContainEqual(faceMove('R', 1))
    expect(moves).toContainEqual(sliceMove('E', 1))
    expect(moves).toContainEqual(sliceMove('S', 1))
  })
})

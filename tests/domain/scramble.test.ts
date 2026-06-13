import { describe, expect, it } from 'vitest'
import { createSolvedCube, scrambleCube, type CubeState } from '../../src/domain'

function stickerCount(cube: CubeState): number {
  return cube.cubies.reduce((sum, cubie) => sum + Object.keys(cubie.stickers).length, 0)
}

function cubesEqual(a: CubeState, b: CubeState): boolean {
  if (a.size !== b.size || a.cubies.length !== b.cubies.length) return false
  return a.cubies.every((cubieA) => {
    const cubieB = b.cubies.find((c) => c.x === cubieA.x && c.y === cubieA.y && c.z === cubieA.z)
    if (!cubieB) return false
    return JSON.stringify(cubieA.stickers) === JSON.stringify(cubieB.stickers)
  })
}

describe('scrambleCube', () => {
  it('returns solved cube for zero moves', () => {
    const solved = createSolvedCube(3)
    expect(cubesEqual(scrambleCube(3, 0), solved)).toBe(true)
  })

  it('preserves sticker count', () => {
    const solved = createSolvedCube(3)
    const count = stickerCount(solved)
    const scrambled = scrambleCube(3, 25, () => 0.42)
    expect(stickerCount(scrambled)).toBe(count)
  })

  it('produces a non-solved state for non-zero moves', () => {
    const solved = createSolvedCube(3)
    // rng 0.3 always picks R (index 3 in the 12-move pool).
    const scrambled = scrambleCube(3, 1, () => 0.3)
    expect(cubesEqual(scrambled, solved)).toBe(false)
  })

  it('is deterministic with a fixed rng', () => {
    const rng = () => 0.33
    expect(cubesEqual(scrambleCube(3, 15, rng), scrambleCube(3, 15, rng))).toBe(true)
  })

  it('works for 2x2 cubes', () => {
    const scrambled = scrambleCube(2, 10, () => 0.5)
    expect(scrambled.size).toBe(2)
    expect(scrambled.cubies).toHaveLength(8)
  })

  it('rejects negative move counts', () => {
    expect(() => scrambleCube(3, -1)).toThrow()
  })
})

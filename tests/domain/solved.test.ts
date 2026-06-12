import { describe, expect, it } from 'vitest'
import {
  applyMove,
  createSolvedCube,
  generateScrambleMoves,
  inverse,
  isSolved,
  orientFaceToUp,
  rotateWholeCube,
  type CubeState,
} from '../../src/domain'

function cubesEqual(a: CubeState, b: CubeState): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

describe('isSolved', () => {
  it('returns true for a solved cube', () => {
    expect(isSolved(createSolvedCube(3))).toBe(true)
  })

  it('returns false after a scramble', () => {
    const moves = generateScrambleMoves(3, 20)
    const scrambled = moves.reduce((cube, move) => applyMove(cube, move), createSolvedCube(3))
    expect(isSolved(scrambled)).toBe(false)
  })

  it('returns true after applying inverse moves', () => {
    const moves = generateScrambleMoves(3, 10)
    const scrambled = moves.reduce((cube, move) => applyMove(cube, move), createSolvedCube(3))
    const restored = [...moves]
      .reverse()
      .reduce((cube, move) => applyMove(cube, inverse(move)), scrambled)
    expect(isSolved(restored)).toBe(true)
  })
})

describe('rotateWholeCube', () => {
  it('four x rotations restore the cube', () => {
    const solved = createSolvedCube(3)
    let cube = solved
    for (let i = 0; i < 4; i++) {
      cube = rotateWholeCube(cube, 'x', 1)
    }
    expect(cubesEqual(cube, solved)).toBe(true)
  })

  it('inverse axis rotation restores the cube', () => {
    const solved = createSolvedCube(3)
    const rotated = rotateWholeCube(solved, 'y', 1)
    const restored = rotateWholeCube(rotated, 'y', 3)
    expect(cubesEqual(restored, solved)).toBe(true)
  })

  it('four z rotations restore the cube', () => {
    const solved = createSolvedCube(3)
    let cube = solved
    for (let i = 0; i < 4; i++) {
      cube = rotateWholeCube(cube, 'z', 1)
    }
    expect(cubesEqual(cube, solved)).toBe(true)
  })
})

describe('orientFaceToUp', () => {
  const faces = ['U', 'D', 'F', 'B', 'L', 'R'] as const

  for (const face of faces) {
    it(`places ${face} face cubies on the U layer`, () => {
      const size = 3
      const oriented = orientFaceToUp(createSolvedCube(size), face)
      const uLayer = oriented.cubies.filter((c) => c.y === size - 1)
      expect(uLayer.length).toBe(size * size)

      const expectedColors = createSolvedCube(size).cubies
        .filter((c) => {
          if (face === 'U') return c.y === size - 1
          if (face === 'D') return c.y === 0
          if (face === 'F') return c.z === size - 1
          if (face === 'B') return c.z === 0
          if (face === 'L') return c.x === 0
          return c.x === size - 1
        })
        .flatMap((c) => Object.values(c.stickers))

      const actualColors = uLayer.flatMap((c) => Object.values(c.stickers))
      expect(actualColors.sort()).toEqual(expectedColors.sort())
    })
  }
})

describe('orientFaceToUp from scrambled state', () => {
  it('does not lose cubie count', () => {
    const moves = generateScrambleMoves(3, 15)
    const scrambled = moves.reduce((cube, move) => applyMove(cube, move), createSolvedCube(3))
    const oriented = orientFaceToUp(scrambled, 'F')
    expect(oriented.cubies.length).toBe(27)
  })
})

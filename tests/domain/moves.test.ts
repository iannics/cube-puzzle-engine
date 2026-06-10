import { describe, expect, it } from 'vitest'
import {
  applyMove,
  createSolvedCube,
  faceMove,
  inverse,
  type CubeState,
  type CubieState,
  type Face,
} from '../../src/domain'

const FACES: Face[] = ['U', 'D', 'L', 'R', 'F', 'B']

function exteriorFaces(cubie: CubieState, size: number): Face[] {
  const last = size - 1
  const faces: Face[] = []
  if (cubie.x === 0) faces.push('L')
  if (cubie.x === last) faces.push('R')
  if (cubie.y === 0) faces.push('D')
  if (cubie.y === last) faces.push('U')
  if (cubie.z === 0) faces.push('B')
  if (cubie.z === last) faces.push('F')
  return faces
}

function stickerCount(cube: CubeState): number {
  return cube.cubies.reduce((sum, cubie) => sum + Object.keys(cubie.stickers).length, 0)
}

function cubesEqual(a: CubeState, b: CubeState): boolean {
  if (a.size !== b.size || a.cubies.length !== b.cubies.length) {
    return false
  }

  return a.cubies.every((cubieA) => {
    const cubieB = b.cubies.find(
      (c) => c.x === cubieA.x && c.y === cubieA.y && c.z === cubieA.z,
    )
    if (!cubieB) return false
    return JSON.stringify(cubieA.stickers) === JSON.stringify(cubieB.stickers)
  })
}

describe('applyMove', () => {
  it('move followed by inverse restores solved cube for every face', () => {
    const solved = createSolvedCube(3)

    for (const face of FACES) {
      const move = faceMove(face, 1)
      const scrambled = applyMove(solved, move)
      const restored = applyMove(scrambled, inverse(move))
      expect(cubesEqual(restored, solved)).toBe(true)
    }
  })

  it('four quarter turns return to identity for every face', () => {
    const solved = createSolvedCube(3)

    for (const face of FACES) {
      let cube = solved
      for (let i = 0; i < 4; i++) {
        cube = applyMove(cube, faceMove(face, 1))
      }
      expect(cubesEqual(cube, solved)).toBe(true)
    }
  })

  it('preserves total sticker count', () => {
    const solved = createSolvedCube(3)
    const count = stickerCount(solved)

    for (const face of FACES) {
      for (const turn of [1, 2, 3] as const) {
        const next = applyMove(solved, faceMove(face, turn))
        expect(stickerCount(next)).toBe(count)
      }
    }
  })

  it('R moves the URF corner to UBR on a solved 3x3', () => {
    const solved = createSolvedCube(3)
    const next = applyMove(solved, faceMove('R', 1))
    const urf = next.cubies.find((c) => c.x === 2 && c.y === 2 && c.z === 0)
    expect(urf?.stickers).toEqual({
      U: 'green',
      R: 'red',
      B: 'white',
    })
  })

  it('F moves the URF corner to DFR with outward-facing side stickers', () => {
    const solved = createSolvedCube(3)
    const next = applyMove(solved, faceMove('F', 1))
    const dfr = next.cubies.find((c) => c.x === 2 && c.y === 0 && c.z === 2)
    expect(dfr?.stickers).toEqual({
      R: 'white',
      D: 'red',
      F: 'green',
    })
  })

  it('B moves the UBR corner to UBL with outward-facing side stickers', () => {
    const solved = createSolvedCube(3)
    const next = applyMove(solved, faceMove('B', 1))
    const ubl = next.cubies.find((c) => c.x === 0 && c.y === 2 && c.z === 0)
    expect(ubl?.stickers).toEqual({
      L: 'white',
      U: 'red',
      B: 'blue',
    })
  })

  it('keeps every sticker on an exterior face after F and B turns', () => {
    const solved = createSolvedCube(3)

    for (const face of ['F', 'B'] as const) {
      for (const turn of [1, 2, 3] as const) {
        const cube = applyMove(solved, faceMove(face, turn))
        for (const cubie of cube.cubies) {
          const exterior = exteriorFaces(cubie, cube.size)
          for (const stickerFace of Object.keys(cubie.stickers)) {
            expect(exterior).toContain(stickerFace)
          }
        }
      }
    }
  })

  it('works for 2x2 cubes', () => {
    const solved = createSolvedCube(2)
    const scrambled = applyMove(solved, faceMove('U', 1))
    const restored = applyMove(scrambled, faceMove('U', 3))
    expect(cubesEqual(restored, solved)).toBe(true)
  })
})

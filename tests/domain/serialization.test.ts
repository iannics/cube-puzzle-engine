import { describe, expect, it } from 'vitest'
import {
  applyMove,
  createSolvedCube,
  deserializeCube,
  faceMove,
  scrambleCube,
  serializeCube,
  type CubeState,
} from '../../src/domain'

function cubesEqual(a: CubeState, b: CubeState): boolean {
  if (a.size !== b.size || a.cubies.length !== b.cubies.length) return false
  return a.cubies.every((cubieA) => {
    const cubieB = b.cubies.find((c) => c.x === cubieA.x && c.y === cubieA.y && c.z === cubieA.z)
    if (!cubieB) return false
    return JSON.stringify(cubieA.stickers) === JSON.stringify(cubieB.stickers)
  })
}

describe('serializeCube / deserializeCube', () => {
  it('round-trips a solved cube', () => {
    const solved = createSolvedCube(3)
    const json = serializeCube(solved)
    const restored = deserializeCube(json)
    expect(cubesEqual(restored, solved)).toBe(true)
  })

  it('round-trips a scrambled cube', () => {
    const scrambled = scrambleCube(3, 30, () => 0.21)
    const restored = deserializeCube(serializeCube(scrambled))
    expect(cubesEqual(restored, scrambled)).toBe(true)
  })

  it('round-trips after individual moves', () => {
    let cube = createSolvedCube(3)
    cube = applyMove(cube, faceMove('R', 1))
    cube = applyMove(cube, faceMove('U', 3))
    const restored = deserializeCube(serializeCube(cube))
    expect(cubesEqual(restored, cube)).toBe(true)
  })

  it('rejects invalid JSON', () => {
    expect(() => deserializeCube('{"size":3}')).toThrow()
    expect(() => deserializeCube('not json')).toThrow()
  })
})

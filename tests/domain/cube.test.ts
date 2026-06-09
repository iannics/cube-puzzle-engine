import { describe, expect, it } from 'vitest'
import { createSolvedCube } from '../../src/domain'

describe('createSolvedCube', () => {
  it('returns size cubed cubies for a 3x3', () => {
    const cube = createSolvedCube(3)
    expect(cube.size).toBe(3)
    expect(cube.cubies).toHaveLength(27)
  })

  it('gives the center cubie no stickers', () => {
    const cube = createSolvedCube(3)
    const center = cube.cubies.find((c) => c.x === 1 && c.y === 1 && c.z === 1)
    expect(center).toBeDefined()
    expect(Object.keys(center!.stickers)).toHaveLength(0)
  })

  it('gives a corner cubie three stickers with correct colors', () => {
    const cube = createSolvedCube(3)
    const corner = cube.cubies.find((c) => c.x === 0 && c.y === 0 && c.z === 0)
    expect(corner?.stickers).toEqual({
      L: 'orange',
      D: 'yellow',
      B: 'blue',
    })
  })

  it('uses a uniform color on each face center', () => {
    const cube = createSolvedCube(3)
    const topCenter = cube.cubies.find((c) => c.x === 1 && c.y === 2 && c.z === 1)
    const frontCenter = cube.cubies.find((c) => c.x === 1 && c.y === 1 && c.z === 2)

    expect(topCenter?.stickers.U).toBe('white')
    expect(frontCenter?.stickers.F).toBe('green')
  })

  it('rejects invalid sizes', () => {
    expect(() => createSolvedCube(1)).toThrow()
    expect(() => createSolvedCube(2.5)).toThrow()
  })
})

import { describe, expect, it } from 'vitest'
import {
  createSolvedCube,
  findFaceWithColor,
  orientColorToUp,
} from '../../src/domain'

describe('orientColorToUp', () => {
  it('puts green on top from solved cube', () => {
    const oriented = orientColorToUp(createSolvedCube(3), 'green')
    expect(findFaceWithColor(oriented, 'green')).toBe('U')
  })

  it('puts yellow on top from solved cube', () => {
    const oriented = orientColorToUp(createSolvedCube(3), 'yellow')
    expect(findFaceWithColor(oriented, 'yellow')).toBe('U')
  })

  it('puts white on top from solved cube', () => {
    const oriented = orientColorToUp(createSolvedCube(3), 'white')
    expect(findFaceWithColor(oriented, 'white')).toBe('U')
  })
})

describe('findFaceWithColor', () => {
  it('finds green on F in solved cube', () => {
    expect(findFaceWithColor(createSolvedCube(3), 'green')).toBe('F')
  })
})

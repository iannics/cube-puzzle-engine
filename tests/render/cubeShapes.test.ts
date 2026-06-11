import { describe, expect, it } from 'vitest'
import { CUBE_SHAPE_IDS, CUBE_SHAPES, resolveCubeShapeId } from '../../src/render/cubeShapes'

describe('cubeShapes', () => {
  it('defines three cube model variants', () => {
    expect(CUBE_SHAPE_IDS).toHaveLength(3)
    expect(CUBE_SHAPE_IDS).toEqual(['modern', 'classic', 'inset'])
    expect(CUBE_SHAPES.modern.name).toBe('Modern')
    expect(CUBE_SHAPES.classic.name).toBe('Classic')
    expect(CUBE_SHAPES.inset.name).toBe('Inset Frame')
  })

  it('maps legacy shape ids to current models', () => {
    expect(resolveCubeShapeId('futuristic')).toBe('modern')
    expect(resolveCubeShapeId('rounded')).toBe('inset')
    expect(resolveCubeShapeId('modern')).toBe('modern')
  })
})

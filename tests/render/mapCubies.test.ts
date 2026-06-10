import { describe, expect, it } from 'vitest'
import { createSolvedCube } from '../../src/domain'
import { listStickerFaces } from '../../src/render/cubieFaces'
import { mapCubies } from '../../src/render/mapCubies'

describe('mapCubies', () => {
  it('maps a corner cubie to exactly three sticker faces', () => {
    const cubies = mapCubies(createSolvedCube(3))
    const urf = cubies.find((cubie) => cubie.grid.x === 2 && cubie.grid.y === 2 && cubie.grid.z === 2)

    expect(urf).toBeDefined()
    expect(listStickerFaces(urf!.faceColors)).toEqual(['R', 'U', 'F'])
  })

  it('maps a center face cubie to one sticker face', () => {
    const cubies = mapCubies(createSolvedCube(3))
    const frontCenter = cubies.find(
      (cubie) => cubie.grid.x === 1 && cubie.grid.y === 1 && cubie.grid.z === 2,
    )

    expect(frontCenter).toBeDefined()
    expect(listStickerFaces(frontCenter!.faceColors)).toEqual(['F'])
  })

  it('maps an edge cubie to two sticker faces', () => {
    const cubies = mapCubies(createSolvedCube(3))
    const uf = cubies.find((cubie) => cubie.grid.x === 1 && cubie.grid.y === 2 && cubie.grid.z === 2)

    expect(uf).toBeDefined()
    expect(listStickerFaces(uf!.faceColors)).toEqual(['U', 'F'])
  })
})

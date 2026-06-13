import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import type { Face } from '../../src/domain'
import { CUBIE_SIZE } from '../../src/render/mapCubies'
import {
  BODY_SIZE,
  getStickerTransform,
  listStickerFaces,
  stickerInnerRadiusAlongNormal,
  stickerOuterRadiusAlongNormal,
} from '../../src/render/cubieFaces'

const FACE_NORMALS: Record<string, THREE.Vector3> = {
  R: new THREE.Vector3(1, 0, 0),
  L: new THREE.Vector3(-1, 0, 0),
  U: new THREE.Vector3(0, 1, 0),
  D: new THREE.Vector3(0, -1, 0),
  F: new THREE.Vector3(0, 0, 1),
  B: new THREE.Vector3(0, 0, -1),
}

function stickerWorldNormal(transform: ReturnType<typeof getStickerTransform>): THREE.Vector3 {
  const quaternion = new THREE.Quaternion(
    transform.quaternion[0],
    transform.quaternion[1],
    transform.quaternion[2],
    transform.quaternion[3],
  )
  return new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion).normalize()
}

describe('cubie render shell', () => {
  it('keeps an opaque black core under the sticker shells', () => {
    expect(BODY_SIZE).toBeLessThan(CUBIE_SIZE)
    expect(BODY_SIZE).toBeCloseTo(2 * stickerInnerRadiusAlongNormal() - 0.008, 5)
  })

  it('places stickers outside the nominal cubie half-width', () => {
    expect(stickerOuterRadiusAlongNormal()).toBeGreaterThan(CUBIE_SIZE / 2)
    expect(stickerInnerRadiusAlongNormal()).toBeLessThan(stickerOuterRadiusAlongNormal())
  })

  it('only lists domain sticker faces for rendering', () => {
    const faces = listStickerFaces({
      U: 'white',
      D: null,
      L: null,
      R: 'red',
      F: 'green',
      B: null,
    })

    expect(faces).toEqual(['R', 'U', 'F'])
  })
})

describe('getStickerTransform', () => {
  for (const [face, expectedNormal] of Object.entries(FACE_NORMALS)) {
    it(`orients the ${face} sticker outward`, () => {
      const transform = getStickerTransform(face as Face)
      const normal = stickerWorldNormal(transform)
      const position = new THREE.Vector3(...transform.position)

      expect(normal.dot(expectedNormal)).toBeCloseTo(1, 5)
      expect(normal.dot(position.clone().normalize())).toBeGreaterThan(0.9)
    })
  }

})

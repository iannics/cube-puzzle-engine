import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { getOuterFaces, selectLayerFromDrag } from '../../src/render/layerSelection'

describe('layerSelection', () => {
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.set(4, 4, 4)
  camera.lookAt(0, 0, 0)
  camera.updateMatrixWorld()

  const anchor = new THREE.Vector3(1.4, 0, 0)

  it('returns only outer face for a center-of-side cubie', () => {
    expect(getOuterFaces({ x: 2, y: 1, z: 1 }, 3)).toEqual(['R'])
    expect(selectLayerFromDrag({ x: 2, y: 1, z: 1 }, 3, 0, -80, camera, anchor)).toBe('R')
  })

  it('picks R over F for vertical drag on a corner cubie', () => {
    const cornerAnchor = new THREE.Vector3(1.4, 1.4, 1.4)
    const face = selectLayerFromDrag({ x: 2, y: 2, z: 2 }, 3, 0, -80, camera, cornerAnchor)
    expect(face).toBe('R')
  })

  it('picks L for cubies on the left shell', () => {
    const leftAnchor = new THREE.Vector3(-1.4, 0.5, 0.5)
    expect(selectLayerFromDrag({ x: 0, y: 1, z: 1 }, 3, 0, -80, camera, leftAnchor)).toBe('L')
  })
})

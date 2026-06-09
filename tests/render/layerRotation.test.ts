import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { dragProgressFromScreenDelta } from '../../src/render/layerRotation'

describe('dragProgressFromScreenDelta', () => {
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.set(4, 4, 4)
  camera.lookAt(0, 0, 0)
  camera.updateMatrixWorld()

  it('returns non-zero progress when dragging vertically on the R face', () => {
    const anchorPoint = new THREE.Vector3(1.4, 0.5, 0.5)
    const faceNormal = new THREE.Vector3(1, 0, 0)

    const progress = dragProgressFromScreenDelta(
      'R',
      0,
      -80,
      camera,
      faceNormal,
      anchorPoint,
    )

    expect(Math.abs(progress)).toBeGreaterThan(0.1)
  })

  it('returns opposite sign for opposite drag direction on the same face', () => {
    const anchorPoint = new THREE.Vector3(1.4, 0.5, 0.5)
    const faceNormal = new THREE.Vector3(1, 0, 0)

    const up = dragProgressFromScreenDelta('R', 0, -80, camera, faceNormal, anchorPoint)
    const down = dragProgressFromScreenDelta('R', 0, 80, camera, faceNormal, anchorPoint)

    expect(up).toBeGreaterThan(0)
    expect(down).toBeLessThan(0)
  })
})

import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { faceMove, getDragTurn, sliceMove, type Face } from '../../src/domain'
import {
  dragProgressFromScreenDelta,
  getAnimatedLayerAngle,
  getLayerEulerRotation,
  getMoveAngle,
} from '../../src/render/layerRotation'

const FACES: Face[] = ['U', 'D', 'L', 'R', 'F', 'B']

describe('getLayerEulerRotation', () => {
  it('rotates L and R in opposite directions for clockwise turns', () => {
    const r = getLayerEulerRotation(faceMove('R', 1), getMoveAngle(faceMove('R', 1), 1))
    const l = getLayerEulerRotation(faceMove('L', 1), getMoveAngle(faceMove('L', 1), 1))
    expect(Math.sign(r[0])).toBe(-Math.sign(l[0]))
    expect(r[0]).not.toBe(0)
  })

  it('rotates F and B in opposite directions for clockwise turns', () => {
    const f = getLayerEulerRotation(faceMove('F', 1), getMoveAngle(faceMove('F', 1), 1))
    const b = getLayerEulerRotation(faceMove('B', 1), getMoveAngle(faceMove('B', 1), 1))
    expect(Math.sign(f[2])).toBe(-Math.sign(b[2]))
    expect(f[2]).not.toBe(0)
  })

  it('rotates U and D in opposite directions for clockwise turns', () => {
    const u = getLayerEulerRotation(faceMove('U', 1), getMoveAngle(faceMove('U', 1), 1))
    const d = getLayerEulerRotation(faceMove('D', 1), getMoveAngle(faceMove('D', 1), 1))
    expect(Math.sign(u[1])).toBe(-Math.sign(d[1]))
    expect(u[1]).not.toBe(0)
  })

  it('rotates M in the same direction as L for clockwise turns', () => {
    const m = getLayerEulerRotation(sliceMove('M', 1), getMoveAngle(sliceMove('M', 1), 1))
    const l = getLayerEulerRotation(faceMove('L', 1), getMoveAngle(faceMove('L', 1), 1))
    expect(m[0]).toBeCloseTo(l[0], 5)
  })
})

describe('getAnimatedLayerAngle dragging', () => {
  it('matches playing angle after endDrag for every face', () => {
    for (const face of FACES) {
      for (const progress of [0.35, -0.6, 0.9]) {
        const move = faceMove(face, 1)
        const dragAngle = getAnimatedLayerAngle(move, progress, 'dragging')
        const turn = getDragTurn(move, progress)
        const playAngle = getAnimatedLayerAngle(faceMove(face, turn), Math.abs(progress), 'playing')
        expect(dragAngle).toBeCloseTo(playAngle, 5)
      }
    }
  })

  it('matches playing angle after endDrag for every slice', () => {
    for (const slice of ['M', 'E', 'S'] as const) {
      for (const progress of [0.35, -0.6, 0.9]) {
        const move = sliceMove(slice, 1)
        const dragAngle = getAnimatedLayerAngle(move, progress, 'dragging')
        const turn = getDragTurn(move, progress)
        const playAngle = getAnimatedLayerAngle(sliceMove(slice, turn), Math.abs(progress), 'playing')
        expect(dragAngle).toBeCloseTo(playAngle, 5)
      }
    }
  })

  it('rotates L drag-up in the same direction as R drag-up', () => {
    const rAngle = getAnimatedLayerAngle(faceMove('R', 1), 0.5, 'dragging')
    const lAngle = getAnimatedLayerAngle(faceMove('L', 1), 0.5, 'dragging')
    expect(Math.sign(rAngle)).toBe(Math.sign(lAngle))
  })

  it('rotates D drag-right in the same direction as U drag-right', () => {
    const uAngle = getAnimatedLayerAngle(faceMove('U', 1), 0.5, 'dragging')
    const dAngle = getAnimatedLayerAngle(faceMove('D', 1), 0.5, 'dragging')
    expect(Math.sign(uAngle)).toBe(Math.sign(dAngle))
  })

  it('rotates B drag-up in the same direction as F drag-up', () => {
    const fAngle = getAnimatedLayerAngle(faceMove('F', 1), 0.5, 'dragging')
    const bAngle = getAnimatedLayerAngle(faceMove('B', 1), 0.5, 'dragging')
    expect(Math.sign(fAngle)).toBe(Math.sign(bAngle))
  })
})

describe('dragProgressFromScreenDelta', () => {
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.set(4, 4, 4)
  camera.lookAt(0, 0, 0)
  camera.updateMatrixWorld()

  it('returns non-zero progress when dragging vertically on the R face', () => {
    const anchorPoint = new THREE.Vector3(1.4, 0.5, 0.5)
    const faceNormal = new THREE.Vector3(1, 0, 0)

    const progress = dragProgressFromScreenDelta(
      faceMove('R', 1),
      0,
      -80,
      camera,
      faceNormal,
      anchorPoint,
    )

    expect(Math.abs(progress)).toBeGreaterThan(0.1)
  })

  it('returns opposite sign for opposite drag direction on the R face', () => {
    const anchorPoint = new THREE.Vector3(1.4, 0.5, 0.5)
    const faceNormal = new THREE.Vector3(1, 0, 0)

    const up = dragProgressFromScreenDelta(faceMove('R', 1), 0, -80, camera, faceNormal, anchorPoint)
    const down = dragProgressFromScreenDelta(faceMove('R', 1), 0, 80, camera, faceNormal, anchorPoint)

    expect(up).toBeGreaterThan(0)
    expect(down).toBeLessThan(0)
  })

  it('returns opposite sign for opposite drag direction on the L face', () => {
    const anchorPoint = new THREE.Vector3(-1.4, 0.5, 0.5)
    const faceNormal = new THREE.Vector3(-1, 0, 0)

    const up = dragProgressFromScreenDelta(faceMove('L', 1), 0, -80, camera, faceNormal, anchorPoint)
    const down = dragProgressFromScreenDelta(faceMove('L', 1), 0, 80, camera, faceNormal, anchorPoint)

    expect(up).toBeGreaterThan(0)
    expect(down).toBeLessThan(0)
  })

  it('returns opposite sign for opposite drag direction on the D face', () => {
    const anchorPoint = new THREE.Vector3(0.5, -1.4, 0.5)
    const faceNormal = new THREE.Vector3(0, -1, 0)

    const right = dragProgressFromScreenDelta(faceMove('D', 1), 80, 0, camera, faceNormal, anchorPoint)
    const left = dragProgressFromScreenDelta(faceMove('D', 1), -80, 0, camera, faceNormal, anchorPoint)

    expect(right * left).toBeLessThan(0)
    expect(Math.abs(right)).toBeGreaterThan(0.1)
  })

  it('gives L the same drag sign as R for the same screen motion', () => {
    const rAnchor = new THREE.Vector3(1.4, 0.5, 0.5)
    const lAnchor = new THREE.Vector3(-1.4, 0.5, 0.5)

    const rUp = dragProgressFromScreenDelta(
      faceMove('R', 1),
      0,
      -80,
      camera,
      new THREE.Vector3(1, 0, 0),
      rAnchor,
    )
    const lUp = dragProgressFromScreenDelta(
      faceMove('L', 1),
      0,
      -80,
      camera,
      new THREE.Vector3(-1, 0, 0),
      lAnchor,
    )

    expect(Math.sign(rUp)).toBe(Math.sign(lUp))
  })

  it('gives D the same drag sign as U for the same screen motion', () => {
    const uAnchor = new THREE.Vector3(0.5, 1.4, 0.5)
    const dAnchor = new THREE.Vector3(0.5, -1.4, 0.5)

    const uRight = dragProgressFromScreenDelta(
      faceMove('U', 1),
      80,
      0,
      camera,
      new THREE.Vector3(0, 1, 0),
      uAnchor,
    )
    const dRight = dragProgressFromScreenDelta(
      faceMove('D', 1),
      80,
      0,
      camera,
      new THREE.Vector3(0, -1, 0),
      dAnchor,
    )

    expect(Math.sign(uRight)).toBe(Math.sign(dRight))
  })

  it('gives B the same drag sign as F for the same screen motion', () => {
    const fAnchor = new THREE.Vector3(0.5, 0.5, 1.4)
    const bAnchor = new THREE.Vector3(0.5, 0.5, -1.4)

    const fUp = dragProgressFromScreenDelta(
      faceMove('F', 1),
      0,
      -80,
      camera,
      new THREE.Vector3(0, 0, 1),
      fAnchor,
    )
    const bUp = dragProgressFromScreenDelta(
      faceMove('B', 1),
      0,
      -80,
      camera,
      new THREE.Vector3(0, 0, -1),
      bAnchor,
    )

    expect(Math.sign(fUp)).toBe(Math.sign(bUp))
  })

  it('returns opposite sign for opposite vertical drag on the B face', () => {
    const anchorPoint = new THREE.Vector3(0.5, 0.5, -1.4)
    const faceNormal = new THREE.Vector3(0, 0, -1)

    const up = dragProgressFromScreenDelta(faceMove('B', 1), 0, -80, camera, faceNormal, anchorPoint)
    const down = dragProgressFromScreenDelta(faceMove('B', 1), 0, 80, camera, faceNormal, anchorPoint)

    expect(up * down).toBeLessThan(0)
    expect(Math.abs(up)).toBeGreaterThan(0.1)
  })
})

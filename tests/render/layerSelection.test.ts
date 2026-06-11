import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { getCandidateMovesForCubie } from '../../src/domain'
import { selectMoveFromDrag } from '../../src/render/layerSelection'

describe('layerSelection', () => {
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.set(4, 4, 4)
  camera.lookAt(0, 0, 0)
  camera.updateMatrixWorld()

  const anchor = new THREE.Vector3(1.4, 0, 0)

  it('returns only outer face for a corner cubie shell position', () => {
    const moves = getCandidateMovesForCubie(2, 2, 2, 3)
    const faces = moves
      .filter((m) => m.kind === 'face')
      .map((m) => (m.kind === 'face' ? m.face : ''))
    expect(faces).toEqual(['U', 'R', 'F'])
  })

  it('picks S for vertical drag on the right shell center', () => {
    const move = selectMoveFromDrag({ x: 2, y: 1, z: 1 }, 3, 0, -80, camera, anchor)
    expect(move).toEqual({ kind: 'slice', slice: 'S', turn: 1 })
  })

  it('picks E for horizontal drag on the right shell center', () => {
    const move = selectMoveFromDrag({ x: 2, y: 1, z: 1 }, 3, 80, 0, camera, anchor)
    expect(move).toEqual({ kind: 'slice', slice: 'E', turn: 1 })
  })

  it('picks R over F for vertical drag on a corner cubie', () => {
    const cornerAnchor = new THREE.Vector3(1.4, 1.4, 1.4)
    const move = selectMoveFromDrag({ x: 2, y: 2, z: 2 }, 3, 0, -80, camera, cornerAnchor)
    expect(move).toEqual({ kind: 'face', face: 'R', turn: 1 })
  })

  it('picks S for vertical drag on the left shell center', () => {
    const leftAnchor = new THREE.Vector3(-1.4, 0.5, 0.5)
    const move = selectMoveFromDrag({ x: 0, y: 1, z: 1 }, 3, 0, -80, camera, leftAnchor)
    expect(move).toEqual({ kind: 'slice', slice: 'S', turn: 1 })
  })

  it('includes middle slices for center-layer cubies on a 3x3', () => {
    const moves = getCandidateMovesForCubie(1, 2, 1, 3)
    const slices = moves
      .filter((m) => m.kind === 'slice')
      .map((m) => (m.kind === 'slice' ? m.slice : ''))
    expect(slices).toEqual(['M', 'S'])
    expect(moves).toHaveLength(3)
  })

  it('picks M over U for horizontal drag on the top-middle edge', () => {
    const anchorPoint = new THREE.Vector3(0, 1.4, 0)
    const move = selectMoveFromDrag({ x: 1, y: 2, z: 1 }, 3, 80, 0, camera, anchorPoint)
    expect(move).toEqual({ kind: 'slice', slice: 'M', turn: 1 })
  })
})

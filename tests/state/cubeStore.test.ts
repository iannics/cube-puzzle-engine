import { beforeEach, describe, expect, it } from 'vitest'
import { createSolvedCube, faceMove, type CubeState } from '../../src/domain'
import { useCubeStore } from '../../src/state/cubeStore'

function cubesEqual(a: CubeState, b: CubeState): boolean {
  if (a.size !== b.size || a.cubies.length !== b.cubies.length) return false
  return a.cubies.every((cubieA) => {
    const cubieB = b.cubies.find((c) => c.x === cubieA.x && c.y === cubieA.y && c.z === cubieA.z)
    if (!cubieB) return false
    return JSON.stringify(cubieA.stickers) === JSON.stringify(cubieB.stickers)
  })
}

describe('useCubeStore', () => {
  beforeEach(() => {
    useCubeStore.setState({
      cube: createSolvedCube(3),
      moveHistory: [],
      scrambleNotation: null,
      lastCommittedMove: null,
      pendingScrambleReady: false,
    })
  })

  it('starts with a solved 3x3 cube', () => {
    expect(useCubeStore.getState().cube.size).toBe(3)
    expect(cubesEqual(useCubeStore.getState().cube, createSolvedCube(3))).toBe(true)
  })

  it('commitMove applies domain moves', () => {
    const solved = createSolvedCube(3)
    useCubeStore.setState({ cube: solved })
    useCubeStore.getState().commitMove(faceMove('R', 1))
    const urf = useCubeStore.getState().cube.cubies.find((c) => c.x === 2 && c.y === 2 && c.z === 0)
    expect(urf?.stickers).toEqual({ U: 'green', R: 'red', B: 'white' })
  })

  it('reset creates a solved cube at the requested size', () => {
    useCubeStore.getState().reset(2)
    expect(useCubeStore.getState().cube.size).toBe(2)
    expect(useCubeStore.getState().cube.cubies).toHaveLength(8)
  })

  it('tracks move history on commitMove', () => {
    useCubeStore.getState().commitMove(faceMove('R', 1))
    expect(useCubeStore.getState().moveHistory).toHaveLength(1)
    expect(useCubeStore.getState().lastCommittedMove).toEqual(faceMove('R', 1))
  })

  it('scramble sets notation and clears history', () => {
    useCubeStore.getState().commitMove(faceMove('U', 1))
    useCubeStore.getState().scramble(10, true)
    expect(useCubeStore.getState().moveHistory).toHaveLength(0)
    expect(useCubeStore.getState().scrambleNotation?.split(' ')).toHaveLength(10)
  })

  it('undo reverts the last move', () => {
    useCubeStore.getState().commitMove(faceMove('R', 1))
    const afterR = useCubeStore.getState().cube
    useCubeStore.getState().undo()
    expect(useCubeStore.getState().cube).toEqual(createSolvedCube(3))
    expect(useCubeStore.getState().moveHistory).toHaveLength(0)
    expect(afterR).not.toEqual(createSolvedCube(3))
  })
})

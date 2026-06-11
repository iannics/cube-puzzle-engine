import { beforeEach, describe, expect, it } from 'vitest'
import { createSolvedCube, faceMove, sliceMove } from '../../src/domain'
import { useAnimationStore } from '../../src/state/animationStore'
import { useCubeStore } from '../../src/state/cubeStore'

function resetStores(): void {
  useCubeStore.setState({ cube: createSolvedCube(3) })
  useAnimationStore.setState({
    mode: 'idle',
    activeMove: null,
    progress: 0,
    isDragging: false,
    snapTarget: null,
  })
}

describe('useAnimationStore', () => {
  beforeEach(resetStores)

  it('requestMove starts playing when idle', () => {
    useAnimationStore.getState().requestMove(faceMove('R', 1))
    const state = useAnimationStore.getState()
    expect(state.mode).toBe('playing')
    expect(state.activeMove).toEqual(faceMove('R', 1))
    expect(state.snapTarget).toBe(1)
  })

  it('requestMove is ignored when not idle', () => {
    useAnimationStore.getState().requestMove(faceMove('R', 1))
    useAnimationStore.getState().requestMove(faceMove('U', 1))
    expect(useAnimationStore.getState().activeMove).toEqual(faceMove('R', 1))
  })

  it('completeAnimation commits the active move and returns to idle', () => {
    useAnimationStore.getState().requestMove(faceMove('R', 1))
    useAnimationStore.getState().completeAnimation()
    expect(useAnimationStore.getState().mode).toBe('idle')
    const urf = useCubeStore.getState().cube.cubies.find((c) => c.x === 2 && c.y === 2 && c.z === 0)
    expect(urf?.stickers).toEqual({ U: 'green', R: 'red', B: 'white' })
  })

  it('cancelAnimation returns to idle without committing', () => {
    useAnimationStore.getState().requestMove(faceMove('R', 1))
    useAnimationStore.getState().cancelAnimation()
    expect(useAnimationStore.getState().mode).toBe('idle')
    expect(useCubeStore.getState().cube).toEqual(createSolvedCube(3))
  })

  it('endDrag below threshold snaps back without changing turn', () => {
    useAnimationStore.getState().startDrag(faceMove('R', 1))
    useAnimationStore.getState().updateDragProgress(0.1)
    useAnimationStore.getState().endDrag()
    const state = useAnimationStore.getState()
    expect(state.mode).toBe('playing')
    expect(state.snapTarget).toBe(0)
    expect(state.activeMove).toEqual(faceMove('R', 1))
  })

  it('endDrag above threshold commits turn 1 for positive R drag', () => {
    useAnimationStore.getState().startDrag(faceMove('R', 1))
    useAnimationStore.getState().updateDragProgress(0.5)
    useAnimationStore.getState().endDrag()
    expect(useAnimationStore.getState().activeMove).toEqual(faceMove('R', 1))
    expect(useAnimationStore.getState().snapTarget).toBe(1)
  })

  it('endDrag above threshold commits turn 3 for negative R drag', () => {
    useAnimationStore.getState().startDrag(faceMove('R', 1))
    useAnimationStore.getState().updateDragProgress(-0.5)
    useAnimationStore.getState().endDrag()
    expect(useAnimationStore.getState().activeMove).toEqual(faceMove('R', 3))
  })

  it('endDrag maps positive L drag to turn 3', () => {
    useAnimationStore.getState().startDrag(faceMove('L', 1))
    useAnimationStore.getState().updateDragProgress(0.5)
    useAnimationStore.getState().endDrag()
    expect(useAnimationStore.getState().activeMove).toEqual(faceMove('L', 3))
  })

  it('endDrag maps M slice like L', () => {
    useAnimationStore.getState().startDrag(sliceMove('M', 1))
    useAnimationStore.getState().updateDragProgress(0.5)
    useAnimationStore.getState().endDrag()
    expect(useAnimationStore.getState().activeMove).toEqual(sliceMove('M', 3))
  })

  it('updateDragProgress clamps to [-1, 1]', () => {
    useAnimationStore.getState().startDrag(faceMove('R', 1))
    useAnimationStore.getState().updateDragProgress(2)
    expect(useAnimationStore.getState().progress).toBe(1)
    useAnimationStore.getState().updateDragProgress(-3)
    expect(useAnimationStore.getState().progress).toBe(-1)
  })
})

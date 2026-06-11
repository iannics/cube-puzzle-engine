import { beforeEach, describe, expect, it, vi } from 'vitest'
import { applyMove, createSolvedCube, generateScrambleMoves, inverse } from '../../src/domain'
import { useAnimationStore } from '../../src/state/animationStore'
import { useCubeStore } from '../../src/state/cubeStore'
import { useSessionStore } from '../../src/state/sessionStore'

describe('useSessionStore timer', () => {
  beforeEach(() => {
    useSessionStore.setState({
      timerStatus: 'idle',
      elapsedMs: 0,
      lastSolveMs: null,
      lastSolveMoveCount: null,
      lastSolveScrambleLength: null,
      solveDialogOpen: false,
      playerName: '',
      leaderboard: [],
      startedAt: null,
      tickIntervalId: null,
    })
    useCubeStore.getState().reset()
    useAnimationStore.getState().cancelAnimation()
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    })
  })

  it('transitions to ready after scramble ready', () => {
    useSessionStore.getState().onScrambleReady()
    expect(useSessionStore.getState().timerStatus).toBe('ready')
  })

  it('starts running on first move', () => {
    useSessionStore.getState().onScrambleReady()
    useSessionStore.getState().onFirstMove()
    expect(useSessionStore.getState().timerStatus).toBe('running')
  })

  it('does not start running outside ready state', () => {
    useSessionStore.getState().onFirstMove()
    expect(useSessionStore.getState().timerStatus).toBe('idle')
  })

  it('opens solve dialog when cube is solved', () => {
    const moves = generateScrambleMoves(3, 8)
    let cube = createSolvedCube(3)
    for (const move of moves) {
      cube = applyMove(cube, move)
    }

    useCubeStore.setState({ cube, moveHistory: [] })
    useSessionStore.getState().onScrambleReady()
    useSessionStore.getState().onFirstMove()

    for (let i = moves.length - 1; i >= 0; i--) {
      useCubeStore.getState().commitMove(inverse(moves[i]))
    }

    expect(useSessionStore.getState().timerStatus).toBe('stopped')
    expect(useSessionStore.getState().solveDialogOpen).toBe(true)
    expect(useSessionStore.getState().lastSolveMoveCount).toBe(moves.length)
  })

  it('resets timer on onTimerReset', () => {
    useSessionStore.getState().onScrambleReady()
    useSessionStore.getState().onTimerReset()
    expect(useSessionStore.getState().timerStatus).toBe('idle')
  })
})

describe('scramble animation timer', () => {
  beforeEach(() => {
    useSessionStore.setState({
      timerStatus: 'idle',
      elapsedMs: 0,
      lastSolveMs: null,
      lastSolveMoveCount: null,
      lastSolveScrambleLength: null,
      solveDialogOpen: false,
      playerName: '',
      leaderboard: [],
      startedAt: null,
      tickIntervalId: null,
    })
    useCubeStore.getState().reset()
    useAnimationStore.getState().cancelAnimation()
  })

  it('does not start timer during scramble animation commits', () => {
    useCubeStore.setState({ pendingScrambleReady: true })
    useSessionStore.getState().onScrambleReady()

    useCubeStore.getState().commitMove({ kind: 'face', face: 'R', turn: 1 })
    expect(useSessionStore.getState().timerStatus).toBe('ready')
  })

  it('becomes ready after scramble animation finishes', () => {
    useCubeStore.setState({ pendingScrambleReady: true })
    useCubeStore.getState().finishScrambleAnimation()
    expect(useSessionStore.getState().timerStatus).toBe('ready')
    expect(useCubeStore.getState().moveHistory).toHaveLength(0)
  })
})

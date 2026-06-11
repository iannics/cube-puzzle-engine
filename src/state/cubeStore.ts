import { create } from 'zustand'
import {
  applyMove,
  createSolvedCube,
  formatMoveSequence,
  generateScrambleMoves,
  inverse,
  orientColorToUp,
  type Color,
  type CubeState,
  type Move,
} from '../domain'
import { useAnimationStore } from './animationStore'
import { useSessionStore } from './sessionStore'
import { useUiStore } from './uiStore'

interface CubeStore {
  cube: CubeState
  moveHistory: Move[]
  scrambleNotation: string | null
  lastCommittedMove: Move | null
  pendingScrambleReady: boolean
  commitMove: (move: Move) => void
  reset: (size?: number) => void
  scramble: (moveCount?: number, animate?: boolean) => void
  undo: () => void
  setCube: (cube: CubeState) => void
  clearHistory: () => void
  orientColorUp: (color: Color) => void
  finishScrambleAnimation: () => void
}

function afterUserMoveCommitted(cube: CubeState, moveCount: number): void {
  const session = useSessionStore.getState()
  session.onFirstMove()
  session.checkSolve(cube, moveCount, useUiStore.getState().scrambleMoveCount)
}

export const useCubeStore = create<CubeStore>((set, get) => ({
  cube: createSolvedCube(3),
  moveHistory: [],
  scrambleNotation: null,
  lastCommittedMove: null,
  pendingScrambleReady: false,

  commitMove: (move) => {
    const { cube, pendingScrambleReady, moveHistory } = get()
    const nextCube = applyMove(cube, move)

    if (pendingScrambleReady) {
      set({ cube: nextCube, lastCommittedMove: move })
      return
    }

    const nextHistory = [...moveHistory, move]
    set({ cube: nextCube, moveHistory: nextHistory, lastCommittedMove: move })
    afterUserMoveCommitted(nextCube, nextHistory.length)
  },

  reset: (size = 3) => {
    useAnimationStore.getState().cancelAnimation()
    useSessionStore.getState().onTimerReset()
    set({
      cube: createSolvedCube(size),
      moveHistory: [],
      scrambleNotation: null,
      lastCommittedMove: null,
      pendingScrambleReady: false,
    })
  },

  scramble: (moveCount, animate) => {
    const { cube } = get()
    const count = moveCount ?? 20
    const moves = generateScrambleMoves(cube.size, count)
    const notation = formatMoveSequence(moves)

    useAnimationStore.getState().cancelAnimation()
    useSessionStore.getState().onTimerReset()

    if (animate) {
      set({
        cube: createSolvedCube(cube.size),
        moveHistory: [],
        scrambleNotation: notation,
        lastCommittedMove: null,
        pendingScrambleReady: true,
      })
      useAnimationStore.getState().enqueueMoves(moves)
      return
    }

    const scrambled = moves.reduce((state, move) => applyMove(state, move), createSolvedCube(cube.size))
    set({
      cube: scrambled,
      moveHistory: [],
      scrambleNotation: notation,
      lastCommittedMove: null,
      pendingScrambleReady: false,
    })
    useSessionStore.getState().onScrambleReady()
  },

  undo: () => {
    const { cube, moveHistory } = get()
    if (moveHistory.length === 0) return

    const last = moveHistory[moveHistory.length - 1]
    useAnimationStore.getState().cancelAnimation()
    set({
      cube: applyMove(cube, inverse(last)),
      moveHistory: moveHistory.slice(0, -1),
      lastCommittedMove: moveHistory.length > 1 ? moveHistory[moveHistory.length - 2] : null,
    })
  },

  setCube: (cube) => set({ cube }),

  clearHistory: () => set({ moveHistory: [], scrambleNotation: null, lastCommittedMove: null }),

  orientColorUp: (color) => {
    useAnimationStore.getState().cancelAnimation()
    set((state) => ({
      cube: orientColorToUp(state.cube, color),
    }))
  },

  finishScrambleAnimation: () => {
    const { pendingScrambleReady } = get()
    if (!pendingScrambleReady) return
    set({
      pendingScrambleReady: false,
      moveHistory: [],
      lastCommittedMove: null,
    })
    useSessionStore.getState().onScrambleReady()
  },
}))

import { create } from 'zustand'
import {
  applyMove,
  createSolvedCube,
  formatMoveSequence,
  generateScrambleMoves,
  inverse,
  type CubeState,
  type Move,
} from '../domain'
import { useAnimationStore } from './animationStore'

interface CubeStore {
  cube: CubeState
  moveHistory: Move[]
  scrambleNotation: string | null
  lastCommittedMove: Move | null
  commitMove: (move: Move) => void
  reset: (size?: number) => void
  scramble: (moveCount?: number, animate?: boolean) => void
  undo: () => void
  setCube: (cube: CubeState) => void
  clearHistory: () => void
}

export const useCubeStore = create<CubeStore>((set, get) => ({
  cube: createSolvedCube(3),
  moveHistory: [],
  scrambleNotation: null,
  lastCommittedMove: null,

  commitMove: (move) =>
    set((state) => ({
      cube: applyMove(state.cube, move),
      moveHistory: [...state.moveHistory, move],
      lastCommittedMove: move,
    })),

  reset: (size = 3) => {
    useAnimationStore.getState().cancelAnimation()
    set({
      cube: createSolvedCube(size),
      moveHistory: [],
      scrambleNotation: null,
      lastCommittedMove: null,
    })
  },

  scramble: (moveCount, animate) => {
    const { cube } = get()
    const count = moveCount ?? 20
    const moves = generateScrambleMoves(cube.size, count)
    const notation = formatMoveSequence(moves)

    useAnimationStore.getState().cancelAnimation()

    if (animate) {
      set({
        cube: createSolvedCube(cube.size),
        moveHistory: [],
        scrambleNotation: notation,
        lastCommittedMove: null,
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
    })
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
}))

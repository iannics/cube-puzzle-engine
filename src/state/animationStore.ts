import { create } from 'zustand'
import { faceMove, getDragTurn, sliceMove, type Move } from '../domain'
import { useCubeStore } from './cubeStore'

export type AnimationMode = 'idle' | 'playing' | 'dragging'

interface AnimationStore {
  mode: AnimationMode
  activeMove: Move | null
  progress: number
  /** Linear progress at the start of the current playing segment (for eased visuals). */
  playStartProgress: number
  isDragging: boolean
  snapTarget: 0 | 1 | null
  moveQueue: Move[]
  requestMove: (move: Move) => void
  enqueueMoves: (moves: Move[]) => void
  setProgress: (progress: number) => void
  startDrag: (move: Move) => void
  updateDragProgress: (progress: number) => void
  endDrag: () => void
  completeAnimation: () => void
  cancelAnimation: () => void
}

function startPlayingMove(move: Move, progress = 0): Partial<AnimationStore> {
  return {
    mode: 'playing',
    activeMove: move,
    progress,
    playStartProgress: progress,
    isDragging: false,
    snapTarget: 1,
  }
}

export const useAnimationStore = create<AnimationStore>((set, get) => ({
  mode: 'idle',
  activeMove: null,
  progress: 0,
  playStartProgress: 0,
  isDragging: false,
  snapTarget: null,
  moveQueue: [],

  requestMove: (move) => {
    const { mode } = get()
    if (mode !== 'idle') return
    set(startPlayingMove(move))
  },

  enqueueMoves: (moves) => {
    if (moves.length === 0) return
    const { mode } = get()
    if (mode !== 'idle') return

    const [first, ...rest] = moves
    set({ moveQueue: rest, ...startPlayingMove(first) })
  },

  setProgress: (progress) => {
    const { mode } = get()
    if (mode !== 'playing') return
    set({ progress })
  },

  startDrag: (move) => {
    const { mode } = get()
    if (mode !== 'idle') return

    set({
      mode: 'dragging',
      activeMove: move,
      progress: 0,
      isDragging: true,
      snapTarget: null,
      moveQueue: [],
    })
  },

  updateDragProgress: (progress) => {
    const { mode } = get()
    if (mode !== 'dragging') return
    set({ progress: Math.max(-1, Math.min(1, progress)) })
  },

  endDrag: () => {
    const { mode, progress, activeMove } = get()
    if (mode !== 'dragging' || !activeMove) return

    if (Math.abs(progress) >= 0.25) {
      const turn = getDragTurn(activeMove, progress)
      const nextMove =
        activeMove.kind === 'face'
          ? faceMove(activeMove.face, turn)
          : sliceMove(activeMove.slice, turn)
      const handoff = Math.min(Math.abs(progress), 1)
      set({
        mode: 'playing',
        activeMove: nextMove,
        progress: handoff,
        playStartProgress: handoff,
        isDragging: false,
        snapTarget: 1,
      })
    } else {
      set({
        mode: 'playing',
        isDragging: false,
        snapTarget: 0,
      })
    }
  },

  completeAnimation: () => {
    const { activeMove, moveQueue } = get()
    if (!activeMove) return

    useCubeStore.getState().commitMove(activeMove)

    if (moveQueue.length > 0) {
      const [next, ...rest] = moveQueue
      set({ moveQueue: rest, ...startPlayingMove(next) })
      return
    }

    set({
      mode: 'idle',
      activeMove: null,
      progress: 0,
      playStartProgress: 0,
      isDragging: false,
      snapTarget: null,
      moveQueue: [],
    })
  },

  cancelAnimation: () => {
    set({
      mode: 'idle',
      activeMove: null,
      progress: 0,
      playStartProgress: 0,
      isDragging: false,
      snapTarget: null,
      moveQueue: [],
    })
  },
}))

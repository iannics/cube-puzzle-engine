import { create } from 'zustand'
import { faceMove, type Face, type Move } from '../domain'
import { useCubeStore } from './cubeStore'

export type AnimationMode = 'idle' | 'playing' | 'dragging'

interface AnimationStore {
  mode: AnimationMode
  activeMove: Move | null
  progress: number
  isDragging: boolean
  snapTarget: 0 | 1 | null
  requestMove: (move: Move) => void
  setProgress: (progress: number) => void
  startDrag: (face: Face) => void
  updateDragProgress: (progress: number) => void
  endDrag: () => void
  completeAnimation: () => void
  cancelAnimation: () => void
}

export const useAnimationStore = create<AnimationStore>((set, get) => ({
  mode: 'idle',
  activeMove: null,
  progress: 0,
  isDragging: false,
  snapTarget: null,

  requestMove: (move) => {
    const { mode } = get()
    if (mode !== 'idle') return

    set({
      mode: 'playing',
      activeMove: move,
      progress: 0,
      isDragging: false,
      snapTarget: 1,
    })
  },

  setProgress: (progress) => {
    const { mode } = get()
    if (mode !== 'playing') return
    set({ progress })
  },

  startDrag: (face) => {
    const { mode } = get()
    if (mode !== 'idle') return

    set({
      mode: 'dragging',
      activeMove: faceMove(face, 1),
      progress: 0,
      isDragging: true,
      snapTarget: null,
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
      const turn = progress > 0 ? 1 : 3
      set({
        mode: 'playing',
        activeMove: faceMove(activeMove.face, turn),
        progress: Math.min(Math.abs(progress), 1),
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
    const { activeMove } = get()
    if (!activeMove) return

    useCubeStore.getState().commitMove(activeMove)
    set({
      mode: 'idle',
      activeMove: null,
      progress: 0,
      isDragging: false,
      snapTarget: null,
    })
  },

  cancelAnimation: () => {
    set({
      mode: 'idle',
      activeMove: null,
      progress: 0,
      isDragging: false,
      snapTarget: null,
    })
  },
}))

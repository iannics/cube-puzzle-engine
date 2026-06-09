import { create } from 'zustand'
import { applyMove, createSolvedCube, type CubeState, type Move } from '../domain'

interface CubeStore {
  cube: CubeState
  commitMove: (move: Move) => void
  reset: (size?: number) => void
}

export const useCubeStore = create<CubeStore>((set) => ({
  cube: createSolvedCube(3),
  commitMove: (move) => set((state) => ({ cube: applyMove(state.cube, move) })),
  reset: (size = 3) => set({ cube: createSolvedCube(size) }),
}))

import { create } from 'zustand'

interface TutorialStore {
  activeStep: number
  setActiveStep: (step: number) => void
  reset: () => void
}

export const useTutorialStore = create<TutorialStore>((set) => ({
  activeStep: 0,
  setActiveStep: (step) => set({ activeStep: step }),
  reset: () => set({ activeStep: 0 }),
}))

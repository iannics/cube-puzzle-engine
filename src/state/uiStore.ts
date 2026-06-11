import { create } from 'zustand'
import type { Face } from '../domain/types'

const ONBOARDING_KEY = 'cube-engine-onboarding-complete'

type BrowserGlobals = {
  localStorage?: {
    getItem: (key: string) => string | null
    setItem: (key: string, value: string) => void
    removeItem: (key: string) => void
  }
  matchMedia?: (query: string) => { matches: boolean }
  navigator?: { hardwareConcurrency?: number }
}

function browser(): BrowserGlobals {
  return globalThis as BrowserGlobals & typeof globalThis
}

export type PanelTab = 'history' | 'leaderboard' | 'solver' | 'tutorial'
export type ScrambleLength = 15 | 20 | 25
export type CameraMode = 'view' | 'reset'

export interface CameraRequest {
  face: Face
  mode: CameraMode
  token: number
}

function readOnboardingComplete(): boolean {
  try {
    return browser().localStorage?.getItem(ONBOARDING_KEY) === 'true'
  } catch {
    return false
  }
}

function detectReducedMotion(): boolean {
  try {
    return browser().matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  } catch {
    return false
  }
}

function detectHighQuality(): boolean {
  const cores = browser().navigator?.hardwareConcurrency ?? 4
  return cores >= 4 && !detectReducedMotion()
}

interface UiStore {
  sidebarOpen: boolean
  mobileSheetOpen: boolean
  activePanelTab: PanelTab
  onboardingComplete: boolean
  shortcutsOpen: boolean
  scrambleMoveCount: ScrambleLength
  instantScramble: boolean
  skipResetConfirm: boolean
  reducedMotion: boolean
  highQuality: boolean
  cameraRequest: CameraRequest | null
  preferredUpFace: Face
  hintDismissed: boolean

  toggleSidebar: () => void
  setMobileSheetOpen: (open: boolean) => void
  setActivePanelTab: (tab: PanelTab) => void
  completeOnboarding: (dontShowAgain: boolean) => void
  reopenOnboarding: () => void
  openShortcuts: () => void
  closeShortcuts: () => void
  setScrambleMoveCount: (count: ScrambleLength) => void
  setInstantScramble: (instant: boolean) => void
  setSkipResetConfirm: (skip: boolean) => void
  requestCameraReset: () => void
  requestCameraView: (face: Face) => void
  setPreferredUpFace: (face: Face) => void
  dismissHint: () => void
}

let cameraToken = 0

function nextCameraRequest(face: Face, mode: CameraMode): CameraRequest {
  cameraToken += 1
  return { face, mode, token: cameraToken }
}

export const useUiStore = create<UiStore>((set, get) => ({
  sidebarOpen: true,
  mobileSheetOpen: false,
  activePanelTab: 'history',
  onboardingComplete: readOnboardingComplete(),
  shortcutsOpen: false,
  scrambleMoveCount: 20,
  instantScramble: false,
  skipResetConfirm: false,
  reducedMotion: detectReducedMotion(),
  highQuality: detectHighQuality(),
  cameraRequest: null,
  preferredUpFace: 'U',
  hintDismissed: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setMobileSheetOpen: (open) => set({ mobileSheetOpen: open }),

  setActivePanelTab: (tab) => set({ activePanelTab: tab }),

  completeOnboarding: (dontShowAgain) => {
    if (dontShowAgain) {
      try {
        browser().localStorage?.setItem(ONBOARDING_KEY, 'true')
      } catch {
        // localStorage may be unavailable.
      }
    }
    set({ onboardingComplete: true })
  },

  reopenOnboarding: () => {
    try {
      browser().localStorage?.removeItem(ONBOARDING_KEY)
    } catch {
      // localStorage may be unavailable.
    }
    set({ onboardingComplete: false })
  },

  openShortcuts: () => set({ shortcutsOpen: true }),

  closeShortcuts: () => set({ shortcutsOpen: false }),

  setScrambleMoveCount: (count) => set({ scrambleMoveCount: count }),

  setInstantScramble: (instant) => set({ instantScramble: instant }),

  setSkipResetConfirm: (skip) => set({ skipResetConfirm: skip }),

  requestCameraReset: () => {
    const { preferredUpFace } = get()
    set({ cameraRequest: nextCameraRequest(preferredUpFace, 'reset') })
  },

  requestCameraView: (face) => {
    set({ cameraRequest: nextCameraRequest(face, 'view') })
  },

  setPreferredUpFace: (face) => {
    set({ preferredUpFace: face, cameraRequest: nextCameraRequest(face, 'reset') })
  },

  dismissHint: () => set({ hintDismissed: true }),
}))

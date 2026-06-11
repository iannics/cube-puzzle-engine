import { create } from 'zustand'

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

export type PanelTab = 'history' | 'solver' | 'tutorial'
export type ScrambleLength = 15 | 20 | 25

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
  cameraResetToken: number
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
  dismissHint: () => void
}

export const useUiStore = create<UiStore>((set) => ({
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
  cameraResetToken: 0,
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

  requestCameraReset: () =>
    set((state) => ({ cameraResetToken: state.cameraResetToken + 1 })),

  dismissHint: () => set({ hintDismissed: true }),
}))

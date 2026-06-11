import { create } from 'zustand'
import type { Face } from '../domain/types'
import type { CubeShapeId } from '../render/cubeShapes'
import { DEFAULT_CUBE_SHAPE, getCubeShape, resolveCubeShapeId } from '../render/cubeShapes'
import type { BackgroundThemeId, CubeThemeId } from '../render/themes'
import {
  DEFAULT_BACKGROUND_THEME,
  DEFAULT_CUBE_THEME,
  getBackgroundTheme,
  getCubeTheme,
  isBackgroundThemeId,
  isCubeThemeId,
} from '../render/themes'

const ONBOARDING_KEY = 'cube-engine-onboarding-complete'
const CUBE_THEME_KEY = 'cube-engine-cube-theme'
const BACKGROUND_THEME_KEY = 'cube-engine-background-theme'
const CUBE_SHAPE_KEY = 'cube-engine-cube-shape'

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

function readStoredCubeTheme(): CubeThemeId {
  try {
    const value = browser().localStorage?.getItem(CUBE_THEME_KEY)
    if (value && isCubeThemeId(value)) return value
  } catch {
    // localStorage may be unavailable.
  }
  return DEFAULT_CUBE_THEME
}

function readStoredBackgroundTheme(): BackgroundThemeId {
  try {
    const value = browser().localStorage?.getItem(BACKGROUND_THEME_KEY)
    if (value && isBackgroundThemeId(value)) return value
  } catch {
    // localStorage may be unavailable.
  }
  return DEFAULT_BACKGROUND_THEME
}

function readStoredCubeShape(): CubeShapeId {
  try {
    const value = browser().localStorage?.getItem(CUBE_SHAPE_KEY)
    if (value) {
      const resolved = resolveCubeShapeId(value)
      if (resolved) return resolved
    }
  } catch {
    // localStorage may be unavailable.
  }
  return DEFAULT_CUBE_SHAPE
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
  cubeTheme: CubeThemeId
  backgroundTheme: BackgroundThemeId
  cubeShape: CubeShapeId
  themeAnnouncement: string | null
  appearancePanelOpen: boolean
  mobileAppearanceOpen: boolean

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
  setCubeTheme: (theme: CubeThemeId) => void
  setBackgroundTheme: (theme: BackgroundThemeId) => void
  setCubeShape: (shape: CubeShapeId) => void
  toggleAppearancePanel: () => void
  setAppearancePanelOpen: (open: boolean) => void
  setMobileAppearanceOpen: (open: boolean) => void
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
  cubeTheme: readStoredCubeTheme(),
  backgroundTheme: readStoredBackgroundTheme(),
  cubeShape: readStoredCubeShape(),
  themeAnnouncement: null,
  appearancePanelOpen: false,
  mobileAppearanceOpen: false,

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

  setCubeTheme: (theme) => {
    try {
      browser().localStorage?.setItem(CUBE_THEME_KEY, theme)
    } catch {
      // localStorage may be unavailable.
    }
    set({
      cubeTheme: theme,
      themeAnnouncement: `Cube theme: ${getCubeTheme(theme).name}.`,
    })
  },

  setBackgroundTheme: (theme) => {
    try {
      browser().localStorage?.setItem(BACKGROUND_THEME_KEY, theme)
    } catch {
      // localStorage may be unavailable.
    }
    set({
      backgroundTheme: theme,
      themeAnnouncement: `Background theme: ${getBackgroundTheme(theme).name}.`,
    })
  },

  setCubeShape: (shape) => {
    try {
      browser().localStorage?.setItem(CUBE_SHAPE_KEY, shape)
    } catch {
      // localStorage may be unavailable.
    }
    set({
      cubeShape: shape,
      themeAnnouncement: `Cube shape: ${getCubeShape(shape).name}.`,
    })
  },

  toggleAppearancePanel: () => {
    const isMobile =
      browser().matchMedia?.('(max-width: 767px)').matches ?? false
    const nextOpen = !get().appearancePanelOpen
    set({
      appearancePanelOpen: nextOpen,
      mobileAppearanceOpen: isMobile && nextOpen,
      mobileSheetOpen: isMobile && nextOpen ? false : get().mobileSheetOpen,
    })
  },

  setAppearancePanelOpen: (open) => {
    const isMobile =
      browser().matchMedia?.('(max-width: 767px)').matches ?? false
    set({
      appearancePanelOpen: open,
      mobileAppearanceOpen: isMobile && open,
    })
  },

  setMobileAppearanceOpen: (open) => set({ mobileAppearanceOpen: open }),
}))

import { useUiStore } from '../state'
import { CubeScene } from '../render'
import { FaceOrientationPicker } from './FaceOrientationPicker'
import { Header } from './Header'
import { HintBar } from './HintBar'
import { MobileSheet } from './MobileSheet'
import { BackgroundThemeApplier } from './BackgroundThemeApplier'
import { MoveAnnouncer } from './MoveAnnouncer'
import { ThemeAnnouncer } from './ThemeAnnouncer'
import { OnboardingOverlay } from './OnboardingOverlay'
import { ShortcutsDialog } from './ShortcutsDialog'
import { AppearanceMobileSheet } from './AppearanceMobileSheet'
import { AppearanceSidebar } from './AppearanceSidebar'
import { SidePanel } from './SidePanel'
import { SolveCompleteDialog } from './SolveCompleteDialog'
import { Toolbar } from './Toolbar'
import { useCompactLayoutSync } from './useCompactLayoutSync'
import { useCubeKeyboard } from './useCubeKeyboard'
import { useIsCompact } from './useMediaQuery'

export function AppShell() {
  useCubeKeyboard()
  useCompactLayoutSync()

  const isCompact = useIsCompact()
  const sidebarOpen = useUiStore((state) => state.sidebarOpen)
  const appearancePanelOpen = useUiStore((state) => state.appearancePanelOpen)
  const requestCameraReset = useUiStore((state) => state.requestCameraReset)

  return (
    <div className="grid h-full w-full grid-rows-[auto_1fr_auto]">
      <Header />
      <div className="relative flex min-h-0 overflow-hidden isolate">
        <div className="relative z-0 min-h-0 min-w-0 flex-1 overflow-hidden touch-none">
          <CubeScene onDoubleClick={requestCameraReset} />
          <FaceOrientationPicker />
          <HintBar />
        </div>
        {!isCompact && appearancePanelOpen && <AppearanceSidebar />}
        {!isCompact && sidebarOpen && <SidePanel />}
      </div>
      <Toolbar />
      <MobileSheet />
      <AppearanceMobileSheet />
      <ShortcutsDialog />
      <SolveCompleteDialog />
      <OnboardingOverlay />
      <BackgroundThemeApplier />
      <MoveAnnouncer />
      <ThemeAnnouncer />
    </div>
  )
}

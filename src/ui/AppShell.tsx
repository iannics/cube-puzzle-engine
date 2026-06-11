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
import { useCubeKeyboard } from './useCubeKeyboard'

export function AppShell() {
  useCubeKeyboard()

  const sidebarOpen = useUiStore((state) => state.sidebarOpen)
  const appearancePanelOpen = useUiStore((state) => state.appearancePanelOpen)
  const requestCameraReset = useUiStore((state) => state.requestCameraReset)

  return (
    <div className="app-shell">
      <Header />
      <div className="app-main">
        <div className="canvas-region">
          <CubeScene onDoubleClick={requestCameraReset} />
          <FaceOrientationPicker />
          <HintBar />
        </div>
        {appearancePanelOpen && <AppearanceSidebar />}
        {sidebarOpen && <SidePanel />}
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

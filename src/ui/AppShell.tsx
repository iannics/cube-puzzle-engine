import { useUiStore } from '../state'
import { CubeScene } from '../render'
import { Header } from './Header'
import { HintBar } from './HintBar'
import { MobileSheet } from './MobileSheet'
import { MoveAnnouncer } from './MoveAnnouncer'
import { OnboardingOverlay } from './OnboardingOverlay'
import { ShortcutsDialog } from './ShortcutsDialog'
import { SidePanel } from './SidePanel'
import { Toolbar } from './Toolbar'
import { useCubeKeyboard } from './useCubeKeyboard'

export function AppShell() {
  useCubeKeyboard()

  const sidebarOpen = useUiStore((state) => state.sidebarOpen)
  const requestCameraReset = useUiStore((state) => state.requestCameraReset)

  return (
    <div className="app-shell">
      <Header />
      <div className="app-main">
        <div className="canvas-region">
          <CubeScene onDoubleClick={requestCameraReset} />
          <HintBar />
        </div>
        {sidebarOpen && <SidePanel />}
      </div>
      <Toolbar />
      <MobileSheet />
      <ShortcutsDialog />
      <OnboardingOverlay />
      <MoveAnnouncer />
    </div>
  )
}

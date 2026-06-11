import { useUiStore } from '../state'
import { AppearanceSidebar } from './AppearanceSidebar'

export function AppearanceMobileSheet() {
  const mobileAppearanceOpen = useUiStore((state) => state.mobileAppearanceOpen)
  const setMobileAppearanceOpen = useUiStore((state) => state.setMobileAppearanceOpen)
  const setAppearancePanelOpen = useUiStore((state) => state.setAppearancePanelOpen)

  if (!mobileAppearanceOpen) return null

  const handleClose = () => {
    setMobileAppearanceOpen(false)
    setAppearancePanelOpen(false)
  }

  return (
    <div className="appearance-mobile-sheet-root">
      <div
        className="bottom-sheet-backdrop"
        role="presentation"
        onClick={handleClose}
      />
      <AppearanceSidebar className="bottom-sheet glass-panel" />
    </div>
  )
}

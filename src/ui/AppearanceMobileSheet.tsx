import { useEffect } from 'react'
import { useUiStore } from '../state'
import { AppearanceSidebar } from './AppearanceSidebar'
import { BottomSheet } from './BottomSheet'

export function AppearanceMobileSheet() {
  const mobileAppearanceOpen = useUiStore((state) => state.mobileAppearanceOpen)
  const setMobileAppearanceOpen = useUiStore((state) => state.setMobileAppearanceOpen)
  const setAppearancePanelOpen = useUiStore((state) => state.setAppearancePanelOpen)

  const handleClose = () => {
    setMobileAppearanceOpen(false)
    setAppearancePanelOpen(false)
  }

  useEffect(() => {
    if (!mobileAppearanceOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        handleClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileAppearanceOpen])

  return (
    <BottomSheet open={mobileAppearanceOpen} onClose={handleClose}>
      <AppearanceSidebar
        className="glass-panel min-h-0 w-full flex-1 border-0 border-t border-surface-border"
        onClose={handleClose}
        sheet
      />
    </BottomSheet>
  )
}

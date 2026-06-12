import { useEffect } from 'react'
import { useUiStore } from '../state'
import { BottomSheet } from './BottomSheet'
import { SidePanel } from './SidePanel'

export function MobileSheet() {
  const mobileSheetOpen = useUiStore((state) => state.mobileSheetOpen)
  const setMobileSheetOpen = useUiStore((state) => state.setMobileSheetOpen)

  useEffect(() => {
    if (!mobileSheetOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setMobileSheetOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileSheetOpen, setMobileSheetOpen])

  return (
    <BottomSheet open={mobileSheetOpen} onClose={() => setMobileSheetOpen(false)}>
      <SidePanel
        className="glass-panel min-h-0 w-full flex-1 border-0 border-t border-surface-border"
        onClose={() => setMobileSheetOpen(false)}
        sheet
      />
    </BottomSheet>
  )
}

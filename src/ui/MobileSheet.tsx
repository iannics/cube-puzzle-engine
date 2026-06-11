import { useUiStore } from '../state'
import { SidePanel } from './SidePanel'

export function MobileSheet() {
  const mobileSheetOpen = useUiStore((state) => state.mobileSheetOpen)
  const setMobileSheetOpen = useUiStore((state) => state.setMobileSheetOpen)

  if (!mobileSheetOpen) return null

  return (
    <div className="mobile-sheet-root">
      <div
        className="bottom-sheet-backdrop"
        role="presentation"
        onClick={() => setMobileSheetOpen(false)}
      />
      <SidePanel className="bottom-sheet glass-panel" onClose={() => setMobileSheetOpen(false)} />
    </div>
  )
}

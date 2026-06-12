import { useUiStore } from '../state'
import { Button } from './Button'
import { TimerDisplay } from './TimerDisplay'
import { useIsCompact } from './useMediaQuery'

export function Header() {
  const isCompact = useIsCompact()
  const openShortcuts = useUiStore((state) => state.openShortcuts)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const sidebarOpen = useUiStore((state) => state.sidebarOpen)

  const handlePanelToggle = () => {
    toggleSidebar()
  }

  if (isCompact) {
    return (
      <header
        className="relative z-[60] flex items-center justify-center border-b border-surface-border bg-[rgba(15,17,23,0.85)] px-4 backdrop-blur-sm min-h-[var(--spacing-header)] pt-[env(safe-area-inset-top,0px)]"
      >
        <TimerDisplay />
      </header>
    )
  }

  return (
    <header
      className="relative z-[60] grid grid-cols-[1fr_auto_1fr] items-center border-b border-surface-border bg-[rgba(15,17,23,0.85)] px-4 backdrop-blur-sm min-h-[var(--spacing-header)] pt-[env(safe-area-inset-top,0px)] pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))]"
    >
      <div className="flex items-center gap-3">
        <h1 className="m-0 text-[0.95rem] font-semibold tracking-tight">
          Cube Puzzle Engine
        </h1>
        <span className="rounded-sm border border-surface-border px-2 py-0.5 text-[0.7rem] font-medium text-text-muted">
          3×3
        </span>
      </div>
      <TimerDisplay />
      <div className="flex shrink-0 items-center justify-end gap-2">
        <Button
          icon
          onClick={handlePanelToggle}
          aria-label={sidebarOpen ? 'Hide panel' : 'Show panel'}
          aria-expanded={sidebarOpen}
          title="Toggle panel"
        >
          ☰
        </Button>
        <HeaderAppearanceButton />
        <Button
          icon
          onClick={openShortcuts}
          aria-label="Keyboard shortcuts"
          title="Keyboard shortcuts (?)"
        >
          ?
        </Button>
      </div>
    </header>
  )
}

function HeaderAppearanceButton() {
  const toggleAppearancePanel = useUiStore((state) => state.toggleAppearancePanel)
  const appearancePanelOpen = useUiStore((state) => state.appearancePanelOpen)

  return (
    <Button
      icon
      active={appearancePanelOpen}
      onClick={toggleAppearancePanel}
      aria-label={appearancePanelOpen ? 'Close appearance' : 'Appearance settings'}
      aria-expanded={appearancePanelOpen}
      title="Appearance"
    >
      ◐
    </Button>
  )
}

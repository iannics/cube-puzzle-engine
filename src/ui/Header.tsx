import { useUiStore } from '../state'
import { TimerDisplay } from './TimerDisplay'

export function Header() {
  const openShortcuts = useUiStore((state) => state.openShortcuts)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const sidebarOpen = useUiStore((state) => state.sidebarOpen)
  const mobileSheetOpen = useUiStore((state) => state.mobileSheetOpen)
  const setMobileSheetOpen = useUiStore((state) => state.setMobileSheetOpen)
  const toggleAppearancePanel = useUiStore((state) => state.toggleAppearancePanel)
  const appearancePanelOpen = useUiStore((state) => state.appearancePanelOpen)
  const mobileAppearanceOpen = useUiStore((state) => state.mobileAppearanceOpen)

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <h1 className="app-header__title">
          <span>Cube Puzzle Engine</span>
        </h1>
        <span className="app-header__badge">3×3</span>
      </div>
      <TimerDisplay />
      <div className="app-header__actions">
        <button
          type="button"
          className="btn btn--icon panel-toggle panel-toggle--desktop"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? 'Hide panel' : 'Show panel'}
          aria-expanded={sidebarOpen}
          title="Toggle panel"
        >
          ☰
        </button>
        <button
          type="button"
          className="btn btn--icon panel-toggle panel-toggle--mobile"
          onClick={() => setMobileSheetOpen(!mobileSheetOpen)}
          aria-label={mobileSheetOpen ? 'Hide panel' : 'Show panel'}
          aria-expanded={mobileSheetOpen}
          title="Toggle panel"
        >
          ☰
        </button>
        <button
          type="button"
          className={`btn btn--icon${appearancePanelOpen || mobileAppearanceOpen ? ' btn--active' : ''}`}
          onClick={toggleAppearancePanel}
          aria-label={appearancePanelOpen || mobileAppearanceOpen ? 'Close appearance' : 'Appearance settings'}
          aria-expanded={appearancePanelOpen || mobileAppearanceOpen}
          title="Appearance"
        >
          ◐
        </button>
        <button
          type="button"
          className="btn btn--icon"
          onClick={openShortcuts}
          aria-label="Keyboard shortcuts"
          title="Keyboard shortcuts (?)"
        >
          ?
        </button>
      </div>
    </header>
  )
}

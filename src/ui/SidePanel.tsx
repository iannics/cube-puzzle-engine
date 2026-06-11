import { useUiStore, type PanelTab } from '../state'
import { MoveHistoryPanel } from './MoveHistoryPanel'
import { LeaderboardPanel } from './LeaderboardPanel'
import { PlaceholderPanel } from './PlaceholderPanel'

const TABS: { id: PanelTab; label: string }[] = [
  { id: 'history', label: 'History' },
  { id: 'leaderboard', label: 'Times' },
  { id: 'solver', label: 'Solver' },
  { id: 'tutorial', label: 'Tutorial' },
]

function PanelContent({ tab }: { tab: PanelTab }) {
  switch (tab) {
    case 'history':
      return <MoveHistoryPanel />
    case 'leaderboard':
      return <LeaderboardPanel />
    case 'solver':
      return (
        <PlaceholderPanel
          title="Solver"
          description="Coming soon — step-through algorithms and automatic solve playback."
        />
      )
    case 'tutorial':
      return (
        <PlaceholderPanel
          title="Tutorial"
          description="Coming soon — guided solves and interactive lessons."
        />
      )
  }
}

interface SidePanelProps {
  className?: string
  onClose?: () => void
}

export function SidePanel({ className = '', onClose }: SidePanelProps) {
  const activePanelTab = useUiStore((state) => state.activePanelTab)
  const setActivePanelTab = useUiStore((state) => state.setActivePanelTab)

  return (
    <aside className={`app-sidebar glass-panel ${className}`}>
      <div className="sidebar-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`sidebar-tab${activePanelTab === tab.id ? ' sidebar-tab--active' : ''}`}
            onClick={() => setActivePanelTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        {onClose && (
          <button type="button" className="sidebar-tab" onClick={onClose} aria-label="Close panel">
            ✕
          </button>
        )}
      </div>
      <div className="sidebar-panel">
        <PanelContent tab={activePanelTab} />
      </div>
    </aside>
  )
}

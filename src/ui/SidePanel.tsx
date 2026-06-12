import { useUiStore, type PanelTab } from '../state'
import { MoveHistoryPanel } from './MoveHistoryPanel'
import { LeaderboardPanel } from './LeaderboardPanel'
import { PlaceholderPanel } from './PlaceholderPanel'
import { cn } from './cn'

const TABS: { id: PanelTab; label: string; shortLabel: string }[] = [
  { id: 'history', label: 'History', shortLabel: 'Hist' },
  { id: 'leaderboard', label: 'Times', shortLabel: 'Times' },
  { id: 'solver', label: 'Solver', shortLabel: 'Solve' },
  { id: 'tutorial', label: 'Tutorial', shortLabel: 'Tutor' },
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
  sheet?: boolean
}

export function SidePanel({ className = '', onClose, sheet = false }: SidePanelProps) {
  const activePanelTab = useUiStore((state) => state.activePanelTab)
  const setActivePanelTab = useUiStore((state) => state.setActivePanelTab)

  return (
    <aside
      className={cn(
        'flex shrink-0 flex-col overflow-hidden bg-[rgba(15,17,23,0.75)] backdrop-blur-md',
        sheet
          ? 'w-full border-0'
          : 'w-[var(--spacing-sidebar)] border-l border-surface-border',
        className,
      )}
    >
      <div className="flex border-b border-surface-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={cn(
              'flex-1 border-b-2 border-transparent px-3 py-3 text-xs font-medium text-text-muted lg:text-[0.75rem]',
              'hover:text-text-primary',
              activePanelTab === tab.id && 'border-accent text-text-primary',
            )}
            onClick={() => setActivePanelTab(tab.id)}
          >
            <span className="lg:hidden">{tab.shortLabel}</span>
            <span className="hidden lg:inline">{tab.label}</span>
          </button>
        ))}
        {onClose && (
          <button
            type="button"
            className="border-b-2 border-transparent px-3 py-3 text-xs font-medium text-text-muted hover:text-text-primary lg:text-[0.75rem]"
            onClick={onClose}
            aria-label="Close panel"
          >
            ✕
          </button>
        )}
      </div>
      <div className="flex-1 overflow-auto p-4">
        <PanelContent tab={activePanelTab} />
      </div>
    </aside>
  )
}

import { useSessionStore, useUiStore } from '../state'
import { Button } from './Button'
import { cn } from './cn'

function formatTime(ms: number): string {
  const totalCs = Math.floor(ms / 10)
  const cs = totalCs % 100
  const totalSec = Math.floor(totalCs / 100)
  const sec = totalSec % 60
  const min = Math.floor(totalSec / 60)
  return `${min}:${sec.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`
}

export function SolveCompleteDialog() {
  const solveDialogOpen = useSessionStore((state) => state.solveDialogOpen)
  const lastSolveMs = useSessionStore((state) => state.lastSolveMs)
  const lastSolveMoveCount = useSessionStore((state) => state.lastSolveMoveCount)
  const playerName = useSessionStore((state) => state.playerName)
  const setPlayerName = useSessionStore((state) => state.setPlayerName)
  const saveLastSolve = useSessionStore((state) => state.saveLastSolve)
  const dismissSolveDialog = useSessionStore((state) => state.dismissSolveDialog)
  const setActivePanelTab = useUiStore((state) => state.setActivePanelTab)
  const setMobileSheetOpen = useUiStore((state) => state.setMobileSheetOpen)

  if (!solveDialogOpen || lastSolveMs === null) return null

  const handleSave = () => {
    saveLastSolve()
    setActivePanelTab('leaderboard')
    setMobileSheetOpen(true)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
      role="presentation"
      onClick={dismissSolveDialog}
    >
      <div
        className={cn(
          'glass-panel w-full max-w-md max-h-[85vh] overflow-auto rounded-2xl p-6 text-center',
          'animate-[dialog-enter_0.2s_ease]',
        )}
        role="dialog"
        aria-labelledby="solve-dialog-title"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="mb-2 text-[0.8rem] font-semibold uppercase tracking-wider text-accent-warm">
          Cube solved!
        </p>
        <h2 id="solve-dialog-title" className="mb-2 font-mono text-[2.5rem] font-bold text-accent-warm">
          {formatTime(lastSolveMs)}
        </h2>
        {lastSolveMoveCount !== null && (
          <p className="-mt-2 mb-4 text-[0.9rem] text-text-muted">{lastSolveMoveCount} moves</p>
        )}

        <label htmlFor="solve-dialog-name" className="mb-1 block text-left text-[0.75rem] text-text-muted">
          Save as
        </label>
        <input
          id="solve-dialog-name"
          className="mb-4 w-full rounded-sm border border-surface-border bg-black/25 px-3 py-2 text-[0.85rem] text-text-primary"
          type="text"
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          placeholder="Anonymous"
          maxLength={24}
          autoFocus
        />

        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={dismissSolveDialog}>Skip</Button>
          <Button variant="primary" onClick={handleSave}>
            Save to leaderboard
          </Button>
        </div>
      </div>
    </div>
  )
}

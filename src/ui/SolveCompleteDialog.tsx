import { useSessionStore, useUiStore } from '../state'

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
    <div className="dialog-backdrop" role="presentation" onClick={dismissSolveDialog}>
      <div
        className="dialog glass-panel solve-dialog"
        role="dialog"
        aria-labelledby="solve-dialog-title"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="solve-dialog__badge">Cube solved!</p>
        <h2 id="solve-dialog-title" className="dialog__title">
          {formatTime(lastSolveMs)}
        </h2>
        {lastSolveMoveCount !== null && (
          <p className="solve-dialog__meta">{lastSolveMoveCount} moves</p>
        )}

        <label htmlFor="solve-dialog-name" className="leaderboard__name-label">
          Save as
        </label>
        <input
          id="solve-dialog-name"
          className="leaderboard__name-input"
          type="text"
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          placeholder="Anonymous"
          maxLength={24}
          autoFocus
        />

        <div className="solve-dialog__actions">
          <button type="button" className="btn" onClick={dismissSolveDialog}>
            Skip
          </button>
          <button type="button" className="btn btn--primary" onClick={handleSave}>
            Save to leaderboard
          </button>
        </div>
      </div>
    </div>
  )
}

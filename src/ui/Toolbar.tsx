import { useAnimationStore, useCubeStore, useUiStore } from '../state'

export function Toolbar() {
  const mode = useAnimationStore((state) => state.mode)
  const scramble = useCubeStore((state) => state.scramble)
  const reset = useCubeStore((state) => state.reset)
  const scrambleNotation = useCubeStore((state) => state.scrambleNotation)
  const scrambleMoveCount = useUiStore((state) => state.scrambleMoveCount)
  const instantScramble = useUiStore((state) => state.instantScramble)
  const skipResetConfirm = useUiStore((state) => state.skipResetConfirm)
  const setSkipResetConfirm = useUiStore((state) => state.setSkipResetConfirm)
  const requestCameraReset = useUiStore((state) => state.requestCameraReset)
  const mobileSheetOpen = useUiStore((state) => state.mobileSheetOpen)
  const setMobileSheetOpen = useUiStore((state) => state.setMobileSheetOpen)
  const setScrambleMoveCount = useUiStore((state) => state.setScrambleMoveCount)

  const isBusy = mode !== 'idle'

  const handleScramble = () => {
    scramble(scrambleMoveCount, !instantScramble)
  }

  const handleReset = () => {
    if (!skipResetConfirm && !window.confirm('Reset to solved?')) return
    reset()
  }

  const handleCopyScramble = async () => {
    if (!scrambleNotation) return
    try {
      await navigator.clipboard.writeText(scrambleNotation)
    } catch {
      // Clipboard may be unavailable.
    }
  }

  return (
    <footer className="app-toolbar">
      <label className="sr-only" htmlFor="scramble-length">
        Scramble length
      </label>
      <select
        id="scramble-length"
        className="btn"
        value={scrambleMoveCount}
        onChange={(event) => setScrambleMoveCount(Number(event.target.value) as 15 | 20 | 25)}
        disabled={isBusy}
        title="Scramble length"
        style={{ padding: '0 8px', minWidth: '56px' }}
      >
        <option value={15}>15</option>
        <option value={20}>20</option>
        <option value={25}>25</option>
      </select>
      <button
        type="button"
        className="btn btn--warm"
        onClick={handleScramble}
        disabled={isBusy}
        title="Scramble cube (X)"
      >
        <span className="btn__label">Scramble</span>
      </button>
      <button
        type="button"
        className="btn"
        onClick={handleCopyScramble}
        disabled={!scrambleNotation}
        title="Copy scramble"
      >
        <span className="btn__label">Copy</span>
      </button>
      <button
        type="button"
        className="btn btn--danger"
        onClick={handleReset}
        disabled={isBusy}
        title="Reset to solved (0)"
        onContextMenu={(event) => {
          event.preventDefault()
          setSkipResetConfirm(!skipResetConfirm)
        }}
      >
        <span className="btn__label">Reset</span>
      </button>
      <button
        type="button"
        className="btn"
        onClick={requestCameraReset}
        title="Reset camera view (V)"
      >
        <span className="btn__label">Reset view</span>
      </button>
      <button
        type="button"
        className="btn btn--icon btn--mobile-only"
        onClick={() => setMobileSheetOpen(!mobileSheetOpen)}
        aria-label="Open panel"
        title="Open panel"
      >
        ☰
      </button>
    </footer>
  )
}

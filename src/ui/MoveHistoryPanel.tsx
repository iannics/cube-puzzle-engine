import { formatMove, formatMoveSequence } from '../domain'
import { useCubeStore } from '../state'

export function MoveHistoryPanel() {
  const moveHistory = useCubeStore((state) => state.moveHistory)
  const scrambleNotation = useCubeStore((state) => state.scrambleNotation)

  const sequence = formatMoveSequence(moveHistory)

  const handleCopy = async () => {
    const text = sequence || scrambleNotation
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Clipboard may be unavailable.
    }
  }

  return (
    <div className="move-history">
      {scrambleNotation && (
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Scramble
          </div>
          <div className="move-history__scramble">{scrambleNotation}</div>
        </div>
      )}
      {sequence ? (
        <>
          <div className="move-history__line">{sequence}</div>
          <button type="button" className="btn" onClick={handleCopy}>
            Copy moves
          </button>
        </>
      ) : (
        <p className="move-history__empty">Moves appear here as you turn the cube.</p>
      )}
      {moveHistory.length > 0 && (
        <div className="move-history__list">
          {moveHistory.map((move, index) => (
            <div key={`${index}-${formatMove(move)}`}>{formatMove(move)}</div>
          ))}
        </div>
      )}
    </div>
  )
}

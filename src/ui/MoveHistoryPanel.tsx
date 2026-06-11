import { formatMove, formatMoveSequence } from '../domain'
import { useCubeStore } from '../state'

async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // Clipboard may be unavailable.
  }
}

export function MoveHistoryPanel() {
  const moveHistory = useCubeStore((state) => state.moveHistory)
  const scrambleNotation = useCubeStore((state) => state.scrambleNotation)

  const sequence = formatMoveSequence(moveHistory)

  return (
    <div className="move-history">
      {scrambleNotation && (
        <div className="move-history__section">
          <div className="move-history__label">Scramble</div>
          <div className="move-history__scramble">{scrambleNotation}</div>
          <button
            type="button"
            className="btn"
            onClick={() => copyText(scrambleNotation)}
          >
            Copy scramble
          </button>
        </div>
      )}
      {sequence ? (
        <div className="move-history__section">
          <div className="move-history__label">Moves</div>
          <div className="move-history__line">{sequence}</div>
          <button type="button" className="btn" onClick={() => copyText(sequence)}>
            Copy moves
          </button>
        </div>
      ) : (
        !scrambleNotation && (
          <p className="move-history__empty">Moves appear here as you turn the cube.</p>
        )
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

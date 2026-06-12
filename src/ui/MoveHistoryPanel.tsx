import { formatMove, formatMoveSequence } from '../domain'
import { useCubeStore } from '../state'
import { Button } from './Button'

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
    <div className="flex h-full flex-col gap-3">
      {scrambleNotation && (
        <div className="flex flex-col gap-2">
          <div className="text-[0.75rem] text-text-muted">Scramble</div>
          <div className="break-words font-mono text-[0.8rem] leading-relaxed text-accent-warm">
            {scrambleNotation}
          </div>
          <Button onClick={() => copyText(scrambleNotation)}>Copy scramble</Button>
        </div>
      )}
      {sequence ? (
        <div className="flex flex-col gap-2">
          <div className="text-[0.75rem] text-text-muted">Moves</div>
          <div className="break-words rounded-sm border border-surface-border bg-black/25 p-3 font-mono text-[0.85rem] leading-relaxed">
            {sequence}
          </div>
          <Button onClick={() => copyText(sequence)}>Copy moves</Button>
        </div>
      ) : (
        !scrambleNotation && (
          <p className="text-[0.85rem] leading-relaxed text-text-muted">
            Moves appear here as you turn the cube.
          </p>
        )
      )}
      {moveHistory.length > 0 && (
        <div className="flex-1 overflow-y-auto font-mono text-[0.8rem] leading-loose text-text-muted">
          {moveHistory.map((move, index) => (
            <div key={`${index}-${formatMove(move)}`}>{formatMove(move)}</div>
          ))}
        </div>
      )}
    </div>
  )
}

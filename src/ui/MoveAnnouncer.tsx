import { formatMove } from '../domain'
import { useCubeStore } from '../state'

export function MoveAnnouncer() {
  const lastCommittedMove = useCubeStore((state) => state.lastCommittedMove)

  return (
    <div className="sr-only" aria-live="polite" aria-atomic="true">
      {lastCommittedMove ? `Move: ${formatMove(lastCommittedMove)}` : ''}
    </div>
  )
}

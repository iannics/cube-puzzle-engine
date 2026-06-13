import { useSessionStore } from '../state'
import { Button } from './Button'

function formatTime(ms: number): string {
  const totalCs = Math.floor(ms / 10)
  const cs = totalCs % 100
  const totalSec = Math.floor(totalCs / 100)
  const sec = totalSec % 60
  const min = Math.floor(totalSec / 60)
  return `${min}:${sec.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

export function LeaderboardPanel() {
  const leaderboard = useSessionStore((state) => state.leaderboard)
  const playerName = useSessionStore((state) => state.playerName)
  const setPlayerName = useSessionStore((state) => state.setPlayerName)
  const clearAllLeaderboard = useSessionStore((state) => state.clearAllLeaderboard)

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label htmlFor="player-name" className="mb-1 block text-[0.75rem] text-text-muted">
          Default name
        </label>
        <input
          id="player-name"
          className="w-full rounded-sm border border-surface-border bg-black/25 px-3 py-2 text-[0.85rem] text-text-primary"
          type="text"
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          placeholder="Anonymous"
          maxLength={24}
        />
      </div>

      {leaderboard.length === 0 ? (
        <p className="m-0 text-[0.85rem] leading-relaxed text-text-muted">
          Saved solves will appear here, ranked by time.
        </p>
      ) : (
        <ol className="m-0 flex list-none flex-col gap-2 p-0">
          {leaderboard.map((entry, index) => (
            <li
              key={entry.id}
              className="grid grid-cols-[24px_1fr_auto] grid-rows-[auto_auto] gap-x-2 rounded-sm bg-black/20 p-2 text-[0.8rem]"
            >
              <span className="row-span-2 self-center font-mono font-bold text-text-muted">
                {index + 1}
              </span>
              <span className="truncate font-semibold">{entry.playerName}</span>
              <span className="font-mono font-semibold text-accent-warm">
                {formatTime(entry.timeMs)}
              </span>
              <span className="col-span-2 text-[0.7rem] text-text-muted">
                {entry.moveCount} moves · {entry.scrambleLength} scramble ·{' '}
                {formatDate(entry.completedAt)}
              </span>
            </li>
          ))}
        </ol>
      )}

      {leaderboard.length > 0 && (
        <Button
          variant="danger"
          onClick={() => {
            if (window.confirm('Clear all leaderboard entries?')) {
              clearAllLeaderboard()
            }
          }}
        >
          Clear leaderboard
        </Button>
      )}
    </div>
  )
}

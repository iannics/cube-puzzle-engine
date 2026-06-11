import { useSessionStore } from '../state'

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
    <div className="leaderboard">
      <div className="leaderboard__name">
        <label htmlFor="player-name" className="leaderboard__name-label">
          Default name
        </label>
        <input
          id="player-name"
          className="leaderboard__name-input"
          type="text"
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          placeholder="Anonymous"
          maxLength={24}
        />
      </div>

      {leaderboard.length === 0 ? (
        <p className="leaderboard__empty">Saved solves will appear here, ranked by time.</p>
      ) : (
        <ol className="leaderboard__list">
          {leaderboard.map((entry, index) => (
            <li key={entry.id} className="leaderboard__entry">
              <span className="leaderboard__rank">{index + 1}</span>
              <span className="leaderboard__name-col">{entry.playerName}</span>
              <span className="leaderboard__time">{formatTime(entry.timeMs)}</span>
              <span className="leaderboard__meta">
                {entry.moveCount} moves · {entry.scrambleLength} scramble · {formatDate(entry.completedAt)}
              </span>
            </li>
          ))}
        </ol>
      )}

      {leaderboard.length > 0 && (
        <button
          type="button"
          className="btn btn--danger"
          onClick={() => {
            if (window.confirm('Clear all leaderboard entries?')) {
              clearAllLeaderboard()
            }
          }}
        >
          Clear leaderboard
        </button>
      )}
    </div>
  )
}

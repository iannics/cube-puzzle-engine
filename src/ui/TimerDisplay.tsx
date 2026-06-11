import { useSessionStore, type TimerStatus } from '../state'

function formatTime(ms: number): string {
  const totalCs = Math.floor(ms / 10)
  const cs = totalCs % 100
  const totalSec = Math.floor(totalCs / 100)
  const sec = totalSec % 60
  const min = Math.floor(totalSec / 60)
  return `${min}:${sec.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`
}

function statusClass(status: TimerStatus): string {
  switch (status) {
    case 'idle':
      return 'timer-display--idle'
    case 'ready':
      return 'timer-display--ready'
    case 'running':
      return 'timer-display--running'
    case 'stopped':
      return 'timer-display--stopped'
  }
}

export function TimerDisplay() {
  const timerStatus = useSessionStore((state) => state.timerStatus)
  const elapsedMs = useSessionStore((state) => state.elapsedMs)

  return (
    <div className={`timer-display ${statusClass(timerStatus)}`} aria-live="polite">
      <span className="timer-display__time">{formatTime(elapsedMs)}</span>
      {timerStatus === 'ready' && <span className="timer-display__hint">Go!</span>}
    </div>
  )
}

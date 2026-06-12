import { useSessionStore, type TimerStatus } from '../state'
import { cn } from './cn'

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
      return 'text-text-muted'
    case 'ready':
      return 'text-accent'
    case 'running':
      return 'text-text-primary'
    case 'stopped':
      return 'text-accent-warm'
  }
}

export function TimerDisplay() {
  const timerStatus = useSessionStore((state) => state.timerStatus)
  const elapsedMs = useSessionStore((state) => state.elapsedMs)

  return (
    <div
      className={cn(
        'flex items-center justify-self-center gap-2 font-mono text-sm font-semibold tracking-wide tabular-nums lg:text-[1.05rem]',
        statusClass(timerStatus),
      )}
      aria-live="polite"
    >
      <span>{formatTime(elapsedMs)}</span>
      {timerStatus === 'ready' && (
        <span className="font-sans text-xs font-semibold text-accent">Go!</span>
      )}
    </div>
  )
}

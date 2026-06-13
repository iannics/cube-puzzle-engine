import { useEffect, useState } from 'react'
import { useUiStore } from '../state'
import { cn } from './cn'

const HINT_DURATION_MS = 30_000

export function HintBar() {
  const hintDismissed = useUiStore((state) => state.hintDismissed)
  const dismissHint = useUiStore((state) => state.dismissHint)
  const [exiting, setExiting] = useState(false)
  const [visible, setVisible] = useState(!hintDismissed)

  useEffect(() => {
    if (hintDismissed || !visible) return

    const timer = window.setTimeout(() => {
      setExiting(true)
      window.setTimeout(() => {
        dismissHint()
        setVisible(false)
      }, 400)
    }, HINT_DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [hintDismissed, dismissHint, visible])

  if (!visible || hintDismissed) return null

  return (
    <div
      className={cn(
        'pointer-events-none absolute bottom-4 left-1/2 z-[5] max-w-[calc(100%-1.5rem)] -translate-x-1/2',
        'rounded-2xl border border-surface-border bg-[rgba(15,17,23,0.8)] px-4 py-2',
        'text-center text-[0.8rem] text-text-muted backdrop-blur-sm',
        exiting
          ? 'animate-[hint-fade-out_0.4s_ease_forwards]'
          : 'animate-[hint-fade-in_0.3s_ease]',
      )}
      role="status"
    >
      Drag a face to turn · Drag empty space to orbit · Scroll to zoom · Press ? for shortcuts
    </div>
  )
}

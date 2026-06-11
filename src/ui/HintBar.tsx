import { useEffect, useState } from 'react'
import { useUiStore } from '../state'

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
    <div className={`hint-bar${exiting ? ' hint-bar--exit' : ''}`} role="status">
      Drag a face to turn · Drag empty space to orbit · Scroll to zoom · Press ? for shortcuts
    </div>
  )
}

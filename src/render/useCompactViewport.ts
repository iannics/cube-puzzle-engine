import { useEffect, useState } from 'react'

export const COMPACT_VIEWPORT_QUERY = '(max-width: 1023px)'

export function useCompactViewport(): boolean {
  const [compact, setCompact] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(COMPACT_VIEWPORT_QUERY).matches
  })

  useEffect(() => {
    const media = window.matchMedia(COMPACT_VIEWPORT_QUERY)
    const onChange = () => setCompact(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return compact
}

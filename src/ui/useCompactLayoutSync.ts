import { useEffect } from 'react'
import { useUiStore } from '../state'
import { COMPACT_MEDIA_QUERY } from './useMediaQuery'

export function useCompactLayoutSync(): void {
  const syncCompactLayout = useUiStore((state) => state.syncCompactLayout)

  useEffect(() => {
    const media = window.matchMedia(COMPACT_MEDIA_QUERY)
    const onChange = () => syncCompactLayout(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [syncCompactLayout])
}

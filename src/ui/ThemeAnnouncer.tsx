import { useUiStore } from '../state'

export function ThemeAnnouncer() {
  const themeAnnouncement = useUiStore((state) => state.themeAnnouncement)

  return (
    <div className="sr-only" aria-live="polite" aria-atomic="true">
      {themeAnnouncement ?? ''}
    </div>
  )
}

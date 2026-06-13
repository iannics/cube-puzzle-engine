import { useEffect } from 'react'
import { useUiStore } from '../state/uiStore'
import { BACKGROUND_THEME_IDS, getBackgroundTheme } from '../render/themes'

export function BackgroundThemeApplier() {
  const backgroundTheme = useUiStore((state) => state.backgroundTheme)

  useEffect(() => {
    const body = document.body
    for (const id of BACKGROUND_THEME_IDS) {
      body.classList.remove(getBackgroundTheme(id).cssClass)
    }
    body.classList.add(getBackgroundTheme(backgroundTheme).cssClass)
  }, [backgroundTheme])

  return null
}

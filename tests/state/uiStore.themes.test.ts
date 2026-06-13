import { beforeEach, describe, expect, it } from 'vitest'
import { useUiStore } from '../../src/state/uiStore'

describe('useUiStore themes', () => {
  beforeEach(() => {
    useUiStore.setState({
      cubeTheme: 'classic-studio',
      backgroundTheme: 'midnight-vignette',
      cubeShape: 'modern',
      themeAnnouncement: null,
      appearancePanelOpen: false,
      mobileAppearanceOpen: false,
    })
  })

  it('sets cube theme and announces change', () => {
    useUiStore.getState().setCubeTheme('minimal-matte')
    expect(useUiStore.getState().cubeTheme).toBe('minimal-matte')
    expect(useUiStore.getState().themeAnnouncement).toBe('Cube theme: Minimal Matte.')
  })

  it('sets background theme and announces change', () => {
    useUiStore.getState().setBackgroundTheme('perspective-grid')
    expect(useUiStore.getState().backgroundTheme).toBe('perspective-grid')
    expect(useUiStore.getState().themeAnnouncement).toBe('Background theme: Perspective Grid.')
  })

  it('sets cube shape and announces change', () => {
    useUiStore.getState().setCubeShape('classic')
    expect(useUiStore.getState().cubeShape).toBe('classic')
    expect(useUiStore.getState().themeAnnouncement).toBe('Cube shape: Classic.')
  })

  it('toggles appearance panel independently of main sidebar', () => {
    useUiStore.setState({ sidebarOpen: true, activePanelTab: 'history' })
    useUiStore.getState().toggleAppearancePanel()
    const open = useUiStore.getState()
    expect(open.appearancePanelOpen).toBe(true)
    expect(open.activePanelTab).toBe('history')
    expect(open.sidebarOpen).toBe(true)
  })
})

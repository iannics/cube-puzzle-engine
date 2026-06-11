import { beforeEach, describe, expect, it } from 'vitest'
import { useUiStore } from '../../src/state/uiStore'

describe('useUiStore', () => {
  beforeEach(() => {
    useUiStore.setState({
      shortcutsOpen: false,
      cameraResetToken: 0,
      hintDismissed: false,
    })
  })

  it('opens and closes shortcuts dialog', () => {
    useUiStore.getState().openShortcuts()
    expect(useUiStore.getState().shortcutsOpen).toBe(true)
    useUiStore.getState().closeShortcuts()
    expect(useUiStore.getState().shortcutsOpen).toBe(false)
  })

  it('increments camera reset token', () => {
    useUiStore.getState().requestCameraReset()
    expect(useUiStore.getState().cameraResetToken).toBe(1)
    useUiStore.getState().requestCameraReset()
    expect(useUiStore.getState().cameraResetToken).toBe(2)
  })
})

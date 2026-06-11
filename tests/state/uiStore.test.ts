import { beforeEach, describe, expect, it } from 'vitest'
import { useUiStore } from '../../src/state/uiStore'

describe('useUiStore', () => {
  beforeEach(() => {
    useUiStore.setState({
      shortcutsOpen: false,
      cameraRequest: null,
      preferredUpFace: 'U',
      hintDismissed: false,
    })
  })

  it('opens and closes shortcuts dialog', () => {
    useUiStore.getState().openShortcuts()
    expect(useUiStore.getState().shortcutsOpen).toBe(true)
    useUiStore.getState().closeShortcuts()
    expect(useUiStore.getState().shortcutsOpen).toBe(false)
  })

  it('issues camera reset requests with incrementing tokens', () => {
    useUiStore.getState().requestCameraReset()
    const first = useUiStore.getState().cameraRequest
    expect(first?.mode).toBe('reset')
    expect(first?.face).toBe('U')
    expect(first?.token).toBe(1)

    useUiStore.getState().requestCameraView('F')
    const second = useUiStore.getState().cameraRequest
    expect(second?.mode).toBe('view')
    expect(second?.face).toBe('F')
    expect(second?.token).toBe(2)
  })

  it('sets preferred up face and triggers camera reset', () => {
    useUiStore.getState().setPreferredUpFace('R')
    expect(useUiStore.getState().preferredUpFace).toBe('R')
    expect(useUiStore.getState().cameraRequest?.face).toBe('R')
    expect(useUiStore.getState().cameraRequest?.mode).toBe('reset')
  })
})

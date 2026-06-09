import { useFrame } from '@react-three/fiber'
import { useAnimationStore } from '../state'

const ANIMATION_SPEED = 3

export function AnimationController() {
  useFrame((_, delta) => {
    const state = useAnimationStore.getState()
    if (state.mode !== 'playing' || state.snapTarget === null) return

    if (state.snapTarget === 1) {
      const next = Math.min(1, state.progress + delta * ANIMATION_SPEED)
      state.setProgress(next)
      if (next >= 1) {
        useAnimationStore.getState().completeAnimation()
      }
      return
    }

    const next = Math.max(0, state.progress - delta * ANIMATION_SPEED)
    state.setProgress(next)
    if (next <= 0) {
      useAnimationStore.getState().cancelAnimation()
    }
  })

  return null
}

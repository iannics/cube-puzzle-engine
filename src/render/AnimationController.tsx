import { useFrame } from '@react-three/fiber'
import { useAnimationStore } from '../state'
import { useUiStore } from '../state/uiStore'

/** ~300ms per quarter turn at 60fps. */
const ANIMATION_SPEED = 3.33

export function AnimationController() {
  const reducedMotion = useUiStore((state) => state.reducedMotion)
  const speed = reducedMotion ? ANIMATION_SPEED * 1.5 : ANIMATION_SPEED

  useFrame((_, delta) => {
    const state = useAnimationStore.getState()
    if (state.mode !== 'playing' || state.snapTarget === null) return

    if (state.snapTarget === 1) {
      const next = Math.min(1, state.progress + delta * speed)
      state.setProgress(next)
      if (next >= 1) {
        useAnimationStore.getState().completeAnimation()
      }
      return
    }

    const next = Math.max(0, state.progress - delta * speed)
    state.setProgress(next)
    if (next <= 0) {
      useAnimationStore.getState().cancelAnimation()
    }
  })

  return null
}

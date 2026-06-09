import { useFrame } from '@react-three/fiber'
import { useAnimationStore } from '../state'

const ANIMATION_SPEED = 3

export function AnimationController() {
  const mode = useAnimationStore((state) => state.mode)
  const progress = useAnimationStore((state) => state.progress)
  const snapTarget = useAnimationStore((state) => state.snapTarget)
  const setProgress = useAnimationStore((state) => state.setProgress)
  const completeAnimation = useAnimationStore((state) => state.completeAnimation)
  const cancelAnimation = useAnimationStore((state) => state.cancelAnimation)

  useFrame((_, delta) => {
    if (mode !== 'playing' || snapTarget === null) return

    if (snapTarget === 1) {
      const next = Math.min(1, progress + delta * ANIMATION_SPEED)
      setProgress(next)
      if (next >= 1) {
        completeAnimation()
      }
      return
    }

    const next = Math.max(0, progress - delta * ANIMATION_SPEED)
    setProgress(next)
    if (next <= 0) {
      cancelAnimation()
    }
  })

  return null
}

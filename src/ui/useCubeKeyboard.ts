import { useEffect } from 'react'
import { faceMove, type Face } from '../domain'
import { useAnimationStore } from '../state'

const KEY_TO_FACE: Record<string, Face> = {
  r: 'R',
  l: 'L',
  u: 'U',
  d: 'D',
  f: 'F',
  b: 'B',
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
}

export function useCubeKeyboard(): void {
  const requestMove = useAnimationStore((state) => state.requestMove)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return

      const face = KEY_TO_FACE[event.key.toLowerCase()]
      if (!face) return

      event.preventDefault()
      const turn = event.shiftKey ? 3 : 1
      requestMove(faceMove(face, turn))
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [requestMove])
}

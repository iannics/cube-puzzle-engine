import { useEffect } from 'react'
import { faceMove, sliceMove, type Face, type Move, type Slice } from '../domain'
import { useAnimationStore } from '../state'

const KEY_TO_FACE: Record<string, Face> = {
  r: 'R',
  l: 'L',
  u: 'U',
  d: 'D',
  f: 'F',
  b: 'B',
}

const KEY_TO_SLICE: Record<string, Slice> = {
  m: 'M',
  e: 'E',
  s: 'S',
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
}

function keyToMove(key: string, shiftKey: boolean): Move | null {
  const lower = key.toLowerCase()
  const turn = shiftKey ? 3 : 1
  const face = KEY_TO_FACE[lower]
  if (face) return faceMove(face, turn)
  const slice = KEY_TO_SLICE[lower]
  if (slice) return sliceMove(slice, turn)
  return null
}

export function useCubeKeyboard(): void {
  const requestMove = useAnimationStore((state) => state.requestMove)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return

      const move = keyToMove(event.key, event.shiftKey)
      if (!move) return

      event.preventDefault()
      requestMove(move)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [requestMove])
}

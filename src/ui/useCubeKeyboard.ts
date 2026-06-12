import { useEffect } from 'react'
import { faceMove, sliceMove, type Face, type Move, type Slice } from '../domain'
import { useAnimationStore, useCubeStore, useUiStore } from '../state'

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

function keyToMove(key: string, shiftKey: boolean, halfTurn: boolean): Move | null {
  const lower = key.toLowerCase()
  const turn = halfTurn ? 2 : shiftKey ? 3 : 1
  const face = KEY_TO_FACE[lower]
  if (face) return faceMove(face, turn)
  const slice = KEY_TO_SLICE[lower]
  if (slice) return sliceMove(slice, turn)
  return null
}

export function useCubeKeyboard(): void {
  const requestMove = useAnimationStore((state) => state.requestMove)
  const scramble = useCubeStore((state) => state.scramble)
  const reset = useCubeStore((state) => state.reset)
  const undo = useCubeStore((state) => state.undo)
  const scrambleMoveCount = useUiStore((state) => state.scrambleMoveCount)
  const instantScramble = useUiStore((state) => state.instantScramble)
  const openShortcuts = useUiStore((state) => state.openShortcuts)
  const closeShortcuts = useUiStore((state) => state.closeShortcuts)
  const shortcutsOpen = useUiStore((state) => state.shortcutsOpen)
  const requestCameraReset = useUiStore((state) => state.requestCameraReset)

  useEffect(() => {
    let halfTurnNext = false

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return

      if (shortcutsOpen && event.key === 'Escape') {
        event.preventDefault()
        closeShortcuts()
        return
      }

      if (event.key === '?' || (event.key === '/' && event.shiftKey)) {
        event.preventDefault()
        openShortcuts()
        return
      }

      if (event.key === 'v' || event.key === 'V') {
        event.preventDefault()
        requestCameraReset()
        return
      }

      if (event.key === 'x' || event.key === 'X') {
        if (event.ctrlKey || event.metaKey) return
        event.preventDefault()
        if (useAnimationStore.getState().mode === 'idle') {
          scramble(scrambleMoveCount, !instantScramble)
        }
        return
      }

      if (event.key === '0') {
        event.preventDefault()
        reset()
        return
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault()
        if (useAnimationStore.getState().mode === 'idle') {
          undo()
        }
        return
      }

      if (event.key === '2') {
        halfTurnNext = true
        return
      }

      const move = keyToMove(event.key, event.shiftKey, halfTurnNext)
      halfTurnNext = false
      if (!move) return

      event.preventDefault()
      requestMove(move)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [
    requestMove,
    scramble,
    reset,
    undo,
    scrambleMoveCount,
    instantScramble,
    openShortcuts,
    closeShortcuts,
    shortcutsOpen,
    requestCameraReset,
  ])
}

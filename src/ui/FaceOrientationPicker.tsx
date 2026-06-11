import type { Color } from '../domain/types'
import { getCubeTheme } from '../render/themes'
import { useAnimationStore, useCubeStore, useUiStore } from '../state'

const COLOR_BUTTONS: { color: Color; label: string }[] = [
  { color: 'white', label: 'White up' },
  { color: 'green', label: 'Green up' },
  { color: 'red', label: 'Red up' },
  { color: 'blue', label: 'Blue up' },
  { color: 'orange', label: 'Orange up' },
  { color: 'yellow', label: 'Yellow up' },
]

export function FaceOrientationPicker() {
  const mode = useAnimationStore((state) => state.mode)
  const orientColorUp = useCubeStore((state) => state.orientColorUp)
  const cubeTheme = useUiStore((state) => state.cubeTheme)
  const faceHex = getCubeTheme(cubeTheme).faceHex
  const isBusy = mode !== 'idle'

  return (
    <div className="face-picker glass-panel">
      <span className="face-picker__label">Face up</span>
      <div className="face-picker__faces" role="group" aria-label="Choose face color to put on top">
        {COLOR_BUTTONS.map(({ color, label }) => (
          <button
            key={color}
            type="button"
            className="face-picker__face"
            style={{ backgroundColor: faceHex[color] }}
            onClick={() => orientColorUp(color)}
            disabled={isBusy}
            title={label}
            aria-label={label}
          />
        ))}
      </div>
    </div>
  )
}

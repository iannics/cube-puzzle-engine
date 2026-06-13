import type { Color } from '../domain/types'
import { getCubeTheme } from '../render/themes'
import { useAnimationStore, useCubeStore, useUiStore } from '../state'
import { cn } from './cn'
import { useIsCompact } from './useMediaQuery'

const COLOR_BUTTONS: { color: Color; label: string }[] = [
  { color: 'white', label: 'White up' },
  { color: 'green', label: 'Green up' },
  { color: 'red', label: 'Red up' },
  { color: 'blue', label: 'Blue up' },
  { color: 'orange', label: 'Orange up' },
  { color: 'yellow', label: 'Yellow up' },
]

export function FaceOrientationPicker() {
  const isCompact = useIsCompact()
  const mode = useAnimationStore((state) => state.mode)
  const orientColorUp = useCubeStore((state) => state.orientColorUp)
  const cubeTheme = useUiStore((state) => state.cubeTheme)
  const mobileSheetOpen = useUiStore((state) => state.mobileSheetOpen)
  const mobileAppearanceOpen = useUiStore((state) => state.mobileAppearanceOpen)
  const faceHex = getCubeTheme(cubeTheme).faceHex
  const isBusy = mode !== 'idle'

  const sheetOpen = isCompact && (mobileSheetOpen || mobileAppearanceOpen)
  if (sheetOpen) return null

  return (
    <div
      className={cn(
        'glass-panel absolute z-[5] rounded-md p-2',
        'max-lg:top-8 max-lg:left-1/2 max-lg:-translate-x-1/2 lg:top-4 lg:left-4',
      )}
    >
      <span className="mb-2 block text-center text-[0.7rem] font-semibold uppercase tracking-wider text-text-muted">
        Face up
      </span>
      <div
        className="flex justify-center gap-1"
        role="group"
        aria-label="Choose face color to put on top"
      >
        {COLOR_BUTTONS.map(({ color, label }) => (
          <button
            key={color}
            type="button"
            className={cn(
              'size-6 cursor-pointer rounded-sm border-2 border-black/35 p-0 text-[0.6rem] font-bold leading-none text-black/65 lg:size-7 lg:text-[0.65rem]',
              'disabled:cursor-not-allowed disabled:opacity-45',
            )}
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

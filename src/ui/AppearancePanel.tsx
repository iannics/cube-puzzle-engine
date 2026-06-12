import type { KeyboardEvent } from 'react'
import { useUiStore } from '../state'
import type { CubeShapeId } from '../render/cubeShapes'
import { CUBE_SHAPE_IDS, getCubeShape } from '../render/cubeShapes'
import type { BackgroundThemeId, CubeThemeId } from '../render/themes'
import {
  BACKGROUND_THEME_IDS,
  CUBE_THEME_IDS,
  getBackgroundTheme,
  getCubeTheme,
} from '../render/themes'
import { cn } from './cn'

const CUBE_PREVIEW_COLORS: Record<CubeThemeId, string[]> = {
  'classic-studio': ['#ffffff', '#ffd500', '#b71234', '#ff5800', '#0046ad', '#009b48'],
  'minimal-matte': ['#f2f2f0', '#e8c84a', '#c43a52', '#e07030', '#3a5f9e', '#3a8f62'],
}

const CUBE_BODY_PREVIEW: Record<CubeThemeId, string> = {
  'classic-studio': '#12151c',
  'minimal-matte': '#2a2d34',
}

const BG_PREVIEW_CLASS: Record<BackgroundThemeId, string> = {
  'midnight-vignette': 'appearance-preview-bg--midnight',
  'perspective-grid': 'appearance-preview-bg--grid',
}

const SHAPE_PREVIEW_CLASS: Record<CubeShapeId, string> = {
  modern: 'appearance-shape-preview--modern',
  classic: 'appearance-shape-preview--classic',
  inset: 'appearance-shape-preview--inset',
}

const cardBase = cn(
  'relative flex cursor-pointer flex-col items-stretch gap-1 rounded-md border border-surface-border',
  'bg-black/20 p-2 text-left text-text-primary transition-[border-color,box-shadow] duration-150',
  'hover:border-white/20 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
)

function cardActive(selected: boolean): string {
  return selected ? 'border-accent shadow-[0_0_0_1px_var(--color-accent)]' : ''
}

function CubeThemeCard({
  id,
  selected,
  onSelect,
}: {
  id: CubeThemeId
  selected: boolean
  onSelect: () => void
}) {
  const theme = getCubeTheme(id)

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect()
    }
  }

  return (
    <button
      type="button"
      className={cn(cardBase, 'min-h-[88px]', cardActive(selected))}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      aria-pressed={selected}
      title={theme.description}
    >
      <div className="aspect-square overflow-hidden rounded-sm">
        <div
          className="grid h-full w-full grid-cols-3 gap-0.5 p-1.5"
          style={{ backgroundColor: CUBE_BODY_PREVIEW[id] }}
        >
          {CUBE_PREVIEW_COLORS[id].map((color) => (
            <span key={color} className="rounded-[2px]" style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>
      <span className="text-[0.8rem] font-semibold">{theme.name}</span>
      <span className="line-clamp-2 text-[0.7rem] leading-snug text-text-muted">{theme.description}</span>
      {selected && (
        <span
          className="absolute top-2 right-2 flex size-[18px] items-center justify-center rounded-full bg-accent text-[0.65rem] font-bold text-white"
          aria-hidden="true"
        >
          ✓
        </span>
      )}
    </button>
  )
}

function BackgroundThemeCard({
  id,
  selected,
  onSelect,
}: {
  id: BackgroundThemeId
  selected: boolean
  onSelect: () => void
}) {
  const theme = getBackgroundTheme(id)

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect()
    }
  }

  return (
    <button
      type="button"
      className={cn(cardBase, 'min-h-[88px] shrink-0 basis-[100px] snap-start', cardActive(selected))}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      aria-pressed={selected}
      title={theme.description}
    >
      <div className={cn('aspect-[16/10] min-h-14 overflow-hidden rounded-sm', BG_PREVIEW_CLASS[id])} />
      <span className="text-[0.8rem] font-semibold">{theme.name}</span>
      {selected && (
        <span
          className="absolute top-2 right-2 flex size-[18px] items-center justify-center rounded-full bg-accent text-[0.65rem] font-bold text-white"
          aria-hidden="true"
        >
          ✓
        </span>
      )}
    </button>
  )
}

function CubeShapeCard({
  id,
  selected,
  onSelect,
}: {
  id: CubeShapeId
  selected: boolean
  onSelect: () => void
}) {
  const shape = getCubeShape(id)

  return (
    <button
      type="button"
      className={cn(cardBase, 'min-h-[72px]', cardActive(selected))}
      onClick={onSelect}
      aria-pressed={selected}
      title={shape.description}
    >
      <div className="flex aspect-[16/7] items-center justify-center overflow-hidden rounded-sm bg-black/25">
        <div className={cn('appearance-shape-preview', SHAPE_PREVIEW_CLASS[id])} />
      </div>
      <span className="text-[0.8rem] font-semibold">{shape.name}</span>
      <span className="line-clamp-2 text-[0.7rem] leading-snug text-text-muted">{shape.description}</span>
      {selected && (
        <span
          className="absolute top-2 right-2 flex size-[18px] items-center justify-center rounded-full bg-accent text-[0.65rem] font-bold text-white"
          aria-hidden="true"
        >
          ✓
        </span>
      )}
    </button>
  )
}

export function AppearancePanel() {
  const cubeTheme = useUiStore((state) => state.cubeTheme)
  const backgroundTheme = useUiStore((state) => state.backgroundTheme)
  const cubeShape = useUiStore((state) => state.cubeShape)
  const setCubeTheme = useUiStore((state) => state.setCubeTheme)
  const setBackgroundTheme = useUiStore((state) => state.setBackgroundTheme)
  const setCubeShape = useUiStore((state) => state.setCubeShape)

  return (
    <div className="flex flex-col gap-5">
      <section>
        <h3 className="mb-3 text-[0.75rem] font-semibold uppercase tracking-wider text-text-muted">
          Cube Shape
        </h3>
        <div className="grid grid-cols-1 gap-2" role="listbox" aria-label="Cube shape">
          {CUBE_SHAPE_IDS.map((id) => (
            <CubeShapeCard
              key={id}
              id={id}
              selected={cubeShape === id}
              onSelect={() => setCubeShape(id)}
            />
          ))}
        </div>
      </section>
      <section>
        <h3 className="mb-3 text-[0.75rem] font-semibold uppercase tracking-wider text-text-muted">
          Cube Theme
        </h3>
        <div className="grid grid-cols-2 gap-2" role="listbox" aria-label="Cube theme">
          {CUBE_THEME_IDS.map((id) => (
            <CubeThemeCard
              key={id}
              id={id}
              selected={cubeTheme === id}
              onSelect={() => setCubeTheme(id)}
            />
          ))}
        </div>
      </section>
      <section>
        <h3 className="mb-3 text-[0.75rem] font-semibold uppercase tracking-wider text-text-muted">
          Background
        </h3>
        <div
          className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]"
          role="listbox"
          aria-label="Background theme"
        >
          {BACKGROUND_THEME_IDS.map((id) => (
            <BackgroundThemeCard
              key={id}
              id={id}
              selected={backgroundTheme === id}
              onSelect={() => setBackgroundTheme(id)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

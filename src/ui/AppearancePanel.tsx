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
      className={`appearance-card${selected ? ' appearance-card--active' : ''}`}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      aria-pressed={selected}
      title={theme.description}
    >
      <div className="appearance-card__preview appearance-card__preview--cube">
        <div
          className="appearance-cube-preview"
          style={{ backgroundColor: CUBE_BODY_PREVIEW[id] }}
        >
          {CUBE_PREVIEW_COLORS[id].map((color) => (
            <span key={color} className="appearance-cube-preview__sticker" style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>
      <span className="appearance-card__name">{theme.name}</span>
      <span className="appearance-card__desc">{theme.description}</span>
      {selected && <span className="appearance-card__check" aria-hidden="true">✓</span>}
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

  return (
    <button
      type="button"
      className={`appearance-card appearance-card--bg${selected ? ' appearance-card--active' : ''}`}
      onClick={onSelect}
      aria-pressed={selected}
      title={theme.description}
    >
      <div className={`appearance-card__preview appearance-card__preview--bg ${BG_PREVIEW_CLASS[id]}`} />
      <span className="appearance-card__name">{theme.name}</span>
      {selected && <span className="appearance-card__check" aria-hidden="true">✓</span>}
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
      className={`appearance-card appearance-card--shape${selected ? ' appearance-card--active' : ''}`}
      onClick={onSelect}
      aria-pressed={selected}
      title={shape.description}
    >
      <div className="appearance-card__preview appearance-card__preview--shape">
        <div className={`appearance-shape-preview ${SHAPE_PREVIEW_CLASS[id]}`} />
      </div>
      <span className="appearance-card__name">{shape.name}</span>
      <span className="appearance-card__desc">{shape.description}</span>
      {selected && <span className="appearance-card__check" aria-hidden="true">✓</span>}
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
    <div className="appearance-panel">
      <section className="appearance-section">
        <h3 className="appearance-section__title">Cube Shape</h3>
        <div className="appearance-grid appearance-grid--shapes" role="listbox" aria-label="Cube shape">
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
      <section className="appearance-section">
        <h3 className="appearance-section__title">Cube Theme</h3>
        <div className="appearance-grid" role="listbox" aria-label="Cube theme">
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
      <section className="appearance-section">
        <h3 className="appearance-section__title">Background</h3>
        <div className="appearance-strip" role="listbox" aria-label="Background theme">
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

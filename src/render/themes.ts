import type { Color } from '../domain/types'

export type CubeThemeId = 'classic-studio' | 'minimal-matte'
export type BackgroundThemeId = 'midnight-vignette' | 'perspective-grid'

export interface CubeLightingConfig {
  ambientIntensity: number
  keyIntensity: number
  keyColor: string
  fillIntensity: number
  fillColor: string
  environmentIntensity: number
}

export interface CubeThemeConfig {
  id: CubeThemeId
  name: string
  description: string
  faceHex: Record<Color, string>
  bodyHex: string
  bodyRoughness: number
  bodyMetalness: number
  stickerRoughness: number
  cubieGap: number
  lighting: CubeLightingConfig
}

export interface BackgroundThemeConfig {
  id: BackgroundThemeId
  name: string
  description: string
  cssClass: string
}

const CLASSIC_FACE_HEX: Record<Color, string> = {
  white: '#ffffff',
  yellow: '#ffd500',
  red: '#b71234',
  orange: '#ff5800',
  blue: '#0046ad',
  green: '#009b48',
}

const DEFAULT_LIGHTING: CubeLightingConfig = {
  ambientIntensity: 0.25,
  keyIntensity: 1.2,
  keyColor: '#fff8f0',
  fillIntensity: 0.35,
  fillColor: '#c8d4ff',
  environmentIntensity: 0.35,
}

export const CUBE_THEMES: Record<CubeThemeId, CubeThemeConfig> = {
  'classic-studio': {
    id: 'classic-studio',
    name: 'Classic Studio',
    description: 'Dark plastic with vivid WCA sticker colors.',
    faceHex: CLASSIC_FACE_HEX,
    bodyHex: '#12151c',
    bodyRoughness: 0.45,
    bodyMetalness: 0.05,
    stickerRoughness: 0.35,
    cubieGap: 0.05,
    lighting: DEFAULT_LIGHTING,
  },
  'minimal-matte': {
    id: 'minimal-matte',
    name: 'Minimal Matte',
    description: 'Calm matte finish with desaturated tones.',
    faceHex: {
      white: '#f2f2f0',
      yellow: '#e8c84a',
      red: '#c43a52',
      orange: '#e07030',
      green: '#3a8f62',
      blue: '#3a5f9e',
    },
    bodyHex: '#2a2d34',
    bodyRoughness: 0.72,
    bodyMetalness: 0,
    stickerRoughness: 0.72,
    cubieGap: 0.05,
    lighting: {
      ambientIntensity: 0.3,
      keyIntensity: 1.0,
      keyColor: '#fff8f0',
      fillIntensity: 0.25,
      fillColor: '#c8d4ff',
      environmentIntensity: 0.2,
    },
  },
}

export const BACKGROUND_THEMES: Record<BackgroundThemeId, BackgroundThemeConfig> = {
  'midnight-vignette': {
    id: 'midnight-vignette',
    name: 'Midnight Vignette',
    description: 'Soft dark radial gradient.',
    cssClass: 'bg-theme--midnight-vignette',
  },
  'perspective-grid': {
    id: 'perspective-grid',
    name: 'Perspective Grid',
    description: 'Architectural floor grid.',
    cssClass: 'bg-theme--perspective-grid',
  },
}

export const CUBE_THEME_IDS = Object.keys(CUBE_THEMES) as CubeThemeId[]
export const BACKGROUND_THEME_IDS = Object.keys(BACKGROUND_THEMES) as BackgroundThemeId[]

export const DEFAULT_CUBE_THEME: CubeThemeId = 'classic-studio'
export const DEFAULT_BACKGROUND_THEME: BackgroundThemeId = 'midnight-vignette'

export function getCubeTheme(id: CubeThemeId): CubeThemeConfig {
  return CUBE_THEMES[id]
}

export function getBackgroundTheme(id: BackgroundThemeId): BackgroundThemeConfig {
  return BACKGROUND_THEMES[id]
}

export function isCubeThemeId(value: string): value is CubeThemeId {
  return value in CUBE_THEMES
}

export function isBackgroundThemeId(value: string): value is BackgroundThemeId {
  return value in BACKGROUND_THEMES
}

/** Relative luminance per WCAG 2.x */
function luminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const linearize = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  const [lr, lg, lb] = [linearize(r), linearize(g), linearize(b)]
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb
}

/** WCAG contrast ratio between two hex colors */
export function contrastRatio(hexA: string, hexB: string): number {
  const l1 = luminance(hexA)
  const l2 = luminance(hexB)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

const ADJACENT_STICKER_PAIRS: [Color, Color][] = [
  ['white', 'red'],
  ['white', 'green'],
  ['white', 'orange'],
  ['white', 'blue'],
  ['yellow', 'red'],
  ['yellow', 'green'],
  ['yellow', 'orange'],
  ['yellow', 'blue'],
  ['red', 'green'],
  ['red', 'blue'],
  ['orange', 'green'],
  ['orange', 'blue'],
  ['green', 'blue'],
  ['green', 'yellow'],
]

const MIN_STICKER_CONTRAST = 1.5
const MIN_STICKER_CONTRAST_WITH_HUE = 1.1
const MIN_HUE_SEPARATION_DEG = 25

function hexToHue(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  if (max === min) return 0
  const d = max - min
  let h: number
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return h * 360
}

function hueSeparation(hexA: string, hexB: string): number {
  const diff = Math.abs(hexToHue(hexA) - hexToHue(hexB))
  return Math.min(diff, 360 - diff)
}

function stickersAreDistinguishable(hexA: string, hexB: string): boolean {
  const ratio = contrastRatio(hexA, hexB)
  if (ratio >= MIN_STICKER_CONTRAST) return true
  if (ratio >= MIN_STICKER_CONTRAST_WITH_HUE && hueSeparation(hexA, hexB) >= MIN_HUE_SEPARATION_DEG) {
    return true
  }
  return false
}

export function validateCubeThemeContrast(theme: CubeThemeConfig): { ok: boolean; failures: string[] } {
  const failures: string[] = []
  for (const [a, b] of ADJACENT_STICKER_PAIRS) {
    if (!stickersAreDistinguishable(theme.faceHex[a], theme.faceHex[b])) {
      const ratio = contrastRatio(theme.faceHex[a], theme.faceHex[b])
      failures.push(`${a}/${b}: contrast ${ratio.toFixed(2)}, hue ${hueSeparation(theme.faceHex[a], theme.faceHex[b]).toFixed(0)}°`)
    }
  }
  const saturatedColors: Color[] = ['red', 'orange', 'blue', 'green']
  const bodyStickerMin = Math.min(
    ...saturatedColors.map((c) => contrastRatio(theme.bodyHex, theme.faceHex[c])),
  )
  if (bodyStickerMin < 1.5) {
    failures.push(`body/sticker min: ${bodyStickerMin.toFixed(2)} < 1.5`)
  }
  return { ok: failures.length === 0, failures }
}

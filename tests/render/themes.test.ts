import { describe, expect, it } from 'vitest'
import {
  CUBE_THEME_IDS,
  CUBE_THEMES,
  contrastRatio,
  validateCubeThemeContrast,
} from '../../src/render/themes'

describe('cube theme contrast', () => {
  it('validates all cube themes meet minimum contrast requirements', () => {
    for (const id of CUBE_THEME_IDS) {
      const result = validateCubeThemeContrast(CUBE_THEMES[id])
      expect(result.ok, `${id}: ${result.failures.join(', ')}`).toBe(true)
    }
  })

  it('reports sufficient contrast between edge-adjacent white and red in classic theme', () => {
    const theme = CUBE_THEMES['classic-studio']
    expect(contrastRatio(theme.faceHex.white, theme.faceHex.red)).toBeGreaterThanOrEqual(1.5)
  })

  it('reports sufficient contrast between edge-adjacent green and yellow in minimal matte', () => {
    const theme = CUBE_THEMES['minimal-matte']
    expect(contrastRatio(theme.faceHex.green, theme.faceHex.yellow)).toBeGreaterThanOrEqual(1.5)
  })
})

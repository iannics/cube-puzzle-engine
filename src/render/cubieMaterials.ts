import * as THREE from 'three'
import type { Color } from '../domain/types'
import {
  BODY_METALNESS,
  BODY_ROUGHNESS,
  FACE_HEX,
  HIDDEN_FACE_HEX,
  STICKER_ROUGHNESS,
} from './colors'
import type { CubeThemeId } from './themes'
import { DEFAULT_CUBE_THEME, getCubeTheme } from './themes'

type MaterialCache = {
  body: THREE.MeshStandardMaterial
  stickers: Map<Color, THREE.MeshStandardMaterial>
}

const themeCaches = new Map<CubeThemeId, MaterialCache>()

function createBodyMaterial(themeId: CubeThemeId): THREE.MeshStandardMaterial {
  const theme = getCubeTheme(themeId)
  return new THREE.MeshStandardMaterial({
    color: theme.bodyHex,
    roughness: theme.bodyRoughness,
    metalness: theme.bodyMetalness,
    side: THREE.FrontSide,
    depthTest: true,
    depthWrite: true,
  })
}

function createStickerMaterial(themeId: CubeThemeId, color: Color): THREE.MeshStandardMaterial {
  const theme = getCubeTheme(themeId)
  return new THREE.MeshStandardMaterial({
    color: theme.faceHex[color],
    roughness: theme.stickerRoughness,
    metalness: 0,
    side: THREE.FrontSide,
    depthTest: true,
    depthWrite: true,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -1,
  })
}

function getThemeCache(themeId: CubeThemeId): MaterialCache {
  let cache = themeCaches.get(themeId)
  if (!cache) {
    cache = {
      body: createBodyMaterial(themeId),
      stickers: new Map(),
    }
    themeCaches.set(themeId, cache)
  }
  return cache
}

export function getBodyMaterial(themeId: CubeThemeId = DEFAULT_CUBE_THEME): THREE.MeshStandardMaterial {
  return getThemeCache(themeId).body
}

export function getStickerMaterial(
  color: Color,
  themeId: CubeThemeId = DEFAULT_CUBE_THEME,
): THREE.MeshStandardMaterial {
  const cache = getThemeCache(themeId)
  let material = cache.stickers.get(color)
  if (!material) {
    material = createStickerMaterial(themeId, color)
    cache.stickers.set(color, material)
  }
  return material
}

/** Classic defaults — backward-compatible exports for 2D UI swatches */
export function getClassicFaceHex(): Record<Color, string> {
  return { ...FACE_HEX }
}

export function getClassicHiddenFaceHex(): string {
  return HIDDEN_FACE_HEX
}

export function getClassicBodyRoughness(): number {
  return BODY_ROUGHNESS
}

export function getClassicBodyMetalness(): number {
  return BODY_METALNESS
}

export function getClassicStickerRoughness(): number {
  return STICKER_ROUGHNESS
}

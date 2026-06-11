import * as THREE from 'three'
import type { Color } from '../domain/types'
import {
  BODY_METALNESS,
  BODY_ROUGHNESS,
  FACE_HEX,
  HIDDEN_FACE_HEX,
  STICKER_ROUGHNESS,
} from './colors'

const stickerMaterials = new Map<Color, THREE.MeshStandardMaterial>()
let bodyMaterial: THREE.MeshStandardMaterial | null = null

export function getBodyMaterial(): THREE.MeshStandardMaterial {
  if (!bodyMaterial) {
    bodyMaterial = new THREE.MeshStandardMaterial({
      color: HIDDEN_FACE_HEX,
      roughness: BODY_ROUGHNESS,
      metalness: BODY_METALNESS,
      side: THREE.FrontSide,
      depthTest: true,
      depthWrite: true,
    })
  }
  return bodyMaterial
}

export function getStickerMaterial(color: Color): THREE.MeshStandardMaterial {
  let material = stickerMaterials.get(color)
  if (!material) {
    material = new THREE.MeshStandardMaterial({
      color: FACE_HEX[color],
      roughness: STICKER_ROUGHNESS,
      metalness: 0,
      side: THREE.FrontSide,
      depthTest: true,
      depthWrite: true,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -1,
    })
    stickerMaterials.set(color, material)
  }
  return material
}

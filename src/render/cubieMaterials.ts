import * as THREE from 'three'
import type { Color } from '../domain/types'
import { FACE_HEX, HIDDEN_FACE_HEX } from './colors'

const stickerMaterials = new Map<Color, THREE.MeshBasicMaterial>()
let bodyMaterial: THREE.MeshStandardMaterial | null = null

export function getBodyMaterial(): THREE.MeshStandardMaterial {
  if (!bodyMaterial) {
    bodyMaterial = new THREE.MeshStandardMaterial({
      color: HIDDEN_FACE_HEX,
      roughness: 0.8,
      metalness: 0,
      side: THREE.FrontSide,
      depthTest: true,
      depthWrite: true,
    })
  }
  return bodyMaterial
}

export function getStickerMaterial(color: Color): THREE.MeshBasicMaterial {
  let material = stickerMaterials.get(color)
  if (!material) {
    material = new THREE.MeshBasicMaterial({
      color: FACE_HEX[color],
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

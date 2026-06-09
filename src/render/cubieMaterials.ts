import * as THREE from 'three'
import type { Color, Face } from '../domain/types'
import { FACE_HEX, HIDDEN_FACE_HEX } from './colors'
import { MATERIAL_ORDER } from './cubieFaces'

const stickerMaterials = new Map<Color, THREE.MeshStandardMaterial>()
let hiddenMaterial: THREE.MeshStandardMaterial | null = null

function getHiddenMaterial(): THREE.MeshStandardMaterial {
  if (!hiddenMaterial) {
    hiddenMaterial = new THREE.MeshStandardMaterial({ color: HIDDEN_FACE_HEX })
  }
  return hiddenMaterial
}

function getStickerMaterial(color: Color): THREE.MeshStandardMaterial {
  let material = stickerMaterials.get(color)
  if (!material) {
    material = new THREE.MeshStandardMaterial({ color: FACE_HEX[color] })
    stickerMaterials.set(color, material)
  }
  return material
}

export function getCubieMaterials(faceColors: Record<Face, Color | null>): THREE.MeshStandardMaterial[] {
  return MATERIAL_ORDER.map((face) =>
    faceColors[face] ? getStickerMaterial(faceColors[face]!) : getHiddenMaterial(),
  )
}

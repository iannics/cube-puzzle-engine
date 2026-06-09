import * as THREE from 'three'
import type { Face } from '../domain'
import type { CubieGrid } from './layerSelection'

export interface CubieUserData {
  isCubie: true
  grid: CubieGrid
  cubeSize: number
  faceColors: Partial<Record<Face, boolean>>
}

export function isCubieObject(object: THREE.Object3D): object is THREE.Object3D & { userData: CubieUserData } {
  let current: THREE.Object3D | null = object
  while (current) {
    if (current.userData.isCubie === true) return true
    current = current.parent
  }
  return false
}

export function getCubieUserData(object: THREE.Object3D): CubieUserData | null {
  let current: THREE.Object3D | null = object
  while (current) {
    if (current.userData.isCubie === true) {
      return current.userData as CubieUserData
    }
    current = current.parent
  }
  return null
}

export function pointerToNdc(
  clientX: number,
  clientY: number,
  canvas: HTMLCanvasElement,
  target: THREE.Vector2,
): THREE.Vector2 {
  const rect = canvas.getBoundingClientRect()
  target.x = ((clientX - rect.left) / rect.width) * 2 - 1
  target.y = -((clientY - rect.top) / rect.height) * 2 + 1
  return target
}

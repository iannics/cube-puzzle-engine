import type { ThreeEvent } from '@react-three/fiber'
import type { Face } from '../domain'

export const MATERIAL_ORDER: Face[] = ['R', 'L', 'U', 'D', 'F', 'B']

export function faceFromIndex(faceIndex: number | null | undefined): Face | null {
  if (faceIndex === undefined || faceIndex === null) return null
  return MATERIAL_ORDER[Math.floor(faceIndex / 2)] ?? null
}

export function faceFromNormal(x: number, y: number, z: number): Face {
  const absX = Math.abs(x)
  const absY = Math.abs(y)
  const absZ = Math.abs(z)

  if (absX >= absY && absX >= absZ) {
    return x > 0 ? 'R' : 'L'
  }

  if (absY >= absX && absY >= absZ) {
    return y > 0 ? 'U' : 'D'
  }

  return z > 0 ? 'F' : 'B'
}

export function faceFromPointerEvent(event: ThreeEvent<PointerEvent>): Face | null {
  const fromIndex = faceFromIndex(event.faceIndex)
  if (fromIndex) return fromIndex

  if (!event.face) return null

  const normal = event.face.normal.clone().transformDirection(event.object.matrixWorld)
  return faceFromNormal(normal.x, normal.y, normal.z)
}

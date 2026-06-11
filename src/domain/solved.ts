import { createSolvedCube } from './cube'
import type { CubeState } from './types'

function cubiesEqual(a: CubeState, b: CubeState): boolean {
  if (a.size !== b.size || a.cubies.length !== b.cubies.length) return false

  for (let i = 0; i < a.cubies.length; i++) {
    const ca = a.cubies[i]
    const cb = b.cubies[i]
    if (ca.x !== cb.x || ca.y !== cb.y || ca.z !== cb.z) return false

    const facesA = Object.keys(ca.stickers).sort()
    const facesB = Object.keys(cb.stickers).sort()
    if (facesA.length !== facesB.length) return false
    for (let j = 0; j < facesA.length; j++) {
      const face = facesA[j]
      if (face !== facesB[j]) return false
      if (ca.stickers[face as keyof typeof ca.stickers] !== cb.stickers[face as keyof typeof cb.stickers]) {
        return false
      }
    }
  }

  return true
}

export function isSolved(cube: CubeState): boolean {
  return cubiesEqual(cube, createSolvedCube(cube.size))
}

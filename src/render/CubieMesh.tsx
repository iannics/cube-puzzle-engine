import { useMemo } from 'react'
import type { Color, Face } from '../domain/types'
import type { CubieUserData } from './canvasInteraction'
import { getCubieMaterials } from './cubieMaterials'
import type { CubieGrid } from './layerSelection'
import { CUBIE_SIZE } from './mapCubies'

interface CubieMeshProps {
  position: [number, number, number]
  grid: CubieGrid
  cubeSize: number
  faceColors: Record<Face, Color | null>
}

export function CubieMesh({ position, grid, cubeSize, faceColors }: CubieMeshProps) {
  const materials = useMemo(
    () => getCubieMaterials(faceColors),
    [faceColors.U, faceColors.D, faceColors.L, faceColors.R, faceColors.F, faceColors.B],
  )

  const userData = useMemo<CubieUserData>(
    () => ({
      isCubie: true,
      grid,
      cubeSize,
      faceColors: {
        U: faceColors.U !== null,
        D: faceColors.D !== null,
        L: faceColors.L !== null,
        R: faceColors.R !== null,
        F: faceColors.F !== null,
        B: faceColors.B !== null,
      },
    }),
    [grid, cubeSize, faceColors.U, faceColors.D, faceColors.L, faceColors.R, faceColors.F, faceColors.B],
  )

  return (
    <group position={position} userData={userData}>
      <mesh material={materials} dispose={null}>
        <boxGeometry args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE]} />
      </mesh>
    </group>
  )
}

import { useMemo } from 'react'
import type { Color, Face } from '../domain/types'
import type { CubieUserData } from './canvasInteraction'
import { useUiStore } from '../state/uiStore'
import { CUBIE_MODEL_COMPONENTS } from './cubieModelMeshes'
import { getBodyMaterial, getStickerMaterial } from './cubieMaterials'
import type { CubieGrid } from './layerSelection'

interface CubieMeshProps {
  position: [number, number, number]
  grid: CubieGrid
  cubeSize: number
  faceColors: Record<Face, Color | null>
  /** When true, stickers render above static cubies during layer animation. */
  isLayerActive?: boolean
}

export function CubieMesh({ position, grid, cubeSize, faceColors, isLayerActive = false }: CubieMeshProps) {
  const cubeTheme = useUiStore((state) => state.cubeTheme)
  const cubeShape = useUiStore((state) => state.cubeShape)
  const Model = CUBIE_MODEL_COMPONENTS[cubeShape]
  const bodyMaterial = useMemo(() => getBodyMaterial(cubeTheme), [cubeTheme])
  const bodyRenderOrder = isLayerActive ? 2 : 0
  const stickerRenderOrder = isLayerActive ? 3 : 1

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

  const getStickerMat = useMemo(
    () => (color: Color) => getStickerMaterial(color, cubeTheme),
    [cubeTheme],
  )

  return (
    <group position={position} userData={userData}>
      <Model
        faceColors={faceColors}
        bodyMaterial={bodyMaterial}
        getStickerMaterial={getStickerMat}
        bodyRenderOrder={bodyRenderOrder}
        stickerRenderOrder={stickerRenderOrder}
      />
    </group>
  )
}

import { useMemo } from 'react'
import type { Color, Face } from '../domain/types'
import type { CubieUserData } from './canvasInteraction'
import { getBodyMaterial, getStickerMaterial } from './cubieMaterials'
import {
  BODY_SIZE,
  getStickerTransform,
  listStickerFaces,
  STICKER_DEPTH,
  STICKER_SIZE,
} from './cubieFaces'
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
  const bodyMaterial = useMemo(() => getBodyMaterial(), [])
  const bodyRenderOrder = isLayerActive ? 2 : 0
  const stickerRenderOrder = isLayerActive ? 3 : 1

  const stickerFaces = useMemo(
    () => listStickerFaces(faceColors),
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
      <mesh material={bodyMaterial} renderOrder={bodyRenderOrder} dispose={null}>
        <boxGeometry args={[BODY_SIZE, BODY_SIZE, BODY_SIZE]} />
      </mesh>
      {stickerFaces.map((face) => {
        const transform = getStickerTransform(face)
        const color = faceColors[face]!
        return (
          <mesh
            key={face}
            material={getStickerMaterial(color)}
            position={transform.position}
            quaternion={transform.quaternion}
            renderOrder={stickerRenderOrder}
            dispose={null}
          >
            <boxGeometry args={[STICKER_SIZE, STICKER_SIZE, STICKER_DEPTH]} />
          </mesh>
        )
      })}
    </group>
  )
}

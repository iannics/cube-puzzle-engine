import type { ThreeEvent } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import type { Color, Face } from '../domain/types'
import { FACE_HEX, HIDDEN_FACE_HEX } from './colors'
import { faceFromPointerEvent, MATERIAL_ORDER } from './cubieFaces'
import { CUBIE_SIZE } from './mapCubies'

interface CubieMeshProps {
  position: [number, number, number]
  faceColors: Record<Face, Color | null>
  onFacePointerDown?: (face: Face, event: ThreeEvent<PointerEvent>) => void
}

export function CubieMesh({ position, faceColors, onFacePointerDown }: CubieMeshProps) {
  const materials = useMemo(
    () =>
      MATERIAL_ORDER.map(
        (face) =>
          new THREE.MeshStandardMaterial({
            color: faceColors[face] ? FACE_HEX[faceColors[face]!] : HIDDEN_FACE_HEX,
          }),
      ),
    [faceColors],
  )

  return (
    <mesh
      userData={{ isCubie: true }}
      position={position}
      material={materials}
      onPointerDown={(event) => {
        if (event.button !== 0 || !onFacePointerDown) return

        event.stopPropagation()
        const face = faceFromPointerEvent(event)
        if (!face || !faceColors[face]) return

        onFacePointerDown(face, event)
      }}
    >
      <boxGeometry args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE]} />
    </mesh>
  )
}

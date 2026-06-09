import { useMemo } from 'react'
import * as THREE from 'three'
import type { Color, Face } from '../domain/types'
import { FACE_HEX, HIDDEN_FACE_HEX } from './colors'
import { CUBIE_SIZE } from './mapCubies'

interface CubieMeshProps {
  position: [number, number, number]
  faceColors: Record<Face, Color | null>
}

const MATERIAL_ORDER: Face[] = ['R', 'L', 'U', 'D', 'F', 'B']

export function CubieMesh({ position, faceColors }: CubieMeshProps) {
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
    <mesh position={position} material={materials}>
      <boxGeometry args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE]} />
    </mesh>
  )
}

import { useMemo } from 'react'
import type { CubeState } from '../domain/types'
import { CubieMesh } from './CubieMesh'
import { mapCubies } from './mapCubies'

interface CubeMeshProps {
  state: CubeState
}

export function CubeMesh({ state }: CubeMeshProps) {
  const cubies = useMemo(() => mapCubies(state), [state])

  return (
    <group>
      {cubies.map((cubie) => (
        <CubieMesh key={cubie.key} position={cubie.position} faceColors={cubie.faceColors} />
      ))}
    </group>
  )
}

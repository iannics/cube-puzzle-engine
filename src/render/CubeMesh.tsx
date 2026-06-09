import { useMemo } from 'react'
import type { Face, Move } from '../domain'
import { isInFaceLayer } from '../domain'
import type { AnimationMode } from '../state'
import { useAnimationStore, useCubeStore } from '../state'
import { AnimationController } from './AnimationController'
import { CubieMesh } from './CubieMesh'
import { FACE_CW_SIGN, getMoveAngle, getRotationAxis } from './layerRotation'
import { mapCubies, type RenderCubie } from './mapCubies'
import { useFaceDrag } from './useFaceDrag'

function splitCubies(
  cubies: RenderCubie[],
  face: Face | undefined,
  size: number,
): { staticCubies: RenderCubie[]; layerCubies: RenderCubie[] } {
  if (!face) {
    return { staticCubies: cubies, layerCubies: [] }
  }

  const staticCubies: RenderCubie[] = []
  const layerCubies: RenderCubie[] = []

  for (const cubie of cubies) {
    const [x, y, z] = cubie.key.split('-').map(Number)
    const inLayer = isInFaceLayer({ x, y, z, stickers: {} }, face, size)
    if (inLayer) {
      layerCubies.push(cubie)
    } else {
      staticCubies.push(cubie)
    }
  }

  return { staticCubies, layerCubies }
}

function getDisplayAngle(move: Move, progress: number, mode: AnimationMode): number {
  if (mode === 'dragging') {
    return FACE_CW_SIGN[move.face] * progress * (Math.PI / 2)
  }

  return getMoveAngle(move, progress)
}

export function CubeMesh() {
  const cube = useCubeStore((state) => state.cube)
  const mode = useAnimationStore((state) => state.mode)
  const activeMove = useAnimationStore((state) => state.activeMove)
  const progress = useAnimationStore((state) => state.progress)
  const { onFacePointerDown } = useFaceDrag()

  const cubies = useMemo(() => mapCubies(cube), [cube])
  const isAnimating = mode !== 'idle' && activeMove !== null
  const canInteract = mode === 'idle'

  const { staticCubies, layerCubies } = useMemo(
    () => splitCubies(cubies, isAnimating ? activeMove?.face : undefined, cube.size),
    [cubies, isAnimating, activeMove?.face, cube.size],
  )

  const rotationAxis = activeMove ? getRotationAxis(activeMove.face) : null
  const angle = activeMove ? getDisplayAngle(activeMove, progress, mode) : 0

  return (
    <group>
      <AnimationController />
      {staticCubies.map((cubie) => (
        <CubieMesh
          key={cubie.key}
          position={cubie.position}
          faceColors={cubie.faceColors}
          onFacePointerDown={canInteract ? onFacePointerDown : undefined}
        />
      ))}
      {isAnimating && rotationAxis && (
        <group
          rotation={[
            rotationAxis.x !== 0 ? angle : 0,
            rotationAxis.y !== 0 ? angle : 0,
            rotationAxis.z !== 0 ? angle : 0,
          ]}
        >
          {layerCubies.map((cubie) => (
            <CubieMesh
              key={cubie.key}
              position={cubie.position}
              faceColors={cubie.faceColors}
              onFacePointerDown={canInteract ? onFacePointerDown : undefined}
            />
          ))}
        </group>
      )}
    </group>
  )
}

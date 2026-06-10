import { useMemo } from 'react'
import type { Face } from '../domain'
import { isInFaceLayer } from '../domain'
import { useAnimationStore, useCubeStore } from '../state'
import { AnimationController } from './AnimationController'
import { CubieMesh } from './CubieMesh'
import { getAnimatedLayerAngle, getLayerEulerRotation, getRotationAxis } from './layerRotation'
import { mapCubies, type RenderCubie } from './mapCubies'

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
    const inLayer = isInFaceLayer(
      { x: cubie.grid.x, y: cubie.grid.y, z: cubie.grid.z, stickers: {} },
      face,
      size,
    )
    if (inLayer) {
      layerCubies.push(cubie)
    } else {
      staticCubies.push(cubie)
    }
  }

  return { staticCubies, layerCubies }
}

export function CubeMesh() {
  const cube = useCubeStore((state) => state.cube)
  const mode = useAnimationStore((state) => state.mode)
  const activeMove = useAnimationStore((state) => state.activeMove)
  const progress = useAnimationStore((state) => state.progress)

  const cubies = useMemo(() => mapCubies(cube), [cube])
  const isAnimating = mode !== 'idle' && activeMove !== null

  const { staticCubies, layerCubies } = useMemo(
    () => splitCubies(cubies, isAnimating ? activeMove?.face : undefined, cube.size),
    [cubies, isAnimating, activeMove?.face, cube.size],
  )

  const rotationAxis = activeMove ? getRotationAxis(activeMove.face) : null
  const angle = activeMove ? getAnimatedLayerAngle(activeMove, progress, mode) : 0
  const layerRotation = useMemo(
    () => (activeMove ? getLayerEulerRotation(activeMove.face, angle) : null),
    [activeMove, angle],
  )

  return (
    <group>
      <AnimationController />
      <group renderOrder={0}>
        {staticCubies.map((cubie) => (
          <CubieMesh
            key={cubie.key}
            position={cubie.position}
            grid={cubie.grid}
            cubeSize={cube.size}
            faceColors={cubie.faceColors}
          />
        ))}
      </group>
      {isAnimating && rotationAxis && layerRotation && activeMove && (
        <group renderOrder={2} rotation={layerRotation}>
          {layerCubies.map((cubie) => (
            <CubieMesh
              key={cubie.key}
              position={cubie.position}
              grid={cubie.grid}
              cubeSize={cube.size}
              faceColors={cubie.faceColors}
              isLayerActive
            />
          ))}
        </group>
      )}
    </group>
  )
}

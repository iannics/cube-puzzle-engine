import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useCallback } from 'react'
import type { WebGLRenderer } from 'three'
import { useAnimationStore } from '../state'
import { useUiStore } from '../state/uiStore'
import { CameraReset } from './CameraReset'
import { CompactCameraFit } from './CompactCameraFit'
import { CanvasCursor } from './CanvasCursor'
import { CubeMesh } from './CubeMesh'
import {
  DEFAULT_CAMERA_FOV,
  DEFAULT_CAMERA_POSITION,
  ORBIT_DAMPING_FACTOR,
  ORBIT_MAX_DISTANCE,
  ORBIT_MAX_POLAR_ANGLE,
  ORBIT_MIN_DISTANCE,
  ORBIT_MIN_POLAR_ANGLE,
} from './cameraConfig'
import { OrbitGuard } from './OrbitGuard'
import { SceneEnvironment } from './SceneEnvironment'
import { SceneLighting } from './SceneLighting'

interface CubeSceneProps {
  onDoubleClick?: () => void
}

export function CubeScene({ onDoubleClick }: CubeSceneProps) {
  const isDragging = useAnimationStore((state) => state.isDragging)
  const reducedMotion = useUiStore((state) => state.reducedMotion)

  const handleCreated = useCallback(
    ({ gl }: { gl: WebGLRenderer }) => {
      gl.domElement.addEventListener('dblclick', () => {
        onDoubleClick?.()
      })
    },
    [onDoubleClick],
  )

  return (
    <Canvas
      camera={{ position: DEFAULT_CAMERA_POSITION, fov: DEFAULT_CAMERA_FOV, near: 0.1, far: 100 }}
      gl={{ logarithmicDepthBuffer: true, antialias: true }}
      dpr={reducedMotion ? [1, 1] : [1, 1.5]}
      style={{ width: '100%', height: '100%' }}
      onCreated={handleCreated}
      role="application"
      aria-label="3D Rubik's cube. Use keyboard or drag faces to turn."
    >
      <SceneLighting />
      <SceneEnvironment />
      <CubeMesh />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={ORBIT_DAMPING_FACTOR}
        minDistance={ORBIT_MIN_DISTANCE}
        maxDistance={ORBIT_MAX_DISTANCE}
        minPolarAngle={ORBIT_MIN_POLAR_ANGLE}
        maxPolarAngle={ORBIT_MAX_POLAR_ANGLE}
        enabled={!isDragging}
      />
      <CameraReset />
      <CompactCameraFit />
      <CanvasCursor />
      <OrbitGuard />
    </Canvas>
  )
}

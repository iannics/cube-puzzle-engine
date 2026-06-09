import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { CubeState } from '../domain/types'
import { CubeMesh } from './CubeMesh'

interface CubeSceneProps {
  state: CubeState
}

export function CubeScene({ state }: CubeSceneProps) {
  return (
    <Canvas
      camera={{ position: [4, 4, 4], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1} />
      <CubeMesh state={state} />
      <OrbitControls enablePan={false} />
    </Canvas>
  )
}

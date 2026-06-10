import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useAnimationStore } from '../state'
import { CubeMesh } from './CubeMesh'
import { OrbitGuard } from './OrbitGuard'

export function CubeScene() {
  const isDragging = useAnimationStore((state) => state.isDragging)

  return (
    <Canvas
      camera={{ position: [4, 4, 4], fov: 45, near: 0.1, far: 100 }}
      gl={{ logarithmicDepthBuffer: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1} />
      <CubeMesh />
      <OrbitControls makeDefault enablePan={false} enabled={!isDragging} />
      <OrbitGuard />
    </Canvas>
  )
}

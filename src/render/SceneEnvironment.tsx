import { ContactShadows, Environment } from '@react-three/drei'
import { useUiStore } from '../state/uiStore'
import { getCubeTheme } from './themes'

export function SceneEnvironment() {
  const highQuality = useUiStore((state) => state.highQuality)
  const cubeTheme = useUiStore((state) => state.cubeTheme)
  const envIntensity = getCubeTheme(cubeTheme).lighting.environmentIntensity

  return (
    <>
      {highQuality && <Environment preset="studio" environmentIntensity={envIntensity} />}
      <ContactShadows
        position={[0, -1.35, 0]}
        opacity={0.35}
        blur={2.5}
        scale={12}
        far={4}
        resolution={256}
      />
    </>
  )
}

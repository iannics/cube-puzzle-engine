import { ContactShadows, Environment } from '@react-three/drei'
import { useUiStore } from '../state/uiStore'

export function SceneEnvironment() {
  const highQuality = useUiStore((state) => state.highQuality)

  return (
    <>
      {highQuality && <Environment preset="studio" environmentIntensity={0.35} />}
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

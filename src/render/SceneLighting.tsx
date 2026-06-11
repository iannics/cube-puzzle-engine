import { useUiStore } from '../state/uiStore'
import { getCubeTheme } from './themes'

export function SceneLighting() {
  const cubeTheme = useUiStore((state) => state.cubeTheme)
  const lighting = getCubeTheme(cubeTheme).lighting

  return (
    <>
      <ambientLight intensity={lighting.ambientIntensity} />
      <directionalLight
        position={[6, 10, 4]}
        intensity={lighting.keyIntensity}
        color={lighting.keyColor}
      />
      <directionalLight
        position={[-4, 2, -3]}
        intensity={lighting.fillIntensity}
        color={lighting.fillColor}
      />
    </>
  )
}

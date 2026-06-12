import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'
import {
  COMPACT_CAMERA_FOV,
  COMPACT_ORBIT_MAX_DISTANCE,
  COMPACT_ORBIT_MIN_DISTANCE,
  DEFAULT_CAMERA_FOV,
  DEFAULT_CAMERA_POSITION,
  ORBIT_MAX_DISTANCE,
  ORBIT_MIN_DISTANCE,
} from './cameraConfig'
import { COMPACT_VIEWPORT_QUERY } from './useCompactViewport'

interface OrbitControlsLike {
  minDistance: number
  maxDistance: number
  update: () => void
}

function compactCameraPosition(): THREE.Vector3 {
  const [x, y, z] = DEFAULT_CAMERA_POSITION
  const length = Math.hypot(x, y, z)
  const scale = COMPACT_ORBIT_MAX_DISTANCE / length
  return new THREE.Vector3(x * scale, y * scale, z * scale)
}

export function CompactCameraFit() {
  const { camera, controls } = useThree()

  useEffect(() => {
    const media = window.matchMedia(COMPACT_VIEWPORT_QUERY)

    const apply = () => {
      const compact = media.matches
      if (!(camera instanceof THREE.PerspectiveCamera)) return

      camera.fov = compact ? COMPACT_CAMERA_FOV : DEFAULT_CAMERA_FOV
      camera.updateProjectionMatrix()

      const orbit = controls as OrbitControlsLike | null
      if (!orbit) return

      orbit.minDistance = compact ? COMPACT_ORBIT_MIN_DISTANCE : ORBIT_MIN_DISTANCE
      orbit.maxDistance = compact ? COMPACT_ORBIT_MAX_DISTANCE : ORBIT_MAX_DISTANCE

      if (compact) {
        camera.position.copy(compactCameraPosition())
      } else {
        camera.position.set(...DEFAULT_CAMERA_POSITION)
      }

      orbit.update()
    }

    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [camera, controls])

  return null
}

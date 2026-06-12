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

    // R3F camera and orbit controls are mutable Three.js objects updated in place.
    /* eslint-disable react-hooks/immutability -- Three.js scene objects are intentionally mutated */
    const apply = () => {
      const compact = media.matches
      const cam = camera
      const orbit = controls as OrbitControlsLike | null
      if (!(cam instanceof THREE.PerspectiveCamera)) return

      cam.fov = compact ? COMPACT_CAMERA_FOV : DEFAULT_CAMERA_FOV
      cam.updateProjectionMatrix()
      if (!orbit) return

      orbit.minDistance = compact ? COMPACT_ORBIT_MIN_DISTANCE : ORBIT_MIN_DISTANCE
      orbit.maxDistance = compact ? COMPACT_ORBIT_MAX_DISTANCE : ORBIT_MAX_DISTANCE

      if (compact) {
        cam.position.copy(compactCameraPosition())
      } else {
        cam.position.set(...DEFAULT_CAMERA_POSITION)
      }

      orbit.update()
    }
    /* eslint-enable react-hooks/immutability */

    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [camera, controls])

  return null
}

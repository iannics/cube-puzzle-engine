import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useUiStore } from '../state/uiStore'
import {
  CAMERA_RESET_DURATION_MS,
  DEFAULT_CAMERA_POSITION,
  DEFAULT_CAMERA_TARGET,
} from './cameraConfig'

interface OrbitControlsLike {
  target: THREE.Vector3
  update: () => void
}

export function CameraReset() {
  const { camera, controls } = useThree()
  const cameraResetToken = useUiStore((state) => state.cameraResetToken)
  const animatingRef = useRef(false)
  const startTimeRef = useRef(0)
  const fromPositionRef = useRef(new THREE.Vector3())
  const fromTargetRef = useRef(new THREE.Vector3())
  const toPositionRef = useRef(new THREE.Vector3(...DEFAULT_CAMERA_POSITION))
  const toTargetRef = useRef(DEFAULT_CAMERA_TARGET.clone())

  useEffect(() => {
    if (cameraResetToken === 0) return

    fromPositionRef.current.copy(camera.position)
    const orbit = controls as OrbitControlsLike | null
    fromTargetRef.current.copy(orbit?.target ?? DEFAULT_CAMERA_TARGET)
    startTimeRef.current = performance.now()
    animatingRef.current = true
  }, [cameraResetToken, camera, controls])

  useFrame(() => {
    if (!animatingRef.current) return

    const elapsed = performance.now() - startTimeRef.current
    const rawT = Math.min(1, elapsed / CAMERA_RESET_DURATION_MS)
    const t = rawT < 0.5 ? 2 * rawT * rawT : 1 - (-2 * rawT + 2) ** 2 / 2

    camera.position.lerpVectors(fromPositionRef.current, toPositionRef.current, t)
    const orbit = controls as OrbitControlsLike | null
    if (orbit) {
      orbit.target.lerpVectors(fromTargetRef.current, toTargetRef.current, t)
      orbit.update()
    } else {
      camera.lookAt(toTargetRef.current)
    }

    if (rawT >= 1) {
      animatingRef.current = false
    }
  })

  return null
}

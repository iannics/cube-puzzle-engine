import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useUiStore } from '../state/uiStore'
import { useCompactViewport } from './useCompactViewport'
import {
  applyCameraUp,
  CAMERA_RESET_DURATION_MS,
  DEFAULT_CAMERA_TARGET,
  getCameraPoseForFace,
  getResetCameraPose,
} from './cameraConfig'

interface OrbitControlsLike {
  target: THREE.Vector3
  update: () => void
}

export function CameraReset() {
  const { camera, controls } = useThree()
  const compact = useCompactViewport()
  const cameraRequest = useUiStore((state) => state.cameraRequest)
  const animatingRef = useRef(false)
  const startTimeRef = useRef(0)
  const fromPositionRef = useRef(new THREE.Vector3())
  const fromTargetRef = useRef(new THREE.Vector3())
  const toPositionRef = useRef(new THREE.Vector3())
  const toTargetRef = useRef(DEFAULT_CAMERA_TARGET.clone())
  const toUpRef = useRef(new THREE.Vector3(0, 1, 0))
  const fromUpRef = useRef(new THREE.Vector3(0, 1, 0))
  const lastTokenRef = useRef(0)

  useEffect(() => {
    if (!cameraRequest || cameraRequest.token === lastTokenRef.current) return
    lastTokenRef.current = cameraRequest.token

    const pose =
      cameraRequest.mode === 'view'
        ? getCameraPoseForFace(cameraRequest.face)
        : getResetCameraPose(cameraRequest.face, compact)

    fromPositionRef.current.copy(camera.position)
    fromUpRef.current.copy(camera.up)
    const orbit = controls as OrbitControlsLike | null
    fromTargetRef.current.copy(orbit?.target ?? DEFAULT_CAMERA_TARGET)
    toPositionRef.current.set(...pose.position)
    toUpRef.current.set(...pose.up)
    toTargetRef.current.copy(DEFAULT_CAMERA_TARGET)
    startTimeRef.current = performance.now()
    animatingRef.current = true
  }, [cameraRequest, camera, controls, compact])

  useFrame(() => {
    if (!animatingRef.current) return

    const elapsed = performance.now() - startTimeRef.current
    const rawT = Math.min(1, elapsed / CAMERA_RESET_DURATION_MS)
    const t = rawT < 0.5 ? 2 * rawT * rawT : 1 - (-2 * rawT + 2) ** 2 / 2

    camera.position.lerpVectors(fromPositionRef.current, toPositionRef.current, t)
    camera.up.lerpVectors(fromUpRef.current, toUpRef.current, t)
    applyCameraUp(camera, [camera.up.x, camera.up.y, camera.up.z])

    const orbit = controls as OrbitControlsLike | null
    if (orbit) {
      orbit.target.lerpVectors(fromTargetRef.current, toTargetRef.current, t)
      orbit.update()
    } else {
      camera.lookAt(toTargetRef.current)
    }

    if (rawT >= 1) {
      applyCameraUp(camera, [toUpRef.current.x, toUpRef.current.y, toUpRef.current.z])
      animatingRef.current = false
    }
  })

  return null
}

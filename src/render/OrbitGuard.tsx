import { useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

interface EnabledControls {
  enabled: boolean
}

function isCubieHit(object: THREE.Object3D): boolean {
  let current: THREE.Object3D | null = object
  while (current) {
    if (current.userData.isCubie === true) return true
    current = current.parent
  }
  return false
}

export function OrbitGuard() {
  const { camera, scene, gl, controls } = useThree()
  const controlsRef = useRef<EnabledControls | null>(null)
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const pointer = useMemo(() => new THREE.Vector2(), [])

  useEffect(() => {
    controlsRef.current = (controls as EnabledControls | null) ?? null
  }, [controls])

  useEffect(() => {
    const canvas = gl.domElement

    const setControlsEnabled = (enabled: boolean) => {
      if (controlsRef.current) {
        controlsRef.current.enabled = enabled
      }
    }

    const onPointerDownCapture = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(scene.children, true)
      const hitCubie = hits.some((hit) => isCubieHit(hit.object))

      if (hitCubie) {
        setControlsEnabled(false)
      }
    }

    const onPointerUp = () => {
      setControlsEnabled(true)
    }

    canvas.addEventListener('pointerdown', onPointerDownCapture, true)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDownCapture, true)
      window.removeEventListener('pointerup', onPointerUp)
      setControlsEnabled(true)
    }
  }, [camera, gl, pointer, raycaster, scene])

  return null
}

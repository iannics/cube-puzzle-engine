import { useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { getCubieUserData, isCubieObject, pointerToNdc } from './canvasInteraction'
import { useAnimationStore } from '../state'
import { useFaceDrag } from './useFaceDrag'

interface EnabledControls {
  enabled: boolean
}

export function OrbitGuard() {
  const { camera, scene, gl, controls } = useThree()
  const controlsRef = useRef<EnabledControls | null>(null)
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const pointer = useMemo(() => new THREE.Vector2(), [])
  const { beginFaceDrag } = useFaceDrag()

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
      if (event.button !== 0) return
      if (useAnimationStore.getState().mode !== 'idle') return

      pointerToNdc(event.clientX, event.clientY, canvas, pointer)
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(scene.children, true)
      const cubieHit = hits.find((hit) => isCubieObject(hit.object))
      if (!cubieHit) return

      const cubieData = getCubieUserData(cubieHit.object)
      if (!cubieData) return

      setControlsEnabled(false)
      beginFaceDrag({
        grid: cubieData.grid,
        cubeSize: cubieData.cubeSize,
        anchorPoint: cubieHit.point.clone(),
        clientX: event.clientX,
        clientY: event.clientY,
        pointerId: event.pointerId,
      })
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
  }, [beginFaceDrag, camera, gl, pointer, raycaster, scene])

  return null
}

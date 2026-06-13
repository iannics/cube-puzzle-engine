import { useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useAnimationStore } from '../state'
import { getCubieUserData, isCubieObject, pointerToNdc } from './canvasInteraction'

export function CanvasCursor() {
  const { camera, scene, gl } = useThree()
  const isDragging = useAnimationStore((state) => state.isDragging)
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const pointer = useMemo(() => new THREE.Vector2(), [])

  useEffect(() => {
    const canvas = gl.domElement

    const onPointerMove = (event: PointerEvent) => {
      if (isDragging) {
        canvas.style.cursor = 'grabbing'
        return
      }

      if (useAnimationStore.getState().mode !== 'idle') {
        canvas.style.cursor = 'default'
        return
      }

      pointerToNdc(event.clientX, event.clientY, canvas, pointer)
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(scene.children, true)
      const cubieHit = hits.find((hit) => isCubieObject(hit.object) && getCubieUserData(hit.object))

      canvas.style.cursor = cubieHit ? 'grab' : 'move'
    }

    const onPointerLeave = () => {
      canvas.style.cursor = 'default'
    }

    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerleave', onPointerLeave)

    return () => {
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      canvas.style.cursor = 'default'
    }
  }, [camera, gl.domElement, isDragging, pointer, raycaster, scene.children])

  return null
}

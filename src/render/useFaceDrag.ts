import type { ThreeEvent } from '@react-three/fiber'
import { useThree } from '@react-three/fiber'
import { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { Face } from '../domain'
import { useAnimationStore } from '../state'
import { dragProgressFromScreenDelta } from './layerRotation'

const DRAG_START_THRESHOLD_PX = 5

interface DragState {
  face: Face
  faceWorldNormal: THREE.Vector3
  startX: number
  startY: number
  lastX: number
  lastY: number
  accumulated: number
  startedInStore: boolean
}

export function useFaceDrag() {
  const { camera, gl } = useThree()
  const dragRef = useRef<DragState | null>(null)
  const cameraRef = useRef(camera)
  const listenersRef = useRef<{
    onPointerMove: (event: PointerEvent) => void
    onPointerUp: (event: PointerEvent) => void
  } | null>(null)

  const mode = useAnimationStore((state) => state.mode)
  const startDrag = useAnimationStore((state) => state.startDrag)
  const updateDragProgress = useAnimationStore((state) => state.updateDragProgress)
  const endDrag = useAnimationStore((state) => state.endDrag)

  const endDragRef = useRef(endDrag)
  const updateDragProgressRef = useRef(updateDragProgress)
  const startDragRef = useRef(startDrag)

  useEffect(() => {
    cameraRef.current = camera
    endDragRef.current = endDrag
    updateDragProgressRef.current = updateDragProgress
    startDragRef.current = startDrag
  }, [camera, endDrag, startDrag, updateDragProgress])

  const removeListeners = () => {
    const listeners = listenersRef.current
    if (!listeners) return
    window.removeEventListener('pointermove', listeners.onPointerMove)
    window.removeEventListener('pointerup', listeners.onPointerUp)
    listenersRef.current = null
  }

  useEffect(() => removeListeners, [])

  const onFacePointerDown = useCallback(
    (face: Face, event: ThreeEvent<PointerEvent>) => {
      if (mode !== 'idle') return

      event.stopPropagation()

      const faceWorldNormal = event.face?.normal
        .clone()
        .transformDirection(event.object.matrixWorld) ?? new THREE.Vector3()

      const startX = event.nativeEvent.clientX
      const startY = event.nativeEvent.clientY

      dragRef.current = {
        face,
        faceWorldNormal,
        startX,
        startY,
        lastX: startX,
        lastY: startY,
        accumulated: 0,
        startedInStore: false,
      }

      const onPointerMove = (moveEvent: PointerEvent) => {
        const drag = dragRef.current
        if (!drag) return

        if (!drag.startedInStore) {
          const totalDx = moveEvent.clientX - drag.startX
          const totalDy = moveEvent.clientY - drag.startY
          if (Math.hypot(totalDx, totalDy) < DRAG_START_THRESHOLD_PX) return

          drag.startedInStore = true
          startDragRef.current(drag.face)

          const initialProgress = dragProgressFromScreenDelta(
            drag.face,
            totalDx,
            totalDy,
            cameraRef.current,
            drag.faceWorldNormal,
          )
          drag.accumulated = initialProgress
          updateDragProgressRef.current(initialProgress)
          drag.lastX = moveEvent.clientX
          drag.lastY = moveEvent.clientY
          return
        }

        const deltaX = moveEvent.clientX - drag.lastX
        const deltaY = moveEvent.clientY - drag.lastY
        drag.lastX = moveEvent.clientX
        drag.lastY = moveEvent.clientY

        const deltaProgress = dragProgressFromScreenDelta(
          drag.face,
          deltaX,
          deltaY,
          cameraRef.current,
          drag.faceWorldNormal,
        )

        drag.accumulated += deltaProgress
        updateDragProgressRef.current(drag.accumulated)
      }

      const onPointerUp = (upEvent: PointerEvent) => {
        const drag = dragRef.current
        dragRef.current = null
        removeListeners()

        try {
          gl.domElement.releasePointerCapture(upEvent.pointerId)
        } catch {
          // Pointer capture may not have been set.
        }

        if (!drag?.startedInStore) return
        endDragRef.current()
      }

      listenersRef.current = { onPointerMove, onPointerUp }
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)

      try {
        gl.domElement.setPointerCapture(event.nativeEvent.pointerId)
      } catch {
        // setPointerCapture is best-effort for drag tracking.
      }
    },
    [gl.domElement, mode],
  )

  return { onFacePointerDown }
}

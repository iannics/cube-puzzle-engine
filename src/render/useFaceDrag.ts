import { useThree } from '@react-three/fiber'
import { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { Face } from '../domain'
import { useAnimationStore } from '../state'
import { getFaceNormal, dragProgressFromScreenDelta } from './layerRotation'
import { selectLayerFromDrag, type CubieGrid } from './layerSelection'

const DRAG_START_THRESHOLD_PX = 4

export interface FaceDragStart {
  grid: CubieGrid
  cubeSize: number
  anchorPoint: THREE.Vector3
  clientX: number
  clientY: number
  pointerId: number
}

interface DragState {
  grid: CubieGrid
  cubeSize: number
  face: Face | null
  faceWorldNormal: THREE.Vector3 | null
  anchorPoint: THREE.Vector3
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

  const beginFaceDrag = useCallback(
    (start: FaceDragStart) => {
      if (useAnimationStore.getState().mode !== 'idle') return

      removeListeners()

      dragRef.current = {
        grid: start.grid,
        cubeSize: start.cubeSize,
        face: null,
        faceWorldNormal: null,
        anchorPoint: start.anchorPoint,
        startX: start.clientX,
        startY: start.clientY,
        lastX: start.clientX,
        lastY: start.clientY,
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

          const face = selectLayerFromDrag(
            drag.grid,
            drag.cubeSize,
            totalDx,
            totalDy,
            cameraRef.current,
            drag.anchorPoint,
          )
          drag.face = face
          drag.faceWorldNormal = getFaceNormal(face)
          drag.startedInStore = true
          startDragRef.current(face)

          const initialProgress = dragProgressFromScreenDelta(
            face,
            totalDx,
            totalDy,
            cameraRef.current,
            drag.faceWorldNormal,
            drag.anchorPoint,
          )
          drag.accumulated = initialProgress
          updateDragProgressRef.current(initialProgress)
          drag.lastX = moveEvent.clientX
          drag.lastY = moveEvent.clientY
          return
        }

        if (!drag.face || !drag.faceWorldNormal) return

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
          drag.anchorPoint,
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
        gl.domElement.setPointerCapture(start.pointerId)
      } catch {
        // setPointerCapture is best-effort for drag tracking.
      }
    },
    [gl.domElement],
  )

  return { beginFaceDrag }
}

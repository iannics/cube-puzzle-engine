import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { useUiStore } from '../state/uiStore'

const FLOAT_AMPLITUDE = 0.04
const FLOAT_PERIOD_S = 6
const ROTATION_AMPLITUDE_RAD = (1.5 * Math.PI) / 180
const ROTATION_PERIOD_S = 8
const CUBE_Y_LIFT = 0.15

interface IdleFloatProps {
  enabled: boolean
  children: React.ReactNode
}

export function IdleFloat({ enabled, children }: IdleFloatProps) {
  const groupRef = useRef<Group>(null)
  const reducedMotion = useUiStore((state) => state.reducedMotion)

  useFrame((state) => {
    const group = groupRef.current
    if (!group) return

    if (!enabled || reducedMotion) {
      group.position.y = CUBE_Y_LIFT
      group.rotation.y = 0
      return
    }

    const t = state.clock.elapsedTime
    group.position.y = CUBE_Y_LIFT + Math.sin((t * 2 * Math.PI) / FLOAT_PERIOD_S) * FLOAT_AMPLITUDE
    group.rotation.y = Math.sin((t * 2 * Math.PI) / ROTATION_PERIOD_S) * ROTATION_AMPLITUDE_RAD
  })

  return <group ref={groupRef}>{children}</group>
}

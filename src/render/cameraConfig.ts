import * as THREE from 'three'

export const DEFAULT_CAMERA_POSITION: [number, number, number] = [5.2, 4.2, 5.2]
export const DEFAULT_CAMERA_FOV = 38
export const DEFAULT_CAMERA_TARGET = new THREE.Vector3(0, 0, 0)

export const ORBIT_MIN_DISTANCE = 4.0
export const ORBIT_MAX_DISTANCE = 10.0
export const ORBIT_MIN_POLAR_ANGLE = Math.PI / 6
export const ORBIT_MAX_POLAR_ANGLE = Math.PI / 2 + 0.15
export const ORBIT_DAMPING_FACTOR = 0.08

export const CAMERA_RESET_DURATION_MS = 400

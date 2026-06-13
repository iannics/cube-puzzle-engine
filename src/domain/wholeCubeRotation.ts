import type { Color, CubeState, CubieState, Face, Turn } from './types'

type Axis = 'x' | 'y' | 'z'

interface WholeCubeSpec {
  planeAxes: ['y', 'z'] | ['x', 'z'] | ['x', 'y']
  cw: (a: number, b: number, size: number) => [number, number]
  stickerCycle: readonly Face[]
}

const WHOLE_CUBE_SPECS: Record<Axis, WholeCubeSpec> = {
  x: {
    planeAxes: ['y', 'z'],
    cw: (y, z, size) => [z, size - 1 - y],
    stickerCycle: ['U', 'B', 'D', 'F'],
  },
  y: {
    planeAxes: ['x', 'z'],
    cw: (x, z, size) => [size - 1 - z, x],
    stickerCycle: ['R', 'F', 'L', 'B'],
  },
  z: {
    planeAxes: ['x', 'y'],
    cw: (x, y, size) => [y, size - 1 - x],
    stickerCycle: ['U', 'R', 'D', 'L'],
  },
}

function rotateInPlane(
  cubie: CubieState,
  spec: WholeCubeSpec,
  size: number,
  quarterTurns: Turn,
): Pick<CubieState, 'x' | 'y' | 'z'> {
  const [aAxis, bAxis] = spec.planeAxes
  let a = cubie[aAxis]
  let b = cubie[bAxis]

  for (let i = 0; i < quarterTurns; i++) {
    ;[a, b] = spec.cw(a, b, size)
  }

  const next = { x: cubie.x, y: cubie.y, z: cubie.z }
  next[aAxis] = a
  next[bAxis] = b
  return next
}

function remapStickers(
  stickers: Partial<Record<Face, Color>>,
  cycle: readonly Face[],
  quarterTurns: Turn,
): Partial<Record<Face, Color>> {
  const cycleSet = new Set(cycle)
  const next: Partial<Record<Face, Color>> = {}

  for (const [face, color] of Object.entries(stickers) as [Face, Color][]) {
    if (!cycleSet.has(face)) {
      next[face] = color
      continue
    }

    const index = cycle.indexOf(face)
    const newFace = cycle[(index + quarterTurns) % cycle.length]
    next[newFace] = color
  }

  return next
}

function rotateCubie(cubie: CubieState, spec: WholeCubeSpec, turn: Turn, size: number): CubieState {
  const position = rotateInPlane(cubie, spec, size, turn)
  return {
    ...position,
    stickers: remapStickers(cubie.stickers, spec.stickerCycle, turn),
  }
}

export function rotateWholeCube(cube: CubeState, axis: Axis, turn: Turn): CubeState {
  const spec = WHOLE_CUBE_SPECS[axis]
  const cubies = cube.cubies.map((cubie) => rotateCubie(cubie, spec, turn, cube.size))
  return { size: cube.size, cubies }
}

const FACE_TO_UP_ROTATIONS: Record<Face, Array<{ axis: Axis; turn: Turn }>> = {
  U: [],
  D: [{ axis: 'x', turn: 2 }],
  F: [{ axis: 'x', turn: 1 }],
  B: [{ axis: 'x', turn: 3 }],
  R: [{ axis: 'z', turn: 3 }],
  L: [{ axis: 'z', turn: 1 }],
}

export function orientFaceToUp(cube: CubeState, face: Face): CubeState {
  let result = cube
  for (const { axis, turn } of FACE_TO_UP_ROTATIONS[face]) {
    result = rotateWholeCube(result, axis, turn)
  }
  return result
}

function faceCenterCubie(cube: CubeState, face: Face) {
  const { size } = cube
  const mid = Math.floor((size - 1) / 2)
  return cube.cubies.find((c) => {
    switch (face) {
      case 'U':
        return c.y === size - 1 && c.x === mid && c.z === mid
      case 'D':
        return c.y === 0 && c.x === mid && c.z === mid
      case 'F':
        return c.z === size - 1 && c.x === mid && c.y === mid
      case 'B':
        return c.z === 0 && c.x === mid && c.y === mid
      case 'R':
        return c.x === size - 1 && c.y === mid && c.z === mid
      case 'L':
        return c.x === 0 && c.y === mid && c.z === mid
    }
  })
}

export function getFaceCenterColor(cube: CubeState, face: Face): Color | undefined {
  return faceCenterCubie(cube, face)?.stickers[face]
}

const FACES: Face[] = ['U', 'D', 'F', 'B', 'L', 'R']

export function findFaceWithColor(cube: CubeState, color: Color): Face | null {
  for (const face of FACES) {
    if (getFaceCenterColor(cube, face) === color) return face
  }
  return null
}

export function orientColorToUp(cube: CubeState, color: Color): CubeState {
  const face = findFaceWithColor(cube, color)
  if (!face) return cube
  return orientFaceToUp(cube, face)
}

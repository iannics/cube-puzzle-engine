import type { Color, CubieState, CubeState, Face, Move, Turn } from './types'

type Axis = 'x' | 'y' | 'z'

interface FaceSpec {
  axis: Axis
  layerIndex: (size: number) => number
  planeAxes: ['y', 'z'] | ['x', 'z'] | ['x', 'y']
  cw: (a: number, b: number, size: number) => [number, number]
  stickerCycle: readonly Face[]
}

const FACE_SPECS: Record<Face, FaceSpec> = {
  R: {
    axis: 'x',
    layerIndex: (size) => size - 1,
    planeAxes: ['y', 'z'],
    cw: (y, z, size) => [z, size - 1 - y],
    stickerCycle: ['U', 'B', 'D', 'F'],
  },
  L: {
    axis: 'x',
    layerIndex: () => 0,
    planeAxes: ['y', 'z'],
    cw: (y, z, size) => [size - 1 - z, y],
    stickerCycle: ['U', 'F', 'D', 'B'],
  },
  U: {
    axis: 'y',
    layerIndex: (size) => size - 1,
    planeAxes: ['x', 'z'],
    cw: (x, z, size) => [size - 1 - z, x],
    stickerCycle: ['R', 'F', 'L', 'B'],
  },
  D: {
    axis: 'y',
    layerIndex: () => 0,
    planeAxes: ['x', 'z'],
    cw: (x, z, size) => [z, size - 1 - x],
    stickerCycle: ['R', 'B', 'L', 'F'],
  },
  F: {
    axis: 'z',
    layerIndex: (size) => size - 1,
    planeAxes: ['x', 'y'],
    cw: (x, y, size) => [y, size - 1 - x],
    stickerCycle: ['U', 'L', 'D', 'R'],
  },
  B: {
    axis: 'z',
    layerIndex: () => 0,
    planeAxes: ['x', 'y'],
    cw: (x, y, size) => [size - 1 - y, x],
    stickerCycle: ['U', 'R', 'D', 'L'],
  },
}

export function getFaceRotationAxis(face: Face): Axis {
  return FACE_SPECS[face].axis
}

export function isInFaceLayer(cubie: CubieState, face: Face, size: number): boolean {
  const spec = FACE_SPECS[face]
  return cubie[spec.axis] === spec.layerIndex(size)
}

function rotateInPlane(
  cubie: CubieState,
  spec: FaceSpec,
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

function rotateCubie(cubie: CubieState, face: Face, turn: Turn, size: number): CubieState {
  if (!isInFaceLayer(cubie, face, size)) {
    return cubie
  }

  const spec = FACE_SPECS[face]
  const position = rotateInPlane(cubie, spec, size, turn)

  return {
    ...position,
    stickers: remapStickers(cubie.stickers, spec.stickerCycle, turn),
  }
}

export function applyMove(cube: CubeState, move: Move): CubeState {
  if (move.kind !== 'face') {
    return cube
  }

  const cubies = cube.cubies.map((cubie) => rotateCubie(cubie, move.face, move.turn, cube.size))

  return { size: cube.size, cubies }
}

export function inverse(move: Move): Move {
  if (move.kind !== 'face') {
    return move
  }

  const turnMap: Record<Turn, Turn> = { 1: 3, 2: 2, 3: 1 }
  return { kind: 'face', face: move.face, turn: turnMap[move.turn] }
}

export function faceMove(face: Face, turn: Turn = 1): Move {
  return { kind: 'face', face, turn }
}

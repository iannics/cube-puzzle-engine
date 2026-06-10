import type { Color, CubieState, CubeState, Face, Move, Slice, Turn } from './types'

type Axis = 'x' | 'y' | 'z'

interface LayerSpec {
  axis: Axis
  layerIndex: (size: number) => number
  planeAxes: ['y', 'z'] | ['x', 'z'] | ['x', 'y']
  cw: (a: number, b: number, size: number) => [number, number]
  stickerCycle: readonly Face[]
}

function middleLayerIndex(size: number): number {
  return Math.floor((size - 1) / 2)
}

const FACE_SPECS: Record<Face, LayerSpec> = {
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
    stickerCycle: ['U', 'R', 'D', 'L'],
  },
  B: {
    axis: 'z',
    layerIndex: () => 0,
    planeAxes: ['x', 'y'],
    cw: (x, y, size) => [size - 1 - y, x],
    stickerCycle: ['U', 'L', 'D', 'R'],
  },
}

/** Middle slices follow the same direction as L, D, and F when viewed from outside. */
const SLICE_SPECS: Record<Slice, LayerSpec> = {
  M: {
    axis: 'x',
    layerIndex: middleLayerIndex,
    planeAxes: ['y', 'z'],
    cw: (y, z, size) => [size - 1 - z, y],
    stickerCycle: ['U', 'F', 'D', 'B'],
  },
  E: {
    axis: 'y',
    layerIndex: middleLayerIndex,
    planeAxes: ['x', 'z'],
    cw: (x, z, size) => [z, size - 1 - x],
    stickerCycle: ['R', 'B', 'L', 'F'],
  },
  S: {
    axis: 'z',
    layerIndex: middleLayerIndex,
    planeAxes: ['x', 'y'],
    cw: (x, y, size) => [y, size - 1 - x],
    stickerCycle: ['U', 'R', 'D', 'L'],
  },
}

function getLayerSpec(move: Move): LayerSpec {
  return move.kind === 'face' ? FACE_SPECS[move.face] : SLICE_SPECS[move.slice]
}

export function getFaceRotationAxis(face: Face): Axis {
  return FACE_SPECS[face].axis
}

export function getSliceRotationAxis(slice: Slice): Axis {
  return SLICE_SPECS[slice].axis
}

export function getMoveRotationAxis(move: Move): Axis {
  return getLayerSpec(move).axis
}

export function isInFaceLayer(cubie: CubieState, face: Face, size: number): boolean {
  const spec = FACE_SPECS[face]
  return cubie[spec.axis] === spec.layerIndex(size)
}

export function isInSliceLayer(cubie: CubieState, slice: Slice, size: number): boolean {
  if (size < 3) return false
  const spec = SLICE_SPECS[slice]
  return cubie[spec.axis] === spec.layerIndex(size)
}

export function isInMoveLayer(cubie: CubieState, move: Move, size: number): boolean {
  if (move.kind === 'face') {
    return isInFaceLayer(cubie, move.face, size)
  }
  return isInSliceLayer(cubie, move.slice, size)
}

function rotateInPlane(
  cubie: CubieState,
  spec: LayerSpec,
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

function rotateCubieInLayer(
  cubie: CubieState,
  spec: LayerSpec,
  turn: Turn,
  size: number,
): CubieState {
  if (cubie[spec.axis] !== spec.layerIndex(size)) {
    return cubie
  }

  const position = rotateInPlane(cubie, spec, size, turn)

  return {
    ...position,
    stickers: remapStickers(cubie.stickers, spec.stickerCycle, turn),
  }
}

export function applyMove(cube: CubeState, move: Move): CubeState {
  if (move.kind === 'slice' && cube.size < 3) {
    return cube
  }

  const spec = getLayerSpec(move)
  const cubies = cube.cubies.map((cubie) => rotateCubieInLayer(cubie, spec, move.turn, cube.size))

  return { size: cube.size, cubies }
}

export function inverse(move: Move): Move {
  const turnMap: Record<Turn, Turn> = { 1: 3, 2: 2, 3: 1 }
  if (move.kind === 'face') {
    return { kind: 'face', face: move.face, turn: turnMap[move.turn] }
  }
  return { kind: 'slice', slice: move.slice, turn: turnMap[move.turn] }
}

export function faceMove(face: Face, turn: Turn = 1): Move {
  return { kind: 'face', face, turn }
}

export function sliceMove(slice: Slice, turn: Turn = 1): Move {
  return { kind: 'slice', slice, turn }
}

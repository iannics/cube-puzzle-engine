import type { Face, Move, Slice } from './types'

/** Clockwise turn sign when viewed from outside the face (matches domain notation). */
export const FACE_CW_SIGN: Record<Face, number> = {
  R: -1,
  L: 1,
  U: -1,
  D: 1,
  F: -1,
  B: 1,
}

const SLICE_CW_SIGN: Record<Slice, number> = {
  M: FACE_CW_SIGN.L,
  E: FACE_CW_SIGN.D,
  S: FACE_CW_SIGN.F,
}

export function isMirrorFace(face: Face): boolean {
  return face === 'L' || face === 'D' || face === 'B'
}

export function getMoveCwSign(move: Move): number {
  return move.kind === 'face' ? FACE_CW_SIGN[move.face] : SLICE_CW_SIGN[move.slice]
}

/**
 * Drag torque sign: mirror faces use the partner-face sign so screen motion
 * matches layer motion the same way it does on R, U, and F.
 */
export function dragSignForFace(face: Face): number {
  return isMirrorFace(face) ? -FACE_CW_SIGN[face] : FACE_CW_SIGN[face]
}

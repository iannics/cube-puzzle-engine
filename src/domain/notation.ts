import type { Move } from './types'

export function formatMove(move: Move): string {
  const label = move.kind === 'face' ? move.face : move.slice
  if (move.turn === 2) return `${label}2`
  if (move.turn === 3) return `${label}'`
  return label
}

export function formatMoveSequence(moves: readonly Move[]): string {
  return moves.map(formatMove).join(' ')
}

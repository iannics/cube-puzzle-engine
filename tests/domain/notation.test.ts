import { describe, expect, it } from 'vitest'
import { faceMove, formatMove, formatMoveSequence, sliceMove } from '../../src/domain'

describe('formatMove', () => {
  it('formats quarter, prime, and half turns', () => {
    expect(formatMove(faceMove('R', 1))).toBe('R')
    expect(formatMove(faceMove('U', 3))).toBe("U'")
    expect(formatMove(faceMove('F', 2))).toBe('F2')
    expect(formatMove(sliceMove('M', 3))).toBe("M'")
  })

  it('formats move sequences', () => {
    const moves = [faceMove('R', 1), faceMove('U', 3), faceMove('F', 2)]
    expect(formatMoveSequence(moves)).toBe("R U' F2")
  })
})

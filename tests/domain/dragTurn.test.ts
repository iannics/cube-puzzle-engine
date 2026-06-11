import { describe, expect, it } from 'vitest'
import { faceMove, getDragTurn, sliceMove, type Face } from '../../src/domain'

const FACES: Face[] = ['U', 'D', 'L', 'R', 'F', 'B']

describe('getDragTurn', () => {
  it('maps positive progress to turn 1 on R and turn 3 on L', () => {
    expect(getDragTurn(faceMove('R', 1), 0.5)).toBe(1)
    expect(getDragTurn(faceMove('R', 1), -0.5)).toBe(3)
    expect(getDragTurn(faceMove('L', 1), 0.5)).toBe(3)
    expect(getDragTurn(faceMove('L', 1), -0.5)).toBe(1)
  })

  it('maps positive progress to turn 1 on U and turn 3 on D', () => {
    expect(getDragTurn(faceMove('U', 1), 0.5)).toBe(1)
    expect(getDragTurn(faceMove('U', 1), -0.5)).toBe(3)
    expect(getDragTurn(faceMove('D', 1), 0.5)).toBe(3)
    expect(getDragTurn(faceMove('D', 1), -0.5)).toBe(1)
  })

  it('maps positive progress to turn 1 on F and turn 3 on B', () => {
    expect(getDragTurn(faceMove('F', 1), 0.5)).toBe(1)
    expect(getDragTurn(faceMove('F', 1), -0.5)).toBe(3)
    expect(getDragTurn(faceMove('B', 1), 0.5)).toBe(3)
    expect(getDragTurn(faceMove('B', 1), -0.5)).toBe(1)
  })

  it('maps positive progress to turn 3 on M like L', () => {
    expect(getDragTurn(sliceMove('M', 1), 0.5)).toBe(3)
    expect(getDragTurn(sliceMove('M', 1), -0.5)).toBe(1)
  })
})

export type Face = 'U' | 'D' | 'L' | 'R' | 'F' | 'B'

export type Color =
  | 'white'
  | 'yellow'
  | 'red'
  | 'orange'
  | 'blue'
  | 'green'

export interface CubieState {
  x: number
  y: number
  z: number
  stickers: Partial<Record<Face, Color>>
}

export interface CubeState {
  size: number
  cubies: CubieState[]
}

export type Turn = 1 | 2 | 3

export type Slice = 'M' | 'E' | 'S'

export type Move =
  | { kind: 'face'; face: Face; turn: Turn }
  | { kind: 'slice'; slice: Slice; turn: Turn }

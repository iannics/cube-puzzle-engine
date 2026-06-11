export type CubeShapeId = 'modern' | 'classic' | 'inset'

export interface CubeShapeConfig {
  id: CubeShapeId
  name: string
  description: string
}

export const CUBE_SHAPES: Record<CubeShapeId, CubeShapeConfig> = {
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Rounded cubies with raised sticker tiles.',
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Sharp blocks with small square stickers and wide frames.',
  },
  inset: {
    id: 'inset',
    name: 'Inset Frame',
    description: 'Recessed sticker wells with a pronounced plastic rim.',
  },
}

export const CUBE_SHAPE_IDS = Object.keys(CUBE_SHAPES) as CubeShapeId[]
export const DEFAULT_CUBE_SHAPE: CubeShapeId = 'modern'

const LEGACY_SHAPE_IDS: Record<string, CubeShapeId> = {
  futuristic: 'modern',
  rounded: 'inset',
}

export function getCubeShape(id: CubeShapeId): CubeShapeConfig {
  return CUBE_SHAPES[id]
}

export function isCubeShapeId(value: string): value is CubeShapeId {
  return value in CUBE_SHAPES
}

export function resolveCubeShapeId(value: string): CubeShapeId | null {
  if (isCubeShapeId(value)) return value
  return LEGACY_SHAPE_IDS[value] ?? null
}

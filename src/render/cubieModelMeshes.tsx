import { RoundedBox } from '@react-three/drei'
import type { ComponentType } from 'react'
import * as THREE from 'three'
import type { Color, Face } from '../domain/types'
import type { MeshStandardMaterial } from 'three'
import {
  BODY_SIZE,
  getStickerTransform,
  listStickerFaces,
  STICKER_DEPTH,
  STICKER_SIZE,
} from './cubieFaces'
import type { CubeShapeId } from './cubeShapes'

const HALF = 0.95 / 2

export interface CubieModelMeshProps {
  faceColors: Record<Face, Color | null>
  bodyMaterial: MeshStandardMaterial
  getStickerMaterial: (color: Color) => MeshStandardMaterial
  bodyRenderOrder: number
  stickerRenderOrder: number
}

const FACE_NORMALS: Record<Face, THREE.Vector3> = {
  R: new THREE.Vector3(1, 0, 0),
  L: new THREE.Vector3(-1, 0, 0),
  U: new THREE.Vector3(0, 1, 0),
  D: new THREE.Vector3(0, -1, 0),
  F: new THREE.Vector3(0, 0, 1),
  B: new THREE.Vector3(0, 0, -1),
}

const PLANE_NORMAL = new THREE.Vector3(0, 0, 1)
const alignQuaternion = new THREE.Quaternion()

interface ModelStickerTransform {
  position: [number, number, number]
  quaternion: [number, number, number, number]
  stickerSize: number
  stickerDepth: number
}

function getCustomStickerTransform(
  face: Face,
  stickerSize: number,
  stickerDepth: number,
  outerOffset: number,
): ModelStickerTransform {
  const normal = FACE_NORMALS[face]
  const centerDistance = HALF + outerOffset - stickerDepth / 2
  const position = normal.clone().multiplyScalar(centerDistance)
  alignQuaternion.setFromUnitVectors(PLANE_NORMAL, normal)

  return {
    position: [position.x, position.y, position.z],
    quaternion: [alignQuaternion.x, alignQuaternion.y, alignQuaternion.z, alignQuaternion.w],
    stickerSize,
    stickerDepth,
  }
}

function StickerTiles({
  faceColors,
  getStickerMaterial,
  stickerRenderOrder,
  resolveTransform,
}: {
  faceColors: Record<Face, Color | null>
  getStickerMaterial: (color: Color) => MeshStandardMaterial
  stickerRenderOrder: number
  resolveTransform: (face: Face) => ModelStickerTransform
}) {
  const stickerFaces = listStickerFaces(faceColors)

  return (
    <>
      {stickerFaces.map((face) => {
        const transform = resolveTransform(face)
        const color = faceColors[face]!
        return (
          <mesh
            key={face}
            material={getStickerMaterial(color)}
            position={transform.position}
            quaternion={transform.quaternion}
            renderOrder={stickerRenderOrder}
          >
            <boxGeometry args={[transform.stickerSize, transform.stickerSize, transform.stickerDepth]} />
          </mesh>
        )
      })}
    </>
  )
}

/** Default model — rounded body with raised rounded sticker caps. */
export function ModernCubieModel({
  faceColors,
  bodyMaterial,
  getStickerMaterial,
  bodyRenderOrder,
  stickerRenderOrder,
}: CubieModelMeshProps) {
  const stickerFaces = listStickerFaces(faceColors)

  return (
    <>
      <RoundedBox
        args={[BODY_SIZE, BODY_SIZE, BODY_SIZE]}
        radius={0.035}
        smoothness={4}
        material={bodyMaterial}
        renderOrder={bodyRenderOrder}
        dispose={null}
      />
      {stickerFaces.map((face) => {
        const transform = getStickerTransform(face)
        const color = faceColors[face]!
        return (
          <RoundedBox
            key={face}
            args={[STICKER_SIZE, STICKER_SIZE, STICKER_DEPTH]}
            radius={0.008}
            smoothness={2}
            material={getStickerMaterial(color)}
            position={transform.position}
            quaternion={transform.quaternion}
            renderOrder={stickerRenderOrder}
            dispose={null}
          />
        )
      })}
    </>
  )
}

/** Vintage cube — sharp cubie blocks and small flush square stickers. */
export function ClassicCubieModel({
  faceColors,
  bodyMaterial,
  getStickerMaterial,
  bodyRenderOrder,
  stickerRenderOrder,
}: CubieModelMeshProps) {
  return (
    <>
      <mesh material={bodyMaterial} renderOrder={bodyRenderOrder}>
        <boxGeometry args={[BODY_SIZE, BODY_SIZE, BODY_SIZE]} />
      </mesh>
      <StickerTiles
        faceColors={faceColors}
        getStickerMaterial={getStickerMaterial}
        stickerRenderOrder={stickerRenderOrder}
        resolveTransform={(face) => getCustomStickerTransform(face, 0.8, 0.012, 0.006)}
      />
    </>
  )
}

/** Framed cube — rounded body with stickers set into recessed wells. */
export function InsetCubieModel({
  faceColors,
  bodyMaterial,
  getStickerMaterial,
  bodyRenderOrder,
  stickerRenderOrder,
}: CubieModelMeshProps) {
  return (
    <>
      <RoundedBox
        args={[BODY_SIZE, BODY_SIZE, BODY_SIZE]}
        radius={0.022}
        smoothness={3}
        material={bodyMaterial}
        renderOrder={bodyRenderOrder}
        dispose={null}
      />
      <StickerTiles
        faceColors={faceColors}
        getStickerMaterial={getStickerMaterial}
        stickerRenderOrder={stickerRenderOrder}
        resolveTransform={(face) => getCustomStickerTransform(face, 0.72, 0.032, -0.018)}
      />
    </>
  )
}

// Registry map lives alongside model components for a single import surface.
// eslint-disable-next-line react-refresh/only-export-components -- shared cubie model registry
export const CUBIE_MODEL_COMPONENTS: Record<CubeShapeId, ComponentType<CubieModelMeshProps>> = {
  modern: ModernCubieModel,
  classic: ClassicCubieModel,
  inset: InsetCubieModel,
}

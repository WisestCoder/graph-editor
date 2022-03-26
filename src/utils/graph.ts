import { ComponentType } from 'react'
import DefaultNode from '@/components/Node/Default'
import DefaultEdge from '@/components/Edge/Default'
import cloneDeep from 'lodash/cloneDeep'
import {
  Node,
  NodeTypes,
  EdgeTypes,
  Dimensions,
  XYPosition,
  PointerPosition,
  ArrowType,
  Orientation,
} from '@/types'

/**
 * get visible nodes
 * only visible === false will hidden
 * @param nodes
 * @returns visible nodes
 */
export function getVisibleNodes(nodes: Node[]) {
  if (!(nodes && nodes.length)) {
    return []
  }

  return nodes.filter((item) => item.visible !== false)
}

/**
 * merge node types [default]
 * @param nodeTypes
 * @returns merged node types
 */
export function mergeNodeTypes(nodeTypes: NodeTypes = {}) {
  const standardTypes: NodeTypes = {
    default: DefaultNode as ComponentType<Node>,
  }

  const standardKeys = Object.keys(standardTypes)

  const specialTypes: NodeTypes = Object.keys(nodeTypes)
    .filter((key) => !standardKeys.includes(key))
    .reduce(
      (res, key) => ({
        ...res,
        [key]: nodeTypes[key],
      }),
      {},
    )

  return {
    ...standardTypes,
    ...specialTypes,
  }
}

/**
 * merge node types [default]
 * @param edgeTypes
 * @returns merged node types
 */
export function mergeEdgeTypes(edgeTypes: EdgeTypes = {}) {
  const standardTypes: EdgeTypes = {
    default: DefaultEdge as ComponentType<any>,
  }

  const standardKeys = Object.keys(standardTypes)

  const specialTypes: EdgeTypes = Object.keys(edgeTypes)
    .filter((key) => !standardKeys.includes(key))
    .reduce(
      (res, key) => ({
        ...res,
        [key]: edgeTypes[key],
      }),
      {},
    )

  return {
    ...standardTypes,
    ...specialTypes,
  }
}

/**
 * update nodes position
 * @param param0 id
 * @param param1 node
 * @param param2 nodes
 * @param param3 diff
 */
export function updateNodePosition({ id, nodes, diff }): Node[] {
  const findIndex = nodes.findIndex((item) => item.id === id)
  const nextNodes = cloneDeep(nodes)
  findIndex >= 0 &&
    (nextNodes[findIndex] = {
      ...nextNodes[findIndex],
      position: {
        x: nextNodes[findIndex].position.x + diff.x,
        y: nextNodes[findIndex].position.y + diff.y,
      },
    })

  return nextNodes
}

/**
 * get document
 * @param element
 * @returns document
 */
export function getDocument(element: HTMLElement): Document | ShadowRoot {
  return (element.getRootNode?.() as Document | ShadowRoot) || window?.document
}

export const getDimensions = (node: HTMLElement): Dimensions => ({
  width: node.offsetWidth,
  height: node.offsetHeight,
})

export interface GetCenterParams {
  source: XYPosition
  target: XYPosition
}

export function getCenter({ source, target }: GetCenterParams): [number, number, number, number] {
  const xOffset = Math.abs(target.x - source.x) / 2
  const centerX = target.x < source.x ? target.x + xOffset : target.x - xOffset

  const yOffset = Math.abs(target.y - source.y) / 2
  const centerY = target.y < source.y ? target.y + yOffset : target.y - yOffset

  return [centerX, centerY, xOffset, yOffset]
}

interface GetBezierPathParams {
  source: XYPosition
  target: XYPosition
  orientation: Orientation
}

/**
 * getBezierPath
 * @param source source positions
 * @param target target positions
 * @returns bezier path
 */
export function getBezierPath({ source, target, orientation }: GetBezierPathParams) {
  const [
    sourcePosition = PointerPosition.Bottom,
    targetPosition = PointerPosition.Top,
  ] = getPointerPositionByOrientation(orientation)
  const leftAndRight = [PointerPosition.Left, PointerPosition.Right]
  const [centerX, centerY] = getCenter({ source, target })

  let path = `M${source.x},${source.y} C${source.x},${centerY} ${target.x},${centerY} ${target.x},${target.y}`

  if (leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
    path = `M${source.x},${source.y} C${centerX},${source.y} ${centerX},${target.y} ${target.x},${target.y}`
  } else if (leftAndRight.includes(targetPosition)) {
    path = `M${source.x},${source.y} C${source.x},${target.y} ${source.x},${target.y} ${target.x},${target.y}`
  } else if (leftAndRight.includes(sourcePosition)) {
    path = `M${source.x},${source.y} C${target.x},${source.y} ${target.x},${source.y} ${target.x},${target.y}`
  }

  return path
}

// These are some helper methods for drawing the round corners
// The name indicates the direction of the path. "bottomLeftCorner" goes
// from bottom to the left and "leftBottomCorner" goes from left to the bottom.
// We have to consider the direction of the paths because of the animated lines.
const bottomLeftCorner = (x: number, y: number, size: number): string =>
  `L ${x},${y - size}Q ${x},${y} ${x + size},${y}`
const leftBottomCorner = (x: number, y: number, size: number): string =>
  `L ${x + size},${y}Q ${x},${y} ${x},${y - size}`
const bottomRightCorner = (x: number, y: number, size: number): string =>
  `L ${x},${y - size}Q ${x},${y} ${x - size},${y}`
const rightBottomCorner = (x: number, y: number, size: number): string =>
  `L ${x - size},${y}Q ${x},${y} ${x},${y - size}`
const leftTopCorner = (x: number, y: number, size: number): string =>
  `L ${x + size},${y}Q ${x},${y} ${x},${y + size}`
const topLeftCorner = (x: number, y: number, size: number): string =>
  `L ${x},${y + size}Q ${x},${y} ${x + size},${y}`
const topRightCorner = (x: number, y: number, size: number): string =>
  `L ${x},${y + size}Q ${x},${y} ${x - size},${y}`
const rightTopCorner = (x: number, y: number, size: number): string =>
  `L ${x - size},${y}Q ${x},${y} ${x},${y + size}`

interface GetSmoothStepPathParams {
  source: XYPosition
  sourcePosition?: PointerPosition
  target: XYPosition
  targetPosition?: PointerPosition
  borderRadius?: number
  orientation: Orientation
}

export function getSmoothStepPath({
  source,
  target,
  borderRadius = 5,
  orientation,
}: GetSmoothStepPathParams): string {
  const [
    sourcePosition = PointerPosition.Bottom,
    targetPosition = PointerPosition.Top,
  ] = getPointerPositionByOrientation(orientation)
  const { x: sourceX, y: sourceY } = source
  const { x: targetX, y: targetY } = target
  const [_centerX, _centerY, offsetX, offsetY] = getCenter({ source, target })
  const cornerWidth = Math.min(borderRadius, Math.abs(targetX - sourceX))
  const cornerHeight = Math.min(borderRadius, Math.abs(targetY - sourceY))
  const cornerSize = Math.min(cornerWidth, cornerHeight, offsetX, offsetY)
  const leftAndRight = [PointerPosition.Left, PointerPosition.Right]

  const cX = _centerX
  const cY = _centerY

  let firstCornerPath = null
  let secondCornerPath = null

  if (sourceX <= targetX) {
    firstCornerPath =
      sourceY <= targetY
        ? bottomLeftCorner(sourceX, cY, cornerSize)
        : topLeftCorner(sourceX, cY, cornerSize)
    secondCornerPath =
      sourceY <= targetY
        ? rightTopCorner(targetX, cY, cornerSize)
        : rightBottomCorner(targetX, cY, cornerSize)
  } else {
    firstCornerPath =
      sourceY < targetY
        ? bottomRightCorner(sourceX, cY, cornerSize)
        : topRightCorner(sourceX, cY, cornerSize)
    secondCornerPath =
      sourceY < targetY
        ? leftTopCorner(targetX, cY, cornerSize)
        : leftBottomCorner(targetX, cY, cornerSize)
  }

  if (leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
    if (sourceX <= targetX) {
      firstCornerPath =
        sourceY <= targetY
          ? rightTopCorner(cX, sourceY, cornerSize)
          : rightBottomCorner(cX, sourceY, cornerSize)
      secondCornerPath =
        sourceY <= targetY
          ? bottomLeftCorner(cX, targetY, cornerSize)
          : topLeftCorner(cX, targetY, cornerSize)
    }
  } else if (leftAndRight.includes(sourcePosition) && !leftAndRight.includes(targetPosition)) {
    if (sourceX <= targetX) {
      firstCornerPath =
        sourceY <= targetY
          ? rightTopCorner(targetX, sourceY, cornerSize)
          : rightBottomCorner(targetX, sourceY, cornerSize)
    } else {
      firstCornerPath =
        sourceY <= targetY
          ? leftTopCorner(targetX, sourceY, cornerSize)
          : leftBottomCorner(targetX, sourceY, cornerSize)
    }
    secondCornerPath = ''
  } else if (!leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
    if (sourceX <= targetX) {
      firstCornerPath =
        sourceY <= targetY
          ? bottomLeftCorner(sourceX, targetY, cornerSize)
          : topLeftCorner(sourceX, targetY, cornerSize)
    } else {
      firstCornerPath =
        sourceY <= targetY
          ? bottomRightCorner(sourceX, targetY, cornerSize)
          : topRightCorner(sourceX, targetY, cornerSize)
    }
    secondCornerPath = ''
  }

  return `M ${sourceX},${sourceY}${firstCornerPath}${secondCornerPath}L ${targetX},${targetY}`
}

export type GetMarkerEndParams = {
  arrowType?: ArrowType
  markerEndId?: string
  isSelected?: boolean
}

export function getMarkerEnd({ arrowType, markerEndId, isSelected }: GetMarkerEndParams): string {
  if (typeof markerEndId !== 'undefined' && markerEndId) {
    return `url(#${markerEndId})`
  }

  return typeof arrowType !== 'undefined'
    ? `url(#graph-editor-marker-definitions__${ArrowType[arrowType]}${isSelected ? '__selected' : ''})`
    : 'none'
}

export function getArrowEndOffset(arrowType: ArrowType): number {
  return arrowType ? -3 : 0
}

export type GetPositionByOrientationParams = {
  sourcePosition: XYPosition
  targetPosition: XYPosition
  sourceDimension: Dimensions
  targetDimension: Dimensions
  arrowType?: ArrowType
  orientation: Orientation
}

export function getPositionByOrientation({
  sourcePosition,
  targetPosition,
  sourceDimension,
  targetDimension,
  arrowType,
  orientation,
}: GetPositionByOrientationParams): { source: XYPosition; target: XYPosition } {
  switch (orientation) {
    case Orientation.LeftToRight:
      return {
        source: {
          x: sourcePosition.x + sourceDimension.width,
          y: sourcePosition.y + sourceDimension.height / 2,
        },
        target: {
          x: targetPosition.x + getArrowEndOffset(arrowType),
          y: targetPosition.y + targetDimension.height / 2,
        },
      }
    case Orientation.RightToLeft:
      return {
        source: {
          x: sourcePosition.x,
          y: sourcePosition.y + sourceDimension.height / 2,
        },
        target: {
          x: targetPosition.x + targetDimension.width - getArrowEndOffset(arrowType),
          y: targetPosition.y + targetDimension.height / 2,
        },
      }
    case Orientation.BottomToTop:
      return {
        source: {
          x: sourcePosition.x + sourceDimension.width / 2,
          y: sourcePosition.y,
        },
        target: {
          x: targetPosition.x + targetDimension.width / 2,
          y: targetPosition.y + targetDimension.height - getArrowEndOffset(arrowType),
        },
      }
    case Orientation.TopToBottom:
    default:
      return {
        source: {
          x: sourcePosition.x + sourceDimension.width / 2,
          y: sourcePosition.y + sourceDimension.height,
        },
        target: {
          x: targetPosition.x + targetDimension.width / 2,
          y: targetPosition.y + getArrowEndOffset(arrowType),
        },
      }
  }
}

export function getPointerPositionByOrientation(
  orientation: Orientation,
): [PointerPosition, PointerPosition] {
  switch (orientation) {
    case Orientation.LeftToRight:
      return [PointerPosition.Left, PointerPosition.Right]
    case Orientation.RightToLeft:
      return [PointerPosition.Right, PointerPosition.Left]
    case Orientation.BottomToTop:
      return [PointerPosition.Bottom, PointerPosition.Top]
    case Orientation.TopToBottom:
    default:
      return [PointerPosition.Top, PointerPosition.Bottom]
  }
}

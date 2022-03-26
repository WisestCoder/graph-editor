import { MouseEvent } from 'react'
import ReactDOM from 'react-dom'
import { Node, PointerType, Edge, ZoomTransform, Rect, NodeRect } from '@/types'

export function addEventListener(
  target: HTMLElement | Document | ShadowRoot | Window,
  eventType: keyof HTMLElementEventMap,
  cb: EventListener,
  option?,
) {
  const callback: EventListener = ReactDOM.unstable_batchedUpdates
    ? function run(e) {
        ReactDOM.unstable_batchedUpdates(cb, e)
      }
    : cb
  if (target.addEventListener) {
    target.addEventListener(eventType, callback, option)
  }
  return {
    remove: () => {
      if (target.removeEventListener) {
        target.removeEventListener(eventType, callback)
      }
    },
  }
}

export type CheckLineEndPointParams = {
  doc: Document | ShadowRoot
  e: MouseEvent
  node: Node
  edges: Edge[]
}

export function checkLineEndPoint({ doc, e, node, edges }: CheckLineEndPointParams) {
  const targetElements = (doc as Document).elementFromPoint(e.clientX, e.clientY)
  const targetType = targetElements.getAttribute('data-type')
  const targetNodeId = targetElements.getAttribute('data-node-id')
  const connectable = targetElements.getAttribute('data-node-connectable') === '1'

  // does't hit
  if (targetType !== PointerType.Input) {
    return {
      isHit: false,
    }
  }

  // connectable = false
  if (!connectable) {
    return {
      isHit: false,
    }
  }

  // hit self
  if (!targetNodeId || node.id === targetNodeId) {
    return {
      isHit: false,
    }
  }

  // hit other but is being connected, can't connect again
  const isConnected = edges.some(
    ({ source, target }) =>
      (source === node.id && target === targetNodeId) || (target === node.id && source === targetNodeId),
  )
  if (isConnected) {
    return {
      isHit: false,
    }
  }

  return {
    isHit: true,
    target: targetNodeId,
  }
}

// export type GetFringeRectParams = {
//   nodes: Node[]
//   transform: ZoomTransform
//   width: number
//   height: number
//   elementWidth: number
//   elementHeight: number
// }

export type GetFringeRectParams = {
  nodes: Node[]
  transform: ZoomTransform
  width: number
  height: number
  elementWidth: number
  elementHeight: number
  minMapScale: number
  graphRect: Rect & { right?: number; bottom?: number }
}

export function getFringeRect({
  transform,
  width,
  height,
  elementWidth,
  elementHeight,
  minMapScale,
  graphRect,
}: GetFringeRectParams) {
  const viewWidth = width * minMapScale
  const viewHeight = height * minMapScale
  const scale = Math.min(elementWidth / viewWidth, elementHeight / viewHeight)
  const viewOffsetX = (elementWidth - viewWidth * scale) / 2
  const viewOffsetY = (elementHeight - viewHeight * scale) / 2
  const graphScale = scale / transform.k
  const wrapperWidth = (width * scale) / transform.k
  const wrapperHeight = (height * scale) / transform.k
  const offsetX = (viewWidth - graphRect.width) / 2
  const offsetY = (viewHeight - graphRect.height) / 2
  const wrapperX = (offsetX - graphRect.left) * scale - transform.x * graphScale + viewOffsetX
  const wrapperY = (offsetY - graphRect.top) * scale - transform.y * graphScale + viewOffsetY

  return {
    viewWidth,
    viewHeight,
    wrapperWidth,
    wrapperHeight,
    wrapperX,
    wrapperY,
    offsetX,
    offsetY,
    graphScale,
    scale,
  }
}

const DEFAULT_GRAPH_RECT = {
  top: Infinity,
  left: Infinity,
  right: -Infinity,
  bottom: -Infinity,
}

export function getRectOfNodes(
  nodes: Node[],
  nodeRects: NodeRect[],
): Rect & { right?: number; bottom?: number } {
  if (!(nodes && nodes.length)) {
    return {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    }
  }

  const fringePoints = nodes?.reduce(
    (pre, curv: Node) => ({
      top: Math.min(pre.top, curv.position?.y || 0),
      bottom: Math.max(
        pre.bottom,
        (curv.position?.y || 0) + (nodeRects?.find((rect) => rect.id === curv.id)?.height || 0),
      ),
      left: Math.min(pre.left, curv.position?.x || 0),
      right: Math.max(
        pre.right,
        (curv.position?.x || 0) + (nodeRects?.find((rect) => rect.id === curv.id)?.width || 0),
      ),
    }),
    DEFAULT_GRAPH_RECT,
  )

  return {
    ...fringePoints,
    width: fringePoints.right - fringePoints.left,
    height: fringePoints.bottom - fringePoints.top,
  }
}

export function getBoundsofRects(rects: Rect[]) {
  const left = Math.min(...rects.map((item) => item.left))
  const top = Math.min(...rects.map((item) => item.top))
  const right = Math.max(...rects.map((item) => item.left + item.width))
  const bottom = Math.max(...rects.map((item) => item.height))

  return {
    left,
    top,
    width: right - left,
    height: bottom - top,
  }
}

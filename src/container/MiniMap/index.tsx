import React, { FC, CSSProperties, useRef, useMemo } from 'react'
import useGlobal from '@/hooks/useGlobal'
import { getFringeRect, getRectOfNodes } from '@/utils/dom'
import cn from 'classnames'
import { zoomIdentity } from 'd3-zoom'
import { DraggableCore, DraggableEvent, DraggableData } from 'react-draggable'
import { Node } from '@/types'

import './index.less'

const defaultWidth = 200
const defaultHeight = 200

export interface MiniMapProps {
  prefix?: string
  className?: string
  style?: CSSProperties
  draggable?: boolean
  minMapScale?: number
}

const MiniMap: FC<MiniMapProps> = ({
  prefix = 'graph-editor-minimap',
  className = '',
  draggable = false,
  style = {},
  minMapScale = 2.5,
}) => {
  const [global] = useGlobal()
  const operateRef = useRef()
  const graphRect = useMemo(() => getRectOfNodes(global.nodes, global.nodeRects), [
    global.nodes,
    global.nodeRects,
  ])

  if (!global?.container) {
    return null
  }

  const elementWidth = (style?.width || defaultWidth)! as number
  const elementHeight = (style?.height || defaultHeight)! as number

  const { width, height } = global.container
  const {
    viewWidth,
    viewHeight,
    offsetX,
    offsetY,
    wrapperHeight,
    wrapperWidth,
    graphScale,
    wrapperX,
    wrapperY,
  } = getFringeRect({
    minMapScale,
    width,
    height,
    elementWidth,
    elementHeight,
    graphRect,
    ...global,
  })

  return (
    <div
      className={cn(prefix, className)}
      style={{
        width: elementWidth,
        height: elementHeight,
      }}
    >
      <DraggableCore
        disabled={!draggable}
        nodeRef={operateRef}
        onDrag={(event: DraggableEvent, draggableData: DraggableData) => {
          const { deltaX, deltaY } = draggableData

          if (global.zoomInstance && global.zoomSelection) {
            const nextTransform = zoomIdentity
              .translate(
                global.transform.x - deltaX / graphScale,
                global.transform.y - deltaY / graphScale,
              )
              .scale(global.transform.k)
            global.zoomInstance.transform(global.zoomSelection, nextTransform)
          }
        }}
        grid={[1, 1]}
      >
        <div
          ref={operateRef}
          className={`${prefix}-operate`}
          style={{
            width: wrapperWidth,
            height: wrapperHeight,
            left: wrapperX,
            top: wrapperY,
          }}
        />
      </DraggableCore>
      <svg width={elementWidth} height={elementHeight} viewBox={`0, 0, ${viewWidth}, ${viewHeight}`}>
        <g
          transform={`translate(${offsetX || 0},${offsetY || 0})`}
          fill="rgba(110, 136, 255, 0.8)"
          // stroke="#000"
        >
          {global.nodes.map(({ position, id }: Node) => {
            const nodeRect = global.nodeRects?.find((rect) => rect.id === id)
            return (
              <rect
                key={id}
                x={position.x - graphRect.left}
                y={position.y - graphRect.top}
                rx={2}
                ry={2}
                width={nodeRect?.width}
                height={nodeRect?.height}
                shapeRendering="crispedges" // This value indicates that the user agent shall attempt to emphasize the contrast between clean edges of artwork over rendering speed and geometric precision
              />
            )
          })}
        </g>
      </svg>
    </div>
  )
}

MiniMap.displayName = 'MiniMap'

export default MiniMap

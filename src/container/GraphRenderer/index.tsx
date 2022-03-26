import React, { FC, memo, PropsWithChildren, useRef } from 'react'
import ZoomWrapper from '@/container/ZoomWrapper'
import NodeRenderer from '@/container/NodeRenderer'
import EdgeRenderer from '@/container/EdgeRenderer'
import { GraphEditorProps } from '@/container/GraphEditor'
import { useBatchUpdateDimension } from '@/hooks/useDimension'
import useDelete from '@/hooks/useDelete'

export type GraphRendererProps = PropsWithChildren<Omit<GraphEditorProps, 'style' | 'className'>>

const GraphRenderer: FC<GraphRendererProps> = ({
  prefix,
  children,
  nodeTypes,
  edgeTypes,
  onNodeMouseEnter,
  onNodeMouseMove,
  onNodeMouseLeave,
  onNodeClick,
  onNodeDoubleClick,
  onNodeDrag,
  onNodeDragStart,
  onNodeDragStop,
  onConnect,
  onConnectStart,
  onConnectStop,
  onConnectEnd,
  onEdgeClick,
  onEdgeDoubleClick,
  onEdgeMouseEnter,
  onEdgeMouseMove,
  onEdgeMouseLeave,
  onEdgeDelete,
  onNodeDelete,
  connectLine,
  orientation,
}) => {
  const placeholderRef = useRef<HTMLDivElement>()

  useBatchUpdateDimension(placeholderRef)

  useDelete({ onNodeDelete, onEdgeDelete })

  return (
    <>
      <ZoomWrapper prefix={prefix}>
        {({ transform, transformStyle }) => (
          <>
            <EdgeRenderer
              edgeTypes={edgeTypes}
              transform={transform}
              transformStyle={transformStyle}
              onEdgeClick={onEdgeClick}
              onEdgeDoubleClick={onEdgeDoubleClick}
              onEdgeMouseEnter={onEdgeMouseEnter}
              onEdgeMouseMove={onEdgeMouseMove}
              onEdgeMouseLeave={onEdgeMouseLeave}
              connectLine={connectLine}
              orientation={orientation}
            />
            <NodeRenderer
              transform={transform}
              transformStyle={transformStyle}
              nodeTypes={nodeTypes}
              onNodeMouseEnter={onNodeMouseEnter}
              onNodeMouseMove={onNodeMouseMove}
              onNodeMouseLeave={onNodeMouseLeave}
              onNodeClick={onNodeClick}
              onNodeDoubleClick={onNodeDoubleClick}
              onNodeDrag={onNodeDrag}
              onNodeDragStart={onNodeDragStart}
              onNodeDragStop={onNodeDragStop}
              onConnect={onConnect}
              onConnectStart={onConnectStart}
              onConnectStop={onConnectStop}
              onConnectEnd={onConnectEnd}
              orientation={orientation}
            />
            <div ref={placeholderRef} />
          </>
        )}
      </ZoomWrapper>
      {children}
    </>
  )
}

export default memo(GraphRenderer)

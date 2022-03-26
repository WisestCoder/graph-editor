import React, { FC, memo, useMemo } from 'react'
import ConnectLineRenderer from '@/container/ConnectLineRenderer'
import { GraphRendererProps } from '@/container/GraphRenderer'
import EdgeComponent from '@/components/Edge'
import useGlobal from '@/hooks/useGlobal'
import { mergeEdgeTypes } from '@/utils/graph'
import { ZoomTransform, Edge } from '@/types'
import MarkerDefinitions from '@/components/MarkerDefinitions'

import './index.less'

export type EdgeRendererProps = Pick<
  GraphRendererProps,
  | 'prefix'
  | 'edgeTypes'
  | 'onEdgeClick'
  | 'onEdgeDoubleClick'
  | 'onEdgeMouseEnter'
  | 'onEdgeMouseMove'
  | 'onEdgeMouseLeave'
  | 'onElementChange'
  | 'connectLine'
  | 'orientation'
> & {
  transform: ZoomTransform
  transformStyle: string
}

const EdgeRenderer: FC<EdgeRendererProps> = ({
  prefix = 'graph-editor-edge-renderer',
  edgeTypes,
  transform,
  onEdgeClick,
  onEdgeDoubleClick,
  onEdgeMouseEnter,
  onEdgeMouseMove,
  onEdgeMouseLeave,
  connectLine = {},
  orientation,
}) => {
  const [{ edges, nodes }] = useGlobal()

  const mergedEdgeTypes = useMemo(() => mergeEdgeTypes(edgeTypes), [edgeTypes])

  return (
    <svg className={prefix}>
      <MarkerDefinitions />
      <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
        <ConnectLineRenderer connectLine={connectLine} orientation={orientation} />
        {edges.map((edge: Edge) => {
          const Component = mergedEdgeTypes[edge.type] || mergedEdgeTypes.default
          const id = edge.id || `${edge.source}_${edge.target}`

          if (
            !(
              nodes.find((node) => node.id === edge.source) &&
              nodes.find((node) => node.id === edge.target)
            )
          ) {
            return null
          }

          return (
            <EdgeComponent
              key={id}
              id={id}
              style={edge.style}
              className={edge.className}
              data={edge.data}
              label={edge.label}
              lineType={edge.lineType}
              arrowType={edge.arrowType}
              source={edge.source}
              target={edge.target}
              selectable={edge.selectable}
              Component={Component}
              edge={edge}
              onEdgeClick={onEdgeClick}
              onEdgeDoubleClick={onEdgeDoubleClick}
              onEdgeMouseEnter={onEdgeMouseEnter}
              onEdgeMouseMove={onEdgeMouseMove}
              onEdgeMouseLeave={onEdgeMouseLeave}
              connectLine={connectLine}
              orientation={orientation}
            />
          )
        })}
      </g>
    </svg>
  )
}

EdgeRenderer.displayName = 'EdgeRenderer'

export default memo(EdgeRenderer)

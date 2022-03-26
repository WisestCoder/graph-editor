import React, { FC, memo, useCallback, useMemo, useRef } from 'react'
import { GraphRendererProps } from '@/container/GraphRenderer'
import NodeComponent from '@/components/Node'
import { getVisibleNodes, mergeNodeTypes } from '@/utils/graph'
import useGlobal from '@/hooks/useGlobal'
import useNodeResizeObserver from '@/hooks/useNodeResizeObserver'
import cloneDeep from 'lodash/cloneDeep'
import { ZoomTransform, Node } from '@/types'

import './index.less'

export type NodeRendererProps = Pick<
  GraphRendererProps,
  | 'prefix'
  | 'nodeTypes'
  | 'onNodeClick'
  | 'onNodeDoubleClick'
  | 'onNodeDrag'
  | 'onNodeDragStart'
  | 'onNodeDragStop'
  | 'onNodeMouseEnter'
  | 'onNodeMouseLeave'
  | 'onNodeMouseMove'
  | 'onConnect'
  | 'onConnectStart'
  | 'onConnectStop'
  | 'onConnectEnd'
  | 'onElementChange'
  | 'orientation'
> & {
  transform: ZoomTransform
  transformStyle: string
}

const NodeRenderer: FC<NodeRendererProps> = ({
  prefix = 'graph-editor-node-renderer',
  nodeTypes,
  onNodeClick,
  onNodeDoubleClick,
  onNodeDrag,
  onNodeDragStart,
  onNodeDragStop,
  onNodeMouseEnter,
  onNodeMouseLeave,
  onNodeMouseMove,
  onConnect,
  onConnectStart,
  onConnectStop,
  onConnectEnd,
  transformStyle,
  orientation,
}) => {
  const observerRef = useRef<(element: HTMLElement) => void>()
  const [{ nodes, onElementChange }] = useGlobal()

  const visibleNodes = useMemo(() => getVisibleNodes(nodes), [nodes])

  const mergedNodeTypes = useMemo(() => mergeNodeTypes(nodeTypes), [nodeTypes])

  observerRef.current = useNodeResizeObserver()

  const onNodeChange = useCallback(
    (id, newValue, force = true) => {
      const cloneNodes: Node[] = cloneDeep(nodes)
      const findIndex = cloneNodes.findIndex((node) => node.id === id)

      if (force) {
        cloneNodes[findIndex].data = newValue
      } else {
        cloneNodes[findIndex].data = Object.assign(cloneNodes[findIndex].data, newValue)
      }

      onElementChange({
        nodes: cloneNodes,
      })
    },
    [nodes, onElementChange],
  )

  return (
    <div className={prefix} style={{ transform: transformStyle, transformOrigin: '0 0' }}>
      {visibleNodes.map((node, index) => {
        const Component = mergedNodeTypes[node.type] || mergedNodeTypes.default

        return (
          <NodeComponent
            key={node.id || index}
            className={node.className}
            style={node.style}
            id={node.id}
            cancel={node.cancel}
            data={node.data}
            connectable={node.connectable}
            draggable={node.draggable}
            selectable={node.selectable}
            deletable={node.deletable}
            position={node.position}
            node={node}
            nodeType={node.type}
            Component={Component}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            onNodeDrag={onNodeDrag}
            onNodeDragStart={onNodeDragStart}
            onNodeDragStop={onNodeDragStop}
            onNodeMouseEnter={onNodeMouseEnter}
            onNodeMouseLeave={onNodeMouseLeave}
            onNodeMouseMove={onNodeMouseMove}
            onConnect={onConnect}
            onConnectStart={onConnectStart}
            onConnectStop={onConnectStop}
            onConnectEnd={onConnectEnd}
            onChange={(...args) => {
              onNodeChange(node.id, ...args)
            }}
            orientation={orientation}
            observer={observerRef.current}
          />
        )
      })}
    </div>
  )
}

NodeRenderer.displayName = 'NodeRenderer'

export default memo(NodeRenderer)

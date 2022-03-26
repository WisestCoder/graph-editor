import React, { forwardRef, useImperativeHandle, CSSProperties, PropsWithChildren } from 'react'
import cn from 'classnames'
import GlobalProvider from '@/container/GlobalProvider'
import GraphRenderer from '@/container/GraphRenderer'
import { useZoomHelper } from '@/hooks/useZoom'
import {
  Elements,
  NodeTypes,
  EdgeTypes,
  NodeEventHandler,
  ConnectEventHandler,
  EdgeEventHandler,
  ConnectLine,
  Orientation,
  Theme,
  ElementsEventHandler,
  ZoomHelper,
} from '@/types'

import './index.less'
import '../../styles/index.less'

export interface GraphEditorProps {
  prefix?: string
  style?: CSSProperties
  className?: string
  defaultElements?: Elements
  /**
   * elements，collect by nodes and edges
   * @example
   * ```
   * const elements = {
   *   nodes: [],
   *   edges: []
   * }
   * ```
   */
  elements?: Elements
  /**
   * nodeType collect
   * @example
   * ```
   * import CustomNode from '../CustomNode'
   * const nodeTypes = {
   *   nodeType1: CustomNode,
   *   ...other
   * }
   * ```
   */
  nodeTypes?: NodeTypes
  /**
   * lineType collect
   * @example
   * ```
   * import CustomEdge from '../CustomEdge'
   * const edgeTypes = {
   *   edgeType1: CustomEdge,
   *   ...other
   * }
   * ```
   */
  edgeTypes?: EdgeTypes
  /**
   * draggable
   */
  draggable?: boolean
  /**
   * selectable
   */
  selectable?: boolean
  /**
   * connectable
   */
  connectable?: boolean
  /**
   * deletable
   */
  deletable?: boolean
  /**
   * orientation
   * @enum 'lr' | 'rl' | 'tb' | 'bt'
   */
  orientation?: Orientation
  /**
   * theme
   * @enum 'normal' | 'primary'
   */
  theme?: Theme
  /**
   * node event: onMouseEnter
   */
  onNodeMouseEnter?: NodeEventHandler
  /**
   * node event: onMouseMove
   */
  onNodeMouseMove?: NodeEventHandler
  /**
   * node event: onMouseLeave
   */
  onNodeMouseLeave?: NodeEventHandler
  /**
   * node event: onClick
   */
  onNodeClick?: NodeEventHandler
  /**
   * node event: onDoubleClick
   */
  onNodeDoubleClick?: NodeEventHandler
  /**
   * node event: onDragStart
   */
  onNodeDragStart?: NodeEventHandler
  /**
   * node event: onDrag
   */
  onNodeDrag?: NodeEventHandler
  /**
   * node event: onDragStop
   */
  onNodeDragStop?: NodeEventHandler
  /**
   * node event: onDelete
   */
  onNodeDelete?: NodeEventHandler
  /**
   * connect line props
   */
  connectLine?: ConnectLine
  /**
   * connect event: onConnect
   */
  onConnect?: ConnectEventHandler
  /**
   * connect event: onStart
   */
  onConnectStart?: ConnectEventHandler
  /**
   * connect event: onStop
   */
  onConnectStop?: ConnectEventHandler
  /**
   * connect event: onEnd
   */
  onConnectEnd?: ConnectEventHandler
  /**
   * edge event: onClick
   */
  onEdgeClick?: EdgeEventHandler
  /**
   * edge event: onDoubleClick
   */
  onEdgeDoubleClick?: EdgeEventHandler
  /**
   * edge event: onMouseEnter
   */
  onEdgeMouseEnter?: EdgeEventHandler
  /**
   * edge event: onMouseMove
   */
  onEdgeMouseMove?: EdgeEventHandler
  /**
   * edge event: onMouseLeave
   */
  onEdgeMouseLeave?: EdgeEventHandler
  /**
   * edge event: onDelete
   */
  onEdgeDelete?: EdgeEventHandler
  /**
   * element event: onChange
   */
  onElementChange?: ElementsEventHandler
}

export type GraphEditorRefProps = Pick<ZoomHelper, 'getGraph'>

const GraphEditor = forwardRef<GraphEditorRefProps, PropsWithChildren<GraphEditorProps>>(
  (
    {
      prefix = 'graph-editor',
      style = {},
      className,
      defaultElements = {},
      elements,
      nodeTypes,
      edgeTypes,
      onNodeMouseEnter,
      onNodeMouseMove,
      onNodeMouseLeave,
      onNodeClick,
      onNodeDoubleClick,
      onNodeDragStart,
      onNodeDrag,
      onNodeDragStop,
      onNodeDelete,
      onConnect,
      onConnectStart,
      onConnectStop,
      onConnectEnd,
      onEdgeClick,
      onEdgeDoubleClick,
      onEdgeMouseEnter,
      onEdgeMouseMove,
      onEdgeMouseLeave,
      onElementChange,
      onEdgeDelete,
      draggable = true,
      selectable = true,
      connectable = true,
      deletable = true,
      orientation = Orientation.TopToBottom,
      connectLine,
      theme = Theme.Primary,
      children,
    },
    ref,
  ) => {
    const { getGraph } = useZoomHelper()

    useImperativeHandle(
      ref,
      () => ({
        getGraph,
      }),
      [getGraph],
    )

    return (
      <div className={cn([prefix, className])} style={style}>
        <GlobalProvider
          value={{
            elements,
            nodes: defaultElements?.nodes || [],
            edges: defaultElements?.edges || [],
            onElementChange,
            nodeTypes,
            edgeTypes,
            draggable,
            selectable,
            connectable,
            deletable,
            theme,
            orientation,
          }}
        >
          <GraphRenderer
            prefix={prefix}
            elements={elements}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodeMouseEnter={onNodeMouseEnter}
            onNodeMouseMove={onNodeMouseMove}
            onNodeMouseLeave={onNodeMouseLeave}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            onNodeDragStart={onNodeDragStart}
            onNodeDrag={onNodeDrag}
            onNodeDragStop={onNodeDragStop}
            onNodeDelete={onNodeDelete}
            onConnect={onConnect}
            onConnectStart={onConnectStart}
            onConnectStop={onConnectStop}
            onConnectEnd={onConnectEnd}
            onEdgeClick={onEdgeClick}
            onEdgeDoubleClick={onEdgeDoubleClick}
            onEdgeMouseEnter={onEdgeMouseEnter}
            onEdgeMouseMove={onEdgeMouseMove}
            onEdgeMouseLeave={onEdgeMouseLeave}
            onEdgeDelete={onEdgeDelete}
            connectLine={connectLine}
            orientation={orientation}
          >
            {children}
          </GraphRenderer>
        </GlobalProvider>
      </div>
    )
  },
)

GraphEditor.displayName = 'GraphEditor'

export default GraphEditor

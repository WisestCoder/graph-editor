import React, {
  FC,
  useMemo,
  useRef,
  CSSProperties,
  useCallback,
  MouseEvent,
  memo,
  PropsWithChildren,
  useEffect,
} from 'react'
import { DraggableCore, DraggableEvent, DraggableData } from 'react-draggable'
import useGlobal from '@/hooks/useGlobal'
import Pointer from '@/components/Pointer'
import { updateNodePosition, getPointerPositionByOrientation } from '@/utils/graph'
import useDimension from '@/hooks/useDimension'
import useClickPreventionOnDoubleClick from '@/hooks/useClickPreventionOnDoubleClick'
import useTheme from '@/hooks/useTheme'
import { NodeComponentProps } from '@/components/Node'
import cn from 'classnames'
import { PointerType } from '@/types'

import './index.less'

export type NodeWrapperProps = PropsWithChildren<Omit<NodeComponentProps, 'Component'>>

/**
 * Give the ability to drag
 */
const Wrapper: FC<NodeWrapperProps> = ({
  prefix = 'graph-editor-node-wrapper',
  id,
  node,
  children,
  draggable = true,
  selectable = true,
  connectable = true,
  onNodeClick,
  onNodeDoubleClick,
  onNodeMouseEnter,
  onNodeMouseMove,
  onNodeMouseLeave,
  onNodeDrag,
  onNodeDragStart,
  onNodeDragStop,
  onConnect,
  onConnectStart,
  onConnectStop,
  onConnectEnd,
  orientation,
  style = {},
  cancel = [],
  observer,
}) => {
  const theme = useTheme()
  const nodeRef = useRef<HTMLDivElement>(null)
  const [global, setGlobal] = useGlobal()
  const nodeDimension = useDimension(id)

  const onClick = useCallback(
    (e) => {
      if (selectable && global.selectable && global.selectNode?.id !== node.id) {
        setGlobal({
          selectNode: node,
          selectEdge: {},
        })
      }
      onNodeClick?.(e, node)
    },
    [selectable, global.selectable, global.selectNode?.id, node, onNodeClick, setGlobal],
  )

  const onDragStart = useCallback(
    (event: DraggableEvent) => {
      onNodeDragStart?.(event as MouseEvent, node)
      onClick?.(event as MouseEvent)
    },
    [onNodeDragStart, node, onClick],
  )

  const onDrag = useCallback(
    (event: DraggableEvent, draggableData: DraggableData) => {
      // todo don't handle onClick
      if (onNodeDrag) {
        onNodeDrag(event as MouseEvent, {
          ...node,
          position: {
            x: node.position.x + draggableData.deltaX,
            y: node.position.y + draggableData.deltaY,
          },
        })
      }

      const nodes = updateNodePosition({
        id,
        nodes: global.nodes,
        diff: {
          x: draggableData.deltaX,
          y: draggableData.deltaY,
        },
      })

      global.onElementChange({ nodes })
    },
    [onNodeDrag, id, global, node],
  )

  const onDragStop = useCallback(
    (event: DraggableEvent) => {
      onNodeDragStop?.(event as MouseEvent, node)
    },
    [onNodeDragStop, node],
  )

  const onDoubleClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      onNodeDoubleClick?.(e, node)
    },
    [onNodeDoubleClick, node],
  )

  const onMouseEnter = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      onNodeMouseEnter?.(e, node)
    },
    [onNodeMouseEnter, node],
  )

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      onNodeMouseMove?.(e, node)
    },
    [onNodeMouseMove, node],
  )

  const onMouseLeave = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      onNodeMouseLeave?.(e, node)
    },
    [onNodeMouseLeave, node],
  )

  const nodeStyle: CSSProperties = useMemo(
    () => ({
      opacity: nodeDimension.width && nodeDimension.height ? '1' : '0',
      transform: `translate(${node.position.x}px,${node.position.y}px)`,
      pointerEvents:
        (selectable && global.selectable) ||
        (connectable && global.connectable) ||
        (draggable && global.draggable) ||
        onNodeClick ||
        onNodeDoubleClick ||
        onNodeMouseEnter ||
        onNodeMouseMove ||
        onNodeMouseLeave
          ? 'all'
          : 'none',
      zIndex: global.selectNode?.id === node.id ? 1 : 'unset',
      ...style,
    }),
    [
      global.selectNode?.id,
      node.id,
      nodeDimension.width,
      nodeDimension.height,
      node.position,
      style,
      selectable,
      global.selectable,
      draggable,
      global.draggable,
      connectable,
      global.connectable,
      onNodeClick,
      onNodeDoubleClick,
      onNodeMouseEnter,
      onNodeMouseMove,
      onNodeMouseLeave,
    ],
  )

  const [handleClick, handleDoubleClick] = useClickPreventionOnDoubleClick(onClick, onDoubleClick)

  useEffect(() => {
    observer(nodeRef.current)
  }, [observer])

  const pointerPositions = getPointerPositionByOrientation(orientation)

  return (
    <DraggableCore
      onStart={onDragStart}
      onDrag={onDrag}
      onStop={onDragStop}
      scale={global.transform.k}
      grid={[1, 1]}
      disabled={!(draggable && global.draggable)}
      cancel={['.nodrag', ...cancel].join(',')}
      nodeRef={nodeRef}
      enableUserSelectHack={false}
    >
      <div
        className={cn(prefix, theme, {
          'draggable': draggable && global.draggable,
          'selectable': selectable && global.selectable,
          'connectable': connectable && global.connectable,
          'is-selected': global.selectNode?.id === node.id,
        })}
        ref={nodeRef}
        style={nodeStyle}
        onClick={(e) => {
          if (draggable && global.draggable) {
            return
          }
          handleClick(e)
        }}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        data-node-id={node.id}
      >
        {children}
        {connectable && global.connectable && (
          <>
            <Pointer
              position={pointerPositions[0]}
              nodePosition={node.position}
              type={PointerType.Input}
              node={node}
              onConnect={onConnect}
              onConnectStart={onConnectStart}
              onConnectStop={onConnectStop}
              onConnectEnd={onConnectEnd}
              connectable={connectable && global.connectable}
              orientation={orientation}
            />
            <Pointer
              position={pointerPositions[1]}
              type={PointerType.Output}
              nodePosition={node.position}
              node={node}
              onConnect={onConnect}
              onConnectStart={onConnectStart}
              onConnectStop={onConnectStop}
              onConnectEnd={onConnectEnd}
              connectable={connectable && global.connectable}
              orientation={orientation}
            />
          </>
        )}
      </div>
    </DraggableCore>
  )
}

export default memo(Wrapper)

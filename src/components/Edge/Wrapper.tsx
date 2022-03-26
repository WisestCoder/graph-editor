import React, {
  FC,
  CSSProperties,
  ReactElement,
  Children,
  cloneElement,
  memo,
  PropsWithChildren,
  useCallback,
  useMemo,
} from 'react'
import { EdgeComponentProps } from '@/components/Edge'
import usePosition from '@/hooks/usePosition'
import useDimension from '@/hooks/useDimension'
import useClickPreventionOnDoubleClick from '@/hooks/useClickPreventionOnDoubleClick'
import useGlobal from '@/hooks/useGlobal'
import useTheme from '@/hooks/useTheme'
import cn from 'classnames'
import { getPositionByOrientation } from '@/utils/graph'

export type WrapperProps = PropsWithChildren<Omit<EdgeComponentProps, 'Component'>>

const Wrapper: FC<WrapperProps> = ({
  prefix = 'graph-editor-edge-wrapper',
  edge,
  style = {},
  className = '',
  selectable = true,
  children,
  onEdgeClick,
  onEdgeDoubleClick,
  onEdgeMouseEnter,
  onEdgeMouseMove,
  onEdgeMouseLeave,
  arrowType,
  orientation,
}) => {
  const [global, setGlobal] = useGlobal()
  const theme = useTheme()
  const { source, target } = edge

  const sourcePosition = usePosition(source)
  const sourceDimension = useDimension(source)
  const targetPosition = usePosition(target)
  const targetDimension = useDimension(target)

  const onClick = useCallback(
    (e) => {
      e.stopPropagation()
      onEdgeClick?.(e, edge)
      if (
        selectable &&
        global.selectable &&
        (global.selectEdge?.source !== edge.source || global.selectEdge?.target !== edge.target)
      ) {
        setGlobal({
          selectEdge: edge,
          selectNode: {},
        })
      }
    },
    [onEdgeClick, edge, global.selectEdge, setGlobal, selectable, global.selectable],
  )

  const onDoubleClick = useCallback(
    (e) => {
      e.stopPropagation()
      onEdgeDoubleClick?.(e, edge)
    },
    [onEdgeDoubleClick, edge],
  )

  const onMouseEnter = useCallback(
    (e) => {
      e.stopPropagation()
      onEdgeMouseEnter?.(e, edge)
    },
    [onEdgeMouseEnter, edge],
  )

  const onMouseMove = useCallback(
    (e) => {
      e.stopPropagation()
      onEdgeMouseMove?.(e, edge)
    },
    [onEdgeMouseMove, edge],
  )

  const onMouseLeave = useCallback(
    (e) => {
      e.stopPropagation()
      onEdgeMouseLeave?.(e, edge)
    },
    [onEdgeMouseLeave, edge],
  )

  const edgeStyle = useMemo<CSSProperties>(
    () => ({
      ...style,
      pointerEvents:
        (selectable && global.selectable) ||
        onEdgeClick ||
        onEdgeDoubleClick ||
        onEdgeMouseEnter ||
        onEdgeMouseMove ||
        onEdgeMouseLeave
          ? 'all'
          : 'none',
    }),
    [
      selectable,
      global.selectable,
      style,
      onEdgeClick,
      onEdgeDoubleClick,
      onEdgeMouseEnter,
      onEdgeMouseMove,
      onEdgeMouseLeave,
    ],
  )

  const [handleClick, handleDoubleClick] = useClickPreventionOnDoubleClick(onClick, onDoubleClick)

  const isSelected = useMemo(
    () => global.selectEdge?.source === source && global.selectEdge?.target === target,
    [global.selectEdge, source, target],
  )

  if (
    !(sourceDimension.width && sourceDimension.height) ||
    !(targetDimension.width && targetDimension.height)
  ) {
    return null
  }

  return (
    <g
      className={cn(prefix, theme, className, {
        'selectable': selectable && global.selectable,
        'is-selected': isSelected,
      })}
      style={edgeStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {cloneElement(Children.only(children) as ReactElement, {
        ...getPositionByOrientation({
          sourcePosition,
          sourceDimension,
          targetPosition,
          targetDimension,
          arrowType,
          orientation,
        }),
        isSelected,
      })}
    </g>
  )
}

Wrapper.displayName = 'EdgeWrapper'

export default memo(Wrapper)

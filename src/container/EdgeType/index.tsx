import React, { memo, useMemo } from 'react'
import { getBezierPath, getSmoothStepPath, getMarkerEnd, getCenter } from '@/utils/graph'
import { XYPosition, Orientation, Edge } from '@/types'
import EdgeLabel from './EdgeLabel'

import './index.less'

export type LineProps = Edge & {
  prefix?: string
  source: XYPosition
  target: XYPosition
  isSelected?: boolean
  orientation?: Orientation
}

export const EdgeBezier = memo(
  ({
    prefix = 'graph-editor-edge-wrapper',
    source,
    target,
    arrowType,
    isSelected,
    orientation,
    label,
  }: LineProps) => {
    const [centerX, centerY] = getCenter({ source, target })
    const dAttr = useMemo(() => getBezierPath({ source, target, orientation }), [
      source,
      target,
      orientation,
    ])

    return (
      <>
        <path
          d={dAttr}
          className={`${prefix}-path`}
          markerEnd={getMarkerEnd({ arrowType, isSelected })}
        />
        <EdgeLabel label={label} x={centerX} y={centerY} />
      </>
    )
  },
)

export const EdgeStraight = memo(
  ({ prefix = 'graph-editor-edge-wrapper', source, target, arrowType, isSelected, label }: LineProps) => {
    const [centerX, centerY] = getCenter({ source, target })
    const dAttr = useMemo(() => `M${source.x},${source.y} ${target.x},${target.y}`, [source, target])

    return (
      <>
        <path
          d={dAttr}
          className={`${prefix}-path`}
          markerEnd={getMarkerEnd({ arrowType, isSelected })}
        />
        <EdgeLabel label={label} x={centerX} y={centerY} />
      </>
    )
  },
)

export const EdgeSmooth = memo(
  ({
    prefix = 'graph-editor-edge-wrapper',
    source,
    target,
    arrowType,
    isSelected,
    label,
    orientation,
  }: LineProps) => {
    const [centerX, centerY] = getCenter({ source, target })
    const dAttr = useMemo(() => getSmoothStepPath({ source, target, orientation }), [
      source,
      target,
      orientation,
    ])

    return (
      <>
        <path
          d={dAttr}
          className={`${prefix}-path`}
          markerEnd={getMarkerEnd({ arrowType, isSelected })}
        />
        <EdgeLabel label={label} x={centerX} y={centerY} />
      </>
    )
  },
)

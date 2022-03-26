import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'

import './index.less'

export type EdgeLabelProps = {
  prefix?: string
  label?: string | ReactNode
  x: number
  y: number
}

const LABEL_PADDING = [2, 4]

const EdgeLabel: FC<EdgeLabelProps> = ({ label, x, y }) => {
  const labelRef = useRef<SVGTextElement>()
  const [labelRect, setLabelRect] = useState({ x: 0, y: 0, width: 0, height: 0 })

  useEffect(() => {
    if (labelRef.current) {
      const labelBox = labelRef.current.getBBox()

      setLabelRect({
        x: labelBox.x,
        y: labelBox.y,
        width: labelBox.width,
        height: labelBox.height,
      })
    }
  }, [])

  if (typeof label === 'undefined' || !label) {
    return null
  }

  return (
    <g
      className="graph-editor-edge-label"
      transform={`translate(${x - labelRect.width / 2} ${y - labelRect.height / 2})`}
    >
      <rect
        className="graph-editor-edge-label-rect"
        width={labelRect.width + 2 * LABEL_PADDING[0]}
        x={-LABEL_PADDING[0]}
        y={-LABEL_PADDING[1]}
        height={labelRect.height + 2 * LABEL_PADDING[1]}
      />
      <text className="graph-editor-edge-label-text" ref={labelRef} y={labelRect.height / 2} dy="0.3em">
        {label}
      </text>
    </g>
  )
}

EdgeLabel.displayName = 'EdgeLabel'

export default EdgeLabel

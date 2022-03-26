import React, { useMemo, FC, HTMLAttributes, memo } from 'react'
import cn from 'classnames'
import useGlobal from '@/hooks/useGlobal'
import { createGridLinesPath, createGridDotsPath } from './Element'

import './index.less'

export enum BackgroundType {
  Lines = 'lines',
  Dots = 'dots',
}

export interface BackgroundProps extends HTMLAttributes<SVGElement> {
  type?: BackgroundType
  gap?: number
  color?: string
  size?: number
  background?: string
}

const defaultColors = {
  [BackgroundType.Dots]: '#81818a',
  [BackgroundType.Lines]: '#eee',
}

const Background: FC<BackgroundProps> = ({
  prefix = 'graph-editor-background',
  type = BackgroundType.Dots,
  gap = 15,
  size = 0.4,
  color,
  background = '#fff',
  style,
  className,
}) => {
  const [global] = useGlobal()
  const { x, y, k } = global.transform
  // when there are multiple flows on a page we need to make sure that every background gets its own pattern.
  const patternId = useMemo(() => `pattern-${Math.floor(Math.random() * 100000)}`, [])

  const scaledGap = gap * k
  const xOffset = x % scaledGap
  const yOffset = y % scaledGap

  const isLines = type === BackgroundType.Lines
  const bgColor = color || defaultColors[type]
  const path = isLines
    ? createGridLinesPath(scaledGap, size, bgColor)
    : createGridDotsPath(size * k, bgColor)

  return (
    <svg
      className={cn([prefix, className])}
      style={{
        ...style,
        background,
        width: '100%',
        height: '100%',
      }}
    >
      <pattern
        id={patternId}
        x={xOffset}
        y={yOffset}
        width={scaledGap}
        height={scaledGap}
        patternUnits="userSpaceOnUse"
      >
        {path}
      </pattern>
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  )
}

Background.displayName = 'Background'

export default memo(Background)

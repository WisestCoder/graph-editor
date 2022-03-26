import React, { ReactNode } from 'react'
import useTheme from '@/hooks/useTheme'
import cn from 'classnames'

interface MarkerProps {
  prefix?: string
  id: string
  children: ReactNode
}

const Marker = ({ prefix = 'graph-editor-marker-definitions', id, children }: MarkerProps) => (
  <marker
    className={prefix}
    id={id}
    markerWidth="12.5"
    markerHeight="12.5"
    viewBox="-10 -10 20 20"
    orient="auto"
    refX="0"
    refY="0"
  >
    {children}
  </marker>
)

const MarkerDefinitions = () => {
  const theme = useTheme()

  return (
    <defs className={cn('graph-editor-marker-definitions-container', theme)}>
      <Marker id="graph-editor-marker-definitions__arrowclosed">
        <polyline
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          points="-5,-4 0,0 -5,4 -5,-4"
        />
      </Marker>
      <Marker id="graph-editor-marker-definitions__arrowclosed__selected">
        <polyline
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          points="-5,-4 0,0 -5,4 -5,-4"
        />
      </Marker>
      <Marker id="graph-editor-marker-definitions__arrow">
        <polyline
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          fill="none"
          points="-5,-4 0,0 -5,4"
        />
      </Marker>
      <Marker id="graph-editor-marker-definitions__arrow__selected">
        <polyline
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          fill="none"
          points="-5,-4 0,0 -5,4"
        />
      </Marker>
    </defs>
  )
}

MarkerDefinitions.displayName = 'MarkerDefinitions'

export default MarkerDefinitions

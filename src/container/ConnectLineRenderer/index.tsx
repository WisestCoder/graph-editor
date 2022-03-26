import React, { FC, memo } from 'react'
import useGlobal from '@/hooks/useGlobal'
import useTheme from '@/hooks/useTheme'
import cn from 'classnames'
import DefaultEdge from '@/components/Edge/Default'
import { ConnectLine, Orientation } from '@/types'

export type ConnectLineProps = {
  connectLine: ConnectLine
  orientation: Orientation
}

const ConnectLineRenderer: FC<ConnectLineProps> = ({ connectLine = {}, orientation }) => {
  const [global] = useGlobal()
  const theme = useTheme()
  const { isConnecting, source, target } = global.connectLine

  if (!isConnecting) {
    return null
  }

  return (
    <g className={cn('graph-editor-edge-wrapper', theme)}>
      <DefaultEdge source={source} target={target} {...connectLine} orientation={orientation} />
    </g>
  )
}

export default memo(ConnectLineRenderer)

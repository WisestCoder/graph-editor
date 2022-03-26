import React, { FC, memo } from 'react'
import cn from 'classnames'
import { PointerPosition, PointerType, XYPosition, Node, ConnectEventHandler, Orientation } from '@/types'
import Wrapper from './Wrapper'

import './index.less'

export type PointerProps = {
  prefix?: string
  position: PointerPosition
  type: PointerType
  nodePosition: XYPosition
  node: Node
  onConnect?: ConnectEventHandler
  onConnectStart?: ConnectEventHandler
  onConnectStop?: ConnectEventHandler
  onConnectEnd?: ConnectEventHandler
  connectable?: boolean
  orientation?: Orientation
}

const Pointer: FC<PointerProps> = ({
  prefix,
  type,
  position,
  node,
  nodePosition,
  connectable,
  orientation,
}) => {
  return (
    <Wrapper
      type={type}
      position={position}
      nodePosition={nodePosition}
      node={node}
      connectable={connectable}
      orientation={orientation}
    >
      <div className={cn([prefix])} />
    </Wrapper>
  )
}

export default memo(Pointer)

import React, { FC, ComponentType, memo } from 'react'
import { NodeRendererProps } from '@/container/NodeRenderer'
import { Node } from '@/types'
import Wrapper from './Wrapper'

import './index.less'

export type NodeComponentProps = Omit<
  NodeRendererProps,
  'nodeTypes' | 'nodes' | 'transform' | 'transformStyle'
> &
  Pick<
    Node,
    | 'className'
    | 'style'
    | 'id'
    | 'position'
    | 'data'
    | 'visible'
    | 'connectable'
    | 'draggable'
    | 'selectable'
    | 'deletable'
    | 'cancel'
  > & {
    node: Node
    nodeType: string
    Component: ComponentType<Node>
    observer: (element: HTMLElement) => void
    onChange?: (data: any, force?: boolean) => void
  }

const NodeComponent: FC<NodeComponentProps> = ({ id, node, Component, ...rest }) => {
  return (
    <Wrapper id={id} node={node} {...rest}>
      <Component key={id} id={id} data={node.data} {...rest} />
    </Wrapper>
  )
}

NodeComponent.displayName = 'NodeComponent'

export default memo(NodeComponent)

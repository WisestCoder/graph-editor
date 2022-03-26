import React, { FC, memo, ComponentType } from 'react'
import { EdgeRendererProps } from '@/container/EdgeRenderer'
import { Edge } from '@/types'
import Wrapper from './Wrapper'

export type EdgeComponentProps = Omit<
  EdgeRendererProps,
  | 'edgeTypes'
  | 'edges'
  | 'transform'
  | 'transformStyle'
  | 'onConnectStart'
  | 'onConnectStop'
  | 'onConnectEnd'
> &
  Pick<
    Edge,
    | 'style'
    | 'className'
    | 'id'
    | 'data'
    | 'label'
    | 'lineType'
    | 'source'
    | 'target'
    | 'selectable'
    | 'arrowType'
  > & {
    edge: Edge
    Component: ComponentType<Edge>
  }

const EdgeComponent: FC<EdgeComponentProps> = ({
  id,
  Component,
  connectLine,
  lineType,
  arrowType,
  ...rest
}) => {
  return (
    <Wrapper id={id} {...rest}>
      <Component
        key={id}
        id={id}
        lineType={lineType || connectLine?.lineType}
        arrowType={arrowType || connectLine?.arrowType}
        {...rest}
      />
    </Wrapper>
  )
}

EdgeComponent.displayName = 'EdgeComponent'

export default memo(EdgeComponent)

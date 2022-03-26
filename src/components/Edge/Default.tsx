import React, { memo } from 'react'
import { ConnectionLineType } from '@/types'
import { EdgeBezier, EdgeStraight, EdgeSmooth } from '@/container/EdgeType'

const DefaultEdge = ({ lineType = ConnectionLineType.Bezier, source, target, ...rest }) => {
  if (lineType === ConnectionLineType.Bezier) {
    return <EdgeBezier source={source} target={target} {...rest} />
  }

  if (lineType === ConnectionLineType.Straight) {
    return <EdgeStraight source={source} target={target} {...rest} />
  }

  if (lineType === ConnectionLineType.Smooth) {
    return <EdgeSmooth source={source} target={target} {...rest} />
  }

  return null
}

export default memo(DefaultEdge)

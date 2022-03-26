import React, { memo } from 'react'

import { Node } from '@/types'

const DefaultNode = ({ data }: Node) => <span>{data.label}</span>

DefaultNode.displayName = 'DefaultNode'

export default memo(DefaultNode)

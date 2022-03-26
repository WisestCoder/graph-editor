import React, { FC } from 'react'
import cn from 'classnames'

export interface IconProps {
  className?: string
  type: string
}

const Icon: FC<IconProps> = ({ className = '', type }) => {
  return <i className={cn(['iconfont', `icon-${type}`], { className })} />
}

export default Icon

import React, { FC, HTMLAttributes, memo } from 'react'
import cn from 'classnames'

export interface ControlButtonProps extends HTMLAttributes<HTMLDivElement> {
  prefix?: string
  className?: string
  onClick: () => void
}

const ControlButton: FC<ControlButtonProps> = ({
  prefix = 'graph-editor-controls-button',
  className = '',
  children,
  ...rest
}) => (
  <div className={cn([prefix, className])} {...rest}>
    {children}
  </div>
)

export default memo(ControlButton)

import React, { FC, memo, useCallback, useState, HTMLAttributes, CSSProperties } from 'react'
import cn from 'classnames'
import { useZoomHelper } from '@/hooks/useZoom'
import useGlobal from '@/hooks/useGlobal'
import fullscreen from '@/utils/fullscreen'
import Icon from '@/components/Icon'
import ControlButton from './ControlButton'

import './index.less'

export interface ControlProps extends HTMLAttributes<HTMLDivElement> {
  prefix?: string
  className?: string
  style?: CSSProperties
  /**
   * Control the display of zoom buttons
   * showZoom === false will hidden zoom buttons
   */
  showZoom?: boolean
  /**
   * Control the editor fullscreen
   * showFullscreen === false will hidden fullscreen button
   */
  showFullscreen?: boolean
  /**
   * Control the display of fitView button
   * showFitView === false will hidden scale button
   */
  showFitView?: boolean
  isLayout?: boolean
  /**
   * Control is it operational
   */
  showInteractive?: boolean
}

const Controls: FC<ControlProps> = ({
  prefix = 'graph-editor-controls',
  className = '',
  style = {},
  showZoom = true,
  showFullscreen = true,
  showFitView = true,
  showInteractive = true,
  isLayout = false,
  children,
}) => {
  const [global, setGlobal] = useGlobal()
  const [lock, setLock] = useState(false)
  const { zoomIn, zoomOut, fitView } = useZoomHelper()

  const onZoomInHandler = useCallback(() => {
    zoomIn()
  }, [zoomIn])

  const onZoomOutHandler = useCallback(() => {
    zoomOut()
  }, [zoomOut])

  const onFitView = useCallback(() => {
    fitView(isLayout)
  }, [fitView, isLayout])

  const onInteractive = useCallback(() => {
    setLock(!lock)
    setGlobal({
      draggable: lock,
      selectable: lock,
      connectable: lock,
    })
  }, [lock, setGlobal])

  const onFullscreen = useCallback(() => {
    if (global.graphElement) {
      fullscreen(global.graphElement)
    }
  }, [global.graphElement])

  return (
    <div className={cn([prefix, className])} style={style}>
      {showZoom && (
        <>
          <ControlButton onClick={onZoomInHandler}>
            <Icon type="zoom-in" />
          </ControlButton>
          <ControlButton onClick={onZoomOutHandler}>
            <Icon type="zoom-out" />
          </ControlButton>
        </>
      )}
      {showFitView && (
        <ControlButton onClick={onFitView}>
          <Icon type="adjust" />
        </ControlButton>
      )}
      {showInteractive && (
        <ControlButton onClick={onInteractive}>
          <Icon type={lock ? 'lock' : 'unlock'} />
        </ControlButton>
      )}
      {showFullscreen && (
        <ControlButton onClick={onFullscreen}>
          <Icon type="fullscreen-expand" />
        </ControlButton>
      )}
      {children}
    </div>
  )
}

Controls.displayName = 'Controls'

export default memo(Controls)

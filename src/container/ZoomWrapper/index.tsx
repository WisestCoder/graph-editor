import React, { FC, memo, ReactNode, useCallback, useRef } from 'react'
import useZoom, { UseZoomProps } from '@/hooks/useZoom'
import useGlobal from '@/hooks/useGlobal'

import './index.less'

export type ZoomWrapperProps = {
  prefix: string
  children: (zoomInfo: UseZoomProps) => ReactNode
}

const ZoomWrapper: FC<ZoomWrapperProps> = ({ prefix, children }) => {
  const zoomRef = useRef<HTMLDivElement>()
  const [, setGlobal] = useGlobal()

  const zoomInfo = useZoom({
    trigger: zoomRef,
  })

  const onClick = useCallback(() => {
    setGlobal({
      selectNode: {},
      selectEdge: {},
    })
  }, [setGlobal])

  return (
    <>
      <div className={`${prefix}-zoom-wrapper`}>{children(zoomInfo)}</div>
      <div className={`${prefix}-zoom-wrapper-wheel`} ref={zoomRef} onClick={onClick} />
    </>
  )
}

export default memo(ZoomWrapper)

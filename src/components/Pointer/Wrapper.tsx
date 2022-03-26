import React, {
  FC,
  useMemo,
  useRef,
  useCallback,
  MouseEvent,
  useEffect,
  memo,
  PropsWithChildren,
} from 'react'
import useGlobal from '@/hooks/useGlobal'
import useTheme from '@/hooks/useTheme'
import cn from 'classnames'
import { getDocument } from '@/utils/graph'
import { addEventListener, checkLineEndPoint } from '@/utils/dom'
import { PointerProps } from '@/components/Pointer'
import { XYPosition } from '@/types'

export type PointerWrapperProps = PropsWithChildren<Omit<PointerProps, 'Component'>>

/**
 * Give the ability to drag
 */
const Wrapper: FC<PointerWrapperProps> = ({
  prefix = 'graph-editor-pointer-wrapper',
  children,
  position,
  type,
  nodePosition,
  node,
  onConnect,
  onConnectStart,
  onConnectEnd,
  onConnectStop,
  connectable,
}) => {
  const [global, setGlobal] = useGlobal()
  const theme = useTheme()
  const sourceRef = useRef<XYPosition>({})
  const mousemoveListener = useRef({ remove: () => {} })
  const mouseupListener = useRef({ remove: () => {} })

  const onDestoryListener = useCallback(() => {
    mousemoveListener.current?.remove()
    mouseupListener.current?.remove()
  }, [])

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!connectable) {
        return
      }

      const doc = getDocument(e.target as HTMLElement)
      if (!doc) {
        return
      }

      const nodeTarget = (e.target as Element).closest('.graph-editor-node-wrapper')
      const nodeBounds = nodeTarget.getBoundingClientRect()

      sourceRef.current = {
        x: nodePosition.x + (e.clientX - nodeBounds.left) / global.transform.k,
        y: nodePosition.y + (e.clientY - nodeBounds.top) / global.transform.k,
      }

      setGlobal({
        connectLine: {
          isConnecting: false,
          source: sourceRef.current,
          target: {},
        },
      })

      onConnectStart?.(e, { source: node.id })

      function onMouseMove(ee) {
        setGlobal({
          connectLine: {
            isConnecting: true,
            source: sourceRef.current,
            target: {
              x: nodePosition.x + (ee.clientX - nodeBounds.left) / global.transform.k,
              y: nodePosition.y + (ee.clientY - nodeBounds.top) / global.transform.k,
            },
          },
        })
      }

      function onMouseUp(ee) {
        setGlobal({
          connectLine: {
            isConnecting: false,
            source: {},
            target: {},
          },
        })
        sourceRef.current = {}
        const { isHit, target } = checkLineEndPoint({
          e: ee,
          doc,
          node,
          edges: global.edges,
        })

        onConnectStop?.(ee, { source: node.id })

        if (isHit && target) {
          onConnect?.(ee, { source: node.id, target })
          global.onElementChange({
            edges: [...global.edges, { source: node.id, target }],
          })
        }

        onConnectEnd?.(ee, { source: node.id })

        onDestoryListener()
      }

      mousemoveListener.current = addEventListener(doc, 'mousemove', onMouseMove)
      mouseupListener.current = addEventListener(doc, 'mouseup', onMouseUp)
    },
    [
      connectable,
      onDestoryListener,
      setGlobal,
      nodePosition.x,
      nodePosition.y,
      node,
      global,
      onConnect,
      onConnectStart,
      onConnectStop,
      onConnectEnd,
    ],
  )

  useEffect(() => {
    return onDestoryListener
  }, [onDestoryListener])

  const handleClassName = useMemo(() => {
    return cn([prefix, theme, 'nodrag', `${prefix}-${position}`, `${prefix}-${type}`], { connectable })
  }, [prefix, position, type, connectable, theme])

  return (
    <div
      className={handleClassName}
      onMouseDown={onMouseDown}
      data-node-id={node.id}
      data-node-connectable={connectable ? '1' : '0'}
      data-type={type}
      data-position={position}
    >
      {children}
    </div>
  )
}

export default memo(Wrapper)

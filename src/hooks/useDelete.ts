import { useCallback, useMemo, useRef } from 'react'
import useGlobal from '@/hooks/useGlobal'
import useKeyPress, { Handler, KeyFilter } from '@/hooks/useKeyPress'
import { Node, Edge, EdgeEventHandler, NodeEventHandler } from '@/types'

export type useDeleteParams = {
  key?: KeyFilter
  onEdgeDelete?: EdgeEventHandler
  onNodeDelete?: NodeEventHandler
}

export default function useDelete({ key = 'Backspace', onEdgeDelete, onNodeDelete }: useDeleteParams) {
  const [global] = useGlobal()

  const fnRef = useRef<Handler>(() => {})

  const innerDelete = useCallback(
    (e) => {
      if (!global.deletable) {
        return
      }

      if (global.selectNode?.id) {
        if (typeof global.selectNode.deletable === 'undefined' || global.selectNode.deletable) {
          onNodeDelete?.(e, global.selectNode as Node)
          global.onElementChange({
            nodes: global.nodes.filter((node) => node.id !== global.selectNode?.id),
            edges: global.edges,
          })
        }
      }

      if (global.selectEdge?.source && global.selectEdge?.target) {
        if (typeof global.selectEdge.deletable === 'undefined' || global.selectEdge?.deletable) {
          onEdgeDelete?.(e, global.selectEdge as Edge)
          global.onElementChange({
            nodes: global.nodes,
            edges: global.edges.filter(
              (edge) =>
                edge.source !== global.selectEdge?.source && edge.target !== global.selectEdge?.target,
            ),
          })
        }
      }
    },
    [global, onNodeDelete, onEdgeDelete],
  )

  useMemo(() => {
    fnRef.current = innerDelete
  }, [innerDelete])

  useKeyPress(key, fnRef.current)
}

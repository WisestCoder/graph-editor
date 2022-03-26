import { useEffect, useRef, useMemo } from 'react'
import { getDimensions } from '@/utils/graph'
import useGlobal from '@/hooks/useGlobal'
import cloneDeep from 'lodash/cloneDeep'
import { Node, ElementsEventHandler, NodeRect } from '@/types'

export default function useNodeResizeObserver() {
  const [global, setGlobal] = useGlobal()
  const observerRef = useRef(null)
  const elementRefs = useRef<HTMLElement[]>([])
  const dependencyRef = useRef<{
    nodes?: Node[]
    nodeRects?: NodeRect[]
    setGlobal?: (p: any) => void
    onElementChange?: ElementsEventHandler
  }>({})

  useMemo(() => {
    dependencyRef.current = {
      nodes: global.nodes,
      nodeRects: global.nodeRects,
      setGlobal,
      onElementChange: global.onElementChange,
    }
  }, [global.nodes, global.nodeRects, setGlobal, global.onElementChange])

  useEffect(() => {
    observerRef.current = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const { nodes, nodeRects, setGlobal, onElementChange } = dependencyRef.current
      const nextNodes = cloneDeep(nodes)

      entries.forEach((entry: ResizeObserverEntry) => {
        const { width, height } = getDimensions(entry.target as HTMLElement)
        const nodeId = entry.target?.getAttribute('data-node-id')
        const findIndex = nodes.findIndex((item) => item.id === nodeId)
        const findReactIndex = nodeRects?.findIndex((item) => item.id === nodeId)
        const curNodeRect: NodeRect = { id: nodeId, width, height }

        // remove node
        if (width === height && height === 0) {
          return
        }

        if (
          nodeRects[findReactIndex] &&
          nodeRects[findReactIndex].width === width &&
          nodeRects[findReactIndex].height === height
        ) {
          return
        }

        nodeRects?.[findReactIndex]
          ? (nodeRects[findReactIndex] = curNodeRect)
          : nodeRects.push(curNodeRect)

        nextNodes[findIndex] = {
          ...nextNodes[findIndex],
          __extra: {
            width,
            height,
          },
        }
      })

      onElementChange({
        nodes: nextNodes,
      })
      setGlobal({ nodeRects: [...nodeRects] })
    })
  }, [])

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect?.()
      observerRef.current?.unobserve?.()
      observerRef.current = null
    }
  }, [])

  return (element, options = { box: 'border-box' }) => {
    if (elementRefs.current.includes(element)) {
      return
    }
    observerRef.current?.observe?.(element, options)
  }
}

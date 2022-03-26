import { useEffect, useMemo, useCallback } from 'react'
import { zoom, zoomIdentity } from 'd3-zoom'
import { select } from 'd3-selection'
import dagre from 'dagre'
import useGlobal from '@/hooks/useGlobal'
import { getRectOfNodes } from '@/utils/dom'
import { ZoomOptions, ZoomTransform, ZoomHelper } from '@/types'

const DEFAULT_MIN_ZOOM = 0.5
const DEFAULT_MAX_ZOOM = 2

export type UseZoomProps = {
  transform: ZoomTransform
  transformStyle: string
}

export default function useZoom(zoomOption?: ZoomOptions): UseZoomProps {
  const { minZoom, maxZoom, trigger, effect } = zoomOption || {}
  const [global, setGlobal] = useGlobal()

  useEffect(() => {
    if (trigger && trigger.current) {
      const zoomInstance = zoom()
        // set scale range
        .scaleExtent([minZoom || DEFAULT_MIN_ZOOM, maxZoom || DEFAULT_MAX_ZOOM])
        // bind event
        .on('zoom', ({ transform }) => {
          setGlobal({ transform })
        })

      const zoomSelection = select(trigger.current as Element).call(zoomInstance)
      setGlobal({ zoomInstance, zoomSelection })
    }
  }, [minZoom, maxZoom, trigger, setGlobal])

  useEffect(() => {
    if (effect && effect.current) {
      const { x, y, k } = global.transform
      effect.current.style.transform = `translate(${x}px,${y}px) scale(${k})`
    }
  }, [global.transform, effect])

  return {
    transform: global.transform,
    transformStyle: `translate(${global.transform.x}px,${global.transform.y}px) scale(${global.transform.k})`,
  }
}

export function useZoomHelper(): ZoomHelper {
  const [global, setGlobal] = useGlobal()
  const { zoomInstance, zoomSelection, nodes, container, nodeRects } = global

  const updateTransform = useCallback(
    (transform: ZoomTransform) => {
      if (zoomInstance && zoomSelection) {
        const nextTransform = zoomIdentity.translate(transform.x, transform.y).scale(transform.k)
        zoomInstance.transform(zoomSelection, nextTransform)
      }
    },
    [zoomInstance, zoomSelection],
  )

  const getGraph = useCallback(() => {
    const graph = new dagre.graphlib.Graph()
    graph.setDefaultEdgeLabel(() => ({}))
    graph.setGraph({ rankdir: global.orientation })

    global.nodes?.forEach(({ id, __extra }) => {
      graph.setNode(id, __extra)
    })

    global.edges?.forEach(({ source, target }) => {
      graph.setEdge(source, target)
    })

    return graph
  }, [global.orientation, global.nodes, global.edges])

  const helper = useMemo(() => {
    if (zoomInstance && zoomSelection) {
      return {
        zoomIn: () => zoomInstance.scaleBy(zoomSelection, 1.2),
        zoomOut: () => zoomInstance.scaleBy(zoomSelection, 1 / 1.2),
        zoomTo: (zoomLevel: number) => zoomInstance.scaleTo(zoomSelection, zoomLevel),
        transform: updateTransform,
        getGraph,
        fitView: (isLayout: boolean) => {
          if (!(nodes && nodes.length)) {
            return
          }

          let layoutNodes = nodes

          if (isLayout) {
            const graph = getGraph()
            dagre.layout(graph)
            layoutNodes = nodes.map((node) => {
              const graphPosition = graph.node(node.id)
              return {
                ...node,
                position: {
                  x: graphPosition.x,
                  y: graphPosition.y,
                },
                __extra: graphPosition,
              }
            })
            setGlobal({ nodes: layoutNodes })
          }

          const graphRect = getRectOfNodes(layoutNodes, nodeRects)

          const scale =
            Math.min(container.width / graphRect.width, container.height / graphRect.height) / 1.2
          const realGraphWidth = graphRect.width * scale
          const realGraphHeight = graphRect.height * scale

          const offsetX = graphRect.left * scale + (realGraphWidth - container.width) / 2
          const offsetY = graphRect.top * scale + (realGraphHeight - container.height) / 2

          updateTransform({ x: -offsetX, y: -offsetY, k: scale })
        },
      }
    }

    return {
      zoomIn: () => {},
      zoomOut: () => {},
      zoomTo: () => {},
      transform: () => {},
      fitView: () => {},
      getGraph: () => null,
    }
  }, [
    zoomInstance,
    zoomSelection,
    nodes,
    updateTransform,
    container?.width,
    container?.height,
    nodeRects,
    getGraph,
    setGlobal,
  ])

  return helper
}

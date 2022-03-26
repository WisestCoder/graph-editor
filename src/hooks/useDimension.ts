import { RefObject, useEffect, useMemo } from 'react'
import useGlobal from '@/hooks/useGlobal'
import get from 'lodash/get'

export default function useDimension(id) {
  const [global] = useGlobal()

  const dimension = useMemo(() => {
    const nodeRect = global.nodeRects.find((item) => item.id === id)

    return {
      width: get(nodeRect, 'width'),
      height: get(nodeRect, 'height'),
    }
  }, [global.nodeRects, id])

  return dimension
}

export function useBatchUpdateDimension(graphRef?: RefObject<HTMLDivElement>) {
  const [, setGlobal] = useGlobal()

  useEffect(() => {
    const graphElement = graphRef.current
      ? graphRef.current.closest('.graph-editor')
      : document.querySelector('.graph-editor')
    const container = graphElement?.getBoundingClientRect()

    // const nodeElements = graphElement.querySelectorAll('.graph-editor-node-wrapper')
    // const nextNodes = cloneDeep(global.nodes)

    // nodeElements.forEach((nodeElement, index) => {
    //   const { width, height } = getDimensions(nodeElement as HTMLDivElement)

    //   nextNodes[index].__extra = {
    //     ...(nextNodes[index].__extra || {}),
    //     width,
    //     height,
    //   }
    // })

    setGlobal({ container, graphElement })
  }, [])
}

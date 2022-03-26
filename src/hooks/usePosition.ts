import { useMemo } from 'react'
import useGlobal from '@/hooks/useGlobal'
import { ElementId, Node } from '@/types'

export default function usePosition(id: ElementId) {
  const [global] = useGlobal()

  return useMemo(() => {
    const sourceNode = global.nodes.find((item: Node) => item.id === id) as Node
    return sourceNode ? sourceNode.position : {}
  }, [id, global.nodes])
}

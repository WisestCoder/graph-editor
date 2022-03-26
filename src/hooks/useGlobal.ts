import { useReducer, createContext, useContext, useEffect } from 'react'
import {
  Node,
  Edge,
  EdgeTypes,
  NodeTypes,
  ZoomTransform,
  Orientation,
  ElementsEventHandler,
} from '@/types'

export const initState = {
  transform: {
    x: 0,
    y: 0,
    k: 1,
  } as ZoomTransform,
  zoomInstance: null,
  zoomSelection: null,
  nodeRects: [],
  nodes: [] as undefined | Node[],
  edges: [] as Edge[],
  nodeTypes: {} as NodeTypes,
  edgeTypes: {} as EdgeTypes,
  connectLine: {
    isConnecting: false,
    source: {},
    target: {},
  },
  draggable: true,
  selectable: true,
  connectable: true,
  deletable: true,
  selectNode: {} as Partial<Node>,
  selectEdge: {} as Partial<Edge>,
  container: null,
  graphElement: null,
  theme: 'primary',
  elements: undefined,
  orientation: Orientation.TopToBottom as Orientation,
  onElementChange: (() => {}) as ElementsEventHandler,
}

export type StateProps = typeof initState

export type GlobalReturnProps = [StateProps, (p?: Partial<StateProps>) => void]

export function useGlobalCreate(value): GlobalReturnProps {
  const [global, setGlobal]: GlobalReturnProps = useReducer(
    (state, newState) => {
      let action = newState
      if (typeof action === 'function') {
        action = action(state)
      }
      if (newState.action && newState.payload) {
        action = newState.payload
        if (typeof action === 'function') {
          action = action(state)
        }
      }
      const result = { ...state, ...action }
      return result
    },
    { ...initState, ...value },
  )

  return [global, setGlobal]
}

export const GlobalSetCtx = createContext(() => {})

export const GlobalStateCtx = createContext<StateProps>(initState)

export default function useGlobal(): GlobalReturnProps {
  return [useContext(GlobalStateCtx), useContext(GlobalSetCtx)]
}

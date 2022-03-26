import React, { FC, useCallback, useEffect } from 'react'
import omit from 'lodash/omit'
import { useGlobalCreate, GlobalSetCtx, GlobalStateCtx, StateProps } from '@/hooks/useGlobal'
import {
  Elements,
  Node,
  Edge,
  ElementsEventHandler,
  NodeTypes,
  EdgeTypes,
  Theme,
  Orientation,
} from '@/types'

export type GlobalProviderProps = {
  value?: {
    elements?: Elements
    nodes?: Node[]
    edges?: Edge[]
    onElementChange?: ElementsEventHandler
    nodeTypes?: NodeTypes
    edgeTypes?: EdgeTypes
    draggable?: boolean
    selectable?: boolean
    connectable?: boolean
    deletable?: boolean
    theme?: Theme
    orientation?: Orientation
  }
}

const GlobalProvider: FC<GlobalProviderProps> = ({ value = {}, children }) => {
  const [globalState, setGlobalState] = useGlobalCreate(value)

  const onElementChange = useCallback(
    (element) => {
      if (typeof globalState.elements === 'undefined') {
        setGlobalState(element)
      }

      globalState.onElementChange?.({ nodes: globalState.nodes, edges: globalState.edges, ...element })
    },
    [globalState, setGlobalState],
  )

  useEffect(() => {
    const coverState: Partial<StateProps> = omit(value, ['nodes', 'edges'])
    setGlobalState({
      ...coverState,
      ...(value.elements
        ? {
            nodes: [...(value.elements?.nodes || [])],
            edges: [...(value.elements?.edges || [])],
          }
        : null),
    })
  }, [value, setGlobalState])

  return (
    <GlobalSetCtx.Provider value={setGlobalState}>
      <GlobalStateCtx.Provider
        value={{
          ...globalState,
          onElementChange,
        }}
      >
        {children}
      </GlobalStateCtx.Provider>
    </GlobalSetCtx.Provider>
  )
}

export default GlobalProvider

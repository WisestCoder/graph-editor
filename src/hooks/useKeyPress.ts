import { useEffect, useMemo, useRef } from 'react'
import { addEventListener } from '@/utils/dom'

export type KeyPredicate = (event: KeyboardEvent) => boolean
export type KeyFilter = null | undefined | string | number | ((event: KeyboardEvent) => boolean)
export type Handler = (event: KeyboardEvent) => void

export const noop = () => {}

const createKeyPredicate = (keyFilter: KeyFilter): KeyPredicate => {
  if (typeof keyFilter === 'function') {
    return keyFilter
  }

  if (typeof keyFilter === 'string') {
    return (event: KeyboardEvent) => event.key === keyFilter
  }

  if (typeof keyFilter === 'number') {
    return (event: KeyboardEvent) => event.keyCode === keyFilter
  }

  return keyFilter
}

export function useEvent(eventType: keyof HTMLElementEventMap, handler: Handler) {
  const listener = useRef<any>(null)
  useEffect(() => {
    if (!handler) {
      return
    }

    if (listener.current?.remove) {
      listener.current?.remove()
    }

    listener.current = addEventListener(window, eventType, handler as EventListener)
  }, [eventType, handler])

  useEffect(() => {
    return () => listener.current?.remove?.()
  }, [])
}

export default function useKeyPress(key: KeyFilter, fn: Handler = noop) {
  const eventHandler = useMemo(() => {
    const predicate: KeyPredicate = createKeyPredicate(key)
    const handler: Handler = (handlerEvent) => {
      if (predicate(handlerEvent)) {
        return fn(handlerEvent)
      }
    }
    return handler
  }, [key, fn])

  useEvent('keydown', eventHandler)
}

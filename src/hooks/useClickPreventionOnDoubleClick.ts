/* eslint-disable prefer-promise-reject-errors */
import { useRef } from 'react'

const DELAY_TIMER = 200

const cancellablePromise = (promise) => {
  let isCanceled = false

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      (value) => (isCanceled ? reject({ isCanceled, value }) : resolve(value)),
      (error) => reject({ isCanceled, error }),
    )
  })

  return {
    promise: wrappedPromise,
    cancel: () => {
      isCanceled = true
    },
  }
}

const delay = (n) => new Promise((resolve) => setTimeout(resolve, n))

const useCancellablePromises = () => {
  const pendingPromises = useRef([])

  const appendPendingPromise = (promise) => {
    pendingPromises.current = [...pendingPromises.current, promise]
  }

  const removePendingPromise = (promise) => {
    pendingPromises.current = pendingPromises.current.filter((p) => p !== promise)
  }

  const clearPendingPromises = () => pendingPromises.current.map((p) => p.cancel())

  const api = {
    appendPendingPromise,
    removePendingPromise,
    clearPendingPromises,
  }

  return api
}

export default function useClickPreventionOnDoubleClick(onClick, onDoubleClick) {
  const api = useCancellablePromises()

  const handleClick = (...args) => {
    api.clearPendingPromises()
    const waitForClick = cancellablePromise(delay(DELAY_TIMER))
    api.appendPendingPromise(waitForClick)

    return waitForClick.promise
      .then(() => {
        api.removePendingPromise(waitForClick)
        onClick(...args)
      })
      .catch((errorInfo) => {
        api.removePendingPromise(waitForClick)
        if (!errorInfo.isCanceled) {
          throw errorInfo.error
        }
      })
  }

  const handleDoubleClick = (...args) => {
    api.clearPendingPromises()
    onDoubleClick(...args)
  }

  return [handleClick, handleDoubleClick]
}

import { useCallback, useRef } from 'react'

function useDebouncedCallback<T extends (...args: any) => ReturnType<T>>(
  callback: T,
  delay: number
) {
  const timeout = useRef<ReturnType<typeof setTimeout>>()

  return useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timeout.current)

      timeout.current = setTimeout(() => {
        clearTimeout(timeout.current)
        callback(args)
      }, delay)
    },
    [callback, delay]
  )
}

export default useDebouncedCallback

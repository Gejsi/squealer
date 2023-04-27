import { useEffect, useRef } from 'react'

const useRenderCount = () => {
  const countRef = useRef(0)

  useEffect(() => {
    countRef.current++
  })

  return countRef.current
}

export default useRenderCount

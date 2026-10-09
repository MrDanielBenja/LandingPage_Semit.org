import { useRef } from 'react'

export function useSwipe(onLeft, onRight, minPx = 40) {
  const x = useRef(null)
  return {
    onTouchStart: (e) => { x.current = e.touches[0].clientX },
    onTouchEnd: (e) => {
      if (x.current == null) return
      const dx = e.changedTouches[0].clientX - x.current
      x.current = null
      if (Math.abs(dx) < minPx) return
      if (dx < 0) onLeft?.()
      else onRight?.()
    },
  }
}

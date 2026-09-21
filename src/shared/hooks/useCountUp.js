import { useEffect, useRef, useState } from 'react'

export function useCountUp(target, start) {
  const [v, setV] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    if (!start) return
    let raf; const t0 = performance.now(); const dur = 1400
    const tick = (t) => { const p = Math.min(1, (t - t0) / dur); setV(Math.round(target * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, target])
  return [v, ref]
}

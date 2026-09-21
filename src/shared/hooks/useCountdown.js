import { useEffect, useState } from 'react'

export function useCountdown(target) {
  const calc = () => {
    const diff = new Date(target).getTime() - Date.now()
    const p = diff <= 0
    const a = Math.max(0, diff)
    return { d: Math.floor(a / 864e5), h: Math.floor(a / 36e5) % 24, m: Math.floor(a / 6e4) % 60, s: Math.floor(a / 1e3) % 60, passed: p }
  }
  const [t, setT] = useState(calc)
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id) }, [target])
  return t
}

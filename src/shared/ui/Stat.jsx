import { useEffect, useState } from 'react'
import { useCountUp } from '../hooks/useCountUp'

export function Stat({ v, label, card = false }) {
  const [started, setStarted] = useState(false)
  const [n] = useCountUp(v, started)
  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setStarted(true); return }
    const io = new IntersectionObserver(e => { if (e[0].isIntersecting) { setStarted(true); io.disconnect() } })
    const el = document.getElementById('st-' + label)
    if (el) io.observe(el)
    return () => io.disconnect()
  }, [label])
  if (card) return <div className="stat4" id={'st-' + label}><b>{n.toLocaleString('es-PE')}+</b><span>{label}</span></div>
  return <div id={'st-' + label}><b>{n}+</b>{label}</div>
}

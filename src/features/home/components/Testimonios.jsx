import { useEffect, useState } from 'react'
import { TESTIMONIOS } from '../data/home.data'

export function Testimonios() {
  const [ti, setTi] = useState(0)
  const n = TESTIMONIOS.length
  useEffect(() => { const t = setInterval(() => setTi(v => (v + 1) % n), 6000); return () => clearInterval(t) }, [n])
  const t = TESTIMONIOS[ti]
  return (
    <div className="rv">
      <div className="hsec"><span className="pill">💬 Historias reales</span><h2>Vidas marcadas</h2></div>
      <div className="t-carousel">
        <button onClick={() => setTi((ti - 1 + n) % n)} aria-label="anterior">‹</button>
        <div className="t-big t-user" key={ti}><img src={t.img} alt={t.n} loading="lazy" /><div><p>“{t.t}”</p><b>{t.n}</b></div></div>
        <button onClick={() => setTi((ti + 1) % n)} aria-label="siguiente">›</button>
      </div>
      <div className="dots">{TESTIMONIOS.map((_, k) => <button key={k} aria-label={'testimonio ' + k} className={`dot ${k === ti ? 'on' : ''}`} onClick={() => setTi(k)} />)}</div>
    </div>
  )
}

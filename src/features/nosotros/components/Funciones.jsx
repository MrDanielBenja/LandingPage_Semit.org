import { useEffect, useState } from 'react'
import { FUNCS } from '../data/nosotros.data'

export function Funciones() {
  const [ft, setFt] = useState(0)
  const [pause, setPause] = useState(false)
  const prev = () => setFt(f => (f - 1 + FUNCS.length) % FUNCS.length)
  const next = () => setFt(f => (f + 1) % FUNCS.length)
  useEffect(() => {
    if (pause) return
    const t = setInterval(() => setFt(f => (f + 1) % FUNCS.length), 5000)
    return () => clearInterval(t)
  }, [pause])
  return (
    <section className="rv func-sec" onMouseEnter={() => setPause(true)} onMouseLeave={() => setPause(false)}>
      <div className="hsec"><span className="pill">⚙️ Lo que hacemos</span><h2>Son funciones de SEMIT</h2>
        <p>Toca cada función y descubre cómo servimos a la Iglesia y al campo misionero.</p></div>
      <div className="func-rail">
        {FUNCS.map((f, k) => (
          <button key={f.t} className={`func-chip ${k === ft ? 'on' : ''}`} onClick={() => setFt(k)}>
            <img src={f.img} alt="" loading="lazy" /><span>{f.e}</span><b>{f.t}</b>
          </button>
        ))}
      </div>
      <div className="func-stage" key={ft}>
        <button className="func-arrow" aria-label="anterior" onClick={prev}>‹</button>
        <div className="func-main">
          <div className="func-media"><img src={FUNCS[ft].img} alt={FUNCS[ft].t} loading="lazy" /><span className="func-big-e">{FUNCS[ft].e}</span></div>
          <div className="func-txt">
            <span className="func-count">{String(ft + 1).padStart(2, '0')} / {String(FUNCS.length).padStart(2, '0')}</span>
            <h3>{FUNCS[ft].t}</h3>
            <p>{FUNCS[ft].d}</p>
            <div className="dots">{FUNCS.map((_, k) => <button key={k} aria-label={'func ' + k} className={`dot ${k === ft ? 'on' : ''}`} onClick={() => setFt(k)} />)}</div>
          </div>
        </div>
        <button className="func-arrow" aria-label="siguiente" onClick={next}>›</button>
      </div>
    </section>
  )
}

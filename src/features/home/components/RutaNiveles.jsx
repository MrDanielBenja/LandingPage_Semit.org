import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NIVELES, RUTA } from '../../niveles/data/niveles.data'

const META = {
  certificado: { rama: 'Pregrado', dur: '6 meses' },
  diplomado: { rama: 'Pregrado', dur: '1 año' },
  bachillerato: { rama: 'Pregrado', dur: '3 años' },
  licenciatura: { rama: 'Postgrado', dur: '1 año' },
  maestria: { rama: 'Postgrado', dur: '2 años' },
}

export function RutaNiveles() {
  const [paso, setPaso] = useState('certificado')
  const progs = NIVELES.filter(p => p.sub === paso)
  const idx = RUTA.findIndex(r => r.id === paso)
  return (
    <div className="rv">
      <div className="hsec"><span className="pill">🛤️ De cero a maestría</span><h2>Tu ruta, paso a paso</h2>
        <p>Cinco escalones, un solo llamado. Toca cada uno y mira qué incluye.</p></div>
      <div className="rt-cards">
        {RUTA.map((s, k) => (
          <button key={s.id} className={`cat-card ${paso === s.id ? 'on' : ''} ${idx > k ? 'done' : ''}`} onClick={() => setPaso(s.id)}>
            <span className="cat-media"><img src={s.img} alt={s.t} loading="lazy" /><span className="cat-emo">{s.e}</span><span className="cat-count">0{k + 1}</span></span>
            <span className="cat-body"><b>{s.t}</b><small>{META[s.id].rama} · {META[s.id].dur}</small></span>
          </button>
        ))}
      </div>
      <div key={paso} className="rt-panel">
        <div className="rt-panel-head">
          <div><span className="k">{META[paso].rama} · PASO {idx + 1} DE {RUTA.length}</span><h3>{RUTA[idx].t}</h3></div>
          <Link className="btn btn-dark" to="/niveles">Ver en Niveles →</Link>
        </div>
        <div className="rt-progs">{progs.map(p => (
          <div key={p.n} className="rt-prog">
            <img src={p.img} alt={p.n} loading="lazy" />
            <div><b>{p.n}</b><small>{p.mod} · {p.dur}</small></div>
            <strong>S/.{p.p}</strong>
          </div>))}</div>
      </div>
    </div>
  )
}

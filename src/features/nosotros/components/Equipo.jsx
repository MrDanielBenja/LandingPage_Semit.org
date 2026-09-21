import { useState } from 'react'
import { FLAG, PAISES, TEAM } from '../data/nosotros.data'

export function Equipo() {
  const [filtro, setFiltro] = useState('Todos')
  const [sel, setSel] = useState(0)
  const vis = TEAM.map((m, k) => ({ ...m, k })).filter(m => filtro === 'Todos' || m.p === filtro)
  const cur = vis.length ? vis[Math.min(sel, vis.length - 1)] : null
  const go = d => setSel(s => (s + d + vis.length) % Math.max(1, vis.length))
  const cls3d = idx => {
    if (!vis.length) return 'hidden'
    const off = (idx - sel + vis.length) % vis.length
    if (off === 0) return 'center'
    if (off === 1) return 'right-1'
    if (off === 2) return 'right-2'
    if (off === vis.length - 1) return 'left-1'
    if (off === vis.length - 2) return 'left-2'
    return 'hidden'
  }
  return (
    <section className="team-plain rv">
      <span className="pill">👥 Conozca a nuestro equipo</span>
      <div className="about-title">NUESTRO EQUIPO</div>
      <p className="team-sub">Docentes y misioneros que te acompañarán en tu formación.</p>
      <div className="seg-wrap">{PAISES.map(p => <button key={p} className={`segbtn ${filtro === p ? 'on' : ''}`} onClick={() => { setFiltro(p); setSel(0) }}>{p === 'Todos' ? '🌎 Todos' : `${FLAG[p]} ${p}`}</button>)}</div>
      <div className="team3d">
        <div className="carousel-container">
          <button className="nav-arrow left" aria-label="anterior" onClick={() => go(-1)}>‹</button>
          <div className="carousel-track">
            {vis.map((m, idx) => (
              <div key={m.k} className={`card3d ${cls3d(idx)}`} onClick={() => setSel(idx)}>
                <img src={m.img} alt={m.n} loading="lazy" />
              </div>))}
          </div>
          <button className="nav-arrow right" aria-label="siguiente" onClick={() => go(1)}>›</button>
        </div>
        {cur && (
          <div className="member-info" key={cur.k}>
            <h2 className="member-name">{cur.n} <small style={{ fontSize: 16 }}>{FLAG[cur.p]} {cur.p}</small></h2>
            <p className="member-role">{cur.rol}</p>
            <div className="nos-test"><p>“{cur.q}”</p><b>{cur.n} · docente y misionero SEMIT</b></div>
          </div>
        )}
        <div className="dots">{vis.map((_, idx) => <button key={idx} aria-label={'ir a ' + idx} className={`dot ${idx === sel ? 'on' : ''}`} onClick={() => setSel(idx)} />)}</div>
      </div>
    </section>
  )
}

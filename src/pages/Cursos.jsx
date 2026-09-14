import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { cursos, useReveal } from '../lib'

export default function Cursos() {
  const [q, setQ] = useState('')
  const [area, setArea] = useState('Todos')
  const [sel, setSel] = useState(null)
  useReveal('/cursos')
  const areas = ['Todos', 'Biblia', 'Teología', 'Ministerio']
  const list = useMemo(() => cursos.filter(c => (area === 'Todos' || c.a === area) && (c.n + c.a).toLowerCase().includes(q.toLowerCase())), [q, area])
  return (
    <div className="pg pg-cursos"><div className="container sec">
      <div className="cursos-head rv"><div><span className="k">CATÁLOGO 2025-II</span><h1>Elige.<br />Aprende. Enseña.</h1><img className="band-img" src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1000&q=80" alt="Biblioteca" loading="lazy" /></div>
        <input className="search" placeholder="🔍 Buscar: romanos, teología..." value={q} onChange={e => setQ(e.target.value)} /></div>
      <div className="filters rv">{areas.map(a => <button key={a} className={`chip2 ${area === a ? 'on' : ''}`} onClick={() => setArea(a)}>{a}</button>)}<span className="chead-note">{list.length} cursos · cada lunes inicia · $30 promo</span></div>
      <div className="cgrid">{list.map((c, k) => (
        <div className="ccard rv" key={c.n} style={{ animationDelay: `${k * 60}ms` }} onClick={() => setSel(c)}>
          <img className="ccard-img" src={c.img} alt={c.n} loading="lazy" />
          <div className="cbody"><span className="carea">{c.a} · {c.mod}</span><h3>{c.n}</h3><p>{c.d}</p>
            <div className="crow"><b>${c.p}</b><span className="ver">Ver ›</span></div></div>
        </div>))}
      </div>
      {list.length === 0 && <p style={{ color: '#6e6e73', marginTop: 20 }}>Sin resultados para “{q}”. <button className="chip2 on" onClick={() => { setQ(''); setArea('Todos') }}>Limpiar</button></p>}
      {sel && (
        <div className="modal-bg" onClick={() => setSel(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <img className="modal-img" src={sel.img} alt={sel.n} />
            <div style={{ padding: 24 }}><span className="carea">{sel.a} · {sel.mod}</span><h2 style={{ fontSize: 28, margin: '8px 0' }}>{sel.n}</h2><p style={{ color: '#555' }}>{sel.d} Incluye materiales, foro en vivo y certificado digital.</p>
              <div className="crow"><b style={{ fontSize: 26 }}>${sel.p}</b><span>promo este mes</span></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}><Link className="btn btn-blue" to="/contacto" style={{ flex: 1 }}>Inscribirme →</Link><button className="btn btn-line" onClick={() => setSel(null)}>Cerrar</button></div>
            </div>
          </div>
        </div>
      )}
    </div></div>
  )
}

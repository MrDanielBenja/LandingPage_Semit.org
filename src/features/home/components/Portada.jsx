import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { SLIDES } from '../data/home.data'
import { Stat } from '../../../shared/ui/Stat'

export function Portada() {
  const [i, setI] = useState(0)
  useEffect(() => { const t = setInterval(() => setI(v => (v + 1) % SLIDES.length), 5000); return () => clearInterval(t) }, [])
  const goIntro = () => document.getElementById('seminario')?.scrollIntoView({ behavior: 'smooth' })
  return (
    <div className="pk-header">
      {SLIDES.map((s, k) => <div key={k} className={`pk-bg ${k === i ? 'on' : ''}`} style={{ backgroundImage: `url('${s.img}')` }} />)}
      <div className="pk-filter" />
      <div className="pk-content">
        <span className="pill pill-glass">🎓 Seminario SEMIT · Cusco — Perú</span>
        <div key={i} className="pk-title-wrap">
          <h1 className="hero-title">{SLIDES[i].t}</h1>
          <h2 className="presentation-subtitle">{SLIDES[i].s}</h2>
        </div>
        <div className="cta">
          <Link className="btn btn-blue" to="/niveles">Ver mi ruta →</Link>
          <Link className="btn btn-line" to="/cursos">Explorar cursos ›</Link>
        </div>
        <div className="hero-stats">
          <Stat v={475} label="estudiantes" />
          <Stat v={275} label="misioneros" />
          <Stat v={60} label="docentes" />
          <div><b>4.9★</b>rating</div>
        </div>
      </div>
      <button className="scroll-cue" onClick={goIntro} aria-label="ver más">↓</button>
      <div className="fog-low" /><div className="fog-low right" />
      <div className="moving-clouds" />
    </div>
  )
}

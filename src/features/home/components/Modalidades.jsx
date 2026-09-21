import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IMGS } from '../../../shared/lib/images'

const AULA_URL = 'https://demo.casa-peniel.com/'

const ORDER = ['presencial', 'semi', 'virtual']

const MODS = [
  {
    id: 'presencial', e: '🏫', t: 'Presencial', d: 'En sede Cusco · Huayllapampa', img: IMGS.aula,
    hijos: [
      { e: '📚', t: 'Regular', d: 'Clases semanales Lun–Vie · ideal si vives en Cusco o vienes a radicar.', img: IMGS.clases },
      { e: '⚡', t: 'Intensivo', d: 'Módulos concentrados Ene–Feb y Jul · avanza un semestre en semanas.', img: IMGS.estudiantes },
    ],
  },
  {
    id: 'semi', e: '🔀', t: 'Semipresencial', d: 'Mitad en sede, mitad en casa', img: IMGS.cusco,
    hijos: [
      { e: '🗓️', t: 'Encuentros mensuales', d: 'Un fin de semana al mes en Cusco + clases virtuales entre encuentros.', img: IMGS.iglesia },
      { e: '🧭', t: 'Campo guiado', d: 'Prácticas en tu iglesia local con mentor SEMIT que te acompaña.', img: IMGS.selva },
    ],
  },
  {
    id: 'virtual', e: '💻', t: 'Virtual', d: 'Desde donde estés en el mundo', img: IMGS.biblioteca,
    hijos: [
      { e: '🎥', t: 'Online en vivo', d: 'Clases en vivo cada 1° lunes de mes · foro, preguntas y comunidad real.', img: IMGS.biblia },
      { e: '⏯️', t: 'Asincrónico', d: 'A tu ritmo, acceso de por vida · videos, guías y certificado igual de válido.', img: IMGS.libros },
    ],
  },
]

export function Modalidades() {
  const [mod, setMod] = useState('presencial')
  const [pause, setPause] = useState(false)
  const cur = MODS.find(m => m.id === mod)
  useEffect(() => {
    if (pause) return
    const t = setInterval(() => setMod(m => ORDER[(ORDER.indexOf(m) + 1) % ORDER.length]), 6000)
    return () => clearInterval(t)
  }, [pause])
  return (
    <div className="rv" onMouseEnter={() => setPause(true)} onMouseLeave={() => setPause(false)}>
      <div className="hsec"><span className="pill">🗂️ Elige cómo estudiar</span><h2>Tu llamado, a tu manera</h2>
        <p>Como seminario tenemos modalidades para cada realidad: toca una y descubre sus dos caminos.</p></div>
      <div className="mod-tabs">
        {MODS.map(m => (
          <button key={m.id} className={`mod-tab ${mod === m.id ? 'on' : ''}`} onClick={() => setMod(m.id)}>
            <span className="mod-photo"><img src={m.img} alt={m.t} loading="lazy" /><span className="mod-e">{m.e}</span></span>
            <b>{m.t}</b>
            <small>{m.d}</small>
          </button>
        ))}
      </div>
      <div key={mod} className="mod-duo">
        {cur.hijos.map((h, k) => {
          const toBcb = cur.id === 'presencial' && h.t === 'Intensivo'
          const toAula = cur.id === 'virtual'
          const inner = (<>
            <div className="mod-card-media"><img src={h.img} alt={h.t} loading="lazy" /><span className="mod-big">{h.e}</span></div>
            <div className="mod-card-txt">
              <span className="k">{cur.t} · 0{k + 1}</span>
              <h3>{h.t}</h3>
              <p>{h.d}</p>
              {(toBcb || toAula) && <span className="mod-go">{toBcb ? 'Ver BCB Transcultural →' : 'Abrir aula virtual →'}</span>}
            </div>
          </>)
          if (toBcb) return <Link key={h.t} to="/eventos#bcb" className="mod-card mod-link" style={{ animationDelay: `${k * 100}ms` }}>{inner}</Link>
          if (toAula) return <a key={h.t} href={AULA_URL} target="_blank" rel="noreferrer" className="mod-card mod-link" style={{ animationDelay: `${k * 100}ms` }}>{inner}</a>
          return <div key={h.t} className="mod-card" style={{ animationDelay: `${k * 100}ms` }}>{inner}</div>
        })}
      </div>
      <div className="dots">{ORDER.map(o => <button key={o} aria-label={o} className={`dot ${mod === o ? 'on' : ''}`} onClick={() => setMod(o)} />)}</div>
    </div>
  )
}

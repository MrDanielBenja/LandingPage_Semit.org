import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../../shared/hooks/useReveal'
import { IMGS } from '../../shared/lib/images'
import { useCursos } from './hooks/useCursos'
import { AREAS, MODS, TRACK_INFO } from './data/cursos.data'
import { CursoCard } from './components/CursoCard'
import { CursoDrawer } from './components/CursoModal'

const SORTS = [
  { id: 'pop', label: '🔥 Populares' },
  { id: 'rating', label: '⭐ Mejor valorados' },
  { id: 'precio', label: '💲 Menor precio' },
]

export function CursosPage() {
  const [q, setQ] = useState('')
  const [area, setArea] = useState('Todos')
  const [mod, setMod] = useState('Todos')
  const [sort, setSort] = useState('pop')
  const [sel, setSel] = useState(null)
  const { data: base, loading, error, source } = useCursos()
  useReveal('/cursos')

  const list = useMemo(() => {
    let r = base.filter(c =>
      (area === 'Todos' || c.a === area) &&
      (mod === 'Todos' || c.mod === mod) &&
      (c.n + c.a + c.d).toLowerCase().includes(q.toLowerCase()))
    if (sort === 'pop') r = [...r].sort((a, b) => b.est - a.est)
    if (sort === 'rating') r = [...r].sort((a, b) => b.rating - a.rating)
    if (sort === 'precio') r = [...r].sort((a, b) => a.p - b.p)
    return r
  }, [base, q, area, mod, sort])

  const track = TRACK_INFO[area] || TRACK_INFO.Todos

  return (
    <div className="pg pg-cursos">
      <div className="nos-hero rv">
        <img className="nos-hero-bg" src={IMGS.aula} alt="Aula SEMIT" loading="lazy" />
        <div className="nos-hero-veil" />
        <div className="container nos-hero-in">
          <span className="pill pill-glass">🎓 Catálogo 2025-II · {base.length} cursos{source === 'api' ? '' : ' · local'}</span>
          <h1>Elige.<br />Aprende. Enseña.</h1>
          <p>Cada 1° lunes inicia un grupo nuevo. 100% prácticos, con materiales, foro en vivo y certificado digital.</p>
          <div className="cu-search nos-search">
            <span>🔍</span>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar: romanos, teología, dones…" />
            {q && <button onClick={() => setQ('')}>✕</button>}
          </div>
          <div className="nos-stats-float">
            <div className="stat4"><b>$30</b><span>promo mensual</span></div>
            <div className="stat4"><b>{base.reduce((s, c) => s + c.est, 0).toLocaleString('es-PE')}+</b><span>inscritos</span></div>
            <div className="stat4"><b>{base.length}</b><span>cursos activos</span></div>
            <div className="stat4"><b>4.9★</b><span>promedio</span></div>
          </div>
        </div>
      </div>

      <div className="container sec nos-body">
        <div className="cu-tracks rv">
          {AREAS.map(a => (
            <button key={a} className={`cat-card ${area === a ? 'on' : ''}`} onClick={() => setArea(a)}>
              <span className="cat-media"><img src={TRACK_INFO[a].img} alt={a} loading="lazy" /><span className="cat-emo">{TRACK_INFO[a].e}</span><span className="cat-count">{a === 'Todos' ? `${base.length}` : `${base.filter(c => c.a === a).length}`}</span></span>
              <span className="cat-body"><b>{a === 'Todos' ? 'Todo' : a}</b><small>{TRACK_INFO[a].d}</small></span>
            </button>
          ))}
        </div>
        <p className="cu-track-desc rv">{track.e} <b>{area === 'Todos' ? 'Explora todo' : area}</b> — {track.d}</p>

        <div className="cu-toolbar cu-toolbar-lg rv">
          <div className="cu-fgroup"><span>Modalidad</span><div>{MODS.map(m => <button key={m} className={mod === m ? 'on' : ''} onClick={() => setMod(m)}>{m}</button>)}</div></div>
          <div className="cu-fgroup"><span>Ordenar</span><div>{SORTS.map(s => <button key={s.id} className={sort === s.id ? 'on' : ''} onClick={() => setSort(s.id)}>{s.label}</button>)}</div></div>
        </div>

        <div className="cu-count rv">{loading ? 'Cargando cursos…' : `${list.length} resultado${list.length === 1 ? '' : 's'}`}{q && <> para <b>“{q}”</b></>} · <button className="link-btn" onClick={() => { setQ(''); setArea('Todos'); setMod('Todos') }}>limpiar filtros</button>{error ? ' · sin conexión, mostrando locales' : ''}</div>

        <div className="cu-list">
          {list.map((c, k) => <CursoCard key={c.slug || c.id || `${c.n}-${k}`} c={c} i={k} onSelect={setSel} />)}
        </div>
        {list.length === 0 && (
          <div className="cu-empty rv">
            <span>🔍</span><h3>Sin resultados</h3>
            <p>Nada para “{q}” con estos filtros. Prueba con otra palabra o limpia los filtros.</p>
            <button className="btn btn-blue" onClick={() => { setQ(''); setArea('Todos'); setMod('Todos') }}>Ver todo</button>
          </div>
        )}

        <div className="cu-cta rv">
          <div><h3>¿No sabes por dónde empezar?</h3><p>Ruta sugerida: <b>Juan</b> → <b>Romanos</b> → <b>Teología I</b>. Escríbenos y te armamos tu plan.</p></div>
          <Link className="btn btn-blue" to="/contacto">Pedir mi ruta →</Link>
        </div>
      </div>

      <CursoDrawer curso={sel} onClose={() => setSel(null)} />
    </div>
  )
}

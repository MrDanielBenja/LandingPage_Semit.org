import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../../shared/hooks/useReveal'
import { IMGS } from '../../shared/lib/images'
import { MAESTRIAS, NIVELES, NIVEL_MODS, RAMAS, RUTA, SUBS } from './data/niveles.data'
import { NivelCard } from './components/NivelCard'
import { NivelDrawer } from './components/NivelModal'

const SORTS = [
  { id: 'pop', label: '🔥 Populares' },
  { id: 'rating', label: '⭐ Mejor valorados' },
  { id: 'precio', label: '💲 Menor precio' },
]

const MAE_OPTS = [{ id: 'Todos', label: 'Ambas' }, ...MAESTRIAS]

export function NivelesPage() {
  const [rama, setRama] = useState('pre')
  const [sub, setSub] = useState('certificado')
  const [mae, setMae] = useState('Todos')
  const [q, setQ] = useState('')
  const [mod, setMod] = useState('Todos')
  const [sort, setSort] = useState('pop')
  const [sel, setSel] = useState(null)
  useReveal('/niveles')

  const pickRama = (id) => { setRama(id); setSub(SUBS[id][0].id); setMae('Todos') }
  const subs = SUBS[rama]
  const ramaInfo = RAMAS.find(r => r.id === rama)
  const subInfo = subs.find(s => s.id === sub)

  const list = useMemo(() => {
    let r = NIVELES.filter(c =>
      c.rama === rama &&
      c.sub === sub &&
      (sub !== 'maestria' || mae === 'Todos' || c.mae === mae) &&
      (mod === 'Todos' || c.mod === mod) &&
      (c.n + c.a + c.d).toLowerCase().includes(q.toLowerCase()))
    if (sort === 'pop') r = [...r].sort((a, b) => b.est - a.est)
    if (sort === 'rating') r = [...r].sort((a, b) => b.rating - a.rating)
    if (sort === 'precio') r = [...r].sort((a, b) => a.p - b.p)
    return r
  }, [rama, sub, mae, mod, q, sort])

  return (
    <div className="pg pg-cursos">
      <div className="nos-hero mid rv">
        <img className="nos-hero-bg" src={IMGS.libros} alt="Niveles SEMIT" loading="lazy" />
        <div className="nos-hero-veil" />
        <div className="container nos-hero-in">
          <span className="pill pill-glass">📶 Ruta académica · {NIVELES.length} programas</span>
          <h1>Tu ruta.<br />De cero a maestría.</h1>
        </div>
      </div>

      <div className="container sec nos-body">
        <div className="nv-intro rv">
          <p className="nv-hero-sub">Pregrado para empezar, Postgrado para profundizar. Elige tu rama y avanza paso a paso.</p>
          <p className="nv-hero-txt">No importa dónde estés hoy: si recién conoces la Palabra o si ya predicas y enseñas, aquí hay un escalón con tu nombre. Cada nivel te prepara para el siguiente — del primer certificado hasta la maestría — con clases claras, práctica real y acompañamiento de docentes y misioneros. <b>Empieza donde estás, termina donde Dios te quiere llevar.</b></p>
        </div>
        <div className="nv-ramas rv">
          {RAMAS.map(r => {
            const n = NIVELES.filter(c => c.rama === r.id).length
            return (
              <button key={r.id} className={`cat-card wide ${rama === r.id ? 'on' : ''}`} onClick={() => pickRama(r.id)}>
                <span className="cat-media"><img src={r.img} alt={r.label} loading="lazy" /><span className="cat-emo">{r.e}</span><span className="cat-count">{n}</span></span>
                <span className="cat-body"><b>{r.label}</b><small>{r.d}</small></span>
              </button>
            )
          })}
        </div>

        <div key={rama} className="nv-subs rv">
          {subs.map(s => {
            const n = NIVELES.filter(c => c.rama === rama && c.sub === s.id).length
            return (
              <button key={s.id} className={`cat-card ${sub === s.id ? 'on' : ''}`} onClick={() => { setSub(s.id); setMae('Todos') }}>
                <span className="cat-media"><img src={s.img} alt={s.label} loading="lazy" /><span className="cat-emo">{s.e}</span><span className="cat-count">{n}</span></span>
                <span className="cat-body"><b>{s.label}</b><small>{s.d}</small></span>
              </button>
            )
          })}
        </div>

        {sub === 'maestria' && (
          <div className="nv-mae rv">
            {MAE_OPTS.map(m => (
              <button key={m.id} className={`cat-card ${mae === m.id ? 'on' : ''}`} onClick={() => setMae(m.id)}>
                <span className="cat-media"><img src={m.id === 'Todos' ? NIVELES.find(p => p.sub === 'maestria').img : MAESTRIAS.find(x => x.id === m.id).img} alt={m.label} loading="lazy" /><span className="cat-emo">{m.id === 'Todos' ? '🎓' : m.e}</span></span>
                <span className="cat-body"><b>{m.id === 'Todos' ? 'Ver ambas' : `Maestría en ${m.label}`}</b><small>{m.id === 'Todos' ? 'Artes + Divinidades' : m.d}</small></span>
              </button>
            ))}
          </div>
        )}

        <div className="cu-toolbar cu-toolbar-lg rv">
          <div className="cu-search nv-search">
            <span>🔍</span>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={`Buscar en ${subInfo.label.toLowerCase()}…`} />
            {q && <button onClick={() => setQ('')}>✕</button>}
          </div>
          <div className="cu-fgroup"><span>Modalidad</span><div>{NIVEL_MODS.map(m => <button key={m} className={mod === m ? 'on' : ''} onClick={() => setMod(m)}>{m}</button>)}</div></div>
          <div className="cu-fgroup"><span>Ordenar</span><div>{SORTS.map(s => <button key={s.id} className={sort === s.id ? 'on' : ''} onClick={() => setSort(s.id)}>{s.label}</button>)}</div></div>
        </div>

        <div className="cu-count rv">{list.length} programa{list.length === 1 ? '' : 's'}{q && <> para <b>“{q}”</b></>} · <button className="link-btn" onClick={() => { setQ(''); setMod('Todos') }}>limpiar filtros</button></div>

        <div className="cu-list" key={rama + sub + mae}>
          {list.map((c, k) => <NivelCard key={`${c.n}-${k}`} c={c} i={k} onSelect={setSel} />)}
        </div>
        {list.length === 0 && (
          <div className="cu-empty rv">
            <span>🔍</span><h3>Sin resultados</h3>
            <p>Nada para “{q}” con estos filtros. Prueba con otra palabra o limpia los filtros.</p>
            <button className="btn btn-blue" onClick={() => { setQ(''); setMod('Todos') }}>Ver todo</button>
          </div>
        )}

        <div className="cu-cta rv">
          <div><h3>¿Subimos juntos al siguiente nivel?</h3><p>Estás en <b>{subInfo.label}</b>. Al terminar pasas a <b>{RUTA[Math.min(RUTA.findIndex(x => x.id === sub) + 1, RUTA.length - 1)].t}</b>. Te ubicamos gratis.</p></div>
          <Link className="btn btn-blue" to="/contacto">Pedir mi ubicación →</Link>
        </div>
      </div>

      <NivelDrawer nivel={sel} onClose={() => setSel(null)} />
    </div>
  )
}

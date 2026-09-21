import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useReveal } from '../../shared/hooks/useReveal'
import { useCountdown } from '../../shared/hooks/useCountdown'
import { IMGS, LOCAL } from '../../shared/lib/images'
import { EVENTOS, EV_CATS, EV_CAT_INFO } from './data/eventos.data'
import { EventoCard, evDiasRestan } from './components/EventoCard'
import { EventoDrawer } from './components/EventoModal'
import { BcbEvento } from './components/BcbEvento'

const MESES_L = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const WEEK_S = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

function monthCells(y, m) {
  const first = new Date(y, m, 1)
  const off = first.getDay()
  const days = new Date(y, m + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < off; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(d)
  return cells
}

const keyOfDay = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

function ProximoHero({ ev, onSelect }) {
  const cd = useCountdown(ev.fecha + 'T' + ev.hora + ':00')
  return (
    <div className="ev-hero-card rv" onClick={() => onSelect(ev)}>
      <img src={ev.img} alt={ev.n} loading="lazy" />
      <div className="ev-hero-veil" />
      <div className="ev-hero-txt">
        <span className="gold-pill">🔥 Próximo evento · {ev.cat}</span>
        <h2>{ev.n}</h2>
        <p>📍 {ev.lugar} · 🕘 {ev.hora}</p>
        <div className="ev-cd">
          {[[cd.d, 'días'], [cd.h, 'hrs'], [cd.m, 'min'], [cd.s, 'seg']].map(([v, l]) => (
            <div key={l}><b>{String(v).padStart(2, '0')}</b><span>{l}</span></div>
          ))}
        </div>
        <span className="btn btn-gold ev-hero-btn">Reservar mi cupo →</span>
      </div>
    </div>
  )
}

function SecHead({ n, pill, title, sub }) {
  return (
    <div className="ev-sec-head rv">
      <span className="ev-num">{n}</span>
      <div><span className="pill">{pill}</span><h2>{title}</h2>{sub && <p>{sub}</p>}</div>
    </div>
  )
}

export function EventosPage() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Todos')
  const [sel, setSel] = useState(null)
  const [soloProx, setSoloProx] = useState(true)
  const [vista, setVista] = useState('lista')
  const [anio, setAnio] = useState(() => {
    const ys = EVENTOS.map(e => Number(e.fecha.slice(0, 4))).sort((a, b) => a - b)
    const now = new Date().getFullYear()
    return ys.includes(now) ? now : (ys[0] ?? now)
  })
  const [mesSel, setMesSel] = useState(null)
  const { hash } = useLocation()
  useReveal('/eventos')
  useEffect(() => {
    if (hash === '#bcb') document.getElementById('bcb')?.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  const anios = useMemo(() => {
    const s = new Set(EVENTOS.map(e => Number(e.fecha.slice(0, 4))))
    return [...s].sort((a, b) => a - b)
  }, [])

  const list = useMemo(() => {
    const r = EVENTOS.filter(c =>
      (cat === 'Todos' || c.cat === cat) &&
      (!soloProx || evDiasRestan(c.fecha) >= 0) &&
      (Number(c.fecha.slice(0, 4)) === anio) &&
      (!mesSel || Number(c.fecha.slice(5, 7)) === mesSel) &&
      (c.n + c.cat + c.d + c.lugar).toLowerCase().includes(q.toLowerCase()))
    return [...r].sort((a, b) => a.fecha.localeCompare(b.fecha))
  }, [q, cat, soloProx, anio, mesSel])

  const yearBase = useMemo(() => {
    return EVENTOS.filter(c =>
      (cat === 'Todos' || c.cat === cat) &&
      (!soloProx || evDiasRestan(c.fecha) >= 0) &&
      (Number(c.fecha.slice(0, 4)) === anio) &&
      (c.n + c.cat + c.d + c.lugar).toLowerCase().includes(q.toLowerCase()))
  }, [q, cat, soloProx, anio])

  const byFecha = useMemo(() => {
    const map = {}
    yearBase.forEach(e => { (map[e.fecha] = map[e.fecha] || []).push(e) })
    return map
  }, [yearBase])

  const proximo = useMemo(() => {
    const f = EVENTOS.filter(e => evDiasRestan(e.fecha) >= 0).sort((a, b) => a.fecha.localeCompare(b.fecha))
    return f[0] || EVENTOS[0]
  }, [])

  const limpiar = () => { setQ(''); setCat('Todos'); setSoloProx(false); setMesSel(null) }
  const track = EV_CAT_INFO[cat] || EV_CAT_INFO.Todos

  return (
    <div className="pg pg-cursos">
      <div className="nos-hero rv">
        <img className="nos-hero-bg" src={LOCAL.inicio4} alt="Eventos SEMIT" loading="lazy" />
        <div className="nos-hero-veil" />
        <div className="container nos-hero-in">
          <span className="pill pill-glass">🎉 Agenda {anio} · {yearBase.length} experiencias</span>
          <h1>Próximos<br />eventos.</h1>
          <p>No te pierdas ninguna de nuestras experiencias preparadas para ti: viajes, conferencias, talleres y campamentos.</p>
          <div className="nos-stats-float">
            <div className="stat4"><b>✈️</b><span>viajes misioneros</span></div>
            <div className="stat4"><b>🎤</b><span>conferencias</span></div>
            <div className="stat4"><b>🛠️</b><span>capacitaciones</span></div>
            <div className="stat4"><b>🏕️</b><span>campamentos</span></div>
          </div>
        </div>
      </div>

      <div className="container sec nos-body">
        <SecHead n="01" pill="🔥 No te lo pierdas" title="Lo más próximo" sub="Nuestro siguiente encuentro, con cuenta regresiva en vivo." />
        <ProximoHero ev={proximo} onSelect={setSel} />

        <SecHead n="02" pill="🗓️ Agenda completa" title="Explora todo" sub="Filtra por tipo, toca un día del calendario o busca por palabra." />

        <div className="ev-panel rv">
          <div className="cu-search ev-search">
            <span>🔍</span>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar: amazonía, jóvenes, predicación…" />
            {q && <button onClick={() => setQ('')}>✕</button>}
          </div>
          <div className="ev-cats rv">
            {EV_CATS.map(a => (
              <button key={a} className={`cat-card ${cat === a ? 'on' : ''}`} onClick={() => setCat(a)}>
                <span className="cat-media"><img src={EV_CAT_INFO[a].img} alt={a} loading="lazy" /><span className="cat-emo">{EV_CAT_INFO[a].e}</span><span className="cat-count">{a === 'Todos' ? yearBase.length : yearBase.filter(c => c.cat === a).length}</span></span>
                <span className="cat-body"><b>{a === 'Todos' ? 'Todo' : a}</b><small>{EV_CAT_INFO[a].d}</small></span>
              </button>
            ))}
          </div>
          <div className="ev-filters ev-filters-2">
            <div className="cu-fgroup"><span>Ver</span><div>
              <button className={!soloProx ? 'on' : ''} onClick={() => setSoloProx(false)}>Todos</button>
              <button className={soloProx ? 'on' : ''} onClick={() => setSoloProx(true)}>Solo próximos</button>
            </div></div>
            <div className="cu-fgroup"><span>Vista</span><div>
              <button className={vista === 'lista' ? 'on' : ''} onClick={() => setVista('lista')}>📋 Lista</button>
              <button className={vista === 'cal' ? 'on' : ''} onClick={() => setVista('cal')}>📅 Año</button>
            </div></div>
          </div>
          <p className="ev-active">{track.e} <b>{cat === 'Todos' ? 'Toda la agenda' : cat}</b> · {track.d}</p>
        </div>

        {vista === 'cal' && (
          <div className="ev-year rv" key={`year-${anio}-${cat}-${soloProx}-${q}`}>
            <div className="ev-cal-head">
              <div><b>Agenda {anio}</b><small>Toca una burbuja de color para ver el evento · toca el mes para ver su lista</small></div>
              <div className="ev-year-nav">{anios.map(a => <button key={a} className={a === anio ? 'on' : ''} onClick={() => { setAnio(a); setMesSel(null) }}>{a}</button>)}</div>
            </div>
            <div className="ev-mood-cal">
              {MESES_L.map((mes, m) => (
                <div key={m} className="ev-mmonth">
                  <button className="ev-mtitle" onClick={() => { setMesSel(m + 1); setVista('lista') }} title="Ver lista de este mes">{mes}</button>
                  <div className="ev-mweek">{WEEK_S.map((w, k) => <span key={k}>{w}</span>)}</div>
                  <div className="ev-mdays">
                    {monthCells(anio, m).map((d, k) => {
                      if (!d) return <span key={`x${k}`} className="ev-mday empty" />
                      const evs = byFecha[keyOfDay(anio, m, d)] || []
                      if (!evs.length) return <span key={d} className="ev-mday"><span className="ev-circle">{d}</span></span>
                      return (
                        <span key={d} className="ev-mday">
                          <button
                            className={`ev-circle has cat-${EV_CATS.indexOf(evs[0].cat)}`}
                            onClick={() => setSel(evs[0])}
                            title={`${evs.map(e => e.n).join(' · ')} — ver detalle`}
                          >{d}</button>
                        </span>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="ev-legend">
              {EV_CATS.slice(1).map((c, k) => <span key={c}><i className={`ev-dot cat-${k + 1}`} />{c}</span>)}
              {mesSel != null && <button className="link-btn" onClick={() => setMesSel(null)}>✕ soltar {MESES_L[mesSel - 1]}</button>}
            </div>
          </div>
        )}

        {vista === 'lista' && (
          <>
            <div className="cu-count rv">{list.length} evento{list.length === 1 ? '' : 's'} en {mesSel != null ? MESES_L[mesSel - 1] : ''} {anio}{q && <> para <b>“{q}”</b></>} · <button className="link-btn" onClick={limpiar}>limpiar filtros</button></div>

            <div className="cu-list" key={cat + soloProx + anio + mesSel + vista}>
              {list.map((c, k) => <EventoCard key={`${c.fecha}-${c.n}`} c={c} i={k} onSelect={setSel} />)}
            </div>
            {list.length === 0 && (
              <div className="cu-empty rv">
                <span>📅</span><h3>Sin eventos</h3>
                <p>{mesSel != null ? 'Ese mes no hay nada programado. Suelta el mes o limpia los filtros.' : 'Nada con estos filtros. Prueba otra palabra o limpia los filtros.'}</p>
                <button className="btn btn-blue" onClick={limpiar}>Ver agenda completa</button>
              </div>
            )}
            {mesSel != null && (
              <div className="rv" style={{ textAlign: 'center', marginTop: 14 }}>
                <button className="btn btn-line" onClick={() => setVista('cal')}>← Volver al calendario {anio}</button>
              </div>
            )}
          </>
        )}

        <SecHead n="03" pill="🔥 Intensivo Ene–Feb" title="BCB Transcultural" sub="Nuestro programa estrella: un mes en base + campo transcultural + oficio." />
        <BcbEvento />

        <div className="cu-cta rv">
          <div><h3>¿Quieres un evento en tu iglesia?</h3><p>Llevamos <b>conferencias, talleres y campamentos</b> a tu ciudad. Escríbenos y lo armamos juntos.</p></div>
          <Link className="btn btn-blue" to="/contacto">Pedir un evento →</Link>
        </div>
      </div>

      <EventoDrawer evento={sel} onClose={() => setSel(null)} />
    </div>
  )
}

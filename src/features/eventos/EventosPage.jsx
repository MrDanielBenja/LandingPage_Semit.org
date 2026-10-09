import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useReveal } from '../../shared/hooks/useReveal'
import { useCountdown } from '../../shared/hooks/useCountdown'
import { useLang } from '../../app/providers/LangProvider'
import { useContent } from '../../core/cms/contentStore'
import { resolveAsset } from '../../core/cms/assets'
import { fmtCssKey } from '../../core/cms/fmt'
import { DEFAULT_EVENTOS } from '../../core/cms/defaultEventos'
import { iconOf } from '../../core/cms/icons'
import { imgStyleOf } from '../../core/cms/imgEdit'
import { EventoCard, evDiasRestan } from './components/EventoCard'
import { EventoDrawer } from './components/EventoModal'
import { BcbEvento } from './components/BcbEvento'

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

function ProximoHero({ ev, onSelect, icon }) {
  const { lang, t } = useLang()
  const cd = useCountdown(ev.fecha + 'T' + ev.hora + ':00')
  const en = lang === 'en'
  const catMap = t('eventos.catMap')
  const catT = (catMap && catMap[ev.cat]) || ev.cat
  const units = en ? ['days', 'hrs', 'min', 'sec'] : ['días', 'hrs', 'min', 'seg']
  return (
    <div className="ev-hero-card rv" onClick={() => onSelect(ev)}>
      <img src={ev.img} alt={ev.n} loading="lazy" style={imgStyleOf(ev)} />
      <div className="ev-hero-veil" />
      <div className="ev-hero-txt">
        <span className="gold-pill">{icon ?? '🔥'} {en ? `Next event · ${catT}` : `Próximo evento · ${catT}`}</span>
        <h2>{ev.n}</h2>
        <p>📍 {ev.lugar} · 🕘 {ev.hora}</p>
        <div className="ev-cd">
          {[cd.d, cd.h, cd.m, cd.s].map((v, k) => (
            <div key={units[k]}><b>{String(v).padStart(2, '0')}</b><span>{units[k]}</span></div>
          ))}
        </div>
        <span className="btn btn-gold ev-hero-btn">{en ? 'Reserve my spot →' : 'Reservar mi cupo →'}</span>
      </div>
    </div>
  )
}

function SecHead({ n, pill, title, sub, titleStyle, subStyle }) {
  return (
    <div className="ev-sec-head rv">
      <span className="ev-num">{n}</span>
      <div><span className="pill">{pill}</span><h2 style={titleStyle}>{title}</h2>{sub && <p style={subStyle}>{sub}</p>}</div>
    </div>
  )
}

export function EventosPage({ preview }) {
  const { lang, t } = useLang()
  const en = lang === 'en'
  const { data: saved } = useContent('eventos', DEFAULT_EVENTOS)
  const cms = preview || saved
  const h = cms.hero || DEFAULT_EVENTOS.hero
  const HL = (k) => (lang === 'en' ? h[`${k}_en`] : h[`${k}_es`])
  const s1 = cms.sec1 || DEFAULT_EVENTOS.sec1
  const s2 = cms.sec2 || DEFAULT_EVENTOS.sec2
  const s3 = cms.sec3 || DEFAULT_EVENTOS.sec3
  const S = (o, k) => (lang === 'en' ? o[`${k}_en`] : o[`${k}_es`])
  const cc = cms.cta || DEFAULT_EVENTOS.cta
  const CL = (k) => (lang === 'en' ? cc[`${k}_en`] : cc[`${k}_es`])
  const CATS = (Array.isArray(cms.cats) && cms.cats.length ? cms.cats : DEFAULT_EVENTOS.cats)
  const CAT_ORDER = CATS.map(c => c.id)
  const MESES_L = t('eventos.meses')
  const WEEK_S = t('eventos.semana')
  const catMap = t('eventos.catMap')
  const catT = (c) => (catMap && catMap[c]) || c
  const catInfo = (id) => CATS.find(c => c.id === id) || CATS[0] || {}
  const catDesc = (id) => {
    const o = CATS.find(c => c.id === id) || {}
    return lang === 'en' ? (o.d_en || o.d_es || '') : (o.d_es || o.d_en || '')
  }
  const ALL = useMemo(() => {
    const arr = (Array.isArray(cms.eventos) && cms.eventos.length ? cms.eventos : DEFAULT_EVENTOS.eventos)
    return arr.map(e => ({
      ...e,
      d: lang === 'en' ? (e.d_en || e.d_es || '') : (e.d_es || e.d_en || ''),
      programa: lang === 'en' ? (e.programa_en || e.programa_es || []) : (e.programa_es || e.programa_en || []),
      img: resolveAsset(e.img),
    }))
  }, [cms, lang])
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Todos')
  const [sel, setSel] = useState(null)
  const [soloProx, setSoloProx] = useState(true)
  const [vista, setVista] = useState('lista')
  const [anio, setAnio] = useState(() => {
    const ys = DEFAULT_EVENTOS.eventos.map(e => Number(e.fecha.slice(0, 4))).sort((a, b) => a - b)
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
    const s = new Set(ALL.map(e => Number(e.fecha.slice(0, 4))))
    return [...s].sort((a, b) => a - b)
  }, [ALL])

  const hay = (c) => (c.n + c.cat + (c.d_es || '') + (c.d_en || '') + c.lugar).toLowerCase().includes(q.toLowerCase())

  const list = useMemo(() => {
    const r = ALL.filter(c =>
      (cat === 'Todos' || c.cat === cat) &&
      (!soloProx || evDiasRestan(c.fecha) >= 0) &&
      (Number(c.fecha.slice(0, 4)) === anio) &&
      (!mesSel || Number(c.fecha.slice(5, 7)) === mesSel) &&
      hay(c))
    return [...r].sort((a, b) => a.fecha.localeCompare(b.fecha))
  }, [ALL, q, cat, soloProx, anio, mesSel])

  const yearBase = useMemo(() => {
    return ALL.filter(c =>
      (cat === 'Todos' || c.cat === cat) &&
      (!soloProx || evDiasRestan(c.fecha) >= 0) &&
      (Number(c.fecha.slice(0, 4)) === anio) &&
      hay(c))
  }, [ALL, q, cat, soloProx, anio])

  const byFecha = useMemo(() => {
    const map = {}
    yearBase.forEach(e => { (map[e.fecha] = map[e.fecha] || []).push(e) })
    return map
  }, [yearBase])

  const proximo = useMemo(() => {
    const f = ALL.filter(e => evDiasRestan(e.fecha) >= 0).sort((a, b) => a.fecha.localeCompare(b.fecha))
    return f[0] || ALL[0]
  }, [ALL])

  const limpiar = () => { setQ(''); setCat('Todos'); setSoloProx(false); setMesSel(null) }
  const I = (k, fb) => iconOf(cms, k, fb)
  const iSearch = I('search', '🔍')
  const iEmpty = I('empty', '📅')
  const track = catInfo(cat)
  const heroPill = (HL('pill') || '').replaceAll('{a}', anio).replaceAll('{n}', yearBase.length)

  return (
    <div className="pg pg-cursos">
      <div className="nos-hero rv" style={h.bg ? { background: h.bg } : undefined}>
        <img className="nos-hero-bg" src={resolveAsset(h.img)} alt="Eventos SEMIT" loading="lazy" style={imgStyleOf(h)} />
        <div className="nos-hero-veil" />
        <div className="container nos-hero-in">
          <span className="pill pill-glass" style={fmtCssKey(cms, 'ev.hero.pill')}>{heroPill}</span>
          <h1 style={fmtCssKey(cms, 'ev.hero.h1')}>{HL('h1a')}<br />{HL('h1b')}</h1>
          <p style={fmtCssKey(cms, 'ev.hero.p')}>{HL('p')}</p>
          <div className="nos-stats-float">
            <div className="stat4"><b>{h.s1e ?? '✈️'}</b><span>{HL('s1')}</span></div>
            <div className="stat4"><b>{h.s2e ?? '🎤'}</b><span>{HL('s2')}</span></div>
            <div className="stat4"><b>{h.s3e ?? '🛠️'}</b><span>{HL('s3')}</span></div>
            <div className="stat4"><b>{h.s4e ?? '🏕️'}</b><span>{HL('s4')}</span></div>
          </div>
        </div>
      </div>

      <div className="container sec nos-body">
        <SecHead n={s1.n} pill={S(s1, 'pill')} title={S(s1, 'title')} sub={S(s1, 'sub')} titleStyle={fmtCssKey(cms, 'ev.sec.title')} subStyle={fmtCssKey(cms, 'ev.sec.sub')} />
        <ProximoHero ev={proximo} onSelect={setSel} icon={h.proximoIcon} />

        <SecHead n={s2.n} pill={S(s2, 'pill')} title={S(s2, 'title')} sub={S(s2, 'sub')} titleStyle={fmtCssKey(cms, 'ev.sec.title')} subStyle={fmtCssKey(cms, 'ev.sec.sub')} />

        <div className="ev-panel rv">
          <div className="cu-search ev-search">
            <span>{iSearch}</span>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('eventos.ph')} />
            {q && <button onClick={() => setQ('')}>✕</button>}
          </div>
          <div className="ev-cats rv">
            {CATS.map(a => (
              <button key={a.id} className={`cat-card ${cat === a.id ? 'on' : ''}`} onClick={() => setCat(a.id)}>
                <span className="cat-media"><img src={resolveAsset(a.img)} alt={a.id} loading="lazy" style={imgStyleOf(a)} /><span className="cat-emo">{a.e}</span><span className="cat-count">{a.id === 'Todos' ? yearBase.length : yearBase.filter(c => c.cat === a.id).length}</span></span>
                <span className="cat-body"><b>{a.id === 'Todos' ? t('eventos.todo') : catT(a.id)}</b><small>{lang === 'en' ? (a.d_en || a.d_es) : (a.d_es || a.d_en)}</small></span>
              </button>
            ))}
          </div>
          <div className="ev-filters ev-filters-2">
            <div className="cu-fgroup"><span>{t('eventos.ver')}</span><div>
              <button className={!soloProx ? 'on' : ''} onClick={() => setSoloProx(false)}>{t('eventos.todos')}</button>
              <button className={soloProx ? 'on' : ''} onClick={() => setSoloProx(true)}>{t('eventos.soloProx')}</button>
            </div></div>
            <div className="cu-fgroup"><span>{t('eventos.vista')}</span><div>
              <button className={vista === 'lista' ? 'on' : ''} onClick={() => setVista('lista')}>{t('eventos.lista')}</button>
              <button className={vista === 'cal' ? 'on' : ''} onClick={() => setVista('cal')}>{t('eventos.anio')}</button>
            </div></div>
          </div>
          <p className="ev-active">{track.e} <b>{cat === 'Todos' ? t('eventos.todaAgenda') : catT(cat)}</b> · {catDesc(cat)}</p>
        </div>

        {vista === 'cal' && (
          <div className="ev-year rv" key={`year-${anio}-${cat}-${soloProx}-${q}`}>
            <div className="ev-cal-head">
              <div><b>{en ? `Calendar ${anio}` : `Agenda ${anio}`}</b><small>{t('eventos.calSub')}</small></div>
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
                            className={`ev-circle has cat-${CAT_ORDER.indexOf(evs[0].cat)}`}
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
              {CATS.slice(1).map((c) => <span key={c.id}><i className={`ev-dot cat-${CAT_ORDER.indexOf(c.id)}`} />{catT(c.id)}</span>)}
              {mesSel != null && <button className="link-btn" onClick={() => setMesSel(null)}>{t('eventos.soltar', { m: MESES_L[mesSel - 1] })}</button>}
            </div>
          </div>
        )}

        {vista === 'lista' && (
          <>
            <div className="cu-count rv">{list.length} {list.length === 1 ? t('eventos.count.uno') : t('eventos.count.muchos')} {t('eventos.count.en')} {mesSel != null ? MESES_L[mesSel - 1] : ''} {anio}{q && <> {en ? 'for' : 'para'} <b>“{q}”</b></>} · <button className="link-btn" onClick={limpiar}>{t('eventos.count.limpiar')}</button></div>

            <div className="cu-list" key={cat + soloProx + anio + mesSel + vista}>
              {list.map((c, k) => <EventoCard key={`${c.fecha}-${c.n}`} c={c} i={k} onSelect={setSel} preview={preview} icons={cms.icons} />)}
            </div>
            {list.length === 0 && (
              <div className="cu-empty rv">
                <span>{iEmpty}</span><h3>{t('eventos.empty.t')}</h3>
                <p>{mesSel != null ? t('eventos.empty.pMes') : t('eventos.empty.pGen')}</p>
                <button className="btn btn-blue" onClick={limpiar}>{t('eventos.empty.btn')}</button>
              </div>
            )}
            {mesSel != null && (
              <div className="rv" style={{ textAlign: 'center', marginTop: 14 }}>
                <button className="btn btn-line" onClick={() => setVista('cal')}>{t('eventos.volver', { a: anio })}</button>
              </div>
            )}
          </>
        )}

        <SecHead n={s3.n} pill={S(s3, 'pill')} title={S(s3, 'title')} sub={S(s3, 'sub')} titleStyle={fmtCssKey(cms, 'ev.sec.title')} subStyle={fmtCssKey(cms, 'ev.sec.sub')} />
        <BcbEvento preview={preview} />

        <div className="cu-cta rv">
          <div><h3 style={fmtCssKey(cms, 'ev.cta.t')}>{CL('t')}</h3><p style={fmtCssKey(cms, 'ev.cta.p')}>{CL('p1')} <b>{CL('p2')}</b> {CL('p3')}</p></div>
          <Link className="btn btn-blue" to="/contacto">{CL('btn')}</Link>
        </div>
      </div>

      <EventoDrawer evento={sel} onClose={() => setSel(null)} preview={preview} icons={cms.icons} />
    </div>
  )
}

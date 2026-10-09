import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../../shared/hooks/useReveal'
import { useLang } from '../../app/providers/LangProvider'
import { useCursos } from './hooks/useCursos'
import { AREAS, MODS, TRACK_INFO } from './data/cursos.data'
import { CursoCard } from './components/CursoCard'
import { CursoDrawer } from './components/CursoModal'
import { useContent } from '../../core/cms/contentStore'
import { resolveAsset } from '../../core/cms/assets'
import { fmtCssKey } from '../../core/cms/fmt'
import { DEFAULT_CURSOS_PAGE, applyCursosOverrides } from '../../core/cms/defaultCursosPage'
import { iconOf } from '../../core/cms/icons'
import { imgStyleOf } from '../../core/cms/imgEdit'

const fill = (s, vars) => {
  let r = s || ''
  if (vars) for (const k of Object.keys(vars)) r = r.replaceAll(`{${k}}`, vars[k])
  return r
}

export function CursosPage({ preview }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('cursosPage', DEFAULT_CURSOS_PAGE)
  const cms = preview || saved || DEFAULT_CURSOS_PAGE
  const hero = cms.hero || DEFAULT_CURSOS_PAGE.hero
  const stats = cms.stats || DEFAULT_CURSOS_PAGE.stats
  const toolbar = cms.toolbar || DEFAULT_CURSOS_PAGE.toolbar
  const empty = cms.empty || DEFAULT_CURSOS_PAGE.empty
  const cta = cms.cta || DEFAULT_CURSOS_PAGE.cta
  const tracks = Array.isArray(cms.tracks) ? cms.tracks : DEFAULT_CURSOS_PAGE.tracks
  const trackMap = useMemo(() => {
    const m = {}
    for (const x of tracks || []) if (x && x.id) m[x.id] = x
    return m
  }, [tracks])
  const L = (o, k, dictKey) => (lang === 'en' ? o[`${k}_en`] : o[`${k}_es`]) || t(dictKey)
  const SORTS = t('cursos.sorts')
  const AREAS_T = t('cursos.areas')
  const MODS_T = t('cursos.mods')
  const areaMap = t('cursos.areaMap')
  const [q, setQ] = useState('')
  const [area, setArea] = useState('Todos')
  const [mod, setMod] = useState('Todos')
  const [sort, setSort] = useState('pop')
  const [sel, setSel] = useState(null)
  const { data: base, loading, error, source } = useCursos()
  useReveal('/cursos')

  const cursos = useMemo(() => applyCursosOverrides(base, cms.overrides, lang), [base, cms.overrides, lang])
  const I = (k, fb) => iconOf(cms, k, fb)
  const iSearch = I('search', '🔍')
  const iEmpty = I('empty', '🔍')

  const list = useMemo(() => {
    let r = cursos.filter(c =>
      (area === 'Todos' || c.a === area) &&
      (mod === 'Todos' || c.mod === mod) &&
      (c.n + c.a + c.d).toLowerCase().includes(q.toLowerCase()))
    if (sort === 'pop') r = [...r].sort((a, b) => b.est - a.est)
    if (sort === 'rating') r = [...r].sort((a, b) => b.rating - a.rating)
    if (sort === 'precio') r = [...r].sort((a, b) => a.p - b.p)
    return r
  }, [cursos, q, area, mod, sort])

  const track = TRACK_INFO[area] || TRACK_INFO.Todos
  const trackCms = trackMap[area] || trackMap.Todos || {}
  const trackE = trackCms.e || track.e
  const trackD = (lang === 'en' ? trackCms.d_en : trackCms.d_es) || track.d
  const trackImg = (id) => {
    const x = trackMap[id]
    return resolveAsset(x?.img) || TRACK_INFO[id]?.img
  }
  const trackDesc = (id) => (lang === 'en' ? trackMap[id]?.d_en : trackMap[id]?.d_es) || TRACK_INFO[id]?.d
  const trackEmo = (id) => trackMap[id]?.e || TRACK_INFO[id]?.e

  return (
    <div className="pg pg-cursos">
      <div className="nos-hero rv" style={hero.bg ? { background: hero.bg } : undefined}>
        <img className="nos-hero-bg" src={resolveAsset(hero.img) || undefined} alt="Aula SEMIT" loading="lazy" style={imgStyleOf(hero)} />
        <div className="nos-hero-veil" />
        <div className="container nos-hero-in">
          <span className="pill pill-glass" style={fmtCssKey(cms, 'cur.hero.pill')}>{fill(L(hero, 'pill', 'cursos.hero.pill'), { n: cursos.length })}{source === 'api' ? '' : t('cursos.hero.local')}</span>
          <h1 style={fmtCssKey(cms, 'cur.hero.h1')}>{L(hero, 'h1a', 'cursos.hero.h1a')}<br />{L(hero, 'h1b', 'cursos.hero.h1b')}</h1>
          <p style={fmtCssKey(cms, 'cur.hero.p')}>{L(hero, 'p', 'cursos.hero.p')}</p>
          <div className="cu-search nos-search">
            <span>{iSearch}</span>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={L(hero, 'ph', 'cursos.hero.ph')} />
            {q && <button onClick={() => setQ('')}>✕</button>}
          </div>
          <div className="nos-stats-float">
            <div className="stat4"><b>$30</b><span>{L(stats, 'promoLabel', 'cursos.hero.promo')}</span></div>
            <div className="stat4"><b>{cursos.reduce((s, c) => s + c.est, 0).toLocaleString('es-PE')}+</b><span>{t('cursos.hero.insc')}</span></div>
            <div className="stat4"><b>{cursos.length}</b><span>{L(stats, 'activosLabel', 'cursos.hero.activos')}</span></div>
            <div className="stat4"><b>4.9★</b><span>{L(stats, 'promLabel', 'cursos.hero.prom')}</span></div>
          </div>
        </div>
      </div>

      <div className="container sec nos-body">
        <div className="cu-tracks rv">
          {AREAS.map((a, idx) => {
            const label = a === 'Todos' ? t('cursos.trackTodo') : (areaMap[a] || a)
            return (
              <button key={a} className={`cat-card ${area === a ? 'on' : ''}`} onClick={() => setArea(a)}>
                <span className="cat-media"><img src={trackImg(a)} alt={label} loading="lazy" style={imgStyleOf(trackMap[a])} /><span className="cat-emo">{trackEmo(a)}</span><span className="cat-count">{a === 'Todos' ? `${cursos.length}` : `${cursos.filter(c => c.a === a).length}`}</span></span>
                <span className="cat-body"><b>{label}</b><small style={fmtCssKey(cms, `cur.track.${a}`)}>{trackDesc(a)}</small></span>
              </button>
            )
          })}
        </div>
        <p className="cu-track-desc rv">{trackE} <b>{area === 'Todos' ? t('cursos.trackAll') : (areaMap[area] || area)}</b> — {trackD}</p>

        <div className="cu-toolbar cu-toolbar-lg rv">
          <div className="cu-fgroup"><span style={fmtCssKey(cms, 'cur.toolbar.modLabel')}>{L(toolbar, 'modLabel', 'cursos.toolbar.mod')}</span><div>{MODS.map((m, k) => <button key={m} className={mod === m ? 'on' : ''} onClick={() => setMod(m)}>{MODS_T[k]}</button>)}</div></div>
          <div className="cu-fgroup"><span style={fmtCssKey(cms, 'cur.toolbar.ordLabel')}>{L(toolbar, 'ordLabel', 'cursos.toolbar.ord')}</span><div>{SORTS.map(s => <button key={s.id} className={sort === s.id ? 'on' : ''} onClick={() => setSort(s.id)}>{s.label}</button>)}</div></div>
        </div>

        <div className="cu-count rv">{loading ? t('cursos.count.loading') : `${list.length} ${list.length === 1 ? t('cursos.count.uno') : t('cursos.count.muchos')}`}{q && <> {t('cursos.count.para')} <b>“{q}”</b></>} · <button className="link-btn" onClick={() => { setQ(''); setArea('Todos'); setMod('Todos') }}>{t('cursos.count.limpiar')}</button>{error ? t('cursos.count.err') : ''}</div>

        <div className="cu-list">
          {list.map((c, k) => <CursoCard key={c.slug || c.id || `${c.n}-${k}`} c={c} i={k} onSelect={setSel} icons={cms.icons} />)}
        </div>
        {list.length === 0 && (
          <div className="cu-empty rv">
            <span>{iEmpty}</span><h3 style={fmtCssKey(cms, 'cur.empty.t')}>{L(empty, 't', 'cursos.empty.t')}</h3>
            <p style={fmtCssKey(cms, 'cur.empty.p')}>{fill(L(empty, 'p', 'cursos.empty.p'), { q })}</p>
            <button className="btn btn-blue" onClick={() => { setQ(''); setArea('Todos'); setMod('Todos') }}>{L(empty, 'btn', 'cursos.empty.btn')}</button>
          </div>
        )}

        <div className="cu-cta rv">
          <div><h3 style={fmtCssKey(cms, 'cur.cta.t')}>{L(cta, 't', 'cursos.cta.t')}</h3><p><span style={fmtCssKey(cms, 'cur.cta.p1')}>{L(cta, 'p1', 'cursos.cta.p1')}</span> <b>Juan</b> → <b>Romanos</b> → <b>Teología I</b>. <span style={fmtCssKey(cms, 'cur.cta.p2')}>{L(cta, 'p2', 'cursos.cta.p2')}</span></p></div>
          <Link className="btn btn-blue" to="/contacto">{L(cta, 'btn', 'cursos.cta.btn')}</Link>
        </div>
      </div>

      <CursoDrawer curso={sel} onClose={() => setSel(null)} icons={cms.icons} />
    </div>
  )
}

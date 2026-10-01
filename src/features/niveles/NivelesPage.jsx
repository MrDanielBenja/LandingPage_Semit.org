import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../../shared/hooks/useReveal'
import { useLang } from '../../app/providers/LangProvider'
import { useContent } from '../../core/cms/contentStore'
import { resolveAsset } from '../../core/cms/assets'
import { fmtCssKey } from '../../core/cms/fmt'
import { DEFAULT_NIVELES } from '../../core/cms/defaultNiveles'
import { subIntroKey, subIntroOf } from '../../core/cms/nivelesIntro'
import { asArr } from '../../core/cms/safe'
import { NIVEL_MODS } from './data/niveles.data'
import { NivelCard } from './components/NivelCard'
import { NivelDrawer } from './components/NivelModal'

export function NivelesPage({ preview }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('niveles', DEFAULT_NIVELES)
  const cms = preview || saved
  const h = cms.hero || DEFAULT_NIVELES.hero
  const it = cms.intro || DEFAULT_NIVELES.intro
  const Lh = (k) => (lang === 'en' ? h[`${k}_en`] : h[`${k}_es`]) || t(`niveles.hero.${k}`)
  const Li = (k) => (lang === 'en' ? it[`${k}_en`] : it[`${k}_es`]) || t(`niveles.intro.${k}`)
  const ramp = asArr(cms.ramas, DEFAULT_NIVELES.ramas).map(r => ({ ...r, label: lang === 'en' ? (r.label_en || r.label_es) : (r.label_es || r.label_en), d: lang === 'en' ? (r.d_en || r.d_es) : (r.d_es || r.d_en), img: resolveAsset(r.img) }))
  const subMap = (arr) => asArr(arr, []).map(s => ({ ...s, label: lang === 'en' ? (s.label_en || s.label_es) : (s.label_es || s.label_en), d: lang === 'en' ? (s.d_en || s.d_es) : (s.d_es || s.d_en), img: resolveAsset(s.img) }))
  void 0
  const subsSrc = (cms.subs && typeof cms.subs === 'object') ? cms.subs : DEFAULT_NIVELES.subs
  const SUBS_L = { pre: subMap(subsSrc.pre), post: subMap(subsSrc.post) }
  const RAMAS_L = ramp
  const MAESTRIAS_L = asArr(cms.maestrias, DEFAULT_NIVELES.maestrias).map(m => ({ ...m, label: lang === 'en' ? (m.label_en || m.label_es) : (m.label_es || m.label_en), d: lang === 'en' ? (m.d_en || m.d_es) : (m.d_es || m.d_en), img: resolveAsset(m.img) }))
  const RUTA_L = asArr(cms.ruta, DEFAULT_NIVELES.ruta).map(r => ({ ...r, t: lang === 'en' ? (r.t_en || r.t_es) : (r.t_es || r.t_en), img: resolveAsset(r.img) }))
  const PROGS = asArr(cms.programas, DEFAULT_NIVELES.programas).map(p => ({
    ...p,
    d: lang === 'en' ? (p.d_en ?? p.d_es ?? p.d) : (p.d_es ?? p.d_en ?? p.d),
    dur: lang === 'en' ? (p.dur_en ?? p.dur_es ?? p.dur) : (p.dur_es ?? p.dur_en ?? p.dur),
    tag: lang === 'en' ? (p.tag_en ?? p.tag_es ?? p.tag) : (p.tag_es ?? p.tag_en ?? p.tag),
    incluye: lang === 'en' ? (p.incluye_en || p.incluye_es || p.incluye || []) : (p.incluye_es || p.incluye_en || p.incluye || []),
    img: resolveAsset(p.img),
  }))
  const SORTS = t('niveles.sorts')
  const MODS_DISP = t('niveles.mods')
  const MODS_KEYS = NIVEL_MODS
  const MAE_OPTS = [{ id: 'Todos', label: t('niveles.ambas') }, ...MAESTRIAS_L]
  const [rama, setRama] = useState('pre')
  const [sub, setSub] = useState('certificado')
  const [mae, setMae] = useState('Todos')
  const [q, setQ] = useState('')
  const [mod, setMod] = useState('Todos')
  const [sort, setSort] = useState('pop')
  const [sel, setSel] = useState(null)
  useReveal('/niveles')

  const pickRama = (id) => { setRama(id); setSub(SUBS_L[id][0].id); setMae('Todos') }
  const subs = SUBS_L[rama]
  const subInfo = subs.find(s => s.id === sub)

  const list = useMemo(() => {
    let r = PROGS.filter(c =>
      c.rama === rama &&
      c.sub === sub &&
      (sub !== 'maestria' || mae === 'Todos' || c.mae === mae) &&
      (mod === 'Todos' || c.mod === mod) &&
      (c.n + c.a + c.d).toLowerCase().includes(q.toLowerCase()))
    if (sort === 'pop') r = [...r].sort((a, b) => b.est - a.est)
    if (sort === 'rating') r = [...r].sort((a, b) => b.rating - a.rating)
    if (sort === 'precio') r = [...r].sort((a, b) => a.p - b.p)
    return r
  }, [PROGS, rama, sub, mae, mod, q, sort])

  const pill = String(Lh('pill') || '').replaceAll('{n}', String(PROGS.length))
  const maeTodosImg = (PROGS.find(p => p.sub === 'maestria') || {}).img
  const nextStep = RUTA_L[Math.min(Math.max(RUTA_L.findIndex(x => x.id === sub), 0) + 1, RUTA_L.length - 1)]

  // Intro del sub seleccionado (certificado/diplomado/... + artes/divinidades cuando aplica).
  // Fuente: CMS (subs[].intro_* / maestrias[].intro_*) con fallback al diccionario ES/EN.
  const subKey = subIntroKey(sub, mae)
  const SUB_INTRO = subIntroOf({
    subs: [...(SUBS_L.pre || []), ...(SUBS_L.post || [])],
    maestrias: MAESTRIAS_L || [],
    dict: t('niveles.subIntro'),
    lang,
  }, subKey)

  return (
    <div className="pg pg-cursos">
      <div className="nos-hero mid rv" style={h.bg ? { background: h.bg } : undefined}>
        <img className="nos-hero-bg" src={resolveAsset(h.img)} alt="Niveles SEMIT" loading="lazy" />
        <div className="nos-hero-veil" />
        <div className="container nos-hero-in">
          <span className="pill pill-glass" style={fmtCssKey(cms, 'niv.hero.pill')}>{pill}</span>
          <h1 style={fmtCssKey(cms, 'niv.hero.h1')}>{Lh('h1a')}<br />{Lh('h1b')}</h1>
        </div>
      </div>

      <div className="container sec nos-body" style={it.bg ? { background: it.bg } : undefined}>
        <div className="nv-intro rv">
          <p className="nv-hero-sub" style={fmtCssKey(cms, 'niv.intro.sub')}>{Li('sub')}</p>
          <p className="nv-hero-txt" style={fmtCssKey(cms, 'niv.intro.txt')}>{Li('txt1')} <b>{Li('txt2')}</b></p>
        </div>
        <div className="nv-ramas rv">
          {RAMAS_L.map(r => {
            const n = PROGS.filter(c => c.rama === r.id).length
            return (
              <button key={r.id} className={`cat-card wide ${rama === r.id ? 'on' : ''}`} onClick={() => pickRama(r.id)}>
                <span className="cat-media"><img src={r.img} alt={r.label} loading="lazy" /><span className="cat-emo">{r.e}</span><span className="cat-count">{n}</span></span>
                <span className="cat-body"><b style={fmtCssKey(cms, 'niv.ramas.label')}>{r.label}</b><small style={fmtCssKey(cms, 'niv.ramas.d')}>{r.d}</small></span>
              </button>
            )
          })}
        </div>

        <div key={rama} className="nv-subs rv">
          {subs.map(s => {
            const n = PROGS.filter(c => c.rama === rama && c.sub === s.id).length
            return (
              <button key={s.id} className={`cat-card ${sub === s.id ? 'on' : ''}`} onClick={() => { setSub(s.id); setMae('Todos') }}>
                <span className="cat-media"><img src={s.img} alt={s.label} loading="lazy" /><span className="cat-emo">{s.e}</span><span className="cat-count">{n}</span></span>
                <span className="cat-body"><b style={fmtCssKey(cms, 'niv.subs.label')}>{s.label}</b><small style={fmtCssKey(cms, 'niv.subs.d')}>{s.d}</small></span>
              </button>
            )
          })}
        </div>

        {sub === 'maestria' && (
          <div className="nv-mae rv">
            {MAE_OPTS.map(m => (
              <button key={m.id} className={`cat-card ${mae === m.id ? 'on' : ''}`} onClick={() => setMae(m.id)}>
                <span className="cat-media"><img src={m.id === 'Todos' ? maeTodosImg : (MAESTRIAS_L.find(x => x.id === m.id) || {}).img} alt={m.label} loading="lazy" /><span className="cat-emo">{m.id === 'Todos' ? '🎓' : m.e}</span></span>
                <span className="cat-body"><b style={fmtCssKey(cms, 'niv.maestrias.label')}>{m.id === 'Todos' ? t('niveles.verAmbas') : t('niveles.maestriaEn', { l: m.label })}</b><small style={fmtCssKey(cms, 'niv.maestrias.d')}>{m.id === 'Todos' ? t('niveles.artesDiv') : m.d}</small></span>
              </button>
            ))}
          </div>
        )}

        {(SUB_INTRO.t || SUB_INTRO.d) && (
          <div className="nv-subintro rv" key={subKey + lang} style={fmtCssKey(cms, 'niv.subIntro.box')}>
            {SUB_INTRO.t && <h3 style={fmtCssKey(cms, 'niv.subIntro.t')}>{SUB_INTRO.t}</h3>}
            {SUB_INTRO.d && <p style={fmtCssKey(cms, 'niv.subIntro.d')}>{SUB_INTRO.d}</p>}
          </div>
        )}

        <div className="cu-toolbar cu-toolbar-lg rv">
          <div className="cu-search nv-search">
            <span>🔍</span>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('niveles.ph', { s: (subInfo.label || '').toLowerCase() })} />
            {q && <button onClick={() => setQ('')}>✕</button>}
          </div>
          <div className="cu-fgroup"><span>{t('niveles.toolbar.mod')}</span><div>{MODS_KEYS.map((m, k) => <button key={m} className={mod === m ? 'on' : ''} onClick={() => setMod(m)}>{MODS_DISP[k]}</button>)}</div></div>
          <div className="cu-fgroup"><span>{t('niveles.toolbar.ord')}</span><div>{SORTS.map(s => <button key={s.id} className={sort === s.id ? 'on' : ''} onClick={() => setSort(s.id)}>{s.label}</button>)}</div></div>
        </div>

        <div className="cu-count rv">{list.length} {list.length === 1 ? t('niveles.count.uno') : t('niveles.count.muchos')}{q && <> {t('niveles.count.para')} <b>“{q}”</b></>} · <button className="link-btn" onClick={() => { setQ(''); setMod('Todos') }}>{t('niveles.count.limpiar')}</button></div>

        <div className="cu-list" key={rama + sub + mae}>
          {list.map((c, k) => <NivelCard key={`${c.n}-${k}`} c={c} i={k} onSelect={setSel} cms={cms} preview={preview} />)}
        </div>
        {list.length === 0 && (
          <div className="cu-empty rv">
            <span>🔍</span><h3>{t('niveles.empty.t')}</h3>
            <p>{t('niveles.empty.p', { q })}</p>
            <button className="btn btn-blue" onClick={() => { setQ(''); setMod('Todos') }}>{t('niveles.empty.btn')}</button>
          </div>
        )}

        <div className="cu-cta rv">
          <div><h3>{t('niveles.cta.t')}</h3><p>{t('niveles.cta.p1')} <b>{subInfo.label}</b>. {t('niveles.cta.p2')} <b>{nextStep.t}</b>. {t('niveles.cta.p3')}</p></div>
          <Link className="btn btn-blue" to="/contacto">{t('niveles.cta.btn')}</Link>
        </div>
      </div>

      <NivelDrawer nivel={sel} onClose={() => setSel(null)} cms={cms} preview={preview} />
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NIVELES, RUTA } from '../../niveles/data/niveles.data'
import { useLang } from '../../../app/providers/LangProvider'
import { useContent } from '../../../core/cms/contentStore'
import { DEFAULT_INICIO } from '../../../core/cms/defaultInicio'
import { DEFAULT_NIVELES } from '../../../core/cms/defaultNiveles'
import { asArr } from '../../../core/cms/safe'
import { resolveAsset } from '../../../core/cms/assets'
import { fmtCssKey } from '../../../core/cms/fmt'
import { imgStyleOf } from '../../../core/cms/imgEdit'

const META_ES = {
  certificado: { rama: 'Pregrado', dur: '6 meses' },
  diplomado: { rama: 'Pregrado', dur: '1 año' },
  bachillerato: { rama: 'Pregrado', dur: '3 años' },
  licenciatura: { rama: 'Postgrado', dur: '1 año' },
  maestria: { rama: 'Postgrado', dur: '2 años' },
}
const META_EN = {
  certificado: { rama: 'Undergraduate', dur: '6 months' },
  diplomado: { rama: 'Undergraduate', dur: '1 year' },
  bachillerato: { rama: 'Undergraduate', dur: '3 years' },
  licenciatura: { rama: 'Graduate', dur: '1 year' },
  maestria: { rama: 'Graduate', dur: '2 years' },
}

export function RutaNiveles({ preview, previewNiveles }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('inicio', DEFAULT_INICIO)
  const cms = preview || saved
  const rt = cms.ruta || DEFAULT_INICIO.ruta
  const L = (k) => (lang === 'en' ? rt[`${k}_en`] : rt[`${k}_es`]) || t(`home.ruta.${k}`)
  const META = lang === 'en' ? META_EN : META_ES
  const { data: nivSaved } = useContent('niveles', DEFAULT_NIVELES)
  const niv = previewNiveles || nivSaved || DEFAULT_NIVELES
  const SUBS_ALL = [...asArr(niv.subs?.pre, []), ...asArr(niv.subs?.post, [])]
  const SUB_MAP = Object.fromEntries(SUBS_ALL.map(s => [s.id, s]))
  const RUTA_RAW = asArr(niv.ruta, DEFAULT_NIVELES.ruta)
  const RUTA_ORDER = (RUTA_RAW.length ? RUTA_RAW : RUTA).map(r => r.id)
  const RUTA_L = RUTA_ORDER.map(id => {
    const r = RUTA_RAW.find(x => x.id === id) || {}
    const s = SUB_MAP[id] || {}
    return {
      id,
      e: s.e || r.e || '',
      t: lang === 'en' ? (s.label_en || s.label_es || r.t_en || r.t_es) : (s.label_es || s.label_en || r.t_es || r.t_en),
      img: resolveAsset(s.img || r.img),
      imgCfg: s.imgCfg || r.imgCfg,
    }
  })
  const RAMAS_L = asArr(niv.ramas, DEFAULT_NIVELES.ramas).map(r => ({
    ...r, label: lang === 'en' ? (r.label_en || r.label_es) : (r.label_es || r.label_en),
  }))
  const ramaOf = (id) => {
    const preIds = asArr(niv.subs?.pre, []).map(s => s.id)
    const ramaId = preIds.includes(id) ? 'pre' : 'post'
    return (RAMAS_L.find(r => r.id === ramaId) || {}).label || META[id]?.rama || ''
  }
  const subDOf = (id) => {
    const s = SUBS_ALL.find(x => x.id === id)
    const d = lang === 'en' ? (s?.d_en || s?.d_es) : (s?.d_es || s?.d_en)
    return d || `${META[id]?.rama || ''} · ${META[id]?.dur || ''}`
  }
  const PROGS_ALL = asArr(niv.programas, DEFAULT_NIVELES.programas).map(p => ({
    ...p,
    dur: lang === 'en' ? (p.dur_en ?? p.dur_es ?? p.dur) : (p.dur_es ?? p.dur_en ?? p.dur),
    img: resolveAsset(p.img),
  }))
  const [paso, setPaso] = useState('certificado')
  const progs = (PROGS_ALL.length ? PROGS_ALL : NIVELES).filter(p => p.sub === paso)
  const steps = RUTA_L.length ? RUTA_L : RUTA
  const idx = Math.max(0, steps.findIndex(r => r.id === paso))
  return (
    <div className="rv" style={rt.bg ? { background: rt.bg } : undefined}>
      <div className="hsec"><span className="pill" style={fmtCssKey(cms, 'ruta.pill')}>{L('pill')}</span><h2 style={fmtCssKey(cms, 'ruta.h2')}>{L('h2')}</h2>
        <p style={fmtCssKey(cms, 'ruta.sub')}>{L('sub')}</p></div>
      <div className="rt-cards">
        {steps.map((s, k) => (
          <button key={s.id} className={`cat-card ${paso === s.id ? 'on' : ''} ${idx > k ? 'done' : ''}`} onClick={() => setPaso(s.id)}>
            <span className="cat-media"><img src={s.img} alt={s.t} loading="lazy" style={imgStyleOf(s)} /><span className="cat-emo">{s.e}</span><span className="cat-count">0{k + 1}</span></span>
            <span className="cat-body"><b>{s.t}</b><small>{ramaOf(s.id)} · {subDOf(s.id)}</small></span>
          </button>
        ))}
      </div>
      <div key={paso} className="rt-panel">
        <div className="rt-panel-head">
          <div><span className="k">{ramaOf(paso)} · {t('home.ruta.paso')} {idx + 1} {t('home.ruta.de')} {steps.length}</span><h3>{steps[idx]?.t}</h3></div>
          <Link className="btn btn-dark" to="/niveles">{t('home.ruta.ver')}</Link>
        </div>
        <div className="rt-progs">{progs.length ? progs.map((p, k) => (
          <div key={`${p.n || 'prog'}-${k}`} className="rt-prog">
            <span className="rt-thumb"><img src={p.img} alt={p.n} loading="lazy" style={imgStyleOf(p)} /></span>
            <div><b>{p.n}</b><small>{lang === 'en' ? ({ Todos: 'All', Virtual: 'Online', Híbrido: 'Hybrid', Presencial: 'On-site' }[p.mod] || p.mod) : p.mod} · {p.dur}</small></div>
            <strong>S/.{p.p ?? ''}</strong>
          </div>)) : <p className="adm-note">Sin paquetes en este paso — créalos en Niveles › Programas con este Sub.</p>}</div>
      </div>
    </div>
  )
}

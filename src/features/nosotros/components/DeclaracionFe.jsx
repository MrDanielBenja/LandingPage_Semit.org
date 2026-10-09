import { useState } from 'react'
import { asArr } from '../../../core/cms/safe'
import { useLang } from '../../../app/providers/LangProvider'
import { useContent } from '../../../core/cms/contentStore'
import { fmtCssKey } from '../../../core/cms/fmt'
import { DEFAULT_NOSOTROS } from '../../../core/cms/defaultNosotros'
import { iconOf } from '../../../core/cms/icons'

const FILTROS_ES = ['Todas', 'Dios', 'Cristo', 'Espíritu', 'Iglesia']
const FILTROS_EN = ['All', 'God', 'Christ', 'Spirit', 'Church']

function grupo(t, lang) {
  if (lang === 'en') {
    if (/Triune|Scriptures|Mankind|Destiny/i.test(t)) return 'God'
    if (/Jesus Christ|Second Coming/i.test(t)) return 'Christ'
    if (/Spirit|Healing/i.test(t)) return 'Spirit'
    return 'Church'
  }
  if (/Dios Trino|Escrituras|Hombre|Destino/i.test(t)) return 'Dios'
  if (/Jesucristo|Segunda Venida/i.test(t)) return 'Cristo'
  if (/Espíritu|Sanidad/i.test(t)) return 'Espíritu'
  return 'Iglesia'
}

export function DeclaracionFe({ preview }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('nosotros', DEFAULT_NOSOTROS)
  const cms = preview || saved
  const o = cms.fe || DEFAULT_NOSOTROS.fe
  const L = (k) => (lang === 'en' ? o[`${k}_en`] : o[`${k}_es`]) || t(`nosotros.fe.${k}`)
  const DATA = asArr(o.items, []).map(x => ({ ...x, t: lang === 'en' ? x.t_en : x.t_es, d: lang === 'en' ? x.d_en : x.d_es }))
  const FILTROS = lang === 'en' ? FILTROS_EN : FILTROS_ES
  const ALL = FILTROS[0]
  const [fe, setFe] = useState(0)
  const [f, setF] = useState(ALL)
  const [q, setQ] = useState('')
  const list = DATA
    .map((x, k) => ({ ...x, k, g: grupo(x.t, lang) }))
    .filter(x => (f === ALL || x.g === f) && (x.t + x.d).toLowerCase().includes(q.toLowerCase()))
  const open = list.findIndex(x => x.k === fe)
  const iSearch = iconOf(cms, 'search', '🔍')
  return (
    <section className="rv fe-sec" style={o.bg ? { background: o.bg } : undefined}>
      <div className="hsec"><span className="pill">{L('pill')} · {DATA.length}</span><h2 style={fmtCssKey(cms, 'fe.h2')}>{L('h2')}</h2>
        <p style={fmtCssKey(cms, 'fe.p')}>{L('sub')}</p></div>
      <div className="fe-tools">
        <div className="cu-search fe-search"><span>{iSearch}</span><input value={q} onChange={e => setQ(e.target.value)} placeholder={t('nosotros.fe.ph')} />{q && <button onClick={() => setQ('')}>✕</button>}</div>
        <div className="fe-chips">{FILTROS.map(x => <button key={x} className={f === x ? 'on' : ''} onClick={() => { setF(x); setFe(-1) }}>{x}</button>)}</div>
      </div>
      <div className="fe-timeline">
        {list.map((x, idx) => (
          <div key={x.k} className={`fe-node ${x.k === fe ? 'open' : ''}`}>
            <button className="fe-dot-btn" onClick={() => setFe(x.k === fe ? -1 : x.k)} aria-label={x.t}>
              <span className="fe-dot">{x.k === fe ? '−' : '+'}</span>
            </button>
            <button className="fe-card" onClick={() => setFe(x.k === fe ? -1 : x.k)}>
              <small>{x.g} · {String(x.k + 1).padStart(2, '0')}</small>
              <b>{x.t}</b>
              {x.k === fe && <p>{x.d}</p>}
            </button>
            {idx < list.length - 1 && <span className="fe-line" />}
          </div>
        ))}
      </div>
      {list.length === 0 && <p className="cu-count">{t('nosotros.fe.empty', { q })} <button className="link-btn" onClick={() => { setQ(''); setF(ALL) }}>{t('nosotros.fe.clear')}</button></p>}
      {open >= 0 && <p className="cu-count">{t('nosotros.fe.reading', { a: open + 1, b: list.length })}</p>}
    </section>
  )
}

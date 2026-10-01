import { useEffect, useState } from 'react'
import { asArr } from '../../../core/cms/safe'
import { useLang } from '../../../app/providers/LangProvider'
import { useContent } from '../../../core/cms/contentStore'
import { resolveAsset } from '../../../core/cms/assets'
import { fmtCssKey } from '../../../core/cms/fmt'
import { DEFAULT_NOSOTROS } from '../../../core/cms/defaultNosotros'

export function Funciones({ preview, forceIndex }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('nosotros', DEFAULT_NOSOTROS)
  const cms = preview || saved
  const o = cms.funcs || DEFAULT_NOSOTROS.funcs
  const L = (k) => (lang === 'en' ? o[`${k}_en`] : o[`${k}_es`]) || t(`nosotros.funcs.${k}`)
  const DATA = asArr(o.items, []).map(f => ({ ...f, t: lang === 'en' ? f.t_en : f.t_es, d: lang === 'en' ? f.d_en : f.d_es, img: resolveAsset(f.img) }))
  const [ft, setFt] = useState(0)
  const [pause, setPause] = useState(!!preview)
  const prev = () => setFt(f => (f - 1 + DATA.length) % DATA.length)
  const next = () => setFt(f => (f + 1) % DATA.length)
  useEffect(() => {
    if (forceIndex !== undefined) { setFt(forceIndex); return }
    if (pause || preview) return
    const tm = setInterval(() => setFt(f => (f + 1) % DATA.length), 5000)
    return () => clearInterval(tm)
  }, [pause, preview, DATA.length, forceIndex])
  const cur = DATA[Math.min(ft, DATA.length - 1)]
  if (!cur) return null
  return (
    <section className="rv func-sec" style={o.bg ? { background: o.bg } : undefined} onMouseEnter={() => setPause(true)} onMouseLeave={() => setPause(false)}>
      <div className="hsec"><span className="pill">{L('pill')}</span><h2 style={fmtCssKey(cms, 'funcs.h2')}>{L('h2')}</h2>
        <p style={fmtCssKey(cms, 'funcs.p')}>{L('sub')}</p></div>
      <div className="func-rail">
        {DATA.map((f, k) => (
          <button key={f.t} className={`func-chip ${k === ft ? 'on' : ''}`} onClick={() => setFt(k)}>
            <img src={f.img} alt="" loading="lazy" /><span>{f.e}</span><b>{f.t}</b>
          </button>
        ))}
      </div>
      <div className="func-stage" key={ft}>
        <button className="func-arrow" aria-label={t('nosotros.funcs.prev')} onClick={prev}>‹</button>
        <div className="func-main">
          <div className="func-media"><img src={cur.img} alt={cur.t} loading="lazy" /><span className="func-big-e">{cur.e}</span></div>
          <div className="func-txt">
            <span className="func-count">{String(ft + 1).padStart(2, '0')} / {String(DATA.length).padStart(2, '0')}</span>
            <h3>{cur.t}</h3>
            <p>{cur.d}</p>
            <div className="dots">{DATA.map((_, k) => <button key={k} aria-label={'func ' + k} className={`dot ${k === ft ? 'on' : ''}`} onClick={() => setFt(k)} />)}</div>
          </div>
        </div>
        <button className="func-arrow" aria-label={t('nosotros.funcs.next')} onClick={next}>›</button>
      </div>
    </section>
  )
}

import { useEffect, useState } from 'react'
import { asArr } from '../../../core/cms/safe'
import { useLang } from '../../../app/providers/LangProvider'
import { useContent } from '../../../core/cms/contentStore'
import { resolveAsset } from '../../../core/cms/assets'
import { DEFAULT_INICIO } from '../../../core/cms/defaultInicio'
import { fmtCss } from '../../../core/cms/fmt'

export function Testimonios({ preview, forceIndex }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('inicio', DEFAULT_INICIO)
  const cms = preview || saved
  const raw = (Array.isArray(cms.testimonios) && cms.testimonios.length ? cms.testimonios : DEFAULT_INICIO.testimonios)
  const DATA = raw.map(x => ({ ...x, t: lang === 'en' ? x.t_en : x.t_es, img: resolveAsset(x.img) }))
  const sections = cms.sections || DEFAULT_INICIO.sections
  const [ti, setTi] = useState(0)
  const n = DATA.length
  useEffect(() => { if (forceIndex !== undefined) { setTi(forceIndex); return } const tm = setInterval(() => setTi(v => (v + 1) % n), 6000); return () => clearInterval(tm) }, [n, forceIndex])
  const cur = DATA[Math.min(ti, DATA.length - 1)] || DATA[0]
  return (
    <div className="rv" style={sections.testiBg ? { background: sections.testiBg } : undefined}>
      <div className="hsec"><span className="pill">{t('home.testi.pill')}</span><h2>{t('home.testi.h2')}</h2></div>
      <div className="t-carousel">
        <button onClick={() => setTi((ti - 1 + n) % n)} aria-label={t('home.testi.prev')}>‹</button>
        <div className="t-big t-user" key={cur.id || ti} style={cur.bg ? { background: cur.bg } : undefined}><img src={cur.img} alt={cur.n} loading="lazy" style={{ width: cur.size, height: cur.size }} /><div><p style={{ ...(cur.textColor ? { color: cur.textColor } : null), ...fmtCss(cur.ft) }}>“{cur.t}”</p><b style={fmtCss(cur.fn)}>{cur.n}</b></div></div>
        <button onClick={() => setTi((ti + 1) % n)} aria-label={t('home.testi.next')}>›</button>
      </div>
      <div className="dots">{DATA.map((_, k) => <button key={k} aria-label={'testimonio ' + k} className={`dot ${k === ti ? 'on' : ''}`} onClick={() => setTi(k)} />)}</div>
    </div>
  )
}

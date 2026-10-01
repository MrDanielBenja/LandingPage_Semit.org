import { Link } from 'react-router-dom'
import { asArr } from '../../../core/cms/safe'
import { useLang } from '../../../app/providers/LangProvider'
import { useContent } from '../../../core/cms/contentStore'
import { resolveAsset } from '../../../core/cms/assets'
import { fmtCssKey } from '../../../core/cms/fmt'
import { DEFAULT_NOSOTROS } from '../../../core/cms/defaultNosotros'

export function QuienesSomos({ preview }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('nosotros', DEFAULT_NOSOTROS)
  const cms = preview || saved
  const o = cms.quienes || DEFAULT_NOSOTROS.quienes
  const L = (k) => (lang === 'en' ? o[`${k}_en`] : o[`${k}_es`]) || t(`nosotros.quienes.${k}`)
  const PILARES = asArr(o.pilares, []).map(p => ({ ...p, t: lang === 'en' ? p.t_en : p.t_es, d: lang === 'en' ? p.d_en : p.d_es, img: resolveAsset(p.img) }))
  return (
    <section className="rv" style={o.bg ? { background: o.bg } : undefined}>
      <div className="hsec"><span className="pill">{L('pill')}</span><h2 style={fmtCssKey(cms, 'quienes.h2')}>{L('h2')}</h2>
        <p style={fmtCssKey(cms, 'quienes.p')}><b>SEMIT</b> {L('p1')}</p></div>
      <div className="pilar-grid">
        {PILARES.map((p, k) => (
          <div key={p.t} className="pilar-card" style={{ animationDelay: `${k * 90}ms` }}>
            <div className="pilar-media"><img src={p.img} alt={p.t} loading="lazy" /><span className="pilar-e">{p.e}</span></div>
            <div className="pilar-body">
              <b>{String(k + 1).padStart(2, '0')} · {p.t}</b>
              <p>{p.d}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="dedica rv">
        <img src={resolveAsset(o.dedicaImg)} alt="Cusco SEMIT" loading="lazy" />
        <div><span className="k">{L('dedica')}</span><p>{L('dedicap')}</p>
          <Link className="btn btn-blue" to="/contacto" style={{ marginTop: 12 }}>{L('cta')}</Link></div>
      </div>
    </section>
  )
}

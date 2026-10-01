import { useLang } from '../../../app/providers/LangProvider'
import { useContent } from '../../../core/cms/contentStore'
import { fmtCssKey } from '../../../core/cms/fmt'
import { DEFAULT_CONTACTO } from '../../../core/cms/defaultContacto'

export function CanalesTabs({ canal, onCanal, preview }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('contacto', DEFAULT_CONTACTO)
  const cms = preview || saved
  const asArr = (v, fb) => (Array.isArray(v) ? v : Array.isArray(fb) ? fb : [])
  const L = asArr(cms.canales, DEFAULT_CONTACTO.canales).map(c => ({
    ...c, label: lang === 'en' ? c.label_en : c.label_es, desc: lang === 'en' ? c.desc_en : c.desc_es,
  }))
  const HOR = asArr(cms.horario, DEFAULT_CONTACTO.horario).map(x => ({
    d: lang === 'en' ? x.d_en : x.d_es, h: x.h,
  }))
  return (
    <div className="canal-rail">
      {L.map((c, k) => (
        <button key={c.id} className={`canal-btn ${canal === c.id ? 'on' : ''}`} onClick={() => onCanal(c.id)}>
          <span className="canal-num">0{k + 1}</span>
          <span className="canal-ico">{c.icon}</span>
          <span className="canal-txt"><b style={fmtCssKey(cms, 'ct.canales.label')}>{c.label}</b><small style={fmtCssKey(cms, 'ct.canales.desc')}>{c.desc}</small></span>
          <span className="canal-arrow">→</span>
        </button>
      ))}
      <div className="rail-note">
        <b>{t('contacto.canales.hor')}</b>
        {(HOR.slice(0, 2) || []).map((x, k) => (
          <span key={k}><span style={fmtCssKey(cms, 'ct.horario.d')}>{x.d}</span>{' · '}<span style={fmtCssKey(cms, 'ct.horario.h')}>{x.h}</span></span>
        ))}
      </div>
    </div>
  )
}

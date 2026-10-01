import { useState } from 'react'
import { asArr } from '../../../core/cms/safe'
import { useLang } from '../../../app/providers/LangProvider'
import { useContent } from '../../../core/cms/contentStore'
import { fmtCssKey } from '../../../core/cms/fmt'
import { DEFAULT_CONTACTO } from '../../../core/cms/defaultContacto'

export function FaqContacto({ preview }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('contacto', DEFAULT_CONTACTO)
  const cms = preview || saved
  const L = asArr(cms.faqs, DEFAULT_CONTACTO.faqs).map(x => (lang === 'en' ? [x.q_en, x.a_en] : [x.q_es, x.a_es]))
  const [fq, setFq] = useState(-1)
  return (
    <div className="faq-wide rv">
      <h3>{t('contacto.faq.t')}</h3>
      <div className="faq-grid">
        {L.map((x, k) => (
          <div key={k} className={`fmini big ${fq === k ? 'open' : ''}`}>
            <button onClick={() => setFq(fq === k ? -1 : k)}><span style={fmtCssKey(cms, 'ct.faq.q')}>{x[0]}</span><span className="plus">{fq === k ? '−' : '+'}</span></button>
            {fq === k && <p style={fmtCssKey(cms, 'ct.faq.a')}>{x[1]}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

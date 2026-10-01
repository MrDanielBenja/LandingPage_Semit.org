import { useState } from 'react'
import { SITE } from '../../../shared/config/site'
import { waLink, openWa } from '../../../core/services/whatsapp'
import { useLang } from '../../../app/providers/LangProvider'
import { useContent } from '../../../core/cms/contentStore'
import { resolveAsset } from '../../../core/cms/assets'
import { fmtCssKey } from '../../../core/cms/fmt'
import { DEFAULT_CONTACTO } from '../../../core/cms/defaultContacto'
import { DEFAULT_SITE } from '../../../core/cms/defaultSite'

const tpl = (s, vars) => {
  let r = String(s || '')
  if (vars) for (const k of Object.keys(vars)) r = r.replaceAll(`{${k}}`, vars[k])
  return r
}

export function PanelFormulario({ preview }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('contacto', DEFAULT_CONTACTO)
  const cms = preview || saved
  const F = cms.form || DEFAULT_CONTACTO.form
  const T = (k) => (lang === 'en' ? F[`${k}_en`] : F[`${k}_es`]) || t(`contacto.form.${k}`)
  const asArr = (v, fb) => (Array.isArray(v) ? v : Array.isArray(fb) ? fb : [])
  const AS = asArr(cms.asuntos, DEFAULT_CONTACTO.asuntos).map(a => ({
    ...a, label: lang === 'en' ? a.label_en : a.label_es, desc: lang === 'en' ? a.desc_en : a.desc_es,
  }))
  const steps = asArr(lang === 'en' ? F.steps_en : F.steps_es, t('contacto.form.steps'))
  const { data: siteSaved } = useContent('site', DEFAULT_SITE)
  const s = (siteSaved && siteSaved.site) || DEFAULT_SITE.site
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ n: '', e: '', a: (AS[0] || {}).id, m: '' })
  const [ok, setOk] = useState(false)
  const asunto = AS.find(a => a.id === form.a) || AS[0] || {}
  const first = form.n.split(' ')[0] || T('hola')
  const vN = form.n.trim().length > 2
  const vE = form.e.includes('@') && form.e.includes('.')
  const vM = form.m.trim().length > 9
  const msg = tpl(T('msgTpl'), { n: form.n || '...', e: form.e || T('sinCorreo'), a: asunto.label, m: form.m })
  const send = e => {
    e?.preventDefault()
    if (!(vN && vE && vM)) return
    setOk(true)
    openWa(msg, s.wa)
  }
  if (ok) return (
    <div className="cx-card panel-pop">
      <div className="ok-box"><div className="ok-check">✓</div>
        <h3 style={fmtCssKey(cms, 'ct.form.t')}>{tpl(T('okT'), { n: first })}</h3>
        <p style={fmtCssKey(cms, 'ct.form.sub')}>{tpl(T('okP'), { a: asunto.label })}</p>
        <div className="chat-mock"><div className="bubble out">{msg}</div><div className="bubble-time">ahora ✓✓</div></div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
          <a className="btn btn-blue" target="_blank" rel="noreferrer" href={waLink(msg, s.wa)}>{T('reopen')}</a>
          <button type="button" className="btn btn-line" onClick={() => { setOk(false); setStep(0); setForm({ n: '', e: '', a: (AS[0] || {}).id, m: '' }) }}>{T('another')}</button>
        </div>
      </div>
    </div>
  )
  return (
    <div className="cx-card panel-pop">
      <div className="cx-steps">
        {steps.map((ss, k) => (
          <button key={ss} type="button" className={`cx-step ${step === k ? 'on' : ''} ${step > k ? 'done' : ''}`} onClick={() => k < step && setStep(k)}>
            <b>{step > k ? '✓' : `0${k + 1}`}</b><span>{ss}</span>
          </button>
        ))}
      </div>
      <div className="cx-bar"><i style={{ width: `${((step + 1) / 3) * 100}%` }} /></div>

      {step === 0 && (
        <div className="cx-body" key="s0">
          <h3 style={fmtCssKey(cms, 'ct.form.t')}>{T('s0t')}</h3><p className="cx-sub" style={fmtCssKey(cms, 'ct.form.sub')}>{T('s0s')}</p>
          <label className="cx-field"><span style={fmtCssKey(cms, 'ct.form.label')}>{T('nom')}</span><input value={form.n} onChange={e => setForm({ ...form, n: e.target.value })} placeholder={T('nomPh')} className={form.n && !vN ? 'bad' : ''} /></label>
          <label className="cx-field"><span style={fmtCssKey(cms, 'ct.form.label')}>{T('cor')}</span><input type="email" value={form.e} onChange={e => setForm({ ...form, e: e.target.value })} placeholder={T('corPh')} className={form.e && !vE ? 'bad' : ''} /></label>
          <button className="btn btn-blue cx-next" disabled={!(vN && vE)} onClick={() => setStep(1)}>{T('cont')}</button>
        </div>
      )}
      {step === 1 && (
        <div className="cx-body" key="s1">
          <h3 style={fmtCssKey(cms, 'ct.form.t')}>{lang === 'en' ? tpl(T('s1t'), { n: first }) : `${first}, ${T('s1t')}`}</h3><p className="cx-sub" style={fmtCssKey(cms, 'ct.form.sub')}>{T('s1s')}</p>
          <div className="asunto-grid">{AS.map(a => (
            <button key={a.id} type="button" className={`asunto-card ${form.a === a.id ? 'on' : ''}`} onClick={() => setForm({ ...form, a: a.id })}>
              <span className="asunto-ico">{a.icon}</span><b style={fmtCssKey(cms, 'ct.asuntos.label')}>{a.label}</b><small style={fmtCssKey(cms, 'ct.asuntos.desc')}>{a.desc}</small>
            </button>))}</div>
          <div className="cx-nav"><button className="btn btn-line" onClick={() => setStep(0)}>{T('back')}</button>
            <button className="btn btn-blue" onClick={() => setStep(2)}>{T('cont')}</button></div>
        </div>
      )}
      {step === 2 && (
        <form className="cx-body" key="s2" onSubmit={send}>
          <h3 style={fmtCssKey(cms, 'ct.form.t')}>{T('s2t')}</h3><p className="cx-sub" style={fmtCssKey(cms, 'ct.form.sub')}>{lang === 'en' ? 'Subject' : 'Asunto'}: <b>{asunto.icon} {asunto.label}</b> · <button type="button" className="link-btn" onClick={() => setStep(1)}>{T('cambiar')}</button></p>
          <label className="cx-field"><span style={fmtCssKey(cms, 'ct.form.label')}>{T('msg')} <small className="char-count">{form.m.length}/500</small></span>
            <textarea rows={4} maxLength={500} value={form.m} onChange={e => setForm({ ...form, m: e.target.value })} placeholder={T('msgPh')} /></label>
          <div className="chat-mock"><small>{T('prev')}</small><div className="bubble out">{vM || vN ? msg : T('prevEmpty')}</div></div>
          <div className="cx-nav"><button type="button" className="btn btn-line" onClick={() => setStep(1)}>{T('back')}</button>
            <button className="btn btn-blue" type="submit" disabled={!(vN && vE && vM)}>{T('send')}</button></div>
        </form>
      )}
    </div>
  )
}

export function PanelWhatsapp({ preview }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('contacto', DEFAULT_CONTACTO)
  const cms = preview || saved
  const asArr2 = (v, fb) => (Array.isArray(v) ? v : Array.isArray(fb) ? fb : [])
  const AS = asArr2(cms.asuntos, DEFAULT_CONTACTO.asuntos).map(a => ({
    ...a, label: lang === 'en' ? a.label_en : a.label_es, desc: lang === 'en' ? a.desc_en : a.desc_es,
  }))
  const { data: siteSaved } = useContent('site', DEFAULT_SITE)
  const s = (siteSaved && siteSaved.site) || DEFAULT_SITE.site
  const phone = s.phone || SITE.phone
  const [waN, setWaN] = useState('')
  const [waM, setWaM] = useState((AS[0] || {}).id)
  const asunto = AS.find(a => a.id === waM) || AS[0] || {}
  const waMsg = t('contacto.wa.tpl', { n: waN || '', a: asunto.label })
  return (
    <div className="cx-card panel-pop">
      <div className="wa-hero-mini">
        <span className="wa-pulse" /><div><h3>{t('contacto.wa.t')}</h3><p className="cx-sub">{t('contacto.wa.s')}</p></div>
        <strong className="big-num">{phone}</strong>
      </div>
      <label className="cx-field"><span>{t('contacto.wa.nom')}</span><input value={waN} onChange={e => setWaN(e.target.value)} placeholder={t('contacto.wa.nomPh')} /></label>
      <span className="cx-label">{t('contacto.wa.mot')}</span>
      <div className="asunto-grid">{AS.map(a => (
        <button key={a.id} type="button" className={`asunto-card ${waM === a.id ? 'on' : ''}`} onClick={() => setWaM(a.id)}>
          <span className="asunto-ico">{a.icon}</span><b style={fmtCssKey(cms, 'ct.asuntos.label')}>{a.label}</b><small style={fmtCssKey(cms, 'ct.asuntos.desc')}>{a.desc}</small>
        </button>))}</div>
      <div className="phone-mock">
        <div className="phone-bar"><i /><i /><i /></div>
        <div className="bubble in">{t('contacto.wa.hi')}</div>
        <div className="bubble out" key={waM + waN}>{t('contacto.wa.me', { n: waN || '...', a: asunto.label })}</div>
        <div className="typing"><i /><i /><i /></div>
      </div>
      <a className="btn btn-blue" style={{ width: '100%' }} target="_blank" rel="noreferrer" href={waLink(waMsg, s.wa)}>{t('contacto.wa.go')}</a>
      <div className="note" style={{ textAlign: 'center' }}>{t('contacto.wa.call')} <b>{phone}</b></div>
    </div>
  )
}

export function PanelSede({ preview }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('contacto', DEFAULT_CONTACTO)
  const cms = preview || saved
  const o = cms.sede || DEFAULT_CONTACTO.sede
  const L = (k) => (lang === 'en' ? o[`${k}_en`] : o[`${k}_es`]) || t(`contacto.sede.${k}`)
  const HOR = asArr(cms.horario, DEFAULT_CONTACTO.horario).map(x => ({ d: lang === 'en' ? x.d_en : x.d_es, h: x.h }))
  const { data: siteSaved } = useContent('site', DEFAULT_SITE)
  const s = (siteSaved && siteSaved.site) || DEFAULT_SITE.site
  const mapsQuery = s.mapsQuery || SITE.mapsQuery
  return (
    <div className="cx-card panel-pop">
      <div className="sede-hero">
        <img src={resolveAsset(o.img)} alt="Sede Cusco" loading="lazy" />
        <span className="sede-badge" style={fmtCssKey(cms, 'ct.sede.badge')}>{L('badge')}</span>
      </div>
      <h3 style={fmtCssKey(cms, 'ct.sede.t')}>{o.t || t('contacto.sede.t')}</h3><p className="cx-sub" style={fmtCssKey(cms, 'ct.sede.s')}>{L('s')}</p>
      <div className="sched-grid">{HOR.map((x, k) => <div key={k} className="sched"><b style={fmtCssKey(cms, 'ct.horario.d')}>{x.d}</b><span style={fmtCssKey(cms, 'ct.horario.h')}>{x.h}</span></div>)}</div>
      <ul className="chk"><li>{L('l1')}</li><li>{L('l2')}</li></ul>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <a className="btn btn-blue" style={{ flex: 1 }} target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}>{t('contacto.sede.maps')}</a>
        <a className="btn btn-line" target="_blank" rel="noreferrer" href={waLink(t('contacto.sede.waSede'), s.wa)}>{t('contacto.sede.como')}</a>
      </div>
    </div>
  )
}

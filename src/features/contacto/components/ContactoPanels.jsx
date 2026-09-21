import { useState } from 'react'
import { SITE } from '../../../shared/config/site'
import { LOCAL } from '../../../shared/lib/images'
import { waLink, openWa } from '../../../core/services/whatsapp'
import { ASUNTOS, HORARIO } from '../data/contacto.data'

export function PanelFormulario() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ n: '', e: '', a: ASUNTOS[0].id, m: '' })
  const [ok, setOk] = useState(false)
  const asunto = ASUNTOS.find(a => a.id === form.a) || ASUNTOS[0]
  const vN = form.n.trim().length > 2
  const vE = form.e.includes('@') && form.e.includes('.')
  const vM = form.m.trim().length > 9
  const msg = `Hola SEMIT, soy ${form.n || '...'}. (${form.e || 'sin correo'}). Asunto: ${asunto.label}. ${form.m}`
  const send = e => {
    e?.preventDefault()
    if (!(vN && vE && vM)) return
    setOk(true)
    openWa(msg)
  }
  if (ok) return (
    <div className="cx-card panel-pop">
      <div className="ok-box"><div className="ok-check">✓</div>
        <h3>¡Listo, {form.n.split(' ')[0]}!</h3>
        <p>Abrimos tu WhatsApp con el mensaje de <b>{asunto.label}</b>.</p>
        <div className="chat-mock"><div className="bubble out">{msg}</div><div className="bubble-time">ahora ✓✓</div></div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
          <a className="btn btn-blue" target="_blank" rel="noreferrer" href={waLink(msg)}>Abrir de nuevo →</a>
          <button type="button" className="btn btn-line" onClick={() => { setOk(false); setStep(0); setForm({ n: '', e: '', a: ASUNTOS[0].id, m: '' }) }}>Enviar otro</button>
        </div>
      </div>
    </div>
  )
  return (
    <div className="cx-card panel-pop">
      <div className="cx-steps">
        {['Tus datos', 'Tu interés', 'Tu mensaje'].map((t, k) => (
          <button key={t} type="button" className={`cx-step ${step === k ? 'on' : ''} ${step > k ? 'done' : ''}`} onClick={() => k < step && setStep(k)}>
            <b>{step > k ? '✓' : `0${k + 1}`}</b><span>{t}</span>
          </button>
        ))}
      </div>
      <div className="cx-bar"><i style={{ width: `${((step + 1) / 3) * 100}%` }} /></div>

      {step === 0 && (
        <div className="cx-body" key="s0">
          <h3>Hola, ¿cómo te llamas? 👋</h3><p className="cx-sub">Empecemos con lo básico para responderte rápido.</p>
          <label className="cx-field"><span>Nombre *</span><input value={form.n} onChange={e => setForm({ ...form, n: e.target.value })} placeholder="Nombre completo" className={form.n && !vN ? 'bad' : ''} /></label>
          <label className="cx-field"><span>Correo *</span><input type="email" value={form.e} onChange={e => setForm({ ...form, e: e.target.value })} placeholder="tucorreo@mail.com" className={form.e && !vE ? 'bad' : ''} /></label>
          <button className="btn btn-blue cx-next" disabled={!(vN && vE)} onClick={() => setStep(1)}>Continuar →</button>
        </div>
      )}
      {step === 1 && (
        <div className="cx-body" key="s1">
          <h3>{form.n.split(' ')[0] || 'Hola'}, ¿qué te interesa? 🎯</h3><p className="cx-sub">Toca una opción, todo llega a nuestro WhatsApp.</p>
          <div className="asunto-grid">{ASUNTOS.map(a => (
            <button key={a.id} type="button" className={`asunto-card ${form.a === a.id ? 'on' : ''}`} onClick={() => setForm({ ...form, a: a.id })}>
              <span className="asunto-ico">{a.icon}</span><b>{a.label}</b><small>{a.desc}</small>
            </button>))}</div>
          <div className="cx-nav"><button className="btn btn-line" onClick={() => setStep(0)}>← Atrás</button>
            <button className="btn btn-blue" onClick={() => setStep(2)}>Continuar →</button></div>
        </div>
      )}
      {step === 2 && (
        <form className="cx-body" key="s2" onSubmit={send}>
          <h3>Casi listo, cuéntanos más ✍️</h3><p className="cx-sub">Asunto: <b>{asunto.icon} {asunto.label}</b> · <button type="button" className="link-btn" onClick={() => setStep(1)}>cambiar</button></p>
          <label className="cx-field"><span>Mensaje * <small className="char-count">{form.m.length}/500</small></span>
            <textarea rows={4} maxLength={500} value={form.m} onChange={e => setForm({ ...form, m: e.target.value })} placeholder="Ej: Quiero reservar el BCB con S/.300, ¿cómo pago por Yape?" /></label>
          <div className="chat-mock"><small>👁 Vista previa · así llegará</small><div className="bubble out">{vM || vN ? msg : 'Escribe y míralo aquí en vivo…'}</div></div>
          <div className="cx-nav"><button type="button" className="btn btn-line" onClick={() => setStep(1)}>← Atrás</button>
            <button className="btn btn-blue" type="submit" disabled={!(vN && vE && vM)}>Enviar por WhatsApp →</button></div>
        </form>
      )}
    </div>
  )
}

export function PanelWhatsapp() {
  const [waN, setWaN] = useState('')
  const [waM, setWaM] = useState(ASUNTOS[0].id)
  const asunto = ASUNTOS.find(a => a.id === waM) || ASUNTOS[0]
  return (
    <div className="cx-card panel-pop">
      <div className="wa-hero-mini">
        <span className="wa-pulse" /><div><h3>Chat directo, sin vueltas 💚</h3><p className="cx-sub">En línea Lun–Sáb · respondemos en ~2h</p></div>
        <strong className="big-num">{SITE.phone}</strong>
      </div>
      <label className="cx-field"><span>Tu nombre</span><input value={waN} onChange={e => setWaN(e.target.value)} placeholder="¿Cómo te llamas?" /></label>
      <span className="cx-label">Toca tu motivo</span>
      <div className="asunto-grid">{ASUNTOS.map(a => (
        <button key={a.id} type="button" className={`asunto-card ${waM === a.id ? 'on' : ''}`} onClick={() => setWaM(a.id)}>
          <span className="asunto-ico">{a.icon}</span><b>{a.label}</b><small>{a.desc}</small>
        </button>))}</div>
      <div className="phone-mock">
        <div className="phone-bar"><i /><i /><i /></div>
        <div className="bubble in">¡Hola! Somos SEMIT 👋 ¿En qué te ayudamos?</div>
        <div className="bubble out" key={waM + waN}>Hola, soy {waN || '...'}. Me interesa: {asunto.label}.</div>
        <div className="typing"><i /><i /><i /></div>
      </div>
      <a className="btn btn-blue" style={{ width: '100%' }} target="_blank" rel="noreferrer" href={waLink(`Hola SEMIT, soy ${waN || ''}. Me interesa: ${asunto.label}.`)}>Ir al WhatsApp →</a>
      <div className="note" style={{ textAlign: 'center' }}>📞 ¿Prefieres llamar? <b>{SITE.phone}</b></div>
    </div>
  )
}

export function PanelSede() {
  return (
    <div className="cx-card panel-pop">
      <div className="sede-hero">
        <img src={LOCAL.contactoB} alt="Sede Cusco" loading="lazy" />
        <span className="sede-badge">📍 SEDE CUSCO · ABIERTA</span>
      </div>
      <h3>SEMIT · Huayllapampa</h3><p className="cx-sub">San Jerónimo — Cusco, Perú · aulas, hospedaje y talleres bi-vocacionales.</p>
      <div className="sched-grid">{HORARIO.map(([d, h]) => <div key={d} className="sched"><b>{d}</b><span>{h}</span></div>)}</div>
      <ul className="chk"><li>🚌 Ruta San Jerónimo, paradero Huayllapampa</li><li>🎒 Trae Biblia y libreta, te guiamos en todo</li></ul>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <a className="btn btn-blue" style={{ flex: 1 }} target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${SITE.mapsQuery}`}>Abrir en Maps →</a>
        <a className="btn btn-line" target="_blank" rel="noreferrer" href={waLink('Hola SEMIT, quiero visitar la sede. ¿Cómo llego?')}>Cómo llego</a>
      </div>
    </div>
  )
}

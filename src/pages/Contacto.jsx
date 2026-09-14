import { useState } from 'react'
import { useReveal } from '../lib'

const ASUNTOS = ['BCB 2026 · Reserva', 'Curso mensual · $30', 'Becas familia', 'Solo información']
const FAQS = [
  ['¿Cuándo empiezo?', 'Cada 1° lunes de mes. BCB solo 10 ene — 8 feb 2026.'],
  ['¿Cómo pago?', 'Depósito, transferencia o Yape. Reserva BCB con S/.300.'],
  ['¿Dónde están?', 'Huayllapampa s/n, San Jerónimo — Cusco, Perú.'],
]
const WA = '51984833744'

export default function Contacto() {
  const [canal, setCanal] = useState('form')
  const [form, setForm] = useState({ n: '', e: '', a: ASUNTOS[0], m: '' })
  const [ok, setOk] = useState(false)
  const [fq, setFq] = useState(-1)
  const [copied, setCopied] = useState('')
  const [waN, setWaN] = useState('')
  const [waM, setWaM] = useState(0)
  useReveal('/contacto')
  const vN = form.n.trim().length > 2
  const vE = form.e.includes('@') && form.e.includes('.')
  const vM = form.m.trim().length > 9
  const prog = [vN, vE, vM].filter(Boolean).length
  const copy = (t, k) => { try { navigator.clipboard.writeText(t) } catch {} setCopied(k); setTimeout(() => setCopied(''), 1400) }
  const msg = `Hola SEMIT, soy ${form.n || '...'}. (${form.e || 'sin correo'}). Asunto: ${form.a}. ${form.m}`
  const send = e => {
    e.preventDefault()
    if (!(vN && vE && vM)) return
    setOk(true)
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank')
  }
  return (
    <div className="pg pg-contact"><div className="container sec">
      <div className="hsec rv"><span className="pill">💬 Respuesta en ~2h · Lun–Sáb</span>
        <h1>Escríbenos, visítanos, llámanos.</h1>
        <p className="sub">Elige tu canal favorito. Todo llega directo a nuestro WhatsApp.</p></div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}><div className="seg rv">
        {[['form', '📝 Formulario'], ['wa', '💚 WhatsApp'], ['sede', '📍 Sede Cusco']].map(([k, t]) => (
          <button key={k} className={canal === k ? 'on' : ''} onClick={() => { setCanal(k); setOk(false) }}>{t}</button>))}
      </div></div>

      <div className="c-grid2">
        <div className="rv" style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
          <div className="info-card hero-card"><span className="k">SEMIT INTERNACIONAL</span>
            <h3>Seminario Teológico y Misionero</h3>
            <p>📍 Huayllapampa s/n · Distrito de San Jerónimo<br />CUSCO – PERÚ</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
              <a className="btn btn-dark" style={{ padding: '9px 18px', fontSize: 13 }} target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/?api=1&query=SEMIT+Huayllapampa+San+Jeronimo+Cusco">Cómo llegar →</a>
              <button className="btn btn-line" style={{ padding: '9px 18px', fontSize: 13 }} onClick={() => copy('SEMIT, Huayllapampa s/n, San Jerónimo, Cusco – Perú', 'dir')}>{copied === 'dir' ? '✓ Copiado' : 'Copiar dirección'}</button>
            </div></div>
          <div className="info-card wa-glow"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <b>💚 WhatsApp en línea</b><span className="wa-dot" /></div>
            <strong className="big-num">+51 984 833 744</strong>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a className="btn btn-blue" style={{ flex: 1, padding: '10px', fontSize: 13 }} target="_blank" rel="noreferrer" href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola SEMIT, quiero información.')}`}>Ir al WhatsApp →</a>
              <button className="btn btn-line" style={{ padding: '10px 16px', fontSize: 13 }} onClick={() => copy('+51984833744', 'wa')}>{copied === 'wa' ? '✓' : 'Copiar'}</button>
            </div></div>
          <div className="info-card"><div className="mini-row"><span>✉️ contacto@semit.org</span><button className="copy-btn" onClick={() => copy('contacto@semit.org', 'mail')}>{copied === 'mail' ? '✓' : 'Copiar'}</button></div>
            <div className="mini-row"><span>📘 Facebook · SEMIT</span><a className="copy-btn" target="_blank" rel="noreferrer" href="https://www.facebook.com/search/top?q=semit">Abrir →</a></div></div>
          <div className="faq-mini">{FAQS.map((x, k) => (
            <div key={k} className="fmini"><button onClick={() => setFq(fq === k ? -1 : k)}>{x[0]}<span>{fq === k ? '−' : '+'}</span></button>{fq === k && <p>{x[1]}</p>}</div>))}</div>
        </div>

        <div className="rv">
          {canal === 'form' && (
            <form className="form-big panel-pop" key="form" onSubmit={send}>
              {!ok ? (<>
                <div className="steps"><div className={`step ${vN ? 'done' : ''}`}>1 Nombre</div><div className={`step ${vE ? 'done' : ''}`}>2 Correo</div><div className={`step ${vM ? 'done' : ''}`}>3 Mensaje</div></div>
                <h3>Hola, ¿cómo te llamas? 👋</h3>
                <label>Nombre *<input value={form.n} onChange={e => setForm({ ...form, n: e.target.value })} placeholder="Nombre completo" /></label>
                <label>Correo *<input type="email" value={form.e} onChange={e => setForm({ ...form, e: e.target.value })} placeholder="tucorreo@mail.com" /></label>
                <label>Asunto *</label>
                <div className="subject-chips">{ASUNTOS.map(a => <button type="button" key={a} className={form.a === a ? 'on' : ''} onClick={() => setForm({ ...form, a })}>{a}</button>)}</div>
                <label>Mensaje *<textarea rows={4} maxLength={500} value={form.m} onChange={e => setForm({ ...form, m: e.target.value })} placeholder="Cuéntanos: ¿BCB, curso, beca...?" /></label>
                <div className="char-row"><div className="bar" style={{ flex: 1 }}><i style={{ width: `${(prog / 3) * 100}%` }} /></div><span className="char-count">{form.m.length}/500</span></div>
                <div className="wa-preview"><small>👁 Vista previa · así llegará al WhatsApp</small><p>{vN || vE || vM ? msg : 'Escribe y míralo aquí en vivo…'}</p></div>
                <button className="btn btn-blue" type="submit" style={{ width: '100%' }} disabled={!(vN && vE && vM)}>Enviar por WhatsApp →</button>
              </>) : (<div className="ok-box"><div className="ok-check">✓</div><h3>¡Listo, {form.n.split(' ')[0]}!</h3><p>Abrimos tu WhatsApp con el mensaje de <b>{form.a}</b>. Si no se abrió, <a style={{ color: '#0071e3', fontWeight: 800 }} target="_blank" rel="noreferrer" href={`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`}>tócalo aquí</a>.</p><button type="button" className="btn btn-line" onClick={() => { setOk(false); setForm({ n: '', e: '', w: '', a: ASUNTOS[0], m: '' }) }}>Enviar otro</button></div>)}
            </form>
          )}
          {canal === 'wa' && (
            <div className="form-big panel-pop" key="wa">
              <h3>💚 Atajo express al WhatsApp</h3><p>Escribe tu nombre, elige motivo y abre el chat con todo listo.</p>
              <label>Tu nombre<input value={waN} onChange={e => setWaN(e.target.value)} placeholder="¿Cómo te llamas?" /></label>
              <label>Motivo</label>
              <div className="subject-chips">{ASUNTOS.map((a, k) => <button type="button" key={a} className={waM === k ? 'on' : ''} onClick={() => setWaM(k)}>{a}</button>)}</div>
              <div className="wa-preview"><small>👁 Tu mensaje</small><p>Hola SEMIT, soy {waN || '...'}. Me interesa: {ASUNTOS[waM]}.</p></div>
              <a className="btn btn-blue" style={{ width: '100%' }} target="_blank" rel="noreferrer" href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hola SEMIT, soy ${waN || ''}. Me interesa: ${ASUNTOS[waM]}.`)}`}>Ir al WhatsApp →</a>
              <div className="note" style={{ textAlign: 'center' }}>📞 ¿Prefieres llamar? <b>+51 984 833 744</b></div>
            </div>
          )}
          {canal === 'sede' && (
            <div className="form-big panel-pop" key="sede">
              <img className="sede-img" src="https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=80" alt="Sede Cusco" loading="lazy" />
              <span className="k">VISÍTANOS EN CUSCO</span><h3>SEMIT · Sede Huayllapampa</h3>
              <ul className="chk"><li>📍 Huayllapampa s/n, San Jerónimo</li><li>🏔️ CUSCO – PERÚ</li><li>🕘 Lun–Sáb · 9:00 — 17:00</li><li>🚌 Ref: ruta San Jerónimo, paradero Huayllapampa</li></ul>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a className="btn btn-blue" style={{ flex: 1 }} target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/?api=1&query=SEMIT+Huayllapampa+San+Jeronimo+Cusco">Abrir en Maps →</a>
                <a className="btn btn-line" target="_blank" rel="noreferrer" href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola SEMIT, quiero visitar la sede. ¿Cómo llego?')}`}>Preguntar cómo llegar</a>
              </div>
              <div className="note">🎒 Trae tu Biblia y libreta. Te mostramos aulas, hospedaje y talleres bi-vocacionales.</div>
            </div>
          )}
        </div>
      </div>
    </div></div>
  )
}

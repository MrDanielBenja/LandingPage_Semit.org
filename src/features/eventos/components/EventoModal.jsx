import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { waLink } from '../../../core/services/whatsapp'
import { evDiasRestan, evFecha } from './EventoCard'

export function EventoDrawer({ evento, onClose }) {
  const [tab, setTab] = useState('programa')
  useEffect(() => {
    setTab('programa')
    if (!evento) return
    document.body.style.overflow = 'hidden'
    const esc = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', esc)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', esc) }
  }, [evento, onClose])
  if (!evento) return null
  const c = evento
  const f = evFecha(c.fecha)
  const dias = evDiasRestan(c.fecha)
  const libres = c.cupos - c.inscritos
  const pct = Math.min(100, Math.round((c.inscritos / c.cupos) * 100))
  return (
    <div className="drawer-bg" onClick={onClose}>
      <aside className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-hero">
          <img src={c.img} alt={c.n} />
          <button className="drawer-x" onClick={onClose} aria-label="cerrar">✕</button>
          <span className="cu-tag">{c.tag}</span>
        </div>
        <div className="drawer-body">
          <span className="cu-area">{c.cat} · {c.mod}</span>
          <h2>{c.n}</h2>
          <div className="drawer-rating">
            <b>📅 {f.dia} {f.mes} {f.anio} · {c.hora}</b>
            <span>· 📍 {c.lugar}</span>
            <span>· ⭐ {c.rating.toFixed(1)}</span>
          </div>
          <p className="drawer-desc">{c.d}</p>
          <div className="ev-count-mini">
            <span>{dias < 0 ? '✅ Finalizado' : dias === 0 ? '🔥 ¡Es hoy!' : `⏳ Faltan ${dias} días`}</span>
            <span>🎟️ {libres > 0 ? `${libres} de ${c.cupos} cupos libres` : 'Lleno · únete a la espera'}</span>
          </div>
          <div className="bar"><i style={{ width: `${pct}%` }} /></div>
          <div className="drawer-tabs">
            {['programa', 'incluye', 'precio'].map(t => (
              <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t === 'programa' ? '📋 Programa' : t === 'incluye' ? '✅ Incluye' : '💲 Inversión'}</button>
            ))}
          </div>
          {tab === 'programa' && (
            <ol className="temario">{c.programa.map((t, k) => <li key={t}><b>{String(k + 1).padStart(2, '0')}</b><span>{t}</span></li>)}</ol>
          )}
          {tab === 'incluye' && (
            <ul className="chk drawer-chk"><li>🎟️ Entrada + materiales</li><li>🍲 Alimentación (presenciales)</li><li>📜 Certificado de participación</li><li>📱 Grupo WhatsApp del evento</li></ul>
          )}
          {tab === 'precio' && (
            <div className="drawer-price">
              <div>{c.p === 0 ? <><strong>Gratis</strong><span>con inscripción previa</span></> : <><small>S/.{Math.round(c.p * 1.25)} regular</small><strong>S/.{c.p}</strong><span>promo pronto pago</span></>}</div>
              <p>Separa tu cupo por WhatsApp: responde en ~2h Lun–Sáb.</p>
            </div>
          )}
        </div>
        <div className="drawer-foot">
          <div className="cu-price">{c.p === 0 ? <b>Gratis</b> : <><small>S/.{Math.round(c.p * 1.25)}</small><b>S/.{c.p}</b></>}</div>
          <a className="btn btn-line" target="_blank" rel="noreferrer" href={waLink(`Hola SEMIT, quiero inscribirme en ${c.n} (${f.dia} ${f.mes}).`)}>WhatsApp</a>
          <Link className="btn btn-blue" to="/contacto">Reservar →</Link>
        </div>
      </aside>
    </div>
  )
}

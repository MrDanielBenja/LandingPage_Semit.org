import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { waLink } from '../../../core/services/whatsapp'

export function NivelDrawer({ nivel, onClose }) {
  const [tab, setTab] = useState('temario')
  useEffect(() => {
    setTab('temario')
    if (!nivel) return
    document.body.style.overflow = 'hidden'
    const esc = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', esc)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', esc) }
  }, [nivel, onClose])
  if (!nivel) return null
  const c = nivel
  const old = c.p >= 40 ? 50 : 40
  return (
    <div className="drawer-bg" onClick={onClose}>
      <aside className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-hero">
          <img src={c.img} alt={c.n} />
          <button className="drawer-x" onClick={onClose} aria-label="cerrar">✕</button>
          <span className="cu-tag">{c.tag}</span>
        </div>
        <div className="drawer-body">
          <span className="cu-area">{c.a} · {c.mod} · {c.dur}</span>
          <h2>{c.n}</h2>
          <div className="drawer-rating"><b>⭐ {c.rating.toFixed(1)}</b><span>· {c.est} estudiantes</span><span>· 🕘 {c.semanas} semanas</span><span>· 📚 {c.lecciones} lecciones</span></div>
          <p className="drawer-desc">{c.d} Incluye materiales, foro en vivo y certificado digital. Inicia cada 1° lunes de mes.</p>
          <div className="drawer-tabs">
            {['temario', 'incluye', 'precio'].map(t => (
              <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t === 'temario' ? '📚 Contenido' : t === 'incluye' ? '✅ Incluye' : '💲 Inversión'}</button>
            ))}
          </div>
          {tab === 'temario' && (
            <ol className="temario">{c.incluye.map((t, k) => <li key={t}><b>{String(k + 1).padStart(2, '0')}</b><span>{t}</span></li>)}</ol>
          )}
          {tab === 'incluye' && (
            <ul className="chk drawer-chk"><li>📖 Guías y libros digitales</li><li>💬 Foro en vivo semanal</li><li>📜 Certificado digital</li><li>📱 Acceso de por vida</li></ul>
          )}
          {tab === 'precio' && (
            <div className="drawer-price">
              <div><small>${old} regular</small><strong>${c.p}</strong><span>promo este mes</span></div>
              <p>O escríbenos por WhatsApp y asegura tu cupo del próximo lunes.</p>
            </div>
          )}
        </div>
        <div className="drawer-foot">
          <div className="cu-price"><small>${old}</small><b>${c.p}</b></div>
          <a className="btn btn-line" target="_blank" rel="noreferrer" href={waLink(`Hola SEMIT, quiero inscribirme en ${c.n} ($${c.p}).`)}>WhatsApp</a>
          <Link className="btn btn-blue" to="/contacto">Inscribirme →</Link>
        </div>
      </aside>
    </div>
  )
}

import { CANALES } from '../data/contacto.data'

export function CanalesTabs({ canal, onCanal }) {
  return (
    <div className="canal-rail">
      {CANALES.map((c, k) => (
        <button key={c.id} className={`canal-btn ${canal === c.id ? 'on' : ''}`} onClick={() => onCanal(c.id)}>
          <span className="canal-num">0{k + 1}</span>
          <span className="canal-ico">{c.icon}</span>
          <span className="canal-txt"><b>{c.label}</b><small>{c.desc}</small></span>
          <span className="canal-arrow">→</span>
        </button>
      ))}
      <div className="rail-note">
        <b>🕘 Horario</b>
        <span>Lun–Vie · 9:00 — 17:00</span>
        <span>Sábado · 9:00 — 13:00</span>
      </div>
    </div>
  )
}

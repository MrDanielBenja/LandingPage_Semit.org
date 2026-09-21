import { Link } from 'react-router-dom'
import { useCountdown } from '../../../shared/hooks/useCountdown'
import { EVENTOS } from '../../eventos/data/eventos.data'
import { waLink } from '../../../core/services/whatsapp'

const dias = (f) => {
  const h = new Date()
  h.setHours(0, 0, 0, 0)
  const d = new Date(f + 'T12:00:00')
  d.setHours(0, 0, 0, 0)
  return Math.round((d - h) / 864e5)
}

export function EventoTeaser() {
  const ev = [...EVENTOS].filter(e => dias(e.fecha) >= 0).sort((a, b) => a.fecha.localeCompare(b.fecha))[0] || EVENTOS[0]
  const cd = useCountdown(ev.fecha + 'T' + ev.hora + ':00')
  return (
    <div className="evt-card rv">
      <img src={ev.img} alt={ev.n} loading="lazy" />
      <div className="evt-info">
        <span className="gold-pill">🎉 Próximo evento · {ev.cat}</span>
        <h2>{ev.n}</h2>
        <p>📍 {ev.lugar} · 🕘 {ev.hora}</p>
        <div className="ev-cd">{[[cd.d, 'días'], [cd.h, 'hrs'], [cd.m, 'min'], [cd.s, 'seg']].map(([v, l]) => <div key={l}><b>{String(v).padStart(2, '0')}</b><span>{l}</span></div>)}</div>
        <div className="cta" style={{ justifyContent: 'flex-start' }}>
          <Link className="btn btn-gold" to="/eventos">Ver agenda →</Link>
          <a className="btn btn-line" target="_blank" rel="noreferrer" href={waLink(`Hola SEMIT, quiero inscribirme en ${ev.n}.`)}>Reservar</a>
        </div>
      </div>
    </div>
  )
}

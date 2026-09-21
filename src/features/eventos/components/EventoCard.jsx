const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

export function evFecha(f) {
  const d = new Date(f + 'T12:00:00')
  return { dia: d.getDate(), mes: MESES[d.getMonth()], anio: d.getFullYear() }
}

export function evDiasRestan(f) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const d = new Date(f + 'T12:00:00')
  d.setHours(0, 0, 0, 0)
  return Math.round((d - hoy) / 864e5)
}

export function EventoCard({ c, i, onSelect }) {
  const f = evFecha(c.fecha)
  const dias = evDiasRestan(c.fecha)
  const libres = c.cupos - c.inscritos
  return (
    <article className="cu-card rv" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }} onClick={() => onSelect(c)}>
      <span className="cu-rank">{String(i + 1).padStart(2, '0')}</span>
      <div className="cu-thumb">
        <img src={c.img} alt={c.n} loading="lazy" />
        <span className="cu-tag">{c.tag}</span>
        <span className="cu-mod">{c.mod}</span>
        <span className="ev-date"><b>{f.dia}</b><small>{f.mes}</small></span>
      </div>
      <div className="cu-info">
        <span className="cu-area">{c.cat}</span>
        <h3>{c.n}</h3>
        <p>{c.d}</p>
        <div className="cu-meta">
          <span>📅 {f.dia} {f.mes} {f.anio}</span>
          <span>🕘 {c.hora}</span>
          <span>📍 {c.lugar}</span>
        </div>
        <div className="cu-foot">
          <div className="cu-price">
            {c.p === 0 ? <b>Gratis</b> : <><small>S/.{Math.round(c.p * 1.25)}</small><b>S/.{c.p}</b></>}
            <span>{dias < 0 ? 'finalizado' : dias === 0 ? '¡hoy!' : `en ${dias}d`}</span>
          </div>
          <span className="cu-go">{libres > 0 ? `${libres} cupos →` : 'Lleno · lista de espera →'}</span>
        </div>
      </div>
    </article>
  )
}

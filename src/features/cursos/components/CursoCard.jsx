export function CursoCard({ c, i, onSelect }) {
  const old = c.p >= 40 ? 50 : 40
  return (
    <article className="cu-card rv" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }} onClick={() => onSelect(c)}>
      <span className="cu-rank">{String(i + 1).padStart(2, '0')}</span>
      <div className="cu-thumb">
        <img src={c.img} alt={c.n} loading="lazy" />
        <span className="cu-tag">{c.tag}</span>
        <span className="cu-mod">{c.mod}</span>
      </div>
      <div className="cu-info">
        <span className="cu-area">{c.a} · {c.nivel}</span>
        <h3>{c.n}</h3>
        <p>{c.d}</p>
        <div className="cu-meta">
          <span>🕘 {c.semanas} sem</span>
          <span>📚 {c.lecciones} lecciones</span>
          <span>⭐ {c.rating.toFixed(1)}</span>
          <span>👥 {c.est}</span>
        </div>
        <div className="cu-foot">
          <div className="cu-price"><small>${old}</small><b>${c.p}</b><span>promo</span></div>
          <span className="cu-go">Ver programa →</span>
        </div>
      </div>
    </article>
  )
}

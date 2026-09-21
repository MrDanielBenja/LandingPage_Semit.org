import { Link } from 'react-router-dom'
import { useCursos } from '../../cursos/hooks/useCursos'

export function CursosTop() {
  const { data } = useCursos()
  const TOP = [...data].sort((a, b) => b.est - a.est).slice(0, 4)
  return (
    <div className="rv">
      <div className="hsec"><span className="pill">🔥 Los más pedidos</span><h2>Empieza este lunes</h2>
        <p>Los 4 cursos que más vidas están marcando. Todos inician cada 1° lunes, con certificado.</p></div>
      <div className="ct-grid">{TOP.map((c, k) => (
        <Link key={c.slug || c.id || `${c.n}-${k}`} to="/cursos" className="ct-card" style={{ animationDelay: `${k * 80}ms` }}>
          <div className="ct-media"><img src={c.img} alt={c.n} loading="lazy" /><span className="cu-tag">{c.tag}</span></div>
          <div className="ct-body">
            <span className="cu-area">{c.a} · {c.nivel}</span>
            <h3>{c.n}</h3>
            <div className="ct-meta"><span>⭐ {c.rating.toFixed(1)}</span><span>👥 {c.est}</span><span>🕘 {c.semanas} sem</span></div>
            <div className="cu-foot"><div className="cu-price"><small>$40</small><b>${c.p}</b></div><span className="cu-go">Ver →</span></div>
          </div>
        </Link>))}</div>
      <div className="cta"><Link className="btn btn-line" to="/cursos">Ver los {data.length} cursos ›</Link></div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { IMGS, LOCAL } from '../../../shared/lib/images'

const PILARES = [
  { e: '🎓', t: 'Educación', d: 'Teología y Biblia con docentes certificados y misioneros activos en campo.', img: LOCAL.educacion },
  { e: '📦', t: 'Envío', d: '275 misioneros enviados a Latinoamérica y el mundo.', img: LOCAL.envio },
  { e: '❤️', t: 'Cuidado', d: 'Acompañamos obreros, iglesias y familias en el campo.', img: LOCAL.cuidado },
]

export function QuienesSomos() {
  return (
    <section className="rv">
      <div className="hsec"><span className="pill">🏛️ Quiénes somos</span><h2>Una organización que forma, envía y cuida</h2>
        <p><b>SEMIT</b> es una organización Misionera Cristiana Evangélica de alcance internacional. Educación, Capacitación y Entrenamiento en Teología, Biblia y Misiones para formar ministros del Evangelio.</p></div>
      <div className="pilar-grid">
        {PILARES.map((p, k) => (
          <div key={p.t} className="pilar-card" style={{ animationDelay: `${k * 90}ms` }}>
            <div className="pilar-media"><img src={p.img} alt={p.t} loading="lazy" /><span className="pilar-e">{p.e}</span></div>
            <div className="pilar-body">
              <b>{String(k + 1).padStart(2, '0')} · {p.t}</b>
              <p>{p.d}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="dedica rv">
        <img src={IMGS.cusco} alt="Cusco SEMIT" loading="lazy" />
        <div><span className="k">NUESTRA DEDICACIÓN</span><p>Educación · Capacitación · Formación · Envío · Supervisión de Obreros, Ministros, Misioneros e Iglesias que contribuyan a la expansión del Evangelio.</p>
          <Link className="btn btn-blue" to="/contacto" style={{ marginTop: 12 }}>Ser parte →</Link></div>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { IMGS } from '../../../shared/lib/images'

export function SeminarioIntro() {
  return (
    <div className="sem-free rv">
      <span className="pill">🌍 SEMIT Internacional · Seminario SEMIT</span>
      <h2>Capacitación y<br />entrenamiento que se vive.</h2>
      <p>SEMIT Internacional tiene su seminario: el <b>Seminario SEMIT</b>. No es solo aula — es <b>capacitación</b> bíblica sólida y <b>entrenamiento</b> misionero real: aprendes, practicas, sales al campo y enseñas a otros.</p>
      <div className="sem-free-imgs">
        <img src={IMGS.aula} alt="Aula Seminario" loading="lazy" />
        <img src={IMGS.estudiantes} alt="Estudiantes" loading="lazy" className="up" />
        <img src={IMGS.biblioteca} alt="Biblioteca" loading="lazy" />
      </div>
      <div className="sem-points free">
        <div><span>📖</span><b>Capacitación</b><small>Biblia, teología y ministerio con docentes y misioneros en campo.</small></div>
        <div><span>🔥</span><b>Entrenamiento</b><small>Campo real + oficio bi-vocacional para sostener tu ministerio.</small></div>
        <div><span>🌱</span><b>Multiplicación</b><small>Te enseñamos para que enseñes: 2 Tim 2:2 en acción.</small></div>
      </div>
      <div className="cta">
        <Link className="btn btn-blue" to="/niveles">Ver mi ruta →</Link>
        <Link className="btn btn-line" to="/nosotros">Conócenos ›</Link>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IMGS } from '../../../shared/lib/images'
import { BCB_AREAS, BCB_CAMPOS, BCB_COSTOS, BCB_INCLUYE, BCB_OFICIOS } from '../data/eventos.data'
import { waLink } from '../../../core/services/whatsapp'
import { SITE } from '../../../shared/config/site'

export function BcbEvento() {
  const [fase, setFase] = useState(0)
  const [costo, setCosto] = useState(0)
  const [campo, setCampo] = useState(0)
  const [verMas, setVerMas] = useState(false)
  return (
    <div className="bcb-sec rv" id="bcb" style={{ paddingLeft: 0, paddingRight: 0 }}>
      <div className="hsec"><span className="pill">🔥 Intensivo e Integral · 10 Ene — 8 Feb</span><h2>BCB Transcultural</h2>
        <p>Programa de Entrenamiento Misionero en <b>Base, Campo y Bi-vocacional</b>. Dos fases que marcan tu llamado.</p></div>
      <div className="bcb-steps">
        <button className={fase === 0 ? 'on' : ''} onClick={() => setFase(0)}><b>01</b><span>Base en Cusco</span><small>10 Ene — 8 Feb · 4 sem</small></button>
        <span className="bcb-line" />
        <button className={fase === 1 ? 'on' : ''} onClick={() => setFase(1)}><b>02</b><span>Campo transcultural</span><small>15-20 días · 3 rutas</small></button>
      </div>

      {fase === 0 ? (
        <div key="f0" className="bcb-page">
          <div className="bcb-hero"><img src={IMGS.estudiantes} alt="Base Cusco" loading="lazy" />
            <div><span className="k">1° FASE · 10 ENE — 8 FEB · 4 SEMANAS</span><h3>Entrenamiento en Base</h3>
              <p>Un mes intensivo, teórico y práctico: cursos, talleres, foros, plenarias, seminarios, conciertos de alabanza, ferias y experiencias transculturales.</p>
              <p style={{ marginTop: 8 }}>Tiempo desafiante para asumir tu rol en la misión global: descubre tu llamado, entiende el plan de Dios y da pasos concretos mientras adquieres destrezas para servir mejor.</p></div></div>

          <h4 className="bcb-h4">Áreas de entrenamiento</h4>
          <div className="bcb-cards4">{BCB_AREAS.map(a => <div key={a.t} className="bcb-mini bcb-photo"><img src={a.img} alt={a.t} loading="lazy" /><span className="bcb-emo">{a.e}</span><b>{a.t}</b><small>{a.d}</small></div>)}</div>

          <h4 className="bcb-h4">Bi-vocacional · 4 oficios</h4>
          <div className="bcb-cards4">{BCB_OFICIOS.map(o => <div key={o.t} className="bcb-mini bcb-photo"><img src={o.img} alt={o.t} loading="lazy" /><span className="bcb-emo">{o.e}</span><b>{o.t}</b><small>{o.d}</small></div>)}</div>
          <div className="note">👨‍🏫 Entrenadores, profesores y misioneros de campo de amplia experiencia te guiarán en todo el proceso.</div>

          <h4 className="bcb-h4">Todo incluido</h4>
          <div className="bcb-cards4">{BCB_INCLUYE.map(x => <div key={x.t} className="bcb-mini bcb-photo"><img src={x.img} alt={x.t} loading="lazy" /><span className="bcb-emo">{x.e}</span><b>{x.t}</b><small>{x.d}</small></div>)}</div>
          <div className="bcb-duo">
            <div className="mini-card"><span>📅 Fecha</span><strong style={{ fontSize: 15 }}>10 Ene — 8 Feb</strong></div>
            <div className="mini-card"><span>📍 Lugar</span><strong style={{ fontSize: 15 }}>SEMIT Cusco · Huayllapampa</strong></div>
          </div>
          <div className="note">🌎 <b>¡Tendrás la oportunidad de hacer Misiones en Latinoamérica!</b></div>

          <h4 className="bcb-h4">Elige tu inversión</h4>
          <div className="cost-grid">{BCB_COSTOS.map((c, k) => (
            <button key={c.tag} className={`cost-card ${k === costo ? 'on' : ''}`} onClick={() => setCosto(k)}>
              <small>{c.tag}</small><strong>{c.p}</strong><span>{c.n}</span>
            </button>))}</div>
          <div className="note">👨‍👩‍👧 Familia nuclear: consulta becas y subvenciones.<br />💰 Adelanto S/.300 garantiza vacante. Cancela antes de la promo o hasta el 10 Ene 2026.<br />💳 Pago: depósito, transferencia o Yape. Datos al final del formulario.</div>
          <button className="btn btn-line" style={{ width: '100%' }} onClick={() => setVerMas(v => !v)}>{verMas ? 'Ocultar detalle semanal −' : '¿Solo puedes 1 semana? Ver detalle +'}</button>
          {verMas && <div className="note">📅 <b>Costo Semanal S/.250</b> por 1 semana (lun-dom). Incluye todos los gastos y la salida misionera de la semana elegida. Puedes tomar una o más semanas según tu disposición.</div>}
          <Link className="btn btn-blue" to="/contacto" style={{ width: '100%', marginTop: 8 }}>Haz clic aquí para inscribirte →</Link>
        </div>
      ) : (
        <div key="f1" className="bcb-page">
          <div className="bcb-hero"><img src={BCB_CAMPOS[campo].img} alt={BCB_CAMPOS[campo].t} loading="lazy" />
            <div><span className="k">2° FASE · 15-20 DÍAS · DENTRO Y FUERA DEL PERÚ</span><h3>Entrenamiento en Campo</h3>
              <p>Planificación, preparación y ejecución de un Viaje Misionero Transcultural. Pondrás en práctica lo aprendido y descubrirás los dones que Dios te dio.</p>
              <p style={{ marginTop: 8 }}>Capacitación práctica en servicio cristiano, eclesiástico y humanitario, en un medio transcultural diferente al tuyo.</p></div></div>

          <h4 className="bcb-h4">Elige tu ruta</h4>
          <div className="route-grid">{BCB_CAMPOS.map((o, k) => (
            <button key={o.t} className={`route-card ${k === campo ? 'on' : ''}`} onClick={() => setCampo(k)}>
              <img src={o.img} alt={o.t} loading="lazy" /><b>Opción {k + 1} · {o.t}</b><span>{o.d}</span>
            </button>))}</div>
          <div className="note" key={campo}>📍 <b>{BCB_CAMPOS[campo].t}:</b> {BCB_CAMPOS[campo].d} — viajas con tu equipo, dirigido por dos misioneros de campo.</div>

          <h4 className="bcb-h4">El costo cubre</h4>
          <div className="bcb-cards4"><div className="bcb-mini chk-mini">🎫 Pasajes aéreo y/o terrestre</div><div className="bcb-mini chk-mini">🏠 Hospedaje en campo</div><div className="bcb-mini chk-mini">🍲 Alimentación</div><div className="bcb-mini chk-mini">🤝 Coordinaciones locales</div></div>
          <div className="note">💲 Costos varían según la ruta elegida. Consulta informes BCB: <b>{SITE.phone}</b></div>
          <div className="bcb-duo">
            <a className="btn btn-line" href={waLink('Hola SEMIT, quiero info del Campo BCB')} target="_blank" rel="noreferrer">WhatsApp Campo →</a>
            <Link className="btn btn-blue" to="/contacto">Inscríbete aquí →</Link>
          </div>
        </div>
      )}
    </div>
  )
}

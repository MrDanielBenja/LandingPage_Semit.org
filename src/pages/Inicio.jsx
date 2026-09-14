import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { cursos, IMGS, useCountUp, useReveal } from '../lib'

const slides = [
  { t: 'Teología que se vive.', s: 'Biblia sólida, misión real y oficio práctico.', img: IMGS.biblia },
  { t: 'Un mes que marca tu llamado.', s: 'BCB 2026 en Cusco: base + campo + oficio.', img: IMGS.cusco },
  { t: 'Empieza este lunes.', s: 'Cursos virtuales desde $30 con certificado.', img: IMGS.clases },
]
const testis = [
  { n: 'María — Cusco', t: 'BCB me cambió más que años de teoría. Campo real en Amazonía.', img: 'https://i.pravatar.cc/100?img=47' },
  { n: 'Josué — Ecuador', t: 'Profes misioneros de verdad. Claro y con corazón.', img: 'https://i.pravatar.cc/100?img=12' },
  { n: 'Ana — Argentina', t: 'Empecé un lunes virtual y no paré. Súper claro todo.', img: 'https://i.pravatar.cc/100?img=32' },
]
const OFICIOS = ['🪚 Carpintería melamina y madera', '🍳 Gastronomía y alta cocina', '💈 Peluquería profesional', '🔥 Soldadura estructuras metálicas']
const INCLUYE = ['🏠 Hospedaje en lugar tranquilo', '🍲 Alimentación adecuada y balanceada', '📚 Materiales y libros necesarios', '✈️ Viajes misioneros semanales']
const COSTOS = [
  { tag: 'Oct', p: 'S/.750', n: 'Promoción Octubre. Inscríbete en octubre.' },
  { tag: 'Nov', p: 'S/.800', n: 'Promoción Noviembre. Inscríbete en noviembre.' },
  { tag: 'Dic', p: 'S/.850', n: 'Promoción Diciembre. Inscríbete en diciembre.' },
  { tag: 'Ene', p: 'S/.880', n: 'Costo Regular. Hasta el 10 de enero 2026.' },
  { tag: 'Sem', p: 'S/.250', n: 'Costo Semanal lun-dom. Incluye gastos y salida misionera.' },
]
const OPCIONES = [
  { t: 'Amazonía Peruana', d: 'Selva, ríos y comunidades nativas.', img: IMGS.selva },
  { t: 'Norte Perú + Ecuador', d: 'Costa, sierra y frontera misionera.', img: IMGS.andes },
  { t: 'Chile + Argentina', d: 'Cono sur transcultural urbano.', img: IMGS.mision },
]

function Stat({ v, label }) {
  const [started, setStarted] = useState(false)
  const [n] = useCountUp(v, started)
  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setStarted(true); return }
    const io = new IntersectionObserver(e => { if (e[0].isIntersecting) { setStarted(true); io.disconnect() } })
    const el = document.getElementById('st-' + label)
    if (el) io.observe(el)
    return () => io.disconnect()
  }, [label])
  return <div id={'st-' + label}><b>{n}+</b>{label}</div>
}

export default function Inicio() {
  const [i, setI] = useState(0)
  const [ti, setTi] = useState(0)
  const [fase, setFase] = useState(0)
  const [costo, setCosto] = useState(0)
  const [campo, setCampo] = useState(0)
  const [mail, setMail] = useState('')
  const [newsOk, setNewsOk] = useState(false)
  useReveal('/')
  useEffect(() => { const t = setInterval(() => setI(v => (v + 1) % slides.length), 4000); return () => clearInterval(t) }, [])
  const goBcb = () => document.getElementById('bcb')?.scrollIntoView({ behavior: 'smooth' })
  return (
    <div className="pg pg-inicio">
      <div className="pk-header">
        {slides.map((s, k) => <div key={k} className={`pk-bg ${k === i ? 'on' : ''}`} style={{ backgroundImage: `url('${s.img}')` }} />)}
        <div className="pk-filter" />
        <div className="pk-content">
          <span className="pill pill-glass">✨ Semestre 2025-II <b>· Nuevo</b></span>
          <div key={i} className="pk-title-wrap">
            <h1 className="presentation-title">{slides[i].t}</h1>
            <h2 className="presentation-subtitle">{slides[i].s}</h2>
          </div>
          <div className="dots dots-light">{slides.map((_, k) => <button key={k} aria-label={'ir a ' + k} className={`dot ${k === i ? 'on' : ''}`} onClick={() => setI(k)} />)}</div>
          <div className="cta"><button className="btn btn-blue" onClick={goBcb}>Descubrir BCB 2026 →</button><Link className="btn btn-line" to="/cursos">Explorar cursos ›</Link></div>
        </div>
        <div className="fog-low" /><div className="fog-low right" />
        <div className="moving-clouds" />
      </div>
      <div className="container hero">
        <div className="showcase rv">
          <div className="show-bar"><i /><i /><i /><span style={{ marginLeft: 8, fontSize: 12, color: '#86868b' }}>semit.org — en vivo</span></div>
          <div className="show-grid">
            <div className="show-l"><img className="show-img" src={IMGS.cusco} alt="Cusco" loading="lazy" /><span className="k">DESTACADO · ENE-FEB 2026</span><h2>Un mes en Cusco. Una vida en misión.</h2>
              <div className="cta" style={{ justifyContent: 'flex-start' }}><button className="btn btn-dark" onClick={goBcb}>Ver programa →</button><Link className="btn btn-line" to="/contacto">Reservar</Link></div></div>
            <div className="show-r"><div className="mini-card float"><span>Promo Octubre</span><strong>S/.750</strong></div><div className="mini-card float d2"><span>Campo real</span><strong>3 rutas</strong></div><div className="mini-card"><span>Oficios</span><strong>4 áreas</strong></div></div>
          </div>
        </div>
        <div className="strip rv"><Stat v={475} label="estudiantes" /><Stat v={275} label="misioneros" /><Stat v={60} label="docentes" /><div><b>4.9★</b>rating</div></div>
        <div className="t-carousel rv">
          <button onClick={() => setTi((ti - 1 + testis.length) % testis.length)}>‹</button>
          <div className="t-big t-user" key={ti}><img src={testis[ti].img} alt={testis[ti].n} loading="lazy" /><div><p>“{testis[ti].t}”</p><b>{testis[ti].n}</b></div></div>
          <button onClick={() => setTi((ti + 1) % testis.length)}>›</button>
        </div>
      </div>

      <div className="container home-sec rv" id="bcb">
        <div className="hsec"><span className="pill">🔥 Intensivo e Integral</span><h2>BCB Transcultural</h2>
          <p>Programa de Entrenamiento Misionero en <b>Base, Campo y Bi-vocacional</b>. Dos fases que marcan tu llamado.</p></div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><div className="seg">
          <button className={fase === 0 ? 'on' : ''} onClick={() => setFase(0)}>1° Fase · Base</button>
          <button className={fase === 1 ? 'on' : ''} onClick={() => setFase(1)}>2° Fase · Campo</button>
        </div></div>
        {fase === 0 ? (
          <div className="fcard" key="f0"><div className="fgrid">
            <div className="fleft"><img className="band-img" src={IMGS.estudiantes} alt="Base Cusco" loading="lazy" /><span className="k">1° FASE · 10 ENE — 8 FEB · 4 SEMANAS</span>
              <h3>Entrenamiento en Base</h3>
              <p>Un mes intensivo, teórico y práctico: cursos, talleres, foros, plenarias, seminarios, conciertos de alabanza, ferias y experiencias transculturales.</p>
              <div className="tags"><span>📖 Misiones</span><span>✝️ Biblia</span><span>⛪ Teología</span><span>🛠️ Bi-vocacional</span></div>
              <div className="off4">{OFICIOS.map(o => <span key={o}>{o}</span>)}</div>
              <p style={{ marginTop: 12 }}>Tiempo desafiante para asumir tu rol en la misión global: descubre tu llamado, entiende el plan de Dios y da pasos concretos mientras adquieres destrezas para servir mejor.</p>
              <div className="note">👨‍🏫 Entrenadores, profesores y misioneros de campo de amplia experiencia te guiarán en todo el proceso.</div>
            </div>
            <div className="fright">
              <ul className="chk">{INCLUYE.map(x => <li key={x}>{x}</li>)}</ul>
              <div className="note">🌎 <b>¡Tendrás la oportunidad de hacer Misiones en Latinoamérica!</b></div>
              <div className="mini-card"><span>📅 Fecha</span><strong style={{ fontSize: 15 }}>10 Ene — 8 Feb</strong></div>
              <div className="mini-card"><span>📍 Lugar</span><strong style={{ fontSize: 15 }}>SEMIT Cusco · Huayllapampa</strong></div>
              <div className="price-big"><span style={{ fontSize: 12, opacity: .7 }}>ELIGE TU MES</span><strong>{COSTOS[costo].p}</strong><span style={{ fontSize: 12 }}>{COSTOS[costo].n}</span>
                <div className="price-sel" style={{ marginTop: 10 }}>{COSTOS.map((c, k) => <button key={c.tag} className={k === costo ? 'on' : ''} onClick={() => setCosto(k)}>{c.tag}</button>)}</div></div>
              <div className="note">👨‍👩‍👧 Familia nuclear: consulta becas y subvenciones.<br />💰 Adelanto S/.300 garantiza vacante. Cancela antes de la promo o hasta el 10 Ene 2026.<br />💳 Pago: depósito, transferencia o Yape. Datos al final del formulario.</div>
              <Link className="btn btn-blue" to="/contacto" style={{ width: '100%' }}>Haz clic aquí para inscribirte →</Link>
            </div>
          </div></div>
        ) : (
          <div className="fcard" key="f1"><div className="fgrid">
            <div className="fleft"><img className="band-img" src={OPCIONES[campo].img} alt={OPCIONES[campo].t} loading="lazy" /><span className="k">2° FASE · 15-20 DÍAS · DENTRO Y FUERA DEL PERÚ</span>
              <h3>Entrenamiento en Campo</h3>
              <p>Planificación, preparación y ejecución de un Viaje Misionero Transcultural. Pondrás en práctica lo aprendido y descubrirás los dones que Dios te dio.</p>
              <div className="opt3">{OPCIONES.map((o, k) => <button key={o.t} className={k === campo ? 'on' : ''} onClick={() => setCampo(k)}>Opción {k + 1}<br />{o.t}</button>)}</div>
              <div className="note" key={campo}>📍 <b>{OPCIONES[campo].t}:</b> {OPCIONES[campo].d}</div>
              <p style={{ marginTop: 10 }}>Capacitación práctica en servicio cristiano, eclesiástico y humanitario, en un medio transcultural diferente al tuyo.</p>
              <div className="note">👥 Viajas con tu equipo de estudiantes, dirigido por dos misioneros de campo.</div>
            </div>
            <div className="fright">
              <ul className="chk"><li>🎫 Pasajes aéreo y/o terrestre</li><li>🏠 Hospedaje en campo</li><li>🍲 Alimentación</li><li>🤝 Coordinaciones locales</li></ul>
              <div className="note">💲 Costos varían según la ruta elegida. Consulta informes BCB: <b>+51 984 833 744</b></div>
              <a className="btn btn-line" href="https://wa.me/51984833744?text=Hola%20SEMIT%2C%20quiero%20info%20del%20Campo%20BCB" target="_blank" rel="noreferrer">WhatsApp Campo →</a>
              <Link className="btn btn-blue" to="/contacto" style={{ width: '100%' }}>Inscríbete aquí →</Link>
            </div>
          </div></div>
        )}
      </div>

      <div className="container home-sec rv">
        <div className="showcase"><div className="show-grid">
          <div className="show-l"><img className="show-img" src={IMGS.biblioteca} alt="Cursos" loading="lazy" /><span className="k">INSCRIPCIONES ABIERTAS · TODO EL AÑO</span>
            <h2>Cursos de Biblia, Teología y Misiones.</h2>
            <p className="sub" style={{ margin: '0 0 12px' }}>Inicio cada 1° lunes de mes. 100% prácticos con certificado.</p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}><span style={{ textDecoration: 'line-through', color: '#86868b' }}>$40 regular</span><span className="pill"><b>$30 promo</b></span></div>
            <div className="cta" style={{ justifyContent: 'flex-start' }}><Link className="btn btn-blue" to="/contacto">INSCRÍBETE YA →</Link><Link className="btn btn-line" to="/cursos">Estudiar ›</Link></div></div>
          <div className="show-r">{cursos.slice(0, 4).map(c => <Link key={c.n} className="mini-card" to="/cursos"><span>{c.a} · {c.mod}</span><strong style={{ fontSize: 16 }}>{c.n} · ${c.p}</strong></Link>)}</div>
        </div></div>
      </div>

      <div className="container home-sec rv">
        <div className="news-card">
          <h3>📩 Suscríbete y recibe promociones</h3>
          <p>Cursos nuevos, publicaciones, libros populares y mucho más.</p>
          {!newsOk ? (
            <form className="news-form" onSubmit={e => { e.preventDefault(); if (mail.includes('@')) setNewsOk(true) }}>
              <input type="email" required value={mail} onChange={e => setMail(e.target.value)} placeholder="Tu correo" />
              <button className="btn btn-blue" type="submit">Suscribirme</button>
            </form>
          ) : (
            <div className="note" style={{ textAlign: 'center' }}>✓ ¡Listo! Revisa <b>{mail}</b>, te llegarán las promos.</div>
          )}
        </div>
      </div>

      <div className="marquee"><div>TEOLOGÍA ✦ BIBLIA ✦ MISIONES ✦ BI-VOCACIONAL ✦ TEOLOGÍA ✦ BIBLIA ✦ MISIONES ✦ BI-VOCACIONAL ✦&nbsp;</div></div>
    </div>
  )
}

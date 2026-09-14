import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCountUp, useReveal, IMGS } from '../lib'

const FUNCS = [
  { t: 'Movilización y Envío', d: 'Movilización, Capacitación, Entrenamiento, Envío y Cuidado de Obreros, Líderes, Ministros e Iglesias que contribuirán en la expansión del Evangelio.', e: '🌍' },
  { t: 'Formación Académica', d: 'Formación académica de cristianos, obreros, misioneros y pastores en los principios Bíblicos.', e: '📖' },
  { t: 'Investigación', d: 'Investigación científica que conlleve apoyo a los Ministerios de la Iglesia y al Campo Misionero.', e: '🔬' },
  { t: 'Proyección Ministerial', d: 'Proyección Ministerial al servicio del Señor.', e: '🙌' },
  { t: 'Producción de Obreros', d: 'Producción de Obreros y Misioneros para la Obra del Señor.', e: '🌱' },
]
const FE = [
  { t: 'Un solo Dios Trino', d: 'Creemos en un solo Dios (Dt 6:4), infinito (Sal 147:5), inmutable (He 7:24), perfecto (Mt 5:48), Creador (1 P 4:19) y Sustentador (He 1:3) de todas las cosas; de eterna existencia (Gn 21:33) en las tres personas de la Santísima Trinidad: Padre, Hijo y Espíritu Santo (Mt 28:19).' },
  { t: 'Jesucristo, Dios y Hombre', d: 'Creemos que Jesucristo es verdadero Dios (2 P 1:4) y verdadero Hombre (Mt 8:20), nacido de la Virgen María por obra del Espíritu Santo (Mt 1:18-22); vivió sin pecado (He 4:15), murió en la cruz en sacrificio sustituto (Ro 3:25), fue sepultado, resucitó al tercer día y ascendió corporalmente (Hch 1:9). Hoy está a la diestra de Dios como nuestro representante (Ro 8:34) y único mediador (1 Ti 2:5); vendrá otra vez a establecer su Reino de Justicia y Paz (Hch 1:11). Es el Salvador de todos los que se arrepienten y creen en su obra expiatoria (Jn 3:16).' },
  { t: 'Espíritu Santo', d: 'Creemos que el Espíritu Santo es la tercera persona de la Trinidad (2 Co 13:14), que habita en la Iglesia desde Pentecostés (Hch 2:1-4 / Jn 14:16-17). Convence al mundo de pecado, justicia y juicio (Jn 16:8), da vida nueva al que cree en Cristo (Ro 6:1-4), regenera, confirma que somos hijos de Dios y bautiza al creyente, normalmente en experiencia subsiguiente a la conversión (1 Co 3:16).' },
  { t: 'Sanidad Divina', d: 'Creemos en la sanidad divina por medio de la oración en Jesucristo (Mr 16:18).' },
  { t: 'Las Escrituras', d: 'Creemos en las Sagradas Escrituras: 66 libros del Antiguo y Nuevo Testamento, sobrenatural, plenaria y dinámicamente inspiradas por Dios (2 Ti 3:16).' },
  { t: 'El Hombre', d: 'Creemos que el hombre, creado a imagen y semejanza de Dios (Gn 1:26), cayó por desobediencia (Ro 5:19), trayendo muerte física y espiritual sobre la humanidad (Ro 5:12). Nace con naturaleza pecaminosa y separado de Dios (Ro 3:23).' },
  { t: 'Destino Eterno', d: 'Creemos que el destino del impenitente e incrédulo es existencia en tormento, mientras que el del creyente en Jesucristo es existencia en espíritu, alma y cuerpo glorificado, de eterno gozo y comunión con el Señor (Jn 3:18-21).' },
  { t: 'La Iglesia', d: 'Creemos que la Iglesia Universal, verdadero cuerpo místico de Cristo (1 Co 12:12-27), está constituida por todas las personas renacidas por el Espíritu Santo sobre la base de la fe en Jesucristo (Ro 9:25-26; 1 Co 1:2).' },
  { t: 'Segunda Venida', d: 'Creemos que Jesucristo vendrá corporalmente por segunda vez para establecer su reino (Mt 16:27). Su venida será inminente (Ap 3:11 / Mt 24:36) y pre-milenial (Ap 20).' },
]
const TEAM = [
  { n: 'Jonatan Q.', p: 'PER', img: 'https://i.pravatar.cc/400?img=12', rol: 'Director · Teología', q: 'Formar ministros fieles es mi llamado: te enseño para que enseñes.' },
  { n: 'David R.', p: 'USA', img: 'https://i.pravatar.cc/400?img=13', rol: 'Misiones Transculturales', q: 'El campo me enseñó más que los libros; ahora te toca a ti vivirlo.' },
  { n: 'Wilber Q.', p: 'PER', img: 'https://i.pravatar.cc/400?img=53', rol: 'Docente Biblia', q: 'La Palabra es práctica: la estudiamos y la obedecemos juntos.' },
  { n: 'Sophia Ann A.', p: 'USA', img: 'https://i.pravatar.cc/400?img=47', rol: 'Capellanía · Cuidado', q: 'Cuidamos tu corazón mientras Dios afirma tu llamado.' },
  { n: 'David Q.', p: 'PER', img: 'https://i.pravatar.cc/400?img=59', rol: 'Bi-vocacional · Carpintería', q: 'Con tus manos también se predica: oficio y ministerio van juntos.' },
  { n: 'Juana B.', p: 'ARG', img: 'https://i.pravatar.cc/400?img=32', rol: 'Docente Ministerios', q: 'Servir con alegría se entrena: aquí lo practicamos cada semana.' },
  { n: 'Samuel Q.', p: 'PER', img: 'https://i.pravatar.cc/400?img=15', rol: 'Evangelismo · Campo', q: 'Salimos a las calles y comunidades: la teoría se vuelve misión.' },
  { n: 'Abigail R.', p: 'USA', img: 'https://i.pravatar.cc/400?img=44', rol: 'Adoración · Alabanza', q: 'Adoramos antes de salir: un misionero lleno del Espíritu.' },
  { n: 'Enoc Q.', p: 'PER', img: 'https://i.pravatar.cc/400?img=68', rol: 'Logística BCB', q: 'Todo viaje misionero empieza con orden y oración.' },
  { n: 'Alejandro C.', p: 'REP DOM', img: 'https://i.pravatar.cc/400?img=60', rol: 'Plantación de Iglesias', q: 'Del Caribe a Cusco: levantar iglesias que envían.' },
  { n: 'Shiomara C.', p: 'PER', img: 'https://i.pravatar.cc/400?img=26', rol: 'Educación Cristiana', q: 'Enseñar a otros a enseñar: así se multiplica la obra.' },
  { n: 'Ruben C.', p: 'PER', img: 'https://i.pravatar.cc/400?img=70', rol: 'Bi-vocacional · Gastronomía', q: 'Cocinar también es servir: excelencia para la gloria de Dios.' },
  { n: 'Elías Q.', p: 'PER', img: 'https://i.pravatar.cc/400?img=33', rol: 'Jóvenes · Movilización', q: 'Tu generación es enviada: descubre tu ruta en el BCB.' },
]
const FLAG = { PER: '🇵🇪', USA: '🇺🇸', ARG: '🇦🇷', 'REP DOM': '🇩🇴' }
const GRAD = ['linear-gradient(135deg,#0071e3,#00c6ff)', 'linear-gradient(135deg,#764ba2,#667eea)', 'linear-gradient(135deg,#0ba360,#3cba92)', 'linear-gradient(135deg,#f7971e,#ffd200)', 'linear-gradient(135deg,#ec4899,#8b5cf6)', 'linear-gradient(135deg,#0f172a,#475569)']

function Stat({ v, label }) {
  const [s, setS] = useState(false)
  const [n] = useCountUp(v, s)
  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setS(true); return }
    const io = new IntersectionObserver(e => { if (e[0].isIntersecting) { setS(true); io.disconnect() } })
    const el = document.getElementById('ns-' + label)
    if (el) io.observe(el)
    return () => io.disconnect()
  }, [label])
  return <div className="stat4" id={'ns-' + label}><b>{n.toLocaleString('es-PE')}+</b><span>{label}</span></div>
}

export default function Nosotros() {
  const [ft, setFt] = useState(0)
  const [fe, setFe] = useState(0)
  const [filtro, setFiltro] = useState('Todos')
  const [sel, setSel] = useState(0)
  useReveal('/nosotros')
  const paises = ['Todos', 'PER', 'USA', 'ARG', 'REP DOM']
  const vis = TEAM.map((m, k) => ({ ...m, k })).filter(m => filtro === 'Todos' || m.p === filtro)
  const cur = vis.length ? vis[Math.min(sel, vis.length - 1)] : null
  const go = d => setSel(s => (s + d + vis.length) % Math.max(1, vis.length))
  const cls3d = idx => {
    if (!vis.length) return 'hidden'
    const off = (idx - sel + vis.length) % vis.length
    if (off === 0) return 'center'
    if (off === 1) return 'right-1'
    if (off === 2) return 'right-2'
    if (off === vis.length - 1) return 'left-1'
    if (off === vis.length - 2) return 'left-2'
    return 'hidden'
  }
  return (
    <div className="pg pg-nos"><div className="container sec">
      <div className="hsec rv"><span className="pill">📖 Nuestra historia</span>
        <h1>Te enseñamos para que enseñes.</h1>
        <p className="sub">Es un hecho establecido desde hace mucho tiempo: formar, enviar y cuidar obreros. — 2 Tim 2:2</p>
        <img className="page-hero" src={IMGS.iglesia} alt="Nuestra historia" loading="lazy" /></div>
      <div className="stat-grid rv"><Stat v={3587} label="Seguidores extranjeros" /><Stat v={60} label="Profesores Certificados" /><Stat v={475} label="Estudiantes inscritos" /><Stat v={275} label="Misioneros enviados" /></div>

      <div className="fcard rv"><div className="fgrid">
        <div className="fleft"><span className="k">QUIÉNES SOMOS</span><h3>Organización Misionera Internacional</h3>
          <p><b>SEMIT</b> es una organización Misionera Cristiana Evangélica de alcance internacional. Brindamos Educación, Capacitación y Entrenamiento en Teología, Biblia y Misiones para formar ministros del Evangelio en distintas áreas del servicio cristiano.</p>
          <p style={{ marginTop: 10 }}>Estamos fuertemente dedicados a la <b>Educación, Capacitación, Formación, Envío y Supervisión</b> de Obreros, Ministros, Misioneros e Iglesias que contribuyan a la expansión del Evangelio.</p>
          <div className="tags"><span>🎓 Educación</span><span>📦 Envío</span><span>❤️ Cuidado</span></div>
          <Link className="btn btn-blue" to="/contacto">Ser parte →</Link></div>
        <div className="fright"><div className="versiculo" style={{ margin: 0 }}>“Lo que has oído... encarga a hombres fieles que sean idóneos para enseñar también a otros.” — 2 Tim 2:2</div>
          <ul className="chk"><li>✅ Docentes certificados</li><li>✅ Misioneros activos en campo</li><li>✅ Formación integral + oficio</li></ul></div>
      </div></div>

      <div className="hsec rv" style={{ marginTop: 28 }}><span className="pill">⚙️ Funciones</span><h2>Son funciones de SEMIT</h2></div>
      <div className="seg-wrap rv">{FUNCS.map((f, k) => <button key={f.t} className={`segbtn ${k === ft ? 'on' : ''}`} onClick={() => setFt(k)}>{f.e} {f.t}</button>)}</div>
      <div className="feat-big rv" key={ft}><span style={{ fontSize: 30 }}>{FUNCS[ft].e}</span><h3>{FUNCS[ft].t}</h3><p>{FUNCS[ft].d}</p>
        <div className="dots">{FUNCS.map((_, k) => <button key={k} aria-label={'func ' + k} className={`dot ${k === ft ? 'on' : ''}`} onClick={() => setFt(k)} />)}</div></div>

      <div className="hsec rv" style={{ marginTop: 28 }}><span className="pill">✝️ Declaración de Fe · {FE.length} verdades</span><h2>En esto creemos</h2>
        <p>La posición doctrinal del SEMIT se expresa en la siguiente Declaración de Fe.</p></div>
      <div className="fe-list rv">{FE.map((f, k) => (
        <div key={f.t} className={`fe-item ${fe === k ? 'open' : ''}`}>
          <button onClick={() => setFe(fe === k ? -1 : k)}><span><b style={{ color: '#0071e3', marginRight: 8 }}>{k + 1}</b>{f.t}</span><span>{fe === k ? '−' : '+'}</span></button>
          {fe === k && <p>{f.d}</p>}
        </div>))}</div>

      <div className="hsec rv" style={{ marginTop: 28 }}><span className="pill">👥 Conozca a nuestro equipo</span><h2>Nuestro equipo · {TEAM.length}</h2>
        <p>Docentes y misioneros que te acompañarán en tu formación.</p></div>
      <div className="seg-wrap rv">{paises.map(p => <button key={p} className={`segbtn ${filtro === p ? 'on' : ''}`} onClick={() => { setFiltro(p); setSel(0) }}>{p === 'Todos' ? '🌎 Todos' : `${FLAG[p]} ${p}`}</button>)}</div>
      <div className="team3d rv">
        <div className="about-title">OUR TEAM</div>
        <div className="carousel-container">
          <button className="nav-arrow left" aria-label="anterior" onClick={() => go(-1)}>‹</button>
          <div className="carousel-track">
            {vis.map((m, idx) => (
              <div key={m.k} className={`card3d ${cls3d(idx)}`} onClick={() => setSel(idx)}>
                <img src={m.img} alt={m.n} loading="lazy" />
              </div>))}
          </div>
          <button className="nav-arrow right" aria-label="siguiente" onClick={() => go(1)}>›</button>
        </div>
        {cur && (
          <div className="member-info" key={cur.k}>
            <h2 className="member-name">{cur.n} <small style={{ fontSize: 16 }}>{FLAG[cur.p]} {cur.p}</small></h2>
            <p className="member-role">{cur.rol}</p>
            <div className="nos-test" style={{ marginTop: 10 }}><p>“{cur.q}”</p><b>{cur.n} · docente y misionero SEMIT</b></div>
          </div>
        )}
        <div className="dots">{vis.map((_, idx) => <button key={idx} aria-label={'ir a ' + idx} className={`dot ${idx === sel ? 'on' : ''}`} onClick={() => setSel(idx)} />)}</div>
      </div>
    </div></div>
  )
}

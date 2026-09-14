import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Inicio from './pages/Inicio.jsx'
import Cursos from './pages/Cursos.jsx'
import Nosotros from './pages/Nosotros.jsx'
import Contacto from './pages/Contacto.jsx'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Nav({ theme, onTheme }) {
  const [m, setM] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setM(false) }, [pathname])
  const cls = ({ isActive }) => (isActive ? 'active' : '')
  return (
    <div className="nav"><div className="nav-in">
      <Link to="/" className="brand"><div className="mark">S</div><div><strong>SEMIT</strong><small>SEMINARIO · CUSCO</small></div></Link>
      <div className="links">
        <NavLink to="/" className={cls}>Inicio</NavLink>
        <NavLink to="/cursos" className={cls}>Cursos</NavLink>
        <NavLink to="/nosotros" className={cls}>Nosotros</NavLink>
        <NavLink to="/contacto" className={cls}>Contacto</NavLink>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="theme-btn" onClick={onTheme} aria-label="cambiar tema">{theme === 'dark' ? '☀️' : '🌙'}</button>
        <Link to="/contacto" className="btn btn-blue" style={{ padding: '9px 20px' }}>Inscríbete</Link>
        <button className="burger" onClick={() => setM(!m)}>☰</button>
      </div>
    </div>
      <div className={`mnav ${m ? 'show' : ''}`}>
        <Link to="/">Inicio</Link><Link to="/cursos">Cursos</Link><Link to="/nosotros">Nosotros</Link><Link to="/contacto">Contacto</Link>
      </div>
    </div>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('semit-theme') || 'light' } catch { return 'light' } })
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('semit-theme', theme) } catch {} }, [theme])
  return (
    <>
      <ScrollTop /><Nav theme={theme} onTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
      <div key={pathname} className="page-enter">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/bcb" element={<Inicio />} />
          <Route path="*" element={<Inicio />} />
        </Routes>
      </div>
      <footer><div className="container foot">
        <strong>SEMIT.org · {pathname === '/' ? 'INICIO' : pathname.slice(1).toUpperCase()}</strong>
        <span>© 2026 · Cusco — Perú · <Link to="/">Inicio</Link> · <Link to="/contacto">Contacto</Link> · +51 984 833 744</span>
      </div></footer>
    </>
  )
}

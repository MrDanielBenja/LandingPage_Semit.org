import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { NAV_LINKS } from '../../shared/config/site'
import { useTheme } from '../providers/ThemeProvider'

export function Nav() {
  const [m, setM] = useState(false)
  const { pathname } = useLocation()
  const { theme, toggle } = useTheme()
  useEffect(() => { setM(false) }, [pathname])
  const cls = ({ isActive }) => (isActive ? 'active' : '')
  return (
    <div className="nav"><div className="nav-in">
      <Link to="/" className="brand"><div className="mark">S</div><div><strong>SEMIT</strong><small>SEMINARIO · CUSCO</small></div></Link>
      <div className="links">
        {NAV_LINKS.map(l => <NavLink key={l.to} to={l.to} className={cls}>{l.label}</NavLink>)}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="theme-btn" onClick={toggle} aria-label="cambiar tema">{theme === 'dark' ? '☀️' : '🌙'}</button>
        <Link to="/contacto" className="btn btn-blue" style={{ padding: '9px 20px' }}>Inscríbete</Link>
        <button className="burger" onClick={() => setM(!m)}>☰</button>
      </div>
    </div>
      <div className={`mnav ${m ? 'show' : ''}`}>
        {NAV_LINKS.map(l => <Link key={l.to} to={l.to}>{l.label}</Link>)}
      </div>
    </div>
  )
}

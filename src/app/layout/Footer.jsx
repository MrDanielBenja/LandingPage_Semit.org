import { Link, useLocation } from 'react-router-dom'
import { SITE } from '../../shared/config/site'

export function Footer() {
  const { pathname } = useLocation()
  return (
    <footer><div className="container foot">
      <strong>{SITE.name}.org · {pathname === '/' ? 'INICIO' : pathname.slice(1).toUpperCase()}</strong>
      <span>© 2026 · {SITE.city} · <Link to="/">Inicio</Link> · <Link to="/contacto">Contacto</Link> · {SITE.phone}</span>
    </div></footer>
  )
}

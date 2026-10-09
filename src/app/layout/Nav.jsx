import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTheme } from '../providers/ThemeProvider'
import { useLang } from '../providers/LangProvider'
import { useContent } from '../../core/cms/contentStore'
import { fmtCssKey } from '../../core/cms/fmt'
import { safeHref, safeSrc } from '../../core/cms/sanitize'
import { DEFAULT_SITE } from '../../core/cms/defaultSite'
import { PORTAL_URL } from '../../shared/config/site'

const TO_KEY = { '/': 'nav.inicio', '/nosotros': 'nav.nosotros', '/niveles': 'nav.niveles', '/cursos': 'nav.cursos', '/eventos': 'nav.eventos', '/contacto': 'nav.contacto' }

const FlagES = () => (
  <svg viewBox="0 0 22 16" aria-hidden="true"><rect width="22" height="16" rx="3" fill="#AA151B" /><rect y="4" width="22" height="8" fill="#F1BF00" /></svg>
)
const FlagEN = () => (
  <svg viewBox="0 0 22 16" aria-hidden="true"><rect width="22" height="16" rx="3" fill="#fff" stroke="rgba(0,0,0,.15)" /><rect x="9" width="4" height="16" fill="#CE1124" /><rect y="6" width="22" height="4" fill="#CE1124" /></svg>
)

export function Nav({ preview }) {
  const [m, setM] = useState(false)
  const { pathname } = useLocation()
  const { theme, toggle } = useTheme()
  const { lang, setLang, t } = useLang()
  useEffect(() => { setM(false) }, [pathname])
  const cls = ({ isActive }) => (isActive ? 'active' : '')
  const { data: saved } = useContent('site', DEFAULT_SITE)
  const siteCms = preview || saved
  const s = (siteCms && siteCms.site) || DEFAULT_SITE.site
  const LINKS = (Array.isArray(siteCms.nav) && siteCms.nav.length ? siteCms.nav : DEFAULT_SITE.nav).map(l => ({
    to: l.to, label: (lang === 'en' ? l.label_en : l.label_es) || t(TO_KEY[l.to] || 'nav.inicio'),
  }))
  const portalUrl = safeHref(s.portalUrl || PORTAL_URL, PORTAL_URL)
  const logo = safeSrc(s.logo || '/assets/logo/logo.png', '/assets/logo/logo.png')
  const logoSize = Number(s.logoSize) || 132
  return (
    <div className="nav"><div className="nav-in">
      <Link to="/" className="brand brand-logo"><img className="brand-logo-img" src={logo} alt={s.name || 'SEMIT'} loading="eager" style={{ width: logoSize }} /><div><strong style={fmtCssKey(siteCms, 'site.brand')}>{s.name || 'SEMIT'}</strong><small>{t('nav.brandSub')}</small></div></Link>
      <div className="links">
        {LINKS.map(l => <NavLink key={l.to} to={l.to} className={cls} style={fmtCssKey(siteCms, 'site.nav')}>{l.label}</NavLink>)}
      </div>
      <div className="nav-actions">
        <div className="lang-flags nav-opt">
          <button className={`lang-btn ${lang === 'es' ? 'on' : ''}`} onClick={() => setLang('es')} aria-label="Español" title="Español"><FlagES /></button>
          <button className={`lang-btn ${lang === 'en' ? 'on' : ''}`} onClick={() => setLang('en')} aria-label="English" title="English"><FlagEN /></button>
        </div>
        <button className="theme-btn nav-opt" onClick={toggle} aria-label="cambiar tema">{theme === 'dark' ? '☀️' : '🌙'}</button>
        <a href={portalUrl} target="_blank" rel="noreferrer" className="btn btn-blue portal-btn">{t('nav.portal')}</a>
        <button className="burger" onClick={() => setM(!m)} aria-label="menú" aria-expanded={m}><span className="burger-ico"><i /><i /><i /></span></button>
      </div>
    </div>
      <div className={`mnav ${m ? 'show' : ''}`}>
        {LINKS.map(l => <Link key={l.to} to={l.to}>{l.label}</Link>)}
        <a href={portalUrl} target="_blank" rel="noreferrer">{t('nav.portal')}</a>
        <div className="mnav-opts">
          <div className="lang-flags">
            <button className={`lang-btn ${lang === 'es' ? 'on' : ''}`} onClick={() => setLang('es')} aria-label="Español" title="Español"><FlagES /></button>
            <button className={`lang-btn ${lang === 'en' ? 'on' : ''}`} onClick={() => setLang('en')} aria-label="English" title="English"><FlagEN /></button>
          </div>
          <button className="theme-btn" onClick={toggle} aria-label="cambiar tema">{theme === 'dark' ? '☀️' : '🌙'}</button>
        </div>
      </div>
    </div>
  )
}

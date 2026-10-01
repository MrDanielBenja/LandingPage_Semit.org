import { Link, useLocation } from 'react-router-dom'
import { SITE } from '../../shared/config/site'
import { useLang } from '../providers/LangProvider'
import { useContent } from '../../core/cms/contentStore'
import { fmtCssKey } from '../../core/cms/fmt'
import { DEFAULT_SITE } from '../../core/cms/defaultSite'

export function Footer({ preview }) {
  const { pathname } = useLocation()
  const { lang, t } = useLang()
  const { data: saved } = useContent('site', DEFAULT_SITE)
  const siteCms = preview || saved
  const s = (siteCms && siteCms.site) || DEFAULT_SITE.site
  const f = (siteCms && siteCms.footer) || DEFAULT_SITE.footer
  const nav = (Array.isArray(siteCms.nav) && siteCms.nav.length ? siteCms.nav : DEFAULT_SITE.nav)
  const hit = nav.find(l => l.to === pathname)
  const cur = hit ? (lang === 'en' ? hit.label_en : hit.label_es) : t(`nav.${pathname.slice(1) || 'inicio'}`)
  const name = s.name || SITE.name
  const city = (lang === 'en' ? s.city_en : s.city_es) || SITE.city
  const phone = s.phone || SITE.phone
  const copy = (lang === 'en' ? f.copy_en : f.copy_es) || '© 2026'
  return (
    <footer><div className="container foot">
      <strong style={fmtCssKey(siteCms, 'site.footer')}>{name}.org · {String(cur || '').toUpperCase()}</strong>
      <span>{copy} · {city} · <Link to="/">{t('footer.inicio')}</Link> · <Link to="/contacto">{t('footer.contacto')}</Link> · {phone}</span>
    </div></footer>
  )
}

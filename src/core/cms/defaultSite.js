import { SITE, NAV_LINKS } from '../../shared/config/site'
import { ES } from '../../shared/i18n/dict_es'
import { EN } from '../../shared/i18n/dict_en'

const EN_NAV = { '/': EN.nav.inicio, '/nosotros': EN.nav.nosotros, '/niveles': EN.nav.niveles, '/cursos': EN.nav.cursos, '/eventos': EN.nav.eventos, '/contacto': EN.nav.contacto }

export const DEFAULT_SITE = {
  site: {
    name: SITE.name,
    full_es: SITE.full, full_en: 'Theological and Missionary Seminary',
    city_es: SITE.city, city_en: 'Cusco — Peru',
    address_es: SITE.address, address_en: 'Huayllapampa s/n, San Jerónimo — Cusco, Peru',
    phone: SITE.phone, phoneRaw: SITE.phoneRaw, wa: SITE.wa,
    email: SITE.email, facebook: SITE.facebook,
    mapsQuery: SITE.mapsQuery,
    portalUrl: 'https://demo.casa-peniel.com/',
    logo: 'assets/logo/logo.png',
    logoSize: 132,
  },
  nav: NAV_LINKS.map(l => ({ to: l.to, label_es: l.label, label_en: EN_NAV[l.to] || l.label })),
  footer: { copy_es: '© 2026', copy_en: '© 2026' },
  fmt: {},
}

export const SITE_ASSETS = ['assets/logo/logo.png']

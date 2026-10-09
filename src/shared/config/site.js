export const SITE = {
  name: 'SEMIT',
  full: 'Seminario Teológico y Misionero',
  city: 'Cusco — Perú',
  address: 'Huayllapampa s/n, San Jerónimo — Cusco, Perú',
  mapsQuery: 'SEMIT+Huayllapampa+San+Jeronimo+Cusco',
  phone: '+51 984 833 744',
  phoneRaw: '+51984833744',
  wa: '51984833744',
  email: 'contacto@semit.org',
  facebook: 'https://www.facebook.com/search/top?q=semit',
}

export const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/niveles', label: 'Niveles' },
  { to: '/cursos', label: 'Cursos' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/contacto', label: 'Contacto' },
]

const envPortal = (() => {
  try {
    const v = import.meta?.env?.VITE_PORTAL_URL
    return typeof v === 'string' ? v.trim().replace(/\/$/, '') : ''
  } catch {
    return ''
  }
})()

export const PORTAL_URL = envPortal || 'https://demo.casa-peniel.com'

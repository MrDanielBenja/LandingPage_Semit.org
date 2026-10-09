export const ICON_DEFAULTS = {
  inicio: { scrollCue: '↓', teaserPin: '📍', teaserClock: '🕘', topStar: '⭐', topTeam: '👥', topWeeks: '🕘', prev: '‹', next: '›' },
  niveles: { search: '🔍', sem: '🕘', lec: '📚', star: '⭐', team: '👥', empty: '🔍', maeTodos: '🎓' },
  cursosPage: { search: '🔍', sem: '🕘', lec: '📚', star: '⭐', team: '👥', empty: '🔍' },
  eventos: { search: '🔍', evDate: '📅', evClock: '🕘', evPin: '📍', evStar: '⭐', empty: '📅', bcbPin: '📍' },
  nosotros: { search: '🔍', prev: '‹', next: '›' },
  contacto: { check: '✓' },
  site: {},
}

export const ICON_LABELS = {
  scrollCue: 'Flecha bajar (portada)',
  teaserPin: 'Pin lugar (teaser)',
  teaserClock: 'Reloj hora (teaser)',
  topStar: 'Estrella rating',
  topTeam: 'Equipo estudiantes',
  topWeeks: 'Reloj semanas',
  search: 'Lupa buscador',
  sem: 'Reloj semanas',
  lec: 'Libro lecciones',
  star: 'Estrella rating',
  team: 'Equipo estudiantes',
  empty: 'Icono vacío',
  maeTodos: 'Icono maestrías (todas)',
  evDate: 'Calendario fecha',
  evClock: 'Reloj hora',
  evPin: 'Pin lugar',
  evStar: 'Estrella rating',
  bcbPin: 'Pin nota campo BCB',
  prev: 'Anterior',
  next: 'Siguiente',
  check: 'Palomita ✓',
  check: 'Palomita ✓',
  waIcon: 'Icono WhatsApp',
  sedeIcon: 'Icono sede',
  mailIcon: 'Icono email',
}

export function iconOf(cms, key, fb) {
  const v = cms && cms.icons ? cms.icons[key] : undefined
  if (v === '' || v == null) return fb
  return v
}

export function iconsWithDefaults(page) {
  return { ...(ICON_DEFAULTS[page] || {}) }
}

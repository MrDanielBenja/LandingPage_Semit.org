import { apiBase } from './apiBase'
import { safeSrc } from './sanitize'

export function resolveAsset(url) {
  const BASE = apiBase()
  if (!url) return ''
  const raw = String(url)
  if (/^(https?:|data:|blob:)/i.test(raw)) return safeSrc(raw, '')
  const u = raw.replace(/^\.?\//, '')
  if (u.startsWith('api/')) return BASE ? `${BASE}/${u}` : `/${u}`
  if (u.startsWith('assets/')) return safeSrc(`/${u}`, '')
  return safeSrc(`/${u}` || raw, '')
}

export function bgPos(x = 50, y = 50) {
  return `${x}% ${y}%`
}

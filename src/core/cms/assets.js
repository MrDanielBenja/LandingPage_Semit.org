import { apiBase } from './apiBase'

export function resolveAsset(url) {
  const BASE = apiBase()
  if (!url) return ''
  if (/^(https?:|data:|blob:)/i.test(url)) return url
  const u = String(url).replace(/^\.?\//, '')
  if (u.startsWith('api/')) return BASE ? `${BASE}/${u}` : `/${u}`
  return u
}

export function bgPos(x = 50, y = 50) {
  return `${x}% ${y}%`
}

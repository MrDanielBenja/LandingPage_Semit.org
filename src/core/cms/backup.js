import { DEFAULT_INICIO } from './defaultInicio'
import { DEFAULT_NOSOTROS } from './defaultNosotros'
import { DEFAULT_NIVELES } from './defaultNiveles'
import { DEFAULT_CURSOS_PAGE } from './defaultCursosPage'
import { DEFAULT_EVENTOS } from './defaultEventos'
import { DEFAULT_CONTACTO } from './defaultContacto'
import { DEFAULT_SITE } from './defaultSite'

export const BACKUP_PAGES = ['inicio', 'nosotros', 'niveles', 'cursosPage', 'eventos', 'contacto', 'site']
export const BACKUP_DEFAULTS = {
  inicio: DEFAULT_INICIO,
  nosotros: DEFAULT_NOSOTROS,
  niveles: DEFAULT_NIVELES,
  cursosPage: DEFAULT_CURSOS_PAGE,
  eventos: DEFAULT_EVENTOS,
  contacto: DEFAULT_CONTACTO,
  site: DEFAULT_SITE,
}

const LS = 'semit-cms:'
const AUTO_KEY = 'semit-cms:autos'
const LAST_KEY = 'semit-cms:lastexport'

export function readPageLocal(key) {
  try {
    const raw = localStorage.getItem(LS + key)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function collectBackup() {
  const pages = {}
  for (const k of BACKUP_PAGES) {
    pages[k] = readPageLocal(k) || BACKUP_DEFAULTS[k]
  }
  return {
    app: 'semit-cms',
    version: 1,
    fecha: new Date().toISOString(),
    pages,
  }
}

export function validateBackup(b) {
  if (!b || typeof b !== 'object') return 'Archivo inválido'
  if (b.app !== 'semit-cms') return 'No es un respaldo SEMIT'
  if (!b.pages || typeof b.pages !== 'object') return 'Sin páginas'
  const known = BACKUP_PAGES.filter(k => b.pages[k] && typeof b.pages[k] === 'object')
  if (!known.length) return 'Sin páginas conocidas'
  return null
}

export function downloadBackup(bundle) {
  const blob = new Blob([JSON.stringify(bundle, null, 1)], { type: 'application/json' })
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  const name = `semit-respaldo-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}.semit.json`
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 5000)
  try { localStorage.setItem(LAST_KEY, JSON.stringify(bundle)) } catch {}
  return name
}

export function readLastExport() {
  try {
    const raw = localStorage.getItem(LAST_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function short(v) {
  if (v === undefined) return '—'
  if (v === null) return 'null'
  if (typeof v === 'string') return v.length > 80 ? v.slice(0, 80) + '…' : (v || '—')
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  if (Array.isArray(v)) return `[${v.length}]`
  if (typeof v === 'object') {
    const k = Object.keys(v)
    return k.length ? `{${k.slice(0, 3).join(', ')}${k.length > 3 ? ` +${k.length - 3}` : ''}}` : '{}'
  }
  return String(v)
}

export function deepDiff(a, b, path = '', out = [], depth = 0) {
  if (depth > 4 || out.length > 200) return out
  if (JSON.stringify(a) === JSON.stringify(b)) return out
  if (Array.isArray(a) && Array.isArray(b)) {
    const n = Math.max(a.length, b.length)
    for (let k = 0; k < n; k++) {
      if (JSON.stringify(a[k]) === JSON.stringify(b[k])) continue
      if (a[k] && b[k] && typeof a[k] === 'object' && typeof b[k] === 'object') {
        deepDiff(a[k], b[k], `${path}[${k}]`, out, depth + 1)
      } else {
        out.push({ path: `${path}[${k}]`, from: short(a[k]), to: short(b[k]), kind: a[k] === undefined ? 'add' : b[k] === undefined ? 'del' : 'edit' })
      }
    }
    return out
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      deepDiff(a[k], b[k], path ? `${path}.${k}` : k, out, depth + 1)
    }
    return out
  }
  out.push({ path: path || '(raíz)', from: short(a), to: short(b), kind: a === undefined ? 'add' : b === undefined ? 'del' : 'edit' })
  return out
}

export function diffDetailSinceLast(current) {
  const last = readLastExport()
  if (!last || !last.pages) return { last: null, changes: null }
  const changes = {}
  for (const k of BACKUP_PAGES) {
    const d = deepDiff(last.pages?.[k], current?.[k])
    if (d.length) changes[k] = d
  }
  return { last, changes }
}

export function pushAuto(fecha) {
  try {
    const arr = JSON.parse(localStorage.getItem(AUTO_KEY) || '[]')
    arr.unshift({ fecha, id: Date.now() })
    localStorage.setItem(AUTO_KEY, JSON.stringify(arr.slice(0, 10)))
  } catch {}
}

export function listAutos() {
  try { return JSON.parse(localStorage.getItem(AUTO_KEY) || '[]') } catch { return [] }
}

export function diffSummary(a, b) {
  const out = []
  for (const k of BACKUP_PAGES) {
    const x = JSON.stringify(a?.[k] ?? null)
    const y = JSON.stringify(b?.[k] ?? null)
    if (x !== y) out.push(k)
  }
  return out
}

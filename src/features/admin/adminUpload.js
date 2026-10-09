import { apiBase } from '../../core/cms/apiBase'
import { getAdminToken } from '../../core/cms/adminToken'
import { validateFile } from '../../core/cms/media'
import { safeSrc } from '../../core/cms/sanitize'

function authHeaders() {
  const t = getAdminToken()
  return { 'Content-Type': 'application/json', ...(t ? { 'x-admin-token': t } : {}) }
}

function fileToDataUrl(file) {
  return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result)
    r.onerror = rej
    r.readAsDataURL(file)
  })
}

function joinUrl(url) {
  const BASE = apiBase()
  const u = String(url || '')
  if (/^https?:/i.test(u)) return safeSrc(u, u)
  return safeSrc(BASE ? `${BASE}/${u.replace(/^\//, '')}` : (u.startsWith('/') ? u : `/${u}`), u)
}

function relativeUrl(url) {
  const u = String(url || '')
  if (/^https?:/i.test(u)) return safeSrc(u, u)
  const clean = u.replace(/^\.?\//, '')
  if (clean.startsWith('api/')) return safeSrc(`/${clean}`, u)
  return safeSrc(u, u)
}

async function verifyStored(url) {
  const src = joinUrl(url)
  try {
    const r = await fetch(src, { method: 'HEAD' })
    if (r.ok) return true
    const g = await fetch(src, { method: 'GET' })
    return g.ok
  } catch { return false }
}

async function postBinary(file, kind) {
  const BASE = apiBase()
  const t = getAdminToken()
  const r = await fetch(`${BASE}/api/v1/uploads/binary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'x-file-name': encodeURIComponent(file.name),
      ...(kind ? { 'x-file-kind': kind } : {}),
      ...(t ? { 'x-admin-token': t } : {}),
    },
    body: file,
  })
  const j = await r.json().catch(() => ({}))
  if (!r.ok || !j.ok) throw new Error(j.error || `api ${r.status}`)
  const ok = await verifyStored(String(j.url || ''))
  if (!ok) throw new Error('no_persisted')
  const rel = relativeUrl(String(j.url || ''))
  rememberUpload(rel, j.kind)
  return { ok: true, url: rel, kind: j.kind, mime: j.mime, bytes: j.bytes }
}

function friendlyUploadError(e) {
  const m = String(e?.message || e || '')
  if (m === 'unauthorized' || m === 'api 401') return 'Sesión vencida: entra de nuevo al CMS e intenta otra vez'
  if (m === 'too_large' || m === 'api 413') return 'Archivo muy pesado para el servidor: comprímelo o usa un video más corto'
  if (m === 'ext') return 'Extensión no permitida: usa JPG, PNG, WebP, GIF, AVIF, MP4, WebM u OGG'
  if (m === 'format') return 'El archivo parece corrupto o es HEIC/BMP/SVG (no soportados): expórtalo como JPG o PNG'
  if (m === 'persist' || m === 'api 500' || m === 'no_persisted') return 'La API dijo OK pero el archivo NO quedó guardado: revisa permisos de uploads/ en el servidor (carpetas 755) e intenta de nuevo'
  if (/Failed to fetch|NetworkError|Load failed|fetch failed|api \d+/.test(m)) return 'Sin conexión a la API: la foto NO se guardó. Revisa /api/v1/health e intenta de nuevo'
  return m || 'No se pudo subir'
}

export async function uploadMedia(file, kinds = 'both') {
  const v = validateFile(file, kinds)
  if (!v.ok) throw new Error(v.error)
  const BASE = apiBase()
  try {
    return await postBinary(file, kinds === 'both' ? undefined : v.kind)
  } catch (e) {
    if (/^(ext|format|too_large|unauthorized|persist|no_persisted|api 401|api 413|api 500)$/.test(e.message)) throw new Error(friendlyUploadError(e))
  }
  try {
    const url = await fileToDataUrl(file)
    const r = await fetch(`${BASE}/api/v1/uploads`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name: file.name, dataUrl: url, kind: v.kind }),
    })
    const j = await r.json().catch(() => ({}))
    if (!r.ok || !j.ok) throw new Error(j.error || `api ${r.status}`)
    const ok = await verifyStored(String(j.url || ''))
    if (!ok) throw new Error('no_persisted')
    const rel = relativeUrl(String(j.url || ''))
    rememberUpload(rel, j.kind)
    return { ok: true, url: rel, kind: j.kind, mime: j.mime, bytes: j.bytes }
  } catch (e) {
    throw new Error(friendlyUploadError(e))
  }
}

export async function uploadImage(file) {
  return uploadMedia(file, 'image')
}

export async function uploadVideo(file) {
  return uploadMedia(file, 'video')
}

const RECENT_KEY = 'semit-cms:uploads'

export function rememberUpload(url, kind) {
  try {
    const u = String(url || '')
    if (!u) return
    const arr = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
    const next = [{ url: u, kind, at: Date.now() }, ...arr.filter(x => x && x.url !== u)]
    localStorage.setItem(RECENT_KEY, JSON.stringify(next.slice(0, 60)))
  } catch {}
}

export function recentUploads(kinds = 'both') {
  try {
    const arr = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
    return arr
      .filter(x => x && x.url && (kinds === 'both' || !x.kind || x.kind === (kinds === 'video' ? 'video' : 'image') || !kinds))
      .map(x => x.url)
  } catch { return [] }
}

export async function listUploaded(kinds = 'both') {
  const BASE = apiBase()
  const t = getAdminToken()
  try {
    const r = await fetch(`${BASE}/api/v1/uploads/list?kind=${kinds === 'video' ? 'video' : kinds === 'image' ? 'image' : 'both'}`, {
      headers: { ...(t ? { 'x-admin-token': t } : {}) },
    })
    const j = await r.json().catch(() => ({}))
    if (r.ok && j && j.ok && Array.isArray(j.items)) return j.items
  } catch {}
  return []
}

export async function deleteUpload(url) {
  const BASE = apiBase()
  const t = getAdminToken()
  const r = await fetch(`${BASE}/api/v1/uploads`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...(t ? { 'x-admin-token': t } : {}) },
    body: JSON.stringify({ url }),
  })
  const j = await r.json().catch(() => ({}))
  if (!r.ok || !j.ok) {
    const code = j.error || `api ${r.status}`
    if (code === 'not_found') throw new Error('El archivo ya no existe en el servidor')
    if (code === 'unauthorized' || code === 'api 401') throw new Error('Sesión vencida: entra de nuevo al CMS e intenta otra vez')
    throw new Error(code)
  }
  try {
    const arr = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
    localStorage.setItem(RECENT_KEY, JSON.stringify(arr.filter(x => x && x.url !== url)))
  } catch {}
  return true
}

export function resolveUpload(url) {
  const BASE = apiBase()
  if (!url) return ''
  const raw = String(url)
  if (/^(https?:|data:|blob:)/i.test(raw)) return safeSrc(raw, '')
  const u = raw.replace(/^\.?\//, '')
  if (u.startsWith('api/')) return safeSrc(BASE ? `${BASE}/${u}` : `/${u}`, '')
  if (u.startsWith('assets/')) return safeSrc(`/${u}`, '')
  return safeSrc(`/${u}`, '')
}

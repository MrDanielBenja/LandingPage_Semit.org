import { apiBase } from '../../core/cms/apiBase'
import { getAdminToken } from '../../core/cms/adminToken'
import { LOCAL_FALLBACK_MAX_MB, formatBytes, validateFile } from '../../core/cms/media'

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
  if (url.startsWith('http')) return url
  return BASE ? `${BASE}/${url.replace(/^\//, '')}` : url
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
  return { ok: true, url: joinUrl(String(j.url || '')), kind: j.kind, mime: j.mime, bytes: j.bytes }
}

export async function uploadMedia(file, kinds = 'both') {
  const v = validateFile(file, kinds)
  if (!v.ok) throw new Error(v.error)
  const BASE = apiBase()
  try {
    return await postBinary(file, kinds === 'both' ? undefined : v.kind)
  } catch (e) {
    if (/^(ext|format|too_large|unauthorized)$/.test(e.message)) throw e
  }
  try {
    if ((file.size || 0) > LOCAL_FALLBACK_MAX_MB * 1024 * 1024) throw new Error('too_big_local')
    const t = getAdminToken()
    const url = await fileToDataUrl(file)
    const r = await fetch(`${BASE}/api/v1/uploads`, {
      method: 'POST',
      headers: authHeaders(t),
      body: JSON.stringify({ name: file.name, dataUrl: url, kind: v.kind }),
    })
    const j = await r.json().catch(() => ({}))
    if (!r.ok || !j.ok) throw new Error(j.error || `api ${r.status}`)
    return { ok: true, url: joinUrl(String(j.url || '')), kind: j.kind, mime: j.mime, bytes: j.bytes }
  } catch (e) {
    if (e.message === 'too_big_local') {
      throw new Error(`La API no respondió y el archivo pesa ${formatBytes(file.size)} (límite local ${LOCAL_FALLBACK_MAX_MB} MB). Reintenta con la API prendida.`)
    }
    if (/^(ext|format|too_large|unauthorized)$/.test(e.message)) throw e
    if ((file.size || 0) > LOCAL_FALLBACK_MAX_MB * 1024 * 1024) {
      throw new Error(`Sin conexión a la API y el archivo pesa ${formatBytes(file.size)} (límite local ${LOCAL_FALLBACK_MAX_MB} MB).`)
    }
    const url = await fileToDataUrl(file)
    return { ok: true, url, local: true, kind: v.kind, warn: 'API apagada: guardado solo en este navegador (no se replica)' }
  }
}

export async function uploadImage(file) {
  return uploadMedia(file, 'image')
}

export async function uploadVideo(file) {
  return uploadMedia(file, 'video')
}

export function resolveUpload(url) {
  const BASE = apiBase()
  if (!url) return ''
  if (/^(https?:|data:|blob:)/i.test(url)) return url
  const u = String(url).replace(/^\.?\//, '')
  if (u.startsWith('api/')) return BASE ? `${BASE}/${u}` : `/${u}`
  return u
}

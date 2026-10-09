import { useCallback, useEffect, useState } from 'react'
import { apiBase } from './apiBase'
import { pushAuto } from './backup'
import { getAdminToken } from './adminToken'

const LS = 'semit-cms:'
const AUTO_SNAP = 'semit-cms:autosnap:'

const readLocal = (page) => {
  try {
    const raw = localStorage.getItem(LS + page)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function useContent(page, fallback) {
  const [data, setData] = useState(() => readLocal(page) || fallback)
  const [source, setSource] = useState(readLocal(page) ? 'local' : 'default')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const BASE = apiBase()
    if (BASE == null) return
    let alive = true
    fetch(`${BASE}/api/v1/content/${page}`)
      .then(r => (r.ok ? r.json() : null))
      .then(j => {
        if (!alive || !j || !j.data) return
        if (!readLocal(page)) {
          setData(j.data)
          setSource('api')
        }
      })
      .catch(() => {})
    return () => { alive = false }
  }, [page])

  const save = useCallback(async (next) => {
    try {
      const prev = localStorage.getItem(LS + page)
      if (prev) {
        const snaps = JSON.parse(localStorage.getItem(AUTO_SNAP + page) || '[]')
        snaps.unshift({ fecha: new Date().toISOString(), data: JSON.parse(prev) })
        localStorage.setItem(AUTO_SNAP + page, JSON.stringify(snaps.slice(0, 10)))
        pushAuto(new Date().toISOString())
      }
    } catch {}
    setData(next)
    let quotaWarn = ''
    try { localStorage.setItem(LS + page, JSON.stringify(next)) } catch {
      quotaWarn = 'Navegador lleno: usa fotos subidas al servidor (/api/v1/uploads/…), no pegues imágenes en base64'
    }
    setSource('local')
    const BASE = apiBase()
    if (BASE == null) return { ok: true, source: 'local' }
    setSaving(true)
    try {
      const t = getAdminToken()
      const r = await fetch(`${BASE}/api/v1/content/${page}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(t ? { 'x-admin-token': t } : {}) },
        body: JSON.stringify({ data: next }),
      })
      if (r.status === 401 || r.status === 403) return { ok: false, source: 'local', warn: quotaWarn || 'Sesión vencida — entra de nuevo al CMS' }
      if (r.status === 413) return { ok: false, source: 'local', warn: 'Contenido muy pesado (413): sube las fotos al servidor primero, no las pegues en base64' }
      if (!r.ok) return { ok: false, source: 'local', warn: `No se guardó en el servidor (api ${r.status}) — tienes copia local` }
      setSource('api')
      return quotaWarn ? { ok: true, source: 'api', warn: quotaWarn } : { ok: true, source: 'api' }
    } catch {
      return { ok: false, source: 'local', warn: 'API apagada — guardado solo en este navegador' }
    } finally {
      setSaving(false)
    }
  }, [page])

  const reset = useCallback(() => {
    try { localStorage.removeItem(LS + page) } catch {}
    setData(fallback)
    setSource('default')
  }, [page, fallback])

  return { data, source, saving, save, reset }
}

export function readContentLocal(page, fallback) {
  return readLocal(page) || fallback
}

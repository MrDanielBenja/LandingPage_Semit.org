import { apiBase } from '../../core/cms/apiBase'
import { clearAdminToken, getAdminToken, setAdminToken } from '../../core/cms/adminToken'

const LOCK = 'semit-cms:pinlock'
const USER = 'semit-cms:user'

export function lockInfo() {
  try {
    const v = JSON.parse(localStorage.getItem(LOCK) || '{"n":0,"until":0}')
    return v
  } catch { return { n: 0, until: 0 } }
}

export function currentUser() {
  try { return localStorage.getItem(USER) || '' } catch { return '' }
}

export async function login(user, pass) {
  const info = lockInfo()
  if (Date.now() < info.until) return { ok: false, wait: Math.ceil((info.until - Date.now()) / 1000) }
  const BASE = apiBase()
  if (BASE == null) return { ok: false, error: 'Sin API: prende la API (ADMIN_USER/ADMIN_PIN en BD).' }
  try {
    const r = await fetch(`${BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass }),
    })
    const j = await r.json().catch(() => ({}))
    if (!r.ok || !j.ok || !j.token) {
      if (r.status === 429) return { ok: false, wait: j.wait || 60 }
      const n = info.n + 1
      const until = n >= 5 ? Date.now() + 60000 : 0
      try { localStorage.setItem(LOCK, JSON.stringify({ n: n >= 5 ? 0 : n, until })) } catch {}
      return { ok: false, wait: Math.ceil((until - Date.now()) / 1000) }
    }
    try {
      localStorage.setItem(LOCK, JSON.stringify({ n: 0, until: 0 }))
      localStorage.setItem(USER, j.username || user)
      setAdminToken(j.token)
    } catch {}
    return { ok: true }
  } catch {
    return { ok: false, error: 'Sin conexión a la API.' }
  }
}

export async function checkPin(pin) {
  return login('admin', pin)
}

export function adminToken() {
  return getAdminToken()
}

export function isAuthed() {
  return !!getAdminToken()
}

export async function logout() {
  const BASE = apiBase()
  const t = getAdminToken()
  clearAdminToken()
  try { localStorage.removeItem(USER) } catch {}
  if (BASE != null && t) {
    try {
      await fetch(`${BASE}/api/v1/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: t }),
      })
    } catch {}
  }
}

export async function changePassword(oldPass, newPass) {
  const BASE = apiBase()
  const t = getAdminToken()
  if (BASE == null || !t) return { ok: false, error: 'Sin sesión' }
  try {
    const r = await fetch(`${BASE}/api/v1/auth/password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': t },
      body: JSON.stringify({ oldPass, newPass }),
    })
    const j = await r.json().catch(() => ({}))
    if (!r.ok || !j.ok) return { ok: false, error: 'Verifica la actual (mín. 6)' }
    clearAdminToken()
    try { localStorage.removeItem(USER) } catch {}
    return { ok: true }
  } catch {
    return { ok: false, error: 'Sin conexión' }
  }
}

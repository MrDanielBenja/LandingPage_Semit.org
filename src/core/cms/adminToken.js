const KEY = 'semit-cms:token'

export function getAdminToken() {
  try { return sessionStorage.getItem(KEY) || '' } catch { return '' }
}

export function setAdminToken(t) {
  try {
    if (t) sessionStorage.setItem(KEY, t)
    else sessionStorage.removeItem(KEY)
  } catch {}
}

export function clearAdminToken() {
  try { sessionStorage.removeItem(KEY) } catch {}
}

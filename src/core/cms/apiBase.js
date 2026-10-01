export function apiBase() {
  try {
    if (typeof window !== 'undefined' && '__SEMIT_API_URL__' in window) {
      const w = String(window.__SEMIT_API_URL__ || '').trim().replace(/\/$/, '')
      if (w) return w
    }
  } catch {}
  try {
    const v = String(import.meta?.env?.VITE_API_URL || '').trim().replace(/\/$/, '')
    if (v) return v
  } catch {}
  try {
    localStorage.removeItem('semit-api-url')
  } catch {}
  return ''
}

const SAFE_PROTO = /^(https?:|mailto:|tel:|data:image\/(png|jpeg|gif|webp|avif);base64,|blob:|#|\/|assets\/|api\/)/i
const DANGEROUS = /^(javascript|data:text\/html|vbscript|file):/i

export function safeHref(url, fallback = '/') {
  const u = String(url || '').trim()
  if (!u) return fallback
  if (DANGEROUS.test(u)) return fallback
  if (SAFE_PROTO.test(u)) return u
  if (/^[a-z0-9._-]+\//i.test(u)) return u
  return fallback
}

export function safeSrc(url, fallback = '') {
  const u = String(url || '').trim()
  if (!u) return fallback
  if (DANGEROUS.test(u)) return fallback
  if (/^(https?:|data:image\/|data:video\/|blob:|api\/|assets\/|\/|#)/i.test(u)) return u
  if (/^[a-z0-9._-]+\//i.test(u)) return u
  return fallback
}

export function safeCssUrl(url) {
  const u = safeSrc(url, '')
  if (!u) return ''
  return `url('${u.replace(/'/g, '%27')}')`
}

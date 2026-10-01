export const IMAGE_MAX_MB = Infinity
export const VIDEO_MAX_MB = 500
export const LOCAL_FALLBACK_MAX_MB = 2

export const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']
export const VIDEO_EXTS = ['.mp4', '.webm', '.ogv', '.ogg']

export const ACCEPT_IMAGE = 'image/jpeg,image/png,image/webp,image/gif,image/avif'
export const ACCEPT_VIDEO = 'video/mp4,video/webm,video/ogg'

export function acceptFor(kinds = 'both') {
  if (kinds === 'image') return ACCEPT_IMAGE
  if (kinds === 'video') return ACCEPT_VIDEO
  return `${ACCEPT_IMAGE},${ACCEPT_VIDEO}`
}

export function extOf(name) {
  const m = String(name || '').toLowerCase().match(/\.[a-z0-9]+$/)
  return m ? m[0] : ''
}

export function kindOfExt(ext) {
  if (IMAGE_EXTS.includes(ext)) return 'image'
  if (VIDEO_EXTS.includes(ext)) return 'video'
  return null
}

export function formatBytes(n) {
  const v = Number(n) || 0
  if (v < 1024) return `${v} B`
  if (v < 1024 * 1024) return `${(v / 1024).toFixed(v < 10240 ? 1 : 0)} KB`
  return `${(v / (1024 * 1024)).toFixed(1)} MB`
}

export function isVideoUrl(url) {
  if (!url) return false
  if (/^data:video\//i.test(String(url))) return true
  return kindOfExt(extOf(String(url).split('?')[0])) === 'video'
}

export function validateFile(file, kinds = 'both') {
  if (!file) return { ok: false, error: 'Archivo vacío' }
  const ext = extOf(file.name)
  const kind = kindOfExt(ext)
  if (!kind) {
    const allow = kinds === 'video'
      ? 'MP4, WebM, OGG'
      : kinds === 'image'
        ? 'JPG, PNG, WebP, GIF, AVIF'
        : 'JPG, PNG, WebP, GIF, AVIF, MP4, WebM, OGG'
    return { ok: false, error: `Formato no permitido (${ext || 'sin extensión'}). Usa: ${allow}` }
  }
  if (kinds !== 'both' && kind !== kinds) {
    return { ok: false, error: kinds === 'image' ? 'Esta casilla solo acepta imágenes' : 'Esta casilla solo acepta videos' }
  }
  const maxMB = kind === 'video' ? VIDEO_MAX_MB : IMAGE_MAX_MB
  if (Number.isFinite(maxMB) && (file.size || 0) > maxMB * 1024 * 1024) {
    return { ok: false, error: `Pesa ${formatBytes(file.size)} — máximo ${maxMB} MB` }
  }
  return { ok: true, kind, ext }
}

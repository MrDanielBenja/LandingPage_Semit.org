const imgMbRaw = Number(process.env.UPLOAD_IMAGE_MAX_MB)
const vidMbRaw = Number(process.env.UPLOAD_VIDEO_MAX_MB)
const jsonMbRaw = Number(process.env.UPLOAD_JSON_MAX_MB)
const imgMb = Number.isFinite(imgMbRaw) && imgMbRaw > 0 ? Math.min(imgMbRaw, 25) : 12
const vidMb = Number.isFinite(vidMbRaw) && vidMbRaw > 0 ? Math.min(vidMbRaw, 200) : 100
const jsonMb = Number.isFinite(jsonMbRaw) && jsonMbRaw > 0 ? Math.min(jsonMbRaw, 20) : 10
export const IMAGE_MAX_BYTES = imgMb * 1024 * 1024
export const VIDEO_MAX_BYTES = vidMb * 1024 * 1024
export const JSON_MAX_BYTES = jsonMb * 1024 * 1024

export const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.jfif', '.png', '.webp', '.gif', '.avif'])
export const VIDEO_EXTS = new Set(['.mp4', '.webm', '.ogv', '.ogg'])

export const KIND_MIME = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.jfif': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.ogv': 'video/ogg', '.ogg': 'video/ogg',
}

export function sniffKind(buf) {
  if (!buf || buf.length < 12) return null
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return { kind: 'image', mime: 'image/jpeg' }
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return { kind: 'image', mime: 'image/png' }
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return { kind: 'image', mime: 'image/gif' }
  if (buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return { kind: 'image', mime: 'image/webp' }
  if (buf[0] === 0x1A && buf[1] === 0x45 && buf[2] === 0xDF && buf[3] === 0xA3) return { kind: 'video', mime: 'video/webm' }
  if (buf[0] === 0x4F && buf[1] === 0x67 && buf[2] === 0x67 && buf[3] === 0x53) return { kind: 'video', mime: 'video/ogg' }
  if (buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70) {
    const brand = buf.slice(8, 12).toString('ascii')
    if (/^avif|avis|^mif1/.test(brand)) return { kind: 'image', mime: 'image/avif' }
    if (/^(isom|iso2|iso5|iso6|avc1|mp41|mp42|M4V |MSNV|mmp4)/.test(brand)) return { kind: 'video', mime: 'video/mp4' }
    return null
  }
  return null
}

export function safeName(name) {
  const base = String(name || 'archivo').split(/[\\/]/).pop().toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  const clean = base.replace(/[^a-z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^[.-]+|[.-]+$/g, '') || 'archivo'
  return clean.slice(-120)
}

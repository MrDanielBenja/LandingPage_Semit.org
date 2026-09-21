import { CURSOS } from '../data/cursos.data'

const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export function resolveImg(url) {
  if (!url) return ''
  if (/^(https?:|data:|blob:)/i.test(url)) return url
  if (url.startsWith('/')) return `${BASE}${url}`
  return BASE ? `${BASE}/${url.replace(/^\.\//, '')}` : url
}

export function mapApiCurso(r) {
  return {
    id: r.id,
    slug: r.slug,
    n: r.nombre,
    a: r.area,
    d: r.descripcion,
    p: Number(r.precio),
    mod: r.modalidad,
    nivel: r.nivel,
    semanas: Number(r.semanas),
    lecciones: Number(r.lecciones),
    rating: Number(r.rating),
    est: Number(r.inscritos),
    tag: r.tag || '',
    img: resolveImg(r.imagen_url) || '',
    temario: Array.isArray(r.temario) ? r.temario : [],
  }
}

export async function fetchCursos(params = {}) {
  if (!BASE) return { data: CURSOS, meta: null, source: 'local' }
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v && v !== 'Todos') qs.set(k, v)
  }
  const res = await fetch(`${BASE}/api/v1/cursos?${qs}`)
  if (!res.ok) throw new Error(`api ${res.status}`)
  const json = await res.json()
  return { data: (json.data || []).map(mapApiCurso), meta: json.meta || null, source: 'api' }
}

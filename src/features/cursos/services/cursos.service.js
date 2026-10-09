import { CURSOS } from '../data/cursos.data'
import { asArr } from '../../../core/cms/safe'
import { apiBase } from '../../../core/cms/apiBase'
import { safeSrc } from '../../../core/cms/sanitize'

export function resolveImg(url) {
  const BASE = apiBase()
  if (!url) return ''
  const raw = String(url)
  if (/^(https?:|data:|blob:)/i.test(raw)) return safeSrc(raw, '')
  if (raw.startsWith('/')) return safeSrc(`${BASE ?? ''}${raw}`, '')
  const clean = raw.replace(/^\.\//, '')
  if (BASE == null) return safeSrc(url, '')
  return safeSrc(BASE ? `${BASE}/${clean}` : `/${clean}`, '')
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
  const BASE = apiBase()
  if (BASE == null) return { data: CURSOS, meta: null, source: 'local' }
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v && v !== 'Todos') qs.set(k, v)
  }
  const res = await fetch(`${BASE}/api/v1/cursos?${qs}`)
  if (!res.ok) throw new Error(`api ${res.status}`)
  const json = await res.json()
  return { data: asArr(json.data, []).map(mapApiCurso), meta: json.meta || null, source: 'api' }
}

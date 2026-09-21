import { readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const file = join(here, '..', 'data', 'cursos.json')

let cache = null
let mtime = 0

function loadAll() {
  try {
    const st = statSync(file).mtimeMs
    if (!cache || st !== mtime) {
      cache = JSON.parse(readFileSync(file, 'utf-8'))
      mtime = st
    }
  } catch {
    cache = []
  }
  return cache
}

export const CURSOS_JSON = loadAll()

export function reloadStore() {
  cache = null
  return loadAll()
}

const SORTS = {
  pop: (a, b) => b.inscritos - a.inscritos,
  rating: (a, b) => b.rating - a.rating,
  precio: (a, b) => a.precio - b.precio,
}

export function queryStore({ q = '', area, modalidad, nivel, sort = 'pop', page = 1, limit = 12 }) {
  let r = loadAll().filter(c => c.activo !== false)
  if (area) r = r.filter(c => c.area === area)
  if (modalidad) r = r.filter(c => c.modalidad === modalidad)
  if (nivel) r = r.filter(c => c.nivel === nivel)
  if (q) {
    const x = q.toLowerCase()
    r = r.filter(c => `${c.nombre} ${c.area} ${c.descripcion}`.toLowerCase().includes(x))
  }
  r = [...r].sort(SORTS[sort] || SORTS.pop)
  const lim = Math.min(Number(limit) || 12, 50)
  const pg = Math.max(Number(page) || 1, 1)
  const totalPages = Math.max(Math.ceil(r.length / lim), 1)
  const data = r.slice((pg - 1) * lim, pg * lim)
  return { data, meta: { total: r.length, page: pg, limit: lim, totalPages } }
}

export function findBySlug(slug) {
  return loadAll().find(c => c.slug === slug && c.activo !== false) || null
}

export function filtrosStore() {
  const all = loadAll().filter(c => c.activo !== false)
  const pick = (k) => [...new Set(all.map(c => c[k]))]
  return { areas: pick('area'), modalidades: pick('modalidad'), niveles: pick('nivel') }
}

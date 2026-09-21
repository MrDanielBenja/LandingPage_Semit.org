import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const DATA = join(here, '..', 'data', 'cursos.json')
const COVERS = join(here, '..', 'uploads', 'covers')

const PORTAL = (process.env.PORTAL_API_URL || 'https://demo.casa-peniel.com').replace(/\/$/, '')

const slugify = (s = '') =>
  s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'curso'

function areaOf(title = '', desc = '') {
  const t = `${title} ${desc}`.toLowerCase()
  if (/mateo|amos|corintios|juan|romanos|evangelio|epistola|biblia|testamento|salmos|hechos|apocalipsis/.test(t)) return 'Biblia'
  if (/musica|islam|musulm|mahoma|ministerio|mision|discipulado|liderazgo/.test(t)) return 'Ministerio'
  return 'Teología'
}

const nivelOf = (lv) => ['Fundamentos', 'Intermedio', 'Avanzado'].includes(lv) ? lv : 'Fundamentos'

async function saveCover(slug, portalId) {
  mkdirSync(COVERS, { recursive: true })
  const file = join(COVERS, `${slug}.jpg`)
  if (existsSync(file)) return true
  const urls = [
    `https://api-developer.casa-peniel.com/api/public/course-covers/${portalId}.jpg`,
    `${PORTAL}/api/public/course-covers/${portalId}.jpg`,
  ]
  for (const u of urls) {
    try {
      const r = await fetch(u)
      if (!r.ok) continue
      const buf = Buffer.from(await r.arrayBuffer())
      if (buf.length < 2000) continue
      writeFileSync(file, buf)
      return true
    } catch { /* next */ }
  }
  return false
}

export async function syncFromPortal() {
  const started = Date.now()
  const lr = await fetch(`${PORTAL}/api/catalog/courses`)
  if (!lr.ok) throw new Error(`portal list ${lr.status}`)
  const { courses = [] } = await lr.json()
  let old = []
  try { old = JSON.parse((await import('node:fs')).readFileSync(DATA, 'utf-8')) } catch { old = [] }
  const oldBySlug = new Map(old.map(c => [c.slug, c]))
  const out = []
  let added = 0, updated = 0, covers = 0
  for (const [k, c] of courses.entries()) {
    const slug = slugify(c.slug || c.title)
    let detail = {}
    try {
      const dr = await fetch(`${PORTAL}/api/catalog/courses/${encodeURIComponent(c.slug)}`)
      if (dr.ok) detail = await dr.json()
    } catch { detail = {} }
    const course = detail.course || {}
    const modules = Array.isArray(detail.modules) ? detail.modules : []
    const lessons = modules.flatMap(m => Array.isArray(m.lessons) ? m.lessons : [])
    const temario = (lessons.length ? lessons.map(l => l.title) : modules.map(m => m.title)).filter(Boolean)
    const prevOne = oldBySlug.get(slug)
    const row = {
      id: prevOne?.id ?? k + 1,
      slug,
      nombre: (c.title || 'Sin título').trim(),
      area: areaOf(c.title, c.description || ''),
      descripcion: ((course.description || c.description || '').trim()) || 'Formación bíblica, teológica y misionera al ritmo de tu vida.',
      precio: prevOne?.precio ?? 30,
      precio_regular: prevOne?.precio_regular ?? 40,
      modalidad: prevOne?.modalidad ?? 'Virtual',
      nivel: nivelOf((course.level || c.level || '').trim()),
      semanas: modules.length > 12 ? 6 : 4,
      lecciones: temario.length,
      rating: prevOne?.rating ?? 4.9,
      inscritos: Number(course.student_count ?? 0),
      tag: ((course.level || c.level || 'Portal').trim()),
      imagen_url: `api/v1/covers/${slug}.jpg`,
      temario,
      activo: true,
    }
    if (await saveCover(slug, c.id)) covers++
    if (!prevOne) added++
    else if (JSON.stringify({ ...prevOne, id: row.id }) !== JSON.stringify({ ...row, id: row.id })) updated++
    out.push(row)
  }
  mkdirSync(dirname(DATA), { recursive: true })
  writeFileSync(DATA, JSON.stringify(out, null, 1))
  if (process.env.DATABASE_URL) {
    const { pool } = await import('./db.js')
    if (pool) {
      for (const r of out) {
        await pool.query(
          `INSERT INTO cursos (slug, nombre, area, descripcion, precio, precio_regular, modalidad, nivel, semanas, lecciones, rating, inscritos, tag, imagen_url)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
           ON CONFLICT (slug) DO UPDATE SET nombre=EXCLUDED.nombre, area=EXCLUDED.area, descripcion=EXCLUDED.descripcion, nivel=EXCLUDED.nivel, semanas=EXCLUDED.semanas, lecciones=EXCLUDED.lecciones, inscritos=EXCLUDED.inscritos, tag=EXCLUDED.tag, imagen_url=EXCLUDED.imagen_url`,
          [r.slug, r.nombre, r.area, r.descripcion, r.precio, r.precio_regular, r.modalidad, r.nivel, r.semanas, r.lecciones, r.rating, r.inscritos, r.tag, r.imagen_url]
        )
        await pool.query('DELETE FROM temario WHERE curso_id = (SELECT id FROM cursos WHERE slug = $1)', [r.slug])
        for (const [i, t] of r.temario.entries()) {
          await pool.query('INSERT INTO temario (curso_id, orden, titulo) SELECT id, $2, $3 FROM cursos WHERE slug = $1', [r.slug, i + 1, t])
        }
      }
    }
  }
  const { queryStore } = await import('./store.js')
  void queryStore
  return { total: out.length, added, updated, covers, ms: Date.now() - started }
}

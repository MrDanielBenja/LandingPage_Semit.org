import { pool } from '../db.js'
import { queryStore, findBySlug, filtrosStore } from '../store.js'

const SORTS = {
  pop: 'c.inscritos DESC',
  rating: 'c.rating DESC',
  precio: 'c.precio ASC',
}

async function withTemario(rows) {
  if (!rows.length) return []
  const ids = rows.map(r => r.id)
  const { rows: t } = await pool.query(
    'SELECT curso_id, titulo FROM temario WHERE curso_id = ANY($1) ORDER BY curso_id, orden',
    [ids]
  )
  const by = new Map()
  for (const x of t) {
    if (!by.has(x.curso_id)) by.set(x.curso_id, [])
    by.get(x.curso_id).push(x.titulo)
  }
  return rows.map(r => ({ ...r, temario: by.get(r.id) || [] }))
}

export async function getCursos(req, res) {
  try {
    if (!pool) return res.json(queryStore(req.query))
    const { q = '', area, modalidad, nivel, sort = 'pop', page = 1, limit = 12 } = req.query
    const where = ['c.activo = TRUE']
    const vals = []
    if (q) { vals.push(`%${q}%`); where.push(`(c.nombre || ' ' || c.area || ' ' || c.descripcion) ILIKE $${vals.length}`) }
    if (area) { vals.push(area); where.push(`c.area = $${vals.length}`) }
    if (modalidad) { vals.push(modalidad); where.push(`c.modalidad = $${vals.length}`) }
    if (nivel) { vals.push(nivel); where.push(`c.nivel = $${vals.length}`) }
    const lim = Math.min(Number(limit) || 12, 50)
    const off = (Math.max(Number(page) || 1, 1) - 1) * lim
    const order = SORTS[sort] || SORTS.pop
    const [{ rows }, { rows: [{ count }] }] = await Promise.all([
      pool.query(`SELECT c.* FROM cursos c WHERE ${where.join(' AND ')} ORDER BY ${order} LIMIT ${lim} OFFSET ${off}`, vals),
      pool.query(`SELECT COUNT(*)::int count FROM cursos c WHERE ${where.join(' AND ')}`, vals),
    ])
    const totalPages = Math.max(Math.ceil(count / lim), 1)
    res.json({ data: await withTemario(rows), meta: { total: count, page: Number(page) || 1, limit: lim, totalPages } })
  } catch {
    res.json(queryStore(req.query))
  }
}

export async function getCursoBySlug(req, res) {
  try {
    if (!pool) {
      const one = findBySlug(req.params.slug)
      if (!one) return res.status(404).json({ error: 'not_found' })
      return res.json({ data: one })
    }
    const { rows } = await pool.query('SELECT c.* FROM cursos c WHERE c.slug = $1 AND c.activo = TRUE', [req.params.slug])
    if (!rows.length) return res.status(404).json({ error: 'not_found' })
    const [one] = await withTemario(rows)
    res.json({ data: one })
  } catch {
    const one = findBySlug(req.params.slug)
    if (!one) return res.status(404).json({ error: 'not_found' })
    res.json({ data: one })
  }
}

export async function getFiltros(_, res) {
  try {
    if (!pool) return res.json(filtrosStore())
    const [a, m, n] = await Promise.all([
      pool.query("SELECT DISTINCT area FROM cursos WHERE activo = TRUE ORDER BY 1"),
      pool.query("SELECT DISTINCT modalidad FROM cursos WHERE activo = TRUE ORDER BY 1"),
      pool.query("SELECT DISTINCT nivel FROM cursos WHERE activo = TRUE ORDER BY 1"),
    ])
    res.json({
      areas: a.rows.map(r => r.area),
      modalidades: m.rows.map(r => r.modalidad),
      niveles: n.rows.map(r => r.nivel),
    })
  } catch {
    res.json(filtrosStore())
  }
}

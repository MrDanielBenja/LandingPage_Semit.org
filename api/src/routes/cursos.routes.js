import { Router } from 'express'
import { getCursos, getCursoBySlug, getFiltros } from '../controllers/cursos.controller.js'
import { requireAdmin } from '../guard.js'
import { syncFromPortal } from '../sync.js'
import { reloadStore } from '../store.js'

const r = Router()
r.get('/', getCursos)
r.get('/filtros', getFiltros)
r.post('/sync', async (req, res) => {
  if (!(await requireAdmin(req, res))) return
  try {
    const out = await syncFromPortal()
    reloadStore()
    res.json({ ok: true, ...out })
  } catch (e) {
    res.status(502).json({ ok: false, error: String(e.message || e) })
  }
})
r.get('/:slug', getCursoBySlug)
export default r

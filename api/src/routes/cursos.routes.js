import { Router } from 'express'
import { getCursos, getCursoBySlug, getFiltros } from '../controllers/cursos.controller.js'
import { syncFromPortal } from '../sync.js'
import { reloadStore } from '../store.js'

const r = Router()
r.get('/', getCursos)
r.get('/filtros', getFiltros)
r.post('/sync', async (req, res) => {
  const token = process.env.SYNC_TOKEN
  if (token && req.headers['x-sync-token'] !== token && req.query.token !== token) {
    return res.status(401).json({ ok: false, error: 'unauthorized' })
  }
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

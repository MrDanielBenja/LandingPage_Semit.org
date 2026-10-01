import { Router } from 'express'
import { getCursos, getCursoBySlug, getFiltros } from '../controllers/cursos.controller.js'
import { checkToken } from '../auth.js'
import { syncFromPortal } from '../sync.js'
import { reloadStore } from '../store.js'

const r = Router()
r.get('/', getCursos)
r.get('/filtros', getFiltros)
r.post('/sync', async (req, res) => {
  const syncT = process.env.SYNC_TOKEN
  const adminT = req.headers['x-admin-token']
  const okSync = syncT && req.headers['x-sync-token'] === syncT
  const okAdmin = adminT && (await checkToken(adminT))
  const openDev = (!process.env.DATABASE_URL && !process.env.MYSQL_URL && !process.env.MYSQL_PUBLIC_URL) && !process.env.ADMIN_PIN && !syncT
  if (!okSync && !okAdmin && !openDev) {
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

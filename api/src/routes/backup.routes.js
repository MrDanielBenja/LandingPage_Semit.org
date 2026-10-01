import { Router } from 'express'
import { CONTENT_PAGES, readContent, writeContent } from '../content.js'
import { checkToken } from '../auth.js'

const r = Router()

async function check(req, res) {
  const token = process.env.SYNC_TOKEN
  if (token && req.headers['x-sync-token'] === token) return true
  const t = req.headers['x-admin-token']
  if (t && (await checkToken(t))) return true
  if ((!process.env.DATABASE_URL && !process.env.MYSQL_URL && !process.env.MYSQL_PUBLIC_URL) && !process.env.ADMIN_PIN && !token) return true
  res.status(401).json({ ok: false, error: 'unauthorized' })
  return false
}

r.get('/', async (req, res) => {
  if (!(await check(req, res))) return
  const pages = {}
  for (const p of CONTENT_PAGES) {
    if (p === 'cursos') continue
    const d = readContent(p)
    if (d) pages[p === 'cursosPage' ? 'cursosPage' : p] = d
  }
  res.json({ app: 'semit-cms', version: 1, fecha: new Date().toISOString(), pages })
})

r.post('/restore', async (req, res) => {
  if (!(await check(req, res))) return
  const b = req.body || {}
  if (b.app !== 'semit-cms' || !b.pages) return res.status(400).json({ ok: false, error: 'bad_backup' })
  const done = []
  for (const [k, v] of Object.entries(b.pages)) {
    if (k === 'cursos') continue
    if (!CONTENT_PAGES.includes(k)) continue
    if (!v || typeof v !== 'object') continue
    writeContent(k, v)
    done.push(k)
  }
  res.json({ ok: true, restored: done })
})

export default r

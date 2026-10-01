import { Router } from 'express'
import { CONTENT_PAGES, readContent, writeContent } from '../content.js'
import { checkToken } from '../auth.js'

async function guard(req, res) {
  const token = process.env.SYNC_TOKEN
  if (token && req.headers['x-sync-token'] === token) return true
  const t = req.headers['x-admin-token']
  if (t && (await checkToken(t))) return true
  if ((!process.env.DATABASE_URL && !process.env.MYSQL_URL && !process.env.MYSQL_PUBLIC_URL) && !process.env.ADMIN_PIN && !token) return true
  res.status(401).json({ ok: false, error: 'unauthorized' })
  return false
}

const r = Router()

r.get('/:page', (req, res) => {
  const { page } = req.params
  if (!CONTENT_PAGES.includes(page)) return res.status(404).json({ error: 'not_found' })
  const data = readContent(page)
  if (!data) return res.status(404).json({ error: 'empty' })
  res.json({ data })
})

r.put('/:page', async (req, res) => {
  const { page } = req.params
  if (!CONTENT_PAGES.includes(page)) return res.status(404).json({ error: 'not_found' })
  if (!(await guard(req, res))) return
  const data = req.body && req.body.data
  if (!data) return res.status(400).json({ ok: false, error: 'missing_data' })
  writeContent(page, data)
  res.json({ ok: true })
})

export default r

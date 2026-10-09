import { Router } from 'express'
import { CONTENT_PAGES, readContent, writeContent } from '../content.js'
import { requireAdmin } from '../guard.js'

async function guard(req, res) {
  return requireAdmin(req, res)
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

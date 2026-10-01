import { Router } from 'express'
import { changePass, checkToken, loginAdmin, loginAdminLegacy, logoutToken, tokenUser } from '../auth.js'

const r = Router()
const fails = new Map()
setInterval(() => {
  const now = Date.now()
  for (const [ip, f] of fails) {
    if (now > (f.until || 0) && (f.n || 0) < 5) fails.delete(ip)
  }
}, 5 * 60 * 1000).unref()

r.post('/login', async (req, res) => {
  const ip = req.ip || '?'
  const f = fails.get(ip) || { n: 0, until: 0 }
  if (Date.now() < f.until) return res.status(429).json({ ok: false, error: 'locked', wait: Math.ceil((f.until - Date.now()) / 1000) })
  const body = req.body || {}
  const out = body.username !== undefined || body.password !== undefined
    ? await loginAdmin(body.username, body.password)
    : await loginAdminLegacy(body.pin)
  if (!out) {
    const n = f.n + 1
    fails.set(ip, { n: n >= 5 ? 0 : n, until: n >= 5 ? Date.now() + 60000 : 0 })
    return res.status(401).json({ ok: false, error: 'bad_login' })
  }
  fails.delete(ip)
  res.json({ ok: true, token: out.token, username: out.username })
})

r.post('/logout', async (req, res) => {
  const t = req.headers['x-admin-token'] || req.body?.token
  await logoutToken(t)
  res.json({ ok: true })
})

r.get('/check', async (req, res) => {
  const t = req.headers['x-admin-token']
  res.json({ ok: await checkToken(t) })
})

r.get('/me', async (req, res) => {
  const t = req.headers['x-admin-token']
  const username = await tokenUser(t)
  if (!username) return res.status(401).json({ ok: false })
  res.json({ ok: true, username })
})

r.post('/password', async (req, res) => {
  const t = req.headers['x-admin-token']
  const username = await tokenUser(t)
  if (!username) return res.status(401).json({ ok: false, error: 'unauthorized' })
  const ok = await changePass(username, req.body?.oldPass, req.body?.newPass)
  if (!ok) return res.status(400).json({ ok: false, error: 'bad_pass' })
  res.json({ ok: true })
})

export default r

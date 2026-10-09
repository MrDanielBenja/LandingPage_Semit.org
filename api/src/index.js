import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import cursosRouter from './routes/cursos.routes.js'
import contentRouter from './routes/content.routes.js'
import uploadsRouter from './routes/uploads.routes.js'
import backupRouter from './routes/backup.routes.js'
import authRouter from './routes/auth.routes.js'
import { ensureAdminSeed } from './auth.js'

const here = dirname(fileURLToPath(import.meta.url))

const app = express()
app.disable('x-powered-by')
const CORS_LIST = (process.env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean)
const isProd = String(process.env.NODE_ENV || '').toLowerCase() === 'production'
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    if (CORS_LIST.includes(origin)) return cb(null, true)
    if (!isProd && !CORS_LIST.length) return cb(null, true)
    return cb(null, false)
  },
}))
app.use((_, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff')
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.set('X-Frame-Options', 'SAMEORIGIN')
  if (isProd) res.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains')
  next()
})
const json15 = express.json({ limit: '12mb' })
app.use((req, res, next) => {
  if (req.path === '/api/v1/uploads' || req.path.startsWith('/api/v1/uploads/')) return next()
  return json15(req, res, next)
})

app.get('/api/v1/health', (_, res) => res.json({ ok: true }))
app.use('/api/v1/cursos', cursosRouter)
app.use('/api/v1/content', contentRouter)
  app.use('/api/v1/backup', backupRouter)
  app.use('/api/v1/auth', authRouter)
app.use('/api/v1/uploads', uploadsRouter)

const PUB = join(here, '..', 'public')
const ASSETS = join(PUB, 'assets')
const COVERS = join(here, '..', 'uploads', 'covers')
const CMS_UP = join(here, '..', 'uploads', 'cms')
const VIDEOS = join(here, '..', 'uploads', 'videos')

function dirInfo(p) {
  try {
    const names = readdirSync(p)
    let files = 0
    for (const n of names) {
      try { if (statSync(join(p, n)).isFile()) files++ } catch {}
    }
    return { ok: true, entries: names.length, files }
  } catch (e) {
    return { ok: false, error: String(e.message || e).slice(0, 120) }
  }
}

console.log(`[static] public=${PUB} assets=${JSON.stringify(dirInfo(ASSETS))} covers=${JSON.stringify(dirInfo(COVERS))} cms=${JSON.stringify(dirInfo(CMS_UP))} videos=${JSON.stringify(dirInfo(VIDEOS))}`)

app.get('/api/v1/diag', async (req, res) => {
  const t = req.headers['x-admin-token']
  const { checkToken } = await import('./auth.js')
  if (!(t && (await checkToken(t)))) return res.status(401).json({ ok: false, error: 'unauthorized' })
  res.json({
    ok: true,
    index: dirInfo(PUB).ok,
    assets: dirInfo(ASSETS),
    covers: dirInfo(COVERS),
    cmsUploads: dirInfo(CMS_UP),
    videos: dirInfo(VIDEOS),
  })
})

app.use('/assets', express.static(ASSETS, { maxAge: '1y', immutable: true, fallthrough: true }))
app.use('/api/v1/covers', express.static(COVERS, { fallthrough: true }))
app.use('/api/v1/uploads', express.static(CMS_UP, { fallthrough: true }))
app.use('/api/v1/videos', express.static(VIDEOS, { fallthrough: true }))
app.use(express.static(PUB, { maxAge: 0, etag: false, index: false }))
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/assets/')) return next()
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '0')
  res.sendFile(join(PUB, 'index.html'), (e) => { if (e) next() })
})

app.use((err, req, res, _next) => {
  console.error(`[ERR] ${req.method} ${req.path}:`, err?.message || err)
  if (res.headersSent) return
  const s = err?.status || err?.statusCode
  if (s === 413 || err?.type === 'entity.too.large') return res.status(413).json({ ok: false, error: 'too_large' })
  if (s === 400 || err?.type === 'entity.parse.failed') return res.status(400).json({ ok: false, error: 'bad_request' })
  res.status(500).json({ ok: false, error: 'internal' })
})

const port = process.env.PORT || 4000
app.listen(port, async () => {
  console.log(`api :${port}`)
  try { await ensureAdminSeed() } catch (e) { console.log('admin seed:', e.message) }
  if (process.env.SYNC_ON_BOOT !== '0') {
    try {
      const { syncFromPortal } = await import('./sync.js')
      const { reloadStore } = await import('./store.js')
      const out = await syncFromPortal()
      reloadStore()
      console.log('sync portal:', JSON.stringify(out))
    } catch (e) {
      console.log('sync portal falló, uso local:', e.message)
    }
  }
})

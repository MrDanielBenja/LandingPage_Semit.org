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
const CORS_LIST = (process.env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean)
app.use(cors({ origin: CORS_LIST.length ? CORS_LIST : true }))
const json15 = express.json({ limit: '15mb' })
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

app.get('/api/v1/diag', (_, res) => {
  res.json({
    ok: true,
    public: PUB,
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
  res.status(500).json({ ok: false, error: 'internal', path: req.path })
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

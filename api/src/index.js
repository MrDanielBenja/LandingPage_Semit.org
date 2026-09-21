import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import cursosRouter from './routes/cursos.routes.js'

const here = dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(cors({ origin: (process.env.CORS_ORIGIN || '').split(',').filter(Boolean) || true }))
app.use(express.json())

app.get('/api/v1/health', (_, res) => res.json({ ok: true }))
app.use('/api/v1/cursos', cursosRouter)
app.use('/api/v1/covers', express.static(join(here, '..', 'uploads', 'covers')))

const port = process.env.PORT || 4000
app.listen(port, async () => {
  console.log(`api :${port}`)
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

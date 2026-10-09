import { Router } from 'express'
import express from 'express'
import { writeFileSync, mkdirSync, statSync, readdirSync, unlinkSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, join, extname } from 'node:path'
import { requireAdmin } from '../guard.js'
import { IMAGE_EXTS, VIDEO_EXTS, IMAGE_MAX_BYTES, VIDEO_MAX_BYTES, JSON_MAX_BYTES, sniffKind, safeName } from '../media.js'

const here = dirname(fileURLToPath(import.meta.url))
const IMG_DIR = join(here, '..', '..', 'uploads', 'cms')
const VID_DIR = join(here, '..', '..', 'uploads', 'videos')
const r = Router()

async function guard(req, res) {
  return requireAdmin(req, res)
}

function store(buf, name, kindHint) {
  const ext = extname(safeName(name))
  const allowed = kindHint === 'video' ? VIDEO_EXTS : kindHint === 'image' ? IMAGE_EXTS : new Set([...IMAGE_EXTS, ...VIDEO_EXTS])
  if (!allowed.has(ext)) return { error: 'ext', status: 400 }
  const sniffed = sniffKind(buf)
  if (!sniffed) return { error: 'format', status: 400 }
  if (kindHint && sniffed.kind !== kindHint) return { error: 'format', status: 400 }
  const extKind = IMAGE_EXTS.has(ext) ? 'image' : 'video'
  if (extKind !== sniffed.kind) return { error: 'format', status: 400 }
  const max = sniffed.kind === 'video' ? VIDEO_MAX_BYTES : IMAGE_MAX_BYTES
  if (max > 0 && buf.length > max) return { error: 'too_large', status: 413 }
  const dir = sniffed.kind === 'video' ? VID_DIR : IMG_DIR
  mkdirSync(dir, { recursive: true })
  const file = `${Date.now()}-${randomBytes(4).toString('hex')}-${safeName(name)}`
  const dest = join(dir, file)
  writeFileSync(dest, buf)
  let saved = 0
  try { saved = statSync(dest).size } catch { return { error: 'persist', status: 500 } }
  if (saved !== buf.length) return { error: 'persist', status: 500 }
  const prefix = sniffed.kind === 'video' ? '/api/v1/videos' : '/api/v1/uploads'
  return { url: `${prefix}/${file}`, kind: sniffed.kind, mime: sniffed.mime, bytes: saved }
}

r.post('/', express.json({ limit: Math.ceil(JSON_MAX_BYTES / 1024 / 1024) + 'mb' }), async (req, res) => {
  try {
    if (!(await guard(req, res))) return
    const { name, dataUrl, kind } = req.body || {}
    if (!name || !dataUrl) return res.status(400).json({ ok: false, error: 'missing' })
    const m = String(dataUrl).match(/^data:((?:image|video)\/[a-z0-9.+-]+);base64,(.+)$/i)
    if (!m) return res.status(400).json({ ok: false, error: 'format' })
    let buf
    try {
      buf = Buffer.from(m[2], 'base64')
    } catch {
      return res.status(400).json({ ok: false, error: 'format' })
    }
    if (!buf.length) return res.status(400).json({ ok: false, error: 'format' })
    const out = store(buf, name, kind === 'video' || kind === 'image' ? kind : undefined)
    if (out.error) return res.status(out.status).json({ ok: false, error: out.error })
    res.json({ ok: true, ...out })
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e) })
  }
})

r.post('/binary', express.raw({ type: 'application/octet-stream', limit: Math.ceil(VIDEO_MAX_BYTES / 1024 / 1024) + 'mb' }), async (req, res) => {
  try {
    if (!(await guard(req, res))) return
    const rawName = req.headers['x-file-name']
    let name = rawName
    try { name = decodeURIComponent(rawName) } catch {}
    if (!name || !req.body || !req.body.length) return res.status(400).json({ ok: false, error: 'missing' })
    const kind = req.headers['x-file-kind']
    const out = store(req.body, name, kind === 'video' || kind === 'image' ? kind : undefined)
    if (out.error) return res.status(out.status).json({ ok: false, error: out.error })
    res.json({ ok: true, ...out })
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e) })
  }
})

r.get('/list', async (req, res) => {
  try {
    if (!(await guard(req, res))) return
    const kind = String(req.query.kind || 'both')
    const wantImg = kind !== 'video'
    const wantVid = kind !== 'image'
    const items = []
    const scan = (dir, prefix, k) => {
      let names = []
      try { names = readdirSync(dir) } catch { return }
      for (const n of names) {
        if (n === '.gitkeep' || n.startsWith('.')) continue
        const full = join(dir, n)
        let st = null
        try { st = statSync(full) } catch { continue }
        if (!st.isFile()) continue
        const ext = n.slice(n.lastIndexOf('.')).toLowerCase()
        const allowed = k === 'video' ? VIDEO_EXTS : IMAGE_EXTS
        if (!allowed.has(ext)) continue
        items.push({ url: `${prefix}/${n}`, name: n, kind: k, bytes: st.size, mtime: st.mtimeMs })
      }
    }
    if (wantImg) scan(IMG_DIR, '/api/v1/uploads', 'image')
    if (wantVid) scan(VID_DIR, '/api/v1/videos', 'video')
    items.sort((a, b) => b.mtime - a.mtime)
    res.json({ ok: true, items: items.slice(0, 120) })
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e) })
  }
})

r.delete('/', express.json({ limit: '1mb' }), async (req, res) => {
  try {
    if (!(await guard(req, res))) return
    const raw = String((req.body || {}).url || '')
    const clean = raw.replace(/^\.?\//, '')
    let dir = null
    let prefix = ''
    if (clean.startsWith('api/v1/uploads/')) { dir = IMG_DIR; prefix = 'api/v1/uploads/' }
    else if (clean.startsWith('api/v1/videos/')) { dir = VID_DIR; prefix = 'api/v1/videos/' }
    else return res.status(400).json({ ok: false, error: 'bad_url' })
    const rest = clean.slice(prefix.length)
    if (!rest || rest.includes('/') || rest.includes('\\') || rest.includes('..')) return res.status(400).json({ ok: false, error: 'bad_name' })
    const safe = safeName(rest)
    if (!safe || safe !== rest.toLowerCase()) return res.status(400).json({ ok: false, error: 'bad_name' })
    const full = join(dir, safe)
    let st = null
    try { st = statSync(full) } catch { return res.status(404).json({ ok: false, error: 'not_found' }) }
    if (!st.isFile()) return res.status(404).json({ ok: false, error: 'not_found' })
    try { unlinkSync(full) } catch { return res.status(500).json({ ok: false, error: 'persist' }) }
    res.json({ ok: true, url: `/${prefix}${safe}` })
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e) })
  }
})

r.get('/limits', (_, res) => {
  res.json({
    ok: true,
    imageMaxBytes: IMAGE_MAX_BYTES,
    videoMaxBytes: VIDEO_MAX_BYTES,
    jsonMaxBytes: JSON_MAX_BYTES,
  })
})

export default r
export { JSON_MAX_BYTES }

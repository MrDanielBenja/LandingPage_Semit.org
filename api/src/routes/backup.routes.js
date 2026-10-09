import { Router } from 'express'
import express from 'express'
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, extname } from 'node:path'
import { CONTENT_PAGES, readContent, writeContent } from '../content.js'
import { requireAdmin } from '../guard.js'
import { IMAGE_EXTS, VIDEO_EXTS, IMAGE_MAX_BYTES, VIDEO_MAX_BYTES, sniffKind, safeName } from '../media.js'
import { zipBuild, zipParse, ZIP_LIMITS } from '../zip.js'

const r = Router()

const here = dirname(fileURLToPath(import.meta.url))
const IMG_DIR = join(here, '..', '..', 'uploads', 'cms')
const VID_DIR = join(here, '..', '..', 'uploads', 'videos')

function mediaList() {
  const items = []
  const scan = (dir, prefix) => {
    let names = []
    try { names = readdirSync(dir) } catch { return }
    for (const n of names) {
      if (n === '.gitkeep' || n.startsWith('.')) continue
      const full = join(dir, n)
      let st = null
      try { st = statSync(full) } catch { continue }
      if (!st.isFile()) continue
      items.push({ dir, name: n, full, url: `${prefix}/${n}`, bytes: st.size, mtime: st.mtimeMs })
    }
  }
  scan(IMG_DIR, '/api/v1/uploads')
  scan(VID_DIR, '/api/v1/videos')
  items.sort((a, b) => a.name.localeCompare(b.name))
  return items
}

async function check(req, res) {
  return requireAdmin(req, res)
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

r.get('/media.zip', async (req, res) => {
  if (!(await check(req, res))) return
  try {
    const items = mediaList()
    const entries = []
    for (const it of items) {
      if (entries.length >= ZIP_LIMITS.filesMax) break
      let data = null
      try { data = readFileSync(it.full) } catch { continue }
      if (!data.length || data.length > ZIP_LIMITS.entryMax) continue
      const folder = it.dir === VID_DIR ? 'videos' : 'cms'
      entries.push({ name: `${folder}/${it.name}`, data })
    }
    const manifest = {
      app: 'semit-medios',
      version: 1,
      fecha: new Date().toISOString(),
      count: entries.length,
      files: entries.map((e) => e.name),
    }
    const buf = zipBuild([{ name: 'manifest.json', data: Buffer.from(JSON.stringify(manifest, null, 1)) }, ...entries])
    const d = new Date()
    const p = (n) => String(n).padStart(2, '0')
    res.set('Content-Type', 'application/zip')
    res.set('Content-Disposition', `attachment; filename="semit-medios-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}.zip"`)
    res.set('X-Media-Count', String(entries.length))
    res.send(buf)
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e) })
  }
})

r.post('/restore-media', express.raw({ type: 'application/octet-stream', limit: Math.ceil(VIDEO_MAX_BYTES / 1024 / 1024) + 'mb' }), async (req, res) => {
  if (!(await check(req, res))) return
  try {
    if (!req.body || !req.body.length) return res.status(400).json({ ok: false, error: 'missing' })
    let entries = []
    try {
      entries = zipParse(req.body)
    } catch (e) {
      const code = e.code || 'format'
      return res.status(400).json({ ok: false, error: code === 'magic' || code === 'truncated' ? 'bad_zip' : code })
    }
    let saved = 0, skipped = 0
    for (const { name, data } of entries) {
      const clean = String(name || '').replace(/\\/g, '/').replace(/^\.\//, '').replace(/^\/+/, '')
      if (!clean || clean === 'manifest.json') continue
      const parts = clean.split('/').filter(Boolean)
      if (!parts.length) { skipped++; continue }
      const folder = parts[0] === 'videos' ? 'videos' : parts[0] === 'cms' ? 'cms' : null
      if (!folder) { skipped++; continue }
      const rawName = parts.slice(1).join('-') || parts[0]
      const safe = safeName(rawName)
      const ext = extname(safe)
      const allowed = folder === 'videos' ? VIDEO_EXTS : IMAGE_EXTS
      if (!allowed.has(ext)) { skipped++; continue }
      const sniffed = sniffKind(data)
      if (!sniffed) { skipped++; continue }
      const wantKind = folder === 'videos' ? 'video' : 'image'
      if (sniffed.kind !== wantKind) { skipped++; continue }
      const max = sniffed.kind === 'video' ? VIDEO_MAX_BYTES : IMAGE_MAX_BYTES
      if (max > 0 && data.length > max) { skipped++; continue }
      const dir = folder === 'videos' ? VID_DIR : IMG_DIR
      mkdirSync(dir, { recursive: true })
      try {
        writeFileSync(join(dir, safe), data)
        saved++
      } catch { skipped++ }
    }
    res.json({ ok: true, saved, skipped })
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e) })
  }
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

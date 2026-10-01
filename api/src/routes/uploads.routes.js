import { Router } from 'express'
import express from 'express'
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, extname } from 'node:path'
import { checkToken } from '../auth.js'
import { IMAGE_EXTS, VIDEO_EXTS, IMAGE_MAX_BYTES, VIDEO_MAX_BYTES, JSON_MAX_BYTES, sniffKind, safeName } from '../media.js'

const here = dirname(fileURLToPath(import.meta.url))
const IMG_DIR = join(here, '..', '..', 'uploads', 'cms')
const VID_DIR = join(here, '..', '..', 'uploads', 'videos')
const r = Router()

async function guard(req, res) {
  const syncT = process.env.SYNC_TOKEN
  const adminT = req.headers['x-admin-token']
  const okSync = syncT && req.headers['x-sync-token'] === syncT
  const okAdmin = adminT && (await checkToken(adminT))
  const openDev = (!process.env.DATABASE_URL && !process.env.MYSQL_URL && !process.env.MYSQL_PUBLIC_URL) && !process.env.ADMIN_PIN && !syncT
  if (!okSync && !okAdmin && !openDev) {
    res.status(401).json({ ok: false, error: 'unauthorized' })
    return false
  }
  return true
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
  const file = `${Date.now()}-${safeName(name)}`
  writeFileSync(join(dir, file), buf)
  const prefix = sniffed.kind === 'video' ? '/api/v1/videos' : '/api/v1/uploads'
  return { url: `${prefix}/${file}`, kind: sniffed.kind, mime: sniffed.mime, bytes: buf.length }
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

export default r
export { JSON_MAX_BYTES }

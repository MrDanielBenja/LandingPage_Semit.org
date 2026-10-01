import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, rmSync, readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'

delete process.env.DATABASE_URL
delete process.env.MYSQL_URL
delete process.env.MYSQL_PUBLIC_URL
delete process.env.ADMIN_PIN
delete process.env.ADMIN_PASS
delete process.env.SYNC_TOKEN

const here = dirname(fileURLToPath(import.meta.url))
const CMS_DIR = join(here, '..', 'uploads', 'cms')
const VID_DIR = join(here, '..', 'uploads', 'videos')
const { default: uploadsRouter } = await import('../src/routes/uploads.routes.js')
const { sniffKind, safeName } = await import('../src/media.js')

let base = ''
let srv = null
const created = []

function app() {
  const a = express()
  a.use('/api/v1/uploads', uploadsRouter)
  a.use('/api/v1/uploads', express.static(CMS_DIR, { fallthrough: true }))
  a.use('/api/v1/videos', express.static(VID_DIR, { fallthrough: true }))
  return a
}

before(async () => {
  mkdirSync(CMS_DIR, { recursive: true })
  mkdirSync(VID_DIR, { recursive: true })
  const a = app()
  srv = a.listen(0, '127.0.0.1')
  await new Promise((r) => srv.once('listening', r))
  base = `http://127.0.0.1:${srv.address().port}`
})

after(async () => {
  for (const f of created) rmSync(f, { force: true })
  if (srv) await new Promise((r) => srv.close(r))
})

const PNG_1PX = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
const MP4_MIN = Buffer.concat([Buffer.from([0, 0, 0, 0x18]), Buffer.from('ftypisom'), Buffer.alloc(64)])
const WEBM_MIN = Buffer.concat([Buffer.from([0x1A, 0x45, 0xDF, 0xA3]), Buffer.alloc(64)])
const OGG_MIN = Buffer.concat([Buffer.from('OggS'), Buffer.alloc(64)])

describe('media backend - sniffKind y safeName', () => {
  it('detecta jpeg/png/gif/webp/mp4/webm/ogg', () => {
    assert.equal(sniffKind(Buffer.from([0xFF, 0xD8, 0xFF, 0, 0, 0, 0, 0, 0, 0, 0, 0])).mime, 'image/jpeg')
    assert.equal(sniffKind(Buffer.from(PNG_1PX, 'base64')).mime, 'image/png')
    assert.equal(sniffKind(Buffer.concat([Buffer.from('GIF89a'), Buffer.alloc(16)])).mime, 'image/gif')
    assert.equal(sniffKind(Buffer.concat([Buffer.alloc(8), Buffer.from('WEBP'), Buffer.alloc(8)])).mime, 'image/webp')
    assert.equal(sniffKind(MP4_MIN).mime, 'video/mp4')
    assert.equal(sniffKind(WEBM_MIN).mime, 'video/webm')
    assert.equal(sniffKind(OGG_MIN).mime, 'video/ogg')
  })
  it('rechaza ejecutables y textos', () => {
    assert.equal(sniffKind(Buffer.concat([Buffer.from('MZ'), Buffer.alloc(32)])), null)
    assert.equal(sniffKind(Buffer.concat([Buffer.from('#!/bin/sh'), Buffer.alloc(32)])), null)
    assert.equal(sniffKind(Buffer.alloc(4)), null)
  })
  it('safeName neutraliza traversal', () => {
    assert.ok(!safeName('../../etc/passwd.jpg').includes('/'))
    assert.ok(!safeName('C:\\win\\x.png').includes('\\'))
    assert.ok(safeName('  Mi Foto 2024.JPG  ').length <= 120)
  })
})

describe('media backend - POST /api/v1/uploads (base64)', () => {
  it('sube png real y lo sirve', async () => {
    const r = await fetch(`${base}/api/v1/uploads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'test.png', dataUrl: `data:image/png;base64,${PNG_1PX}` }),
    })
    assert.equal(r.status, 200)
    const j = await r.json()
    assert.equal(j.ok, true)
    assert.equal(j.kind, 'image')
    assert.match(j.url, /^\/api\/v1\/uploads\//)
    const file = join(CMS_DIR, j.url.split('/').pop())
    created.push(file)
    const got = await fetch(`${base}${j.url}`)
    assert.equal(got.status, 200)
    assert.match(got.headers.get('content-type') || '', /image\/png/)
  })

  it('rechaza exe disfrazado de jpg (contenido manda)', async () => {
    const fake = Buffer.concat([Buffer.from('MZ'), Buffer.alloc(64)]).toString('base64')
    const r = await fetch(`${base}/api/v1/uploads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'mal.jpg', dataUrl: `data:image/jpeg;base64,${fake}` }),
    })
    assert.equal(r.status, 400)
    assert.equal((await r.json()).error, 'format')
  })

  it('rechaza extension no permitida', async () => {
    const r = await fetch(`${base}/api/v1/uploads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'x.svg', dataUrl: `data:image/png;base64,${PNG_1PX}` }),
    })
    assert.equal(r.status, 400)
    assert.equal((await r.json()).error, 'ext')
  })
})

describe('media backend - POST /api/v1/uploads/binary', () => {
  it('sube mp4 binario y lo sirve en /api/v1/videos', async () => {
    const r = await fetch(`${base}/api/v1/uploads/binary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream', 'x-file-name': encodeURIComponent('clip.mp4') },
      body: MP4_MIN,
    })
    assert.equal(r.status, 200)
    const j = await r.json()
    assert.equal(j.kind, 'video')
    assert.match(j.url, /^\/api\/v1\/videos\//)
    created.push(join(VID_DIR, j.url.split('/').pop()))
    const got = await fetch(`${base}${j.url}`)
    assert.equal(got.status, 200)
  })

  it('kind=image rechaza video aunque la extension sea valida', async () => {
    const b64 = MP4_MIN.toString('base64')
    const r = await fetch(`${base}/api/v1/uploads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'clip.mp4', dataUrl: `data:video/mp4;base64,${b64}`, kind: 'image' }),
    })
    assert.equal(r.status, 400)
  })

  it('requiere auth cuando hay ADMIN_PIN', async () => {
    process.env.ADMIN_PIN = 'secreto-media'
    try {
      const denied = await fetch(`${base}/api/v1/uploads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'a.png', dataUrl: `data:image/png;base64,${PNG_1PX}` }),
      })
      assert.equal(denied.status, 401)
    } finally {
      delete process.env.ADMIN_PIN
    }
  })
})

import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, copyFileSync, rmSync } from 'node:fs'
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
const DATA = join(here, '..', 'data')
const TRASH = join(here, '.bak-integration')
const { default: backupRouter } = await import('../src/routes/backup.routes.js')
const { default: contentRouter } = await import('../src/routes/content.routes.js')
const { CONTENT_PAGES } = await import('../src/content.js')

let base = ''
let srv = null
const saved = new Map()

function app() {
  const a = express()
  a.use(express.json({ limit: '15mb' }))
  a.use('/api/v1/backup', backupRouter)
  a.use('/api/v1/content', contentRouter)
  return a
}

before(async () => {
  mkdirSync(TRASH, { recursive: true })
  for (const f of readdirSync(DATA)) {
    if (!f.endsWith('.json')) continue
    saved.set(f, readFileSync(join(DATA, f), 'utf-8'))
    copyFileSync(join(DATA, f), join(TRASH, f))
  }
  const a = app()
  srv = a.listen(0, '127.0.0.1')
  await new Promise((r) => srv.once('listening', r))
  base = `http://127.0.0.1:${srv.address().port}`
})

after(async () => {
  for (const [f, c] of saved) writeFileSync(join(DATA, f), c)
  rmSync(TRASH, { recursive: true, force: true })
  delete process.env.SYNC_TOKEN
  if (srv) await new Promise((r) => srv.close(r))
})

describe('CMS respaldo - GET /api/v1/backup', () => {
  it('retorna bundle semit-cms sin pagina cursos', async () => {
    const r = await fetch(`${base}/api/v1/backup`)
    assert.equal(r.status, 200)
    const b = await r.json()
    assert.equal(b.app, 'semit-cms')
    assert.equal(b.version, 1)
    assert.ok(!Number.isNaN(Date.parse(b.fecha)))
    assert.ok(b.pages && typeof b.pages === 'object')
    assert.ok(!('cursos' in b.pages))
    for (const k of Object.keys(b.pages)) assert.ok(CONTENT_PAGES.includes(k), `pagina inesperada ${k}`)
  })
})

describe('CMS respaldo - POST /api/v1/backup/restore', () => {
  it('400 si app/pages invalidos', async () => {
    for (const body of [{}, { app: 'otro', pages: {} }, { app: 'semit-cms' }]) {
      const r = await fetch(`${base}/api/v1/backup/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      assert.equal(r.status, 400)
      assert.equal((await r.json()).error, 'bad_backup')
    }
  })

  it('ignora paginas desconocidas y valores no-objeto', async () => {
    const r = await fetch(`${base}/api/v1/backup/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app: 'semit-cms', pages: { rara: { x: 1 }, site: null, inicio: 'no-objeto' } }),
    })
    assert.equal(r.status, 200)
    assert.deepEqual((await r.json()).restored, [])
  })

  it('roundtrip: GET -> modifica site -> restore -> GET verifica', async () => {
    const orig = await (await fetch(`${base}/api/v1/backup`)).json()
    const bundle = JSON.parse(JSON.stringify(orig))
    bundle.pages.site = { ...bundle.pages.site, _it: 'integracion' }
    const w = await fetch(`${base}/api/v1/backup/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bundle),
    })
    assert.equal(w.status, 200)
    assert.ok((await w.json()).restored.includes('site'))
    const afterGet = await (await fetch(`${base}/api/v1/backup`)).json()
    assert.deepEqual(afterGet.pages.site, bundle.pages.site)
    const back = await fetch(`${base}/api/v1/backup/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orig),
    })
    assert.equal(back.status, 200)
  })

  it('401 sin token cuando hay SYNC_TOKEN', async () => {
    process.env.SYNC_TOKEN = 'secreto-test'
    try {
      const denied = await fetch(`${base}/api/v1/backup/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app: 'semit-cms', pages: { site: { a: 1 } } }),
      })
      assert.equal(denied.status, 401)
      const ok = await fetch(`${base}/api/v1/backup/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-sync-token': 'secreto-test' },
        body: JSON.stringify({ app: 'semit-cms', pages: { site: { a: 1 } } }),
      })
      assert.equal(ok.status, 200)
    } finally {
      delete process.env.SYNC_TOKEN
    }
  })
})

describe('CMS contenido - flujo BackupPanel applyAll (PUT /api/v1/content/:page)', () => {
  it('PUT persiste y GET lo devuelve (integracion respaldo)', async () => {
    const cur = await (await fetch(`${base}/api/v1/content/site`)).json()
    const next = { ...(cur.data || {}), _panel: Date.now() }
    const w = await fetch(`${base}/api/v1/content/site`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: next }),
    })
    assert.equal(w.status, 200)
    const got = await (await fetch(`${base}/api/v1/content/site`)).json()
    assert.deepEqual(got.data, next)
  })

  it('404 pagina desconocida y 400 sin data', async () => {
    assert.equal((await fetch(`${base}/api/v1/content/nope`)).status, 404)
    const w = await fetch(`${base}/api/v1/content/site`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    assert.equal(w.status, 400)
  })

  it('el archivo en disco refleja el restore', async () => {
    const file = join(DATA, 'contacto.json')
    assert.ok(existsSync(file))
    const beforeDisk = JSON.parse(readFileSync(file, 'utf-8'))
    const bundle = await (await fetch(`${base}/api/v1/backup`)).json()
    bundle.pages.contacto = { ...bundle.pages.contacto, _disk: 'si' }
    await fetch(`${base}/api/v1/backup/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bundle),
    })
    assert.equal(JSON.parse(readFileSync(file, 'utf-8'))._disk, 'si')
    writeFileSync(file, JSON.stringify(beforeDisk, null, 1))
  })
})

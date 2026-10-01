import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync, rmSync } from 'node:fs'
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
const TRASH = join(here, '.bak-niveles-intro')
const { default: backupRouter } = await import('../src/routes/backup.routes.js')
const { default: contentRouter } = await import('../src/routes/content.routes.js')

let base = ''
let srv = null
const saved = new Map()
const INTRO_KEYS = ['intro_t_es', 'intro_t_en', 'intro_d_es', 'intro_d_en']

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
  if (srv) await new Promise((r) => srv.close(r))
})

describe('niveles intro - GET /api/v1/content/niveles trae intro_*', () => {
  it('subs pre/post y maestrias traen los 4 campos string', async () => {
    const r = await fetch(`${base}/api/v1/content/niveles`)
    assert.equal(r.status, 200)
    const { data } = await r.json()
    for (const g of ['pre', 'post']) {
      assert.ok(Array.isArray(data.subs?.[g]) && data.subs[g].length > 0, `subs.${g}`)
      for (const s of data.subs[g]) {
        for (const k of INTRO_KEYS) assert.equal(typeof s[k], 'string', `subs.${g}.${s.id}.${k}`)
      }
    }
    assert.ok(Array.isArray(data.maestrias) && data.maestrias.length === 2)
    for (const m of data.maestrias) {
      for (const k of INTRO_KEYS) assert.equal(typeof m[k], 'string', `maestrias.${m.id}.${k}`)
    }
  })

  it('el bundle de backup incluye los intros', async () => {
    const b = await (await fetch(`${base}/api/v1/backup`)).json()
    const cert = b.pages.niveles.subs.pre.find((s) => s.id === 'certificado')
    assert.ok(cert)
    for (const k of INTRO_KEYS) assert.equal(typeof cert[k], 'string')
  })
})

describe('niveles intro - PUT roundtrip + restore', () => {
  it('editar intro_t/d de un sub persiste y se lee igual', async () => {
    const cur = await (await fetch(`${base}/api/v1/content/niveles`)).json()
    const next = JSON.parse(JSON.stringify(cur.data))
    const cert = next.subs.pre.find((s) => s.id === 'certificado')
    cert.intro_t_es = 'T integracion'
    cert.intro_d_es = 'D integracion'
    const w = await fetch(`${base}/api/v1/content/niveles`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: next }),
    })
    assert.equal(w.status, 200)
    const got = await (await fetch(`${base}/api/v1/content/niveles`)).json()
    const back = got.data.subs.pre.find((s) => s.id === 'certificado')
    assert.equal(back.intro_t_es, 'T integracion')
    assert.equal(back.intro_d_es, 'D integracion')
    assert.equal(JSON.parse(readFileSync(join(DATA, 'niveles.json'), 'utf-8')).subs.pre.find((s) => s.id === 'certificado').intro_t_es, 'T integracion')
  })

  it('maestria con intro personalizada sobrevive al restore', async () => {
    const bundle = await (await fetch(`${base}/api/v1/backup`)).json()
    const art = bundle.pages.niveles.maestrias.find((m) => m.id === 'artes')
    art.intro_t_es = 'Artes restore'
    art.intro_d_en = 'Arts restore'
    const w = await fetch(`${base}/api/v1/backup/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bundle),
    })
    assert.equal(w.status, 200)
    assert.ok((await w.json()).restored.includes('niveles'))
    const got = await (await fetch(`${base}/api/v1/content/niveles`)).json()
    const back = got.data.maestrias.find((m) => m.id === 'artes')
    assert.equal(back.intro_t_es, 'Artes restore')
    assert.equal(back.intro_d_en, 'Arts restore')
  })
})

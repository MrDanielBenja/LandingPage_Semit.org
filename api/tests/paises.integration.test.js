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
process.env.NODE_ENV = 'test'
process.env.ALLOW_OPEN_DEV = '1'

const here = dirname(fileURLToPath(import.meta.url))
const DATA = join(here, '..', 'data')
const TRASH = join(here, '.bak-paises')
const { default: backupRouter } = await import('../src/routes/backup.routes.js')
const { default: contentRouter } = await import('../src/routes/content.routes.js')

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
  if (srv) await new Promise((r) => srv.close(r))
})

describe('equipo paises - GET trae filtro y members coherentes', () => {
  it('equipo.paises es arreglo con ids unicos y members dentro del filtro', async () => {
    const { data } = await (await fetch(`${base}/api/v1/content/nosotros`)).json()
    assert.ok(Array.isArray(data.equipo.paises) && data.equipo.paises.length >= 4)
    const ids = new Set(data.equipo.paises.map((p) => p.id))
    assert.equal(ids.size, data.equipo.paises.length, 'ids duplicados')
    for (const m of data.equipo.members) {
      assert.ok(ids.has(m.p), `miembro ${m.n} con pais ${m.p} fuera del filtro`)
    }
    assert.ok(!data.equipo.members.some((m) => m.p === 'REP DOM'), 'REP DOM debe estar normalizado a DOM')
  })

  it('el bundle de backup incluye paises', async () => {
    const b = await (await fetch(`${base}/api/v1/backup`)).json()
    assert.ok(Array.isArray(b.pages.nosotros.equipo.paises))
  })
})

describe('equipo paises - PUT roundtrip + restore', () => {
  it('agregar CHL al filtro y asignarlo a un miembro persiste', async () => {
    const cur = await (await fetch(`${base}/api/v1/content/nosotros`)).json()
    const next = JSON.parse(JSON.stringify(cur.data))
    next.equipo.paises.push({ id: 'CHL', iso2: 'CL', name_es: 'Chile', name_en: 'Chile' })
    next.equipo.members[0].p = 'CHL'
    const w = await fetch(`${base}/api/v1/content/nosotros`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: next }),
    })
    assert.equal(w.status, 200)
    const got = await (await fetch(`${base}/api/v1/content/nosotros`)).json()
    assert.ok(got.data.equipo.paises.some((p) => p.id === 'CHL'))
    assert.equal(got.data.equipo.members[0].p, 'CHL')
  })

  it('quitar un pais reasigna miembros huerfanos via restore', async () => {
    const bundle = await (await fetch(`${base}/api/v1/backup`)).json()
    bundle.pages.nosotros.equipo.paises = bundle.pages.nosotros.equipo.paises.filter((p) => p.id !== 'ARG')
    for (const m of bundle.pages.nosotros.equipo.members) {
      if (m.p === 'ARG') m.p = 'PER'
    }
    const w = await fetch(`${base}/api/v1/backup/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bundle),
    })
    assert.equal(w.status, 200)
    const got = await (await fetch(`${base}/api/v1/content/nosotros`)).json()
    assert.ok(!got.data.equipo.paises.some((p) => p.id === 'ARG'))
    assert.ok(!got.data.equipo.members.some((m) => m.p === 'ARG'))
  })
})

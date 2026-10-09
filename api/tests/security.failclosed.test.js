import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, existsSync, unlinkSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'

const here = dirname(fileURLToPath(import.meta.url))
const DATA = join(here, '..', 'data')
const SESS = join(DATA, '.sessions.json')
const TRASH = join(here, '.bak-failclosed')
const saved = new Map()
let savedSess = null
let hadSess = false

function cleanEnv() {
  delete process.env.DATABASE_URL
  delete process.env.MYSQL_URL
  delete process.env.MYSQL_PUBLIC_URL
  delete process.env.ADMIN_PIN
  delete process.env.ADMIN_PASS
  delete process.env.SYNC_TOKEN
  delete process.env.ALLOW_OPEN_DEV
  delete process.env.NODE_ENV
}

function app() {
  const a = express()
  a.use(express.json({ limit: '12mb' }))
  return a
}

let backupRouter, contentRouter, uploadsRouter, cursosRouter, guard, authMod

before(async () => {
  cleanEnv()
  mkdirSync(TRASH, { recursive: true })
  for (const f of readdirSync(DATA)) {
    if (!f.endsWith('.json')) continue
    if (f === '.sessions.json') continue
    saved.set(f, readFileSync(join(DATA, f), 'utf-8'))
  }
  hadSess = existsSync(SESS)
  if (hadSess) savedSess = readFileSync(SESS, 'utf-8')
  try { unlinkSync(SESS) } catch {}
  guard = await import('../src/guard.js')
  authMod = await import('../src/auth.js')
  ;({ default: backupRouter } = await import('../src/routes/backup.routes.js'))
  ;({ default: contentRouter } = await import('../src/routes/content.routes.js'))
  ;({ default: uploadsRouter } = await import('../src/routes/uploads.routes.js'))
  ;({ default: cursosRouter } = await import('../src/routes/cursos.routes.js'))
})

after(async () => {
  for (const [f, c] of saved) writeFileSync(join(DATA, f), c)
  try { unlinkSync(SESS) } catch {}
  if (hadSess && savedSess != null) writeFileSync(SESS, savedSess)
  rmSync(TRASH, { recursive: true, force: true })
  cleanEnv()
})

function mount(...routers) {
  const a = app()
  for (const [p, r] of routers) a.use(p, r)
  return a
}

async function listen(a) {
  const srv = a.listen(0, '127.0.0.1')
  await new Promise((r) => srv.once('listening', r))
  const base = `http://127.0.0.1:${srv.address().port}`
  return { srv, base, close: () => new Promise((r) => srv.close(r)) }
}

describe('P0 fail-closed: sin credenciales en produccion todo admin es 401', () => {
  it('PUT content / POST uploads / GET backup / POST restore / POST sync => 401', async () => {
    cleanEnv()
    process.env.NODE_ENV = 'production'
    const { srv, base, close } = await listen(mount(
      ['/api/v1/content', contentRouter],
      ['/api/v1/uploads', uploadsRouter],
      ['/api/v1/backup', backupRouter],
      ['/api/v1/cursos', cursosRouter],
    ))
    try {
      const png1px = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
      const put = await fetch(`${base}/api/v1/content/site`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { x: 1 } }),
      })
      assert.equal(put.status, 401)
      const up = await fetch(`${base}/api/v1/uploads`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'a.png', dataUrl: `data:image/png;base64,${png1px}` }),
      })
      assert.equal(up.status, 401)
      const bak = await fetch(`${base}/api/v1/backup`)
      assert.equal(bak.status, 401)
      const res = await fetch(`${base}/api/v1/backup/restore`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app: 'semit-cms', pages: { site: { a: 1 } } }),
      })
      assert.equal(res.status, 401)
      const sync = await fetch(`${base}/api/v1/cursos/sync`, { method: 'POST' })
      assert.equal(sync.status, 401)
      const lst = await fetch(`${base}/api/v1/uploads/list`)
      assert.equal(lst.status, 401)
      const del = await fetch(`${base}/api/v1/uploads`, {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: '/api/v1/uploads/x.png' }),
      })
      assert.equal(del.status, 401)
      const mz = await fetch(`${base}/api/v1/backup/media.zip`)
      assert.equal(mz.status, 401)
      const rm = await fetch(`${base}/api/v1/backup/restore-media`, {
        method: 'POST', headers: { 'Content-Type': 'application/octet-stream' },
        body: Buffer.from('x'),
      })
      assert.equal(rm.status, 401)
      const diag = await fetch(`${base}/api/v1/content/site`)
      assert.equal(diag.status, 200)
    } finally {
      await close()
      cleanEnv()
    }
  })

  it('openDev solo con ALLOW_OPEN_DEV=1 + NODE_ENV=test y sin credenciales', async () => {
    cleanEnv()
    process.env.NODE_ENV = 'test'
    process.env.ALLOW_OPEN_DEV = '1'
    assert.equal(guard.allowOpenDev(), true)
    cleanEnv()
    process.env.NODE_ENV = 'production'
    process.env.ALLOW_OPEN_DEV = '1'
    assert.equal(guard.allowOpenDev(), false)
    cleanEnv()
    process.env.NODE_ENV = 'test'
    process.env.ADMIN_PIN = 'algo'
    process.env.ALLOW_OPEN_DEV = '1'
    assert.equal(guard.allowOpenDev(), false)
    cleanEnv()
  })

  it('con SYNC_TOKEN valido las operaciones admin funcionan', async () => {
    cleanEnv()
    process.env.NODE_ENV = 'production'
    process.env.SYNC_TOKEN = 'tok-seguro'
    const { srv, base, close } = await listen(mount(
      ['/api/v1/content', contentRouter],
      ['/api/v1/backup', backupRouter],
    ))
    try {
      const denied = await fetch(`${base}/api/v1/content/site`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { x: 1 } }),
      })
      assert.equal(denied.status, 401)
      const ok = await fetch(`${base}/api/v1/content/site`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-sync-token': 'tok-seguro' },
        body: JSON.stringify({ data: { x: 1, _sec: 'ok' } }),
      })
      assert.equal(ok.status, 200)
      const got = await (await fetch(`${base}/api/v1/content/site`)).json()
      assert.equal(got.data._sec, 'ok')
      const bak = await fetch(`${base}/api/v1/backup`, { headers: { 'x-sync-token': 'tok-seguro' } })
      assert.equal(bak.status, 200)
    } finally {
      await close()
      cleanEnv()
    }
  })
})

describe('P1 auth: login, token, logout, password', () => {
  it('login invalido falla, token malformado falla, login valido funciona y logout invalida', async () => {
    cleanEnv()
    process.env.ADMIN_USER = 'admin'
    process.env.ADMIN_PIN = 'clave-test-larga-123'
    const bad = await authMod.loginAdmin('admin', 'otra')
    assert.equal(bad, null)
    assert.equal(await authMod.checkToken('invalido'), false)
    assert.equal(await authMod.checkToken('x'.repeat(64)), false)
    const out = await authMod.loginAdmin('admin', 'clave-test-larga-123')
    assert.ok(out && /^[0-9a-f]{64}$/i.test(out.token))
    assert.equal(await authMod.checkToken(out.token), true)
    assert.equal(await authMod.tokenUser(out.token), 'admin')
    await authMod.logoutToken(out.token)
    assert.equal(await authMod.checkToken(out.token), false)
    cleanEnv()
  })

  it('changePass invalida sesiones anteriores', async () => {
    cleanEnv()
    process.env.ADMIN_USER = 'admin'
    process.env.ADMIN_PIN = 'clave-uno-larga'
    const s1 = await authMod.loginAdmin('admin', 'clave-uno-larga')
    assert.ok(s1)
    const ok = await authMod.changePass('admin', 'clave-uno-larga', 'clave-dos-larga')
    assert.equal(ok, true)
    assert.equal(await authMod.checkToken(s1.token), false)
    const s2 = await authMod.loginAdmin('admin', 'clave-dos-larga')
    assert.ok(s2)
    await authMod.logoutToken(s2.token)
    cleanEnv()
  })
})

describe('P1 uploads: limites y validacion', () => {
  it('media.js usa limites seguros por defecto', async () => {
    cleanEnv()
    const m = await import('../src/media.js?failclosed=1')
    assert.ok(m.IMAGE_MAX_BYTES <= 25 * 1024 * 1024)
    assert.ok(m.VIDEO_MAX_BYTES <= 200 * 1024 * 1024)
    assert.ok(m.JSON_MAX_BYTES <= 20 * 1024 * 1024)
  })

  it('rechaza exe disfrazado, extension mala y traversal neutralizado', async () => {
    cleanEnv()
    process.env.NODE_ENV = 'test'
    process.env.ALLOW_OPEN_DEV = '1'
    const { srv, base, close } = await listen(mount(['/api/v1/uploads', uploadsRouter]))
    try {
      const fake = Buffer.concat([Buffer.from('MZ'), Buffer.alloc(64)]).toString('base64')
      const r1 = await fetch(`${base}/api/v1/uploads`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'mal.jpg', dataUrl: `data:image/jpeg;base64,${fake}` }),
      })
      assert.equal(r1.status, 400)
      const png1px = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
      const r2 = await fetch(`${base}/api/v1/uploads`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'x.svg', dataUrl: `data:image/png;base64,${png1px}` }),
      })
      assert.equal(r2.status, 400)
      const m = await import('../src/media.js')
      assert.ok(!m.safeName('../../etc/passwd.jpg').includes('/'))
      assert.ok(!m.safeName('C:\\win\\x.png').includes('\\'))
    } finally {
      await close()
      cleanEnv()
    }
  })
})

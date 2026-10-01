import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'

function mockStorage() {
  const m = new Map()
  globalThis.localStorage = {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => void m.set(k, String(v)),
    removeItem: (k) => void m.delete(k),
    clear: () => void m.clear(),
    _map: m,
  }
}
mockStorage()

const backup = await import('../src/core/cms/backup.js')
const {
  BACKUP_PAGES, BACKUP_DEFAULTS,
  validateBackup, deepDiff, diffSummary, short,
  collectBackup, readPageLocal,
  pushAuto, listAutos,
  readLastExport, diffDetailSinceLast,
  downloadBackup,
} = backup

describe('respaldo CMS - constantes', () => {
  it('BACKUP_PAGES cubre las 7 paginas del CMS', () => {
    assert.deepEqual(BACKUP_PAGES, ['inicio', 'nosotros', 'niveles', 'cursosPage', 'eventos', 'contacto', 'site'])
  })
  it('BACKUP_DEFAULTS tiene objeto para cada pagina', () => {
    for (const k of BACKUP_PAGES) {
      assert.ok(BACKUP_DEFAULTS[k] && typeof BACKUP_DEFAULTS[k] === 'object', `falta default ${k}`)
    }
  })
})

describe('validateBackup', () => {
  const good = { app: 'semit-cms', version: 1, fecha: new Date().toISOString(), pages: { inicio: { a: 1 }, site: {} } }
  it('acepta respaldo valido', () => assert.equal(validateBackup(good), null))
  it('rechaza null / no objeto', () => {
    assert.equal(validateBackup(null), 'Archivo inválido')
    assert.equal(validateBackup('x'), 'Archivo inválido')
  })
  it('rechaza app distinta', () => assert.equal(validateBackup({ ...good, app: 'otro' }), 'No es un respaldo SEMIT'))
  it('rechaza sin pages', () => assert.equal(validateBackup({ app: 'semit-cms' }), 'Sin páginas'))
  it('rechaza sin paginas conocidas', () => assert.equal(validateBackup({ app: 'semit-cms', pages: { raro: {} } }), 'Sin páginas conocidas'))
  it('acepta aunque traiga paginas extra', () => {
    assert.equal(validateBackup({ app: 'semit-cms', pages: { inicio: {}, extra: 1 } }), null)
  })
})

describe('short', () => {
  it('formatea primitivos y bordes', () => {
    assert.equal(short(undefined), '—')
    assert.equal(short(null), 'null')
    assert.equal(short(''), '—')
    assert.equal(short(5), '5')
    assert.equal(short(true), 'true')
  })
  it('trunca strings largos', () => {
    assert.ok(short('x'.repeat(100)).endsWith('…'))
    assert.equal(short('hola'), 'hola')
  })
  it('resume arrays y objetos', () => {
    assert.equal(short([1, 2]), '[2]')
    assert.equal(short({}), '{}')
    assert.ok(short({ a: 1, b: 2, c: 3, d: 4 }).includes('+1'))
  })
})

describe('deepDiff / diffSummary', () => {
  it('sin diferencias retorna vacio', () => {
    assert.deepEqual(deepDiff({ a: 1 }, { a: 1 }), [])
    assert.deepEqual(diffSummary({ inicio: { a: 1 } }, { inicio: { a: 1 } }), [])
  })
  it('detecta edit/add/del en plano', () => {
    const d = deepDiff({ a: 1, b: 2 }, { a: 1, b: 3, c: 4 })
    const byPath = Object.fromEntries(d.map((x) => [x.path, x.kind]))
    assert.equal(byPath.b, 'edit')
    assert.equal(byPath.c, 'add')
    const d2 = deepDiff({ a: 1 }, {})
    assert.equal(d2[0].kind, 'del')
  })
  it('detecta cambios en arrays por indice', () => {
    const d = deepDiff([1, 2], [1, 3, 4])
    assert.ok(d.some((x) => x.path === '[1]'))
    assert.ok(d.some((x) => x.path === '[2]' && x.kind === 'add'))
  })
  it('diffSummary lista paginas cambiadas', () => {
    const a = { inicio: { x: 1 }, site: { y: 1 } }
    const b = { inicio: { x: 2 }, site: { y: 1 } }
    assert.deepEqual(diffSummary(a, b), ['inicio'])
  })
  it('profundidad >4 se ignora (limite interno documentado)', () => {
    const shallow1 = { l1: { l2: { v: 'a' } } }
    const shallow2 = { l1: { l2: { v: 'b' } } }
    assert.equal(deepDiff(shallow1, shallow2).length, 1)
    const deep1 = { l1: { l2: { l3: { l4: { l5: 'a' } } } } }
    const deep2 = { l1: { l2: { l3: { l4: { l5: 'b' } } } } }
    assert.equal(deepDiff(deep1, deep2).length, 0)
  })
  it('arrays planos reportan cada indice (sin tope interno)', () => {
    const big = Array.from({ length: 300 }, (_, i) => i)
    const d = deepDiff([], big)
    assert.equal(d.length, 300)
  })
})

describe('collectBackup / readPageLocal', () => {
  beforeEach(() => localStorage.clear())
  it('usa defaults cuando no hay local', () => {
    const b = collectBackup()
    assert.equal(b.app, 'semit-cms')
    assert.equal(b.version, 1)
    assert.ok(b.fecha)
    for (const k of BACKUP_PAGES) assert.deepEqual(b.pages[k], BACKUP_DEFAULTS[k])
  })
  it('prefiere local sobre defaults', () => {
    localStorage.setItem('semit-cms:inicio', JSON.stringify({ custom: true }))
    assert.deepEqual(readPageLocal('inicio'), { custom: true })
    assert.deepEqual(collectBackup().pages.inicio, { custom: true })
  })
  it('readPageLocal null si vacio o JSON roto', () => {
    assert.equal(readPageLocal('nosotros'), null)
    localStorage.setItem('semit-cms:nosotros', '{roto')
    assert.equal(readPageLocal('nosotros'), null)
  })
})

describe('autos y lastExport', () => {
  beforeEach(() => localStorage.clear())
  it('pushAuto guarda max 10 y listAutos lee', () => {
    for (let i = 0; i < 12; i++) pushAuto(new Date(i * 1000).toISOString())
    const arr = listAutos()
    assert.equal(arr.length, 10)
    assert.ok(arr[0].fecha)
  })
  it('listAutos [] si roto', () => {
    localStorage.setItem('semit-cms:autos', '{roto')
    assert.deepEqual(listAutos(), [])
  })
  it('diffDetailSinceLast null sin export previo', () => {
    assert.deepEqual(diffDetailSinceLast({}), { last: null, changes: null })
  })
  it('diffDetailSinceLast detecta pagina cambiada', () => {
    const base = collectBackup()
    localStorage.setItem('semit-cms:lastexport', JSON.stringify(base))
    const cur = JSON.parse(JSON.stringify(base.pages))
    cur.site = { ...cur.site, _t: 1 }
    const { last, changes } = diffDetailSinceLast(cur)
    assert.ok(last)
    assert.ok(changes.site && changes.site.length > 0)
  })
  it('readLastExport null si vacio', () => {
    assert.equal(readLastExport(), null)
  })
})

describe('downloadBackup', () => {
  beforeEach(() => localStorage.clear())
  it('genera nombre semit-respaldo-*.semit.json y guarda last', () => {
    let clicked = false
    let revoked = false
    globalThis.Blob = class { constructor(p, o) { this.p = p; this.o = o } }
    globalThis.document = { createElement: () => ({ click: () => (clicked = true), href: '', download: '' }) }
    globalThis.URL.createObjectURL = () => 'blob:x'
    globalThis.URL.revokeObjectURL = () => (revoked = true)
    const b = collectBackup()
    const name = downloadBackup(b)
    assert.match(name, /^semit-respaldo-\d{4}-\d{2}-\d{2}\.semit\.json$/)
    assert.ok(clicked)
    assert.deepEqual(JSON.parse(localStorage.getItem('semit-cms:lastexport')).app, 'semit-cms')
    delete globalThis.Blob
    delete globalThis.document
  })
})

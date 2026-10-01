import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

const paises = await import('../src/core/cms/paises.js')
const { PAISES_CATALOG, aliasPaisId, catalogById, searchPaises, normalizePaises, defaultPaises, paisName, flagFor, flagOf } = paises
const { DEFAULT_NOSOTROS } = await import('../src/core/cms/defaultNosotros.js')

describe('paises - catalogo y banderas', () => {
  it('cubre America y resto del mundo', () => {
    assert.ok(PAISES_CATALOG.length > 100)
    for (const id of ['PER', 'ARG', 'COL', 'DOM', 'USA', 'ESP', 'MEX']) {
      assert.ok(catalogById(id), `falta ${id}`)
    }
  })
  it('flagOf genera emojis ISO', () => {
    assert.equal(flagOf('PE'), '🇵🇪')
    assert.equal(flagOf('US'), '🇺🇸')
    assert.equal(flagOf('DO'), '🇩🇴')
    assert.equal(flagOf('x1'), '')
    assert.equal(flagOf('USA'), '')
    assert.equal(flagOf(''), '')
  })
  it('alias normaliza REP DOM y variantes', () => {
    assert.equal(aliasPaisId('REP DOM'), 'DOM')
    assert.equal(aliasPaisId('rep dom'), 'DOM')
    assert.equal(aliasPaisId('RD'), 'DOM')
    assert.equal(aliasPaisId('EEUU'), 'USA')
    assert.equal(aliasPaisId('PER'), 'PER')
    assert.equal(aliasPaisId(''), '')
  })
})

describe('paises - buscador por nombre', () => {
  it('encuentra por nombre ES', () => {
    const r = searchPaises('perú', 'es')
    assert.ok(r.some((p) => p.id === 'PER'), 'debe traer PER')
    assert.equal(r[0].label, r[0].name_es)
  })
  it('encuentra por nombre EN', () => {
    const r = searchPaises('brazil', 'en')
    assert.ok(r.some((p) => p.id === 'BRA'))
  })
  it('encuentra por codigo', () => {
    assert.ok(searchPaises('col', 'es').some((p) => p.id === 'COL'))
    assert.ok(searchPaises('dom', 'es').some((p) => p.id === 'DOM'))
  })
  it('vacio devuelve primeros, limite respeta tope', () => {
    assert.equal(searchPaises('', 'es', 5).length, 5)
    assert.ok(searchPaises('zzz-nada', 'es').length === 0)
  })
})

describe('paises - normalizacion CMS', () => {
  it('dedup y alias', () => {
    const r = normalizePaises(['PER', 'per', 'REP DOM', 'DOM', ''], [])
    assert.deepEqual(r.map((p) => p.id), ['PER', 'DOM'])
  })
  it('acepta objetos y rellena nombres del catalogo', () => {
    const r = normalizePaises([{ id: 'CHL' }], [])
    assert.equal(r[0].name_es, 'Chile')
    assert.equal(r[0].name_en, 'Chile')
  })
  it('fallback cuando vacio', () => {
    assert.deepEqual(defaultPaises().map((p) => p.id), ['PER', 'USA', 'ARG', 'DOM'])
    assert.deepEqual(normalizePaises(null, [{ id: 'MEX' }]).map((p) => p.id), ['MEX'])
  })
  it('paisName y flagFor resuelven ES/EN', () => {
    const list = defaultPaises()
    assert.equal(paisName(list, 'PER', 'es'), 'Perú')
    assert.equal(paisName(list, 'PER', 'en'), 'Peru')
    assert.equal(flagFor(list, 'PER'), '🇵🇪')
    assert.equal(paisName(list, 'REP DOM', 'es'), 'República Dominicana')
  })
  it('DEFAULT_NOSOTROS trae paises', () => {
    assert.deepEqual(DEFAULT_NOSOTROS.equipo.paises.map((p) => p.id), ['PER', 'USA', 'ARG', 'DOM'])
  })
})

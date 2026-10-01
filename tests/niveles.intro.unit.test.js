import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

const { subIntroOf, subIntroKey } = await import('../src/core/cms/nivelesIntro.js')
const { DEFAULT_NIVELES } = await import('../src/core/cms/defaultNiveles.js')
const { ES } = await import('../src/shared/i18n/dict_es.js')
const { EN } = await import('../src/shared/i18n/dict_en.js')

const dictOf = (lang) => (lang === 'en' ? EN.niveles.subIntro : ES.niveles.subIntro)

describe('niveles intro - subIntroKey', () => {
  it('subs directos pasan igual', () => {
    assert.equal(subIntroKey('certificado', 'Todos'), 'certificado')
    assert.equal(subIntroKey('diplomado', 'Todos'), 'diplomado')
    assert.equal(subIntroKey('bachillerato', 'Todos'), 'bachillerato')
    assert.equal(subIntroKey('licenciatura', 'Todos'), 'licenciatura')
  })
  it('maestria Todos usa intro comparativa', () => {
    assert.equal(subIntroKey('maestria', 'Todos'), 'todos')
  })
  it('maestria con enfasis usa artes/divinidades', () => {
    assert.equal(subIntroKey('maestria', 'artes'), 'artes')
    assert.equal(subIntroKey('maestria', 'divinidades'), 'divinidades')
  })
})

describe('niveles intro - defaults traen los 8 intros ES/EN', () => {
  const ids = ['certificado', 'diplomado', 'bachillerato', 'licenciatura', 'maestria', 'artes', 'divinidades', 'todos']
  for (const lang of ['es', 'en']) {
    it(`diccionario ${lang} cubre todo`, () => {
      const d = dictOf(lang)
      for (const id of ids) {
        assert.ok(typeof d[id]?.t === 'string' && d[id].t.length > 5, `${lang}.${id}.t`)
        assert.ok(typeof d[id]?.d === 'string' && d[id].d.length > 10, `${lang}.${id}.d`)
      }
    })
  }
  it('DEFAULT_NIVELES trae intro_* en subs y maestrias', () => {
    for (const g of ['pre', 'post']) {
      for (const s of DEFAULT_NIVELES.subs[g]) {
        for (const k of ['intro_t_es', 'intro_t_en', 'intro_d_es', 'intro_d_en']) {
          assert.equal(typeof s[k], 'string', `subs.${g}.${s.id}.${k}`)
        }
      }
    }
    for (const m of DEFAULT_NIVELES.maestrias) {
      for (const k of ['intro_t_es', 'intro_t_en', 'intro_d_es', 'intro_d_en']) {
        assert.equal(typeof m[k], 'string', `maestrias.${m.id}.${k}`)
      }
    }
  })
})

describe('niveles intro - subIntroOf (CMS gana, vacio cae al diccionario)', () => {
  const subs = [{ id: 'certificado', intro_t_es: 'T CMS', intro_d_es: 'D CMS', intro_t_en: '', intro_d_en: '' }]
  it('usa CMS cuando hay texto', () => {
    assert.deepEqual(
      subIntroOf({ subs, maestrias: [], dict: dictOf('es'), lang: 'es' }, 'certificado'),
      { t: 'T CMS', d: 'D CMS' },
    )
  })
  it('vacio o blancos caen al diccionario del idioma', () => {
    const r = subIntroOf({ subs: [{ id: 'diplomado', intro_t_es: '  ', intro_d_es: '' }], maestrias: [], dict: dictOf('es'), lang: 'es' }, 'diplomado')
    assert.equal(r.t, ES.niveles.subIntro.diplomado.t)
    assert.equal(r.d, ES.niveles.subIntro.diplomado.d)
    const e = subIntroOf({ subs: [], maestrias: [], dict: dictOf('en'), lang: 'en' }, 'artes')
    assert.equal(e.t, EN.niveles.subIntro.artes.t)
  })
  it('maestria con enfasis lee de maestrias[]', () => {
    const r = subIntroOf({
      subs: [], maestrias: [{ id: 'artes', intro_t_es: 'Artes CMS', intro_d_es: 'D artes' }],
      dict: dictOf('es'), lang: 'es',
    }, 'artes')
    assert.deepEqual(r, { t: 'Artes CMS', d: 'D artes' })
  })
  it('id desconocido o datos rotos no revientan', () => {
    assert.deepEqual(subIntroOf({ subs: null, maestrias: null, dict: {}, lang: 'es' }, 'raro'), { t: '', d: '' })
    assert.deepEqual(subIntroOf({}, 'certificado'), { t: '', d: '' })
  })
})

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

const { safeHref, safeSrc, safeCssUrl } = await import('../src/core/cms/sanitize.js')

describe('sanitize - safeHref', () => {
  it('bloquea javascript:/vbscript:/data-html', () => {
    assert.equal(safeHref('javascript:alert(1)', '/'), '/')
    assert.equal(safeHref('JaVaScRiPt:alert(1)', '/'), '/')
    assert.equal(safeHref('vbscript:msgbox(1)', '/'), '/')
    assert.equal(safeHref('data:text/html;base64,xx', '/'), '/')
  })
  it('permite https, rutas internas, mailto y portal', () => {
    assert.equal(safeHref('https://semit.org/x'), 'https://semit.org/x')
    assert.equal(safeHref('/nosotros'), '/nosotros')
    assert.equal(safeHref('assets/logo.png'), 'assets/logo.png')
    assert.equal(safeHref('mailto:a@b.org'), 'mailto:a@b.org')
  })
})

describe('sanitize - safeSrc / safeCssUrl', () => {
  it('bloquea javascript: y data:text/html', () => {
    assert.equal(safeSrc('javascript:alert(1)', ''), '')
    assert.equal(safeSrc('data:text/html;base64,xx', ''), '')
    assert.equal(safeSrc('', ''), '')
  })
  it('permite https, api/, assets/, data:image y blob', () => {
    assert.equal(safeSrc('https://x.org/a.jpg'), 'https://x.org/a.jpg')
    assert.equal(safeSrc('api/v1/uploads/a.png'), 'api/v1/uploads/a.png')
    assert.equal(safeSrc('assets/logo.png'), 'assets/logo.png')
    assert.ok(safeSrc('data:image/png;base64,xx').startsWith('data:image/'))
    assert.ok(safeSrc('blob:abc').startsWith('blob:'))
  })
  it('safeCssUrl envuelve y neutraliza comillas', () => {
    assert.equal(safeCssUrl(''), '')
    assert.equal(safeCssUrl('javascript:alert(1)'), '')
    assert.ok(safeCssUrl('assets/a.jpg').startsWith('url('))
    assert.ok(!safeCssUrl("a'.jpg").includes("'"))
  })
})

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

const media = await import('../src/core/cms/media.js')
const { validateFile, kindOfExt, extOf, isVideoUrl, acceptFor, IMAGE_MAX_MB, VIDEO_MAX_MB } = media

describe('media - extensiones y kinds', () => {
  it('clasifica imagen y video', () => {
    assert.equal(kindOfExt('.jpg'), 'image')
    assert.equal(kindOfExt('.png'), 'image')
    assert.equal(kindOfExt('.webp'), 'image')
    assert.equal(kindOfExt('.gif'), 'image')
    assert.equal(kindOfExt('.avif'), 'image')
    assert.equal(kindOfExt('.mp4'), 'video')
    assert.equal(kindOfExt('.webm'), 'video')
    assert.equal(kindOfExt('.exe'), null)
    assert.equal(extOf('Foto.JPG'), '.jpg')
    assert.equal(extOf('sin-ext'), '')
  })
  it('detecta urls de video', () => {
    assert.equal(isVideoUrl('/api/v1/videos/a.mp4'), true)
    assert.equal(isVideoUrl('data:video/mp4;base64,xx'), true)
    assert.equal(isVideoUrl('assets/x.jpg'), false)
    assert.equal(isVideoUrl(''), false)
  })
  it('accept por casilla', () => {
    assert.ok(acceptFor('image').includes('image/png'))
    assert.ok(!acceptFor('image').includes('video'))
    assert.ok(acceptFor('video').includes('video/mp4'))
    assert.ok(acceptFor('both').includes('image') && acceptFor('both').includes('video'))
  })
})

describe('media - validateFile', () => {
  it('acepta imagen png dentro del limite', () => {
    assert.deepEqual(validateFile({ name: 'a.png', size: 1000 }, 'image').ok, true)
  })
  it('rechaza extension mala con mensaje util', () => {
    const r = validateFile({ name: 'a.exe', size: 10 })
    assert.equal(r.ok, false)
    assert.match(r.error, /Formato no permitido/)
  })
  it('casilla image rechaza video y viceversa', () => {
    assert.equal(validateFile({ name: 'a.mp4', size: 10 }, 'image').ok, false)
    assert.equal(validateFile({ name: 'a.jpg', size: 10 }, 'video').ok, false)
  })
  it('imagen sin limite / video max 500MB', () => {
    assert.equal(IMAGE_MAX_MB, Infinity)
    assert.equal(VIDEO_MAX_MB, 500)
    assert.equal(validateFile({ name: 'a.jpg', size: 200 * 1024 * 1024 }).ok, true)
    assert.equal(validateFile({ name: 'a.mp4', size: 501 * 1024 * 1024 }).ok, false)
    assert.equal(validateFile({ name: 'a.mp4', size: 100 * 1024 * 1024 }).ok, true)
  })
})

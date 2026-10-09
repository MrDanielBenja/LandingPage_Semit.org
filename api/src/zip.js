const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

export function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function dosNow() {
  const d = new Date()
  const time = ((d.getHours() & 31) << 11) | ((d.getMinutes() & 63) << 5) | ((Math.floor(d.getSeconds() / 2)) & 31)
  const date = (((d.getFullYear() - 1980) & 127) << 9) | (((d.getMonth() + 1) & 15) << 5) | (d.getDate() & 31)
  return { time, date }
}

export const ZIP_LIMITS = { filesMax: 5000, entryMax: 600 * 1024 * 1024 }

export function zipBuild(entries) {
  const enc = new TextEncoder()
  const chunks = []
  const central = []
  let offset = 0
  for (const { name, data } of entries) {
    const nb = Buffer.from(enc.encode(String(name || '')))
    const db = Buffer.isBuffer(data) ? data : Buffer.from(data || [])
    if (nb.length > 512) throw Object.assign(new Error('name_too_long'), { code: 'name' })
    const crc = crc32(db)
    const { time, date } = dosNow()
    const lh = Buffer.alloc(30)
    lh.writeUInt32LE(0x04034b50, 0)
    lh.writeUInt16LE(20, 4)
    lh.writeUInt16LE(0x0800, 6)
    lh.writeUInt16LE(0, 8)
    lh.writeUInt16LE(time, 10)
    lh.writeUInt16LE(date, 12)
    lh.writeUInt32LE(crc, 14)
    lh.writeUInt32LE(db.length, 18)
    lh.writeUInt32LE(db.length, 22)
    lh.writeUInt16LE(nb.length, 26)
    lh.writeUInt16LE(0, 28)
    chunks.push(lh, nb, db)
    const ch = Buffer.alloc(46)
    ch.writeUInt32LE(0x02014b50, 0)
    ch.writeUInt16LE(20, 4)
    ch.writeUInt16LE(20, 6)
    ch.writeUInt16LE(0x0800, 8)
    ch.writeUInt16LE(0, 10)
    ch.writeUInt16LE(time, 12)
    ch.writeUInt16LE(date, 14)
    ch.writeUInt32LE(crc, 16)
    ch.writeUInt32LE(db.length, 20)
    ch.writeUInt32LE(db.length, 24)
    ch.writeUInt16LE(nb.length, 28)
    ch.writeUInt16LE(0, 30)
    ch.writeUInt16LE(0, 32)
    ch.writeUInt16LE(0, 34)
    ch.writeUInt16LE(0, 36)
    ch.writeUInt32LE(0, 38)
    ch.writeUInt32LE(offset, 42)
    central.push(ch, nb)
    offset += lh.length + nb.length + db.length
  }
  const cdStart = offset
  const cdSize = central.reduce((n, b) => n + b.length, 0)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(0, 4)
  end.writeUInt16LE(0, 6)
  end.writeUInt16LE(entries.length, 8)
  end.writeUInt16LE(entries.length, 10)
  end.writeUInt32LE(cdSize, 12)
  end.writeUInt32LE(cdStart, 16)
  end.writeUInt16LE(0, 20)
  return Buffer.concat([...chunks, ...central, end])
}

export function zipParse(buf) {
  const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf || [])
  if (b.length < 4 || b.readUInt32LE(0) !== 0x04034b50) {
    throw Object.assign(new Error('not_a_zip'), { code: 'magic' })
  }
  const out = []
  let p = 0
  while (p + 30 <= b.length) {
    const sig = b.readUInt32LE(p)
    if (sig !== 0x04034b50) break
    const method = b.readUInt16LE(p + 8)
    const compSize = b.readUInt32LE(p + 18)
    const nameLen = b.readUInt16LE(p + 26)
    const extraLen = b.readUInt16LE(p + 28)
    if (method !== 0) throw Object.assign(new Error('only_stored_supported'), { code: 'compressed' })
    if (nameLen > 1024 || compSize > ZIP_LIMITS.entryMax) {
      throw Object.assign(new Error('entry_too_big'), { code: 'size' })
    }
    const nameStart = p + 30
    const dataStart = nameStart + nameLen + extraLen
    if (dataStart + compSize > b.length) throw Object.assign(new Error('truncated'), { code: 'truncated' })
    const name = b.slice(nameStart, nameStart + nameLen).toString('utf8')
    out.push({ name, data: b.slice(dataStart, dataStart + compSize) })
    if (out.length > ZIP_LIMITS.filesMax) throw Object.assign(new Error('too_many_files'), { code: 'count' })
    p = dataStart + compSize
  }
  if (!out.length) throw Object.assign(new Error('empty_zip'), { code: 'empty' })
  return out
}

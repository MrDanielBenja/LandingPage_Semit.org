import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { isMysql, pool } from './db.js'

const here = dirname(fileURLToPath(import.meta.url))
const MEM_FILE = join(here, '..', 'data', '.sessions.json')

const MEM = new Map()
const MEM_USERS = new Map()

function persistMem() {
  try {
    mkdirSync(dirname(MEM_FILE), { recursive: true })
    const tokens = [...MEM.entries()].map(([token, v]) => ({ token, username: v?.username, at: v?.at }))
    const users = [...MEM_USERS.entries()].map(([u, p]) => ({ u, p }))
    writeFileSync(MEM_FILE, JSON.stringify({ tokens, users }))
  } catch {}
}

try {
  const raw = JSON.parse(readFileSync(MEM_FILE, 'utf-8'))
  const week = 7 * 24 * 3600 * 1000
  for (const { token, username, at } of raw.tokens || []) {
    if (token && username && Date.now() - (at || 0) < week) MEM.set(token, { username, at })
  }
  for (const { u, p } of raw.users || []) {
    if (u && p) MEM_USERS.set(u, p)
  }
} catch {}

function memExpected(u) {
  if (MEM_USERS.has(u)) return MEM_USERS.get(u)
  const keyU = normUser(process.env.ADMIN_USER || 'admin')
  if (u !== keyU) return null
  const keyP = (process.env.ADMIN_PIN || process.env.ADMIN_PASS || '').trim()
  return keyP || null
}

function withTimeout(p, ms = 6000) {
  return Promise.race([
    p,
    new Promise((_, rej) => setTimeout(() => rej(new Error('db_timeout')), ms)),
  ])
}

async function tryTable() {
  try {
    return await withTimeout(table(), 6000)
  } catch {
    return false
  }
}

async function q(sql, vals) {
  return withTimeout(pool.query(sql, vals), 7000)
}

async function table() {
  if (!pool) return false
  if (isMysql()) {
    await pool.query(`CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(60) UNIQUE NOT NULL,
      pass_hash TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`)
    await pool.query(`CREATE TABLE IF NOT EXISTS admin_sessions (
      token VARCHAR(128) PRIMARY KEY,
      username VARCHAR(60) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`)
    return true
  }
  await pool.query(`CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    pass_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`)
  await pool.query(`CREATE TABLE IF NOT EXISTS admin_sessions (
    token TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`)
  return true
}

function hashPass(pass, salt) {
  return scryptSync(String(pass), salt, 32).toString('hex')
}

function newHash(pass) {
  const salt = randomBytes(16).toString('hex')
  return `s1$${salt}$${hashPass(pass, salt)}`
}

function verify(stored, pass) {
  try {
    if (stored.startsWith('s1$')) {
      const [, salt, h] = stored.split('$')
      const a = Buffer.from(h, 'hex')
      const b = Buffer.from(hashPass(pass, salt), 'hex')
      return a.length === b.length && timingSafeEqual(a, b)
    }
    const a = createHash('sha256').update('semit::' + pass).digest('hex')
    return a === stored
  } catch { return false }
}

const normUser = (u) => String(u || '').trim().toLowerCase().slice(0, 60)

export async function ensureAdminSeed() {
  try {
    if (!(await tryTable())) return
    const su = normUser(process.env.ADMIN_USER || 'admin')
    const sp = process.env.ADMIN_PIN || process.env.ADMIN_PASS || ''
    const { rows } = await q('SELECT id FROM admin_users WHERE username = $1', [su])
    if (!rows.length && sp) {
      await q('INSERT INTO admin_users (username, pass_hash) VALUES ($1, $2)', [su, newHash(sp)])
      console.log(`admin seed creado (user ${su})`)
    }
  } catch (e) {
    console.log('admin seed omitido:', e.message)
  }
}

export async function loginAdmin(user, pass) {
  const u = normUser(user)
  if (!u || !pass) return null
  try {
    if (await tryTable()) {
      const { rows } = await q('SELECT username, pass_hash FROM admin_users WHERE username = $1', [u])
      const row = rows[0]
      if (row && verify(row.pass_hash, pass)) {
        const token = randomBytes(32).toString('hex')
        await q('DELETE FROM admin_sessions WHERE username = $1', [u])
        await q('INSERT INTO admin_sessions (token, username) VALUES ($1, $2)', [token, u])
        return { token, username: u }
      }
      if (row) return null
    }
  } catch { /* cae a memoria */ }
  const keyU = normUser(process.env.ADMIN_USER || 'admin')
  const keyP = memExpected(u)
  if (keyP && u === keyU && String(pass) === keyP) {
    const token = randomBytes(32).toString('hex')
    MEM.set(token, { username: u, at: Date.now() })
    persistMem()
    return { token, username: u }
  }
  return null
}

export async function loginAdminLegacy(pin) {
  return loginAdmin(process.env.ADMIN_USER || 'admin', pin)
}

export async function checkToken(token) {
  if (!token) return false
  try {
    if (await tryTable()) {
      const { rows } = await q('SELECT token FROM admin_sessions WHERE token = $1', [token])
      if (rows.length) return true
    }
  } catch {}
  return MEM.has(token)
}

export async function tokenUser(token) {
  if (!token) return null
  try {
    if (await tryTable()) {
      const { rows } = await q('SELECT username FROM admin_sessions WHERE token = $1', [token])
      if (rows[0]?.username) return rows[0].username
    }
  } catch {}
  return MEM.get(token)?.username || null
}

export async function logoutToken(token) {
  try {
    if (await tryTable()) await q('DELETE FROM admin_sessions WHERE token = $1', [token])
    else MEM.delete(token)
  } catch {}
  if (MEM.delete(token)) persistMem()
}

export async function changePass(username, oldPass, newPass) {
  const u = normUser(username)
  if (!u || !oldPass || !newPass || String(newPass).length < 6) return false
  try {
    if (await tryTable()) {
      const { rows } = await q('SELECT pass_hash FROM admin_users WHERE username = $1', [u])
      if (!rows.length || !verify(rows[0].pass_hash, oldPass)) return false
      if (isMysql()) await q('UPDATE admin_users SET pass_hash = $1 WHERE username = $2', [newHash(newPass), u])
      else await q('UPDATE admin_users SET pass_hash = $1, updated_at = NOW() WHERE username = $2', [newHash(newPass), u])
      await q('DELETE FROM admin_sessions WHERE username = $1', [u])
      return true
    }
  } catch { /* cae a memoria */ }
  const keyU = normUser(process.env.ADMIN_USER || 'admin')
  const expected = memExpected(u)
  if (u !== keyU || !expected) return false
  if (String(oldPass) !== expected) return false
  MEM_USERS.set(u, String(newPass))
  for (const [tk, v] of MEM) if (v?.username === u) MEM.delete(tk)
  persistMem()
  return true
}

import { checkToken } from './auth.js'

export function isDevEnv() {
  const n = String(process.env.NODE_ENV || '').toLowerCase()
  return n === 'development' || n === 'test'
}

export function hasCredentials() {
  return Boolean(
    process.env.DATABASE_URL ||
    process.env.MYSQL_URL ||
    process.env.MYSQL_PUBLIC_URL ||
    process.env.ADMIN_PIN ||
    process.env.ADMIN_PASS ||
    process.env.SYNC_TOKEN
  )
}

export function allowOpenDev() {
  return process.env.ALLOW_OPEN_DEV === '1' && isDevEnv() && !hasCredentials()
}

export async function requireAdmin(req, res) {
  const syncT = process.env.SYNC_TOKEN
  if (syncT && req.headers['x-sync-token'] === syncT) return true
  const adminT = req.headers['x-admin-token']
  if (adminT && (await checkToken(adminT))) return true
  if (allowOpenDev()) return true
  res.status(401).json({ ok: false, error: 'unauthorized' })
  return false
}

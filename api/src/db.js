import pg from 'pg'
import mysql from 'mysql2/promise'

const MYSQL_URL = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL || ''
const PG_URL = process.env.DATABASE_URL || ''

let mysqlPool = null
let pgPool = null

if (MYSQL_URL) {
  try {
    const u = new URL(MYSQL_URL)
    mysqlPool = mysql.createPool({
      host: u.hostname || 'localhost',
      port: Number(u.port) || 3306,
      user: decodeURIComponent(u.username || ''),
      password: decodeURIComponent(u.password || ''),
      database: decodeURIComponent((u.pathname || '/').replace(/^\//, '')),
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 20,
      connectTimeout: 7000,
    })
  } catch {
    mysqlPool = mysql.createPool(MYSQL_URL)
  }
}

if (PG_URL && !MYSQL_URL) {
  pgPool = new pg.Pool({ connectionString: PG_URL })
}

export const dbKind = mysqlPool ? 'mysql' : pgPool ? 'pg' : null

function toMysqlParams(sql, vals) {
  const out = sql.replace(/\$\d+/g, () => '?')
  return { sql: out, vals: vals || [] }
}

export const pool = mysqlPool || pgPool
  ? {
    kind: mysqlPool ? 'mysql' : 'pg',
    async query(sql, vals = []) {
      if (mysqlPool) {
        const { sql: s, vals: v } = toMysqlParams(sql, vals)
        const [rows] = await mysqlPool.query(s, v)
        return { rows: Array.isArray(rows) ? rows : [] }
      }
      return pgPool.query(sql, vals)
    },
  }
  : null

export function isMysql() {
  return !!mysqlPool
}

export function boolTrue() {
  return mysqlPool ? 'activo = 1' : 'activo = TRUE'
}

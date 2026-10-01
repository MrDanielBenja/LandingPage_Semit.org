import { cpSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const from = join(root, 'dist')
const to = join(root, 'api', 'public')
if (!existsSync(from)) {
  console.error('dist/ no existe — corre vite build primero')
  process.exit(1)
}
cpSync(from, to, { recursive: true })
console.log('dist/ -> api/public/ ok')

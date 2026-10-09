import { existsSync, statSync, readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const zipName = 'semit-cpanel-node.zip'
const stage = join(root, '.cpanel-stage')
rmSync(stage, { recursive: true, force: true })
mkdirSync(stage, { recursive: true })

const copy = (from, to) => {
  const dest = join(stage, to)
  mkdirSync(dirname(dest), { recursive: true })
  if (statSync(from).isDirectory()) {
    mkdirSync(dest, { recursive: true })
    for (const e of readdirSync(from, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name === '.git') continue
      if (e.name.endsWith('.zip') || e.name.endsWith('.map')) continue
      if (e.name === '.htaccess') continue
      copy(join(from, e.name), join(to, e.name))
    }
  } else {
    writeFileSync(dest, readFileSync(from))
  }
}

const api = (...p) => join(root, 'api', ...p)
copy(api('app.js'), 'app.js')
copy(api('package.json'), 'package.json')
copy(api('package-lock.json'), 'package-lock.json')
copy(api('.env.example'), '.env.example')
copy(join(root, 'LEEME-CPANEL.txt'), 'LEEME-CPANEL.txt')
if (existsSync(join(root, 'semit-db.sql'))) copy(join(root, 'semit-db.sql'), 'semit-db.sql')
copy(api('src'), 'src')
copy(api('data'), 'data')
for (const f of readdirSync(api('data'))) {
  if (/sessions|\.log$/i.test(f)) rmSync(join(stage, 'data', f), { force: true })
}
copy(api('public'), 'public')
for (const f of readdirSync(join(stage, 'public'))) {
  if (f.endsWith('.map')) rmSync(join(stage, 'public', f), { force: true })
}
if (existsSync(api('sql'))) copy(api('sql'), 'sql')
copy(api('uploads', 'covers'), 'uploads/covers')
mkdirSync(join(stage, 'uploads', 'cms'), { recursive: true })
mkdirSync(join(stage, 'uploads', 'videos'), { recursive: true })
for (const k of ['.gitkeep', '.gitignore']) {
  for (const d of ['cms', 'videos']) {
    const src = api('uploads', d, k)
    if (existsSync(src)) copy(src, join('uploads', d, k))
  }
}
if (!existsSync(join(stage, 'uploads', 'cms', '.gitkeep'))) {
  writeFileSync(join(stage, 'uploads', 'cms', '.gitkeep'), '')
}
if (!existsSync(join(stage, 'uploads', 'videos', '.gitkeep'))) {
  writeFileSync(join(stage, 'uploads', 'videos', '.gitkeep'), '')
}

try {
  execFileSync('powershell', ['-NoProfile', '-Command',
    `Compress-Archive -Path '${join(stage, '*')}' -DestinationPath '${join(root, zipName)}' -Force; ` +
    `Write-Output "zip ok: $((Get-Item '${zipName}').Length) bytes"`], { cwd: root, stdio: 'inherit' })
} catch (e) {
  console.error('No se pudo crear el zip:', e.message)
  process.exit(1)
}
rmSync(stage, { recursive: true, force: true })

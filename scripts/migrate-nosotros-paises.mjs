import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const f = join(root, 'api', 'data', 'nosotros.json')
const d = JSON.parse(readFileSync(f, 'utf-8'))
const eq = d.equipo || (d.equipo = {})

const ALIAS = { 'REP DOM': 'DOM', 'R DOM': 'DOM', RD: 'DOM', EEUU: 'USA', EUA: 'USA', US: 'USA', PE: 'PER', AR: 'ARG' }
const norm = (id) => ALIAS[String(id || '').trim().toUpperCase()] || String(id || '').trim().toUpperCase()

if (!Array.isArray(eq.paises) || !eq.paises.length) {
  const seen = []
  for (const m of eq.members || []) {
    const id = norm(m.p)
    if (id && !seen.includes(id)) seen.push(id)
  }
  const FALLBACK = ['PER', 'USA', 'ARG', 'DOM']
  for (const id of FALLBACK) if (!seen.includes(id)) seen.push(id)
  eq.paises = seen.map((id) => ({ id }))
  console.log('paises creados desde members:', seen.join(','))
} else {
  console.log('paises ya existen:', eq.paises.length)
}

let fixed = 0
for (const m of eq.members || []) {
  const id = norm(m.p)
  if (m.p !== id) {
    m.p = id
    fixed++
  }
}
console.log('members normalizados:', fixed)
writeFileSync(f, JSON.stringify(d, null, 1))

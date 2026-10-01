import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const f = join(root, 'api', 'data', 'niveles.json')
const d = JSON.parse(readFileSync(f, 'utf-8'))
let n = 0
for (const g of ['pre', 'post']) {
  for (const s of d.subs?.[g] || []) {
    if (s.intro_t_es === undefined) {
      s.intro_t_es = ''
      s.intro_t_en = ''
      s.intro_d_es = ''
      s.intro_d_en = ''
      n++
    }
  }
}
for (const m of d.maestrias || []) {
  if (m.intro_t_es === undefined) {
    m.intro_t_es = ''
    m.intro_t_en = ''
    m.intro_d_es = ''
    m.intro_d_en = ''
    n++
  }
}
writeFileSync(f, JSON.stringify(d, null, 1))
console.log('migrados:', n)

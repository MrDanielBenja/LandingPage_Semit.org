import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const DATA = join(root, 'api', 'data')

const PATHS = {
  inicio: ['slides', 'testimonios', 'intro.imgs', 'mods.items'],
  nosotros: ['hero.stats', 'quienes.pilares', 'funcs.items', 'fe.items', 'equipo.members', 'equipo.paises'],
  niveles: ['ramas', 'subs.pre', 'subs.post', 'maestrias', 'ruta', 'programas'],
  cursosPage: ['tracks'],
  eventos: ['cats', 'eventos', 'bcb.areas', 'bcb.oficios', 'bcb.incluye', 'bcb.campos', 'bcb.costos', 'bcb.cubre_es', 'bcb.cubre_en'],
  contacto: ['canales', 'asuntos', 'faqs', 'horario', 'form.steps_es', 'form.steps_en'],
  site: ['nav'],
}

const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o)
let bad = 0
for (const [page, keys] of Object.entries(PATHS)) {
  let d
  try {
    d = JSON.parse(readFileSync(join(DATA, `${page}.json`), 'utf-8'))
  } catch {
    console.log(`${page}: SIN ARCHIVO`)
    continue
  }
  for (const k of keys) {
    const v = get(d, k)
    if (v === undefined) console.log(`-- ${page}.${k} = ausente`)
    else if (!Array.isArray(v)) {
      bad++
      console.log(`!! ${page}.${k} NO ES ARREGLO: ${typeof v} = ${JSON.stringify(v).slice(0, 160)}`)
    }
  }
  if (page === 'inicio') {
    for (const m of (d?.mods?.items || [])) {
      if (m && !Array.isArray(m.hijos)) { bad++; console.log(`!! inicio.mods.items[${m.id}].hijos NO ES ARREGLO: ${typeof m.hijos}`) }
    }
  }
  if (page === 'niveles') {
    for (const [i, p] of (d?.programas || []).entries()) {
      for (const k of ['incluye', 'incluye_es', 'incluye_en']) {
        if (p[k] !== undefined && !Array.isArray(p[k])) { bad++; console.log(`!! niveles.programas[${i}].${k} NO ES ARREGLO`) }
      }
    }
    for (const g of ['pre', 'post']) {
      for (const [i, s] of (d?.subs?.[g] || []).entries()) {
        for (const k of ['intro_t_es', 'intro_t_en', 'intro_d_es', 'intro_d_en']) {
          if (typeof s[k] !== 'string') { bad++; console.log(`!! niveles.subs.${g}[${i}].${k} NO ES STRING`) }
        }
      }
    }
    for (const [i, m] of (d?.maestrias || []).entries()) {
      for (const k of ['intro_t_es', 'intro_t_en', 'intro_d_es', 'intro_d_en']) {
        if (typeof m[k] !== 'string') { bad++; console.log(`!! niveles.maestrias[${i}].${k} NO ES STRING`) }
      }
    }
  }
  if (page === 'nosotros') {
    const paises = d?.equipo?.paises || []
    const ids = new Set(paises.map((p) => p.id))
    for (const [i, p] of paises.entries()) {
      if (!p.id || typeof p.id !== 'string') { bad++; console.log(`!! nosotros.equipo.paises[${i}].id inválido`) }
    }
    for (const [i, m] of (d?.equipo?.members || []).entries()) {
      if (!ids.has(m.p)) { bad++; console.log(`!! nosotros.equipo.members[${i}] país ${m.p} fuera del filtro`) }
    }
  }
  if (page === 'eventos') {
    for (const [i, e] of (d?.eventos || []).entries()) {
      for (const k of ['programa_es', 'programa_en']) {
        if (e[k] !== undefined && !Array.isArray(e[k])) { bad++; console.log(`!! eventos.eventos[${i}].${k} NO ES ARREGLO`) }
      }
    }
  }
}
console.log(bad ? `TOTAL: ${bad} campos corruptos` : 'OK: todos los campos son arreglos')

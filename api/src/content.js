import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const DIR = join(here, '..', 'data')

export const CONTENT_PAGES = ['inicio', 'nosotros', 'niveles', 'cursos', 'cursosPage', 'eventos', 'contacto', 'site']

export function contentFile(page) {
  return join(DIR, `${page}.json`)
}

export function readContent(page) {
  try {
    return JSON.parse(readFileSync(contentFile(page), 'utf-8'))
  } catch {
    return null
  }
}

export function writeContent(page, data) {
  mkdirSync(DIR, { recursive: true })
  writeFileSync(contentFile(page), JSON.stringify(data, null, 1))
  return data
}

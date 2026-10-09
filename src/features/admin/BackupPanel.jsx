import { useRef, useState } from 'react'
import { apiBase } from '../../core/cms/apiBase'
import { getAdminToken } from '../../core/cms/adminToken'
import { BACKUP_DEFAULTS, BACKUP_PAGES, collectBackup, diffDetailSinceLast, diffSummary, downloadBackup, listAutos, validateBackup } from '../../core/cms/backup'

const LS = 'semit-cms:'

function currentAll() {
  const o = {}
  for (const k of BACKUP_PAGES) {
    try {
      const raw = localStorage.getItem(LS + k)
      o[k] = raw ? JSON.parse(raw) : BACKUP_DEFAULTS[k]
    } catch { o[k] = BACKUP_DEFAULTS[k] }
  }
  return o
}

async function applyAll(pages) {
  const BASE = apiBase()
  const t = getAdminToken()
  const failed = []
  for (const [k, v] of Object.entries(pages)) {
    try { localStorage.setItem(LS + k, JSON.stringify(v)) } catch {}
    if (BASE != null) {
      try {
        const r = await fetch(`${BASE}/api/v1/content/${k}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(t ? { 'x-admin-token': t } : {}) },
          body: JSON.stringify({ data: v }),
        })
        if (!r.ok) failed.push(k)
      } catch { failed.push(k) }
    }
  }
  return failed
}

export function BackupPanel({ onDone }) {
  const [prev, setPrev] = useState(null)
  const [msg, setMsg] = useState('')
  const [since, setSince] = useState(() => diffDetailSinceLast(currentAll()))
  const [mediaInfo, setMediaInfo] = useState(null)
  const [zipFile, setZipFile] = useState(null)
  const fileRef = useRef(null)
  const zipRef = useRef(null)

  const refreshSince = () => setSince(diffDetailSinceLast(currentAll()))

  const stamp = () => {
    const d = new Date()
    const p = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
  }

  const doExport = () => {
    const b = collectBackup()
    const name = downloadBackup(b)
    setMsg(`Exportado ${name} ✓ — ahora exporta el ZIP de medios`)
    refreshSince()
    onDone?.(`Respaldo exportado ${name}`)
  }

  const doExportMedia = async () => {
    setMsg('')
    const BASE = apiBase()
    const t = getAdminToken()
    try {
      const r = await fetch(`${BASE}/api/v1/backup/media.zip`, {
        headers: { ...(t ? { 'x-admin-token': t } : {}) },
      })
      if (!r.ok) { setMsg(`No se pudo exportar medios (api ${r.status}) — ¿sesión vencida?`); return }
      const blob = await r.blob()
      const n = r.headers.get('X-Media-Count') || '?'
      const name = `semit-medios-${stamp()}.zip`
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = name
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 5000)
      setMsg(`Medios exportados ${name} ✓ (${n} archivos)`)
      onDone?.(`Medios exportados ${name}`)
    } catch {
      setMsg('Sin conexión a la API — no se exportaron los medios')
    }
  }

  const doImportFile = async (f) => {
    setMsg('')
    setPrev(null)
    if (!f) return
    try {
      const b = JSON.parse(await f.text())
      const err = validateBackup(b)
      if (err) { setMsg(err); return }
      const cur = currentAll()
      const changed = diffSummary(cur, b.pages)
      setPrev({ bundle: b, changed, cur })
    } catch { setMsg('Archivo inválido') }
  }

  const doImportZip = async (f) => {
    setMsg('')
    if (!f) return
    if (!/\.zip$/i.test(f.name)) { setMsg('El ZIP debe terminar en .zip'); return }
    setZipFile(f)
    try {
      const buf = new Uint8Array(await f.arrayBuffer())
      let count = 0
      const dec = new TextDecoder()
      const CAP = Math.min(buf.length, 1024 * 1024)
      for (let i = 0; i + 30 < CAP && count < 200; i++) {
        if (buf[i] === 0x50 && buf[i + 1] === 0x4b && buf[i + 2] === 0x03 && buf[i + 3] === 0x04) {
          const nameLen = buf[i + 26] | (buf[i + 27] << 8)
          const extraLen = buf[i + 28] | (buf[i + 29] << 8)
          const compSize = buf[i + 18] | (buf[i + 19] << 8) | (buf[i + 20] << 16) | (buf[i + 21] << 24)
          const nameBytes = buf.slice(i + 30, i + 30 + Math.min(nameLen, 512))
          let nm = ''
          try { nm = dec.decode(nameBytes) } catch {}
          if (nm) count++
          i = i + 30 + nameLen + extraLen + (compSize >>> 0) - 1
          if (i < 0) break
        }
      }
      setMediaInfo({ name: f.name, bytes: f.size, entries: count })
    } catch {
      setMediaInfo({ name: f.name, bytes: f.size, entries: 0 })
    }
  }

  const doApplyMedia = async () => {
    if (!zipFile) return
    const BASE = apiBase()
    const t = getAdminToken()
    setMsg('Subiendo medios…')
    try {
      const r = await fetch(`${BASE}/api/v1/backup/restore-media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream', ...(t ? { 'x-admin-token': t } : {}) },
        body: zipFile,
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok || !j.ok) { setMsg(`No se restauraron medios: ${j.error || `api ${r.status}`}`); return }
      setMsg(`Medios restaurados ✓ ${j.saved} guardados${j.skipped ? ` · ${j.skipped} omitidos` : ''}`)
      setZipFile(null)
      setMediaInfo(null)
      onDone?.('Medios restaurados — revisa las galerías con ↻ Actualizar')
    } catch {
      setMsg('Sin conexión a la API — no se restauraron los medios')
    }
  }

  const doApply = async () => {
    if (!prev) return
    const failed = await applyAll(prev.bundle.pages)
    setMsg(failed.length ? `Importado con API fallida en: ${failed.join(', ')} (local ok)` : `Importado ✓ ${prev.changed.length ? prev.changed.join(', ') : 'sin cambios'}`)
    setPrev(null)
    onDone?.('Respaldo importado — recarga para ver todo')
    setTimeout(() => location.reload(), 1200)
  }

  const autos = listAutos()
  const changedKeys = since?.changes ? Object.keys(since.changes) : []
  const totalRows = changedKeys.reduce((n, k) => n + since.changes[k].length, 0)
  return (
    <div className="adm-form">
      <div className="adm-note">⬇ Exporta TODO el CMS en <b>2 archivos</b>: el <b>.json</b> (textos y rutas) + el <b>.zip</b> (fotos y videos de uploads/).<br />⬆ Para restaurar sube <b>ambos</b>: primero el .json (datos), luego el .zip (medios).</div>
      <div className="adm-listops">
        <button className="btn btn-blue" onClick={doExport}>⬇ 1 · Exportar datos (.json)</button>
        <button className="btn btn-blue" onClick={doExportMedia}>⬇ 2 · Exportar medios (.zip)</button>
      </div>
      <div className="adm-listops">
        <button className="btn btn-line" onClick={() => fileRef.current?.click()}>⬆ 1 · Importar datos (.json)</button>
        <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={e => doImportFile(e.target.files[0])} />
        <button className="btn btn-line" onClick={() => zipRef.current?.click()}>⬆ 2 · Importar medios (.zip)</button>
        <input ref={zipRef} type="file" accept=".zip,application/zip" hidden onChange={e => doImportZip(e.target.files[0])} />
      </div>
      {mediaInfo && (
        <div className="adm-detail">
          <b>Medios listos</b>
          <div className="adm-note">{mediaInfo.name} · {(mediaInfo.bytes / 1024 / 1024).toFixed(1)} MB · ~{mediaInfo.entries} archivos (cms/ + videos/)</div>
          <div className="adm-listops">
            <button className="btn btn-blue" onClick={doApplyMedia}>Aplicar medios ✓</button>
            <button className="btn btn-line" onClick={() => { setZipFile(null); setMediaInfo(null) }}>Cancelar</button>
          </div>
          <div className="adm-note">Se validan extensión + contenido real + tamaño antes de guardar. Lo que no pase se omite.</div>
        </div>
      )}
      <div className="adm-detail">
        <b>Cambios desde la última exportación {since?.last ? `(${new Date(since.last.fecha).toLocaleString()})` : '(sin exportación previa)'}</b>
        {!since?.last && <div className="adm-note">Aún no exportas en este navegador: todo cuenta como pendiente.</div>}
        {since?.last && !changedKeys.length && <div className="adm-note">Sin cambios ✓ — todo igual a la última exportación.</div>}
        {changedKeys.map(k => (
          <div key={k}>
            <div className="adm-note"><b>{k}</b> · {since.changes[k].length} cambios</div>
            <div className="adm-difflist">
              {since.changes[k].slice(0, 30).map((d, j) => (
                <div key={j} className="adm-diffrow">
                  <span className="adm-diffpath">{d.path}</span>
                  <span className="adm-diffchg">{d.kind === 'add' ? '+' : d.kind === 'del' ? '−' : '~'}</span>
                  <span className="adm-diffval">{d.from}</span>
                  <span className="adm-diffarrow">→</span>
                  <span className="adm-diffval">{d.to}</span>
                </div>
              ))}
              {since.changes[k].length > 30 && <div className="adm-note">…y {since.changes[k].length - 30} más</div>}
            </div>
          </div>
        ))}
        {!!changedKeys.length && <div className="adm-note">Total: {totalRows} cambios en {changedKeys.join(', ')}</div>}
        <div className="adm-listops">
          <button className="btn btn-line" onClick={refreshSince}>↻ Actualizar lista</button>
        </div>
      </div>
      {prev && (
        <div className="adm-detail">
          <b>Vista previa</b>
          <div className="adm-note">Archivo del {new Date(prev.bundle.fecha).toLocaleString()} · {prev.changed.length ? `cambia: ${prev.changed.join(', ')}` : 'sin diferencias'}</div>
          <div className="adm-listops">
            <button className="btn btn-blue" onClick={doApply}>Aplicar respaldo ✓</button>
            <button className="btn btn-line" onClick={() => setPrev(null)}>Cancelar</button>
          </div>
        </div>
      )}
      {autos.length > 0 && <div className="adm-note">Auto-respaldos antes de publicar: {autos.length} (último {new Date(autos[0].fecha).toLocaleString()})</div>}
      {msg && <p className="adm-note">{msg}</p>}
    </div>
  )
}

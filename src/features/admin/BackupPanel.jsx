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
  const fileRef = useRef(null)

  const refreshSince = () => setSince(diffDetailSinceLast(currentAll()))

  const doExport = () => {
    const b = collectBackup()
    const name = downloadBackup(b)
    setMsg(`Exportado ${name} ✓`)
    refreshSince()
    onDone?.(`Respaldo exportado ${name}`)
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
      <div className="adm-note">⬇ Exporta TODO el CMS en un archivo. Después de un cambio mayúsculo de código, ⬆ impórtalo y se restaura.</div>
      <div className="adm-listops">
        <button className="btn btn-blue" onClick={doExport}>⬇ Exportar todo</button>
        <button className="btn btn-line" onClick={() => fileRef.current?.click()}>⬆ Importar respaldo</button>
        <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={e => doImportFile(e.target.files[0])} />
      </div>
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

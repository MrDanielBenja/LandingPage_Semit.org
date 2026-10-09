import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, isAuthed } from './adminAuth'
import { syncServerLimits } from '../../core/cms/media'

export function AdminGate({ children }) {
  const [user, setUser] = useState('admin')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [ok, setOk] = useState(() => isAuthed())
  useEffect(() => { syncServerLimits() }, [])
  const nav = useNavigate()
  if (ok) return children
  const send = async (e) => {
    e?.preventDefault()
    setErr('')
    setBusy(true)
    const r = await login(user, pass)
    setBusy(false)
    if (r.ok) setOk(true)
    else setErr(r.error || (r.wait > 0 ? `Bloqueado ${r.wait}s` : 'Usuario o contraseña incorrectos'))
  }
  return (
    <div className="adm-gate">
      <form className="adm-pin" onSubmit={send}>
        <b>DirAdmin</b>
        <small>Acceso administrador</small>
        <input value={user} onChange={e => setUser(e.target.value)} placeholder="usuario" autoComplete="username" />
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="contraseña" autoComplete="current-password" autoFocus />
        {err && <span className="adm-err">{err}</span>}
        <button className="btn btn-blue" type="submit" disabled={busy}>{busy ? 'Verificando…' : 'Entrar →'}</button>
        <button className="link-btn" type="button" onClick={() => nav('/')}>← Volver al sitio</button>
      </form>
    </div>
  )
}

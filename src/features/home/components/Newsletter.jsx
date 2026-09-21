import { useState } from 'react'

export function Newsletter() {
  const [mail, setMail] = useState('')
  const [ok, setOk] = useState(false)
  return (
    <div className="container home-sec rv">
      <div className="news-card">
        <h3>📩 Suscríbete y recibe promociones</h3>
        <p>Cursos nuevos, publicaciones, libros populares y mucho más.</p>
        {!ok ? (
          <form className="news-form" onSubmit={e => { e.preventDefault(); if (mail.includes('@')) setOk(true) }}>
            <input type="email" required value={mail} onChange={e => setMail(e.target.value)} placeholder="Tu correo" />
            <button className="btn btn-blue" type="submit">Suscribirme</button>
          </form>
        ) : (
          <div className="note" style={{ textAlign: 'center' }}>✓ ¡Listo! Revisa <b>{mail}</b>, te llegarán las promos.</div>
        )}
      </div>
    </div>
  )
}

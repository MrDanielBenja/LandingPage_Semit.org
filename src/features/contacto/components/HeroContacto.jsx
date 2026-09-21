import { SITE } from '../../../shared/config/site'
import { IMGS } from '../../../shared/lib/images'
import { waLink } from '../../../core/services/whatsapp'

export function HeroContacto({ onCanal }) {
  const goLayout = () => document.querySelector('.c-layout')?.scrollIntoView({ behavior: 'smooth' })
  return (
    <div className="nos-hero rv">
      <img className="nos-hero-bg" src={IMGS.manos} alt="Comunidad SEMIT" loading="lazy" />
      <div className="nos-hero-veil" />
      <div className="container nos-hero-in">
        <span className="pill pill-glass">💬 Respuesta en ~2h · Lun–Sáb</span>
        <h1>Hablemos de<br />tu llamado.</h1>
        <p>Escríbenos, llámanos o visítanos. Todo llega directo a nuestro WhatsApp.</p>
        <div className="nos-stats-float cols-3">
          <a className="stat4 stat-link" target="_blank" rel="noreferrer" href={waLink('Hola SEMIT, quiero información.')}><b>💚 {SITE.phone}</b><span>WhatsApp en línea →</span></a>
          <button className="stat4 stat-link" onClick={() => { onCanal('sede'); goLayout() }}><b>📍 Sede Cusco</b><span>Huayllapampa, San Jerónimo →</span></button>
          <button className="stat4 stat-link" onClick={() => { onCanal('form'); goLayout() }}><b>✉️ Escríbenos</b><span>{SITE.email} →</span></button>
        </div>
      </div>
    </div>
  )
}

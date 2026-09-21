import { useReveal } from '../../shared/hooks/useReveal'
import { IMGS } from '../../shared/lib/images'
import { Stat } from '../../shared/ui/Stat'
import { QuienesSomos } from './components/QuienesSomos'
import { Funciones } from './components/Funciones'
import { DeclaracionFe } from './components/DeclaracionFe'
import { Equipo } from './components/Equipo'

export function NosotrosPage() {
  useReveal('/nosotros')
  return (
    <div className="pg pg-nos">
      <div className="nos-hero rv">
        <img className="nos-hero-bg" src={IMGS.iglesia} alt="SEMIT Cusco" loading="lazy" />
        <div className="nos-hero-veil" />
        <div className="container nos-hero-in">
          <span className="pill pill-glass">📖 Nuestra historia · Desde Cusco</span>
          <h1>Te enseñamos<br />para que enseñes.</h1>
          <p>Es un hecho establecido desde hace mucho tiempo: formar, enviar y cuidar obreros que expanden el Evangelio.</p>
          <div className="nos-verse">“Lo que has oído... encarga a hombres fieles que sean idóneos para enseñar también a otros.” <b>— 2 Tim 2:2</b></div>
          <div className="nos-stats-float">
            <Stat card v={3587} label="Seguidores" />
            <Stat card v={475} label="Estudiantes" />
            <Stat card v={60} label="Docentes" />
            <Stat card v={275} label="Misioneros" />
          </div>
        </div>
      </div>
      <div className="container sec nos-body">
        <QuienesSomos />
        <Funciones />
        <DeclaracionFe />
        <Equipo />
      </div>
    </div>
  )
}

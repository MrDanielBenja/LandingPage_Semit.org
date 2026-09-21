import { useReveal } from '../../shared/hooks/useReveal'
import { Portada } from './components/Portada'
import { SeminarioIntro } from './components/SeminarioIntro'
import { Modalidades } from './components/Modalidades'
import { RutaNiveles } from './components/RutaNiveles'
import { CursosTop } from './components/CursosTop'
import { EventoTeaser } from './components/EventoTeaser'
import { Testimonios } from './components/Testimonios'
import { Newsletter } from './components/Newsletter'

export function HomePage() {
  useReveal('/')
  return (
    <div className="pg pg-inicio">
      <Portada />
      <div className="container hero" id="seminario"><SeminarioIntro /></div>
      <div className="container home-sec"><Modalidades /></div>
      <div className="container home-sec"><RutaNiveles /></div>
      <div className="container home-sec"><CursosTop /></div>
      <div className="container home-sec"><EventoTeaser /></div>
      <div className="container home-sec"><Testimonios /></div>
      <Newsletter />
      <div className="marquee"><div>TEOLOGÍA ✦ BIBLIA ✦ MISIONES ✦ BI-VOCACIONAL ✦ TEOLOGÍA ✦ BIBLIA ✦ MISIONES ✦ BI-VOCACIONAL ✦&nbsp;</div></div>
    </div>
  )
}

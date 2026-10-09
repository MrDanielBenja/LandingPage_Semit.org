import { useReveal } from '../../shared/hooks/useReveal'
import { useLang } from '../../app/providers/LangProvider'
import { useContent } from '../../core/cms/contentStore'
import { DEFAULT_INICIO } from '../../core/cms/defaultInicio'
import { fmtCssKey } from '../../core/cms/fmt'
import { Portada } from './components/Portada'
import { SeminarioIntro } from './components/SeminarioIntro'
import { Modalidades } from './components/Modalidades'
import { RutaNiveles } from './components/RutaNiveles'
import { CursosTop } from './components/CursosTop'
import { EventoTeaser } from './components/EventoTeaser'
import { Testimonios } from './components/Testimonios'
import { Newsletter } from './components/Newsletter'

export function HomePage({ preview, previewNiveles, previewEventos, marqueeOnly }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('inicio', DEFAULT_INICIO)
  const cms = preview || saved
  const mq = cms.marquee || DEFAULT_INICIO.marquee
  const M = (lang === 'en' ? mq.text_en : mq.text_es) || t('home.marquee')
  useReveal('/')
  if (marqueeOnly) return <div className="marquee" style={mq.bg ? { background: mq.bg } : undefined}><div style={{ ...(mq.color ? { color: mq.color } : null), ...fmtCssKey(cms, 'marquee.text') }}>{M}&nbsp;</div></div>
  return (
    <div className="pg pg-inicio">
      <Portada preview={preview} />
      <div className="container hero" id="seminario"><SeminarioIntro preview={preview} /></div>
      <div className="container home-sec"><Modalidades preview={preview} /></div>
      <div className="container home-sec"><RutaNiveles preview={preview} previewNiveles={previewNiveles} /></div>
      <div className="container home-sec"><CursosTop preview={preview} /></div>
      <div className="container home-sec"><EventoTeaser preview={preview} previewEventos={previewEventos} /></div>
      <div className="container home-sec"><Testimonios preview={preview} /></div>
      <Newsletter preview={preview} />
      <div className="marquee" style={mq.bg ? { background: mq.bg } : undefined}><div style={{ ...(mq.color ? { color: mq.color } : null), ...fmtCssKey(cms, 'marquee.text') }}>{M}&nbsp;</div></div>
    </div>
  )
}

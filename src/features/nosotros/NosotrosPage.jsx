import { useReveal } from '../../shared/hooks/useReveal'
import { asArr } from '../../core/cms/safe'
import { Stat } from '../../shared/ui/Stat'
import { useLang } from '../../app/providers/LangProvider'
import { useContent } from '../../core/cms/contentStore'
import { resolveAsset } from '../../core/cms/assets'
import { fmtCssKey } from '../../core/cms/fmt'
import { DEFAULT_NOSOTROS } from '../../core/cms/defaultNosotros'
import { QuienesSomos } from './components/QuienesSomos'
import { Funciones } from './components/Funciones'
import { DeclaracionFe } from './components/DeclaracionFe'
import { Equipo } from './components/Equipo'

export function NosotrosPage({ preview }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('nosotros', DEFAULT_NOSOTROS)
  const cms = preview || saved
  const h = cms.hero || DEFAULT_NOSOTROS.hero
  const L = (k) => (lang === 'en' ? h[`${k}_en`] : h[`${k}_es`]) || t(`nosotros.hero.${k}`)
  useReveal('/nosotros')
  return (
    <div className="pg pg-nos">
      <div className="nos-hero rv" style={h.bg ? { background: h.bg } : undefined}>
        <img className="nos-hero-bg" src={resolveAsset(h.img)} alt="SEMIT Cusco" loading="lazy" />
        <div className="nos-hero-veil" />
        <div className="container nos-hero-in">
          <span className="pill pill-glass" style={fmtCssKey(cms, 'hero.pill')}>{L('pill')}</span>
          <h1 style={fmtCssKey(cms, 'hero.h1')}>{L('h1a')}<br />{L('h1b')}</h1>
          <p style={fmtCssKey(cms, 'hero.p')}>{L('p')}</p>
          <div className="nos-verse">{lang === 'en' ? h.verse_en : h.verse_es} <b>{h.verseRef}</b></div>
          <div className="nos-stats-float">
            {asArr(h.stats, []).map((s, k) => (
              <Stat key={k} card v={s.v} label={lang === 'en' ? s.label_en : s.label_es} />
            ))}
          </div>
        </div>
      </div>
      <div className="container sec nos-body">
        <QuienesSomos preview={preview} />
        <Funciones preview={preview} forceIndex={preview ? 0 : undefined} />
        <DeclaracionFe preview={preview} />
        <Equipo preview={preview} />
      </div>
    </div>
  )
}

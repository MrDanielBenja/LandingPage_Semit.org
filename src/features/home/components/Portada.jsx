import { Link } from 'react-router-dom'
import { asArr } from '../../../core/cms/safe'
import { isVideoUrl } from '../../../core/cms/media'
import { useEffect, useState } from 'react'
import { Stat } from '../../../shared/ui/Stat'
import { useLang } from '../../../app/providers/LangProvider'
import { useContent } from '../../../core/cms/contentStore'
import { bgPos, resolveAsset } from '../../../core/cms/assets'
import { safeCssUrl, safeSrc } from '../../../core/cms/sanitize'
import { DEFAULT_INICIO } from '../../../core/cms/defaultInicio'
import { fmtCss } from '../../../core/cms/fmt'
import { iconOf } from '../../../core/cms/icons'
import { imgStyleOf } from '../../../core/cms/imgEdit'

export function Portada({ preview, forceIndex }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('inicio', DEFAULT_INICIO)
  const cms = preview || saved
  const raw = (Array.isArray(cms.slides) && cms.slides.length ? cms.slides : DEFAULT_INICIO.slides)
  const S = raw.map(s => ({ ...s, t: lang === 'en' ? s.t_en : s.t_es, s: lang === 'en' ? s.s_en : s.s_es, img: safeSrc(resolveAsset(s.img), '') }))
  const hero = cms.hero || DEFAULT_INICIO.hero
  const sections = cms.sections || DEFAULT_INICIO.sections
  const [i, setI] = useState(0)
  useEffect(() => { if (forceIndex !== undefined) { setI(forceIndex); return } const tm = setInterval(() => setI(v => (v + 1) % S.length), 5000); return () => clearInterval(tm) }, [S.length, forceIndex])
  const cur = S[Math.min(i, S.length - 1)] || S[0]
  const goIntro = () => document.getElementById('seminario')?.scrollIntoView({ behavior: 'smooth' })
  const scrollCue = iconOf(cms, 'scrollCue', '↓')
  const bgExtra = (s) => imgStyleOf(s)
  return (
    <div className="pk-header" style={{ minHeight: cur.h || hero.h, background: sections.portadaBg, '--pk-overlay': cur.overlay || hero.overlay }}>
      {S.map((s, k) => {
        const cfg = (s.imgCfg && typeof s.imgCfg === 'object') ? s.imgCfg : {}
        const hasCfg = (Number(cfg.scale ?? 1) !== 1) || Number(cfg.rotation ?? 0)
        return (isVideoUrl(s.img)
          ? <video key={s.id || k} className={`pk-bg pk-vid ${k === i ? 'on' : ''}`} src={safeSrc(s.img, '')} autoPlay muted loop playsInline preload="metadata" />
          : <div key={s.id || k} className={`pk-bg ${k === i ? 'on' : ''}`} style={{ backgroundImage: safeCssUrl(s.img), backgroundSize: s.fit || 'cover', backgroundPosition: bgPos(s.posX, s.posY), ...(hasCfg ? { animation: 'none' } : {}), ...bgExtra(s) }} />)
      })}
      <div className="pk-filter" />
      <div className="pk-content" style={{ color: cur.textColor || hero.textColor }}>
        <span className="pill pill-glass" style={cur.pillBg ? { background: cur.pillBg, color: cur.pillColor || cur.textColor } : undefined}>{t('home.portada.pill')}</span>
        <div key={cur.id || i} className="pk-title-wrap">
          <h1 className="hero-title" style={{ ...(cur.textColor ? { color: cur.textColor } : null), ...fmtCss(cur.ft) }}>{cur.t}</h1>
          <h2 className="presentation-subtitle" style={{ ...(cur.textColor ? { color: cur.textColor } : null), ...fmtCss(cur.fs) }}>{cur.s}</h2>
        </div>
        <div className="cta">
          <Link className="btn btn-blue" to="/niveles">{t('home.portada.cta1')}</Link>
          <Link className="btn btn-line" to="/cursos">{t('home.portada.cta2')}</Link>
        </div>
        <div className="hero-stats">
          <Stat v={475} label={t('home.portada.est')} />
          <Stat v={275} label={t('home.portada.mis')} />
          <Stat v={60} label={t('home.portada.doc')} />
          <div><b>4.9★</b>rating</div>
        </div>
      </div>
      <button className="scroll-cue" onClick={goIntro} aria-label={t('home.portada.more')}>{scrollCue}</button>
      <div className="fog-low" /><div className="fog-low right" />
      <div className="moving-clouds" />
    </div>
  )
}

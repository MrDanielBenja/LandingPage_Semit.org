import { SITE } from '../../../shared/config/site'
import { waLink } from '../../../core/services/whatsapp'
import { useLang } from '../../../app/providers/LangProvider'
import { useContent } from '../../../core/cms/contentStore'
import { resolveAsset } from '../../../core/cms/assets'
import { fmtCssKey } from '../../../core/cms/fmt'
import { DEFAULT_CONTACTO } from '../../../core/cms/defaultContacto'
import { DEFAULT_SITE } from '../../../core/cms/defaultSite'

export function HeroContacto({ onCanal, preview, sitePreview }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('contacto', DEFAULT_CONTACTO)
  const cms = preview || saved
  const h = cms.hero || DEFAULT_CONTACTO.hero
  const { data: siteSaved } = useContent('site', DEFAULT_SITE)
  const site = sitePreview || siteSaved
  const s = (site && site.site) || DEFAULT_SITE.site
  const L = (k) => (lang === 'en' ? h[`${k}_en`] : h[`${k}_es`]) || t(`contacto.hero.${k}`)
  const phone = s.phone || SITE.phone
  const email = s.email || SITE.email
  const hi = lang === 'en' ? 'Hi SEMIT, I want information.' : 'Hola SEMIT, quiero información.'
  const goLayout = () => document.querySelector('.c-layout')?.scrollIntoView({ behavior: 'smooth' })
  return (
    <div className="nos-hero rv" style={h.bg ? { background: h.bg } : undefined}>
      <img className="nos-hero-bg" src={resolveAsset(h.img)} alt="Comunidad SEMIT" loading="lazy" />
      <div className="nos-hero-veil" />
      <div className="container nos-hero-in">
        <span className="pill pill-glass" style={fmtCssKey(cms, 'ct.hero.pill')}>{L('pill')}</span>
        <h1 style={fmtCssKey(cms, 'ct.hero.h1')}>{L('h1a')}<br />{L('h1b')}</h1>
        <p style={fmtCssKey(cms, 'ct.hero.p')}>{L('p')}</p>
        <div className="nos-stats-float cols-3">
          <a className="stat4 stat-link" target="_blank" rel="noreferrer" href={waLink(hi, s.wa)}><b>💚 {phone}</b><span>{t('contacto.hero.waT')}</span></a>
          <button className="stat4 stat-link" onClick={() => { onCanal('sede'); goLayout() }}><b>📍 {t('contacto.hero.sedeT')}</b><span>{t('contacto.hero.sedeS')}</span></button>
          <button className="stat4 stat-link" onClick={() => { onCanal('form'); goLayout() }}><b>✉️ {t('contacto.hero.mailT')}</b><span>{email} →</span></button>
        </div>
      </div>
    </div>
  )
}

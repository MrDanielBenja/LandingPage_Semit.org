import { Link } from 'react-router-dom'
import { asArr } from '../../../core/cms/safe'
import { useLang } from '../../../app/providers/LangProvider'
import { useContent } from '../../../core/cms/contentStore'
import { resolveAsset } from '../../../core/cms/assets'
import { DEFAULT_INICIO } from '../../../core/cms/defaultInicio'
import { fmtCssKey } from '../../../core/cms/fmt'

export function SeminarioIntro({ preview }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('inicio', DEFAULT_INICIO)
  const cms = preview || saved
  const it = cms.intro || DEFAULT_INICIO.intro
  const L = (k) => (lang === 'en' ? it[`${k}_en`] : it[`${k}_es`]) || t(`home.intro.${k}`)
  const H2 = (lang === 'en' ? it.h2_en : it.h2_es) || [L('h2a'), L('h2b')].filter(Boolean).join(' ')
  const imgs = (Array.isArray(it.imgs) && it.imgs.length ? it.imgs : DEFAULT_INICIO.intro.imgs).map(resolveAsset)
  return (
    <div className="sem-free rv" style={it.bg ? { background: it.bg } : undefined}>
      <span className="pill" style={fmtCssKey(cms, 'intro.pill')}>{L('pill')}</span>
      <h2 style={{ ...(it.headingColor ? { color: it.headingColor } : null), ...fmtCssKey(cms, 'intro.h2') }}>{H2}</h2>
      <p style={{ ...(it.textColor ? { color: it.textColor } : null), ...fmtCssKey(cms, 'intro.p') }}>{L('p')}</p>
      <div className="sem-free-imgs">
        <img src={imgs[0]} alt="Aula Seminario" loading="lazy" />
        <img src={imgs[1]} alt="Estudiantes" loading="lazy" className="up" />
        <img src={imgs[2]} alt="Biblioteca" loading="lazy" />
      </div>
      <div className="sem-points free">
        <div><span>📖</span><b style={fmtCssKey(cms, 'intro.pt1t')}>{L('pt1t')}</b><small style={fmtCssKey(cms, 'intro.pt1d')}>{L('pt1d')}</small></div>
        <div><span>🔥</span><b style={fmtCssKey(cms, 'intro.pt2t')}>{L('pt2t')}</b><small style={fmtCssKey(cms, 'intro.pt2d')}>{L('pt2d')}</small></div>
        <div><span>🌱</span><b style={fmtCssKey(cms, 'intro.pt3t')}>{L('pt3t')}</b><small style={fmtCssKey(cms, 'intro.pt3d')}>{L('pt3d')}</small></div>
      </div>
      <div className="cta">
        <Link className="btn btn-blue" to="/niveles">{t('home.intro.cta1')}</Link>
        <Link className="btn btn-line" to="/nosotros">{t('home.intro.cta2')}</Link>
      </div>
    </div>
  )
}

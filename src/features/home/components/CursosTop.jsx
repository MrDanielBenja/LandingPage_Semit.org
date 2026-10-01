import { Link } from 'react-router-dom'
import { useCursos } from '../../cursos/hooks/useCursos'
import { useLang } from '../../../app/providers/LangProvider'
import { useContent } from '../../../core/cms/contentStore'
import { DEFAULT_INICIO } from '../../../core/cms/defaultInicio'
import { DEFAULT_CURSOS_PAGE, applyCursosOverrides } from '../../../core/cms/defaultCursosPage'
import { resolveAsset } from '../../../core/cms/assets'
import { fmtCssKey } from '../../../core/cms/fmt'

export function CursosTop({ preview }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('inicio', DEFAULT_INICIO)
  const cms = preview || saved
  const tp = cms.top || DEFAULT_INICIO.top
  const L = (k) => (lang === 'en' ? tp[`${k}_en`] : tp[`${k}_es`]) || t(`home.top.${k}`)
  const N = Number(tp.count) || 4
  const { data } = useCursos()
  const { data: cursosCms } = useContent('cursosPage', DEFAULT_CURSOS_PAGE)
  const base = applyCursosOverrides(data, cursosCms?.overrides, lang)
  const TOP = [...base].sort((a, b) => b.est - a.est).slice(0, N)
  return (
    <div className="rv" style={tp.bg ? { background: tp.bg } : undefined}>
      <div className="hsec"><span className="pill" style={fmtCssKey(cms, 'top.pill')}>{L('pill')}</span><h2 style={fmtCssKey(cms, 'top.h2')}>{L('h2')}</h2>
        <p style={fmtCssKey(cms, 'top.sub')}>{L('sub')}</p></div>
      <div className="ct-grid">{TOP.map((c, k) => (
        <Link key={c.slug || c.id || `${c.n}-${k}`} to="/cursos" className="ct-card" style={{ animationDelay: `${k * 80}ms` }}>
          <div className="ct-media"><img src={resolveAsset(c.img) || c.img} alt={c.n} loading="lazy" /><span className="cu-tag">{c.tag}</span></div>
          <div className="ct-body">
            <span className="cu-area">{c.a} · {c.nivel}</span>
            <h3>{c.n}</h3>
            <div className="ct-meta"><span>⭐ {c.rating.toFixed(1)}</span><span>👥 {c.est}</span><span>🕘 {c.semanas} {t('home.top.sem')}</span></div>
            <div className="cu-foot"><div className="cu-price"><small>$40</small><b>${c.p}</b></div><span className="cu-go">{t('home.top.ver')}</span></div>
          </div>
        </Link>))}</div>
      <div className="cta"><Link className="btn btn-line" to="/cursos">{t('home.top.verTodos', { n: base.length })}</Link></div>
    </div>
  )
}

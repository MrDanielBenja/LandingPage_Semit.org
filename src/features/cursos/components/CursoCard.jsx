import { useLang } from '../../../app/providers/LangProvider'
import { resolveAsset } from '../../../core/cms/assets'
import { iconOf, ICON_DEFAULTS } from '../../../core/cms/icons'
import { imgStyleOf } from '../../../core/cms/imgEdit'

export function CursoCard({ c, i, onSelect, icons }) {
  const { t } = useLang()
  const icms = { icons: icons || {} }
  const I = (k, fb) => iconOf(icms, k, fb || (ICON_DEFAULTS.cursosPage || {})[k])
  const old = c.p >= 40 ? 50 : 40
  const area = t('cursos.areaMap')[c.a] || c.a
  const nivel = t('cursos.nivelMap')[c.nivel] || c.nivel
  const modD = t('cursos.modMap')[c.mod] || c.mod
  return (
    <article className="cu-card rv" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }} onClick={() => onSelect(c)}>
      <span className="cu-rank">{String(i + 1).padStart(2, '0')}</span>
      <div className="cu-thumb">
        <img src={resolveAsset(c.img) || c.img} alt={c.n} loading="lazy" style={imgStyleOf(c)} />
        <span className="cu-tag">{c.tag}</span>
        <span className="cu-mod">{modD}</span>
      </div>
      <div className="cu-info">
        <span className="cu-area">{area} · {nivel}</span>
        <h3>{c.n}</h3>
        <p>{c.d}</p>
        <div className="cu-meta">
          <span>{I('sem', '🕘')} {c.semanas} {t('cursos.card.sem')}</span>
          <span>{I('lec', '📚')} {c.lecciones} {t('cursos.card.lec')}</span>
          <span>{I('star', '⭐')} {c.rating.toFixed(1)}</span>
          <span>{I('team', '👥')} {c.est}</span>
        </div>
        <div className="cu-foot">
          <div className="cu-price"><small>${old}</small><b>${c.p}</b><span>{t('cursos.card.promo')}</span></div>
          <span className="cu-go">{t('cursos.card.ver')}</span>
        </div>
      </div>
    </article>
  )
}

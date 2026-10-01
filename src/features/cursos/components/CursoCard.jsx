import { useLang } from '../../../app/providers/LangProvider'
import { resolveAsset } from '../../../core/cms/assets'

export function CursoCard({ c, i, onSelect }) {
  const { t } = useLang()
  const old = c.p >= 40 ? 50 : 40
  const area = t('cursos.areaMap')[c.a] || c.a
  const nivel = t('cursos.nivelMap')[c.nivel] || c.nivel
  const modD = t('cursos.modMap')[c.mod] || c.mod
  return (
    <article className="cu-card rv" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }} onClick={() => onSelect(c)}>
      <span className="cu-rank">{String(i + 1).padStart(2, '0')}</span>
      <div className="cu-thumb">
        <img src={resolveAsset(c.img) || c.img} alt={c.n} loading="lazy" />
        <span className="cu-tag">{c.tag}</span>
        <span className="cu-mod">{modD}</span>
      </div>
      <div className="cu-info">
        <span className="cu-area">{area} · {nivel}</span>
        <h3>{c.n}</h3>
        <p>{c.d}</p>
        <div className="cu-meta">
          <span>🕘 {c.semanas} {t('cursos.card.sem')}</span>
          <span>📚 {c.lecciones} {t('cursos.card.lec')}</span>
          <span>⭐ {c.rating.toFixed(1)}</span>
          <span>👥 {c.est}</span>
        </div>
        <div className="cu-foot">
          <div className="cu-price"><small>${old}</small><b>${c.p}</b><span>{t('cursos.card.promo')}</span></div>
          <span className="cu-go">{t('cursos.card.ver')}</span>
        </div>
      </div>
    </article>
  )
}

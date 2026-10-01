import { useLang } from '../../../app/providers/LangProvider'
import { fmtCssKey } from '../../../core/cms/fmt'

const MOD_EN = { Todos: 'All', Virtual: 'Online', Híbrido: 'Hybrid', Presencial: 'On-site' }

export function NivelCard({ c, i, onSelect, cms }) {
  const { lang, t } = useLang()
  const old = c.p >= 40 ? 50 : 40
  const mod = lang === 'en' ? (MOD_EN[c.mod] || c.mod) : c.mod
  return (
    <article className="cu-card rv" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }} onClick={() => onSelect(c)}>
      <span className="cu-rank">{String(i + 1).padStart(2, '0')}</span>
      <div className="cu-thumb">
        <img src={c.img} alt={c.n} loading="lazy" />
        <span className="cu-tag">{c.tag}</span>
        <span className="cu-mod">{mod}</span>
      </div>
      <div className="cu-info">
        <span className="cu-area">{c.a} · {c.dur}</span>
        <h3 style={fmtCssKey(cms, 'niv.programas.n')}>{c.n}</h3>
        <p style={fmtCssKey(cms, 'niv.programas.d')}>{c.d}</p>
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

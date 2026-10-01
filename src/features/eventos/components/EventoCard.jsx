import { useLang } from '../../../app/providers/LangProvider'
import { resolveAsset } from '../../../core/cms/assets'

const MESES_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

export function evFecha(f, meses) {
  const arr = Array.isArray(meses) && meses.length === 12 ? meses : MESES_ES
  const d = new Date(f + 'T12:00:00')
  return { dia: d.getDate(), mes: arr[d.getMonth()], anio: d.getFullYear() }
}

export function evDiasRestan(f) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const d = new Date(f + 'T12:00:00')
  d.setHours(0, 0, 0, 0)
  return Math.round((d - hoy) / 864e5)
}

export function EventoCard({ c, i, onSelect, preview }) {
  const { t } = useLang()
  const MESES = t('eventos.mesCorto')
  const f = evFecha(c.fecha, MESES)
  const dias = evDiasRestan(c.fecha)
  const libres = c.cupos - c.inscritos
  const catMap = t('eventos.catMap')
  const catT = (catMap && catMap[c.cat]) || c.cat
  return (
    <article className="cu-card rv" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }} onClick={() => onSelect(c)}>
      <span className="cu-rank">{String(i + 1).padStart(2, '0')}</span>
      <div className="cu-thumb">
        <img src={preview ? c.img : resolveAsset(c.img)} alt={c.n} loading="lazy" />
        <span className="cu-tag">{c.tag}</span>
        <span className="cu-mod">{c.mod}</span>
        <span className="ev-date"><b>{f.dia}</b><small>{f.mes}</small></span>
      </div>
      <div className="cu-info">
        <span className="cu-area">{catT}</span>
        <h3>{c.n}</h3>
        <p>{c.d}</p>
        <div className="cu-meta">
          <span>📅 {f.dia} {f.mes} {f.anio}</span>
          <span>🕘 {c.hora}</span>
          <span>📍 {c.lugar}</span>
        </div>
        <div className="cu-foot">
          <div className="cu-price">
            {c.p === 0 ? <b>{t('eventos.card.gratis')}</b> : <><small>S/.{Math.round(c.p * 1.25)}</small><b>S/.{c.p}</b></>}
            <span>{dias < 0 ? t('eventos.card.fin') : dias === 0 ? t('eventos.card.hoy') : t('eventos.card.en', { d: dias })}</span>
          </div>
          <span className="cu-go">{libres > 0 ? t('eventos.card.cupos', { n: libres }) : t('eventos.card.lleno')}</span>
        </div>
      </div>
    </article>
  )
}

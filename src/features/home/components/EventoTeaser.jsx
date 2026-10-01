import { Link } from 'react-router-dom'
import { useCountdown } from '../../../shared/hooks/useCountdown'
import { EVENTOS } from '../../eventos/data/eventos.data'
import { waLink } from '../../../core/services/whatsapp'
import { useLang } from '../../../app/providers/LangProvider'
import { useContent } from '../../../core/cms/contentStore'
import { DEFAULT_INICIO } from '../../../core/cms/defaultInicio'
import { fmtCssKey } from '../../../core/cms/fmt'

const dias = (f) => {
  const h = new Date()
  h.setHours(0, 0, 0, 0)
  const d = new Date(f + 'T12:00:00')
  d.setHours(0, 0, 0, 0)
  return Math.round((d - h) / 864e5)
}

export function EventoTeaser({ preview }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('inicio', DEFAULT_INICIO)
  const cms = preview || saved
  const tz = cms.teaser || DEFAULT_INICIO.teaser
  const L = (k) => (lang === 'en' ? tz[`${k}_en`] : tz[`${k}_es`]) || t(`home.teaser.${k}`)
  const ev = [...EVENTOS].filter(e => dias(e.fecha) >= 0).sort((a, b) => a.fecha.localeCompare(b.fecha))[0] || EVENTOS[0]
  const cd = useCountdown(ev.fecha + 'T' + ev.hora + ':00')
  return (
    <div className="evt-card rv" style={tz.bg ? { background: tz.bg } : undefined}>
      <img src={ev.img} alt={ev.n} loading="lazy" />
      <div className="evt-info">
        <span className="gold-pill" style={fmtCssKey(cms, 'teaser.pill')}>{L('pill')} {ev.cat}</span>
        <h2>{ev.n}</h2>
        <p>📍 {ev.lugar} · 🕘 {ev.hora}</p>
        <div className="ev-cd">{[[cd.d, t('home.teaser.dias')], [cd.h, t('home.teaser.hrs')], [cd.m, t('home.teaser.min')], [cd.s, t('home.teaser.seg')]].map(([v, l]) => <div key={l}><b>{String(v).padStart(2, '0')}</b><span>{l}</span></div>)}</div>
        <div className="cta" style={{ justifyContent: 'flex-start' }}>
          <Link className="btn btn-gold" to="/eventos">{t('home.teaser.agenda')}</Link>
          <a className="btn btn-line" target="_blank" rel="noreferrer" href={waLink(t('home.teaser.wa', { n: ev.n }))}>{t('home.teaser.reservar')}</a>
        </div>
      </div>
    </div>
  )
}

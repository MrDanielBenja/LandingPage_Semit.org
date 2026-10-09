import { Link } from 'react-router-dom'
import { useCountdown } from '../../../shared/hooks/useCountdown'
import { EVENTOS } from '../../eventos/data/eventos.data'
import { waLink } from '../../../core/services/whatsapp'
import { useLang } from '../../../app/providers/LangProvider'
import { useContent } from '../../../core/cms/contentStore'
import { DEFAULT_INICIO } from '../../../core/cms/defaultInicio'
import { DEFAULT_EVENTOS } from '../../../core/cms/defaultEventos'
import { asArr } from '../../../core/cms/safe'
import { resolveAsset } from '../../../core/cms/assets'
import { fmtCssKey } from '../../../core/cms/fmt'
import { iconOf } from '../../../core/cms/icons'
import { imgStyleOf } from '../../../core/cms/imgEdit'

const dias = (f) => {
  const h = new Date()
  h.setHours(0, 0, 0, 0)
  const d = new Date(f + 'T12:00:00')
  d.setHours(0, 0, 0, 0)
  return Math.round((d - h) / 864e5)
}

export function EventoTeaser({ preview, previewEventos }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('inicio', DEFAULT_INICIO)
  const cms = preview || saved
  const tz = cms.teaser || DEFAULT_INICIO.teaser
  const L = (k) => (lang === 'en' ? tz[`${k}_en`] : tz[`${k}_es`]) || t(`home.teaser.${k}`)
  const { data: evSaved } = useContent('eventos', DEFAULT_EVENTOS)
  const evCms = previewEventos || evSaved || DEFAULT_EVENTOS
  const ALL = asArr(evCms.eventos, DEFAULT_EVENTOS.eventos).map(e => ({
    ...e,
    n: e.n || '',
    cat: e.cat || '',
    lugar: e.lugar || '',
    hora: e.hora || '',
    fecha: e.fecha || '',
    img: resolveAsset(e.img),
  }))
  const base = ALL.length ? ALL : EVENTOS
  const ev = [...base].filter(e => e.fecha && dias(e.fecha) >= 0).sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)))[0] || base[0]
  const cd = useCountdown(ev && ev.fecha && ev.hora ? `${ev.fecha}T${ev.hora}:00` : '')
  if (!ev) return null
  const iPin = iconOf(cms, 'teaserPin', '📍')
  const iClock = iconOf(cms, 'teaserClock', '🕘')
  return (
    <div className="evt-card rv" style={tz.bg ? { background: tz.bg } : undefined}>
      <img src={ev.img} alt={ev.n} loading="lazy" style={imgStyleOf(ev)} />
      <div className="evt-info">
        <span className="gold-pill" style={fmtCssKey(cms, 'teaser.pill')}>{L('pill')} {ev.cat}</span>
        <h2>{ev.n}</h2>
        <p>{iPin} {ev.lugar} · {iClock} {ev.hora}</p>
        <div className="ev-cd">{[[cd.d, t('home.teaser.dias')], [cd.h, t('home.teaser.hrs')], [cd.m, t('home.teaser.min')], [cd.s, t('home.teaser.seg')]].map(([v, l]) => <div key={l}><b>{String(v).padStart(2, '0')}</b><span>{l}</span></div>)}</div>
        <div className="cta" style={{ justifyContent: 'flex-start' }}>
          <Link className="btn btn-gold" to="/eventos">{t('home.teaser.agenda')}</Link>
          <a className="btn btn-line" target="_blank" rel="noreferrer" href={waLink(t('home.teaser.wa', { n: ev.n }))}>{t('home.teaser.reservar')}</a>
        </div>
      </div>
    </div>
  )
}

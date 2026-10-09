import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { waLink } from '../../../core/services/whatsapp'
import { useLang } from '../../../app/providers/LangProvider'
import { resolveAsset } from '../../../core/cms/assets'
import { evDiasRestan, evFecha } from './EventoCard'
import { iconOf, ICON_DEFAULTS } from '../../../core/cms/icons'
import { imgStyleOf } from '../../../core/cms/imgEdit'

export function EventoDrawer({ evento, onClose, preview, icons }) {
  const { t } = useLang()
  const [tab, setTab] = useState('programa')
  const icms = { icons: icons || {} }
  const I = (k, fb) => iconOf(icms, k, fb || (ICON_DEFAULTS.eventos || {})[k])
  useEffect(() => {
    setTab('programa')
    if (!evento) return
    document.body.style.overflow = 'hidden'
    const esc = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', esc)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', esc) }
  }, [evento, onClose])
  if (!evento) return null
  const c = evento
  const MESES = t('eventos.mesCorto')
  const f = evFecha(c.fecha, MESES)
  const dias = evDiasRestan(c.fecha)
  const libres = c.cupos - c.inscritos
  const pct = Math.min(100, Math.round((c.inscritos / c.cupos) * 100))
  const catMap = t('eventos.catMap')
  const catT = (catMap && catMap[c.cat]) || c.cat
  const inc = t('eventos.drawer.inc')
  return (
    <div className="drawer-bg" onClick={onClose}>
      <aside className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-hero">
          <img src={preview ? c.img : resolveAsset(c.img)} alt={c.n} style={imgStyleOf(c)} />
          <button className="drawer-x" onClick={onClose} aria-label={t('eventos.drawer.cerrar')}>✕</button>
          <span className="cu-tag">{c.tag}</span>
        </div>
        <div className="drawer-body">
          <span className="cu-area">{catT} · {c.mod}</span>
          <h2>{c.n}</h2>
          <div className="drawer-rating">
            <b>{I('evDate', '📅')} {f.dia} {f.mes} {f.anio} · {c.hora}</b>
            <span>· {I('evPin', '📍')} {c.lugar}</span>
            <span>· {I('evStar', '⭐')} {c.rating.toFixed(1)}</span>
          </div>
          <p className="drawer-desc">{c.d}</p>
          <div className="ev-count-mini">
            <span>{dias < 0 ? t('eventos.drawer.fin') : dias === 0 ? t('eventos.drawer.hoy') : t('eventos.drawer.faltan', { d: dias })}</span>
            <span>{libres > 0 ? t('eventos.drawer.cupos', { l: libres, c: c.cupos }) : t('eventos.drawer.lleno')}</span>
          </div>
          <div className="bar"><i style={{ width: `${pct}%` }} /></div>
          <div className="drawer-tabs">
            {['programa', 'incluye', 'precio'].map(k => (
              <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{k === 'programa' ? t('eventos.drawer.tabPro') : k === 'incluye' ? t('eventos.drawer.tabInc') : t('eventos.drawer.tabPre')}</button>
            ))}
          </div>
          {tab === 'programa' && (
            <ol className="temario">{(Array.isArray(c.programa) ? c.programa : []).map((x, k) => <li key={x}><b>{String(k + 1).padStart(2, '0')}</b><span>{x}</span></li>)}</ol>
          )}
          {tab === 'incluye' && (
            <ul className="chk drawer-chk">{(Array.isArray(inc) ? inc : []).map(x => <li key={x}>{x}</li>)}</ul>
          )}
          {tab === 'precio' && (
            <div className="drawer-price">
              <div>{c.p === 0 ? <><strong>{t('eventos.drawer.gratis')}</strong><span>{t('eventos.drawer.conInsc')}</span></> : <><small>S/.{Math.round(c.p * 1.25)} {t('eventos.drawer.reg')}</small><strong>S/.{c.p}</strong><span>{t('eventos.drawer.promo')}</span></>}</div>
              <p>{t('eventos.drawer.separa')}</p>
            </div>
          )}
        </div>
        <div className="drawer-foot">
          <div className="cu-price">{c.p === 0 ? <b>{t('eventos.drawer.gratis')}</b> : <><small>S/.{Math.round(c.p * 1.25)}</small><b>S/.{c.p}</b></>}</div>
          <a className="btn btn-line" target="_blank" rel="noreferrer" href={waLink(t('eventos.drawer.waMsg', { n: c.n, d: f.dia, m: f.mes }))}>{t('eventos.drawer.wa')}</a>
          <Link className="btn btn-blue" to="/contacto">{t('eventos.drawer.res')}</Link>
        </div>
      </aside>
    </div>
  )
}

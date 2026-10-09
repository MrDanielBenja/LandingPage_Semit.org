import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { waLink } from '../../../core/services/whatsapp'
import { useLang } from '../../../app/providers/LangProvider'
import { resolveAsset } from '../../../core/cms/assets'
import { fmtCssKey } from '../../../core/cms/fmt'
import { iconOf } from '../../../core/cms/icons'
import { imgStyleOf } from '../../../core/cms/imgEdit'

const MOD_EN = { Todos: 'All', Virtual: 'Online', Híbrido: 'Hybrid', Presencial: 'On-site' }

export function NivelDrawer({ nivel, onClose, cms }) {
  const { lang, t } = useLang()
  const [tab, setTab] = useState('temario')
  useEffect(() => {
    setTab('temario')
    if (!nivel) return
    document.body.style.overflow = 'hidden'
    const esc = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', esc)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', esc) }
  }, [nivel, onClose])
  if (!nivel) return null
  const c = nivel
  const old = c.p >= 40 ? 50 : 40
  const mod = lang === 'en' ? (MOD_EN[c.mod] || c.mod) : c.mod
  const I = (k, fb) => iconOf(cms, k, fb)
  return (
    <div className="drawer-bg" onClick={onClose}>
      <aside className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer-hero">
          <img src={resolveAsset(c.img)} alt={c.n} style={imgStyleOf(c)} />
          <button className="drawer-x" onClick={onClose} aria-label={t('cursos.drawer.cerrar')}>✕</button>
          <span className="cu-tag">{c.tag}</span>
        </div>
        <div className="drawer-body">
          <span className="cu-area">{c.a} · {mod} · {c.dur}</span>
          <h2 style={fmtCssKey(cms, 'niv.programas.n')}>{c.n}</h2>
          <div className="drawer-rating"><b>{I('star', '⭐')} {c.rating.toFixed(1)}</b><span>· {c.est} {t('cursos.drawer.est')}</span><span>· {I('sem', '🕘')} {c.semanas} {t('cursos.drawer.sem')}</span><span>· {I('lec', '📚')} {c.lecciones} {t('cursos.drawer.lec')}</span></div>
          <p className="drawer-desc" style={fmtCssKey(cms, 'niv.programas.d')}>{c.d} {t('cursos.drawer.suf')}</p>
          <div className="drawer-tabs">
            {['temario', 'incluye', 'precio'].map(x => (
              <button key={x} className={tab === x ? 'on' : ''} onClick={() => setTab(x)}>{x === 'temario' ? (lang === 'en' ? '📚 Content' : '📚 Contenido') : x === 'incluye' ? t('cursos.drawer.tabInc') : t('cursos.drawer.tabPre')}</button>
            ))}
          </div>
          {tab === 'temario' && (
            <ol className="temario">{(Array.isArray(c.incluye) ? c.incluye : []).map((x, k) => <li key={x}><b>{String(k + 1).padStart(2, '0')}</b><span>{x}</span></li>)}</ol>
          )}
          {tab === 'incluye' && (
            <ul className="chk drawer-chk">{(Array.isArray(t('cursos.drawer.inc')) ? t('cursos.drawer.inc') : []).map(x => <li key={x}>{x}</li>)}</ul>
          )}
          {tab === 'precio' && (
            <div className="drawer-price">
              <div><small>${old} {t('cursos.drawer.preReg')}</small><strong>${c.p}</strong><span>{t('cursos.drawer.prePro')}</span></div>
              <p>{t('cursos.drawer.preP')}</p>
            </div>
          )}
        </div>
        <div className="drawer-foot">
          <div className="cu-price"><small>${old}</small><b>${c.p}</b></div>
          <a className="btn btn-line" target="_blank" rel="noreferrer" href={waLink(t('cursos.drawer.waMsg', { n: c.n, p: c.p }))}>{t('cursos.drawer.wa')}</a>
          <Link className="btn btn-blue" to="/contacto">{t('cursos.drawer.insc')}</Link>
        </div>
      </aside>
    </div>
  )
}

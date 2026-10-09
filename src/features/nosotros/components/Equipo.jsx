import { useEffect, useMemo, useState } from 'react'
import { useSwipe } from '../../../shared/hooks/useSwipe'
import { asArr } from '../../../core/cms/safe'
import { aliasPaisId, defaultPaises, flagFor, flagNameList, memberHasPais, memberPaises, normalizePaises, paisName } from '../../../core/cms/paises'
import { useLang } from '../../../app/providers/LangProvider'
import { useContent } from '../../../core/cms/contentStore'
import { resolveAsset } from '../../../core/cms/assets'
import { fmtCssKey } from '../../../core/cms/fmt'
import { DEFAULT_NOSOTROS } from '../../../core/cms/defaultNosotros'
import { iconOf } from '../../../core/cms/icons'
import { imgStyleOf } from '../../../core/cms/imgEdit'

export function Equipo({ preview, forceIndex }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('nosotros', DEFAULT_NOSOTROS)
  const cms = preview || saved
  const o = cms.equipo || DEFAULT_NOSOTROS.equipo
  const L = (k) => (lang === 'en' ? o[`${k}_en`] : o[`${k}_es`]) || t(`nosotros.equipo.${k}`)
  const suffix = (lang === 'en' ? o.suffix_en : o.suffix_es) ?? L('suffix')
  const iPrev = iconOf(cms, 'prev', '‹')
  const iNext = iconOf(cms, 'next', '›')
  const PAISES = useMemo(() => normalizePaises(o.paises, defaultPaises()), [JSON.stringify(o.paises)])
  const DATA = asArr(o.members, []).map(m => ({ ...m, rol: lang === 'en' ? m.rol_en : m.rol_es, q: lang === 'en' ? m.q_en : m.q_es, img: resolveAsset(m.img) }))
  const ALL = 'Todos'
  const [filtro, setFiltro] = useState(ALL)
  const [sel, setSel] = useState(forceIndex || 0)
  const filtroId = aliasPaisId(filtro)
  useEffect(() => { if (forceIndex !== undefined) setSel(forceIndex) }, [forceIndex])
  useEffect(() => { if (filtro !== ALL && !PAISES.some(p => p.id === filtroId)) { setFiltro(ALL); setSel(0) } }, [filtro, filtroId, PAISES])
  const vis = DATA.map((m, k) => ({ ...m, k })).filter(m => filtro === ALL || memberHasPais(m, filtroId))
  const cur = vis.length ? vis[Math.min(sel, vis.length - 1)] : null
  const go = d => setSel(s => (s + d + vis.length) % Math.max(1, vis.length))
  const swipe = useSwipe(() => go(1), () => go(-1))
  const cls3d = idx => {
    if (!vis.length) return 'hidden'
    const off = (idx - sel + vis.length) % vis.length
    if (off === 0) return 'center'
    if (off === 1) return 'right-1'
    if (off === 2) return 'right-2'
    if (off === vis.length - 1) return 'left-1'
    if (off === vis.length - 2) return 'left-2'
    return 'hidden'
  }
  return (
    <section className="team-plain rv" style={o.bg ? { background: o.bg } : undefined}>
      <span className="pill">{L('pill')}</span>
      <div className="about-title" style={fmtCssKey(cms, 'equipo.title')}>{L('title')}</div>
      <p className="team-sub" style={fmtCssKey(cms, 'equipo.p')}>{L('sub')}</p>
      <div className="seg-wrap">
        <button className={`segbtn ${filtro === ALL ? 'on' : ''}`} onClick={() => { setFiltro(ALL); setSel(0) }}>{L('todos')}</button>
        {PAISES.map(p => <button key={p.id} className={`segbtn ${filtroId === p.id ? 'on' : ''}`} onClick={() => { setFiltro(p.id); setSel(0) }}>{flagFor(PAISES, p.id)} {paisName(PAISES, p.id, lang)}</button>)}
      </div>
      <div className="team3d">
        <div className="carousel-container" {...swipe}>
          <button className="nav-arrow left" aria-label={t('nosotros.equipo.prev')} onClick={() => go(-1)}>{iPrev}</button>
          <div className="carousel-track">
            {vis.map((m, idx) => (
              <div key={m.k} className={`card3d ${cls3d(idx)}`} onClick={() => setSel(idx)}>
                <img src={m.img} alt={m.n} loading="lazy" style={imgStyleOf(m)} />
              </div>))}
          </div>
          <button className="nav-arrow right" aria-label={t('nosotros.equipo.next')} onClick={() => go(1)}>{iNext}</button>
        </div>
        {cur && (
          <div className="member-info" key={cur.k}>
            <h2 className="member-name">{cur.n} <small style={{ fontSize: 16 }}>{flagNameList(PAISES, memberPaises(cur), lang)}</small></h2>
            <p className="member-role">{cur.rol}</p>
            <div className="nos-test"><p>“{cur.q}”</p><b style={fmtCssKey(cms, 'equipo.suffix')}>{cur.n}{suffix ? ` ${suffix}` : ''}</b></div>
          </div>
        )}
        <div className="dots">{vis.map((_, idx) => <button key={idx} aria-label={'ir a ' + idx} className={`dot ${idx === sel ? 'on' : ''}`} onClick={() => setSel(idx)} />)}</div>
      </div>
    </section>
  )
}

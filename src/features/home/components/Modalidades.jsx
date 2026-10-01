import { useEffect, useState } from 'react'
import { asArr } from '../../../core/cms/safe'
import { Link } from 'react-router-dom'
import { useLang } from '../../../app/providers/LangProvider'
import { useContent } from '../../../core/cms/contentStore'
import { resolveAsset } from '../../../core/cms/assets'
import { DEFAULT_INICIO } from '../../../core/cms/defaultInicio'
import { fmtCssKey } from '../../../core/cms/fmt'

const AULA_URL = 'https://demo.casa-peniel.com/'
const ORDER = ['presencial', 'semi', 'virtual']

export function Modalidades({ preview }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('inicio', DEFAULT_INICIO)
  const cms = preview || saved
  const md = cms.mods || DEFAULT_INICIO.mods
  const L = (k) => (lang === 'en' ? md[`${k}_en`] : md[`${k}_es`]) || t(`home.mods.${k}`)
  const MODS = asArr(md.items, []).map(m => ({ ...m, t: lang === 'en' ? m.t_en : m.t_es, d: lang === 'en' ? m.d_en : m.d_es, img: resolveAsset(m.img), hijos: asArr(m.hijos, []).map(h => ({ ...h, t: lang === 'en' ? h.t_en : h.t_es, d: lang === 'en' ? h.d_en : h.d_es, img: resolveAsset(h.img) })) }))
  const [mod, setMod] = useState('presencial')
  const [pause, setPause] = useState(!!preview)
  const cur = MODS.find(m => m.id === mod) || MODS[0]
  const ORDER_L = MODS.map(m => m.id)
  useEffect(() => {
    if (pause || preview) return
    const tm = setInterval(() => setMod(m => ORDER_L[(ORDER_L.indexOf(m) + 1) % ORDER_L.length]), 6000)
    return () => clearInterval(tm)
  }, [pause, preview, ORDER_L.join(',')])
  if (!cur) return null
  return (
    <div className="rv" style={md.bg ? { background: md.bg } : undefined} onMouseEnter={() => setPause(true)} onMouseLeave={() => setPause(false)}>
      <div className="hsec"><span className="pill" style={fmtCssKey(cms, 'mods.pill')}>{L('pill')}</span><h2 style={fmtCssKey(cms, 'mods.h2')}>{L('h2')}</h2>
        <p style={fmtCssKey(cms, 'mods.sub')}>{L('sub')}</p></div>
      <div className="mod-tabs">
        {MODS.map(m => (
          <button key={m.id} className={`mod-tab ${mod === m.id ? 'on' : ''}`} onClick={() => setMod(m.id)}>
            <span className="mod-photo"><img src={m.img} alt={m.t} loading="lazy" /><span className="mod-e">{m.e}</span></span>
            <b style={fmtCssKey(cms, 'mods.itemt')}>{m.t}</b>
            <small style={fmtCssKey(cms, 'mods.itemd')}>{m.d}</small>
          </button>
        ))}
      </div>
      <div key={mod} className="mod-duo">
        {cur.hijos.map((h, k) => {
          const toBcb = cur.id === 'presencial' && (h.t === 'Intensivo' || h.t === 'Intensive')
          const toAula = cur.id === 'virtual'
          const inner = (<>
            <div className="mod-card-media"><img src={h.img} alt={h.t} loading="lazy" /><span className="mod-big">{h.e}</span></div>
            <div className="mod-card-txt">
              <span className="k">{cur.t} · 0{k + 1}</span>
              <h3 style={fmtCssKey(cms, 'mods.hijot')}>{h.t}</h3>
              <p style={fmtCssKey(cms, 'mods.hijod')}>{h.d}</p>
              {(toBcb || toAula) && <span className="mod-go">{toBcb ? t('home.mods.goBcb') : t('home.mods.goAula')}</span>}
            </div>
          </>)
          if (toBcb) return <Link key={h.t} to="/eventos#bcb" className="mod-card mod-link" style={{ animationDelay: `${k * 100}ms` }}>{inner}</Link>
          if (toAula) return <a key={h.t} href={AULA_URL} target="_blank" rel="noreferrer" className="mod-card mod-link" style={{ animationDelay: `${k * 100}ms` }}>{inner}</a>
          return <div key={h.t} className="mod-card" style={{ animationDelay: `${k * 100}ms` }}>{inner}</div>
        })}
      </div>
      <div className="dots">{ORDER_L.map(o => <button key={o} aria-label={o} className={`dot ${mod === o ? 'on' : ''}`} onClick={() => setMod(o)} />)}</div>
    </div>
  )
}

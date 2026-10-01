import { useState } from 'react'
import { asArr } from '../../../core/cms/safe'
import { Link } from 'react-router-dom'
import { waLink } from '../../../core/services/whatsapp'
import { useLang } from '../../../app/providers/LangProvider'
import { useContent } from '../../../core/cms/contentStore'
import { resolveAsset } from '../../../core/cms/assets'
import { fmtCssKey } from '../../../core/cms/fmt'
import { DEFAULT_EVENTOS } from '../../../core/cms/defaultEventos'
import { SITE } from '../../../shared/config/site'

export function BcbEvento({ preview }) {
  const { lang } = useLang()
  const en = lang === 'en'
  const { data: saved } = useContent('eventos', DEFAULT_EVENTOS)
  const cms = preview || saved
  const o = cms.bcb || DEFAULT_EVENTOS.bcb
  const L = (k) => (lang === 'en' ? o[`${k}_en`] : o[`${k}_es`]) || ''
  const loc = (x) => lang === 'en' ? (x.t_en || x.t_es) : (x.t_es || x.t_en)
  const locD = (x) => lang === 'en' ? (x.d_en || x.d_es) : (x.d_es || x.d_en)
  const locN = (x) => lang === 'en' ? (x.n_en || x.n_es) : (x.n_es || x.n_en)
  const AREAS = asArr(o.areas, []).map(a => ({ ...a, t: loc(a), d: locD(a), img: resolveAsset(a.img) }))
  const OFICIOS = asArr(o.oficios, []).map(a => ({ ...a, t: loc(a), d: locD(a), img: resolveAsset(a.img) }))
  const INCLUYE = asArr(o.incluye, []).map(a => ({ ...a, t: loc(a), d: locD(a), img: resolveAsset(a.img) }))
  const CAMPOS = asArr(o.campos, []).map(a => ({ ...a, t: loc(a), d: locD(a), img: resolveAsset(a.img) }))
  const COSTOS = asArr(o.costos, []).map(c => ({ ...c, n: locN(c) }))
  const CUBRE = asArr(en ? o.cubre_en : o.cubre_es, [])
  const [fase, setFase] = useState(0)
  const [costo, setCosto] = useState(0)
  const [campo, setCampo] = useState(0)
  const [verMas, setVerMas] = useState(false)
  const curCampo = CAMPOS[campo] || CAMPOS[0] || {}
  return (
    <div className="bcb-sec rv" id="bcb" style={{ paddingLeft: 0, paddingRight: 0 }}>
      <div className="hsec"><span className="pill">{L('pill')}</span><h2 style={fmtCssKey(cms, 'ev.bcb.h2')}>{L('h2')}</h2>
        <p style={fmtCssKey(cms, 'ev.bcb.p')}>{L('p')}</p></div>
      <div className="bcb-steps">
        <button className={fase === 0 ? 'on' : ''} onClick={() => setFase(0)}><b>01</b><span>{L('f0')}</span><small>{L('f0sub')}</small></button>
        <span className="bcb-line" />
        <button className={fase === 1 ? 'on' : ''} onClick={() => setFase(1)}><b>02</b><span>{L('f1')}</span><small>{L('f1sub')}</small></button>
      </div>

      {fase === 0 ? (
        <div key="f0" className="bcb-page">
          <div className="bcb-hero"><img src={resolveAsset(o.img_base)} alt={L('k0t')} loading="lazy" />
            <div><span className="k">{L('k0')}</span><h3>{L('k0t')}</h3>
              <p>{L('k0p1')}</p>
              <p style={{ marginTop: 8 }}>{L('k0p2')}</p></div></div>

          <h4 className="bcb-h4">{L('hAreas')}</h4>
          <div className="bcb-cards4">{AREAS.map(a => <div key={a.t} className="bcb-mini bcb-photo"><img src={a.img} alt={a.t} loading="lazy" /><span className="bcb-emo">{a.e}</span><b>{a.t}</b><small>{a.d}</small></div>)}</div>

          <h4 className="bcb-h4">{L('hOficios')}</h4>
          <div className="bcb-cards4">{OFICIOS.map(x => <div key={x.t} className="bcb-mini bcb-photo"><img src={x.img} alt={x.t} loading="lazy" /><span className="bcb-emo">{x.e}</span><b>{x.t}</b><small>{x.d}</small></div>)}</div>
          <div className="note">{L('nota1')}</div>

          <h4 className="bcb-h4">{L('hIncluye')}</h4>
          <div className="bcb-cards4">{INCLUYE.map(x => <div key={x.t} className="bcb-mini bcb-photo"><img src={x.img} alt={x.t} loading="lazy" /><span className="bcb-emo">{x.e}</span><b>{x.t}</b><small>{x.d}</small></div>)}</div>
          <div className="bcb-duo">
            <div className="mini-card"><span>{L('fechaT')}</span><strong style={{ fontSize: 15 }}>{L('fechaV')}</strong></div>
            <div className="mini-card"><span>{L('lugarT')}</span><strong style={{ fontSize: 15 }}>{L('lugarV')}</strong></div>
          </div>
          <div className="note">{L('nota2')}</div>

          <h4 className="bcb-h4">{L('hInv')}</h4>
          <div className="cost-grid">{COSTOS.map((c, k) => (
            <button key={c.tag} className={`cost-card ${k === costo ? 'on' : ''}`} onClick={() => setCosto(k)}>
              <small>{c.tag}</small><strong>{c.p}</strong><span>{c.n}</span>
            </button>))}</div>
          <div className="note">{L('nota3')}<br />{L('nota4')}<br />{L('nota5')}</div>
          <button className="btn btn-line" style={{ width: '100%' }} onClick={() => setVerMas(v => !v)}>{verMas ? L('verMenos') : L('verMas')}</button>
          {verMas && <div className="note">{L('nota6')}</div>}
          <Link className="btn btn-blue" to="/contacto" style={{ width: '100%', marginTop: 8 }}>{L('inscBase')}</Link>
        </div>
      ) : (
        <div key="f1" className="bcb-page">
          <div className="bcb-hero"><img src={curCampo.img} alt={curCampo.t} loading="lazy" />
            <div><span className="k">{L('k1')}</span><h3>{L('k1t')}</h3>
              <p>{L('k1p1')}</p>
              <p style={{ marginTop: 8 }}>{L('k1p2')}</p></div></div>

          <h4 className="bcb-h4">{L('hRuta')}</h4>
          <div className="route-grid">{CAMPOS.map((x, k) => (
            <button key={x.t} className={`route-card ${k === campo ? 'on' : ''}`} onClick={() => setCampo(k)}>
              <img src={x.img} alt={x.t} loading="lazy" /><b>{L('opc')} {k + 1} · {x.t}</b><span>{x.d}</span>
            </button>))}</div>
          <div className="note" key={campo}>📍 <b>{curCampo.t}:</b> {curCampo.d} — {L('viajas')}</div>

          <h4 className="bcb-h4">{L('hCubre')}</h4>
          <div className="bcb-cards4">{CUBRE.map(x => <div key={x} className="bcb-mini chk-mini">{x}</div>)}</div>
          <div className="note">{L('nota7')} <b>{SITE.phone}</b></div>
          <div className="bcb-duo">
            <a className="btn btn-line" href={waLink(L('waCampoMsg'))} target="_blank" rel="noreferrer">{L('waCampo')}</a>
            <Link className="btn btn-blue" to="/contacto">{L('inscCampo')}</Link>
          </div>
        </div>
      )}
    </div>
  )
}

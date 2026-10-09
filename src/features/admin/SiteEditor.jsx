import { useState } from 'react'
import { Row, FmtCtl, ImgPick } from './InicioEditor'
import { SITE_ASSETS } from '../../core/cms/defaultSite'

function LangTabs({ tab, setTab }) {
  return (
    <div className="adm-tabs">
      <button type="button" className={tab === 'es' ? 'on' : ''} onClick={() => setTab('es')}>🇪🇸 ES</button>
      <button type="button" className={tab === 'en' ? 'on' : ''} onClick={() => setTab('en')}>🇬🇧 EN</button>
    </div>
  )
}

function SiteForm({ o, onChange, fmt, setFmt }) {
  const [tab, setTab] = useState('es')
  const set = (k, v) => onChange({ ...o, [k]: v })
  const ESF = ['full', 'city', 'address']
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      <Row label="Nombre"><input value={o.name || ''} onChange={e => set('name', e.target.value)} /></Row>
      <FmtCtl label="Fmt marca" value={fmt['site.brand']} onChange={v => setFmt('site.brand', v)} />
      <Row label="Logo"><ImgPick value={o.logo || '/assets/logo/logo.png'} onChange={v => set('logo', v)} assets={SITE_ASSETS} kinds="image" /></Row>
      <Row label="Ancho logo px"><input type="number" min="60" max="320" value={o.logoSize || 132} onChange={e => set('logoSize', Number(e.target.value))} /></Row>
      {ESF.map(k => tab === 'es'
        ? <Row key={k} label={`${k} ES`}><input value={o[`${k}_es`] || ''} onChange={e => set(`${k}_es`, e.target.value)} /></Row>
        : <Row key={k} label={`${k} EN`}><input value={o[`${k}_en`] || ''} onChange={e => set(`${k}_en`, e.target.value)} /></Row>)}
      <Row label="Teléfono"><input value={o.phone || ''} onChange={e => set('phone', e.target.value)} /></Row>
      <Row label="Teléfono raw"><input value={o.phoneRaw || ''} onChange={e => set('phoneRaw', e.target.value)} /></Row>
      <Row label="WhatsApp"><input value={o.wa || ''} onChange={e => set('wa', e.target.value)} /></Row>
      <Row label="Email"><input value={o.email || ''} onChange={e => set('email', e.target.value)} /></Row>
      <Row label="Facebook"><input value={o.facebook || ''} onChange={e => set('facebook', e.target.value)} /></Row>
      <Row label="Maps query"><input value={o.mapsQuery || ''} onChange={e => set('mapsQuery', e.target.value)} /></Row>
      <Row label="Portal URL"><input value={o.portalUrl || ''} onChange={e => set('portalUrl', e.target.value)} /></Row>
    </div>
  )
}

function NavForm({ arr, onChange, fmt, setFmt }) {
  const [tab, setTab] = useState('es')
  const list = Array.isArray(arr) ? arr : []
  const upd = (k, patch) => onChange(list.map((x, j) => (j === k ? { ...x, ...patch } : x)))
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      <FmtCtl label="Fmt links" value={fmt['site.nav']} onChange={v => setFmt('site.nav', v)} />
      {list.map((l, k) => (
        <div key={l.to || k}>
          <Row label={`Ruta ${k + 1}`}><input value={l.to || ''} onChange={e => upd(k, { to: e.target.value })} /></Row>
          {tab === 'es'
            ? <Row label={`Label ES ${l.to}`}><input value={l.label_es || ''} onChange={e => upd(k, { label_es: e.target.value })} /></Row>
            : <Row label={`Label EN ${l.to}`}><input value={l.label_en || ''} onChange={e => upd(k, { label_en: e.target.value })} /></Row>}
        </div>
      ))}
    </div>
  )
}

function FooterForm({ o, onChange, fmt, setFmt }) {
  const [tab, setTab] = useState('es')
  const set = (k, v) => onChange({ ...o, [k]: v })
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      <FmtCtl label="Fmt pie" value={fmt['site.footer']} onChange={v => setFmt('site.footer', v)} />
      {tab === 'es'
        ? <Row label="Copy ES"><input value={o.copy_es || ''} onChange={e => set('copy_es', e.target.value)} /></Row>
        : <Row label="Copy EN"><input value={o.copy_en || ''} onChange={e => set('copy_en', e.target.value)} /></Row>}
    </div>
  )
}

export function SiteEditor({ draft, onDraft, sec }) {
  const set = (patch) => onDraft({ ...draft, ...patch })
  const fmt = draft.fmt || {}
  const setFmt = (k, v) => onDraft({ ...draft, fmt: { ...fmt, [k]: v } })
  return (
    <div className="adm-page">
      {sec === 'site' && <SiteForm o={draft.site || {}} onChange={v => set({ site: v })} fmt={fmt} setFmt={setFmt} />}
      {sec === 'nav' && <NavForm arr={draft.nav || []} onChange={v => set({ nav: v })} fmt={fmt} setFmt={setFmt} />}
      {sec === 'footer' && <FooterForm o={draft.footer || {}} onChange={v => set({ footer: v })} fmt={fmt} setFmt={setFmt} />}
    </div>
  )
}

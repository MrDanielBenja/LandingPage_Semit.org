import { useState } from 'react'
import { Row, FmtCtl, ImgPick } from './InicioEditor'
import { CONTACTO_ASSETS } from '../../core/cms/defaultContacto'
import { resolveUpload } from './adminUpload'

function LangTabs({ tab, setTab }) {
  return (
    <div className="adm-tabs">
      <button type="button" className={tab === 'es' ? 'on' : ''} onClick={() => setTab('es')}>🇪🇸 ES</button>
      <button type="button" className={tab === 'en' ? 'on' : ''} onClick={() => setTab('en')}>🇬🇧 EN</button>
    </div>
  )
}

function HeroForm({ o, onChange, fmt, setFmt }) {
  const [tab, setTab] = useState('es')
  const set = (k, v) => onChange({ ...o, [k]: v })
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      {tab === 'es' ? (<>
        <Row label="Pill ES"><input value={o.pill_es || ''} onChange={e => set('pill_es', e.target.value)} /></Row>
        <FmtCtl label="Formato pill" value={fmt['ct.hero.pill']} onChange={v => setFmt('ct.hero.pill', v)} />
        <Row label="Título A ES"><input value={o.h1a_es || ''} onChange={e => set('h1a_es', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={fmt['ct.hero.h1']} onChange={v => setFmt('ct.hero.h1', v)} />
        <Row label="Título B ES"><input value={o.h1b_es || ''} onChange={e => set('h1b_es', e.target.value)} /></Row>
        <Row label="Párrafo ES"><textarea rows={2} value={o.p_es || ''} onChange={e => set('p_es', e.target.value)} /></Row>
        <FmtCtl label="Formato párrafo" value={fmt['ct.hero.p']} onChange={v => setFmt('ct.hero.p', v)} />
      </>) : (<>
        <Row label="Pill EN"><input value={o.pill_en || ''} onChange={e => set('pill_en', e.target.value)} /></Row>
        <FmtCtl label="Formato pill" value={fmt['ct.hero.pill']} onChange={v => setFmt('ct.hero.pill', v)} />
        <Row label="Title A EN"><input value={o.h1a_en || ''} onChange={e => set('h1a_en', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={fmt['ct.hero.h1']} onChange={v => setFmt('ct.hero.h1', v)} />
        <Row label="Title B EN"><input value={o.h1b_en || ''} onChange={e => set('h1b_en', e.target.value)} /></Row>
        <Row label="Paragraph EN"><textarea rows={2} value={o.p_en || ''} onChange={e => set('p_en', e.target.value)} /></Row>
        <FmtCtl label="Formato párrafo" value={fmt['ct.hero.p']} onChange={v => setFmt('ct.hero.p', v)} />
      </>)}
      <Row label="Imagen hero"><ImgPick value={o.img} onChange={v => set('img', v)} /></Row>
      <Row label="Fondo"><input type="color" value={o.bg || '#ffffff'} onChange={e => set('bg', e.target.value)} /></Row>
    </div>
  )
}

function ListForm({ items, sel, onSel, onChange, addItem, renderCur, chipsLabel }) {
  const list = Array.isArray(items) ? items : []
  const del = () => { if (list.length > 1) { onChange(list.filter((_, k) => k !== sel)); onSel(0) } }
  return (
    <div className="adm-form">
      <div className="adm-chips">
        {list.map((x, k) => (
          <button key={x.id || k} className={k === sel ? 'on' : ''} onClick={() => onSel(k)}>
            {x.img ? <img src={resolveUpload(x.img)} alt="" loading="lazy" /> : null}
            <span>{chipsLabel(x, k)}</span>
          </button>
        ))}
      </div>
      <div className="adm-listops">
        <button className="btn btn-line" onClick={() => { onChange([...list, addItem()]); onSel(list.length) }}>+ Agregar</button>
        <button className="btn btn-line" onClick={del}>− Quitar</button>
      </div>
      {list[sel] && renderCur(list[sel], (next) => onChange(list.map((x, k) => (k === sel ? next : x))))}
    </div>
  )
}

function CanalesForm({ arr, onChange, fmt, setFmt, sel, onSel }) {
  const [tab, setTab] = useState('es')
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      <FmtCtl label="Fmt label" value={fmt['ct.canales.label']} onChange={v => setFmt('ct.canales.label', v)} />
      <FmtCtl label="Fmt desc" value={fmt['ct.canales.desc']} onChange={v => setFmt('ct.canales.desc', v)} />
      <ListForm items={arr || []} sel={sel} onSel={onSel} onChange={onChange}
        addItem={() => ({ id: `c${Date.now()}`, icon: '✨', label_es: 'Nuevo', label_en: 'New', desc_es: '', desc_en: '' })}
        chipsLabel={(x, k) => x.label_es || `Canal ${k + 1}`}
        renderCur={(cur, upd) => (<>
          <Row label="ID"><input value={cur.id || ''} onChange={e => upd({ ...cur, id: e.target.value })} /></Row>
          <Row label="Icon"><input value={cur.icon || ''} onChange={e => upd({ ...cur, icon: e.target.value })} /></Row>
          {tab === 'es' ? (<>
            <Row label="Label ES"><input value={cur.label_es || ''} onChange={e => upd({ ...cur, label_es: e.target.value })} /></Row>
            <Row label="Desc ES"><input value={cur.desc_es || ''} onChange={e => upd({ ...cur, desc_es: e.target.value })} /></Row>
          </>) : (<>
            <Row label="Label EN"><input value={cur.label_en || ''} onChange={e => upd({ ...cur, label_en: e.target.value })} /></Row>
            <Row label="Desc EN"><input value={cur.desc_en || ''} onChange={e => upd({ ...cur, desc_en: e.target.value })} /></Row>
          </>)}
        </>)}
      />
    </div>
  )
}

function AsuntosForm({ arr, onChange, fmt, setFmt, sel, onSel }) {
  const [tab, setTab] = useState('es')
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      <FmtCtl label="Fmt label" value={fmt['ct.asuntos.label']} onChange={v => setFmt('ct.asuntos.label', v)} />
      <FmtCtl label="Fmt desc" value={fmt['ct.asuntos.desc']} onChange={v => setFmt('ct.asuntos.desc', v)} />
      <ListForm items={arr || []} sel={sel} onSel={onSel} onChange={onChange}
        addItem={() => ({ id: `a${Date.now()}`, icon: '✨', label_es: 'Nuevo', label_en: 'New', desc_es: '', desc_en: '' })}
        chipsLabel={(x, k) => x.label_es || `Asunto ${k + 1}`}
        renderCur={(cur, upd) => (<>
          <Row label="ID"><input value={cur.id || ''} onChange={e => upd({ ...cur, id: e.target.value })} /></Row>
          <Row label="Icon"><input value={cur.icon || ''} onChange={e => upd({ ...cur, icon: e.target.value })} /></Row>
          {tab === 'es' ? (<>
            <Row label="Label ES"><input value={cur.label_es || ''} onChange={e => upd({ ...cur, label_es: e.target.value })} /></Row>
            <Row label="Desc ES"><input value={cur.desc_es || ''} onChange={e => upd({ ...cur, desc_es: e.target.value })} /></Row>
          </>) : (<>
            <Row label="Label EN"><input value={cur.label_en || ''} onChange={e => upd({ ...cur, label_en: e.target.value })} /></Row>
            <Row label="Desc EN"><input value={cur.desc_en || ''} onChange={e => upd({ ...cur, desc_en: e.target.value })} /></Row>
          </>)}
        </>)}
      />
    </div>
  )
}

function FaqsForm({ arr, onChange, fmt, setFmt, sel, onSel }) {
  const [tab, setTab] = useState('es')
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      <FmtCtl label="Fmt pregunta" value={fmt['ct.faq.q']} onChange={v => setFmt('ct.faq.q', v)} />
      <FmtCtl label="Fmt respuesta" value={fmt['ct.faq.a']} onChange={v => setFmt('ct.faq.a', v)} />
      <ListForm items={arr || []} sel={sel} onSel={onSel} onChange={onChange}
        addItem={() => ({ q_es: 'Nueva pregunta', a_es: '', q_en: 'New question', a_en: '' })}
        chipsLabel={(x, k) => (x.q_es || '').slice(0, 28) || `FAQ ${k + 1}`}
        renderCur={(cur, upd) => (<>
          {tab === 'es' ? (<>
            <Row label="Pregunta ES"><input value={cur.q_es || ''} onChange={e => upd({ ...cur, q_es: e.target.value })} /></Row>
            <Row label="Respuesta ES"><textarea rows={2} value={cur.a_es || ''} onChange={e => upd({ ...cur, a_es: e.target.value })} /></Row>
          </>) : (<>
            <Row label="Question EN"><input value={cur.q_en || ''} onChange={e => upd({ ...cur, q_en: e.target.value })} /></Row>
            <Row label="Answer EN"><textarea rows={2} value={cur.a_en || ''} onChange={e => upd({ ...cur, a_en: e.target.value })} /></Row>
          </>)}
        </>)}
      />
    </div>
  )
}

function HorarioForm({ arr, onChange, fmt, setFmt, sel, onSel }) {
  const [tab, setTab] = useState('es')
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      <FmtCtl label="Fmt día" value={fmt['ct.horario.d']} onChange={v => setFmt('ct.horario.d', v)} />
      <FmtCtl label="Fmt hora" value={fmt['ct.horario.h']} onChange={v => setFmt('ct.horario.h', v)} />
      <ListForm items={arr || []} sel={sel} onSel={onSel} onChange={onChange}
        addItem={() => ({ d_es: 'Lun–Vie', h: '9:00 — 17:00', d_en: 'Mon–Fri' })}
        chipsLabel={(x, k) => x.d_es || `Horario ${k + 1}`}
        renderCur={(cur, upd) => (<>
          {tab === 'es'
            ? <Row label="Día ES"><input value={cur.d_es || ''} onChange={e => upd({ ...cur, d_es: e.target.value })} /></Row>
            : <Row label="Day EN"><input value={cur.d_en || ''} onChange={e => upd({ ...cur, d_en: e.target.value })} /></Row>}
          <Row label="Hora"><input value={cur.h || ''} onChange={e => upd({ ...cur, h: e.target.value })} /></Row>
        </>)}
      />
    </div>
  )
}

function SedeForm({ o, onChange, fmt, setFmt }) {
  const [tab, setTab] = useState('es')
  const set = (k, v) => onChange({ ...o, [k]: v })
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      {tab === 'es' ? (<>
        <Row label="Badge ES"><input value={o.badge_es || ''} onChange={e => set('badge_es', e.target.value)} /></Row>
        <FmtCtl label="Fmt badge" value={fmt['ct.sede.badge']} onChange={v => setFmt('ct.sede.badge', v)} />
        <Row label="Título"><input value={o.t || ''} onChange={e => set('t', e.target.value)} /></Row>
        <FmtCtl label="Fmt título" value={fmt['ct.sede.t']} onChange={v => setFmt('ct.sede.t', v)} />
        <Row label="Sub ES"><textarea rows={2} value={o.s_es || ''} onChange={e => set('s_es', e.target.value)} /></Row>
        <FmtCtl label="Fmt texto" value={fmt['ct.sede.s']} onChange={v => setFmt('ct.sede.s', v)} />
        <Row label="Línea1 ES"><input value={o.l1_es || ''} onChange={e => set('l1_es', e.target.value)} /></Row>
        <Row label="Línea2 ES"><input value={o.l2_es || ''} onChange={e => set('l2_es', e.target.value)} /></Row>
      </>) : (<>
        <Row label="Badge EN"><input value={o.badge_en || ''} onChange={e => set('badge_en', e.target.value)} /></Row>
        <FmtCtl label="Fmt badge" value={fmt['ct.sede.badge']} onChange={v => setFmt('ct.sede.badge', v)} />
        <Row label="Título"><input value={o.t || ''} onChange={e => set('t', e.target.value)} /></Row>
        <FmtCtl label="Fmt título" value={fmt['ct.sede.t']} onChange={v => setFmt('ct.sede.t', v)} />
        <Row label="Sub EN"><textarea rows={2} value={o.s_en || ''} onChange={e => set('s_en', e.target.value)} /></Row>
        <FmtCtl label="Fmt texto" value={fmt['ct.sede.s']} onChange={v => setFmt('ct.sede.s', v)} />
        <Row label="Line1 EN"><input value={o.l1_en || ''} onChange={e => set('l1_en', e.target.value)} /></Row>
        <Row label="Line2 EN"><input value={o.l2_en || ''} onChange={e => set('l2_en', e.target.value)} /></Row>
      </>)}
      <Row label="Imagen sede"><ImgPick value={o.img} onChange={v => set('img', v)} /></Row>
      <div className="adm-note">Assets: {CONTACTO_ASSETS.slice(0, 3).join(' · ')} · Videos: súbelos donde la casilla lo indique (MP4/WebM/OGG ≤500MB)</div>
    </div>
  )
}

const FORM_KEYS = ['s0t', 's0s', 'nom', 'nomPh', 'cor', 'corPh', 'cont', 's1t', 's1s', 'back', 's2t', 'cambiar', 'msg', 'msgPh', 'prev', 'prevEmpty', 'send', 'hola', 'sinCorreo', 'msgTpl', 'okT', 'okP', 'reopen', 'another']

function FormForm({ o, onChange, fmt, setFmt }) {
  const [tab, setTab] = useState('es')
  const set = (k, v) => onChange({ ...o, [k]: v })
  const steps = tab === 'es' ? (Array.isArray(o.steps_es) ? o.steps_es : []) : (Array.isArray(o.steps_en) ? o.steps_en : [])
  const setSteps = (next) => set(tab === 'es' ? 'steps_es' : 'steps_en', next)
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      <FmtCtl label="Fmt título form" value={fmt['ct.form.t']} onChange={v => setFmt('ct.form.t', v)} />
      <FmtCtl label="Fmt texto form" value={fmt['ct.form.sub']} onChange={v => setFmt('ct.form.sub', v)} />
      <FmtCtl label="Fmt labels" value={fmt['ct.form.label']} onChange={v => setFmt('ct.form.label', v)} />
      {(steps || []).map((s, k) => (
        <Row key={k} label={`Step ${k + 1} ${tab.toUpperCase()}`}><input value={s} onChange={e => setSteps(steps.map((x, j) => (j === k ? e.target.value : x)))} /></Row>
      ))}
      {FORM_KEYS.map(k => tab === 'es'
        ? <Row key={k} label={`${k} ES`}><input value={o[`${k}_es`] || ''} onChange={e => set(`${k}_es`, e.target.value)} /></Row>
        : <Row key={k} label={`${k} EN`}><input value={o[`${k}_en`] || ''} onChange={e => set(`${k}_en`, e.target.value)} /></Row>)}
    </div>
  )
}

export function ContactoEditor({ draft, onDraft, sec, sel, onSel }) {
  const set = (patch) => onDraft({ ...draft, ...patch })
  const fmt = draft.fmt || {}
  const setFmt = (k, v) => onDraft({ ...draft, fmt: { ...fmt, [k]: v } })
  return (
    <div className="adm-page">
      {sec === 'hero' && <HeroForm o={draft.hero || {}} onChange={v => set({ hero: v })} fmt={fmt} setFmt={setFmt} />}
      {sec === 'canales' && <CanalesForm arr={draft.canales || []} onChange={v => set({ canales: v })} fmt={fmt} setFmt={setFmt} sel={sel} onSel={onSel} />}
      {sec === 'asuntos' && <AsuntosForm arr={draft.asuntos || []} onChange={v => set({ asuntos: v })} fmt={fmt} setFmt={setFmt} sel={sel} onSel={onSel} />}
      {sec === 'faqs' && <FaqsForm arr={draft.faqs || []} onChange={v => set({ faqs: v })} fmt={fmt} setFmt={setFmt} sel={sel} onSel={onSel} />}
      {sec === 'horario' && <HorarioForm arr={draft.horario || []} onChange={v => set({ horario: v })} fmt={fmt} setFmt={setFmt} sel={sel} onSel={onSel} />}
      {sec === 'sede' && <SedeForm o={draft.sede || {}} onChange={v => set({ sede: v })} fmt={fmt} setFmt={setFmt} />}
      {sec === 'form' && <FormForm o={draft.form || {}} onChange={v => set({ form: v })} fmt={fmt} setFmt={setFmt} />}
    </div>
  )
}

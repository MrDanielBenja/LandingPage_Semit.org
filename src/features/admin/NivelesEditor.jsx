import { useState } from 'react'
import { arrOf } from '../../core/cms/safe'
import { Row, FmtCtl, ImgPick, IconsForm } from './InicioEditor'
import { imgEditScaleOnly } from '../../core/cms/imgEdit'
import { NIVELES_ASSETS } from '../../core/cms/defaultNiveles'
import { resolveUpload } from './adminUpload'

function LangTabs({ tab, setTab }) {
  return (
    <div className="adm-tabs">
      <button type="button" className={tab === 'es' ? 'on' : ''} onClick={() => setTab('es')}>🇪🇸 ES</button>
      <button type="button" className={tab === 'en' ? 'on' : ''} onClick={() => setTab('en')}>🇬🇧 EN</button>
    </div>
  )
}

function HeroForm({ draft, onDraft, fmt, setFmt }) {
  const [tab, setTab] = useState('es')
  const h = draft.hero || {}
  const it = draft.intro || {}
  const setH = (k, v) => onDraft({ ...draft, hero: { ...h, [k]: v } })
  const setI = (k, v) => onDraft({ ...draft, intro: { ...it, [k]: v } })
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      {tab === 'es' ? (<>
        <Row label="Pill ES"><input value={h.pill_es || ''} onChange={e => setH('pill_es', e.target.value)} /></Row>
        <FmtCtl label="Formato pill" value={fmt['niv.hero.pill']} onChange={v => setFmt('niv.hero.pill', v)} />
        <Row label="Título A ES"><input value={h.h1a_es || ''} onChange={e => setH('h1a_es', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={fmt['niv.hero.h1']} onChange={v => setFmt('niv.hero.h1', v)} />
        <Row label="Título B ES"><input value={h.h1b_es || ''} onChange={e => setH('h1b_es', e.target.value)} /></Row>
        <Row label="Intro sub ES"><input value={it.sub_es || ''} onChange={e => setI('sub_es', e.target.value)} /></Row>
        <FmtCtl label="Formato intro sub" value={fmt['niv.intro.sub']} onChange={v => setFmt('niv.intro.sub', v)} />
        <Row label="Intro texto 1 ES"><textarea rows={3} value={it.txt1_es || ''} onChange={e => setI('txt1_es', e.target.value)} /></Row>
        <FmtCtl label="Formato intro texto" value={fmt['niv.intro.txt']} onChange={v => setFmt('niv.intro.txt', v)} />
        <Row label="Intro texto 2 ES"><textarea rows={2} value={it.txt2_es || ''} onChange={e => setI('txt2_es', e.target.value)} /></Row>
      </>) : (<>
        <Row label="Pill EN"><input value={h.pill_en || ''} onChange={e => setH('pill_en', e.target.value)} /></Row>
        <FmtCtl label="Formato pill" value={fmt['niv.hero.pill']} onChange={v => setFmt('niv.hero.pill', v)} />
        <Row label="Title A EN"><input value={h.h1a_en || ''} onChange={e => setH('h1a_en', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={fmt['niv.hero.h1']} onChange={v => setFmt('niv.hero.h1', v)} />
        <Row label="Title B EN"><input value={h.h1b_en || ''} onChange={e => setH('h1b_en', e.target.value)} /></Row>
        <Row label="Intro sub EN"><input value={it.sub_en || ''} onChange={e => setI('sub_en', e.target.value)} /></Row>
        <FmtCtl label="Formato intro sub" value={fmt['niv.intro.sub']} onChange={v => setFmt('niv.intro.sub', v)} />
        <Row label="Intro text 1 EN"><textarea rows={3} value={it.txt1_en || ''} onChange={e => setI('txt1_en', e.target.value)} /></Row>
        <FmtCtl label="Formato intro texto" value={fmt['niv.intro.txt']} onChange={v => setFmt('niv.intro.txt', v)} />
        <Row label="Intro text 2 EN"><textarea rows={2} value={it.txt2_en || ''} onChange={e => setI('txt2_en', e.target.value)} /></Row>
      </>)}
      <Row label="Imagen hero"><ImgPick value={h.img} onChange={v => setH('img', v)} {...imgEditScaleOnly(h, (p) => onDraft({ ...draft, hero: { ...h, ...p } }), 'Niveles hero - Edición de Imagen')} /></Row>
      <Row label="Fondo hero"><input type="color" value={h.bg || '#ffffff'} onChange={e => setH('bg', e.target.value)} /></Row>
      <Row label="Fondo intro"><input type="color" value={it.bg || '#ffffff'} onChange={e => setI('bg', e.target.value)} /></Row>
    </div>
  )
}

function CatItemForm({ cur, upd, fmt, setFmt, fmtT, fmtD, labelKey }) {
  const [tab, setTab] = useState('es')
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      <Row label="ID (fijo)"><input value={cur.id || ''} disabled /></Row>
      <Row label="Emoji"><input value={cur.e || ''} onChange={e => upd({ e: e.target.value })} /></Row>
      {tab === 'es' ? (<>
        <Row label={`${labelKey} ES`}><input value={cur.label_es ?? cur.t_es ?? ''} onChange={e => upd(labelKey === 'Título' ? { t_es: e.target.value } : { label_es: e.target.value })} /></Row>
        <FmtCtl label="Formato título" value={fmt[fmtT]} onChange={v => setFmt(fmtT, v)} />
        {cur.d_es !== undefined && (<>
          <Row label="Desc ES"><textarea rows={2} value={cur.d_es || ''} onChange={e => upd({ d_es: e.target.value })} /></Row>
          <FmtCtl label="Formato desc" value={fmt[fmtD]} onChange={v => setFmt(fmtD, v)} />
        </>)}
        <Row label="Intro título ES"><input value={cur.intro_t_es ?? ''} placeholder="(vacío = diccionario)" onChange={e => upd({ intro_t_es: e.target.value })} /></Row>
        <Row label="Intro texto ES"><textarea rows={3} value={cur.intro_d_es ?? ''} placeholder="(vacío = diccionario)" onChange={e => upd({ intro_d_es: e.target.value })} /></Row>
        <FmtCtl label="Fmt intro título" value={fmt['niv.subIntro.t']} onChange={v => setFmt('niv.subIntro.t', v)} />
        <FmtCtl label="Fmt intro texto" value={fmt['niv.subIntro.d']} onChange={v => setFmt('niv.subIntro.d', v)} />
      </>) : (<>
        <Row label={`${labelKey} EN`}><input value={cur.label_en ?? cur.t_en ?? ''} onChange={e => upd(labelKey === 'Título' ? { t_en: e.target.value } : { label_en: e.target.value })} /></Row>
        <FmtCtl label="Formato título" value={fmt[fmtT]} onChange={v => setFmt(fmtT, v)} />
        {cur.d_en !== undefined && (<>
          <Row label="Desc EN"><textarea rows={2} value={cur.d_en || ''} onChange={e => upd({ d_en: e.target.value })} /></Row>
          <FmtCtl label="Formato desc" value={fmt[fmtD]} onChange={v => setFmt(fmtD, v)} />
        </>)}
        <Row label="Intro title EN"><input value={cur.intro_t_en ?? ''} placeholder="(empty = dictionary)" onChange={e => upd({ intro_t_en: e.target.value })} /></Row>
        <Row label="Intro text EN"><textarea rows={3} value={cur.intro_d_en ?? ''} placeholder="(empty = dictionary)" onChange={e => upd({ intro_d_en: e.target.value })} /></Row>
        <FmtCtl label="Fmt intro título" value={fmt['niv.subIntro.t']} onChange={v => setFmt('niv.subIntro.t', v)} />
        <FmtCtl label="Fmt intro texto" value={fmt['niv.subIntro.d']} onChange={v => setFmt('niv.subIntro.d', v)} />
      </>)}
      <Row label="Imagen"><ImgPick value={cur.img} onChange={v => upd({ img: v })} {...imgEditScaleOnly(cur, (p) => upd({ ...p }), 'Niveles - Edición de Imagen')} /></Row>
    </div>
  )
}

function RamasForm({ draft, onDraft, fmt, setFmt, sel, onSel }) {
  const items = arrOf(draft.ramas)
  const cur = items[sel]
  const upd = (patch) => onDraft({ ...draft, ramas: items.map((x, k) => (k === sel ? { ...x, ...patch } : x)) })
  return (<>
    <div className="adm-chips">
      {items.map((x, k) => (
        <button key={x.id || k} className={k === sel ? 'on' : ''} onClick={() => onSel(k)}>
          <img src={resolveUpload(x.img)} alt="" loading="lazy" />
          <span>{x.label_es || x.id}</span>
        </button>
      ))}
    </div>
    {cur && <CatItemForm cur={cur} upd={upd} fmt={fmt} setFmt={setFmt} fmtT="niv.ramas.label" fmtD="niv.ramas.d" labelKey="Nombre" />}
  </>)
}

function SubsForm({ draft, onDraft, fmt, setFmt, sel, onSel }) {
  const [group, setGroup] = useState('pre')
  const subs = (draft.subs && typeof draft.subs === 'object') ? draft.subs : { pre: [], post: [] }
  const items = arrOf(subs[group])
  const cur = items[sel]
  const upd = (patch) => onDraft({ ...draft, subs: { ...subs, [group]: items.map((x, k) => (k === sel ? { ...x, ...patch } : x)) } })
  return (<>
    <div className="adm-tabs">
      <button type="button" className={group === 'pre' ? 'on' : ''} onClick={() => { setGroup('pre'); onSel(0) }}>🎓 Pregrado</button>
      <button type="button" className={group === 'post' ? 'on' : ''} onClick={() => { setGroup('post'); onSel(0) }}>🏛️ Postgrado</button>
    </div>
    <div className="adm-chips">
      {items.map((x, k) => (
        <button key={x.id || k} className={k === sel ? 'on' : ''} onClick={() => onSel(k)}>
          <img src={resolveUpload(x.img)} alt="" loading="lazy" />
          <span>{x.label_es || x.id}</span>
        </button>
      ))}
    </div>
    {cur && <CatItemForm cur={cur} upd={upd} fmt={fmt} setFmt={setFmt} fmtT="niv.subs.label" fmtD="niv.subs.d" labelKey="Nombre" />}
  </>)
}

function MaestriasForm({ draft, onDraft, fmt, setFmt, sel, onSel }) {
  const items = arrOf(draft.maestrias)
  const cur = items[sel]
  const upd = (patch) => onDraft({ ...draft, maestrias: items.map((x, k) => (k === sel ? { ...x, ...patch } : x)) })
  return (<>
    <div className="adm-chips">
      {items.map((x, k) => (
        <button key={x.id || k} className={k === sel ? 'on' : ''} onClick={() => onSel(k)}>
          <img src={resolveUpload(x.img)} alt="" loading="lazy" />
          <span>{x.label_es || x.id}</span>
        </button>
      ))}
    </div>
    {cur && <CatItemForm cur={cur} upd={upd} fmt={fmt} setFmt={setFmt} fmtT="niv.maestrias.label" fmtD="niv.maestrias.d" labelKey="Nombre" />}
  </>)
}

function RutaForm({ draft, onDraft, fmt, setFmt, sel, onSel }) {
  const items = arrOf(draft.ruta)
  const cur = items[sel]
  const upd = (patch) => onDraft({ ...draft, ruta: items.map((x, k) => (k === sel ? { ...x, ...patch } : x)) })
  return (<>
    <div className="adm-chips">
      {items.map((x, k) => (
        <button key={x.id || k} className={k === sel ? 'on' : ''} onClick={() => onSel(k)}>
          <img src={resolveUpload(x.img)} alt="" loading="lazy" />
          <span>{x.t_es || x.id}</span>
        </button>
      ))}
    </div>
    {cur && <CatItemForm cur={cur} upd={upd} fmt={fmt} setFmt={setFmt} fmtT="niv.ruta.t" fmtD="niv.ruta.t" labelKey="Título" />}
  </>)
}

const AREAS = ['Biblia', 'Teología', 'Ministerio']
const MODS = ['Virtual', 'Híbrido', 'Presencial']
const SUBS_PRE = ['certificado', 'diplomado', 'bachillerato']
const SUBS_POST = ['licenciatura', 'maestria']
const MAE_OPTS = ['', 'artes', 'divinidades']

function ProgramasForm({ draft, onDraft, fmt, setFmt, sel, onSel }) {
  const [tab, setTab] = useState('es')
  const items = arrOf(draft.programas)
  const cur = items[sel]
  const SUBS_OF = (rama) => (rama === 'post' ? SUBS_POST : SUBS_PRE)
  const fixSub = (rama, sub) => (SUBS_OF(rama).includes(sub) ? sub : SUBS_OF(rama)[0])
  const fixMae = (sub, mae) => (sub === 'maestria' ? (mae || 'artes') : null)
  const upd = (patch) => {
    const base = { ...cur, ...patch }
    if (patch.rama !== undefined) base.sub = fixSub(patch.rama, base.sub)
    if (patch.sub !== undefined) base.mae = fixMae(patch.sub, base.mae)
    if (patch.mae !== undefined && base.sub !== 'maestria') base.mae = null
    if (patch.d_es !== undefined) base.d = patch.d_es
    if (patch.dur_es !== undefined) base.dur = patch.dur_es
    if (patch.tag_es !== undefined) base.tag = patch.tag_es
    if (patch.incluye_es !== undefined) base.incluye = patch.incluye_es
    onDraft({ ...draft, programas: items.map((x, k) => (k === sel ? base : x)) })
  }
  const add = () => {
    onDraft({ ...draft, programas: [...items, { n: 'Nuevo programa', a: 'Biblia', d_es: '', d_en: '', d: '', p: 100, mod: 'Virtual', dur_es: '6 meses', dur_en: '6 months', dur: '6 meses', tag_es: '', tag_en: '', tag: '', incluye_es: [], incluye_en: [], incluye: [], rama: 'pre', sub: 'certificado', mae: null, semanas: 24, lecciones: 30, rating: 5, est: 0, img: NIVELES_ASSETS[0] }] })
    onSel(items.length)
  }
  const del = () => { if (items.length > 1) { onDraft({ ...draft, programas: items.filter((_, k) => k !== sel) }); onSel(0) } }
  const SUBS_L = SUBS_OF(cur?.rama)
  const subLabel = (id) => ({ certificado: '📜 Certificado Especializado', diplomado: '📚 Diplomado', bachillerato: '🎓 Bachillerato', licenciatura: '⚖️ Licenciatura', maestria: '👑 Maestría' }[id] || id)
  const maeLabel = (id) => ({ artes: '🎨 Artes', divinidades: '✝️ Divinidades' }[id] || id)
  return (<>
    <div className="adm-chips">
      {items.map((x, k) => (
        <button key={k} className={k === sel ? 'on' : ''} onClick={() => onSel(k)}>
          <img src={resolveUpload(x.img)} alt="" loading="lazy" />
          <span>{x.n || `Programa ${k + 1}`}</span>
        </button>
      ))}
    </div>
    <div className="adm-listops">
      <button className="btn btn-line" onClick={add}>+ Agregar</button>
      <button className="btn btn-line" onClick={del}>− Quitar</button>
    </div>
    {cur && (
      <div className="adm-form">
        <LangTabs tab={tab} setTab={setTab} />
        <Row label="Nombre"><input value={cur.n || ''} onChange={e => upd({ n: e.target.value })} /></Row>
        <FmtCtl label="Formato nombre" value={fmt['niv.programas.n']} onChange={v => setFmt('niv.programas.n', v)} />
        {tab === 'es' ? (<>
          <Row label="Desc ES"><textarea rows={2} value={cur.d_es ?? cur.d ?? ''} onChange={e => upd({ d_es: e.target.value })} /></Row>
          <FmtCtl label="Formato desc" value={fmt['niv.programas.d']} onChange={v => setFmt('niv.programas.d', v)} />
          <Row label="Tag ES"><input value={cur.tag_es ?? cur.tag ?? ''} onChange={e => upd({ tag_es: e.target.value })} /></Row>
          <Row label="Incluye ES (1 por línea)"><textarea rows={4} value={arrOf(cur.incluye_es ?? cur.incluye).join('\n')} onChange={e => upd({ incluye_es: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })} /></Row>
        </>) : (<>
          <Row label="Desc EN"><textarea rows={2} value={cur.d_en ?? cur.d ?? ''} onChange={e => upd({ d_en: e.target.value })} /></Row>
          <FmtCtl label="Formato desc" value={fmt['niv.programas.d']} onChange={v => setFmt('niv.programas.d', v)} />
          <Row label="Tag EN"><input value={cur.tag_en ?? cur.tag ?? ''} onChange={e => upd({ tag_en: e.target.value })} /></Row>
          <Row label="Includes EN (1 per line)"><textarea rows={4} value={arrOf(cur.incluye_en ?? cur.incluye).join('\n')} onChange={e => upd({ incluye_en: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })} /></Row>
        </>)}
        <div className="adm-grid2">
          <Row label="Área"><select value={cur.a} onChange={e => upd({ a: e.target.value })}>{AREAS.map(a => <option key={a} value={a}>{a}</option>)}</select></Row>
          <Row label="Precio $"><input type="number" min="0" value={cur.p} onChange={e => upd({ p: Number(e.target.value) })} /></Row>
        </div>
        <div className="adm-grid3">
          <Row label="Modalidad"><select value={cur.mod} onChange={e => upd({ mod: e.target.value })}>{MODS.map(m => <option key={m} value={m}>{m}</option>)}</select></Row>
          <Row label="Duración ES"><input value={cur.dur_es ?? cur.dur ?? ''} onChange={e => upd({ dur_es: e.target.value })} /></Row>
          <Row label="Duration EN"><input value={cur.dur_en ?? cur.dur ?? ''} onChange={e => upd({ dur_en: e.target.value })} /></Row>
        </div>
        <div className="adm-grid3">
          <Row label="Rama"><select value={cur.rama} onChange={e => upd({ rama: e.target.value })}><option value="pre">🎓 Pregrado</option><option value="post">🏛️ Postgrado</option></select></Row>
          <Row label="Sub"><select value={cur.sub} onChange={e => upd({ sub: e.target.value })}>{SUBS_L.map(s => <option key={s} value={s}>{subLabel(s)}</option>)}</select></Row>
          <Row label="Maestría">{cur.sub === 'maestria'
            ? <select value={cur.mae || 'artes'} onChange={e => upd({ mae: e.target.value })}>{['artes', 'divinidades'].map(m => <option key={m} value={m}>{maeLabel(m)}</option>)}</select>
            : <input value="— (solo maestría)" disabled />}</Row>
        </div>
        <div className="adm-note">Pregrado → certificado, diplomado, bachillerato · Postgrado → licenciatura, maestría · Solo maestría pide Artes/Divinidades.</div>
        <div className="adm-grid3">
          <Row label="Semanas"><input type="number" min="1" value={cur.semanas} onChange={e => upd({ semanas: Number(e.target.value) })} /></Row>
          <Row label="Lecciones"><input type="number" min="1" value={cur.lecciones} onChange={e => upd({ lecciones: Number(e.target.value) })} /></Row>
          <Row label="Estudiantes"><input type="number" min="0" value={cur.est} onChange={e => upd({ est: Number(e.target.value) })} /></Row>
        </div>
        <Row label="Rating"><input type="number" min="0" max="5" step="0.1" value={cur.rating} onChange={e => upd({ rating: Number(e.target.value) })} /></Row>
        <Row label="Imagen"><ImgPick value={cur.img} onChange={v => upd({ img: v })} {...imgEditScaleOnly(cur, (p) => upd({ ...p }), 'Programa - Edición de Imagen')} /></Row>
      </div>
    )}
  </>)
}

export function NivelesEditor({ draft, onDraft, sec, sel, onSel }) {
  const fmt = draft.fmt || {}
  const setFmt = (k, v) => onDraft({ ...draft, fmt: { ...fmt, [k]: v } })
  return (
    <div className="adm-page">
      {(sec === 'hero' || sec === 'intro') && <HeroForm draft={draft} onDraft={onDraft} fmt={fmt} setFmt={setFmt} />}
      {sec === 'ramas' && <RamasForm draft={draft} onDraft={onDraft} fmt={fmt} setFmt={setFmt} sel={sel} onSel={onSel} />}
      {sec === 'subs' && <SubsForm draft={draft} onDraft={onDraft} fmt={fmt} setFmt={setFmt} sel={sel} onSel={onSel} />}
      {sec === 'maestrias' && <MaestriasForm draft={draft} onDraft={onDraft} fmt={fmt} setFmt={setFmt} sel={sel} onSel={onSel} />}
      {sec === 'ruta' && <RutaForm draft={draft} onDraft={onDraft} fmt={fmt} setFmt={setFmt} sel={sel} onSel={onSel} />}
      {sec === 'programas' && <ProgramasForm draft={draft} onDraft={onDraft} fmt={fmt} setFmt={setFmt} sel={sel} onSel={onSel} />}
      {sec === 'icons' && <IconsForm page="niveles" value={draft.icons || {}} onChange={v => onDraft({ ...draft, icons: v })} />}
    </div>
  )
}

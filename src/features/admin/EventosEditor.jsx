import { useState } from 'react'
import { Row, FmtCtl, ImgPick } from './InicioEditor'
import { EVENTOS_ASSETS } from '../../core/cms/defaultEventos'
import { resolveUpload } from './adminUpload'

const EV_CAT_OPTS = ['Viajes Misioneros', 'Conferencias', 'Capacitaciones', 'Campamentos']
const EV_MOD_OPTS = ['Presencial', 'Híbrido', 'Virtual']

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
  const S = ['s1', 's2', 's3', 's4']
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      {tab === 'es' ? (<>
        <Row label="Pill ES"><input value={o.pill_es || ''} onChange={e => set('pill_es', e.target.value)} /></Row>
        <FmtCtl label="Formato pill" value={fmt['ev.hero.pill']} onChange={v => setFmt('ev.hero.pill', v)} />
        <Row label="Título A ES"><input value={o.h1a_es || ''} onChange={e => set('h1a_es', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={fmt['ev.hero.h1']} onChange={v => setFmt('ev.hero.h1', v)} />
        <Row label="Título B ES"><input value={o.h1b_es || ''} onChange={e => set('h1b_es', e.target.value)} /></Row>
        <Row label="Párrafo ES"><textarea rows={2} value={o.p_es || ''} onChange={e => set('p_es', e.target.value)} /></Row>
        <FmtCtl label="Formato párrafo" value={fmt['ev.hero.p']} onChange={v => setFmt('ev.hero.p', v)} />
        {S.map(k => <Row key={k} label={`Stat ${k} ES`}><input value={o[`${k}_es`] || ''} onChange={e => set(`${k}_es`, e.target.value)} /></Row>)}
      </>) : (<>
        <Row label="Pill EN"><input value={o.pill_en || ''} onChange={e => set('pill_en', e.target.value)} /></Row>
        <FmtCtl label="Formato pill" value={fmt['ev.hero.pill']} onChange={v => setFmt('ev.hero.pill', v)} />
        <Row label="Title A EN"><input value={o.h1a_en || ''} onChange={e => set('h1a_en', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={fmt['ev.hero.h1']} onChange={v => setFmt('ev.hero.h1', v)} />
        <Row label="Title B EN"><input value={o.h1b_en || ''} onChange={e => set('h1b_en', e.target.value)} /></Row>
        <Row label="Paragraph EN"><textarea rows={2} value={o.p_en || ''} onChange={e => set('p_en', e.target.value)} /></Row>
        <FmtCtl label="Formato párrafo" value={fmt['ev.hero.p']} onChange={v => setFmt('ev.hero.p', v)} />
        {S.map(k => <Row key={k} label={`Stat ${k} EN`}><input value={o[`${k}_en`] || ''} onChange={e => set(`${k}_en`, e.target.value)} /></Row>)}
      </>)}
      <Row label="Imagen hero"><ImgPick value={o.img} onChange={v => set('img', v)} /></Row>
      <Row label="Fondo"><input type="color" value={o.bg || '#ffffff'} onChange={e => set('bg', e.target.value)} /></Row>
    </div>
  )
}

const SEC_DEFS = [['sec1', 'Sección 01'], ['sec2', 'Sección 02'], ['sec3', 'Sección 03']]

function SecsForm({ draft, onDraft, fmt, setFmt }) {
  const [tab, setTab] = useState('es')
  const set = (id, k, v) => onDraft({ ...draft, [id]: { ...(draft[id] || {}), [k]: v } })
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      {SEC_DEFS.map(([id, label]) => {
        const o = draft[id] || {}
        return (
          <div key={id}>
            <div className="adm-note">{label}</div>
            <Row label="N°"><input value={o.n || ''} onChange={e => set(id, 'n', e.target.value)} /></Row>
            {tab === 'es' ? (<>
              <Row label="Pill ES"><input value={o.pill_es || ''} onChange={e => set(id, 'pill_es', e.target.value)} /></Row>
              <Row label="Título ES"><input value={o.title_es || ''} onChange={e => set(id, 'title_es', e.target.value)} /></Row>
              <Row label="Sub ES"><input value={o.sub_es || ''} onChange={e => set(id, 'sub_es', e.target.value)} /></Row>
            </>) : (<>
              <Row label="Pill EN"><input value={o.pill_en || ''} onChange={e => set(id, 'pill_en', e.target.value)} /></Row>
              <Row label="Title EN"><input value={o.title_en || ''} onChange={e => set(id, 'title_en', e.target.value)} /></Row>
              <Row label="Sub EN"><input value={o.sub_en || ''} onChange={e => set(id, 'sub_en', e.target.value)} /></Row>
            </>)}
          </div>
        )
      })}
      <FmtCtl label="Formato títulos sec" value={fmt['ev.sec.title']} onChange={v => setFmt('ev.sec.title', v)} />
      <FmtCtl label="Formato textos sec" value={fmt['ev.sec.sub']} onChange={v => setFmt('ev.sec.sub', v)} />
    </div>
  )
}

function CatsForm({ items, onChange, sel, onSel }) {
  const [tab, setTab] = useState('es')
  const list = Array.isArray(items) ? items : []
  const cur = list[sel] || {}
  const upd = (next) => onChange(list.map((x, k) => (k === sel ? next : x)))
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      <div className="adm-chips">
        {list.map((x, k) => (
          <button key={x.id || k} type="button" className={k === sel ? 'on' : ''} onClick={() => onSel(k)}>
            <img src={resolveUpload(x.img)} alt="" loading="lazy" />
            <span>{x.id}</span>
          </button>
        ))}
      </div>
      {cur && (<>
        <div className="adm-note">ID: <b>{cur.id}</b> (fijo · coincide con eventos)</div>
        <Row label="Emoji"><input value={cur.e || ''} onChange={e => upd({ ...cur, e: e.target.value })} /></Row>
        {tab === 'es'
          ? <Row label="Desc ES"><input value={cur.d_es || ''} onChange={e => upd({ ...cur, d_es: e.target.value })} /></Row>
          : <Row label="Desc EN"><input value={cur.d_en || ''} onChange={e => upd({ ...cur, d_en: e.target.value })} /></Row>}
        <Row label="Foto"><ImgPick value={cur.img} onChange={v => upd({ ...cur, img: v })} /></Row>
      </>)}
    </div>
  )
}

const NEW_EV = () => ({
  n: 'Nuevo evento', cat: 'Capacitaciones', d_es: '', d_en: '',
  fecha: '2027-06-01', hora: '09:00', lugar: 'SEMIT Cusco', mod: 'Presencial',
  p: 0, cupos: 50, inscritos: 0, rating: 5.0,
  tag: 'Nuevo', img: EVENTOS_ASSETS[0], programa_es: [''], programa_en: [''],
})

function EventosForm({ items, onChange, sel, onSel }) {
  const [tab, setTab] = useState('es')
  const list = Array.isArray(items) ? items : []
  const cur = list[sel] || {}
  const upd = (next) => onChange(list.map((x, k) => (k === sel ? next : x)))
  const add = () => { onChange([...list, NEW_EV()]); onSel(list.length) }
  const del = () => { if (list.length > 1) { onChange(list.filter((_, k) => k !== sel)); onSel(0) } }
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      <div className="adm-chips">
        {list.map((x, k) => (
          <button key={k} type="button" className={k === sel ? 'on' : ''} onClick={() => onSel(k)}>
            <img src={resolveUpload(x.img)} alt="" loading="lazy" />
            <span>{(x.n || '').slice(0, 30) || `Evento ${k + 1}`}</span>
          </button>
        ))}
      </div>
      <div className="adm-listops">
        <button type="button" className="btn btn-line" onClick={add}>+ Agregar</button>
        <button type="button" className="btn btn-line" onClick={del}>− Quitar</button>
      </div>
      {cur && (<>
        <Row label="Nombre"><input value={cur.n || ''} onChange={e => upd({ ...cur, n: e.target.value })} /></Row>
        <div className="adm-grid2">
          <Row label="Categoría"><select value={cur.cat} onChange={e => upd({ ...cur, cat: e.target.value })}>{EV_CAT_OPTS.map(c => <option key={c} value={c}>{c}</option>)}</select></Row>
          <Row label="Modalidad"><select value={cur.mod} onChange={e => upd({ ...cur, mod: e.target.value })}>{EV_MOD_OPTS.map(m => <option key={m} value={m}>{m}</option>)}</select></Row>
        </div>
        {tab === 'es' ? (<>
          <Row label="Desc ES"><textarea rows={2} value={cur.d_es || ''} onChange={e => upd({ ...cur, d_es: e.target.value })} /></Row>
          <Row label="Programa ES (1 línea = 1 punto)"><textarea rows={3} value={(Array.isArray(cur.programa_es) ? cur.programa_es : []).join('\n')} onChange={e => upd({ ...cur, programa_es: e.target.value.split('\n') })} /></Row>
        </>) : (<>
          <Row label="Desc EN"><textarea rows={2} value={cur.d_en || ''} onChange={e => upd({ ...cur, d_en: e.target.value })} /></Row>
          <Row label="Program EN (1 line = 1 item)"><textarea rows={3} value={(Array.isArray(cur.programa_en) ? cur.programa_en : []).join('\n')} onChange={e => upd({ ...cur, programa_en: e.target.value.split('\n') })} /></Row>
        </>)}
        <div className="adm-grid3">
          <Row label="Fecha"><input type="date" value={cur.fecha || ''} onChange={e => upd({ ...cur, fecha: e.target.value })} /></Row>
          <Row label="Hora"><input type="time" value={cur.hora || ''} onChange={e => upd({ ...cur, hora: e.target.value })} /></Row>
          <Row label="Precio S/."><input type="number" min="0" value={cur.p ?? 0} onChange={e => upd({ ...cur, p: Number(e.target.value) })} /></Row>
        </div>
        <Row label="Lugar"><input value={cur.lugar || ''} onChange={e => upd({ ...cur, lugar: e.target.value })} /></Row>
        <div className="adm-grid3">
          <Row label="Cupos"><input type="number" min="1" value={cur.cupos ?? 0} onChange={e => upd({ ...cur, cupos: Number(e.target.value) })} /></Row>
          <Row label="Inscritos"><input type="number" min="0" value={cur.inscritos ?? 0} onChange={e => upd({ ...cur, inscritos: Number(e.target.value) })} /></Row>
          <Row label="Rating"><input type="number" min="0" max="5" step="0.1" value={cur.rating ?? 5} onChange={e => upd({ ...cur, rating: Number(e.target.value) })} /></Row>
        </div>
        <Row label="Etiqueta"><input value={cur.tag || ''} onChange={e => upd({ ...cur, tag: e.target.value })} /></Row>
        <Row label="Foto"><ImgPick value={cur.img} onChange={v => upd({ ...cur, img: v })} /></Row>
      </>)}
    </div>
  )
}

function SubList({ label, items, onChange, kind }) {
  const [tab, setTab] = useState('es')
  const [idx, setIdx] = useState(0)
  const list = Array.isArray(items) ? items : []
  const cur = list[idx] || {}
  const upd = (next) => onChange(list.map((x, k) => (k === idx ? next : x)))
  const add = () => {
    const nu = kind === 'costos'
      ? { tag: 'New', p: 'S/.0', n_es: '', n_en: '' }
      : { e: '✨', t_es: 'Nuevo', t_en: 'New', d_es: '', d_en: '', img: EVENTOS_ASSETS[0] }
    onChange([...list, nu])
    setIdx(list.length)
  }
  const del = () => { if (list.length > 1) { onChange(list.filter((_, k) => k !== idx)); setIdx(0) } }
  return (
    <div>
      <div className="adm-note">{label} ({list.length})</div>
      <div className="adm-chips">
        {list.map((x, k) => (
          <button key={k} type="button" className={k === idx ? 'on' : ''} onClick={() => setIdx(k)}>
            {x.img && <img src={resolveUpload(x.img)} alt="" loading="lazy" />}
            <span>{(x.t_es || x.tag || '').slice(0, 26) || `${label} ${k + 1}`}</span>
          </button>
        ))}
      </div>
      <div className="adm-listops">
        <button type="button" className="btn btn-line" onClick={add}>+ Agregar</button>
        <button type="button" className="btn btn-line" onClick={del}>− Quitar</button>
      </div>
      {cur && kind === 'costos' && (<>
        <div className="adm-grid2">
          <Row label="Tag"><input value={cur.tag || ''} onChange={e => upd({ ...cur, tag: e.target.value })} /></Row>
          <Row label="Precio"><input value={cur.p || ''} onChange={e => upd({ ...cur, p: e.target.value })} /></Row>
        </div>
        {tab === 'es'
          ? <Row label="Nota ES"><input value={cur.n_es || ''} onChange={e => upd({ ...cur, n_es: e.target.value })} /></Row>
          : <Row label="Note EN"><input value={cur.n_en || ''} onChange={e => upd({ ...cur, n_en: e.target.value })} /></Row>}
      </>)}
      {cur && kind !== 'costos' && (<>
        {kind !== 'campos' && <Row label="Emoji"><input value={cur.e || ''} onChange={e => upd({ ...cur, e: e.target.value })} /></Row>}
        {tab === 'es' ? (<>
          <Row label="Título ES"><input value={cur.t_es || ''} onChange={e => upd({ ...cur, t_es: e.target.value })} /></Row>
          <Row label="Desc ES"><input value={cur.d_es || ''} onChange={e => upd({ ...cur, d_es: e.target.value })} /></Row>
        </>) : (<>
          <Row label="Title EN"><input value={cur.t_en || ''} onChange={e => upd({ ...cur, t_en: e.target.value })} /></Row>
          <Row label="Desc EN"><input value={cur.d_en || ''} onChange={e => upd({ ...cur, d_en: e.target.value })} /></Row>
        </>)}
        <Row label="Foto"><ImgPick value={cur.img} onChange={v => upd({ ...cur, img: v })} /></Row>
      </>)}
    </div>
  )
}

const BCB_GROUPS = [
  ['Cabecera', ['pill', 'h2', 'p']],
  ['Botones fase', ['f0', 'f0sub', 'f1', 'f1sub']],
  ['Fase Base', ['k0', 'k0t', 'k0p1', 'k0p2', 'hAreas', 'hOficios', 'hIncluye', 'fechaT', 'fechaV', 'lugarT', 'lugarV', 'hInv', 'verMas', 'verMenos', 'inscBase']],
  ['Fase Campo', ['k1', 'k1t', 'k1p1', 'k1p2', 'hRuta', 'opc', 'viajas', 'hCubre', 'waCampo', 'waCampoMsg', 'inscCampo']],
]
const BCB_AREA = new Set(['p', 'k0p1', 'k0p2', 'k1p1', 'k1p2', 'viajas'])

function BcbForm({ o, onChange, fmt, setFmt }) {
  const [tab, setTab] = useState('es')
  const set = (k, v) => onChange({ ...o, [k]: v })
  const sfx = tab === 'es' ? '_es' : '_en'
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      {BCB_GROUPS.map(([g, keys]) => (
        <div key={g}>
          <div className="adm-note">{g} · {tab.toUpperCase()}</div>
          {keys.map(k => BCB_AREA.has(k)
            ? <Row key={k} label={k}><textarea rows={2} value={o[`${k}${sfx}`] || ''} onChange={e => set(`${k}${sfx}`, e.target.value)} /></Row>
            : <Row key={k} label={k}><input value={o[`${k}${sfx}`] || ''} onChange={e => set(`${k}${sfx}`, e.target.value)} /></Row>)}
        </div>
      ))}
      <FmtCtl label="Formato título BCB" value={fmt['ev.bcb.h2']} onChange={v => setFmt('ev.bcb.h2', v)} />
      <FmtCtl label="Formato texto BCB" value={fmt['ev.bcb.p']} onChange={v => setFmt('ev.bcb.p', v)} />
      <div className="adm-note">Notas · {tab.toUpperCase()}</div>
      {[1, 2, 3, 4, 5, 6, 7].map(n => (
        <Row key={n} label={`nota${n}`}><textarea rows={2} value={o[`nota${n}${sfx}`] || ''} onChange={e => set(`nota${n}${sfx}`, e.target.value)} /></Row>
      ))}
      <Row label={`Cubre (${tab}) · 1 línea = 1 ítem`}><textarea rows={4} value={(Array.isArray(tab === 'es' ? o.cubre_es : o.cubre_en) ? (tab === 'es' ? o.cubre_es : o.cubre_en) : []).join('\n')} onChange={e => set(tab === 'es' ? 'cubre_es' : 'cubre_en', e.target.value.split('\n'))} /></Row>
      <Row label="Imagen base"><ImgPick value={o.img_base} onChange={v => set('img_base', v)} /></Row>
      <Row label="Fondo"><input type="color" value={o.bg || '#ffffff'} onChange={e => set('bg', e.target.value)} /></Row>
      <SubList label="Áreas" items={o.areas} onChange={v => set('areas', v)} kind="areas" />
      <SubList label="Oficios" items={o.oficios} onChange={v => set('oficios', v)} kind="oficios" />
      <SubList label="Incluye" items={o.incluye} onChange={v => set('incluye', v)} kind="incluye" />
      <SubList label="Campos" items={o.campos} onChange={v => set('campos', v)} kind="campos" />
      <SubList label="Costos" items={o.costos} onChange={v => set('costos', v)} kind="costos" />
    </div>
  )
}

function CtaForm({ o, onChange, fmt, setFmt }) {
  const [tab, setTab] = useState('es')
  const set = (k, v) => onChange({ ...o, [k]: v })
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      {tab === 'es' ? (<>
        <Row label="Título ES"><input value={o.t_es || ''} onChange={e => set('t_es', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={fmt['ev.cta.t']} onChange={v => setFmt('ev.cta.t', v)} />
        <Row label="P1 ES"><input value={o.p1_es || ''} onChange={e => set('p1_es', e.target.value)} /></Row>
        <Row label="P2 ES"><input value={o.p2_es || ''} onChange={e => set('p2_es', e.target.value)} /></Row>
        <Row label="P3 ES"><input value={o.p3_es || ''} onChange={e => set('p3_es', e.target.value)} /></Row>
        <FmtCtl label="Formato texto" value={fmt['ev.cta.p']} onChange={v => setFmt('ev.cta.p', v)} />
        <Row label="Botón ES"><input value={o.btn_es || ''} onChange={e => set('btn_es', e.target.value)} /></Row>
      </>) : (<>
        <Row label="Title EN"><input value={o.t_en || ''} onChange={e => set('t_en', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={fmt['ev.cta.t']} onChange={v => setFmt('ev.cta.t', v)} />
        <Row label="P1 EN"><input value={o.p1_en || ''} onChange={e => set('p1_en', e.target.value)} /></Row>
        <Row label="P2 EN"><input value={o.p2_en || ''} onChange={e => set('p2_en', e.target.value)} /></Row>
        <Row label="P3 EN"><input value={o.p3_en || ''} onChange={e => set('p3_en', e.target.value)} /></Row>
        <FmtCtl label="Formato texto" value={fmt['ev.cta.p']} onChange={v => setFmt('ev.cta.p', v)} />
        <Row label="Button EN"><input value={o.btn_en || ''} onChange={e => set('btn_en', e.target.value)} /></Row>
      </>)}
    </div>
  )
}

export function EventosEditor({ draft, onDraft, sec, sel, onSel }) {
  const set = (patch) => onDraft({ ...draft, ...patch })
  const fmt = draft.fmt || {}
  const setFmt = (k, v) => onDraft({ ...draft, fmt: { ...fmt, [k]: v } })
  return (
    <div className="adm-page">
      {sec === 'hero' && <HeroForm o={draft.hero || {}} onChange={v => set({ hero: v })} fmt={fmt} setFmt={setFmt} />}
      {sec === 'secs' && <SecsForm draft={draft} onDraft={onDraft} fmt={fmt} setFmt={setFmt} />}
      {sec === 'cats' && <CatsForm items={draft.cats || []} onChange={v => set({ cats: v })} sel={sel} onSel={onSel} />}
      {sec === 'eventos' && <EventosForm items={draft.eventos || []} onChange={v => set({ eventos: v })} sel={sel} onSel={onSel} />}
      {sec === 'bcb' && <BcbForm o={draft.bcb || {}} onChange={v => set({ bcb: v })} fmt={fmt} setFmt={setFmt} />}
      {sec === 'cta' && <CtaForm o={draft.cta || {}} onChange={v => set({ cta: v })} fmt={fmt} setFmt={setFmt} />}
    </div>
  )
}

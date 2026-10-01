import { useState } from 'react'
import { arrOf } from '../../core/cms/safe'
import { aliasPaisId, defaultPaises, flagFor, normalizePaises, searchPaises } from '../../core/cms/paises'
import { Row, FmtCtl, ImgPick } from './InicioEditor'
import { NOSOTROS_ASSETS } from '../../core/cms/defaultNosotros'
import { resolveUpload } from './adminUpload'

function PaisesManager({ paises, onChange }) {
  const [q, setQ] = useState('')
  const res = searchPaises(q, 'es', 8).filter((p) => !paises.some((x) => x.id === p.id))
  const add = (p) => onChange([...paises, { id: p.id, iso2: p.iso2, name_es: p.name_es, name_en: p.name_en }])
  const del = (id) => {
    if (paises.length <= 1) return
    onChange(paises.filter((p) => p.id !== id))
  }
  return (<>
    <div className="adm-note">Países del filtro ({paises.length}): {paises.map((p) => `${flagFor(paises, p.id)} ${p.id}`).join(' · ')}</div>
    <Row label="Buscar país (nombre o código)"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ej: perú, chile, COL…" /></Row>
    {q.trim() !== '' && (
      <div className="adm-chips">
        {res.length ? res.map((p) => (
          <button key={p.id} type="button" onClick={() => { add(p); setQ('') }}>
            <span>{p.flag}</span><span>{p.name_es} · {p.id}</span>
          </button>
        )) : <span className="adm-note">Sin resultados para “{q}”.</span>}
      </div>
    )}
    <div className="adm-chips">
      {paises.map((p) => (
        <button key={p.id} type="button" title="Quitar del filtro" onClick={() => del(p.id)}>
          <span>{flagFor(paises, p.id)}</span><span>{p.name_es} · {p.id} ✕</span>
        </button>
      ))}
    </div>
  </>)
}

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
        <FmtCtl label="Formato pill" value={fmt['hero.pill']} onChange={v => setFmt('hero.pill', v)} />
        <Row label="Título A ES"><input value={o.h1a_es || ''} onChange={e => set('h1a_es', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={fmt['hero.h1']} onChange={v => setFmt('hero.h1', v)} />
        <Row label="Título B ES"><input value={o.h1b_es || ''} onChange={e => set('h1b_es', e.target.value)} /></Row>
        <Row label="Párrafo ES"><textarea rows={2} value={o.p_es || ''} onChange={e => set('p_es', e.target.value)} /></Row>
        <FmtCtl label="Formato párrafo" value={fmt['hero.p']} onChange={v => setFmt('hero.p', v)} />
        <Row label="Versículo ES"><textarea rows={2} value={o.verse_es || ''} onChange={e => set('verse_es', e.target.value)} /></Row>
      </>) : (<>
        <Row label="Pill EN"><input value={o.pill_en || ''} onChange={e => set('pill_en', e.target.value)} /></Row>
        <FmtCtl label="Formato pill" value={fmt['hero.pill']} onChange={v => setFmt('hero.pill', v)} />
        <Row label="Title A EN"><input value={o.h1a_en || ''} onChange={e => set('h1a_en', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={fmt['hero.h1']} onChange={v => setFmt('hero.h1', v)} />
        <Row label="Title B EN"><input value={o.h1b_en || ''} onChange={e => set('h1b_en', e.target.value)} /></Row>
        <Row label="Paragraph EN"><textarea rows={2} value={o.p_en || ''} onChange={e => set('p_en', e.target.value)} /></Row>
        <FmtCtl label="Formato párrafo" value={fmt['hero.p']} onChange={v => setFmt('hero.p', v)} />
        <Row label="Verse EN"><textarea rows={2} value={o.verse_en || ''} onChange={e => set('verse_en', e.target.value)} /></Row>
      </>)}
      <Row label="Cita"><input value={o.verseRef || ''} onChange={e => set('verseRef', e.target.value)} /></Row>
      <Row label="Imagen hero"><ImgPick value={o.img} onChange={v => set('img', v)} /></Row>
      <Row label="Fondo"><input type="color" value={o.bg || '#ffffff'} onChange={e => set('bg', e.target.value)} /></Row>
      <div className="adm-note">Stats: {arrOf(o.stats).map(s => `${s.v}`).join(' · ')}</div>
    </div>
  )
}

function QuienesForm({ o, onChange, fmt, setFmt }) {
  const [tab, setTab] = useState('es')
  const [sel, setSel] = useState(0)
  const set = (k, v) => onChange({ ...o, [k]: v })
  const items = arrOf(o.pilares)
  const cur = items[sel]
  const upd = (next) => onChange({ ...o, pilares: items.map((x, k) => (k === sel ? next : x)) })
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      {tab === 'es' ? (<>
        <Row label="Pill ES"><input value={o.pill_es || ''} onChange={e => set('pill_es', e.target.value)} /></Row>
        <Row label="Título ES"><input value={o.h2_es || ''} onChange={e => set('h2_es', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={fmt['quienes.h2']} onChange={v => setFmt('quienes.h2', v)} />
        <Row label="Texto ES"><textarea rows={2} value={o.p1_es || ''} onChange={e => set('p1_es', e.target.value)} /></Row>
        <FmtCtl label="Formato texto" value={fmt['quienes.p']} onChange={v => setFmt('quienes.p', v)} />
        <Row label="Dedica ES"><input value={o.dedica_es || ''} onChange={e => set('dedica_es', e.target.value)} /></Row>
        <Row label="Dedica texto ES"><textarea rows={2} value={o.dedicap_es || ''} onChange={e => set('dedicap_es', e.target.value)} /></Row>
        <Row label="CTA ES"><input value={o.cta_es || ''} onChange={e => set('cta_es', e.target.value)} /></Row>
      </>) : (<>
        <Row label="Pill EN"><input value={o.pill_en || ''} onChange={e => set('pill_en', e.target.value)} /></Row>
        <Row label="Title EN"><input value={o.h2_en || ''} onChange={e => set('h2_en', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={fmt['quienes.h2']} onChange={v => setFmt('quienes.h2', v)} />
        <Row label="Text EN"><textarea rows={2} value={o.p1_en || ''} onChange={e => set('p1_en', e.target.value)} /></Row>
        <FmtCtl label="Formato texto" value={fmt['quienes.p']} onChange={v => setFmt('quienes.p', v)} />
        <Row label="Dedica EN"><input value={o.dedica_en || ''} onChange={e => set('dedica_en', e.target.value)} /></Row>
        <Row label="Dedica text EN"><textarea rows={2} value={o.dedicap_en || ''} onChange={e => set('dedicap_en', e.target.value)} /></Row>
        <Row label="CTA EN"><input value={o.cta_en || ''} onChange={e => set('cta_en', e.target.value)} /></Row>
      </>)}
      <Row label="Imagen dedica"><ImgPick value={o.dedicaImg} onChange={v => set('dedicaImg', v)} /></Row>
      <Row label="Fondo"><input type="color" value={o.bg || '#ffffff'} onChange={e => set('bg', e.target.value)} /></Row>
      <Row label="Pilar"><select value={sel} onChange={e => setSel(Number(e.target.value))}>{items.map((x, k) => <option key={k} value={k}>{x.t_es || `Pilar ${k + 1}`}</option>)}</select></Row>
      {cur && (<>
        <Row label="Emoji"><input value={cur.e || ''} onChange={e => upd({ ...cur, e: e.target.value })} /></Row>
        {tab === 'es' ? (<>
          <Row label="Título ES"><input value={cur.t_es || ''} onChange={e => upd({ ...cur, t_es: e.target.value })} /></Row>
          <Row label="Desc ES"><textarea rows={2} value={cur.d_es || ''} onChange={e => upd({ ...cur, d_es: e.target.value })} /></Row>
        </>) : (<>
          <Row label="Title EN"><input value={cur.t_en || ''} onChange={e => upd({ ...cur, t_en: e.target.value })} /></Row>
          <Row label="Desc EN"><textarea rows={2} value={cur.d_en || ''} onChange={e => upd({ ...cur, d_en: e.target.value })} /></Row>
        </>)}
        <Row label="Foto"><ImgPick value={cur.img} onChange={v => upd({ ...cur, img: v })} /></Row>
      </>)}
    </div>
  )
}

function FuncsForm({ o, onChange, fmt, setFmt, sel, onSel }) {
  const [tab, setTab] = useState('es')
  const set = (k, v) => onChange({ ...o, [k]: v })
  const items = arrOf(o.items)
  const cur = items[sel]
  const upd = (next) => onChange({ ...o, items: items.map((x, k) => (k === sel ? next : x)) })
  const add = () => onChange({ ...o, items: [...items, { e: '✨', t_es: 'Nueva', t_en: 'New', d_es: '', d_en: '', img: NOSOTROS_ASSETS[0] }] })
  const del = () => { if (items.length > 1) { onChange({ ...o, items: items.filter((_, k) => k !== sel) }); onSel(0) } }
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      {tab === 'es' ? (<>
        <Row label="Pill ES"><input value={o.pill_es || ''} onChange={e => set('pill_es', e.target.value)} /></Row>
        <Row label="Título ES"><input value={o.h2_es || ''} onChange={e => set('h2_es', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={fmt['funcs.h2']} onChange={v => setFmt('funcs.h2', v)} />
        <Row label="Sub ES"><input value={o.sub_es || ''} onChange={e => set('sub_es', e.target.value)} /></Row>
        <FmtCtl label="Formato texto" value={fmt['funcs.p']} onChange={v => setFmt('funcs.p', v)} />
      </>) : (<>
        <Row label="Pill EN"><input value={o.pill_en || ''} onChange={e => set('pill_en', e.target.value)} /></Row>
        <Row label="Title EN"><input value={o.h2_en || ''} onChange={e => set('h2_en', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={fmt['funcs.h2']} onChange={v => setFmt('funcs.h2', v)} />
        <Row label="Sub EN"><input value={o.sub_en || ''} onChange={e => set('sub_en', e.target.value)} /></Row>
        <FmtCtl label="Formato texto" value={fmt['funcs.p']} onChange={v => setFmt('funcs.p', v)} />
      </>)}
      <Row label="Fondo"><input type="color" value={o.bg || '#ffffff'} onChange={e => set('bg', e.target.value)} /></Row>
      <div className="adm-chips">
        {items.map((x, k) => (
          <button key={k} className={k === sel ? 'on' : ''} onClick={() => onSel(k)}>
            <img src={resolveUpload(x.img)} alt="" loading="lazy" />
            <span>{x.t_es || `Función ${k + 1}`}</span>
          </button>
        ))}
      </div>
      <div className="adm-listops">
        <button className="btn btn-line" onClick={add}>+ Agregar</button>
        <button className="btn btn-line" onClick={del}>− Quitar</button>
      </div>
      {cur && (<>
        <Row label="Emoji"><input value={cur.e || ''} onChange={e => upd({ ...cur, e: e.target.value })} /></Row>
        {tab === 'es' ? (<>
          <Row label="Título ES"><input value={cur.t_es || ''} onChange={e => upd({ ...cur, t_es: e.target.value })} /></Row>
          <Row label="Desc ES"><textarea rows={2} value={cur.d_es || ''} onChange={e => upd({ ...cur, d_es: e.target.value })} /></Row>
        </>) : (<>
          <Row label="Title EN"><input value={cur.t_en || ''} onChange={e => upd({ ...cur, t_en: e.target.value })} /></Row>
          <Row label="Desc EN"><textarea rows={2} value={cur.d_en || ''} onChange={e => upd({ ...cur, d_en: e.target.value })} /></Row>
        </>)}
        <Row label="Foto"><ImgPick value={cur.img} onChange={v => upd({ ...cur, img: v })} /></Row>
      </>)}
    </div>
  )
}

function FeForm({ o, onChange, fmt, setFmt, sel, onSel }) {
  const [tab, setTab] = useState('es')
  const set = (k, v) => onChange({ ...o, [k]: v })
  const items = arrOf(o.items)
  const cur = items[sel]
  const upd = (next) => onChange({ ...o, items: items.map((x, k) => (k === sel ? next : x)) })
  const add = () => onChange({ ...o, items: [...items, { t_es: 'Nueva verdad', t_en: 'New truth', d_es: '', d_en: '' }] })
  const del = () => { if (items.length > 1) { onChange({ ...o, items: items.filter((_, k) => k !== sel) }); onSel(0) } }
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      {tab === 'es' ? (<>
        <Row label="Pill ES"><input value={o.pill_es || ''} onChange={e => set('pill_es', e.target.value)} /></Row>
        <Row label="Título ES"><input value={o.h2_es || ''} onChange={e => set('h2_es', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={fmt['fe.h2']} onChange={v => setFmt('fe.h2', v)} />
        <Row label="Sub ES"><input value={o.sub_es || ''} onChange={e => set('sub_es', e.target.value)} /></Row>
        <FmtCtl label="Formato texto" value={fmt['fe.p']} onChange={v => setFmt('fe.p', v)} />
      </>) : (<>
        <Row label="Pill EN"><input value={o.pill_en || ''} onChange={e => set('pill_en', e.target.value)} /></Row>
        <Row label="Title EN"><input value={o.h2_en || ''} onChange={e => set('h2_en', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={fmt['fe.h2']} onChange={v => setFmt('fe.h2', v)} />
        <Row label="Sub EN"><input value={o.sub_en || ''} onChange={e => set('sub_en', e.target.value)} /></Row>
        <FmtCtl label="Formato texto" value={fmt['fe.p']} onChange={v => setFmt('fe.p', v)} />
      </>)}
      <Row label="Fondo"><input type="color" value={o.bg || '#ffffff'} onChange={e => set('bg', e.target.value)} /></Row>
      <div className="adm-chips">
        {items.map((x, k) => (
          <button key={k} className={k === sel ? 'on' : ''} onClick={() => onSel(k)}>
            <span>{(x.t_es || '').slice(0, 28) || `Verdad ${k + 1}`}</span>
          </button>
        ))}
      </div>
      <div className="adm-listops">
        <button className="btn btn-line" onClick={add}>+ Agregar</button>
        <button className="btn btn-line" onClick={del}>− Quitar</button>
      </div>
      {cur && (<>
        {tab === 'es' ? (<>
          <Row label="Título ES"><input value={cur.t_es || ''} onChange={e => upd({ ...cur, t_es: e.target.value })} /></Row>
          <Row label="Texto ES"><textarea rows={4} value={cur.d_es || ''} onChange={e => upd({ ...cur, d_es: e.target.value })} /></Row>
        </>) : (<>
          <Row label="Title EN"><input value={cur.t_en || ''} onChange={e => upd({ ...cur, t_en: e.target.value })} /></Row>
          <Row label="Text EN"><textarea rows={4} value={cur.d_en || ''} onChange={e => upd({ ...cur, d_en: e.target.value })} /></Row>
        </>)}
      </>)}
    </div>
  )
}

function EquipoForm({ o, onChange, fmt, setFmt, sel, onSel }) {
  const [tab, setTab] = useState('es')
  const set = (k, v) => onChange({ ...o, [k]: v })
  const items = arrOf(o.members)
  const paises = normalizePaises(o.paises, defaultPaises())
  const cur = items[sel]
  const upd = (next) => onChange({ ...o, members: items.map((x, k) => (k === sel ? next : x)) })
  const add = () => onChange({ ...o, members: [...items, { n: 'Nuevo', p: paises[0]?.id || 'PER', img: NOSOTROS_ASSETS[0], rol_es: '', rol_en: '', q_es: '', q_en: '' }] })
  const del = () => { if (items.length > 1) { onChange({ ...o, members: items.filter((_, k) => k !== sel) }); onSel(0) } }
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      {tab === 'es' ? (<>
        <Row label="Pill ES"><input value={o.pill_es || ''} onChange={e => set('pill_es', e.target.value)} /></Row>
        <Row label="Título ES"><input value={o.title_es || ''} onChange={e => set('title_es', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={fmt['equipo.title']} onChange={v => setFmt('equipo.title', v)} />
        <Row label="Sub ES"><input value={o.sub_es || ''} onChange={e => set('sub_es', e.target.value)} /></Row>
        <FmtCtl label="Formato texto" value={fmt['equipo.p']} onChange={v => setFmt('equipo.p', v)} />
      </>) : (<>
        <Row label="Pill EN"><input value={o.pill_en || ''} onChange={e => set('pill_en', e.target.value)} /></Row>
        <Row label="Title EN"><input value={o.title_en || ''} onChange={e => set('title_en', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={fmt['equipo.title']} onChange={v => setFmt('equipo.title', v)} />
        <Row label="Sub EN"><input value={o.sub_en || ''} onChange={e => set('sub_en', e.target.value)} /></Row>
        <FmtCtl label="Formato texto" value={fmt['equipo.p']} onChange={v => setFmt('equipo.p', v)} />
      </>)}
      <Row label="Fondo"><input type="color" value={o.bg || '#ffffff'} onChange={e => set('bg', e.target.value)} /></Row>
      <div className="adm-detail">
        <div className="adm-note">🌎 Países del filtro — busca por nombre o código, añade, y luego elígelos en cada miembro.</div>
        <PaisesManager paises={paises} onChange={(v) => {
          const next = { ...o, paises: v, members: items.map((m) => (v.some((p) => p.id === aliasPaisId(m.p)) ? m : { ...m, p: v[0]?.id || m.p })) }
          onChange(next)
        }} />
      </div>
      <div className="adm-chips">
        {items.map((x, k) => (
          <button key={k} className={k === sel ? 'on' : ''} onClick={() => onSel(k)}>
            <img src={resolveUpload(x.img)} alt="" loading="lazy" />
            <span>{x.n || `Miembro ${k + 1}`}</span>
          </button>
        ))}
      </div>
      <div className="adm-listops">
        <button className="btn btn-line" onClick={add}>+ Agregar</button>
        <button className="btn btn-line" onClick={del}>− Quitar</button>
      </div>
      {cur && (<>
        <Row label="Nombre"><input value={cur.n || ''} onChange={e => upd({ ...cur, n: e.target.value })} /></Row>
        <Row label="País"><select value={aliasPaisId(cur.p)} onChange={e => upd({ ...cur, p: e.target.value })}>{paises.map((p) => <option key={p.id} value={p.id}>{flagFor(paises, p.id)} {p.name_es} · {p.id}</option>)}</select></Row>
        {tab === 'es' ? (<>
          <Row label="Rol ES"><input value={cur.rol_es || ''} onChange={e => upd({ ...cur, rol_es: e.target.value })} /></Row>
          <Row label="Frase ES"><textarea rows={2} value={cur.q_es || ''} onChange={e => upd({ ...cur, q_es: e.target.value })} /></Row>
        </>) : (<>
          <Row label="Role EN"><input value={cur.rol_en || ''} onChange={e => upd({ ...cur, rol_en: e.target.value })} /></Row>
          <Row label="Quote EN"><textarea rows={2} value={cur.q_en || ''} onChange={e => upd({ ...cur, q_en: e.target.value })} /></Row>
        </>)}
        <Row label="Foto"><ImgPick value={cur.img} onChange={v => upd({ ...cur, img: v })} /></Row>
      </>)}
    </div>
  )
}

export function NosotrosEditor({ draft, onDraft, sec, sel, onSel }) {
  const set = (patch) => onDraft({ ...draft, ...patch })
  const fmt = draft.fmt || {}
  const setFmt = (k, v) => onDraft({ ...draft, fmt: { ...fmt, [k]: v } })
  return (
    <div className="adm-page">
      {sec === 'hero' && <HeroForm o={draft.hero || {}} onChange={v => set({ hero: v })} fmt={fmt} setFmt={setFmt} />}
      {sec === 'quienes' && <QuienesForm o={draft.quienes || {}} onChange={v => set({ quienes: v })} fmt={fmt} setFmt={setFmt} />}
      {sec === 'funcs' && <FuncsForm o={draft.funcs || {}} onChange={v => set({ funcs: v })} fmt={fmt} setFmt={setFmt} sel={sel} onSel={onSel} />}
      {sec === 'fe' && <FeForm o={draft.fe || {}} onChange={v => set({ fe: v })} fmt={fmt} setFmt={setFmt} sel={sel} onSel={onSel} />}
      {sec === 'equipo' && <EquipoForm o={draft.equipo || {}} onChange={v => set({ equipo: v })} fmt={fmt} setFmt={setFmt} sel={sel} onSel={onSel} />}
    </div>
  )
}

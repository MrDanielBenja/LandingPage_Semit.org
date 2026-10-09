import { useState } from 'react'
import { Row, FmtCtl, ImgPick, IconsForm } from './InicioEditor'
import { imgEditScaleOnly } from '../../core/cms/imgEdit'
import { useCursos } from '../cursos/hooks/useCursos'
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
        <FmtCtl label="Formato pill" value={fmt['cur.hero.pill']} onChange={v => setFmt('cur.hero.pill', v)} />
        <Row label="Título A ES"><input value={o.h1a_es || ''} onChange={e => set('h1a_es', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={fmt['cur.hero.h1']} onChange={v => setFmt('cur.hero.h1', v)} />
        <Row label="Título B ES"><input value={o.h1b_es || ''} onChange={e => set('h1b_es', e.target.value)} /></Row>
        <Row label="Párrafo ES"><textarea rows={2} value={o.p_es || ''} onChange={e => set('p_es', e.target.value)} /></Row>
        <FmtCtl label="Formato párrafo" value={fmt['cur.hero.p']} onChange={v => setFmt('cur.hero.p', v)} />
        <Row label="Buscador ES"><input value={o.ph_es || ''} onChange={e => set('ph_es', e.target.value)} /></Row>
      </>) : (<>
        <Row label="Pill EN"><input value={o.pill_en || ''} onChange={e => set('pill_en', e.target.value)} /></Row>
        <FmtCtl label="Formato pill" value={fmt['cur.hero.pill']} onChange={v => setFmt('cur.hero.pill', v)} />
        <Row label="Title A EN"><input value={o.h1a_en || ''} onChange={e => set('h1a_en', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={fmt['cur.hero.h1']} onChange={v => setFmt('cur.hero.h1', v)} />
        <Row label="Title B EN"><input value={o.h1b_en || ''} onChange={e => set('h1b_en', e.target.value)} /></Row>
        <Row label="Paragraph EN"><textarea rows={2} value={o.p_en || ''} onChange={e => set('p_en', e.target.value)} /></Row>
        <FmtCtl label="Formato párrafo" value={fmt['cur.hero.p']} onChange={v => setFmt('cur.hero.p', v)} />
        <Row label="Search EN"><input value={o.ph_en || ''} onChange={e => set('ph_en', e.target.value)} /></Row>
      </>)}
      <Row label="Imagen hero"><ImgPick value={o.img} onChange={v => set('img', v)} {...imgEditScaleOnly(o, (p) => onChange({ ...o, ...p }), 'Cursos hero - Edición de Imagen')} /></Row>
      <Row label="Fondo"><input type="color" value={o.bg || '#ffffff'} onChange={e => set('bg', e.target.value)} /></Row>
      <div className="adm-note">Pill usa {'{n}'} = nº cursos. Solo labels de stats editables; inscritos se calcula.</div>
    </div>
  )
}

function StatsForm({ o, onChange }) {
  const [tab, setTab] = useState('es')
  const set = (k, v) => onChange({ ...o, [k]: v })
  const F = [['promoLabel', 'Promo'], ['activosLabel', 'Activos'], ['promLabel', 'Promedio']]
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      {F.map(([k, lb]) => tab === 'es'
        ? <Row key={k} label={`${lb} ES`}><input value={o[`${k}_es`] || ''} onChange={e => set(`${k}_es`, e.target.value)} /></Row>
        : <Row key={k} label={`${lb} EN`}><input value={o[`${k}_en`] || ''} onChange={e => set(`${k}_en`, e.target.value)} /></Row>)}
      <div className="adm-note">Inscritos se calcula (suma de est). No editable.</div>
    </div>
  )
}

function TracksForm({ arr, onChange, fmt, setFmt }) {
  const [tab, setTab] = useState('es')
  const [sel, setSel] = useState(0)
  const items = Array.isArray(arr) ? arr : []
  const cur = items[sel] || {}
  const upd = (next) => onChange(items.map((x, k) => (k === sel ? next : x)))
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      <Row label="Track"><select value={sel} onChange={e => setSel(Number(e.target.value))}>{items.map((x, k) => <option key={x.id} value={k}>{x.id}</option>)}</select></Row>
      {cur && (<>
        <Row label="Emoji"><input value={cur.e || ''} onChange={e => upd({ ...cur, e: e.target.value })} /></Row>
        {tab === 'es'
          ? <Row label="Desc ES"><input value={cur.d_es || ''} onChange={e => upd({ ...cur, d_es: e.target.value })} /></Row>
          : <Row label="Desc EN"><input value={cur.d_en || ''} onChange={e => upd({ ...cur, d_en: e.target.value })} /></Row>}
        <FmtCtl label="Formato desc" value={fmt[`cur.track.${cur.id}`]} onChange={v => setFmt(`cur.track.${cur.id}`, v)} />
        <Row label="Foto"><ImgPick value={cur.img} onChange={v => upd({ ...cur, img: v })} {...imgEditScaleOnly(cur, (p) => upd({ ...cur, ...p }), 'Track - Edición de Imagen')} /></Row>
      </>)}
    </div>
  )
}

function HeadEsEn({ o, onChange, keys, prefix, fmt, setFmt, area = true }) {
  const [tab, setTab] = useState('es')
  const set = (k, v) => onChange({ ...o, [k]: v })
  return (
    <div className="adm-form">
      <LangTabs tab={tab} setTab={setTab} />
      {keys.map(k => tab === 'es'
        ? <div key={k}><Row label={`${k} ES`}>{area && (k === 'p' || k === 'p1' || k === 'p2')
          ? <textarea rows={2} value={o[`${k}_es`] || ''} onChange={e => set(`${k}_es`, e.target.value)} />
          : <input value={o[`${k}_es`] || ''} onChange={e => set(`${k}_es`, e.target.value)} />}</Row>
          {prefix && <FmtCtl label={`Fmt ${k}`} value={fmt[`${prefix}.${k}`]} onChange={v => setFmt(`${prefix}.${k}`, v)} />}</div>
        : <div key={k}><Row label={`${k} EN`}>{area && (k === 'p' || k === 'p1' || k === 'p2')
          ? <textarea rows={2} value={o[`${k}_en`] || ''} onChange={e => set(`${k}_en`, e.target.value)} />
          : <input value={o[`${k}_en`] || ''} onChange={e => set(`${k}_en`, e.target.value)} />}</Row>
          {prefix && <FmtCtl label={`Fmt ${k}`} value={fmt[`${prefix}.${k}`]} onChange={v => setFmt(`${prefix}.${k}`, v)} />}</div>)}
    </div>
  )
}

function ApiForm({ o, onChange }) {
  const [tab, setTab] = useState('es')
  const [q, setQ] = useState('')
  const { data, loading } = useCursos()
  const ov = (o && o.overrides) || {}
  const setOv = (slug, patch) => {
    const cur = ov[slug] || { activo: true }
    onChange({ ...(o || {}), overrides: { ...ov, [slug]: { ...cur, ...patch } } })
  }
  const list = (Array.isArray(data) ? data : []).filter(c => (c.n + (c.slug || '')).toLowerCase().includes(q.toLowerCase()))
  const nAct = (Array.isArray(data) ? data : []).filter(c => (ov[c.slug]?.activo !== false)).length
  return (
    <div className="adm-form">
      <div className="adm-note">🔌 Cursos que vienen de la API ({(Array.isArray(data) ? data : []).length} en catálogo · {nAct} activos). Apaga el switch para no jalarlo al sitio. El sync del portal NO pisa precio, tag, activo ni imagen.</div>
      <Row label="Buscar"><input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar curso…" /></Row>
      <LangTabs tab={tab} setTab={setTab} />
      <div className="adm-apilist">
        {loading && <small className="adm-note">Cargando catálogo…</small>}
        {list.map(c => {
          const cur = ov[c.slug] || {}
          const on = cur.activo !== false
          return (
            <div key={c.slug} className={`adm-apirow ${on ? '' : 'off'}`}>
              <img src={resolveUpload(cur.img || c.img)} alt="" loading="lazy" />
              <div className="adm-apiinfo">
                <b>{c.n}</b>
                <small>{c.slug} · {c.a} · {c.nivel} · {c.lecciones} lec · {c.est} est</small>
                <div className="adm-apirow2">
                  <label>Precio $ <input type="number" min="0" value={cur.p ?? ''} placeholder={c.p} onChange={e => setOv(c.slug, { p: e.target.value === '' ? undefined : Number(e.target.value) })} /></label>
                  {tab === 'es'
                    ? <label>Tag ES <input value={cur.tag_es || ''} placeholder={c.tag} onChange={e => setOv(c.slug, { tag_es: e.target.value })} /></label>
                    : <label>Tag EN <input value={cur.tag_en || ''} placeholder={c.tag} onChange={e => setOv(c.slug, { tag_en: e.target.value })} /></label>}
                </div>
                {on && <label className="adm-imgline">Imagen <input value={cur.img || ''} placeholder="(del catálogo)" onChange={e => setOv(c.slug, { img: e.target.value })} /></label>}
                {on && <ImgPick value={cur.img || c.img} onChange={v => setOv(c.slug, { img: v })} {...imgEditScaleOnly({ img: cur.img || c.img, imgCfg: cur.imgCfg }, (p) => setOv(c.slug, { imgCfg: p.imgCfg }), `Curso ${c.n} - Edición de Imagen`)} />}
              </div>
              <button type="button" className={`adm-switch ${on ? 'on' : ''}`} onClick={() => setOv(c.slug, { activo: !on })} title={on ? 'Activo — clic para desactivar' : 'Desactivado — clic para activar'}>
                <i />{on ? 'ON' : 'OFF'}
              </button>
            </div>
          )
        })}
        {!list.length && !loading && <small className="adm-note">Sin cursos para “{q}”.</small>}
      </div>
    </div>
  )
}

export function CursosEditor({ draft, onDraft, sec }) {
  const set = (patch) => onDraft({ ...draft, ...patch })
  const fmt = draft.fmt || {}
  const setFmt = (k, v) => onDraft({ ...draft, fmt: { ...fmt, [k]: v } })
  return (
    <div className="adm-page">
      {sec === 'hero' && (<>
        <HeroForm o={draft.hero || {}} onChange={v => set({ hero: v })} fmt={fmt} setFmt={setFmt} />
        <StatsForm o={draft.stats || {}} onChange={v => set({ stats: v })} />
      </>)}
      {sec === 'tracks' && <TracksForm arr={draft.tracks || []} onChange={v => set({ tracks: v })} fmt={fmt} setFmt={setFmt} />}
      {sec === 'api' && <ApiForm o={draft} onChange={v => onDraft(v)} />}
      {sec === 'toolbar' && <HeadEsEn o={draft.toolbar || {}} onChange={v => set({ toolbar: v })} keys={['modLabel', 'ordLabel']} prefix="cur.toolbar" fmt={fmt} setFmt={setFmt} area={false} />}
      {sec === 'empty' && <HeadEsEn o={draft.empty || {}} onChange={v => set({ empty: v })} keys={['t', 'p', 'btn']} prefix="cur.empty" fmt={fmt} setFmt={setFmt} />}
      {sec === 'cta' && <HeadEsEn o={draft.cta || {}} onChange={v => set({ cta: v })} keys={['t', 'p1', 'p2', 'btn']} prefix="cur.cta" fmt={fmt} setFmt={setFmt} />}
      {sec === 'icons' && <IconsForm page="cursosPage" value={draft.icons || {}} onChange={v => set({ icons: v })} />}
    </div>
  )
}

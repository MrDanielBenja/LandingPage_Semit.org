import { useRef, useState } from 'react'
import { arrOf } from '../../core/cms/safe'
import { acceptFor, IMAGE_MAX_MB, isVideoUrl, VIDEO_MAX_MB } from '../../core/cms/media'
import { DEFAULT_INICIO, INICIO_ASSETS } from '../../core/cms/defaultInicio'
import { resolveUpload, uploadMedia } from './adminUpload'

export function Row({ label, children }) {
  return <div className="adm-row"><span>{label}</span>{children}</div>
}

export function FmtCtl({ label, value, onChange }) {
  const v = value || {}
  const set = (k, val) => onChange({ ...v, [k]: val })
  const tog = (k) => onChange({ ...v, [k]: !v[k] })
  return (
    <div className="adm-row"><span>{label || 'Formato'}</span>
      <div className="adm-fmt">
        <input type="number" min="10" max="120" value={v.size || ''} placeholder="px" title="Tamaño px" onChange={e => set('size', Number(e.target.value) || undefined)} />
        <input type="color" value={v.color || '#000000'} title="Color" onChange={e => set('color', e.target.value)} />
        <button type="button" className={v.b ? 'on' : ''} onClick={() => tog('b')} title="Negrita"><b>B</b></button>
        <button type="button" className={v.i ? 'on' : ''} onClick={() => tog('i')} title="Cursiva"><i>I</i></button>
        <button type="button" className={v.u ? 'on' : ''} onClick={() => tog('u')} title="Subrayado"><u>U</u></button>
        <button type="button" className={v.align === 'left' ? 'on' : ''} onClick={() => set('align', 'left')} title="Izquierda">⇤</button>
        <button type="button" className={!v.align || v.align === 'center' ? 'on' : ''} onClick={() => set('align', 'center')} title="Centrado">≡</button>
        <button type="button" className={v.align === 'right' ? 'on' : ''} onClick={() => set('align', 'right')} title="Derecha">⇥</button>
        <button type="button" className={v.align === 'justify' ? 'on' : ''} onClick={() => set('align', 'justify')} title="Justificado">≣</button>
      </div>
    </div>
  )
}

function PosCtl({ label, value, onChange }) {
  const v = Number(value ?? 50)
  const step = (d) => onChange(Math.min(100, Math.max(0, v + d)))
  return (
    <div className="adm-row"><span>{label}</span>
      <div className="adm-posctl">
        <button type="button" onClick={() => step(-5)} aria-label="subir">−</button>
        <input type="range" min="0" max="100" value={v} onChange={e => onChange(Number(e.target.value))} />
        <button type="button" onClick={() => step(5)} aria-label="bajar">+</button>
        <input type="number" min="0" max="100" value={v} onChange={e => onChange(Math.min(100, Math.max(0, Number(e.target.value))))} />
        <b>%</b>
      </div>
    </div>
  )
}

function FramePreview({ s }) {
  const img = !s.img ? '' : s.img.startsWith('data:') ? s.img : resolveUpload(s.img)
  if (isVideoUrl(s.img)) {
    return (
      <div className="adm-frame">
        <video src={img} controls preload="metadata" style={{ width: '100%', borderRadius: 8 }} />
        <span>Video de fondo · se reproduce solo y sin sonido en el sitio</span>
      </div>
    )
  }
  return (
    <div className="adm-frame" style={{ backgroundImage: `url('${img}')`, backgroundSize: s.fit || 'cover', backgroundPosition: `${s.posX ?? 50}% ${s.posY ?? 50}%` }}>
      <span>Encuadre · {s.posX ?? 50}% / {s.posY ?? 50}%</span>
    </div>
  )
}

export function ImgPick({ value, onChange, assets, kinds = 'image' }) {
  const [up, setUp] = useState('')
  const fileRef = useRef(null)
  const prev = !value ? '' : value.startsWith('data:') ? value : resolveUpload(value)
  const isVid = isVideoUrl(value)
  const list = assets || INICIO_ASSETS
  const imgHint = Number.isFinite(IMAGE_MAX_MB) ? `≤${IMAGE_MAX_MB}MB` : 'sin límite'
  const hint = kinds === 'image'
    ? `Subir imagen (JPG/PNG/WebP/GIF/AVIF ${imgHint})`
    : kinds === 'video'
      ? `Subir video (MP4/WebM/OGG ≤${VIDEO_MAX_MB}MB)`
      : `Subir imagen o video (img ${imgHint} · video ≤${VIDEO_MAX_MB}MB)`
  const pick = async (f) => {
    if (!f) return
    setUp('Subiendo…')
    try {
      const r = await uploadMedia(f, kinds)
      onChange(r.url)
      setUp(r.warn ? `Guardada local ✓ (${r.warn})` : `Subida ✓ ${r.kind === 'video' ? '🎬' : '🖼️'}`)
    } catch (e) {
      setUp(`Error: ${e.message}`)
    }
  }
  return (
    <div className="adm-imgpick">
      <div className="adm-thumbs">
        {list.map(a => (
          <button key={a} type="button" className={value === a ? 'on' : ''} onClick={() => onChange(a)}>
            <img src={a} alt="" loading="lazy" />
          </button>
        ))}
      </div>
      <div className="adm-imgsrc">
        <input value={value || ''} onChange={e => onChange(e.target.value)} placeholder="assets/inicio/… o URL" />
        <button type="button" className="btn btn-line" onClick={() => fileRef.current?.click()}>{hint}</button>
        <input ref={fileRef} type="file" accept={acceptFor(kinds)} hidden onChange={e => pick(e.target.files[0])} />
      </div>
      {prev ? (isVid
        ? <video className="adm-prev" src={prev} controls preload="metadata" />
        : <img className="adm-prev" src={prev} alt="" />) : <small className="adm-note">Sin imagen</small>}
      {up && <small className="adm-note">{up}</small>}
    </div>
  )
}

function SlideForm({ s, onChange }) {
  const [tab, setTab] = useState('es')
  const set = (k, v) => onChange({ ...s, [k]: v })
  return (
    <div className="adm-form">
      <div className="adm-tabs">
        <button type="button" className={tab === 'es' ? 'on' : ''} onClick={() => setTab('es')}>🇪🇸 ES</button>
        <button type="button" className={tab === 'en' ? 'on' : ''} onClick={() => setTab('en')}>🇬🇧 EN</button>
      </div>
      {tab === 'es' ? (<>
        <Row label="Título ES"><input value={s.t_es} onChange={e => set('t_es', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={s.ft} onChange={v => set('ft', v)} />
        <Row label="Subtítulo ES"><input value={s.s_es} onChange={e => set('s_es', e.target.value)} /></Row>
        <FmtCtl label="Formato subtítulo" value={s.fs} onChange={v => set('fs', v)} />
      </>) : (<>
        <Row label="Title EN"><input value={s.t_en} onChange={e => set('t_en', e.target.value)} /></Row>
        <FmtCtl label="Formato título" value={s.ft} onChange={v => set('ft', v)} />
        <Row label="Subtitle EN"><input value={s.s_en} onChange={e => set('s_en', e.target.value)} /></Row>
        <FmtCtl label="Formato subtítulo" value={s.fs} onChange={v => set('fs', v)} />
      </>)}
      <Row label="Imagen o video"><ImgPick value={s.img} onChange={v => set('img', v)} kinds="both" /></Row>
      <FramePreview s={s} />
      <div className="adm-grid2">
        <Row label="Ajuste"><select value={s.fit} onChange={e => set('fit', e.target.value)}><option value="cover">cover</option><option value="contain">contain</option></select></Row>
        <Row label="Alto px"><input type="number" min="320" max="1200" value={s.h} onChange={e => set('h', Number(e.target.value))} /></Row>
      </div>
      <PosCtl label="Pos X %" value={s.posX} onChange={v => set('posX', v)} />
      <PosCtl label="Pos Y % (subir/bajar)" value={s.posY} onChange={v => set('posY', v)} />
      <div className="adm-grid3">
        <Row label="Overlay"><input type="color" value={/^#/.test(s.overlay) ? s.overlay : '#000000'} onChange={e => set('overlay', e.target.value)} /><input value={s.overlay} onChange={e => set('overlay', e.target.value)} /></Row>
        <Row label="Texto"><input type="color" value={s.textColor} onChange={e => set('textColor', e.target.value)} /></Row>
        <Row label="Pill bg"><input type="color" value={s.pillBg || '#ffffff'} onChange={e => set('pillBg', e.target.value)} /></Row>
      </div>
      <Row label="Pill texto"><input type="color" value={s.pillColor || '#ffffff'} onChange={e => set('pillColor', e.target.value)} /></Row>
    </div>
  )
}

function TestiForm({ x, onChange }) {
  const [tab, setTab] = useState('es')
  const set = (k, v) => onChange({ ...x, [k]: v })
  return (
    <div className="adm-form">
      <div className="adm-tabs">
        <button type="button" className={tab === 'es' ? 'on' : ''} onClick={() => setTab('es')}>🇪🇸 ES</button>
        <button type="button" className={tab === 'en' ? 'on' : ''} onClick={() => setTab('en')}>🇬🇧 EN</button>
      </div>
      <Row label="Nombre"><input value={x.n} onChange={e => set('n', e.target.value)} /></Row>
      <FmtCtl label="Formato nombre" value={x.fn} onChange={v => set('fn', v)} />
      {tab === 'es'
        ? <><Row label="Texto ES"><textarea rows={3} value={x.t_es} onChange={e => set('t_es', e.target.value)} /></Row>
        <FmtCtl label="Formato texto" value={x.ft} onChange={v => set('ft', v)} /></>
        : <><Row label="Text EN"><textarea rows={3} value={x.t_en} onChange={e => set('t_en', e.target.value)} /></Row>
        <FmtCtl label="Formato texto" value={x.ft} onChange={v => set('ft', v)} /></>}
      <Row label="Foto"><ImgPick value={x.img} onChange={v => set('img', v)} /></Row>
      <div className="adm-grid3">
        <Row label="Tamaño px"><input type="number" min="32" max="160" value={x.size} onChange={e => set('size', Number(e.target.value))} /></Row>
        <Row label="Fondo"><input type="color" value={x.bg} onChange={e => set('bg', e.target.value)} /></Row>
        <Row label="Texto"><input type="color" value={x.textColor} onChange={e => set('textColor', e.target.value)} /></Row>
      </div>
    </div>
  )
}

function EsEn({ es, en, onEs, onEn, labels }) {
  const [tab, setTab] = useState('es')
  return (<>
    <div className="adm-tabs">
      <button type="button" className={tab === 'es' ? 'on' : ''} onClick={() => setTab('es')}>🇪🇸 ES</button>
      <button type="button" className={tab === 'en' ? 'on' : ''} onClick={() => setTab('en')}>🇬🇧 EN</button>
    </div>
    {Object.keys(es).map(k => tab === 'es'
      ? <Row key={k} label={`${labels[k] || k} ES`}><input value={es[k] || ''} onChange={e => onEs(k, e.target.value)} /></Row>
      : null)}
    {Object.keys(en).map(k => tab === 'en'
      ? <Row key={k} label={`${labels[k] || k} EN`}><input value={en[k] || ''} onChange={e => onEn(k, e.target.value)} /></Row>
      : null)}
  </>)
}

function IntroForm({ it, onChange, fmt, setFmt }) {
  const [tab, setTab] = useState('es')
  const set = (k, v) => onChange({ ...it, [k]: v })
  const F = ['pill', 'h2', 'p', 'pt1t', 'pt1d', 'pt2t', 'pt2d', 'pt3t', 'pt3d']
  return (
    <div className="adm-form">
      <div className="adm-tabs">
        <button type="button" className={tab === 'es' ? 'on' : ''} onClick={() => setTab('es')}>🇪🇸 ES</button>
        <button type="button" className={tab === 'en' ? 'on' : ''} onClick={() => setTab('en')}>🇬🇧 EN</button>
      </div>
      {F.map(k => tab === 'es'
        ? <div key={k}><Row label={`${k} ES`}><input value={it[`${k}_es`] || ''} onChange={e => set(`${k}_es`, e.target.value)} /></Row>
          <FmtCtl label={`Fmt ${k}`} value={fmt?.[`intro.${k}`]} onChange={v => setFmt(`intro.${k}`, v)} /></div>
        : <div key={k}><Row label={`${k} EN`}><input value={it[`${k}_en`] || ''} onChange={e => set(`${k}_en`, e.target.value)} /></Row>
          <FmtCtl label={`Fmt ${k}`} value={fmt?.[`intro.${k}`]} onChange={v => setFmt(`intro.${k}`, v)} /></div>)}
      {arrOf(it.imgs).map((im, k) => (
        <Row key={k} label={`Imagen ${k + 1}`}><ImgPick value={im} onChange={v => set('imgs', arrOf(it.imgs).map((x, j) => (j === k ? v : x)))} /></Row>
      ))}
      <div className="adm-grid3">
        <Row label="Fondo"><input type="color" value={it.bg || '#ffffff'} onChange={e => set('bg', e.target.value)} /></Row>
        <Row label="Títulos"><input type="color" value={it.headingColor || '#1d1d1f'} onChange={e => set('headingColor', e.target.value)} /></Row>
        <Row label="Texto"><input type="color" value={it.textColor || '#424245'} onChange={e => set('textColor', e.target.value)} /></Row>
      </div>
    </div>
  )
}

function ModsForm({ md, onChange, fmt, setFmt }) {
  const [tab, setTab] = useState('es')
  const [mi, setMi] = useState(0)
  const [hi, setHi] = useState(0)
  const set = (k, v) => onChange({ ...md, [k]: v })
  const items = arrOf(md.items)
  const m = items[mi] || {}
  const h = arrOf(m.hijos)[hi] || {}
  const updM = (patch) => onChange({ ...md, items: items.map((x, k) => (k === mi ? { ...x, ...patch } : x)) })
  const updH = (patch) => updM({ hijos: arrOf(m.hijos).map((x, k) => (k === hi ? { ...x, ...patch } : x)) })
  return (
    <div className="adm-form">
      <div className="adm-tabs">
        <button type="button" className={tab === 'es' ? 'on' : ''} onClick={() => setTab('es')}>🇪🇸 ES</button>
        <button type="button" className={tab === 'en' ? 'on' : ''} onClick={() => setTab('en')}>🇬🇧 EN</button>
      </div>
      {tab === 'es' ? (<>
        <Row label="Pill ES"><input value={md.pill_es || ''} onChange={e => set('pill_es', e.target.value)} /></Row>
        <FmtCtl label="Fmt pill" value={fmt?.['mods.pill']} onChange={v => setFmt('mods.pill', v)} />
        <Row label="Título ES"><input value={md.h2_es || ''} onChange={e => set('h2_es', e.target.value)} /></Row>
        <FmtCtl label="Fmt h2" value={fmt?.['mods.h2']} onChange={v => setFmt('mods.h2', v)} />
        <Row label="Sub ES"><input value={md.sub_es || ''} onChange={e => set('sub_es', e.target.value)} /></Row>
        <FmtCtl label="Fmt sub" value={fmt?.['mods.sub']} onChange={v => setFmt('mods.sub', v)} />
      </>) : (<>
        <Row label="Pill EN"><input value={md.pill_en || ''} onChange={e => set('pill_en', e.target.value)} /></Row>
        <FmtCtl label="Fmt pill" value={fmt?.['mods.pill']} onChange={v => setFmt('mods.pill', v)} />
        <Row label="Title EN"><input value={md.h2_en || ''} onChange={e => set('h2_en', e.target.value)} /></Row>
        <FmtCtl label="Fmt h2" value={fmt?.['mods.h2']} onChange={v => setFmt('mods.h2', v)} />
        <Row label="Sub EN"><input value={md.sub_en || ''} onChange={e => set('sub_en', e.target.value)} /></Row>
        <FmtCtl label="Fmt sub" value={fmt?.['mods.sub']} onChange={v => setFmt('mods.sub', v)} />
      </>)}
      <Row label="Fondo"><input type="color" value={md.bg || '#ffffff'} onChange={e => set('bg', e.target.value)} /></Row>
      <Row label="Modalidad"><select value={mi} onChange={e => { setMi(Number(e.target.value)); setHi(0) }}>{items.map((x, k) => <option key={x.id} value={k}>{x.id}</option>)}</select></Row>
      {m && (<>
        {tab === 'es' ? (<>
          <Row label="Nombre ES"><input value={m.t_es || ''} onChange={e => updM({ t_es: e.target.value })} /></Row>
          <FmtCtl label="Fmt item título" value={fmt?.['mods.itemt']} onChange={v => setFmt('mods.itemt', v)} />
          <Row label="Desc ES"><input value={m.d_es || ''} onChange={e => updM({ d_es: e.target.value })} /></Row>
          <FmtCtl label="Fmt item desc" value={fmt?.['mods.itemd']} onChange={v => setFmt('mods.itemd', v)} />
        </>) : (<>
          <Row label="Name EN"><input value={m.t_en || ''} onChange={e => updM({ t_en: e.target.value })} /></Row>
          <FmtCtl label="Fmt item título" value={fmt?.['mods.itemt']} onChange={v => setFmt('mods.itemt', v)} />
          <Row label="Desc EN"><input value={m.d_en || ''} onChange={e => updM({ d_en: e.target.value })} /></Row>
          <FmtCtl label="Fmt item desc" value={fmt?.['mods.itemd']} onChange={v => setFmt('mods.itemd', v)} />
        </>)}
        <Row label="Foto modalidad"><ImgPick value={m.img} onChange={v => updM({ img: v })} /></Row>
        <Row label="Hijo"><select value={hi} onChange={e => setHi(Number(e.target.value))}>{arrOf(m.hijos).map((x, k) => <option key={k} value={k}>{x.t_es || `Hijo ${k + 1}`}</option>)}</select></Row>
        {h && (<>
          {tab === 'es' ? (<>
            <Row label="Hijo título ES"><input value={h.t_es || ''} onChange={e => updH({ t_es: e.target.value })} /></Row>
            <FmtCtl label="Fmt hijo título" value={fmt?.['mods.hijot']} onChange={v => setFmt('mods.hijot', v)} />
            <Row label="Hijo desc ES"><input value={h.d_es || ''} onChange={e => updH({ d_es: e.target.value })} /></Row>
            <FmtCtl label="Fmt hijo desc" value={fmt?.['mods.hijod']} onChange={v => setFmt('mods.hijod', v)} />
          </>) : (<>
            <Row label="Child title EN"><input value={h.t_en || ''} onChange={e => updH({ t_en: e.target.value })} /></Row>
            <FmtCtl label="Fmt hijo título" value={fmt?.['mods.hijot']} onChange={v => setFmt('mods.hijot', v)} />
            <Row label="Child desc EN"><input value={h.d_en || ''} onChange={e => updH({ d_en: e.target.value })} /></Row>
            <FmtCtl label="Fmt hijo desc" value={fmt?.['mods.hijod']} onChange={v => setFmt('mods.hijod', v)} />
          </>)}
          <Row label="Foto hijo"><ImgPick value={h.img} onChange={v => updH({ img: v })} /></Row>
        </>)}
      </>)}
    </div>
  )
}

function HeadForm({ o, onChange, keys, colors, prefix, fmt, setFmt }) {
  const [tab, setTab] = useState('es')
  const set = (k, v) => onChange({ ...o, [k]: v })
  return (
    <div className="adm-form">
      <div className="adm-tabs">
        <button type="button" className={tab === 'es' ? 'on' : ''} onClick={() => setTab('es')}>🇪🇸 ES</button>
        <button type="button" className={tab === 'en' ? 'on' : ''} onClick={() => setTab('en')}>🇬🇧 EN</button>
      </div>
      {keys.map(k => tab === 'es'
        ? <div key={k}><Row label={`${k} ES`}><input value={o[`${k}_es`] || ''} onChange={e => set(`${k}_es`, e.target.value)} /></Row>
          {prefix && <FmtCtl label={`Fmt ${k}`} value={fmt?.[`${prefix}.${k}`]} onChange={v => setFmt(`${prefix}.${k}`, v)} />}</div>
        : <div key={k}><Row label={`${k} EN`}><input value={o[`${k}_en`] || ''} onChange={e => set(`${k}_en`, e.target.value)} /></Row>
          {prefix && <FmtCtl label={`Fmt ${k}`} value={fmt?.[`${prefix}.${k}`]} onChange={v => setFmt(`${prefix}.${k}`, v)} />}</div>)}
      {colors && <Row label="Fondo"><input type="color" value={o.bg || '#ffffff'} onChange={e => set('bg', e.target.value)} /></Row>}
    </div>
  )
}

export function InicioEditor({ draft, onDraft, sec, sel, onSel }) {
  const [newsTab, setNewsTab] = useState('es')
  const slides = arrOf(draft.slides)
  const testis = arrOf(draft.testimonios)
  const cur = sec === 'slides' ? slides[sel] : testis[sel]
  const updCur = (next) => {
    if (sec === 'slides') onDraft({ ...draft, slides: slides.map((s, k) => (k === sel ? next : s)) })
    else onDraft({ ...draft, testimonios: testis.map((x, k) => (k === sel ? next : x)) })
  }
  const add = () => {
    if (sec === 'slides') {
      onDraft({ ...draft, slides: [...slides, { id: `s${Date.now()}`, t_es: 'Nuevo', t_en: 'New', s_es: '', s_en: '', img: INICIO_ASSETS[0], fit: 'cover', h: 640, posX: 50, posY: 50, overlay: 'rgba(0,0,0,.5)', textColor: '#ffffff', pillBg: '', pillColor: '' }] })
      onSel(slides.length)
    } else {
      onDraft({ ...draft, testimonios: [...testis, { id: `t${Date.now()}`, n: 'Nuevo', t_es: '', t_en: '', img: INICIO_ASSETS[4], size: 56, bg: '#ffffff', textColor: '#1d1d1f' }] })
      onSel(testis.length)
    }
  }
  const del = () => {
    if (sec === 'slides' && slides.length > 1) { onDraft({ ...draft, slides: slides.filter((_, k) => k !== sel) }); onSel(0) }
    if (sec === 'testis' && testis.length > 1) { onDraft({ ...draft, testimonios: testis.filter((_, k) => k !== sel) }); onSel(0) }
  }
  const hero = draft.hero || {}
  const news = draft.news || {}
  const sections = draft.sections || {}
  const set = (patch) => onDraft({ ...draft, ...patch })
  const fmt = draft.fmt || {}
  const setFmt = (k, v) => onDraft({ ...draft, fmt: { ...(draft.fmt || {}), [k]: v } })
  return (
    <div className="adm-page">
      {(sec === 'slides' || sec === 'testis') && (<>
        <div className="adm-chips">
          {(sec === 'slides' ? slides : testis).map((x, k) => (
            <button key={x.id || k} className={k === sel ? 'on' : ''} onClick={() => onSel(k)}>
              <img src={resolveUpload(x.img)} alt="" loading="lazy" />
              <span>{sec === 'slides' ? (x.t_es || `Slide ${k + 1}`) : (x.n || `Testimonio ${k + 1}`)}</span>
            </button>
          ))}
        </div>
        <div className="adm-listops">
          <button className="btn btn-line" onClick={add}>+ Agregar</button>
          <button className="btn btn-line" onClick={del}>− Quitar</button>
        </div>
        <div className="adm-detail">
          {cur && (sec === 'slides' ? <SlideForm s={cur} onChange={updCur} /> : <TestiForm x={cur} onChange={updCur} />)}
        </div>
      </>)}
      {sec === 'hero' && (
        <div className="adm-form">
          <Row label="Alto hero px"><input type="number" min="320" max="1200" value={hero.h} onChange={e => set({ hero: { ...hero, h: Number(e.target.value) } })} /></Row>
          <Row label="Overlay global"><input value={hero.overlay} onChange={e => set({ hero: { ...hero, overlay: e.target.value } })} /></Row>
          <Row label="Color texto"><input type="color" value={hero.textColor} onChange={e => set({ hero: { ...hero, textColor: e.target.value } })} /></Row>
          <Row label="Fondo portada"><input type="color" value={sections.portadaBg} onChange={e => set({ sections: { ...sections, portadaBg: e.target.value } })} /></Row>
          <Row label="Fondo testimonios"><input type="color" value={sections.testiBg} onChange={e => set({ sections: { ...sections, testiBg: e.target.value } })} /></Row>
        </div>
      )}
      {sec === 'news' && (
        <div className="adm-form">
          <div className="adm-tabs">
            <button type="button" className={newsTab === 'es' ? 'on' : ''} onClick={() => setNewsTab('es')}>🇪🇸 ES</button>
            <button type="button" className={newsTab === 'en' ? 'on' : ''} onClick={() => setNewsTab('en')}>🇬🇧 EN</button>
          </div>
          {newsTab === 'es' ? (<>
            <Row label="Título ES"><input value={news.h_es || ''} onChange={e => set({ news: { ...news, h_es: e.target.value } })} /></Row>
            <FmtCtl label="Fmt título" value={fmt['news.h']} onChange={v => setFmt('news.h', v)} />
            <Row label="Texto ES"><input value={news.p_es || ''} onChange={e => set({ news: { ...news, p_es: e.target.value } })} /></Row>
            <FmtCtl label="Fmt texto" value={fmt['news.p']} onChange={v => setFmt('news.p', v)} />
            <Row label="Placeholder ES"><input value={news.ph_es || ''} onChange={e => set({ news: { ...news, ph_es: e.target.value } })} /></Row>
            <Row label="Botón ES"><input value={news.btn_es || ''} onChange={e => set({ news: { ...news, btn_es: e.target.value } })} /></Row>
          </>) : (<>
            <Row label="Title EN"><input value={news.h_en || ''} onChange={e => set({ news: { ...news, h_en: e.target.value } })} /></Row>
            <FmtCtl label="Fmt título" value={fmt['news.h']} onChange={v => setFmt('news.h', v)} />
            <Row label="Text EN"><input value={news.p_en || ''} onChange={e => set({ news: { ...news, p_en: e.target.value } })} /></Row>
            <FmtCtl label="Fmt texto" value={fmt['news.p']} onChange={v => setFmt('news.p', v)} />
            <Row label="Placeholder EN"><input value={news.ph_en || ''} onChange={e => set({ news: { ...news, ph_en: e.target.value } })} /></Row>
            <Row label="Button EN"><input value={news.btn_en || ''} onChange={e => set({ news: { ...news, btn_en: e.target.value } })} /></Row>
          </>)}
          <Row label="Fondo newsletter"><input type="color" value={news.bg} onChange={e => set({ news: { ...news, bg: e.target.value } })} /></Row>
        </div>
      )}
      {sec === 'intro' && <IntroForm it={draft.intro || {}} onChange={v => set({ intro: v })} fmt={fmt} setFmt={setFmt} />}
      {sec === 'mods' && <ModsForm md={draft.mods || {}} onChange={v => set({ mods: v })} fmt={fmt} setFmt={setFmt} />}
      {sec === 'ruta' && <HeadForm o={draft.ruta || {}} onChange={v => set({ ruta: v })} keys={['pill', 'h2', 'sub']} colors prefix="ruta" fmt={fmt} setFmt={setFmt} />}
      {sec === 'top' && (
        <div className="adm-form">
          <HeadForm o={draft.top || {}} onChange={v => set({ top: v })} keys={['pill', 'h2', 'sub']} colors={false} prefix="top" fmt={fmt} setFmt={setFmt} />
          <Row label="Cuántos mostrar"><input type="number" min="1" max="12" value={draft.top?.count || 4} onChange={e => set({ top: { ...(draft.top || {}), count: Number(e.target.value) } })} /></Row>
          <Row label="Fondo"><input type="color" value={draft.top?.bg || '#ffffff'} onChange={e => set({ top: { ...(draft.top || {}), bg: e.target.value } })} /></Row>
        </div>
      )}
      {sec === 'teaser' && <HeadForm o={draft.teaser || {}} onChange={v => set({ teaser: v })} keys={['pill']} colors prefix="teaser" fmt={fmt} setFmt={setFmt} />}
      {sec === 'marquee' && (
        <div className="adm-form">
          <Row label="Texto ES"><input value={draft.marquee?.text_es || ''} onChange={e => set({ marquee: { ...(draft.marquee || {}), text_es: e.target.value } })} /></Row>
          <Row label="Text EN"><input value={draft.marquee?.text_en || ''} onChange={e => set({ marquee: { ...(draft.marquee || {}), text_en: e.target.value } })} /></Row>
          <FmtCtl label="Fmt texto" value={fmt['marquee.text']} onChange={v => setFmt('marquee.text', v)} />
          <Row label="Fondo"><input type="color" value={draft.marquee?.bg || '#1d1d1f'} onChange={e => set({ marquee: { ...(draft.marquee || {}), bg: e.target.value } })} /></Row>
          <Row label="Texto color"><input type="color" value={draft.marquee?.color || '#ffffff'} onChange={e => set({ marquee: { ...(draft.marquee || {}), color: e.target.value } })} /></Row>
        </div>
      )}
    </div>
  )
}

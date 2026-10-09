import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminGate } from './AdminGate'
import { InicioEditor } from './InicioEditor'
import { NosotrosEditor } from './NosotrosEditor'
import { NivelesEditor } from './NivelesEditor'
import { CursosEditor } from './CursosEditor'
import { EventosEditor } from './EventosEditor'
import { ContactoEditor } from './ContactoEditor'
import { SiteEditor } from './SiteEditor'
import { BackupPanel } from './BackupPanel'
import { Portada } from '../home/components/Portada'
import { SeminarioIntro } from '../home/components/SeminarioIntro'
import { Modalidades } from '../home/components/Modalidades'
import { RutaNiveles } from '../home/components/RutaNiveles'
import { CursosTop } from '../home/components/CursosTop'
import { EventoTeaser } from '../home/components/EventoTeaser'
import { Testimonios } from '../home/components/Testimonios'
import { Newsletter } from '../home/components/Newsletter'
import { HomePage } from '../home/HomePage'
import { NosotrosPage } from '../nosotros/NosotrosPage'
import { QuienesSomos } from '../nosotros/components/QuienesSomos'
import { Funciones } from '../nosotros/components/Funciones'
import { DeclaracionFe } from '../nosotros/components/DeclaracionFe'
import { Equipo } from '../nosotros/components/Equipo'
import { NivelesPage } from '../niveles/NivelesPage'
import { CursosPage } from '../cursos/CursosPage'
import { EventosPage } from '../eventos/EventosPage'
import { ContactoPage } from '../contacto/ContactoPage'
import { Nav } from '../../app/layout/Nav'
import { Footer } from '../../app/layout/Footer'
import { useContent } from '../../core/cms/contentStore'
import { DEFAULT_INICIO } from '../../core/cms/defaultInicio'
import { DEFAULT_NOSOTROS } from '../../core/cms/defaultNosotros'
import { DEFAULT_NIVELES } from '../../core/cms/defaultNiveles'
import { DEFAULT_CURSOS_PAGE } from '../../core/cms/defaultCursosPage'
import { DEFAULT_EVENTOS } from '../../core/cms/defaultEventos'
import { DEFAULT_CONTACTO } from '../../core/cms/defaultContacto'
import { DEFAULT_SITE } from '../../core/cms/defaultSite'
import { useLang } from '../../app/providers/LangProvider'
import { changePassword, currentUser, logout } from './adminAuth'

const PAGES = [
  { id: 'inicio', label: '🏠 Inicio' },
  { id: 'nosotros', label: '🏛️ Nosotros' },
  { id: 'niveles', label: '📶 Niveles' },
  { id: 'cursos', label: '🎓 Cursos' },
  { id: 'eventos', label: '🎉 Eventos' },
  { id: 'contacto', label: '💬 Contacto' },
  { id: 'site', label: '🧭 Nav+Pie' },
  { id: 'backup', label: '💾 Respaldo' },
]

const SECS = {
  inicio: [
    { id: 'slides', label: '🖼️ Slides' },
    { id: 'intro', label: '🌍 Intro' },
    { id: 'mods', label: '🗂️ Modalidades' },
    { id: 'ruta', label: '🛤️ Ruta' },
    { id: 'top', label: '🔥 Top cursos' },
    { id: 'teaser', label: '🎉 Teaser' },
    { id: 'testis', label: '💬 Testimonios' },
    { id: 'news', label: '📩 Newsletter' },
    { id: 'marquee', label: '✦ Marquesina' },
    { id: 'hero', label: '🎨 Hero' },
    { id: 'icons', label: '🎨 Iconos' },
  ],
  nosotros: [
    { id: 'hero', label: '🎨 Hero' },
    { id: 'quienes', label: '🏛️ Quiénes' },
    { id: 'funcs', label: '⚙️ Funciones' },
    { id: 'fe', label: '✝️ Fe' },
    { id: 'equipo', label: '👥 Equipo' },
    { id: 'icons', label: '🎨 Iconos' },
  ],
  niveles: [
    { id: 'hero', label: '🎨 Hero' },
    { id: 'ramas', label: '🎓 Ramas' },
    { id: 'subs', label: '📚 Subs' },
    { id: 'maestrias', label: '👑 Maestrías' },
    { id: 'ruta', label: '🛤️ Ruta (home)' },
    { id: 'programas', label: '📖 Programas' },
    { id: 'icons', label: '🎨 Iconos' },
  ],
  cursos: [
    { id: 'hero', label: '🎨 Hero' },
    { id: 'tracks', label: '🗂️ Áreas' },
    { id: 'api', label: '🔌 API' },
    { id: 'toolbar', label: '🔧 Barra' },
    { id: 'empty', label: '🈳 Vacío' },
    { id: 'cta', label: '📣 CTA' },
    { id: 'icons', label: '🎨 Iconos' },
  ],
  eventos: [
    { id: 'hero', label: '🎨 Hero' },
    { id: 'secs', label: '🗂️ Secciones' },
    { id: 'cats', label: '🏷️ Categorías' },
    { id: 'eventos', label: '🎉 Eventos' },
    { id: 'bcb', label: '🔥 BCB' },
    { id: 'cta', label: '📣 CTA' },
    { id: 'icons', label: '🎨 Iconos' },
  ],
  contacto: [
    { id: 'hero', label: '🎨 Hero' },
    { id: 'canales', label: '🗂️ Canales' },
    { id: 'asuntos', label: '🎯 Asuntos' },
    { id: 'faqs', label: '❓ FAQs' },
    { id: 'horario', label: '🕒 Horario' },
    { id: 'sede', label: '📍 Sede' },
    { id: 'form', label: '📝 Formulario' },
    { id: 'icons', label: '🎨 Iconos' },
  ],
  site: [
    { id: 'site', label: '🧭 Datos' },
    { id: 'nav', label: '🔗 Menú' },
    { id: 'footer', label: '🦶 Pie' },
  ],
  backup: [
    { id: 'todo', label: '💾 Todo' },
  ],
}

const DEFAULTS = { inicio: DEFAULT_INICIO, nosotros: DEFAULT_NOSOTROS, niveles: DEFAULT_NIVELES, cursos: DEFAULT_CURSOS_PAGE, eventos: DEFAULT_EVENTOS, contacto: DEFAULT_CONTACTO, site: DEFAULT_SITE, backup: DEFAULT_SITE }
const FIRST_SEC = { inicio: 'slides', nosotros: 'hero', niveles: 'hero', cursos: 'hero', eventos: 'hero', contacto: 'hero', site: 'site', backup: 'todo' }

function useAllContents() {
  const inicio = useContent('inicio', DEFAULT_INICIO)
  const nosotros = useContent('nosotros', DEFAULT_NOSOTROS)
  const niveles = useContent('niveles', DEFAULT_NIVELES)
  const cursos = useContent('cursosPage', DEFAULT_CURSOS_PAGE)
  const eventos = useContent('eventos', DEFAULT_EVENTOS)
  const contacto = useContent('contacto', DEFAULT_CONTACTO)
  const site = useContent('site', DEFAULT_SITE)
  const map = { inicio, nosotros, niveles, cursos, eventos, contacto, site }
  return map
}

function usePageContent(page, all) {
  return (all && all[page]) || all.inicio
}

export function AdminPage() {
  const [page, setPage] = useState('inicio')
  const [secSel, setSecSel] = useState('slides')
  const [sel, setSel] = useState(0)
  const [view, setView] = useState('web')
  const [wide, setWide] = useState(false)
  const [msg, setMsg] = useState('')
  const nav = useNavigate()
  const { lang, setLang } = useLang()
  const allContents = useAllContents()
  const { data, source, saving, save, reset } = usePageContent(page, allContents)
  const DEF = DEFAULTS[page] || DEFAULT_INICIO
  const [draft, setDraft] = useState(data)
  const baseRef = useRef(JSON.stringify(data))
  const SECSLIST = SECS[page] || []
  const sec = SECSLIST.some(s => s.id === secSel) ? secSel : (FIRST_SEC[page] || 'hero')

  useEffect(() => {
    setDraft(data)
    baseRef.current = JSON.stringify(data)
    setSecSel(FIRST_SEC[page] || 'hero')
    setSel(0)
    setMsg('')
  }, [page])

  useEffect(() => {
    const s = JSON.stringify(data)
    if (s !== baseRef.current && JSON.stringify(draft) === baseRef.current) setDraft(data)
    baseRef.current = s
  }, [data])

  const dirty = !!draft && JSON.stringify(draft) !== JSON.stringify(data)
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const doPass = async () => {
    const r = await changePassword(oldPass, newPass)
    setMsg(r.ok ? 'Clave cambiada ✓ entra de nuevo' : (r.error || 'No se pudo'))
    if (r.ok) { setOldPass(''); setNewPass(''); logout(); setTimeout(() => location.reload(), 1200) }
  }
  const publish = async () => {
    const r = await save(draft)
    if (!r.ok) { setMsg(`No se publicó: ${r.warn || 'error'}`); return }
    setMsg(r.warn ? `Publicado local (${r.warn})` : `Publicado ✓ ${r.source}`)
  }
  const discard = () => { setDraft(data); setMsg('Cambios descartados') }
  const resetAll = () => { reset(); setDraft(DEF); setMsg('Valores por defecto ✓') }
  const pos = draft?.slides?.[sel]

  return (
    <AdminGate>
      <div className="adm-shell">
        <header className="adm-topbar">
          <b>DirAdmin</b>
          <span className="adm-page-name">{PAGES.find(p => p.id === page).label}</span>
          <span className={`adm-dot ${dirty ? 'dirty' : ''}`} title={dirty ? 'Cambios sin publicar' : 'Todo publicado'} />
          <span className="adm-src">fuente: {source}{saving ? ' · guardando…' : ''}</span>
          <div className="adm-lang">
            <button className={lang === 'es' ? 'on' : ''} onClick={() => setLang('es')} title="Vista ES">🇪🇸</button>
            <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')} title="Vista EN">🇬🇧</button>
          </div>
          <div className="adm-view">
            <button className={view === 'web' ? 'on' : ''} onClick={() => setView('web')} title="Web 1280">🖥️</button>
            <button className={view === 'tablet' ? 'on' : ''} onClick={() => setView('tablet')} title="Tablet 768">📱</button>
            <button className={view === 'mobile' ? 'on' : ''} onClick={() => setView('mobile')} title="Móvil 390">📲</button>
          </div>
          <button className={`btn btn-line ${wide ? 'on' : ''}`} onClick={() => setWide(w => !w)} title="Oculta el panel derecho">{wide ? '⇥ Panel' : '⇤ Ancho'}</button>
          <button className="btn btn-line" disabled={!dirty} onClick={discard}>Descartar</button>
          <button className="btn btn-line" onClick={resetAll}>Restablecer</button>
          <button className="btn btn-blue" disabled={!dirty || saving} onClick={publish}>{saving ? 'Publicando…' : 'Publicar ✓'}</button>
          <button className="link-btn adm-top-link" onClick={() => nav('/')}>Ver sitio</button>
          <button className="link-btn adm-top-link" onClick={() => { logout(); location.reload() }}>Salir</button>
        </header>
        <div className={`adm-body ${wide ? 'wide' : ''}`}>
          <aside className="adm-side">
            {PAGES.map(p => (
              <button key={p.id} className={page === p.id ? 'on' : ''} onClick={() => { setPage(p.id); setSel(0); setSecSel(FIRST_SEC[p.id] || 'hero') }}>{p.label}</button>
            ))}
            <div className="adm-sub">
              <small>SECCIONES</small>
              {SECSLIST.map(s => (
                <button key={s.id} className={sec === s.id ? 'on' : ''} onClick={() => { setSecSel(s.id); setSel(0) }}>{s.label}</button>
              ))}
            </div>
            <div className="adm-sub">
              <small>👤 {currentUser() || 'admin'}</small>
              <input className="adm-apiinput" type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} placeholder="actual" title="Contraseña actual" />
              <input className="adm-apiinput" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="nueva (mín. 6)" title="Nueva contraseña" />
              <button onClick={doPass}>🔑 Cambiar clave</button>
            </div>
          </aside>
          <section className={`adm-preview view-${view}`}>
            <span className="adm-prev-label">VISTA PREVIA · {lang === 'es' ? '🇪🇸 ES' : '🇬🇧 EN'}{page === 'inicio' && sec === 'slides' && pos ? ` · SLIDE ${sel + 1}/${(Array.isArray(draft.slides) ? draft.slides : []).length} · ${pos.posX ?? 50}%/${pos.posY ?? 50}%` : ''} · {SECSLIST.find(s => s.id === sec)?.label}</span>
            <div className="adm-frame-wrap">
              {page === 'inicio' && draft && (<>
                {(sec === 'slides' || sec === 'hero') && <div className="adm-canvas adm-canvas-full"><Portada preview={draft} forceIndex={sec === 'slides' ? sel : undefined} /></div>}
                {sec === 'intro' && <div className="adm-canvas"><div className="container hero"><SeminarioIntro preview={draft} /></div></div>}
                {sec === 'mods' && <div className="adm-canvas"><div className="container home-sec"><Modalidades preview={draft} /></div></div>}
                {sec === 'ruta' && <div className="adm-canvas"><div className="container home-sec"><RutaNiveles preview={draft} previewNiveles={allContents.niveles.data} /></div></div>}
                {sec === 'top' && <div className="adm-canvas"><div className="container home-sec"><CursosTop preview={draft} /></div></div>}
                {sec === 'teaser' && <div className="adm-canvas"><div className="container home-sec"><EventoTeaser preview={draft} previewEventos={allContents.eventos.data} /></div></div>}
                {sec === 'testis' && <div className="adm-canvas adm-canvas-full"><Testimonios preview={draft} forceIndex={sel} /></div>}
                {sec === 'news' && <div className="adm-canvas adm-canvas-full"><Newsletter preview={draft} /></div>}
                {sec === 'marquee' && <div className="adm-canvas"><HomePage preview={draft} marqueeOnly /></div>}
                {sec === 'icons' && <div className="adm-canvas adm-canvas-full"><HomePage preview={draft} previewNiveles={allContents.niveles.data} previewEventos={allContents.eventos.data} /></div>}
              </>)}
              {page === 'nosotros' && draft && (<>
                {sec === 'hero' && <div className="adm-canvas adm-canvas-full"><NosotrosPage preview={draft} /></div>}
                {sec === 'quienes' && <div className="adm-canvas"><div className="container sec"><QuienesSomos preview={draft} /></div></div>}
                {sec === 'funcs' && <div className="adm-canvas"><div className="container sec"><Funciones preview={draft} forceIndex={sel} /></div></div>}
                {sec === 'fe' && <div className="adm-canvas"><div className="container sec"><DeclaracionFe preview={draft} /></div></div>}
                {sec === 'equipo' && <div className="adm-canvas"><div className="container sec"><Equipo preview={draft} forceIndex={sel} /></div></div>}
                {sec === 'icons' && <div className="adm-canvas adm-canvas-full"><NosotrosPage preview={draft} /></div>}
              </>)}
              {page === 'niveles' && draft && <div className="adm-canvas adm-canvas-full"><NivelesPage preview={draft} />{(sec === 'ruta' || sec === 'programas' || sec === 'subs' || sec === 'ramas') && <div className="container home-sec"><p className="adm-note">Vista Ruta del Home con estos cambios ({(draft.programas || []).length} paquetes):</p><RutaNiveles preview={allContents.inicio.data} previewNiveles={draft} /></div>}{sec === 'icons' && <div className="container home-sec"><p className="adm-note">Vista Ruta del Home con estos iconos:</p><RutaNiveles preview={allContents.inicio.data} previewNiveles={draft} /></div>}</div>}
              {page === 'cursos' && draft && <div className="adm-canvas adm-canvas-full"><CursosPage preview={draft} /></div>}
              {page === 'eventos' && draft && <div className="adm-canvas adm-canvas-full"><EventosPage preview={draft} />{(sec === 'eventos' || sec === 'hero' || sec === 'icons') && <div className="container home-sec"><p className="adm-note">Vista Teaser del Home con estos cambios ({(draft.eventos || []).length} eventos):</p><EventoTeaser preview={allContents.inicio.data} previewEventos={draft} /></div>}</div>}
              {page === 'contacto' && draft && <div className="adm-canvas adm-canvas-full"><ContactoPage preview={draft} /></div>}
              {page === 'site' && draft && <div className="adm-canvas"><div className="adm-siteprev"><Nav preview={draft} /><Footer preview={draft} /></div></div>}
              {page === 'backup' && <div className="adm-canvas"><div className="adm-siteprev"><p className="adm-note">💾 Respaldo total del CMS — usa el panel derecho.</p></div></div>}
            </div>
          </section>
          {!wide && (
          <aside className="adm-right">
            {page === 'inicio' && draft && <InicioEditor draft={draft} onDraft={(d) => { setDraft(d); setMsg('') }} sec={sec} sel={sel} onSel={setSel} />}
            {page === 'nosotros' && draft && <NosotrosEditor draft={draft} onDraft={(d) => { setDraft(d); setMsg('') }} sec={sec} sel={sel} onSel={setSel} />}
            {page === 'niveles' && draft && <NivelesEditor draft={draft} onDraft={(d) => { setDraft(d); setMsg('') }} sec={sec} sel={sel} onSel={setSel} />}
            {page === 'cursos' && draft && <CursosEditor draft={draft} onDraft={(d) => { setDraft(d); setMsg('') }} sec={sec} />}
            {page === 'eventos' && draft && <EventosEditor draft={draft} onDraft={(d) => { setDraft(d); setMsg('') }} sec={sec} sel={sel} onSel={setSel} />}
            {page === 'contacto' && draft && <ContactoEditor draft={draft} onDraft={(d) => { setDraft(d); setMsg('') }} sec={sec} sel={sel} onSel={setSel} />}
            {page === 'site' && draft && <SiteEditor draft={draft} onDraft={(d) => { setDraft(d); setMsg('') }} sec={sec} />}
            {page === 'backup' && <BackupPanel onDone={(m) => setMsg(m)} />}
          </aside>
          )}
        </div>
        {msg && <div className="adm-toast">{msg}</div>}
      </div>
    </AdminGate>
  )
}

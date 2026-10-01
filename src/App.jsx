import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Nav } from './app/layout/Nav'
import { Footer } from './app/layout/Footer'
import { ScrollTop } from './app/layout/ScrollTop'
import { HomePage } from './features/home/HomePage'
import { NosotrosPage } from './features/nosotros/NosotrosPage'
import { NivelesPage } from './features/niveles/NivelesPage'
import { CursosPage } from './features/cursos/CursosPage'
import { EventosPage } from './features/eventos/EventosPage'
import { ContactoPage } from './features/contacto/ContactoPage'
import { AdminPage } from './features/admin/AdminPage'

function useAdminShortcut() {
  const nav = useNavigate()
  useEffect(() => {
    const go = () => nav('/DirAdmin')
    const onKey = (e) => {
      const tag = (e.target?.tagName || '').toLowerCase()
      if (tag === 'input' || tag === 'textarea' || e.target?.isContentEditable) return
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        go()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [nav])
}

function HashCompat() {
  const nav = useNavigate()
  useEffect(() => {
    const h = window.location.hash
    if (h && h.startsWith('#/')) nav(h.slice(1), { replace: true })
  }, [nav])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  useAdminShortcut()
  if (pathname === '/DirAdmin') return <AdminPage />
  return (
    <>
      <HashCompat /><ScrollTop /><Nav />
      <main key={pathname} className="page-enter">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/nosotros" element={<NosotrosPage />} />
          <Route path="/about-us" element={<NosotrosPage />} />
          <Route path="/niveles" element={<NivelesPage />} />
          <Route path="/cursos" element={<CursosPage />} />
          <Route path="/eventos" element={<EventosPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/bcb" element={<EventosPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

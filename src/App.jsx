import { Route, Routes, useLocation } from 'react-router-dom'
import { Nav } from './app/layout/Nav'
import { Footer } from './app/layout/Footer'
import { ScrollTop } from './app/layout/ScrollTop'
import { HomePage } from './features/home/HomePage'
import { NosotrosPage } from './features/nosotros/NosotrosPage'
import { NivelesPage } from './features/niveles/NivelesPage'
import { CursosPage } from './features/cursos/CursosPage'
import { EventosPage } from './features/eventos/EventosPage'
import { ContactoPage } from './features/contacto/ContactoPage'

export default function App() {
  const { pathname } = useLocation()
  return (
    <>
      <ScrollTop /><Nav />
      <main key={pathname} className="page-enter">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/nosotros" element={<NosotrosPage />} />
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

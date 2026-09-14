import { useEffect, useRef, useState } from 'react'

export function useReveal(dep) {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.rv').forEach(el => el.classList.add('on'))
      return
    }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target) } }), { threshold: 0.05, rootMargin: '0px 0px -20px 0px' })
    const watch = () => document.querySelectorAll('.rv:not(.on)').forEach(el => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('on')
      else io.observe(el)
    })
    watch()
    const mo = new MutationObserver(() => watch())
    mo.observe(document.body, { childList: true, subtree: true })
    const t = setTimeout(() => document.querySelectorAll('.rv:not(.on)').forEach(el => el.classList.add('on')), 1200)
    return () => { io.disconnect(); mo.disconnect(); clearTimeout(t) }
  }, [dep])
}

export function useCountUp(target, start) {
  const [v, setV] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    if (!start) return
    let raf; const t0 = performance.now(); const dur = 1400
    const tick = (t) => { const p = Math.min(1, (t - t0) / dur); setV(Math.round(target * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, target])
  return [v, ref]
}

export function useCountdown(target) {
  const calc = () => {
    const diff = new Date(target).getTime() - Date.now()
    const p = diff <= 0
    const a = Math.max(0, diff)
    return { d: Math.floor(a / 864e5), h: Math.floor(a / 36e5) % 24, m: Math.floor(a / 6e4) % 60, s: Math.floor(a / 1e3) % 60, passed: p }
  }
  const [t, setT] = useState(calc)
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id) }, [target])
  return t
}

export const U = (id, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const IMGS = {
  cusco: U('photo-1526392060635-9d6019884377', 1200),
  biblia: U('photo-1504052434569-70ad5836ab65', 900),
  biblioteca: U('photo-1481627834876-b7833e8f5570', 900),
  iglesia: U('photo-1438032005730-c779502df39b', 900),
  estudiantes: U('photo-1523240795612-9a054b0db644', 900),
  selva: U('photo-1440342359743-84fcb8c21f21', 900),
  andes: U('photo-1464822759023-fed622ff2c3b', 900),
  mision: U('photo-1488521787991-ed7bbaae773c', 900),
  clases: U('photo-1503676260728-1c00da094a0b', 900),
  libros: U('photo-1524995997946-a1c2e315a42f', 900),
}

export const cursos = [
  { n: 'Amós', a: 'Biblia', d: 'Justicia y profecía para hoy. 4 semanas, guía + foro en vivo.', p: 30, mod: 'Híbrido', g: 'linear-gradient(135deg,#0071e3,#00c6ff)', img: U('photo-1504052434569-70ad5836ab65', 600) },
  { n: 'Pneumatología', a: 'Teología', d: 'Persona y obra del Espíritu Santo con base bíblica.', p: 40, mod: 'Híbrido', g: 'linear-gradient(135deg,#764ba2,#667eea)', img: U('photo-1438032005730-c779502df39b', 600) },
  { n: 'Nuevo Testamento', a: 'Biblia', d: 'Panorama completo del NT en un semestre.', p: 30, mod: 'Virtual', g: 'linear-gradient(135deg,#0ba360,#3cba92)', img: U('photo-1481627834876-b7833e8f5570', 600) },
  { n: 'Romanos', a: 'Biblia', d: 'Gracia, fe y justificación verso a verso.', p: 30, mod: 'Virtual', g: 'linear-gradient(135deg,#f7971e,#ffd200)', img: U('photo-1524995997946-a1c2e315a42f', 600) },
  { n: 'Juan', a: 'Biblia', d: 'El evangelio del amor y la vida eterna.', p: 30, mod: 'Virtual', g: 'linear-gradient(135deg,#111827,#6b7280)', img: U('photo-1519452575417-564c1401ecc0', 600) },
  { n: 'Apologética', a: 'Teología', d: 'Responde con fundamento y mansedumbre.', p: 30, mod: 'Virtual', g: 'linear-gradient(135deg,#ff5858,#f09819)', img: U('photo-1503676260728-1c00da094a0b', 600) },
  { n: 'Teología I', a: 'Teología', d: 'Fundamentos doctrinales sólidos.', p: 40, mod: 'Presencial', g: 'linear-gradient(135deg,#0f172a,#475569)', img: U('photo-1523240795612-9a054b0db644', 600) },
  { n: 'Dones Espirituales', a: 'Ministerio', d: 'Descubre y activa tus dones.', p: 30, mod: 'Virtual', g: 'linear-gradient(135deg,#ec4899,#8b5cf6)', img: U('photo-1488521787991-ed7bbaae773c', 600) },
]

import { useEffect } from 'react'

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

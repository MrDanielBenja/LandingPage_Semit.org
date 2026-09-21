import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => { if (!hash) window.scrollTo(0, 0) }, [pathname, hash])
  return null
}

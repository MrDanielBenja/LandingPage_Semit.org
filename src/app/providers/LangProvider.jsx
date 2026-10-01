import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { STR } from '../../shared/i18n/dict'

const LangCtx = createContext({ lang: 'es', setLang: () => {}, t: (k) => k })
export const useLang = () => useContext(LangCtx)

const get = (o, p) => p.split('.').reduce((a, k) => (a && a[k] !== undefined ? a[k] : undefined), o)

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => { try { return localStorage.getItem('semit-lang') || 'es' } catch { return 'es' } })
  const setLang = useCallback((l) => setLangState(l === 'en' ? 'en' : 'es'), [])
  useEffect(() => { document.documentElement.lang = lang; try { localStorage.setItem('semit-lang', lang) } catch {} }, [lang])
  const t = useCallback((key, vars) => {
    let s = get(STR[lang], key)
    if (s === undefined) s = get(STR.es, key)
    if (s === undefined) return key
    if (typeof s !== 'string') return s
    if (vars) for (const k of Object.keys(vars)) s = s.replaceAll(`{${k}}`, vars[k])
    return s
  }, [lang])
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>
}

export function subIntroOf({ subs = [], maestrias = [], dict = {}, lang = 'es' } = {}, id) {
  const fb = (dict && typeof dict === 'object' ? dict[id] : null) || {}
  const all = [...(Array.isArray(subs) ? subs : []), ...(Array.isArray(maestrias) ? maestrias : [])]
  const src = all.find((s) => s && s.id === id) || {}
  const sfx = lang === 'en' ? '_en' : '_es'
  const t = (typeof src[`intro_t${sfx}`] === 'string' && src[`intro_t${sfx}`].trim())
    ? src[`intro_t${sfx}`]
    : (typeof fb.t === 'string' ? fb.t : '')
  const d = (typeof src[`intro_d${sfx}`] === 'string' && src[`intro_d${sfx}`].trim())
    ? src[`intro_d${sfx}`]
    : (typeof fb.d === 'string' ? fb.d : '')
  return { t, d }
}

export function subIntroKey(sub, mae) {
  if (sub === 'maestria') return mae && mae !== 'Todos' ? mae : 'todos'
  return sub
}

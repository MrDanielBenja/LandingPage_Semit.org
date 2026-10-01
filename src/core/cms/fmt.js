export function fmtCss(f) {
  if (!f) return undefined
  const o = {}
  if (f.size) o.fontSize = `${f.size}px`
  if (f.color) o.color = f.color
  if (f.b) o.fontWeight = '800'
  if (f.i) o.fontStyle = 'italic'
  if (f.u) o.textDecoration = 'underline'
  if (f.align) o.textAlign = f.align
  return Object.keys(o).length ? o : undefined
}

export function getFmt(cms, key) {
  return (cms && cms.fmt && cms.fmt[key]) || undefined
}

export function fmtCssKey(cms, key) {
  return fmtCss(getFmt(cms, key))
}

const SAFE_COLOR = /^(#[0-9a-f]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\)|[a-z]+)$/i
const SAFE_ALIGN = new Set(['left', 'center', 'right', 'justify'])

export function fmtCss(f) {
  if (!f) return undefined
  const o = {}
  const size = Number(f.size)
  if (Number.isFinite(size) && size > 0 && size <= 200) o.fontSize = `${size}px`
  if (typeof f.color === 'string' && f.color.length <= 40 && SAFE_COLOR.test(f.color.trim())) o.color = f.color.trim()
  if (f.b) o.fontWeight = '800'
  if (f.i) o.fontStyle = 'italic'
  if (f.u) o.textDecoration = 'underline'
  if (typeof f.align === 'string' && SAFE_ALIGN.has(f.align.trim().toLowerCase())) o.textAlign = f.align.trim().toLowerCase()
  return Object.keys(o).length ? o : undefined
}

export function getFmt(cms, key) {
  return (cms && cms.fmt && cms.fmt[key]) || undefined
}

export function fmtCssKey(cms, key) {
  return fmtCss(getFmt(cms, key))
}

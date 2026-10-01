export const asArr = (v, fb) => (Array.isArray(v) ? v : Array.isArray(fb) ? fb : [])
export const asObj = (v, fb) => (v && typeof v === 'object' && !Array.isArray(v) ? v : fb || {})
export const arrOf = (v) => (Array.isArray(v) ? v : [])
export const pickArr = (v, fb) => {
  const a = asArr(v, null)
  if (a && a.length) return a
  return Array.isArray(fb) ? fb : []
}

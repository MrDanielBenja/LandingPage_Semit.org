const n = (v, d) => {
  const x = Number(v)
  return Number.isFinite(x) ? x : d
}
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

export function imgCfgOf(o) {
  return (o && o.imgCfg && typeof o.imgCfg === 'object') ? o.imgCfg : {}
}

function readXY(o, cfg) {
  let x = cfg.x ?? cfg.posX ?? o.x ?? o.posX
  let y = cfg.y ?? cfg.posY ?? o.y ?? o.posY
  if (x === undefined || y === undefined) {
    const op = String((cfg.cropSave && cfg.cropSave.cssTransform && cfg.cropSave.cssTransform.objectPosition) || '').split(/\s+/)
    if (x === undefined) x = parseFloat(op[0])
    if (y === undefined) y = parseFloat(op[1])
  }
  return [x, y]
}

export function imgStyleOf(o) {
  if (!o || typeof o !== 'object') return undefined
  const cfg = imgCfgOf(o)
  let [xRaw, yRaw] = readXY(o, cfg)
  const x = clamp(n(xRaw, 50), 0, 100)
  const y = clamp(n(yRaw, 50), 0, 100)
  const tx = clamp(n(cfg.tx ?? cfg.translateX ?? 0, 0), -95, 95)
  const ty = clamp(n(cfg.ty ?? cfg.translateY ?? 0, 0), -95, 95)
  const sc = clamp(n(cfg.scale ?? 1, 1), 0.1, 10)
  const rot = Math.round(n(cfg.rotation ?? 0, 0))
  const fit = cfg.objectFit || o.fit || o.objectFit || 'cover'
  const isDefault = x === 50 && y === 50 && tx === 0 && ty === 0 && sc === 1 && rot === 0
  if (isDefault) return undefined
  const parts = []
  if (tx || ty) parts.push(`translate(${Math.round(tx * 100) / 100}%, ${Math.round(ty * 100) / 100}%)`)
  if (sc !== 1) parts.push(`scale(${Math.round(sc * 100) / 100})`)
  if (rot) parts.push(`rotate(${rot}deg)`)
  const out = {
    objectFit: fit,
    objectPosition: `${Math.round(x * 10) / 10}% ${Math.round(y * 10) / 10}%`,
  }
  if (parts.length) {
    out.transform = parts.join(' ')
    out.transformOrigin = 'center'
  }
  return out
}

export function toImgCfg(cfg) {
  const c = cfg || {}
  return {
    x: clamp(n(c.x, 50), -50, 150),
    y: clamp(n(c.y, 50), -50, 150),
    tx: clamp(n(c.tx ?? c.translateX, 0), -150, 150),
    ty: clamp(n(c.ty ?? c.translateY, 0), -150, 150),
    scale: clamp(n(c.scale, 1), 0.1, 10),
    rotation: Math.round(n(c.rotation, 0)),
    objectFit: c.objectFit || 'cover',
    pinPosition: c.pinPosition || 'custom',
    zIndex: Math.round(n(c.zIndex, 1)),
  }
}

function buildPatch(obj, cfg) {
  const t = toImgCfg(cfg)
  const patch = {
    ...(obj || {}),
    posX: Math.round(t.x * 10) / 10,
    posY: Math.round(t.y * 10) / 10,
    fit: t.objectFit,
    x: Math.round(t.x * 10) / 10,
    y: Math.round(t.y * 10) / 10,
    imgCfg: {
      ...(((obj || {}).imgCfg && typeof (obj || {}).imgCfg === 'object') ? (obj || {}).imgCfg : {}),
      x: Math.round(t.x * 10) / 10,
      y: Math.round(t.y * 10) / 10,
      tx: Math.round(t.tx * 100) / 100,
      ty: Math.round(t.ty * 100) / 100,
      translateX: Math.round(t.tx * 100) / 100,
      translateY: Math.round(t.ty * 100) / 100,
      scale: Math.round(t.scale * 100) / 100,
      rotation: t.rotation,
      objectFit: t.objectFit,
      pinPosition: t.pinPosition,
      zIndex: t.zIndex,
    },
  }
  return patch
}

export function imgEditFor(obj, upd, title) {
  return {
    editCtx: title || 'Edición de Imagen',
    editInitial: () => obj || {},
    onEditSave: (cfg) => upd(buildPatch(obj, cfg)),
  }
}

export function imgEditScaleOnly(obj, upd, title) {
  const full = imgEditFor(obj, upd, title)
  return {
    ...full,
    onEditSave: (cfg) => {
      const patch = buildPatch(obj, cfg)
      const { posX, posY, fit, ...rest } = patch
      upd({ ...(obj || {}), ...rest })
    },
  }
}

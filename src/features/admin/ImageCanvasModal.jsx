import { useEffect, useRef, useState } from 'react'

const r1 = (v) => Math.round(Number(v) * 10) / 10
const r2 = (v) => Math.round(Number(v) * 100) / 100
const num = (v, d) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : d
}

function initCfg(initial) {
  const c = initial || {}
  const imgCfg = (c.imgCfg && typeof c.imgCfg === 'object') ? c.imgCfg : {}
  const css = (imgCfg.cropSave && typeof imgCfg.cropSave === 'object' && imgCfg.cropSave.cssTransform) || {}
  const op = String(css.objectPosition || '').split(/\s+/)
  return {
    x: num(c.x ?? c.posX ?? imgCfg.x ?? parseFloat(op[0]), 50),
    y: num(c.y ?? c.posY ?? imgCfg.y ?? parseFloat(op[1]), 50),
    tx: num(c.tx ?? c.translateX ?? imgCfg.tx ?? imgCfg.translateX ?? 0, 0),
    ty: num(c.ty ?? c.translateY ?? imgCfg.ty ?? imgCfg.translateY ?? 0, 0),
    scale: num(c.scale ?? imgCfg.scale ?? 1, 1),
    rotation: num(c.rotation ?? imgCfg.rotation ?? 0, 0),
    fit: c.fit || c.objectFit || imgCfg.objectFit || 'cover',
    pin: imgCfg.pinPosition || c.pinPosition || 'custom',
    z: num(c.zIndex ?? imgCfg.zIndex ?? 1, 1),
  }
}

const PINS = [
  ['top-left', 'Top-left'],
  ['center', 'Center'],
  ['bottom-right', 'Bottom-right'],
  ['custom', 'Custom'],
]
const PIN_XY = { 'top-left': [0, 0], center: [50, 50], 'bottom-right': [100, 100] }

const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

const MIN_SCALE = 0.1
const MAX_SCALE = 10

export function ImageFrameEditor({ open, title, src, initial, target, onClose, onSave }) {
  const base = initCfg(initial)
  const [x, setX] = useState(base.x)
  const [y, setY] = useState(base.y)
  const [tx, setTx] = useState(base.tx)
  const [ty, setTy] = useState(base.ty)
  const [scale, setScale] = useState(base.scale)
  const [rotation, setRotation] = useState(base.rotation)
  const [fit, setFit] = useState(base.fit)
  const [pin, setPin] = useState(base.pin)
  const [z, setZ] = useState(base.z)
  const [guides, setGuides] = useState({})
  const [mini, setMini] = useState(false)
  const [maxi, setMaxi] = useState(false)
  const [nat, setNat] = useState({ w: 0, h: 0 })
  const [stage, setStage] = useState({ w: 0, h: 0 })
  const [saveErr, setSaveErr] = useState('')
  const [saving, setSaving] = useState(false)
  const stageRef = useRef(null)
  const dragRef = useRef(null)
  const stRef = useRef({ x, y, tx, ty, scale, rotation, fit })
  stRef.current = { x, y, tx, ty, scale, rotation, fit }

  const tw = Number(target?.width) || 0
  const th = Number(target?.height) || 0
  const hasTarget = tw > 0 && th > 0
  const targetLabel = hasTarget ? `${tw}×${th}px` : 'libre'

  useEffect(() => {
    if (!open) return
    const b = initCfg(initial)
    setX(b.x); setY(b.y); setTx(b.tx); setTy(b.ty)
    setScale(b.scale); setRotation(b.rotation)
    setFit(b.fit); setPin(b.pin); setZ(b.z)
    setGuides({}); setMini(false); setNat({ w: 0, h: 0 })
    setSaveErr(''); setSaving(false)
  }, [open])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const esc = (e) => { if (e.key === 'Escape') onClose && onClose() }
    document.addEventListener('keydown', esc)
    const measure = () => {
      const el = stageRef.current
      if (el) setStage({ w: el.clientWidth || 0, h: el.clientHeight || 0 })
    }
    measure()
    const t = setTimeout(measure, 60)
    window.addEventListener('resize', measure)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', esc); window.removeEventListener('resize', measure); clearTimeout(t) }
  }, [open, onClose, maxi, mini])

  useEffect(() => {
    if (!open) return
    const el = stageRef.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      const d = e.deltaY < 0 ? 0.1 : -0.1
      setScale((s) => r2(Math.min(MAX_SCALE, Math.max(MIN_SCALE, s + d))))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [open])

  if (!open) return null

  const vw = (() => {
    if (!hasTarget) return stage.w || 640
    if (!stage.w || !stage.h) return 0
    return Math.floor(Math.min(stage.w / tw, stage.h / th) * tw)
  })()
  const vh = (() => {
    if (!hasTarget) return stage.h || 400
    if (!stage.w || !stage.h) return 0
    return Math.floor(Math.min(stage.w / tw, stage.h / th) * th)
  })()

  const fitMode = fit === 'custom' ? 'cover' : fit
  const k0 = nat.w && nat.h && vw && vh
    ? (fitMode === 'cover' ? Math.max(vw / nat.w, vh / nat.h) : Math.min(vw / nat.w, vh / nat.h))
    : 0
  const dw0 = nat.w ? nat.w * k0 : 0
  const dh0 = nat.h ? nat.h * k0 : 0
  const sc = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Number(scale) || 1))
  const dw = dw0 * sc
  const dh = dh0 * sc
  const px = (vw - dw) * ((Number(x) || 0) / 100) + ((Number(tx) || 0) / 100) * vw
  const py = (vh - dh) * ((Number(y) || 0) / 100) + ((Number(ty) || 0) / 100) * vh
  const vLeft = (stage.w - vw) / 2
  const vTop = (stage.h - vh) / 2

  const applyPos = (nx, ny) => {
    const g = {}
    let sx = nx
    let sy = ny
    if (Math.abs(nx - 50) < 2) { sx = 50; g.vc = true }
    if (nx < 2) { sx = 0; g.vl = true }
    if (nx > 98) { sx = 100; g.vr = true }
    if (Math.abs(ny - 50) < 2) { sy = 50; g.hc = true }
    if (ny < 2) { sy = 0; g.ht = true }
    if (ny > 98) { sy = 100; g.hb = true }
    setGuides(g)
    setX(r1(Math.min(150, Math.max(-50, sx))))
    setY(r1(Math.min(150, Math.max(-50, sy))))
    setPin('custom')
  }

  const startDrag = (e) => {
    if (e.target.closest('.imgm-h,.imgm-rot,.imgm-layers,button,input,select')) return
    const el = stageRef.current
    if (!el || !vw) return
    dragRef.current = { mode: 'move', sx: e.clientX, sy: e.clientY, otx: tx, oty: ty, vw, vh }
    try { e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId) } catch {}
  }

  const startResize = (e) => {
    e.stopPropagation()
    dragRef.current = { mode: 'scale', sx: e.clientX, sy: e.clientY, os: scale }
    try { e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId) } catch {}
  }

  const startRotate = (e) => {
    e.stopPropagation()
    dragRef.current = { mode: 'rot', sx: e.clientX, orot: rotation }
    try { e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId) } catch {}
  }

  const onMove = (e) => {
    const d = dragRef.current
    if (!d) return
    if (d.mode === 'move') {
      const ntx = r2(Math.min(150, Math.max(-150, d.otx + ((e.clientX - d.sx) / (d.vw || 1)) * 100)))
      const nty = r2(Math.min(150, Math.max(-150, d.oty + ((e.clientY - d.sy) / (d.vh || 1)) * 100)))
      setTx(ntx)
      setTy(nty)
      setPin('custom')
    } else if (d.mode === 'scale') {
      const delta = ((e.clientX - d.sx) - (e.clientY - d.sy)) * 0.005
      setScale(r2(Math.min(MAX_SCALE, Math.max(MIN_SCALE, d.os + delta))))
    } else if (d.mode === 'rot') {
      setRotation(Math.round(((d.orot + (e.clientX - d.sx) * 0.5) % 360 + 360) % 360))
    }
  }

  const endDrag = () => { dragRef.current = null; setGuides({}) }

  const pickPin = (p) => {
    setPin(p)
    if (PIN_XY[p]) { setX(PIN_XY[p][0]); setY(PIN_XY[p][1]) }
  }

  const handleSave = () => {
    setSaveErr('')
    setSaving(true)
    try {
      const st = stRef.current
      const s = r2(Math.min(MAX_SCALE, Math.max(MIN_SCALE, Number(st.scale) || 1)))
      const ox = r1(Math.min(150, Math.max(-150, Number(st.x) || 50)))
      const oy = r1(Math.min(150, Math.max(-150, Number(st.y) || 50)))
      const txx = r2(Math.min(150, Math.max(-150, Number(st.tx) || 0)))
      const tyy = r2(Math.min(150, Math.max(-150, Number(st.ty) || 0)))
      const rot = Math.round(Number(st.rotation) || 0)
      const cw = hasTarget ? tw : Math.round(vw)
      const ch = hasTarget ? th : Math.round(vh)
      if (!cw || !ch) throw new Error('Sin medidas del marco — reabre el editor')
      const parts = []
      if (txx || tyy) parts.push(`translate(${txx}%, ${tyy}%)`)
      if (s !== 1) parts.push(`scale(${s})`)
      if (rot) parts.push(`rotate(${rot}deg)`)
      const payload = {
        x: ox,
        y: oy,
        posX: ox,
        posY: oy,
        tx: txx,
        ty: tyy,
        translateX: txx,
        translateY: tyy,
        scale: s,
        rotation: rot,
        pinPosition: pin,
        zIndex: Math.round(z),
        objectFit: st.fit,
        position: { x: txx, y: tyy },
        targetDimensions: { width: cw, height: ch },
        objectPosition: `${ox}% ${oy}%`,
        cssStyles: {
          transform: parts.join(' ') || 'none',
          transformOrigin: 'center',
        },
        cssTransform: {
          objectFit: 'cover',
          objectPosition: `${ox}% ${oy}%`,
          transform: parts.join(' ') || 'none',
        },
      }
      onSave && onSave(payload)
      onClose && onClose()
    } catch (error) {
      console.error('Error al guardar la imagen:', error)
      setSaveErr(String((error && error.message) || error || 'No se pudo guardar'))
    } finally {
      setSaving(false)
    }
  }

  const tfm = (() => {
    const parts = []
    if (tx || ty) parts.push(`translate(${r2(tx)}%, ${r2(ty)}%)`)
    if (sc !== 1) parts.push(`scale(${sc})`)
    if (rotation) parts.push(`rotate(${rotation}deg)`)
    return parts.join(' ') || undefined
  })()

  const ghostStyle = dw0 ? {
    position: 'absolute',
    top: 0,
    left: 0,
    width: `${dw0}px`,
    height: `${dh0}px`,
    maxWidth: 'none',
    objectFit: fitMode,
    objectPosition: `${x}% ${y}%`,
    transform: tfm,
    transformOrigin: 'center',
    opacity: 0.35,
    filter: 'saturate(.8)',
    pointerEvents: 'none',
  } : undefined

  const vividStyle = dw0 ? {
    position: 'absolute',
    top: 0,
    left: 0,
    width: `${dw0}px`,
    height: `${dh0}px`,
    maxWidth: 'none',
    objectFit: fitMode,
    objectPosition: `${x}% ${y}%`,
    transform: tfm,
    transformOrigin: 'center',
    zIndex: z,
  } : undefined

  const _ghostXY = [vLeft + px, vTop + py]

  return (
    <div className="imgm-bg" onClick={onClose}>
      <div className={`imgm-modal${maxi ? ' max' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="imgm-head">
          <b>{title || 'Niveles - Edición de Imagen'}</b>
          <span className="imgm-sub">viewport {targetLabel} · foco {r1(x)}%,{r1(y)}% · mover {r2(tx)}%,{r2(ty)}% · zoom {r2(sc)}x</span>
          <div className="imgm-wins">
            <button type="button" title="Minimizar" onClick={() => setMini((v) => !v)}>–</button>
            <button type="button" title="Maximizar" onClick={() => setMaxi((v) => !v)}>{maxi ? '❐' : '⛶'}</button>
            <button type="button" title="Cerrar" onClick={onClose}>X</button>
          </div>
        </div>
        {!mini && (
          <div className="imgm-body">
            <div className="imgm-work">
              <div
                ref={stageRef}
                className="imgm-stage"
                onPointerDown={startDrag}
                onPointerMove={onMove}
                onPointerUp={endDrag}
                onPointerLeave={endDrag}
              >
                {src && dw0 ? <img src={src} alt="" aria-hidden draggable={false} style={{ ...ghostStyle, transform: `translate(${vLeft + px}px, ${vTop + py}px) scale(${sc}) rotate(${rotation}deg)`, width: `${dw0}px`, height: `${dh0}px`, objectFit: undefined, objectPosition: undefined }} /> : null}
                <div className="imgm-vpwrap">
                <div
                  className="imgm-viewport"
                  style={vw && vh ? { width: vw, height: vh } : undefined}
                >
                  {src ? (
                    <img
                      src={src}
                      alt=""
                      draggable={false}
                      crossOrigin="anonymous"
                      onLoad={(e) => setNat({ w: e.currentTarget.naturalWidth || 0, h: e.currentTarget.naturalHeight || 0 })}
                      style={vividStyle}
                    />
                  ) : (
                    <div className="imgm-empty">Sin imagen</div>
                  )}
                  <div className="imgm-thirds" />
                  <div className="imgm-center">+</div>
                  {guides.vc && <div className="imgm-guide v c" />}
                  {guides.hc && <div className="imgm-guide h c" />}
                  {guides.vl && <div className="imgm-guide v l" />}
                  {guides.vr && <div className="imgm-guide v r" />}
                  {guides.ht && <div className="imgm-guide h t" />}
                  {guides.hb && <div className="imgm-guide h b" />}
                  <div className="imgm-crop fixed">
                    <span>FOCUS / CROP ZONE · {targetLabel} (fijo)</span>
                  </div>
                  {pin === 'top-left' && <div className="imgm-pin">PIN TO TOP-LEFT OF CANVAS</div>}
                  <button type="button" className="imgm-rot" title="Arrastra para rotar" onPointerDown={startRotate}>⟳</button>
                  {HANDLES.map((hh) => (
                    <button key={hh} type="button" className={`imgm-h ${hh}`} title={`Resize ${hh} · zoom`} onPointerDown={startResize} />
                  ))}
                  <div className="imgm-layers">
                    <button type="button" onClick={() => setZ((v) => Math.min(10, Math.max(1, Math.round(v) + 1)))}>BRING FRONT</button>
                    <button type="button" onClick={() => setZ((v) => Math.min(10, Math.max(1, Math.round(v) - 1)))}>SEND BACK</button>
                  </div>
                  {(guides.vc || guides.hc) && <div className="imgm-snap">SMART SNAPPING</div>}
                </div>
                </div>
              </div>
              <div className="imgm-zoombar">
                <span>−</span>
                <input type="range" min="1" max="4" step="0.01" value={Math.min(4, Math.max(1, sc))} onChange={(e) => setScale(r2(Number(e.target.value)))} title="Zoom" />
                <span>+</span>
                <b>{r2(Math.min(4, Math.max(1, sc)))}x</b>
              </div>
            </div>
            <div className="imgm-side">
              <div className="imgm-note">Foco con object-position % + mover en % del marco + zoom. Todo relativo: no se rompe en responsive.</div>
              <label>Foco X % (object-position)<input type="number" step="0.5" min="-50" max="150" value={x} onChange={(e) => applyPos(Number(e.target.value), y)} /></label>
              <label>Foco Y % (object-position)<input type="number" step="0.5" min="-50" max="150" value={y} onChange={(e) => applyPos(x, Number(e.target.value))} /></label>
              <label>Mover X % (translate)<input type="range" min="-95" max="95" step="0.5" value={Math.min(95, Math.max(-95, tx))} onChange={(e) => { setTx(Number(e.target.value)); setPin('custom') }} /></label>
              <label>Mover Y % (translate)<input type="range" min="-95" max="95" step="0.5" value={Math.min(95, Math.max(-95, ty))} onChange={(e) => { setTy(Number(e.target.value)); setPin('custom') }} /></label>
              <label>Escala / zoom 0.1x–10x<input type="range" min={MIN_SCALE} max={MAX_SCALE} step="0.05" value={Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale))} onChange={(e) => setScale(r2(Math.min(MAX_SCALE, Math.max(MIN_SCALE, Number(e.target.value)))))} /></label>
              <label>Rotación °<input type="range" min="0" max="360" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} /></label>
              <label>Ajuste
                <select value={fit} onChange={(e) => setFit(e.target.value)}>
                  <option value="cover">cover</option>
                  <option value="contain">contain</option>
                  <option value="custom">custom</option>
                </select>
              </label>
              <div className="imgm-sec">Fijación (pin)</div>
              <div className="imgm-pins">
                {PINS.map(([id, lb]) => (
                  <button key={id} type="button" className={pin === id ? 'on' : ''} onClick={() => pickPin(id)}>{lb}</button>
                ))}
              </div>
              <div className="imgm-sec">Capa · z {Math.round(z)}</div>
              <div className="imgm-pins">
                <button type="button" onClick={() => setZ((v) => Math.min(10, Math.max(1, Math.round(v) + 1)))}>BRING FRONT</button>
                <button type="button" onClick={() => setZ((v) => Math.min(10, Math.max(1, Math.round(v) - 1)))}>SEND BACK</button>
              </div>
              <button
                type="button"
                className="btn btn-line"
                onClick={() => { setX(50); setY(50); setTx(0); setTy(0); setScale(1); setRotation(0); setFit('cover'); setPin('custom'); setZ(1) }}
              >
                Restablecer
              </button>
              {saveErr && <div className="imgm-err">⚠ {saveErr}</div>}
            </div>
          </div>
        )}
        <div className="imgm-foot">
          <button type="button" className="btn btn-line" onClick={onClose}>Cancelar</button>
          <button type="button" className="btn btn-blue" disabled={saving} onClick={handleSave}>{saving ? 'Guardando…' : 'Guardar Cambios'}</button>
        </div>
      </div>
    </div>
  )
}

export const ImageCanvasModal = ImageFrameEditor

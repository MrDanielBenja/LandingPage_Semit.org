import { useState } from 'react'
import { DECLARACION_FE } from '../data/nosotros.data'

const FILTROS = ['Todas', 'Dios', 'Cristo', 'Espíritu', 'Iglesia']

function grupo(t) {
  if (/Dios Trino|Escrituras|Hombre|Destino/i.test(t)) return 'Dios'
  if (/Jesucristo|Segunda Venida/i.test(t)) return 'Cristo'
  if (/Espíritu|Sanidad/i.test(t)) return 'Espíritu'
  return 'Iglesia'
}

export function DeclaracionFe() {
  const [fe, setFe] = useState(0)
  const [f, setF] = useState('Todas')
  const [q, setQ] = useState('')
  const list = DECLARACION_FE
    .map((x, k) => ({ ...x, k, g: grupo(x.t) }))
    .filter(x => (f === 'Todas' || x.g === f) && (x.t + x.d).toLowerCase().includes(q.toLowerCase()))
  const open = list.findIndex(x => x.k === fe)
  return (
    <section className="rv fe-sec">
      <div className="hsec"><span className="pill">✝️ Declaración de Fe · {DECLARACION_FE.length} verdades</span><h2>En esto creemos</h2>
        <p>La posición doctrinal del SEMIT. Filtra por tema o busca una palabra: gracia, trinidad, iglesia…</p></div>
      <div className="fe-tools">
        <div className="cu-search fe-search"><span>🔍</span><input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar en la declaración…" />{q && <button onClick={() => setQ('')}>✕</button>}</div>
        <div className="fe-chips">{FILTROS.map(x => <button key={x} className={f === x ? 'on' : ''} onClick={() => setF(x)}>{x}</button>)}</div>
      </div>
      <div className="fe-timeline">
        {list.map((x, idx) => (
          <div key={x.k} className={`fe-node ${x.k === fe ? 'open' : ''}`}>
            <button className="fe-dot-btn" onClick={() => setFe(x.k === fe ? -1 : x.k)} aria-label={x.t}>
              <span className="fe-dot">{x.k === fe ? '−' : '+'}</span>
            </button>
            <button className="fe-card" onClick={() => setFe(x.k === fe ? -1 : x.k)}>
              <small>{x.g} · {String(x.k + 1).padStart(2, '0')}</small>
              <b>{x.t}</b>
              {x.k === fe && <p>{x.d}</p>}
            </button>
            {idx < list.length - 1 && <span className="fe-line" />}
          </div>
        ))}
      </div>
      {list.length === 0 && <p className="cu-count">Sin resultados para “{q}”. <button className="link-btn" onClick={() => { setQ(''); setF('Todas') }}>limpiar</button></p>}
      {open >= 0 && <p className="cu-count">Leyendo {open + 1} de {list.length}</p>}
    </section>
  )
}

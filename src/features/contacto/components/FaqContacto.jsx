import { useState } from 'react'
import { FAQS } from '../data/contacto.data'

export function FaqContacto() {
  const [fq, setFq] = useState(-1)
  return (
    <div className="faq-wide rv">
      <h3>Preguntas rápidas</h3>
      <div className="faq-grid">
        {FAQS.map((x, k) => (
          <div key={k} className={`fmini big ${fq === k ? 'open' : ''}`}>
            <button onClick={() => setFq(fq === k ? -1 : k)}><span>{x[0]}</span><span className="plus">{fq === k ? '−' : '+'}</span></button>
            {fq === k && <p>{x[1]}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

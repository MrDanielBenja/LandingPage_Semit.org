import { useState } from 'react'
import { useReveal } from '../../shared/hooks/useReveal'
import { HeroContacto } from './components/HeroContacto'
import { CanalesTabs } from './components/CanalesTabs'
import { PanelFormulario, PanelWhatsapp, PanelSede } from './components/ContactoPanels'
import { FaqContacto } from './components/FaqContacto'

export function ContactoPage({ preview }) {
  const [canal, setCanal] = useState('form')
  useReveal('/contacto')
  return (
    <div className="pg pg-contact">
      <HeroContacto onCanal={setCanal} preview={preview} />
      <div className="container sec nos-body contact-body">
        <div className="c-layout rv">
          <CanalesTabs canal={canal} onCanal={setCanal} preview={preview} />
          <div className="c-panel">
            {canal === 'form' && <PanelFormulario key="form" preview={preview} />}
            {canal === 'wa' && <PanelWhatsapp key="wa" preview={preview} />}
            {canal === 'sede' && <PanelSede key="sede" preview={preview} />}
          </div>
        </div>
        <FaqContacto preview={preview} />
      </div>
    </div>
  )
}

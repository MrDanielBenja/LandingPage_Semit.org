import { SITE } from '../../shared/config/site'

const cleanWa = (wa) => String(wa ?? SITE.wa ?? '').replace(/\D/g, '').slice(0, 15) || String(SITE.wa).replace(/\D/g, '')

export const waLink = (text, wa) => `https://wa.me/${cleanWa(wa)}?text=${encodeURIComponent(String(text ?? ''))}`
export const openWa = (text, wa) => window.open(waLink(text, wa), '_blank')

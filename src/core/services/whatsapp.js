import { SITE } from '../../shared/config/site'

export const waLink = (text) => `https://wa.me/${SITE.wa}?text=${encodeURIComponent(text)}`
export const openWa = (text) => window.open(waLink(text), '_blank')

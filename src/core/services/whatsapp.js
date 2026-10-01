import { SITE } from '../../shared/config/site'

export const waLink = (text, wa) => `https://wa.me/${wa || SITE.wa}?text=${encodeURIComponent(text)}`
export const openWa = (text, wa) => window.open(waLink(text, wa), '_blank')

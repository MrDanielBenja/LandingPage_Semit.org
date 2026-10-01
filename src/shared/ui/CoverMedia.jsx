import { isVideoUrl } from '../../core/cms/media'

export function CoverMedia({ src, alt = '', className = '', eager = false }) {
  if (!src) return null
  if (isVideoUrl(src)) {
    return <video className={className} src={src} autoPlay muted loop playsInline preload="metadata" />
  }
  return <img className={className} src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} />
}

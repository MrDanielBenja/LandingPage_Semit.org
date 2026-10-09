import { TRACK_INFO } from '../../features/cursos/data/cursos.data'
import { IMGS } from '../../shared/lib/images'
import { ES } from '../../shared/i18n/dict_es'
import { EN } from '../../shared/i18n/dict_en'
import { INICIO_ASSETS } from './defaultInicio'
import { NOSOTROS_ASSETS } from './defaultNosotros'
import { resolveAsset } from './assets'
import { iconsWithDefaults } from './icons'

const H = ES.cursos
const HE = EN.cursos
const imgOf = (v) => (typeof v === 'string' ? v : '')

const TRACK_EN = {
  Todos: 'Whole catalog',
  Biblia: 'Read and teach the Word',
  'Teología': 'Doctrine lived out',
  Ministerio: 'Serve and multiply',
}

export const DEFAULT_CURSOS_PAGE = {
  hero: {
    pill_es: H.hero.pill,
    pill_en: HE.hero.pill,
    h1a_es: H.hero.h1a,
    h1a_en: HE.hero.h1a,
    h1b_es: H.hero.h1b,
    h1b_en: HE.hero.h1b,
    p_es: H.hero.p,
    p_en: HE.hero.p,
    ph_es: H.hero.ph,
    ph_en: HE.hero.ph,
    img: imgOf(IMGS.aula),
    bg: '',
  },
  stats: {
    promoLabel_es: H.hero.promo,
    promoLabel_en: HE.hero.promo,
    activosLabel_es: H.hero.activos,
    activosLabel_en: HE.hero.activos,
    promLabel_es: H.hero.prom,
    promLabel_en: HE.hero.prom,
  },
  tracks: Object.keys(TRACK_INFO).map((id) => ({
    id,
    e: TRACK_INFO[id].e,
    d_es: TRACK_INFO[id].d,
    d_en: TRACK_EN[id] || TRACK_INFO[id].d,
    img: imgOf(TRACK_INFO[id].img),
  })),
  toolbar: {
    modLabel_es: H.toolbar.mod,
    modLabel_en: HE.toolbar.mod,
    ordLabel_es: H.toolbar.ord,
    ordLabel_en: HE.toolbar.ord,
  },
  empty: {
    t_es: H.empty.t,
    t_en: HE.empty.t,
    p_es: H.empty.p,
    p_en: HE.empty.p,
    btn_es: H.empty.btn,
    btn_en: HE.empty.btn,
  },
  cta: {
    t_es: H.cta.t,
    t_en: HE.cta.t,
    p1_es: H.cta.p1,
    p1_en: HE.cta.p1,
    p2_es: H.cta.p2,
    p2_en: HE.cta.p2,
    btn_es: H.cta.btn,
    btn_en: HE.cta.btn,
  },
  // overrides: {slug: {p, tag_es/tag_en?, activo, img}} — el sync del portal NO pisa estos campos (ya acordado).
  overrides: {},
  icons: iconsWithDefaults('cursosPage'),
  fmt: {},
}

export const CURSOS_PAGE_ASSETS = [...INICIO_ASSETS, ...NOSOTROS_ASSETS].filter((v, k, a) => v && a.indexOf(v) === k)

export function applyCursosOverrides(list, overrides, lang) {
  const arr = Array.isArray(list) ? list : []
  if (!overrides || !Object.keys(overrides).length) return arr.map((c) => ({ ...c, img: resolveAsset(c.img) || c.img }))
  return arr
    .filter((c) => {
      const o = c && c.slug ? overrides[c.slug] : null
      return !(o && o.activo === false)
    })
    .map((c) => {
      const o = c && c.slug ? overrides[c.slug] : null
      if (!o) return { ...c, img: resolveAsset(c.img) || c.img }
      return {
        ...c,
        p: o.p ?? c.p,
        tag: lang === 'en' ? (o.tag_en ?? o.tag_es ?? c.tag) : (o.tag_es ?? c.tag),
        img: o.img ? resolveAsset(o.img) || c.img : resolveAsset(c.img) || c.img,
        imgCfg: o.imgCfg || c.imgCfg,
      }
    })
}

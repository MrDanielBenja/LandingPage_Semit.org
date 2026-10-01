import { CANALES, CANALES_EN, ASUNTOS, ASUNTOS_EN, FAQS, FAQS_EN, HORARIO, HORARIO_EN } from '../../features/contacto/data/contacto.data'
import { IMGS, LOCAL } from '../../shared/lib/images'
import { ES } from '../../shared/i18n/dict_es'
import { EN } from '../../shared/i18n/dict_en'

const H = ES.contacto
const HE = EN.contacto
const imgOf = (v) => (typeof v === 'string' ? v : '')

const FKEYS = ['s0t', 's0s', 'nom', 'nomPh', 'cor', 'corPh', 'cont', 's1t', 's1s', 'back', 's2t', 'cambiar', 'msg', 'msgPh', 'prev', 'prevEmpty', 'send', 'hola', 'sinCorreo', 'msgTpl', 'okT', 'okP', 'reopen', 'another']
const form = { steps_es: [...H.form.steps], steps_en: [...HE.form.steps] }
for (const k of FKEYS) {
  form[`${k}_es`] = H.form[k]
  form[`${k}_en`] = HE.form[k]
}

export const DEFAULT_CONTACTO = {
  hero: {
    pill_es: H.hero.pill, pill_en: HE.hero.pill,
    h1a_es: H.hero.h1a, h1a_en: HE.hero.h1a,
    h1b_es: H.hero.h1b, h1b_en: HE.hero.h1b,
    p_es: H.hero.p, p_en: HE.hero.p,
    img: imgOf(IMGS.manos),
    bg: '',
  },
  canales: CANALES.map((c, k) => ({
    id: c.id, icon: c.icon,
    label_es: c.label, label_en: (CANALES_EN[k] || {}).label || c.label,
    desc_es: c.desc, desc_en: (CANALES_EN[k] || {}).desc || c.desc,
  })),
  asuntos: ASUNTOS.map((a, k) => ({
    id: a.id, icon: a.icon,
    label_es: a.label, label_en: (ASUNTOS_EN[k] || {}).label || a.label,
    desc_es: a.desc, desc_en: (ASUNTOS_EN[k] || {}).desc || a.desc,
  })),
  faqs: FAQS.map((f, k) => ({
    q_es: f[0], a_es: f[1],
    q_en: ((FAQS_EN[k] || [])[0]) || f[0], a_en: ((FAQS_EN[k] || [])[1]) || f[1],
  })),
  horario: HORARIO.map((hh, k) => ({
    d_es: hh[0], h: hh[1],
    d_en: ((HORARIO_EN[k] || [])[0]) || hh[0],
  })),
  sede: {
    badge_es: H.sede.badge, badge_en: HE.sede.badge,
    t: H.sede.t,
    s_es: H.sede.s, s_en: HE.sede.s,
    l1_es: H.sede.l1, l1_en: HE.sede.l1,
    l2_es: H.sede.l2, l2_en: HE.sede.l2,
    img: imgOf(LOCAL.contactoB),
  },
  form,
  fmt: {},
}

export const CONTACTO_ASSETS = [
  'assets/contacto/semit-12.jpg',
  'assets/contacto/semit-20.jpg',
  'assets/contacto/semit-24.jpg',
  'assets/inicio/semit-7.jpg',
  'assets/inicio/semit-13.jpg',
  'assets/nosotros/semit-1.jpg',
  'assets/nosotros/semit-6.jpg',
  'assets/niveles/semit-11.jpg',
  'assets/cursos/semit-15.jpg',
  LOCAL.contactoHero, LOCAL.contactoA, LOCAL.contactoB,
].filter((v, k, a) => v && a.indexOf(v) === k)

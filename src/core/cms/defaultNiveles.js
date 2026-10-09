import { RAMAS, RAMAS_EN, SUBS, SUBS_EN, MAESTRIAS, MAESTRIAS_EN, RUTA, RUTA_EN, NIVELES } from '../../features/niveles/data/niveles.data'
import { IMGS, LOCAL } from '../../shared/lib/images'
import { ES } from '../../shared/i18n/dict_es'
import { EN } from '../../shared/i18n/dict_en'
import { iconsWithDefaults } from './icons'

const H = ES.niveles
const HE = EN.niveles
const imgOf = (v) => (typeof v === 'string' ? v : '')
const durEn = (d) => ({ '6 meses': '6 months', '1 año': '1 year', '3 años': '3 years', '2 años': '2 years' }[d] || d)

export const DEFAULT_NIVELES = {
  hero: {
    pill_es: H.hero.pill, pill_en: HE.hero.pill,
    h1a_es: H.hero.h1a, h1a_en: HE.hero.h1a,
    h1b_es: H.hero.h1b, h1b_en: HE.hero.h1b,
    img: imgOf(IMGS.libros),
    bg: '',
  },
  intro: {
    sub_es: H.intro.sub, sub_en: HE.intro.sub,
    txt1_es: H.intro.txt1, txt1_en: HE.intro.txt1,
    txt2_es: H.intro.txt2, txt2_en: HE.intro.txt2,
    bg: '',
  },
  ramas: RAMAS.map((r, k) => ({
    id: r.id,
    label_es: r.label, label_en: (RAMAS_EN[k] || {}).label || r.label,
    d_es: r.d, d_en: (RAMAS_EN[k] || {}).d || r.d,
    e: r.e, img: imgOf(r.img),
  })),
  subs: {
    pre: SUBS.pre.map((s, k) => ({
      id: s.id,
      label_es: s.label, label_en: (SUBS_EN.pre[k] || {}).label || s.label,
      d_es: s.d, d_en: (SUBS_EN.pre[k] || {}).d || s.d,
      intro_t_es: (H.subIntro[s.id] || {}).t || '', intro_t_en: (HE.subIntro[s.id] || {}).t || '',
      intro_d_es: (H.subIntro[s.id] || {}).d || '', intro_d_en: (HE.subIntro[s.id] || {}).d || '',
      e: s.e, img: imgOf(s.img),
    })),
    post: SUBS.post.map((s, k) => ({
      id: s.id,
      label_es: s.label, label_en: (SUBS_EN.post[k] || {}).label || s.label,
      d_es: s.d, d_en: (SUBS_EN.post[k] || {}).d || s.d,
      intro_t_es: (H.subIntro[s.id] || {}).t || '', intro_t_en: (HE.subIntro[s.id] || {}).t || '',
      intro_d_es: (H.subIntro[s.id] || {}).d || '', intro_d_en: (HE.subIntro[s.id] || {}).d || '',
      e: s.e, img: imgOf(s.img),
    })),
  },
  maestrias: MAESTRIAS.map((m, k) => ({
    id: m.id,
    label_es: m.label, label_en: (MAESTRIAS_EN[k] || {}).label || m.label,
    d_es: m.d, d_en: (MAESTRIAS_EN[k] || {}).d || m.d,
    intro_t_es: (H.subIntro[m.id] || {}).t || '', intro_t_en: (HE.subIntro[m.id] || {}).t || '',
    intro_d_es: (H.subIntro[m.id] || {}).d || '', intro_d_en: (HE.subIntro[m.id] || {}).d || '',
    e: m.e, img: imgOf(m.img),
  })),
  ruta: RUTA.map((r, k) => ({
    id: r.id,
    t_es: r.t, t_en: (RUTA_EN[k] || {}).t || r.t,
    e: r.e, img: imgOf(r.img),
  })),
  programas: NIVELES.map((c) => ({
    n: c.n, a: c.a,
    d_es: c.d, d_en: c.d, d: c.d,
    p: c.p, mod: c.mod,
    dur_es: c.dur, dur_en: durEn(c.dur), dur: c.dur,
    tag_es: c.tag, tag_en: c.tag, tag: c.tag,
    incluye_es: [...(c.incluye || [])], incluye_en: [...(c.incluye || [])], incluye: [...(c.incluye || [])],
    rama: c.rama, sub: c.sub, mae: c.mae,
    semanas: c.semanas, lecciones: c.lecciones, rating: c.rating, est: c.est,
    img: imgOf(c.img),
  })),
  icons: iconsWithDefaults('niveles'),
  fmt: {},
}

export const NIVELES_ASSETS = [
  '/assets/niveles/semit-11.jpg',
  '/assets/niveles/semit-3.jpg',
  '/assets/niveles/semit-5.jpg',
  '/assets/cursos/semit-15.jpg',
  '/assets/cursos/semit-19.jpg',
  '/assets/cursos/semit-21.jpg',
  '/assets/inicio/semit-7.jpg',
  '/assets/inicio/semit-13.jpg',
  '/assets/nosotros/semit-1.jpg',
  '/assets/nosotros/semit-6.jpg',
  '/assets/eventos/semit-10.jpg',
  '/assets/eventos/semit-22.jpg',
  LOCAL.nivelesHero, LOCAL.nivelesA, LOCAL.nivelesB,
  LOCAL.eventosA, LOCAL.eventosB,
].filter((v, k, a) => v && a.indexOf(v) === k)

import { FUNCS, FUNCS_EN, DECLARACION_FE, DECLARACION_FE_EN, TEAM, TEAM_EN } from '../../features/nosotros/data/nosotros.data'
import { defaultPaises } from './paises'
import { IMGS, LOCAL } from '../../shared/lib/images'
import { ES } from '../../shared/i18n/dict_es'
import { EN } from '../../shared/i18n/dict_en'
import { iconsWithDefaults } from './icons'

const H = ES.nosotros
const HE = EN.nosotros
const imgOf = (v) => (typeof v === 'string' ? v : '')

export const DEFAULT_NOSOTROS = {
  hero: {
    pill_es: H.hero.pill, pill_en: HE.hero.pill,
    h1a_es: H.hero.h1a, h1a_en: HE.hero.h1a,
    h1b_es: H.hero.h1b, h1b_en: HE.hero.h1b,
    p_es: H.hero.p, p_en: HE.hero.p,
    verse_es: '“Lo que has oído... encarga a hombres fieles que sean idóneos para enseñar también a otros.”',
    verse_en: '“What you have heard... entrust to faithful people who will be able to teach others also.”',
    verseRef: '— 2 Tim 2:2',
    img: imgOf(IMGS.iglesia),
    bg: '',
    stats: [
      { v: 3587, label_es: H.hero.seg, label_en: HE.hero.seg },
      { v: 475, label_es: H.hero.est, label_en: HE.hero.est },
      { v: 60, label_es: H.hero.doc, label_en: HE.hero.doc },
      { v: 275, label_es: H.hero.mis, label_en: HE.hero.mis },
    ],
  },
  quienes: {
    pill_es: H.quienes.pill, pill_en: HE.quienes.pill,
    h2_es: H.quienes.h2, h2_en: HE.quienes.h2,
    p1_es: H.quienes.p1, p1_en: HE.quienes.p1,
    dedica_es: H.quienes.dedica, dedica_en: HE.quienes.dedica,
    dedicap_es: H.quienes.dedicap, dedicap_en: HE.quienes.dedicap,
    cta_es: H.quienes.cta, cta_en: HE.quienes.cta,
    dedicaImg: imgOf(IMGS.cusco),
    bg: '',
    pilares: [
      { e: '🎓', t_es: 'Educación', t_en: 'Education', d_es: 'Teología y Biblia con docentes certificados y misioneros activos en campo.', d_en: 'Theology and Bible with certified teachers and missionaries active on the field.', img: imgOf(LOCAL.nosotrosA) },
      { e: '📦', t_es: 'Envío', t_en: 'Sending', d_es: '275 misioneros enviados a Latinoamérica y el mundo.', d_en: '275 missionaries sent to Latin America and the world.', img: imgOf(LOCAL.nosotrosB) },
      { e: '❤️', t_es: 'Cuidado', t_en: 'Care', d_es: 'Acompañamos obreros, iglesias y familias en el campo.', d_en: 'We walk with workers, churches, and families on the field.', img: imgOf(LOCAL.nosotrosC) },
    ],
  },
  funcs: {
    pill_es: H.funcs.pill, pill_en: HE.funcs.pill,
    h2_es: H.funcs.h2, h2_en: HE.funcs.h2,
    sub_es: H.funcs.sub, sub_en: HE.funcs.sub,
    bg: '',
    items: FUNCS.map((f, k) => ({
      e: f.e,
      t_es: f.t, t_en: (FUNCS_EN[k] || {}).t || f.t,
      d_es: f.d, d_en: (FUNCS_EN[k] || {}).d || f.d,
      img: imgOf(f.img),
    })),
  },
  fe: {
    pill_es: '✝️ Declaración de Fe', pill_en: '✝️ Statement of Faith',
    h2_es: H.fe.h2, h2_en: HE.fe.h2,
    sub_es: H.fe.sub, sub_en: HE.fe.sub,
    bg: '',
    items: DECLARACION_FE.map((x, k) => ({
      t_es: x.t, t_en: (DECLARACION_FE_EN[k] || {}).t || x.t,
      d_es: x.d, d_en: (DECLARACION_FE_EN[k] || {}).d || x.d,
    })),
  },
  equipo: {
    pill_es: H.equipo.pill, pill_en: HE.equipo.pill,
    title_es: H.equipo.title, title_en: HE.equipo.title,
    sub_es: H.equipo.sub, sub_en: HE.equipo.sub,
    todos_es: H.equipo.todos, todos_en: HE.equipo.todos,
    suffix_es: H.equipo.suffix, suffix_en: HE.equipo.suffix,
    bg: '',
    paises: defaultPaises(),
    members: TEAM.map((m, k) => ({
      n: m.n, p: m.p, img: imgOf(m.img),
      rol_es: m.rol, rol_en: (TEAM_EN[k] || {}).rol || m.rol,
      q_es: m.q, q_en: (TEAM_EN[k] || {}).q || m.q,
    })),
  },
  icons: iconsWithDefaults('nosotros'),
  fmt: {},
}

export const NOSOTROS_ASSETS = [
  '/assets/nosotros/semit-1.jpg',
  '/assets/nosotros/semit-6.jpg',
  '/assets/nosotros/semit-8.jpg',
  '/assets/nosotros/semit-9.jpg',
  '/assets/inicio/semit-7.jpg',
  '/assets/inicio/semit-13.jpg',
  '/assets/inicio/semit-14.jpg',
  '/assets/inicio/semit-16.jpg',
  '/assets/niveles/semit-11.jpg',
  '/assets/niveles/semit-3.jpg',
  '/assets/niveles/semit-5.jpg',
  '/assets/cursos/semit-15.jpg',
  '/assets/cursos/semit-19.jpg',
  '/assets/cursos/semit-21.jpg',
  LOCAL.nosotrosHero, LOCAL.nosotrosA, LOCAL.nosotrosB, LOCAL.nosotrosC,
].filter((v, k, a) => v && a.indexOf(v) === k)

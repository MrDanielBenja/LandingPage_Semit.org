import { SLIDES, SLIDES_EN, TESTIMONIOS, TESTIMONIOS_EN } from '../../features/home/data/home.data'
import { IMGS, LOCAL } from '../../shared/lib/images'
import { ES } from '../../shared/i18n/dict_es'
import { EN } from '../../shared/i18n/dict_en'

const H = ES.home
const HE = EN.home

const imgOf = (v) => (typeof v === 'string' ? v : '')

export const DEFAULT_INICIO = {
  hero: { h: 640, overlay: 'rgba(0,0,0,.5)', textColor: '#ffffff' },
  news: { bg: '#1d1d1f',
    h_es: H.news.h3, p_es: H.news.p, ph_es: H.news.ph, btn_es: H.news.btn,
    h_en: HE.news.h3, p_en: HE.news.p, ph_en: HE.news.ph, btn_en: HE.news.btn },
  marquee: { text_es: H.marquee, text_en: HE.marquee, bg: '', color: '' },
  sections: { portadaBg: '#0b1011', testiBg: '#ffffff' },
  slides: SLIDES.map((s, k) => ({
    id: `s${k + 1}`,
    t_es: s.t, t_en: (SLIDES_EN[k] || {}).t || s.t,
    s_es: s.s, s_en: (SLIDES_EN[k] || {}).s || s.s,
    img: s.img, fit: 'cover', h: 640, posX: 50, posY: 50,
    overlay: 'rgba(0,0,0,.5)', textColor: '#ffffff', pillBg: '', pillColor: '',
  })),
  testimonios: TESTIMONIOS.map((x, k) => ({
    id: `t${k + 1}`, n: x.n,
    t_es: x.t, t_en: (TESTIMONIOS_EN[k] || {}).t || x.t,
    img: x.img, size: 56, bg: '#ffffff', textColor: '#1d1d1f',
  })),
  intro: {
    pill_es: H.intro.pill, pill_en: HE.intro.pill,
    h2_es: `${H.intro.h2a} ${H.intro.h2b}`, h2_en: `${HE.intro.h2a} ${HE.intro.h2b}`,
    p_es: `${H.intro.p1} ${H.intro.p2}${H.intro.p3} ${H.intro.p4} ${H.intro.p5} ${H.intro.p6} ${H.intro.p7}`,
    p_en: `${HE.intro.p1} ${HE.intro.p2}${HE.intro.p3} ${HE.intro.p4} ${HE.intro.p5} ${HE.intro.p6} ${HE.intro.p7}`,
    pt1t_es: H.intro.pt1t, pt1t_en: HE.intro.pt1t,
    pt1d_es: H.intro.pt1d, pt1d_en: HE.intro.pt1d,
    pt2t_es: H.intro.pt2t, pt2t_en: HE.intro.pt2t,
    pt2d_es: H.intro.pt2d, pt2d_en: HE.intro.pt2d,
    pt3t_es: H.intro.pt3t, pt3t_en: HE.intro.pt3t,
    pt3d_es: H.intro.pt3d, pt3d_en: HE.intro.pt3d,
    imgs: [imgOf(IMGS.aula), imgOf(IMGS.estudiantes), imgOf(IMGS.biblioteca)],
    bg: '', headingColor: '', textColor: '',
  },
  mods: {
    pill_es: H.mods.pill, pill_en: HE.mods.pill,
    h2_es: H.mods.h2, h2_en: HE.mods.h2,
    sub_es: H.mods.sub, sub_en: HE.mods.sub,
    bg: '',
    items: [
      { id: 'presencial', e: '🏫', t_es: 'Presencial', t_en: 'On-site', d_es: 'En sede Cusco · Huayllapampa', d_en: 'At our Cusco campus · Huayllapampa', img: imgOf(IMGS.aula),
        hijos: [
          { e: '📚', t_es: 'Regular', t_en: 'Regular', d_es: 'Clases semanales Lun–Vie · ideal si vives en Cusco o vienes a radicar.', d_en: 'Weekly Mon–Fri classes · ideal if you live in Cusco or come to stay.', img: imgOf(IMGS.clases) },
          { e: '⚡', t_es: 'Intensivo', t_en: 'Intensive', d_es: 'Módulos concentrados Ene–Feb y Jul · avanza un semestre en semanas.', d_en: 'Focused Jan–Feb and Jul modules · finish a semester in weeks.', img: imgOf(IMGS.estudiantes) },
        ] },
      { id: 'semi', e: '🔀', t_es: 'Semipresencial', t_en: 'Hybrid', d_es: 'Mitad en sede, mitad en casa', d_en: 'Half on campus, half at home', img: imgOf(IMGS.cusco),
        hijos: [
          { e: '🗓️', t_es: 'Encuentros mensuales', t_en: 'Monthly gatherings', d_es: 'Un fin de semana al mes en Cusco + clases virtuales entre encuentros.', d_en: 'One weekend a month in Cusco + online classes in between.', img: imgOf(IMGS.iglesia) },
          { e: '🧭', t_es: 'Campo guiado', t_en: 'Guided fieldwork', d_es: 'Prácticas en tu iglesia local con mentor SEMIT que te acompaña.', d_en: 'Practice at your local church with a SEMIT mentor.', img: imgOf(IMGS.selva) },
        ] },
      { id: 'virtual', e: '💻', t_es: 'Virtual', t_en: 'Online', d_es: 'Desde donde estés en el mundo', d_en: 'From anywhere in the world', img: imgOf(IMGS.biblioteca),
        hijos: [
          { e: '🎥', t_es: 'Online en vivo', t_en: 'Live online', d_es: 'Clases en vivo cada 1° lunes de mes · foro, preguntas y comunidad real.', d_en: 'Live classes every 1st Monday · forum, Q&A, real community.', img: imgOf(IMGS.biblia) },
          { e: '⏯️', t_es: 'Asincrónico', t_en: 'Self-paced', d_es: 'A tu ritmo, acceso de por vida · videos, guías y certificado igual de válido.', d_en: 'At your pace, lifetime access · videos, guides, equally valid certificate.', img: imgOf(IMGS.libros) },
        ] },
    ],
  },
  ruta: { pill_es: H.ruta.pill, pill_en: HE.ruta.pill, h2_es: H.ruta.h2, h2_en: HE.ruta.h2, sub_es: H.ruta.sub, sub_en: HE.ruta.sub, bg: '' },
  top: { pill_es: H.top.pill, pill_en: HE.top.pill, h2_es: H.top.h2, h2_en: HE.top.h2, sub_es: H.top.sub, sub_en: HE.top.sub, count: 4, bg: '' },
  teaser: { pill_es: H.teaser.pill, pill_en: HE.teaser.pill, bg: '' },
}

export const INICIO_ASSETS = [
  'assets/inicio/semit-7.jpg',
  'assets/inicio/semit-13.jpg',
  'assets/inicio/semit-14.jpg',
  'assets/inicio/semit-16.jpg',
  'assets/nosotros/semit-1.jpg',
  'assets/nosotros/semit-6.jpg',
  'assets/nosotros/semit-8.jpg',
  'assets/nosotros/semit-9.jpg',
  'assets/niveles/semit-11.jpg',
  'assets/niveles/semit-3.jpg',
  'assets/niveles/semit-5.jpg',
  'assets/cursos/semit-15.jpg',
  'assets/cursos/semit-19.jpg',
  'assets/cursos/semit-21.jpg',
  LOCAL.inicio1, LOCAL.inicio2, LOCAL.inicio3, LOCAL.inicio4,
].filter((v, k, a) => v && a.indexOf(v) === k)

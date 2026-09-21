import { EVENTO_IMGS, LOCAL } from '../../../shared/lib/images'

export const EV_CATS = ['Todos', 'Viajes Misioneros', 'Conferencias', 'Capacitaciones', 'Campamentos']
export const EV_MODS = ['Todos', 'Presencial', 'Híbrido', 'Virtual']

export const EV_CAT_INFO = {
  Todos: { e: '🌎', d: 'Toda la agenda SEMIT', img: LOCAL.eventosHero },
  'Viajes Misioneros': { e: '✈️', d: 'Campo real dentro y fuera del Perú', img: LOCAL.eventosA },
  Conferencias: { e: '🎤', d: 'Voces que encienden tu llamado', img: LOCAL.nosotrosHero },
  Capacitaciones: { e: '🛠️', d: 'Talleres prácticos de un día', img: LOCAL.cursosB },
  Campamentos: { e: '🏕️', d: 'Días inolvidables con tu generación', img: LOCAL.eventosB },
}

export const EVENTOS = [
  {
    n: 'Viaje Misionero · Amazonía Peruana', cat: 'Viajes Misioneros',
    d: 'Selva, ríos y comunidades nativas. 15 días con equipo dirigido por misioneros de campo.',
    fecha: '2026-10-17', hora: '05:00', lugar: 'Amazonía · salida Cusco', mod: 'Presencial',
    p: 450, cupos: 30, inscritos: 18, rating: 5.0,
    tag: '3 rutas', img: EVENTO_IMGS[0],
    programa: ['Día 1-3: preparación y envío en Cusco', 'Día 4-12: servicio en comunidades', 'Día 13-15: testimonio y retorno'],
  },
  {
    n: 'Capacitación · Predicación Expositiva', cat: 'Capacitaciones',
    d: 'Taller de un día: del texto al sermón. Trae tu Biblia y sal predicando.',
    fecha: '2026-10-03', hora: '09:00', lugar: 'SEMIT Cusco · Huayllapampa', mod: 'Híbrido',
    p: 0, cupos: 80, inscritos: 52, rating: 4.9,
    tag: 'Gratis', img: EVENTO_IMGS[1],
    programa: ['Mañana: observa e interpreta', 'Tarde: bosqueja y aplica', 'Cierre: predica 5 minutos'],
  },
  {
    n: 'Conferencia · Aviva Cusco 2026', cat: 'Conferencias',
    d: 'Dos noches de alabanza, palabra y llamado con invitados de Latinoamérica.',
    fecha: '2026-11-07', hora: '18:30', lugar: 'SEMIT Cusco · auditorio', mod: 'Presencial',
    p: 25, cupos: 300, inscritos: 214, rating: 5.0,
    tag: 'No te lo pierdas', img: EVENTO_IMGS[2],
    programa: ['Noche 1: avivamiento personal', 'Noche 2: llamado y envío', 'Concierto de alabanza + feria'],
  },
  {
    n: 'Campamento · Jóvenes Llamados', cat: 'Campamentos',
    d: '3 días fuera de la ciudad: fogatas, talleres, deporte y tiempo con Dios.',
    fecha: '2026-11-20', hora: '08:00', lugar: 'Campamento SEMIT · Valle', mod: 'Presencial',
    p: 90, cupos: 120, inscritos: 77, rating: 4.9,
    tag: 'Cupos limitados', img: EVENTO_IMGS[3],
    programa: ['Día 1: llegada y fogata', 'Día 2: talleres + deporte', 'Día 3: pacto y retorno'],
  },
  {
    n: 'Capacitación · Dones y Ministerio', cat: 'Capacitaciones',
    d: 'Descubre tu don, actívalo sirviendo y sal con un plan de servicio.',
    fecha: '2026-12-05', hora: '09:00', lugar: 'Virtual en vivo', mod: 'Virtual',
    p: 0, cupos: 200, inscritos: 131, rating: 4.8,
    tag: 'Gratis', img: EVENTO_IMGS[4],
    programa: ['Test de dones guiado', 'Cómo servir en tu iglesia', 'Plan personal de 30 días'],
  },
  {
    n: 'Campamento · Familia sobre la Roca', cat: 'Campamentos',
    d: 'Fin de semana para toda la familia: juegos, talleres para padres e hijos.',
    fecha: '2027-01-09', hora: '08:00', lugar: 'Campamento SEMIT · Valle', mod: 'Presencial',
    p: 120, cupos: 90, inscritos: 41, rating: 4.9,
    tag: 'Familiar', img: EVENTO_IMGS[5],
    programa: ['Sábado: juegos y talleres', 'Domingo: culto familiar', 'Pacto familiar + foto'],
  },
  {
    n: 'Viaje Misionero · Norte Perú + Ecuador', cat: 'Viajes Misioneros',
    d: 'Costa, sierra y frontera misionera. 18 días transculturales con tu equipo.',
    fecha: '2027-01-15', hora: '05:00', lugar: 'Salida Cusco → Norte → Ecuador', mod: 'Presencial',
    p: 520, cupos: 25, inscritos: 11, rating: 5.0,
    tag: '3 rutas', img: EVENTO_IMGS[1],
    programa: ['Semana 1: norte peruano', 'Semana 2: frontera Ecuador', 'Cierre: informe y envío'],
  },
  {
    n: 'Conferencia · Misiones Hasta lo Último', cat: 'Conferencias',
    d: 'Estrategia global, testimonios de campo y feria de agencias misioneras.',
    fecha: '2027-02-05', hora: '18:30', lugar: 'SEMIT Cusco · auditorio', mod: 'Híbrido',
    p: 30, cupos: 250, inscritos: 96, rating: 4.9,
    tag: 'Transmisión en vivo', img: EVENTO_IMGS[2],
    programa: ['Plenarias misioneras', 'Panel: obreros en campo', 'Feria + noche de envío'],
  },
  {
    n: 'Viaje Misionero · Chile + Argentina', cat: 'Viajes Misioneros',
    d: 'Cono sur transcultural urbano. 20 días de servicio y plantación.',
    fecha: '2027-02-20', hora: '05:00', lugar: 'Salida Cusco → Chile → Argentina', mod: 'Presencial',
    p: 680, cupos: 20, inscritos: 7, rating: 5.0,
    tag: '3 rutas', img: EVENTO_IMGS[0],
    programa: ['Etapa Chile: ciudad y campus', 'Etapa Argentina: barrios e iglesias', 'Retorno con informe'],
  },
  {
    n: 'Capacitación · Evangelismo Urbano', cat: 'Capacitaciones',
    d: 'Medio día en calles y plazas de Cusco: teoría corta y práctica real.',
    fecha: '2027-03-06', hora: '09:00', lugar: 'Plaza San Jerónimo · Cusco', mod: 'Presencial',
    p: 0, cupos: 100, inscritos: 38, rating: 4.9,
    tag: 'Gratis', img: EVENTO_IMGS[4],
    programa: ['Taller: comparte en 3 minutos', 'Salida en parejas', 'Testimonios y celebración'],
  },
]

export const BCB_AREAS = [
  { e: '📖', t: 'Misiones', d: 'Llamado, estrategia y campo transcultural.', img: LOCAL.nosotrosA },
  { e: '✝️', t: 'Biblia', d: 'Panorama y estudio inductivo aplicado.', img: LOCAL.cursosA },
  { e: '⛪', t: 'Teología', d: 'Doctrina sólida para enseñar a otros.', img: LOCAL.nosotrosHero },
  { e: '🛠️', t: 'Bi-vocacional', d: 'Oficio técnico para sostener tu ministerio.', img: LOCAL.cursosB },
]

export const BCB_OFICIOS = [
  { e: '🪚', t: 'Carpintería', d: 'Melamina y madera.', img: LOCAL.cursosB },
  { e: '🍳', t: 'Gastronomía', d: 'Alta cocina práctica.', img: LOCAL.inicio3 },
  { e: '💈', t: 'Peluquería', d: 'Profesional y rentable.', img: LOCAL.nosotrosB },
  { e: '🔥', t: 'Soldadura', d: 'Estructuras metálicas.', img: LOCAL.cursosHero },
]

export const BCB_INCLUYE = [
  { e: '🏠', t: 'Hospedaje', d: 'En lugar tranquilo.', img: LOCAL.nosotrosC },
  { e: '🍲', t: 'Alimentación', d: 'Adecuada y balanceada.', img: LOCAL.inicio4 },
  { e: '📚', t: 'Materiales y libros', d: 'Todo lo necesario.', img: LOCAL.nivelesHero },
  { e: '✈️', t: 'Viajes misioneros', d: 'Salidas semanales.', img: LOCAL.eventosA },
]

export const BCB_COSTOS = [
  { tag: 'Oct', p: 'S/.750', n: 'Promoción Octubre. Inscríbete en octubre.' },
  { tag: 'Nov', p: 'S/.800', n: 'Promoción Noviembre. Inscríbete en noviembre.' },
  { tag: 'Dic', p: 'S/.850', n: 'Promoción Diciembre. Inscríbete en diciembre.' },
  { tag: 'Ene', p: 'S/.880', n: 'Costo Regular. Hasta el 10 de enero 2026.' },
  { tag: 'Sem', p: 'S/.250', n: 'Costo Semanal lun-dom. Incluye gastos y salida misionera.' },
]

export const BCB_CAMPOS = [
  { t: 'Amazonía Peruana', d: 'Selva, ríos y comunidades nativas.', img: LOCAL.eventosA },
  { t: 'Norte Perú + Ecuador', d: 'Costa, sierra y frontera misionera.', img: LOCAL.eventosB },
  { t: 'Chile + Argentina', d: 'Cono sur transcultural urbano.', img: LOCAL.eventosC },
]

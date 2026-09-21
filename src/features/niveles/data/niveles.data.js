import { U } from '../../../shared/lib/images'

export const RAMAS = [
  { id: 'pre', label: 'Pregrado', e: '🎓', d: 'Empieza desde cero: certificado, diplomado y bachillerato.', img: U('photo-1523240795612-9a054b0db644', 400) },
  { id: 'post', label: 'Postgrado', e: '🏛️', d: 'Profundiza tu llamado: licenciatura y maestría.', img: U('photo-1481627834876-b7833e8f5570', 400) },
]

export const SUBS = {
  pre: [
    { id: 'certificado', label: 'Certificado Especializado', e: '📜', d: '4–6 meses · base bíblica y oficio', img: U('photo-1519452575417-564c1401ecc0', 400) },
    { id: 'diplomado', label: 'Diplomado', e: '📚', d: '1 año · teología y ministerio', img: U('photo-1504052434569-70ad5836ab65', 400) },
    { id: 'bachillerato', label: 'Bachillerato', e: '🎓', d: '3 años · formación integral', img: U('photo-1524995997946-a1c2e315a42f', 400) },
  ],
  post: [
    { id: 'licenciatura', label: 'Licenciatura', e: '⚖️', d: '1 año post-bachiller · investiga y enseña', img: U('photo-1438032005730-c779502df39b', 400) },
    { id: 'maestria', label: 'Maestría', e: '👑', d: '2 años · artes o divinidades', img: U('photo-1503676260728-1c00da094a0b', 400) },
  ],
}

export const MAESTRIAS = [
  { id: 'artes', label: 'Artes', e: '🎨', d: 'M.A. · Liderazgo y adoración', img: U('photo-1511632765486-a01980e01a18', 400) },
  { id: 'divinidades', label: 'Divinidades', e: '✝️', d: 'M.Div. · Pastoral y misiones', img: U('photo-1526392060635-9d6019884377', 400) },
]

export const NIVEL_MODS = ['Todos', 'Virtual', 'Híbrido', 'Presencial']

export const RUTA = [
  { id: 'certificado', t: 'Certificado', e: '📜', img: U('photo-1519452575417-564c1401ecc0', 400) },
  { id: 'diplomado', t: 'Diplomado', e: '📚', img: U('photo-1504052434569-70ad5836ab65', 400) },
  { id: 'bachillerato', t: 'Bachillerato', e: '🎓', img: U('photo-1524995997946-a1c2e315a42f', 400) },
  { id: 'licenciatura', t: 'Licenciatura', e: '⚖️', img: U('photo-1438032005730-c779502df39b', 400) },
  { id: 'maestria', t: 'Maestría', e: '👑', img: U('photo-1503676260728-1c00da094a0b', 400) },
]

export const NIVELES = [
  {
    n: 'Certificado en Biblia Aplicada', rama: 'pre', sub: 'certificado', mae: null,
    a: 'Biblia', d: 'Juan, Romanos y vida cristiana. Ideal para empezar a servir este mismo año.',
    p: 120, mod: 'Virtual', dur: '6 meses', semanas: 24, lecciones: 36, rating: 4.9, est: 412,
    tag: 'Para empezar', img: U('photo-1519452575417-564c1401ecc0', 800),
    incluye: ['Juan: el evangelio del amor', 'Romanos: gracia y fe', 'Vida cristiana y oración', 'Proyecto: comparte tu testimonio'],
  },
  {
    n: 'Certificado Bi-vocacional Misionero', rama: 'pre', sub: 'certificado', mae: null,
    a: 'Ministerio', d: 'Biblia + oficio técnico: carpintería, gastronomía, peluquería o soldadura.',
    p: 150, mod: 'Presencial', dur: '6 meses', semanas: 24, lecciones: 40, rating: 4.8, est: 268,
    tag: 'Oficio + misión', img: U('photo-1488521787991-ed7bbaae773c', 800),
    incluye: ['Base bíblica intensiva', 'Oficio a elegir (4 opciones)', 'Salidas misioneras Cusco', 'Proyecto: sirve con tu oficio'],
  },
  {
    n: 'Diplomado en Teología y Biblia', rama: 'pre', sub: 'diplomado', mae: null,
    a: 'Teología', d: 'Teología I, Pneumatología y panorama bíblico completo en 1 año.',
    p: 280, mod: 'Híbrido', dur: '1 año', semanas: 40, lecciones: 72, rating: 4.9, est: 324,
    tag: 'El más pedido', img: U('photo-1504052434569-70ad5836ab65', 800),
    incluye: ['Antiguo y Nuevo Testamento', 'Teología I + Pneumatología', 'Hermenéutica y predicación', 'Proyecto: enseña un curso'],
  },
  {
    n: 'Diplomado en Misiones Transculturales', rama: 'pre', sub: 'diplomado', mae: null,
    a: 'Ministerio', d: 'Base BCB + campo corto: Amazonía o sierra. Descubre tu llamado.',
    p: 320, mod: 'Híbrido', dur: '1 año', semanas: 40, lecciones: 64, rating: 5.0, est: 198,
    tag: 'Con campo real', img: U('photo-1440342359743-84fcb8c21f21', 800),
    incluye: ['Base misionera en Cusco', 'Viaje transcultural 15 días', 'Antropología y lengua', 'Proyecto: plan misionero'],
  },
  {
    n: 'Bachillerato en Teología', rama: 'pre', sub: 'bachillerato', mae: null,
    a: 'Teología', d: '3 años: lenguas bíblicas, teología sistemática y pastoral. El corazón de SEMIT.',
    p: 900, mod: 'Presencial', dur: '3 años', semanas: 120, lecciones: 180, rating: 4.9, est: 156,
    tag: 'Formación integral', img: U('photo-1481627834876-b7833e8f5570', 800),
    incluye: ['Griego y hebreo introductorio', 'Teología sistemática I–III', 'Pastoral y consejería', 'Tesis + práctica en iglesia'],
  },
  {
    n: 'Bachillerato en Misiones', rama: 'pre', sub: 'bachillerato', mae: null,
    a: 'Ministerio', d: '3 años: plantación de iglesias, campo largo y bi-vocacional avanzado.',
    p: 950, mod: 'Presencial', dur: '3 años', semanas: 120, lecciones: 176, rating: 4.9, est: 132,
    tag: 'Hasta lo último', img: U('photo-1464822759023-fed622ff2c3b', 800),
    incluye: ['Misiología y plantación', 'Campo transcultural largo', 'Oficio bi-vocacional II', 'Proyecto final en campo'],
  },
  {
    n: 'Licenciatura en Teología', rama: 'post', sub: 'licenciatura', mae: null,
    a: 'Teología', d: '1 año post-bachiller: investigación, docencia y teología avanzada.',
    p: 750, mod: 'Híbrido', dur: '1 año', semanas: 40, lecciones: 48, rating: 4.9, est: 88,
    tag: 'Investiga y enseña', img: U('photo-1523240795612-9a054b0db644', 800),
    incluye: ['Métodos de investigación', 'Teología contemporánea', 'Docencia universitaria', 'Tesis de licenciatura'],
  },
  {
    n: 'Licenciatura en Misiones y Plantación', rama: 'post', sub: 'licenciatura', mae: null,
    a: 'Ministerio', d: 'Estrategia global, liderazgo y plantación de iglesias multiculturales.',
    p: 780, mod: 'Híbrido', dur: '1 año', semanas: 40, lecciones: 46, rating: 4.8, est: 74,
    tag: 'Envía y planta', img: U('photo-1524995997946-a1c2e315a42f', 800),
    incluye: ['Estrategia y movilización', 'Liderazgo transcultural', 'Plantación avanzada', 'Proyecto: planta o revitaliza'],
  },
  {
    n: 'Maestría en Artes · Liderazgo Cristiano', rama: 'post', sub: 'maestria', mae: 'artes',
    a: 'Ministerio', d: 'M.A. 2 años: liderazgo, adoración, comunicación y gestión ministerial.',
    p: 1400, mod: 'Virtual', dur: '2 años', semanas: 80, lecciones: 72, rating: 5.0, est: 61,
    tag: 'M.A. · Artes', img: U('photo-1503676260728-1c00da094a0b', 800),
    incluye: ['Liderazgo y gobernanza', 'Adoración y creatividad', 'Comunicación y medios', 'Tesis aplicada M.A.'],
  },
  {
    n: 'Maestría en Divinidades · M.Div', rama: 'post', sub: 'maestria', mae: 'divinidades',
    a: 'Teología', d: 'M.Div. 2 años: exégesis, predicación, pastoral y misiones. El grado pastoral.',
    p: 1500, mod: 'Híbrido', dur: '2 años', semanas: 80, lecciones: 84, rating: 5.0, est: 57,
    tag: 'M.Div. · Pastoral', img: U('photo-1438032005730-c779502df39b', 800),
    incluye: ['Exégesis griego/hebreo', 'Homilética avanzada', 'Teología pastoral', 'Tesis + internado M.Div.'],
  },
]

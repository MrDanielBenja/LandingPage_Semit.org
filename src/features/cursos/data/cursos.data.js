import { U } from '../../../shared/lib/images'

export const AREAS = ['Todos', 'Biblia', 'Teología', 'Ministerio']
export const MODS = ['Todos', 'Virtual', 'Híbrido', 'Presencial']
export const NIVELES = ['Fundamentos', 'Intermedio', 'Avanzado']

export const CURSOS = [
  {
    n: 'Amós', a: 'Biblia', d: 'Justicia y profecía para hoy. 4 semanas, guía + foro en vivo.',
    p: 30, mod: 'Híbrido', nivel: 'Fundamentos', semanas: 4, lecciones: 12, rating: 4.9, est: 214,
    tag: 'Más pedido', img: U('photo-1504052434569-70ad5836ab65', 800),
    temario: ['Amós y su tiempo: contexto histórico', 'Justicia social en el profeta', 'Juicio y esperanza', 'Proyecto: predica Amós hoy'],
  },
  {
    n: 'Pneumatología', a: 'Teología', d: 'Persona y obra del Espíritu Santo con base bíblica.',
    p: 40, mod: 'Híbrido', nivel: 'Intermedio', semanas: 6, lecciones: 18, rating: 4.9, est: 186,
    tag: 'Profundiza', img: U('photo-1438032005730-c779502df39b', 800),
    temario: ['Quién es el Espíritu Santo', 'Bautismo y llenura', 'Dones y fruto', 'Vida en el Espíritu'],
  },
  {
    n: 'Nuevo Testamento', a: 'Biblia', d: 'Panorama completo del NT en un semestre.',
    p: 30, mod: 'Virtual', nivel: 'Fundamentos', semanas: 8, lecciones: 24, rating: 4.8, est: 342,
    tag: 'Ruta base', img: U('photo-1481627834876-b7833e8f5570', 800),
    temario: ['Evangelios y Jesús', 'Hechos y la Iglesia', 'Cartas apostólicas', 'Apocalipsis y esperanza'],
  },
  {
    n: 'Romanos', a: 'Biblia', d: 'Gracia, fe y justificación verso a verso.',
    p: 30, mod: 'Virtual', nivel: 'Intermedio', semanas: 6, lecciones: 18, rating: 5.0, est: 298,
    tag: 'Favorito', img: U('photo-1524995997946-a1c2e315a42f', 800),
    temario: ['El evangelio revelado (1-5)', 'Vida en el Espíritu (6-8)', 'Israel y las promesas (9-11)', 'Vida transformada (12-16)'],
  },
  {
    n: 'Juan', a: 'Biblia', d: 'El evangelio del amor y la vida eterna.',
    p: 30, mod: 'Virtual', nivel: 'Fundamentos', semanas: 5, lecciones: 15, rating: 4.9, est: 264,
    tag: 'Para empezar', img: U('photo-1519452575417-564c1401ecc0', 800),
    temario: ['El Verbo se hizo carne', 'Señales y discursos', 'Pasión y resurrección', 'Creer y tener vida'],
  },
  {
    n: 'Apologética', a: 'Teología', d: 'Responde con fundamento y mansedumbre.',
    p: 30, mod: 'Virtual', nivel: 'Avanzado', semanas: 5, lecciones: 15, rating: 4.8, est: 175,
    tag: 'Defiende tu fe', img: U('photo-1503676260728-1c00da094a0b', 800),
    temario: ['¿Por qué creer?', 'Evidencias de la resurrección', 'Objeciones difíciles', 'Conversaciones con mansedumbre'],
  },
  {
    n: 'Teología I', a: 'Teología', d: 'Fundamentos doctrinales sólidos.',
    p: 40, mod: 'Presencial', nivel: 'Fundamentos', semanas: 8, lecciones: 24, rating: 4.9, est: 158,
    tag: 'En Cusco', img: U('photo-1523240795612-9a054b0db644', 800),
    temario: ['Revelación y Escritura', 'Dios y la Trinidad', 'Cristo y salvación', 'Iglesia y futuro'],
  },
  {
    n: 'Dones Espirituales', a: 'Ministerio', d: 'Descubre y activa tus dones.',
    p: 30, mod: 'Virtual', nivel: 'Intermedio', semanas: 4, lecciones: 12, rating: 4.9, est: 231,
    tag: 'Actívate', img: U('photo-1488521787991-ed7bbaae773c', 800),
    temario: ['Qué son los dones', 'Descubre el tuyo', 'Actívalo sirviendo', 'Multiplícate enseñando'],
  },
]

export const TRACK_INFO = {
  Todos: { e: '🌎', d: 'Todo el catálogo', img: U('photo-1524178232363-1fb2b075b655', 400) },
  Biblia: { e: '📖', d: 'Lee y enseña la Palabra', img: U('photo-1504052434569-70ad5836ab65', 400) },
  Teología: { e: '⛪', d: 'Doctrina que se vive', img: U('photo-1438032005730-c779502df39b', 400) },
  Ministerio: { e: '🌱', d: 'Sirve y multiplica', img: U('photo-1488521787991-ed7bbaae773c', 400) },
}

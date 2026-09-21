const A = (p) => `assets/${p}`

export const LOCAL = {
  inicio1: A('inicio/semit-7.jpg'),
  inicio2: A('inicio/semit-13.jpg'),
  inicio3: A('inicio/semit-14.jpg'),
  inicio4: A('inicio/semit-16.jpg'),
  nosotrosHero: A('nosotros/semit-1.jpg'),
  nosotrosA: A('nosotros/semit-6.jpg'),
  nosotrosB: A('nosotros/semit-8.jpg'),
  nosotrosC: A('nosotros/semit-9.jpg'),
  nivelesHero: A('niveles/semit-3.jpg'),
  nivelesA: A('niveles/semit-11.jpg'),
  nivelesB: A('niveles/semit-5.jpg'),
  cursosHero: A('cursos/semit-15.jpg'),
  cursosA: A('cursos/semit-19.jpg'),
  cursosB: A('cursos/semit-21.jpg'),
  eventosHero: A('eventos/semit-4.jpg'),
  eventosA: A('eventos/semit-10.jpg'),
  eventosB: A('eventos/semit-22.jpg'),
  eventosC: A('eventos/semit-23.jpg'),
  contactoHero: A('contacto/semit-12.jpg'),
  contactoA: A('contacto/semit-20.jpg'),
  contactoB: A('contacto/semit-24.jpg'),
}

export const IMGS = {
  aula: LOCAL.cursosHero,
  biblia: LOCAL.cursosA,
  biblioteca: LOCAL.nivelesA,
  iglesia: LOCAL.nosotrosHero,
  estudiantes: LOCAL.inicio2,
  selva: LOCAL.eventosA,
  andes: LOCAL.eventosB,
  mision: LOCAL.nosotrosA,
  clases: LOCAL.cursosB,
  libros: LOCAL.nivelesHero,
  cusco: LOCAL.inicio1,
  manos: LOCAL.contactoHero,
  mapa: LOCAL.contactoA,
}

export const CURSO_IMGS = [
  LOCAL.cursosHero,
  LOCAL.cursosA,
  LOCAL.cursosB,
  LOCAL.nosotrosA,
  LOCAL.nosotrosB,
  LOCAL.nosotrosC,
  LOCAL.nivelesA,
  LOCAL.nivelesB,
]

export const EVENTO_IMGS = [
  LOCAL.eventosHero,
  LOCAL.eventosA,
  LOCAL.eventosB,
  LOCAL.eventosC,
  LOCAL.inicio1,
  LOCAL.inicio2,
]

export const NIVEL_IMGS = [
  LOCAL.nivelesHero,
  LOCAL.nivelesA,
  LOCAL.nivelesB,
  LOCAL.cursosA,
  LOCAL.cursosB,
]

export const TEAM_IMGS = [
  LOCAL.nosotrosHero,
  LOCAL.nosotrosA,
  LOCAL.nosotrosB,
  LOCAL.nosotrosC,
  LOCAL.inicio1,
  LOCAL.inicio2,
  LOCAL.inicio3,
]

export const pick = (arr, k) => arr[k % arr.length]

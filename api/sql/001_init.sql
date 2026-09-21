CREATE TABLE IF NOT EXISTS cursos (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  area TEXT NOT NULL CHECK (area IN ('Biblia','Teología','Ministerio')),
  descripcion TEXT NOT NULL DEFAULT '',
  precio INT NOT NULL DEFAULT 30,
  precio_regular INT NOT NULL DEFAULT 40,
  modalidad TEXT NOT NULL DEFAULT 'Virtual' CHECK (modalidad IN ('Virtual','Híbrido','Presencial')),
  nivel TEXT NOT NULL DEFAULT 'Fundamentos' CHECK (nivel IN ('Fundamentos','Intermedio','Avanzado')),
  semanas INT NOT NULL DEFAULT 4,
  lecciones INT NOT NULL DEFAULT 12,
  rating NUMERIC(2,1) NOT NULL DEFAULT 4.9,
  inscritos INT NOT NULL DEFAULT 0,
  tag TEXT DEFAULT '',
  imagen_url TEXT DEFAULT '',
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS temario (
  id SERIAL PRIMARY KEY,
  curso_id INT NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  orden INT NOT NULL DEFAULT 1,
  titulo TEXT NOT NULL
);

INSERT INTO cursos (slug, nombre, area, descripcion, precio, precio_regular, modalidad, nivel, semanas, lecciones, rating, inscritos, tag, imagen_url) VALUES
('amos','Amós','Biblia','Justicia y profecía para hoy. 4 semanas, guía + foro en vivo.',30,40,'Híbrido','Fundamentos',4,12,4.9,214,'Más pedido','assets/cursos/semit-15.jpg'),
('pneumatologia','Pneumatología','Teología','Persona y obra del Espíritu Santo con base bíblica.',40,50,'Híbrido','Intermedio',6,18,4.9,186,'Profundiza','assets/cursos/semit-19.jpg'),
('nuevo-testamento','Nuevo Testamento','Biblia','Panorama completo del NT en un semestre.',30,40,'Virtual','Fundamentos',8,24,4.8,342,'Ruta base','assets/cursos/semit-21.jpg'),
('romanos','Romanos','Biblia','Gracia, fe y justificación verso a verso.',30,40,'Virtual','Intermedio',6,18,5.0,298,'Favorito','assets/nosotros/semit-6.jpg'),
('juan','Juan','Biblia','El evangelio del amor y la vida eterna.',30,40,'Virtual','Fundamentos',5,15,4.9,264,'Para empezar','assets/nosotros/semit-8.jpg'),
('apologetica','Apologética','Teología','Responde con fundamento y mansedumbre.',30,40,'Virtual','Avanzado',5,15,4.8,175,'Defiende tu fe','assets/nosotros/semit-9.jpg'),
('teologia-1','Teología I','Teología','Fundamentos doctrinales sólidos.',40,50,'Presencial','Fundamentos',8,24,4.9,158,'En Cusco','assets/niveles/semit-11.jpg'),
('dones-espirituales','Dones Espirituales','Ministerio','Descubre y activa tus dones.',30,40,'Virtual','Intermedio',4,12,4.9,231,'Actívate','assets/niveles/semit-5.jpg')
ON CONFLICT (slug) DO NOTHING;

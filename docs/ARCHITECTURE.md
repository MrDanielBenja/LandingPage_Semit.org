# SEMIT — WebML + Screaming Architecture

## Mapa WebML
- **Data (M)**: `src/features/*/data/*.data.js` + `src/shared/config/site.js`
  - `home.data.js` → slides, testimonios, BCB (oficios, costos, campo)
  - `cursos.data.js` → catálogo + áreas
  - `nosotros.data.js` → funcs, fe, team
  - `contacto.data.js` → asuntos, faqs, canales
- **Hypertext (V)**: `src/features/*/components/*.jsx` + `src/features/*/*Page.jsx`
  - Nodos = páginas; unidades = componentes (Portada, BcbDetalle, Equipo, etc.)
  - Links = `react-router-dom` en `src/App.jsx`
- **Presentation (P)**: `src/shared/styles/global.css` + `src/shared/ui/*`
  - Un solo tema claro/oscuro vía `html[data-theme]`
- **Core services**: `src/core/services/whatsapp.js` (operación waLink/openWa)

## Screaming (grita dominio)
```
src/
  app/            # shell: layout/Nav/Footer/ScrollTop, providers/Theme
  shared/         # config, hooks, lib/images, ui/Stat/SectionHead, styles
  core/           # services transversales
  features/
    home/         # Portada, Destacado, BcbDetalle, CursosResumen, Newsletter
    cursos/       # CursoCard, CursoModal
    nosotros/     # QuienesSomos, Funciones, DeclaracionFe, Equipo
    contacto/     # InfoCards, ContactoPanels
```

## Reglas de escala
1. Nuevo dominio → `src/features/<dominio>/{<Dominio>Page.jsx,components/,data/}`
2. Nunca importar entre features; compartir vía `shared/` o `core/`
3. Datos fuera del JSX; componentes tontos + páginas que componen
4. Añadir ruta en `src/App.jsx` + link en `src/shared/config/site.js`
5. Estilos solo en `shared/styles/global.css` con prefijo del feature

## V2 — Eventos (2026-09)
- Filtros: solo buscador + categorías + Ver + Vista (sin Modalidad/Ordenar).
- Vista Año: calendario anual estilo mood (`ev-mood-cal`, 12 `ev-mmonth`, burbujas `ev-circle.has cat-N`).
  Click burbuja → `EventoDrawer`; click título de mes → vista lista filtrada.
- Vistas excluyentes: `lista` XOR `cal`.
- Keys de lista: `${fecha}-${nombre}` / `${nombre}-${k}` (nunca solo nombre).
- Conteos filtrados por año (`yearBase`), no `EVENTOS.length` global.
- `/bcb` → `EventosPage` + scroll a `#bcb` (`ScrollTop` respeta hash).
- BCB: stepper solo 01 Base + 02 Campo; Áreas/Oficios/Incluido = tarjetas con foto (`bcb-photo`).
  `BCB_INCLUYE` es `objeto[]` `{e,t,d,img}` (era `string[]`).
- Fotos reales en `public/assets/` (`LOCAL` en `shared/lib/images.js`): hero home + nosotros.

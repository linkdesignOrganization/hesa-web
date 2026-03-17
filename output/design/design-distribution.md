# Plan de Distribucion — Design Team

**Generado por**: Design Orchestrator
**Fecha**: 2026-03-17
**Version**: 1.0
**Proyecto**: HESA (Herrera y Elizondo S.A.) Sitio Web y Panel de Administracion

---

## Contexto del Proyecto

- **Tipo de aplicacion**: Sitio web corporativo B2B (catalogo informativo profesional, NO e-commerce) + Panel de administracion desktop-first
- **Stack**: Angular 19+ (standalone components, signals, SSR) + Bootstrap 5 + CSS custom properties (design tokens) + Node.js/Express
- **Dos aplicaciones independientes**:
  - Sitio publico: mobile-first, SSR, bilingue ES/EN, referencia visual Tuft & Paw
  - Panel admin: desktop-first, SPA, referencia visual Dashly Template
- **Audiencias**: Clientes locales (veterinarias, pet shops, groomers) + fabricantes internacionales (Asia)
- **Colores de marca**: Azul HESA #008DC9 (primario), Verde HESA #50B92A (secundario), Azul oscuro #005A85 (footer/hover)
- **Tipografia de marca**: Inter (fuente recomendada final), sans-serif moderna, pesos 400-800
- **Fuente de diseno**: Design briefs del cliente (via visual-analysis.md)

### Patrones premium clave de las referencias

**De Tuft & Paw (sitio publico):**
1. Hero full-viewport (100vh) con overlay gradient, texto superpuesto, 2 CTAs
2. Bloques storytelling con color (border-radius 24px, padding 72px, img+texto alternados)
3. Carrusel de product cards con dots pill + flechas circulares
4. Barra sticky de producto (top desktop, bottom mobile)
5. Detalle producto 2 columnas (55% galeria + 45% info) con thumbnails verticales
6. Footer con logo grande como brand closure, acordeones en mobile
7. Header minimalista con menu limpio, logo cambia a isotipo al scroll
8. Whitespace extremadamente generoso (80-120px entre secciones)
9. Logos marcas en escala de grises, hover a color
10. Count-up animation en numeros clave

**De Dashly (panel):**
1. Cards de resumen con icono en circulo de color suave + dato numerico grande
2. Card view (default) / Table view con toggle pill
3. Tablas con headers UPPERCASE 12-13px + badges pill semanticos
4. Formularios con secciones (subtitulo bold + descripcion gris + separador)
5. Tabs pill con icono + texto (activo=#008DC9, inactivo=outline gris)
6. Kanban board con cards en 3 columnas + drag-and-drop
7. Cards de categoria con icono en circulo + conteo + barra de progreso
8. Sidebar fijo 272px con item activo en azul suave
9. Fondo area de contenido #F7F8FA, cards blancas con sombra sutil
10. Empty states con ilustracion + mensaje + CTA

---

## Instrucciones Prescriptivas del Brief (de visual-analysis.md)

- Los valores de color, tipografia y spacing son PRESCRIPTIVOS del cliente — NO modificar
- Los hex codes de la seccion 2 de visual-analysis.md son EXACTOS: #008DC9, #50B92A, #005A85, #E8F4FD, #EDF7E8, #F0F2F5, #F5F7FA, #1F2937, #6B7280, #E5E7EB, #F7F8FA
- Los colores semanticos del panel son EXACTOS: #22C55E (exito), #EF4444 (error), #F59E0B (atencion), con sus fondos suaves
- La familia tipografica es Inter (decision holistica 10.3) — no cambiar
- Los rangos de spacing tienen valores finales recomendados (ej: 72px desktop / 48px mobile para bloques color) — usar esos valores finales

### Anti-patrones mandatorios (18 total):
1. SIN precios de productos en ningun lugar
2. SIN inventario / disponibilidad de stock
3. SIN carrito de compras
4. SIN checkout / pasarela de pago
5. SIN registro de usuarios / login de clientes en sitio publico
6. SIN seccion de ofertas o descuentos
7. SIN resenas o calificaciones de usuarios
8. SIN blog
9. SIN chat en vivo (solo WhatsApp flotante)
10. SIN fotos tiernas/B2C de mascotas (imagenes profesionales veterinarias B2B)
11. SIN layouts genericos tipo competencia (superar a Monteco/VETIM/Belina)
12. SIN listas planas para productos en el panel (siempre cards con imagen)
13. SIN multiples acciones en una pantalla del panel (separar VER/CREAR-EDITAR/DETALLE)
14. SIN modals para formularios largos del panel (pantalla completa)
15. SIN formularios sin secciones en el panel (siempre subtitulo + descripcion + separador)
16. SIN campos no aplicables visibles en el panel (campos condicionales segun categoria)
17. SIN estados vacios sin disenar en el panel (siempre ilustracion + mensaje + CTA)
18. SIN estados como texto plano en el panel (siempre badges con color)

---

## Asignacion: Visual System Designer -> design-tokens.md

### Criterios asignados (de requirements.md)

**Tokens de color:**
- REQ-007: Estado activo visualmente distinguible en link de navegacion
- REQ-082: Badge de marca en cards de producto
- REQ-093: Pills/badges de filtros activos
- REQ-112: Badges/iconos de especie de destino
- REQ-114: Pills de presentaciones disponibles (farmacos)
- REQ-145: Badges de categorias en cards de marcas
- REQ-214: Item de menu activo en sidebar panel (fondo azul suave, texto azul)
- REQ-227: Badge de categoria (color segun tipo) y badge de estado (verde/gris) en cards de productos del panel
- REQ-291: Badge de tipo en cards de mensajes (color por tipo de consulta)
- REQ-296: Colores por tipo de mensaje: Informacion=azul, Comercial=verde, Soporte=naranja, Fabricante=morado, Otro=gris
- NFR-024: Contrastes de color WCAG 2.1 AA (4.5:1 texto normal, 3:1 texto grande)

**Tokens de tipografia:**
- REQ-044: Headline principal grande en hero
- REQ-063: Numero/dato destacado grande en propuesta de valor
- REQ-110: Nombre del producto titulo grande en detalle
- REQ-143: Titulo de pagina de marcas
- REQ-157: Numeros clave con datos impactantes en pagina Nosotros

**Tokens de spacing/layout general:**
- REQ-042: Hero 100vh
- REQ-024: Boton flotante con separacion adecuada del borde
- NFR-026: Area de toque minima 44x44px en mobile

**Tokens de animaciones:**
- BVC-005: Animaciones sutiles y profesionales (duraciones <= 0.3s hover, <= 0.5s scroll)
- BVC-033: Hover cards shadow + scale(1.02) con transicion 0.3s

### Instrucciones especificas

**1. Paleta de colores — Usar hex codes EXACTOS del visual-analysis.md Seccion 2:**

Sitio publico:
- Primario: #008DC9 (Azul HESA)
- Secundario: #50B92A (Verde HESA)
- Azul oscuro: #005A85 (footer, hover)
- Neutros: #FFFFFF, #F5F7FA, #6B7280, #1F2937
- Bloques color: #E8F4FD (farmacos), #EDF7E8 (alimentos), #F0F2F5 (equipos)
- Bordes/separadores: #E5E7EB

Panel:
- Todos los anteriores + semanticos: #22C55E (exito), #EF4444 (error), #F59E0B (atencion)
- Fondos suaves: #EBF5FF (azul), #DCFCE7 (verde), #FEE2E2 (rojo), #FEF3C7 (naranja)
- Fondo area contenido: #F7F8FA
- Bordes: #E5E7EB

Aplicar los colores semanticos del panel TAMBIEN en el sitio publico para consistencia (decision holistica 10.2).

**2. Tipografia — Usar specs EXACTAS del visual-analysis.md Seccion 3:**

- Familia: Inter (Google Fonts), pesos: 400, 500, 600, 700, 800
- Hero headline desktop: Inter Extrabold 800, 56px, letter-spacing -0.02em (decision holistica 10.3)
- H2 secciones: Inter Bold 700, 42px, letter-spacing -0.01em
- Subtitulos pagina: 36-48px Bold 700
- Numeros destacados: 36-64px Bold
- Cuerpo: 16-18px Regular 400 / Medium 500, line-height 1.6-1.7
- Labels/metadata: 12-14px Medium 500 / Semibold 600, UPPERCASE, letter-spacing 0.08em
- Panel card nombre: 16px Bold, card texto secundario: 14px Regular
- Panel headers tabla: 12-13px UPPERCASE Semibold
- Panel subtitulo formulario: 18-20px Bold
- Panel descripcion formulario: 14px Regular gris

**3. Spacing — Usar valores EXACTOS del visual-analysis.md Seccion 4:**

- Bloques de color padding: 72px (desktop), 48px (mobile)
- Bloques de color border-radius: 24px
- Grid productos gap: 28px (desktop), 20px (mobile)
- Spacing entre secciones: 96px (desktop), 64px (mobile)
- Max-width contenedor: 1280px, padding lateral 40px (desktop), 20px (mobile)
- Area contenido panel: 32px padding (desktop), 16px (mobile)
- Gap cards panel: 24px
- Padding dentro cards panel: 20px
- Cards resumen border-radius: 16px
- Campos formulario border-radius: 10px
- Sidebar ancho: 272px
- Header panel altura: 68px
- Breakpoints: 375 / 768 / 1024 / 1280 / 1440+ px

**4. Sombras — Decision holistica 10.4:**
- Default: `0 1px 3px rgba(0,0,0,0.08)`
- Hover: `0 4px 12px rgba(0,0,0,0.12)`
- Elevated: `0 8px 24px rgba(0,0,0,0.12)`

**5. Transiciones/Animaciones — visual-analysis.md Seccion 5:**
- Hover cards: 0.3s ease-out, shadow + scale(1.02)
- Hover botones: 0.2s ease-out
- Hover links menu: underline animado izq-a-der
- Scroll fade-in: cubic-bezier(0.4, 0, 0.2, 1)
- Dropdowns: 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)
- Toast: ease-in-out entrada, ease-in salida, 3s display
- Hover filas tabla panel: 0.15s fondo gris suave
- Badge pulse: pulse sutil al recibir nueva notificacion

**6. Iconografia — Decision holistica 10.5:**
- Libreria: Lucide, Heroicons, o Phosphor Icons (outline/stroke)
- Trazo: 1.5-2px stroke
- Tamanos: 20-24px sidebar, 24-28px cards, 16-20px botones
- Circulos decorativos: 48px diametro, fondo 10-15% opacity del color

**7. Notas de contraste (de visual-analysis.md):**
- Texto blanco sobre #008DC9: ratio ~3.8:1 — cumple AA para texto grande (18px+ bold / 24px+ regular). Para texto pequeno, usar blanco bold o considerar #007AB8
- Texto blanco sobre #50B92A: ratio ~3.2:1 — NO cumple AA para texto pequeno. Usar solo como acento decorativo o con texto oscuro
- Texto #1F2937 sobre fondos claros (#E8F4FD, #EDF7E8, #F0F2F5): ratios ~12-12.5:1 — excelente
- Texto blanco sobre #005A85: ~5.7:1 — cumple AA

---

## Asignacion: UX Flow Designer -> ux-flows.md

### Criterios asignados (de requirements.md)

**Navegacion y estructura:**
- REQ-001 a REQ-012: Header y navegacion principal (logo, links, busqueda, idioma, sticky, hamburguesa mobile, submenu catalogo)
- REQ-013 a REQ-020: Footer global (logo, nav, contacto, redes, idioma, copyright, mobile)
- REQ-021 a REQ-026: Boton flotante WhatsApp
- REQ-027 a REQ-034: Sistema bilingue (URLs, deteccion idioma, fallback)
- REQ-035 a REQ-041: Search bar global con prediccion/autocompletado

**Pantallas del sitio publico — flujos de usuario:**
- REQ-042 a REQ-050: Home — Hero (100vh, tag, headline, subtitulo, 2 CTAs, imagen, responsive)
- REQ-051 a REQ-056: Home — Bloques de categorias (3 bloques color, alternancia, responsive)
- REQ-057 a REQ-061: Home — Marcas destacadas (logos, link "Ver todas")
- REQ-062 a REQ-065: Home — Propuesta de valor (4 datos clave con numeros)
- REQ-066 a REQ-073: Home — Productos destacados carrusel (cards, flechas, dots, swipe, vacio)
- REQ-074 a REQ-077: Home — CTA fabricantes (banner full-width)
- REQ-078 a REQ-087: Catalogo por categoria (breadcrumb, grid, filtros, vacio)
- REQ-264a a REQ-264j: Catalogo general (todos los productos, filtro categoria adicional)
- REQ-088 a REQ-100: Sistema de filtros (dropdowns, pills, limpia filtros, drawer mobile)
- REQ-101 a REQ-105: Paginacion del catalogo
- REQ-106 a REQ-129: Detalle de producto (galeria, info, badges, pills, CTAs, ficha tecnica, responsive, edge cases)
- REQ-130 a REQ-134: Barra sticky de producto
- REQ-135 a REQ-137: Storytelling del producto
- REQ-138 a REQ-142: Productos relacionados
- REQ-143 a REQ-148: Listado de marcas
- REQ-149 a REQ-154: Pagina individual de marca
- REQ-155 a REQ-173c: Pagina Nosotros (hero, historia, numeros, mapa, equipo, politicas)
- REQ-174 a REQ-192: Pagina Distribuidores (hero fabricantes, beneficios, logo wall, timeline, formulario)
- REQ-193 a REQ-205: Pagina Contacto (info, formulario general, validacion)

**Pantallas del panel — flujos de usuario:**
- REQ-206 a REQ-211: Dashboard (cards resumen, categorias, mensajes recientes, actividad)
- REQ-212 a REQ-218: Sidebar del panel (modulos, submenus, activo, badge mensajes, colapsable)
- REQ-219 a REQ-223: Header del panel (titulo seccion, busqueda global, notificaciones, usuario)
- REQ-224 a REQ-233: Listado de productos (toolbar, filtros, toggle vista, cards, tabla, paginacion, vacio)
- REQ-234 a REQ-254: Formulario crear/editar producto (5 secciones, campos condicionales, upload, validacion)
- REQ-255 a REQ-258: Detalle producto solo lectura
- REQ-259 a REQ-263: Listado de marcas panel
- REQ-264 a REQ-267: Formulario crear/editar marca
- REQ-268 a REQ-274: Categorias (cards expandibles, tags editables)
- REQ-275 a REQ-277: Gestion Hero
- REQ-278 a REQ-281: Productos destacados (seleccion, drag-drop, reorden)
- REQ-282 a REQ-283: Marcas destacadas
- REQ-284 a REQ-288: Contenido estatico (tabs, formularios ES/EN)
- REQ-289 a REQ-302: Mensajes (kanban, tabla, detalle, drag-drop, filtros, CSV)
- REQ-303 a REQ-307: Configuracion (4 tabs, formularios)
- REQ-308 a REQ-317: Login Azure Entra ID
- REQ-318 a REQ-321e: Equipo de liderazgo (CRUD, drag-drop, placeholders)

### Pantallas asignadas — con TODOS los estados

**Sitio publico (10 pantallas):**

| Pantalla | Estados a documentar |
|---|---|
| Home (7 secciones) | Exito (contenido cargado), Carga (skeleton), Error (fallo API), Vacio parcial (carrusel sin productos destacados: seccion oculta) |
| Catalogo general | Exito (grid con productos), Carga (skeleton cards), Error (fallo API), Vacio (0 productos: mensaje + link), Muchos datos (paginacion 24/pagina), Filtros sin resultados (mensaje + limpiar) |
| Catalogo por categoria (x3) | Mismos estados que catalogo general pero contextualizados a la categoria |
| Detalle de producto | Exito (galeria + info), Carga (skeleton), Error (producto no encontrado: 404), Sin imagen (placeholder visual), Sin ficha PDF (boton oculto), Imagen unica (sin thumbnails), Campos condicionales vacios (no renderizar) |
| Listado de marcas | Exito (grid cards), Carga (skeleton), Error (fallo API) |
| Pagina individual de marca | Exito (logo + desc + grid productos), Carga (skeleton), Error (marca no encontrada), Sin productos (mensaje) |
| Pagina Nosotros | Exito (todas las secciones), Carga (skeleton), Sin equipo (seccion oculta si 0 miembros) |
| Pagina Distribuidores | Exito (hero + beneficios + timeline + formulario), Carga (skeleton), Formulario enviado (confirmacion), Formulario error (mensaje retry) |
| Pagina Contacto | Exito (info + formulario), Formulario enviado (confirmacion), Formulario error (mensaje retry), Pre-fill producto (nombre pre-seleccionado) |
| Resultados de busqueda | Exito (agrupados por tipo), Sin resultados (mensaje + sugerencias), Carga (indicador) |

**Panel de administracion (15 pantallas):**

| Pantalla | Estados a documentar |
|---|---|
| Login | Default (logo + boton Microsoft), Error acceso (mensaje "No tienes acceso"), Cargando (spinner post-clic) |
| Dashboard | Exito (4 cards resumen + 3 categorias + mensajes + actividad), Carga (skeleton cards), Error parcial (card individual falla, las demas visibles) |
| Productos — Listado | Exito card view (grid 3 cols), Exito table view (tabla headers UPPERCASE), Carga (skeleton), Vacio (ilustracion + "No hay productos aun" + CTA), Muchos datos (paginacion "Mostrando 1-24 de X") |
| Productos — Crear/Editar | Formulario con 5 secciones, Campos condicionales (farmaco/alimento/equipo), Validacion errores (inline post-blur), Guardando (spinner boton), Exito (toast + redirect), Error (toast error), Confirmar eliminar (modal), Cambios sin guardar (modal salir) |
| Productos — Detalle | Exito (2 cols lectura), Sin PDF (link oculto), Sin imagen (placeholder) |
| Marcas — Listado | Exito card view, Exito table view, Vacio (ilustracion + CTA), Carga (skeleton) |
| Marcas — Crear/Editar | Formulario corto, Validacion, Eliminar con advertencia productos asociados |
| Categorias | 3 cards expandibles, Tags/chips editables, Agregar tag inline, Eliminar tag con advertencia productos |
| Home — Hero | Preview imagen + campos ES/EN, Carga imagen, Guardado (toast) |
| Home — Productos destacados | Lista cards horizontales, Modal busqueda/seleccion, Drag-drop reorden |
| Home — Marcas destacadas | Mismo patron que productos destacados |
| Contenido estatico | 4 tabs, Formularios ES/EN por seccion, Guardado (toast) |
| Equipo liderazgo | Grid 6 miembros (placeholders), Agregar miembro, Editar, Eliminar (confirmacion), Drag-drop reorden |
| Mensajes — Listado | Vista kanban (3 columnas con conteo), Vista tabla, Filtros, Drag-drop entre columnas, Exportar CSV, Vacio por columna |
| Mensajes — Detalle | Card datos contacto, Contenido completo, Notas internas, Dropdown estado, Eliminar (confirmacion) |
| Configuracion | 4 tabs pill, Formularios organizados, Guardado (toast) |

### Instrucciones especificas

**1. Flujos de usuario prioritarios:**
- Flujo 1 (CRITICO): Visitante busca producto -> search bar -> resultado -> detalle producto -> CTA "Solicitar informacion" -> formulario contacto con producto pre-fill -> confirmacion envio
- Flujo 2 (CRITICO): Fabricante internacional -> home (version EN) -> CTA "Partner with us" -> pagina Distribuidores -> formulario fabricante -> confirmacion
- Flujo 3 (CRITICO): Admin -> login Microsoft -> dashboard -> crear producto (5 secciones) -> guardar -> listado -> card view
- Flujo 4: Visitante -> home -> bloque categoria "Farmacos" -> catalogo farmacos -> filtrar por especie "Caninos" -> product card -> detalle
- Flujo 5: Admin -> mensajes -> kanban -> drag mensaje a "Atendido" -> detalle -> agregar nota interna

**2. Patrones de navegacion de las referencias:**
- Header sitio publico: patron T&P (Patron #7) — logo izq, menu centro/der, lupa + idioma der, sticky, isotipo al scroll
- Submenu Catalogo: dropdown hover desktop, tap mobile (Farmacos, Alimentos, Equipos)
- Mobile: hamburger izq + logo centrado + idioma der, drawer lateral slide-in
- Panel sidebar: patron Dashly — logo top, modulos con iconos, submenus con chevron, item activo fondo azul suave, colapsable tablet, hamburger mobile
- Panel header: patron Dashly — titulo seccion izq, search center, notificaciones + avatar der

**3. Cada pantalla debe documentar:**
- Layout (estructura grid/flex, dimensiones, alineacion)
- Contenido de cada zona (que elementos van donde)
- Interacciones (hover, clic, scroll triggers)
- Estados (los 5: vacio, carga, error, exito, muchos datos — donde aplique)
- Responsive (mobile 375px, tablet 768px, desktop 1280px+)

**4. Patron de busqueda global sitio publico (decision holistica 10.6):**
- Icono lupa en header -> overlay full-width con input grande (20px font)
- Predicciones en dropdown: thumbnail + nombre + tipo (Producto/Marca)
- Agrupados: max 5 productos + max 5 marcas
- Fondo overlay semi-transparente oscuro
- Keyboard-navigable (flechas + Enter)
- "No se encontraron resultados" con link a catalogo

**5. Responsive strategy:**
- Sitio publico: mobile-first (375px base)
- Panel admin: desktop-first (1280px base) con breakpoints Dashly (decision holistica 10.8):
  - >= 1280px: sidebar 272px + contenido, cards 3 cols
  - 1024-1279px: sidebar colapsable (solo iconos ~72px), cards 2 cols
  - 768-1023px: sidebar colapsada por defecto, expand on click, cards 2 cols
  - < 768px: sin sidebar (hamburger), cards 1 col, tablas stacked (decision holistica 10.7)

---

## Asignacion: Component Designer -> components.md

### Criterios asignados (de requirements.md)

**Componentes del sitio publico:**
- REQ-001 a REQ-012: Componente Header (navbar Bootstrap, submenu, sticky, hamburguesa, estado activo)
- REQ-013 a REQ-020: Componente Footer (4 columnas, acordeones mobile)
- REQ-021 a REQ-026: Componente WhatsApp FAB (boton flotante)
- REQ-004, REQ-017, REQ-034: Componente Language Selector (dropdown header, link footer)
- REQ-035 a REQ-041: Componente Search Overlay (input, dropdown resultados, agrupados)
- REQ-082 a REQ-084: Componente Product Card sitio publico (imagen, nombre, marca, badge, CTA hover)
- REQ-067 a REQ-070: Componente Product Card carrusel (variante con boton "Ver producto")
- REQ-069, REQ-072: Componente Carousel (flechas circulares, dots pill, swipe mobile)
- REQ-078: Componente Breadcrumb
- REQ-088 a REQ-100: Componente Filter Bar (dropdowns, pills activos, drawer mobile)
- REQ-101 a REQ-105: Componente Pagination
- REQ-107 a REQ-109: Componente Product Gallery (thumbnails verticales, imagen principal, zoom/lightbox)
- REQ-114 a REQ-116: Componente Presentation Pills (pills seleccionables para presentaciones)
- REQ-112: Componente Species Badges (badges/iconos de especie)
- REQ-117 a REQ-119: Componente Product CTAs (boton primario, WhatsApp verde, ficha PDF outline)
- REQ-130 a REQ-134: Componente Sticky Bar (top desktop, bottom mobile)
- REQ-145 a REQ-146: Componente Brand Card sitio publico (logo, nombre, pais, badges categorias)
- REQ-051 a REQ-056: Componente Category Block (bloque color, img+texto, beneficios con iconos, CTA)
- REQ-062 a REQ-065: Componente Value Proposition (icono + numero grande + texto)
- REQ-074 a REQ-077: Componente Manufacturer CTA Banner (full-width azul)
- REQ-057 a REQ-061: Componente Brand Logos Row (logos grayscale, hover color)
- REQ-172 a REQ-173c: Componente Team Member Card (foto circular, nombre, cargo)
- REQ-177 a REQ-178: Componente Timeline (horizontal desktop, vertical mobile, pasos numerados)
- REQ-182 a REQ-192: Componente Contact Form Manufacturer (8 campos, validacion, envio, confirmacion)
- REQ-197 a REQ-205: Componente Contact Form General (tipo consulta dropdown, producto pre-fill)

**Componentes del panel:**
- REQ-206 a REQ-207: Componente Summary Card panel (icono circulo color, numero, label)
- REQ-206 a REQ-207: Componente Category Card panel (icono, nombre, barra progreso, conteo)
- REQ-226: Componente View Toggle (pill Card view / Table view)
- REQ-227 a REQ-229: Componente Product Card panel (imagen, nombre, marca, badges, menu 3 puntos)
- REQ-229: Componente Data Table panel (headers UPPERCASE, badges, paginacion, acciones)
- REQ-260: Componente Brand Card panel (logo, nombre, pais, badges, conteo, menu 3 puntos)
- REQ-246 a REQ-249: Componente Form Validation (asterisco, inline error post-blur, toast exito/error)
- REQ-243 a REQ-245: Componente Image/PDF Uploader (drag-drop, preview, cambiar, eliminar)
- REQ-272: Componente Tag Input (chips/pills, "x" eliminar, "+" agregar inline)
- REQ-250, REQ-267, REQ-302: Componente Confirm Modal (confirmacion destructiva, advertencia)
- REQ-248 a REQ-249: Componente Toast Notification (esquina sup-der, auto-dismiss, colores semanticos)
- REQ-291 a REQ-292: Componente Kanban Board (3 columnas, cards, drag-drop)
- REQ-291: Componente Message Card Kanban (badge tipo, nombre, email, preview, fecha)
- REQ-284, REQ-303: Componente Tabs Pill (icono + texto, activo azul, inactivo outline)
- REQ-241: Componente Bilingual Input/Tabs (tabs ES/EN para campos traducibles)
- REQ-235: Componente Search Select (dropdown con busqueda para campos como Marca)
- REQ-232, REQ-263, REQ-321e: Componente Empty State (ilustracion SVG + titulo + descripcion + CTA)
- REQ-227: Componente Status Badge (pill con fondo color semantico)

### Componentes identificados — lista completa (34 componentes reutilizables)

**Sitio publico (18 componentes):**
1. `header` — Navbar sticky, logo, links, submenu, busqueda, idioma, hamburguesa mobile
2. `footer` — 4 columnas, logo grande, nav, contacto, redes, idioma, acordeones mobile
3. `whatsapp-fab` — Boton flotante circular 56px verde, esquina inferior derecha
4. `language-selector` — Dropdown header (bandera+codigo), link footer
5. `search-overlay` — Modal/overlay full-width, input grande, resultados agrupados
6. `product-card` — Card catalogo (imagen, nombre, marca, badge, hover shadow+scale)
7. `carousel` — Contenedor horizontal con flechas circulares, dots pill, swipe mobile
8. `breadcrumb` — Navegacion jerarquica (gris 14px, separadores >)
9. `filter-bar` — Dropdowns horizontales + pills activos con "x" + drawer mobile
10. `pagination` — Numeros + flechas + "Mostrando X de Y"
11. `product-gallery` — Thumbnails verticales 60x60 + imagen principal + zoom
12. `contact-form` — Formulario reutilizable (general y fabricantes) con validacion
13. `brand-card` — Card marcas (logo centrado, nombre, pais, badges categorias)
14. `category-block` — Bloque color con img+texto+beneficios+CTA (patron T&P #2)
15. `value-stat` — Icono + numero grande animado + texto descriptivo
16. `brand-logos-row` — Fila logos grayscale, hover color
17. `team-member-card` — Foto circular + nombre + cargo
18. `timeline` — Pasos numerados horizontal/vertical

**Panel (16 componentes):**
1. `summary-card` — Icono circulo color + numero grande + label + badge cambio
2. `category-card-admin` — Icono circulo + nombre + barra progreso + conteo
3. `view-toggle` — Toggle pill Card/Table view
4. `product-card-admin` — Imagen + nombre + marca + badge cat + badge estado + menu 3 puntos
5. `data-table` — Headers UPPERCASE, badges estado, paginacion, acciones iconos
6. `brand-card-admin` — Logo + nombre + pais + badges + conteo + menu 3 puntos
7. `form-field` — Label arriba, input con borde #E5E7EB, border-radius 10px, altura 44px, error inline
8. `image-uploader` — Zona drag-drop, preview, cambiar/eliminar
9. `pdf-uploader` — Zona drag-drop, nombre archivo, tamano, descargar/eliminar
10. `tag-input` — Chips/pills con "x" + "+" inline
11. `confirm-modal` — Modal confirmacion destructiva con advertencia
12. `toast` — Notificacion esquina sup-der, colores semanticos, auto-dismiss
13. `kanban-board` — 3 columnas equidistantes + cards + drag-drop
14. `tabs-pill` — Tabs con icono + texto, activo azul #008DC9, inactivo outline
15. `bilingual-input` — Tabs ES/EN para campos texto bilingues
16. `empty-state` — SVG gris/azul ~200px + titulo 20px + desc 14px + CTA azul

### Instrucciones especificas

**1. Patrones de componentes de las referencias:**

Product Card sitio publico (Patron T&P #3):
- Imagen cuadrada (aspect-ratio 1:1 o 4:5) sobre fondo #F5F7FA
- Nombre bold 16-18px, marca gris 14px
- SIN precio (anti-patron #1)
- Hover: scale(1.02) + shadow (0 4px 12px rgba(0,0,0,0.12)) + transicion 0.3s ease-out
- Boton "Ver producto" outline #008DC9 aparece en hover
- Border-radius 12px
- Gap 28px entre cards

Product Card panel (Patron Dashly #9):
- Imagen cuadrada fondo #F5F7FA
- Nombre bold 16px + marca regular 14px gris
- Badge categoria pill: Farmaco=#EBF5FF texto #008DC9, Alimento=#DCFCE7 texto #22C55E, Equipo=#F0F2F5 texto #6B7280
- Badge estado: Activo=fondo #DCFCE7 texto #22C55E, Inactivo=fondo #FEE2E2 texto #EF4444
- Menu 3 puntos (Editar, Ver detalle, Desactivar)
- Border-radius 16px, sombra 0 1px 3px rgba(0,0,0,0.08)
- Hover: sombra 0 4px 12px rgba(0,0,0,0.12) + borde mas visible, transicion 0.2s

Data Table panel (Patron Dashly #10):
- Headers UPPERCASE 12-13px gris medio #6B7280, con iconos sort
- Filas 48-56px alto, separadores 1px #E5E7EB
- Hover fila: fondo gris muy suave, transicion 0.15s
- Badges estado tipo pill con colores semanticos
- Acciones: iconos ojo+lapiz+basura
- Paginacion: "1-24 of 312"
- Mobile: transformar a stacked cards (labels UPPERCASE izq, valores der)

Kanban Board (Patron Dashly #13):
- 3 columnas equidistantes: headers UPPERCASE con conteo "NUEVOS (3)"
- Cards: badge tipo (pill color) + nombre bold + email gris + preview mensaje 2 lineas + fecha
- Drag-and-drop entre columnas
- Mobile: columnas apiladas verticalmente
- SIN avatares (HESA no tiene usuarios asignados a mensajes)

Category Block sitio publico (Patron T&P #2):
- Full-width con fondo color diferenciado (Farmacos=#E8F4FD, Alimentos=#EDF7E8, Equipos=#F0F2F5)
- Layout 50/50: texto + imagen, alternando izq/der
- Padding 72px (desktop) / 48px (mobile)
- Border-radius 24px
- Titulo bold + parrafo + 3 beneficios con iconos verdes #50B92A
- CTA: "Ver Farmacos" / "Ver Alimentos" / "Ver Equipos"
- Fade-in al scroll (Intersection Observer)
- Mobile: stack vertical, imagen arriba

Empty State panel (Decision holistica 10.11):
- SVG tono gris/azul suave, ~200px alto
- Titulo bold 20px #1F2937: "No hay productos todavia"
- Descripcion regular 14px #6B7280: "Agrega tu primer producto..."
- CTA primario: boton #008DC9 "+ Crear producto"
- Centrado vertical y horizontalmente

**2. Requisitos de accesibilidad (NFR-021 a NFR-026):**
- Todos los componentes interactivos: navegables con teclado (Tab, Enter, Escape)
- Botones y links: area de toque minima 44x44px en mobile
- Formularios: labels asociados a campos, errores anunciados a lectores de pantalla (aria-describedby)
- Imagenes: alt text descriptivo en idioma de la pagina
- Contrastes: 4.5:1 para texto normal, 3:1 para texto grande (WCAG 2.1 AA)
- Focus visible en todos los elementos interactivos (outline o ring)

**3. Estados de cada componente:**
Documentar TODOS los estados visuales: default, hover, active, focus, disabled, loading, error, empty.

**4. Bootstrap 5 — Reglas:**
- Usar clases utilitarias de Bootstrap ANTES que CSS custom
- Grid: container > row > col con breakpoints responsive (col-sm, col-md, col-lg, col-xl)
- Componentes Bootstrap base: navbar, cards, modals, forms, tables, alerts, toasts, dropdowns, badges, breadcrumb, pagination
- Extender con CSS custom properties (design tokens), NO sobreescribir estilos base
- Variables CSS de Bootstrap customizadas: $primary: #008DC9, $secondary: #50B92A, $dark: #1F2937, $light: #F5F7FA

---

## DEMO-xxx Cobertura Requerida

Los sub-designers deben cubrir TODOS los 45 DEMO-xxx de architecture.md:

| DEMO | Sub-designer principal | Sub-designer soporte |
|---|---|---|
| DEMO-001 (Header) | Component Designer | UX Flow Designer |
| DEMO-002 (Footer) | Component Designer | UX Flow Designer |
| DEMO-003 (WhatsApp FAB) | Component Designer | -- |
| DEMO-004 (Home Hero) | UX Flow Designer | Component Designer |
| DEMO-005 (Home Categorias) | Component Designer | UX Flow Designer |
| DEMO-006 (Home Marcas) | Component Designer | UX Flow Designer |
| DEMO-007 (Home Propuesta valor) | Component Designer | -- |
| DEMO-008 (Home Productos dest.) | Component Designer | UX Flow Designer |
| DEMO-009 (Home CTA fabricantes) | Component Designer | -- |
| DEMO-010 (Catalogo general) | UX Flow Designer | Component Designer |
| DEMO-011 (Catalogo x categoria) | UX Flow Designer | Component Designer |
| DEMO-012 (Filtros) | Component Designer | UX Flow Designer |
| DEMO-013 (Paginacion) | Component Designer | -- |
| DEMO-014 (Detalle producto) | UX Flow Designer | Component Designer |
| DEMO-015 (Sticky bar) | Component Designer | UX Flow Designer |
| DEMO-016 (Storytelling) | UX Flow Designer | -- |
| DEMO-017 (Productos relacionados) | Component Designer | -- |
| DEMO-018 (Listado marcas) | UX Flow Designer | Component Designer |
| DEMO-019 (Marca individual) | UX Flow Designer | Component Designer |
| DEMO-020 (Nosotros) | UX Flow Designer | Component Designer |
| DEMO-021 (Distribuidores) | UX Flow Designer | Component Designer |
| DEMO-022 (Contacto) | UX Flow Designer | Component Designer |
| DEMO-023 (Busqueda global) | Component Designer | UX Flow Designer |
| DEMO-024 (Panel Login) | UX Flow Designer | -- |
| DEMO-025 (Panel Sidebar) | Component Designer | UX Flow Designer |
| DEMO-026 (Panel Header) | Component Designer | UX Flow Designer |
| DEMO-027 (Panel Dashboard) | UX Flow Designer | Component Designer |
| DEMO-028 (Panel Productos list) | UX Flow Designer | Component Designer |
| DEMO-029 (Panel Producto form) | UX Flow Designer | Component Designer |
| DEMO-030 (Panel Producto detail) | UX Flow Designer | -- |
| DEMO-031 (Panel Marcas list) | UX Flow Designer | Component Designer |
| DEMO-032 (Panel Marca form) | UX Flow Designer | -- |
| DEMO-033 (Panel Categorias) | UX Flow Designer | Component Designer |
| DEMO-034 (Panel Hero) | UX Flow Designer | Component Designer |
| DEMO-035 (Panel Prod. dest.) | UX Flow Designer | Component Designer |
| DEMO-036 (Panel Marcas dest.) | UX Flow Designer | -- |
| DEMO-037 (Panel Contenido est.) | UX Flow Designer | Component Designer |
| DEMO-038 (Panel Equipo) | UX Flow Designer | Component Designer |
| DEMO-039 (Panel Mensajes) | UX Flow Designer | Component Designer |
| DEMO-040 (Panel Msg detalle) | UX Flow Designer | -- |
| DEMO-041 (Panel Configuracion) | UX Flow Designer | Component Designer |
| DEMO-042 (Sistema bilingue) | UX Flow Designer | -- |
| DEMO-043 (Responsive completo) | UX Flow Designer | Component Designer |
| DEMO-044 (Design system) | Visual System Designer | -- |
| DEMO-045 (CRM tracking) | -- | -- (no tiene componente visual) |

---

## Gaps de Requirements Descubiertos

| # | Gap | Impacto | Recomendacion |
|---|---|---|---|
| GAP-D01 | Los requirements no definen estado de carga (loading/skeleton) para ninguna pantalla del sitio publico ni del panel — solo definen estados vacios | Todos los REQ de pantallas | El UX Flow Designer debe definir skeleton screens para cada pantalla. Patron: cards skeleton con shimmer animation, mismas dimensiones que el contenido real |
| GAP-D02 | REQ-169 (mapa de Costa Rica) dice "elemento visual/grafico (no mapa interactivo)" pero no especifica estilo visual del mapa — colores, puntos de agentes, leyenda | REQ-169 a REQ-171 | SVG de Costa Rica en tono #E8F4FD con puntos de cobertura en #008DC9, leyenda con zonas GAM/rural/encomienda. Consistente con la paleta del sitio |
| GAP-D03 | Los requirements no definen el aspecto visual de las "pills seleccionables" de presentaciones de producto (REQ-114) — son pills toggle, no links, ni radio buttons | REQ-114, REQ-115 | Pills con border-radius 25px, borde #E5E7EB, seleccionado=fondo #E8F4FD borde #008DC9. Patron T&P Patron #5 validado en screenshot |
| GAP-D04 | REQ-296 define 5 tipos de mensaje con colores pero no define el color exacto de "Fabricante" (dice "morado") — no hay morado en la paleta prescrita | REQ-296 | Usar #7C3AED (purple-600) para Fabricante con fondo suave #EDE9FE. Es el unico color fuera de paleta pero necesario para diferenciacion de 5 tipos |

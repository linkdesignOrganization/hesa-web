# Plan de Distribucion — QA Team

## Contexto de Testing
- Iteracion: Fase 4 (Construccion Visual)
- Ronda: 1
- URL del sitio desplegado: https://gray-field-02ba8410f.2.azurestaticapps.net
- URL del backend (si aplica): N/A (demo con mock data, sin backend)
- Total criterios esta iteracion: 306 (149 DC + 40 BVC + 117 UX)
- Criterios nuevos a testear: 306 (primera ronda)
- Criterios a re-testear (fallaron en ronda anterior): 0
- NFR aplicables a fase visual: NFR-014, NFR-020, NFR-021 a NFR-026, NFR-031, NFR-032 (11 NFR)
- Total criterios con NFR: 317

## Notas Importantes para Todos los Sub-testers
- Testing EXCLUSIVAMENTE contra el sitio desplegado: https://gray-field-02ba8410f.2.azurestaticapps.net
- NUNCA testear contra localhost
- El sitio es una SPA Angular con routing `/es/`, `/en/`, y `/admin/`
- La fase visual usa datos mock — no hay backend real
- Grabar GIFs de todos los flujos principales
- Generar archivos `.spec.ts` para cada criterio verificado
- Para rutas bilingues probar con prefijo `/es/` por defecto, y `/en/` donde el criterio lo requiera
- Breakpoints clave: mobile 375px, tablet 768px, desktop 1024px, desktop-lg 1280px, desktop-xl 1440px

---

## Asignacion: Visual Checker -> e2e/tests/visual/

### Criterios asignados (149 DC + 40 BVC + 4 NFR = 193 criterios)

#### Tokens de Diseno (DC-001 a DC-029)
- DC-001: Paleta primaria `--brand-primary: #008DC9` para CTAs, enlaces, header activo
- DC-002: Paleta secundaria `--brand-secondary: #50B92A` para iconografia beneficios, acentos
- DC-003: Paleta oscura `--brand-dark: #005A85` para footer, hover botones, barra sticky
- DC-004: Neutros definidos (#FFFFFF, #F5F7FA, #F7F8FA, #E5E7EB, #6B7280, #1F2937)
- DC-005: Colores superficie por categoria (pharma #E8F4FD, food #EDF7E8, equipment #F0F2F5)
- DC-006: Colores semanticos (success, danger, warning, info) con fondos suaves
- DC-007: Texto badges semanticos con variantes oscuras accesibles (ratio WCAG >= 4.5:1)
- DC-008: Color morado para mensajes tipo Fabricante (#5B21B6 sobre #EDE9FE, 7.57:1)
- DC-009: Colores especiales (WhatsApp #25D366, overlay rgba(0,0,0,0.5))
- DC-010: Tipografia principal Inter de Google Fonts, pesos 400/500/600/700/800
- DC-011: Fallback tipografico completo (Inter, -apple-system, BlinkMacSystemFont...)
- DC-012: Escala tipografica sitio publico (display 56px/800, h1 48px/700, h2 42px/700, etc.)
- DC-013: Escala tipografica mobile (display 32px/700, h1 32px/700, h2 28px/700, h3 24px/700)
- DC-014: Escala tipografica panel (titulo 24px/700, subtitulo 20px/700, etc.)
- DC-015: Hero headline letter-spacing -0.02em (tracking tight)
- DC-016: Spacing escala base 4px (space-1 a space-24)
- DC-017: Spacing entre secciones home (96px desktop, 80px tablet, 64px mobile)
- DC-018: Spacing bloques color (padding 72px desktop, 60px tablet, 48px mobile)
- DC-019: Contenedor max-width 1280px, padding-inline 40px desktop / 20px mobile
- DC-020: Panel spacing (area contenido padding 32px desktop / 16px mobile, gap cards 24px)
- DC-021: Sombras sm/md/lg
- DC-022: Border-radius (botones 8px, inputs 10px, cards publico 12px, cards panel 16px, bloques 24px, pills 9999px)
- DC-023: Transicion hover botones (background-color 0.2s ease-out)
- DC-024: Transicion hover cards producto (box-shadow 0.3s, transform 0.3s con scale(1.02))
- DC-025: Transicion scroll fade-in (opacity+transform 0.5s cubic-bezier)
- DC-026: Breakpoints (375px, 768px, 1024px, 1280px, 1440px)
- DC-027: Z-index escala (dropdown 100, sticky 200, sidebar 300, overlay 400, modal 500, toast 600, whatsapp 700)
- DC-028: Iconografia Lucide Icons, trazo 1.5-2px, tamanos 16-28px segun contexto
- DC-029: Circulos decorativos iconos (48px diametro, fondo opacity 10-15%)

#### Layouts por Pantalla (DC-030 a DC-049)
- DC-030: Home Hero — full viewport, overlay gradient, tag "DESDE 1989", headline 56px, 2 CTAs
- DC-031: Home Bloques categorias — 3 bloques full-width, fondos diferenciados, border-radius 24px
- DC-032: Home Marcas destacadas — logos grayscale, hover a color, 6-8 logos
- DC-033: Home Propuesta de valor — 4 bloques en fila, icono verde, numero 48px, count-up
- DC-034: Home Productos destacados — carrusel 4 cards desktop, flechas + dots
- DC-035: Home CTA fabricantes — full-width fondo #008DC9, titulo blanco
- DC-036: Catalogo general — max-width 1280px, breadcrumb, filtros, grid 3 cols
- DC-037: Catalogo por categoria — breadcrumb extendido, filtros especificos
- DC-038: Detalle producto — 2 columnas 55/45, galeria + info
- DC-039: Listado marcas — grid 3-4 cols, cards con logo/nombre/pais/badges
- DC-040: Pagina individual marca — logo grande, grid productos
- DC-041: Nosotros — hero, historia, numeros clave, mapa SVG, equipo, politicas
- DC-042: Distribuidores — hero B2B, beneficios grid, logo wall, timeline, formulario
- DC-043: Contacto — 2 columnas info + formulario
- DC-044: Resultados busqueda — titulo, resultados agrupados
- DC-045: Panel Login — card centrada 420px, fondo #F7F8FA
- DC-046: Panel Dashboard — sidebar 272px + header 68px + area #F7F8FA
- DC-047: Panel Productos listado — toolbar, filtros, toggle Card/Table
- DC-048: Panel Producto crear/editar — formulario pantalla completa, 5 secciones
- DC-049: Panel Mensajes — toggle Kanban/Tabla, 3 columnas

#### Componentes (DC-050 a DC-079)
- DC-050: Header (Navbar) — fondo blanco 70px, scrolled shadow, mobile menu slide-in
- DC-051: Footer — fondo #005A85, 4 columnas, mobile acordeon
- DC-052: WhatsApp FAB — circular 56px, fondo #25D366, z-index 700
- DC-053: Search Overlay — full-screen, input centrado 720px, resultados agrupados
- DC-054: Product Card publico — fondo blanco, radius 12px, imagen 1:1, sin precio
- DC-055: Carousel — 4 items desktop, flechas circulares 44px, dots pill
- DC-056: Filter Bar — dropdowns barra horizontal, pills activos
- DC-057: Pagination — centrada, pagina activa #008DC9, texto "Mostrando X-Y de Z"
- DC-058: Product Gallery — thumbnails 60x60, zoom, lightbox
- DC-059: Contact Form — labels 14px, inputs radius 10px, height 44px
- DC-060: Brand Card — logo 120x80, nombre 18px Bold, badges categoria
- DC-061: Category Block — full-width, radius 24px, padding 72px, layout 50/50
- DC-062: Value Stat — icono outline, numero 42px Bold, count-up animation
- DC-063: Sticky Bar — desktop top fondo #005A85, mobile bottom fondo blanco
- DC-064: Manufacturer CTA Banner — full-width #008DC9, titulo 36px blanco
- DC-065: Team Member Card — foto circular 160px, borde 4px blanco
- DC-066: Timeline — 4 nodos circulares 56px, animacion secuencial
- DC-067: Breadcrumb — Inter 14px gris, separadores ">"
- DC-068: Language Selector — dropdown compacto, bandera circular 20px
- DC-069: Species Badges — fila horizontal, fondo #F5F7FA, icono 18px
- DC-070: Presentation Pills — radius pill, selected fondo #E8F4FD
- DC-071: Product CTAs — stack vertical 3 botones (informacion, WhatsApp, ficha PDF)
- DC-072: Summary Card panel — fondo blanco, radius 16px, icono circulo 48px, valor 28px
- DC-073: Category Card Admin — barra progreso 6px, label 16px Semibold
- DC-074: View Toggle — pills activo #008DC9, inactivo blanco
- DC-075: Product Card Admin — radius 16px, badges categoria y estado
- DC-076: Data Table — headers UPPERCASE 12px, filas 52px, separadores
- DC-077: Form Field panel — label 14px, input radius 10px, height 44px, toggle switch
- DC-078: Image Uploader — zona drag-drop dashed, grid previews 120x120
- DC-079: Confirm Modal — backdrop, modal centrado 440px, icono circulo 48px

#### Responsive (DC-080 a DC-099)
- DC-080: Header colapsa a hamburger < 1024px
- DC-081: Grid product cards: 3 cols >= 1280px, 2 cols 768-1279px, 1-2 cols < 768px
- DC-082: Hero headline: 56px >= 1280px, 42px 768-1279px, 32px < 768px
- DC-083: Bloques categoria: 2 cols >= 1024px, stack vertical < 1024px
- DC-084: Propuesta de valor: 4 cols >= 1280px, 2x2 768-1279px, 2x2 o 1 col < 768px
- DC-085: Detalle producto: 2 cols >= 1024px, stack vertical < 1024px
- DC-086: Footer: 4 cols >= 1024px, 2x2 768-1023px, 1 col acordeones < 768px
- DC-087: Filtros catalogo: dropdowns visibles >= 768px, drawer < 768px
- DC-088: Panel sidebar: 272px >= 1280px, 72px 1024-1279px, hamburger < 768px
- DC-089: Panel cards: 3 cols >= 1280px, 2 cols 1024-1279px, 1 col < 768px
- DC-090: Panel tablas: clasica >= 768px, stacked cards < 768px
- DC-091: Panel formularios: 2 cols >= 768px, 1 col < 768px
- DC-092: Panel kanban: 3 cols >= 1024px, scroll 768-1023px, apiladas < 768px
- DC-093: Carrusel: 4 cards >= 1280px, 2 768-1279px, 1 + swipe < 768px
- DC-094: Paginacion: completa >= 768px, simplificada < 768px
- DC-095: Timeline distribuidores: horizontal >= 768px, vertical < 768px
- DC-096: Contacto: 2 cols >= 768px, 1 col < 768px
- DC-097: Brand logos: 6-8 >= 1280px, 4 768-1279px, 3x2 < 768px
- DC-098: Tabs pill panel: fila >= 768px, 2 filas o scroll < 768px
- DC-099: Login panel: card 420px >= 768px, full-width < 768px

#### Estados de UI (DC-100 a DC-119)
- DC-100: Home carga — skeleton screens
- DC-101: Home exito — secciones con contenido real
- DC-102: Home error — secciones con reintentar
- DC-103: Home vacio parcial — secciones ocultas si vacias
- DC-104: Catalogo carga — 12 cards skeleton
- DC-105: Catalogo exito — grid con contenido
- DC-106: Catalogo error — mensaje + reintentar
- DC-107: Catalogo vacio — ilustracion SVG + mensaje
- DC-108: Catalogo filtros sin resultados — mensaje + limpiar filtros
- DC-109: Catalogo muchos datos — paginacion funcional
- DC-110: Detalle producto carga — skeleton 2 columnas
- DC-111: Detalle producto error 404 — pagina estilizada
- DC-112: Detalle producto sin imagen — placeholder icono categoria
- DC-113: Detalle producto sin ficha PDF — boton no se renderiza
- DC-114: Panel Login cargando — boton deshabilitado + spinner
- DC-115: Panel Login error — mensaje rojo bajo boton
- DC-116: Panel Dashboard carga — skeleton shimmer
- DC-117: Panel Dashboard error parcial — borde izq rojo + reintentar
- DC-118: Panel Productos vacio — ilustracion + CTA
- DC-119: Panel Producto form validacion — campos invalidos borde rojo, scroll al error

#### Patrones de Feedback Visual (DC-120 a DC-149)
- DC-120: Loading skeleton screens (shimmer 1.5s)
- DC-121: Loading acciones (spinner 18px en boton)
- DC-122: Upload progress bar (4px, radius 2px)
- DC-123: Toast exito (fondo #DCFCE7, borde izq 4px #22C55E, auto-dismiss 3s)
- DC-124: Toast error (fondo #FEE2E2, persistente)
- DC-125: Toast warning (fondo #FEF3C7)
- DC-126: Toast info (fondo #EBF5FF)
- DC-127: Stacking toasts (gap 8px, max 3)
- DC-128: Validacion inline (borde #EF4444, mensaje 13px)
- DC-129: Submit loading (spinner + "Enviando...")
- DC-130: Exito sitio publico (formulario reemplazado por confirmacion)
- DC-131: Exito panel (toast verde + redireccion)
- DC-132: Error envio (toast rojo, datos mantenidos)
- DC-133: Eliminar producto/marca (modal confirm con icono danger)
- DC-134: Eliminar marca con productos (warning adicional)
- DC-135: Cambios sin guardar (modal "Deseas salir?")
- DC-136: Hover cards producto sitio (scale 1.02 + shadow + boton aparece)
- DC-137: Hover cards panel (shadow + borde #008DC9)
- DC-138: Hover filas tabla (fondo #F7F8FA)
- DC-139: Scroll fade-in secciones (opacity + translateY via IO)
- DC-140: Logos grayscale->color (transition 0.3s)
- DC-141: Underline links menu (::after width 0->100%)
- DC-142: Dropdowns apertura (opacity + translateY 0.2s)
- DC-143: Count-up numeros (0 al valor en 1.5s, no re-anima)
- DC-144: Timeline secuencial (opacity + scale, delay 200ms)
- DC-145: Badge pulse (scale 1->1.15->1, 0.6s)
- DC-146: Drag-drop kanban (sombra + rotate(2deg), columna destino borde dashed)
- DC-147: Logo header scroll (crossfade opacity 0.3s)
- DC-148: Mobile menu slide-in (translateX 100%->0, 0.3s)
- DC-149: Smooth scroll global (scroll-behavior: smooth)

#### BVC — Brief Verification Criteria (BVC-001 a BVC-040)

##### Brief: Sitio Publico
- BVC-001: Diseno premium, no generico (subjective)
- BVC-002: Suficiente espacio en blanco entre elementos (visual)
- BVC-003: Tipografia con jerarquia clara (visual)
- BVC-004: Colores corresponden a paleta definida (computed-style)
- BVC-005: Animaciones sutiles y profesionales (visual)
- BVC-006: Diseno funciona en mobile (visual)
- BVC-007: Equivalente visual Tuft & Paw copiado correctamente (visual)
- BVC-008: No se muestran precios, inventario, carrito (negative)
- BVC-009: Textos en espanol e ingles (visual)
- BVC-010: Nivel visual supera Monteco, VETIM, Belina (subjective)

##### Brief: Panel
- BVC-011: Pantalla con un solo proposito claro (visual)
- BVC-012: Productos y marcas como cards con imagen, no listas planas (visual)
- BVC-013: Formularios organizados en secciones con subtitulos (visual)
- BVC-014: Campos condicionales segun categoria (visual)
- BVC-015: Suficiente espacio entre elementos (computed-style)
- BVC-016: Todos los estados con badge con color (visual)
- BVC-017: Iconos en navegacion, cards resumen y badges (visual)
- BVC-018: Acciones destructivas con confirmacion modal (visual)
- BVC-019: Estados vacios disenados con ilustracion + mensaje + CTA (visual)
- BVC-020: Pantalla se siente como herramienta a medida, no CRUD generico (subjective)
- BVC-021: Flujo navegacion claro: Listado > Crear/Editar > Detalle (visual)
- BVC-022: Toggle Card/Table en listados (visual)
- BVC-023: Toast notifications despues de guardar/eliminar/cambiar estado (visual)
- BVC-024: Panel refleja misma calidad visual que sitio publico (subjective)

##### BVC Anti-patrones
- BVC-025: No hay precios visibles en ninguna pagina (negative)
- BVC-026: No hay carrito, checkout ni pasarela (negative)
- BVC-027: No hay registro/login en sitio publico (negative)
- BVC-028: No hay ofertas, descuentos, resenas ni blog (negative)
- BVC-029: No hay chat en vivo, solo WhatsApp flotante (negative)
- BVC-030: No hay listas planas en panel, siempre cards (negative)

##### BVC Principios Testables
- BVC-031: Titulos hero minimo 48px desktop, 32px mobile (computed-style)
- BVC-032: Bloques color border-radius 20-30px, padding 60-80px (computed-style)
- BVC-033: Hover cards shadow + scale(1.02) con transicion 0.3s (computed-style)
- BVC-034: Sidebar panel ancho ~260-280px, fondo blanco, borde derecho (computed-style)
- BVC-035: Header panel altura ~64-72px, fondo blanco, borde inferior (computed-style)
- BVC-036: Fondo area contenido panel #F7F8FA con padding 24-32px (computed-style)
- BVC-037: Cards resumen panel border-radius 12-16px y sombra (computed-style)
- BVC-038: WhatsApp flotante en todas las paginas (visual)
- BVC-039: Selector idioma ES/EN en header y footer (visual)
- BVC-040: Footer fondo #005A85 con texto blanco (computed-style)

#### NFR de Accesibilidad (asignados a Visual Checker)
- NFR-021: WCAG 2.1 nivel AA
- NFR-022: Imagenes con texto alternativo
- NFR-024: Contrastes de color ratio minimo 4.5:1 texto normal, 3:1 texto grande
- NFR-026: Area toque minima 44x44px en mobile

#### NFR de Performance (asignados a Visual Checker)
- NFR-001: Pagina inicio carga < 3s en 3G rapida (LCP)
- NFR-003: Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1) en desktop
- NFR-005: Panel carga < 2s

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- Breakpoints: mobile (375px), tablet (768px), desktop (1024px), desktop-lg (1280px), desktop-xl (1440px)
- **Verificacion de cumplimiento de design-criteria.md es PRIORIDAD #1**
- Usar `browser_evaluate` para verificar computed styles (colores, font-size, spacing, border-radius, shadows)
- Verificar CSS custom properties en :root con `getComputedStyle(document.documentElement).getPropertyValue('--nombre')`
- Verificar Google Fonts import de Inter
- Para tokens (DC-001 a DC-029): verificar CSS custom properties y computed styles
- Para layouts (DC-030 a DC-049): navegar a cada pantalla y verificar layout, dimensiones, colores
- Para componentes (DC-050 a DC-079): verificar cada componente en su contexto, incluyendo estados
- Para responsive (DC-080 a DC-099): verificar en 3 breakpoints minimo (375px, 768px, 1280px)
- Para estados (DC-100 a DC-119): verificar skeleton, error, vacio, etc.
- Para feedback visual (DC-120 a DC-149): verificar animaciones, transiciones, toasts, modales
- Para BVC: verificar cada criterio del brief del cliente con severidad ALTA para fallos
- Para NFR accesibilidad: verificar contraste WCAG, focus visible, tap targets >= 44px, ARIA labels
- Para NFR performance: medir tiempos de carga con `browser_evaluate` (performance.timing), verificar DOM size
- Grabar GIFs de: (1) Home completo con scroll, (2) Catalogo desktop vs mobile, (3) Panel dashboard, (4) Animaciones hover cards

### Estrategia de priorizacion
Dado el volumen (193 criterios), priorizar asi:
1. **Tokens y custom properties** (DC-001 a DC-029) — verificacion sistematica con browser_evaluate
2. **Layouts de pantallas principales** (DC-030 a DC-049) — verificar que cada pantalla existe y tiene la estructura correcta
3. **Componentes core** (DC-050 a DC-079) — verificar propiedades visuales de cada componente
4. **BVC computed-style** (BVC-004, BVC-031 a BVC-040) — verificacion automatizable
5. **BVC visual y negative** (BVC-001 a BVC-030 restantes) — inspeccion visual
6. **Responsive** (DC-080 a DC-099) — verificar en 3 breakpoints
7. **Estados y feedback** (DC-100 a DC-149) — verificar estados menos comunes
8. **NFR accesibilidad y performance** — verificacion final

### BVC-xxx asignados (Brief Verification Criteria)
| BVC-xxx | Criterio del Cliente | Tipo de verificacion |
|---------|---------------------|---------------------|
| BVC-001 | Diseno premium, no generico | subjective |
| BVC-002 | Suficiente espacio en blanco | visual |
| BVC-003 | Tipografia con jerarquia clara | visual |
| BVC-004 | Colores corresponden a paleta | computed-style |
| BVC-005 | Animaciones sutiles y profesionales | visual |
| BVC-006 | Diseno funciona en mobile | visual |
| BVC-007 | Equivalente Tuft & Paw correcto | visual |
| BVC-008 | No precios/inventario/carrito | negative |
| BVC-009 | Textos en espanol e ingles | visual |
| BVC-010 | Nivel visual supera competencia | subjective |
| BVC-011 | Pantalla con proposito unico | visual |
| BVC-012 | Productos/marcas como cards | visual |
| BVC-013 | Formularios con secciones | visual |
| BVC-014 | Campos condicionales por categoria | visual |
| BVC-015 | Espacio suficiente en panel | computed-style |
| BVC-016 | Estados con badges color | visual |
| BVC-017 | Iconos en navegacion y cards | visual |
| BVC-018 | Destructivas con confirmacion | visual |
| BVC-019 | Estados vacios disenados | visual |
| BVC-020 | Herramienta a medida | subjective |
| BVC-021 | Flujo Listado>Crear>Detalle | visual |
| BVC-022 | Toggle Card/Table | visual |
| BVC-023 | Toast notifications | visual |
| BVC-024 | Panel misma calidad visual | subjective |
| BVC-025 | No precios visibles | negative |
| BVC-026 | No carrito/checkout | negative |
| BVC-027 | No registro/login publico | negative |
| BVC-028 | No ofertas/descuentos/resenas/blog | negative |
| BVC-029 | No chat en vivo | negative |
| BVC-030 | No listas planas en panel | negative |
| BVC-031 | Titulos hero >= 48px desktop | computed-style |
| BVC-032 | Bloques color radius 20-30px, padding 60-80px | computed-style |
| BVC-033 | Hover cards shadow + scale(1.02) | computed-style |
| BVC-034 | Sidebar 260-280px, fondo blanco | computed-style |
| BVC-035 | Header panel 64-72px, fondo blanco | computed-style |
| BVC-036 | Fondo contenido panel #F7F8FA | computed-style |
| BVC-037 | Cards resumen radius 12-16px | computed-style |
| BVC-038 | WhatsApp en todas las paginas | visual |
| BVC-039 | Selector idioma en header y footer | visual |
| BVC-040 | Footer fondo #005A85 texto blanco | computed-style |

Brief compliance es QA gate CLIENT-SPECIFIED — severidad ALTA para fallos en cualquier BVC.

---

## Asignacion: Flow Tester -> e2e/tests/flow/

### Criterios asignados (78 UX criterios)

#### Navegacion y Routing (UX-001 a UX-012)
- UX-001: Ruta raiz `/` redirige a `/es/` o `/en/` segun idioma navegador
- UX-002: Todas las rutas publicas `/es/` navegables (home, catalogo, catalogo/farmacos, catalogo/alimentos, catalogo/equipos, catalogo/[cat]/[slug], marcas, marcas/[slug], nosotros, distribuidores, contacto, busqueda)
- UX-003: Todas las rutas publicas `/en/` navegables (equivalentes en ingles)
- UX-004: Todas las rutas del panel navegables (/admin/login, /admin/dashboard, /admin/productos, etc.)
- UX-005: Header publico — logo enlazado, links navegacion, submenu Catalogo
- UX-006: Header publico — busqueda + selector idioma funcional
- UX-007: Header sticky, sin carrito/cuenta, mobile hamburger
- UX-008: Footer completo — logo, nav, contacto, redes, idioma, copyright, mobile acordeon
- UX-009: WhatsApp flotante en todas las paginas, contextual
- UX-010: Sidebar panel — logo, modulos, submenus, item activo, badge mensajes
- UX-011: Header panel — nombre seccion, busqueda, notificaciones, avatar dropdown
- UX-012: 404 bilingue con ilustracion y botones

#### Flujos de Usuario (UX-013 a UX-020)
- UX-013: Flujo CRITICO — Busqueda y solicitud de informacion (Home > lupa > buscar > seleccionar resultado > detalle producto > CTA solicitar info > contacto con pre-fill)
- UX-014: Flujo CRITICO — Fabricante evalua HESA (Home EN > CTA Partner > Distribuidores > formulario)
- UX-015: Flujo CRITICO shell — Admin crea producto (login > dashboard > sidebar Productos > crear > formulario 5 secciones > validacion > toast)
- UX-016: Flujo IMPORTANTE — Navegacion catalogo con filtros (Home > bloque categoria > catalogo filtrado > filtros > detalle)
- UX-017: Flujo IMPORTANTE shell — Admin mensajes kanban (dashboard > mensajes > kanban > detalle)
- UX-018: Flujo COMPLEMENTARIO — Catalogo general con filtros adaptativos
- UX-019: Flujo COMPLEMENTARIO shell — Admin gestiona Home (hero, productos destacados, marcas destacadas)
- UX-020: Flujo COMPLEMENTARIO shell — Admin edita producto existente

#### Logica de Estados — Sitio Publico (UX-021 a UX-039)
- UX-021: Home skeleton shimmer durante carga
- UX-022: Home carrusel vacio — seccion oculta
- UX-023: Home marcas vacias — seccion oculta
- UX-024: Home error parcial — secciones independientes
- UX-025: Catalogo general — skeleton, vacio, filtros sin resultados
- UX-026: Catalogo por categoria — skeleton, vacio contextualizado
- UX-027: Detalle producto — skeleton, error 404
- UX-028: Detalle sin imagen — placeholder
- UX-029: Detalle imagen unica — sin thumbnails
- UX-030: Detalle sin ficha PDF — boton no renderizado
- UX-031: Detalle campos vacios — secciones no renderizadas
- UX-031b: Detalle storytelling — bloques opcionales, bilingue
- UX-032: Detalle sin traduccion EN — badge "Traduccion no disponible"
- UX-033: Listado marcas — skeleton, error
- UX-034: Marca individual — skeleton, 404, sin productos
- UX-035: Nosotros — skeleton, equipo sin miembros
- UX-036: Distribuidores — skeleton, formulario enviado/error
- UX-037: Contacto — skeleton, pre-fill, enviado/error
- UX-038: Busqueda sin resultados — sugerencias
- UX-039: Busqueda cargando — spinner

#### Logica de Estados — Panel (UX-040 a UX-059)
- UX-040: Login — default, cargando, error acceso, error red
- UX-041: Dashboard — skeleton, error parcial
- UX-042: Listado productos — skeleton, vacio, filtros sin resultados
- UX-043: Formulario producto — vacio/cargado, validacion, guardando, exito, error
- UX-044: Formulario producto — campos condicionales (fade al cambiar categoria)
- UX-045: Formulario producto — cambios sin guardar (modal)
- UX-046: Formulario producto — eliminar (modal confirmacion)
- UX-047: Detalle producto solo lectura — skeleton, datos, sin PDF, sin imagen
- UX-048: Listado marcas — skeleton, vacio
- UX-049: Formulario marca — eliminar con advertencia productos asociados
- UX-050: Categorias — skeleton, eliminar tag con/sin productos
- UX-051: Gestion Hero — skeleton, subiendo imagen, guardado
- UX-052: Productos destacados — skeleton, vacio, modal seleccion, reordenando
- UX-053: Marcas destacadas — mismos estados que productos destacados
- UX-054: Contenido estatico — skeleton, cargado, guardado
- UX-055: Equipo liderazgo — skeleton, vacio, eliminar, reordenando
- UX-056: Mensajes listado — skeleton kanban, vacio, drag-drop
- UX-057: Detalle mensaje — skeleton, cambio estado, nota, eliminar
- UX-058: Configuracion — skeleton, guardado, error
- UX-059: Sesion expirada — modal no-dismissable

#### Mock Data (UX-060 a UX-074b)
- UX-060: 48+ productos mock en 3 categorias (~28 farmacos, ~14 alimentos, ~6 equipos)
- UX-061: Cada producto con nombre ES/EN, marca, categoria, especie(s), presentaciones, etc.
- UX-062: 12+ marcas mock con nombres realistas
- UX-063: 6 productos destacados para carrusel
- UX-064: 6-8 marcas destacadas para logos home
- UX-065: 12+ mensajes mock en 3 estados y 5 tipos
- UX-066: 6 miembros equipo liderazgo mock
- UX-067: Dashboard mock con datos coherentes (47 productos, 3 mensajes nuevos, 12 marcas, 6 destacados)
- UX-068: Home hero mock con imagen, textos ES/EN, CTAs
- UX-069: Propuesta valor mock (37+ anos, 100% cobertura, 50+ colaboradores, 20+ marcas)
- UX-070: Categorias mock con subcategorias editables
- UX-071: Nosotros mock (historia, numeros, cobertura, politicas)
- UX-072: Distribuidores mock (hero, beneficios, timeline, formulario)
- UX-073: Contacto mock (telefono, correo, direccion, redes)
- UX-074: Configuracion sitio mock
- UX-074b: Storytelling mock (2+ productos con bloques)

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- **Flujos E2E prioritarios (GRABAR GIF OBLIGATORIO):**
  1. UX-013: Busqueda y solicitud de informacion — flujo completo desde home hasta formulario contacto con pre-fill
  2. UX-014: Fabricante evalua HESA — flujo completo en ingles desde home hasta envio formulario
  3. UX-015: Admin crea producto — flujo completo desde login hasta toast de exito
  4. UX-016: Navegacion catalogo con filtros — desde bloque categoria hasta detalle producto
  5. UX-001 a UX-004: Verificar que TODAS las rutas son navegables (no 404, no pantalla en blanco)
- **Verificacion de mock data:** contar productos en catalogo (>= 48), contar marcas (>= 12), verificar que datos son realistas (no Lorem ipsum)
- **Verificacion de estados:** para cada pantalla, verificar que los estados de carga, vacio y error estan implementados
- **Navegacion completa:** recorrer TODAS las rutas del mapa de navegacion, tanto sitio publico como panel
- **Para el panel:** navegar directamente a /admin/ — en la demo puede no haber auth real
- **Idioma:** verificar que las paginas tienen contenido en ES y EN al cambiar selector

---

## Asignacion: Edge Case Tester -> e2e/tests/edge-case/

### Criterios asignados (39 UX interacciones + 7 NFR = 46 criterios)

#### Interacciones Sitio Publico (UX-075 a UX-097)
- UX-075: Search overlay — abrir con lupa, auto-focus, predicciones 3+ chars, keyboard nav, cierre Escape/clic fuera, mobile full-screen
- UX-076: Filtros catalogo — actualizacion inmediata, pills "X", limpiar filtros, filtros adaptivos por categoria, paginacion resetea, URL query params
- UX-077: Filtros mobile — drawer bottom sheet
- UX-078: Paginacion — numeros + flechas, "Mostrando X de Y", scroll inicio, mantiene filtros, URL params
- UX-079: Galeria producto — thumbnails click, zoom hover, lightbox click, swipe mobile
- UX-080: Barra sticky — aparece al scroll via Intersection Observer, desktop top / mobile bottom, sin layout shift
- UX-081: CTA "Solicitar informacion" — navega a /es/contacto?producto=[slug], pre-fill campo
- UX-082: CTA WhatsApp — abre WhatsApp con mensaje contextual
- UX-083: CTA "Descargar ficha tecnica" — solo visible si hay PDF
- UX-084: Bloques categoria Home — CTA navega a catalogo filtrado
- UX-085: Carrusel productos destacados — flechas, dots, clic card navega, swipe mobile
- UX-086: Logos marcas Home — clic navega a marca, hover grayscale->color
- UX-087: Propuesta valor — count-up animation al viewport
- UX-088: Bloques categoria — fade-in al scroll
- UX-089: CTA fabricantes Home — navega a distribuidores
- UX-090: Formulario contacto — validacion inline blur, errores, submit disable+spinner, exito/error, honeypot
- UX-091: Formulario fabricantes — validacion y envio identico contacto, campos especificos, checkbox terminos
- UX-092: Selector idioma — cambia prefijo URL y slugs, sin recarga, permanece en pagina
- UX-093: Timeline distribuidores — animacion secuencial scroll, horizontal/vertical
- UX-094: Distribuidores CTA "Start the Conversation" — scroll suave al formulario
- UX-095: Product cards hover — scale(1.02), sombra, boton "Ver producto" aparece, clic navega
- UX-096: Brand cards hover — scale(1.02), sombra, clic navega
- UX-097: Productos relacionados — 3-4 cards misma categoria, seccion oculta si unico, mobile carrusel

#### Interacciones Panel (UX-098 a UX-113)
- UX-098: Toggle Card/Table view productos — ambas vistas funcionales, mobile tabla stacked
- UX-099: Menu 3 puntos cards producto — dropdown Editar/Ver en sitio/Duplicar/Desactivar/Eliminar
- UX-100: Imagen drag-drop — zona dashed, drag-over, preview, reordenar, max 6
- UX-101: PDF drag-drop — zona compacta, nombre, descargar, eliminar
- UX-102: Tabs bilingues ES/EN — tabs pill en descripcion
- UX-103: Seleccion categoria — 3 cards mini, borde 2px seleccionada, campos condicionales fade
- UX-104: Formulario marca — logo drag-drop, pais dropdown, categorias multi-select
- UX-105: Categorias tags — input inline, confirmar, eliminar, colapsables, toast
- UX-106: Hero cambiar imagen — selector archivo, progress bar, preview actualiza
- UX-107: Productos/Marcas destacados agregar — modal seleccion con busqueda y checkboxes
- UX-108: Productos/Marcas destacados reordenar — drag-drop con handles, guardar orden, "X" remover
- UX-109: Mensajes kanban drag-drop — cambio estado, card elevada, columna destino, conteos, toast
- UX-110: Mensajes toggle kanban/tabla — filtros ambas vistas, CSV mock
- UX-111: Detalle mensaje — notas internas, marcar atendido, eliminar con confirmacion
- UX-112: Equipo liderazgo — drag-drop reorden, agregar, eliminar con confirmacion
- UX-113: Dashboard cards clickables — navega a listado filtrado, link "Ver todos" mensajes

#### CRM Tracking (UX-114, UX-115)
- UX-114: CRM tracking sitio publico — evento open, page-view, scroll umbrales, heartbeat, CTA clicks, batching, sendBeacon
- UX-115: CRM tracking NO en panel

#### NFR de Seguridad (asignados a Edge Case Tester)
- NFR-014: HTTPS en todas las comunicaciones
- NFR-016: Formularios con proteccion anti-spam (honeypot)
- NFR-017: Inputs sanitizados contra XSS e inyeccion
- NFR-020: Headers de seguridad (CSP, X-Frame-Options, X-Content-Type-Options)

#### NFR Responsive (asignados a Edge Case Tester)
- NFR-031: Sitio publico mobile-first, impecable en todos los breakpoints
- NFR-032: Panel desktop-first, funcional en tablet y mobile

#### NFR SEO (verificacion basica)
- NFR-009: URLs semanticas y legibles

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- **Edge cases anticipados:**
  1. **Search overlay**: buscar con 0, 1, 2 chars (no debe mostrar resultados), buscar con 3+ chars, buscar termino sin resultados, navegar resultados con teclado, cerrar con Escape
  2. **Filtros**: aplicar multiples filtros simultaneos, limpiar uno a uno vs limpiar todos, cambiar pagina y verificar que filtros persisten, cambiar categoria y verificar filtros adaptativos
  3. **Formularios**: enviar vacio, enviar con email invalido, enviar con campos obligatorios faltantes, verificar validacion inline post-blur, verificar honeypot fields presentes pero ocultos
  4. **Responsive extremos**: verificar en 320px (dispositivo muy pequeno), 375px, 768px, 1024px, 1440px, 1920px
  5. **Galeria producto**: navegar imagenes, zoom, lightbox, swipe en viewport mobile
  6. **Sticky bar**: scroll lento y rapido, verificar sin layout shift
  7. **Drag-drop panel**: intentar drag en kanban, reordenar productos destacados, subir imagenes
  8. **Idioma**: cambiar idioma en cada pagina, verificar URL cambia, contenido cambia
  9. **XSS en inputs**: inyectar `<script>alert('xss')</script>` en campos de formulario, verificar sanitizacion
  10. **Headers seguridad**: verificar HTTPS, headers CSP/X-Frame-Options con curl o browser_evaluate
  11. **CRM tracking**: verificar en consola del navegador que eventos se disparan (open, page-view)
  12. **Links rotos**: verificar que todos los links internos navegan a paginas validas
  13. **Boton atras navegador**: navegar catalogo > detalle > atras, filtros > detalle > atras
- **Grabar GIFs de:** (1) filtros catalogo con pills, (2) galeria producto con zoom/lightbox, (3) formulario contacto con validacion, (4) kanban drag-drop, (5) search overlay

---

## Regresion Automatizada (primera ronda — no aplica)
- Resultado de `npx playwright test e2e/tests/`: N/A (primera ronda, no hay tests previos)
- Criterios verificados por automatizacion: ninguno
- Criterios con regresion detectada: ninguno

## Criterios Pendientes de Testing Manual
- Total criterios que requieren sub-testers esta ronda: 317 (149 DC + 40 BVC + 117 UX + 11 NFR)
- Criterios FALLARON en ronda anterior: 0 (primera ronda)
- Criterios DESBLOQUEADOS: 0 (primera ronda)
- Criterios nuevos sin test automatizado: todos (317)

### Distribucion resumen
| Sub-tester | Criterios asignados | Categorias |
|---|---|---|
| Visual Checker | 193 | 149 DC + 40 BVC + 4 NFR accesibilidad/performance |
| Flow Tester | 78 | UX-001 a UX-074b (navegacion, flujos, estados, mock data) |
| Edge Case Tester | 46 | UX-075 a UX-115 (interacciones, edge cases) + 7 NFR seguridad/responsive/SEO |
| **Total** | **317** | |

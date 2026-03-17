# Plan de Distribucion — QA Team

## Contexto de Testing
- Iteracion: Fase 4 (Construccion Visual)
- Ronda: 2
- URL del sitio desplegado: https://gray-field-02ba8410f.2.azurestaticapps.net
- URL del backend (si aplica): N/A (demo con mock data, sin backend)
- Total criterios esta iteracion: 317 (149 DC + 40 BVC + 117 UX + 11 NFR)
- Criterios que PASARON en Ronda 1 (se mantienen como PASA): 153
- Criterios N/A en Ronda 1 (se mantienen): 27
- Criterios a re-testear (FALLARON en Ronda 1): 19
- Criterios DESBLOQUEADOS (BLOQUEADOS en Ronda 1, ahora testeables): 101
- Criterios PASA (parcial) a re-verificar: 5
- Total criterios que requieren sub-testers esta ronda: 125
- No hay regression-results.md — primera ejecucion de regresion se hara post-Ronda 2

## Resumen de Bugs Corregidos (13 bugs de Ronda 1)
Los 13 bugs reportados en Ronda 1 fueron corregidos por el Developer:
1. **BUG-001** (CRITICO) — Deep linking / SPA routing roto → CORREGIDO (navigationFallback configurado)
2. **BUG-002** (CRITICO) — CRM tracking script causa navegacion erratica → CORREGIDO
3. **BUG-003** (ALTA) — Hero sin imagen de fondo → CORREGIDO
4. **BUG-004** (ALTA) — Imagenes rotas en bloques de categoria → CORREGIDO
5. **BUG-005** (ALTA) — Seccion marcas destacadas ausente → CORREGIDO
6. **BUG-006** (MEDIA) — Imagenes productos faltantes en carrusel/catalogo → CORREGIDO
7. **BUG-007** (MEDIA) — CTA fabricantes color fondo incorrecto → CORREGIDO
8. **BUG-008** (MEDIA) — Mezcla idiomas en distribuidores → CORREGIDO
9. **BUG-009** (BAJA) — Carrusel 4 vs 6 productos → CORREGIDO
10. **BUG-010** (MEDIA) — Submenu desborda sidebar → CORREGIDO
11. **BUG-011** (BAJA) — Filtro marca no adaptivo → CORREGIDO
12. **BUG-012** (ALTA) — Formulario contacto navega inesperadamente → CORREGIDO
13. **BUG-013** (BAJA) — Discrepancia 48 vs 47 productos → CORREGIDO

## Pre-flight Check (OBLIGATORIO antes de testear)
Leccion de Ronda 1: BUG-001 (SPA routing) bloqueo 32% de criterios. Antes de testear cualquier criterio, cada sub-tester DEBE verificar:
1. Deep link a `/es/catalogo/farmacos` — debe renderizar la pagina de catalogo de farmacos, NO el home
2. Deep link a `/es/nosotros` — debe renderizar la pagina Nosotros
3. Deep link a `/admin/productos` — debe renderizar la pagina de listado de productos del panel
4. Consola del navegador: NO debe haber ERR_NAME_NOT_RESOLVED de crm-api.linkdesign.cr

**Si alguno falla: DETENER testing y reportar BLOQUEADO al PM inmediatamente.**

## Notas Importantes para Todos los Sub-testers
- Testing EXCLUSIVAMENTE contra el sitio desplegado: https://gray-field-02ba8410f.2.azurestaticapps.net
- NUNCA testear contra localhost
- El sitio es una SPA Angular con routing `/es/`, `/en/`, y `/admin/`
- La fase visual usa datos mock — no hay backend real
- **Ronda 2**: los bugs criticos de routing y CRM tracking fueron corregidos. TODOS los criterios bloqueados en Ronda 1 ahora deben ser verificables
- **Grabar GIFs de todos los flujos principales** — en Ronda 1 no se grabaron GIFs. En Ronda 2 es OBLIGATORIO
- **Generar archivos `.spec.ts`** para TODOS los criterios DESBLOQUEADOS verificados en esta ronda (101 criterios necesitan .spec.ts nuevos)
- Para rutas bilingues probar con prefijo `/es/` por defecto, y `/en/` donde el criterio lo requiera
- Breakpoints clave: mobile 375px, tablet 768px, desktop 1024px, desktop-lg 1280px, desktop-xl 1440px
- **Verificar via deep link Y via SPA click** — reportar si un metodo funciona y el otro no

---

## Asignacion: Visual Checker -> e2e/tests/visual/

### Criterios asignados (78 criterios: 9 FALLA re-verificar + 64 DESBLOQUEADOS + 5 NFR desbloqueados)

El Visual Checker tiene 10 archivos .spec.ts de Ronda 1 que cubren criterios que PASARON. En Ronda 2, se enfoca en:
- (A) Re-verificar 9 criterios que FALLARON por bugs visuales ya corregidos
- (B) Testear por primera vez 64 criterios DC/BVC que estaban BLOQUEADOS
- (C) Testear 5 NFR que estaban BLOQUEADOS

#### (A) Criterios FALLA en Ronda 1 — Re-verificar fix (9 criterios)

| Criterio | Bug corregido | Que verificar |
|----------|--------------|---------------|
| DC-030 | BUG-003 | Hero AHORA debe tener imagen de fondo visible con overlay gradient (no fondo oscuro uniforme) |
| DC-031 | BUG-004 | Bloques categoria AHORA deben tener imagenes visibles en layout 50/50 (no espacios vacios) |
| DC-032 | BUG-005 | Seccion "Marcas Destacadas" AHORA debe ser visible en home en posicion correcta: logos grayscale, hover a color |
| DC-034 | BUG-006 | Carrusel productos destacados AHORA debe mostrar imagenes reales (no placeholders rotos) |
| DC-035 | BUG-007 | CTA fabricantes AHORA debe tener fondo #008DC9 azul primario (no fondo oscuro) |
| DC-061 | BUG-004 | Category Block AHORA debe tener imagenes en la mitad correspondiente |
| DC-097 | BUG-005 | Brand logos row responsive: verificar layout en 3 breakpoints ahora que la seccion esta presente |
| DC-101 | BUG-004/005 | Home exito: TODAS las secciones visibles con contenido real (marcas + imagenes en bloques) |
| DC-140 | BUG-005 | Logos grayscale->color transition 0.3s: verificar ahora que seccion de marcas esta visible |

#### (B) Criterios DESBLOQUEADOS — Primera vez (64 criterios DC + BVC)

**Tokens mobile (1 criterio):**
- DC-013: Escala tipografica mobile (display 32px/700, h1 32px/700, h2 28px/700, h3 24px/700) — verificar en viewport 375px

**Layouts ahora navegables via deep link (7 criterios):**
- DC-037: Catalogo por categoria — breadcrumb extendido, filtros especificos por tipo
- DC-040: Pagina individual marca — logo grande 160x160px + nombre 36px Bold + grid productos
- DC-041: Nosotros — hero 50-60vh, historia, numeros clave, mapa SVG, equipo grid 3 cols, politicas
- DC-044: Resultados busqueda — titulo "Resultados para '[termino]'" 36px Bold, agrupados
- DC-047: Panel Productos listado — toolbar, filtros, toggle Card/Table, grid 3 cols, badges
- DC-048: Panel Producto crear/editar — formulario 5 secciones, campos condicionales, tabs ES/EN
- DC-049: Panel Mensajes — toggle Kanban/Tabla, 3 columnas, drag-drop

**Componentes ahora verificables (14 criterios):**
- DC-053: Search Overlay — full-screen, input centrado 720px, resultados agrupados
- DC-058: Product Gallery — thumbnails 60x60, zoom hover, lightbox, crossfade
- DC-063: Sticky Bar — desktop top fondo #005A85 + mobile bottom fondo blanco
- DC-065: Team Member Card — foto circular 160px, borde 4px, nombre 18px Bold
- DC-066: Timeline — 4 nodos circulares 56px #008DC9, linea conectora, animacion
- DC-069: Species Badges — fila horizontal fondo #F5F7FA, icono 18px, label 13px
- DC-070: Presentation Pills — radius pill, selected fondo #E8F4FD borde #008DC9
- DC-074: View Toggle — pills activo #008DC9, inactivo blanco, radius 24px
- DC-075: Product Card Admin — radius 16px, badges categoria y estado, menu 3 puntos
- DC-076: Data Table — headers UPPERCASE 12px, filas 52px, separadores, mobile stacked
- DC-077: Form Field panel — label 14px, input radius 10px, height 44px, toggle switch
- DC-078: Image Uploader — zona drag-drop dashed, grid previews 120x120
- DC-079: Confirm Modal — backdrop, modal centrado 440px, icono circulo 48px, animacion

**Responsive ahora verificable (11 criterios):**
- DC-083: Bloques categoria responsive — 2 cols >= 1024px, stack vertical < 1024px
- DC-087: Filtros catalogo mobile — drawer bottom sheet < 768px
- DC-089: Panel cards responsive — 3 cols >= 1280px, 2 cols 1024-1279px, 1 col < 768px
- DC-090: Panel tablas responsive — clasica >= 768px, stacked cards < 768px
- DC-091: Panel formularios responsive — 2 cols >= 768px, 1 col < 768px
- DC-092: Panel kanban responsive — 3 cols >= 1024px, scroll 768-1023px, apiladas < 768px
- DC-093: Carrusel mobile — 1 card + swipe + flechas ocultas < 768px
- DC-094: Paginacion responsive — simplificada con flechas + "Pagina X de Y" < 768px
- DC-095: Timeline responsive — vertical con linea izquierda < 768px
- DC-098: Tabs pill panel responsive — 2 filas o scroll horizontal < 768px

**Estados de UI ahora verificables (16 criterios):**
- DC-100: Home skeleton shimmer
- DC-102: Home error — secciones con reintentar
- DC-103: Home vacio parcial — secciones ocultas si vacias
- DC-104: Catalogo carga — 12 cards skeleton
- DC-106: Catalogo error — mensaje + reintentar
- DC-107: Catalogo vacio — ilustracion SVG + mensaje
- DC-108: Catalogo filtros sin resultados — "No se encontraron productos..."
- DC-110: Detalle producto carga — skeleton 2 columnas
- DC-111: Detalle producto 404 — pagina estilizada
- DC-113: Sin ficha PDF — boton no se renderiza (simplemente ausente)
- DC-114: Panel Login cargando — boton deshabilitado + spinner
- DC-115: Panel Login error — mensaje rojo
- DC-116: Panel Dashboard carga — skeleton shimmer
- DC-117: Panel Dashboard error parcial — borde izq rojo + reintentar
- DC-118: Panel Productos vacio — ilustracion + CTA
- DC-119: Panel Producto form validacion — campos invalidos borde rojo, scroll al error

**Patrones de Feedback Visual (26 criterios):**
- DC-120: Skeleton shimmer (1.5s gradient animado)
- DC-121: Button spinner (18px blanco, "Guardando...")
- DC-122: Upload progress bar (4px, radius 2px, #008DC9)
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
- DC-133: Modal confirm (icono danger, botones Cancelar/Eliminar)
- DC-134: Eliminar marca con productos (warning adicional)
- DC-135: Cambios sin guardar (modal "Deseas salir?")
- DC-137: Hover cards panel (shadow + borde #008DC9)
- DC-138: Hover filas tabla (fondo #F7F8FA)
- DC-139: Scroll fade-in secciones (opacity + translateY via IO)
- DC-141: Underline links menu (::after width 0->100%)
- DC-142: Dropdowns apertura (opacity + translateY 0.2s)
- DC-144: Timeline secuencial (opacity + scale, delay 200ms)
- DC-145: Badge pulse (scale 1->1.15->1, 0.6s)
- DC-146: Drag-drop kanban (sombra + rotate 2deg, columna destino borde dashed)
- DC-147: Logo header scroll (crossfade opacity 0.3s)
- DC-148: Mobile menu slide-in (translateX 100%->0, 0.3s)

**BVC Desbloqueados (7 criterios):**
- BVC-013: Formularios organizados en secciones con subtitulos
- BVC-014: Campos condicionales segun categoria seleccionada
- BVC-018: Acciones destructivas con confirmacion modal
- BVC-019: Estados vacios disenados (ilustracion + mensaje + CTA)
- BVC-021: Flujo navegacion: Listado > Crear/Editar > Detalle
- BVC-022: Toggle Card/Table en listados
- BVC-023: Toast notifications despues de guardar/eliminar

#### (C) NFR Desbloqueados (5 criterios)
- NFR-001: LCP < 3s en 3G rapida — medir con browser_evaluate
- NFR-003: Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1 desktop)
- NFR-005: Panel carga < 2s
- NFR-021: WCAG 2.1 AA — verificacion completa ahora que todas las paginas son navegables
- NFR-026: Tap targets >= 44x44px en mobile — medir en paginas ahora accesibles

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- Breakpoints: mobile (375px), tablet (768px), desktop (1024px), desktop-lg (1280px), desktop-xl (1440px)
- **Verificacion de cumplimiento de design-criteria.md es PRIORIDAD #1**
- Usar `browser_evaluate` para verificar computed styles
- **IMPORTANTE — Generacion de .spec.ts**: Para TODOS los 64+7+5=76 criterios desbloqueados, generar archivos .spec.ts correspondientes. Los 9 criterios FALLA ya tienen tests de Ronda 1 que deben re-ejecutarse (no crear duplicados)
- **Prioridad de verificacion en Ronda 2:**
  1. Pre-flight check (deep links + consola)
  2. Re-verificar 9 criterios FALLA (confirmar que fixes funcionan)
  3. Layouts desbloqueados (DC-037, DC-040, DC-041, DC-044, DC-047, DC-048, DC-049) — paginas antes inaccesibles
  4. Componentes desbloqueados (DC-053 a DC-079) — verificar propiedades visuales
  5. BVC desbloqueados (BVC-013, BVC-014, BVC-018, BVC-019, BVC-021, BVC-022, BVC-023) — cliente-criticos
  6. Estados de UI (DC-100 a DC-119) y feedback visual (DC-120 a DC-149)
  7. Responsive desbloqueado (DC-083 a DC-098)
  8. NFR accesibilidad y performance
- **Grabar GIFs de:** (1) Home completo con scroll mostrando TODAS las secciones (hero con imagen, marcas, bloques, carrusel, CTA), (2) Panel dashboard + sidebar corregido, (3) Formulario producto con campos condicionales, (4) Toast notifications, (5) Animaciones hover/scroll

### BVC-xxx asignados (Brief Verification Criteria)
| BVC-xxx | Criterio del Cliente | Tipo de verificacion | Estado Ronda 1 |
|---------|---------------------|---------------------|----------------|
| BVC-013 | Formularios con secciones | visual | BLOQUEADO -> DESBLOQUEADO |
| BVC-014 | Campos condicionales por categoria | visual | BLOQUEADO -> DESBLOQUEADO |
| BVC-018 | Acciones destructivas con confirmacion | visual | BLOQUEADO -> DESBLOQUEADO |
| BVC-019 | Estados vacios disenados | visual | BLOQUEADO -> DESBLOQUEADO |
| BVC-021 | Flujo Listado>Crear>Detalle | visual | BLOQUEADO -> DESBLOQUEADO |
| BVC-022 | Toggle Card/Table | visual | BLOQUEADO -> DESBLOQUEADO |
| BVC-023 | Toast notifications | visual | BLOQUEADO -> DESBLOQUEADO |

Brief compliance es QA gate CLIENT-SPECIFIED — severidad ALTA para fallos en cualquier BVC.

---

## Asignacion: Flow Tester -> e2e/tests/flow/

### Criterios asignados (22 criterios: 10 FALLA re-verificar + 6 DESBLOQUEADOS + 6 PASA parcial/N/A re-evaluar)

El Flow Tester tiene 7 archivos .spec.ts de Ronda 1. En Ronda 2, se enfoca en:
- (A) Re-verificar 10 criterios que FALLARON
- (B) Testear 6 criterios BLOQUEADOS ahora desbloqueados
- (C) Re-evaluar 6 criterios PASA (parcial) o N/A que ahora pueden verificarse completamente

#### (A) Criterios FALLA en Ronda 1 — Re-verificar fix (10 criterios)

| Criterio | Bug corregido | Que verificar |
|----------|--------------|---------------|
| UX-002 | BUG-001 | Deep linking rutas ES: /es/catalogo/farmacos, /es/marcas, /es/nosotros, etc. DEBEN renderizar la pagina correcta |
| UX-003 | BUG-001 | Deep linking rutas EN: /en/catalog/pharmaceuticals, /en/brands, /en/about, etc. DEBEN funcionar |
| UX-004 | BUG-001 | Deep linking rutas panel: /admin/productos, /admin/marcas, /admin/categorias, /admin/mensajes, etc. |
| UX-013 | BUG-001 | Flujo CRITICO busqueda-contacto: ahora debe ser completable E2E (Home > lupa > buscar > resultado > detalle > CTA > contacto con pre-fill) |
| UX-014 | BUG-008 | Flujo CRITICO fabricante: /es/distribuidores AHORA debe tener contenido 100% en espanol (no mezcla ES/EN) |
| UX-016 | BUG-001 | Flujo catalogo filtrado: CTA bloque categoria AHORA debe navegar a /es/catalogo/farmacos correctamente |
| UX-018 | BUG-001 | Catalogo filtros adaptativos: navegar a /es/catalogo, seleccionar categorias, verificar filtros cambian |
| UX-012 | BUG-001 | 404 page: navegar a URL invalida (ej: /es/pagina-inexistente). AHORA debe mostrar pagina 404 estilizada (no home). Nota: en Ronda 1 era N/A por BUG-001, ahora debe ser verificable |

**Nota sobre UX-012**: En Ronda 1 fue marcado N/A porque rutas invalidas redirigian a home por BUG-001. Ahora que el routing esta corregido, la pagina 404 debe ser verificable. Re-clasificar de N/A a testeable.

#### (B) Criterios DESBLOQUEADOS — Primera vez (6 criterios)

| Criterio | Bloqueado por | Que testear ahora |
|----------|--------------|-------------------|
| UX-026 | BUG-001 | Catalogo por categoria: navegar a /es/catalogo/farmacos via deep link, verificar skeleton, vacio contextualizado, filtros sin resultados |
| UX-034 | BUG-001 | Marca individual: navegar a /es/marcas/[slug], verificar skeleton, 404, sin productos. Nota: era N/A en Ronda 1, ahora es testeable |
| UX-038 | BUG-001 | Busqueda sin resultados: navegar a /es/busqueda?q=zzzzz, verificar mensaje + sugerencias. Nota: era N/A en Ronda 1, ahora es testeable |
| UX-039 | BUG-001 | Busqueda cargando: spinner centrado + "Buscando...". Nota: era N/A en Ronda 1, ahora es testeable |
| UX-070 | BUG-001 | Categorias mock con subcategorias: navegar a panel /admin/categorias, verificar 3 categorias con subcategorias editables. Nota: era N/A en Ronda 1, ahora es testeable |

**Nota**: UX-034, UX-038, UX-039 y UX-070 fueron N/A en Ronda 1 pero su N/A status was caused by BUG-001. Ahora que routing funciona, deben re-evaluarse.

#### (C) Criterios PASA (parcial) a re-verificar completamente (6 criterios)

| Criterio | Que faltaba en Ronda 1 | Que verificar ahora |
|----------|----------------------|---------------------|
| UX-015 | Admin crear producto: formulario no testeado E2E | Flujo COMPLETO: login > dashboard > sidebar Productos > crear > formulario 5 secciones > validacion > toast exito |
| UX-025 | Catalogo: skeleton y paginacion parciales | Verificar skeleton completo (12 cards shimmer + filtros shimmer), estado vacio, filtros sin resultados |
| UX-027 | Detalle producto: error 404 no verificable | Navegar a /es/catalogo/farmacos/producto-inexistente -> verificar 404 estilizada |
| UX-063 | Carrusel muestra 4 en vez de 6 (BUG-009 corregido) | Verificar que AHORA muestra 6 productos destacados (puede ser 4 por slide + 2 en slide siguiente) |
| UX-009 | WhatsApp: no verificado en paginas antes inaccesibles | Verificar en /es/nosotros, /es/marcas y paginas ahora accesibles |

**Nota sobre UX-076**: Era PASA (parcial) en Ronda 1 pero fue asignado al Edge Case Tester, no al Flow Tester.

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- **PRIORIDAD #1**: Pre-flight check de deep links antes de todo
- **Flujos E2E prioritarios (GRABAR GIF OBLIGATORIO):**
  1. UX-013 AHORA COMPLETABLE: Home > lupa > buscar "Amoxicilina" > seleccionar resultado > detalle > CTA "Solicitar informacion" > contacto con pre-fill. GIF del flujo completo
  2. UX-014 AHORA EN ESPANOL: /es/distribuidores — verificar que TODO el contenido esta en espanol (headings, cards, formulario)
  3. UX-015 COMPLETO: login > dashboard > Productos > crear > llenar formulario > validacion > toast
  4. UX-016 AHORA FUNCIONAL: Home > bloque Farmacos > /es/catalogo/farmacos > filtros > detalle
  5. UX-002/003/004: Recorrer TODAS las rutas del mapa de navegacion via deep link — capturar screenshot de cada pagina
- **Generar .spec.ts** para los 6 criterios desbloqueados (UX-026, UX-034, UX-038, UX-039, UX-070, UX-012 re-eval)
- **Verificar estados N/A de Ronda 1**: Muchos UX-040 a UX-059 fueron N/A en Ronda 1. Re-evaluar cuales son ahora testeables con routing corregido. Si un criterio que era N/A ahora es verificable, testearlo y reportar resultado (no dejar N/A si ahora se puede testear)
- **Mock data coherencia**: Re-verificar UX-063 (carrusel 6 productos) y UX-060 (conteo 48 productos consistente entre panel y catalogo tras fix de BUG-013)

---

## Asignacion: Edge Case Tester -> e2e/tests/edge-case/

### Criterios asignados (26 criterios: 3 FALLA re-verificar + 1 PASA parcial re-verificar + 13 DESBLOQUEADOS panel + 9 N/A re-evaluar)

El Edge Case Tester tiene 16 archivos .spec.ts de Ronda 1. En Ronda 2, se enfoca en:
- (A) Re-verificar 3 criterios FALLA + 1 PASA parcial
- (B) Testear 13 criterios de interacciones panel que estaban BLOQUEADOS
- (C) Re-evaluar criterios N/A del panel que ahora pueden ser testeables

#### (A) Criterios FALLA / PASA parcial en Ronda 1 — Re-verificar fix (4 criterios)

| Criterio | Bug corregido | Que verificar |
|----------|--------------|---------------|
| UX-090 | BUG-012 | Formulario contacto: AHORA al interactuar con combobox y submit, la pagina NO debe navegar inesperadamente. Validacion inline completa, envio funcional |
| UX-091 | BUG-008 | Formulario fabricantes: /es/distribuidores AHORA debe tener formulario 100% en espanol (no mezcla EN/ES). Validacion completa |
| UX-114 | BUG-002 | CRM tracking: AHORA la API no debe causar ERR_NAME_NOT_RESOLVED. Verificar que eventos se disparan sin errores en consola |
| UX-076 | BUG-011 | Filtros catalogo: AHORA al seleccionar categoria "Farmacos", dropdown Marca debe filtrar mostrando solo marcas con productos en Farmacos (adaptativo). Verificar filtros cruzados |

#### (B) Criterios DESBLOQUEADOS — Interacciones Panel (13 criterios)

| Criterio | Bloqueado por | Que testear ahora |
|----------|--------------|-------------------|
| UX-100 | BUG-001/002 | Imagen drag-drop en formulario producto: zona dashed, drag-over, preview 120x120, reordenar, max 6 |
| UX-101 | BUG-001/002 | PDF drag-drop: zona compacta, nombre archivo, descargar, eliminar |
| UX-102 | BUG-001/002 | Tabs bilingues ES/EN: tabs pill en seccion descripcion, cambio entre ES/EN |
| UX-103 | BUG-001/002 | Seleccion categoria: 3 cards mini, borde 2px en seleccionada, campos condicionales con fade |
| UX-104 | BUG-001/002 | Formulario marca: logo drag-drop, pais dropdown con busqueda, categorias multi-select |
| UX-105 | BUG-001/002 | Categorias tags: input inline + confirmar, eliminar tag, cards colapsables, toast |
| UX-106 | BUG-001/002 | Hero cambiar imagen: selector archivo, progress bar mock, preview actualiza |
| UX-107 | BUG-001/002 | Productos/Marcas destacados agregar: modal seleccion, busqueda, checkboxes |
| UX-108 | BUG-001/002 | Productos/Marcas destacados reordenar: drag-handles, card elevada, guardar orden, "X" remover |
| UX-109 | BUG-001/002 | Mensajes kanban drag-drop: cambio estado, card elevada, columna destino resaltada, conteos, toast |
| UX-110 | BUG-001/002 | Mensajes toggle kanban/tabla: ambas vistas, filtros, CSV mock |
| UX-111 | BUG-001/002 | Detalle mensaje: notas internas, marcar atendido, eliminar con confirmacion |
| UX-112 | BUG-001/002 | Equipo liderazgo: drag-drop reorden, agregar formulario, eliminar con modal |

#### (C) Criterios N/A de Ronda 1 a re-evaluar (9 criterios)

Estos criterios fueron N/A en Ronda 1 porque dependian de interacciones del panel que no eran accesibles. Ahora que el routing funciona, re-evaluar si son testeables:

| Criterio | Descripcion | Verificar si es testeable |
|----------|------------|--------------------------|
| UX-043 | Formulario producto E2E (crear/editar estados) | Navegar a /admin/productos/crear |
| UX-044 | Campos condicionales (fade al cambiar categoria) | Interactuar con selector categoria |
| UX-045 | Modal cambios sin guardar | Editar campo + intentar navegar |
| UX-046 | Modal eliminar producto | Clic en eliminar desde listado |
| UX-047 | Detalle producto solo lectura | Navegar a /admin/productos/:id |
| UX-048 | Listado marcas panel | Navegar a /admin/marcas |
| UX-049 | Formulario marca eliminar con advertencia | Intentar eliminar marca con productos |
| UX-050 | Categorias panel (tags, eliminar con/sin productos) | Navegar a /admin/categorias |
| UX-051 a UX-058 | Gestion Home, Contenido, Equipo, Configuracion | Navegar a rutas /admin/home/*, /admin/contenido/*, /admin/configuracion/* |

**Nota**: Los criterios UX-043 a UX-058 fueron asignados al Flow Tester en Ronda 1 (marcados N/A). Para Ronda 2, los criterios de interaccion del panel que requieren drag-drop, modales y estados complejos se asignan al Edge Case Tester por especialidad. El Flow Tester re-evalua los de navegacion y estados basicos; el Edge Case Tester toma los que involucran interacciones complejas.

**Criterios UX del panel para Edge Case Tester (subset de los N/A):**
- UX-043: Formulario producto estados
- UX-044: Campos condicionales
- UX-045: Modal cambios sin guardar
- UX-046: Modal eliminar producto
- UX-049: Formulario marca eliminar con advertencia

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- **PRIORIDAD #1**: Pre-flight check de deep links antes de todo
- **PRIORIDAD #2**: Re-verificar BUG-012 fix (formulario contacto ya no navega inesperadamente)
- **Generar .spec.ts** para TODOS los 13 criterios DESBLOQUEADOS del panel + 5 criterios N/A re-evaluados como testeables
- **Verificar consola del navegador**: Confirmar que CRM tracking (BUG-002) ya no genera errores ERR_NAME_NOT_RESOLVED ni causa navegacion erratica
- **Edge cases para criterios desbloqueados:**
  1. **Drag-drop kanban (UX-109)**: arrastrar card entre las 3 columnas, verificar conteos se actualizan, toast con nombre
  2. **Formulario producto (UX-100-103)**: subir imagenes, PDF, cambiar categoria y verificar campos condicionales fade
  3. **Modales confirmacion (UX-045, UX-046, UX-049)**: verificar focus trap, animacion, botones funcionan
  4. **Tags categorias (UX-105)**: agregar tag, eliminar tag sin productos (inmediato) vs con productos (modal)
  5. **Reorden drag-drop (UX-108, UX-112)**: productos destacados, equipo liderazgo
  6. **Formulario contacto fix (UX-090)**: llenar TODOS los campos, seleccionar opcion en combobox, click submit — NO debe navegar inesperadamente
  7. **Filtros adaptivos fix (UX-076)**: seleccionar "Farmacos" -> dropdown Marca SOLO debe mostrar marcas de farmacos
- **Grabar GIFs de:** (1) Formulario contacto completo sin navegacion erratica, (2) Kanban drag-drop, (3) Formulario producto con drag-drop imagenes, (4) Filtros adaptivos funcionando, (5) Modal de confirmacion de eliminacion

---

## Regresion Automatizada
- No hay regression-results.md para Ronda 2 (PM indica que no hay regresion automatizada en esta ronda)
- Los 33 archivos .spec.ts generados en Ronda 1 serviran como baseline
- Resultado de `npx playwright test e2e/tests/`: pendiente de ejecucion post-Ronda 2
- Criterios verificados por automatizacion (PASA automatizado): 0 esta ronda
- Criterios con regresion detectada: pendiente

## Criterios que se mantienen de Ronda 1 (NO re-testear)

### PASA en Ronda 1 — 153 criterios (se mantienen)
**Visual Checker (120):**
DC-001 a DC-012, DC-014 a DC-029 (28), DC-033, DC-036, DC-038, DC-039, DC-042, DC-043, DC-045, DC-046 (8), DC-050, DC-051, DC-052, DC-054, DC-055, DC-056, DC-057, DC-059, DC-060, DC-062, DC-064, DC-067, DC-068, DC-071, DC-072, DC-073 (16), DC-080, DC-081, DC-082, DC-084, DC-085, DC-086, DC-088, DC-096, DC-099 (9), DC-105, DC-109, DC-112 (3), DC-136, DC-143, DC-149 (3), BVC-001 a BVC-012, BVC-015 a BVC-017, BVC-020, BVC-024 a BVC-040 (33), NFR-022, NFR-024 (2)

**Flow Tester (50):**
UX-001, UX-005 a UX-011 (7), UX-017 (1), UX-022 a UX-025*, UX-027*, UX-028, UX-030, UX-031b, UX-033, UX-035, UX-036, UX-037 (11), UX-040, UX-041, UX-042, UX-056 (4), UX-060 a UX-062, UX-063*, UX-064 a UX-069, UX-071 a UX-073, UX-074b (14)
(*UX-025, UX-027, UX-063 eran PASA parcial -- se re-verifican en Ronda 2)

**Edge Case Tester (28):**
UX-075, UX-077 a UX-089, UX-092 a UX-097, UX-098, UX-099, UX-113, UX-115 (22), NFR-009, NFR-014, NFR-016, NFR-017, NFR-020, NFR-031, NFR-032 (7) -- Nota: UX-076 era PASA parcial, se re-verifica

### N/A en Ronda 1 — 27 criterios
Criterios que eran genuinamente N/A (estados no verificables en demo, funcionalidades que requieren backend real):
UX-019, UX-020, UX-021, UX-024, UX-029, UX-031, UX-032, UX-047, UX-048, UX-050, UX-051, UX-052, UX-053, UX-054, UX-055, UX-057, UX-058, UX-059, UX-074

**IMPORTANTE**: De estos 27 N/A, algunos DEBEN re-evaluarse ahora que el routing funciona:
- UX-012 (404 page) -> ahora testeable, asignado al Flow Tester
- UX-034 (marca individual) -> ahora testeable, asignado al Flow Tester
- UX-038 (busqueda sin resultados) -> ahora testeable, asignado al Flow Tester
- UX-039 (busqueda cargando) -> ahora testeable, asignado al Flow Tester
- UX-070 (categorias panel) -> ahora testeable, asignado al Flow Tester
- UX-043 a UX-046, UX-049 -> re-evaluar, asignados al Edge Case Tester
- Los demas N/A (UX-019, UX-020, UX-021, UX-024, UX-029, UX-031, UX-032, UX-047, UX-048, UX-050 a UX-055, UX-057, UX-058, UX-059, UX-074) se mantienen N/A si siguen siendo estados no reproducibles en demo

## Criterios Pendientes de Testing Manual (Ronda 2)
- Total criterios que requieren sub-testers esta ronda: **125**
- Criterios FALLARON en Ronda 1 (re-verificar fix): **22** (9 Visual + 10 Flow + 3 Edge Case)
- Criterios DESBLOQUEADOS (antes bloqueados, ahora testeables — generar .spec.ts): **83** (64 DC/BVC Visual + 6 Flow + 13 Edge Case)
- Criterios PASA parcial (re-verificar completo): **6** (5 Flow + 1 Edge Case)
- Criterios N/A re-evaluados como testeables: **14** (5 Flow + 5 Edge Case + parcialmente del Visual via paginas ahora accesibles)
- NFR desbloqueados: **5** (Visual Checker)

### Distribucion resumen Ronda 2
| Sub-tester | Criterios asignados | Categorias |
|---|---|---|
| Visual Checker | 78 | 9 FALLA + 64 DC/BVC desbloqueados + 5 NFR desbloqueados |
| Flow Tester | 22 | 10 FALLA + 5 PASA parcial + 1 N/A reclasificado + 6 DESBLOQUEADOS |
| Edge Case Tester | 26 | 3 FALLA + 1 PASA parcial + 13 DESBLOQUEADOS + 9 N/A re-evaluar |
| **Total** | **126** | |

**Nota**: La diferencia de 125 vs 126 es porque UX-012 estaba contado como N/A pero se reclasifica como testeable.

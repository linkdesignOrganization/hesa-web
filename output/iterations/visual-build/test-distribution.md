# Plan de Distribucion — QA Team

## Contexto de Testing
- Iteracion: Fase 4 (Construccion Visual)
- Ronda: 3
- URL del sitio desplegado: https://gray-field-02ba8410f.2.azurestaticapps.net
- URL del backend (si aplica): N/A (demo con mock data, sin backend)
- Total criterios esta iteracion: 317 (149 DC + 40 BVC + 117 UX + 11 NFR)
- Criterios que PASARON completamente en Ronda 2 (se mantienen como PASA): 179
- Criterios N/A (se mantienen): 49
- Criterios que FALLARON en Ronda 2 (re-verificar fix): 14
- Criterios PASA parcial en Ronda 2 (re-verificar completitud): 8
- Criterios DESBLOQUEADOS (BLOQUEADOS en Ronda 2 por BUG-002, ahora testeables): 67
- Total criterios que requieren sub-testers esta ronda: 89
- No hay regression-results.md — el PM no ejecuto regresion automatizada pre-Ronda 3

## Leccion Critica de Rondas Anteriores
En Ronda 2, 5 bugs reportados como "corregidos" por el Developer NO estaban realmente corregidos en el sitio desplegado (BUG-002, BUG-003, BUG-004, BUG-005, BUG-006). Esto desperdicio la mayor parte de la ronda. **Pre-flight check es OBLIGATORIO y debe verificar la ausencia de CADA bug critico antes de comenzar testing.**

## Resumen de Bugs Pendientes de Ronda 2 (7 bugs)

### Bugs PERSISTENTES de R1 (4 — todos de imagenes):
1. **BUG-003** (ALTA) — Hero sin imagen de fondo, solo gradiente oscuro
2. **BUG-004** (ALTA) — Bloques categoria sin imagenes, espacios vacios
3. **BUG-005** (ALTA) — Seccion "Marcas Destacadas" completamente ausente del home
4. **BUG-006** (MEDIA) — Carrusel muestra placeholders en vez de imagenes reales

### Bugs NUEVOS de R2 (3):
5. **BUG-014** (MEDIA) — Labels formulario distribuidores en ingles en ruta /es/
6. **BUG-015** (BAJA) — Busqueda sin estados de feedback (sin resultados, sin spinner)
7. **BUG-016** (BAJA) — Carrusel muestra solo 4 productos por slide (dashboard dice 6)

### Bug CRITICO esperado ELIMINADO:
8. **BUG-002** (CRITICO) — CRM tracking script DEBE estar completamente eliminado del staging. Si persiste, se aborta la ronda inmediatamente.

### Bugs NO VERIFICADOS en R2 (pendientes de re-test):
9. **BUG-007** — CTA fabricantes color fondo incorrecto (no se pudo verificar por BUG-002)
10. **BUG-010** — Submenu desborda sidebar (no re-testeado en R2)

---

## Pre-flight Check (OBLIGATORIO — cada sub-tester ANTES de testear)

Cada sub-tester DEBE ejecutar estas 6 verificaciones antes de iniciar cualquier criterio. Si ALGUNA falla, DETENER testing inmediatamente y reportar BLOQUEADO al PM.

1. **CRM script eliminado**: Navegar a `/es/`, abrir consola del navegador. Verificar que NO hay errores `ERR_NAME_NOT_RESOLVED` de `crm-api.linkdesign.cr`. Esperar 30 segundos en la pagina — la URL NO debe cambiar automaticamente
2. **Deep link publico ES**: Navegar directamente a `https://gray-field-02ba8410f.2.azurestaticapps.net/es/catalogo/farmacos` — debe renderizar pagina de catalogo de farmacos
3. **Deep link publico EN**: Navegar a `https://gray-field-02ba8410f.2.azurestaticapps.net/en/brands` — debe renderizar pagina de marcas en ingles
4. **Deep link admin**: Navegar a `https://gray-field-02ba8410f.2.azurestaticapps.net/admin/productos` — debe renderizar listado de productos del panel
5. **Estabilidad de navegacion**: Permanecer 30 segundos en `/es/contacto` sin interactuar. La URL NO debe cambiar sola. Repetir en `/admin/dashboard`
6. **Hero con imagen**: Navegar a `/es/`. El hero DEBE mostrar una imagen fotografica de fondo (no solo gradiente oscuro). Si solo se ve gradiente, BUG-003 no esta corregido

**Si pre-flight falla en items 1 o 5: BUG-002 persiste. ABORTAR ronda. Reportar al PM.**
**Si pre-flight falla en item 6: BUG-003 persiste. Continuar testing pero marcar DC-030, DC-101 como FALLA.**

---

## Notas Importantes para Todos los Sub-testers
- Testing EXCLUSIVAMENTE contra: https://gray-field-02ba8410f.2.azurestaticapps.net
- NUNCA testear contra localhost
- SPA Angular con routing `/es/`, `/en/`, y `/admin/`
- Datos mock — no hay backend real
- **Generar archivos `.spec.ts`** para TODOS los criterios DESBLOQUEADOS verificados en esta ronda (eran BLOQUEADOS en R2, necesitan tests automatizados nuevos)
- **Grabar GIFs de los flujos principales** — en R1 y R2 no se grabaron. En R3 es OBLIGATORIO capturar al menos screenshots como evidencia
- Para rutas bilingues probar con prefijo `/es/` por defecto, y `/en/` donde el criterio lo requiera
- **PASA parcial de R2**: estos criterios necesitan verificacion COMPLETA, no solo snapshot. Si ahora pasan completamente, actualizar a PASA

---

## Asignacion: Visual Checker -> e2e/tests/visual/

### Criterios asignados (57 criterios)

#### A. Re-verificar FALLA de R2 (8 criterios — verificar que bugs de imagenes estan corregidos)
- DC-030: Hero con imagen fotografica de fondo + overlay gradient. BUG-003 debe estar corregido
- DC-031: Bloques categoria con imagenes reales (Farmacos, Alimentos, Equipos). BUG-004
- DC-032: Seccion "Marcas Destacadas" presente en home con logos grayscale. BUG-005
- DC-034: Carrusel con imagenes reales de productos, no placeholders. BUG-006
- DC-061: Category blocks con imagenes (mismo que DC-031). BUG-004
- DC-097: Responsive de seccion marcas (depende de BUG-005 corregido)
- DC-101: Home exito completo — hero + bloques + marcas + imagenes. Depende de BUG-003/004/005
- DC-140: Transicion marcas logos grayscale->color. Depende de BUG-005

#### B. Re-verificar PASA parcial de R2 (2 criterios)
- DC-041: Nosotros layout COMPLETO — verificar hero 50-60vh, historia bloques alternados, numeros count-up, mapa SVG, equipo grid 3 cols (foto 160px circular, borde 4px, nombre 18px Bold), politicas. En R2 faltaba verificacion detallada de styles
- DC-065: Team member cards — verificar dimensiones foto circular 160px, borde 4px brand-primary, nombre 18px Bold, cargo gris 14px. En R2 faltaba medicion

#### C. DESBLOQUEADOS — DC Tokens mobile (1 criterio)
- DC-013: Escala tipografica mobile — display 32px/700, h1 32px/700, h2 28px/700, h3 24px/700 en viewport 375px

#### D. DESBLOQUEADOS — DC Layouts que requerian estabilidad (4 criterios)
- DC-035: CTA fabricantes full-width fondo #008DC9, padding 80px, titulo 36px Bold blanco. Tambien verificar BUG-007 (color fondo correcto)
- DC-037: Catalogo por categoria — breadcrumb extendido, titulo contextualizado, sin filtro Categoria
- DC-040: Pagina individual de marca — logo 160x160px, nombre 36px, pais, badges, grid productos
- DC-044: Resultados busqueda — breadcrumb, titulo "Resultados para '[termino]'", agrupacion

#### E. DESBLOQUEADOS — DC Componentes (8 criterios)
- DC-053: Search overlay — full-screen, input centrado 720px max-width, 60px height, resultados agrupados
- DC-058: Product gallery — thumbnails verticales 60x60px + imagen principal con zoom
- DC-063: Sticky bar detalle producto — aparece al scroll, CTAs visibles
- DC-066: Timeline distribuidores — circulos 56px #008DC9, lineas, animacion secuencial
- DC-069: Species badges — pills con colores semanticos por especie
- DC-070: Presentation pills — pills por presentacion del producto
- DC-076: Data table panel — headers UPPERCASE 13px, badges, iconos accion
- DC-079: Confirm modal — centrado, overlay rgba(0,0,0,0.5), botones accion/cancelar

#### F. DESBLOQUEADOS — DC Responsive (8 criterios)
- DC-083: Bloques categoria responsive — 1 col, imagen arriba, padding 32px, radius 16px
- DC-087: Filtros drawer mobile — bottom sheet con filtros
- DC-089: Panel cards responsive — 1 col en mobile
- DC-093: Carrusel mobile — 1 card, swipe, flechas ocultas
- DC-094: Paginacion responsive mobile
- DC-095: Timeline responsive — vertical en mobile
- DC-098: Tabs pill responsive

#### G. DESBLOQUEADOS — DC Estados UI (10 criterios)
- DC-100: Home skeleton shimmer
- DC-102: Home error state
- DC-104: Catalogo skeleton
- DC-106: Catalogo error
- DC-107: Catalogo vacio
- DC-108: Catalogo filtros sin resultados
- DC-110: Detalle skeleton
- DC-111: Detalle 404
- DC-113: Sin ficha PDF (boton oculto o disabled)
- DC-114: Login cargando

#### H. DESBLOQUEADOS — DC Feedback Visual (16 criterios)
- DC-120: Skeleton shimmer animation
- DC-121: Button spinner (loading state)
- DC-128: Validacion inline (borde rojo, mensaje bajo campo)
- DC-129: Submit loading state
- DC-130: Exito sitio publico (banner verde)
- DC-132: Error envio (banner rojo)
- DC-139: Scroll fade-in con Intersection Observer
- DC-141: Underline links hover
- DC-142: Dropdown apertura animation
- DC-144: Timeline animation secuencial
- DC-147: Logo scroll crossfade
- DC-148: Mobile menu slide-in desde derecha 0.3s

### I. DESBLOQUEADOS — BVC (6 criterios — severidad ALTA, CLIENT-SPECIFIED)
- BVC-013: Formularios con secciones claras y separadores
- BVC-014: Campos condicionales que aparecen/desaparecen segun seleccion
- BVC-018: Confirmacion para acciones destructivas (modal)
- BVC-019: Estados vacios con diseno (ilustracion + mensaje + CTA)
- BVC-021: Flujo Listado > Crear > Detalle en panel
- BVC-023: Toast notifications con iconos y colores semanticos

### J. DESBLOQUEADOS — NFR Accesibilidad (2 criterios)
- NFR-021: WCAG AA — recorrido completo de la app con verificacion
- NFR-026: Tap targets >= 44x44px en mobile

### K. DESBLOQUEADOS — NFR Performance (3 criterios)
- NFR-001: LCP < 2.5s en home (medir con browser_evaluate PerformanceObserver)
- NFR-003: Core Web Vitals — CLS < 0.1, FID/INP aceptable
- NFR-005: Panel carga inicial < 3s

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- Breakpoints: mobile (<768px), tablet (768-991px), desktop (>=992px)
- **PRIORIDAD #1**: Verificar correccion de bugs de imagenes (A) — si siguen fallando, reportar inmediatamente
- **PRIORIDAD #2**: BVC criterios (I) — son CLIENT-SPECIFIED, severidad ALTA
- **PRIORIDAD #3**: Criterios desbloqueados que necesitan .spec.ts nuevos (C-K)
- Para DC de estados UI (G): algunos pueden ser N/A si la app mock no tiene mecanismo para provocar skeleton/error/vacio. Documentar como N/A con justificacion "demo con mock data no permite provocar estado X"
- Para NFR Performance (K): usar `page.evaluate(() => performance.getEntriesByType('navigation'))` y PerformanceObserver para medir metricas
- **Generar .spec.ts** para TODOS los criterios desbloqueados verificados (secciones C-K = hasta 54 criterios nuevos que necesitan tests automatizados)

### BVC asignados (Brief Verification Criteria)

| BVC | Criterio del Cliente | Tipo de verificacion |
|-----|---------------------|---------------------|
| BVC-013 | Formularios con secciones claras | Verificar admin/productos/crear tiene secciones con subtitulo Bold + separador |
| BVC-014 | Campos condicionales | Seleccionar categoria -> campos especificos aparecen con fade |
| BVC-018 | Confirmacion destructivas | Click eliminar -> modal con "Confirmar" y "Cancelar" |
| BVC-019 | Estados vacios disenados | Navegar a seccion sin datos -> ilustracion + mensaje + CTA |
| BVC-021 | Flujo Listado>Crear>Detalle | admin/productos -> Crear -> llenar -> volver a listado |
| BVC-023 | Toast notifications | Completar accion -> toast con icono y color semantico |

---

## Asignacion: Flow Tester -> e2e/tests/flow/

### Criterios asignados (12 criterios)

#### A. Re-verificar FALLA de R2 (4 criterios)
- UX-014: Labels formulario distribuidores TODOS en espanol en ruta /es/. BUG-014 debe estar corregido. Verificar: "Nombre de Empresa", "Pais de Origen", "Nombre de Contacto", "Correo", "Telefono", "Tipos de Producto", "Mensaje", terminos y condiciones
- UX-038: Busqueda con termino sin resultados ("zzzzz") muestra mensaje "No se encontraron productos" + sugerencias. BUG-015
- UX-039: Busqueda muestra spinner + "Buscando..." durante carga antes de mostrar resultados. BUG-015
- UX-063: Carrusel productos destacados muestra 6 productos (dashboard dice 6). Verificar si 4 por slide + 2 en slide siguiente, o 6 visibles. BUG-016

#### B. Re-verificar PASA parcial de R2 (2 criterios)
- UX-013: Flujo completo busqueda-contacto SIN interrupcion CRM: buscar producto -> ver detalle -> solicitar info -> formulario contacto pre-poblado. Debe completarse sin navegacion erratica
- UX-027: Detalle producto via deep link estable. Navegar a /es/catalogo/farmacos/[slug] directamente. 404 para producto inexistente. Sin CRM redirect

#### C. DESBLOQUEADOS — Panel estados avanzados (6 criterios — generar .spec.ts)
- UX-044: Campos condicionales en formulario producto — seleccionar categoria cambia campos visibles
- UX-045: Modal "cambios sin guardar" — editar campo, intentar navegar sin guardar
- UX-046: Modal eliminar producto — click eliminar, confirmacion, eliminacion
- UX-047: Detalle producto solo lectura — vista de producto sin edicion
- UX-048: Listado marcas panel — listado, busqueda, acciones
- UX-049: Formulario marca — crear/editar marca con logo, eliminar

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- **PRIORIDAD #1**: Verificar fixes de BUG-014, BUG-015, BUG-016 (seccion A)
- **PRIORIDAD #2**: Verificar flujos E2E completos sin interferencia CRM (seccion B)
- **PRIORIDAD #3**: Explorar y documentar flujos de panel desbloqueados (seccion C)
- Flujos E2E prioritarios:
  1. Home -> buscar producto -> ver detalle -> solicitar informacion -> contacto (UX-013)
  2. Panel: productos listado -> crear producto -> llenar formulario -> guardar -> ver en listado (UX-044, UX-045, UX-046)
  3. Panel: marcas listado -> crear marca -> editar -> eliminar (UX-048, UX-049)
  4. Distribuidores: verificar TODOS los labels en espanol (UX-014)
- Para criterios de panel (C): algunos pueden ser N/A si la demo mock no implementa la funcionalidad completa. Documentar con justificacion
- **Generar .spec.ts** para criterios desbloqueados (seccion C)
- **Verificar BUG-010** (submenu desborda sidebar): al navegar el panel, verificar que submenus no desbordan el sidebar 272px

---

## Asignacion: Edge Case Tester -> e2e/tests/edge-case/

### Criterios asignados (20 criterios)

#### A. Re-verificar FALLA de R2 (2 criterios)
- UX-091: Formulario distribuidores labels en espanol completo — verificar TODOS los labels, placeholders y mensajes de error en /es/distribuidores. BUG-014. Cross-check con UX-014 del Flow Tester
- UX-114: CRM tracking — verificar que el script esta ELIMINADO completamente. No debe haber errores de crm-api.linkdesign.cr en consola. No debe haber entradas CRM en CSP connect-src. BUG-002/017

#### B. Re-verificar PASA parcial de R2 (4 criterios)
- UX-090: Validacion contacto COMPLETA — empty submit muestra errores, validacion email, submit con datos validos muestra mensaje exito, NO navega a otra pagina. Sin interferencia CRM
- UX-043: Formulario producto COMPLETO — 6 secciones, campos editables, toggle switches funcionales, tags seleccionables. Llenado completo sin CRM
- UX-102: Tabs bilingues producto — cambio entre tabs "Espanol" y "English", contenido diferente en cada tab, persistencia
- UX-103: Seleccion categoria producto — click en card categoria, campos condicionales aparecen/desaparecen con animacion

#### C. DESBLOQUEADOS — Panel interacciones avanzadas (11 criterios — generar .spec.ts)
- UX-100: Drag-drop imagenes producto — arrastrar imagen a zona, preview, reordenar, eliminar
- UX-101: Drag-drop PDF ficha tecnica — arrastrar PDF, nombre archivo visible, eliminar
- UX-104: Formulario marca — campos nombre, pais, logo upload, categorias, descripcion
- UX-105: Categorias tags — agregar subcategoria (tag), eliminar con x, confirmar
- UX-106: Hero cambiar imagen — upload nueva imagen hero, preview
- UX-107: Productos destacados agregar — seleccionar productos para destacar en home
- UX-108: Productos destacados reordenar — drag-drop para cambiar orden
- UX-109: Mensajes kanban drag-drop — arrastrar card entre columnas (NUEVOS -> EN PROCESO -> ATENDIDOS)
- UX-110: Mensajes toggle kanban/tabla — cambiar entre vistas
- UX-111: Detalle mensaje — abrir mensaje, ver contenido completo, campos del remitente
- UX-112: Equipo liderazgo — agregar/editar/eliminar miembros del equipo

#### D. DESBLOQUEADOS — DC Panel UI (5 criterios — verificar estilos + generar .spec.ts)
- DC-077: Form fields panel — inputs con border-radius 10px, label arriba, focus ring 2px #008DC9, error borde rojo
- DC-078: Image uploader — zona drag-drop con borde dashed, icono upload, texto "Arrastra imagenes", preview grid
- DC-090: Panel tablas responsive — stacked cards en mobile
- DC-091: Panel formularios responsive — 1 col en mobile, botones sticky bottom
- DC-092: Panel kanban responsive — columnas stacked en mobile

#### E. DESBLOQUEADOS — DC Feedback Panel (8 criterios — generar .spec.ts)
- DC-122: Upload progress bar
- DC-123: Toast exito (verde #22C55E)
- DC-124: Toast error (rojo #EF4444)
- DC-125: Toast warning (amarillo #F59E0B)
- DC-126: Toast info (azul #008DC9)
- DC-127: Toast stacking (multiples toasts apilados)
- DC-133: Modal confirm — layout, botones, overlay
- DC-134: Eliminar marca — modal con nombre de marca, botones "Eliminar" rojo y "Cancelar"

#### F. DESBLOQUEADOS — DC Hover/Animation Panel (5 criterios — generar .spec.ts)
- DC-103: Home vacio parcial — seccion sin datos muestra estado vacio disenado
- DC-115: Login error — credenciales invalidas muestra mensaje error
- DC-116: Dashboard skeleton — shimmer mientras carga datos
- DC-117: Dashboard error parcial — widget con error muestra estado error individual
- DC-118: Productos vacio — listado sin productos muestra estado vacio
- DC-119: Form validacion — campos con error muestran borde rojo + mensaje

#### G. DESBLOQUEADOS — DC Feedback Visual avanzado (5 criterios)
- DC-131: Exito panel (toast o banner verde tras guardar)
- DC-135: Cambios sin guardar — modal al intentar salir sin guardar
- DC-137: Panel card hover — sombra aumenta, cursor pointer
- DC-138: Tabla hover — fila se ilumina con fondo sutil
- DC-145: Badge pulse — animacion en badges de notificacion
- DC-146: Drag-drop kanban — visual feedback al arrastrar (sombra, placeholder)

#### H. NFR Seguridad (verificar post-debloqueo)
- Verificar que CSP ya NO incluye crm-api.linkdesign.cr en connect-src
- Re-verificar NFR-017 (XSS) en formularios del panel (distributor form, contact form, product form)

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- **PRIORIDAD #1**: Verificar BUG-002 ELIMINADO completamente (UX-114 en seccion A). Si CRM sigue activo, reportar inmediatamente
- **PRIORIDAD #2**: Verificar formularios completos sin CRM (seccion B)
- **PRIORIDAD #3**: Panel interacciones desbloqueadas (seccion C)
- Edge cases anticipados:
  1. CRM tracking: verificar que el script no esta en el bundle, no solo deshabilitado
  2. Formulario distribuidores: verificar labels en /es/ Y en /en/ (ambos idiomas correctos)
  3. Drag-drop: probar con archivos invalidos (ej: .exe en zona de imagen)
  4. Formularios: submit con todos los campos vacios, con campos al limite de longitud
  5. Kanban: drag a la misma columna, drag rapido entre columnas
  6. Modal confirm: click fuera del modal, presionar Escape, doble click en confirmar
  7. Toast stacking: provocar 5+ toasts rapidos, verificar que no desbordan
- Para criterios del panel (C-G): muchos dependen de funcionalidad mock. Si la accion no esta implementada (ej: drag-drop no hace nada visual), documentar como N/A con justificacion "demo mock no implementa funcionalidad X"
- **Generar .spec.ts** para TODOS los criterios desbloqueados verificados
- Re-verificar **BUG-010** (submenu overflow en sidebar) como parte del testing del panel

---

## Regresion Automatizada (no hay regression-results.md)
- **No se ejecuto regresion automatizada antes de Ronda 3**
- Suite existente: 53 archivos .spec.ts (33 de R1 + 20 de R2) en:
  - `e2e/tests/flow/` (20 archivos)
  - `e2e/tests/edge-case/` (19 archivos)
  - `e2e/tests/visual/` (14 archivos)
- Criterios verificados por automatizacion esta ronda: 0 (sin ejecucion)
- Criterios con regresion detectada: ninguno (sin ejecucion)
- **Recomendacion al PM**: ejecutar `npx playwright test e2e/tests/` ANTES de distribuir a sub-testers en futuras rondas. Los criterios que pasen en regresion automatizada no necesitan testing manual y reducen la carga de los sub-testers

---

## Criterios Pendientes de Testing Manual

### Resumen de distribucion Ronda 3
- **Total criterios que requieren sub-testers esta ronda:** 89
- **Visual Checker:** 57 criterios (8 FALLA + 2 PASA parcial + 47 DESBLOQUEADOS)
- **Flow Tester:** 12 criterios (4 FALLA + 2 PASA parcial + 6 DESBLOQUEADOS)
- **Edge Case Tester:** 20 criterios (2 FALLA + 4 PASA parcial + 14 DESBLOQUEADOS + verificaciones de seguridad)

### Criterios FALLARON en Ronda 2 (re-verificar fix): 14
| Criterio | Bug asociado | Sub-tester R3 |
|----------|-------------|---------------|
| DC-030 | BUG-003 (hero imagen) | Visual Checker |
| DC-031 | BUG-004 (bloques categoria imagenes) | Visual Checker |
| DC-032 | BUG-005 (marcas ausente) | Visual Checker |
| DC-034 | BUG-006 (carrusel placeholders) | Visual Checker |
| DC-061 | BUG-004 (category blocks imagenes) | Visual Checker |
| DC-097 | BUG-005 (marcas responsive) | Visual Checker |
| DC-101 | BUG-003/004/005 (home completo) | Visual Checker |
| DC-140 | BUG-005 (marcas transicion) | Visual Checker |
| UX-014 | BUG-014 (labels distribuidores) | Flow Tester |
| UX-038 | BUG-015 (busqueda sin resultados) | Flow Tester |
| UX-039 | BUG-015 (busqueda sin spinner) | Flow Tester |
| UX-063 | BUG-016 (carrusel 4 vs 6) | Flow Tester |
| UX-091 | BUG-014 (labels distribuidores) | Edge Case Tester |
| UX-114 | BUG-002/017 (CRM eliminado) | Edge Case Tester |

### Criterios PASA parcial en Ronda 2 (re-verificar completitud): 8
| Criterio | Razon parcial | Sub-tester R3 |
|----------|--------------|---------------|
| DC-041 | Nosotros verificado en snapshot, faltan styles detallados | Visual Checker |
| DC-065 | Team cards visibles, faltan mediciones 160px/4px/18px | Visual Checker |
| UX-013 | Flujo busqueda-contacto interrumpido por CRM | Flow Tester |
| UX-027 | Detalle producto deep link afectado por CRM | Flow Tester |
| UX-043 | Formulario producto renderiza pero llenado bloqueado por CRM | Edge Case Tester |
| UX-090 | Validacion OK pero navegacion erratica por CRM | Edge Case Tester |
| UX-102 | Tabs visibles pero cambio no verificado por CRM | Edge Case Tester |
| UX-103 | Cards categoria visibles pero interaccion no verificada | Edge Case Tester |

### Criterios DESBLOQUEADOS (BLOQUEADOS en R2, ahora testeables — generar .spec.ts): 67
Distribuidos entre los 3 sub-testers segun especialidad (ver asignaciones arriba).

### Criterios NO asignados esta ronda (179 PASA + 49 N/A = 228)
Estos se mantienen con su estado de R2. Seran verificados por regresion automatizada cuando se ejecute `npx playwright test`.

---

## Notas sobre N/A reclasificables
Los siguientes criterios marcados N/A en R2 podrian reclasificarse si la demo mock los implementa. Sub-testers deben verificar si ahora son testeables:
- UX-047: Detalle producto solo lectura (asignado a Flow Tester en seccion C)
- UX-048: Listado marcas panel (asignado a Flow Tester en seccion C)
- UX-050: Categorias panel estados avanzados
- UX-051 a UX-055: Gestion Home secciones (hero, productos destacados, marcas destacadas, contenido estatico, equipo)
- UX-057: Detalle mensaje
- UX-058: Configuracion

Estos estan asignados parcialmente a Flow Tester y Edge Case Tester segun corresponda. Si la funcionalidad NO existe en la demo, mantener como N/A con justificacion.

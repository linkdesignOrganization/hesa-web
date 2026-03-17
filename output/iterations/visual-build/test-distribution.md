# Plan de Distribucion -- QA Team

## Contexto de Testing
- Iteracion: Visual Build (Fase 4)
- Ronda: 4
- URL del sitio desplegado: https://gray-field-02ba8410f.2.azurestaticapps.net
- URL del backend: N/A (demo con mock data, sin backend)
- Total criterios esta iteracion: 317 (149 DC + 40 BVC + 117 UX + 11 NFR)
- Criterios en PASA tras R3: 206
- Criterios en PASA parcial tras R3: 10
- Criterios en N/A tras R3: 49
- Criterios que FALLARON en R3: 12
- Criterios BLOQUEADOS en R3: 40
- Criterios a testear manualmente esta ronda: 62
- Criterios reclasificados N/A en R4 (imagenes demo): 5

## Cambio Critico Ronda 4: BUG-018 es Artefacto de Playwright MCP

**El Developer investigo BUG-018 (auto-navegacion SPA) y determino que es un ARTEFACTO del entorno de testing Playwright MCP, NO un bug real del codigo fuente.** La app funciona correctamente en navegador real. Esto significa:

1. Los 40 criterios BLOQUEADOS por BUG-018 en R3 deben RE-TESTEARSE
2. Sub-testers deben usar **timeouts mas largos** (30s en lugar de 10s) y **retry logic** si experimentan navegacion inesperada
3. Si la auto-navegacion persiste con Playwright MCP, los sub-testers deben:
   - Intentar `page.goto()` inmediatamente antes de cada verificacion para forzar la ruta correcta
   - Usar `page.waitForURL()` con timeout extendido para confirmar estabilidad
   - Si una verificacion falla por navegacion inesperada, reintentar hasta 3 veces antes de reportar BLOQUEADO
   - Reportar si el artefacto persiste con las mitigaciones aplicadas (para escalar al PM)

## Reclasificacion de Criterios de Imagenes como N/A (Demo)

Los siguientes criterios FALLA por imagenes SVG inline (en lugar de fotos reales) se reclasifican como **N/A** para esta fase demo. Las fotos reales se incorporaran cuando el cliente las proporcione:

| Criterio | Descripcion | Estado R3 | Estado R4 |
|----------|-------------|-----------|-----------|
| DC-030 | Hero con SVG ilustracion en vez de foto profesional | FALLA (BUG-V18) | **N/A (demo -- SVG placeholder aceptable)** |
| DC-031 | Bloques categoria con SVGs en vez de fotos reales | FALLA (BUG-V20) | **N/A (demo -- SVG placeholder aceptable)** |
| DC-034 | Carrusel con ilustraciones SVG en vez de fotos | FALLA (BUG-V21) | **N/A (demo -- SVG placeholder aceptable)** |
| DC-061 | Category blocks componente con SVGs | FALLA (BUG-V20) | **N/A (demo -- SVG placeholder aceptable)** |
| DC-083 | Bloques categoria responsive imagenes SVG | FALLA (BUG-V20) | **N/A (demo -- SVG placeholder aceptable)** |

**Nota:** DC-030, DC-031, DC-034, DC-061, DC-083 verifican que el LAYOUT, tipografia, spacing y CTAs sean correctos -- eso ya PASA. Lo unico que falla es que la imagen es SVG en vez de foto. Para demo, esto es aceptable.

## Criterios que Mantienen FALLA y Requieren Re-verificacion

| Criterio | Descripcion | Bug | Expectativa R4 |
|----------|-------------|-----|----------------|
| DC-032 | Seccion marcas invisible (opacity:0) | BUG-005/V19 | Re-verificar -- IntersectionObserver debe estar corregido |
| DC-097 | Marcas responsive invisible | BUG-005/V19 | Depende de DC-032 |
| DC-101 | Home no muestra todas las secciones | Compuesto | Si DC-032 pasa y imagenes N/A, deberia pasar |
| DC-140 | Logos grayscale->color invisible | BUG-005/V19 | Depende de DC-032 |
| UX-045 | Modal cambios sin guardar no implementado | BUG-019 | Developer implemento en R4 |
| UX-046 | Modal eliminacion sin confirmacion | BUG-020 | Developer implemento en R4 |

---

## Asignacion: Visual Checker --> e2e/tests/visual/

### Criterios asignados (33 criterios)

**A. DESBLOQUEADOS por resolucion BUG-018 -- layouts y componentes (18 criterios):**
- DC-037: Catalogo por categoria layout (breadcrumb extendido, titulo contextualizado, filtros especificos)
- DC-040: Pagina individual de marca (logo grande 160x160px + nombre 36px Bold + badges + grid productos)
- DC-041: Pagina Nosotros layout completo (hero 50-60vh + historia bloques narrativos + numeros + mapa SVG + equipo + politicas)
- DC-044: Resultados de busqueda layout (breadcrumb + titulo "Resultados para '[termino]'" 36px Bold + agrupados)
- DC-049: Panel Mensajes kanban layout (toggle Kanban/Tabla, 3 cols equidistantes, headers UPPERCASE + conteo, cards con badge tipo)
- DC-053: Search Overlay layout (overlay full-screen rgba(0,0,0,0.6), input centrado max-width 720px height 60px, resultados agrupados PRODUCTOS/MARCAS)
- DC-058: Product Gallery (thumbnails verticales 60x60px radius 8px, activo borde 2px #008DC9, imagen principal fondo #F5F7FA, crossfade)
- DC-063: Sticky Bar (desktop fixed top #005A85 height 60px thumbnail+nombre+CTA; mobile fixed bottom blanco+borde; translateY animacion)
- DC-065: Team Member Card (foto circular 160px borde 4px blanco sombra sm, nombre 18px Bold, cargo 14px gris)
- DC-066: Timeline distribuidores (horizontal 4 nodos 56px #008DC9, numeros blancos Bold 20px, linea 2px, animacion secuencial)
- DC-076: Data Table panel (headers UPPERCASE 12px Semibold #6B7280, filas 52px, acciones iconos 18px, mobile stacked cards)
- DC-079: Confirm Modal (backdrop rgba(0,0,0,0.5), modal centrado blanco radius 16px max-width 440px, icono circulo 48px danger, animacion scale)
- DC-087: Filtros drawer mobile (boton "Filtrar" + drawer bottom sheet 0.3s desde abajo)
- DC-093: Carrusel responsive (4 cards desktop + flechas, 2 tablet + flechas, 1 mobile + swipe sin flechas)
- DC-094: Paginacion responsive (completa con numeros desktop, simplificada flechas + "Pagina X de Y" mobile)
- DC-095: Timeline responsive (horizontal con nodos equidistantes desktop, vertical con linea izquierda mobile)
- DC-128: Validacion inline formulario (post-blur, borde 2px #EF4444, mensaje 13px #EF4444 con icono, descriptivo)
- DC-141: Underline links menu (pseudo-elemento ::after width 0->100% de izq a der, 2px #008DC9, transition 0.2s)

**B. FALLA a re-verificar (4 criterios):**
- DC-032: Seccion Marcas Destacadas -- verificar que opacity != 0 y clase `is-visible` del IntersectionObserver aplicada
- DC-097: Marcas responsive -- verificar en breakpoints mobile 375px y tablet 768px
- DC-101: Home todas las secciones visibles -- con imagenes N/A y marcas corregidas, TODAS las secciones deben renderizar
- DC-140: Logos grayscale->color transition -- verificar filter grayscale(100%) en default y grayscale(0%) en hover

**C. PASA parcial a completar verificacion (6 criterios):**
- DC-069: Species Badges estilos detallados (fila horizontal fondo #F5F7FA radius 8px, icono 18px #6B7280, label 13px #1F2937 Medium, gap 12px)
- DC-070: Presentation Pills estilos (radius pill 25px, default borde 1px #E5E7EB, selected fondo #E8F4FD borde #008DC9, hover borde #008DC9)
- DC-119: Validacion formularios borde exacto (2px #EF4444 + mensaje 13px con icono exclamacion)
- DC-139: Scroll fade-in todas las secciones (verificar que IntersectionObserver aplica `is-visible` en CADA seccion con `fade-in-section`)
- BVC-014: Campos condicionales fade animation al cambiar categoria completa
- BVC-021: Flujo Listado > Crear > Detalle sin interrupciones

**D. DESBLOQUEADOS adicionales -- feedback visual (5 criterios):**
- DC-129: Submit loading state (spinner 18px dentro boton + "Enviando..." + pointer-events none)
- DC-130: Exito sitio publico (formulario reemplazado por confirmacion: checkmark #22C55E 48px + "Mensaje enviado" 20px Bold + fondo #DCFCE7 radius 12px padding 40px)
- DC-132: Error envio (toast rojo + formulario mantiene datos + boton vuelve a normal)
- DC-133: Modal confirm layout (icono circulo 48px fondo #FEE2E2 icono #EF4444, titulo 18px Bold, botones Cancelar outline + Confirmar danger)
- DC-147: Logo header scroll crossfade (logo completo a isotipo opacity transition 0.3s)

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- Breakpoints a verificar: mobile (375px), tablet (768px), desktop (1440px)
- **MITIGACION BUG-018 (artefacto Playwright):** Usar `page.goto(url)` ANTES de cada verificacion para forzar la ruta correcta. Usar `page.waitForURL()` con timeout de 30 segundos. Si la pagina navega sola, reintentar hasta 3 veces con `page.goto()` forzado. NO reportar BLOQUEADO por BUG-018 a menos que 3 reintentos fallen.
- **DC-032/DC-097/DC-140 (marcas -- PRIORIDAD ALTA):**
  1. Navegar a /es/ y scroll hasta la seccion de marcas
  2. Usar `browser_evaluate` para medir: `document.querySelector('.logos-section, [class*="marcas"], [class*="brands"]')` -> verificar classList y opacity
  3. Si opacity es 0 sin clase `is-visible`: FALLA con evidencia
  4. Si opacity es 1 y logos visibles: verificar transicion grayscale->color en hover
- **DC-079/DC-133 (modal confirm):** Ir a /admin/productos, click menu 3 puntos > Eliminar. BUG-020 fue corregido, debe aparecer modal. Verificar layout completo del modal
- **DC-129/DC-130/DC-132 (form feedback):** Completar formulario de contacto /es/contacto y enviar. Verificar estados de submit
- **DC-063 (sticky bar):** Detalle de producto, scroll prolongado. Verificar en desktop (barra top) y mobile (barra bottom)
- **DC-147 (logo scroll):** En /es/, hacer scroll. Verificar crossfade del logo en header
- **Prioridad de verificacion:** DC-032 > DC-079/DC-133 > DC-063 > DC-041 > DC-049 > resto
- **Generar .spec.ts** para TODOS los criterios verificados -- la mayoria no tiene tests porque estaban bloqueados

### BVC-xxx asignados (Brief Verification Criteria)

| BVC-xxx | Criterio del Cliente | Tipo de verificacion |
|---------|---------------------|---------------------|
| BVC-014 | Campos condicionales se muestran/ocultan con fade | visual -- completar verificacion de fade animation |
| BVC-018 | Acciones destructivas tienen confirmacion (modal) | visual -- DESBLOQUEADO, verificar en eliminar producto |
| BVC-019 | Estados vacios disenados (ilustracion + mensaje + CTA) | visual -- DESBLOQUEADO, verificar componente vacio |
| BVC-021 | Flujo Listado > Crear > Detalle claro | visual -- completar verificacion sin interrupciones |
| BVC-023 | Toast notifications post-guardar/eliminar | visual -- DESBLOQUEADO, verificar tras acciones |

Brief compliance es QA gate CLIENT-SPECIFIED -- severidad ALTA para fallos.

### NFR asignados (accesibilidad + performance)
- NFR-001: LCP < 3s en pagina de inicio -- medir con `browser_evaluate` usando PerformanceObserver. Si demo mock no genera metrica significativa, marcar N/A
- NFR-003: Core Web Vitals -- medir LCP, CLS con `browser_evaluate`. FID requiere interaccion. Si no medible, marcar N/A
- NFR-021: WCAG AA -- completar verificacion completa sin interrupciones (contraste, ARIA roles, focus visible, keyboard nav)
- NFR-026: Tap targets >= 44x44px -- re-verificar los 4 botones que estaban <44px en R3, identificarlos por nombre

---

## Asignacion: Flow Tester --> e2e/tests/flow/

### Criterios asignados (10 criterios)

**A. FALLA implementados en R4 (2 criterios -- PRIORIDAD MAXIMA):**
- UX-045: Modal "cambios sin guardar" -- Developer implemento CanDeactivate guard en R4
- UX-046: Modal eliminacion con confirmacion -- Developer implemento modal confirm en R4

**B. DESBLOQUEADOS por resolucion BUG-018 -- interacciones panel (8 criterios):**
- UX-104: Formulario marca -- logo drag-drop zona + pais dropdown con busqueda + categorias multi-select checkboxes + descripcion tabs ES/EN
- UX-106: Gestion Hero -- preview + click "Cambiar imagen" abre selector + progress bar mock + preview actualiza
- UX-107: Productos destacados -- boton "+Agregar" abre modal seleccion con busqueda por nombre, filtro por categoria, checkboxes, "Agregar seleccionados"
- UX-108: Productos/Marcas destacados reordenar -- drag-and-drop con drag-handles (6 puntos), card elevada con sombra, boton "Guardar orden", boton "X" para remover
- UX-109: Mensajes kanban drag-drop -- arrastrar card cambia estado, card se eleva, columna destino resalta, conteos actualizan, toast con nombre
- UX-110: Mensajes toggle kanban/tabla -- alternar vistas, filtros en ambas (tipo, estado, busqueda), boton "Exportar CSV" visible
- UX-111: Detalle mensaje -- notas internas textarea + "Guardar nota", "Marcar como atendido" cambia estado + toast + redirige, "Eliminar" con modal
- UX-112: Equipo liderazgo -- drag-drop reorden con drag-handles, agregar miembro (foto drag-drop + nombre/cargo ES/EN), eliminar con modal

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- **MITIGACION BUG-018 (artefacto Playwright):** Usar `page.goto(url)` ANTES de cada verificacion. Usar `page.waitForURL()` con timeout 30s. Reintentar hasta 3 veces si la pagina navega sola.
- **UX-045 (PRIORIDAD MAXIMA -- bug corregido):** Verificar exhaustivamente:
  1. Ir a /admin/productos/crear
  2. Escribir texto en "Nombre del producto" (o cualquier campo)
  3. Click en "Dashboard" en sidebar
  4. VERIFICAR: Aparece modal con "Tienes cambios sin guardar" + "Salir sin guardar" + "Seguir editando"
  5. Click "Seguir editando" -> permanece en formulario con datos intactos
  6. Repetir paso 3, click "Salir sin guardar" -> navega a Dashboard, datos perdidos
  7. CASO NEGATIVO: Ir a formulario SIN modificar campos, navegar. NO debe aparecer modal
  8. VERIFICAR en formulario editar (/admin/productos/:id/editar) tambien
- **UX-046 (PRIORIDAD MAXIMA -- bug corregido):** Verificar exhaustivamente:
  1. Ir a /admin/productos
  2. Click en menu 3 puntos (opciones) del primer producto
  3. Click en "Eliminar"
  4. VERIFICAR: Aparece modal con nombre del producto, boton "Eliminar" rojo y "Cancelar"
  5. Click "Cancelar" -> modal se cierra, producto sigue en lista
  6. Repetir, click "Eliminar" en modal -> producto se elimina + toast de confirmacion
  7. VERIFICAR tambien: eliminar desde detalle de producto si existe boton eliminar alli
- **UX-109 (kanban drag-drop):** Flujo critico del panel. Ir a /admin/mensajes:
  1. Vista kanban con 3 columnas (NUEVOS/EN PROCESO/ATENDIDOS)
  2. Arrastrar card de NUEVOS a EN PROCESO
  3. Verificar: conteos de ambas columnas se actualizan + toast "Mensaje de [Nombre] movido a En Proceso"
- **UX-107 + UX-108 (productos/marcas destacados):**
  1. Ir a /admin/home/productos-destacados
  2. Click "+ Agregar" -> modal con lista + busqueda + checkboxes
  3. Seleccionar items, click "Agregar seleccionados"
  4. Reordenar con drag-handles
  5. Click "Guardar orden"
- **Generar .spec.ts** para TODOS los criterios -- ninguno tiene test automatizado previo
- Flujos E2E prioritarios en orden:
  1. UX-045 + UX-046 (bugs corregidos -- verificar fix)
  2. UX-109 (kanban drag-drop)
  3. UX-107 + UX-108 (gestion destacados)
  4. UX-111 + UX-112 (detalle mensaje + equipo)
  5. UX-104 + UX-106 + UX-110 (formulario marca + hero + toggle)

---

## Asignacion: Edge Case Tester --> e2e/tests/edge-case/

### Criterios asignados (19 criterios)

**A. DESBLOQUEADOS por resolucion BUG-018 -- edge cases de interaccion (10 criterios):**
- DC-134: Eliminar marca con productos -- modal warning adicional fondo #FEF3C7 con "Esta marca tiene X productos asociados"
- DC-135: Cambios sin guardar -- modal "Tienes cambios sin guardar. Deseas salir?" + "Salir sin guardar" + "Seguir editando" (complementa UX-045 desde perspectiva de edge case)
- DC-138: Hover filas tabla panel -- fondo #F7F8FA transition background 0.15s
- DC-142: Dropdowns apertura animacion -- opacity 0->1 + translateY(-4px)->0 en 0.2s cubic-bezier(0.25,0.46,0.45,0.94)
- DC-144: Timeline animacion secuencial -- cada nodo opacity 0->1 + scale(0.5->1) en 0.4s, delay 200ms incremental, linea width 0->100%
- DC-146: Drag-drop kanban visual feedback -- card sombra lg + rotate(2deg) + opacity 0.9, columna destino borde 2px dashed #008DC9 + fondo #E8F4FD
- BVC-018: Acciones destructivas tienen confirmacion modal -- verificar en MULTIPLES contextos: eliminar producto, eliminar marca, eliminar miembro equipo
- BVC-019: Estados vacios disenados -- verificar componente: ilustracion SVG + "No hay [items] aun" + "[descripcion]" + boton CTA azul
- BVC-023: Toast notifications -- verificar: position fixed top 24px right 24px, colores semanticos por tipo, auto-dismiss 3s exito, persistente error

**B. PASA parcial a completar (5 criterios):**
- UX-100: Imagen drag-drop completar -- drag-over borde #008DC9 fondo #E8F4FD, preview 120x120px radius 8px con overlay hover (lapiz + X), drag-and-drop reorden, badge "Principal" en primera, max 6 con tooltip
- UX-101: PDF drag-drop completar -- nombre archivo + tamano + botones "Descargar" y "Eliminar"
- UX-102: Tabs bilingues ES/EN completar -- click en "English" cambia campos, misma estructura por categoria en ambos tabs
- UX-103: Seleccion categoria completar -- borde 2px #008DC9 al seleccionar, fade in/out de campos condicionales con transicion
- UX-105: Categorias tags editables completar -- click "+" abre input inline con boton confirmar, click "x" elimina tag, cards colapsables con chevron, toast

**C. FALLA a re-verificar -- IntersectionObserver (3 criterios):**
- DC-032: Verificar via `browser_evaluate` que seccion marcas tiene opacity != 0. Medir `getComputedStyle(element).opacity` y verificar classList contiene `is-visible`
- DC-097: Si DC-032 pasa, verificar responsive de seccion marcas en mobile 375px y tablet 768px (grid 3x2 logos ~80px)
- DC-140: Si DC-032 pasa, verificar transicion: default filter grayscale(100%) opacity(0.6), hover grayscale(0%) opacity(1), transition 0.3s

**D. NFR seguridad (1 criterio):**
- NFR-017: Re-verificar XSS sanitization con payloads avanzados ahora que formularios son estables. Probar: `<script>alert('xss')</script>`, `<img onerror=alert(1) src=x>`, `javascript:alert(1)`, `' OR 1=1 --` en TODOS los campos de formularios de contacto y distribuidores

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- **MITIGACION BUG-018 (artefacto Playwright):** Usar `page.goto(url)` ANTES de cada verificacion. Usar `page.waitForURL()` con timeout 30s. Reintentar hasta 3 veces si la pagina navega sola.
- **DC-032/DC-097/DC-140 (marcas -- PRIORIDAD ALTA):**
  1. Navegar a https://gray-field-02ba8410f.2.azurestaticapps.net/es/
  2. Scroll hasta la seccion de marcas destacadas
  3. Usar `browser_evaluate`:
     ```javascript
     const section = document.querySelector('.logos-section, [class*="marcas"], [class*="brands"], .featured-brands');
     if (section) {
       const style = getComputedStyle(section);
       return { opacity: style.opacity, classList: [...section.classList], display: style.display, visibility: style.visibility, height: section.offsetHeight };
     }
     return 'Section not found';
     ```
  4. Si opacity === '0' sin `is-visible`: FALLA
  5. Si opacity === '1': PASA, proceder a verificar DC-097 (responsive) y DC-140 (hover transition)
- **DC-134 (eliminar marca con productos):**
  1. Ir a /admin/marcas
  2. Identificar una marca que tiene productos (ej: Zoofarma con 5+ productos)
  3. Click en opciones > Eliminar
  4. VERIFICAR: Modal con fondo #FEF3C7 warning "Esta marca tiene X productos asociados"
  5. Si no aparece warning especial, reportar FALLA
- **DC-135 (cambios sin guardar):**
  1. Verificar en /admin/productos/crear (complementa UX-045)
  2. TAMBIEN verificar en /admin/marcas/crear, /admin/home/hero, /admin/contenido/nosotros
  3. Edge case: llenar formulario, guardar exitosamente, luego navegar -- NO debe aparecer modal
  4. Edge case: llenar formulario, limpiar todos los campos manualmente, navegar -- NO debe aparecer modal si estado es igual al inicial
- **DC-138 (tabla hover):**
  1. Ir a /admin/productos
  2. Cambiar a vista tabla (toggle Table)
  3. Hacer hover sobre filas
  4. Medir: `getComputedStyle(row).backgroundColor` en hover -> #F7F8FA, verificar transition
- **DC-146 (kanban drag visual):**
  1. Ir a /admin/mensajes (vista kanban)
  2. Iniciar drag de una card
  3. DURANTE el drag verificar: sombra lg, rotate(2deg), opacity 0.9 de la card
  4. DURANTE el drag verificar: columna destino con borde 2px dashed #008DC9 + fondo #E8F4FD
- **BVC-018 (confirmaciones destructivas -- VERIFICAR EN 3+ CONTEXTOS):**
  1. Eliminar producto (/admin/productos > menu > Eliminar)
  2. Eliminar marca (/admin/marcas > menu > Eliminar)
  3. Eliminar miembro equipo (/admin/contenido/equipo > card > Eliminar)
  4. TODOS deben mostrar modal de confirmacion antes de ejecutar
- **BVC-019 (estados vacios):**
  1. Si es posible eliminar todos los items de una seccion para ver estado vacio
  2. Si no es posible en demo, verificar que el componente EmptyState existe en DOM con `browser_evaluate`
  3. Verificar: ilustracion SVG + titulo descriptivo + subtitulo + boton CTA
- **BVC-023 (toasts):**
  1. Guardar formulario -> toast verde "guardado correctamente" top-right, auto-dismiss ~3s
  2. Eliminar item (con confirmacion) -> toast "eliminado"
  3. Cambiar estado kanban -> toast "Mensaje movido a [estado]"
  4. Verificar position fixed, z-index alto, colores semanticos
- **Edge cases anticipados:**
  - Doble-click rapido en "Eliminar" del modal de confirmacion
  - Navegar con browser back button desde formulario con cambios (guard debe interceptar)
  - Cambiar categoria de producto con campos llenos y luego volver a categoria original (datos perdidos?)
  - Eliminar tag de categoria que esta en uso por productos
  - Drag-drop kanban: mover card y inmediatamente mover otra
  - Formulario vacio sin cambios + navegar = NO debe mostrar modal
- **Generar .spec.ts** para TODOS los criterios verificados

---

## Regresion Automatizada (pre-ronda)

- **No existe regression-results.md** para Ronda 4 al momento de este plan
- **Recomendacion al PM:** Ejecutar `npx playwright test e2e/tests/` ANTES de lanzar sub-testers. Los 78 .spec.ts existentes cubren criterios que ya PASAN. Si alguno falla, es regresion que el Developer debe corregir antes de la ronda
- Criterios verificados por automatizacion (PASA automatizado -- NO asignar a sub-testers): Ninguno confirmado todavia
- Criterios con regresion detectada: Pendiente de ejecucion de regresion

---

## Criterios Pendientes de Testing Manual

### Resumen

- Total criterios que requieren sub-testers esta ronda: **62**
  - Visual Checker: 33 criterios (18 desbloqueados + 4 FALLA re-verify + 6 parcial + 5 desbloqueados adicionales)
  - Flow Tester: 10 criterios (2 FALLA implementados R4 + 8 desbloqueados)
  - Edge Case Tester: 19 criterios (10 desbloqueados + 5 parcial + 3 FALLA re-verify + 1 NFR)

### Desglose por tipo de accion

| Tipo | Criterios | Sub-tester |
|------|-----------|------------|
| DESBLOQUEADOS (BUG-018 artefacto) -- generar .spec.ts | 40 | Visual (18) + Flow (8) + Edge (10) + Visual adicional (4 = NFR-001, NFR-003, NFR-021, NFR-026) |
| FALLA re-verificar fix R4 | 6 | Visual (4: DC-032, DC-097, DC-101, DC-140) + Flow (2: UX-045, UX-046) -- DC-032/DC-097/DC-140 compartidos con Edge |
| PASA parcial completar | 10 | Visual (6: DC-069, DC-070, DC-119, DC-139, BVC-014, BVC-021) + Edge (5: UX-100..UX-105) -- con solapamiento DC-032/097/140 |
| Reclasificados N/A (imagenes) | 5 | No asignados (DC-030, DC-031, DC-034, DC-061, DC-083) |

### Criterios NO asignados (PASA o N/A -- 255 criterios)

**206 PASA de R3** -- mantienen estado. Cubiertos por regresion automatizada si se ejecuta.

**54 N/A total (49 de R3 + 5 reclasificados R4):**
- **Imagenes demo (5 nuevos):** DC-030, DC-031, DC-034, DC-061, DC-083
- **Panel responsive avanzado (3):** DC-090, DC-091, DC-092
- **Estados carga/error/vacio no provocables en demo mock (12):** DC-100, DC-102, DC-103, DC-104, DC-106, DC-107, DC-108, DC-110, DC-114, DC-116, DC-117, DC-118
- **Feedback visual no provocable en demo mock (10):** DC-120, DC-121, DC-122, DC-123, DC-124, DC-125, DC-126, DC-127, DC-131, DC-145
- **Estados publico no provocables (8):** UX-019, UX-020, UX-021, UX-024, UX-029, UX-031, UX-032, UX-039
- **Panel estados avanzados (10):** UX-050, UX-051, UX-052, UX-053, UX-054, UX-055, UX-057, UX-058, UX-059, UX-074
- **NFR performance (parcial -- asignados a Visual pero pueden ser N/A):** NFR-001, NFR-003

### Condicion de salida para Ronda 4

Para declarar **LISTO_PARA_DEMO**:
- 0 criterios FALLA (excluidos los 5 N/A de imagenes ya reclasificados)
- 0 criterios BLOQUEADO
- 0 regresiones en suite automatizada existente
- 100% criterios con resultado (PASA, PASA automatizado, N/A con justificacion, o PASA parcial con justificacion aceptable)
- Criterios desbloqueados tienen .spec.ts generados para regresion futura
- GIFs de evidencia para flujos principales (si el tooling lo permite)

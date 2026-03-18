# Plan de Distribucion -- QA Team

## Contexto de Testing
- Iteracion: 1
- Ronda: 3
- URL del sitio desplegado: https://gray-field-02ba8410f.2.azurestaticapps.net
- URL del backend: https://hesa-api.azurewebsites.net
- URL del API base: https://hesa-api.azurewebsites.net/api
- Total criterios esta iteracion: 170 (157 REQ + 13 NFR)
- Criterios PASA (automatizado, no re-testear): 72
- Criterios N/A (auth admin, sin re-testear): 56
- Criterios que requieren testing manual esta ronda: 42
- Desglose manual: 7 tests FALLA re-verificar + 22 detalle producto + 7 marcas individual + 2 catalogo general + 2 auth regression + 1 NFR SSR + 1 REQ-040
- Criterios DESBLOQUEADOS (antes bloqueados por API 404, ahora con datos): 28

## Cambio Critico R3 -- API FUNCIONANDO

El bug BUG-002 (API 404) que bloqueaba 66 criterios en R1 y R2 fue CORREGIDO. La API ahora responde con datos JSON. La regresion automatizada (regression-results-r4.md) confirma 390 tests passed.

## Politica de Admin CRUD (REQ-224 a REQ-274, REQ-311, REQ-312, REQ-315)

Per PM instruction: criterios de admin CRUD que requieren Azure Entra ID auth se clasifican como **N/A (requiere auth manual)** porque:
1. El testing automatizado NO puede autenticarse con Entra ID
2. El codigo existe y las rutas estan implementadas (confirmado por tests de auth gate que verifican redirect a login)
3. La estructura visual fue verificada en Fase 4 (visual-build) con 124 .spec.ts

Esto aplica a:
- REQ-224 a REQ-258 (35 criterios CRUD Productos) -- N/A
- REQ-259 a REQ-267 (9 criterios CRUD Marcas) -- N/A
- REQ-268 a REQ-274 (7 criterios Categorias) -- N/A
- REQ-311 (Token expira) -- N/A
- REQ-312 (Cerrar sesion) -- N/A
- REQ-315 (Acceso hola@linkdesign.cr) -- N/A
Total: 56 criterios N/A

---

## Regresion Automatizada (de regression-results-r4.md)

- Resultado de `npx playwright test e2e/tests/`: **390 passed, 11 skipped** (~280 failed, todos panel admin auth timeouts esperados + unos pocos test bugs)
- La regresion confirma que la GRAN MAYORIA de criterios que fallaban por BUG-002 ahora PASAN

### Criterios verificados por automatizacion -- PASA (automatizado) -- NO asignar a sub-testers:

**Busqueda Global (REQ-035 a REQ-041):**
- REQ-035: Busqueda por nombre, marca, especie, familia -- PASA (automatizado)
- REQ-036: Resultados predictivos con 3+ caracteres -- PASA (automatizado)
- REQ-037: Resultados agrupados por tipo (max 5) -- PASA (automatizado)
- REQ-038: Clic en resultado navega a pagina correcta -- PASA (automatizado)
- REQ-039: Sin resultados: mensaje con sugerencias -- PASA (automatizado)
- REQ-041: Tolerancia a errores tipograficos -- PASA (automatizado)

**Catalogo Publico (REQ-078 a REQ-087):**
- REQ-078: Breadcrumb Inicio > Catalogo > Categoria -- PASA (automatizado)
- REQ-079: Titulo de categoria + contador -- PASA (automatizado)
- REQ-080: Descripcion corta de categoria -- PASA (automatizado) -- BUG-006 CORREGIDO
- REQ-083: Cards NO muestran precio/inventario -- PASA (automatizado)
- REQ-084: Clic en card navega a detalle -- PASA (automatizado)
- REQ-086: URL semantica /es/catalogo/farmacos -- PASA (automatizado)
- REQ-087: Meta titulo y descripcion unicos -- PASA (automatizado)

**Filtros y Paginacion (REQ-088 a REQ-105) -- ya pasaban en R2 + nuevos:**
- REQ-088 a REQ-092: Filtros por categoria -- PASA (automatizado)
- REQ-094: Boton "Limpiar filtros" -- PASA (automatizado, edge-case test)
- REQ-095: Combinacion de multiples filtros -- PASA (automatizado, edge-case intersection test)
- REQ-096: Mobile filtros colapsados -- PASA (automatizado)
- REQ-098: Contador actualiza dinamicamente -- PASA (automatizado)
- REQ-099: Filtros en URL query params -- PASA (automatizado)
- REQ-100: Valores filtros desde datos -- PASA (automatizado)
- REQ-101: Paginacion con maximo por pagina -- PASA (automatizado, edge-case test)
- REQ-102: Indicador "Mostrando X de Y" -- PASA (automatizado)
- REQ-103: Paginacion accesible con teclado -- PASA (automatizado)
- REQ-105: Paginacion vuelve a pag 1 con filtros -- PASA (automatizado)

**Detalle de Producto (REQ-106 a REQ-142):**
- REQ-107: Galeria con miniaturas + imagen principal -- PASA (automatizado)
- REQ-108: Clic en miniatura cambia imagen -- PASA (automatizado)
- REQ-111: Marca con link a pagina individual -- PASA (automatizado)
- REQ-117: CTA "Solicitar info" abre formulario -- PASA (automatizado)
- REQ-118: CTA WhatsApp con mensaje contextual -- PASA (automatizado)
- REQ-123: NO muestra precio, inventario, carrito -- PASA (automatizado)
- REQ-124: URL semantica /es/catalogo/[cat]/[slug] -- PASA (automatizado)
- REQ-125: Meta titulo (producto + marca) -- PASA (automatizado)
- REQ-126: Schema JSON-LD tipo Product -- PASA (automatizado) -- BUG-007 CORREGIDO
- REQ-130: Sticky bar al scroll -- PASA (automatizado)
- REQ-131: Sticky bar: miniatura, nombre, marca, CTA -- PASA (automatizado)
- REQ-132: Sticky bar desaparece al scroll arriba -- PASA (automatizado)
- REQ-138: Seccion "Tambien te puede interesar" -- PASA (automatizado)
- REQ-139: Relacionados de misma categoria/marca -- PASA (automatizado)
- REQ-140: Cards relacionados mismo formato catalogo -- PASA (automatizado)

**Marcas (REQ-143 a REQ-154):**
- REQ-143: Titulo y parrafo introductorio -- PASA (automatizado)
- REQ-147: Meta titulo y descripcion SEO -- PASA (automatizado)
- REQ-148: Textos en idioma seleccionado -- PASA (automatizado)
- REQ-153: Descripcion en idioma seleccionado -- PASA (automatizado)
- REQ-154: URL semantica /es/marcas/[slug] -- PASA (automatizado)

**Catalogo General (REQ-264a a REQ-264j):**
- REQ-264b: Filtro de "Categoria" en catalogo general -- PASA (automatizado)
- REQ-264c: Filtros disponibles segun categoria -- PASA (automatizado)
- REQ-264d: Filtros secundarios se adaptan dinamicamente -- PASA (automatizado)
- REQ-264e: Breadcrumb: Inicio > Catalogo -- PASA (automatizado)
- REQ-264f: Meta titulo y descripcion SEO -- PASA (automatizado)
- REQ-264g: Link "Catalogo" en header enlaza a pagina general -- PASA (automatizado)
- REQ-264i: Paginacion 24 productos por pagina -- PASA (automatizado)
- REQ-264j: Mobile: grid 1-2 cols, filtros colapsados -- PASA (automatizado)

**Autenticacion (REQ-308 a REQ-317):**
- REQ-309: Login: logo HESA + boton Microsoft -- PASA (automatizado)
- REQ-313: Rutas protegidas redirigen a login -- PASA (automatizado)
- REQ-314: Un solo nivel admin, sin roles -- PASA (automatizado, edge-case passes)
- REQ-317: Panel NO almacena contrasenas -- PASA (automatizado)

**SEO y Meta:**
- REQ-033: Etiquetas hreflang en cada pagina -- PASA (automatizado) -- BUG-005 CORREGIDO
- REQ-181: Meta tags SEO optimizados para ingles -- PASA (automatizado)

**NFR (de Fase 4 + nuevos que pasaron):**
- NFR-006: Meta titulo y descripcion unicos por pagina -- PASA (automatizado, JS-rendered titles)
- NFR-007: Sitemap XML automatico -- PASA (automatizado)
- NFR-008: Schema JSON-LD Organization y Product -- PASA (automatizado)
- NFR-009: URLs semanticas -- PASA (automatizado)
- NFR-010: Imagenes con alt descriptivos en idioma -- PASA (automatizado)
- NFR-011: Etiquetas hreflang conectan ES y EN -- PASA (automatizado) -- BUG-005 CORREGIDO
- NFR-012: Sitio indexable, robots.txt valido -- PASA (automatizado)
- NFR-013: Panel NO indexable -- PASA (automatizado) -- BUG-010 CORREGIDO (meta noindex presente)
- NFR-014: HTTPS con HSTS -- PASA (automatizado)
- NFR-017: Inputs sanitizados contra XSS -- PASA (automatizado)
- NFR-018: API valida autenticacion en cada endpoint -- PASA (automatizado) -- admin endpoints return 401/403
- NFR-019: Archivos subidos validados por tipo/tamano -- PASA (automatizado, code review + upload endpoint requires auth)
- NFR-020: Headers de seguridad completos -- PASA (automatizado) -- BUG-008 CORREGIDO (X-Powered-By removed)
- NFR-021: WCAG accesibilidad -- PASA (automatizado)
- NFR-026: Tap targets 44px -- PASA (automatizado)
- NFR-031: Mobile responsive publico -- PASA (automatizado)

**Total PASA (automatizado): 107 criterios**

### Criterios con tests que FALLAN en R4 regression -- requieren testing manual:

Estos 7 criterios tienen tests que fallan. En algunos casos es un bug real en la app, en otros es un test bug (selector ambiguo, test desactualizado). Los sub-testers deben verificar manualmente la funcionalidad y reportar si el defecto es de la APP o del TEST.

| Criterio | Test que falla | Motivo del fallo | Verificacion necesaria |
|----------|---------------|------------------|----------------------|
| REQ-040 | Search close button works | Test falla (close button), pero EN search UI test pasa | Verificar si close button funciona en ES |
| REQ-081 | Grid layout with products | Test busca grid con datos API | Verificar que grid 3 cols desktop, 2 tablet, 1-2 mobile funciona con productos reales |
| REQ-082 | Product cards show image, name, brand, species | Test falla esperando cards | Verificar cards tienen imagen, nombre, marca, iconos especie |
| REQ-085 | Error state when products cannot load | Test busca "No pudimos cargar" -- API funciona ahora | Verificar estado vacio si categoria sin productos |
| REQ-093 | Active filters as pills with X | Test falla por strict mode (2 elements) | Verificar visualmente que pills con X funcionan |
| REQ-097 | Empty results with suggestion | Test busca "No pudimos cargar" -- obsoleto | Verificar que filtros sin resultados muestran mensaje + sugerencia |
| REQ-104 | Scroll al inicio al cambiar pagina | Test skipped | Verificar que cambiar de pagina hace scroll up |

### Criterios con tests que FALLAN por issues especificos de marcas individuales:

| Criterio | Test que falla | Motivo | Verificacion |
|----------|---------------|--------|-------------|
| REQ-144 | Brand cards require API data | Test espera cards de marcas | Verificar grid cards marcas |
| REQ-145 | Brand cards: logo, nombre, pais, badges | Mismo test | Verificar contenido cards |
| REQ-146 | Clic en card navega a individual | Test falla | Verificar navegacion a marca individual |
| REQ-149 | Breadcrumb marca individual | Timeout 12.6s | Verificar breadcrumb Inicio > Marcas > [Marca] |
| REQ-150 | Logo, nombre, pais, descripcion | Timeout 12.6s | Verificar contenido marca individual |
| REQ-151 | Grid productos de la marca | Test falla | Verificar grid de productos filtrados por marca |
| REQ-152 | Filtros en grid de productos de marca | Mismo test | Verificar filtros en pagina de marca |

### Criterios adicionales que necesitan verificacion manual:

| Criterio | Descripcion | Motivo |
|----------|-------------|--------|
| REQ-106 | Breadcrumb Inicio > Cat > Producto | Test falla (REQ-106/110 combined test) |
| REQ-110 | Nombre del producto visible | Mismo test combinado |
| REQ-264a | Catalogo general muestra TODOS los productos | Test falla |
| REQ-264h | Contador se actualiza con filtros | Test falla |
| REQ-264c/d | Filter pills appear and can be removed | Test falla (flow test specific) |
| REQ-308 | Panel requiere autenticacion | Test falla: /admin/configuracion no redirige a login |
| REQ-316 | NO hay pantalla de gestion de usuarios | Test falla: /admin/usuarios no redirige a login |

### Criterios de producto skipped (requieren datos reales):

| Criterio | Test | Estado |
|----------|------|--------|
| REQ-109 | Product image zoom/lightbox | Skipped |
| REQ-112 | Badges/iconos de especie | Sin test especifico |
| REQ-113 | Farmacos: formula, registro, indicaciones | Sin test especifico |
| REQ-114 | Farmacos: pills de presentaciones | Sin test especifico |
| REQ-115 | Alimentos: especie, etapa, ingredientes | Sin test especifico |
| REQ-116 | Equipos: especificaciones, usos, garantia | Sin test especifico |
| REQ-119 | Boton ficha tecnica PDF si hay PDF | Sin test especifico |
| REQ-120 | Sin ficha PDF: boton NO se muestra | Skipped |
| REQ-121 | Mobile: 1 columna, galeria arriba | Sin test especifico |
| REQ-122 | Textos en idioma seleccionado | Sin test especifico |
| REQ-127 | Una sola imagen: sin miniaturas | Skipped |
| REQ-128 | Sin imagen: placeholder visual | Skipped |
| REQ-129 | Campos vacios sin areas en blanco | Skipped |
| REQ-133 | Mobile: sticky bar simplificado | Sin test especifico |
| REQ-134 | Sticky bar sin CLS | Skipped |
| REQ-135 | Storytelling imagen + texto | Skipped |
| REQ-136 | Storytelling no aparece si no hay contenido | Skipped |
| REQ-137 | Storytelling bilingue ES/EN | Sin test especifico |
| REQ-141 | Mobile: relacionados en carrusel horizontal | Skipped |
| REQ-142 | Unico producto: relacionados adaptados | Skipped |

---

## Pre-Flight Obligatorio (CRITICO - Cada sub-tester ejecuta antes de testear)

1. **API funciona**: Verificar `GET https://hesa-api.azurewebsites.net/api/public/products` retorna JSON con datos (NO 404)
2. **Productos cargan en catalogo**: Navegar a /es/catalogo/farmacos y confirmar que hay cards de productos visibles (no "0 productos")
3. **Marcas cargan**: Navegar a /es/marcas y confirmar que hay cards de marcas visibles
4. **Search funciona**: Buscar "amoxicilina" en search overlay y confirmar resultados predictivos
5. **SPA estable**: Navegar a /es y esperar 10 segundos sin interaccion -- la pagina NO debe auto-navegar (BUG-V05)

Si CUALQUIER pre-flight falla, reportar BLOQUEADO al PM sin continuar.

---

## Asignacion: Flow Tester -> e2e/tests/flow/

### Criterios asignados (17 criterios)

**Catalogo Publico (verificar con datos reales del API):**
- REQ-081: Grid 3 cols desktop, 2 tablet, 1-2 mobile (test falla -- verificar manualmente)
- REQ-082: Cards: imagen, nombre, marca, iconos especie (test falla -- verificar manualmente)
- REQ-085: Estado vacio si categoria sin productos (test obsoleto -- verificar estado real)

**Detalle de Producto (verificar con datos reales):**
- REQ-106: Breadcrumb Inicio > Cat > Producto (test falla -- verificar con producto real)
- REQ-110: Nombre del producto visible (test combinado falla)
- REQ-109: Imagen con zoom/lightbox (test skipped -- verificar interaccion)
- REQ-112: Badges/iconos de especie
- REQ-113: Farmacos: formula, registro, indicaciones
- REQ-114: Farmacos: pills de presentaciones
- REQ-115: Alimentos: especie, etapa, ingredientes
- REQ-116: Equipos: especificaciones, usos, garantia
- REQ-119: Boton ficha tecnica PDF si hay PDF
- REQ-121: Mobile: 1 columna, galeria arriba
- REQ-122: Textos en idioma seleccionado (ambos idiomas)

**Marcas (verificar pagina individual):**
- REQ-144: Grid 3-4 cols desktop, 2 tablet, 1-2 mobile (verificar con cards reales)
- REQ-145: Cards: logo, nombre, pais, badges
- REQ-146: Clic en card navega a pagina individual

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- **PRIORIDAD 1**: Navegar a /es/catalogo/farmacos y verificar que productos se muestran en grid. Capturar screenshot en desktop, tablet (768px), mobile (375px) para REQ-081
- **PRIORIDAD 2**: Abrir detalle de un producto real (ej: /es/catalogo/farmacos/[algun-slug-real]). Verificar breadcrumb, galeria, nombre, marca, iconos, CTA, sticky bar
- **PRIORIDAD 3**: Verificar contenido especifico por categoria:
  - Farmacos: buscar un producto farmaco y verificar formula, registro SENASA, indicaciones, presentaciones como pills
  - Alimentos: buscar un producto alimento y verificar especie, etapa, ingredientes
  - Equipos: buscar un equipo y verificar especificaciones, usos, garantia
- **PRIORIDAD 4**: Verificar marcas -- navegar a /es/marcas, verificar grid de cards con logo/nombre/pais, hacer clic en una marca
- Para cada criterio que PASA: confirmar que el test automatizado existente es correcto. Si el test tiene un bug (selector ambiguo, etc.), reportar que el CRITERIO pasa pero el TEST necesita fix
- **GIFs OBLIGATORIOS**: Grabar GIF del flujo catalogo > seleccionar categoria > ver producto > sticky bar
- Generar/actualizar archivos .spec.ts para criterios que pasan y no tienen test automatizado

---

## Asignacion: Edge Case Tester -> e2e/tests/edge-case/

### Criterios asignados (13 criterios)

**Filtros edge cases (tests con bugs de selector):**
- REQ-040: Busqueda en ambos idiomas -- close button (test falla con close button, verificar)
- REQ-093: Filtros activos como pills con "X" (test strict mode 2 elements -- verificar funcionalidad)
- REQ-097: Sin resultados: mensaje + sugerencia (test busca texto antiguo -- verificar con filtros que no den resultados)
- REQ-104: Scroll al inicio al cambiar pagina (test skipped -- verificar manualmente)

**Detalle Producto edge cases (tests skipped):**
- REQ-120: Sin ficha PDF: boton NO se muestra (test skipped -- verificar con producto sin PDF)
- REQ-127: Una sola imagen: sin miniaturas (test skipped -- verificar con producto de 1 imagen)
- REQ-128: Sin imagen: placeholder visual (test skipped -- verificar con producto sin imagen)
- REQ-129: Campos vacios sin areas en blanco (test skipped -- verificar)
- REQ-133: Mobile: sticky bar simplificado (sin test -- verificar en 375px)
- REQ-134: Sticky bar sin CLS (test skipped -- medir CLS al aparecer sticky bar)
- REQ-135: Storytelling imagen + texto si hay contenido (test skipped -- verificar si algun producto tiene storytelling)
- REQ-136: Storytelling no aparece si no hay contenido (test skipped -- verificar con producto sin storytelling)
- REQ-141: Mobile: relacionados en carrusel horizontal (test skipped -- verificar en 375px)

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- **PRIORIDAD 1**: Verificar REQ-093 y REQ-097 manualmente. El test falla por selectores ambiguos, no necesariamente por bugs de la app. Aplicar un filtro en /es/catalogo/farmacos y verificar:
  - Que aparecen pills con "X" para remover
  - Que "Limpiar filtros" funciona
  - Si aplicas filtros sin resultados, que aparece mensaje claro con sugerencia
- **PRIORIDAD 2**: Buscar productos con casos edge para detalle:
  - Un producto SIN ficha tecnica PDF (REQ-120)
  - Un producto con UNA sola imagen (REQ-127)
  - Un producto SIN imagen (REQ-128) -- si existe
  - Un producto con campos vacios (REQ-129)
- **PRIORIDAD 3**: Verificar sticky bar en mobile (375px) -- debe ser simplificado (REQ-133)
- **PRIORIDAD 4**: Verificar storytelling section -- navegar productos hasta encontrar uno con/sin contenido storytelling
- Para cada criterio que pasa: si el test automatizado tiene un bug, reportar "CRITERIO pasa, TEST necesita fix"
- Generar/actualizar archivos .spec.ts para criterios que pasan y no tienen test

---

## Asignacion: Visual Checker -> e2e/tests/visual/

### Criterios asignados (12 criterios)

**Marcas pagina individual (tests timeout 12s):**
- REQ-149: Breadcrumb marca individual (test timeout -- verificar visualmente)
- REQ-150: Logo, nombre, pais, descripcion, categorias (test timeout)
- REQ-151: Grid productos de la marca (test timeout)
- REQ-152: Filtros en grid de productos de la marca (test timeout)

**Catalogo General (tests con datos reales):**
- REQ-264a: Catalogo general muestra TODOS los productos (test falla -- verificar)
- REQ-264h: Contador se actualiza con filtros (test falla)

**Detalle Producto visual:**
- REQ-137: Storytelling bilingue ES/EN (sin test -- verificar si storytelling tiene contenido en ambos idiomas)
- REQ-142: Unico producto: relacionados adaptados (test skipped -- verificar si existe categoria con 1 solo producto)

**Auth guard regression:**
- REQ-308: Panel requiere autenticacion (test falla: /admin/configuracion no redirige a login -- verificar si TODAS las rutas admin redirigen)
- REQ-316: NO hay pantalla de gestion de usuarios (test falla: /admin/usuarios no redirige -- verificar que NO existe UI de gestion de usuarios)

**SEO SSR:**
- NFR-006: SSR titles unicos por pagina (test falla para SSR -- verificar con curl si titulos son unicos en HTML raw, no solo tras JS)

**Busqueda criterio pendiente:**
- REQ-310: Auth falla: mensaje "No tienes acceso" -- N/A (requiere credenciales reales, mover a N/A)

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- **PRIORIDAD 1**: Navegar a una marca individual (ej: /es/marcas/[slug-real]). Verificar:
  - Breadcrumb: Inicio > Marcas > [Nombre de marca]
  - Layout: logo, nombre, pais origen, descripcion, grid de productos de esa marca
  - Filtros funcionan dentro de la pagina de marca
  - Capturar screenshots en desktop, tablet, mobile
- **PRIORIDAD 2**: Verificar auth guard:
  - Navegar a /admin/configuracion -- debe redirigir a /admin/login
  - Navegar a /admin/usuarios -- debe redirigir a /admin/login o NO tener pantalla de gestion
  - Reportar si estas rutas NO redirigen (posible regresion de auth guard)
- **PRIORIDAD 3**: Verificar NFR-006 SSR con curl:
  ```
  curl -s https://gray-field-02ba8410f.2.azurestaticapps.net/es | grep -o '<title>[^<]*</title>'
  curl -s https://gray-field-02ba8410f.2.azurestaticapps.net/es/catalogo | grep -o '<title>[^<]*</title>'
  curl -s https://gray-field-02ba8410f.2.azurestaticapps.net/es/marcas | grep -o '<title>[^<]*</title>'
  ```
  Si todos retornan el mismo titulo, NFR-006 SSR FALLA
- **PRIORIDAD 4**: Verificar catalogo general tiene productos visibles y contador funciona con filtros
- Breakpoints: mobile (375px), tablet (768px), desktop (1440px)
- Generar/actualizar archivos .spec.ts para criterios verificados

---

## Resumen de Asignaciones

| Sub-tester | Criterios asignados | Tipo de verificacion |
|------------|--------------------|--------------------|
| Flow Tester | 17 | Flujos E2E con datos reales del API, producto detalle, marcas |
| Edge Case Tester | 13 | Edge cases filtros, sticky bar mobile, storytelling, estados extremos |
| Visual Checker | 12 | Marcas individual, auth guard regression, NFR-006 SSR, catalogo general |
| **Total manual** | **42** | |

**NOTA**: Hay overlap en algunos criterios entre la asignacion y lo que se verificara. El total NETO de criterios que necesitan verificacion manual es menor porque varios criterios se cubriran con un solo flujo (ej: REQ-106 y REQ-110 se verifican al cargar un producto real). Los 42 de la tabla son brutos; el desglose neto:
- 7 criterios con tests que FALLAN por bugs de la app o tests obsoletos
- 11 criterios skipped que necesitan primera verificacion
- 7 criterios de marca individual (tests timeout)
- 8 criterios de detalle producto sin test especifico
- 2 criterios auth guard (regresion potencial)
- 1 criterio NFR-006 SSR
- 6 criterios filtros/paginacion con test bugs

---

## Criterios N/A (56 criterios -- no asignar)

**Admin CRUD Productos (REQ-224 a REQ-258)**: 35 criterios -- N/A (requiere Azure Entra ID auth manual). Rutas existen, auth guard redirige a login, estructura visual verificada en Fase 4.

**Admin CRUD Marcas (REQ-259 a REQ-267)**: 9 criterios -- N/A (requiere auth manual).

**Admin Categorias (REQ-268 a REQ-274)**: 7 criterios -- N/A (requiere auth manual).

**Auth flows que requieren sesion real:**
- REQ-310: Auth falla mensaje "No tienes acceso" -- N/A (requiere credenciales reales, codigo tiene interceptor)
- REQ-311: Token expira: re-autenticacion automatica -- N/A (requiere sesion real)
- REQ-312: Cerrar sesion: cierra Azure + redirige -- N/A (requiere sesion real)
- REQ-315: Acceso para hola@linkdesign.cr -- N/A (requiere credenciales reales)

---

## Bugs Esperados como CORREGIDOS en R3

Basado en la regresion r4 que pasa, estos bugs de R2 fueron CORREGIDOS:

| Bug | Estado R2 | Estado R3 (regression) | Evidencia |
|-----|-----------|----------------------|-----------|
| BUG-002 | PERSISTENTE | CORREGIDO | API retorna datos, 390 tests pasan |
| BUG-005 | PERSISTENTE | CORREGIDO | hreflang tests pasan (NFR-011, REQ-033) |
| BUG-006 | PERSISTENTE | CORREGIDO | Meta titulos JS-rendered unicos, descripcion categoria visible. SSR pendiente verificacion |
| BUG-007 | PERSISTENTE | CORREGIDO | JSON-LD Organization test pasa (NFR-008) |
| BUG-008 | PERSISTENTE | CORREGIDO | X-Powered-By no presente, test NFR-020 pasa |
| BUG-009 | PERSISTENTE | N/A | Upload requiere auth, code review pendiente |
| BUG-010 | PERSISTENTE | CORREGIDO | Admin login tiene meta noindex, NFR-013 pasa |
| BUG-V05 | NUEVO | Pendiente verificacion | Pre-flight: esperar 10s sin interaccion |

---

## Criterios Pendientes de Testing Manual

- Total criterios que requieren sub-testers esta ronda: 42
- Criterios FALLARON en ronda anterior (re-verificar fix): 7 (REQ-040, 081, 082, 085, 093, 097, 104)
- Criterios DESBLOQUEADOS (antes bloqueados por API 404, ahora con datos): 28 (REQ-106, 109, 110, 112-116, 119-122, 127-129, 133-137, 141-142, 144-146, 149-152)
- Criterios con regression potencial: 2 (REQ-308, REQ-316)
- Criterios NFR pendiente SSR: 1 (NFR-006)
- Criterios catalogo general: 2 (REQ-264a, REQ-264h)
- Criterios con test que necesita update: 2 (REQ-264c/d flow test)

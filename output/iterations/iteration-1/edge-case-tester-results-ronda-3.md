# Resultados -- Edge Case Tester

## Pre-Flight Results

| Check | Resultado | Detalle |
|-------|-----------|---------|
| API funciona | PASA | `GET /api/public/products` retorna `{"data":[],"total":0,"page":1,"limit":24,"totalPages":0}` (JSON valido, status 200) |
| Productos cargan en catalogo | FALLA | /es/catalogo/farmacos muestra "0 productos" y "No hay productos disponibles actualmente". La API retorna 0 productos. |
| Marcas cargan | FALLA | /es/marcas muestra solo header y footer. `GET /api/public/brands` retorna `[]` (array vacio). |
| Search funciona | FALLA | Search overlay abre, pero `GET /api/public/search?q=amoxicilina` retorna `{"products":[],"brands":[]}`. No hay datos. |
| SPA estable | FALLA | La pagina AUTO-NAVEGA entre rutas sin interaccion del usuario. Observado: /es/catalogo/farmacos navega automaticamente a /es/catalogo o /es/marcas tras unos segundos. BUG-V05 CONFIRMADO PERSISTENTE. |
| Categories en API | PASA | `GET /api/public/categories` retorna 3 categorias (farmacos, alimentos, equipos) con datos seed completos. |

**CONCLUSION PRE-FLIGHT**: La API funciona correctamente (retorna JSON, status 200), pero la base de datos tiene 0 productos y 0 marcas. Solo las categorias estan seeded. Esto bloquea 9 de 13 criterios asignados que requieren datos de producto. BUG-V05 (auto-navegacion SPA) persiste e interfiere con la interaccion manual.

## Resultados por Criterio

| Criterio | Estado | Input/Condicion | Evidencia |
|----------|--------|-----------------|-----------|
| REQ-040 | PASA | Close button cierra overlay de busqueda en ES y EN | Screenshot: edge-case-r3-search-close-es.png. Overlay se cierra, contenido visible tras cerrar. En EN: placeholder "Search products, brands...", hint "Type at least 3 characters" traducidos. Aria-label del boton NO traducido ("Buscar productos y marcas" en EN) pero funcionalidad OK. |
| REQ-093 | PASA | Filtro species=Caninos aplicado via URL muestra pill "Caninos" con X + "Limpiar filtros" | Screenshot: edge-case-r3-filter-pill-caninos.png. Pill visible con X para remover, boton "Limpiar filtros" inline y en empty state. |
| REQ-097 | PASA | Filtros sin resultados muestran "No se encontraron productos con estos filtros" + boton "Limpiar filtros" como sugerencia | Screenshot: edge-case-r3-filter-pill-caninos.png. Mensaje claro y CTA para limpiar filtros visible. Sin filtros: "No hay productos disponibles actualmente". |
| REQ-104 | FALLA | Scroll al inicio al cambiar pagina -- no hay paginacion (0 productos) | No existe paginacion porque la base de datos tiene 0 productos. No se puede verificar comportamiento de scroll. La API retorna `totalPages: 0`. |
| REQ-120 | FALLA | Sin ficha PDF: boton NO se muestra -- no hay productos en DB | Base de datos tiene 0 productos. No se puede navegar a detalle de producto para verificar presencia/ausencia de boton PDF. Product-by-slug endpoint existe (`/api/public/products/by-slug/:slug`) pero retorna `{"error":"Product not found"}` para cualquier slug. |
| REQ-127 | FALLA | Una sola imagen: sin miniaturas -- no hay productos en DB | 0 productos en base de datos. No se puede acceder a detalle de producto. La pagina de producto no existente muestra error state correcto ("Este producto no esta disponible"). |
| REQ-128 | FALLA | Sin imagen: placeholder visual -- no hay productos en DB | 0 productos. El error state de producto inexistente muestra un placeholder circular gris con icono, titulo "Este producto no esta disponible", descripcion "El producto que buscas no existe o fue removido del catalogo" y boton "Volver al catalogo". Screenshot: edge-case-r3-product-not-found.png. Pero esto verifica el 404 error, no el edge case de un producto existente sin imagen. |
| REQ-129 | FALLA | Campos vacios sin areas en blanco -- no hay productos en DB | 0 productos. No se puede verificar layout de producto con campos vacios. |
| REQ-133 | FALLA | Mobile: sticky bar simplificado -- no hay productos en DB | 0 productos. Sin producto cargado no hay sticky bar para verificar en mobile (375px). |
| REQ-134 | FALLA | Sticky bar sin CLS -- no hay productos en DB | 0 productos. No hay sticky bar para medir CLS. |
| REQ-135 | FALLA | Storytelling imagen + texto si hay contenido -- no hay productos en DB | 0 productos. No se puede verificar si storytelling se renderiza con contenido. |
| REQ-136 | FALLA | Storytelling no aparece si no hay contenido -- no hay productos en DB | 0 productos. No se puede verificar ausencia de storytelling en producto sin contenido. |
| REQ-141 | FALLA | Mobile: relacionados en carrusel horizontal -- no hay productos en DB | 0 productos. No hay seccion de relacionados para verificar en mobile. |

## Bugs Encontrados

BUG-E01 (PERSISTENTE R1/R2/R3 -- EVOLUCIONADO):
- Criterio: REQ-104, REQ-120, REQ-127, REQ-128, REQ-129, REQ-133, REQ-134, REQ-135, REQ-136, REQ-141
- Tipo: edge-case / datos
- Input/Condicion: Base de datos vacia -- 0 productos, 0 marcas
- Pasos: 1. GET https://hesa-api.azurewebsites.net/api/public/products => {"data":[],"total":0}. 2. GET /api/public/brands => []. 3. GET /api/public/categories => 3 categorias con datos seed.
- Esperado: La base de datos debe tener productos y marcas para que el sitio funcione (catalogo, detalle, marcas, busqueda)
- Actual: La API responde correctamente (status 200, JSON valido), las rutas estan registradas, las categorias tienen datos seed, pero products y brands estan vacios. Express y MongoDB estan conectados pero la coleccion de productos esta vacia.
- Severidad: alta (CRITICA -- bloquea 9 de 13 criterios edge-case, bloquea funcionalidad principal del sitio)
- Impacto de seguridad: no
- Evidencia: curl responses muestran data vacia. Screenshots del catalogo muestran "0 productos" y "No hay productos disponibles actualmente".

BUG-E02 (PERSISTENTE R1/R2 -- CONFIRMADO R3):
- Criterio: REQ-040 (parcial)
- Tipo: edge-case / i18n
- Input/Condicion: Aria-labels de busqueda NO traducidos en EN
- Pasos: 1. Navegar a /en. 2. Inspeccionar boton de busqueda. 3. Observar aria-label.
- Esperado: Boton deberia decir "Search products and brands" en EN, close button "Close search"
- Actual: Boton dice "Buscar productos y marcas" en EN. Close button dice "Cerrar busqueda" en EN. Los placeholders SI estan traducidos (Search products, brands... / Type at least 3 characters).
- Severidad: baja (funcionalidad OK, solo impacta accesibilidad en screenreaders para usuarios EN)
- Impacto de seguridad: no
- Evidencia: Snapshot de /en muestra `button "Buscar productos y marcas"` en pagina inglesa.

BUG-V05 (CONFIRMADO PERSISTENTE R3):
- Criterio: Afecta testing de todos los criterios
- Tipo: edge-case / SPA routing
- Input/Condicion: La SPA auto-navega entre paginas sin interaccion del usuario
- Pasos: 1. Navegar a /es/catalogo/farmacos. 2. Esperar 3-5 segundos sin interactuar. 3. Observar que la URL cambia a /es/catalogo o /es/marcas.
- Esperado: La pagina debe permanecer estable en la URL cargada
- Actual: La pagina se auto-navega a otras rutas (observado: /es/catalogo/farmacos -> /es/catalogo, /es/catalogo -> /es/marcas, etc.)
- Severidad: alta (interfiere con la experiencia del usuario y con testing automatizado)
- Impacto de seguridad: no
- Evidencia: Observado durante testing manual -- la URL cambia sin clicks.

BUG-E03 (NUEVO R3):
- Criterio: REQ-040
- Tipo: edge-case / navegacion
- Input/Condicion: Abrir search overlay en pagina EN navega a pagina ES
- Pasos: 1. Navegar a /en. 2. Click en boton de busqueda. 3. Observar URL.
- Esperado: Search overlay se abre sin cambiar la pagina actual
- Actual: Al hacer clic en el boton de busqueda en /en, la URL cambia a una pagina en ES (/es/catalogo/farmacos). El search overlay se abre pero en contexto ES, no EN.
- Severidad: media (el usuario pierde su contexto de idioma al abrir la busqueda)
- Impacto de seguridad: no
- Evidencia: Observado durante testing: clic en search en /en -> URL cambia a /es/catalogo/farmacos.

## Bugs Corregidos (verificados en esta ronda)

| Bug | Estado R2 | Estado R3 | Detalle |
|-----|-----------|-----------|---------|
| BUG-E01 (API routes 404) | PERSISTENTE | CORREGIDO (parcial) | Las rutas API ahora estan registradas. GET /api/public/products retorna JSON valido (no 404). Pero la base de datos esta vacia (0 productos, 0 marcas). El bug evoluciono de "rutas no registradas" a "datos ausentes". |

## Tests Generados
- e2e/tests/edge-case/REQ-040-search-close-button.spec.ts (NUEVO R3)
- e2e/tests/edge-case/REQ-093-filter-pills-with-x.spec.ts (NUEVO R3)
- e2e/tests/edge-case/REQ-097-no-results-suggestion.spec.ts (NUEVO R3)

## Resumen de Estados
- **PASA**: 3 criterios (REQ-040, REQ-093, REQ-097)
- **FALLA**: 10 criterios (REQ-104, REQ-120, REQ-127, REQ-128, REQ-129, REQ-133, REQ-134, REQ-135, REQ-136, REQ-141)
- **BLOQUEADO**: 0 criterios

**Nota**: Los 10 criterios que FALLAN lo hacen por una unica razon: la base de datos tiene 0 productos. La API funciona correctamente (JSON, status 200), las categorias tienen datos seed, pero no hay productos ni marcas. Esto impide verificar: detalle de producto (sticky bar, galeria, storytelling, PDF, campos vacios), paginacion, y productos relacionados en mobile.

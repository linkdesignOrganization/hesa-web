# Resultados -- Flow Tester (Ronda 2)

## Pre-flight Status
1. **BUG-001 (FIXED R1)**: API URL apunta a produccion -- VERIFICADO OK. Console muestra llamadas a `https://hesa-api.azurewebsites.net/api/public/...`
2. **BUG-002 (FIXED R2)**: `GET /api/products` retorna 404 "Cannot GET /api/products" -- FALLA. El backend Express responde pero no tiene rutas configuradas. Las rutas usadas por el frontend son `/api/public/products`, `/api/public/brands`, `/api/public/search`, `/api/public/products/filters`, todas retornan 404.
3. **BUG-003**: `GET /sitemap.xml` retorna contenido vacio. El robots.txt referencia `https://hesa-api.azurewebsites.net/api/public/sitemap.xml` que tambien retorna 404.
4. **BUG-004**: `GET /robots.txt` retorna texto plano correcto con User-agent, Allow, Disallow /admin/, Sitemap -- VERIFICADO OK.
5. **BUG-008**: Header `X-Powered-By: Express` SIGUE apareciendo en responses del API -- FALLA.
6. **BUG-012**: Producto inexistente (`/es/catalogo/farmacos/producto-inexistente-xyz`) muestra error state "Este producto no esta disponible" con boton "Volver al catalogo" -- VERIFICADO OK, FIXED.
7. **Auth bypass**: `/admin/productos` redirige a `/admin/login` -- No se puede acceder al panel sin autenticacion.

### Resultado Pre-flight: 4 de 7 verificaciones pasaron. BUG-002 (API 404) es CRITICO y bloquea todos los criterios que requieren datos del backend.

---

## Mejoras Confirmadas desde R1

1. **BUG-001 FIXED**: Frontend ya NO apunta a localhost:3000. Las llamadas API van a `https://hesa-api.azurewebsites.net/api/public/...`
2. **BUG-011 FIXED**: Errores en paginas EN aparecen en ingles ("We could not load the products", "Could not load brands", "Retry", etc.)
3. **BUG-012 FIXED**: Producto inexistente muestra "Este producto no esta disponible" con icono 404 y boton "Volver al catalogo". No redirige a /es/catalogo.
4. **BUG-013 FIXED**: `/en/brands` se mantiene en ingles con breadcrumb "Home > Brands", titulo "Our Brands", error "Could not load brands". No redirige a /es.

---

## Resultados por Criterio

### Busqueda Global (REQ-035 a REQ-041)
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| REQ-035 | FALLA | API retorna 404 en `/api/public/search?q=amox&lang=es&limit=5`. El overlay de busqueda abre correctamente, el textbox funciona, la llamada API se hace a la URL de produccion correcta, pero no hay respuesta de datos. No se pueden encontrar productos. Screenshot: search-amox-r2.png |
| REQ-036 | FALLA | El mecanismo de busqueda predictiva funciona correctamente: se dispara con 3+ chars, muestra hint "Escribe al menos 3 caracteres" con menos de 3. Pero la API no responde, asi que no se muestran resultados predictivos reales. |
| REQ-037 | FALLA | No se pueden verificar resultados agrupados por tipo porque la API retorna 404. |
| REQ-038 | FALLA | No hay resultados para hacer clic. |
| REQ-039 | FALLA | El estado "sin resultados" se muestra siempre porque la API falla. UI correcta: "No se encontraron productos para [termino]" + "Intenta con otro termino o explora el catalogo completo" + link "Explorar catalogo completo". Pero no se puede distinguir entre "sin resultados reales" y "API caida". |
| REQ-040 | FALLA | La busqueda i18n funciona correctamente: ES muestra "Buscar productos, marcas..." / "Escribe al menos 3 caracteres"; EN muestra "Search products, brands..." / "Type at least 3 characters". Pero sin API funcional no se puede verificar la busqueda en ambos idiomas con datos reales. |
| REQ-041 | FALLA | No verificable sin API funcional. |

### Catalogo Publico -- Flujo por Categoria (REQ-078 a REQ-087)
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| REQ-078 | FALLA | Breadcrumb "Inicio > Catalogo" funciona en catalogo general. Pero las paginas de categoria (`/es/catalogo/farmacos`, `/es/catalogo/alimentos`, `/es/catalogo/equipos`) no muestran breadcrumb de categoria ya que el contenido no renderiza por API caida. La pagina de detalle de producto muestra error state (BUG-012 fixed) pero sin breadcrumb "Inicio > Catalogo > [Cat] > [Producto]". |
| REQ-079 | FALLA | "Catalogo de Productos" titulo visible con "0 productos" en catalogo general. Las paginas de categoria no cargan contenido completo por API caida. |
| REQ-080 | FALLA | No se observa descripcion corta de categoria. Solo aparece titulo + contador + filtros + error state. BUG-006 no corregido. |
| REQ-081 | FALLA | No hay productos visibles para verificar grid 3 cols desktop / 2 tablet / 1-2 mobile. |
| REQ-082 | FALLA | No hay cards de productos visibles (API caida). |
| REQ-083 | FALLA | No hay cards visibles para verificar que NO muestran precio/inventario. |
| REQ-084 | FALLA | No hay cards para hacer clic y navegar a detalle. |
| REQ-085 | FALLA | No se puede distinguir "estado vacio" de "error de carga". El estado actual muestra "No pudimos cargar los productos" con boton "Reintentar" (error state), no un empty state real. |
| REQ-086 | FALLA | Las URLs semanticas funcionan (/es/catalogo/farmacos, /es/catalogo/alimentos, /es/catalogo/equipos) pero las paginas no muestran contenido completo por API caida. |
| REQ-087 | FALLA | Meta titulo "Catalogo de Productos | HESA - Herrera y Elizondo S.A." correcto. Meta titulos por categoria no verificables porque las paginas de categoria no renderizan completamente. |

### Catalogo General (REQ-264a a REQ-264j)
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| REQ-264a | FALLA | Catalogo general en /es/catalogo carga con estructura correcta (breadcrumb, titulo, filtros) pero muestra "0 productos" y error state "No pudimos cargar los productos" porque API retorna 404. |
| REQ-264b | FALLA | El filtro de "Categoria" existe con opciones Farmacos, Alimentos, Equipos. Funciona mecanicamente (al seleccionar, actualiza URL query params). Pero no se puede verificar el filtrado real porque no hay productos. |
| REQ-264c | FALLA | Filtros SE adaptan por categoria: al seleccionar Farmacos aparece "Familia" con opciones (Antibioticos, Desparasitantes, Vitaminas, Analgosicos, Antiinflamatorios). Especie tiene valores hardcodeados. Marca no carga opciones (depende de API). Sin datos para verificar filtrado real. |
| REQ-264d | FALLA | Los filtros secundarios SI se adaptan dinamicamente: Farmacos agrega "Familia", Alimentos "Etapa de vida", Equipos "Tipo". Pero Marca no carga opciones de API. Sin datos para interseccion. |
| REQ-264e | FALLA | Breadcrumb "Inicio > Catalogo" correcto en ES. "Home > Catalog" en EN. Pero falla porque la pagina no muestra productos. |
| REQ-264f | FALLA | Meta titulo "Catalogo de Productos | HESA - Herrera y Elizondo S.A." correcto. EN: "Product Catalog | HESA - Herrera y Elizondo S.A." correcto. Pero falla por dependencia con API para contenido completo. |
| REQ-264g | FALLA | Link "Catalogo" en header enlaza a /es/catalogo. EN: "Catalog" enlaza a /en/catalog. Correcto. Pero la pagina no puede mostrar productos. |
| REQ-264h | FALLA | Contador visible mostrando "0 productos" / "0 products". No se puede verificar actualizacion con filtros porque no hay productos reales. |
| REQ-264i | FALLA | No hay productos para verificar paginacion de 24 por pagina. |
| REQ-264j | FALLA | Mobile: filtros colapsados en boton "Filtrar" -- verificado correcto. Desktop: filtros como dropdowns visibles -- verificado correcto. Pero no hay productos para verificar grid 1-2 cols mobile. |

### Detalle de Producto -- Flujo E2E (REQ-106 a REQ-142)
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| REQ-106 | FALLA | Producto inexistente muestra error state (BUG-012 FIXED). Pero como API retorna 404 para TODOS los productos (incluyendo existentes), no se puede verificar breadcrumb de producto real. |
| REQ-107 | FALLA | No se puede cargar detalle de ningun producto (API 404). |
| REQ-108 | FALLA | No se puede cargar detalle (API 404). |
| REQ-110 | FALLA | No se puede cargar detalle (API 404). |
| REQ-111 | FALLA | No se puede cargar detalle (API 404). |
| REQ-112 | FALLA | No se puede cargar detalle (API 404). |
| REQ-113 | FALLA | No se puede cargar detalle (API 404). |
| REQ-114 | FALLA | No se puede cargar detalle (API 404). |
| REQ-115 | FALLA | No se puede cargar detalle (API 404). |
| REQ-116 | FALLA | No se puede cargar detalle (API 404). |
| REQ-117 | FALLA | No se puede cargar detalle (API 404). |
| REQ-118 | FALLA | No se puede cargar detalle (API 404). |
| REQ-119 | FALLA | No se puede cargar detalle (API 404). |
| REQ-121 | FALLA | No se puede cargar detalle (API 404). |
| REQ-122 | FALLA | No se puede cargar detalle (API 404). |
| REQ-123 | FALLA | No se puede cargar detalle (API 404). |
| REQ-130 | FALLA | No se puede cargar detalle (API 404). |
| REQ-131 | FALLA | No se puede cargar detalle (API 404). |
| REQ-132 | FALLA | No se puede cargar detalle (API 404). |
| REQ-133 | FALLA | No se puede cargar detalle (API 404). |
| REQ-138 | FALLA | No se puede cargar detalle (API 404). |
| REQ-139 | FALLA | No se puede cargar detalle (API 404). |
| REQ-140 | FALLA | No se puede cargar detalle (API 404). |

### Marcas (REQ-143 a REQ-154)
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| REQ-143 | FALLA | Titulo "Nuestras Marcas" y parrafo introductorio son visibles y correctos. Breadcrumb "Inicio > Marcas" presente. Pero no hay cards de marcas (API 404). Screenshot: marcas-r2.png |
| REQ-144 | FALLA | No hay cards de marcas para verificar grid. |
| REQ-145 | FALLA | No hay cards de marcas visibles. |
| REQ-146 | FALLA | No hay cards para hacer clic. |
| REQ-147 | FALLA | Meta titulo "Marcas | HESA - Herrera y Elizondo S.A." es correcto. EN: "Brands | HESA - Herrera y Elizondo S.A." correcto. Pero falla porque la pagina no muestra contenido de marcas. |
| REQ-148 | FALLA | ES: "Nuestras Marcas" correcto. EN: "Our Brands" correcto (BUG-013 FIXED, ya no redirige a /es). Pero sin marcas cargadas no se puede verificar i18n completo del contenido. |
| REQ-149 | FALLA | No se puede cargar marca individual (API 404). |
| REQ-150 | FALLA | No se puede cargar marca individual (API 404). |
| REQ-151 | FALLA | No se puede cargar marca individual (API 404). |
| REQ-152 | FALLA | No se puede cargar marca individual (API 404). |
| REQ-153 | FALLA | No verificable sin datos. |
| REQ-154 | FALLA | No verificable sin datos reales. |

### Filtros con Datos Reales (REQ-095)
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| REQ-095 | FALLA | No hay datos reales para verificar combinacion de multiples filtros. Los filtros adaptativos funcionan mecanicamente (Farmacos agrega Familia, Alimentos agrega Etapa, Equipos agrega Tipo) y los filter pills con X aparecen, pero sin productos el filtrado no puede verificarse. |

---

## Resumen
- **Total criterios:** 62
- **PASA:** 0
- **FALLA:** 62
- **BLOQUEADO:** 0

**CAUSA RAIZ**: El API backend en `https://hesa-api.azurewebsites.net` tiene Express corriendo pero TODAS las rutas retornan 404. Las rutas que el frontend llama (`/api/public/products`, `/api/public/brands`, `/api/public/search`, `/api/public/products/filters`, `/api/public/categories`, `/api/public/products/by-slug/[slug]`) no existen en el backend desplegado. El backend muestra la pagina de bienvenida de Azure App Service en `/` y Express error pages en `/api/*`.

---

## Bugs Encontrados

BUG-F01 (PERSISTENTE DE R1, RENUMERADO):
- Criterio: TODOS (REQ-035 a REQ-154)
- Pasos: 1. Navegar a cualquier pagina que carga datos del API. 2. Observar la consola del browser.
- Esperado: Las llamadas API retornan datos JSON con productos, marcas, filtros.
- Actual: TODAS las llamadas API retornan 404 "Cannot GET /api/public/..." El Express responde pero no tiene rutas registradas.
- Severidad: alta (CRITICA - bloquea 62/62 criterios)
- Evidencia: preflight-catalogo-r2.png, catalog-english-r2.png, marcas-r2.png
- Nota: Mejora desde R1: El frontend ahora SI llama a la URL de produccion correcta (BUG-001 FIXED). El problema es que el backend no tiene rutas funcionales.

BUG-F02:
- Criterio: REQ-080
- Pasos: 1. Navegar a /es/catalogo/farmacos (o cualquier categoria).
- Esperado: Descripcion corta de categoria visible debajo del titulo.
- Actual: No se muestra descripcion de categoria. Solo titulo + contador + filtros + error state.
- Severidad: baja
- Evidencia: catalogo-farmacos-filter-r2.png
- Nota: Persistente desde R1 (era BUG-F06). BUG-006 no corregido.

BUG-F03:
- Criterio: REQ-085
- Pasos: 1. Navegar a /es/catalogo. 2. API falla (como actualmente).
- Esperado: Error state claro diferenciado de empty state.
- Actual: Muestra "No pudimos cargar los productos" + "Intenta de nuevo" + "Reintentar". Esto es un error state correcto para API caida. Sin embargo, no se puede verificar el empty state real (cuando la categoria SI carga pero no tiene productos) porque la API nunca responde.
- Severidad: media
- Evidencia: preflight-catalogo-r2.png

---

## Tests Generados
- e2e/tests/flow/REQ-035-041-search-global.spec.ts (actualizado R2)
- e2e/tests/flow/REQ-078-087-catalogo-publico.spec.ts (actualizado R2)
- e2e/tests/flow/REQ-264a-264j-catalogo-general.spec.ts (actualizado R2)
- e2e/tests/flow/REQ-106-142-detalle-producto.spec.ts (actualizado R2)
- e2e/tests/flow/REQ-143-154-marcas.spec.ts (actualizado R2)
- e2e/tests/flow/REQ-095-filtros-combinados.spec.ts (nuevo)

Nota: Como TODOS los 62 criterios son FALLA, los tests estan escritos para verificar el estado actual y fallar cuando se encuentre el bug de API. Los tests estan disenados para PASAR automaticamente cuando la API este funcional.

---

## GIFs de Flujos
No se pudieron grabar GIFs de flujos completos E2E porque NINGUN flujo es completable sin datos del API. Los 5 flujos obligatorios requieren productos/marcas reales:
1. Catalogo con datos -> Filtrar -> Paginar -> Producto -> Detalle: BLOQUEADO (0 productos)
2. Busqueda predictiva -> Resultados -> Clic -> Detalle: BLOQUEADO (API search 404)
3. Marcas listado -> Marca individual -> Productos: BLOQUEADO (0 marcas)
4. Sticky bar en detalle: BLOQUEADO (detalle no carga)
5. Cambio idioma ES/EN con datos: BLOQUEADO (no hay datos)

Screenshots capturados:
- preflight-product-not-found.png (error state producto inexistente - BUG-012 FIXED)
- preflight-catalogo-r2.png (catalogo general con error state)
- catalogo-farmacos-r2.png (pagina categoria - redirige a admin login)
- catalogo-alimentos-r2.png (pagina categoria - redirige a admin login)
- catalogo-farmacos-filter-r2.png (filtros adaptativos funcionando)
- catalog-english-r2.png (catalogo EN con error en ingles - BUG-011 FIXED)
- marcas-r2.png (marcas con error state)
- search-amox-r2.png (busqueda sin resultados por API)

# Resultados -- Flow Tester

## Pre-flight Status
- Deep link `/es/catalogo`: CARGA (con error de API - muestra error state)
- Deep link `/es/catalogo/farmacos`: CARGA (con error de API)
- Deep link `/es/marcas`: CARGA (con error de API)
- Deep link `/es/catalogo/farmacos/amoxicilina-250ml`: FALLA - redirige a `/es/catalogo`
- API `https://hesa-api.azurewebsites.net/api/products`: FALLA - retorna 404 (Azure default welcome page)
- API `https://hesa-api.azurewebsites.net/api/brands`: FALLA - retorna 404

### BUG CRITICO IDENTIFICADO
**El frontend desplegado esta compilado con la configuracion de DESARROLLO** (`environment.ts`) en vez de la de produccion (`environment.prod.ts`). El API URL apunta a `http://localhost:3000/api` en vez de `https://hesa-api.azurewebsites.net/api`. Esto hace que TODAS las llamadas al API fallen con "No se pudo conectar con el servidor". Adicionalmente, el API backend en `https://hesa-api.azurewebsites.net` muestra la pagina de bienvenida de Azure App Service, indicando que el backend NO esta desplegado correctamente.

Archivos relevantes:
- `src/environments/environment.ts` (dev): `apiUrl: 'http://localhost:3000/api'` <-- ESTA EN USO
- `src/environments/environment.prod.ts` (prod): `apiUrl: 'https://hesa-api.azurewebsites.net/api'` <-- DEBERIA USARSE

Consola del browser muestra: `[ERROR] Connecting to 'http://localhost:3000/api/p...'`

---

## Resultados por Criterio

### Busqueda Global (REQ-035 a REQ-041)
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| REQ-035 | FALLA | API apunta a localhost; busqueda no puede encontrar productos. El overlay de busqueda abre correctamente, el textbox aparece, pero la llamada al API falla. Screenshot: search-no-results.png |
| REQ-036 | FALLA | El mecanismo de busqueda predictiva EXISTE (se dispara con 3+ chars, muestra hint "Escribe al menos 3 caracteres") pero falla al conectar con API. La UI del minimo 3 caracteres funciona correctamente. |
| REQ-037 | FALLA | No se pueden verificar resultados agrupados por tipo porque la API no responde. |
| REQ-038 | FALLA | No se pueden verificar clics en resultados porque no hay resultados. |
| REQ-039 | FALLA | El estado "sin resultados" se muestra SIEMPRE (por API caida), no solo cuando no hay resultados reales. El mensaje dice "No se encontraron productos para [termino]" con sugerencia "Intenta con otro termino o explora el catalogo completo" y link "Explorar catalogo completo". La UI del estado sin resultados esta implementada correctamente pero no se puede verificar el flujo real. |
| REQ-040 | FALLA | La busqueda cambia idioma correctamente: ES muestra "Buscar productos, marcas..." / "Escribe al menos 3 caracteres"; EN muestra "Search products, brands..." / "Type at least 3 characters". Pero la funcionalidad no puede verificarse sin API. |
| REQ-041 | FALLA | No se puede verificar tolerancia a errores tipograficos sin API funcional. |

### Catalogo Publico - Flujo Principal (REQ-078 a REQ-087)
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| REQ-078 | FALLA | Breadcrumb esta implementado correctamente: Inicio > Catalogo > [Categoria]. Funciona en Farmacos (Inicio > Catalogo > Farmacos), Alimentos (Inicio > Catalogo > Alimentos), Equipos (Inicio > Catalogo > Equipos). Los links de breadcrumb son correctos. PERO: no se puede verificar el breadcrumb de producto detalle (Inicio > Catalogo > [Cat] > [Producto]) porque la pagina de detalle redirige al catalogo cuando API falla. |
| REQ-079 | FALLA | Titulo de categoria visible (ej: "Farmacos", "Alimentos", "Equipos") + contador "0 productos". El contador siempre muestra 0 porque API no carga. No se puede verificar que el contador muestre numeros reales. |
| REQ-080 | FALLA | No se observa descripcion corta de categoria en las paginas de categoria. Solo muestra titulo + contador + filtros + error state. |
| REQ-081 | FALLA | No se puede verificar grid de 3 cols desktop / 2 tablet / 1-2 mobile porque no hay productos cargados para formar un grid. |
| REQ-082 | FALLA | No hay cards de productos visibles (API caida). No se pueden verificar imagen, nombre, marca, iconos. |
| REQ-083 | FALLA | No hay cards visibles para verificar que NO muestran precio/inventario/disponibilidad. La pagina de home muestra cards de productos destacados que NO muestran precio (verificado), pero en catalogo no hay cards. |
| REQ-084 | FALLA | No hay cards en catalogo para hacer clic. Los links de productos destacados en home SI apuntan a URLs correctas (ej: /es/catalogo/farmacos/amoxicilina-250ml), pero la pagina de detalle redirige al catalogo. |
| REQ-085 | FALLA | No se puede distinguir entre "estado vacio" real y "error de carga" porque la API siempre falla. El error state actual muestra "No pudimos cargar los productos" con boton "Reintentar", que es un error state, no un empty state. |
| REQ-086 | FALLA | URLs semanticas funcionan correctamente: /es/catalogo/farmacos, /es/catalogo/alimentos, /es/catalogo/equipos. Las rutas resuelven a las paginas correctas. PERO: falla porque la pagina no puede mostrar productos (API). El routing funciona, el contenido no. |
| REQ-087 | FALLA | Meta titulos son unicos y correctos: "Farmacos | HESA - Herrera y Elizondo S.A.", "Alimentos | HESA - Herrera y Elizondo S.A.", "Equipos | HESA - Herrera y Elizondo S.A.". PERO: No se puede verificar meta description porque el contenido no carga. Los titulos SI son distintos por categoria. |

### Catalogo General (REQ-264a a REQ-264j)
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| REQ-264a | FALLA | Catalogo general en /es/catalogo carga correctamente pero muestra "0 productos" porque API falla. No se puede verificar que muestra TODOS los productos. |
| REQ-264b | FALLA | El filtro de "Categoria" SI existe en catalogo general con opciones Farmacos, Alimentos, Equipos. La UI esta correcta. PERO: no se puede verificar que filtra correctamente porque no hay productos. |
| REQ-264c | FALLA | Filtros se adaptan por categoria: Farmacos tiene Marca/Especie/Familia; Alimentos tiene Marca/Especie/Etapa de vida; Equipos tiene Marca/Tipo. La UI de filtros es correcta. PERO: los valores de Marca no cargan (combobox solo muestra "Marca" sin opciones) porque depende de API. Especie SI tiene valores hardcodeados (Caninos, Felinos, Bovinos, etc). |
| REQ-264d | FALLA | No se puede verificar adaptacion dinamica de filtros secundarios porque la API no carga valores. |
| REQ-264e | FALLA | Breadcrumb "Inicio > Catalogo" es correcto en catalogo general. EN: "Home > Catalog". Funciona bien. PERO: como el criterio padre (264a) falla por API, este tambien falla. |
| REQ-264f | FALLA | Meta titulo "Catalogo de Productos | HESA - Herrera y Elizondo S.A." es correcto y SEO-friendly. EN: "Product Catalog | HESA - Herrera y Elizondo S.A.". PERO: falla por dependencia con API. |
| REQ-264g | FALLA | Link "Catalogo" en header SI enlaza a /es/catalogo (pagina general). EN: "Catalog" enlaza a /en/catalog. CORRECTO. PERO: la pagina no puede mostrar productos. |
| REQ-264h | FALLA | Contador visible mostrando "0 productos". No se puede verificar actualizacion con filtros porque no hay productos. |
| REQ-264i | FALLA | No se puede verificar paginacion de 24 productos por pagina sin productos cargados. |
| REQ-264j | FALLA | Mobile: filtros colapsados en boton "Filtrar" -- CORRECTO. Desktop: filtros como dropdowns visibles -- CORRECTO. La UI responsive de filtros funciona. PERO: no hay productos para verificar grid 1-2 cols. |

### Detalle de Producto - Flujo E2E (REQ-106 a REQ-142)
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| REQ-106 | FALLA | Pagina de detalle redirige a /es/catalogo cuando API falla. No se puede verificar breadcrumb. |
| REQ-107 | FALLA | Pagina de detalle no carga (redirige). |
| REQ-108 | FALLA | Pagina de detalle no carga (redirige). |
| REQ-110 | FALLA | Pagina de detalle no carga (redirige). |
| REQ-111 | FALLA | Pagina de detalle no carga (redirige). |
| REQ-112 | FALLA | Pagina de detalle no carga (redirige). |
| REQ-113 | FALLA | Pagina de detalle no carga (redirige). |
| REQ-114 | FALLA | Pagina de detalle no carga (redirige). |
| REQ-115 | FALLA | Pagina de detalle no carga (redirige). |
| REQ-116 | FALLA | Pagina de detalle no carga (redirige). |
| REQ-117 | FALLA | Pagina de detalle no carga (redirige). |
| REQ-118 | FALLA | Pagina de detalle no carga (redirige). |
| REQ-119 | FALLA | Pagina de detalle no carga (redirige). |
| REQ-121 | FALLA | Pagina de detalle no carga (redirige). |
| REQ-122 | FALLA | Pagina de detalle no carga (redirige). |
| REQ-123 | FALLA | Pagina de detalle no carga (redirige). |
| REQ-130 | FALLA | Pagina de detalle no carga (redirige). |
| REQ-131 | FALLA | Pagina de detalle no carga (redirige). |
| REQ-132 | FALLA | Pagina de detalle no carga (redirige). |
| REQ-133 | FALLA | Pagina de detalle no carga (redirige). |
| REQ-138 | FALLA | Pagina de detalle no carga (redirige). |
| REQ-139 | FALLA | Pagina de detalle no carga (redirige). |
| REQ-140 | FALLA | Pagina de detalle no carga (redirige). |

### Marcas - Flujo E2E (REQ-143 a REQ-154)
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| REQ-143 | FALLA | Titulo "Nuestras Marcas" y parrafo introductorio son visibles y correctos. Texto: "Distribuimos exclusivamente las mejores marcas internacionales de la industria veterinaria. Cada marca ha sido cuidadosamente seleccionada por su calidad, respaldo cientifico y trayectoria." PERO: no se cargan las cards de marcas (API falla). Screenshot: preflight-marcas-desktop.png |
| REQ-144 | FALLA | No se puede verificar grid de cards porque no hay marcas cargadas. |
| REQ-145 | FALLA | No hay cards de marcas visibles para verificar logo, nombre, pais, badges. |
| REQ-146 | FALLA | No hay cards para hacer clic y navegar a pagina individual. |
| REQ-147 | FALLA | No se puede verificar meta titulo/descripcion porque la pagina no carga contenido. El titulo del tab no muestra datos de marcas. |
| REQ-148 | FALLA | El titulo y parrafo introductorio SI estan en espanol. PERO: sin marcas cargadas no se puede verificar i18n completo. |
| REQ-149 | FALLA | No se puede verificar breadcrumb de marca individual porque la pagina no carga. |
| REQ-150 | FALLA | No se puede verificar logo grande, nombre, pais, descripcion, categorias. |
| REQ-151 | FALLA | No se puede verificar grid de productos de la marca. |
| REQ-152 | FALLA | No se puede verificar filtros en grid de productos de la marca. |
| REQ-153 | FALLA | No se puede verificar descripcion en idioma seleccionado. |
| REQ-154 | FALLA | No se puede verificar URL semantica /es/marcas/[slug] con contenido. |

---

## Resumen
- **Total criterios:** 62
- **PASA:** 0
- **FALLA:** 62
- **BLOQUEADO:** 0

**NOTA IMPORTANTE:** Los 62 criterios FALLAN porque el sitio desplegado tiene su API URL apuntando a `http://localhost:3000/api` (configuracion de desarrollo) en vez de la URL de produccion. Adicionalmente, el API backend en `https://hesa-api.azurewebsites.net` no esta desplegado (muestra pagina de bienvenida de Azure App Service). Esto impide que cualquier dato dinamico (productos, marcas, filtros) se cargue en el frontend.

**Lo que SI funciona a nivel de UI/estructura (pero no alcanza PASA por falta de datos):**
1. Routing/URLs semanticas: /es/catalogo, /es/catalogo/farmacos, /es/catalogo/alimentos, /es/catalogo/equipos, /es/marcas, /en/catalog, /en/brands
2. Breadcrumbs correctos con links funcionales
3. Titulos de pagina y meta titulos unicos por pagina
4. Filtros adaptados por categoria (Farmacos: Marca/Especie/Familia, Alimentos: Marca/Especie/Etapa, Equipos: Marca/Tipo)
5. Catalogo general tiene filtro Categoria adicional
6. i18n completo en header, footer, breadcrumbs, filtros, pagina titulo
7. Mobile responsive: filtros colapsados en boton "Filtrar", hamburger menu, footer colapsable
8. Search overlay con hint de minimo 3 caracteres, estado sin resultados con sugerencia
9. WhatsApp floating button presente
10. Pagina home con marcas destacadas, productos destacados, secciones por categoria

---

## Bugs Encontrados

BUG-F01:
- Criterio: TODOS (REQ-035 a REQ-154)
- Pasos: 1. Navegar a cualquier pagina que carga datos del API (catalogo, marcas, busqueda, detalle producto). 2. Observar la consola del browser.
- Esperado: El frontend debe conectar al API desplegado en https://hesa-api.azurewebsites.net/api
- Actual: El frontend intenta conectar a http://localhost:3000/api (configuracion de desarrollo). Todos los requests fallan con error de conexion. La consola muestra: "[ERROR] Connecting to 'http://localhost:3000/api/p...'"
- Severidad: alta
- Evidencia: preflight-catalogo-desktop-v2.png, search-no-results.png
- Causa raiz: El build desplegado usa `environment.ts` (dev) en vez de `environment.prod.ts` (prod). El archivo `src/environments/environment.ts` tiene `apiUrl: 'http://localhost:3000/api'` y `environment.prod.ts` tiene `apiUrl: 'https://hesa-api.azurewebsites.net/api'`.

BUG-F02:
- Criterio: TODOS (REQ-035 a REQ-154)
- Pasos: 1. Hacer GET a https://hesa-api.azurewebsites.net/api/products. 2. Hacer GET a https://hesa-api.azurewebsites.net/api/brands.
- Esperado: Respuestas JSON con datos de productos y marcas
- Actual: Ambos endpoints retornan 404 con HTML "Cannot GET /api/products". La raiz del API muestra la pagina de bienvenida de Azure App Service ("Microsoft Azure App Service - Welcome"), indicando que el backend no esta desplegado.
- Severidad: alta
- Evidencia: Verificacion via curl
- Causa raiz: El backend de Node.js/Express no esta desplegado en Azure App Service o la configuracion de deploy no es correcta.

BUG-F03:
- Criterio: REQ-040
- Pasos: 1. Navegar a /en/catalog. 2. Provocar un error de API (automatico por BUG-F01).
- Esperado: Toast de error en ingles
- Actual: Toast de error aparece en espanol: "No se pudo conectar con el servidor. Verifica tu conexion." en la pagina en ingles.
- Severidad: media
- Evidencia: catalog-english.png (snapshot muestra alertas en espanol en pagina EN)

BUG-F04:
- Criterio: REQ-106 a REQ-142
- Pasos: 1. Navegar directamente a /es/catalogo/farmacos/amoxicilina-250ml.
- Esperado: Pagina de detalle de producto carga con informacion del producto
- Actual: La pagina redirige a /es/catalogo (pagina de catalogo general) cuando no puede cargar el producto del API. Deberia mostrar un error state en vez de redirigir silenciosamente.
- Severidad: media
- Evidencia: Observado via Playwright navigation

BUG-F05:
- Criterio: REQ-148 / navegacion EN
- Pasos: 1. Navegar a /en/brands. 2. Esperar 3 segundos.
- Esperado: Pagina de marcas en ingles carga
- Actual: La pagina redirige a /es (home page en espanol). Pierde el contexto de idioma al fallar la carga de datos.
- Severidad: media
- Evidencia: Observado via Playwright navigation

BUG-F06:
- Criterio: REQ-080
- Pasos: 1. Navegar a /es/catalogo/farmacos.
- Esperado: Descripcion corta de categoria visible debajo del titulo
- Actual: No se muestra descripcion de categoria. Solo aparece titulo "Farmacos" + contador "0 productos" + filtros.
- Severidad: baja
- Evidencia: preflight-catalogo-desktop-v2.png

---

## Tests Generados
- e2e/tests/flow/REQ-035-041-search-global.spec.ts
- e2e/tests/flow/REQ-078-087-catalogo-publico.spec.ts
- e2e/tests/flow/REQ-264a-264j-catalogo-general.spec.ts
- e2e/tests/flow/REQ-106-142-detalle-producto.spec.ts
- e2e/tests/flow/REQ-143-154-marcas.spec.ts
- e2e/tests/flow/REQ-navigation-i18n.spec.ts

---

## GIFs de Flujos
No se pudieron grabar GIFs de flujos completos porque ningun flujo E2E es completable sin datos del API. Los 5 flujos obligatorios (catalogo->filtros->detalle, marcas->producto, busqueda->detalle, filtros+paginacion, sticky bar) todos dependen de datos que no cargan.

Screenshots capturados:
- preflight-catalogo.png (mobile, error state)
- preflight-catalogo-desktop.png (desktop, home page)
- preflight-catalogo-desktop-v2.png (desktop, catalogo con error)
- preflight-marcas-desktop.png (desktop, marcas con error)
- preflight-home.png (mobile, home page)
- search-no-results.png (desktop, busqueda sin resultados)
- catalog-english.png (desktop, admin login - tab issue)
- catalog-mobile.png (mobile, catalogo con filtros colapsados)
- home-page-desktop.png (desktop, home page completa)

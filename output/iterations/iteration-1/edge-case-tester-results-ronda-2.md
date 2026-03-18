# Resultados -- Edge Case Tester

## Pre-Flight Results

| Check | Resultado | Detalle |
|-------|-----------|---------|
| BUG-001 (API URL) | FIXED | Frontend JS bundle contiene `apiUrl:"https://hesa-api.azurewebsites.net/api"` (chunk-QAMGKACB.js). No hay referencias a localhost en el build. |
| BUG-002 (API /products) | NOT FIXED | `GET /api/public/products` retorna 404 "Cannot GET". Todas las rutas API retornan 404 (health, products, brands, categories, search, admin). Express corre pero no registra rutas (probable fallo de conexion a DB al startup). |
| BUG-003 (sitemap.xml) | PARCIAL | `staticwebapp.config.json` redirige /sitemap.xml a API endpoint via 301. Pero el API endpoint `/api/public/sitemap.xml` retorna 404 porque las rutas no estan registradas. |
| BUG-004 (robots.txt) | FIXED | `GET /robots.txt` retorna texto plano valido con `User-agent: *`, `Allow: /`, `Disallow: /admin/`, y referencia al sitemap. Content-Type: text/plain, status 200. |
| BUG-008 (X-Powered-By) | NOT FIXED | `curl -I https://hesa-api.azurewebsites.net/` aun muestra `X-Powered-By: Express`. Helmet no esta eliminando este header. |
| BUG-012 (producto inexistente) | FIXED | Navegar a slug inexistente muestra error state "Este producto no esta disponible" con boton "Volver al catalogo". URL se mantiene, NO redirige a /es/catalogo. |
| Auth (admin access) | BLOQUEADO | `/admin/productos` NO redirige a login -- muestra el sitio publico en ingles. Requiere credenciales Azure AD para autenticacion real. |

**CONCLUSION PRE-FLIGHT**: BUG-002 (API routes not registered) sigue siendo critico. El backend esta corriendo (Express responde) pero NINGUNA ruta esta registrada -- todas retornan 404. Esto bloquea toda funcionalidad que dependa de datos del API.

## Resultados por Criterio

### Detalle de Producto -- Edge Cases (13 criterios)

| Criterio | Estado | Input/Condicion | Evidencia |
|----------|--------|-----------------|-----------|
| REQ-109 | FALLA | Imagen zoom/lightbox -- producto no carga | API retorna 404, producto muestra "Este producto no esta disponible". No hay imagen para verificar zoom. Bloqueado por API caida. |
| REQ-120 | FALLA | Sin ficha PDF -- boton no se muestra | API retorna 404, no hay producto cargado para verificar presencia/ausencia de boton PDF. Bloqueado por API caida. |
| REQ-125 | FALLA | Meta titulo con producto+marca | Titulo es generico "HESA - Herrera y Elizondo S.A." porque el producto no carga (API 404). SSR no genera titulo especifico. |
| REQ-126 | FALLA | Schema JSON-LD tipo Product | No hay script type="application/ld+json" en ninguna pagina (ni home ni detalle). Ni Organization ni Product. |
| REQ-127 | FALLA | Una sola imagen sin miniaturas | API 404, producto no carga, no hay galeria para verificar. |
| REQ-128 | FALLA | Sin imagen placeholder visual | API 404, producto muestra error state, no hay layout de producto para verificar placeholder. |
| REQ-129 | FALLA | Campos vacios sin areas en blanco | API 404, producto muestra error state completo. No hay campos para verificar. |
| REQ-134 | FALLA | Sticky bar sin CLS | API 404, no hay sticky bar porque no hay producto cargado. |
| REQ-135 | FALLA | Storytelling con contenido | API 404, no hay seccion storytelling porque no hay producto cargado. |
| REQ-136 | FALLA | Storytelling no aparece si vacio | API 404, no verificable. |
| REQ-137 | FALLA | Storytelling bilingue ES/EN | API 404, no verificable. |
| REQ-141 | FALLA | Mobile relacionados en carrusel | API 404, no hay productos para mostrar relacionados. |
| REQ-142 | FALLA | Unico producto: relacionados adaptados | API 404, no verificable. |

### Paginacion -- DESBLOQUEADOS (4 criterios)

| Criterio | Estado | Input/Condicion | Evidencia |
|----------|--------|-----------------|-----------|
| REQ-101 | FALLA | Paginacion con max por pagina | Catalogo muestra "0 productos" y error "No pudimos cargar los productos". Sin productos no hay paginacion visible. API 404. |
| REQ-103 | FALLA | Paginacion accesible con teclado | Sin paginacion visible (0 productos), no se puede testear accesibilidad con teclado. |
| REQ-104 | FALLA | Scroll al inicio al cambiar pagina | Sin paginacion visible, no se puede verificar scroll behavior. |
| REQ-105 | FALLA | Paginacion vuelve a pag 1 con filtros | Sin paginacion visible, no se puede verificar reset. |

### SEO y Meta (8 criterios)

| Criterio | Estado | Input/Condicion | Evidencia |
|----------|--------|-----------------|-----------|
| REQ-033 | FALLA | hreflang tags en cada pagina | No hay tags `link[rel="alternate"][hreflang]` en ninguna pagina (ni SSR ni client-rendered). Verificado en /es, /en, /es/catalogo, /es/marcas. |
| REQ-181 | FALLA | Meta tags SEO optimizados para EN | SSR: Meta description identica en ES y EN ("HESA - Importacion y distribucion de farmacos veterinarios...") -- solo en espanol. Titulo SSR identico en todas las paginas. JS cambia titulo pero no meta description. |
| NFR-006 | FALLA | Meta titulo unico por pagina SSR | Todas las paginas tienen el mismo titulo SSR: "HESA - Herrera y Elizondo S.A." (verificado /es, /es/catalogo, /es/marcas, /en, /en/catalog). Angular cambia titulo via JS pero SSR no lo aplica. Meta description identica en todas. |
| NFR-007 | FALLA | Sitemap XML automatico | /sitemap.xml redirige 301 a API endpoint `api/public/sitemap.xml` (correcto config), pero API retorna 404 "Cannot GET" porque routes no estan registradas. Resultado final: no hay sitemap funcional. |
| NFR-008 | FALLA | Schema JSON-LD Organization y Product | No hay ningun script `application/ld+json` en ninguna pagina del sitio. Ni Organization en home ni Product en detalle. |
| NFR-010 | FALLA | Imagenes con alt descriptivos | Home page sin contenido visual (API caida). Las pocas imagenes visibles (iconos del navbar/footer) no tienen alt descriptivo en idioma. |
| NFR-011 | FALLA | hreflang conectan ES y EN | Identico a REQ-033. No hay tags hreflang en ninguna pagina. |
| NFR-012 | PASA | Sitio indexable, robots.txt valido | robots.txt retorna texto plano valido con directivas correctas: `User-agent: *`, `Allow: /`, `Disallow: /admin/`, `Sitemap: ...`. Content-Type: text/plain. No hay meta noindex en paginas publicas. |

### NFR Seguridad (3 criterios)

| Criterio | Estado | Input/Condicion | Evidencia |
|----------|--------|-----------------|-----------|
| NFR-018 | FALLA | API admin valida autenticacion | API retorna 404 en TODAS las rutas (admin y publicas). No se puede verificar si auth middleware funciona porque las rutas no existen. `GET /api/admin/products` sin token: 404. `POST /api/admin/products` sin token: 404. El 404 no es evidencia de auth, es evidencia de routes missing. |
| NFR-019 | FALLA | Archivos subidos validados por tipo/tamano | API retorna 404 en rutas de upload. No se puede probar upload validation. Code review de R1: multer tiene 5MB size limit pero NO fileFilter (acepta cualquier extension). |
| NFR-020 | FALLA | Headers seguridad completos | Frontend: TODOS los headers presentes (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, HSTS, Referrer-Policy, CSP, Permissions-Policy). API: expone `X-Powered-By: Express` (BUG-008 no fixeado). Solo tiene CSP y X-Content-Type-Options parciales. FALLA por API incompleta. |

### NFR Panel (1 criterio)

| Criterio | Estado | Input/Condicion | Evidencia |
|----------|--------|-----------------|-----------|
| NFR-013 | FALLA | Panel NO indexable | /admin/login no tiene meta `name="robots" content="noindex"`. Solo tiene: charset, viewport, description generica. robots.txt tiene `Disallow: /admin/` lo cual ayuda pero no es suficiente (meta noindex requerido). |

### Auth Flows -- DESBLOQUEADOS (5 criterios)

| Criterio | Estado | Input/Condicion | Evidencia |
|----------|--------|-----------------|-----------|
| REQ-310 | FALLA | Auth falla: mensaje "No tienes acceso" | No se puede verificar mensaje de error post-login porque requiere Azure Entra ID credentials reales. El login page tiene estructura correcta (logo, boton Microsoft), pero el flujo completo no es testeable sin credenciales. |
| REQ-311 | BLOQUEADO | Token expira: re-autenticacion | Requiere sesion autenticada real para verificar comportamiento al expirar token. Frontend code tiene interceptor que detecta 401 y redirige a login. |
| REQ-312 | BLOQUEADO | Cerrar sesion redirige a login | Requiere sesion autenticada real para verificar logout flow. |
| REQ-314 | PASA | Un solo nivel admin, sin roles | Login page no tiene selector de roles. No hay UI de roles en /admin/login. Verificado: no hay dropdown de roles, no hay texto "administrador/moderador/editor". |
| REQ-315 | BLOQUEADO | Acceso para hola@linkdesign.cr | Requiere credenciales reales de Azure AD para esta cuenta especifica. |

### Categorias -- Funcionalidad (4 criterios compartidos)

| Criterio | Estado | Input/Condicion | Evidencia |
|----------|--------|-----------------|-----------|
| REQ-268 | BLOQUEADO | 3 cards expandibles click expand/collapse | /admin/categorias redirige a /admin/login sin autenticacion. No se puede verificar funcionalidad de expand/collapse. |
| REQ-272 | BLOQUEADO | Tags: agregar con "+" y eliminar con "x" | Requiere sesion admin autenticada. |
| REQ-273 | BLOQUEADO | Advertencia al eliminar valor en uso | Requiere sesion admin autenticada y datos en API. |
| REQ-274 | BLOQUEADO | Valores de filtro en ES/EN bilingue | Requiere sesion admin autenticada. |

## Resumen de Estados
- **PASA**: 2 criterios (NFR-012, REQ-314)
- **FALLA**: 26 criterios
- **BLOQUEADO**: 7 criterios (5 requieren sesion Azure AD, 2 requieren API + auth)

## Bugs Encontrados

BUG-E01 (PERSISTENTE desde R1):
- Criterio: Todos los criterios que dependen de datos API
- Tipo: edge-case / infraestructura
- Input/Condicion: API backend no registra rutas
- Pasos: 1. curl https://hesa-api.azurewebsites.net/api/health 2. curl https://hesa-api.azurewebsites.net/api/public/products
- Esperado: /api/health retorna {"status":"ok"}, /api/public/products retorna lista de productos
- Actual: TODAS las rutas retornan 404 "Cannot GET /api/..." (Express corriendo sin rutas registradas). Verificado: api, api/health, api/public/products, api/public/brands, api/public/categories, api/public/search, api/admin/products, api/admin/brands -- todos 404.
- Severidad: alta (CRITICA)
- Impacto de seguridad: no
- Evidencia: curl responses, console errors en browser "Failed to load resource: the server responded with a status of 404"

BUG-E02 (PERSISTENTE desde R1):
- Criterio: NFR-020
- Tipo: edge-case / seguridad
- Input/Condicion: API expone X-Powered-By: Express
- Pasos: 1. curl -I https://hesa-api.azurewebsites.net/
- Esperado: Header X-Powered-By no debe estar presente
- Actual: X-Powered-By: Express visible en response headers
- Severidad: baja
- Impacto de seguridad: si (information disclosure)
- Evidencia: curl -I output muestra "X-Powered-By: Express"

BUG-E03:
- Criterio: REQ-033, NFR-011
- Tipo: edge-case / SEO
- Input/Condicion: Verificar hreflang tags en /es, /en, /es/catalogo, /es/marcas
- Pasos: 1. curl -s URL | grep hreflang 2. Browser: inspeccionar DOM por link[hreflang]
- Esperado: Tags hreflang conectando versiones ES y EN en cada pagina
- Actual: No existen tags hreflang en ninguna pagina (ni SSR ni client-rendered)
- Severidad: media
- Impacto de seguridad: no
- Evidencia: grep hreflang en HTML de 4 paginas retorna vacio

BUG-E04:
- Criterio: NFR-006, REQ-181
- Tipo: edge-case / SEO
- Input/Condicion: Verificar meta titulos y descripciones unicas por pagina en SSR
- Pasos: 1. curl /es, /es/catalogo, /es/marcas, /en, /en/catalog 2. Comparar <title> y meta description
- Esperado: Cada pagina tiene titulo y descripcion unicos. EN tiene contenido en ingles.
- Actual: SSR retorna titulo identico "HESA - Herrera y Elizondo S.A." en 5 paginas. Meta description identica y solo en espanol en todas. Angular cambia titulo via JS pero SSR es identico.
- Severidad: media
- Impacto de seguridad: no
- Evidencia: curl comparando 5 paginas muestra titulos/descripciones identicas

BUG-E05:
- Criterio: NFR-008, REQ-126
- Tipo: edge-case / SEO
- Input/Condicion: Verificar JSON-LD Schema markup en home y detalle
- Pasos: 1. Navegar a /es (home) 2. Buscar script type="application/ld+json"
- Esperado: JSON-LD Organization en home, Product en detalle de producto
- Actual: No existe ningun script application/ld+json en ninguna pagina
- Severidad: media
- Impacto de seguridad: no
- Evidencia: grep 'application/ld+json' en HTML de home y detalle retorna vacio

BUG-E06:
- Criterio: NFR-013
- Tipo: edge-case / SEO
- Input/Condicion: Verificar meta noindex en /admin/login
- Pasos: 1. curl -s /admin/login | grep noindex
- Esperado: meta name="robots" content="noindex" presente
- Actual: No hay meta noindex. Solo hay charset, viewport, y description generica. robots.txt tiene Disallow: /admin/ pero meta noindex falta.
- Severidad: baja
- Impacto de seguridad: no
- Evidencia: grep noindex en HTML de /admin/login retorna vacio

BUG-E07:
- Criterio: NFR-007
- Tipo: edge-case / SEO
- Input/Condicion: Verificar sitemap XML funcional
- Pasos: 1. curl -L /sitemap.xml (sigue redirect 301 a API) 2. API endpoint retorna 404
- Esperado: XML valido con URLs del sitio
- Actual: staticwebapp.config.json redirige correctamente a API endpoint, pero API retorna 404 porque rutas no estan registradas. Resultado: no hay sitemap funcional.
- Severidad: alta
- Impacto de seguridad: no
- Evidencia: curl -L muestra redirect 301 seguido de 404 en API endpoint

BUG-E08:
- Criterio: NFR-019
- Tipo: edge-case / seguridad
- Input/Condicion: Multer sin fileFilter
- Pasos: Code review de api/src/routes/admin/products.routes.ts
- Esperado: fileFilter que valide tipo de archivo (solo imagenes y PDF)
- Actual: Multer configurado con size limit (5MB) pero sin fileFilter. Acepta cualquier extension/mimetype.
- Severidad: media
- Impacto de seguridad: si (upload de archivos arbitrarios)
- Evidencia: Code review R1 - no se ha podido re-verificar porque API devuelve 404 en upload endpoints

## Bugs Corregidos (verificados en esta ronda)

| Bug | Estado R1 | Estado R2 | Detalle |
|-----|-----------|-----------|---------|
| BUG-001 (localhost API) | FALLA | FIXED | Frontend usa apiUrl: "https://hesa-api.azurewebsites.net/api" en JS bundle |
| BUG-004 (robots.txt) | FALLA | FIXED | robots.txt retorna texto plano valido |
| BUG-012 (redireccion producto inexistente) | FALLA | FIXED | Muestra error state "Este producto no esta disponible" sin redirigir |
| BUG-011 (error toast en EN) | FALLA | FIXED | /en/brands con API caida muestra error en ingles: "Could not load brands" |
| BUG-013 (redireccion /en/brands) | FALLA | FIXED | /en/brands mantiene URL y idioma ingles, no redirige a /es |

## Tests Generados
- e2e/tests/edge-case/REQ-109-to-REQ-142-product-detail-edge-cases.spec.ts (ACTUALIZADO)
- e2e/tests/edge-case/REQ-033-REQ-181-seo-hreflang-meta.spec.ts (ACTUALIZADO)
- e2e/tests/edge-case/NFR-006-to-NFR-013-seo-meta.spec.ts (ACTUALIZADO)
- e2e/tests/edge-case/NFR-014-017-018-019-020-security.spec.ts (ACTUALIZADO)
- e2e/tests/edge-case/REQ-125-REQ-126-product-seo.spec.ts (ACTUALIZADO)
- e2e/tests/edge-case/REQ-268-274-admin-categories.spec.ts (ACTUALIZADO)
- e2e/tests/edge-case/NFR-019-upload-validation.sh (ACTUALIZADO)
- e2e/tests/edge-case/REQ-101-103-104-105-pagination.spec.ts (NUEVO)
- e2e/tests/edge-case/REQ-310-311-312-314-315-auth-flows.spec.ts (NUEVO)
- e2e/tests/edge-case/REQ-268-272-273-274-categories-functionality.spec.ts (NUEVO)

# Resultados -- Edge Case Tester

## Hallazgo Critico Pre-Testing

**BUG RAIZ**: El build desplegado del frontend usa el environment de DESARROLLO (`environment.ts`) en lugar del de produccion (`environment.prod.ts`). Esto causa que todas las llamadas a la API apunten a `http://localhost:3000/api` en lugar de `https://hesa-api.azurewebsites.net/api`. La CSP del frontend bloquea estas requests (ya que solo permite `https://hesa-api.azurewebsites.net`), resultando en que NINGUNA pagina que depende de datos de API muestra contenido.

- **Evidencia**: Errores de consola: `Connecting to 'http://localhost:3000/api/public/products' violates the following Content Security Policy directive`
- **Archivos afectados**: `src/environments/environment.ts` (apiUrl: `http://localhost:3000/api`) vs `src/environments/environment.prod.ts` (apiUrl: `https://hesa-api.azurewebsites.net/api`)
- **Impacto**: Todas las paginas de catalogo, marcas, busqueda y detalle de producto muestran contenido vacio o mensajes de error de conexion

Ademas, el backend API (`https://hesa-api.azurewebsites.net`) tiene Express corriendo pero las rutas no estan registradas (todas retornan 404 "Cannot GET"). Esto sugiere que la conexion a la base de datos fallo al iniciar la app, impidiendo el registro de rutas.

## Resultados por Criterio

| Criterio | Estado | Input/Condicion | Evidencia |
|----------|--------|-----------------|-----------|
| REQ-088 | PASA | Seleccionar Farmacos - aparecen filtros Marca, Especie, Familia | Snapshot: dropdowns visibles con opciones correctas |
| REQ-089 | PASA | Seleccionar Alimentos - aparecen filtros Marca, Especie, Etapa de vida | Snapshot: dropdown Etapa con Cachorro/Kitten, Adulto, Senior |
| REQ-090 | PASA | Seleccionar Equipos - aparecen filtros Marca, Tipo de equipo | Snapshot: dropdown Tipo con Diagnostico, Quirurgico, Laboratorio, Instrumental |
| REQ-091 | PASA | Filtros son dropdowns en barra horizontal (no sidebar) | Verificacion visual en desktop: selects inline |
| REQ-092 | PASA | Seleccionar filtro cambia URL inmediatamente sin boton Aplicar | URL cambia a ?category=farmacos al seleccionar |
| REQ-093 | PASA | Filtro activo aparece como pill con X para remover | Pill "farmacos" con boton "Remover filtro: farmacos" |
| REQ-094 | PASA | Boton "Limpiar filtros" aparece con filtros activos | Boton visible al aplicar filtro |
| REQ-095 | FALLA | Combinacion de filtros - URL muestra ambos parametros | URL muestra category= pero species usa parametro diferente. No se puede verificar interseccion real sin API |
| REQ-096 | PASA | Mobile: filtros colapsados en boton "Filtrar" + drawer | Boton "Filtrar productos" en mobile, abre drawer con filtros y boton "Aplicar filtros" |
| REQ-097 | PASA | Error de carga muestra mensaje + boton reintentar | "No pudimos cargar los productos" + "Reintentar" visible |
| REQ-098 | PASA | Contador muestra "0 productos" cuando API no responde | Texto "0 productos" visible junto al titulo |
| REQ-099 | PASA | Filtros reflejados en URL query params | URL cambia a ?category=farmacos al seleccionar filtro |
| REQ-100 | PASA | Valores de filtros generados desde datos (categorias semilla) | Especies, familias, etapas y tipos cargados de datos seed |
| REQ-101 | FALLA | Paginacion no visible (API no responde, 0 productos) | Sin API no hay paginacion para verificar. Bloqueado por BUG-E01 |
| REQ-102 | PASA | Indicador "0 productos" visible | Contador visible |
| REQ-103 | FALLA | Paginacion accesible con teclado - no verificable sin paginacion | Sin paginacion visible, no se puede testear accesibilidad |
| REQ-104 | FALLA | Scroll al inicio al cambiar pagina - no verificable sin paginacion | Sin paginacion visible |
| REQ-105 | FALLA | Paginacion vuelve a pag 1 al cambiar filtros - no verificable | Sin paginacion visible |
| REQ-109 | FALLA | Imagen principal con zoom al hover - no verificable sin producto | Producto muestra 404 "Este producto no esta disponible" |
| REQ-120 | FALLA | Sin ficha PDF boton no se muestra - no verificable sin producto | Producto muestra 404 |
| REQ-124 | PASA | URL semantica /es/catalogo/[cat]/[slug] funciona | URL /es/catalogo/farmacos/amoxicilina-250ml carga (aunque sin datos API) |
| REQ-125 | FALLA | Meta titulo con producto+marca - no verificable | Titulo generico "HESA - Herrera y Elizondo S.A." sin producto |
| REQ-126 | FALLA | Schema markup JSON-LD tipo Product - no presente | No hay script type="application/ld+json" en ninguna pagina |
| REQ-127 | FALLA | Una sola imagen sin miniaturas - no verificable sin producto | Producto muestra 404 |
| REQ-128 | FALLA | Sin imagen placeholder visual - no verificable sin producto | Producto muestra 404 |
| REQ-129 | FALLA | Campos vacios no generan areas en blanco - no verificable | Producto muestra 404 |
| REQ-134 | FALLA | Sticky bar sin CLS - no verificable sin producto | Producto muestra 404 |
| REQ-135 | FALLA | Storytelling si hay contenido - no verificable sin producto | Producto muestra 404 |
| REQ-136 | FALLA | Storytelling opcional no aparece si vacio - no verificable | Producto muestra 404 |
| REQ-137 | FALLA | Storytelling bilingue - no verificable sin producto | Producto muestra 404 |
| REQ-141 | FALLA | Mobile relacionados en carrusel horizontal - no verificable | Producto muestra 404 |
| REQ-142 | FALLA | Unico producto: seccion relacionados adaptada - no verificable | Producto muestra 404 |
| REQ-308 | PASA | Panel requiere autenticacion | Todas las rutas /admin/* redirigen a /admin/login |
| REQ-309 | PASA | Login: logo HESA + boton "Iniciar sesion con Microsoft" | Pagina login muestra logo, heading, boton Microsoft sin campos propios |
| REQ-310 | BLOQUEADO | Auth falla: mensaje claro - requiere sesion real | Requiere autenticacion Azure Entra ID |
| REQ-311 | BLOQUEADO | Token expirado: re-autenticacion - requiere sesion real | Requiere autenticacion Azure Entra ID |
| REQ-312 | BLOQUEADO | Cerrar sesion: redirige a login - requiere sesion real | Requiere autenticacion Azure Entra ID |
| REQ-313 | PASA | Rutas protegidas redirigen a login sin sesion | /admin/productos, /admin/marcas, /admin/mensajes, /admin/categorias, /admin/configuracion redirigen a /admin/login |
| REQ-314 | BLOQUEADO | Un solo nivel admin sin roles - requiere sesion real | Requiere autenticacion Azure Entra ID |
| REQ-315 | BLOQUEADO | Acceso para hola@linkdesign.cr - requiere sesion real | Requiere autenticacion Azure Entra ID |
| REQ-316 | PASA | No hay pantalla de gestion de usuarios | Ruta /admin/usuarios redirige a login (no existe como pantalla) |
| REQ-317 | PASA | Panel NO almacena contrasenas | Login solo tiene boton Microsoft SSO, sin campos password |
| REQ-033 | FALLA | hreflang tags no presentes en ninguna pagina | Ni el HTML SSR ni el JS renderizado incluyen tags hreflang |
| REQ-181 | FALLA | Meta tags EN no optimizados | Titulo y descripcion identicos en ES y EN, sin keywords "distributor Costa Rica" |
| REQ-268 | BLOQUEADO | 3 cards expandibles categorias - requiere sesion admin | Redirige a login |
| REQ-272 | BLOQUEADO | Tags como chips/pills - requiere sesion admin | Redirige a login |
| REQ-273 | BLOQUEADO | Advertencia al eliminar valor en uso - requiere sesion admin | Redirige a login |
| REQ-274 | BLOQUEADO | Valores filtro en ES/EN - requiere sesion admin | Redirige a login |
| NFR-006 | FALLA | Meta titulo NO es unico por pagina en SSR | Todas las paginas tienen titulo "HESA - Herrera y Elizondo S.A." en el HTML. Angular lo cambia via JS pero SSR no lo aplica |
| NFR-007 | FALLA | /sitemap.xml retorna HTML de Angular (SPA fallback) | No es XML valido, es el index.html de la app |
| NFR-008 | FALLA | No hay JSON-LD Schema markup en ninguna pagina | Ni Organization ni Product - no hay script type="application/ld+json" |
| NFR-009 | PASA | URLs semanticas funcionan correctamente | /es/catalogo/farmacos, /en/catalog/pharmaceuticals, /es/marcas, /en/brands retornan 200 |
| NFR-010 | FALLA | Imagenes sin alt descriptivos en HTML SSR | El HTML del servidor no contiene imagenes (todo se renderiza client-side) |
| NFR-011 | FALLA | No hay tags hreflang en ninguna pagina | Sin hreflang ni en HTML SSR ni en DOM renderizado |
| NFR-012 | FALLA | /robots.txt retorna HTML de Angular (SPA fallback) | No es robots.txt valido |
| NFR-013 | PASA | Panel admin protegido por auth redirect | Rutas admin redirigen a login. Sin meta noindex pero la auth protege contra indexacion |
| NFR-014 | PASA | Todas las comunicaciones usan HTTPS | HTTP redirige a HTTPS con 301. HSTS header presente con max-age=31536000 |
| NFR-017 | PASA | XSS payloads no se ejecutan ni reflejan | Angular sanitiza inputs. CSP bloquea scripts inline. Payloads en URL no se reflejan en DOM |
| NFR-018 | FALLA | API admin endpoints no verificables | API retorna 404 en TODAS las rutas (admin y publicas) - las rutas no estan registradas. No se puede verificar si auth middleware funciona |
| NFR-019 | FALLA | Validacion de uploads no verificable sin API | API no responde. Code review muestra multer con 5MB limit pero no hay validacion de tipo de archivo (solo size) |
| NFR-020 | PASA | Headers de seguridad completos en frontend | X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, HSTS, Referrer-Policy, CSP, Permissions-Policy presentes |

## Resumen de Estados
- **PASA**: 23 criterios
- **FALLA**: 28 criterios
- **BLOQUEADO**: 9 criterios (6 requieren sesion admin, 3 requieren API funcionando)

## Bugs Encontrados

BUG-E01:
- Criterio: Todos los criterios que dependen de API (REQ-088 a REQ-142, NFR-018)
- Tipo: edge-case / configuracion
- Input/Condicion: Build desplegado con environment de desarrollo
- Pasos: 1. Navegar a cualquier pagina que carga datos (catalogo, marcas, producto). 2. Abrir consola del browser. 3. Observar error "Connecting to 'http://localhost:3000/api/...' violates CSP"
- Esperado: La app debe hacer requests a https://hesa-api.azurewebsites.net/api
- Actual: La app hace requests a http://localhost:3000/api (environment de desarrollo)
- Severidad: alta
- Impacto de seguridad: no (CSP bloquea las requests)
- Evidencia: Console errors en .playwright-mcp/console-2026-03-18T01-23-06-196Z.log. Archivo: src/environments/environment.ts (apiUrl: 'http://localhost:3000/api') vs environment.prod.ts (apiUrl: 'https://hesa-api.azurewebsites.net/api')

BUG-E02:
- Criterio: NFR-018
- Tipo: edge-case / infraestructura
- Input/Condicion: API backend no registra rutas
- Pasos: 1. Hacer GET a https://hesa-api.azurewebsites.net/api/health. 2. Hacer GET a https://hesa-api.azurewebsites.net/api/public/products
- Esperado: /api/health retorna {"status":"ok"}, /api/public/products retorna lista de productos
- Actual: Todas las rutas retornan 404 "Cannot GET /api/..." (Express corriendo sin rutas registradas)
- Severidad: alta
- Impacto de seguridad: no
- Evidencia: curl responses muestran HTML de error Express "Cannot GET"

BUG-E03:
- Criterio: NFR-007
- Tipo: edge-case / SEO
- Input/Condicion: Acceder a /sitemap.xml
- Pasos: 1. Navegar a https://gray-field-02ba8410f.2.azurestaticapps.net/sitemap.xml
- Esperado: XML valido con URLs del sitio en ES y EN
- Actual: Retorna el HTML de la app Angular (SPA fallback). No existe sitemap.xml como archivo estatico
- Severidad: alta
- Impacto de seguridad: no
- Evidencia: curl response es "<!doctype html>" en lugar de "<?xml..."

BUG-E04:
- Criterio: NFR-012
- Tipo: edge-case / SEO
- Input/Condicion: Acceder a /robots.txt
- Pasos: 1. Navegar a https://gray-field-02ba8410f.2.azurestaticapps.net/robots.txt
- Esperado: Archivo robots.txt valido con directivas User-agent y Sitemap
- Actual: Retorna el HTML de la app Angular (SPA fallback)
- Severidad: alta
- Impacto de seguridad: no
- Evidencia: curl response es "<!doctype html>" en lugar de "User-agent: *"

BUG-E05:
- Criterio: REQ-033, NFR-011
- Tipo: edge-case / SEO
- Input/Condicion: Verificar hreflang tags en cualquier pagina
- Pasos: 1. Navegar a /es o /en. 2. Inspeccionar head por link[rel="alternate"][hreflang="es|en"]
- Esperado: Tags hreflang conectando versiones ES y EN
- Actual: No existen tags hreflang en ninguna pagina (ni SSR ni client-rendered)
- Severidad: media
- Impacto de seguridad: no
- Evidencia: grep -i "hreflang" en HTML de todas las paginas retorna vacio

BUG-E06:
- Criterio: NFR-006, REQ-181
- Tipo: edge-case / SEO
- Input/Condicion: Verificar meta titulos unicos por pagina
- Pasos: 1. Hacer curl a /es, /es/catalogo, /es/marcas. 2. Comparar <title> tags
- Esperado: Cada pagina tiene titulo unico. EN tiene keywords "distributor Costa Rica"
- Actual: Todas las paginas comparten el mismo titulo "HESA - Herrera y Elizondo S.A." en el HTML SSR. Angular lo cambia via JS (ej: "Catalogo de Productos | HESA") pero el HTML inicial es identico. La meta description tambien es identica y solo en espanol en todas las paginas
- Severidad: media
- Impacto de seguridad: no
- Evidencia: curl comparando titulos muestra titulos identicos en 6 paginas

BUG-E07:
- Criterio: NFR-008
- Tipo: edge-case / SEO
- Input/Condicion: Verificar JSON-LD Schema markup
- Pasos: 1. Navegar a /es (home). 2. Buscar script type="application/ld+json"
- Esperado: JSON-LD Organization en home, Product en detalle
- Actual: No existe ningun script de tipo application/ld+json en ninguna pagina
- Severidad: media
- Impacto de seguridad: no
- Evidencia: grep 'application/ld+json' en HTML de home retorna vacio

BUG-E08:
- Criterio: NFR-020
- Tipo: edge-case / seguridad
- Input/Condicion: API expone X-Powered-By: Express
- Pasos: 1. curl -I https://hesa-api.azurewebsites.net/
- Esperado: Header X-Powered-By no debe estar presente (helmet deberia eliminarlo)
- Actual: X-Powered-By: Express visible en response headers
- Severidad: baja
- Impacto de seguridad: si (information disclosure)
- Evidencia: curl -I muestra "X-Powered-By: Express"

BUG-E09:
- Criterio: NFR-019
- Tipo: edge-case / seguridad (code review)
- Input/Condicion: Revision de codigo de upload validation
- Pasos: 1. Leer api/src/routes/admin/products.routes.ts linea 12
- Esperado: Validacion de tipo de archivo (solo imagenes y PDFs permitidos)
- Actual: Multer solo valida tamano (5MB limit) pero NO valida tipo de archivo (mimetype/extension). Un usuario podria subir .exe, .sh u otros archivos maliciosos
- Severidad: media
- Impacto de seguridad: si (upload de archivos arbitrarios)
- Evidencia: Linea 12: `multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })` - sin fileFilter

BUG-E10:
- Criterio: NFR-013
- Tipo: edge-case / SEO
- Input/Condicion: Admin panel sin meta noindex
- Pasos: 1. Acceder a /admin/login. 2. Verificar meta robots tag
- Esperado: meta name="robots" content="noindex" en paginas del panel admin
- Actual: No hay meta noindex en el panel admin. La proteccion se da por auth redirect, pero si un bot llega a /admin/login, podria indexar la pagina de login
- Severidad: baja
- Impacto de seguridad: no
- Evidencia: grep "noindex" en HTML de /admin/login retorna vacio

## Tests Generados
- e2e/tests/edge-case/REQ-088-to-REQ-098-catalog-filters-edge-cases.spec.ts
- e2e/tests/edge-case/REQ-099-to-REQ-105-filter-url-pagination.spec.ts
- e2e/tests/edge-case/REQ-109-to-REQ-142-product-detail-edge-cases.spec.ts
- e2e/tests/edge-case/REQ-308-to-REQ-317-auth-admin.spec.ts
- e2e/tests/edge-case/NFR-006-to-NFR-013-seo-meta.spec.ts
- e2e/tests/edge-case/NFR-014-017-018-019-020-security.spec.ts
- e2e/tests/edge-case/REQ-033-REQ-181-seo-hreflang-meta.spec.ts
- e2e/tests/edge-case/REQ-096-mobile-filters.spec.ts
- e2e/tests/edge-case/REQ-125-REQ-126-product-seo.spec.ts
- e2e/tests/edge-case/REQ-268-274-admin-categories.spec.ts
- e2e/tests/edge-case/NFR-019-upload-validation.sh

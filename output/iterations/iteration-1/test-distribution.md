# Plan de Distribucion — QA Team

## Contexto de Testing
- Iteracion: 1
- Ronda: 2
- URL del sitio desplegado: https://gray-field-02ba8410f.2.azurestaticapps.net
- URL del backend: https://hesa-api.azurewebsites.net
- URL del API base: https://hesa-api.azurewebsites.net/api
- Total criterios esta iteracion: 170 (157 REQ + 13 NFR)
- Criterios PASA (automatizado, no re-testear): 19
- Criterios FALLA en R1 (re-verificar fix): 90
- Criterios DESBLOQUEADOS (antes bloqueados, ahora testeables): 61
- Total criterios que requieren sub-testers esta ronda: 151

## Pre-Flight Obligatorio (CRITICO - Leer antes de testear)

Leccion aprendida: En Fase 4 Ronda 2, 5 de 13 bugs reportados como "corregidos" NO estaban realmente fixeados en el sitio desplegado, desperdiciando una ronda entera. CADA sub-tester DEBE ejecutar estas verificaciones pre-flight ANTES de comenzar su testing:

1. **BUG-001 (FIXED R1)**: Verificar que las llamadas API van a `https://hesa-api.azurewebsites.net/api`, NO a `localhost:3000`. Abrir consola del browser en cualquier pagina con datos.
2. **BUG-002 (FIXED R2)**: Verificar que `GET https://hesa-api.azurewebsites.net/api/products` retorna JSON con datos, NO 404 "Cannot GET".
3. **BUG-003**: Verificar que `GET /sitemap.xml` retorna XML valido, NO HTML de SPA.
4. **BUG-004**: Verificar que `GET /robots.txt` retorna texto plano, NO HTML de SPA.
5. **BUG-008**: Verificar que el header `X-Powered-By` ya NO aparece en responses del API.
6. **BUG-012**: Verificar que navegar a un slug de producto inexistente muestra error state, NO redirige a /es/catalogo.
7. **Auth bypass**: Verificar que se puede acceder al panel admin. Navegar a /admin/productos y confirmar que carga el listado con datos (no redirige a login).

Si CUALQUIER pre-flight falla, reportar BLOQUEADO inmediatamente al PM sin continuar el testing.

---

## Regresion Automatizada (de regression-results.md)

- Resultado de `npx playwright test e2e/tests/`: **359 passed, 154 failed**
- Los 154 failed son tests de Fase 4 (visual-build) que requieren auth de panel admin -- fallos ESPERADOS por timeout de auth redirect, NO regresiones funcionales
- Los 19 criterios que PASARON en R1 estan cubiertos por tests automatizados que siguen pasando

### Criterios verificados por automatizacion (PASA automatizado -- NO asignar a sub-testers):
- REQ-088: Farmacos: filtros Marca, Especie, Familia
- REQ-089: Alimentos: filtros Marca, Especie, Etapa
- REQ-090: Equipos: filtros Marca, Tipo
- REQ-091: Filtros como dropdowns en barra horizontal
- REQ-092: Filtros aplican inmediatamente sin boton
- REQ-093: Filtros activos como pills con "X"
- REQ-094: Boton "Limpiar filtros"
- REQ-096: Mobile: filtros colapsados en drawer
- REQ-097: Sin resultados: mensaje + sugerencia
- REQ-098: Contador se actualiza dinamicamente
- REQ-099: Filtros en URL query params
- REQ-100: Valores de filtros desde datos
- REQ-102: Indicador "Mostrando X de Y productos"
- REQ-124: URL semantica /es/catalogo/[cat]/[slug]
- REQ-308: Panel requiere autenticacion
- REQ-309: Login: logo HESA + boton Microsoft
- REQ-313: Rutas protegidas redirigen a login
- REQ-316: NO hay pantalla de gestion de usuarios
- REQ-317: Panel NO almacena contrasenas

### NFR verificados por automatizacion (de Fase 4, siguen pasando):
- NFR-009: URLs semanticas (7 tests passed)
- NFR-014: HTTPS con HSTS (test passed en R1, no re-test)
- NFR-017: XSS/sanitizacion (9 tests passed)
- NFR-021: WCAG accesibilidad (3 tests passed)
- NFR-026: Tap targets 44px (8 tests passed)
- NFR-031: Mobile responsive publico (5 tests passed)

---

## Asignacion: Flow Tester -> e2e/tests/flow/

### Criterios asignados: 62 criterios (todos FALLA en R1, re-verificar tras bug fixes)

#### Busqueda Global (7 criterios FALLA)
- REQ-035: Busqueda por nombre, marca, especie, familia (R1: API localhost)
- REQ-036: Resultados predictivos con 3+ caracteres (R1: API no respondia)
- REQ-037: Resultados agrupados por tipo max 5 (R1: sin datos API)
- REQ-038: Clic en resultado navega a pagina correcta (R1: sin resultados)
- REQ-039: Sin resultados: mensaje con sugerencias (R1: siempre "sin resultados" por API caida)
- REQ-040: Busqueda en ambos idiomas (R1: i18n ok pero sin API)
- REQ-041: Tolerancia a errores tipograficos (R1: no verificable sin API)

#### Catalogo Publico (10 criterios FALLA)
- REQ-078: Breadcrumb Inicio > Catalogo > Categoria (R1: sin detalle verificable)
- REQ-079: Titulo de categoria + contador (R1: "0 productos")
- REQ-080: Descripcion corta de categoria (R1: BUG-006, no renderiza)
- REQ-081: Grid 3 cols desktop, 2 tablet, 1-2 mobile (R1: sin productos)
- REQ-082: Cards: imagen, nombre, marca, iconos especie (R1: sin cards)
- REQ-083: Cards NO muestran precio/inventario (R1: sin cards)
- REQ-084: Clic en card navega a detalle (R1: sin cards)
- REQ-085: Estado vacio si categoria sin productos (R1: mostraba error state)
- REQ-086: URL semantica /es/catalogo/farmacos (R1: routing ok, sin contenido)
- REQ-087: Meta titulo y descripcion unicos (R1: sin contenido completo)

#### Catalogo General (10 criterios FALLA)
- REQ-264a: Catalogo general muestra TODOS los productos (R1: "0 productos")
- REQ-264b: Filtro de "Categoria" en catalogo general (R1: sin datos para filtrar)
- REQ-264c: Filtros disponibles segun categoria (R1: Marca no carga)
- REQ-264d: Filtros secundarios se adaptan dinamicamente (R1: sin datos)
- REQ-264e: Breadcrumb: Inicio > Catalogo (R1: dependencia API)
- REQ-264f: Meta titulo y descripcion SEO (R1: dependencia API)
- REQ-264g: Link "Catalogo" en header enlaza a pagina general (R1: sin contenido)
- REQ-264h: Contador se actualiza con filtros (R1: "0 productos")
- REQ-264i: Paginacion 24 productos por pagina (R1: sin productos)
- REQ-264j: Mobile: grid 1-2 cols, filtros colapsados (R1: sin productos)

#### Detalle de Producto -- Flujo principal (22 criterios FALLA)
- REQ-106: Breadcrumb Inicio > Cat > Producto (R1: BUG-012 redirige)
- REQ-107: Galeria con miniaturas + imagen principal (R1: redirige)
- REQ-108: Clic en miniatura cambia imagen (R1: redirige)
- REQ-110: Nombre del producto visible (R1: redirige)
- REQ-111: Marca con link a pagina individual (R1: redirige)
- REQ-112: Badges/iconos de especie (R1: redirige)
- REQ-113: Farmacos: formula, registro, indicaciones (R1: redirige)
- REQ-114: Farmacos: pills de presentaciones (R1: redirige)
- REQ-115: Alimentos: especie, etapa, ingredientes (R1: redirige)
- REQ-116: Equipos: especificaciones, usos, garantia (R1: redirige)
- REQ-117: CTA "Solicitar info" abre formulario (R1: redirige)
- REQ-118: CTA WhatsApp con mensaje contextual (R1: redirige)
- REQ-119: Boton ficha tecnica PDF si hay PDF (R1: redirige)
- REQ-121: Mobile: 1 columna, galeria arriba (R1: redirige)
- REQ-122: Textos en idioma seleccionado (R1: redirige)
- REQ-123: NO muestra precio, inventario, carrito (R1: redirige)
- REQ-130: Sticky bar al scroll (R1: redirige)
- REQ-131: Sticky bar: miniatura, nombre, marca, CTA (R1: redirige)
- REQ-132: Sticky bar desaparece al scroll arriba (R1: redirige)
- REQ-133: Mobile: sticky bar simplificado (R1: redirige)
- REQ-138: Seccion "Tambien te puede interesar" (R1: redirige)
- REQ-139: Relacionados de misma categoria/marca (R1: redirige)
- REQ-140: Cards relacionados mismo formato catalogo (R1: redirige)

#### Marcas (12 criterios FALLA)
- REQ-143: Titulo y parrafo introductorio (R1: sin cards)
- REQ-144: Grid 3-4 cols desktop, 2 tablet, 1-2 mobile (R1: sin cards)
- REQ-145: Cards: logo, nombre, pais, badges (R1: sin cards)
- REQ-146: Clic en card navega a pagina individual (R1: sin cards)
- REQ-147: Meta titulo y descripcion SEO (R1: sin datos)
- REQ-148: Textos en idioma seleccionado (R1: BUG-013 redirige a /es)
- REQ-149: Breadcrumb marca individual (R1: no carga)
- REQ-150: Logo grande, nombre, pais, descripcion, categorias (R1: no carga)
- REQ-151: Grid productos de la marca (R1: no carga)
- REQ-152: Filtros en grid de productos de la marca (R1: no carga)
- REQ-153: Descripcion en idioma seleccionado (R1: no verificable)
- REQ-154: URL semantica /es/marcas/[slug] (R1: no verificable)

#### Filtros con datos reales (1 criterio FALLA)
- REQ-095: Combinacion de multiples filtros (R1: sin datos reales para interseccion)

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- API base: https://hesa-api.azurewebsites.net/api
- **Pre-flight**: Ejecutar las 7 verificaciones del bloque Pre-Flight ANTES de empezar
- **Flujos E2E prioritarios**:
  1. Home -> Catalogo general -> Filtrar por categoria -> Ver productos -> Clic card -> Detalle -> Sticky bar -> Solicitar info -> Contacto
  2. Home -> Busqueda -> Escribir 3+ chars -> Ver prediccion -> Clic resultado -> Detalle
  3. Marcas listado -> Clic marca -> Marca individual -> Grid productos -> Filtrar -> Clic producto -> Detalle
  4. Catalogo EN (/en/catalog) -> Producto EN -> Cambiar a ES -> Verificar contenido cambia
- **Verificaciones de bug fixes**:
  - BUG-006: Descripcion corta de categoria visible debajo del titulo en /es/catalogo/farmacos
  - BUG-011: Toast de error en pagina EN debe aparecer en ingles, no en espanol
  - BUG-012: Producto inexistente muestra error state, NO redirige a /es/catalogo
  - BUG-013: /en/brands con API caida mantiene idioma ingles y ruta, NO redirige a /es
- **Tests**: ACTUALIZAR los .spec.ts existentes:
  - `REQ-035-041-search-global.spec.ts` -- assertions con datos reales
  - `REQ-078-087-catalogo-publico.spec.ts` -- assertions con productos visibles
  - `REQ-264a-264j-catalogo-general.spec.ts` -- assertions con datos
  - `REQ-106-142-detalle-producto.spec.ts` -- assertions sin redireccion
  - `REQ-143-154-marcas.spec.ts` -- assertions con cards de marcas
- **GIFs OBLIGATORIOS** (5 minimo):
  1. Catalogo con datos -> Filtrar -> Paginar -> Clic producto -> Detalle con galeria
  2. Busqueda predictiva -> Resultados agrupados -> Clic -> Detalle
  3. Marcas listado con cards -> Marca individual con productos
  4. Sticky bar aparece/desaparece en detalle (desktop y mobile)
  5. Cambio de idioma ES/EN en catalogo y detalle con datos reales

---

## Asignacion: Edge Case Tester -> e2e/tests/edge-case/

### Criterios asignados: 35 criterios (22 FALLA + 4 DESBLOQUEADOS API + 5 DESBLOQUEADOS auth + 4 compartidos categorias)

#### Detalle de Producto -- Edge Cases (13 criterios FALLA)
- REQ-109: Imagen principal con zoom/lightbox (R1: detalle 404)
- REQ-120: Sin ficha PDF: boton NO se muestra (R1: detalle 404)
- REQ-125: Meta titulo (producto + marca) (R1: titulo generico)
- REQ-126: Schema markup JSON-LD tipo Product (R1: BUG-007)
- REQ-127: Una sola imagen: sin miniaturas (R1: detalle 404)
- REQ-128: Sin imagen: placeholder visual (R1: detalle 404)
- REQ-129: Campos vacios no generan areas en blanco (R1: detalle 404)
- REQ-134: Sticky bar sin CLS (R1: detalle 404)
- REQ-135: Storytelling imagen + texto si hay contenido (R1: detalle 404)
- REQ-136: Storytelling: no aparece si no hay contenido (R1: detalle 404)
- REQ-137: Storytelling bilingue ES/EN (R1: detalle 404)
- REQ-141: Mobile: relacionados en carrusel horizontal (R1: detalle 404)
- REQ-142: Unico producto: seccion relacionados adaptada (R1: detalle 404)

#### Paginacion -- DESBLOQUEADOS (4 criterios, antes BLOQUEADO por API -- GENERAR .spec.ts)
- REQ-101: Paginacion con maximo por pagina
- REQ-103: Paginacion accesible con teclado
- REQ-104: Scroll al inicio al cambiar pagina
- REQ-105: Paginacion vuelve a pag 1 al cambiar filtros

#### SEO y Meta (8 criterios FALLA -- re-verificar bug fixes)
- REQ-033: Etiquetas hreflang en cada pagina (R1: BUG-005)
- REQ-181: Meta tags SEO optimizados para ingles (R1: BUG-006)
- NFR-006: Meta titulo y descripcion unicos por pagina (R1: BUG-006 SSR identico)
- NFR-007: Sitemap XML automatico (R1: BUG-003 retorna HTML)
- NFR-008: Schema markup JSON-LD Organization y Product (R1: BUG-007)
- NFR-010: Imagenes con alt descriptivos en idioma (R1: sin imagenes client-side)
- NFR-011: Etiquetas hreflang conectan ES y EN (R1: BUG-005)
- NFR-012: Sitio indexable, no blocking robots.txt (R1: BUG-004 retorna HTML)

#### NFR Seguridad (3 criterios FALLA)
- NFR-018: API del panel valida autenticacion en cada endpoint (R1: BUG-002 API 404)
- NFR-019: Archivos subidos validados por tipo y tamano (R1: BUG-009 sin fileFilter)
- NFR-020: Headers de seguridad completos (R1: BUG-008 X-Powered-By)

#### NFR Panel (1 criterio FALLA)
- NFR-013: Panel NO indexable (R1: BUG-010 sin meta noindex)

#### Auth Flows -- DESBLOQUEADOS (5 criterios, antes BLOQUEADO auth -- GENERAR .spec.ts)
- REQ-310: Auth falla: mensaje "No tienes acceso"
- REQ-311: Token expira: re-autenticacion automatica
- REQ-312: Cerrar sesion cierra sesion Azure + redirige a login
- REQ-314: Un solo nivel admin, sin roles
- REQ-315: Acceso inicial para hola@linkdesign.cr

#### Categorias -- Funcionalidad (4 criterios DESBLOQUEADOS compartidos con Visual Checker -- GENERAR .spec.ts)
- REQ-268: 3 cards expandibles click expand/collapse funcionalidad
- REQ-272: Tags: agregar con "+" y eliminar con "x"
- REQ-273: Advertencia al eliminar valor en uso por productos
- REQ-274: Valores de filtro en ES/EN bilingue

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- API base: https://hesa-api.azurewebsites.net/api
- **Pre-flight**: Ejecutar las 7 verificaciones del bloque Pre-Flight
- **Prioridad 1 -- Verificar bug fixes SEO**:
  - BUG-003: `curl https://gray-field-02ba8410f.2.azurestaticapps.net/sitemap.xml` debe retornar XML con URLs en ES y EN
  - BUG-004: `curl https://gray-field-02ba8410f.2.azurestaticapps.net/robots.txt` debe retornar texto plano con User-agent y Sitemap
  - BUG-005: Verificar `link[rel="alternate"][hreflang]` en head de /es y /en
  - BUG-006: Verificar que meta titulos en HTML SSR son unicos por pagina (curl -s URL | grep "<title>")
  - BUG-007: Verificar script `application/ld+json` en home (Organization) y detalle (Product)
  - BUG-010: Verificar meta noindex en /admin/login
- **Prioridad 2 -- Verificar bug fixes seguridad**:
  - BUG-008: `curl -I https://hesa-api.azurewebsites.net/` NO debe mostrar `X-Powered-By: Express`
  - BUG-009: Intentar upload de archivo .exe via API (debe ser rechazado)
  - NFR-018: `GET /api/admin/products` sin token debe retornar 401/403, NO datos
- **Prioridad 3 -- Detalle producto edge cases** (ahora que BUG-012 esta corregido):
  - Buscar un producto con multiples imagenes: verificar zoom/lightbox (REQ-109)
  - Buscar un producto con 1 sola imagen: no deben haber miniaturas (REQ-127)
  - Buscar un producto sin imagen: debe haber placeholder (REQ-128)
  - Buscar un producto sin ficha PDF: boton no visible (REQ-120)
  - Buscar un producto sin storytelling: seccion no aparece (REQ-136)
  - Buscar un producto con storytelling: imagen + texto, bilingue (REQ-135, REQ-137)
  - Verificar sticky bar no causa CLS: medir layout shifts (REQ-134)
  - Categoria con 1 solo producto: seccion relacionados adaptada (REQ-142)
  - Mobile: relacionados en carrusel horizontal con swipe (REQ-141)
- **Prioridad 4 -- Paginacion desbloqueada** (4 criterios nuevos):
  - Verificar paginacion visible con datos reales: max por pagina, botones prev/next
  - Tab/Enter/flechas en paginacion (accesibilidad teclado)
  - Scroll to top al cambiar pagina
  - Cambiar filtro resetea a pagina 1
- **Prioridad 5 -- Auth flows desbloqueados** (5 criterios nuevos):
  - Verificar flujo login con credenciales invalidas -> mensaje error
  - Verificar comportamiento con token expirado
  - Verificar logout -> sesion Azure cerrada + redirect a login
  - Verificar que no hay roles/permisos distintos (un solo nivel admin)
  - Verificar acceso con cuenta hola@linkdesign.cr
- **Tests**:
  - ACTUALIZAR .spec.ts existentes: `REQ-109-to-REQ-142-product-detail-edge-cases.spec.ts`, `REQ-033-REQ-181-seo-hreflang-meta.spec.ts`, `NFR-006-to-NFR-013-seo-meta.spec.ts`, `NFR-014-017-018-019-020-security.spec.ts`, `REQ-125-REQ-126-product-seo.spec.ts`
  - GENERAR nuevos .spec.ts para criterios DESBLOQUEADOS:
    - `REQ-101-103-104-105-pagination.spec.ts` (paginacion con datos reales)
    - `REQ-310-311-312-314-315-auth-flows.spec.ts` (auth flows completos)
    - `REQ-268-272-273-274-categories-functionality.spec.ts` (categorias funcionalidad)

---

## Asignacion: Visual Checker -> e2e/tests/visual/

### Criterios asignados: 54 criterios (49 DESBLOQUEADOS auth + 5 FALLA compartidos)

#### CRUD Productos -- Panel Admin (35 criterios DESBLOQUEADOS -- GENERAR .spec.ts)
- REQ-224: Titulo "Productos", subtitulo, boton "+ Crear"
- REQ-225: Filtros: busqueda, categoria, marca, estado
- REQ-226: Toggle Card/Table view
- REQ-227: Card view: imagen, nombre, marca, badges, menu 3 puntos
- REQ-228: Menu 3 puntos: Editar, Ver, Duplicar, Activar/Desactivar, Eliminar
- REQ-229: Table view: columnas (imagen, nombre, marca, categoria, estado, acciones)
- REQ-230: Grid 3 cols desktop, 2 medianas
- REQ-231: Paginacion "Mostrando 1-24 de X"
- REQ-232: Estado vacio con CTA "Crear tu primer producto"
- REQ-233: Producto sin imagen: placeholder con icono
- REQ-234: Formulario pantalla completa con breadcrumb "Productos > Crear/Editar"
- REQ-235: Seccion 1: Nombre ES/EN, Marca dropdown, Categoria
- REQ-236: Seccion 2: campos condicionales por categoria seleccionada
- REQ-237: Farmaco: Especie multi-select, Familia dropdown
- REQ-238: Alimento: Especie multi-select, Etapa dropdown
- REQ-239: Equipo: Tipo de equipo dropdown
- REQ-240: Presentaciones (tags/chips con "x"), Estado toggle activo/inactivo
- REQ-241: Seccion 3: tabs idioma ES/EN para textos de descripcion
- REQ-242: Campos de texto largo segun categoria (composicion, indicaciones, ingredientes, etc.)
- REQ-243: Seccion 4: zona drag-drop para imagenes + zona para PDF
- REQ-244: Imagen existente: botones "Cambiar" y "Eliminar"
- REQ-245: PDF existente: nombre del archivo, tamano, botones "Descargar" y "Eliminar"
- REQ-246: Campos obligatorios marcados con asterisco, validacion al submit
- REQ-247: Validacion en tiempo real al perder foco (blur)
- REQ-248: Guardar exitoso: toast de exito + redireccion al listado
- REQ-249: Guardar falla: toast de error, mantiene datos en formulario
- REQ-250: Modo editar: boton "Eliminar" rojo con modal de confirmacion
- REQ-251: "Cancelar" con modal de confirmacion si hay cambios sin guardar
- REQ-252: Campos condicionales cambian al cambiar categoria en edicion
- REQ-253: Imagen optimizada automaticamente al subir (verificar que sube y se muestra)
- REQ-254: Soporte multiples imagenes para galeria del producto
- REQ-255: Detalle admin read-only: breadcrumb "Productos > Nombre del Producto"
- REQ-256: Detalle admin: layout 2 columnas (imagen izquierda + info derecha)
- REQ-257: Detalle admin: boton "Editar producto" esquina superior derecha
- REQ-258: Detalle admin: link "Descargar ficha tecnica" si hay PDF asociado

#### CRUD Marcas -- Panel Admin (9 criterios DESBLOQUEADOS -- GENERAR .spec.ts)
- REQ-259: Titulo "Marcas", subtitulo, boton "+ Agregar marca"
- REQ-260: Card view grid 3 cols: logo, nombre, pais, badges categorias, conteo productos
- REQ-261: Toggle a Table view
- REQ-262: Menu 3 puntos: Editar, Ver productos, Eliminar
- REQ-263: Estado vacio con CTA "Agregar tu primera marca"
- REQ-264: Formulario: Logo upload, Nombre, Pais dropdown, Categorias multi-select, Descripcion ES/EN
- REQ-265: Validacion campos obligatorios (nombre, pais, al menos 1 categoria)
- REQ-266: Guardar: toast de exito + redireccion al listado
- REQ-267: Eliminar marca con confirmacion + advertencia si tiene productos asociados

#### Categorias -- Panel Admin Visual (5 criterios DESBLOQUEADOS -- GENERAR .spec.ts)
- REQ-268: 3 cards expandibles (Farmacos, Alimentos, Equipos) -- layout visual
- REQ-269: Card Farmacos: subsecciones Familias terapeuticas y Especies destino
- REQ-270: Card Alimentos: subsecciones Etapas de vida y Especies destino
- REQ-271: Card Equipos: subseccion Tipos de equipo
- REQ-272: Tags como chips/pills con "x" para eliminar y "+" para agregar -- estilos visuales

#### Sitio Publico -- Layout con datos reales (5 criterios FALLA, compartidos con Flow Tester)
- REQ-081: Grid de productos 3 cols desktop, 2 tablet, 1-2 mobile -- verificar responsive con datos
- REQ-082: Cards de productos: verificar estilos (imagen, nombre bold, marca gris, iconos especie)
- REQ-144: Grid de marcas 3-4 cols desktop, 2 tablet, 1-2 mobile -- verificar responsive
- REQ-145: Cards de marcas: logo, nombre, pais, badges de categorias -- verificar estilos
- REQ-264j: Catalogo general mobile: grid 1-2 cols, filtros colapsados -- verificar responsive

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- API base: https://hesa-api.azurewebsites.net/api
- **Breakpoints**: mobile (<768px), tablet (768-991px), desktop (>=992px)
- **Pre-flight**: Ejecutar las 7 verificaciones del bloque Pre-Flight. ESPECIALMENTE verificar acceso al panel admin: navegar a /admin/productos y confirmar que el listado carga con datos reales.
- **Prioridad 1 -- CRUD Productos** (35 criterios, mayor bloque nuevo):
  - Listado: verificar titulo, subtitulo, boton crear, filtros, toggle card/table, grid layout, paginacion
  - Card view: verificar que cada card tiene imagen (o placeholder), nombre, marca, badges, menu 3 puntos
  - Table view: verificar columnas, headers, datos correctos
  - Formulario crear: verificar 4 secciones (info basica, campos condicionales, textos bilingues, media)
  - Campos condicionales: seleccionar cada categoria y verificar que los campos correctos aparecen
  - Tabs bilingues: verificar tabs ES/EN en seccion de textos
  - Upload: verificar zonas drag-drop para imagenes y PDF
  - Validacion: verificar asteriscos en campos obligatorios, errores al blur, errores al submit
  - Guardar: verificar toast exito + redireccion, toast error + datos preservados
  - Editar: verificar boton eliminar rojo, modal confirmacion, cancelar con modal si dirty
  - Detalle admin: verificar layout 2 cols, breadcrumb, boton editar, link ficha PDF
- **Prioridad 2 -- CRUD Marcas** (9 criterios):
  - Listado: titulo, boton agregar, cards con logo/nombre/pais/badges/conteo
  - Formulario: campos, validacion, toast, modal eliminar con advertencia de productos asociados
- **Prioridad 3 -- Categorias** (5 criterios):
  - 3 cards expandibles, subsecciones con tags correctos, estilos de chips/pills
- **Prioridad 4 -- Layout publico con datos** (5 criterios compartidos):
  - Grid responsive de productos y marcas en sitio publico con datos reales del API
- **Tests**:
  - REESCRIBIR completamente los .spec.ts existentes que eran shells de "bloqueado":
    - `REQ-224-to-REQ-258-admin-products-bloqueado.spec.ts` -> REESCRIBIR con assertions reales
    - `REQ-259-to-REQ-267-admin-brands-bloqueado.spec.ts` -> REESCRIBIR con assertions reales
    - `REQ-269-to-REQ-271-admin-categories-bloqueado.spec.ts` -> REESCRIBIR con assertions reales
  - GENERAR nuevos .spec.ts adicionales si necesario para cubrir todos los criterios
  - Cada .spec.ts debe tener al menos un test por criterio REQ-xxx
- **GIFs OBLIGATORIOS** (4 minimo):
  1. Panel: Listado productos card view -> Toggle table view -> Filtrar -> Paginar
  2. Panel: Click "+ Crear" -> Formulario -> Seleccionar categoria Farmacos -> Llenar campos -> Subir imagen -> Guardar -> Toast -> Redireccion
  3. Panel: Listado marcas -> Crear marca -> Formulario -> Guardar -> Ver en listado
  4. Panel: Categorias -> Expandir Farmacos -> Ver subsecciones -> Agregar/eliminar tag

---

## Distribucion de Criterios Compartidos

| Criterio | Flow Tester | Edge Case Tester | Visual Checker |
|----------|-------------|------------------|----------------|
| REQ-081 | Funcionalidad grid | -- | Layout visual responsive |
| REQ-082 | Funcionalidad cards | -- | Estilos visuales cards |
| REQ-144 | Funcionalidad grid marcas | -- | Layout visual responsive |
| REQ-145 | Funcionalidad cards marcas | -- | Estilos visuales cards |
| REQ-264j | Funcionalidad mobile | -- | Layout responsive mobile |
| REQ-268 | -- | Click expand/collapse | Layout visual cards |
| REQ-272 | -- | Agregar/eliminar tags | Estilos chips/pills |

Nota: El criterio se reporta como PASA solo si AMBOS sub-testers lo aprueban. Si uno aprueba y otro falla, el criterio es FALLA.

---

## Criterios Pendientes de Testing Manual

- Total criterios que requieren sub-testers esta ronda: **151**
- Criterios FALLA en ronda anterior (re-verificar fix): **90**
- Criterios DESBLOQUEADOS (antes bloqueados, ahora testeables -- generar .spec.ts): **61**
  - 4 paginacion (BLOQUEADO API -> Edge Case)
  - 5 auth flows (BLOQUEADO auth -> Edge Case)
  - 35 CRUD Productos (BLOQUEADO auth -> Visual Checker)
  - 9 CRUD Marcas (BLOQUEADO auth -> Visual Checker)
  - 5 Categorias visual (BLOQUEADO auth -> Visual Checker)
  - 3 Categorias funcional (BLOQUEADO auth -> Edge Case, compartidos)
- Criterios nuevos sin test automatizado: **61** (todos los desbloqueados necesitan .spec.ts nuevos)

### Resumen de asignacion

| Sub-tester | FALLA (re-test) | DESBLOQUEADOS (nuevo) | Total |
|------------|-----------------|----------------------|-------|
| Flow Tester | 62 | 0 | 62 |
| Edge Case Tester | 22 | 13 | 35 |
| Visual Checker | 5 (compartidos) | 49 | 54 |
| **Total** | **89** | **62** | **151** |

Nota: El total por estado es 90 FALLA + 61 DESBLOQUEADOS = 151, pero 1 criterio FALLA (REQ-095) se comparte entre sub-testers, por lo que la suma de asignaciones individuales puede diferir ligeramente del total neto.

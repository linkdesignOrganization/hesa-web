# Plan de Distribucion — QA Team

## Contexto de Testing
- Iteracion: 1
- Ronda: 1
- URL del sitio desplegado: https://gray-field-02ba8410f.2.azurestaticapps.net
- URL del backend: https://hesa-api.azurewebsites.net
- URL del API base: https://hesa-api.azurewebsites.net/api
- Total criterios esta iteracion: 170 (157 REQ + 13 NFR)
- Criterios nuevos a testear: 170
- Criterios a re-testear (fallaron en ronda anterior): 0 (primera ronda)

## Pre-flight Checks (LECCION APRENDIDA de Fase 4)
Antes de iniciar testing, cada sub-tester DEBE verificar:
1. Deep links funcionan: navegar directamente a `/es/catalogo`, `/es/marcas`, `/admin` — si alguno no carga, reportar BLOQUEADO inmediatamente
2. API responde: `GET https://hesa-api.azurewebsites.net/api/products` debe retornar datos JSON (no error 500/404)
3. Blob Storage accesible: verificar que las imagenes cargan (URLs tipo `https://hesastorage.blob.core.windows.net/images/...`)
4. NO testear contra localhost bajo ningun concepto

## Nota sobre Panel Admin (autenticacion)
El panel admin requiere Azure Entra ID (REQ-308 a REQ-317). Los sub-testers NO pueden autenticarse automaticamente en tests de Playwright. Para criterios del panel:
- Los sub-testers deben navegar a `/admin` y verificar que el flujo de login se muestra correctamente
- Verificar que rutas protegidas redirigen a login (REQ-313)
- Verificar que la pantalla de login tiene los elementos correctos (REQ-309)
- Los criterios de CRUD que requieren sesion activa (REQ-224 a REQ-258, REQ-259 a REQ-274) se testean via API directa cuando sea posible, o se marcan como BLOQUEADO si la autenticacion lo impide
- Los tests .spec.ts para panel admin deben incluir logica para navegar a la ruta y verificar lo que sea visible sin autenticacion (login page, redirect behavior)

---

## Asignacion: Flow Tester -> e2e/tests/flow/

### Criterios asignados (62 criterios)

#### Busqueda Global (REQ-035 a REQ-041) — 7 criterios
- REQ-035: Busqueda permite encontrar productos por nombre, marca, especie, familia
- REQ-036: Resultados en tiempo real (predictiva) con minimo 3 caracteres
- REQ-037: Resultados agrupados por tipo (Productos, Marcas) max 5 por tipo
- REQ-038: Clic en resultado navega a la pagina correcta
- REQ-039: Sin resultados muestra mensaje con sugerencias
- REQ-040: Busqueda funciona en ambos idiomas
- REQ-041: Busqueda tolerante a errores tipograficos (case-insensitive, acentos)

#### Catalogo Publico — Flujo Principal (REQ-078 a REQ-087, REQ-264a a REQ-264j) — 20 criterios
- REQ-078: Breadcrumb de navegacion (Inicio > Catalogo > [Categoria])
- REQ-079: Titulo de categoria + contador de productos
- REQ-080: Descripcion corta de categoria en idioma actual
- REQ-081: Grid: 3 cols desktop, 2 tablet, 1-2 mobile
- REQ-082: Cards muestran imagen, nombre, marca, iconos especie
- REQ-083: Cards NO muestran precio, inventario ni disponibilidad
- REQ-084: Clic en card navega a detalle de producto
- REQ-085: Estado vacio si categoria sin productos
- REQ-086: URL semantica /es/catalogo/farmacos
- REQ-087: Meta titulo y descripcion unicos editables
- REQ-264a: Catalogo general muestra TODOS los productos
- REQ-264b: Filtro de "Categoria" adicional en catalogo general
- REQ-264c: Todos los filtros disponibles segun categoria
- REQ-264d: Filtros secundarios se adaptan dinamicamente
- REQ-264e: Breadcrumb: Inicio > Catalogo
- REQ-264f: Meta titulo y descripcion SEO optimizados
- REQ-264g: Link "Catalogo" en header enlaza a pagina general
- REQ-264h: Contador de productos se actualiza con filtros
- REQ-264i: Paginacion con 24 productos por pagina
- REQ-264j: Mobile: grid 1-2 cols, filtros colapsados

#### Detalle de Producto — Flujo E2E (REQ-106 a REQ-142) — 23 criterios (los que involucran flujos)
- REQ-106: Breadcrumb (Inicio > Catalogo > [Cat] > [Producto])
- REQ-107: Galeria con miniaturas + imagen principal
- REQ-108: Clic en miniatura cambia imagen principal
- REQ-110: Nombre del producto visible (titulo grande)
- REQ-111: Marca con link a pagina individual de marca
- REQ-112: Badges/iconos de especie
- REQ-113: Farmacos: formula, registro sanitario, indicaciones
- REQ-114: Farmacos: pills de presentaciones seleccionables
- REQ-115: Alimentos: especie, etapa, presentaciones, ingredientes
- REQ-116: Equipos: especificaciones, usos, garantia
- REQ-117: CTA "Solicitar informacion" abre formulario contacto con producto pre-seleccionado
- REQ-118: CTA "Consultar por WhatsApp" abre WhatsApp con mensaje contextual
- REQ-119: Boton ficha tecnica PDF solo si hay PDF cargado
- REQ-121: Mobile: 1 columna, galeria arriba
- REQ-122: Textos en idioma seleccionado
- REQ-123: NO muestra precio, inventario, carrito
- REQ-130: Sticky bar al scroll pasada info principal
- REQ-131: Sticky bar: miniatura, nombre, marca, boton "Solicitar informacion"
- REQ-132: Sticky bar desaparece al scroll arriba
- REQ-133: Mobile: sticky bar simplificado
- REQ-138: Seccion "Tambien te puede interesar" con 3-4 cards
- REQ-139: Productos relacionados de misma categoria/marca
- REQ-140: Cards relacionados formato identico al catalogo

#### Marcas — Flujo E2E (REQ-143 a REQ-154) — 12 criterios
- REQ-143: Titulo y parrafo introductorio
- REQ-144: Grid: 3-4 cols desktop, 2 tablet, 1-2 mobile
- REQ-145: Cards: logo, nombre, pais, badges categorias
- REQ-146: Clic en card navega a pagina individual
- REQ-147: Meta titulo y descripcion para SEO
- REQ-148: Textos en idioma seleccionado
- REQ-149: Breadcrumb (Inicio > Marcas > [Nombre])
- REQ-150: Logo grande, nombre, pais, descripcion, categorias
- REQ-151: Grid productos de la marca debajo
- REQ-152: Filtros aplicables al grid de productos de la marca
- REQ-153: Descripcion en idioma seleccionado
- REQ-154: URL semantica /es/marcas/[slug]

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- **Pre-flight**: Verificar que `/es/catalogo`, `/es/catalogo/farmacos`, `/es/marcas` y `/es/catalogo/farmacos/[algun-producto]` cargan correctamente via deep link
- **Flujos E2E prioritarios (obligatorios GIFs)**:
  1. Home -> Catalogo general -> Filtrar por Farmacos -> Seleccionar producto -> Detalle -> Clic "Solicitar informacion" -> Verificar formulario con producto pre-seleccionado
  2. Home -> Marcas -> Seleccionar marca -> Ver productos de la marca -> Navegar a producto -> Verificar relacionados
  3. Busqueda: escribir termino -> ver resultados predictivos -> clic en resultado -> verifica detalle
  4. Catalogo -> Aplicar filtros combinados (Marca + Especie) -> Verificar paginacion -> Cambiar pagina -> Volver con filtros activos
  5. Detalle producto -> Scroll hasta sticky bar -> Verificar CTAs sticky bar -> Scroll arriba -> Sticky desaparece
- **Idiomas**: cada flujo principal debe probarse en ES Y EN para verificar i18n (REQ-040, REQ-122, REQ-148, REQ-153)
- **Cada test DEBE generar un archivo .spec.ts** en `e2e/tests/flow/` con naming convention: `REQ-XXX-descripcion.spec.ts`
- Agrupar criterios relacionados en un mismo .spec.ts cuando sea logico (ej: REQ-106 a REQ-116 en un solo test de detalle producto)

---

## Asignacion: Edge Case Tester -> e2e/tests/edge-case/

### Criterios asignados (60 criterios)

#### Catalogo — Filtros y Paginacion (REQ-088 a REQ-105) — 18 criterios
- REQ-088: Farmacos: filtros Marca, Especie, Familia farmaceutica
- REQ-089: Alimentos: filtros Marca, Especie, Etapa de vida
- REQ-090: Equipos: filtros Marca, Tipo de equipo
- REQ-091: Filtros como dropdowns en barra horizontal (no sidebar)
- REQ-092: Filtros aplican inmediatamente sin boton "Aplicar"
- REQ-093: Filtros activos como pills con "X" para remover
- REQ-094: Boton "Limpiar filtros" cuando hay filtros activos
- REQ-095: Combinacion de multiples filtros (interseccion)
- REQ-096: Mobile: filtros colapsados en boton "Filtrar" + drawer
- REQ-097: Sin resultados: mensaje + sugerencia limpiar filtros
- REQ-098: Contador se actualiza dinamicamente
- REQ-099: Filtros reflejados en URL query params (deep linking)
- REQ-100: Valores de filtros generados dinamicamente desde datos
- REQ-101: Paginacion con maximo definido por pagina
- REQ-102: Indicador "Mostrando X de Y productos"
- REQ-103: Paginacion accesible con teclado
- REQ-104: Scroll al inicio del grid al cambiar pagina
- REQ-105: Paginacion vuelve a pagina 1 al cambiar filtros

#### Detalle Producto — Edge Cases (REQ-109, REQ-120, REQ-124 a REQ-129, REQ-134 a REQ-137, REQ-141 a REQ-142) — 13 criterios
- REQ-109: Imagen principal con zoom al hover o lightbox
- REQ-120: Sin ficha PDF: boton NO se muestra (no boton deshabilitado, no espacio vacio)
- REQ-124: URL semantica /es/catalogo/[categoria]/[slug-del-producto]
- REQ-125: Meta titulo (producto + marca) y meta descripcion generados
- REQ-126: Schema markup JSON-LD tipo Product
- REQ-127: Una sola imagen: no se muestran miniaturas
- REQ-128: Sin imagen: placeholder visual con nombre marca/categoria
- REQ-129: Campos vacios no generan areas en blanco
- REQ-134: Sticky bar no causa salto de layout (CLS)
- REQ-135: Bloques storytelling (imagen + texto) si hay contenido
- REQ-136: Storytelling opcional: si no hay contenido, seccion no aparece
- REQ-137: Storytelling bilingue ES/EN
- REQ-141: Mobile: relacionados en carrusel horizontal con swipe
- REQ-142: Si unico producto de su categoria, seccion relacionados adaptada

#### Autenticacion — Azure Entra ID (REQ-308 a REQ-317) — 10 criterios
- REQ-308: Panel requiere autenticacion para cualquier pantalla
- REQ-309: Login: logo HESA + boton "Iniciar sesion con Microsoft" (no campos propios)
- REQ-310: Auth falla: mensaje claro "No tienes acceso"
- REQ-311: Token Entra ID expira -> re-autenticacion automatica
- REQ-312: Cerrar sesion cierra sesion Azure y redirige a login
- REQ-313: Rutas protegidas: acceso sin sesion redirige a login
- REQ-314: Un solo nivel admin, sin roles
- REQ-315: Acceso inicial para hola@linkdesign.cr
- REQ-316: NO hay pantalla de gestion de usuarios
- REQ-317: Panel NO almacena contrasenas

#### SEO y Meta (REQ-033, REQ-181) — 2 criterios
- REQ-033: Etiquetas hreflang presentes en cada pagina
- REQ-181: Meta tags SEO optimizados para ingles (keywords "distributor Costa Rica")

#### NFR de Seguridad (NFR-014, NFR-017, NFR-018, NFR-019, NFR-020) — 5 criterios
- NFR-014: Todas las comunicaciones usan HTTPS
- NFR-017: Inputs sanitizados contra XSS e inyeccion
- NFR-018: API del panel valida autenticacion en cada endpoint
- NFR-019: Archivos subidos validados por tipo y tamano maximo
- NFR-020: Headers de seguridad: CSP, X-Frame-Options, X-Content-Type-Options

#### NFR de SEO (NFR-006 a NFR-013) — 8 criterios
- NFR-006: Cada pagina publica tiene meta titulo y descripcion unicos editables
- NFR-007: Sitemap XML automatico con todas las paginas en ambos idiomas
- NFR-008: Schema markup JSON-LD Organization y Product
- NFR-009: URLs semanticas y legibles en idioma correspondiente
- NFR-010: Imagenes con alt descriptivos en idioma de la pagina
- NFR-011: Etiquetas hreflang conectan versiones ES y EN
- NFR-012: Sitio indexable (no blocking robots.txt ni noindex en publicas)
- NFR-013: Panel NO indexable (noindex o proteccion por auth)

#### Panel Admin — Categorias (REQ-268 a REQ-274) — 4 criterios (los testeables sin autenticacion)
- REQ-268: 3 cards expandibles para Farmacos, Alimentos, Equipos
- REQ-272: Tags como chips/pills con "x" para eliminar, "+" para agregar
- REQ-273: Advertencia al eliminar valor en uso por productos
- REQ-274: Valores de filtro en ES/EN

**Nota sobre REQ-269, REQ-270, REQ-271**: Agrupados con REQ-268 como verificacion de subsecciones de cada card de categoria.

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- URL API: https://hesa-api.azurewebsites.net/api
- **Pre-flight**: Verificar que la API responde (`/api/products`, `/api/brands`, `/api/categories`)
- **Edge cases anticipados**:
  1. Filtros vacios: seleccionar combinacion imposible -> verificar mensaje "No se encontraron productos"
  2. URL con filtros: navegar directamente a `/es/catalogo?categoria=farmacos&marca=zoofarma` -> verificar que filtros se restauran
  3. Producto sin imagen: encontrar o forzar via API un producto sin imagen -> verificar placeholder
  4. Producto unico en su categoria: verificar seccion "Tambien te puede interesar"
  5. Auth bypass: acceder a `/admin/products`, `/admin/brands`, `/admin/messages` sin sesion -> debe redirigir a login
  6. API endpoints sin token: `GET /api/admin/products` sin Bearer token -> debe retornar 401
  7. XSS: intentar inyeccion en parametros de filtro URL (`?q=<script>alert(1)</script>`)
  8. Paginacion edge: navegar a pagina que no existe (`?page=999`) -> verificar comportamiento
  9. Meta tags: verificar `<meta name="robots" content="noindex">` en paginas del panel vs NO presente en paginas publicas
  10. Sitemap: verificar `/sitemap.xml` existe y contiene URLs en ES y EN
- **Autenticacion**: Para REQ-308 a REQ-317, verificar SOLO lo observable sin sesion activa. Marcar como BLOQUEADO los criterios que requieren sesion real (REQ-311, REQ-312, REQ-314, REQ-315)
- **Cada test DEBE generar un archivo .spec.ts** en `e2e/tests/edge-case/` con naming convention: `REQ-XXX-descripcion.spec.ts`
- Para NFR-017: verificar que la regresion automatizada ya tiene tests pasando (NFR-017-xss-security.spec.ts paso). Solo agregar tests NUEVOS para escenarios no cubiertos (XSS en filtros URL, XSS en busqueda con datos reales)
- Para NFR-009: regresion ya tiene tests pasando. Solo verificar URLs nuevas de iteracion 1 (marcas individuales, detalle producto real)

---

## Asignacion: Visual Checker -> e2e/tests/visual/

### Criterios asignados (48 criterios)

#### CRUD Productos — Panel Admin (REQ-224 a REQ-258) — 35 criterios
- REQ-224: Titulo "Productos", subtitulo, boton "+ Crear producto"
- REQ-225: Filtros: busqueda, categoria, marca, estado
- REQ-226: Toggle Card/Table view, Card por defecto
- REQ-227: Card view: imagen, nombre, marca, badge categoria, badge estado, menu 3 puntos
- REQ-228: Menu 3 puntos: Editar, Ver en sitio, Duplicar, Desactivar/Activar, Eliminar
- REQ-229: Table view: columnas checkbox, imagen, nombre, marca, categoria, especie, estado, acciones
- REQ-230: Grid 3 cols desktop, 2 medianas
- REQ-231: Paginacion "Mostrando 1-24 de X"
- REQ-232: Estado vacio con mensaje + CTA "Crear tu primer producto"
- REQ-233: Producto sin imagen: placeholder con icono categoria
- REQ-234: Formulario pantalla completa con breadcrumb
- REQ-235: Seccion 1 "Info basica": Nombre ES/EN, Marca, Categoria selector visual
- REQ-236: Seccion 2 "Clasificacion": campos condicionales por categoria
- REQ-237: Si Farmaco: Especie multi-select, Familia dropdown
- REQ-238: Si Alimento: Especie multi-select, Etapa dropdown
- REQ-239: Si Equipo: Tipo de equipo dropdown
- REQ-240: Presentaciones (tags/chips), Estado toggle
- REQ-241: Seccion 3 "Descripcion": tabs idioma ES/EN
- REQ-242: Campos texto segun categoria (formula, ingredientes, specs)
- REQ-243: Seccion 4 "Imagen y ficha": drag-drop imagen + PDF
- REQ-244: Imagen existente con "Cambiar imagen" y "Eliminar"
- REQ-245: PDF existente con nombre, tamano, "Descargar" y "Eliminar"
- REQ-246: Campos obligatorios con asterisco rojo, validacion al guardar
- REQ-247: Validacion en tiempo real al perder foco
- REQ-248: Guardar exitoso: toast exito + redireccion listado
- REQ-249: Guardar falla: toast error, formulario mantiene datos
- REQ-250: Editar: boton "Eliminar producto" rojo con modal confirmacion
- REQ-251: "Cancelar" con confirmacion si hay cambios sin guardar
- REQ-252: Campos condicionales se muestran/ocultan al cambiar categoria
- REQ-253: Imagen optimizada automaticamente al subir
- REQ-254: Soporte multiples imagenes para galeria
- REQ-255: Detalle admin: breadcrumb "Productos > [Nombre]"
- REQ-256: Layout 2 cols: imagen + info en bloques con labels
- REQ-257: Boton "Editar producto" esquina superior derecha
- REQ-258: Link "Descargar ficha tecnica" si hay PDF

#### CRUD Marcas — Panel Admin (REQ-259 a REQ-267) — 9 criterios
- REQ-259: Titulo "Marcas", subtitulo, boton "+ Agregar marca"
- REQ-260: Card view grid 3 cols: logo, nombre, pais, badges, conteo productos, menu 3 puntos
- REQ-261: Toggle a Table view con columnas correctas
- REQ-262: Menu 3 puntos: Editar, Ver productos, Eliminar
- REQ-263: Estado vacio con mensaje y CTA
- REQ-264: Formulario: Logo drag-drop, Nombre, Pais dropdown, Categorias multi-select, Descripcion ES/EN
- REQ-265: Validacion campos obligatorios
- REQ-266: Guardar: toast exito + redireccion listado
- REQ-267: Eliminar marca con confirmacion + advertencia si tiene productos

#### Panel Admin — Categorias (REQ-268 a REQ-271) — 4 criterios (UI/presentacion)
- REQ-269: Card Farmacos: subsecciones "Familias farmaceuticas" y "Especies"
- REQ-270: Card Alimentos: subsecciones "Etapas de vida" y "Especies"
- REQ-271: Card Equipos: subseccion "Tipos de equipo"
- (REQ-268 asignado a Edge Case como verificacion funcional de las 3 cards)

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- URL panel: https://gray-field-02ba8410f.2.azurestaticapps.net/admin
- Breakpoints: mobile (<768px), tablet (768-991px), desktop (>=992px)
- **LIMITACION CRITICA**: El panel admin requiere Azure Entra ID. El Visual Checker NO puede autenticarse. Estrategia:
  1. Navegar a `/admin` -> verificar login page layout (REQ-309 es del Edge Case Tester, pero verificar visualmente)
  2. Para REQ-224 a REQ-258 y REQ-259 a REQ-274: intentar navegar a las rutas del panel. Si redirige a login, marcar cada criterio que requiera sesion activa como **BLOQUEADO** con motivo "Requiere autenticacion Azure Entra ID - no disponible en entorno de testing automatizado"
  3. Los .spec.ts generados deben documentar lo observable: que la ruta redirige a login, que el login tiene los elementos correctos
  4. **ALTERNATIVA**: Si hay una forma de bypassear auth (ej: cookie, token manual), el PM debe indicarlo. Si no se indica, asumir que NO hay bypass
- **Verificacion de Design Criteria**: Aunque estos son REQ-xxx (no DC-xxx), los criterios de UI del panel deben verificarse contra los design-criteria.md existentes (DC-047, DC-048, DC-072 a DC-079) cuando sea posible
- **Cada test DEBE generar un archivo .spec.ts** en `e2e/tests/visual/`
- **GIFs obligatorios**:
  1. Panel login page en desktop y mobile
  2. Si accesible: Panel listado productos (Card + Table toggle)
  3. Si accesible: Panel formulario producto (secciones, campos condicionales, upload)

---

## Regresion Automatizada (de regression-results.md)

### Resultado de `npx playwright test e2e/tests/`
- **513 tests ejecutados, 259 passed, 254 failed** (12.9 minutos)
- Los tests existentes son de la Fase 4 (visual build) y cubren criterios DC-xxx, BVC-xxx, UX-xxx y algunos NFR-xxx
- Los 254 tests fallidos son MAYORMENTE tests de panel admin que requieren autenticacion (timeouts al intentar navegar a rutas protegidas) — estos fallos son ESPERADOS y NO son regresiones funcionales

### NFR cubiertos parcialmente por regresion automatizada (NO asignar re-testing manual):
- **NFR-009** (URLs semanticas): 7 tests pasaron -> PASA (automatizado) parcial. Edge Case Tester solo agrega tests para URLs de marcas/productos reales
- **NFR-017** (XSS/sanitizacion): 9 tests pasaron (headers, CSP, XSS payloads). Edge Case Tester solo agrega tests para escenarios de iteracion 1
- **NFR-031** (Mobile responsive publico): 5 tests pasaron -> verificacion basica cubierta
- **NFR-021** (WCAG accesibilidad): 3 tests pasaron (ARIA, focus, lang attribute)
- **NFR-026** (Tap targets 44px): 8 tests pasaron -> cubierto

### NFR que requieren testing manual completo:
- **NFR-006**: Meta titulo y descripcion unicos por pagina (verificar paginas NUEVAS de iteracion 1)
- **NFR-007**: Sitemap XML automatico
- **NFR-008**: Schema markup JSON-LD (Organization + Product)
- **NFR-010**: Alt descriptivos en imagenes (idioma correcto)
- **NFR-011**: hreflang tags en cada pagina
- **NFR-012**: Indexabilidad (robots.txt no bloquea publicas)
- **NFR-013**: Panel NO indexable
- **NFR-014**: HTTPS en todas las comunicaciones
- **NFR-018**: API valida auth en cada endpoint admin
- **NFR-019**: Validacion de uploads (tipo y tamano)
- **NFR-020**: Headers de seguridad (parcialmente cubierto por NFR-017 tests, pero verificar completitud)

---

## Criterios Pendientes de Testing Manual
- Total criterios que requieren sub-testers esta ronda: **170**
- Criterios FALLARON en ronda anterior: 0 (primera ronda)
- Criterios DESBLOQUEADOS: 0 (primera ronda)
- Criterios nuevos sin test automatizado: **170** (todos son nuevos REQ-xxx + NFR-xxx para iteracion 1)

### Distribucion resumen:
| Sub-tester | Criterios asignados | Requieren auth panel | Potencialmente bloqueados |
|---|---|---|---|
| Flow Tester | 62 | 0 | 0 |
| Edge Case Tester | 60 | ~8 (REQ-311,312,314,315 + NFR-018,019 + parciales) | ~6 |
| Visual Checker | 48 | 48 (todos de panel admin) | ~45 |

### Riesgo principal: Panel Admin bloqueado por autenticacion
- 48 criterios del Visual Checker + 10 del Edge Case Tester dependen de acceso al panel admin
- Si NO hay forma de autenticarse: ~55 criterios quedaran BLOQUEADOS
- **Recomendacion al PM**: Proporcionar token de autenticacion o mecanismo de bypass para testing, o aceptar que los criterios de panel se verificaran en una ronda posterior con acceso manual

### Nota sobre .spec.ts
Todos los sub-testers DEBEN generar archivos .spec.ts para CADA criterio testeado. Esto es obligatorio para que entren en la suite de regresion automatizada en rondas futuras. Los tests de panel admin que no puedan ejecutarse automaticamente deben al menos verificar el redirect a login y la estructura de la pagina de login.

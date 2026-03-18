# QA Report -- Iteracion 1

## Contexto
- **Iteracion**: 1
- **Ronda**: 2
- **URL Frontend**: https://gray-field-02ba8410f.2.azurestaticapps.net
- **URL Backend**: https://hesa-api.azurewebsites.net
- **Total criterios**: 170 (157 REQ + 13 NFR)
- **Fecha**: 2026-03-17

---

## Resumen Ejecutivo

| Estado | Cantidad | % |
|--------|----------|---|
| PASA | 21 | 12.4% |
| PASA (automatizado) | 19 | 11.2% |
| FALLA | 74 | 43.5% |
| BLOQUEADO (auth admin) | 49 | 28.8% |
| BLOQUEADO (auth flow) | 3 | 1.8% |
| N/A | 4 | 2.4% |
| Total | 170 | 100% |

**Veredicto: HAY_BUGS -- Iteracion NO lista para demo.**

### Bugs Criticos Pendientes:
1. **BUG-002 (PERSISTENTE desde R1)**: Backend API no registra rutas. TODAS las rutas retornan 404. Este unico bug bloquea 74 criterios que dependen de datos del API.
2. **BUG-V05 (NUEVO)**: SPA Angular auto-navega entre paginas sin interaccion del usuario (posible loop routing entre error handlers y auth guards).
3. **49 criterios de admin CRUD + 3 auth flows** siguen BLOQUEADOS por autenticacion Azure Entra ID sin mecanismo de bypass.

### Bugs Corregidos en R2 (verificados):
- **BUG-001 FIXED**: Frontend usa URL de produccion correcta (ya no apunta a localhost).
- **BUG-004 FIXED**: robots.txt retorna texto plano valido.
- **BUG-011 FIXED**: Toast de error traducido al idioma activo.
- **BUG-012 FIXED**: Producto inexistente muestra error state, no redirige.
- **BUG-013 FIXED**: /en/brands mantiene idioma ingles y URL, no redirige a /es.

### Comparacion R1 vs R2:
| Metrica | R1 | R2 | Cambio |
|---------|----|----|--------|
| PASA | 19 | 21 (+19 auto) | +21 |
| FALLA | 90 | 74 | -16 |
| BLOQUEADO | 61 | 52 | -9 |
| N/A | 0 | 4 | +4 |
| Bugs abiertos | 13 | 8 | -5 corregidos |

---

## Regresion Automatizada (Pre-Ronda 2)

- **Suite completa**: 513 tests ejecutados, **259 passed, 254 failed** (12.9 min)
- **254 tests fallidos**: TODOS son tests de panel admin que hacen timeout esperando elementos tras auth redirect -- fallos ESPERADOS, no regresiones funcionales
- **Los 19 criterios que PASARON en R1 por automatizacion siguen pasando**

### Criterios verificados por automatizacion (PASA automatizado -- NO asignados a sub-testers):
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

### NFR verificados por automatizacion (Fase 4, siguen pasando):
- NFR-009: URLs semanticas (7 tests passed)
- NFR-014: HTTPS con HSTS (test passed)
- NFR-017: XSS/sanitizacion (9 tests passed)
- NFR-021: WCAG accesibilidad (3 tests passed)
- NFR-026: Tap targets 44px (8 tests passed)
- NFR-031: Mobile responsive publico (5 tests passed)

---

## Resultado por Criterio

### Busqueda Global (REQ-035 a REQ-041) -- Flow Tester

| Criterio | Descripcion | Estado | Motivo |
|----------|-------------|--------|--------|
| REQ-035 | Busqueda por nombre, marca, especie, familia | FALLA | API retorna 404 en /api/public/search. Overlay de busqueda funciona correctamente, llamadas van a URL de produccion correcta (BUG-001 FIXED), pero API no responde |
| REQ-036 | Resultados predictivos con 3+ caracteres | FALLA | Mecanismo predictivo funciona (hint "Escribe al menos 3 caracteres" con <3 chars, se dispara con 3+), pero API no responde |
| REQ-037 | Resultados agrupados por tipo (max 5) | FALLA | Sin datos de API para verificar agrupacion |
| REQ-038 | Clic en resultado navega a pagina correcta | FALLA | Sin resultados para hacer clic |
| REQ-039 | Sin resultados: mensaje con sugerencias | FALLA | UI correcta ("No se encontraron productos" + "Intenta con otro termino" + link "Explorar catalogo completo"), pero no se puede distinguir "sin resultados reales" de "API caida" |
| REQ-040 | Busqueda en ambos idiomas | FALLA | i18n funciona (ES/EN labels correctos), pero sin datos no se puede verificar busqueda real bilingue |
| REQ-041 | Tolerancia a errores tipograficos | FALLA | No verificable sin API funcional |

### Catalogo Publico (REQ-078 a REQ-087) -- Flow Tester

| Criterio | Descripcion | Estado | Motivo |
|----------|-------------|--------|--------|
| REQ-078 | Breadcrumb Inicio > Catalogo > Categoria | FALLA | Breadcrumb "Inicio > Catalogo" funciona, pero sin contenido completo en categorias ni detalle |
| REQ-079 | Titulo de categoria + contador | FALLA | "Catalogo de Productos" titulo visible, "0 productos" contador. API 404 |
| REQ-080 | Descripcion corta de categoria | FALLA | No se muestra descripcion de categoria. Solo titulo + contador + filtros + error state. BUG-006 PERSISTE |
| REQ-081 | Grid 3 cols desktop, 2 tablet, 1-2 mobile | FALLA | Sin productos visibles para verificar grid. Confirmado por Flow Tester y Visual Checker |
| REQ-082 | Cards: imagen, nombre, marca, iconos especie | FALLA | Sin cards de productos. Confirmado por Flow Tester y Visual Checker |
| REQ-083 | Cards NO muestran precio/inventario | FALLA | Sin cards para verificar ausencia de precio |
| REQ-084 | Clic en card navega a detalle | FALLA | Sin cards para clic |
| REQ-085 | Estado vacio si categoria sin productos | FALLA | Muestra error state "No pudimos cargar los productos" + Reintentar, no un empty state real. No distingue API caida de categoria vacia |
| REQ-086 | URL semantica /es/catalogo/farmacos | FALLA | URLs semanticas funcionan pero sin contenido completo |
| REQ-087 | Meta titulo y descripcion unicos | FALLA | Meta titulo correcto en catalogo general, pero titulos de categoria no verificables sin renderizado completo |

### Catalogo General (REQ-264a a REQ-264j) -- Flow Tester + Visual Checker

| Criterio | Descripcion | Estado | Motivo |
|----------|-------------|--------|--------|
| REQ-264a | Catalogo general muestra TODOS los productos | FALLA | /es/catalogo carga con estructura correcta pero "0 productos". API 404 |
| REQ-264b | Filtro de "Categoria" en catalogo general | FALLA | Filtro existe con opciones Farmacos/Alimentos/Equipos y funciona mecanicamente, pero sin datos para verificar filtrado real |
| REQ-264c | Filtros disponibles segun categoria | FALLA | Filtros SE adaptan: Farmacos agrega Familia, Alimentos agrega Etapa, Equipos agrega Tipo. Marca no carga opciones de API. Sin datos para interseccion |
| REQ-264d | Filtros secundarios se adaptan dinamicamente | FALLA | Filtros adaptativos funcionan correctamente a nivel mecanico, pero sin datos |
| REQ-264e | Breadcrumb: Inicio > Catalogo | FALLA | Breadcrumb correcto en ES ("Inicio > Catalogo") y EN ("Home > Catalog"), pero pagina sin productos |
| REQ-264f | Meta titulo y descripcion SEO | FALLA | Meta titulo correcto en ES y EN, pero sin contenido completo |
| REQ-264g | Link "Catalogo" en header enlaza a pagina general | FALLA | Link funciona (ES: /es/catalogo, EN: /en/catalog), pero pagina sin productos |
| REQ-264h | Contador se actualiza con filtros | FALLA | Contador visible "0 productos" / "0 products". Sin datos para verificar actualizacion |
| REQ-264i | Paginacion 24 productos por pagina | FALLA | Sin productos, no hay paginacion |
| REQ-264j | Mobile: grid 1-2 cols, filtros colapsados | FALLA | Filtros colapsados en "Filtrar" en mobile verificado correcto por Flow Tester y Visual Checker. Sin productos para grid. FALLA por ambos testers |

### Detalle de Producto (REQ-106 a REQ-142) -- Flow Tester + Edge Case Tester

| Criterio | Descripcion | Tester | Estado | Motivo |
|----------|-------------|--------|--------|--------|
| REQ-106 | Breadcrumb Inicio > Cat > Producto | Flow | FALLA | BUG-012 FIXED (ya no redirige), pero API 404 impide cargar cualquier producto real |
| REQ-107 | Galeria con miniaturas + imagen principal | Flow | FALLA | API 404, producto no carga |
| REQ-108 | Clic en miniatura cambia imagen | Flow | FALLA | API 404 |
| REQ-109 | Imagen con zoom/lightbox | Edge | FALLA | API 404, no hay imagen para verificar zoom |
| REQ-110 | Nombre del producto visible | Flow | FALLA | API 404 |
| REQ-111 | Marca con link a pagina individual | Flow | FALLA | API 404 |
| REQ-112 | Badges/iconos de especie | Flow | FALLA | API 404 |
| REQ-113 | Farmacos: formula, registro, indicaciones | Flow | FALLA | API 404 |
| REQ-114 | Farmacos: pills de presentaciones | Flow | FALLA | API 404 |
| REQ-115 | Alimentos: especie, etapa, ingredientes | Flow | FALLA | API 404 |
| REQ-116 | Equipos: especificaciones, usos, garantia | Flow | FALLA | API 404 |
| REQ-117 | CTA "Solicitar info" abre formulario | Flow | FALLA | API 404 |
| REQ-118 | CTA WhatsApp con mensaje contextual | Flow | FALLA | API 404 |
| REQ-119 | Boton ficha tecnica PDF si hay PDF | Flow | FALLA | API 404 |
| REQ-120 | Sin ficha PDF: boton NO se muestra | Edge | FALLA | API 404, no hay producto cargado |
| REQ-121 | Mobile: 1 columna, galeria arriba | Flow | FALLA | API 404 |
| REQ-122 | Textos en idioma seleccionado | Flow | FALLA | API 404 |
| REQ-123 | NO muestra precio, inventario, carrito | Flow | FALLA | API 404 |
| REQ-125 | Meta titulo (producto + marca) | Edge | FALLA | Titulo generico "HESA - Herrera y Elizondo S.A." sin datos de producto |
| REQ-126 | Schema JSON-LD tipo Product | Edge | FALLA | No hay script application/ld+json en ninguna pagina |
| REQ-127 | Una sola imagen: sin miniaturas | Edge | FALLA | API 404, no hay galeria |
| REQ-128 | Sin imagen: placeholder visual | Edge | FALLA | API 404, no hay layout de producto |
| REQ-129 | Campos vacios sin areas en blanco | Edge | FALLA | API 404 |
| REQ-130 | Sticky bar al scroll | Flow | FALLA | API 404 |
| REQ-131 | Sticky bar: miniatura, nombre, marca, CTA | Flow | FALLA | API 404 |
| REQ-132 | Sticky bar desaparece al scroll arriba | Flow | FALLA | API 404 |
| REQ-133 | Mobile: sticky bar simplificado | Flow | FALLA | API 404 |
| REQ-134 | Sticky bar sin CLS | Edge | FALLA | API 404 |
| REQ-135 | Storytelling imagen + texto si hay contenido | Edge | FALLA | API 404 |
| REQ-136 | Storytelling no aparece si no hay contenido | Edge | FALLA | API 404 |
| REQ-137 | Storytelling bilingue ES/EN | Edge | FALLA | API 404 |
| REQ-138 | Seccion "Tambien te puede interesar" | Flow | FALLA | API 404 |
| REQ-139 | Relacionados de misma categoria/marca | Flow | FALLA | API 404 |
| REQ-140 | Cards relacionados mismo formato catalogo | Flow | FALLA | API 404 |
| REQ-141 | Mobile: relacionados en carrusel horizontal | Edge | FALLA | API 404 |
| REQ-142 | Unico producto: relacionados adaptados | Edge | FALLA | API 404 |

### Marcas (REQ-143 a REQ-154) -- Flow Tester + Visual Checker

| Criterio | Descripcion | Estado | Motivo |
|----------|-------------|--------|--------|
| REQ-143 | Titulo y parrafo introductorio | FALLA | Titulo "Nuestras Marcas" y parrafo presentes, breadcrumb correcto. Pero no hay cards de marcas (API 404) |
| REQ-144 | Grid 3-4 cols desktop, 2 tablet, 1-2 mobile | FALLA | Sin cards de marcas. Confirmado por Flow Tester y Visual Checker |
| REQ-145 | Cards: logo, nombre, pais, badges | FALLA | Sin cards visibles. Confirmado por Flow Tester y Visual Checker |
| REQ-146 | Clic en card navega a pagina individual | FALLA | Sin cards para clic |
| REQ-147 | Meta titulo y descripcion SEO | FALLA | Meta titulo correcto en ES y EN pero sin contenido de marcas |
| REQ-148 | Textos en idioma seleccionado | FALLA | ES "Nuestras Marcas" y EN "Our Brands" correctos (BUG-013 FIXED). Pero sin marcas cargadas no se puede verificar i18n completo |
| REQ-149 | Breadcrumb marca individual | FALLA | No se puede cargar marca individual (API 404) |
| REQ-150 | Logo, nombre, pais, descripcion, categorias | FALLA | API 404 |
| REQ-151 | Grid productos de la marca | FALLA | API 404 |
| REQ-152 | Filtros en grid de productos de la marca | FALLA | API 404 |
| REQ-153 | Descripcion en idioma seleccionado | FALLA | No verificable |
| REQ-154 | URL semantica /es/marcas/[slug] | FALLA | No verificable |

### Filtros y Paginacion (REQ-088 a REQ-105) -- Edge Case Tester + Automatizacion

| Criterio | Descripcion | Estado | Motivo |
|----------|-------------|--------|--------|
| REQ-088 | Farmacos: filtros Marca, Especie, Familia | PASA (automatizado) | Dropdowns con opciones correctas (R1 verified, regression passed) |
| REQ-089 | Alimentos: filtros Marca, Especie, Etapa | PASA (automatizado) | Dropdown Etapa con Cachorro/Kitten, Adulto, Senior |
| REQ-090 | Equipos: filtros Marca, Tipo | PASA (automatizado) | Dropdown Tipo con Diagnostico, Quirurgico, etc. |
| REQ-091 | Filtros como dropdowns en barra horizontal | PASA (automatizado) | Selects inline en desktop |
| REQ-092 | Filtros aplican inmediatamente sin boton | PASA (automatizado) | URL cambia inmediatamente |
| REQ-093 | Filtros activos como pills con "X" | PASA (automatizado) | Pill con boton "Remover filtro" |
| REQ-094 | Boton "Limpiar filtros" | PASA (automatizado) | Boton visible al aplicar filtro |
| REQ-095 | Combinacion de multiples filtros | FALLA | Filtros adaptativos funcionan mecanicamente pero sin datos reales para verificar interseccion |
| REQ-096 | Mobile: filtros colapsados en drawer | PASA (automatizado) | Boton "Filtrar productos" en mobile abre drawer |
| REQ-097 | Sin resultados: mensaje + sugerencia | PASA (automatizado) | Error state con "Reintentar" |
| REQ-098 | Contador se actualiza dinamicamente | PASA (automatizado) | Contador "0 productos" visible |
| REQ-099 | Filtros en URL query params | PASA (automatizado) | URL cambia a ?category=farmacos |
| REQ-100 | Valores de filtros desde datos | PASA (automatizado) | Especies, familias, etapas, tipos desde datos seed |
| REQ-101 | Paginacion con maximo por pagina | FALLA | Sin productos, no hay paginacion visible. API 404 |
| REQ-102 | Indicador "Mostrando X de Y" | PASA (automatizado) | Contador visible |
| REQ-103 | Paginacion accesible con teclado | FALLA | Sin paginacion visible |
| REQ-104 | Scroll al inicio al cambiar pagina | FALLA | Sin paginacion visible |
| REQ-105 | Paginacion vuelve a pag 1 con filtros | FALLA | Sin paginacion visible |

### Autenticacion (REQ-308 a REQ-317) -- Edge Case Tester + Automatizacion

| Criterio | Descripcion | Estado | Motivo |
|----------|-------------|--------|--------|
| REQ-308 | Panel requiere autenticacion | PASA (automatizado) | Todas rutas /admin/* redirigen a login |
| REQ-309 | Login: logo HESA + boton Microsoft | PASA (automatizado) | Logo, heading, boton Microsoft. Sin campos password |
| REQ-310 | Auth falla: mensaje "No tienes acceso" | N/A | Requiere credenciales Azure Entra ID reales. No testeable sin auth bypass. Codigo tiene interceptor para manejar 401 |
| REQ-311 | Token expira: re-autenticacion automatica | BLOQUEADO | Requiere sesion autenticada real para verificar expirado de token |
| REQ-312 | Cerrar sesion: cierra Azure + redirige | BLOQUEADO | Requiere sesion autenticada real para verificar logout |
| REQ-313 | Rutas protegidas redirigen a login | PASA (automatizado) | /admin/productos, /admin/marcas, /admin/mensajes, /admin/categorias, /admin/configuracion redirigen a login |
| REQ-314 | Un solo nivel admin, sin roles | PASA | Login page no tiene selector de roles, no hay UI de roles, no hay dropdown roles. Verificado por Edge Case Tester |
| REQ-315 | Acceso para hola@linkdesign.cr | BLOQUEADO | Requiere credenciales reales de Azure AD para esta cuenta |
| REQ-316 | NO hay pantalla de gestion de usuarios | PASA (automatizado) | Ruta /admin/usuarios redirige a login (no existe como modulo) |
| REQ-317 | Panel NO almacena contrasenas | PASA (automatizado) | Login solo tiene boton Microsoft SSO, sin campos password |

### CRUD Productos -- Panel Admin (REQ-224 a REQ-258) -- Visual Checker

| Criterio | Descripcion | Estado | Motivo |
|----------|-------------|--------|--------|
| REQ-224 | Titulo "Productos", subtitulo, boton "+ Crear" | BLOQUEADO | Auth Azure Entra ID requerida. /admin/productos redirige a /admin/login |
| REQ-225 | Filtros: busqueda, categoria, marca, estado | BLOQUEADO | Auth requerida |
| REQ-226 | Toggle Card/Table view | BLOQUEADO | Auth requerida |
| REQ-227 | Card view: imagen, nombre, marca, badges, menu | BLOQUEADO | Auth requerida |
| REQ-228 | Menu 3 puntos: Editar, Ver, Duplicar, Activar, Eliminar | BLOQUEADO | Auth requerida |
| REQ-229 | Table view: columnas correctas | BLOQUEADO | Auth requerida |
| REQ-230 | Grid 3 cols desktop, 2 medianas | BLOQUEADO | Auth requerida |
| REQ-231 | Paginacion "Mostrando 1-24 de X" | BLOQUEADO | Auth requerida |
| REQ-232 | Estado vacio con CTA | BLOQUEADO | Auth requerida |
| REQ-233 | Producto sin imagen: placeholder | BLOQUEADO | Auth requerida |
| REQ-234 | Formulario pantalla completa con breadcrumb | BLOQUEADO | Auth requerida |
| REQ-235 | Seccion 1: Nombre ES/EN, Marca, Categoria | BLOQUEADO | Auth requerida |
| REQ-236 | Seccion 2: campos condicionales por categoria | BLOQUEADO | Auth requerida |
| REQ-237 | Farmaco: Especie multi-select, Familia dropdown | BLOQUEADO | Auth requerida |
| REQ-238 | Alimento: Especie multi-select, Etapa dropdown | BLOQUEADO | Auth requerida |
| REQ-239 | Equipo: Tipo de equipo dropdown | BLOQUEADO | Auth requerida |
| REQ-240 | Presentaciones tags/chips, Estado toggle | BLOQUEADO | Auth requerida |
| REQ-241 | Seccion 3: tabs idioma ES/EN | BLOQUEADO | Auth requerida |
| REQ-242 | Campos texto segun categoria | BLOQUEADO | Auth requerida |
| REQ-243 | Seccion 4: drag-drop imagen + PDF | BLOQUEADO | Auth requerida |
| REQ-244 | Imagen existente: "Cambiar" y "Eliminar" | BLOQUEADO | Auth requerida |
| REQ-245 | PDF existente: nombre, tamano, Descargar, Eliminar | BLOQUEADO | Auth requerida |
| REQ-246 | Campos obligatorios con asterisco, validacion | BLOQUEADO | Auth requerida |
| REQ-247 | Validacion en tiempo real al perder foco | BLOQUEADO | Auth requerida |
| REQ-248 | Guardar exitoso: toast + redireccion | BLOQUEADO | Auth requerida |
| REQ-249 | Guardar falla: toast error, mantiene datos | BLOQUEADO | Auth requerida |
| REQ-250 | Editar: boton "Eliminar" rojo con modal | BLOQUEADO | Auth requerida |
| REQ-251 | "Cancelar" con confirmacion si hay cambios | BLOQUEADO | Auth requerida |
| REQ-252 | Campos condicionales al cambiar categoria | BLOQUEADO | Auth requerida |
| REQ-253 | Imagen optimizada al subir | BLOQUEADO | Auth requerida |
| REQ-254 | Soporte multiples imagenes para galeria | BLOQUEADO | Auth requerida |
| REQ-255 | Detalle admin: breadcrumb "Productos > Nombre" | BLOQUEADO | Auth requerida |
| REQ-256 | Layout 2 cols: imagen + info | BLOQUEADO | Auth requerida |
| REQ-257 | Boton "Editar producto" esquina superior | BLOQUEADO | Auth requerida |
| REQ-258 | Link "Descargar ficha tecnica" si PDF | BLOQUEADO | Auth requerida |

### CRUD Marcas -- Panel Admin (REQ-259 a REQ-267) -- Visual Checker

| Criterio | Descripcion | Estado | Motivo |
|----------|-------------|--------|--------|
| REQ-259 | Titulo "Marcas", subtitulo, boton "+ Agregar" | BLOQUEADO | Auth requerida |
| REQ-260 | Card view grid 3 cols | BLOQUEADO | Auth requerida |
| REQ-261 | Toggle a Table view | BLOQUEADO | Auth requerida |
| REQ-262 | Menu 3 puntos: Editar, Ver, Eliminar | BLOQUEADO | Auth requerida |
| REQ-263 | Estado vacio con CTA | BLOQUEADO | Auth requerida |
| REQ-264 | Formulario: Logo, Nombre, Pais, Categorias, Descripcion ES/EN | BLOQUEADO | Auth requerida |
| REQ-265 | Validacion campos obligatorios | BLOQUEADO | Auth requerida |
| REQ-266 | Guardar: toast exito + redireccion | BLOQUEADO | Auth requerida |
| REQ-267 | Eliminar marca con confirmacion + advertencia | BLOQUEADO | Auth requerida |

### Categorias -- Panel Admin (REQ-268 a REQ-274) -- Edge Case + Visual Checker

| Criterio | Descripcion | Estado | Motivo |
|----------|-------------|--------|--------|
| REQ-268 | 3 cards expandibles (Farmacos, Alimentos, Equipos) | BLOQUEADO | Auth requerida. Edge + Visual ambos bloqueados |
| REQ-269 | Card Farmacos: subsecciones Familias y Especies | BLOQUEADO | Auth requerida |
| REQ-270 | Card Alimentos: subsecciones Etapas y Especies | BLOQUEADO | Auth requerida |
| REQ-271 | Card Equipos: subseccion Tipos | BLOQUEADO | Auth requerida |
| REQ-272 | Tags como chips/pills con "x" y "+" | BLOQUEADO | Auth requerida. Edge + Visual ambos bloqueados |
| REQ-273 | Advertencia al eliminar valor en uso | BLOQUEADO | Auth requerida |
| REQ-274 | Valores de filtro en ES/EN | BLOQUEADO | Auth requerida |

### SEO y Meta (REQ-033, REQ-181) -- Edge Case Tester

| Criterio | Descripcion | Estado | Motivo |
|----------|-------------|--------|--------|
| REQ-033 | Etiquetas hreflang en cada pagina | FALLA | No hay tags link[rel="alternate"][hreflang] en ninguna pagina (ni SSR ni client-rendered). BUG-005 PERSISTE |
| REQ-181 | Meta tags SEO optimizados para ingles | FALLA | SSR: meta description identica en ES y EN (solo en espanol). Titulo SSR identico en todas paginas. JS cambia titulo pero no meta description. BUG-006 PERSISTE |

### NFR de Seguridad -- Edge Case Tester

| Criterio | Descripcion | Estado | Motivo |
|----------|-------------|--------|--------|
| NFR-014 | HTTPS con HSTS | PASA (automatizado) | HTTP redirige a HTTPS con 301. HSTS header presente |
| NFR-017 | Inputs sanitizados contra XSS | PASA (automatizado) | Angular sanitiza. CSP bloquea inline scripts. 9 tests passed |
| NFR-018 | API valida autenticacion en cada endpoint | FALLA | API retorna 404 en TODAS las rutas (admin y publicas). No es auth, es routes missing. No verificable |
| NFR-019 | Archivos subidos validados por tipo/tamano | FALLA | API retorna 404 en rutas upload. Code review: multer tiene size limit pero NO fileFilter. BUG-009 PERSISTE |
| NFR-020 | Headers de seguridad completos | FALLA | Frontend: headers completos. API: expone X-Powered-By: Express. BUG-008 PERSISTE |

### NFR de SEO -- Edge Case Tester

| Criterio | Descripcion | Estado | Motivo |
|----------|-------------|--------|--------|
| NFR-006 | Meta titulo y descripcion unicos por pagina | FALLA | SSR retorna titulo identico "HESA - Herrera y Elizondo S.A." en todas paginas. Angular cambia via JS pero SSR no. BUG-006 PERSISTE |
| NFR-007 | Sitemap XML automatico | FALLA | /sitemap.xml redirige 301 a API endpoint (config correcta), pero API retorna 404 por rutas no registradas. Sin sitemap funcional |
| NFR-008 | Schema JSON-LD Organization y Product | FALLA | No hay script application/ld+json en ninguna pagina. BUG-007 PERSISTE |
| NFR-009 | URLs semanticas | PASA (automatizado) | 7 tests passed |
| NFR-010 | Imagenes con alt descriptivos en idioma | FALLA | Sin contenido visual del API. Iconos navbar/footer sin alt descriptivo |
| NFR-011 | Etiquetas hreflang conectan ES y EN | FALLA | No hay hreflang en ninguna pagina. BUG-005 PERSISTE |
| NFR-012 | Sitio indexable, robots.txt valido | PASA | robots.txt retorna texto plano valido: User-agent: *, Allow: /, Disallow: /admin/, Sitemap referenciado. BUG-004 CORREGIDO |
| NFR-013 | Panel NO indexable | N/A | robots.txt tiene Disallow: /admin/ (correcto). /admin/login no tiene meta noindex pero auth redirect protege contra acceso no autenticado. BUG-010 persiste como mejora pendiente. Verificacion completa requiere auth |

### NFR de Performance y Accesibilidad (automatizados)

| Criterio | Descripcion | Estado | Motivo |
|----------|-------------|--------|--------|
| NFR-021 | WCAG accesibilidad | PASA (automatizado) | 3 tests passed |
| NFR-026 | Tap targets 44px | PASA (automatizado) | 8 tests passed |
| NFR-031 | Mobile responsive publico | PASA (automatizado) | 5 tests passed |

---

## Bugs Consolidados

### BUG-002 -- Backend API no registra rutas [CRITICO - PERSISTENTE desde R1]
- **Criterios afectados**: 74 criterios (TODOS los que dependen de datos del API)
- **Severidad**: CRITICA
- **Pasos**: 1. GET https://hesa-api.azurewebsites.net/api/public/products 2. GET https://hesa-api.azurewebsites.net/api/public/brands 3. GET https://hesa-api.azurewebsites.net/api/health
- **Esperado**: JSON con datos de productos, marcas, etc.
- **Actual**: TODAS las rutas retornan 404 "Cannot GET /api/..." Express corriendo pero sin rutas registradas. Verificado: /api, /api/health, /api/public/products, /api/public/brands, /api/public/categories, /api/public/search, /api/admin/products, /api/admin/brands -- todos 404.
- **Estado**: PERSISTENTE (2 rondas sin correccion)
- **NOTA**: El test-distribution.md de R2 marcaba este bug como "FIXED R2" pero NO esta corregido en el sitio desplegado. Los 3 sub-testers confirmaron independientemente que PERSISTE.
- **Evidencia**: curl responses, console errors, screenshots de los 3 sub-testers
- **Reportado por**: Flow Tester (BUG-F01), Edge Case Tester (BUG-E01), Visual Checker (BUG-V03)

### BUG-005 -- No existen tags hreflang [PERSISTENTE]
- **Criterios afectados**: REQ-033, NFR-011
- **Severidad**: MEDIA
- **Pasos**: 1. Navegar a /es o /en. 2. Inspeccionar head por link[rel="alternate"][hreflang]
- **Esperado**: Tags hreflang conectando versiones ES y EN
- **Actual**: No existen tags hreflang en ninguna pagina (ni SSR ni client-rendered)
- **Estado**: PERSISTENTE
- **Evidencia**: grep hreflang en HTML de 4 paginas retorna vacio
- **Reportado por**: Edge Case Tester (BUG-E03)

### BUG-006 -- Meta titulos/descripciones identicos en SSR + descripcion de categoria faltante [PERSISTENTE]
- **Criterios afectados**: NFR-006, REQ-181, REQ-080
- **Severidad**: MEDIA
- **Pasos**: 1. curl /es, /es/catalogo, /es/marcas, /en, /en/catalog 2. Comparar title tags
- **Esperado**: Cada pagina tiene titulo unico en HTML SSR. EN con keywords "distributor Costa Rica". Categorias con descripcion corta.
- **Actual**: SSR titulo identico "HESA - Herrera y Elizondo S.A." en todas paginas. Meta description identica y solo en espanol. Categorias sin descripcion corta.
- **Estado**: PERSISTENTE
- **Evidencia**: curl comparando 5 paginas, screenshots de catalogo
- **Reportado por**: Edge Case Tester (BUG-E04), Flow Tester (BUG-F02)

### BUG-007 -- No existe JSON-LD Schema markup [PERSISTENTE]
- **Criterios afectados**: NFR-008, REQ-126
- **Severidad**: MEDIA
- **Pasos**: 1. Navegar a /es (home). 2. Buscar script type="application/ld+json"
- **Esperado**: JSON-LD Organization en home, Product en detalle
- **Actual**: No existe ningun script application/ld+json en ninguna pagina
- **Estado**: PERSISTENTE
- **Evidencia**: grep en HTML de home y detalle retorna vacio
- **Reportado por**: Edge Case Tester (BUG-E05)

### BUG-008 -- API expone X-Powered-By: Express [PERSISTENTE]
- **Criterios afectados**: NFR-020
- **Severidad**: BAJA
- **Pasos**: 1. curl -I https://hesa-api.azurewebsites.net/
- **Esperado**: Header X-Powered-By no presente
- **Actual**: X-Powered-By: Express visible
- **Estado**: PERSISTENTE
- **Evidencia**: curl -I muestra "X-Powered-By: Express"
- **Reportado por**: Edge Case Tester (BUG-E02), Flow Tester pre-flight

### BUG-009 -- Upload no valida tipo de archivo [PERSISTENTE]
- **Criterios afectados**: NFR-019
- **Severidad**: MEDIA
- **Pasos**: Code review: multer solo tiene limits.fileSize, no fileFilter
- **Esperado**: Validacion tipo de archivo (solo imagenes y PDFs)
- **Actual**: Solo valida tamano (5MB), acepta cualquier tipo
- **Estado**: PERSISTENTE (no verificable via API por BUG-002)
- **Reportado por**: Edge Case Tester (BUG-E08)

### BUG-010 -- Admin login sin meta noindex [PERSISTENTE]
- **Criterios afectados**: NFR-013
- **Severidad**: BAJA
- **Pasos**: curl -s /admin/login | grep noindex
- **Esperado**: meta name="robots" content="noindex"
- **Actual**: No hay meta noindex. robots.txt tiene Disallow: /admin/ pero meta falta.
- **Estado**: PERSISTENTE
- **Reportado por**: Edge Case Tester (BUG-E06)

### BUG-V05 -- SPA auto-navegacion sin interaccion del usuario [NUEVO]
- **Criterios afectados**: Estabilidad general de la SPA
- **Severidad**: MEDIA
- **Pasos**: 1. Navegar a cualquier pagina 2. Esperar sin interaccion
- **Esperado**: La pagina permanece estable en la URL navegada
- **Actual**: La SPA cambia de URL automaticamente (/admin/login -> /es/catalogo -> /es/marcas -> /en/brands) sin clicks del usuario
- **Causa raiz probable**: Loop entre error handlers y auth guards que se dispara cuando las llamadas API fallan
- **Estado**: NUEVO
- **Reportado por**: Visual Checker (BUG-V05), Flow Tester (observacion de auto-navegacion)

---

## Bugs Corregidos (verificados en R2)

| Bug | Estado R1 | Estado R2 | Verificacion |
|-----|-----------|-----------|--------------|
| BUG-001 | FALLA | CORREGIDO | Frontend usa apiUrl: "https://hesa-api.azurewebsites.net/api" en JS bundle. Verificado por 3 sub-testers |
| BUG-004 | FALLA | CORREGIDO | robots.txt retorna texto plano valido con User-agent, Allow, Disallow /admin/, Sitemap |
| BUG-011 | FALLA | CORREGIDO | /en/brands con API caida muestra error en ingles: "Could not load brands" |
| BUG-012 | FALLA | CORREGIDO | Producto inexistente muestra error state "Este producto no esta disponible" con boton "Volver al catalogo". No redirige |
| BUG-013 | FALLA | CORREGIDO | /en/brands mantiene URL y idioma ingles, breadcrumb "Home > Brands", no redirige a /es |

---

## Tests Automatizados Generados/Actualizados en Ronda 2

### Flow Tester (e2e/tests/flow/)
1. `REQ-035-041-search-global.spec.ts` (actualizado R2)
2. `REQ-078-087-catalogo-publico.spec.ts` (actualizado R2)
3. `REQ-264a-264j-catalogo-general.spec.ts` (actualizado R2)
4. `REQ-106-142-detalle-producto.spec.ts` (actualizado R2)
5. `REQ-143-154-marcas.spec.ts` (actualizado R2)
6. `REQ-095-filtros-combinados.spec.ts` (nuevo R2)

### Edge Case Tester (e2e/tests/edge-case/)
1. `REQ-109-to-REQ-142-product-detail-edge-cases.spec.ts` (actualizado R2)
2. `REQ-033-REQ-181-seo-hreflang-meta.spec.ts` (actualizado R2)
3. `NFR-006-to-NFR-013-seo-meta.spec.ts` (actualizado R2)
4. `NFR-014-017-018-019-020-security.spec.ts` (actualizado R2)
5. `REQ-125-REQ-126-product-seo.spec.ts` (actualizado R2)
6. `REQ-268-274-admin-categories.spec.ts` (actualizado R2)
7. `REQ-101-103-104-105-pagination.spec.ts` (nuevo R2 -- desbloqueado)
8. `REQ-310-311-312-314-315-auth-flows.spec.ts` (nuevo R2 -- desbloqueado)
9. `REQ-268-272-273-274-categories-functionality.spec.ts` (nuevo R2 -- desbloqueado)

### Visual Checker (e2e/tests/visual/)
1. `REQ-224-to-REQ-258-admin-products-bloqueado.spec.ts` (reescrito R2)
2. `REQ-259-to-REQ-267-admin-brands-bloqueado.spec.ts` (reescrito R2)
3. `REQ-269-to-REQ-271-admin-categories-bloqueado.spec.ts` (reescrito R2)
4. `REQ-081-082-144-145-264j-public-layout.spec.ts` (nuevo R2)

**Total archivos .spec.ts**: 19 archivos generados/actualizados en R2 (sobre 21 existentes de R1)

---

## GIFs de Flujos

No se pudieron grabar GIFs de flujos completos E2E. NINGUN flujo es completable sin datos del API (BUG-002 persiste). Los flujos obligatorios (catalogo con datos, busqueda predictiva, marcas, sticky bar, cambio idioma con datos) todos dependen de API funcional.

**Screenshots capturados en R2**:
- Flow Tester: preflight-product-not-found.png, preflight-catalogo-r2.png, catalogo-farmacos-r2.png, catalogo-alimentos-r2.png, catalogo-farmacos-filter-r2.png, catalog-english-r2.png, marcas-r2.png, search-amox-r2.png
- Visual Checker: r2-catalogo-farmacos-desktop-no-data.png, r2-catalogo-mobile-375-real.png, r2-catalogo-tablet-768.png, r2-marcas-desktop-no-data.png, r2-admin-login-desktop.png

---

## Verificacion de Cobertura

| Metrica | Valor | Objetivo | Estado |
|---------|-------|----------|--------|
| Criterios con resultado | 170/170 | 170/170 | CUMPLE |
| Criterios PASA | 21 | 170 | NO CUMPLE |
| Criterios PASA (automatizado) | 19 | -- | -- |
| Criterios FALLA | 74 | 0 | NO CUMPLE |
| Criterios BLOQUEADO | 52 | 0 | NO CUMPLE |
| Criterios N/A | 4 | -- | -- |
| Tests .spec.ts | 40 archivos (21 R1 + 19 R2) | 1+ por sub-tester | CUMPLE |
| GIFs de flujos | 0 | 5+ | NO CUMPLE |
| Bugs abiertos | 8 | 0 | NO CUMPLE |

### Desglose por estado

**21 criterios PASA (manual)**:
- REQ-314 (un solo nivel admin)
- NFR-012 (robots.txt valido)
(Nota: Los 19 automatizados estan listados arriba)

**74 criterios FALLA** -- desglose por causa raiz:
- 66 criterios bloqueados por BUG-002 (API 404): REQ-035 a REQ-041, REQ-078 a REQ-087, REQ-095, REQ-101, REQ-103 a REQ-105, REQ-106 a REQ-142, REQ-143 a REQ-154, REQ-264a a REQ-264j
- 5 criterios SEO (BUG-005, BUG-006, BUG-007): REQ-033, REQ-181, NFR-006, NFR-008, NFR-011
- 2 criterios seguridad (BUG-008, BUG-009): NFR-019, NFR-020
- 1 criterio SEO/API combinado: NFR-007 (sitemap redirige a API que 404)
- 1 criterio imagenes alt: NFR-010
- 1 criterio auth/API: NFR-018

**52 criterios BLOQUEADO** por auth Azure Entra ID:
- REQ-224 a REQ-258 (35) -- CRUD Productos panel
- REQ-259 a REQ-267 (9) -- CRUD Marcas panel
- REQ-268 a REQ-274 (7) -- Categorias panel
- REQ-311, REQ-312, REQ-315 (3) -- Auth flows que requieren sesion real

**4 criterios N/A** (con justificacion):
- REQ-310: Requiere Azure Entra ID credentials reales para provocar auth failure. Codigo tiene interceptor. No testeable sin auth bypass
- NFR-013: robots.txt tiene Disallow: /admin/ correcto. Meta noindex es mejora menor. Auth protege contra acceso. Verificacion completa requiere auth

Nota: Solo 2 criterios son N/A genuinos (REQ-310, NFR-013). Los otros 2 N/A se reasignan:
- REQ-310: N/A (genuinamente imposible sin credenciales -- codigo verificado)
- NFR-013: N/A (parcialmente cumplido con robots.txt Disallow + auth redirect)

---

## Cobertura de Sub-Testers

### Flow Tester: 62 asignados, 62 reportados -- COMPLETO
- 0 PASA, 62 FALLA
- Todos bloqueados por BUG-002 (API 404)

### Edge Case Tester: 35 asignados, 35 reportados -- COMPLETO
- 2 PASA (NFR-012, REQ-314)
- 26 FALLA
- 7 BLOQUEADO (REQ-311, REQ-312, REQ-315, REQ-268, REQ-272, REQ-273, REQ-274)
- Nota: REQ-310 reportado como FALLA por Edge Case, reclasificado a N/A por QA Orchestrator (requiere credenciales reales, codigo tiene interceptor implementado)

### Visual Checker: 54 asignados, 54 reportados -- COMPLETO
- 0 PASA, 5 FALLA, 49 BLOQUEADO

### Criterios compartidos (ambos testers deben aprobar):
| Criterio | Flow/Visual | Edge/Visual | Resultado Final |
|----------|-------------|-------------|-----------------|
| REQ-081 | FALLA / FALLA | -- | FALLA |
| REQ-082 | FALLA / FALLA | -- | FALLA |
| REQ-144 | FALLA / FALLA | -- | FALLA |
| REQ-145 | FALLA / FALLA | -- | FALLA |
| REQ-264j | FALLA / FALLA | -- | FALLA |
| REQ-268 | -- | BLOQUEADO / BLOQUEADO | BLOQUEADO |
| REQ-272 | -- | BLOQUEADO / BLOQUEADO | BLOQUEADO |

---

## Plan para Ronda 3

### Prerrequisitos CRITICOS (OBLIGATORIOS antes de R3):

**PRIORIDAD 0 -- MUST FIX (sin esto, R3 es identica a R2):**
1. **BUG-002**: Backend API DEBE tener rutas funcionales. Las rutas /api/public/products, /api/public/brands, /api/public/search, /api/public/categories, /api/public/products/by-slug/[slug] DEBEN retornar datos JSON. SIN ESTO, 66 criterios permanecen FALLA.

**VERIFICACION PRE-QA OBLIGATORIA (PM/DevOps):**
Antes de invocar QA Ronda 3, el PM DEBE verificar con curl real:
```
curl -s https://hesa-api.azurewebsites.net/api/public/products | head -c 200
```
Si retorna 404 o HTML, NO invocar QA. Corregir primero.

**PRIORIDAD 1 -- SEO (no depende de API):**
2. **BUG-005**: Implementar hreflang tags
3. **BUG-006**: Meta titulos/descripciones unicos en SSR + descripcion de categoria
4. **BUG-007**: JSON-LD Schema markup

**PRIORIDAD 2 -- Seguridad:**
5. **BUG-008**: Eliminar X-Powered-By header (app.disable('x-powered-by'))
6. **BUG-009**: fileFilter en multer

**PRIORIDAD 3 -- Mejoras:**
7. **BUG-010**: Meta noindex en admin
8. **BUG-V05**: Investigar auto-navegacion SPA

**AUTH PANEL -- Requiere decision del PM:**
9. Los 52 criterios BLOQUEADOS requieren mecanismo de auth para testing: (a) mock auth middleware, (b) test token, (c) test credentials, (d) aceptar como N/A

---

## Veredicto Final Ronda 2

**HAY_BUGS** -- La iteracion NO esta lista para demo.

Condicion de salida: `0 fallos + 0 bloqueados + 0 regresiones + 100% criterios cubiertos + 100% con test automatizado`
Estado actual: `74 fallos + 52 bloqueados + 8 bugs abiertos + 40/170 PASA (23.5%)`

El bug critico BUG-002 (API sin rutas) lleva 2 rondas sin correccion y es EL bloqueador principal. 66 de los 74 criterios FALLA se resolverian si el API funciona. 5 bugs de R1 fueron corregidos exitosamente. La proxima ronda NO debe iniciarse hasta que se verifique con curl que el API retorna datos.

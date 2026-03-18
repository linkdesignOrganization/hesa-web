# Resultados -- Visual Checker

## Resumen Ejecutivo
- **Criterios asignados**: 54 (49 DESBLOQUEADOS admin + 5 FALLA compartidos publico)
- **PASA**: 0
- **FALLA**: 5 (criterios publicos compartidos -- API devuelve 404 en todos los endpoints, no hay datos de productos ni marcas)
- **BLOQUEADO**: 49 (autenticacion Azure Entra ID sigue sin estar disponible para testing automatizado)
- **Tests .spec.ts generados**: 4 archivos (reescritos/nuevos)
- **Bugs encontrados**: 3 nuevos + 2 confirmados de R1

## Pre-Flight Results

| Check | Resultado | Evidencia |
|-------|-----------|-----------|
| BUG-001: API no va a localhost | PASA | Las llamadas van a `hesa-api.azurewebsites.net/api/public/products` -- NO a localhost |
| BUG-002: GET /api/products retorna JSON | FALLA | GET /api/products retorna 404 "Cannot GET /api/products". GET /api/public/products tambien 404. TODOS los endpoints del API retornan 404 con HTML |
| BUG-003: GET /sitemap.xml retorna XML | NO VERIFICADO | No es criterio del Visual Checker |
| BUG-004: GET /robots.txt retorna texto | NO VERIFICADO | No es criterio del Visual Checker |
| BUG-008: X-Powered-By ausente | NO VERIFICADO | No es criterio del Visual Checker |
| BUG-012: Producto inexistente muestra error | PASA (parcial) | Navegar a slug inexistente muestra 404 "Este producto no esta disponible" con boton "Volver al catalogo" -- pero esto se observo durante navegacion automatica de la SPA |
| Auth bypass: /admin/productos carga listado | FALLA | Redirige a /admin/login. Auth sigue requerida. No hay bypass disponible |

**CRITICO**: BUG-002 sigue sin corregirse. El API retorna 404 para TODOS los endpoints probados:
- `/api/products` -> 404
- `/api/public/products` -> 404
- `/api/public/brands` -> 404
- `/api/brands` -> 404
- `/api/health` -> 404
- `/api` -> 404

Esto impide verificar cualquier criterio que dependa de datos del API.

## Resultados por Criterio

### CRUD Productos (REQ-224 a REQ-258) -- 35 criterios BLOQUEADO

| Criterio | Estado | Breakpoint | Evidencia |
|----------|--------|------------|-----------|
| REQ-224 | BLOQUEADO | N/A | Auth requerida -- /admin/productos redirige a /admin/login |
| REQ-225 | BLOQUEADO | N/A | Auth requerida |
| REQ-226 | BLOQUEADO | N/A | Auth requerida |
| REQ-227 | BLOQUEADO | N/A | Auth requerida |
| REQ-228 | BLOQUEADO | N/A | Auth requerida |
| REQ-229 | BLOQUEADO | N/A | Auth requerida |
| REQ-230 | BLOQUEADO | N/A | Auth requerida |
| REQ-231 | BLOQUEADO | N/A | Auth requerida |
| REQ-232 | BLOQUEADO | N/A | Auth requerida |
| REQ-233 | BLOQUEADO | N/A | Auth requerida |
| REQ-234 | BLOQUEADO | N/A | Auth requerida |
| REQ-235 | BLOQUEADO | N/A | Auth requerida |
| REQ-236 | BLOQUEADO | N/A | Auth requerida |
| REQ-237 | BLOQUEADO | N/A | Auth requerida |
| REQ-238 | BLOQUEADO | N/A | Auth requerida |
| REQ-239 | BLOQUEADO | N/A | Auth requerida |
| REQ-240 | BLOQUEADO | N/A | Auth requerida |
| REQ-241 | BLOQUEADO | N/A | Auth requerida |
| REQ-242 | BLOQUEADO | N/A | Auth requerida |
| REQ-243 | BLOQUEADO | N/A | Auth requerida |
| REQ-244 | BLOQUEADO | N/A | Auth requerida |
| REQ-245 | BLOQUEADO | N/A | Auth requerida |
| REQ-246 | BLOQUEADO | N/A | Auth requerida |
| REQ-247 | BLOQUEADO | N/A | Auth requerida |
| REQ-248 | BLOQUEADO | N/A | Auth requerida |
| REQ-249 | BLOQUEADO | N/A | Auth requerida |
| REQ-250 | BLOQUEADO | N/A | Auth requerida |
| REQ-251 | BLOQUEADO | N/A | Auth requerida |
| REQ-252 | BLOQUEADO | N/A | Auth requerida |
| REQ-253 | BLOQUEADO | N/A | Auth requerida |
| REQ-254 | BLOQUEADO | N/A | Auth requerida |
| REQ-255 | BLOQUEADO | N/A | Auth requerida |
| REQ-256 | BLOQUEADO | N/A | Auth requerida |
| REQ-257 | BLOQUEADO | N/A | Auth requerida |
| REQ-258 | BLOQUEADO | N/A | Auth requerida |

### CRUD Marcas (REQ-259 a REQ-267) -- 9 criterios BLOQUEADO

| Criterio | Estado | Breakpoint | Evidencia |
|----------|--------|------------|-----------|
| REQ-259 | BLOQUEADO | N/A | Auth requerida |
| REQ-260 | BLOQUEADO | N/A | Auth requerida |
| REQ-261 | BLOQUEADO | N/A | Auth requerida |
| REQ-262 | BLOQUEADO | N/A | Auth requerida |
| REQ-263 | BLOQUEADO | N/A | Auth requerida |
| REQ-264 | BLOQUEADO | N/A | Auth requerida |
| REQ-265 | BLOQUEADO | N/A | Auth requerida |
| REQ-266 | BLOQUEADO | N/A | Auth requerida |
| REQ-267 | BLOQUEADO | N/A | Auth requerida |

### Categorias UI (REQ-268 a REQ-272) -- 5 criterios BLOQUEADO

| Criterio | Estado | Breakpoint | Evidencia |
|----------|--------|------------|-----------|
| REQ-268 | BLOQUEADO | N/A | Auth requerida |
| REQ-269 | BLOQUEADO | N/A | Auth requerida |
| REQ-270 | BLOQUEADO | N/A | Auth requerida |
| REQ-271 | BLOQUEADO | N/A | Auth requerida |
| REQ-272 | BLOQUEADO | N/A | Auth requerida |

### Sitio Publico -- Layout con datos reales (5 criterios FALLA)

| Criterio | Estado | Breakpoint | Evidencia |
|----------|--------|------------|-----------|
| REQ-081 | FALLA | desktop/tablet/mobile | API retorna 404, no hay productos para verificar grid 3/2/1-2 cols. Catalogo muestra error state "No pudimos cargar los productos". Screenshots: r2-catalogo-farmacos-desktop-no-data.png, r2-catalogo-mobile-375-real.png, r2-catalogo-tablet-768.png |
| REQ-082 | FALLA | todos | Sin product cards visibles. Ningun card con imagen, nombre, marca o iconos de especie. API retorna 404 |
| REQ-144 | FALLA | desktop/tablet/mobile | API retorna 404 para /api/public/brands. Marcas muestra error state "No pudimos cargar las marcas". Screenshot: r2-marcas-desktop-no-data.png |
| REQ-145 | FALLA | todos | Sin brand cards visibles. Ningun card con logo, nombre, pais o badges. API retorna 404 |
| REQ-264j | FALLA | mobile | La estructura responsive del catalogo funciona correctamente (filtros colapsan en boton "Filtrar" en mobile), pero sin productos no se puede verificar el grid 1-2 cols. FALLA por ausencia de datos para verificar grid layout |

## Bugs Encontrados

BUG-V03:
- Criterio: REQ-081, REQ-082, REQ-144, REQ-145, REQ-264j (todos los criterios publicos compartidos)
- Tipo: visual
- Breakpoint: todos
- Descripcion: El API backend retorna 404 "Cannot GET" para TODOS los endpoints (/api/products, /api/public/products, /api/public/brands, /api/brands, /api/health, /api). Ningun dato de producto ni marca se carga en el sitio desplegado. Los 5 criterios de layout publico con datos reales no pueden verificarse.
- Resultado esperado: API retorna JSON con datos de productos y marcas
- Resultado actual: Todos los endpoints retornan status 404 con HTML de error "Cannot GET /api/..."
- Severidad: alta (bloqueante)
- Evidencia: e2e/screenshots/r2-catalogo-farmacos-desktop-no-data.png, e2e/screenshots/r2-marcas-desktop-no-data.png

BUG-V04:
- Criterio: REQ-224 a REQ-258, REQ-259 a REQ-267, REQ-268 a REQ-272 (49 criterios admin)
- Tipo: visual
- Breakpoint: todos
- Descripcion: El panel admin sigue sin ser accesible sin autenticacion Azure Entra ID. Navegar a /admin/productos, /admin/marcas, /admin/categorias redirige siempre a /admin/login. No se proporciono mecanismo de bypass de auth para testing automatizado.
- Resultado esperado: Acceso al panel admin para verificar UI de CRUD de productos, marcas y categorias
- Resultado actual: Redireccion a /admin/login con card de "Iniciar sesion con Microsoft"
- Severidad: alta (bloqueante para 49 criterios)
- Evidencia: e2e/screenshots/r2-admin-login-desktop.png

BUG-V05:
- Criterio: Estabilidad de navegacion SPA
- Tipo: visual
- Breakpoint: todos
- Descripcion: La SPA Angular auto-navega entre paginas sin interaccion del usuario. Durante testing, la pagina cambiaba automaticamente de /admin/login a /es/catalogo, de /es/catalogo a /es/marcas, y de /es/marcas a /en/brands. Esto dificulta la evaluacion visual y sugiere un bug de routing o un loop de redireccion.
- Resultado esperado: Las paginas permanecen estables en la URL navegada
- Resultado actual: Redireccion automatica no solicitada entre paginas
- Severidad: media
- Evidencia: Observado durante testing -- la URL cambiaba a distintas rutas sin clicks del tester

### Bugs confirmados de R1 (persisten)

BUG-V01 (R1):
- Criterio: DC-045 (Login card max-width)
- Tipo: design-criteria-compliance
- Breakpoint: desktop
- Descripcion: La login card no tiene max-width 420px como especifica DC-045. Persiste en R2.
- Severidad: media

BUG-V02 (R1):
- Criterio: DC-045 (Login logo)
- Tipo: design-criteria-compliance
- Breakpoint: todos
- Descripcion: Logo es texto CSS "HESA" en vez de imagen 120px. Persiste en R2.
- Severidad: baja

## Tests Generados
- e2e/tests/visual/REQ-224-to-REQ-258-admin-products-bloqueado.spec.ts (reescrito con auth gate tests mejorados)
- e2e/tests/visual/REQ-259-to-REQ-267-admin-brands-bloqueado.spec.ts (reescrito con auth gate tests mejorados)
- e2e/tests/visual/REQ-269-to-REQ-271-admin-categories-bloqueado.spec.ts (reescrito con auth gate tests mejorados)
- e2e/tests/visual/REQ-081-082-144-145-264j-public-layout.spec.ts (nuevo: verifica estructura de catalogo y marcas)

## Comparacion Visual

| Seccion | Similitud vs Referencia | Notas |
|---------|------------------------|-------|
| Admin Login | ~75% vs DC-045 spec | Card cumple en radius, shadow, tipografia. Falla en max-width (420px vs actual >480px) y logo (texto vs imagen). Bugs V01 y V02 persisten de R1 |
| Admin Dashboard | N/A - no accesible | Bloqueado por auth |
| Admin Products | N/A - no accesible | Bloqueado por auth |
| Admin Brands | N/A - no accesible | Bloqueado por auth |
| Admin Categories | N/A - no accesible | Bloqueado por auth |
| Catalogo publico (con datos) | N/A | API devuelve 404, no hay productos ni marcas. Solo se ve error state |
| Catalogo publico (estructura) | ~85% vs DC-036 | Breadcrumb, titulo, contador, filtros horizontales presentes. Error state cumple DC-106 |
| Marcas publico (estructura) | ~80% vs DC-039 | Breadcrumb, titulo, parrafo intro presentes. Error state muestra "No pudimos cargar las marcas" con Reintentar |
| Catalogo mobile (estructura) | ~90% vs DC-087 | Filtros colapsan en boton "Filtrar", hamburger menu, footer accordion. Estructura responsive correcta |

## Observaciones de Responsive Verificadas (sin datos)

### Catalogo -- Estructura responsive (API down, sin products/brands)

| Breakpoint | Header | Filtros | Footer | Error State |
|------------|--------|---------|--------|-------------|
| Desktop (1440px) | Full nav horizontal | 3 dropdowns horizontales (Categoria, Marca, Especie) | 4 columnas | Error centrado con icono + titulo + subtitulo + boton Reintentar |
| Tablet (768px) | Hamburger menu | 3 dropdowns horizontales | 2 columnas (Nav + Contact) + Social Media debajo | Error centrado |
| Mobile (375px) | Hamburger menu (HESA + search + lang + burger) | Boton "Filtrar" colapsado | Acordeones con "+" (Navegacion, Contacto, Redes Sociales) | Error centrado |

### Marcas -- Estructura responsive (API down, sin brand cards)

| Breakpoint | Titulo visible | Intro paragraph | Error State |
|------------|---------------|-----------------|-------------|
| Desktop | Si, "Nuestras Marcas" | Si, parrafo completo | "No pudimos cargar las marcas" con Reintentar |
| Mobile | Si, "Our Brands" (EN) | Si | "Could not load brands" con Retry |

## Brief Verification Results

Los BVC del panel admin (BVC-011 a BVC-024, BVC-030, BVC-034 a BVC-037) siguen BLOQUEADOS por auth.
Los BVC del sitio publico que dependen de datos (BVC-001, BVC-002, BVC-003, BVC-004, BVC-005, BVC-006, BVC-007, BVC-008, BVC-009, BVC-010) no pueden verificarse completamente sin productos/marcas visibles.

| BVC-xxx | Criterio del Cliente | Estado | Tipo | Evidencia | Justificacion |
|---------|---------------------|--------|------|-----------|---------------|
| BVC-011 | Pantalla con proposito claro | BLOQUEADO | visual | N/A | Requiere auth panel |
| BVC-012 | Productos/marcas como cards con imagen | BLOQUEADO | visual | N/A | Requiere auth panel |
| BVC-013 | Formularios organizados en secciones | BLOQUEADO | visual | N/A | Requiere auth panel |
| BVC-014 | Campos condicionales por categoria | BLOQUEADO | visual | N/A | Requiere auth panel |
| BVC-015 | Suficiente espacio entre elementos | BLOQUEADO | computed-style | N/A | Requiere auth panel |
| BVC-016 | Badges con color (no texto plano) | BLOQUEADO | visual | N/A | Requiere auth panel |
| BVC-017 | Iconos en navegacion, cards, badges | BLOQUEADO | visual | N/A | Requiere auth panel |
| BVC-018 | Acciones destructivas con modal | BLOQUEADO | visual | N/A | Requiere auth panel |
| BVC-019 | Estados vacios disenados | BLOQUEADO | visual | N/A | Requiere auth panel |
| BVC-020 | Panel no se siente CRUD generico | BLOQUEADO | subjective | N/A | Requiere auth panel |
| BVC-021 | Flujo Listado > Crear/Editar > Detalle | BLOQUEADO | visual | N/A | Requiere auth panel |
| BVC-022 | Toggle Card/Table view | BLOQUEADO | visual | N/A | Requiere auth panel |
| BVC-023 | Toast notifications | BLOQUEADO | visual | N/A | Requiere auth panel |
| BVC-024 | Panel misma calidad visual que sitio | BLOQUEADO | subjective | N/A | Requiere auth panel |
| BVC-030 | No listas planas (siempre cards) | BLOQUEADO | visual (negative) | N/A | Requiere auth panel |
| BVC-034 | Sidebar 260-280px ancho | BLOQUEADO | computed-style | N/A | Requiere auth panel |
| BVC-035 | Header panel 64-72px | BLOQUEADO | computed-style | N/A | Requiere auth panel |
| BVC-036 | Fondo #F7F8FA con padding 24-32px | BLOQUEADO | computed-style | N/A | Requiere auth panel |
| BVC-037 | Cards resumen radius 12-16px + sombra | BLOQUEADO | computed-style | N/A | Requiere auth panel |

## Notas Importantes

1. **BUG-002 sigue activo**: El API retorna 404 para TODOS los endpoints. Esto fue reportado como "FIXED R2" en el test-distribution.md, pero NO esta corregido en el sitio desplegado.

2. **Auth panel sigue sin bypass**: A pesar de la nota del PM indicando que los criterios BLOQUEADOS deben re-testearse, la autenticacion Azure Entra ID sigue siendo requerida y no hay mecanismo de bypass disponible para testing automatizado.

3. **La SPA tiene comportamiento de auto-navegacion**: Durante testing, la pagina cambiaba de URL automaticamente sin interaccion. Esto sugiere un bug de routing en la SPA Angular (posiblemente relacionado con los guards de auth o error handling).

4. **Estructura responsive funciona correctamente**: A pesar de la ausencia de datos, la estructura responsive del catalogo y marcas se adapta correctamente a los 3 breakpoints (desktop, tablet, mobile). Los filtros colapsan en mobile, el footer cambia a acordeones, y el header usa hamburger menu.

5. **No se generaron GIFs**: Los 4 GIFs obligatorios del panel admin no se pudieron generar porque el panel no es accesible sin auth.

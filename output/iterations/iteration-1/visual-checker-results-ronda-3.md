# Resultados -- Visual Checker

## Resumen Ejecutivo
- **Criterios asignados**: 12
- **PASA**: 3 (REQ-264a, REQ-308, REQ-316)
- **FALLA**: 8 (REQ-149, REQ-150, REQ-151, REQ-152, REQ-264h, REQ-137, REQ-142, NFR-006)
- **N/A**: 1 (REQ-310 -- requiere credenciales reales de Azure Entra ID)
- **Tests .spec.ts generados**: 4 archivos nuevos
- **Bugs encontrados**: 4 nuevos

## Pre-Flight Results

| Check | Resultado | Evidencia |
|-------|-----------|-----------|
| API funciona | PASA (parcial) | API retorna JSON (no 404). Pero `data: [], total: 0` -- la base de datos esta VACIA. 0 productos, 0 marcas |
| Productos cargan en catalogo | FALLA | /es/catalogo/farmacos muestra "No hay productos disponibles actualmente". 0 productos en API |
| Marcas cargan | FALLA | /es/marcas muestra titulo y parrafo pero 0 brand cards. API retorna `[]` |
| Search funciona | N/A | Sin productos ni marcas, search no tiene datos que buscar |
| SPA estable (BUG-V05) | FALLA | Confirmado: la SPA auto-navega entre paginas sin interaccion. /es auto-navega a /es/catalogo/farmacos despues de ~10s. /es/marcas/zoetis auto-navega a /es/catalogo/farmacos |

**CRITICO**: El API funciona (retorna JSON, no 404 como en R2) pero la base de datos esta completamente VACIA: 0 productos, 0 marcas. Solo las categorias tienen datos (farmacos, alimentos, equipos con sus familias). Esto impide verificar 6 de los 12 criterios asignados que requieren datos de productos o marcas.

---

## Resultados por Criterio

| Criterio | Estado | Breakpoint | Evidencia |
|----------|--------|------------|-----------|
| REQ-149 | FALLA | desktop/tablet/mobile | API retorna `[]` para brands. Pagina /es/marcas/zoetis muestra contenido blank (solo header+footer, sin breadcrumb ni info de marca ni error/404). Screenshot: r3-marca-individual-blank.png |
| REQ-150 | FALLA | desktop/tablet/mobile | No hay datos de marca para verificar logo, nombre, pais, descripcion. Pagina de marca individual queda en blanco sin error state |
| REQ-151 | FALLA | desktop/tablet/mobile | Sin marca individual visible, no se puede verificar grid de productos de la marca |
| REQ-152 | FALLA | desktop/tablet/mobile | Sin marca individual visible, no se puede verificar filtros en grid de productos de marca |
| REQ-264a | PASA | desktop | Catalogo general /es/catalogo carga correctamente con breadcrumb (Inicio > Catalogo), titulo "Catalogo de Productos", contador "0 productos", filtros (Categoria con Farmacos/Alimentos/Equipos, Marca, Especie con 6 opciones) y empty state con ilustracion + "Aun no hay productos en el catalogo" + "Vuelve pronto". Screenshot: r3-catalogo-general-desktop-final.png |
| REQ-264h | FALLA | desktop | Contador muestra "0 productos" pero NO puede verificarse que se actualiza con filtros porque no hay productos para filtrar. Al seleccionar una categoria, el contador sigue en "0 productos" porque la DB esta vacia |
| REQ-137 | FALLA | N/A | No hay productos en la base de datos. No se puede verificar storytelling bilingue ES/EN |
| REQ-142 | FALLA | N/A | No hay productos en la base de datos. No se puede verificar si una categoria con un unico producto adapta los relacionados |
| REQ-308 | PASA | desktop | Auth guard funciona para rutas admin definidas: /admin/productos redirige a /admin/login, /admin/dashboard redirige a /admin/login, /admin/configuracion/general redirige a /admin/login. Login card muestra "HESA", "Panel de Administracion", "Iniciar sesion con Microsoft". Screenshot: r3-admin-login-regression.png. NOTA: /admin/configuracion (sin sub-ruta) NO redirige porque no es una ruta hija definida (las rutas son configuracion/general, configuracion/contacto, etc.) |
| REQ-316 | PASA | desktop | /admin/usuarios muestra pagina 404 "Page not found" con "The page you are looking for does not exist or has been moved" y botones "Back to home" + "Explore catalog". NO existe pantalla de gestion de usuarios. Screenshot: r3-admin-usuarios-no-redirect.png |
| NFR-006 | FALLA | N/A | SSR: TODAS las paginas retornan el mismo titulo en HTML raw: `<title>HESA - Herrera y Elizondo S.A.</title>`. Los titulos unicos solo se establecen via JavaScript despues de la hidratacion de Angular (client-side). /es, /es/catalogo, /es/marcas, /es/catalogo/farmacos, /es/nosotros -- todos retornan titulo identico en curl. Tras JS: Inicio, Catalogo de Productos, Marcas -- son correctos. Pero para SEO crawlers que no ejecutan JS, los titulos no son unicos |
| REQ-310 | N/A | N/A | Requiere credenciales reales de Azure Entra ID para probar "auth falla: mensaje No tienes acceso". El codigo tiene interceptor para esto, pero no se puede verificar sin credenciales reales |

---

## Bugs Encontrados

BUG-V06:
- Criterio: REQ-149, REQ-150, REQ-151, REQ-152
- Tipo: visual
- Breakpoint: todos
- Descripcion: La pagina de marca individual (/es/marcas/[slug]) muestra contenido completamente en blanco (solo header y footer) cuando la marca no existe en la base de datos. No muestra breadcrumb, no muestra error state, no muestra 404. El usuario ve una pagina vacia sin ninguna indicacion de que algo salio mal.
- Resultado esperado: Cuando una marca no existe, mostrar pagina 404 estilizada o error state tipo "Esta marca no esta disponible" + boton "Volver a marcas", similar al comportamiento de producto inexistente que muestra "Este producto no esta disponible"
- Resultado actual: Pagina completamente en blanco entre header y footer
- Severidad: alta
- Evidencia: e2e/screenshots/r3-marca-individual-blank.png (capturada antes del auto-navigate)

BUG-V07:
- Criterio: NFR-006
- Tipo: design-criteria-compliance
- Breakpoint: N/A (SSR issue)
- Descripcion: Los titulos de pagina no son unicos en el HTML raw (SSR). Todas las paginas retornan `<title>HESA - Herrera y Elizondo S.A.</title>` en la respuesta del servidor. Los titulos unicos (Inicio, Catalogo de Productos, Marcas, Farmacos) solo se establecen via JavaScript client-side despues de la hidratacion de Angular. Los crawlers SEO que no ejecutan JavaScript (Googlebot legacy, otros bots) veran el mismo titulo en todas las paginas.
- Resultado esperado: Cada pagina retorna un titulo unico en el HTML raw del servidor (SSR) para SEO optimo
- Resultado actual: Titulo identico "HESA - Herrera y Elizondo S.A." en HTML raw para /es, /es/catalogo, /es/marcas, /es/catalogo/farmacos, /es/nosotros
- Severidad: alta (impacto SEO directo)
- Evidencia: curl de 5 rutas diferentes, todas retornan mismo `<title>`

BUG-V08:
- Criterio: REQ-264h
- Tipo: visual
- Breakpoint: desktop
- Descripcion: No se puede verificar que el contador de productos se actualiza dinamicamente con filtros porque la base de datos esta VACIA (0 productos, 0 marcas). El contador muestra "0 productos" correctamente, pero al cambiar filtros el contador sigue en "0" porque no hay datos. Este es un problema de DATA, no de codigo -- el componente de contador EXISTE y muestra un valor, pero la verificacion completa requiere datos reales.
- Resultado esperado: Datos en la base de datos para poder verificar que el contador cambia al aplicar filtros
- Resultado actual: Base de datos vacia, contador siempre "0 productos" independiente del filtro
- Severidad: media (bloqueado por datos, no por codigo)
- Evidencia: e2e/screenshots/r3-catalogo-general-desktop-final.png

BUG-V05 (CONFIRMADO de R2):
- Criterio: Estabilidad de navegacion SPA
- Tipo: visual
- Breakpoint: todos
- Descripcion: La SPA Angular auto-navega entre paginas sin interaccion del usuario. Confirmado en R3: la pagina /es auto-navega a /es/catalogo/farmacos despues de ~10 segundos. La pagina /es/marcas/zoetis auto-navega a /es/catalogo/farmacos. Multiples paginas auto-navegan a rutas aleatorias (/es/marcas, /es/catalogo/farmacos/test-product). Esto dificulta gravemente el testing visual y es un defecto de UX para el usuario final.
- Resultado esperado: Las paginas permanecen estables en la URL navegada sin auto-redireccion
- Resultado actual: Auto-navegacion no solicitada entre paginas despues de segundos de inactividad
- Severidad: alta (interfiere con UX y testing)
- Evidencia: Observado en multiples navigaciones durante testing R3

---

## Tests Generados
- e2e/tests/visual/REQ-308-admin-auth-guard.spec.ts (nuevo: 5 tests para auth guard en rutas admin)
- e2e/tests/visual/REQ-316-no-user-management.spec.ts (nuevo: 2 tests verificando que /admin/usuarios no existe)
- e2e/tests/visual/REQ-264a-catalogo-general.spec.ts (nuevo: 3 tests para estructura del catalogo general)
- e2e/tests/visual/NFR-006-ssr-titles.spec.ts (nuevo: 4 tests para titulos unicos + 1 skipped documentando bug SSR)

---

## Comparacion Visual

| Seccion | Similitud vs Referencia | Notas |
|---------|------------------------|-------|
| Catalogo general (estructura) | ~85% vs DC-036 | Breadcrumb, titulo, contador, filtros horizontales, empty state presentes. Sin productos para verificar grid layout |
| Marcas listing (estructura) | ~80% vs DC-039 | Breadcrumb, titulo, parrafo intro presentes. Sin brand cards por DB vacia. No muestra empty state con ilustracion cuando hay 0 marcas |
| Marca individual | 0% vs DC-040 | Pagina completamente en blanco -- ni breadcrumb, ni logo, ni nombre, ni error state. BUG-V06 |
| Admin login | ~85% vs DC-045 | Card con HESA texto (no logo imagen 120px), titulo, boton Microsoft. Fondo #F7F8FA correcto. Card centrada. Persisten BUG-V01 (max-width) y BUG-V02 (logo texto vs imagen) de R1 |
| Admin auth guard | ~90% | Rutas definidas redirigen correctamente a login. Solo /admin/configuracion (sin sub-ruta) no redirige porque no es ruta definida |

---

## Brief Verification Results

No hay BVC asignados directamente a los criterios de esta ronda (REQ-149-152, REQ-264a/h, REQ-137, REQ-142, REQ-308, REQ-316, NFR-006, REQ-310).

Los BVC del sitio publico que dependen de datos de productos y marcas (BVC-001 a BVC-010) NO pueden verificarse porque la base de datos esta vacia (0 productos, 0 marcas).

| BVC-xxx | Criterio del Cliente | Estado | Tipo | Evidencia | Justificacion |
|---------|---------------------|--------|------|-----------|---------------|
| BVC-008 | No precios/inventario/carrito | PASA | visual (negative) | Catalogo general y marcas no muestran precios, inventario ni carrito en ninguna pagina | Verificado visualmente en screenshots |
| BVC-025 | No precios visibles | PASA | visual (negative) | Ninguna pagina del sitio muestra precios | Verificado en catalogo, marcas, home |
| BVC-026 | No carrito/checkout | PASA | visual (negative) | Ninguna pagina tiene carrito, checkout ni pasarela de pago | Verificado via DOM inspection |
| BVC-027 | No registro/login publico | PASA | visual (negative) | No hay registro ni login de clientes en sitio publico. El login es solo admin | Verificado en header y footer |
| BVC-038 | WhatsApp flotante | PASA | visual | Boton WhatsApp verde presente en esquina inferior derecha en todas las paginas visitadas | Screenshots muestran el FAB en todas las paginas |
| BVC-039 | Selector idioma ES/EN | PASA | visual | Selector de idioma visible en header (ES/EN dropdown) y en footer (boton "English"/"Espanol") | Verificado en todos los breakpoints |

---

## Notas Importantes

1. **Base de datos VACIA**: El API funciona (retorna JSON, no 404) pero la base de datos no tiene productos ni marcas. Los endpoints retornan: `/api/public/products` -> `{"data":[],"total":0}`, `/api/public/brands` -> `[]`. Solo las categorias tienen datos (farmacos, alimentos, equipos con familias y especies).

2. **BUG-V05 sigue activo**: La auto-navegacion de la SPA interfiere gravemente con el testing visual. Multiples screenshots se capturaron de paginas incorrectas porque la SPA auto-navego antes de completar la captura.

3. **6 de 12 criterios requieren datos de productos/marcas**: REQ-149, REQ-150, REQ-151, REQ-152 (marca individual), REQ-137 (storytelling bilingual), REQ-142 (relacionados con producto unico) -- todos necesitan datos reales en la base de datos para poder verificarse.

4. **NFR-006 SSR es un defecto real**: Los titulos unicos funcionan via JavaScript (client-side) pero NO estan presentes en el HTML raw del servidor. Esto es un problema de Angular SSR/prerendering -- el build estatico no pre-renderiza titulos unicos por ruta.

5. **Auth guard funciona para rutas definidas**: El auth guard de Angular redirige correctamente a /admin/login para rutas definidas como /admin/productos, /admin/dashboard, /admin/configuracion/general. El problema reportado en el test-distribution (/admin/configuracion no redirige) se debe a que /admin/configuracion sin sub-ruta no es una ruta hija definida.

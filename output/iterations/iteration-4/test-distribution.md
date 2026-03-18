# Plan de Distribucion — QA Team

## Contexto de Testing
- Iteracion: 4 (Performance, Accesibilidad y Pulido Final — ultima iteracion)
- Ronda: 1
- URL del sitio desplegado: https://gray-field-02ba8410f.2.azurestaticapps.net
- URL del backend: https://hesa-api.azurewebsites.net
- Total criterios esta iteracion: 36
- Criterios testeables (sitio publico): 27
- Criterios N/A (admin panel, requiere auth Entra ID): 9
- Criterios nuevos a testear manualmente: 27
- Criterios a re-testear (fallaron en ronda anterior): 0 (Ronda 1)

## Pre-flight Check (OBLIGATORIO antes de testear)

Antes de ejecutar cualquier test, cada sub-tester DEBE verificar:
1. Navegar a https://gray-field-02ba8410f.2.azurestaticapps.net/es/ — debe cargar el home
2. Navegar a https://gray-field-02ba8410f.2.azurestaticapps.net/es/catalogo — debe cargar catalogo
3. Navegar a https://gray-field-02ba8410f.2.azurestaticapps.net/es/nosotros — debe cargar Nosotros
4. Verificar que https://hesa-api.azurewebsites.net/api/public/products responde con JSON valido

Si CUALQUIERA falla, reportar BLOQUEADO inmediatamente al PM.

## Nota sobre navegacion SPA inestable con Playwright MCP

Angular SPA puede auto-navegar a rutas distintas durante interacciones Playwright (fill, click, resize). Esto NO es un bug del sitio. Mitigacion:
- Usar `waitForSelector` robusto antes de cada interaccion
- Re-navegar si la URL cambia inesperadamente
- Los tests .spec.ts deben incluir `page.waitForURL()` para confirmar que siguen en la ruta correcta

---

## Criterios N/A (Admin Panel — Auth Entra ID)

Los siguientes 9 criterios requieren sesion autenticada de Azure Entra ID y NO son testeables sin credenciales de admin. Se marcan N/A:

| Criterio | Descripcion | Justificacion N/A |
|----------|-------------|-------------------|
| REQ-210 | Actividad reciente en dashboard (logs de acciones CRUD) | Admin panel, requiere auth Entra ID |
| REQ-218 | Badge de mensajes nuevos en sidebar se actualiza en tiempo real | Admin panel, requiere auth Entra ID |
| REQ-220 | Busqueda global del panel (productos, marcas, mensajes) | Admin panel, requiere auth Entra ID |
| REQ-221 | Resultados de busqueda global en dropdown agrupados por tipo | Admin panel, requiere auth Entra ID |
| REQ-222 | Notificaciones (campana con badge), avatar, dropdown cerrar sesion | Admin panel, requiere auth Entra ID |
| REQ-232 | Estado vacio en listado de productos admin con CTA | Admin panel, requiere auth Entra ID |
| REQ-233 | Placeholder visual por categoria en card de producto sin imagen (admin) | Admin panel, requiere auth Entra ID |
| REQ-263 | Estado vacio en listado de marcas admin con CTA | Admin panel, requiere auth Entra ID |
| NFR-005 | Panel admin carga cualquier pantalla en menos de 2 segundos | Admin panel, requiere auth Entra ID |

---

## Asignacion: Visual Checker -> e2e/tests/visual/

### Criterios asignados (10 criterios)

| Criterio | Descripcion | Tipo |
|----------|-------------|------|
| NFR-001 | Home carga en menos de 3s en 3G rapida (LCP < 3s) | performance |
| NFR-002 | Imagenes optimizadas automaticamente (WebP, lazy loading) | performance |
| NFR-003 | Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1 en desktop | performance |
| NFR-004 | Catalogo con filtros actualiza resultados en menos de 500ms | performance |
| NFR-021 | Sitio publico cumple WCAG 2.1 nivel AA | accesibilidad |
| NFR-022 | Todas las imagenes tienen alt text descriptivo | accesibilidad |
| NFR-024 | Contrastes de color cumplen ratio 4.5:1 texto normal, 3:1 texto grande | accesibilidad |
| NFR-025 | Formularios tienen labels asociados + errores anunciados a screen readers (role="alert") | accesibilidad |
| NFR-026 | Elementos interactivos tienen area de toque minima 44x44px en mobile | accesibilidad |
| REQ-025 | Boton WhatsApp flotante tiene area de toque >= 44x44px en mobile | accesibilidad |

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- Breakpoints: mobile (375px), tablet (768px), desktop (1280px)

#### Performance (NFR-001 a NFR-004)
- Medir LCP via `browser_evaluate` con PerformanceObserver en home y catalogo
- Verificar lazy loading: las imagenes below-the-fold deben tener `loading="lazy"` o IntersectionObserver
- Verificar que imagenes sirven formato WebP (revisar `<picture>` o src con .webp)
- Medir tiempo de respuesta de filtros en catalogo (timestamp antes/despues de aplicar filtro)
- Verificar headers Cache-Control en assets estaticos (JS, CSS) — deben tener max-age largo
- NFR-001: Simular 3G rapida con throttling si Playwright lo permite, o medir LCP sin throttling y reportar valor real
- NFR-003: Medir CLS via PerformanceObserver con type 'layout-shift', medir LCP, verificar FID/INP via long task observer

#### Accesibilidad (NFR-021 a NFR-026, REQ-025)
- NFR-021: Verificar cumplimiento WCAG 2.1 AA de forma general: estructura de headings (h1-h6 en orden), landmarks (nav, main, footer), roles ARIA correctos
- NFR-022: Verificar que TODAS las imagenes `<img>` tienen atributo `alt` no vacio en paginas: Home, Catalogo, Detalle de producto, Marcas, Nosotros, Distribuidores, Contacto
- NFR-024: Verificar contraste de todos los textos principales contra fondos usando `browser_evaluate` con `getComputedStyle` — calcular ratio de luminancia. Paginas a verificar: Home (hero text vs background, body text), Catalogo, Contacto
- NFR-025: Verificar que formularios de contacto (/es/contacto) y fabricantes (/es/distribuidores) tienen `<label for="...">` asociados correctamente a cada `<input>`. Verificar `role="alert"` en mensajes de error de validacion
- NFR-026: Medir dimensiones de botones/links interactivos en viewport mobile (375px) — todos deben ser >= 44x44px. Verificar: botones de navegacion, CTAs, links del footer, filtros
- REQ-025: Medir el WhatsApp FAB en viewport mobile (375px) — debe ser >= 44x44px. Usar `getBoundingClientRect()` via `browser_evaluate`

#### Tests .spec.ts a generar
- `e2e/tests/visual/NFR-001-003-core-web-vitals.spec.ts` — LCP, CLS mediciones
- `e2e/tests/visual/NFR-002-image-optimization.spec.ts` — lazy loading, WebP
- `e2e/tests/visual/NFR-004-filter-response-time.spec.ts` — filtros < 500ms
- `e2e/tests/visual/NFR-021-024-wcag-aa.spec.ts` — contraste, alt texts, heading structure, landmarks
- `e2e/tests/visual/NFR-025-form-labels-aria.spec.ts` — labels, role="alert"
- `e2e/tests/visual/REQ-025-NFR-026-touch-targets.spec.ts` — 44x44px mobile para todos los interactivos

---

## Asignacion: Flow Tester -> e2e/tests/flow/

### Criterios asignados (7 criterios)

| Criterio | Descripcion | Tipo |
|----------|-------------|------|
| NFR-023 | Navegacion completamente funcional con teclado (Tab, Enter, Escape, flechas) | accesibilidad |
| REQ-011 | Links de navegacion accesibles con teclado (Tab, Enter, Escape para menus) | accesibilidad |
| REQ-103 | Controles de paginacion accesibles con teclado | accesibilidad |
| REQ-031 | Producto sin traduccion EN muestra contenido ES como fallback con indicador visual | i18n edge-case |
| REQ-073 | Si no hay productos destacados configurados, la seccion no se muestra en home | edge-case |
| REQ-173 | Si no hay miembros del equipo, la seccion no se muestra en sitio publico | edge-case |
| REQ-321e | Si se eliminan todos los miembros, seccion Equipo desaparece del sitio publico | edge-case |

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net

#### Accesibilidad - Navegacion por teclado (NFR-023, REQ-011, REQ-103)
- NFR-023 (alcance amplio): Verificar flujo Tab completo en multiples paginas
  - Home (/es/): Tab recorre skip-to-content -> navbar items -> contenido -> footer
  - Catalogo (/es/catalogo): Tab recorre filtros -> cards -> paginacion -> footer
  - Detalle de producto: Tab recorre galeria -> info -> CTAs -> relacionados -> footer
  - Contacto (/es/contacto): Tab recorre campos del formulario en orden logico
  - Verificar skip-to-content link: Tab al cargar la pagina debe mostrar "Ir al contenido" o "Skip to content"
  - Verificar lightbox de galeria de producto: flechas izquierda/derecha para cambiar imagen, Escape para cerrar
- REQ-011 (navegacion header): Tab hasta items del navbar, Enter para navegar. Submenu de Catalogo: Enter para abrir, Tab para navegar items del submenu, Escape para cerrar. Dropdown del idioma selector: Enter para abrir, flechas para navegar, Enter para seleccionar, Escape para cerrar
- REQ-103 (paginacion): Tab hasta controles de paginacion en /es/catalogo, Enter/Space para cambiar pagina, verificar `aria-current="page"` en boton de pagina activa, verificar que el `<nav>` wrapper tiene role="navigation" y aria-label

#### Edge cases condicionales (REQ-031, REQ-073, REQ-173, REQ-321e)
- REQ-031: Navegar a la version EN del sitio (/en/). Buscar productos cuyo name.en este vacio o ausente (verificar via API: `GET https://hesa-api.azurewebsites.net/api/public/products`). Si algun producto no tiene traduccion EN, navegar a su detalle en EN y verificar que muestra texto en ES con indicador visual de "traduccion no disponible". Si TODOS los productos tienen traduccion EN, verificar el comportamiento del componente (buscar @if o *ngIf en el template que maneje este caso)
- REQ-073: Verificar via API `GET https://hesa-api.azurewebsites.net/api/public/home`. Revisar campo featuredProducts. Si es array vacio, verificar que en /es/ la seccion "Productos Destacados" NO existe en el DOM (no un div vacio, literalmente ausente). Si tiene productos, verificar que se renderizan correctamente
- REQ-173: Verificar via API `GET https://hesa-api.azurewebsites.net/api/public/team`. Si retorna array vacio, verificar que en /es/nosotros la seccion "Equipo de Liderazgo" NO existe en el DOM. Si retorna miembros, verificar que se muestran con foto, nombre, cargo
- REQ-321e: Mismo comportamiento publico que REQ-173 — la diferencia es que REQ-321e se activa cuando el admin ELIMINA todos los miembros, pero desde la perspectiva publica el resultado es identico: seccion ausente si no hay miembros. Verificar que el componente usa @if condicional sobre la existencia de miembros

#### Tests .spec.ts a generar
- `e2e/tests/flow/NFR-023-keyboard-navigation.spec.ts` — Tab, Enter, Escape, flechas en Home, Catalogo, Detalle, Contacto
- `e2e/tests/flow/REQ-011-nav-keyboard.spec.ts` — navegacion header con teclado, submenu, idioma selector
- `e2e/tests/flow/REQ-103-pagination-keyboard.spec.ts` — paginacion con teclado, aria-current
- `e2e/tests/flow/REQ-031-translation-fallback.spec.ts` — fallback ES cuando no hay traduccion EN
- `e2e/tests/flow/REQ-073-featured-products-conditional.spec.ts` — seccion oculta si no hay featured
- `e2e/tests/flow/REQ-173-321e-team-conditional.spec.ts` — seccion equipo oculta si no hay miembros

---

## Asignacion: Edge Case Tester -> e2e/tests/edge-case/

### Criterios asignados (10 criterios)

| Criterio | Descripcion | Tipo |
|----------|-------------|------|
| NFR-014 | Todas las comunicaciones usan HTTPS (HSTS header) | seguridad |
| NFR-017 | Inputs de formularios sanitizados contra XSS e inyeccion | seguridad |
| NFR-020 | Headers de seguridad: CSP, X-Frame-Options, X-Content-Type-Options | seguridad |
| REQ-085 | Categoria sin productos muestra estado vacio con mensaje informativo | edge-case |
| REQ-097 | Filtros sin resultados muestra "No se encontraron productos" con sugerencia limpiar | edge-case |
| REQ-120 | Producto sin ficha tecnica PDF: boton de descarga NO se muestra | edge-case |
| REQ-127 | Producto con una sola imagen: sin miniaturas, solo imagen principal | edge-case |
| REQ-128 | Producto sin imagen: placeholder visual con nombre de marca o categoria | edge-case |
| REQ-129 | Campos especificos del tipo de producto vacios no generan areas en blanco | edge-case |
| REQ-142 | Producto unico en su categoria/marca: seccion relacionados no se muestra o muestra genericos | edge-case |

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- API base: https://hesa-api.azurewebsites.net

#### Seguridad (NFR-014, NFR-017, NFR-020)
- NFR-014: Verificar header `Strict-Transport-Security` en respuestas de:
  - Frontend: `https://gray-field-02ba8410f.2.azurestaticapps.net` (via `browser_evaluate` con fetch o inspeccion de headers)
  - API: `https://hesa-api.azurewebsites.net/api/public/products` (via `browser_evaluate` con fetch)
  - Ambos deben responder solo sobre HTTPS (no HTTP). Verificar que max-age es razonable (>= 31536000)
- NFR-017: Probar inyeccion XSS en formulario de contacto (/es/contacto):
  - Enviar nombre con `<script>alert(1)</script>` — debe sanitizarse
  - Enviar mensaje con `<img onerror=alert(1) src=x>` — debe sanitizarse
  - Enviar con `javascript:alert(1)` en campos de URL — debe sanitizarse
  - Enviar con `data:text/html,<script>alert(1)</script>` — debe bloquearse
  - Tambien probar en formulario de fabricantes (/es/distribuidores)
  - Verificar que Angular escapa HTML en templates (no renderiza tags crudos)
  - Verificar via API que el backend sanitiza: hacer POST con XSS payload y verificar que la respuesta no contiene el script
- NFR-020: Verificar headers HTTP de seguridad en respuestas:
  - Content-Security-Policy: debe existir, verificar que no tiene `unsafe-inline` sin nonce/hash, que restrict-uri es adecuado
  - X-Frame-Options: DENY o SAMEORIGIN
  - X-Content-Type-Options: nosniff
  - X-XSS-Protection: puede estar presente (legacy)
  - Referrer-Policy: verificar si presente (no-referrer o strict-origin-when-cross-origin)
  - Permissions-Policy: verificar si presente
  - Verificar TANTO en frontend como en API

#### Edge cases de producto (REQ-085, REQ-097, REQ-120, REQ-127, REQ-128, REQ-129, REQ-142)
- REQ-085: Primero verificar via API cuales categorias tienen 0 productos: `GET https://hesa-api.azurewebsites.net/api/public/categories`. Si alguna categoria tiene 0 productos, navegar a su pagina de catalogo. Verificar mensaje tipo "No hay productos en esta categoria actualmente". Si todas las categorias tienen productos, intentar una URL de categoria inexistente para ver el fallback
- REQ-097: En /es/catalogo, aplicar combinacion de filtros que no produzca resultados (ej: seleccionar una marca + una especie que no tengan productos en comun). Verificar:
  - Mensaje visible: "No se encontraron productos con estos filtros" o similar
  - Boton/link visible para "Limpiar filtros" o "Reiniciar"
  - Al hacer clic en limpiar, vuelven todos los productos
- REQ-120: Consultar API para encontrar producto sin ficha tecnica (campo dataSheet o similar vacio/null). Navegar a `/es/catalogo/{categoria}/{slug}`. Verificar que NO existe boton "Ver ficha tecnica" ni "Descargar PDF" en el DOM (ni oculto ni deshabilitado — completamente ausente)
- REQ-127: Consultar API para encontrar producto con exactamente 1 imagen (array images con length 1). Navegar a su detalle. Verificar: imagen principal visible, thumbnails/miniaturas de galeria NO presentes en el DOM
- REQ-128: Consultar API para encontrar producto sin imagenes (array images vacio o no existe). Navegar a su detalle. Verificar: placeholder visual visible (no img rota), debe mostrar nombre de marca o icono de categoria. NO debe haber icono roto (broken image icon)
- REQ-129: Navegar a detalle de un producto de tipo "farmaco". Verificar campos especificos (principio activo, presentacion, etc.). Si algun campo esta vacio, la seccion/fila correspondiente NO debe renderizarse (no un campo vacio). Repetir con producto tipo "alimento" y "equipo"
- REQ-142: Consultar API para encontrar producto que sea el unico de su marca en su categoria. Navegar a su detalle. La seccion "Productos Relacionados" debe: (a) no mostrarse si no hay relacionados, O (b) mostrar productos de la misma categoria general como fallback (hasta 4 productos)

#### Tests .spec.ts a generar
- `e2e/tests/edge-case/NFR-014-https-hsts.spec.ts` — HSTS headers en frontend y API
- `e2e/tests/edge-case/NFR-017-xss-sanitization.spec.ts` — XSS en formularios de contacto y fabricantes
- `e2e/tests/edge-case/NFR-020-security-headers.spec.ts` — CSP, X-Frame-Options, X-Content-Type-Options en frontend y API
- `e2e/tests/edge-case/REQ-085-empty-category.spec.ts` — estado vacio categoria sin productos
- `e2e/tests/edge-case/REQ-097-no-filter-results.spec.ts` — mensaje sin resultados y boton limpiar filtros
- `e2e/tests/edge-case/REQ-120-no-pdf-button.spec.ts` — boton PDF ausente en producto sin ficha
- `e2e/tests/edge-case/REQ-127-128-129-product-edge-cases.spec.ts` — imagen unica, sin imagen, campos vacios
- `e2e/tests/edge-case/REQ-142-related-products-edge.spec.ts` — producto unico en categoria

---

## Regresion Automatizada (ejecutada por PM antes de esta ronda)

- Resultado de `npx playwright test e2e/tests/`: **543 passed** (reportado por PM)
- Cobertura: Todos los criterios de Fase 4 (visual build) + Iteracion 1 + Iteracion 2 + Iteracion 3
- Criterios verificados por automatizacion (PASA automatizado): Todos los criterios de iteraciones anteriores cubiertos por la suite existente de tests mantienen su estado PASA
- Criterios con regresion detectada: **ninguno** (543 passed sin fallos)

---

## Criterios Pendientes de Testing Manual

- Total criterios Iteracion 4: **36**
- Criterios N/A (admin auth): **9**
- Criterios que requieren sub-testers esta ronda: **27**
- Criterios FALLARON en ronda anterior: 0 (Ronda 1)
- Criterios DESBLOQUEADOS: 0 (Ronda 1)
- Criterios nuevos sin test automatizado: 27

### Resumen de distribucion

| Sub-tester | Criterios asignados | Categoria principal |
|------------|--------------------|--------------------|
| Visual Checker | 10 | Performance (NFR-001 a NFR-004) + Accesibilidad visual (NFR-021, NFR-022, NFR-024, NFR-025, NFR-026, REQ-025) |
| Flow Tester | 7 | Accesibilidad teclado (NFR-023, REQ-011, REQ-103) + Edge cases condicionales publicos (REQ-031, REQ-073, REQ-173, REQ-321e) |
| Edge Case Tester | 10 | Seguridad (NFR-014, NFR-017, NFR-020) + Edge cases de producto (REQ-085, REQ-097, REQ-120, REQ-127, REQ-128, REQ-129, REQ-142) |
| **Total** | **27** | 27 criterios unicos, sin solapamiento |

### Inventario completo de 36 criterios

| # | Criterio | Estado | Asignado a |
|---|----------|--------|------------|
| 1 | NFR-001 | Testear | Visual Checker |
| 2 | NFR-002 | Testear | Visual Checker |
| 3 | NFR-003 | Testear | Visual Checker |
| 4 | NFR-004 | Testear | Visual Checker |
| 5 | NFR-005 | N/A | Admin panel auth |
| 6 | NFR-014 | Testear | Edge Case Tester |
| 7 | NFR-017 | Testear | Edge Case Tester |
| 8 | NFR-020 | Testear | Edge Case Tester |
| 9 | NFR-021 | Testear | Visual Checker |
| 10 | NFR-022 | Testear | Visual Checker |
| 11 | NFR-023 | Testear | Flow Tester |
| 12 | NFR-024 | Testear | Visual Checker |
| 13 | NFR-025 | Testear | Visual Checker |
| 14 | NFR-026 | Testear | Visual Checker |
| 15 | REQ-011 | Testear | Flow Tester |
| 16 | REQ-025 | Testear | Visual Checker |
| 17 | REQ-031 | Testear | Flow Tester |
| 18 | REQ-073 | Testear | Flow Tester |
| 19 | REQ-085 | Testear | Edge Case Tester |
| 20 | REQ-097 | Testear | Edge Case Tester |
| 21 | REQ-103 | Testear | Flow Tester |
| 22 | REQ-120 | Testear | Edge Case Tester |
| 23 | REQ-127 | Testear | Edge Case Tester |
| 24 | REQ-128 | Testear | Edge Case Tester |
| 25 | REQ-129 | Testear | Edge Case Tester |
| 26 | REQ-142 | Testear | Edge Case Tester |
| 27 | REQ-173 | Testear | Flow Tester |
| 28 | REQ-210 | N/A | Admin panel auth |
| 29 | REQ-218 | N/A | Admin panel auth |
| 30 | REQ-220 | N/A | Admin panel auth |
| 31 | REQ-221 | N/A | Admin panel auth |
| 32 | REQ-222 | N/A | Admin panel auth |
| 33 | REQ-232 | N/A | Admin panel auth |
| 34 | REQ-233 | N/A | Admin panel auth |
| 35 | REQ-263 | N/A | Admin panel auth |
| 36 | REQ-321e | Testear | Flow Tester |

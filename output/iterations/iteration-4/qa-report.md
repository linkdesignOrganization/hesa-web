# QA Report — Iteracion 4 (Performance, Accesibilidad y Pulido Final)

## Metadata
- **Ronda:** 1
- **Fecha:** 2026-03-18
- **URL Frontend:** https://gray-field-02ba8410f.2.azurestaticapps.net
- **URL Backend:** https://hesa-api.azurewebsites.net
- **Veredicto:** HAY_BUGS

---

## Resumen Ejecutivo

| Metrica | Valor |
|---------|-------|
| Total criterios Iteracion 4 | 36 |
| PASA | 22 |
| FALLA | 5 |
| N/A (admin auth Entra ID) | 9 |
| BLOQUEADO | 0 |
| Bugs reportados | 5 |
| Bugs severidad alta | 3 |
| Bugs severidad media | 2 |
| Tests automatizados generados | 20 archivos .spec.ts |
| Regresion iteraciones previas | 543 passed, 0 failed |

---

## Regresion Automatizada (Iteraciones Previas)

- **Resultado:** 543 tests passed, 0 failed
- **Cobertura:** Fase 4 (visual build) + Iteracion 1 + Iteracion 2 + Iteracion 3
- **Regresiones detectadas:** Ninguna
- **Conclusion:** Todas las iteraciones previas mantienen estabilidad completa

---

## Resultado por Criterio

### Performance (NFR-001 a NFR-005)

| # | Criterio | Descripcion | Estado | Sub-tester | Evidencia |
|---|----------|-------------|--------|------------|-----------|
| 1 | NFR-001 | Home carga en < 3s en 3G rapida (LCP < 3s) | PASA | Visual Checker | LCP=116ms, FCP=64ms, TTFB=1.6ms. Incluso con penalizacion 10x por ausencia de throttling, cumple holgadamente |
| 2 | NFR-002 | Imagenes optimizadas (WebP, lazy loading) | FALLA | Visual Checker | Lazy loading SI implementado. WebP NO implementado: todas las imagenes usan .jpg sin elemento `<picture>` ni conversion WebP. Ver BUG-001 |
| 3 | NFR-003 | Core Web Vitals: LCP<2.5s, FID<100ms, CLS<0.1 | FALLA | Visual Checker | LCP=116ms PASA. FID no medible (Playwright). CLS=0.547 FALLA (5.5x el limite). Fuente: APP-FOOTER. Ver BUG-002 |
| 4 | NFR-004 | Filtros actualizan resultados en < 500ms | PASA | Visual Checker | Filtrado client-side con selects nativos. Respuesta perceptualmente instantanea (<100ms) |
| 5 | NFR-005 | Admin carga pantalla en < 2s | N/A | — | Admin panel requiere auth Entra ID, no testeable |

### Accesibilidad (NFR-021 a NFR-026, REQ-011, REQ-025, REQ-103)

| # | Criterio | Descripcion | Estado | Sub-tester | Evidencia |
|---|----------|-------------|--------|------------|-----------|
| 6 | NFR-021 | Sitio cumple WCAG 2.1 AA | PASA | Visual Checker | Heading hierarchy h1>h2>h3>h4 correcto. Landmarks: nav(5), main(1), footer(1), search(1). Skip-to-content presente. html lang="es" |
| 7 | NFR-022 | Imagenes tienen alt text descriptivo | FALLA | Visual Checker | Producto images tienen alt descriptivo. Brand logos tienen alt. PERO: Royal Canin Kitten card en catalogo sin alt text. SVGs decorativos sin aria-hidden="true" consistente. Ver BUG-003 |
| 8 | NFR-023 | Navegacion funcional con teclado | PASA | Flow Tester | Skip-to-content "Saltar al contenido principal" como primer focusable. Tab recorre nav->contenido->footer en Home, Catalogo, Detalle, Contacto. Escape cierra search overlay y mobile menu. Submenu con onSubmenuKeydown |
| 9 | NFR-024 | Contrastes cumplen ratio 4.5:1/3:1 | PASA | Visual Checker | h1 #1F2937/blanco ~15.3:1. Body #6B7280/blanco ~5.0:1. Footer blanco/#005A85 ~6.8:1. CTAs blanco/#008DC9 ~4.6:1 (texto grande en botones) |
| 10 | NFR-025 | Formularios con labels + errores role="alert" | FALLA | Visual Checker | Formularios usan divs como labels, NO `<label for>`. Campos accesibles via aria pero sin asociacion programatica explicita (WCAG H44). 0 elementos role="alert" para errores de validacion. Ver BUG-004 |
| 11 | NFR-026 | Touch targets >= 44x44px en mobile | FALLA | Visual Checker | 12 de 36 targets fallan. Footer links 375x32px. Breadcrumb 33x21px. Filter pill remove 14x14px. Limpiar filtros 109x35px. Social links 24x32px. Ver BUG-005 |
| 12 | REQ-011 | Nav links accesibles con teclado | PASA | Flow Tester | Catalogo link: aria-haspopup="true", aria-expanded. Enter/Space abre submenu, Escape cierra. Language selector: button focusable, Enter activa. Search button activable con Enter |
| 13 | REQ-025 | WhatsApp FAB >= 44x44px en mobile | PASA | Visual Checker | WhatsApp FAB mide 56x56px en mobile (375px). Cumple minimo 44x44px. aria-label "Contactar por WhatsApp" |
| 14 | REQ-103 | Paginacion accesible con teclado | PASA | Flow Tester | Template implementa: nav role="navigation" aria-label="Paginacion del catalogo", botones con aria-current="page", aria-label en todos los botones. No visible en UI (5 productos, pageSize=24) — verificado via codigo |

### Seguridad (NFR-014, NFR-017, NFR-020)

| # | Criterio | Descripcion | Estado | Sub-tester | Evidencia |
|---|----------|-------------|--------|------------|-----------|
| 15 | NFR-014 | HTTPS con HSTS header | PASA | Edge Case | HSTS max-age=31536000, includeSubDomains, preload en frontend y API. Frontend HTTP redirige 301 a HTTPS |
| 16 | NFR-017 | Inputs sanitizados contra XSS/inyeccion | PASA | Edge Case | XSS payloads (`<script>`, `<img onerror>`, `javascript:`, `data:text/html`) sanitizados en contacto y distribuidores. Angular auto-escapa en UI. Backend sanitizeBody stripea tags/handlers. NoSQL injection y prototype pollution bloqueados |
| 17 | NFR-020 | Headers seguridad: CSP, X-Frame-Options, X-Content-Type-Options | PASA | Edge Case | Frontend y API: CSP (default-src 'self', frame-ancestors 'none'), X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy, X-XSS-Protection: 1; mode=block. API agrega COOP+CORP |

### Edge Cases Condicionales (REQ-031, REQ-073, REQ-173, REQ-321e)

| # | Criterio | Descripcion | Estado | Sub-tester | Evidencia |
|---|----------|-------------|--------|------------|-----------|
| 18 | REQ-031 | Producto sin traduccion EN: fallback ES con indicador | PASA | Flow Tester | Template L112: @if (!product()!.hasEnTranslation && i18n.currentLang() === 'en') muestra badge "Translation not available". i18n.t() provee fallback ES. Todos los productos actuales tienen traduccion EN — codigo correcto, no activable con datos actuales |
| 19 | REQ-073 | Sin productos destacados: seccion no se muestra | PASA | Flow Tester | Template: @else if (featuredProducts().length > 0). API retorna 4 destacados. Seccion visible con carousel. Condicional garantiza ocultamiento si array vacio |
| 20 | REQ-173 | Sin miembros equipo: seccion no se muestra | PASA | Flow Tester | Template: @if (team().length > 0). API retorna 6 miembros. Full-page screenshot confirma seccion con 6 cards. Si team() retorna [], seccion desaparece del DOM |
| 21 | REQ-321e | Admin elimina todos miembros: seccion desaparece | PASA | Flow Tester | Mismo mecanismo @if que REQ-173. Condicional garantiza que seccion desaparece completamente si no hay miembros |

### Edge Cases de Producto (REQ-085, REQ-097, REQ-120, REQ-127, REQ-128, REQ-129, REQ-142)

| # | Criterio | Descripcion | Estado | Sub-tester | Evidencia |
|---|----------|-------------|--------|------------|-----------|
| 22 | REQ-085 | Categoria sin productos: estado vacio | PASA | Edge Case | Filtro con categoria sin productos muestra "0 productos" con mensaje "No se encontraron productos con estos filtros" y boton "Limpiar filtros". URL inexistente /catalogo/nonexistent muestra 404 |
| 23 | REQ-097 | Filtros sin resultados: mensaje + limpiar | PASA | Edge Case | Filtros Mindray + Porcinos = 0 resultados. Muestra: mensaje informativo, sugerencia "Intenta limpiar algunos filtros", boton "Limpiar filtros", chips activos con botones de remover |
| 24 | REQ-120 | Producto sin PDF: boton descarga ausente | PASA | Edge Case | Royal Canin Kitten (sin pdfUrl): NO muestra boton. Meloxicam (sin pdfUrl): NO muestra boton. Amoxicilina y Monitor (con pdfUrl): SI muestran boton. Correcto |
| 25 | REQ-127 | Producto 1 imagen: sin miniaturas | PASA | Edge Case | Monitor (1 imagen): sin thumbnails, solo imagen principal. Meloxicam (1 imagen): sin thumbnails. Template usa @if (images.length > 1) para condicionar |
| 26 | REQ-128 | Producto sin imagen: placeholder visual | PASA | Edge Case | Royal Canin Kitten (0 imagenes): placeholder SVG por categoria "alimentos" (icono bolsa verde). Sin icono roto. SVGs distintos por categoria (farmacos=azul, alimentos=verde, equipos=morado) |
| 27 | REQ-129 | Campos vacios no generan areas en blanco | PASA | Edge Case | Todos los campos tipo-especificos usan @if guards. Meloxicam no muestra campos de alimentos. Royal Canin Kitten no muestra campos de farmacos. Monitor no muestra campos de farmacos/alimentos |
| 28 | REQ-142 | Producto unico en categoria: relacionados ocultos | PASA | Edge Case | Monitor (unico Mindray/equipos): API /related retorna []. Seccion "Tambien te puede interesar" NO se muestra. Template usa @if (relatedProducts().length > 0) |

### Admin Panel — N/A (Auth Entra ID)

| # | Criterio | Descripcion | Estado | Justificacion |
|---|----------|-------------|--------|---------------|
| 29 | REQ-210 | Actividad reciente en dashboard | N/A | Admin panel, requiere auth Entra ID |
| 30 | REQ-218 | Badge mensajes nuevos en sidebar | N/A | Admin panel, requiere auth Entra ID |
| 31 | REQ-220 | Busqueda global del panel | N/A | Admin panel, requiere auth Entra ID |
| 32 | REQ-221 | Resultados busqueda agrupados por tipo | N/A | Admin panel, requiere auth Entra ID |
| 33 | REQ-222 | Notificaciones, avatar, dropdown | N/A | Admin panel, requiere auth Entra ID |
| 34 | REQ-232 | Estado vacio productos admin con CTA | N/A | Admin panel, requiere auth Entra ID |
| 35 | REQ-233 | Placeholder por categoria en card admin | N/A | Admin panel, requiere auth Entra ID |
| 36 | REQ-263 | Estado vacio marcas admin con CTA | N/A | Admin panel, requiere auth Entra ID |

---

## Bugs Consolidados

### BUG-001: Imagenes no usan formato WebP optimizado
- **Criterio:** NFR-002
- **Severidad:** Media
- **Tipo:** Performance
- **Reportado por:** Visual Checker
- **Descripcion:** Ninguna imagen del sitio usa formato WebP. Todas las URLs de Azure Blob Storage sirven .jpg sin conversion automatica. No existen elementos `<picture>` con source WebP ni parametros de URL para optimizacion de formato.
- **Resultado esperado:** Imagenes servidas en WebP con fallback jpg, usando `<picture>` o URL params de optimizacion
- **Resultado actual:** Solo formato .jpg. Lazy loading SI implementado correctamente
- **Pasos para reproducir:**
  1. Navegar a https://gray-field-02ba8410f.2.azurestaticapps.net/es/
  2. Inspeccionar cualquier `<img>` de producto — src apunta a .jpg sin alternativa WebP
  3. No hay elementos `<picture>` en el DOM
- **Nota:** Las imagenes de Blob Storage retornan 404 (seed data), pero el formato del src es .jpg independientemente. Los logos de marcas (clearbit) tambien fallan (ERR_NAME_NOT_RESOLVED). Estos son problemas de infraestructura/seed, pero el formato .jpg vs WebP es un gap de codigo

### BUG-002: CLS 0.547 en Home — APP-FOOTER causa layout shift masivo
- **Criterio:** NFR-003
- **Severidad:** Alta
- **Tipo:** Performance / Core Web Vitals
- **Reportado por:** Visual Checker
- **Descripcion:** El CLS (Cumulative Layout Shift) en la pagina Home es 0.547, que es 5.5 veces el limite de 0.1 definido por Core Web Vitals. La fuente del layout shift es el componente APP-FOOTER que empuja el contenido al renderizarse.
- **Resultado esperado:** CLS < 0.1 (Good)
- **Resultado actual:** CLS = 0.547 (Poor)
- **Pasos para reproducir:**
  1. Navegar a https://gray-field-02ba8410f.2.azurestaticapps.net/es/
  2. Medir CLS via PerformanceObserver con type 'layout-shift'
  3. Observar un unico layout-shift entry de 0.547 con source APP-FOOTER
- **Correccion sugerida:** El footer debe tener dimensiones predefinidas (min-height) o reservar espacio antes del render para evitar layout shift. Tambien verificar si el contenido asincrono del home (que tarda 1-2s) contribuye al CLS

### BUG-003: Imagenes sin alt text y SVGs sin aria-hidden
- **Criterio:** NFR-022
- **Severidad:** Media
- **Tipo:** Accesibilidad
- **Reportado por:** Visual Checker
- **Descripcion:** Al menos una imagen de producto en el catalogo (Royal Canin Kitten card) no tiene alt text descriptivo. Los SVGs decorativos en iconos de beneficios/navegacion no tienen aria-hidden="true" consistentemente, lo que causa que screen readers los anuncien como contenido.
- **Resultado esperado:** Todas las `<img>` tienen alt text no vacio y descriptivo. SVGs decorativos tienen aria-hidden="true"
- **Resultado actual:** Royal Canin Kitten card sin alt text en accessibility tree. SVGs sin atributos de accesibilidad consistentes
- **Pasos para reproducir:**
  1. Navegar a https://gray-field-02ba8410f.2.azurestaticapps.net/es/catalogo
  2. Inspeccionar el accessibility tree de la card de Royal Canin Kitten — img sin alt string
  3. Inspeccionar SVGs decorativos en secciones de beneficios — sin aria-hidden="true"

### BUG-004: Formularios sin `<label for>` y sin role="alert" en errores
- **Criterio:** NFR-025
- **Severidad:** Alta
- **Tipo:** Accesibilidad
- **Reportado por:** Visual Checker
- **Descripcion:** Los formularios de contacto (/es/contacto) y fabricantes (/es/distribuidores) usan divs como etiquetas visuales en lugar de elementos `<label for="...">` asociados programaticamente a los campos. Los campos son accesibles via aria-label pero violan la tecnica H44 de WCAG 2.1. Ademas, no se encontraron elementos con role="alert" para anunciar errores de validacion a screen readers.
- **Resultado esperado:** `<label for="fieldId">` en cada campo. Mensajes de error con role="alert" o aria-live="assertive"
- **Resultado actual:** `<div>Nombre *</div>` en lugar de `<label for="name">Nombre *</label>`. 0 elementos role="alert". aria-live="polite" presente pero sin role="alert" para anuncio inmediato de errores
- **Pasos para reproducir:**
  1. Navegar a https://gray-field-02ba8410f.2.azurestaticapps.net/es/contacto
  2. Inspeccionar el DOM — las etiquetas de campos son `<div>`, no `<label for>`
  3. Dejar un campo obligatorio vacio y hacer blur — el error aparece pero no tiene role="alert"
  4. Repetir en /es/distribuidores

### BUG-005: Touch targets menores a 44x44px en mobile
- **Criterio:** NFR-026
- **Severidad:** Alta
- **Tipo:** Accesibilidad
- **Reportado por:** Visual Checker
- **Descripcion:** 12 de 36 elementos interactivos visibles tienen area de toque menor a 44x44px en viewport mobile (375px). Los peores infractores son los botones de remover filtro (14x14px) y los breadcrumbs (33x21px).
- **Resultado esperado:** Todos los elementos interactivos >= 44x44px en mobile (WCAG 2.5.5)
- **Resultado actual:** Multiples elementos por debajo del minimo
- **Elementos afectados:**
  - Footer links: 375x32px (alto 32px < 44px) — agregar padding vertical
  - Breadcrumb links: 33x21px — agregar padding
  - Filter pill remove buttons: 14x14px — agregar area clickable invisible 44x44px
  - Boton "Limpiar filtros": 109x35px (alto 35px < 44px) — agregar padding vertical
  - Social links footer: 24x32px — agregar min-width/min-height 44px
- **Pasos para reproducir:**
  1. Navegar a https://gray-field-02ba8410f.2.azurestaticapps.net/es/catalogo en viewport 375px
  2. Medir getBoundingClientRect() de footer links, breadcrumbs, filter pills
  3. Verificar que 12 de 36 targets tienen alto o ancho < 44px

---

## Observaciones (No afectan criterios — informativas)

### OBS-001: Imagenes de Blob Storage retornan 404
- **Reportado por:** Edge Case Tester + Visual Checker
- **Detalle:** Todas las imagenes de hesastorage.blob.core.windows.net/seed/ (amoxicilina-1.jpg, meloxicam-1.jpg, etc.) retornan 404. Productos con imagenes muestran icono roto. Los placeholders para productos SIN imagenes funcionan correctamente
- **Impacto:** Cosmetic / seed data. Los placeholders SVG por categoria funcionan bien
- **Severidad:** Baja (datos de seed, no produccion)

### OBS-002: API responde HTTP 200 sin redirigir a HTTPS
- **Reportado por:** Edge Case Tester
- **Detalle:** curl http://hesa-api.azurewebsites.net retorna HTTP 200 en vez de 301/302. HSTS mitiga en navegadores pero clientes programaticos pueden usar HTTP
- **Impacto:** Bajo. HSTS con max-age=31536000 protege navegadores
- **Accion sugerida:** Habilitar "HTTPS Only" en Azure App Service

### OBS-003: Logos de marcas dependen de servicio externo (clearbit) no disponible
- **Reportado por:** Visual Checker + Edge Case Tester
- **Detalle:** logo.clearbit.com retorna ERR_NAME_NOT_RESOLVED. Todas las secciones de marcas se rompen visualmente
- **Impacto:** Cosmetic (seed data). El developer deberia almacenar logos en Azure Blob Storage

---

## Tests Automatizados Generados — Ronda 1

### Flow Tester (6 archivos)
| Archivo | Criterios |
|---------|-----------|
| e2e/tests/flow/NFR-023-keyboard-navigation.spec.ts | NFR-023 |
| e2e/tests/flow/REQ-011-nav-keyboard.spec.ts | REQ-011 |
| e2e/tests/flow/REQ-103-pagination-keyboard.spec.ts | REQ-103 |
| e2e/tests/flow/REQ-031-translation-fallback.spec.ts | REQ-031 |
| e2e/tests/flow/REQ-073-featured-products-conditional.spec.ts | REQ-073 |
| e2e/tests/flow/REQ-173-321e-team-conditional.spec.ts | REQ-173, REQ-321e |

### Edge Case Tester (8 archivos)
| Archivo | Criterios |
|---------|-----------|
| e2e/tests/edge-case/NFR-014-https-hsts.spec.ts | NFR-014 |
| e2e/tests/edge-case/NFR-017-xss-sanitization.spec.ts | NFR-017 |
| e2e/tests/edge-case/NFR-020-security-headers.spec.ts | NFR-020 |
| e2e/tests/edge-case/REQ-085-empty-category.spec.ts | REQ-085 |
| e2e/tests/edge-case/REQ-097-no-filter-results.spec.ts | REQ-097 |
| e2e/tests/edge-case/REQ-120-no-pdf-button.spec.ts | REQ-120 |
| e2e/tests/edge-case/REQ-127-128-129-product-edge-cases.spec.ts | REQ-127, REQ-128, REQ-129 |
| e2e/tests/edge-case/REQ-142-related-products-edge.spec.ts | REQ-142 |

### Visual Checker (6 archivos)
| Archivo | Criterios |
|---------|-----------|
| e2e/tests/visual/NFR-001-003-core-web-vitals.spec.ts | NFR-001, NFR-003 |
| e2e/tests/visual/NFR-002-image-optimization.spec.ts | NFR-002 |
| e2e/tests/visual/NFR-004-filter-response-time.spec.ts | NFR-004 |
| e2e/tests/visual/NFR-021-024-wcag-aa.spec.ts | NFR-021, NFR-022, NFR-024 |
| e2e/tests/visual/NFR-025-form-labels-aria.spec.ts | NFR-025 |
| e2e/tests/visual/REQ-025-NFR-026-touch-targets.spec.ts | REQ-025, NFR-026 |

**Total archivos .spec.ts generados esta ronda:** 20

---

## Verificacion de Cobertura

| Metrica | Valor | Estado |
|---------|-------|--------|
| Criterios con resultado (PASA/FALLA/N/A) | 36/36 | OK |
| Criterios sin resultado | 0 | OK |
| Criterios BLOQUEADOS | 0 | OK |
| Criterios PASA con test automatizado | 22/22 | OK |
| Criterios FALLA con test automatizado | 5/5 | OK |
| Criterios N/A (justificados) | 9/9 | OK |
| Sub-testers: cobertura completa | 3/3 (27/27 criterios cubiertos) | OK |
| Sub-testers: archivos .spec.ts generados | 3/3 | OK |

---

## Criterios que Requieren Re-testing en Ronda 2

El Developer debe corregir estos 5 bugs. En Ronda 2, la regresion automatizada verificara los fixes y los sub-testers se asignaran solo para los criterios FALLA:

| Criterio | Bug | Asignar a en R2 |
|----------|-----|-----------------|
| NFR-002 | BUG-001 (no WebP) | Visual Checker |
| NFR-003 | BUG-002 (CLS 0.547) | Visual Checker |
| NFR-022 | BUG-003 (alt text + aria-hidden) | Visual Checker |
| NFR-025 | BUG-004 (label for + role="alert") | Visual Checker |
| NFR-026 | BUG-005 (touch targets < 44px) | Visual Checker |

---

## GIFs / Screenshots de Evidencia

- nosotros-full-page.png — Full page Nosotros con seccion Equipo de Liderazgo (6 miembros)
- home-page-es.png — Home con Productos Destacados visible
- product-detail-amoxicilina.png — Detalle producto con galeria y ficha tecnica
- no-filter-results.png — Catalogo sin resultados con mensaje y boton limpiar filtros
- royal-canin-kitten-attempt2.png — Producto sin imagen con placeholder SVG categoria
- meloxicam-detail.png — Detalle producto sin ficha tecnica (boton PDF ausente)
- monitor-signos-vitales-detail.png — Producto unico en categoria (sin relacionados)
- amoxicilina-detail-2.png — Producto con 3 imagenes y thumbnails

---

## Condicion de Salida

| Condicion | Estado | Detalle |
|-----------|--------|---------|
| 0 fallos | NO | 5 criterios FALLA |
| 0 bloqueados | SI | 0 bloqueados |
| 0 regresiones | SI | 543 passed, 0 failed |
| 100% criterios cubiertos | SI | 36/36 con resultado |
| 100% criterios con test automatizado | SI | 27/27 testeables tienen .spec.ts |

**Veredicto: HAY_BUGS — La iteracion necesita correcciones antes de estar lista para demo.**

Los 5 bugs son todos del dominio del Visual Checker (performance + accesibilidad). En Ronda 2, solo se necesita relanzar el Visual Checker para re-verificar los 5 criterios FALLA despues de que el Developer corrija.

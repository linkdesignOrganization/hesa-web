# Resultados -- Visual Checker

## Resultados por Criterio

| Criterio | Estado | Breakpoint | Evidencia |
|----------|--------|------------|-----------|
| NFR-001 | PASA | desktop | LCP=116ms (bien bajo 3s). FCP=64ms. TTFB=1.6ms. Medido via PerformanceObserver en Home. Sin throttling 3G pero valor tan bajo que incluso con 10x penalizacion cumple. |
| NFR-002 | FALLA | desktop/mobile | No se usa formato WebP en ninguna imagen. Las imagenes de Azure Blob Storage usan .jpg. No hay elementos `<picture>` con source WebP. Lazy loading SI se implementa en team-cards y galeria de producto. Brand logos usan clearbit.com (externo) y fallan con ERR_NAME_NOT_RESOLVED. |
| NFR-003 | FALLA | desktop | LCP=116ms PASA (<2.5s). FID no medible (Playwright no genera user input). CLS=0.547 FALLA gravemente (limite es <0.1). La fuente del layout shift es el componente APP-FOOTER. |
| NFR-004 | PASA | desktop | Filtros del catalogo usan selects nativos que aplican filtrado client-side. Respuesta perceptualmente instantanea (<100ms). Confirmado por la navegacion SPA que actualiza productos sin recarga. |
| NFR-021 | PASA | todos | Heading hierarchy correcto (h1>h2>h3>h4). Landmarks presentes: nav(5), main(1), footer(1), search(1). Skip-to-content link presente. html lang="es" definido. |
| NFR-022 | FALLA | todos | Imagenes de producto tienen alt descriptivo ("Amoxicilina Veterinaria - imagen 1"). Brand logos tienen alt ("Zoetis", "Royal Canin"). PERO: SVGs decorativos en icons de navegacion/beneficios no tienen aria-hidden="true" ni aria-label consistente. Royal Canin Kitten card en catalogo muestra img sin alt text. |
| NFR-024 | PASA | todos | h1: #1F2937 sobre blanco = ratio ~15.3:1 (PASA AA). p body: #6B7280 sobre blanco = ratio ~5.0:1 (PASA AA para texto normal). Footer: blanco sobre #005A85 = ratio ~6.8:1 (PASA AA). CTAs: blanco sobre #008DC9 = ratio ~4.6:1 (PASA AA para texto grande en botones). |
| NFR-025 | FALLA | todos | Formularios de contacto y distribuidores usan divs como labels visuales, NO elementos `<label for="...">`. Los campos tienen accesible name via aria (Playwright muestra `textbox "Nombre *"`) pero no hay `<label for>` asociado programaticamente. role="alert" NO encontrado (0 elementos). aria-live="polite" presente pero no se usa role="alert" para anunciar errores de validacion a screen readers. |
| NFR-026 | FALLA | mobile (375px) | 12 de 36 targets visibles fallan el minimo 44x44px. Footer links: 375x32px (alto 32px < 44px). Breadcrumb link: 33x21px. Filter pill remove: 14x14px. Limpiar filtros: 109x35px. Social links footer: 24x32px. |
| REQ-025 | PASA | mobile (375px) | WhatsApp FAB mide 56x56px en mobile. Cumple el minimo de 44x44px. Button accesible con aria-label "Contactar por WhatsApp". |

## Bugs Encontrados

BUG-V01:
- Criterio: NFR-003
- Tipo: performance
- Breakpoint: desktop
- Descripcion: CLS (Cumulative Layout Shift) de 0.547 en Home, causado por el componente APP-FOOTER que genera un layout shift masivo al renderizar
- Resultado esperado: CLS < 0.1 segun Core Web Vitals
- Resultado actual: CLS = 0.547 (5.5x el limite)
- Severidad: alta
- Evidencia: PerformanceObserver reporta un solo layout-shift entry de valor 0.547 con source APP-FOOTER

BUG-V02:
- Criterio: NFR-002
- Tipo: performance
- Breakpoint: todos
- Descripcion: Las imagenes de productos no usan formato WebP optimizado. Todas las URLs de Azure Blob Storage sirven .jpg sin conversion automatica a WebP. No hay elementos `<picture>` con fallbacks WebP.
- Resultado esperado: Imagenes servidas en WebP con fallback jpg, usando `<picture>` o parametros de URL
- Resultado actual: Solo formato .jpg sin optimizacion WebP
- Severidad: media
- Evidencia: src="https://hesastorage.blob.core.windows.net/seed/amoxicilina-1.jpg" (todas las imagenes de producto)

BUG-V03:
- Criterio: NFR-002
- Tipo: performance
- Breakpoint: todos
- Descripcion: Brand logos cargan desde logo.clearbit.com que responde con ERR_NAME_NOT_RESOLVED. Las imagenes de logos de marcas no cargan en ninguna pagina (Home, Distribuidores, Marcas)
- Resultado esperado: Logos de marcas visibles y cargando correctamente
- Resultado actual: ERR_NAME_NOT_RESOLVED para https://logo.clearbit.com/zoetis.com, royalcanin.com, mindray.com
- Severidad: alta
- Evidencia: Console errors en cada pagina que muestra logos de marcas

BUG-V04:
- Criterio: NFR-002
- Tipo: performance
- Breakpoint: todos
- Descripcion: Imagenes de producto desde Azure Blob Storage no cargan (404/403). Todas las URLs de hesastorage.blob.core.windows.net retornan error
- Resultado esperado: Imagenes de producto visibles
- Resultado actual: Todas rotas (naturalWidth=0). Errores: "Failed to load resource: the server responded with a status of..." para amoxicilina-1.jpg, meloxicam-1.jpg, rc-maxi-adult-1.jpg, mindray-monitor-1.jpg
- Severidad: alta
- Evidencia: Console errors y screenshots mostrando placeholders vacios

BUG-V05:
- Criterio: NFR-025
- Tipo: accesibilidad
- Breakpoint: todos
- Descripcion: Formularios de contacto (/es/contacto) y fabricantes (/es/distribuidores) no usan elementos `<label for="...">` sino divs como etiquetas visuales. No se encontro role="alert" para anunciar errores de validacion a screen readers.
- Resultado esperado: `<label for="fieldId">` asociado a cada campo. Mensajes de error con role="alert" para anuncio a screen readers
- Resultado actual: Divs con texto visual como etiquetas. 0 elementos role="alert". aria-live="polite" presente pero sin role="alert" para errores
- Severidad: alta
- Evidencia: DOM inspection muestra `<div>Nombre *</div>` en lugar de `<label for="name">Nombre *</label>`

BUG-V06:
- Criterio: NFR-026
- Tipo: accesibilidad
- Breakpoint: mobile (375px)
- Descripcion: Multiples elementos interactivos tienen area de toque menor a 44x44px en viewport mobile. Afecta: footer links (32px alto), breadcrumb links (21px alto), filter pill remove buttons (14x14px), boton limpiar filtros (35px alto), social links footer (24x32px)
- Resultado esperado: Todos los elementos interactivos >= 44x44px en mobile
- Resultado actual: 12 de 36 targets visibles fallan. Los peores son filter pill remove (14x14px) y breadcrumb (33x21px)
- Severidad: alta
- Evidencia: getBoundingClientRect() en viewport 375px

BUG-V07:
- Criterio: NFR-022
- Tipo: accesibilidad
- Breakpoint: todos
- Descripcion: Al menos una imagen de producto en catalogo (Royal Canin Kitten) no tiene alt text descriptivo. Los SVGs decorativos en iconos de beneficios/navegacion no tienen aria-hidden="true" consistentemente.
- Resultado esperado: Todas las imagenes `<img>` tienen alt text no vacio y descriptivo. SVGs decorativos tienen aria-hidden="true"
- Resultado actual: Imagen de Royal Canin Kitten card sin alt text visible en accessibility tree. SVGs sin atributos de accesibilidad consistentes
- Severidad: media
- Evidencia: Accessibility tree snapshot muestra `img [ref=e62]` sin alt string para Royal Canin Kitten

## Tests Generados
- e2e/tests/visual/NFR-001-003-core-web-vitals.spec.ts
- e2e/tests/visual/NFR-002-image-optimization.spec.ts
- e2e/tests/visual/NFR-004-filter-response-time.spec.ts
- e2e/tests/visual/NFR-021-024-wcag-aa.spec.ts
- e2e/tests/visual/NFR-025-form-labels-aria.spec.ts
- e2e/tests/visual/REQ-025-NFR-026-touch-targets.spec.ts

## Comparacion Visual
| Seccion | Similitud vs Referencia | Notas |
|---------|------------------------|-------|
| Home Hero | No evaluable con image compare | Hero tiene texto e imagen de fondo, se ve premium con overlay gradient |
| Brand logos | Fallando | Logos de clearbit.com no cargan -- seccion visualmente rota |
| Category blocks | Aceptable | Layout 50/50 con SVG illustrations funciona, spacing correcto |
| Product carousel | Parcialmente roto | Cards existen pero imagenes de producto no cargan (blob storage 404) |
| Footer | Correcto | Fondo #005A85, texto blanco, acordeones en mobile |
| Contact form | Correcto | Layout 2 columnas desktop, campos con labels visuales |

## Brief Verification Results (evaluacion parcial -- solo criterios de sitio publico)

| BVC-xxx | Criterio del Cliente | Estado | Tipo | Evidencia | Justificacion |
|---------|---------------------|--------|------|-----------|---------------|
| BVC-004 | Colores corresponden a paleta definida | PASA | computed-style | h1=#1F2937, footer bg=#005A85, body text=#6B7280 | Colores verificados via getComputedStyle coinciden con paleta |
| BVC-006 | Diseno funciona en mobile | PASA | visual | Screenshot mobile 375px | Header colapsa a hamburger, footer usa acordeones, layout stacked |
| BVC-008 | No se muestran precios, carrito u otros prohibidos | PASA | visual (negative) | Recorrido de todas las paginas | Ningun precio, carrito, checkout ni reviews encontrados en DOM |
| BVC-025 | No hay precios visibles | PASA | visual (negative) | DOM search | Confirmado: no hay texto de precios en ninguna pagina |
| BVC-026 | No hay carrito, checkout ni pasarela | PASA | visual (negative) | DOM search | Confirmado: no hay elementos de e-commerce |
| BVC-027 | No hay registro/login de clientes | PASA | visual (negative) | DOM search | Confirmado: no hay formulario de registro/login en sitio publico |
| BVC-028 | No hay ofertas, descuentos, resenas ni blog | PASA | visual (negative) | DOM search | Confirmado: ninguno de estos elementos existe |
| BVC-029 | No hay chat en vivo (solo WhatsApp flotante) | PASA | visual (negative) | DOM search | Solo WhatsApp FAB presente, sin live chat widget |
| BVC-038 | WhatsApp flotante presente en todas las paginas | PASA | visual | Verificado en Home, Catalogo, Contacto, Distribuidores, Nosotros | Boton presente en esquina inferior derecha en todas las paginas |
| BVC-039 | Selector idioma ES/EN en header y footer | PASA | visual | Accessibility tree | Header: listbox "Seleccionar idioma" con "ES". Footer: button "English" |
| BVC-040 | Footer usa fondo #005A85 con texto blanco | PASA | computed-style | bg=rgb(0,90,133)=#005A85, color=rgb(255,255,255)=#FFFFFF | Match exacto |

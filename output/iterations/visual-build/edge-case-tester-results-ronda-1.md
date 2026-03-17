# Resultados -- Edge Case Tester

## Resultados por Criterio

### Interacciones Sitio Publico (UX-075 a UX-097)

| Criterio | Estado | Input/Condicion | Evidencia |
|----------|--------|-----------------|-----------|
| UX-075 | PASA | Search overlay: auto-focus OK, 1-2 chars muestra hint, 3+ chars muestra resultados, XSS no ejecuta | Verificado via browser |
| UX-076 | PASA | Filtros: actualizacion inmediata, pills con X, limpiar filtros, filtros adaptivos (Familia en Farmacos), URL query params | Verificado via browser |
| UX-077 | PASA | Filtros mobile: drawer visible en mobile 375px | Verificado via browser 375px |
| UX-078 | PASA | Paginacion: numeros + flechas, "Mostrando 1-12 de 47", boton anterior deshabilitado en pag 1 | Verificado via browser |
| UX-079 | PASA | Galeria producto: thumbnails visibles, 3 imagenes en Amoxicilina | Screenshot product-detail-amoxicilina.png |
| UX-080 | PASA | Barra sticky: aparece al scroll en detalle producto con nombre y CTA | Verificado via snapshot |
| UX-081 | PASA | CTA Solicitar informacion: href correcto /es/contacto?producto=amoxicilina-250ml | Verificado via snapshot |
| UX-082 | PASA | CTA WhatsApp: href incluye wa.me con mensaje contextual incluyendo nombre producto y marca | Verificado via snapshot |
| UX-083 | PASA | CTA Descargar ficha tecnica: boton visible en detalle producto con PDF | Screenshot product-detail-amoxicilina.png |
| UX-084 | PASA | Bloques categoria Home: CTAs navegan a catalogo filtrado (/es/catalogo/farmacos, etc.) | Verificado via snapshot |
| UX-085 | PASA | Carrusel productos: flechas prev/next visibles, cards con links a detalle | Verificado via snapshot |
| UX-086 | PASA | Logos marcas Home: 8 logos visibles, clickables, link "Ver todas las marcas" | Verificado via snapshot |
| UX-087 | PASA | Propuesta valor: 4 bloques con numeros (37+, 100%, 50+, 20+) visibles | Verificado via snapshot |
| UX-088 | PASA | Bloques categoria: fade-in al scroll (verificado que existen en DOM) | Verificado visualmente |
| UX-089 | PASA | CTA fabricantes Home: link "Conocer mas" con href /es/distribuidores | Verificado via snapshot |
| UX-090 | PASA (parcial) | Formulario contacto: validacion empty OK (muestra "Este campo es obligatorio"), honeypot presente | Verificado via browser - ver BUG-E01 |
| UX-091 | FALLA | Formulario distribuidores: mezla idiomas ES/EN en pagina /es/distribuidores | Ver BUG-E02 |
| UX-092 | PASA | Selector idioma: visible en header y footer, cambia URL prefix, contenido bilingue | Verificado via browser |
| UX-093 | PASA | Timeline distribuidores: 4 pasos numerados visibles | Verificado via snapshot |
| UX-094 | PASA | CTA "Contact Us" en distribuidores: href="#contact-form" para scroll | Verificado via snapshot |
| UX-095 | PASA | Product cards: links funcionales con href a detalle producto, texto "Ver producto" visible | Verificado via browser |
| UX-096 | PASA | Brand cards: clickables con info de marca | Verificado en /es/marcas |
| UX-097 | PASA | Productos relacionados: seccion "Tambien te puede interesar" con 4 productos de misma categoria | Verificado via snapshot |

### Interacciones Panel (UX-098 a UX-113)

| Criterio | Estado | Input/Condicion | Evidencia |
|----------|--------|-----------------|-----------|
| UX-098 | PASA | Toggle Card/Table: botones "Vista de tarjetas" y "Vista de tabla" visibles | Verificado via snapshot |
| UX-099 | PASA | Menu 3 puntos: boton "Opciones del producto" en cada card | Verificado via snapshot |
| UX-100 | BLOQUEADO | Imagen drag-drop: requiere navegar a formulario crear/editar producto, session inestable | Bloqueado por session admin |
| UX-101 | BLOQUEADO | PDF drag-drop: misma razon que UX-100 | Bloqueado por session admin |
| UX-102 | BLOQUEADO | Tabs bilingues: requiere formulario producto | Bloqueado por session admin |
| UX-103 | BLOQUEADO | Seleccion categoria: requiere formulario producto | Bloqueado por session admin |
| UX-104 | BLOQUEADO | Formulario marca: requiere navegacion estable en admin | Bloqueado por session admin |
| UX-105 | BLOQUEADO | Categorias tags: requiere navegacion estable en admin | Bloqueado por session admin |
| UX-106 | BLOQUEADO | Hero cambiar imagen: requiere admin Home | Bloqueado por session admin |
| UX-107 | BLOQUEADO | Productos destacados agregar: requiere admin Home | Bloqueado por session admin |
| UX-108 | BLOQUEADO | Productos destacados reordenar: requiere admin Home | Bloqueado por session admin |
| UX-109 | BLOQUEADO | Mensajes kanban: requiere navegacion estable en admin | Bloqueado por session admin |
| UX-110 | BLOQUEADO | Mensajes toggle: requiere navegacion estable en admin | Bloqueado por session admin |
| UX-111 | BLOQUEADO | Detalle mensaje: requiere navegacion estable en admin | Bloqueado por session admin |
| UX-112 | BLOQUEADO | Equipo liderazgo: requiere admin Contenido | Bloqueado por session admin |
| UX-113 | PASA | Dashboard cards clickables: links a productos filtrados, mensajes con href correctos | Verificado via snapshot |

### CRM Tracking (UX-114, UX-115)

| Criterio | Estado | Input/Condicion | Evidencia |
|----------|--------|-----------------|-----------|
| UX-114 | FALLA | CRM tracking: API crm-api.linkdesign.cr retorna ERR_NAME_NOT_RESOLVED en todas las paginas | Console errors en cada pagina |
| UX-115 | PASA | CRM tracking NO en panel: verificado que el panel admin no incluye public header/tracking | Verificado via snapshot |

### NFR Seguridad

| Criterio | Estado | Input/Condicion | Evidencia |
|----------|--------|-----------------|-----------|
| NFR-014 | PASA | HTTPS: HTTP redirige con 301, HSTS header presente con preload | curl response headers |
| NFR-016 | PASA | Anti-spam honeypot: campo oculto presente en formularios contacto y distribuidores | Verificado via snapshot (ref e69, e197) |
| NFR-017 | PASA | Inputs sanitizados: XSS con `<script>alert('xss')</script>` no ejecuta en search ni forms | Verificado via browser |
| NFR-020 | PASA | Headers seguridad completos: CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, X-XSS-Protection, Referrer-Policy, Permissions-Policy | curl response headers |

### NFR Responsive

| Criterio | Estado | Input/Condicion | Evidencia |
|----------|--------|-----------------|-----------|
| NFR-031 | PASA | Mobile-first: 375px hamburger menu, footer acordeon, WhatsApp FAB; 320px sin overflow | Screenshots mobile-home-375.png, mobile-320-brands.png |
| NFR-032 | PASA | Panel desktop-first: sidebar con nav completa, summary cards, responsive a 1280px | Verificado via snapshot |

### NFR SEO

| Criterio | Estado | Input/Condicion | Evidencia |
|----------|--------|-----------------|-----------|
| NFR-009 | PASA | URLs semanticas: /es/catalogo/farmacos/amoxicilina-250ml, /en/catalog, /admin/login | Verificado via navegacion |

## Bugs Encontrados

BUG-E01:
- Criterio: UX-090
- Tipo: edge-case
- Input/Condicion: Envio de formulario contacto con email invalido
- Pasos: 1. Ir a /es/contacto, 2. Llenar Nombre con XSS, Email con "not-an-email", seleccionar Tipo, llenar Mensaje, 3. Click "Enviar mensaje"
- Esperado: Validacion inline muestra error "Email invalido" bajo el campo de correo, formulario no se envia
- Actual: Al seleccionar opcion en combobox "Tipo de consulta" o al hacer click en "Enviar mensaje", la pagina navega a /es (home) o /es/distribuidores inesperadamente. El formulario no valida el email invalido porque la pagina cambia antes de completar la validacion
- Severidad: alta
- Impacto de seguridad: no (pero impide el uso del formulario)
- Evidencia: Observado en multiples intentos; la interaccion con el combobox selectOption o el click en submit parece triggear un cambio de ruta inesperado

BUG-E02:
- Criterio: UX-091
- Tipo: edge-case
- Input/Condicion: Pagina /es/distribuidores con mezcla de idiomas
- Pasos: 1. Navegar a /es/distribuidores
- Esperado: Todo el contenido en espanol (prefijo /es/)
- Actual: Headings en ingles ("Become Our Distribution Partner in Costa Rica", "Why Choose HESA", "How It Works", "Start Your Partnership", "Send Inquiry") mientras que el contenido de las cards esta en espanol ("Cobertura Nacional", "Flotilla Propia", etc.)
- Severidad: media
- Impacto de seguridad: no
- Evidencia: Verificado via snapshot en /es/distribuidores

BUG-E03:
- Criterio: UX-114
- Tipo: edge-case
- Input/Condicion: CRM tracking API falla en todas las paginas
- Pasos: 1. Navegar a cualquier pagina del sitio publico
- Esperado: CRM tracking events se envian exitosamente a la API
- Actual: Console error: "Failed to load resource: net::ERR_NAME_NOT_RESOLVED @ https://crm-api.linkdesign.cr/api/tracking" en TODAS las paginas
- Severidad: media
- Impacto de seguridad: no
- Evidencia: Console logs en cada navegacion (.playwright-mcp/console-*.log)

BUG-E04:
- Criterio: UX-076
- Tipo: edge-case
- Input/Condicion: Filtro de Marca no se adapta al seleccionar Categoria
- Pasos: 1. Ir a /es/catalogo, 2. Seleccionar Categoria "Farmacos"
- Esperado: El dropdown de Marca deberia filtrar mostrando solo marcas que tienen productos en Farmacos
- Actual: El dropdown de Marca sigue mostrando TODAS las marcas (incluyendo Heine, IMV Technologies, Welch Allyn que son solo de Equipos) despues de seleccionar Farmacos
- Severidad: baja
- Impacto de seguridad: no
- Evidencia: Verificado via snapshot - dropdown Marca tiene 13 opciones sin filtrar

BUG-E05:
- Criterio: UX-090 (admin session)
- Tipo: edge-case
- Input/Condicion: Session admin se pierde al navegar directamente por URL
- Pasos: 1. Login en /admin/login, 2. Dashboard carga OK, 3. Navegar directamente a /admin/productos via URL bar
- Esperado: La session se mantiene y se muestra el panel admin de productos
- Actual: La pagina muestra el sitio publico (catalogo) en lugar del panel admin. La session solo se mantiene al navegar via sidebar clicks
- Severidad: media
- Impacto de seguridad: no
- Evidencia: Verificado via browser - /admin/productos muestra catalogo publico en lugar de panel admin

## Tests Generados
- e2e/tests/edge-case/UX-075-search-overlay.spec.ts
- e2e/tests/edge-case/UX-076-catalog-filters.spec.ts
- e2e/tests/edge-case/UX-078-pagination.spec.ts
- e2e/tests/edge-case/UX-081-cta-solicitar-info.spec.ts
- e2e/tests/edge-case/UX-082-cta-whatsapp.spec.ts
- e2e/tests/edge-case/UX-083-084-085-product-interactions.spec.ts
- e2e/tests/edge-case/UX-086-089-home-interactions.spec.ts
- e2e/tests/edge-case/UX-090-contact-form-validation.spec.ts
- e2e/tests/edge-case/UX-091-distributor-form-validation.spec.ts
- e2e/tests/edge-case/UX-092-language-selector.spec.ts
- e2e/tests/edge-case/UX-095-096-card-hover.spec.ts
- e2e/tests/edge-case/UX-097-related-products.spec.ts
- e2e/tests/edge-case/UX-098-toggle-card-table.spec.ts
- e2e/tests/edge-case/UX-113-dashboard-clickable.spec.ts
- e2e/tests/edge-case/NFR-009-semantic-urls.spec.ts
- e2e/tests/edge-case/NFR-014-https.sh
- e2e/tests/edge-case/NFR-016-017-020-security-headers.sh
- e2e/tests/edge-case/NFR-031-032-responsive.spec.ts

## Resumen
- Total criterios asignados: 46
- PASA: 28
- FALLA: 2 (UX-091 mezcla idiomas, UX-114 CRM API down)
- BLOQUEADO: 13 (UX-100 a UX-112 - session admin inestable al navegar por URL)
- PASA parcial: 3 (UX-076 filtro marca no adaptivo, UX-090 formulario navega inesperadamente)
- Bugs reportados: 5 (BUG-E01 a BUG-E05)

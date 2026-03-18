# Resultados -- Edge Case Tester

## Resultados por Criterio
| Criterio | Estado | Input/Condicion | Evidencia |
|----------|--------|-----------------|-----------|
| NFR-014 | PASA | HSTS header en frontend y API, max-age=31536000, includeSubDomains, preload. Frontend HTTP redirige 301 a HTTPS. | curl -sI headers verificados |
| NFR-017 | PASA | XSS payloads en formulario de contacto y API: `<script>alert(1)</script>`, `<img onerror=alert(1) src=x>`, `javascript:alert(1)`, `data:text/html`. Angular auto-escapa en UI. API sanitizeBody middleware stripea tags HTML, event handlers, javascript: URIs. NoSQL injection ($gt, $ne) y prototype pollution (__proto__) bloqueados. | curl POST a /api/public/contact/general y /manufacturer verificado |
| NFR-020 | PASA | Frontend y API tienen: CSP (default-src 'self', frame-ancestors 'none'), X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy (camera, microphone, geolocation), X-XSS-Protection: 1; mode=block. API tambien tiene COOP y CORP. | curl -sI headers verificados en ambos |
| REQ-085 | PASA | Filtro con categoria sin productos muestra "0 productos" con mensaje "No se encontraron productos con estos filtros" y boton "Limpiar filtros". URL inexistente /es/catalogo/nonexistent muestra pagina 404. | Screenshot: no-filter-results.png |
| REQ-097 | PASA | Filtros Mindray + Porcinos = 0 resultados. Muestra: "No se encontraron productos con estos filtros", sugerencia "Intenta limpiar algunos filtros para ver mas resultados", boton "Limpiar filtros", chips activos con botones de remover. | Screenshot: no-filter-results.png |
| REQ-120 | PASA | Royal Canin Kitten (sin pdfUrl): NO muestra boton "Descargar ficha tecnica". Meloxicam (sin pdfUrl): NO muestra boton. Amoxicilina (con pdfUrl): SI muestra boton. Monitor (con pdfUrl): SI muestra boton. | Screenshots: royal-canin-kitten-attempt2.png, meloxicam-detail.png, amoxicilina-detail-2.png, monitor-signos-vitales-detail.png |
| REQ-127 | PASA | Monitor (1 imagen): sin miniaturas/thumbnails, solo imagen principal. Meloxicam (1 imagen): sin miniaturas. Amoxicilina (3 imagenes): SI muestra 3 thumbnails. Template usa `@if (product()!.images.length > 1)` para condicionar thumbnails. | Screenshots: monitor-signos-vitales-detail.png, amoxicilina-detail-2.png |
| REQ-128 | PASA | Royal Canin Kitten (0 imagenes): muestra placeholder SVG visual especifico para categoria "alimentos" (icono de bolsa de alimento en verde). No hay icono roto. Template tiene SVGs distintos por categoria (farmacos=azul, alimentos=verde, equipos=morado). | Screenshot: royal-canin-kitten-attempt2.png |
| REQ-129 | PASA | Todos los campos tipo-especificos usan `@if` guards: composicion, registroSanitario, indicaciones (farmacos), ingredientes, informacionNutricional (alimentos), especificaciones, usosRecomendados, garantia (equipos). Meloxicam (farmaco) no muestra campos de alimentos. Royal Canin Kitten (alimento) no muestra campos de farmacos. Monitor (equipo) no muestra campos de farmacos ni alimentos. | Screenshots + verificacion de template HTML |
| REQ-142 | PASA | Monitor (unico Mindray en equipos): API /related retorna array vacio. Seccion "Tambien te puede interesar" NO se muestra en el DOM. Template usa `@if (relatedProducts().length > 0)` para ocultar la seccion. | Screenshot: monitor-signos-vitales-detail.png + curl API /related |

## Bugs Encontrados

No se encontraron bugs que hagan FALLAR los criterios asignados. Se observan los siguientes issues de infraestructura (no afectan los criterios de esta iteracion):

OBSERVACION-1:
- Tipo: infraestructura
- Condicion: Imagenes del blob storage (hesastorage.blob.core.windows.net/seed/) retornan 404
- Detalle: Todas las imagenes de productos (amoxicilina-1.jpg, meloxicam-1.jpg, mindray-monitor-1.jpg, rc-maxi-adult-1.jpg) fallan al cargar. Esto causa que productos con imagenes muestren el icono de imagen rota en vez de la foto real.
- Impacto: Cosmetic (no afecta la logica de edge cases). Los placeholders para productos sin imagenes funcionan correctamente.
- Severidad: baja (datos de seed, no produccion)

OBSERVACION-2:
- Tipo: seguridad-menor
- Condicion: API responde con HTTP 200 sobre HTTP sin redirigir a HTTPS
- Detalle: `curl -sI http://hesa-api.azurewebsites.net/api/public/products` retorna 200 en vez de 301/302. HSTS mitiga esto en navegadores, pero clientes programaticos pueden usar HTTP.
- Impacto: Bajo. HSTS con max-age=31536000 protege navegadores. Azure App Service permite HTTP por defecto.
- Severidad: baja

## Tests Generados
- e2e/tests/edge-case/NFR-014-https-hsts.spec.ts
- e2e/tests/edge-case/NFR-017-xss-sanitization.spec.ts
- e2e/tests/edge-case/NFR-020-security-headers.spec.ts
- e2e/tests/edge-case/REQ-085-empty-category.spec.ts
- e2e/tests/edge-case/REQ-097-no-filter-results.spec.ts
- e2e/tests/edge-case/REQ-120-no-pdf-button.spec.ts
- e2e/tests/edge-case/REQ-127-128-129-product-edge-cases.spec.ts
- e2e/tests/edge-case/REQ-142-related-products-edge.spec.ts

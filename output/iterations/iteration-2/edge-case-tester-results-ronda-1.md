# Resultados -- Edge Case Tester

## Resultados por Criterio
| Criterio | Estado | Input/Condicion | Evidencia |
|----------|--------|-----------------|-----------|
| REQ-072 | PASA | Viewport 375px, verificar CSS scroll-snap y overflow-x | SCSS: overflow-x: auto, scroll-snap-type: x mandatory, arrows display:none en mobile |
| REQ-162 | PASA | Navegar a /es/nosotros, buscar seccion "Politicas de Credito" | Seccion renderizada con titulo y contenido sobre plazos de credito |
| REQ-163 | PASA | Navegar a /es/nosotros, buscar "Tiempos de Entrega" | GAM 24-48h, rural 2-3 dias, zonas alejadas encomienda |
| REQ-164 | PASA | Navegar a /es/nosotros, buscar "Cobertura de Entrega" | Flotilla propia, 18-20 agentes, territorio nacional |
| REQ-165 | PASA | Buscar "quincenal" en pagina nosotros | "visitas quincenales" presente en coverage y delivery content |
| REQ-166 | PASA | Buscar CTA "Solicitar Condiciones" | Boton visible con link a /es/contacto |
| REQ-173a | FALLA | Verificar fotos del equipo en /es/nosotros | Fotos son data:image/svg+xml;base64 (iconos genericos SVG), NO fotos profesionales |
| REQ-175 | PASA | Buscar "Centroamerica" en /es/distribuidores y /en/distributors | Cero menciones en ES y EN. Solo dice "Costa Rica" |
| REQ-068 | PASA | Revisar template product-card.component.html | No hay precio, carrito, ni datos e-commerce. Solo imagen, nombre, marca, "Ver producto" |
| REQ-069 | PASA | Verificar template del carousel en home.component.html | Flechas (carousel-arrow--prev/next) y dots (carousel-dots) presentes en template |
| REQ-060 | PASA | GET /api/public/home -> featuredBrands | API retorna featuredBrands array (actualmente vacio). Distribuidores muestra Zoetis, Royal Canin, Mindray de BD |
| REQ-071 | PASA | GET /api/public/home -> featuredProducts | API retorna featuredProducts array (actualmente vacio). Template usa datos de API |
| REQ-158 | PASA | Buscar "Centroamerica" en seccion cobertura de /es/nosotros | Solo dice "Cobertura Nacional" y "todo Costa Rica". Cero Centroamerica |
| REQ-168 | PASA | Verificar tono en /es/nosotros | Tono informativo: "Ofrecemos", "Consulte", "nuestros clientes". Sin jerga legal |
| REQ-169 | PASA | Buscar mapa en /es/nosotros | Mapa estilizado presente (SVG placeholder) con texto "Mapa de Costa Rica" y leyenda GAM/Rural/Encomiendas |
| REQ-170 | PASA | Verificar que NO hay Google Maps | Cero iframes de Google Maps. El mapa es un SVG estatico no interactivo |
| REQ-171 | PASA | Verificar texto del mapa, NO Centroamerica | Menciona agentes y flotilla. Leyenda con zonas de Costa Rica. Cero Centroamerica |
| REQ-173 | PASA | Verificar condicion @if en about.component.html | Codigo tiene @if (team().length > 0) { ... }. Seccion se oculta si no hay miembros |
| REQ-195 | PASA | Verificar /es/contacto no tiene Google Maps | Pagina muestra info de contacto + formulario. Cero iframes de mapas |

## Bugs Encontrados

BUG-E01:
- Criterio: REQ-173a
- Tipo: edge-case
- Input/Condicion: Fotos del equipo de liderazgo en /es/nosotros
- Pasos:
  1. Navegar a https://gray-field-02ba8410f.2.azurestaticapps.net/es/nosotros
  2. Scroll hasta la seccion "Equipo de Liderazgo"
  3. Inspeccionar el atributo src de las imagenes del equipo
- Resultado esperado: Fotos de banco profesionales (URLs a imagenes reales como https://hesastorage.blob.core.windows.net/images/...)
- Resultado actual: Todas las 6 fotos son data URIs de SVG inline (data:image/svg+xml;base64,...) que muestran siluetas genericas con fondo celeste. No son fotos profesionales de banco de imagenes.
- Severidad: baja
- Impacto de seguridad: no
- Evidencia: API GET /api/public/team retorna photo: "data:image/svg+xml;base64,PHN2Zy..." para los 6 miembros. Screenshot edge-case-nosotros-v2.png muestra los iconos genericos.

## Tests Generados
- e2e/tests/edge-case/REQ-072-carousel-mobile-swipe.spec.ts
- e2e/tests/edge-case/REQ-162-to-166-commercial-policies.spec.ts
- e2e/tests/edge-case/REQ-173a-team-photos.spec.ts
- e2e/tests/edge-case/REQ-175-no-centroamerica-distribuidores.spec.ts
- e2e/tests/edge-case/REQ-068-no-price-in-cards.spec.ts
- e2e/tests/edge-case/REQ-069-carousel-controls.spec.ts
- e2e/tests/edge-case/REQ-060-071-data-from-api.spec.ts
- e2e/tests/edge-case/REQ-158-171-nosotros-no-centroamerica.spec.ts
- e2e/tests/edge-case/REQ-168-informative-tone.spec.ts
- e2e/tests/edge-case/REQ-169-170-costa-rica-map.spec.ts
- e2e/tests/edge-case/REQ-173-team-empty-hidden.spec.ts
- e2e/tests/edge-case/REQ-195-no-google-maps-contact.spec.ts
- e2e/tests/edge-case/REQ-api-edge-cases.sh

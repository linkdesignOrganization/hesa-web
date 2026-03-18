# Plan de Distribucion -- QA Team

## Contexto de Testing
- Iteracion: 2 (Home Administrable + Contenido Estatico + Equipo)
- Ronda: 1
- URL del sitio desplegado: https://gray-field-02ba8410f.2.azurestaticapps.net
- URL del backend: https://hesa-api.azurewebsites.net
- Total criterios esta iteracion: 80 REQ + UX/DC asociados
- Criterios nuevos a testear manualmente: 57 (publicos) + 23 (admin, N/A por auth)
- Criterios a re-testear: 0 (Ronda 1)

## Nota sobre Auth Entra ID

Los criterios de admin panel (REQ-275 a REQ-288, REQ-318 a REQ-321e) requieren autenticacion Azure Entra ID que NO esta disponible para testing automatizado. Se clasifican como **N/A (requiere auth manual)** si el codigo existe y fue verificado por el plan-verifier en verification-5a.md.

Total criterios N/A (auth): 23
- REQ-275, REQ-276, REQ-277 (Hero management)
- REQ-278, REQ-279, REQ-280, REQ-281 (Featured products management)
- REQ-282, REQ-283 (Featured brands management)
- REQ-284, REQ-285, REQ-286, REQ-287, REQ-288 (Content editing)
- REQ-318, REQ-319, REQ-320, REQ-321, REQ-321a, REQ-321b, REQ-321c, REQ-321d, REQ-321e (Team management)

Estos 23 criterios fueron verificados como "Cubierto" en verification-5a.md (codigo existe, endpoints implementados). No requieren testing manual en esta ronda.

## Criterios Publicos a Testear (57 criterios)

### Feature: Home conectado a BD (REQ-042 a REQ-077) -- 36 criterios

**Hero (REQ-042 a REQ-050) -- 9 criterios:**
- REQ-042: Hero ocupa 100vh
- REQ-043: Tag superior configurable visible (ej: "DESDE 1989")
- REQ-044: Headline principal grande en ES/EN
- REQ-045: Subtitulo en ES/EN
- REQ-046: CTA primario "Explorar catalogo" navega a catalogo
- REQ-047: CTA secundario "Distribuya con nosotros" navega a distribuidores
- REQ-048: Imagen del hero es fotografica (de BD, no SVG placeholder)
- REQ-049: Mobile: hero se adapta con tipografia reducida
- REQ-050: Textos del hero en idioma seleccionado

**Bloques de Categorias (REQ-051 a REQ-056) -- 6 criterios:**
- REQ-051: 3 bloques (Farmacos, Alimentos, Equipos)
- REQ-052: Cada bloque: titulo, parrafo, 3 beneficios con iconos, imagen
- REQ-053: CTA navega a catalogo filtrado por categoria
- REQ-054: Bloques alternan posicion texto/imagen en desktop
- REQ-055: Mobile: bloques apilados verticalmente
- REQ-056: Textos en idioma seleccionado

**Marcas Destacadas (REQ-057 a REQ-061) -- 5 criterios:**
- REQ-057: Logos de marcas destacadas desde BD, max 6-8
- REQ-058: Cada logo enlaza a pagina de marca
- REQ-059: Titulo + link "Ver todas las marcas"
- REQ-060: Marcas son las seleccionadas desde panel (datos reales)
- REQ-061: Logos tamano consistente y alineados

**Propuesta de Valor (REQ-062 a REQ-065) -- 4 criterios:**
- REQ-062: 4 bloques de datos clave
- REQ-063: Cada bloque: numero grande, icono, texto
- REQ-064: Mobile: grid 2x2
- REQ-065: Textos en idioma seleccionado

**Productos Destacados (REQ-066 a REQ-073) -- 8 criterios:**
- REQ-066: Carrusel muestra cards de productos destacados desde BD
- REQ-067: Card: imagen, nombre, descripcion corta, boton "Ver producto"
- REQ-068: Cards NO muestran precio ni e-commerce
- REQ-069: Controles: flechas laterales e indicadores (dots)
- REQ-070: Clic en card navega a detalle del producto
- REQ-071: Productos son los seleccionados desde panel (datos reales)
- REQ-072: Mobile: swipe horizontal (**GAP reportado por verifier**)
- REQ-073: Si no hay destacados, seccion oculta

**CTA Fabricantes (REQ-074 a REQ-077) -- 4 criterios:**
- REQ-074: Banner con titulo orientado a fabricantes, NO Centroamerica
- REQ-075: Parrafo + CTA navega a Distribuidores
- REQ-076: Textos en idioma seleccionado
- REQ-077: Mobile: banner legible y CTA accesible

### Feature: Pagina Nosotros conectada a BD (REQ-155 a REQ-173c) -- 17 criterios

- REQ-155: Hero con titulo e imagen (50-60vh)
- REQ-156: Historia de HESA (familia, 37 anos, valores)
- REQ-157: Numeros clave (37+ anos, 50+ colaboradores, etc.)
- REQ-158: Cobertura y distribucion, NO Centroamerica
- REQ-159: Contenido editable desde panel (verificar que carga de API)
- REQ-160: URL semantica y meta tags propios
- REQ-161: Mobile: secciones en una columna
- REQ-162: Informacion sobre plazos de credito (**GAP reportado**)
- REQ-163: Tiempos de entrega por zona (**GAP reportado**)
- REQ-164: Cobertura de entrega detallada (**GAP reportado**)
- REQ-165: Frecuencia de visitas quincenal (**GAP parcial**)
- REQ-166: CTA para solicitar condiciones comerciales (**GAP reportado**)
- REQ-167: Contenido de politicas editable (verificar datos cargados de API)
- REQ-168: Tono informativo y accesible
- REQ-169: Mapa estilizado de Costa Rica
- REQ-170: Mapa es visual/grafico, no interactivo
- REQ-171: Mapa con texto sobre agentes y flotilla, NO Centroamerica

**Equipo de liderazgo en sitio publico (REQ-172 a REQ-173c) -- 5 criterios:**
- REQ-172: Grid con foto, nombre, cargo. 6 personas ficticias
- REQ-173: Si no hay miembros, seccion no se muestra
- REQ-173a: Fotos placeholder profesionales (**GAP menor reportado**)
- REQ-173b: Cada miembro: foto, nombre, cargo en ES/EN
- REQ-173c: Grid 3 cols desktop, 2 tablet, 1 mobile

### Feature: Pagina Distribuidores conectada a BD (REQ-174 a REQ-181) -- 8 criterios

- REQ-174: Hero impactante con titulo B2B, subtitulo, CTA
- REQ-175: Seccion beneficios, NO Centroamerica (**GAP reportado: menciona Centroamerica**)
- REQ-176: Logo wall de marcas
- REQ-177: Timeline 4 pasos del partnership
- REQ-178: Timeline horizontal desktop, vertical mobile
- REQ-179: Contenido editable desde panel (verificar carga de API)
- REQ-180: Version inglesa optimizada para fabricantes de Asia
- REQ-181: Meta tags SEO optimizados para ingles

### Feature: Pagina Contacto conectada a BD (REQ-193 a REQ-196) -- 4 criterios

- REQ-193: Telefono, correo, direccion, horario, redes. NO mapa
- REQ-194: Datos editables (verificar que carga de API)
- REQ-195: NO mapa de Google
- REQ-196: Layout 2 columnas desktop, 1 mobile

---

## Gaps Conocidos (del plan-verifier verification-5a.md)

Los sub-testers DEBEN verificar estos gaps y confirmar PASA o FALLA:
1. **REQ-072**: Carrusel sin swipe en mobile (grid vertical en lugar de swipe)
2. **REQ-162 a REQ-166**: Politicas comerciales no renderizadas publicamente (contenido existe en BD pero sin render)
3. **REQ-173a**: Fotos del equipo son iconos SVG genericos (no fotos de banco profesional)
4. **REQ-175**: Mencion de "Centroamerica" en pagina distribuidores (viola restriccion explicita)

---

## Asignacion: Flow Tester -> e2e/tests/flow/

### Criterios asignados (22 criterios)

**Home Hero + CTAs:**
- REQ-042: Hero ocupa 100vh
- REQ-043: Tag superior visible ("DESDE 1989" o similar)
- REQ-044: Headline principal en ES/EN
- REQ-045: Subtitulo en ES/EN
- REQ-046: CTA "Explorar catalogo" navega a /es/catalogo
- REQ-047: CTA "Distribuya con nosotros" navega a /es/distribuidores
- REQ-048: Imagen del hero es fotografica (cargada de BD)
- REQ-050: Textos cambian al cambiar idioma ES/EN

**Home Bloques de Categorias:**
- REQ-051: 3 bloques de categorias visibles
- REQ-053: CTAs navegan al catalogo filtrado por categoria

**Home Marcas Destacadas:**
- REQ-057: Logos de marcas desde BD (6-8)
- REQ-058: Logos son enlaces a pagina individual de marca
- REQ-059: Link "Ver todas las marcas" navega a /es/marcas

**Home Productos Destacados:**
- REQ-066: Carrusel muestra cards desde BD
- REQ-067: Cards con imagen, nombre, descripcion, boton "Ver producto"
- REQ-070: Clic en card navega a detalle de producto
- REQ-073: Si no hay destacados, seccion oculta (verificar logica)

**Home CTA Fabricantes:**
- REQ-074: Banner visible con titulo, NO menciona Centroamerica
- REQ-075: CTA navega a /es/distribuidores

**Paginas Conectadas a BD:**
- REQ-155: Nosotros hero visible con imagen (50-60vh)
- REQ-174: Distribuidores hero con titulo B2B, CTA
- REQ-193: Contacto muestra telefono, correo, direccion, NO mapa

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- **Pre-flight check**: Antes de cualquier test, verificar que `/es/` carga correctamente y que la API responde (`/api/public/home` retorna datos). Si falla, reportar BLOQUEADO inmediatamente
- Verificar que el HOME carga datos REALES de la API (no mock data hardcodeada). Evidencia: los datos del hero deben coincidir con lo que devuelve `GET /api/public/home`
- Para REQ-050, navegar a `/en/` y verificar que los textos del hero cambian a ingles
- Para REQ-058, verificar que al hacer clic en un logo de marca se navega a `/es/marcas/[slug]`
- Para REQ-070, verificar que al hacer clic en una card del carrusel se navega a `/es/catalogo/[categoria]/[slug]`
- Para REQ-073, NO es posible testear sin admin -- solo verificar que la seccion SE MUESTRA cuando hay productos destacados
- Para REQ-074, verificar que NO aparece la palabra "Centroamerica" en el banner
- Generar GIFs de: (1) flujo completo Home ES, (2) cambio de idioma ES->EN en Home, (3) navegacion desde Home a paginas internas
- **Generar archivos .spec.ts** para cada criterio asignado en `e2e/tests/flow/`

---

## Asignacion: Edge Case Tester -> e2e/tests/edge-case/

### Criterios asignados (19 criterios)

**Gaps Criticos a Verificar:**
- REQ-072: Carrusel mobile -- verificar si hay swipe horizontal o es grid vertical
- REQ-162: Politicas comerciales -- plazos de credito renderizados publicamente?
- REQ-163: Tiempos de entrega por zona renderizados publicamente?
- REQ-164: Cobertura de entrega detallada renderizada?
- REQ-165: Frecuencia de visitas quincenal mencionada?
- REQ-166: CTA para solicitar condiciones comerciales existe?
- REQ-173a: Fotos del equipo son profesionales o iconos genericos?
- REQ-175: Pagina distribuidores menciona "Centroamerica"? (debe ser FALLA si lo menciona)

**Home Edge Cases:**
- REQ-068: Cards del carrusel NO muestran precio ni datos e-commerce
- REQ-069: Carrusel tiene flechas laterales y dots indicadores
- REQ-060: Marcas son las seleccionadas desde panel (datos de BD)
- REQ-071: Productos son los seleccionados desde panel (datos de BD)

**Nosotros Edge Cases:**
- REQ-158: Seccion cobertura NO menciona Centroamerica
- REQ-168: Tono informativo y accesible (no legal)
- REQ-169: Mapa estilizado de Costa Rica presente
- REQ-170: Mapa NO es Google Maps interactivo
- REQ-171: Mapa con texto sobre agentes, NO Centroamerica
- REQ-173: Si team esta vacio, seccion no se muestra (verificar @if en codigo)

**Contacto Edge Case:**
- REQ-195: NO mapa de Google embebido en contacto

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- **Edge cases de datos reales**: Los datos ahora vienen de la API real. Verificar que `GET https://hesa-api.azurewebsites.net/api/public/home` devuelve datos y que el frontend los consume correctamente
- **Restriccion "NO Centroamerica"**: Es una regla de negocio estricta que aparece en REQ-074, REQ-158, REQ-171, REQ-175. Buscar la palabra "Centroamerica" (o "Central America" en EN) en TODAS las paginas: Home, Nosotros, Distribuidores. Cualquier mencion es FALLA
- Para REQ-072, testear en viewport 375px: verificar si el carrusel permite swipe horizontal o si se convierte en stack vertical
- Para REQ-162 a REQ-166, navegar a `/es/nosotros` y buscar una seccion de politicas comerciales. Verificar tambien si existe una ruta separada como `/es/politicas`
- Para REQ-173a, navegar a `/es/nosotros`, verificar si los 6 miembros del equipo tienen fotos reales o solo iconos SVG genericos
- Para REQ-173, verificar que el codigo tiene condicion `@if (team().length > 0)` -- si la seccion aparece con miembros, PASA
- **XSS/Inyeccion**: Verificar que los datos cargados de la API no permiten XSS (ej: si un admin inyecta script en el titulo del hero, el frontend sanitiza)
- **Generar archivos .spec.ts** para cada criterio asignado en `e2e/tests/edge-case/`

---

## Asignacion: Visual Checker -> e2e/tests/visual/

### Criterios asignados (16 criterios)

**Home Visual:**
- REQ-049: Mobile hero adapta tipografia (headline 32px mobile vs 56px desktop)
- REQ-052: Bloques categoria: titulo + parrafo + 3 beneficios con iconos + imagen
- REQ-054: Bloques alternan texto/imagen (izq-der, der-izq)
- REQ-055: Mobile: bloques apilados verticalmente
- REQ-056: Textos de bloques en ES/EN
- REQ-061: Logos de marcas tamano consistente y alineados al centro
- REQ-062: 4 bloques propuesta de valor con datos clave
- REQ-063: Numero grande + icono + texto descriptivo
- REQ-064: Mobile: grid 2x2
- REQ-065: Textos en ES/EN
- REQ-076: CTA fabricantes en ES/EN
- REQ-077: Mobile: banner legible, CTA accesible

**Nosotros Visual:**
- REQ-156: Historia de HESA (empresa familiar, 37 anos)
- REQ-157: Numeros clave (37+, 50+, cobertura)
- REQ-161: Mobile: secciones en una columna

**Distribuidores Visual:**
- REQ-176: Logo wall de marcas
- REQ-177: Timeline 4 pasos
- REQ-178: Timeline horizontal desktop, vertical mobile
- REQ-180: Version inglesa B2B profesional

**Contacto Visual:**
- REQ-196: Layout 2 columnas desktop, 1 mobile

**Equipo Visual:**
- REQ-172: Grid con foto, nombre, cargo. 6 personas ficticias
- REQ-173b: Cada miembro: foto, nombre, cargo en ES/EN
- REQ-173c: Grid 3 cols desktop, 2 tablet, 1 mobile

**SEO/Meta:**
- REQ-160: Nosotros URL semantica + meta tags
- REQ-181: Distribuidores meta tags SEO en ingles

**Editable desde API (verificar datos de BD):**
- REQ-159: Contenido Nosotros carga de API
- REQ-167: Contenido politicas editable (verificar campo editable)
- REQ-179: Contenido Distribuidores carga de API
- REQ-194: Datos Contacto cargan de API

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- Breakpoints: mobile 375px, tablet 768px, desktop 1280px, desktop-lg 1440px
- **PRIORIDAD #1**: Verificar que el Home carga datos REALES de la API y no mock data. Usar `browser_evaluate` para verificar llamadas a API
- **Responsive checks obligatorios**: Hero (REQ-049), bloques categoria (REQ-055), propuesta valor (REQ-064), banner fabricantes (REQ-077), nosotros (REQ-161), equipo (REQ-173c), distribuidores timeline (REQ-178), contacto (REQ-196)
- **i18n checks**: Navegar a `/en/` y verificar que todos los textos cambian a ingles (REQ-050, REQ-056, REQ-065, REQ-076, REQ-180)
- Para REQ-160, verificar que `/es/nosotros` tiene `<title>` y `<meta name="description">` unicos
- Para REQ-181, navegar a `/en/distributors` y verificar meta tags con keywords "distributor Costa Rica", "veterinary distributor"
- Para REQ-159/167/179/194, verificar via `browser_evaluate` que los datos cargados vienen de `apiUrl` y no estan hardcodeados
- **Design tokens**: Verificar que los componentes de Home (hero, category blocks, value stats, carousel, CTA banner) usan los tokens correctos de design-criteria.md
- **Generar archivos .spec.ts** para cada criterio asignado en `e2e/tests/visual/`

### DC-xxx relevantes a verificar (del design-criteria.md -- ya cubiertos por visual-build, solo regression)
- DC-030: Hero layout (ya tiene test automatizado)
- DC-031: Bloques categorias (ya tiene test)
- DC-032: Marcas destacadas (ya tiene test)
- DC-033: Propuesta de valor (ya tiene test)
- DC-034: Productos destacados carrusel (ya tiene test)
- DC-035: CTA fabricantes (ya tiene test)
- DC-041: Nosotros layout (ya tiene test)
- DC-042: Distribuidores layout (ya tiene test)
- DC-043: Contacto layout (ya tiene test)
- DC-065: Team Member Card (ya tiene test)
- DC-066: Timeline (ya tiene test)

Estos DC-xxx fueron testeados en visual-build y tienen tests automatizados. La regresion automatizada los cubre. Solo re-verificar manualmente si la regresion automatizada fallo para alguno.

---

## Regresion Automatizada (de regression-results.md)

- Resultado de `npx playwright test e2e/tests/`: 405 passed, 318 failed, 15 skipped (738 total)
- **NOTA**: Los 318 tests fallidos son mayoritariamente tests de admin panel que fallan por requerir autenticacion (timeout esperando elementos detras de auth gate). Esto es consistente con el patron observado en Iteracion 1
- Tests de sitio publico que PASAN cubren criterios de visual-build e Iteracion 1 -- NO se re-asignan a sub-testers

### Tests de Iteracion 2 que PASARON en regresion (no re-asignar):
- UX-068 parcial (hero mock content -- algunos tests pasan, algunos fallan por datos reales vs mock)
- UX-073 (contact page has phone, email, address) -- PASA
- UX-037 (contact form has all required fields) -- PASA
- UX-112 (equipo liderazgo gestion) -- PASA parcial (solo el test de carga basica)

### Tests de Iteracion 2 que FALLARON en regresion:
- UX-068 (hero mock content -- datos ahora reales, tests comparaban mock data)
- UX-069 (value proposition stats)
- UX-071 (about page sections)
- UX-072 (distributors page sections)
- Muchos tests de admin panel (timeout por auth)

---

## Criterios Pendientes de Testing Manual

- Total criterios que requieren sub-testers esta ronda: 57
- Criterios FALLARON en ronda anterior: 0 (Ronda 1)
- Criterios DESBLOQUEADOS: 0 (Ronda 1)
- Criterios N/A (auth admin): 23
- Criterios nuevos sin test automatizado: 57

### Distribucion por sub-tester:

| Sub-tester | Criterios asignados | Tipo |
|---|---|---|
| Flow Tester | 22 | Navegacion, CTAs, flujos E2E, datos de BD |
| Edge Case Tester | 19 | Gaps reportados, restricciones negocio, edge cases |
| Visual Checker | 30 | Responsive, i18n, layout, design compliance, SEO/meta |

**Total cubierto**: 57 publicos + 23 N/A (auth) = 80 criterios

### Resumen de severidad de gaps anticipados:
1. **CRITICO**: REQ-162 a REQ-166 (5 criterios) -- politicas comerciales sin render publico
2. **MEDIO**: REQ-072 (swipe mobile), REQ-175 (menciona Centroamerica)
3. **MENOR**: REQ-173a (fotos genericas del equipo)

Nota: Hay superposicion intencionada entre sub-testers para criterios i18n (REQ-050, REQ-056, REQ-065, REQ-076). El Flow Tester verifica que el cambio de idioma funciona; el Visual Checker verifica que los textos se muestran correctamente en el idioma.

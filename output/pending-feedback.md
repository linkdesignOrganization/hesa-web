# Pending Feedback
> Los agentes appendan su feedback aqui. El Feedback Curator lo procesa en paso 4j/5i/R5.

### Feedback de: feedback-curator
- El developer acumula la mayor cantidad de feedback (13 entradas nuevas) — refleja su rol central pero tambien indica que otros agentes (BA, architect) deberian definir mejor los criterios upstream para reducir descubrimientos en implementacion
- El architect no genera feedback sobre su propio trabajo — todo el feedback del architect es sobre gaps en requirements o documentacion de otros. Posible gap en auto-reflexion
- La regresion automatizada nunca se ejecuto en 4 rondas de QA a pesar de ser gate obligatorio — el PM y QA necesitan enforcement mas estricto
- El 60%+ del feedback de site-capturers, visual-system-designer, ux-flow-designer y component-designer es especifico del proyecto HESA y no genera principios generales reutilizables — esto es esperado para agentes stateless pero vale monitorear que no se acumule feedback sin procesar
- El feedback del cliente (3 entradas) fue de alto impacto: cambio la clasificacion de resultados del QA (elimino PASA parcial), refuerzo la regresion automatizada, y definio expectativas de demo. El feedback del cliente debe procesarse siempre con prioridad maxima (weight 10)
- La design-researcher no recibe feedback de aprendizaje de ningun agente — su output fue alabado como excelente pero no hay principios nuevos que agregar. Monitorear en futuros proyectos si esto cambia

### Feedback de: devops
- Los environment files del proyecto (environment.ts, environment.prod.ts) solo tenian `production: boolean` sin ningun endpoint, clientId, ni configuracion cloud. Para proyectos con backend + auth, estos archivos deben poblarse con la configuracion correcta desde FASE 3.5-INFRA para que el developer pueda empezar Iteracion 1 sin bloqueos
- No existia archivo `.env` ni `.env.example` en el repositorio. El developer necesita un .env.example commiteado como referencia para saber que variables de entorno configurar, y el .env real (gitignored) con las credenciales para desarrollo local
- La arquitectura define Azure CDN sobre Blob Storage pero para el volumen esperado (<1000 productos, audiencia CR + evaluadores internacionales), el endpoint directo de Blob Storage es suficiente para empezar. CDN se agrega cuando se tenga custom domain o se identifique un problema de latencia real
- Cosmos DB Serverless es la eleccion correcta para este volumen — evita el costo de RU provisionadas y escala automaticamente. El developer debe tener en cuenta que Serverless tiene cold-start (~1s primera conexion despues de inactividad)
- Azure Communication Services queda provisionado con dominio integrado (*.communication.azure.com). Para produccion real, el cliente deberia verificar un dominio propio para mejor deliverability de emails

### Feedback de: developer
- La arquitectura define dos aplicaciones Angular separadas (public + admin) pero el proyecto existente de la fase visual fue implementado como una sola app Angular con ambos modulos (public y admin) coexistiendo en src/app/. La transicion a dos apps separadas deberia haberse hecho antes de Iteracion 1 o la arquitectura deberia reflejar el estado real del proyecto
- Mongoose 8 con TypeScript strict tiene multiples incompatibilidades de tipos con .lean() que requieren casts as unknown as T en todos los service methods. El architect deberia documentar este patrón o especificar Mongoose 7 que tiene mejor compatibilidad de tipos
- La arquitectura especifica @ngx-translate para i18n estatico pero el proyecto actual usa un I18nService custom con signals. Se mantuvo el patron existente del proyecto por consistencia con la fase visual. El architect deberia alinear la especificacion con lo implementado
- Los mock-data services de la fase visual permanecen en el codigo porque las paginas Home, About, Distributors, Contact aun dependen de ellos (son scope de Iteraciones 2 y 3). Se deben remover progresivamente conforme se conecten a la API
- SSR con @angular/ssr es parte del plan de Iteracion 1 pero requiere reestructurar el build system de Angular para SSR rendering. Esto deberia ser un item separado con su propia estimacion dado su complejidad
- El .env file contiene secrets reales (connection strings, access keys). El devops deberia verificar que .gitignore incluye .env para que nunca se commitee a git

### Feedback de: plan-verifier
- El formulario de crear/editar marca (brand-form.component.ts) es un shell estatico HTML sin ReactiveFormsModule, sin FormGroup, sin logica de guardado, sin conexion al API. Mientras que el formulario de productos fue implementado completo con validacion y API, el de marcas fue dejado como placeholder visual. El developer debe tratar ambos CRUD con el mismo nivel de completitud
- Los dropzones de upload de imagenes y PDF en el product form son visuales sin input[type=file] funcional ni event bindings al API. Las funciones de upload existen en api.service.ts pero no estan conectadas desde el template. El developer dejo la UI visual pero no la funcionalidad de upload
- El admin product detail (product-detail.component.ts del admin) usa MockDataService en vez de ApiService para obtener el producto. Es remanente de la fase visual que no fue migrado a datos reales
- Los campos especificos por categoria en el product form (composicion, indicaciones, ingredientes, nutricional, especificaciones, garantia) estan definidos en el FormGroup del TS pero NO renderizados en el HTML template bajo los tabs bilingues. Solo se renderiza el campo de descripcion general
- El template de detalle de producto publico solo renderiza campos de farmacos (composicion, registro sanitario, indicaciones) pero NO renderiza campos de alimentos (ingredientes, info nutricional) ni equipos (especificaciones, usos recomendados, garantia) a pesar de que el modelo los soporta
- Toda la feature de SEO (meta tags dinamicos, sitemap XML, schema markup JSON-LD, hreflang) esta sin implementar. Son 11 criterios. El developer y el architect deberian coordinar si SSR es prerequisito para esta funcionalidad o si puede implementarse sin SSR
- La busqueda global solo busca por nombre de producto/marca, no por especie de destino ni familia farmaceutica como pide REQ-035. Agregar estos campos al $or del search filter
- Al eliminar un valor de filtro en categorias (REQ-273), no se verifica si esta en uso por productos. Esto puede causar que productos queden con valores de filtro huerfanos
- La advertencia de productos asociados al eliminar marca se muestra DESPUES de eliminar, no ANTES como pide REQ-267. Deberia ser una confirmacion preventiva

### Feedback de: developer
- El plan-verifier identifico 45 gaps que se corrigieron en una sola sesion. El principal patron es que la fase visual genero shells HTML sin funcionalidad real, y la Iteracion 1 no completo la conexion de esos shells al API. Recomendacion: durante la implementacion de cada CRUD, verificar que TODOS los sub-componentes del form (upload, preview, delete) esten conectados al API, no solo el submit principal
- El SEO (meta tags, hreflang, JSON-LD, sitemap) fue omitido completamente en Iteracion 1 a pesar de estar en scope. Esto sugiere que el architecture.md deberia tener un checklist de features transversales (SEO, i18n, accesibilidad) que deben verificarse en cada iteracion, no solo como features independientes
- El product form tenia campos de FormGroup en TypeScript que no estaban renderizados en HTML. Esto es un patron de error comun: agregar campos al modelo pero olvidar el template. Una verificacion de "cada FormControl tiene un input en el HTML" seria util como quality gate
- La normalizacion de acentos en busqueda (REQ-041) requiere un approach con regex de caracteres alternativos en MongoDB ya que Cosmos DB no soporta collation con locale-based accent insensitivity. Se implemento con un mapa de acentos que genera regex alternativas. Para proyectos futuros sobre Cosmos DB, documentar esta limitacion en la arquitectura
- El SeoService usa DOCUMENT injection para manipular head tags (hreflang links, JSON-LD scripts). Esto funciona tanto en SSR como en browser pero requiere cleanup en ngOnDestroy. Sin SSR, los meta tags no estaran en el HTML inicial que reciben los crawlers. SSR es prerequisito para SEO completo

### Feedback de: plan-verifier
- Los 45 gaps de Iteracion 1 fueron corregidos exitosamente en una sola ronda de fixes. El patron principal era: la fase visual genero shells HTML sin funcionalidad real, y el developer de Iteracion 1 no los conecto al API. La ronda de correccion demostro que el developer puede resolver todos los gaps cuando se le proporciona una lista explicita y exhaustiva. Recomendacion: el developer deberia ejecutar una auto-verificacion antes de entregar, comparando cada REQ-xxx del scope contra el codigo implementado
- La feature SEO entera (11 criterios) fue omitida en la entrega inicial pero fue la mas limpia de corregir: un solo SeoService inyectable resolvio meta tags, hreflang y JSON-LD para todas las paginas. Esto sugiere que features transversales (SEO, i18n, accesibilidad) deberian implementarse como servicios centralizados al inicio de la iteracion, no como ultimo paso
- La Home page sigue usando MockDataService para productos destacados y marcas destacadas. Aunque Home es scope de Iteraciones 2-3, el ApiService ya tiene `getFeaturedProducts()` y `getFeaturedBrands()` funcionales. La migracion deberia ser trivial cuando llegue el momento
- La normalizacion de acentos en busqueda fue resuelta con un regex map de caracteres alternativos (a -> [aaai]) que es compatible con Cosmos DB. Este patron deberia documentarse como solucion estandar para busquedas accent-insensitive en proyectos sobre Cosmos DB / MongoDB sin collation

### Feedback de: developer
- (Simplify) getBrandsWithProductCount y getCategoriesWithCounts usaban N+1 queries (un countDocuments por cada brand/category). Se reemplazo por aggregation pipeline que resuelve todos los counts en una sola query. Este patron de N+1 debe evitarse en cualquier service que combine listado + conteo
- (Simplify) La funcion processImage (multi-size) en image-processor.ts estaba definida pero nunca era importada por ningun modulo. Solo processImageSingle se usaba. Codigo muerto debe detectarse en la auto-verificacion
- (Simplify) product-form.component.ts tenia logica duplicada entre onImagesSelected/uploadImagesDirectly y onPdfSelected/uploadPdfDirectly. El patron correcto es un unico metodo privado (uploadImages, uploadPdf) invocado tanto desde el input change como desde el drop handler
- (Simplify) La funcion onSubmit del product-form era de 65 lineas con data building inline. Se extrajo buildProductData() y addCategorySpecificFields() para mantener onSubmit enfocado en el flujo de guardado
- (Simplify) El sitemap route handler era un bloque monolitico de 55 lineas. Se extrajo a funciones (getProductUrls, getBrandUrls, buildSitemapXml) y se paralelizaron las queries con Promise.all
- (Security) El search service construia regex directamente del input del usuario sin truncar longitud. Un input extremadamente largo podria causar ReDoS. Se agrego truncamiento a 100 chars y se extrajo la funcion buildAccentTolerantRegex como unico punto de construccion de regex
- (Security) El validate.middleware.ts solo stripeaba tags HTML pero no bloqueaba keys con $ (operadores MongoDB). Se agrego filtrado de keys que empiezan con $ para prevenir inyeccion NoSQL via body ({$gt: "", $ne: null})
- (Security) Las rutas publicas no validaban/limitaban los query params de paginacion (page, limit). Un atacante podia pedir limit=999999. Se agrego clamp a max 100 y min 1 en todas las rutas publicas y admin
- (Security) El upload middleware solo verificaba mimetype (que es client-provided) pero no la extension del archivo. Se agrego validacion de extension para prevenir ataques de doble extension (malware.exe.jpg)
- (Security) La CSP de staticwebapp.config.json tenia connect-src: 'self' que bloquearia las llamadas al API backend y blob storage en produccion. Se amplio para incluir el API host y blob storage
- (Security) El endpoint de busqueda no tenia rate limiting, permitiendo abuse por fuerza bruta. Se agrego rate limit de 30 req/min/IP
- (Security) La validacion de parametro lang en rutas publicas solo hacia cast as 'es' | 'en' sin verificar. Un valor inesperado se pasaba directo. Se cambio a whitelist explicita (=== 'en' ? 'en' : 'es')
- (Security) npm audit en api/ mostro 0 vulnerabilidades - las dependencias estan limpias

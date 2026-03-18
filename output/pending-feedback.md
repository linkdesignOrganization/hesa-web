# Pending Feedback
> Los agentes appendan su feedback aqui. El Feedback Curator lo procesa en paso 4j/5i/R5.

### Feedback de: feedback-curator
- El pre-QA gate (curl al API + verificacion de environment) fue el feedback mas repetido de la Iteracion 1 — aparecio en feedback de qa-orchestrator (x5), flow-tester (x2), edge-case-tester (x1), visual-checker (x1), devops (x1). Weight resultante: 35. Esto indica que 2 rondas enteras de QA se desperdiciaron por falta de este gate, y TODOS los agentes lo detectaron independientemente
- El developer recibio la mayor carga de feedback nuevamente (30+ entradas nuevas clasificadas). Nuevas categorias creadas: Manejo de Errores, Seguridad Backend, Patrones de Startup Backend, Angular Avanzado, SEO, Performance Backend. Su MEMORY.md paso de 83 a 115 lineas — aun bajo el target pero creciendo rapido
- El architect recibio feedback significativo por primera vez: auth testing mechanism (weight 35), cross-cutting features checklist, SSR viability assessment, seed data specification. Esto confirma que el architect necesita mas auto-reflexion sobre gaps en sus especificaciones
- 60%+ del feedback de esta ronda fue sobre problemas de infraestructura/deployment (CI/CD, environment files, DB indexes, API sin deploy) no sobre calidad de codigo. Esto sugiere que el proceso de setup de infra (FASE 3.5-INFRA) necesita un checklist de verificacion mas exhaustivo
- Los agentes stateless (plan-verifier, edge-case-tester, flow-tester, visual-checker) generaron feedback de alta calidad que se redistribuyo efectivamente al developer (auto-verificacion, error states, destructive actions) y al architect (auth bypass, seed data, SSR). El modelo de agentes stateless con feedback redirigido funciona correctamente
- La design-researcher, design-orchestrator, ui-developer y business-analyst no recibieron feedback nuevo en esta iteracion — su trabajo fue de Fase 3-4 (visual) y no hubo cambios en esas areas durante Iteracion 1

### Feedback de: developer
- La architecture.md no incluye definiciones detalladas de los endpoints API (paths, metodos, payloads) para home-config, page-content y team. Solo lista los modulos y sus responsabilidades genericas. Tuve que inferir la estructura de endpoints basandome en los patrones existentes de productos/marcas. Seria util que el architect documente al menos los paths y metodos HTTP de cada endpoint nuevo
- Los requirements no especifican si los textos de la seccion "Propuesta de Valor" (stats: 37+ anos, 100% cobertura, etc.) deben ser editables desde el panel o son fijos. Los implemente como hardcoded en el componente, consistente con la Iteracion 1
- La architecture define TeamMember con nombre bilingue (ES/EN) pero el mock-data.service original solo tenia nombre simple (string). Esto creo inconsistencia entre la interfaz mock y la API real. Los datos seed del equipo ahora usan nombre bilingue como requiere la arquitectura
- El REQ-288 dice que las imagenes de paginas estaticas son editables con drag-and-drop. Implemente upload de imagen pero sin drag-and-drop ya que es un solo campo de imagen (hero image), no una galeria multiple donde el drag-drop tendria sentido
- La publicacion de contenido de content routes y team routes en la misma ruta base (/api/public/content) es problematica — tuve que separarlos en /api/public/content/:pageKey y /api/public/team como rutas independientes para evitar conflictos de Express routing

### Feedback de: plan-verifier
- Las politicas comerciales (REQ-162 a REQ-168) tienen contenido en la BD y editor en el admin panel, pero NO tienen render en ninguna pagina publica. El architecture.md asigna estos criterios a iteration 2, pero el developer solo creo la infraestructura de datos sin el componente publico. Necesita definirse donde se muestran: como seccion dentro de About, como pagina independiente, o como sub-seccion de otra pagina
- El developer incluye una mencion de "Centroamerica" en los beneficios de la pagina de distribuidores (REQ-175) que viola restricciones explicitas repetidas en multiples requirements. Esto sugiere que el developer no reviso las restricciones de negocio de los REQs individuales
- El seed de team members no incluye fotos placeholder, solo nombres y cargos ficticios. REQ-173a exige "imagenes de banco de fotos profesionales" como placeholders iniciales. Sin fotos, los miembros se muestran con un icono SVG generico que no cumple la intencion del requisito
- El carrusel de productos en mobile se implementa como grid vertical (productos apilados) en lugar de carrusel horizontal con swipe (REQ-072). Este patron es inconsistente con la experiencia esperada en mobile donde un carrusel deberia permitir navegacion horizontal
- La creacion de un nuevo miembro del equipo no permite subir foto en el mismo flujo -- hay que crear primero y luego editar para agregar foto. El upload esta condicionado a `@if (editingMember())` lo que excluye el flujo de creacion

### Feedback de: developer
- Los REQ-162 a REQ-166 (politicas comerciales) estaban implementados en backend (seed data + editor admin) pero sin ningun render publico. El architecture.md no especificaba donde debian renderizarse las politicas: como seccion en la pagina About, como pagina independiente, o como sub-seccion. Tuve que tomar la decision de agregarlas como seccion en la pagina Nosotros por ser el contexto mas natural
- El plan-verifier detecto la mencion de "Centroamerica" que el propio developer incluyo. Esto refuerza la necesidad de un checklist de restricciones de negocio que se revise ANTES de implementar textos y contenido de marketing
- Los placeholder photos de equipo como SVG inline (data URIs) son una solucion pragmatica pero no la solucion definitiva. Cuando el cliente suba fotos reales, estos placeholders se reemplazan. Si la BD ya tiene miembros seedeados sin foto, los existentes NO se actualizan automaticamente — solo los nuevos seeds tendran las fotos placeholder
- El carrusel mobile requirio CSS scroll-snap en lugar de un grid vertical. El patron correcto para carruseles mobile es SIEMPRE overflow-x con scroll-snap, no grids de una columna

### Feedback de: developer
- SIMPLIFY: La configuracion de multer (file filter + storage + limits) estaba duplicada literalmente en 5 archivos de admin routes (products, brands, home, content, team). Creamos `admin-upload.middleware.ts` como punto unico. Esto reduce 80+ lineas de codigo duplicado
- SIMPLIFY: El `bilingualField` de Mongoose ({es: String, en: String}) estaba definido identicamente en 5 modelos. Extraido a `shared-schema.ts` como importacion compartida
- SIMPLIFY: `updateHero` en home.service.ts tenia 20 lineas de if/if repetitivos para 5 campos bilingues. Refactorizado con un loop sobre las keys bilingues, reduciendo a 8 lineas
- SECURITY: Los admin routes de content (`GET /:pageKey`, `PUT /:pageKey`, `POST /:pageKey/image`) no validaban que el pageKey fuera uno de los valores permitidos. Se agrego whitelist validation identica a la ruta publica
- SECURITY: Las rutas `PUT /featured-products` y `PUT /featured-brands` aceptaban arrays de IDs sin validar que cada ID fuera un ObjectId valido. Se agrego validacion con `mongoose.isValidObjectId()`
- SECURITY: La ruta de reorder de team aceptaba orderedIds sin validar formato. Ahora se valida que cada elemento sea un ObjectId valido
- SECURITY: El sanitizador XSS ahora tambien bloquea `data:text/html`, `vbscript:` y null bytes (`\x00`), ademas de los patrones previos
- SECURITY: Las rutas admin de brands y products ahora validan el formato ObjectId del parametro `:id` antes de hacer la query a MongoDB
- SECURITY: npm audit reporta 0 vulnerabilidades en el API
- Las rutas publicas de brands (`/:slug/products`) usaban `.substring()` inline en vez de la funcion `safeQueryString`. Ahora usan la funcion consistente con el resto de rutas publicas

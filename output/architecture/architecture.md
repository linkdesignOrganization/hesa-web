# Arquitectura — HESA (Herrera y Elizondo S.A.) Sitio Web y Panel de Administracion

**Generado por**: Architect
**Fecha**: 2026-03-17
**Version**: 1.0

---

## Vision General

La arquitectura de HESA se divide en dos aplicaciones Angular dentro de un mismo repositorio: un sitio publico bilingue (ES/EN) con Server-Side Rendering para SEO, y un panel de administracion protegido por Azure Entra ID. Ambas aplicaciones comparten un backend Node.js/Express desplegado en Azure App Service que expone una API RESTful contra Azure Cosmos DB (API for MongoDB). Los archivos estaticos (imagenes de productos, logos de marcas, fichas tecnicas PDF) se almacenan en Azure Blob Storage con CDN para servir assets optimizados.

El sitio publico es mobile-first, orientado a dos audiencias: clientes locales (veterinarias, pet shops, groomers) que consultan el catalogo por especie/marca/familia, y fabricantes internacionales (Asia) que evaluan a HESA como distribuidor. El panel de administracion es desktop-first con soporte responsive, usa autenticacion delegada 100% a Azure Entra ID (un solo nivel admin), y permite gestionar productos, marcas, categorias, contenido estatico, mensajes y configuracion del sitio.

La separacion en dos aplicaciones Angular independientes (no lazy-loaded modules de una sola app) permite: (1) que el sitio publico use SSR sin cargar codigo del panel, (2) que el panel no sea indexable y tenga su propio bundle optimizado, (3) deploys independientes si fuera necesario. El backend es una API unica que sirve ambas aplicaciones, con middleware de autenticacion solo en los endpoints del panel.

### Stack Tecnologico
- **Frontend**: Angular 19+ (standalone components, signals, SSR via @angular/ssr)
- **CSS**: Bootstrap 5 + CSS custom properties (design tokens)
- **Backend/API**: Node.js 20 LTS + Express.js
- **Base de datos**: Azure Cosmos DB (API for MongoDB) con Mongoose ODM
- **Storage**: Azure Blob Storage (imagenes, PDFs) con Azure CDN
- **Estado**: Signals de Angular para estado local, servicios singleton para estado compartido entre componentes
- **i18n**: @ngx-translate/core para contenido estatico, campos bilingues en BD para contenido dinamico
- **Auth**: MSAL Angular (@azure/msal-angular) para Azure Entra ID
- **Email**: Azure Communication Services (Email) para notificaciones de formularios
- **Deploy frontend publico**: Azure Static Web Apps (con SSR via API backend)
- **Deploy frontend panel**: Azure Static Web Apps (SPA pura, sin SSR)
- **Deploy backend**: Azure App Service (Node.js 20 LTS)

---

## Estructura de Modulos

```
hesa-web/
├── apps/
│   ├── public/                        # Sitio publico (SSR)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── core/              # Servicios singleton, interceptors, guards
│   │   │   │   │   ├── services/
│   │   │   │   │   │   ├── seo.service.ts
│   │   │   │   │   │   ├── i18n.service.ts
│   │   │   │   │   │   ├── crm-tracking.service.ts
│   │   │   │   │   │   └── api.service.ts
│   │   │   │   │   ├── interceptors/
│   │   │   │   │   │   ├── language.interceptor.ts
│   │   │   │   │   │   └── error.interceptor.ts
│   │   │   │   │   └── guards/
│   │   │   │   │       └── language.guard.ts
│   │   │   │   ├── shared/            # Componentes reutilizables publico
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── product-card/
│   │   │   │   │   │   ├── brand-card/
│   │   │   │   │   │   ├── breadcrumb/
│   │   │   │   │   │   ├── pagination/
│   │   │   │   │   │   ├── filter-bar/
│   │   │   │   │   │   ├── carousel/
│   │   │   │   │   │   ├── whatsapp-fab/
│   │   │   │   │   │   ├── language-selector/
│   │   │   │   │   │   └── contact-form/
│   │   │   │   │   ├── pipes/
│   │   │   │   │   │   └── translate-field.pipe.ts
│   │   │   │   │   └── directives/
│   │   │   │   │       └── lazy-image.directive.ts
│   │   │   │   ├── layout/            # Header, footer, shell publico
│   │   │   │   │   ├── header/
│   │   │   │   │   ├── footer/
│   │   │   │   │   └── public-layout.component.ts
│   │   │   │   └── features/          # Feature modules (lazy loaded)
│   │   │   │       ├── home/
│   │   │   │       │   ├── components/
│   │   │   │       │   │   ├── hero/
│   │   │   │       │   │   ├── category-blocks/
│   │   │   │       │   │   ├── featured-brands/
│   │   │   │       │   │   ├── value-proposition/
│   │   │   │       │   │   ├── featured-products/
│   │   │   │       │   │   └── manufacturer-cta/
│   │   │   │       │   └── home.component.ts
│   │   │   │       ├── catalog/
│   │   │   │       │   ├── components/
│   │   │   │       │   │   ├── catalog-page/
│   │   │   │       │   │   ├── category-page/
│   │   │   │       │   │   └── product-grid/
│   │   │   │       │   └── catalog.routes.ts
│   │   │   │       ├── product-detail/
│   │   │   │       │   ├── components/
│   │   │   │       │   │   ├── product-info/
│   │   │   │       │   │   ├── product-gallery/
│   │   │   │       │   │   ├── sticky-bar/
│   │   │   │       │   │   ├── storytelling/
│   │   │   │       │   │   └── related-products/
│   │   │   │       │   └── product-detail.component.ts
│   │   │   │       ├── brands/
│   │   │   │       │   ├── components/
│   │   │   │       │   │   ├── brand-list/
│   │   │   │       │   │   └── brand-detail/
│   │   │   │       │   └── brands.routes.ts
│   │   │   │       ├── about/
│   │   │   │       │   ├── components/
│   │   │   │       │   │   ├── about-hero/
│   │   │   │       │   │   ├── company-story/
│   │   │   │       │   │   ├── key-numbers/
│   │   │   │       │   │   ├── coverage-map/
│   │   │   │       │   │   ├── commercial-policies/
│   │   │   │       │   │   └── leadership-team/
│   │   │   │       │   └── about.component.ts
│   │   │   │       ├── distributors/
│   │   │   │       │   ├── components/
│   │   │   │       │   │   ├── distributor-hero/
│   │   │   │       │   │   ├── why-hesa/
│   │   │   │       │   │   ├── brand-wall/
│   │   │   │       │   │   ├── partnership-timeline/
│   │   │   │       │   │   └── manufacturer-form/
│   │   │   │       │   └── distributors.component.ts
│   │   │   │       ├── contact/
│   │   │   │       │   ├── components/
│   │   │   │       │   │   ├── contact-info/
│   │   │   │       │   │   └── contact-form/
│   │   │   │       │   └── contact.component.ts
│   │   │   │       └── search/
│   │   │   │           └── search-results.component.ts
│   │   │   ├── assets/
│   │   │   │   ├── i18n/
│   │   │   │   │   ├── es.json
│   │   │   │   │   └── en.json
│   │   │   │   ├── images/
│   │   │   │   └── styles/
│   │   │   │       ├── _variables.scss
│   │   │   │       ├── _design-tokens.scss
│   │   │   │       ├── _typography.scss
│   │   │   │       └── styles.scss
│   │   │   └── server.ts               # SSR entry point
│   │   └── angular.json
│   │
│   └── admin/                          # Panel de administracion (SPA)
│       ├── src/
│       │   ├── app/
│       │   │   ├── core/
│       │   │   │   ├── services/
│       │   │   │   │   ├── auth.service.ts
│       │   │   │   │   ├── api.service.ts
│       │   │   │   │   └── toast.service.ts
│       │   │   │   ├── interceptors/
│       │   │   │   │   ├── auth.interceptor.ts
│       │   │   │   │   └── error.interceptor.ts
│       │   │   │   └── guards/
│       │   │   │       └── auth.guard.ts
│       │   │   ├── shared/
│       │   │   │   ├── components/
│       │   │   │   │   ├── data-table/
│       │   │   │   │   ├── card-grid/
│       │   │   │   │   ├── toast/
│       │   │   │   │   ├── confirm-modal/
│       │   │   │   │   ├── image-uploader/
│       │   │   │   │   ├── pdf-uploader/
│       │   │   │   │   ├── tag-input/
│       │   │   │   │   ├── search-select/
│       │   │   │   │   ├── bilingual-input/
│       │   │   │   │   ├── status-badge/
│       │   │   │   │   ├── empty-state/
│       │   │   │   │   └── view-toggle/
│       │   │   │   └── pipes/
│       │   │   │       └── truncate.pipe.ts
│       │   │   ├── layout/
│       │   │   │   ├── sidebar/
│       │   │   │   ├── admin-header/
│       │   │   │   └── admin-layout.component.ts
│       │   │   └── features/
│       │   │       ├── login/
│       │   │       ├── dashboard/
│       │   │       ├── products/
│       │   │       │   ├── product-list/
│       │   │       │   ├── product-form/
│       │   │       │   └── product-detail/
│       │   │       ├── brands/
│       │   │       │   ├── brand-list/
│       │   │       │   └── brand-form/
│       │   │       ├── categories/
│       │   │       ├── home-management/
│       │   │       │   ├── hero-editor/
│       │   │       │   ├── featured-products/
│       │   │       │   └── featured-brands/
│       │   │       ├── content/
│       │   │       │   └── static-pages-editor/
│       │   │       ├── team/
│       │   │       │   ├── team-list/
│       │   │       │   └── team-form/
│       │   │       ├── messages/
│       │   │       │   ├── message-board/
│       │   │       │   ├── message-table/
│       │   │       │   └── message-detail/
│       │   │       └── settings/
│       │   │           ├── general/
│       │   │           ├── contact/
│       │   │           ├── social/
│       │   │           └── seo/
│       │   └── assets/
│       │       └── styles/
│       └── angular.json
│
├── api/                                # Backend Node.js/Express
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── storage.ts
│   │   │   ├── auth.ts
│   │   │   └── email.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── validate.middleware.ts
│   │   │   ├── upload.middleware.ts
│   │   │   ├── rate-limit.middleware.ts
│   │   │   └── security-headers.middleware.ts
│   │   ├── models/
│   │   │   ├── product.model.ts
│   │   │   ├── brand.model.ts
│   │   │   ├── category.model.ts
│   │   │   ├── message.model.ts
│   │   │   ├── team-member.model.ts
│   │   │   ├── page-content.model.ts
│   │   │   ├── home-config.model.ts
│   │   │   ├── site-config.model.ts
│   │   │   └── activity-log.model.ts
│   │   ├── routes/
│   │   │   ├── public/
│   │   │   │   ├── products.routes.ts
│   │   │   │   ├── brands.routes.ts
│   │   │   │   ├── pages.routes.ts
│   │   │   │   ├── search.routes.ts
│   │   │   │   ├── home.routes.ts
│   │   │   │   ├── contact.routes.ts
│   │   │   │   └── sitemap.routes.ts
│   │   │   └── admin/
│   │   │       ├── products.routes.ts
│   │   │       ├── brands.routes.ts
│   │   │       ├── categories.routes.ts
│   │   │       ├── messages.routes.ts
│   │   │       ├── team.routes.ts
│   │   │       ├── home.routes.ts
│   │   │       ├── content.routes.ts
│   │   │       ├── settings.routes.ts
│   │   │       └── dashboard.routes.ts
│   │   ├── services/
│   │   │   ├── product.service.ts
│   │   │   ├── brand.service.ts
│   │   │   ├── category.service.ts
│   │   │   ├── message.service.ts
│   │   │   ├── team.service.ts
│   │   │   ├── content.service.ts
│   │   │   ├── home.service.ts
│   │   │   ├── settings.service.ts
│   │   │   ├── search.service.ts
│   │   │   ├── email.service.ts
│   │   │   ├── image.service.ts
│   │   │   ├── storage.service.ts
│   │   │   └── activity-log.service.ts
│   │   ├── utils/
│   │   │   ├── slug.ts
│   │   │   ├── image-processor.ts
│   │   │   └── csv-exporter.ts
│   │   └── app.ts
│   ├── package.json
│   └── tsconfig.json
│
└── shared/                             # Tipos e interfaces compartidos
    ├── interfaces/
    │   ├── product.interface.ts
    │   ├── brand.interface.ts
    │   ├── category.interface.ts
    │   ├── message.interface.ts
    │   ├── team-member.interface.ts
    │   ├── page-content.interface.ts
    │   ├── home-config.interface.ts
    │   ├── site-config.interface.ts
    │   └── api-response.interface.ts
    └── constants/
        ├── categories.ts
        └── species.ts
```

### Modulos del Proyecto

#### Sitio Publico

| Modulo | Responsabilidad | Lazy Load | Dependencias |
|---|---|---|---|
| core (public) | Servicios singleton: API, SEO, i18n, CRM tracking, interceptors | No | - |
| shared (public) | Componentes reutilizables: product-card, brand-card, breadcrumb, pagination, filter-bar, carousel, whatsapp-fab, language-selector, contact-form | No | core |
| layout (public) | Header sticky, footer, shell publico con router-outlet | No | core, shared |
| home | Hero, bloques de categorias, marcas destacadas, propuesta de valor, productos destacados, CTA fabricantes | Si | core, shared |
| catalog | Catalogo general, paginas por categoria, grid de productos, filtros, paginacion | Si | core, shared |
| product-detail | Galeria, informacion principal, barra sticky, storytelling, productos relacionados | Si | core, shared |
| brands | Listado de marcas, pagina individual de marca con sus productos | Si | core, shared |
| about | Historia corporativa, numeros clave, cobertura/mapa, politicas comerciales, equipo de liderazgo | Si | core, shared |
| distributors | Hero fabricantes, por que HESA, logo wall, timeline partnership, formulario fabricantes | Si | core, shared |
| contact | Informacion de contacto, formulario general | Si | core, shared |
| search | Resultados de busqueda global | Si | core, shared |

#### Panel de Administracion

| Modulo | Responsabilidad | Lazy Load | Dependencias |
|---|---|---|---|
| core (admin) | Servicios singleton: auth (MSAL), API con token, toast, interceptors, guards | No | - |
| shared (admin) | Componentes reutilizables: data-table, card-grid, toast, confirm-modal, image-uploader, pdf-uploader, tag-input, search-select, bilingual-input, status-badge, empty-state, view-toggle | No | core |
| layout (admin) | Sidebar con navegacion, header con busqueda global y usuario, shell admin con router-outlet | No | core, shared |
| login | Pantalla de login con boton "Iniciar sesion con Microsoft" | No | core |
| dashboard | Cards de resumen, acceso rapido por categoria, ultimos mensajes, actividad reciente | Si | core, shared |
| products | Listado (card/table view), formulario crear/editar, vista detalle solo lectura | Si | core, shared |
| brands | Listado (card/table view), formulario crear/editar | Si | core, shared |
| categories | Cards expandibles para Farmacos/Alimentos/Equipos con tags editables | Si | core, shared |
| home-management | Editor del hero, selector de productos destacados, selector de marcas destacadas | Si | core, shared |
| content | Editor de paginas estaticas (Nosotros, Distribuidores, Contacto, Politicas) con tabs | Si | core, shared |
| team | Listado de miembros del equipo, formulario agregar/editar, reordenamiento drag-and-drop | Si | core, shared |
| messages | Vista Kanban, vista tabla, detalle de mensaje con notas internas, exportacion CSV | Si | core, shared |
| settings | Tabs: General, Contacto, Redes sociales, SEO | Si | core, shared |

#### Backend API

| Modulo | Responsabilidad | Dependencias |
|---|---|---|
| config | Conexion a BD, Blob Storage, Azure Entra ID, email service | - |
| middleware | Auth (validacion de tokens MSAL), validacion de inputs, upload (multer), rate limiting, headers de seguridad | config |
| models | Schemas Mongoose: Product, Brand, Category, Message, TeamMember, PageContent, HomeConfig, SiteConfig, ActivityLog | - |
| routes/public | Endpoints GET publicos: productos, marcas, paginas, busqueda, home, contacto, sitemap | middleware (validacion), services |
| routes/admin | Endpoints CRUD protegidos: productos, marcas, categorias, mensajes, equipo, home, contenido, config, dashboard | middleware (auth + validacion), services |
| services | Logica de negocio: CRUD, busqueda full-text, procesamiento de imagenes, envio de emails, generacion de slugs, exportacion CSV, logs de actividad | models, config |
| utils | Funciones utilitarias: generador de slugs bilingues, procesador de imagenes (sharp), exportador CSV | - |

---

## Decisiones de Arquitectura

### ADR-1: Dos aplicaciones Angular separadas (publico + admin)
- **Contexto**: El proyecto tiene un sitio publico que necesita SSR para SEO y un panel admin que no necesita SSR ni ser indexable. Compartir una sola app Angular implicaria cargar codigo del panel en el bundle publico y viceversa.
- **Decision**: Crear dos aplicaciones Angular independientes dentro del mismo repositorio (monorepo). El sitio publico usa Angular SSR. El panel admin es una SPA pura.
- **Justificacion**: (1) SSR solo donde se necesita — el panel no carga el motor de SSR. (2) Bundles optimizados independientes — el publico no incluye MSAL ni componentes de admin. (3) Deploy independiente posible. (4) Tipos compartidos via carpeta `shared/`.
- **Alternativas descartadas**: Single Angular app con lazy loading (SSR penaliza todo el bundle), micro-frontends (complejidad innecesaria para este alcance), Next.js (el cliente especifico Angular).

### ADR-2: Angular SSR para sitio publico (via @angular/ssr)
- **Contexto**: El SEO es critico: el sitio publico necesita meta tags dinamicos, hreflang, schema markup JSON-LD, sitemap XML, y contenido renderizado para crawlers. Las paginas de producto deben ser indexables con contenido completo.
- **Decision**: Usar @angular/ssr (Angular Universal) para server-side rendering del sitio publico. El backend Express sirve como servidor SSR ademas de API.
- **Justificacion**: (1) SEO completo con meta tags dinamicos renderizados en servidor. (2) Performance — LCP < 2.5s al enviar HTML renderizado. (3) Compatible con el stack Angular requerido. (4) El mismo backend Express maneja SSR y API.
- **Alternativas descartadas**: Pre-rendering estatico (no viable con contenido dinamico del panel), CSR con meta tags via TransferState (crawlers no siempre ejecutan JS), Scully (abandonado).

### ADR-3: Azure Cosmos DB con API for MongoDB + Mongoose ODM
- **Contexto**: Se necesita una base de datos para productos, marcas, mensajes, contenido estatico y configuracion. El deploy target es Azure. El equipo conoce MongoDB/Mongoose.
- **Decision**: Usar Azure Cosmos DB con API for MongoDB, accedido via Mongoose ODM desde el backend Node.js.
- **Justificacion**: (1) Compatibilidad total con Mongoose — el codigo es identico a MongoDB standalone. (2) Managed service con backups automaticos diarios (resuelve GAP-T09). (3) Escalabilidad sin gestion de infra. (4) Soporte nativo para text indexes (busqueda full-text, GAP-T05).
- **Alternativas descartadas**: MongoDB Atlas (viable pero el cliente ya tiene Azure), Azure SQL (relacional innecesario para este modelo de datos flexible), Cosmos DB API for NoSQL (requiere SDK propio, no usa Mongoose).

### ADR-4: MSAL Angular para autenticacion con Azure Entra ID
- **Contexto**: El panel se autentica exclusivamente via Azure Entra ID. No hay contrasenas propias, no hay registro de usuarios, no hay recuperacion de contrasena. Un solo nivel de admin.
- **Decision**: Usar @azure/msal-angular (MSAL v2) con flujo Authorization Code + PKCE para el panel. El backend valida tokens JWT en cada request protegido.
- **Justificacion**: (1) Libreria oficial de Microsoft para Angular SPA + Entra ID. (2) Maneja refresh tokens, silent auth, y re-autenticacion automatica. (3) PKCE es el flujo recomendado para SPAs. (4) Un solo App Registration en Azure para la SPA del panel.
- **Alternativas descartadas**: Auth propia con contrasenas (explicitamente descartada por el cliente), Firebase Auth (no se integra con Entra ID), passport-azure-ad en backend-only (no da experiencia SPA fluida).

### ADR-5: @ngx-translate para i18n estatico + campos bilingues en BD para contenido dinamico
- **Contexto**: El sitio es bilingue ES/EN. Hay dos tipos de contenido: estatico (labels, botones, mensajes del sistema) y dinamico (productos, marcas, textos de paginas, configuracion).
- **Decision**: Usar @ngx-translate/core para contenido estatico (archivos JSON es.json/en.json). Para contenido dinamico, cada documento en la BD tiene campos bilingues (ej: `name: { es: "...", en: "..." }`). Un pipe `translateField` resuelve el campo segun el idioma activo.
- **Justificacion**: (1) Separacion clara: traducciones de UI vs contenido de negocio. (2) @ngx-translate es maduro, tiene lazy loading de archivos de idioma, y funciona con SSR. (3) Campos bilingues en BD permiten administrar traducciones desde el panel sin redeploy. (4) Fallback ES cuando EN no existe (REQ-031).
- **Alternativas descartadas**: Angular i18n nativo (requiere un build por idioma — dos deploys), solo campos bilingues en BD (no practico para 200+ labels de UI), i18next (menos integracion con Angular).

### ADR-6: Azure Blob Storage + CDN + sharp para imagenes optimizadas
- **Contexto**: El sitio maneja imagenes de productos (hasta 6 por producto), logos de marcas, fotos de equipo, imagenes de hero y paginas. Se necesita optimizacion automatica (WebP, redimensionado) y servido rapido.
- **Decision**: Las imagenes se suben al backend, se procesan con sharp (redimensionado a 200px, 400px, 800px, 1200px + conversion a WebP), se almacenan en Azure Blob Storage, y se sirven via Azure CDN. Los PDFs de fichas tecnicas se suben sin procesamiento.
- **Justificacion**: (1) sharp es la libreria mas performante para procesamiento de imagenes en Node.js. (2) Multiples tamanios permite srcset responsive sin over-fetching. (3) WebP reduce peso ~30% vs JPEG. (4) CDN minimiza latencia globalmente (fabricantes de Asia). (5) Blob Storage con geo-redundancia (RA-GRS) para durabilidad.
- **Alternativas descartadas**: Procesamiento client-side (lento, no confiable), Cloudinary/imgix (costo adicional, dependencia externa), almacenar imagenes en BD (antipatron, tamano de documentos).

### ADR-7: Busqueda full-text con text indexes de MongoDB
- **Contexto**: La busqueda global con prediccion/autocompletado es una funcionalidad critica (Feature 1.5). Debe buscar en productos (nombre, marca, especie, familia) y marcas (nombre), con tolerancia a errores tipograficos menores.
- **Decision**: Crear text indexes compuestos en las colecciones de productos y marcas. Busqueda case-insensitive con normalizacion de acentos (collation: { locale: "es", strength: 1 }). El endpoint de busqueda combina resultados de ambas colecciones, agrupados por tipo, limitados a 5 por tipo.
- **Justificacion**: (1) No requiere servicio adicional — funciona directo en Cosmos DB. (2) Suficiente para el volumen esperado (cientos de productos, no millones). (3) Collation con strength:1 da tolerancia a acentos y case. (4) Migrable a Azure Cognitive Search si escala (GAP-T05).
- **Alternativas descartadas**: Azure Cognitive Search (overkill para < 1000 productos, costo adicional), Algolia (dependencia externa), busqueda regex client-side (no escalable).

### ADR-8: Estrategia de URLs bilingues con prefijo /es/ y /en/
- **Contexto**: Cada pagina debe existir en dos URLs con prefijo de idioma y slugs traducidos (ej: /es/catalogo/farmacos, /en/catalog/pharmaceuticals). Hreflang debe conectar las versiones.
- **Decision**: Todas las rutas del sitio publico tienen prefijo obligatorio /:lang/. Un guard de ruta detecta el idioma del navegador en primera visita y redirige al prefijo correspondiente (ES por defecto). Los slugs de productos y marcas se generan y almacenan en ambos idiomas en la BD. El sitemap XML incluye todas las URLs en ambos idiomas con hreflang.
- **Justificacion**: (1) Patron recomendado por Google para SEO multilenguaje. (2) URLs compartibles en el idioma correcto. (3) Slugs en BD permiten URLs semanticas sin depender de traduccion al vuelo. (4) Guard de redireccion garantiza que no haya URLs sin prefijo de idioma.
- **Alternativas descartadas**: Subdominio por idioma (complejidad DNS, dos deploys), query parameter ?lang=es (peor SEO), deteccion por IP (impreciso, no compartible).

### ADR-9: Anti-spam en tres capas para formularios publicos
- **Contexto**: Los formularios de contacto general y de fabricantes necesitan proteccion anti-spam sin degradar la experiencia del usuario.
- **Decision**: Tres capas: (1) Honeypot fields — campos invisibles que solo bots llenan. (2) Rate limiting por IP — maximo 5 envios/hora via middleware Express. (3) reCAPTCHA v3 invisible como respaldo — no requiere interaccion del usuario, evalua un score de riesgo.
- **Justificacion**: (1) Honeypot bloquea la mayoria de bots basicos sin friccion para el usuario. (2) Rate limiting previene abuso automatizado. (3) reCAPTCHA v3 invisible no muestra captcha visual — solo evalua comportamiento. Las tres capas son complementarias.
- **Alternativas descartadas**: reCAPTCHA v2 checkbox (friccion de usuario), hCaptcha (peor integracion), solo rate limiting (insuficiente contra bots sofisticados).

### ADR-10: Signals de Angular para estado, sin libreria externa de state management
- **Contexto**: El proyecto necesita estado reactivo para: idioma activo, filtros del catalogo, datos del usuario autenticado, configuracion del sitio.
- **Decision**: Usar Angular Signals (nativo desde v16) para estado reactivo en servicios singleton. No usar NgRx, NGXS, ni otra libreria de state management. Los servicios del core manejan estado compartido via signals expuestos como readonly.
- **Justificacion**: (1) Signals es nativo de Angular — cero dependencias extra. (2) La complejidad de estado de este proyecto es moderada (no hay estado offline, no hay optimistic updates complejos). (3) Cada servicio es dueno de su estado — sin store global que complique la depuracion. (4) Consistente con la direccion futura de Angular.
- **Alternativas descartadas**: NgRx (overkill para este proyecto, boilerplate excesivo), NGXS (capa adicional innecesaria), BehaviorSubject/RxJS puro (signals es mas simple y performante para este caso).

### ADR-11: Estrategia de cache para sitio publico
- **Contexto**: El sitio publico debe cargar rapido (LCP < 2.5s) y servir contenido que cambia con poca frecuencia (productos, marcas, textos se editan desde el panel cada dias/semanas).
- **Decision**: Cache en tres niveles: (1) CDN cache para assets estaticos (imagenes, CSS, JS) con TTL largo (1 ano con hashing). (2) HTTP cache headers en responses de API publica con TTL de 1 hora (Cache-Control: public, max-age=3600). (3) Invalidacion desde el panel: al guardar cambios en el panel, el backend emite un header de cache-bust que el CDN respeta, o alternativamente se usa un query parameter de version en las llamadas API.
- **Justificacion**: (1) La mayoria de visitantes ven el mismo contenido — cache reduce carga del servidor. (2) TTL de 1 hora es balance entre frescura y performance. (3) El panel modifica contenido raramente — invalidacion por version es suficiente.
- **Alternativas descartadas**: No cache (performance pobre), cache muy agresiva sin invalidacion (contenido desactualizado por horas), service worker con cache-first (complejidad innecesaria para un sitio informativo).

### ADR-12: Azure Communication Services para email transaccional
- **Contexto**: Los formularios de contacto (general y fabricantes) deben enviar notificacion por email a hola@linkdesign.cr. Se necesita un servicio de email transaccional con reintentos.
- **Decision**: Usar Azure Communication Services (Email) para enviar notificaciones. Templates HTML simples inline. Cola de reintentos: 3 intentos con backoff exponencial (1s, 4s, 16s). Los mensajes tambien se almacenan en BD independientemente del email.
- **Justificacion**: (1) Servicio nativo de Azure — sin proveedor externo. (2) Bajo costo para el volumen esperado (decenas de emails/mes). (3) SDK oficial para Node.js. (4) Los mensajes se persisten en BD como respaldo si el email falla.
- **Alternativas descartadas**: SendGrid (viable pero dependencia externa y requiere cuenta separada), SMTP directo (sin reintentos, baja entregabilidad), Azure Logic Apps (overkill para emails simples).

---

## Plan de Iteraciones

### Fase de Construccion Visual — Criterios DEMO
**Scope**: Frontend-only con datos mock. Todas las pantallas del sitio publico y del panel de administracion navegables con el estilo visual definitivo. 1-2 flujos criticos interactivos con datos mock. El resto de features visibles como shell (estados vacios, placeholders). Sin backend real — los datos provienen de archivos JSON mock.
**Entregable**: Aplicacion desplegada en Azure Static Web Apps que el cliente puede navegar para validar estructura, flujos y estilo visual antes de iniciar el desarrollo funcional.

| ID | Feature | Criterio de demo | Origen |
|---|---|---|---|
| DEMO-001 | Layout publico — Header | Header sticky con logo HESA, links de navegacion (Catalogo con submenu, Marcas, Nosotros, Distribuidores, Contacto), icono de busqueda, selector ES/EN. Estado activo visible en link actual. En mobile: hamburguesa con drawer lateral | REQ-001 a REQ-012 |
| DEMO-002 | Layout publico — Footer | Footer con logo, navegacion completa, info de contacto (telefono, correo, direccion), redes sociales, selector de idioma, copyright con ano dinamico. En mobile: columna unica | REQ-013 a REQ-020 |
| DEMO-003 | WhatsApp flotante | Boton flotante WhatsApp esquina inferior derecha, area de toque 44x44px en mobile, no obstruye contenido ni barra sticky de producto | REQ-021 a REQ-026 |
| DEMO-004 | Home — Hero | Hero 100vh con tag superior, headline, subtitulo, CTA primario ("Explorar catalogo"), CTA secundario ("Distribuya con nosotros"), imagen de fondo. Responsive en mobile | REQ-042 a REQ-050 |
| DEMO-005 | Home — Bloques de categorias | 3 bloques (Farmacos, Alimentos, Equipos) con titulo, descripcion, 3 beneficios con iconos, imagen, CTA. Alternancia izquierda-derecha en desktop. Stack vertical en mobile | REQ-051 a REQ-056 |
| DEMO-006 | Home — Marcas destacadas | Grid de 6-8 logos mock, titulo de seccion, link "Ver todas las marcas". Logos centrados y consistentes en tamano | REQ-057 a REQ-061 |
| DEMO-007 | Home — Propuesta de valor | 4 bloques con datos clave (37 anos, cobertura nacional, 100% veterinario, credito flexible) con numeros grandes, iconos, texto descriptivo. Grid 2x2 en mobile | REQ-062 a REQ-065 |
| DEMO-008 | Home — Productos destacados | Carrusel horizontal con cards de productos mock (imagen, nombre, descripcion, boton "Ver producto"), flechas e indicadores. Swipe en mobile. Si vacio, seccion oculta | REQ-066 a REQ-073 |
| DEMO-009 | Home — CTA fabricantes | Banner con titulo orientado a fabricantes (sin Centroamerica), parrafo, CTA a Distribuidores. Responsive en mobile | REQ-074 a REQ-077 |
| DEMO-010 | Catalogo general | Pagina /catalogo con grid de cards de productos mock (imagen, nombre, marca, especie), filtros en barra horizontal (Categoria, Marca, Especie), breadcrumb, contador. 3 col desktop, 1-2 mobile. Boton "Filtrar" en mobile | REQ-264a a REQ-264j |
| DEMO-011 | Catalogo por categoria | Paginas /catalogo/farmacos, /alimentos, /equipos con grid, filtros especificos por categoria, breadcrumb, contador, descripcion. Misma estructura visual que catalogo general | REQ-078 a REQ-087 |
| DEMO-012 | Filtros del catalogo | Dropdowns en barra horizontal, pills de filtros activos con "X", boton "Limpiar filtros", actualizacion inmediata del grid con datos mock, filtros adaptivos segun categoria. En mobile: drawer/modal | REQ-088 a REQ-100 |
| DEMO-013 | Paginacion del catalogo | Controles de paginacion, indicador "Mostrando X de Y", scroll al inicio al cambiar pagina. Funcional con datos mock | REQ-101 a REQ-105 |
| DEMO-014 | Detalle de producto | Layout dos columnas: galeria con miniaturas + info principal (nombre, marca con link, badges especie, campos segun tipo, CTA "Solicitar informacion", CTA "WhatsApp", boton ficha tecnica condicional). Una columna en mobile | REQ-106 a REQ-129 |
| DEMO-015 | Barra sticky producto | Barra fija superior al scrollear: miniatura, nombre, marca, boton "Solicitar informacion". Simplificada en mobile. Sin salto de layout | REQ-130 a REQ-134 |
| DEMO-016 | Storytelling producto | Bloques opcionales imagen+texto debajo de info principal. Solo visibles si hay contenido mock | REQ-135 a REQ-137 |
| DEMO-017 | Productos relacionados | Seccion "Tambien te puede interesar" con 3-4 cards. Carrusel con swipe en mobile | REQ-138 a REQ-142 |
| DEMO-018 | Listado de marcas | Grid de cards (logo, nombre, pais, badges categorias), 3-4 col desktop, 1-2 mobile, titulo y parrafo introductorio | REQ-143 a REQ-148 |
| DEMO-019 | Pagina individual de marca | Breadcrumb, logo grande, nombre, pais, descripcion, grid de productos de esa marca con filtros | REQ-149 a REQ-154 |
| DEMO-020 | Pagina Nosotros | Hero (50-60vh), historia HESA, numeros clave (5 datos impactantes), cobertura con mapa SVG de Costa Rica, politicas comerciales, equipo de liderazgo (6 placeholders). Todo responsive | REQ-155 a REQ-173c |
| DEMO-021 | Pagina Distribuidores | Hero fabricantes, seccion "Por que HESA" (grid beneficios), logo wall, timeline 4 pasos (horizontal desktop, vertical mobile), formulario fabricantes con todos los campos | REQ-174 a REQ-192 |
| DEMO-022 | Pagina Contacto | Layout dos columnas: info contacto (telefono, correo, direccion, horario, redes) + formulario general (nombre, email, telefono, tipo consulta, producto interes, mensaje). Sin mapa. Una columna en mobile | REQ-193 a REQ-205 |
| DEMO-023 | Busqueda global | Overlay/campo expandible desde icono en header. Resultados agrupados por tipo (Productos, Marcas) con max 5 por tipo. Mensaje "no resultados" con sugerencias. Datos mock | REQ-035 a REQ-041 |
| DEMO-024 | Panel — Login | Pantalla con logo HESA y boton "Iniciar sesion con Microsoft". Mensaje de error si no tiene acceso | REQ-308 a REQ-317 |
| DEMO-025 | Panel — Sidebar | Logo HESA, modulos con submenus (Dashboard, Productos, Marcas, Categorias, Home, Contenido, Mensajes, Configuracion), item activo con fondo azul, chevrons en submenus, badge en Mensajes. Colapsable en tablet, hamburguesa en mobile | REQ-212 a REQ-218 |
| DEMO-026 | Panel — Header | Nombre de seccion, barra de busqueda global, icono notificaciones con badge, avatar con nombre y dropdown (cerrar sesion). Fijo durante scroll | REQ-219 a REQ-223 |
| DEMO-027 | Panel — Dashboard | 4 cards resumen (productos, mensajes nuevos, marcas, productos destacados), 3 cards categorias clickables (Farmacos, Alimentos, Equipos con conteo), ultimos 5 mensajes, actividad reciente | REQ-206 a REQ-211 |
| DEMO-028 | Panel — Listado productos | Titulo, subtitulo, boton "+ Crear producto", filtros (busqueda, categoria, marca, estado), toggle Card/Table view. Cards: imagen, nombre, marca, badge categoria, badge estado, menu 3 puntos. Table: checkbox, miniatura, columnas. Paginacion. Estado vacio | REQ-224 a REQ-233 |
| DEMO-029 | Panel — Formulario producto | Pantalla completa con breadcrumb. Secciones: info basica (nombre ES/EN, marca, categoria), clasificacion (campos condicionales segun tipo), descripcion con tabs ES/EN, imagenes drag-and-drop + PDF ficha tecnica. Validacion con asteriscos. Boton eliminar con modal de confirmacion | REQ-234 a REQ-254 |
| DEMO-030 | Panel — Detalle producto | Breadcrumb, layout 2 columnas (imagen + info en bloques), boton "Editar producto", link "Ver en sitio web", link ficha tecnica | REQ-255 a REQ-258 |
| DEMO-031 | Panel — Listado marcas | Titulo, boton "+ Agregar marca", grid cards (logo, nombre, pais, badges categorias, conteo productos, menu 3 puntos), toggle Table view. Estado vacio | REQ-259 a REQ-263 |
| DEMO-032 | Panel — Formulario marca | Pantalla dedicada: logo drag-and-drop, nombre, pais (dropdown), categorias (multi-select), descripcion ES/EN. Validacion. Advertencia al eliminar si tiene productos | REQ-264 a REQ-267 |
| DEMO-033 | Panel — Categorias | 3 cards expandibles (Farmacos, Alimentos, Equipos). Subsecciones con tags/chips editables (familias, especies, etapas, tipos). Boton "+" para agregar, "x" para eliminar. Advertencia al eliminar tag en uso | REQ-268 a REQ-274 |
| DEMO-034 | Panel — Gestion Hero | Preview imagen hero, campos editables ES/EN (tag, headline, subtitulo, CTAs), boton "Cambiar imagen" | REQ-275 a REQ-277 |
| DEMO-035 | Panel — Productos destacados | Lista de cards horizontales (miniatura + nombre + marca + boton "X"), boton "+ Agregar", modal de busqueda/seleccion con checkboxes, drag-and-drop para reordenar | REQ-278 a REQ-281 |
| DEMO-036 | Panel — Marcas destacadas | Mismo patron que productos destacados pero para logos de marcas, con seleccion, remocion y reordenamiento | REQ-282 a REQ-283 |
| DEMO-037 | Panel — Contenido estatico | Tabs (Nosotros, Distribuidores, Contacto, Politicas), formularios con campos organizados por seccion, version ES/EN, imagenes editables (hero Nosotros, hero Distribuidores), textarea simple | REQ-284 a REQ-288 |
| DEMO-038 | Panel — Equipo liderazgo | Grid/listado de 6 miembros placeholder (foto, nombre, cargo, botones editar/eliminar), boton "+ Agregar miembro", formulario (foto drag-and-drop, nombre ES/EN, cargo ES/EN), reordenamiento drag-and-drop, confirmacion al eliminar | REQ-318 a REQ-321e |
| DEMO-039 | Panel — Mensajes | Toggle Kanban/Table. Kanban: 3 columnas (Nuevos, En proceso, Atendidos) con conteo, cards con badge tipo, nombre, correo, mensaje truncado, fecha. Table: columnas con badges. Filtros. Boton "Exportar CSV" | REQ-289 a REQ-296 |
| DEMO-040 | Panel — Detalle mensaje | Card lateral datos contacto, contenido completo, producto de interes con link, dropdown estado, textarea notas internas, boton "Marcar como atendido", timestamp, boton eliminar | REQ-297 a REQ-302 |
| DEMO-041 | Panel — Configuracion | 4 tabs: General (logo, nombre, idioma defecto), Contacto (telefono, correo, direccion, horario, WhatsApp), Redes sociales (Facebook, Instagram, otras), SEO (meta titulo ES/EN, meta desc ES/EN, OG image). Toast al guardar | REQ-303 a REQ-307 |
| DEMO-042 | Sistema bilingue | Prefijos /es/ y /en/ en URLs, slugs traducidos, selector de idioma funcional (mantiene pagina actual), deteccion de idioma del navegador en primera visita, fallback ES | REQ-027 a REQ-034 |
| DEMO-043 | Responsive completo | Todas las pantallas publicas verificadas en 375px, 768px, 1024px, 1280px, 1440px+. Panel verificado en desktop, tablet (sidebar colapsable) y mobile (hamburguesa) | NFR-031, NFR-032 |
| DEMO-044 | Design system aplicado | Tokens CSS (colores, tipografia, spacing, border-radius, shadows), Bootstrap 5 customizado, componentes con estilos del design-criteria.md aplicados | Estructural |
| DEMO-045 | CRM tracking | Eventos open, page-view, scroll (umbrales 10%), heartbeat (30s), CTA clicks, custom. Batching cada 10s, sendBeacon + fallback fetch. Flush en visibilitychange y beforeunload. Resiliente a fallos | Estructural |

> Los REQ-IDs del BA se asignan a partir de Iteracion 1. La Fase de Construccion Visual usa criterios DEMO-xxx definidos por el Architect.
> **Como derivar DEMO-xxx**: Filtrar los REQ-xxx del BA que tengan componente UI visible + agregar criterios estructurales (responsive, design system, CRM tracking). Cada DEMO-xxx debe tener cobertura en design-criteria.md (DC-xxx) y/o ux-criteria.md (UX-xxx).

### Iteracion 1: Fundacion Backend + Catalogo Funcional
**Scope**: Backend API completo para productos, marcas y categorias. CRUD de productos y marcas desde el panel. Catalogo publico funcional con filtros, paginacion y busqueda. Sistema bilingue conectado a BD. Autenticacion Azure Entra ID funcional.
**Entregable**: Panel donde el admin puede crear/editar productos y marcas con imagenes. Sitio publico donde los visitantes navegan el catalogo real con filtros y busqueda.

| Feature | Criterios cubiertos | Dependencias |
|---|---|---|
| Infraestructura backend (Express, Cosmos DB, Blob Storage, modelos) | NFR-014, NFR-017, NFR-018, NFR-019, NFR-020 | - |
| Autenticacion Azure Entra ID (MSAL Angular + validacion backend) | REQ-308 a REQ-317 | Infraestructura backend |
| CRUD de Productos (API + panel: listado, formulario, detalle, imagenes, PDF) | REQ-224 a REQ-258 | Autenticacion, Blob Storage |
| CRUD de Marcas (API + panel: listado, formulario) | REQ-259 a REQ-267 | Autenticacion, Blob Storage |
| Gestion de Categorias y filtros (API + panel) | REQ-268 a REQ-274 | Autenticacion |
| Catalogo publico funcional (general + por categoria + filtros + paginacion) | REQ-078 a REQ-105, REQ-264a a REQ-264j | API productos |
| Detalle de producto funcional (galeria, info, ficha tecnica, relacionados) | REQ-106 a REQ-142 | API productos |
| Pagina de marcas funcional (listado + detalle) | REQ-143 a REQ-154 | API marcas |
| Busqueda global con prediccion/autocompletado | REQ-035 a REQ-041 | API productos, API marcas |
| SSR + SEO basico (meta tags, hreflang, schema markup, sitemap) | NFR-006 a NFR-013, REQ-033, REQ-086, REQ-087, REQ-124 a REQ-126, REQ-147, REQ-154, REQ-181 | SSR configurado |

### Iteracion 2: Home Administrable + Contenido Estatico + Equipo
**Scope**: Home del sitio publico conectado a datos reales del panel. Panel de gestion del hero, productos destacados, marcas destacadas. Edicion de contenido de paginas estaticas (Nosotros, Distribuidores, Contacto, Politicas). Gestion de equipo de liderazgo con datos iniciales ficticios.
**Entregable**: El admin puede personalizar completamente el home y todas las paginas de contenido. El equipo de liderazgo se muestra con placeholders editables.

| Feature | Criterios cubiertos | Dependencias |
|---|---|---|
| Home conectado a BD (hero, categorias, marcas destacadas, productos destacados, propuesta de valor, CTA fabricantes) | REQ-042 a REQ-077 | API home-config, API productos, API marcas |
| Gestion del Hero desde panel | REQ-275 a REQ-277 | Autenticacion, Blob Storage |
| Gestion de Productos Destacados desde panel | REQ-278 a REQ-281 | Autenticacion, API productos |
| Gestion de Marcas Destacadas desde panel | REQ-282 a REQ-283 | Autenticacion, API marcas |
| Edicion de paginas estaticas (Nosotros, Distribuidores, Contacto, Politicas) | REQ-284 a REQ-288 | Autenticacion, Blob Storage |
| Paginas Nosotros + Distribuidores + Contacto conectadas a BD | REQ-155 a REQ-173c, REQ-174 a REQ-181, REQ-193 a REQ-196 | API content |
| Gestion de equipo de liderazgo (CRUD + reordenamiento + placeholders iniciales) | REQ-318 a REQ-321e, REQ-172 a REQ-173c | Autenticacion, Blob Storage |

### Iteracion 3: Formularios + Mensajes + Configuracion + Dashboard
**Scope**: Formularios de contacto funcionales (general + fabricantes) con envio de email y almacenamiento. Gestion de mensajes en panel (Kanban + tabla + detalle). Configuracion general del sitio. Dashboard con datos reales. Integraciones preparadas (GA4, FB Pixel, WhatsApp).
**Entregable**: Todos los formularios publicos envian notificaciones por email y almacenan mensajes. El panel muestra dashboard con metricas reales y permite gestionar mensajes con flujo Kanban. Configuracion completa del sitio operativa.

| Feature | Criterios cubiertos | Dependencias |
|---|---|---|
| Formulario de contacto general funcional (envio, email, anti-spam) | REQ-197 a REQ-205, NFR-016, NFR-017 | API contact, Email service |
| Formulario de fabricantes funcional (envio, email, anti-spam) | REQ-182 a REQ-192, NFR-016, NFR-017 | API contact, Email service |
| Gestion de mensajes — Kanban + Table + Detalle + Exportacion CSV | REQ-289 a REQ-302 | API messages, Autenticacion |
| Dashboard con datos reales | REQ-206 a REQ-211 | API dashboard (agrega datos de productos, marcas, mensajes) |
| Configuracion del sitio (General, Contacto, Redes, SEO) | REQ-303 a REQ-307 | API settings, Autenticacion |
| Boton WhatsApp con numero configurable desde panel | REQ-021 a REQ-026, REQ-304 | API settings |
| Integraciones preparadas: GA4 + FB Pixel (desactivadas, activables via config) | NFR-027, NFR-030 | API settings |
| Open Graph tags + compartir en redes sociales | NFR-029 | SSR, API settings |

### Iteracion 4: Performance, Accesibilidad y Pulido Final
**Scope**: Optimizacion de performance para cumplir Core Web Vitals. Accesibilidad WCAG 2.1 AA. Busqueda global del panel. Navegacion con teclado. Image optimization pipeline. Pulido visual y edge cases finales.
**Entregable**: Sitio publico cumple Core Web Vitals y WCAG 2.1 AA. Panel completamente funcional con busqueda global. Todos los edge cases resueltos. Listo para produccion.

| Feature | Criterios cubiertos | Dependencias |
|---|---|---|
| Performance: lazy loading imagenes, preload critico, bundle optimization, cache headers | NFR-001 a NFR-005 | Todo el sitio publico |
| Accesibilidad WCAG 2.1 AA: contraste, teclado, alt texts, ARIA, touch targets | NFR-021 a NFR-026, REQ-011, REQ-025, REQ-103 | Todo el sitio publico |
| Busqueda global del panel (productos, marcas, mensajes) con dropdown | REQ-220, REQ-221 | API search |
| Actividad reciente en dashboard (logs de acciones CRUD) | REQ-210 | API activity-log |
| Notificaciones del panel (badge de mensajes nuevos, campana) | REQ-218, REQ-222 | API messages |
| Edge cases finales: estados vacios, fallback de imagenes, producto sin traduccion, secciones condicionales | REQ-031, REQ-073, REQ-085, REQ-097, REQ-120, REQ-127 a REQ-129, REQ-142, REQ-173, REQ-232, REQ-233, REQ-263, REQ-321e | Todo el sistema |
| Seguridad: CSP headers, X-Frame-Options, rate limiting, sanitizacion final | NFR-014, NFR-017, NFR-020 | Backend |

---

## Diagrama de Dependencias

```
                              [shared/interfaces]
                                     |
                    +----------------+----------------+
                    |                                  |
              [apps/public]                      [apps/admin]
                    |                                  |
     +--------------+--------------+       +-----------+-----------+
     |              |              |       |           |           |
  [core]        [shared]       [layout]  [core]    [shared]    [layout]
     |              |              |       |           |           |
     +--------------+              |       +-----------+           |
     |                             |       |                       |
  [features/*]  <-- lazy loaded    |    [features/*] <-- lazy      |
  (home, catalog, product-detail,  |    (dashboard, products,      |
   brands, about, distributors,    |     brands, categories,       |
   contact, search)                |     home-mgmt, content,       |
                                   |     team, messages, settings, |
                                   |     login)                    |
                                   |                               |
                              [api/] <-----------------------------+
                                |
                +---------------+---------------+
                |               |               |
            [models]      [services]      [middleware]
                |               |               |
                +-------+-------+               |
                        |                       |
                   [routes/public]         [routes/admin]
                                                |
                                          [auth.middleware]
                                                |
                                          [Azure Entra ID]

External Services:
  [Azure Cosmos DB] <--- [models/services]
  [Azure Blob Storage] <--- [storage.service]
  [Azure CDN] <--- [Blob Storage]
  [Azure Communication Services] <--- [email.service]
  [reCAPTCHA v3] <--- [contact routes]
```

---

## Infraestructura Cloud

Servicios cloud requeridos para el proyecto. DevOps provisiona Static Web Apps + CI/CD en FASE 3.5 (antes de la Fase de Construccion Visual — demo), y el resto de servicios en FASE 3.5-INFRA (antes de Iteracion 1 — desarrollo real).

| Servicio | Proposito | Configuracion clave |
|---|---|---|
| Azure Static Web Apps (public) | Frontend Angular del sitio publico con SSR | Custom domain hesa.cr (o similar), fallback route para SPA, API backend integration para SSR, configuracion de rutas /es/ y /en/ |
| Azure Static Web Apps (admin) | Frontend Angular del panel de administracion | Custom domain admin.hesa.cr (o subpath /admin), fallback route para SPA, meta noindex via staticwebapp.config.json |
| Azure App Service | Backend API Node.js/Express | Runtime Node.js 20 LTS, Application Settings para environment variables (COSMOS_CONNECTION_STRING, BLOB_CONNECTION_STRING, ENTRA_TENANT_ID, ENTRA_CLIENT_ID, EMAIL_CONNECTION_STRING, RECAPTCHA_SECRET), Always On habilitado, CORS configurado para dominios del frontend |
| Azure Cosmos DB (API for MongoDB) | Base de datos principal | Collections: products, brands, categories, messages, team_members, page_contents, home_config, site_config, activity_logs. Partition key: /_id. Text indexes en products (name.es, name.en, brand) y brands (name). Collation: { locale: "es", strength: 1 }. Backup automatico continuo (PITR 30 dias) |
| Azure Blob Storage | Almacenamiento de imagenes y PDFs | Container: images (acceso blob publico via CDN), Container: documents (acceso privado, PDFs fichas tecnicas). Geo-redundancia RA-GRS. Lifecycle policy: eliminar blobs huerfanos despues de 90 dias |
| Azure CDN | CDN para assets estaticos e imagenes | Perfil Standard Microsoft. Endpoint sobre Blob Storage container "images". Reglas de cache: imagenes TTL 7 dias, cache-bust via query string. Custom domain cdn.hesa.cr |
| Azure Entra ID (App Registration) | Autenticacion del panel de administracion | App Registration tipo SPA. Redirect URIs: https://admin.hesa.cr, http://localhost:4200. Supported account types: Single tenant. API permissions: User.Read. Token configuration: Access tokens + ID tokens. Asignar usuario hola@linkdesign.cr |
| Azure Communication Services | Envio de emails transaccionales (notificaciones de formularios) | Email service habilitado. Domain: dominio verificado o *.azurecomm.net para desarrollo. Template basico HTML para notificaciones. Rate limit interno: 5 emails/hora desde formularios |

---

## Gaps Tecnicos Descubiertos

| # | Gap | Impacto en requirements | Recomendacion |
|---|---|---|---|
| GAP-A01 | REQ-253 pide "optimizacion automatica de imagenes al subirlas" pero no define si incluir AVIF ademas de WebP. NFR-002 menciona "formatos modernos WebP/AVIF" pero AVIF tiene soporte de navegador limitado y procesamiento significativamente mas lento con sharp | REQ-253, NFR-002 | Implementar WebP como formato principal optimizado. AVIF se descarta por ahora por costo de procesamiento y soporte parcial. Usar elemento `<picture>` con WebP + JPEG fallback. Reevaluar AVIF cuando el soporte de navegador sea > 90% |
| GAP-A02 | REQ-254 permite "multiples imagenes por producto" y GAP-T12 define "hasta 6 imagenes" pero ningun REQ especifica validacion UX si el admin intenta subir mas de 6 imagenes — que pasa? Se deshabilita el boton? Se muestra error? | REQ-254 | Deshabilitar el boton "Agregar imagen" cuando se alcancen 6 imagenes, mostrando tooltip "Maximo 6 imagenes por producto". Implementar como validacion frontend + backend |
| GAP-A03 | REQ-099 pide "filtros activos reflejados en la URL (query params)" pero las URLs bilingues ya tienen prefijo /es/ o /en/ con slugs traducidos. La combinacion de prefijo de idioma + slug traducido + query params de filtros puede generar URLs muy largas y complejas para compartir | REQ-099, REQ-032 | Implementar query params simples (ej: ?marca=zoofarma&especie=caninos) que se mantienen al cambiar idioma. Los valores de filtro en query params se usan como keys internas, no traducidos. Esto mantiene URLs funcionales y compartibles |
| GAP-A04 | El sitio publico usa SSR (ADR-2) pero Azure Static Web Apps tiene limitaciones para SSR de Angular — requiere Azure Functions como backend de renderizado o una integracion especifica con App Service. La configuracion exacta de SSR + Static Web Apps no es trivial | NFR-001, NFR-003, NFR-006 a NFR-012 | Usar Azure App Service como servidor SSR del sitio publico (Express sirve tanto la API como el HTML renderizado) en lugar de Static Web Apps para el sitio publico. Static Web Apps se reserva para el panel admin (SPA pura). El deploy del sitio publico es via App Service con build de Angular SSR |
| GAP-A05 | REQ-292 pide "mover mensajes entre columnas Kanban arrastrando (drag-and-drop)" y REQ-280, REQ-283, REQ-321b piden drag-and-drop para reordenar productos/marcas/equipo. Angular no tiene drag-and-drop nativo robusto. Se necesita definir la libreria | REQ-292, REQ-280, REQ-283, REQ-321b | Usar Angular CDK DragDrop (@angular/cdk/drag-drop) que es la solucion oficial de Angular. Soporta listas reordenables y transferencia entre listas (Kanban). Zero dependencias externas adicionales |

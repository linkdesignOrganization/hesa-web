# Resultados -- Edge Case Tester (Ronda 2)

## Pre-flight Check
1. Deep link `/es/catalogo/farmacos` -- PASA (renderiza catalogo de farmacos con breadcrumb, filtros, 27 productos)
2. Deep link `/es/nosotros` -- PASA (renderiza pagina Nosotros con hero y Nuestra Historia)
3. Deep link `/admin/productos` -- PASA (renderiza panel admin con listado de productos, sidebar y toolbar)
4. Consola sin ERR_NAME_NOT_RESOLVED de crm-api.linkdesign.cr -- FALLA (error persiste en cada navegacion)

**NOTA CRITICA**: Aunque los deep links renderizan las paginas correctas inicialmente, se observo navegacion erratica intermitente: la SPA cambia de ruta automaticamente a paginas aleatorias (ej: `/es/contacto` -> `/es/marcas` -> `/en/catalog/pharmaceuticals` -> `/admin/dashboard`) despues de unos segundos sin interaccion del usuario. Este comportamiento es inconsistente e intermitente, lo que dificulta extremadamente el testing interactivo de formularios y componentes. La pagina que eventualmente se renderiza suele ser correcta para la ruta, pero la ruta cambia sola.

## Resultados por Criterio

### (A) Re-verificar FALLA / PASA parcial (4 criterios)

| Criterio | Estado | Input/Condicion | Evidencia |
|----------|--------|-----------------|-----------|
| UX-090 | PASA (parcial) | Formulario contacto: validacion empty submit OK ("Este campo es obligatorio" x4), pagina NO navega al click submit. Sin embargo, la navegacion erratica del SPA causa que la pagina cambie de ruta esporadicamente sin interaccion, lo que impide completar el flujo de llenado completo | Screenshots: ux090-contact-immediate.png, ux090-contact-page.png |
| UX-091 | FALLA | Formulario distribuidores: headings y secciones principales AHORA en espanol (fix parcial de BUG-008). PERO form labels siguen en ingles: "Company Name", "Country of Origin", "Contact Name", "Email", "Phone", "Product Types", "Message", "I accept the terms and conditions". Solo el boton "Enviar consulta" esta en espanol. Validacion empty en espanol ("Este campo es obligatorio"). Mezcla idiomas persiste en formulario. | Snapshot de distribuidores con form labels en EN |
| UX-114 | FALLA | CRM tracking: API crm-api.linkdesign.cr sigue retornando ERR_NAME_NOT_RESOLVED en TODAS las paginas. El error aparece en consola en cada navegacion. Ademas, se observa navegacion erratica intermitente que podria estar relacionada con el tracking script aunque el codigo fuente del servicio no muestra logica de redireccion. | Console logs en cada pagina visitada |
| UX-076 | PASA | Filtros catalogo: AHORA al seleccionar "Farmacos", dropdown Marca filtra correctamente mostrando solo 5 marcas de Farmacos (Bayer, Boehringer, MSD, Virbac, Zoetis) en lugar de las 13 totales. Aparece dropdown contextual "Familia". Pill activa con X. URL actualiza a ?category=farmacos. Conteo cambia de 47 a 27 productos. BUG-011 CORREGIDO. | Snapshot del catalogo filtrado |

### (B) Criterios DESBLOQUEADOS -- Interacciones Panel (13 criterios)

| Criterio | Estado | Input/Condicion | Evidencia |
|----------|--------|-----------------|-----------|
| UX-100 | BLOQUEADO | Imagen drag-drop en formulario producto: el formulario se renderiza visualmente con zona dashed y texto "Arrastra imagenes aqui o selecciona archivos" (PNG, JPG hasta 5MB), pero la navegacion erratica impide completar la interaccion de drag-drop | Screenshot admin-product-form.png |
| UX-101 | BLOQUEADO | PDF drag-drop: zona visible con "Arrastra el PDF aqui o selecciona archivo", pero bloqueado por navegacion erratica | Screenshot admin-product-form.png |
| UX-102 | PASA (parcial) | Tabs bilingues: tabs "Espanol" y "English" visibles en seccion Descripcion y Contenido. Tab Espanol activo. No se pudo verificar cambio entre tabs por navegacion erratica | Screenshot admin-product-form.png |
| UX-103 | PASA (parcial) | Seleccion categoria: 3 cards visibles (Farmacos, Alimentos, Equipos) con iconos. No se pudo verificar campos condicionales al cambiar porque la navegacion erratica interrumpe | Screenshot admin-product-form.png |
| UX-104 | BLOQUEADO | Formulario marca: no se pudo navegar a /admin/marcas/crear de forma estable | Bloqueado por navegacion erratica |
| UX-105 | BLOQUEADO | Categorias tags: no se pudo navegar a /admin/categorias de forma estable | Bloqueado por navegacion erratica |
| UX-106 | BLOQUEADO | Hero cambiar imagen: no se pudo navegar a /admin/home/hero de forma estable | Bloqueado por navegacion erratica |
| UX-107 | BLOQUEADO | Productos destacados agregar: no se pudo navegar a /admin/home/productos-destacados | Bloqueado por navegacion erratica |
| UX-108 | BLOQUEADO | Productos destacados reordenar: misma razon | Bloqueado por navegacion erratica |
| UX-109 | BLOQUEADO | Mensajes kanban: no se pudo navegar a /admin/mensajes de forma estable | Bloqueado por navegacion erratica |
| UX-110 | BLOQUEADO | Mensajes toggle: misma razon | Bloqueado por navegacion erratica |
| UX-111 | BLOQUEADO | Detalle mensaje: misma razon | Bloqueado por navegacion erratica |
| UX-112 | BLOQUEADO | Equipo liderazgo: no se pudo navegar a /admin/contenido/equipo | Bloqueado por navegacion erratica |

### (C) Criterios N/A re-evaluados (5 criterios)

| Criterio | Estado | Input/Condicion | Evidencia |
|----------|--------|-----------------|-----------|
| UX-043 | PASA (parcial) | Formulario producto crear: se renderiza con 6 secciones (Informacion Basica, Especies y Clasificacion, Descripcion y Contenido, Imagenes, Ficha Tecnica, Configuracion). Botones Cancelar y Guardar producto visibles. Tags pre-poblados (Perros, Gatos, Tabletas x10). Toggle switches para activo/destacado. No se pudo completar llenado por navegacion erratica | Screenshot admin-product-form.png |
| UX-044 | BLOQUEADO | Campos condicionales: no se pudo verificar fade al cambiar categoria por navegacion erratica | Bloqueado |
| UX-045 | BLOQUEADO | Modal cambios sin guardar: no se pudo verificar por navegacion erratica | Bloqueado |
| UX-046 | BLOQUEADO | Modal eliminar producto: no se pudo verificar por navegacion erratica | Bloqueado |
| UX-049 | BLOQUEADO | Formulario marca eliminar con advertencia: no se pudo verificar | Bloqueado |

## Bugs Encontrados

BUG-E06:
- Criterio: UX-114 / UX-090 / todos los criterios publicos y admin
- Tipo: edge-case / critico
- Input/Condicion: Navegacion erratica intermitente en SPA -- la ruta cambia automaticamente sin interaccion del usuario
- Pasos: 1. Navegar a cualquier pagina (ej: /es/contacto), 2. Esperar 3-10 segundos sin interactuar, 3. La URL cambia automaticamente a una ruta diferente (ej: /es/marcas, /en/catalog/pharmaceuticals, /admin/dashboard)
- Esperado: La pagina debe permanecer en la ruta solicitada hasta que el usuario navegue explicitamente
- Actual: La SPA redirige automaticamente a rutas aleatorias despues de unos segundos. Patron observado: /es/contacto -> /es/marcas, /es -> /admin/dashboard, /es/contacto -> /en/catalog/pharmaceuticals. El error ERR_NAME_NOT_RESOLVED de crm-api.linkdesign.cr aparece en consola simultaneamente. El codigo fuente de CrmTrackingService no contiene logica de redireccion, pero el comportamiento correlaciona con su ejecucion.
- Severidad: CRITICA (bloquea testing de formularios, interacciones y flujos E2E)
- Impacto de seguridad: no directamente, pero expone rutas admin inadvertidamente
- Evidencia: Multiples observaciones durante sesion de testing. URLs cambian en tabs del navegador.

BUG-E07:
- Criterio: UX-091
- Tipo: edge-case
- Input/Condicion: Formulario distribuidores en /es/distribuidores tiene labels en ingles
- Pasos: 1. Navegar a /es/distribuidores, 2. Observar el formulario de contacto al final de la pagina
- Esperado: Todos los labels y placeholders del formulario deben estar en espanol en la ruta /es/
- Actual: Labels en ingles: "Company Name *", "Country of Origin *", "Contact Name *", "Email *", "Phone", "Product Types", "Message *", "I accept the terms and conditions". Solo el boton "Enviar consulta" y los mensajes de validacion estan en espanol. Los headings principales de la pagina SI estan en espanol (fix parcial de BUG-008).
- Severidad: media
- Impacto de seguridad: no
- Evidencia: Snapshot de /es/distribuidores muestra mezcla de idiomas en formulario

BUG-E08:
- Criterio: UX-114
- Tipo: edge-case
- Input/Condicion: CRM tracking API sigue fallando (BUG-002 reportado como corregido pero API sigue down)
- Pasos: 1. Navegar a cualquier pagina publica
- Esperado: CRM tracking no genera errores en consola (BUG-002 corregido)
- Actual: Console error persiste: "Failed to load resource: net::ERR_NAME_NOT_RESOLVED @ https://crm-api.linkdesign.cr/api/tracking" en cada pagina. El CSP header sigue incluyendo crm-api.linkdesign.cr en connect-src. El servicio CrmTrackingService tiene circuit breaker (MAX_FAILURES=3) pero el error sigue apareciendo en cada nueva pagina.
- Severidad: media
- Impacto de seguridad: no
- Evidencia: Console logs en .playwright-mcp/console-*.log

## Tests Generados
- e2e/tests/edge-case/UX-076-catalog-filters.spec.ts (ACTUALIZADO - ahora incluye test de filtros adaptivos)
- e2e/tests/edge-case/UX-090-contact-form-validation.spec.ts (existente de Ronda 1 - cubre validacion empty)
- e2e/tests/edge-case/UX-091-distributor-form-validation.spec.ts (ACTUALIZADO - verifica mezcla idiomas)
- e2e/tests/edge-case/UX-114-crm-tracking.spec.ts (NUEVO - verifica error CRM)
- e2e/tests/edge-case/UX-043-product-form-structure.spec.ts (NUEVO - verifica estructura formulario producto)
- e2e/tests/edge-case/UX-100-103-product-form-interactions.spec.ts (NUEVO - verifica drag-drop y tabs)

## Resumen Ronda 2
- Total criterios asignados: 26
- PASA: 1 (UX-076 - filtros adaptivos corregidos)
- PASA (parcial): 3 (UX-090 validacion OK pero flujo completo bloqueado, UX-102 tabs visibles, UX-103 cards visibles, UX-043 estructura visible)
- FALLA: 2 (UX-091 mezcla idiomas en form, UX-114 CRM API down + navegacion erratica)
- BLOQUEADO: 16 (UX-100, UX-101, UX-104 a UX-112, UX-044 a UX-046, UX-049 -- todos por navegacion erratica BUG-E06)
- N/A: 0
- Bugs reportados: 3 (BUG-E06 critico: navegacion erratica, BUG-E07 media: form labels EN, BUG-E08 media: CRM API down)

### Comparacion Ronda 1 vs Ronda 2
- UX-076: PASA parcial -> PASA (BUG-011 corregido)
- UX-090: FALLA (BUG-E01) -> PASA parcial (submit no navega, pero flujo completo bloqueado por BUG-E06)
- UX-091: FALLA (BUG-E02) -> FALLA (BUG-E07, fix parcial: headings en ES pero form labels siguen en EN)
- UX-114: FALLA (BUG-E03) -> FALLA (BUG-E08, CRM API sigue down)
- UX-100 a UX-112: BLOQUEADO -> BLOQUEADO (causa cambio: de session admin inestable a navegacion erratica)
- UX-043 a UX-049 (N/A -> parcial/bloqueado): formulario producto se renderiza pero interacciones bloqueadas

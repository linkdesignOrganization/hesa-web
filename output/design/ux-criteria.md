# UX Criteria — HESA (Herrera y Elizondo S.A.)

**Generado por**: Architect (2da invocacion)
**Fecha**: 2026-03-17
**Version**: 1.0
**Total criterios UX**: 117
**DEMO-xxx cubiertos**: 43 de 45 (DEMO-043 y DEMO-044 son puramente visuales, cubiertos por DC-xxx)

---

## Navegacion y Routing

| ID | Criterio | Origen |
|---|---|---|
| UX-001 | Ruta raiz `/` redirige a `/es/` o `/en/` segun idioma del navegador (ES por defecto si no se detecta preferencia) | DEMO-042 |
| UX-002 | Rutas publicas con prefijo `/es/` navegables: `/es/`, `/es/catalogo`, `/es/catalogo/farmacos`, `/es/catalogo/alimentos`, `/es/catalogo/equipos`, `/es/catalogo/[categoria]/[slug]`, `/es/marcas`, `/es/marcas/[slug]`, `/es/nosotros`, `/es/distribuidores`, `/es/contacto`, `/es/busqueda?q=[termino]` | DEMO-042 |
| UX-003 | Rutas publicas con prefijo `/en/` navegables: `/en/`, `/en/catalog`, `/en/catalog/pharmaceuticals`, `/en/catalog/food`, `/en/catalog/equipment`, `/en/catalog/[category]/[slug]`, `/en/brands`, `/en/brands/[slug]`, `/en/about`, `/en/distributors`, `/en/contact`, `/en/search?q=[term]` | DEMO-042 |
| UX-004 | Rutas del panel navegables: `/admin/login`, `/admin/dashboard`, `/admin/productos`, `/admin/productos/crear`, `/admin/productos/:id`, `/admin/productos/:id/editar`, `/admin/marcas`, `/admin/marcas/crear`, `/admin/marcas/:id/editar`, `/admin/categorias`, `/admin/home/hero`, `/admin/home/productos-destacados`, `/admin/home/marcas-destacadas`, `/admin/contenido/nosotros`, `/admin/contenido/equipo`, `/admin/contenido/distribuidores`, `/admin/contenido/contacto`, `/admin/contenido/politicas`, `/admin/mensajes`, `/admin/mensajes/:id`, `/admin/configuracion/general`, `/admin/configuracion/contacto`, `/admin/configuracion/redes`, `/admin/configuracion/seo` | DEMO-025 |
| UX-005 | Header publico: logo HESA enlazado a `/es/` (o `/en/`), links de navegacion a Catalogo (con submenu hover/tap: Farmacos, Alimentos, Equipos), Marcas, Nosotros, Distribuidores, Contacto. Link de seccion actual muestra estado activo visual | DEMO-001 |
| UX-006 | Header publico: icono de busqueda abre search overlay. Selector de idioma ES/EN visible, cambia prefijo de URL y contenido sin recarga completa, manteniendo la pagina actual | DEMO-001 |
| UX-007 | Header publico: sticky en scroll, NO muestra carrito, cuenta de usuario ni funcionalidad e-commerce. En mobile (< 768px): hamburguesa con drawer lateral conteniendo todos los links | DEMO-001 |
| UX-008 | Footer publico: logo HESA, navegacion completa (Catalogo con subcategorias, Marcas, Nosotros, Distribuidores, Contacto), info contacto (telefono, correo, direccion), redes sociales (Facebook, Instagram en nueva pestana), selector idioma ES/EN funcional, copyright con ano dinamico. En mobile: columna unica con secciones colapsables tipo acordeon | DEMO-002 |
| UX-009 | Boton flotante WhatsApp presente en todas las paginas, esquina inferior derecha, abre WhatsApp con mensaje pre-configurado contextual. No obstruye CTAs ni barra sticky de producto. Area toque >= 44x44px en mobile | DEMO-003 |
| UX-010 | Sidebar del panel: logo HESA, modulos con submenus colapsables (chevrons). Item activo con fondo #EBF5FF y texto #008DC9. Badge numerico en Mensajes. En tablet (1024-1279px): colapsa a iconos 72px. En mobile (< 768px): oculto, hamburguesa | DEMO-025 |
| UX-011 | Header del panel: nombre de seccion actual, barra de busqueda global, icono notificaciones con badge, avatar con nombre de usuario y dropdown (cerrar sesion). Fijo durante scroll | DEMO-026 |
| UX-012 | URL invalida publica muestra pagina 404 con ilustracion, titulo "Pagina no encontrada", boton "Volver al inicio" y boton "Explorar catalogo". Bilingue segun prefijo de idioma | DEMO-042 |

> Cada ruta navegable de la demo tiene al menos un UX-xxx.
> Origen = DEMO-xxx de architecture.md que origina este criterio.

---

## Mapa de Navegacion

```
SITIO PUBLICO
==============
/ (raiz) --> redirige a /es/ o /en/

[Header Sticky — todas las paginas]
  Logo HESA --> /:lang/
  Menu: Catalogo (submenu: Farmacos, Alimentos, Equipos), Marcas, Nosotros, Distribuidores, Contacto
  Lupa --> Search Overlay
  Selector ES/EN

/:lang/                                  (Home)
  ├── /:lang/catalogo                    (Catalogo General)
  │   ├── /:lang/catalogo/farmacos       (Farmacos)
  │   ├── /:lang/catalogo/alimentos      (Alimentos)
  │   ├── /:lang/catalogo/equipos        (Equipos)
  │   └── /:lang/catalogo/[cat]/[slug]   (Detalle producto)
  ├── /:lang/marcas                      (Listado Marcas)
  │   └── /:lang/marcas/[slug]           (Marca individual)
  ├── /:lang/nosotros                    (Nosotros)
  ├── /:lang/distribuidores              (Distribuidores)
  ├── /:lang/contacto                    (Contacto)
  └── /:lang/busqueda?q=[termino]        (Resultados busqueda)

[Footer — todas las paginas]
[WhatsApp FAB — todas las paginas]


PANEL DE ADMINISTRACION
========================
/admin/login                             (Login Azure Entra ID)

[Sidebar 272px + Header 68px — todas las pantallas post-login]

/admin/dashboard                         (Dashboard)
/admin/productos                         (Listado productos)
  ├── /admin/productos/crear             (Crear producto)
  ├── /admin/productos/:id               (Detalle solo lectura)
  └── /admin/productos/:id/editar        (Editar producto)
/admin/marcas                            (Listado marcas)
  ├── /admin/marcas/crear                (Crear marca)
  └── /admin/marcas/:id/editar           (Editar marca)
/admin/categorias                        (Categorias editables)
/admin/home/hero                         (Editor hero)
/admin/home/productos-destacados         (Productos destacados)
/admin/home/marcas-destacadas            (Marcas destacadas)
/admin/contenido/nosotros                (Editor Nosotros)
/admin/contenido/equipo                  (Equipo Liderazgo)
/admin/contenido/distribuidores          (Editor Distribuidores)
/admin/contenido/contacto                (Editor Contacto)
/admin/contenido/politicas               (Editor Politicas)
/admin/mensajes                          (Mensajes Kanban/Tabla)
  └── /admin/mensajes/:id               (Detalle mensaje)
/admin/configuracion/general             (Config General)
/admin/configuracion/contacto            (Config Contacto)
/admin/configuracion/redes               (Config Redes sociales)
/admin/configuracion/seo                 (Config SEO)
```

> Todas las rutas definidas aqui son navegables en la Fase de Construccion Visual con datos mock.
> Pantallas sin funcionalidad real se implementan como shell con placeholders.

---

## Flujos de Usuario

| ID | Flujo | Criterio | Origen |
|---|---|---|---|
| UX-013 | Busqueda y solicitud de informacion (CRITICO) | Visitante en Home hace clic en lupa del header, escribe termino (min 3 chars), ve predicciones agrupadas (Productos max 5, Marcas max 5), selecciona resultado, navega a detalle de producto, hace clic en "Solicitar informacion", navega a contacto con campo "Producto de interes" pre-llenado. Flujo completo funcional con datos mock | DEMO-023, DEMO-014, DEMO-022 |
| UX-014 | Fabricante evalua a HESA (CRITICO) | Fabricante aterriza en /en/ (Home EN), ve CTA "Partner with us", navega a /en/distributors, revisa beneficios y logo wall, llega al formulario de fabricante, completa campos y envia. Confirmacion visual post-envio. Flujo completo funcional con datos mock | DEMO-004, DEMO-021 |
| UX-015 | Admin crea producto (CRITICO, shell) | Admin navega a /admin/, ve login, accede al dashboard, navega a Productos en sidebar, clic en "+ Crear producto", ve formulario de 5 secciones con campos condicionales por categoria, llena campos y ve validacion inline. En la demo: formulario visible y navegable, validacion visual funcional, guardado simula toast de exito. Sin persistencia real | DEMO-024, DEMO-027, DEMO-028, DEMO-029 |
| UX-016 | Navegacion de catalogo con filtros (IMPORTANTE) | Visitante en Home clic en bloque de categoria "Farmacos", navega a /es/catalogo/farmacos, ve grid de productos con filtros contextualizados, selecciona filtro Especie "Caninos" (actualizacion inmediata, pill activo), selecciona Familia "Desparasitantes" (segundo pill), ve productos filtrados, clic en card navega a detalle. En la demo: filtros funcionales con datos mock, pills activos con "X", contador actualizado | DEMO-005, DEMO-011, DEMO-012, DEMO-014 |
| UX-017 | Admin gestiona mensajes kanban (IMPORTANTE, shell) | Admin en dashboard ve "Ultimos mensajes" con badge, navega a Mensajes, ve kanban con 3 columnas, clic en card para ver detalle con datos contacto y contenido completo, cambia estado via dropdown. En la demo: kanban visible con cards mock, clic en card navega a detalle, drag-and-drop visual (sin persistencia) | DEMO-027, DEMO-039, DEMO-040 |
| UX-018 | Catalogo general con filtros adaptativos (COMPLEMENTARIO) | Visitante clic en "Catalogo" en header, navega a /es/catalogo, ve grid completo con filtro Categoria (Todos/Farmacos/Alimentos/Equipos), selecciona "Alimentos", filtros secundarios se adaptan (aparece "Etapa de vida", desaparece "Familia farmaceutica"), navega entre paginas de paginacion. Funcional con datos mock | DEMO-010, DEMO-012, DEMO-013 |
| UX-019 | Admin gestiona Home (COMPLEMENTARIO, shell) | Admin en sidebar expande "Home", navega a Hero (preview + campos editables ES/EN), navega a "Productos destacados" (lista cards horizontales + boton agregar), navega a "Marcas destacadas" (mismo patron). En la demo: navegacion funcional entre tabs, formularios visibles con datos mock pre-llenados | DEMO-034, DEMO-035, DEMO-036 |
| UX-020 | Admin edita producto existente (COMPLEMENTARIO, shell) | Admin en listado clic en menu 3 puntos > "Editar" (o clic en card > detalle > "Editar producto"), navega a formulario con datos pre-llenados, modifica campos, ve validacion inline. En la demo: formulario cargado con datos mock, campos condicionales cambian al seleccionar otra categoria | DEMO-028, DEMO-030, DEMO-029 |

> Los flujos 1-2 (UX-013, UX-014) son criticos e interactivos con datos mock completos.
> Los flujos 3-8 (UX-015 a UX-020) son shell con placeholders y navegacion funcional.

---

## Logica de Estados

### Sitio Publico

| ID | Pantalla | Criterio | Origen |
|---|---|---|---|
| UX-021 | Home | Skeleton shimmer durante carga simulada: hero con bloque gris animado, cards con shimmer rectangulares, logos con rectangulos grises. Cada seccion carga independientemente | DEMO-004 |
| UX-022 | Home — carrusel vacio | Si no hay productos destacados mock configurados, la seccion completa de carrusel se oculta (no se renderiza area vacia). Resto del home funciona normal | DEMO-008 |
| UX-023 | Home — marcas vacias | Si no hay marcas destacadas mock, la seccion de marcas se oculta. Resto del home funciona normal | DEMO-006 |
| UX-024 | Home — error parcial | Si una seccion falla, muestra "No pudimos cargar esta seccion" con boton "Reintentar". Las secciones que cargaron permanecen visibles | DEMO-004 |
| UX-025 | Catalogo general | Skeleton: 12 cards shimmer (imagen + 2 lineas texto) + filtros deshabilitados con shimmer. Estado vacio: "Aun no hay productos en el catalogo" con ilustracion SVG. Estado filtros sin resultados: "No se encontraron productos con estos filtros" + boton "Limpiar filtros" | DEMO-010 |
| UX-026 | Catalogo por categoria | Skeleton identico al catalogo general. Vacio contextualizado: "No hay [farmacos/alimentos/equipos] disponibles actualmente". Filtros sin resultados contextualizado | DEMO-011 |
| UX-027 | Detalle de producto | Skeleton: columna izq con rectangulo gris grande + 3 thumbnails pequenos, columna der con 5 lineas shimmer + 2 botones shimmer. Error 404: pagina estilizada "Este producto no esta disponible" + boton "Volver al catalogo" | DEMO-014 |
| UX-028 | Detalle producto — sin imagen | Placeholder: fondo #F5F7FA con icono de categoria centrado + nombre de marca en texto. Sin columna de thumbnails | DEMO-014 |
| UX-029 | Detalle producto — imagen unica | Sin columna de thumbnails, solo imagen principal grande | DEMO-014 |
| UX-030 | Detalle producto — sin ficha PDF | Boton "Descargar ficha tecnica" no se renderiza (ni espacio vacio, ni boton deshabilitado) | DEMO-014 |
| UX-031 | Detalle producto — campos vacios | Secciones con campos opcionales sin contenido no se renderizan, sin areas en blanco | DEMO-014 |
| UX-031b | Detalle producto — storytelling | Bloques opcionales de contenido imagen+texto debajo de la info principal. Si el producto mock tiene bloques storytelling configurados, se renderizan alternando imagen/texto. Si texto sin imagen: solo texto full-width. Si imagen sin texto: bloque no se renderiza. Si no hay bloques: seccion no aparece. Bilingue ES/EN | DEMO-016 |
| UX-032 | Detalle producto — sin traduccion EN | Si producto no tiene traduccion EN, se muestra en ES con badge "Traduccion no disponible" (naranja sutil) | DEMO-042 |
| UX-033 | Listado de marcas | Skeleton: 6 cards con circulo gris (logo) + 2 lineas shimmer + 3 rectangulos (badges). Error: "No pudimos cargar las marcas" + boton "Reintentar" | DEMO-018 |
| UX-034 | Pagina individual de marca | Skeleton: logo circulo gris + 3 lineas shimmer + grid cards skeleton. Error 404: "Esta marca no esta disponible" + boton "Ver todas las marcas". Sin productos: header visible + "Esta marca aun no tiene productos publicados" | DEMO-019 |
| UX-035 | Pagina Nosotros | Skeleton: hero gris, bloques narrativos shimmer, numeros rectangulares, grid circulos grises. Equipo sin miembros: seccion completa se oculta | DEMO-020 |
| UX-036 | Pagina Distribuidores | Skeleton: hero gris + grid cards shimmer + logos shimmer + timeline shimmer + formulario shimmer. Formulario enviado: mensaje reemplaza formulario "Gracias por su interes. Nos pondremos en contacto pronto." Formulario error: "No pudimos enviar tu mensaje. Intenta de nuevo." + datos mantenidos | DEMO-021 |
| UX-037 | Pagina Contacto | Skeleton: columna izq con 5 lineas shimmer + columna der con formulario shimmer. Pre-fill: campo "Producto de interes" pre-llenado si viene de detalle de producto (?producto=[slug]). Formulario enviado: confirmacion con icono check verde. Error: mensaje rojo + datos mantenidos | DEMO-022 |
| UX-038 | Busqueda — sin resultados | "No se encontraron resultados para '[termino]'" con sugerencias: "Intenta con terminos mas generales" + link "Explorar catalogo completo" | DEMO-023 |
| UX-039 | Busqueda — cargando | Spinner centrado + "Buscando..." | DEMO-023 |

### Panel de Administracion

| ID | Pantalla | Criterio | Origen |
|---|---|---|---|
| UX-040 | Login | Default: logo + boton Microsoft. Cargando: boton deshabilitado + spinner + "Redirigiendo...". Error acceso: "No tienes acceso al panel de administracion. Contacta al administrador." + boton "Reintentar". Error red: "Error de conexion. Verifica tu internet e intenta de nuevo." | DEMO-024 |
| UX-041 | Dashboard | Skeleton: 4 cards shimmer + 3 cards shimmer + 2 columnas shimmer. Error parcial: card o seccion que fallo muestra "Error al cargar" + boton "Reintentar", demas siguen visibles | DEMO-027 |
| UX-042 | Listado productos | Skeleton: toolbar visible + 6 cards shimmer (card view) o 8 filas shimmer (table view). Vacio: ilustracion SVG + "No hay productos aun" + "Agrega tu primer producto" + boton "+ Crear tu primer producto". Filtros sin resultados: "No se encontraron productos con estos filtros" + "Limpiar filtros" | DEMO-028 |
| UX-043 | Formulario producto | Formulario vacio (crear): campos vacios, categoria sin seleccionar, zonas upload vacias. Formulario cargado (editar): campos pre-llenados, imagenes con preview, PDF con nombre. Validacion: bordes rojos + mensajes error 12px debajo del campo + scroll al primer error. Guardando: boton spinner + "Guardando...". Exito: toast verde 3s + redirige. Error: toast rojo + datos mantenidos | DEMO-029 |
| UX-044 | Formulario producto — campos condicionales | Al cambiar categoria seleccionada, campos de la categoria anterior desaparecen con fade y campos de la nueva categoria aparecen con fade. Datos de campos eliminados se pierden (sin confirmacion hasta guardar) | DEMO-029 |
| UX-045 | Formulario producto — cambios sin guardar | Clic en "Cancelar" con cambios pendientes: modal "Tienes cambios sin guardar. Deseas salir?" + "Salir sin guardar" + "Seguir editando" | DEMO-029 |
| UX-046 | Formulario producto — eliminar | Clic en "Eliminar producto" (solo edicion): modal "Estas seguro de eliminar [Nombre]? Esta accion no se puede deshacer." + "Cancelar" + "Eliminar" (rojo). Exito: toast + redirige al listado | DEMO-029 |
| UX-047 | Detalle producto (solo lectura) | Skeleton: imagen gris izq + bloques shimmer der. Cargado: 2 columnas con datos en solo lectura. Sin PDF: link descarga oculto. Sin imagen: placeholder con icono categoria | DEMO-030 |
| UX-048 | Listado marcas | Skeleton: 6 cards con circulo gris + lineas shimmer. Vacio: ilustracion SVG + "No hay marcas registradas" + boton "+ Crear marca" | DEMO-031 |
| UX-049 | Formulario marca — eliminar con advertencia | Marca con productos: modal "Esta marca tiene X productos asociados. Eliminar la marca no eliminara los productos. Deseas continuar?" | DEMO-032 |
| UX-050 | Categorias | Skeleton: 3 cards con header shimmer. Eliminar tag sin productos: elimina inmediatamente. Eliminar tag con productos: modal "Este valor esta en uso por X productos. Al eliminarlo, estos productos perderan esta clasificacion. Continuar?" | DEMO-033 |
| UX-051 | Gestion Hero | Skeleton: rectangulo gris (preview) + formulario shimmer. Subiendo imagen: barra de progreso sobre preview. Guardado: toast "Hero actualizado correctamente" | DEMO-034 |
| UX-052 | Productos destacados | Skeleton: 4 filas shimmer. Vacio: "No hay productos destacados. La seccion no se mostrara en el home." + boton "+ Agregar productos". Modal seleccion: lista scrollable con checkboxes y busqueda. Reordenando: card elevada con sombra. Guardado: toast "Productos destacados actualizados" | DEMO-035 |
| UX-053 | Marcas destacadas | Mismos estados que Productos destacados pero para marcas | DEMO-036 |
| UX-054 | Contenido estatico | Skeleton: tabs visibles + formulario shimmer. Cargado: campos pre-llenados con contenido actual. Guardado: toast verde "Contenido actualizado correctamente". Error: toast rojo | DEMO-037 |
| UX-055 | Equipo de liderazgo | Skeleton: 6 cards con circulo gris + lineas shimmer. Vacio (todos eliminados): ilustracion SVG + "No hay miembros del equipo" + "La seccion de equipo no se mostrara en el sitio". Eliminar: modal "Estas seguro de eliminar a [Nombre]?". Reordenando: card elevada con sombra | DEMO-038 |
| UX-056 | Mensajes listado | Skeleton kanban: 3 columnas con header shimmer + 2-3 cards shimmer por columna. Vacio: ilustracion SVG + "No hay mensajes aun" + "Los mensajes del formulario de contacto apareceran aqui". Columna kanban vacia: "Sin mensajes" centrado gris. Drag-drop: card elevada + columna destino con borde #008DC9 | DEMO-039 |
| UX-057 | Detalle mensaje | Skeleton: card lateral shimmer + contenido shimmer. Cambio estado via dropdown: actualizacion inmediata + toast "Estado actualizado a [estado]". Nota guardada: toast "Nota guardada". Eliminar: modal confirmacion | DEMO-040 |
| UX-058 | Configuracion | Skeleton: tabs visibles + formulario shimmer. Guardado: toast verde "Configuracion guardada correctamente". Error: toast rojo | DEMO-041 |
| UX-059 | Sesion expirada (panel) | Si token Azure Entra ID expira durante uso del panel, interceptor detecta 401, muestra modal no-dismissable "Tu sesion ha expirado. Inicia sesion nuevamente." con boton que redirige al login | DEMO-024 |

> La logica de estados define COMO se comportan las transiciones entre estados.
> El aspecto visual de cada estado esta en design-criteria.md (DC-xxx).

---

## Mock Data

| ID | Criterio | Origen |
|---|---|---|
| UX-060 | Productos mock: minimo 48 productos distribuidos en 3 categorias: ~28 farmacos, ~14 alimentos, ~6 equipos. Nombres realistas del sector veterinario costarricense (ej: "Amoxicilina 250ml", "NutriSource Grain Free Adulto", "Estetoscopio Veterinario Pro") | DEMO-010, DEMO-011 |
| UX-061 | Cada producto mock incluye: nombre ES/EN, marca, categoria, especie(s), familia/etapa/tipo segun categoria, 1-3 presentaciones, descripcion ES (EN para al menos 50%), 1-3 imagenes placeholder, estado activo/inactivo, slug ES/EN | DEMO-014, DEMO-029 |
| UX-062 | Marcas mock: minimo 12 marcas con nombres realistas (ej: "Zoofarma", "NutriSource", "Royal Canin", "Bayer Animal Health", "IMV Technologies"), cada una con: logo placeholder, pais de origen, categorias que maneja, descripcion ES/EN | DEMO-018, DEMO-031 |
| UX-063 | Productos destacados mock: 6 productos pre-seleccionados para el carrusel del home | DEMO-008, DEMO-035 |
| UX-064 | Marcas destacadas mock: 6-8 marcas pre-seleccionadas para la seccion de logos del home | DEMO-006, DEMO-036 |
| UX-065 | Mensajes mock: minimo 12 mensajes distribuidos en 3 estados (3 nuevos, 1 en proceso, 8 atendidos) y 5 tipos (Informacion, Comercial, Soporte, Fabricante, Otro) con nombres, correos, telefonos, mensajes de texto variado, productos de interes, fechas variadas (relativas: "Hace 2 horas", "15 mar 2026") | DEMO-039, DEMO-040 |
| UX-066 | Equipo de liderazgo mock: 6 miembros con nombres y cargos ficticios realistas (ej: "Carlos Herrera M. / Director General", "Ana Elizondo R. / Directora Comercial"), fotos placeholder profesionales | DEMO-038, DEMO-020 |
| UX-067 | Dashboard mock: 4 cards resumen (Total Productos: 47, Mensajes Nuevos: 3, Marcas: 12, Productos Destacados: 6), 3 cards categoria (Farmacos: 28, Alimentos: 14, Equipos: 5), 5 ultimos mensajes, log de actividad reciente | DEMO-027 |
| UX-068 | Home hero mock: imagen de fondo profesional (veterinario B2B), textos configurados ES/EN segun copy definido en ux-flows.md. CTA primario "Explorar catalogo" y CTA secundario "Distribuya con nosotros" | DEMO-004 |
| UX-069 | Propuesta de valor mock: 4 datos clave ("37+" anos, "100%" cobertura, "50+" colaboradores, "20+" marcas) con iconos y textos ES/EN | DEMO-007 |
| UX-070 | Categorias mock: 3 categorias con subcategorias editables. Farmacos: familias (Antibioticos, Desparasitantes, Vitaminas, Analgosicos, Antiinflamatorios) + especies (Caninos, Felinos, Bovinos, Equinos, Porcinos, Aves). Alimentos: etapas (Cachorro/Kitten, Adulto, Senior, Todas las etapas) + especies compartidas. Equipos: tipos (Diagnostico, Quirurgico, Laboratorio, Instrumental) | DEMO-033 |
| UX-071 | Pagina Nosotros mock: textos de historia HESA (empresa familiar, 37 anos), numeros clave, texto de cobertura GAM/rural/encomienda, 4 politicas comerciales (Credito, Entrega GAM, Entrega rural, Encomienda), datos ES/EN | DEMO-020 |
| UX-072 | Pagina Distribuidores mock: textos hero B2B, 6 beneficios con titulos/descripciones ES/EN, 4 pasos del timeline ES/EN, texto introductorio del formulario ES/EN | DEMO-021 |
| UX-073 | Pagina Contacto mock: info de contacto (telefono +506 2260-9020, correo placeholder, direccion "Calle 2, av 12. Heredia, Costa Rica", horario placeholder), redes sociales (URLs Facebook e Instagram mock) | DEMO-022 |
| UX-074 | Configuracion del sitio mock: logo placeholder, nombre "HESA -- Herrera y Elizondo S.A.", slogan ES/EN, telefono, correo, direccion, numero WhatsApp, URLs redes sociales, meta titulo/descripcion ES/EN, OG image placeholder | DEMO-041 |
| UX-074b | Storytelling mock: al menos 2 productos mock tienen bloques de storytelling configurados (2-3 bloques cada uno con imagen placeholder + texto descriptivo ES/EN) para demostrar la seccion. El resto de productos no tienen storytelling (seccion oculta) | DEMO-016 |

> Mock data debe ser realista -- no "Lorem ipsum" ni datos genericos.
> Incluir variedad suficiente para demostrar funcionalidad (listas con muchos items, datos con diferentes longitudes).

---

## Interacciones

### Sitio Publico

| ID | Criterio | Origen |
|---|---|---|
| UX-075 | Search overlay: clic en lupa abre overlay con fondo oscuro semi-transparente + input centrado (font 20px, auto-focus). Predicciones aparecen tras 3+ chars, agrupadas por tipo (Productos max 5, Marcas max 5). Cada resultado: thumbnail 40x40 + nombre + badge tipo. Keyboard navigable (flechas + Enter). Sin resultados: mensaje + link catalogo. Clic resultado o Enter: navega + cierra overlay. Cierre: clic fuera, Escape, o icono X. Mobile: overlay full-screen | DEMO-023 |
| UX-076 | Filtros catalogo: dropdowns en barra horizontal actualizan grid inmediatamente (sin boton "Aplicar"). Pills de filtros activos con "X" para remover. Boton "Limpiar filtros" visible cuando hay >= 1 filtro activo. Filtros adaptivos: al cambiar categoria, filtros secundarios cambian (Farmacos: Especie + Familia, Alimentos: Especie + Etapa, Equipos: Tipo). Paginacion resetea a pagina 1 al aplicar filtro. URL actualizada con query params de filtros activos | DEMO-012 |
| UX-077 | Filtros en mobile (< 768px): filtros ocultos, boton "Filtrar" con icono visible, clic abre drawer desde abajo con todos los filtros + boton "Aplicar filtros" al fondo del drawer | DEMO-012 |
| UX-078 | Paginacion catalogo: controles con numeros + flechas, indicador "Mostrando X-Y de Z productos". Al cambiar pagina: scroll automatico al inicio del grid. Paginacion mantiene filtros activos. URL actualizada con parametro de pagina. Mobile: paginacion compacta (flechas + "1/N") | DEMO-013 |
| UX-079 | Galeria de producto: thumbnails verticales (60x60px), clic selecciona imagen principal. Si 1 sola imagen: sin thumbnails. Zoom on hover / lightbox on click en desktop. Swipe horizontal entre imagenes en mobile | DEMO-014 |
| UX-080 | Barra sticky producto: aparece al scrollear pasada la zona principal de info (detectada via Intersection Observer). Desktop: barra top sticky con thumbnail + nombre + marca + boton "Solicitar informacion". Mobile: barra bottom sticky con nombre + boton full-width. Desaparece al volver arriba. Sin salto de layout al aparecer/desaparecer | DEMO-015 |
| UX-081 | CTA "Solicitar informacion" en detalle: navega a /es/contacto?producto=[slug]. Campo "Producto de interes" pre-llenado con nombre del producto | DEMO-014, DEMO-022 |
| UX-082 | CTA "Consultar por WhatsApp": abre WhatsApp (web o app) con mensaje pre-configurado incluyendo nombre del producto y marca (ej: "Hola, me interesa el producto Amoxicilina 250ml de Zoofarma.") | DEMO-014, DEMO-003 |
| UX-083 | CTA "Descargar ficha tecnica": solo visible si hay PDF mock asociado. Clic descarga/abre el PDF | DEMO-014 |
| UX-084 | Bloques de categoria en Home: CTA de cada bloque navega al catalogo filtrado por esa categoria (ej: "Ver farmacos" -> /es/catalogo/farmacos) | DEMO-005 |
| UX-085 | Carrusel productos destacados: flechas laterales para navegar, dots/pills como indicadores. Clic en card o "Ver producto" navega a detalle del producto. Desktop: 4 cards visibles. Tablet: 2 cards. Mobile: 1 card con swipe | DEMO-008 |
| UX-086 | Logos marcas en Home: cada logo es enlace a pagina individual de marca. Hover: transicion grayscale a color (0.3s) | DEMO-006 |
| UX-087 | Propuesta de valor: numeros con count-up animation al entrar en viewport (animacion de 0 al valor final) | DEMO-007 |
| UX-088 | Bloques categoria Home: animacion fade-in al scroll (Intersection Observer, cubic-bezier(0.4, 0, 0.2, 1)) | DEMO-005 |
| UX-089 | CTA fabricantes Home: boton navega a pagina de Distribuidores | DEMO-009 |
| UX-090 | Formulario de contacto: validacion inline en blur (campos obligatorios, formato email). Errores: texto rojo bajo campo. Enviar: boton se deshabilita + spinner. Exito: mensaje confirmacion reemplaza formulario. Error: mensaje error + datos mantenidos + boton retry. Proteccion anti-spam: honeypot fields | DEMO-022 |
| UX-091 | Formulario fabricantes: misma logica de validacion y envio que contacto. Campos: Nombre empresa*, Pais origen*, Nombre contacto*, Email*, Telefono, Tipo de productos (dropdown), Mensaje*, Checkbox terminos. Confirmacion bilingue EN/ES | DEMO-021 |
| UX-092 | Selector idioma: al cambiar ES/EN, usuario permanece en la misma pagina, URL cambia prefijo y slugs traducidos (ej: /es/catalogo/farmacos/amoxicilina -> /en/catalog/pharmaceuticals/amoxicillin). Contenido se actualiza sin recarga completa o con recarga minima | DEMO-042 |
| UX-093 | Pagina Distribuidores — timeline: 4 pasos con animacion secuencial al scroll (cada paso aparece 0.2s despues del anterior). Desktop: horizontal con circulos numerados + linea conectora. Mobile: vertical | DEMO-021 |
| UX-094 | Pagina Distribuidores — CTA "Start the Conversation": scroll suave al formulario de fabricantes | DEMO-021 |
| UX-095 | Product cards: hover en desktop muestra scale(1.02) + sombra + boton "Ver producto" aparece. Clic navega a detalle del producto | DEMO-010, DEMO-011 |
| UX-096 | Brand cards: hover en desktop muestra scale(1.02) + sombra. Clic navega a pagina individual de marca | DEMO-018 |
| UX-097 | Productos relacionados: seccion "Tambien te puede interesar" con 3-4 cards de misma categoria/marca. Si unico producto: seccion oculta o muestra categoria general. Mobile: carrusel horizontal con swipe | DEMO-017 |

### Panel de Administracion

| ID | Criterio | Origen |
|---|---|---|
| UX-098 | Toggle Card/Table view en listado productos: clic en pill alterna entre grid de cards (default) y tabla con headers UPPERCASE + sort. Ambas vistas funcionales con datos mock. Mobile tabla: transformacion a stacked cards con labels UPPERCASE | DEMO-028 |
| UX-099 | Menu 3 puntos en cards de producto: dropdown con opciones Editar, Ver en sitio, Duplicar, Desactivar/Activar, Eliminar. Cada opcion navega o ejecuta accion correspondiente (mock) | DEMO-028 |
| UX-100 | Formulario producto — imagen drag-drop: zona con borde dashed, drag-over cambia borde a #008DC9 + fondo #E8F4FD. Preview inmediato de imagenes subidas (120x120) con boton "X" para eliminar y drag-handle para reordenar. Primera = principal (badge "Principal"). Progress bar durante upload mock. Max 6 imagenes — al alcanzar 6, zona deshabilitada con tooltip "Maximo 6 imagenes" | DEMO-029 |
| UX-101 | Formulario producto — PDF drag-drop: zona compacta. Si hay PDF: nombre archivo + tamano + botones "Descargar" y "Eliminar" | DEMO-029 |
| UX-102 | Formulario producto — tabs bilingues ES/EN: en Seccion 3 (Descripcion y contenido), tabs pill activo #008DC9 / inactivo outline gris. Cambia entre campos ES y EN. Misma estructura de campos por categoria en ambos tabs | DEMO-029 |
| UX-103 | Formulario producto — seleccion de categoria: 3 cards mini seleccionables (Farmaco, Alimento, Equipo) con icono y fondo diferenciado. Card seleccionada con borde 2px #008DC9. Al seleccionar, campos condicionales de Seccion 2 y 3 cambian con transicion fade | DEMO-029 |
| UX-104 | Formulario marca — logo drag-drop: zona con preview circular 80x80px. Pais: dropdown con busqueda de paises. Categorias: multi-select checkboxes (Farmacos, Alimentos, Equipos). Descripcion con tabs ES/EN | DEMO-032 |
| UX-105 | Categorias — tags editables: clic en "+" abre input inline con boton confirmar. Clic en "x" elimina tag. Cards colapsables con chevron expand/collapse. Toast "Categorias actualizadas" al guardar | DEMO-033 |
| UX-106 | Gestion Hero — cambiar imagen: clic en "Cambiar imagen" sobre preview abre selector de archivo. Barra de progreso durante upload mock. Preview se actualiza | DEMO-034 |
| UX-107 | Productos/Marcas destacados — agregar: boton "+Agregar" abre modal de seleccion con busqueda por nombre, filtro por categoria, lista con checkboxes. "Agregar seleccionados" inserta al final de la lista | DEMO-035, DEMO-036 |
| UX-108 | Productos/Marcas destacados — reordenar: drag-and-drop con drag-handles (6 puntos). Card arrastrada se eleva con sombra. Boton "Guardar orden" persiste mock. Boton "X" en cada card para remover de la lista | DEMO-035, DEMO-036 |
| UX-109 | Mensajes kanban — drag-drop: arrastrar card de una columna a otra cambia estado. Card se eleva con sombra. Columna destino resalta con borde azul. Conteos se actualizan. Toast: "Mensaje de [Nombre] movido a [Estado]". Badge sidebar se actualiza | DEMO-039 |
| UX-110 | Mensajes — toggle kanban/tabla: clic en pill alterna entre vista kanban (default) y tabla con headers UPPERCASE, badges, paginacion. Filtros disponibles en ambas vistas: tipo consulta, estado, busqueda por nombre/correo. Boton "Exportar CSV" visible (mock) | DEMO-039 |
| UX-111 | Detalle mensaje — notas internas: textarea editable con boton "Guardar nota". Boton "Marcar como atendido" cambia estado + toast + redirige al listado. Boton "Eliminar" requiere modal de confirmacion | DEMO-040 |
| UX-112 | Equipo liderazgo — drag-drop reorden: drag-handles en cada card. Cards reordenables. Agregar: boton abre formulario (foto drag-drop + nombre ES/EN + cargo ES/EN). Eliminar con modal de confirmacion | DEMO-038 |
| UX-113 | Dashboard — cards categoria clickables: clic en card Farmacos/Alimentos/Equipos navega al listado de productos filtrado por esa categoria. Ultimos 5 mensajes con link "Ver todos" -> /admin/mensajes | DEMO-027 |

> Las interacciones definen comportamiento funcional de la demo.
> Trabajan sobre los datos mock definidos arriba.

---

## CRM Tracking

| ID | Criterio | Origen |
|---|---|---|
| UX-114 | CRM tracking integrado en el sitio publico: evento `open` al cargar la app (una sola vez). Tracking de navegacion interna (`page-view` en cada NavigationEnd con ruta). Tracking de scroll por umbrales de 10% (10, 20... 100), reseteando al cambiar ruta. Heartbeat cada 30s mientras pagina visible (pausa en oculta). Tracking de CTA clicks via metodo publico `trackCTA(label)` invocado en: "Explorar catalogo", "Distribuya con nosotros", "Solicitar informacion", "Consultar por WhatsApp", "Descargar ficha tecnica", "Ver farmacos/alimentos/equipos", "Enviar consulta". Eventos custom via `trackCustom(eventName, data)`. Sistema de cola con batching cada 10s, envio via `navigator.sendBeacon()` con fallback `fetch`. Flush inmediato en `visibilitychange` (hidden) y `beforeunload`. Resiliente a fallos: errores se loguean en consola y se ignoran silenciosamente. No enviar datos personales en eventos. Configuracion via `environment.ts` con `trackingEndpoint` y `leadId` | DEMO-045 |
| UX-115 | El CRM tracking NO se aplica al panel de administracion — solo al sitio publico. El panel no envia eventos de tracking | DEMO-045 |

> CRM tracking para seguimiento del prospecto segun template crm-tracking.md.

---

## Gaps de UX Descubiertos

| # | Gap | DEMO-IDs afectados | Recomendacion |
|---|---|---|---|
| GAP-UX01 | No se define que pasa si el admin navega a /admin/ sin sesion y sin conexion a internet — el flujo de login depende de Azure Entra ID que requiere conexion | DEMO-024 | Mostrar mensaje "Se requiere conexion a internet para iniciar sesion" con boton "Reintentar" si detecta que no hay conectividad antes de redirigir a Azure |
| GAP-UX02 | El flujo de "Duplicar producto" (opcion en menu 3 puntos) esta listado en DEMO-028 pero no hay detalle de que campos se copian ni el nombre por defecto de la copia | DEMO-028, DEMO-029 | Duplicar copia todos los campos del producto a formulario de creacion nuevo con nombre "[Original] (copia)". El admin puede editar antes de guardar. El producto duplicado NO copia imagenes (se deben subir nuevamente) para evitar referencias compartidas a Blob Storage |
| GAP-UX03 | Concurrencia de edicion: no se define que pasa si dos admins editan el mismo contenido simultaneamente. En demo esto no es un problema (un solo usuario), pero es una limitacion para v1 funcional | DEMO-029, DEMO-034, DEMO-037 | Para v1: "last write wins" sin deteccion de conflictos. Documentar como limitacion conocida. Para v2: timestamps de ultima edicion visibles |
| GAP-UX04 | Los filtros activos del catalogo se reflejan en URL (query params), pero no se define si al volver con "boton atras" del navegador los filtros se restauran | DEMO-012 | Los filtros se restauran desde query params al navegar con history state nativo del navegador. Implementar via Angular Router con queryParamsHandling |

> Nota: los gaps de UX refieren a DEMO-IDs (no REQ-IDs) porque los criterios UX-xxx se derivan de DEMO-xxx.

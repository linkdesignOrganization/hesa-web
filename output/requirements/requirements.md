# Requirements — HESA (Herrera y Elizondo S.A.) Sitio Web y Panel de Administracion

**Generado por**: Business Analyst
**Fecha**: 2026-03-17
**Version**: 2.0 (gaps resueltos con respuestas del cliente)
**Total criterios**: 339 funcionales + 32 NFR = 371 total
**Total gaps identificados**: 0 (27 resueltos: 14 de negocio con respuestas del cliente + 13 tecnicos con decisiones internas)

---

## Resumen Ejecutivo

HESA (Herrera y Elizondo S.A.) es una empresa familiar costarricense de segunda generacion con 37 anos de trayectoria en la importacion y distribucion de farmacos veterinarios, alimentos para animales y equipos veterinarios. Opera exclusivamente en el sector veterinario con mas de 50 colaboradores, 18-20 agentes de ventas propios cubriendo todo el territorio nacional, y flotilla propia de entrega. Solo HESA se menciona en todo el sitio — no se referencian las demas empresas del grupo.

El proyecto consiste en dos componentes: (1) un sitio web publico bilingue (ES/EN) que funciona como catalogo informativo profesional (NO e-commerce) y como presencia corporativa premium para atraer fabricantes internacionales, y (2) un panel de administracion con autenticacion via Azure Entra ID. El sitio NO debe incluir precios, inventario, carrito de compras, checkout, registro de usuarios, blog ni chat en vivo. La calidad visual debe superar significativamente a los competidores (Monteco, VETIM, Belina). El sitio debe ser premium con navegacion excelente y funcionalidades utiles que superen la competencia.

El sitio atiende dos audiencias criticas: clientes locales (veterinarias, pet shops, groomers, agroservicios, grandes almacenes) que consultan productos por especie, marca o familia farmaceutica; y fabricantes internacionales (principalmente de Asia) que evaluan a HESA como distribuidor potencial en Costa Rica. NO se menciona la expansion a Centroamerica en el sitio.

---

## Epica 1: Navegacion Global y Estructura del Sitio Publico

### Feature 1.1: Header y Navegacion Principal

**Descripcion**: Barra de navegacion superior presente en todas las paginas del sitio publico, que permite acceso rapido a todas las secciones y funcionalidades de busqueda e idioma.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-001 | El header muestra el logo de HESA a la izquierda, enlazado a la pagina de inicio | funcional | alta |
| REQ-002 | El header incluye links de navegacion a: Catalogo (enlace directo a pagina de catalogo general, con submenu: Farmacos, Alimentos, Equipos), Marcas, Nosotros, Distribuidores, Contacto | funcional | alta |
| REQ-003 | El header incluye un icono de busqueda que al hacer clic abre un campo de busqueda expandible o overlay | funcional | alta |
| REQ-004 | El header incluye un selector de idioma visible (ES/EN) que cambia todo el contenido del sitio al idioma seleccionado | funcional | alta |
| REQ-005 | El header permanece fijo (sticky) al hacer scroll en todas las paginas | funcional | alta |
| REQ-006 | En mobile (< 768px), la navegacion se colapsa en un menu hamburguesa que al hacer clic despliega un drawer lateral o modal con todos los links | responsive | alta |
| REQ-007 | El link de navegacion de la seccion actual muestra un estado activo visualmente distinguible (subrayado, color diferente) | funcional | media |
| REQ-008 | El header NO muestra iconos de carrito de compras, cuenta de usuario, login ni ninguna funcionalidad de e-commerce | funcional | alta |
| REQ-009 | Al cambiar de idioma con el selector, la URL cambia para reflejar el prefijo /es/ o /en/ y el contenido se actualiza sin recargar la pagina completa o con recarga minima | funcional | alta |
| REQ-010 | En tablet (768px-1024px), la navegacion se adapta con menu hamburguesa o con items condensados segun espacio disponible | responsive | media |
| REQ-011 | Todos los links de navegacion son accesibles con teclado (Tab, Enter, Escape para cerrar menus) | accesibilidad | media |
| REQ-012 | El submenu de Catalogo (Farmacos, Alimentos, Equipos) se despliega al hover en desktop y al tap en mobile | funcional | media |

### Feature 1.2: Footer Global

**Descripcion**: Pie de pagina presente en todas las paginas con navegacion completa, informacion de contacto y enlaces de redes sociales.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-013 | El footer muestra el logo de HESA como elemento visual prominente | funcional | alta |
| REQ-014 | El footer incluye navegacion completa: Catalogo (Farmacos, Alimentos, Equipos), Marcas, Nosotros, Distribuidores, Contacto | funcional | alta |
| REQ-015 | El footer muestra informacion de contacto: telefono (+506 2260-9020), correo electronico, direccion (Calle 2, av 12. Heredia, Costa Rica) | funcional | alta |
| REQ-016 | El footer incluye enlaces a redes sociales (Facebook, Instagram) con iconos que abren en nueva pestana | funcional | media |
| REQ-017 | El footer incluye selector de idioma (ES/EN) funcional | funcional | media |
| REQ-018 | El footer muestra texto de copyright con ano actualizado dinamicamente | funcional | baja |
| REQ-019 | En mobile, el footer se reorganiza en una sola columna con secciones colapsables o apiladas verticalmente | responsive | media |
| REQ-020 | Todos los textos del footer se muestran en el idioma seleccionado actualmente | i18n | alta |

### Feature 1.3: Boton Flotante de WhatsApp

**Descripcion**: Boton de acceso rapido a WhatsApp presente en todas las paginas para contacto inmediato.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-021 | Un boton flotante con el icono de WhatsApp aparece en la esquina inferior derecha de todas las paginas del sitio | funcional | alta |
| REQ-022 | Al hacer clic en el boton, se abre WhatsApp (web o app segun dispositivo) con un mensaje pre-configurado que incluye el contexto de la pagina actual | funcional | alta |
| REQ-023 | El numero de WhatsApp del boton flotante es configurable desde el panel de administracion | funcional | alta |
| REQ-024 | El boton flotante no obstruye el contenido principal ni los CTAs de la pagina; se posiciona con separacion adecuada del borde | funcional | media |
| REQ-025 | En mobile, el boton flotante tiene un tamano de area de toque de al menos 44x44px | accesibilidad | media |
| REQ-026 | El boton flotante no interfiere con la barra sticky del detalle de producto cuando esta aparece | funcional | media |

### Feature 1.4: Sistema Bilingue (ES/EN)

**Descripcion**: Todo el sitio debe estar disponible en espanol e ingles con URLs diferenciadas y contenido administrable en ambos idiomas.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-027 | Todas las paginas tienen URLs diferenciadas con prefijo /es/ y /en/ (ejemplo: /es/catalogo/farmacos, /en/catalog/pharmaceuticals) | funcional | alta |
| REQ-028 | El sitio detecta el idioma preferido del navegador del usuario en la primera visita y redirige al prefijo correspondiente (ES por defecto si no se detecta) | funcional | media |
| REQ-029 | Todo el contenido estatico del sitio (textos de navegacion, labels, botones, mensajes del sistema) existe en ambos idiomas | i18n | alta |
| REQ-030 | Todo el contenido dinamico (productos, marcas, textos de paginas) es administrable en ambos idiomas desde el panel | i18n | alta |
| REQ-031 | Si un producto no tiene traduccion al ingles, se muestra el contenido en espanol como fallback con un indicador visual de que la traduccion no esta disponible | i18n | media |
| REQ-032 | Las URLs en espanol usan slugs en espanol (ej: /es/catalogo/farmacos) y las URLs en ingles usan slugs en ingles (ej: /en/catalog/pharmaceuticals) | SEO | alta |
| REQ-033 | Las etiquetas hreflang estan presentes en el HTML de cada pagina para indicar a los buscadores las versiones en ambos idiomas | SEO | alta |
| REQ-034 | El selector de idioma al cambiar de ES a EN mantiene al usuario en la misma pagina/seccion, solo cambia el idioma del contenido y la URL | funcional | alta |

### Feature 1.5: Search Bar Global con Prediccion/Autocompletado

**Descripcion**: Barra de busqueda global prominente presente en el header del sitio que permite a los usuarios encontrar productos, marcas y contenido en todo el sitio con prediccion y autocompletado en tiempo real. Es una funcionalidad critica solicitada explicitamente por el cliente para superar la competencia.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-035 | La busqueda permite encontrar productos por nombre, marca, especie de destino y familia farmaceutica | funcional | alta |
| REQ-036 | Los resultados de busqueda se muestran en tiempo real (busqueda predictiva) conforme el usuario escribe, con un minimo de 3 caracteres | funcional | media |
| REQ-037 | Los resultados se agrupan por tipo (Productos, Marcas) con un maximo de 5 sugerencias por tipo en el dropdown | funcional | media |
| REQ-038 | Al hacer clic en un resultado o presionar Enter, el usuario navega a la pagina del producto o marca correspondiente | funcional | alta |
| REQ-039 | Si no hay resultados, se muestra un mensaje "No se encontraron resultados para '[termino]'" con sugerencias de busqueda alternativas o link al catalogo completo | edge-case | media |
| REQ-040 | La busqueda funciona en ambos idiomas: busca en los campos del idioma actualmente seleccionado | i18n | alta |
| REQ-041 | La busqueda es tolerante a errores tipograficos menores (ej: "nutrisource" encuentra "NutriSource") mediante busqueda case-insensitive y normalizacion de acentos | funcional | media |

---

## Epica 2: Pagina de Inicio (Home)

### Feature 2.1: Hero Principal

**Descripcion**: Seccion principal visible al cargar la pagina, que comunica la propuesta de valor de HESA con un CTA hacia el catalogo y otro hacia la seccion de distribuidores.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-042 | El hero ocupa el 100% del viewport inicial (100vh) | funcional | alta |
| REQ-043 | El hero muestra un tag superior (ej: "DESDE 1989" o "37 ANOS DE TRAYECTORIA") configurable desde el panel | funcional | alta |
| REQ-044 | El hero muestra un headline principal grande que comunica la propuesta de valor de HESA, configurable desde el panel en ES/EN | funcional | alta |
| REQ-045 | El hero muestra un subtitulo corto que menciona farmacos, alimentos y equipos, configurable desde el panel en ES/EN | funcional | alta |
| REQ-046 | El hero incluye un CTA primario ("Explorar catalogo") que navega a la pagina del catalogo | funcional | alta |
| REQ-047 | El hero incluye un CTA secundario ("Distribuya con nosotros" / "Partner with us") que navega a la pagina de Distribuidores | funcional | alta |
| REQ-048 | La imagen del hero es configurable desde el panel de administracion | funcional | alta |
| REQ-049 | En mobile, el hero se adapta manteniendo legibilidad del texto y accesibilidad de los CTAs, reduciendo tamanio de tipografia y reorganizando el layout | responsive | alta |
| REQ-050 | Todos los textos del hero se muestran en el idioma seleccionado actualmente | i18n | alta |

### Feature 2.2: Bloques de Categorias Principales

**Descripcion**: Tres bloques visuales que presentan las categorias principales (Farmacos, Alimentos, Equipos) con descripcion, beneficios y CTA hacia el catalogo filtrado.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-051 | Se muestran 3 bloques, cada uno representando una categoria: Farmacos, Alimentos, Equipos | funcional | alta |
| REQ-052 | Cada bloque muestra: titulo de la categoria, parrafo descriptivo, 3 beneficios con iconos, e imagen representativa | funcional | alta |
| REQ-053 | Cada bloque tiene un CTA que navega al catalogo filtrado por esa categoria (ej: "Ver farmacos" lleva a /es/catalogo/farmacos) | funcional | alta |
| REQ-054 | Los bloques alternan la posicion de texto e imagen (izquierda-derecha, derecha-izquierda) en desktop | funcional | media |
| REQ-055 | En mobile, los bloques se apilan verticalmente con imagen encima del texto | responsive | alta |
| REQ-056 | Todos los textos de los bloques se muestran en el idioma seleccionado | i18n | alta |

### Feature 2.3: Seccion de Marcas Destacadas

**Descripcion**: Vitrina de logos de las marcas principales que HESA distribuye, generando confianza y validacion.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-057 | Se muestran los logos de las marcas seleccionadas como destacadas desde el panel de administracion, con un maximo de 6-8 logos visibles | funcional | alta |
| REQ-058 | Cada logo es un enlace a la pagina individual de esa marca | funcional | media |
| REQ-059 | La seccion incluye un titulo (ej: "Representamos las mejores marcas del mundo") y un link "Ver todas las marcas" que navega a la pagina de Marcas | funcional | alta |
| REQ-060 | Las marcas destacadas son seleccionables y reordenables desde el panel de administracion | funcional | alta |
| REQ-061 | Los logos mantienen un tamano consistente y estan alineados al centro vertical | funcional | media |

### Feature 2.4: Propuesta de Valor / Por que HESA

**Descripcion**: Seccion con 4 datos clave de HESA presentados como estadisticas impactantes para generar confianza.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-062 | Se muestran 4 bloques con datos clave: "37 anos", "Cobertura nacional", "100% veterinario", "Credito flexible" (o equivalentes) | funcional | alta |
| REQ-063 | Cada bloque muestra un numero/dato destacado grande, un icono y un texto descriptivo corto | funcional | alta |
| REQ-064 | En mobile, los bloques se reorganizan en grid de 2x2 o una columna | responsive | media |
| REQ-065 | Los textos de la seccion se muestran en el idioma seleccionado | i18n | alta |

### Feature 2.5: Productos Nuevos/Destacados (Carrusel)

**Descripcion**: Carrusel horizontal de productos que HESA quiere destacar, totalmente administrable desde el panel para permitir rotacion segun lanzamientos y campanas.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-066 | El carrusel muestra las cards de los productos seleccionados como destacados desde el panel de administracion | funcional | alta |
| REQ-067 | Cada card muestra: imagen del producto, nombre, descripcion corta (1-2 lineas) y boton "Ver producto" | funcional | alta |
| REQ-068 | Las cards NO muestran precio, inventario ni ningun dato de e-commerce | funcional | alta |
| REQ-069 | El carrusel tiene controles de navegacion: flechas laterales e indicadores de pagina (dots) | funcional | media |
| REQ-070 | Al hacer clic en una card o en "Ver producto", el usuario navega a la pagina de detalle de ese producto | funcional | alta |
| REQ-071 | Los productos destacados son seleccionables, reordenables y removibles desde el panel de administracion | funcional | alta |
| REQ-072 | En mobile, el carrusel permite swipe horizontal para navegar entre productos | responsive | alta |
| REQ-073 | Si no hay productos destacados configurados, la seccion no se muestra en el home (no un area vacia) | edge-case | media |

### Feature 2.6: CTA para Fabricantes

**Descripcion**: Banner prominente dirigido a fabricantes internacionales que buscan distribuidor en Costa Rica. NO se menciona Centroamerica.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-074 | Se muestra un banner con titulo directo orientado a fabricantes (ej: "Busca un distribuidor en Costa Rica?") — NO mencionar Centroamerica | funcional | alta |
| REQ-075 | El banner incluye un parrafo corto sobre la capacidad de distribucion y un CTA que navega a la pagina de Distribuidores | funcional | alta |
| REQ-076 | El titulo y textos del banner se muestran en el idioma seleccionado, siendo especialmente relevante en ingles | i18n | alta |
| REQ-077 | En mobile, el banner mantiene legibilidad y el CTA es facilmente accesible | responsive | media |

---

## Epica 3: Catalogo de Productos

### Feature 3.1: Pagina de Listado de Categoria (Farmacos / Alimentos / Equipos)

**Descripcion**: Pagina que muestra todos los productos de una categoria con sistema de filtros y grid de cards. Se replica para cada una de las tres categorias principales.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-078 | La pagina muestra un breadcrumb de navegacion (Inicio > Catalogo > [Categoria]) | funcional | alta |
| REQ-079 | La pagina muestra el titulo de la categoria en el idioma actual y un contador de productos (ej: "42 productos") | funcional | alta |
| REQ-080 | La pagina muestra una descripcion corta de la categoria (1-2 lineas) configurable desde el panel en ES/EN | funcional | media |
| REQ-081 | Los productos se muestran en un grid: 3 columnas en desktop, 2 en tablet, 1-2 en mobile | responsive | alta |
| REQ-082 | Cada card de producto muestra: imagen (proporcion consistente), nombre, marca (badge o texto secundario), icono(s) de especie de destino | funcional | alta |
| REQ-083 | Las cards NO muestran precio, inventario ni disponibilidad | funcional | alta |
| REQ-084 | Al hacer clic en una card, el usuario navega a la pagina de detalle de ese producto | funcional | alta |
| REQ-085 | Si la categoria no tiene productos, se muestra un estado vacio con mensaje informativo (ej: "No hay productos en esta categoria actualmente") | edge-case | media |
| REQ-086 | La URL de la pagina es semantica y refleja la categoria (ej: /es/catalogo/farmacos) | SEO | alta |
| REQ-087 | La pagina tiene meta titulo y meta descripcion unicos y editables desde el panel | SEO | alta |

### Feature 3.2: Sistema de Filtros del Catalogo

**Descripcion**: Filtros horizontales que permiten refinar la lista de productos por multiples criterios segun la categoria.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-088 | Para Farmacos, los filtros disponibles son: Marca, Especie (Caninos, Felinos, Bovinos, Equinos, Aves, Porcinos, etc.), Familia farmaceutica (Antibioticos, Desparasitantes, Vitaminas, Antiinflamatorios, Suplementos, etc.) | funcional | alta |
| REQ-089 | Para Alimentos, los filtros disponibles son: Marca, Especie, Etapa de vida (Cachorro/Kitten, Adulto, Senior) | funcional | alta |
| REQ-090 | Para Equipos, los filtros disponibles son: Marca, Tipo de equipo | funcional | alta |
| REQ-091 | Los filtros se presentan como dropdowns en barra horizontal superior (no sidebar lateral) | funcional | alta |
| REQ-092 | Al seleccionar un filtro, los productos se actualizan inmediatamente (sin necesidad de boton "Aplicar") | funcional | alta |
| REQ-093 | Los filtros activos se muestran como pills/badges debajo de la barra con boton "X" para remover cada uno individualmente | funcional | alta |
| REQ-094 | Se muestra un boton "Limpiar filtros" cuando hay al menos un filtro activo | funcional | media |
| REQ-095 | Se pueden combinar multiples filtros simultaneamente (ej: Marca "Zoofarma" + Especie "Caninos") y los resultados muestran la interseccion | funcional | alta |
| REQ-096 | En mobile, los filtros se colapsan en un boton "Filtrar" que abre un drawer/modal con todos los filtros | responsive | alta |
| REQ-097 | Si ningun producto coincide con los filtros seleccionados, se muestra un mensaje "No se encontraron productos con estos filtros" con sugerencia de limpiar filtros | edge-case | media |
| REQ-098 | El contador de productos se actualiza dinamicamente al aplicar filtros (ej: "12 de 42 productos") | funcional | media |
| REQ-099 | Los filtros activos se reflejan en la URL (query params) para permitir compartir enlaces filtrados y deep linking | funcional | media |
| REQ-100 | Los valores de filtros (marcas, especies, familias) se generan dinamicamente a partir de los datos existentes en el catalogo administrado | funcional | alta |

### Feature 3.3: Paginacion del Catalogo

**Descripcion**: Control de paginacion para navegar por grandes cantidades de productos.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-101 | Los productos se paginan mostrando un maximo definido por pagina (ej: 24 productos) | funcional | alta |
| REQ-102 | Se muestra un indicador "Mostrando X de Y productos" | funcional | media |
| REQ-103 | Los controles de paginacion son accesibles con teclado | accesibilidad | media |
| REQ-104 | Al cambiar de pagina, el viewport hace scroll al inicio del grid de productos | funcional | media |
| REQ-105 | La paginacion se mantiene al aplicar o remover filtros (vuelve a pagina 1 al cambiar filtros) | funcional | media |

### Feature 3.4: Pagina de Catalogo General (Todos los Productos)

**Descripcion**: Pagina unificada que muestra TODOS los productos de todas las categorias (Farmacos, Alimentos, Equipos) con filtros completos. Al hacer clic en "Catalogo" en la navegacion principal, el usuario llega a esta pagina. Las paginas por categoria (Farmacos, Alimentos, Equipos) se mantienen como sub-paginas accesibles desde el submenu y desde filtros.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-264a | La pagina de catalogo general (/es/catalogo, /en/catalog) muestra TODOS los productos de todas las categorias en un solo grid | funcional | alta |
| REQ-264b | La pagina incluye un filtro adicional de "Categoria" (Farmacos, Alimentos, Equipos, Todos) que NO existe en las paginas individuales por categoria | funcional | alta |
| REQ-264c | La pagina incluye todos los filtros disponibles: Categoria, Marca, Especie, Familia farmaceutica, Etapa de vida, Tipo de equipo — mostrando solo los filtros relevantes segun la categoria seleccionada | funcional | alta |
| REQ-264d | Si el usuario selecciona una categoria en el filtro, los filtros secundarios se adaptan dinamicamente (ej: al seleccionar "Farmacos" aparece "Familia farmaceutica", al seleccionar "Alimentos" aparece "Etapa de vida") | funcional | alta |
| REQ-264e | El breadcrumb de la pagina general es: Inicio > Catalogo | funcional | media |
| REQ-264f | La pagina tiene meta titulo y meta descripcion unicos para SEO, optimizados como pagina de alto nivel del catalogo | SEO | alta |
| REQ-264g | El link "Catalogo" en la navegacion principal del header enlaza directamente a esta pagina general. El submenu desplegable sigue mostrando las 3 categorias como accesos directos | funcional | alta |
| REQ-264h | La pagina muestra el total de productos disponibles y se actualiza al aplicar filtros (ej: "Mostrando 24 de 312 productos") | funcional | media |
| REQ-264i | La paginacion aplica igual que en las paginas por categoria (24 productos por pagina, controles de paginacion) | funcional | alta |
| REQ-264j | En mobile, el grid se adapta a 1-2 columnas y los filtros se colapsan en un boton "Filtrar" | responsive | alta |

---

## Epica 4: Detalle de Producto

### Feature 4.1: Informacion Principal del Producto

**Descripcion**: Pagina de detalle con layout de dos columnas: galeria de imagenes a la izquierda e informacion completa del producto a la derecha.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-106 | La pagina muestra un breadcrumb (Inicio > Catalogo > [Categoria] > [Nombre del Producto]) | funcional | alta |
| REQ-107 | La columna izquierda muestra una galeria de imagenes con miniaturas clicables y una imagen principal grande | funcional | alta |
| REQ-108 | Al hacer clic en una miniatura, la imagen principal cambia mostrando esa imagen | funcional | alta |
| REQ-109 | La imagen principal tiene funcionalidad de zoom al hover o lightbox al hacer clic | funcional | media |
| REQ-110 | La columna derecha muestra el nombre del producto (titulo grande) | funcional | alta |
| REQ-111 | La columna derecha muestra la marca con link a la pagina individual de esa marca | funcional | alta |
| REQ-112 | La columna derecha muestra badges/iconos de especie(s) de destino (Caninos, Felinos, Bovinos, etc.) | funcional | alta |
| REQ-113 | Para Farmacos: se muestra formula/composicion general, numero de registro sanitario, indicaciones de uso | funcional | alta |
| REQ-114 | Para Farmacos: se muestran las presentaciones disponibles como pills seleccionables (ej: "100ml", "250ml", "500ml") | funcional | alta |
| REQ-115 | Para Alimentos: se muestra especie de destino, etapa de vida, presentaciones/tamanos disponibles (pills), ingredientes principales, e informacion nutricional si aplica | funcional | alta |
| REQ-116 | Para Equipos: se muestran especificaciones tecnicas, usos recomendados, garantia si aplica | funcional | alta |
| REQ-117 | Se muestra un CTA principal prominente "Solicitar informacion" que abre el formulario de contacto con el producto pre-seleccionado | funcional | alta |
| REQ-118 | Se muestra un CTA secundario "Consultar por WhatsApp" con icono de WhatsApp que abre WhatsApp con mensaje pre-configurado incluyendo el nombre del producto | funcional | alta |
| REQ-119 | Se muestra un boton "Ver ficha tecnica" / "Descargar ficha tecnica (PDF)" con icono de documento, SOLO si hay un PDF cargado para ese producto. Las fichas tecnicas NO son obligatorias — algunos productos tendran y otros no. El boton es DINAMICO: solo aparece si hay ficha disponible | funcional | alta |
| REQ-120 | Si no hay ficha tecnica PDF cargada para el producto, el boton de descarga NO se muestra en absoluto (no un boton deshabilitado ni un espacio vacio) | edge-case | alta |
| REQ-121 | En mobile, el layout cambia a una sola columna: galeria arriba, informacion debajo | responsive | alta |
| REQ-122 | Todos los textos del producto se muestran en el idioma seleccionado | i18n | alta |
| REQ-123 | La pagina NO muestra precio, inventario, disponibilidad, carrito, ni opciones de compra | funcional | alta |
| REQ-124 | La URL del producto es semantica: /es/catalogo/[categoria]/[slug-del-producto] | SEO | alta |
| REQ-125 | La pagina tiene meta titulo (nombre del producto + marca) y meta descripcion (descripcion corta del producto) generados automaticamente pero editables | SEO | alta |
| REQ-126 | Se incluye schema markup (JSON-LD) de tipo Product con campos: name, description, brand, image, category | SEO | media |
| REQ-127 | Si el producto tiene una sola imagen, las miniaturas de galeria no se muestran y solo aparece la imagen principal | edge-case | media |
| REQ-128 | Si el producto no tiene imagen cargada, se muestra un placeholder visual (no un icono roto) con el nombre de la marca o categoria | edge-case | media |
| REQ-129 | Los campos especificos del tipo de producto (farmaco/alimento/equipo) solo se muestran si tienen contenido; secciones vacias no generan areas en blanco | edge-case | media |

### Feature 4.2: Barra Sticky de Producto

**Descripcion**: Barra fija que aparece al hacer scroll pasada la seccion principal, facilitando la accion de contacto sin tener que volver arriba.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-130 | Al hacer scroll hacia abajo pasada la seccion de informacion principal, aparece una barra fija en la parte superior | funcional | alta |
| REQ-131 | La barra sticky muestra: miniatura del producto, nombre del producto, marca, y boton "Solicitar informacion" | funcional | alta |
| REQ-132 | La barra desaparece al hacer scroll hacia arriba cuando la seccion principal vuelve a ser visible | funcional | media |
| REQ-133 | En mobile, la barra sticky muestra nombre del producto y boton de accion (simplificado para no ocupar excesivo espacio vertical) | responsive | alta |
| REQ-134 | La barra sticky no obstruye el contenido de la pagina al aparecer (no causa salto de layout) | funcional | media |

### Feature 4.3: Storytelling del Producto (Opcional)

**Descripcion**: Bloques de contenido enriquecido debajo de la informacion principal para productos que HESA quiera destacar especialmente, administrables desde el panel.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-135 | Debajo de la informacion principal, se pueden mostrar bloques de contenido con imagen + texto que profundizan en beneficios del producto | funcional | media |
| REQ-136 | Estos bloques son opcionales y administrables desde el panel: si no hay contenido de storytelling para un producto, la seccion simplemente no aparece | funcional | media |
| REQ-137 | Los bloques de storytelling soportan contenido bilingue (ES/EN) | i18n | media |

### Feature 4.4: Productos Relacionados

**Descripcion**: Seccion al final del detalle que muestra productos de la misma categoria o marca para fomentar la exploracion.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-138 | Al final de la pagina de detalle, se muestra una seccion "Tambien te puede interesar" con 3-4 cards de productos relacionados | funcional | alta |
| REQ-139 | Los productos relacionados son de la misma categoria o marca que el producto actual | funcional | media |
| REQ-140 | Las cards de productos relacionados tienen el mismo formato que las cards del catalogo (imagen, nombre, marca, especie) | funcional | media |
| REQ-141 | En mobile, los productos relacionados se muestran en carrusel horizontal con swipe | responsive | media |
| REQ-142 | Si el producto es el unico de su categoria/marca, la seccion de relacionados no se muestra o muestra productos de la misma categoria general | edge-case | baja |

---

## Epica 5: Pagina de Marcas

### Feature 5.1: Listado de Marcas

**Descripcion**: Pagina que muestra todas las marcas que HESA distribuye en formato de grid de cards.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-143 | La pagina muestra un titulo (ej: "Marcas que representamos") y un parrafo introductorio sobre la relacion de HESA con sus proveedores | funcional | alta |
| REQ-144 | Las marcas se muestran en un grid de cards: 3-4 columnas en desktop, 2 en tablet, 1-2 en mobile | responsive | alta |
| REQ-145 | Cada card muestra: logo de la marca (centrado), nombre, pais de origen, badges de categorias que maneja (Farmacos, Alimentos, Equipos) | funcional | alta |
| REQ-146 | Al hacer clic en una card, el usuario navega a la pagina individual de esa marca | funcional | alta |
| REQ-147 | La pagina tiene meta titulo y meta descripcion propios para SEO | SEO | media |
| REQ-148 | Todos los textos se muestran en el idioma seleccionado | i18n | alta |

### Feature 5.2: Pagina Individual de Marca

**Descripcion**: Pagina dedicada a cada marca que muestra informacion detallada y el grid de todos sus productos.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-149 | La pagina muestra un breadcrumb (Inicio > Marcas > [Nombre de la Marca]) | funcional | alta |
| REQ-150 | La pagina muestra: logo grande de la marca, nombre, pais de origen, descripcion detallada y categorias de productos | funcional | alta |
| REQ-151 | Debajo de la informacion de la marca, se muestra un grid con todos los productos de esa marca | funcional | alta |
| REQ-152 | El grid de productos incluye los mismos filtros aplicables que el catalogo general (filtrados al contexto de esa marca) | funcional | media |
| REQ-153 | La descripcion de la marca se muestra en el idioma seleccionado | i18n | alta |
| REQ-154 | La URL es semantica: /es/marcas/[slug-de-la-marca] | SEO | alta |

---

## Epica 6: Pagina Nosotros

### Feature 6.1: Contenido Corporativo

**Descripcion**: Pagina que cuenta la historia de HESA, sus valores, numeros clave y capacidad de distribucion.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-155 | La pagina incluye un hero con titulo e imagen profesional (no full-viewport, aproximadamente 50-60vh) | funcional | alta |
| REQ-156 | Se muestra la historia de HESA: empresa familiar de segunda generacion, 37 anos en el mercado, evolucion, valores, exclusividad del sector veterinario | funcional | alta |
| REQ-157 | Se muestra una seccion de numeros clave con datos impactantes: 37+ anos, 50+ colaboradores, 18-20 agentes de ventas, cobertura nacional, X marcas internacionales | funcional | alta |
| REQ-158 | Se muestra una seccion de cobertura y distribucion con informacion sobre agentes propios y flotilla de entrega. NO se menciona la expansion a Centroamerica | funcional | alta |
| REQ-159 | Todo el contenido de texto es editable desde el panel de administracion en ES/EN | funcional | alta |
| REQ-160 | La pagina tiene URL semantica y meta tags propios | SEO | media |
| REQ-161 | En mobile, todas las secciones se adaptan a una columna manteniendo legibilidad | responsive | alta |

### Feature 6.2: Politicas Comerciales

**Descripcion**: Seccion dentro de la pagina Nosotros (o pagina independiente) que informa sobre condiciones de credito, tiempos de entrega y cobertura.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-162 | Se muestra informacion general sobre plazos de credito (sin montos especificos, mencionando condiciones flexibles) | funcional | alta |
| REQ-163 | Se muestran tiempos de entrega segun zona: GAM vs zonas rurales vs zonas alejadas (encomienda) | funcional | alta |
| REQ-164 | Se explica la cobertura de entrega: flotilla propia, agentes en todas las zonas, servicio de encomienda para zonas muy alejadas | funcional | alta |
| REQ-165 | Se menciona la frecuencia de visitas de los agentes (quincenal) | funcional | alta |
| REQ-166 | Se incluye un CTA para solicitar condiciones comerciales personalizadas que navega al formulario de contacto | funcional | media |
| REQ-167 | El contenido de politicas comerciales es editable desde el panel en ES/EN | funcional | alta |
| REQ-168 | El tono es informativo y accesible, no de documento legal | funcional | media |

### Feature 6.3: Mapa de Cobertura

**Descripcion**: Representacion visual de la cobertura de HESA en Costa Rica.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-169 | Se muestra un mapa estilizado de Costa Rica que ilustra la cobertura nacional | funcional | media |
| REQ-170 | El mapa es un elemento visual/grafico (no un mapa interactivo de Google), cargado como imagen o SVG | funcional | media |
| REQ-171 | El mapa se complementa con texto sobre los agentes propios y la flotilla de entrega. NO se menciona la expansion a Centroamerica | funcional | media |

### Feature 6.4: Equipo de Liderazgo

**Descripcion**: Seccion con fotos, nombres y cargos de los lideres de HESA. Se lanza con 6 personas con informacion ficticia (nombres, cargos y fotos de banco de fotos como placeholder). Desde el panel podran borrar los placeholders y agregar la informacion real. La funcionalidad de gestionar el equipo debe estar en el panel de administracion.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-172 | Se muestra un grid con foto, nombre y cargo de cada miembro del equipo de liderazgo. La seccion se carga con 6 personas con datos ficticios como placeholders iniciales | funcional | alta |
| REQ-173 | Si no hay miembros del equipo cargados (todos fueron eliminados), la seccion no se muestra en el sitio publico (no aparece vacia) | edge-case | media |
| REQ-173a | Las fotos placeholder son imagenes de banco de fotos profesionales (no avatares genericos) con nombres y cargos ficticios pero realistas | funcional | media |
| REQ-173b | Cada miembro del equipo muestra: foto profesional, nombre completo, cargo. La informacion se muestra en el idioma seleccionado (ES/EN) | funcional | alta |
| REQ-173c | El grid de equipo se adapta de 3 columnas en desktop a 2 en tablet y 1 en mobile | responsive | media |

---

## Epica 7: Pagina de Distribuidores (Para Fabricantes)

### Feature 7.1: Contenido Orientado a Fabricantes

**Descripcion**: Pagina que funciona como pitch comercial profesional para fabricantes internacionales que evaluan a HESA como distribuidor, especialmente critica en su version en ingles.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-174 | La pagina muestra un hero impactante con titulo orientado a fabricantes ("Partner with HESA" / "Distribuya con nosotros"), subtitulo y CTA hacia formulario de contacto | funcional | alta |
| REQ-175 | Se muestra una seccion "Por que elegir HESA" con grid de beneficios: 37 anos de experiencia, cobertura nacional, exclusivos del sector veterinario, infraestructura establecida, relaciones solidas. NO se menciona expansion a Centroamerica | funcional | alta |
| REQ-176 | Se muestra una seccion de logos de marcas que ya confian en HESA (logo wall) como validacion social | funcional | alta |
| REQ-177 | Se muestra un timeline visual de 4 pasos del proceso de partnership: Contacto inicial, Evaluacion de productos, Negociacion de terminos, Inicio de distribucion | funcional | alta |
| REQ-178 | El timeline es horizontal en desktop y vertical en mobile | responsive | media |
| REQ-179 | Todo el contenido de texto es editable desde el panel en ES/EN | funcional | alta |
| REQ-180 | La version en ingles esta especialmente optimizada para fabricantes de Asia, con lenguaje B2B ejecutivo profesional | i18n | alta |
| REQ-181 | La pagina tiene meta tags SEO optimizados especialmente para la version en ingles con keywords de "distributor Costa Rica", "veterinary distributor Central America" | SEO | alta |

### Feature 7.2: Formulario de Contacto para Fabricantes

**Descripcion**: Formulario especializado para fabricantes que quieren iniciar conversacion con HESA sobre distribucion.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-182 | El formulario incluye los campos: Nombre de la empresa*, Pais de origen*, Nombre del contacto*, Correo electronico*, Telefono, Tipo de productos, Mensaje*, Checkbox de aceptacion de terminos | funcional | alta |
| REQ-183 | Los campos marcados con * son obligatorios y se validan antes del envio | validacion | alta |
| REQ-184 | El campo de correo electronico valida formato de email valido | validacion | alta |
| REQ-185 | La validacion se muestra en tiempo real: al salir de un campo (blur), se indica si es valido o hay error | validacion | alta |
| REQ-186 | Al enviar el formulario exitosamente, se muestra un mensaje de confirmacion (ej: "Gracias por su interes. Nos pondremos en contacto pronto.") | funcional | alta |
| REQ-187 | Al enviar el formulario, se envia una notificacion por correo a hola@linkdesign.cr (correo configurable desde el panel). Todos los formularios del sitio envian al mismo correo por ahora | funcional | alta |
| REQ-188 | El mensaje se almacena en el panel de administracion como mensaje de tipo "Fabricante" | funcional | alta |
| REQ-189 | El formulario tiene proteccion anti-spam (captcha invisible o honeypot) | seguridad | alta |
| REQ-190 | El boton de envio se deshabilita despues del primer clic para prevenir envios dobles, y se muestra un indicador de carga | edge-case | media |
| REQ-191 | Si el envio falla por error de red/servidor, se muestra un mensaje de error con opcion de reintentar | error-handling | media |
| REQ-192 | Los labels y placeholders del formulario se muestran en el idioma seleccionado | i18n | alta |

---

## Epica 8: Pagina de Contacto

### Feature 8.1: Informacion de Contacto

**Descripcion**: Seccion con todos los datos de contacto de HESA y mapa de ubicacion.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-193 | Se muestra: telefono (+506 2260-9020), correo electronico, direccion (Calle 2, av 12. Heredia, Costa Rica), horario de atencion (placeholder editable desde el panel), enlaces a redes sociales. NO se muestra mapa — solo direccion de texto | funcional | alta |
| REQ-194 | Los datos de contacto son editables desde el panel de administracion (seccion Configuracion > Contacto) | funcional | alta |
| REQ-195 | NO se incluye mapa de Google embebido. Solo se muestra la direccion de texto. Sin mapa interactivo ni imagen de mapa | funcional | alta |
| REQ-196 | El layout es de dos columnas en desktop: informacion a la izquierda, formulario a la derecha. Una columna en mobile | responsive | alta |

### Feature 8.2: Formulario de Contacto General

**Descripcion**: Formulario para consultas generales de clientes y visitantes.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-197 | El formulario incluye los campos: Nombre*, Correo electronico*, Telefono, Tipo de consulta* (dropdown: Informacion de productos, Condiciones comerciales, Soporte, Otro), Producto de interes (opcional), Mensaje* | funcional | alta |
| REQ-198 | Si el usuario llega al formulario desde una pagina de detalle de producto (via "Solicitar informacion"), el campo "Producto de interes" se pre-llena con el nombre de ese producto | funcional | alta |
| REQ-199 | Los campos obligatorios se validan antes del envio con mensajes de error claros | validacion | alta |
| REQ-200 | Al enviar exitosamente, se muestra un mensaje de confirmacion y los campos se limpian | funcional | alta |
| REQ-201 | Al enviar, se envia notificacion por correo a hola@linkdesign.cr (correo configurable desde el panel) y el mensaje se almacena en el panel | funcional | alta |
| REQ-202 | El formulario tiene proteccion anti-spam (captcha invisible o honeypot) | seguridad | alta |
| REQ-203 | El boton de envio previene envios dobles (se deshabilita tras clic, muestra spinner de carga) | edge-case | media |
| REQ-204 | Si el envio falla, se muestra mensaje de error con opcion de reintentar sin perder los datos ingresados | error-handling | media |
| REQ-205 | Los labels y mensajes del formulario se muestran en el idioma seleccionado | i18n | alta |

---

## Epica 9: Panel de Administracion - Dashboard

### Feature 9.1: Dashboard Principal

**Descripcion**: Pantalla de inicio del panel que muestra un resumen rapido del estado del sitio.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-206 | El dashboard muestra 4 cards de resumen en la fila superior: Total de productos (con badge de activos), Mensajes nuevos (con badge naranja si hay pendientes), Marcas registradas, Productos destacados en el home | funcional | alta |
| REQ-207 | El dashboard muestra 3 cards de acceso rapido por categoria: Farmacos, Alimentos, Equipos, cada una con conteo de productos activos | funcional | alta |
| REQ-208 | Cada card de categoria es clickable y navega al listado de productos filtrado por esa categoria | funcional | alta |
| REQ-209 | Se muestra una seccion de "Ultimos mensajes" con los 5 mensajes mas recientes (nombre, tipo, fecha, estado) y link "Ver todos" | funcional | alta |
| REQ-210 | Se muestra una seccion de "Actividad reciente" con las ultimas acciones realizadas en el panel (crear/editar/eliminar productos, marcas, mensajes) | funcional | media |
| REQ-211 | Los datos del dashboard se cargan independientemente: si uno falla, los demas siguen visibles | error-handling | media |

### Feature 9.2: Navegacion del Panel (Sidebar)

**Descripcion**: Barra lateral de navegacion fija con acceso a todos los modulos del panel.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-212 | El sidebar muestra el logo de HESA en la parte superior | funcional | alta |
| REQ-213 | El sidebar incluye los modulos: Dashboard, Productos (con submenu: Todos, Farmacos, Alimentos, Equipos), Marcas, Categorias, Home (con submenu: Hero, Productos destacados, Marcas destacadas), Contenido (con submenu: Nosotros, Equipo de Liderazgo, Distribuidores, Contacto, Politicas comerciales), Mensajes (con badge de conteo de nuevos), Configuracion (con submenu: General, Contacto, Redes sociales, SEO). NO incluye seccion de gestion de usuarios — los accesos se gestionan desde Azure | funcional | alta |
| REQ-214 | El item de menu activo se destaca visualmente (fondo azul suave, texto azul) | funcional | alta |
| REQ-215 | Los submenus se expanden/colapsan al hacer clic con chevron (>) como indicador | funcional | media |
| REQ-216 | El sidebar permanece fijo durante el scroll del contenido principal | funcional | alta |
| REQ-217 | En tablet, el sidebar es colapsable (se puede ocultar/mostrar). En mobile, se convierte en menu hamburguesa | responsive | alta |
| REQ-218 | El badge de conteo en "Mensajes" muestra la cantidad de mensajes con estado "Nuevo" y se actualiza en tiempo real o al navegar | funcional | media |

### Feature 9.3: Header del Panel

**Descripcion**: Barra superior fija con titulo de seccion, busqueda global y opciones del usuario.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-219 | El header muestra el nombre de la seccion actual a la izquierda | funcional | alta |
| REQ-220 | El header incluye una barra de busqueda global que busca en productos (por nombre), marcas (por nombre) y mensajes (por nombre del contacto o contenido) | funcional | alta |
| REQ-221 | Los resultados de busqueda global se muestran en dropdown agrupados por tipo | funcional | media |
| REQ-222 | El header muestra a la derecha: icono de notificaciones (campana con badge si hay nuevas), avatar del usuario con nombre y dropdown de opciones (cerrar sesion) | funcional | alta |
| REQ-223 | El header permanece fijo durante el scroll del contenido principal | funcional | alta |

---

## Epica 10: Panel de Administracion - Gestion de Productos

### Feature 10.1: Listado de Productos

**Descripcion**: Pantalla principal de gestion de productos con vista de cards (defecto) y tabla (alternativa), filtros y busqueda.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-224 | La pantalla muestra titulo "Productos", subtitulo descriptivo, y boton "+ Crear producto" en la esquina superior derecha | funcional | alta |
| REQ-225 | Se incluyen filtros: busqueda por nombre, filtro por categoria (Todos/Farmacos/Alimentos/Equipos), filtro por marca, filtro por estado (Todos/Activos/Inactivos) | funcional | alta |
| REQ-226 | Se incluye un toggle Card view / Table view, con Card view como vista por defecto | funcional | alta |
| REQ-227 | En Card view, cada card muestra: imagen, nombre (bold), marca (gris), badge de categoria (color segun tipo), badge de estado (verde "Activo" o gris "Inactivo"), menu de tres puntos | funcional | alta |
| REQ-228 | El menu de tres puntos de cada card ofrece: Editar, Ver en sitio, Duplicar, Desactivar/Activar, Eliminar | funcional | alta |
| REQ-229 | En Table view, se muestra tabla con columnas: checkbox, imagen miniatura, nombre, marca, categoria (badge), especie (badges), estado (badge), acciones (editar/eliminar) | funcional | alta |
| REQ-230 | Las cards se muestran en grid de 3 columnas en pantallas grandes, 2 en medianas | responsive | media |
| REQ-231 | Se muestra paginacion: "Mostrando 1-24 de X productos" con controles de pagina | funcional | alta |
| REQ-232 | Si no hay productos, se muestra estado vacio con mensaje "No hay productos aun" y boton "Crear tu primer producto" | edge-case | alta |
| REQ-233 | Si un producto no tiene imagen, la card muestra un placeholder visual con el icono de la categoria | edge-case | media |

### Feature 10.2: Crear / Editar Producto

**Descripcion**: Formulario en pantalla completa (no modal) para crear un nuevo producto o editar uno existente, organizado en secciones con campos condicionales segun el tipo de producto.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-234 | El formulario se abre en pantalla completa separada del listado, con breadcrumb "Productos > Crear producto" o "Productos > Editar: [Nombre]" | funcional | alta |
| REQ-235 | Seccion 1 "Informacion basica" incluye: Nombre (ES)*, Nombre (EN), Marca* (dropdown con busqueda), Categoria* (selector visual: Farmaco/Alimento/Equipo). NO incluye campo de "Empresa del grupo" — solo HESA se menciona en todo el sitio | funcional | alta |
| REQ-236 | Seccion 2 "Clasificacion y filtros" muestra campos condicionales segun la categoria seleccionada | funcional | alta |
| REQ-237 | Si Farmaco: Especie(s) de destino* (multi-select), Familia farmaceutica* (dropdown) | funcional | alta |
| REQ-238 | Si Alimento: Especie(s) de destino* (multi-select), Etapa de vida (dropdown: Cachorro/Kitten, Adulto, Senior, Todas las etapas) | funcional | alta |
| REQ-239 | Si Equipo: Tipo de equipo* (dropdown) | funcional | alta |
| REQ-240 | Siempre visible: Presentaciones disponibles (input tipo tags/chips), Estado* (toggle switch "Producto visible en el sitio web") | funcional | alta |
| REQ-241 | Seccion 3 "Descripcion y contenido" tiene tabs de idioma (Espanol/Ingles) para campos de texto bilingues | funcional | alta |
| REQ-242 | Campos de texto segun categoria: Farmaco (descripcion general, formula/composicion, registro sanitario, indicaciones de uso), Alimento (descripcion, ingredientes principales, informacion nutricional), Equipo (descripcion, especificaciones tecnicas, garantia) | funcional | alta |
| REQ-243 | Seccion 4 "Imagen y ficha tecnica" permite drag-and-drop de imagen con preview inmediato, y drag-and-drop de PDF de ficha tecnica con nombre del archivo visible | funcional | alta |
| REQ-244 | Si ya hay imagen cargada, se muestra con botones "Cambiar imagen" y "Eliminar" | funcional | media |
| REQ-245 | Si ya hay PDF cargado, se muestra nombre del archivo, tamano, y botones "Descargar" y "Eliminar" | funcional | media |
| REQ-246 | Los campos obligatorios se marcan con asterisco rojo (*) y se validan al intentar guardar | validacion | alta |
| REQ-247 | La validacion muestra errores en tiempo real debajo de cada campo al perder foco | validacion | alta |
| REQ-248 | Al guardar exitosamente, se muestra un toast de exito ("Producto guardado correctamente") y se redirige al listado de productos | funcional | alta |
| REQ-249 | Si el guardado falla, se muestra un toast de error con mensaje descriptivo y el formulario mantiene los datos ingresados | error-handling | alta |
| REQ-250 | Al editar, el boton "Eliminar producto" (rojo outline) aparece separado de "Cancelar" y "Guardar", y requiere confirmacion mediante modal | funcional | alta |
| REQ-251 | El boton "Cancelar" navega de regreso al listado. Si hay cambios sin guardar, se muestra confirmacion "Tienes cambios sin guardar. Deseas salir?" | funcional | media |
| REQ-252 | Los campos condicionales (por categoria) se muestran/ocultan dinamicamente sin recargar la pagina al cambiar la categoria seleccionada | funcional | alta |
| REQ-253 | La imagen del producto se optimiza automaticamente al subirla (redimensionada y comprimida para web) | funcional | media |
| REQ-254 | El formulario soporta multiples imagenes por producto para la galeria del detalle en el sitio publico | funcional | alta |

### Feature 10.3: Detalle de Producto (Vista de Solo Lectura)

**Descripcion**: Pantalla que muestra toda la informacion de un producto sin modo de edicion, util para verificar antes de publicar.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-255 | La pantalla muestra breadcrumb "Productos > [Nombre del producto]" | funcional | alta |
| REQ-256 | Layout de dos columnas: imagen grande a la izquierda con boton "Ver en el sitio web", toda la informacion del producto a la derecha organizada en bloques con labels | funcional | alta |
| REQ-257 | Se muestra boton "Editar producto" en la esquina superior derecha | funcional | alta |
| REQ-258 | Si hay PDF de ficha tecnica, se muestra link "Descargar ficha tecnica" | funcional | media |

---

## Epica 11: Panel de Administracion - Gestion de Marcas

### Feature 11.1: Listado de Marcas

**Descripcion**: Pantalla para ver y gestionar todas las marcas registradas.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-259 | La pantalla muestra titulo "Marcas", subtitulo, y boton "+ Agregar marca" | funcional | alta |
| REQ-260 | Vista Card por defecto con grid de 3 columnas. Cada card: logo centrado, nombre, pais de origen (con icono), badges de categorias, conteo de productos, menu de tres puntos | funcional | alta |
| REQ-261 | Toggle a Table view disponible con columnas: logo miniatura, nombre, pais, categorias (badges), productos (conteo), acciones | funcional | media |
| REQ-262 | Menu de tres puntos: Editar, Ver productos de esta marca, Eliminar | funcional | alta |
| REQ-263 | Si no hay marcas, se muestra estado vacio con mensaje y CTA | edge-case | media |

### Feature 11.2: Crear / Editar Marca

**Descripcion**: Formulario para crear o editar marcas.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-264 | Formulario en pantalla dedicada con campos: Logo (drag-and-drop con preview), Nombre*, Pais de origen* (dropdown de paises), Categorias que maneja* (multi-select: Farmacos, Alimentos, Equipos), Descripcion (ES), Descripcion (EN) | funcional | alta |
| REQ-265 | Los campos obligatorios se validan antes de guardar | validacion | alta |
| REQ-266 | Al guardar, toast de exito y redireccion al listado de marcas | funcional | alta |
| REQ-267 | Eliminar marca requiere confirmacion. Si la marca tiene productos asociados, se muestra advertencia: "Esta marca tiene X productos asociados. Eliminar la marca no eliminara los productos." | funcional | alta |

---

## Epica 12: Panel de Administracion - Gestion de Categorias

### Feature 12.1: Administracion de Categorias y Filtros

**Descripcion**: Pantalla para administrar las categorias principales y sus subcategorias/valores de filtro.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-268 | Se muestran 3 cards expandibles para Farmacos, Alimentos y Equipos | funcional | alta |
| REQ-269 | Card Farmacos: subsecciones editables de "Familias farmaceuticas" (lista de tags) y "Especies" (lista de tags) | funcional | alta |
| REQ-270 | Card Alimentos: subsecciones editables de "Etapas de vida" (lista de tags) y "Especies" (lista de tags) | funcional | alta |
| REQ-271 | Card Equipos: subseccion editable de "Tipos de equipo" (lista de tags) | funcional | alta |
| REQ-272 | Cada tag es un chip/pill con boton "x" para eliminar. Boton "+" para agregar nuevo valor con input inline | funcional | alta |
| REQ-273 | Al eliminar un valor de filtro que esta en uso por productos existentes, se muestra advertencia con la cantidad de productos afectados y se pide confirmacion | funcional | alta |
| REQ-274 | Los valores de filtro se guardan en ES/EN para el sitio bilingue | i18n | media |

---

## Epica 13: Panel de Administracion - Gestion del Home

### Feature 13.1: Administracion del Hero

**Descripcion**: Pantalla para gestionar la imagen y textos del hero de la pagina de inicio.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-275 | Se muestra preview de la imagen actual del hero con boton "Cambiar imagen" | funcional | alta |
| REQ-276 | Campos editables: Tag superior (ES/EN), Headline (ES/EN), Subtitulo (ES/EN), Texto del CTA primario (ES/EN), Texto del CTA secundario (ES/EN) | funcional | alta |
| REQ-277 | Al guardar, los cambios se reflejan en el sitio publico | funcional | alta |

### Feature 13.2: Administracion de Productos Destacados

**Descripcion**: Pantalla para seleccionar y reordenar los productos que aparecen en el carrusel del home.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-278 | Se muestra la lista de productos actualmente destacados como cards pequenas horizontales (miniatura + nombre + marca + boton "X" para remover) | funcional | alta |
| REQ-279 | Boton "+ Agregar producto" abre un modal de busqueda/seleccion con lista de todos los productos activos, busqueda por nombre, filtro por categoria, y checkboxes de seleccion | funcional | alta |
| REQ-280 | Los productos destacados se pueden reordenar mediante drag-and-drop | funcional | alta |
| REQ-281 | Los cambios en productos destacados se reflejan inmediatamente en el carrusel del home del sitio publico al guardar | funcional | alta |

### Feature 13.3: Administracion de Marcas Destacadas

**Descripcion**: Pantalla para seleccionar que marcas aparecen en la seccion de marcas del home.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-282 | Mismo patron que productos destacados pero para seleccionar logos de marcas | funcional | alta |
| REQ-283 | Se pueden seleccionar, remover y reordenar marcas destacadas con drag-and-drop | funcional | alta |

---

## Epica 14: Panel de Administracion - Contenido Estatico

### Feature 14.1: Edicion de Paginas Estaticas

**Descripcion**: Pantalla con tabs para editar los textos de las paginas Nosotros, Distribuidores, Contacto y Politicas Comerciales.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-284 | Se muestran tabs: "Nosotros", "Distribuidores", "Contacto", "Politicas comerciales" | funcional | alta |
| REQ-285 | Cada tab muestra un formulario con campos de texto organizados por seccion de la pagina, con version ES e EN para cada campo | funcional | alta |
| REQ-286 | Los campos son inputs de texto simples y textareas (no editor WYSIWYG complejo) | funcional | alta |
| REQ-287 | Al guardar, se muestra toast de exito y los cambios se reflejan en el sitio publico | funcional | alta |
| REQ-288 | Las imagenes de las paginas estaticas (hero de Nosotros, hero de Distribuidores) son editables con drag-and-drop | funcional | media |

---

## Epica 15: Panel de Administracion - Mensajes de Contacto

### Feature 15.1: Gestion de Mensajes

**Descripcion**: Pantalla para ver, gestionar y dar seguimiento a las consultas recibidas a traves de los formularios del sitio, con vista Kanban y tabla.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-289 | Se ofrece toggle entre vista Kanban (defecto) y vista Table | funcional | alta |
| REQ-290 | Vista Kanban: tres columnas "Nuevos", "En proceso", "Atendidos" con conteo por columna | funcional | alta |
| REQ-291 | Cada card de mensaje muestra: badge de tipo (color por tipo de consulta), nombre del contacto, correo, primeras 2 lineas del mensaje truncado, fecha, mini-badge de producto si aplica | funcional | alta |
| REQ-292 | Los mensajes se pueden mover entre columnas arrastrando (drag-and-drop) para cambiar su estado | funcional | alta |
| REQ-293 | Vista Table: columnas de Nombre, Correo, Telefono, Tipo (badge), Producto, Fecha, Estado (badge), Acciones (ver/eliminar) | funcional | alta |
| REQ-294 | Se incluyen filtros: por tipo de consulta, por estado, busqueda por nombre o correo | funcional | alta |
| REQ-295 | Boton "Exportar CSV" que descarga todos los mensajes filtrados en formato CSV | funcional | alta |
| REQ-296 | Los mensajes se distinguen por tipo con colores: "Informacion de productos" (azul), "Condiciones comerciales" (verde), "Soporte" (naranja), "Fabricante" (morado), "Otro" (gris) | funcional | media |

### Feature 15.2: Detalle de Mensaje

**Descripcion**: Pantalla de detalle al hacer clic en un mensaje, con toda la informacion y opciones de seguimiento.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-297 | Se muestra pantalla completa con datos del contacto (nombre, correo, telefono) en card lateral, contenido completo del mensaje, y producto de interes (si aplica, con link al producto en el panel) | funcional | alta |
| REQ-298 | Se muestra dropdown para cambiar el estado del mensaje (Nuevo, En proceso, Atendido) | funcional | alta |
| REQ-299 | Se incluye textarea de "Notas internas" para que el equipo agregue notas sobre el seguimiento del mensaje | funcional | alta |
| REQ-300 | Se muestra boton "Marcar como atendido" que cambia el estado y redirige al listado | funcional | alta |
| REQ-301 | Se muestra timestamp de cuando se recibio el mensaje | funcional | media |
| REQ-302 | Se muestra boton para eliminar el mensaje con confirmacion | funcional | media |

---

## Epica 16: Panel de Administracion - Configuracion

### Feature 16.1: Configuracion General y SEO

**Descripcion**: Pantalla de ajustes generales del sitio organizados en tabs.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-303 | Tab "General": Logo del sitio (drag-and-drop), nombre de la empresa, selector de idioma por defecto | funcional | alta |
| REQ-304 | Tab "Contacto": telefono principal, correo electronico, direccion fisica, horario de atencion (campo de texto libre con placeholder editable), numero de WhatsApp para boton flotante. El correo inicial es hola@linkdesign.cr | funcional | alta |
| REQ-305 | Tab "Redes sociales": URL de Facebook, URL de Instagram, y campos opcionales para otras redes | funcional | media |
| REQ-306 | Tab "SEO": meta titulo general (ES/EN), meta descripcion general (ES/EN), imagen para compartir en redes (OG Image) | funcional | alta |
| REQ-307 | Al guardar cualquier tab, se muestra toast de exito y los cambios se aplican al sitio publico | funcional | alta |

---

## Epica 17: Panel de Administracion - Autenticacion con Azure Entra ID

### Feature 17.1: Login del Panel via Azure Entra ID

**Descripcion**: Sistema de autenticacion basado completamente en Azure Entra ID (antes Azure AD). NO se manejan contrasenas desde el panel. Los administradores inician sesion con su cuenta de Microsoft/Azure. Nuevos administradores se agregan manualmente desde el portal de Azure. Inicialmente solo tiene acceso el correo hola@linkdesign.cr. NO hay recuperacion de contrasena en el panel — todo se maneja desde Azure.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-308 | El panel de administracion requiere autenticacion via Azure Entra ID para acceder a cualquier pantalla | seguridad | alta |
| REQ-309 | La pantalla de login muestra: logo de HESA y boton "Iniciar sesion con Microsoft" que redirige al flujo de autenticacion de Azure Entra ID. NO se muestran campos de correo/contrasena propios del panel | funcional | alta |
| REQ-310 | Si la autenticacion falla o el usuario no tiene permisos en Azure Entra ID, se muestra un mensaje de error claro ("No tienes acceso al panel de administracion. Contacta al administrador.") | seguridad | alta |
| REQ-311 | La sesion se gestiona con tokens de Azure Entra ID. Al expirar el token, se solicita re-autenticacion automaticamente | seguridad | alta |
| REQ-312 | El boton de cerrar sesion en el header del panel cierra la sesion de Azure y redirige a la pantalla de login | funcional | alta |
| REQ-313 | Las rutas del panel estan protegidas: acceder directamente a una URL sin sesion activa redirige al login de Azure Entra ID | seguridad | alta |
| REQ-314 | Un solo nivel de administrador: todos los usuarios autenticados via Azure Entra ID tienen acceso completo a todas las funcionalidades del panel. NO hay roles diferenciados | funcional | alta |
| REQ-315 | El acceso inicial se configura unicamente para hola@linkdesign.cr. Nuevos administradores se agregan exclusivamente desde el portal de Azure, NO desde el panel del sitio | funcional | alta |
| REQ-316 | El panel NO incluye pantalla de gestion de usuarios, creacion de cuentas, ni cambio/recuperacion de contrasenas. Toda la gestion de accesos se realiza en el portal de Azure | funcional | alta |
| REQ-317 | El panel NO almacena contrasenas de ningun tipo. La autenticacion es 100% delegada a Azure Entra ID | seguridad | alta |

---

## Epica 18: Panel de Administracion - Gestion del Equipo de Liderazgo

### Feature 18.1: Administracion del Equipo de Liderazgo

**Descripcion**: Pantalla en el panel de administracion para gestionar los miembros del equipo de liderazgo que se muestran en la pagina Nosotros. Se lanza con 6 personas con datos ficticios (placeholders). El administrador puede borrar los placeholders y agregar la informacion real.

#### Criterios de Aceptacion

| ID | Criterio | Tipo | Prioridad |
|---|---|---|---|
| REQ-318 | El panel incluye una seccion "Equipo de Liderazgo" accesible desde el sidebar (dentro de Contenido o como seccion propia) | funcional | alta |
| REQ-319 | La pantalla muestra un grid/listado de los miembros del equipo actuales con: foto miniatura, nombre, cargo, y botones de editar/eliminar | funcional | alta |
| REQ-320 | Boton "+ Agregar miembro" permite agregar un nuevo miembro con: foto (drag-and-drop), nombre (ES/EN), cargo (ES/EN) | funcional | alta |
| REQ-321 | Se puede editar la informacion de un miembro existente (cambiar foto, nombre, cargo) | funcional | alta |
| REQ-321a | Se puede eliminar un miembro del equipo con confirmacion ("Estas seguro de eliminar a [Nombre]?") | funcional | alta |
| REQ-321b | Los miembros del equipo se pueden reordenar mediante drag-and-drop para definir el orden de aparicion en el sitio publico | funcional | media |
| REQ-321c | El sistema se lanza con 6 miembros pre-cargados con nombres ficticios, cargos ficticios y fotos de banco de fotos como placeholders | funcional | alta |
| REQ-321d | Al guardar cambios, estos se reflejan en la seccion de Equipo de Liderazgo de la pagina Nosotros del sitio publico | funcional | alta |
| REQ-321e | Si se eliminan todos los miembros, la seccion de Equipo de Liderazgo desaparece del sitio publico | edge-case | media |

---

## Requisitos No Funcionales

### Performance

| ID | Criterio | Target |
|---|---|---|
| NFR-001 | El sitio publico carga la pagina de inicio en menos de 3 segundos en conexion 3G rapida | LCP < 3s |
| NFR-002 | Las imagenes de productos se optimizan automaticamente (formatos modernos WebP/AVIF, lazy loading) | Automatico |
| NFR-003 | El sitio cumple con Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1 en desktop | CWV pass |
| NFR-004 | Las paginas de catalogo con filtros actualizan resultados en menos de 500ms | < 500ms |
| NFR-005 | El panel de administracion carga cualquier pantalla en menos de 2 segundos | < 2s |

### SEO

| ID | Criterio | Target |
|---|---|---|
| NFR-006 | Cada pagina publica tiene meta titulo y meta descripcion unicos y editables | Todas las paginas |
| NFR-007 | Se genera un sitemap XML automatico que incluye todas las paginas publicas en ambos idiomas | /sitemap.xml |
| NFR-008 | Se implementa schema markup (JSON-LD) de tipo Organization para HESA y Product para cada producto | Datos estructurados |
| NFR-009 | Las URLs son semanticas, legibles y en el idioma correspondiente | Todas las URLs |
| NFR-010 | Las imagenes tienen atributos alt descriptivos en el idioma de la pagina | Todas las imagenes |
| NFR-011 | Las etiquetas hreflang conectan las versiones ES y EN de cada pagina | Todas las paginas |
| NFR-012 | El sitio es indexable por buscadores (no tiene blocking robots.txt ni noindex en paginas publicas) | Configuracion |
| NFR-013 | El panel de administracion NO es indexable (meta noindex o proteccion por autenticacion) | Panel admin |

### Seguridad

| ID | Criterio | Target |
|---|---|---|
| NFR-014 | Todas las comunicaciones usan HTTPS | SSL/TLS |
| NFR-015 | El panel NO almacena contrasenas. La autenticacion se delega 100% a Azure Entra ID mediante OAuth 2.0 / OpenID Connect. Los tokens de sesion se gestionan de forma segura | Azure Entra ID |
| NFR-016 | Los formularios publicos tienen proteccion anti-spam (captcha invisible o honeypot) | Anti-spam |
| NFR-017 | Los inputs de formularios se sanitizan contra XSS e inyeccion | Sanitizacion |
| NFR-018 | La API del panel valida autenticacion y autorizacion en cada endpoint | Auth en API |
| NFR-019 | Los archivos subidos (imagenes, PDFs) se validan por tipo y tamano maximo antes de almacenar | Validacion de uploads |
| NFR-020 | Se implementan headers de seguridad: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options | Headers HTTP |

### Accesibilidad

| ID | Criterio | Target |
|---|---|---|
| NFR-021 | El sitio publico cumple WCAG 2.1 nivel AA | Conformidad AA |
| NFR-022 | Todas las imagenes tienen texto alternativo (alt text) descriptivo | Todas las imagenes |
| NFR-023 | La navegacion es completamente funcional con teclado (Tab, Enter, Escape, flechas) | Teclado completo |
| NFR-024 | Los contrastes de color cumplen ratio minimo 4.5:1 para texto normal y 3:1 para texto grande | WCAG 2.1 AA |
| NFR-025 | Los formularios tienen labels asociados correctamente a cada campo, y los errores de validacion se anuncian a lectores de pantalla | Labels + ARIA |
| NFR-026 | Los elementos interactivos (botones, links, controles) tienen un area de toque minima de 44x44px en mobile | Touch targets |

### Integraciones

| ID | Criterio | Target |
|---|---|---|
| NFR-027 | La integracion de Google Analytics (GA4) queda lista en el codigo pero NO activa por ahora. El cliente no ha creado la plataforma. Se configura para activarse facilmente cuando el cliente proporcione el ID de medicion (variable de entorno o configuracion del panel) | GA4 preparado |
| NFR-028 | Se integra WhatsApp Business API para el boton flotante en todas las paginas | WhatsApp |
| NFR-029 | Se implementan Open Graph tags para compartir correctamente en redes sociales (Facebook, LinkedIn) | OG tags |
| NFR-030 | La integracion de Facebook Pixel queda lista en el codigo pero NO activa por ahora. El cliente no ha creado las plataformas. Se configura para activarse facilmente cuando el cliente proporcione el Pixel ID (variable de entorno o configuracion del panel) | FB Pixel preparado |

### Responsive

| ID | Criterio | Target |
|---|---|---|
| NFR-031 | El sitio publico es mobile-first y se ve impecable en todos los breakpoints: 375px (mobile), 768px (tablet), 1024px (laptop), 1280px (desktop), 1440px+ (wide) | Todos los breakpoints |
| NFR-032 | El panel de administracion es desktop-first pero funcional en tablet con sidebar colapsable, y en mobile con menu hamburguesa | Desktop-first responsive |

---

## Gaps Resueltos

> Todos los gaps han sido resueltos. 14 gaps de negocio resueltos con respuestas del cliente. 13 gaps tecnicos resueltos con decisiones internas del equipo.

### Gaps de Negocio — RESUELTOS (respuestas del cliente)

| # | Gap | Resolucion |
|---|---|---|
| GAP-B01 | Empresas del grupo HESA | **RESUELTO**: Solo HESA se menciona en todo el sitio. Se elimina el dropdown de empresa facturadora. Se elimina la Epica 18 original. Se reemplaza con gestion de equipo de liderazgo. |
| GAP-B02 | Marcas y paises de origen | **RESUELTO**: Se cargan marcas con placeholders para el demo. Los datos reales los agrega el cliente desde el panel cuando este listo. Las marcas son completamente administrables. |
| GAP-B03 | Recuperacion de contrasena | **RESUELTO**: Autenticacion 100% via Azure Entra ID. NO se manejan contrasenas en el panel. No hay recuperacion de contrasena — todo se gestiona desde el portal de Azure. |
| GAP-B04 | Roles de usuarios del panel | **RESUELTO**: Un solo nivel de administrador. Solo hola@linkdesign.cr como acceso inicial. Nuevos admins se agregan exclusivamente desde Azure, NO desde el panel. |
| GAP-B05 | Correo de formularios de contacto | **RESUELTO**: Todos los correos llegan a hola@linkdesign.cr por ahora. Correo configurable desde el panel para modificarlo despues. |
| GAP-B06 | Fichas tecnicas PDF | **RESUELTO**: Las fichas tecnicas PDF NO son obligatorias. Desde el panel pueden subir las que tengan. El boton "Ver ficha tecnica" en el detalle del producto es DINAMICO: solo aparece si hay ficha disponible. |
| GAP-B07 | Horario de atencion | **RESUELTO**: Placeholder editable desde el panel para horario de atencion. |
| GAP-B08 | Expansion a Centroamerica | **RESUELTO**: NO se menciona la expansion a Centroamerica en ningun lugar del sitio. Se eliminaron todas las referencias. |
| GAP-B09 | Carga masiva de productos | **RESUELTO**: NO hay carga masiva. Todo manual desde el panel. |
| GAP-B10 | Mapa en pagina de Contacto | **RESUELTO**: Solo direccion de texto, sin mapa interactivo ni imagen de mapa. |
| GAP-B11 | Equipo de liderazgo | **RESUELTO**: Seccion con 6 personas con informacion ficticia (nombres, cargos y fotos de banco de fotos como placeholder). Desde el panel podran borrar los placeholders y agregar la informacion real. La funcionalidad de gestionar equipo esta en el panel. |
| GAP-B12 | Google Analytics y Facebook Pixel | **RESUELTO**: NO se activan por ahora — el cliente no ha creado las plataformas. La funcionalidad queda lista en el codigo para activarse cuando configuren las cuentas (GA4 ID y FB Pixel ID como configuracion). |
| GAP-B13 | Lista de especies | **RESUELTO**: Las especies listadas son solo para el demo. Desde el panel pueden agregar o eliminar las que necesiten. Son completamente administrables. |
| GAP-B14 | Pagina de catalogo general | **RESUELTO**: SI, pagina de catalogo general + paginas por categoria. AMBAS con filtros utiles. Ademas, search bar global con prediccion/autocompletado. |

### Gaps Tecnicos — RESUELTOS (decisiones internas del equipo)

| # | Gap | Decision |
|---|---|---|
| GAP-T01 | Paginacion del catalogo | Paginacion offset-based con 24 productos por pagina. Scroll infinito descartado por peor SEO. |
| GAP-T02 | URLs bilingues | Prefijo /es/ y /en/ con slugs traducidos. hreflang en cada pagina. |
| GAP-T03 | Almacenamiento de imagenes | Azure Blob Storage con CDN. Redimensionado automatico (200px, 400px, 800px, 1200px) y conversion a WebP. |
| GAP-T04 | Cache | Cache agresivo en paginas publicas (TTL 1 hora) con invalidacion al publicar cambios desde el panel. CDN cache para assets estaticos. |
| GAP-T05 | Motor de busqueda | Busqueda full-text sobre la base de datos (text indexes). Case-insensitive con normalizacion de acentos. Migrable a Azure Cognitive Search si escala. |
| GAP-T06 | Email de formularios | Servicio transaccional (SendGrid o Azure Communication Services). Templates HTML simples. Cola de reintentos (3 intentos con backoff exponencial). |
| GAP-T07 | Pre-renderizado SEO | SSR para paginas publicas. El panel admin no necesita SSR. |
| GAP-T08 | Tamano maximo de uploads | Imagenes: max 5MB (JPG, PNG, WebP). PDFs: max 10MB. Compresion automatica al subir. |
| GAP-T09 | Backup | Backup automatico diario de la base de datos. Blob Storage con geo-redundancia (RA-GRS). |
| GAP-T10 | Anti-spam | Tres capas: (1) Honeypot fields, (2) Rate limiting por IP (5/hora), (3) reCAPTCHA v3 invisible como respaldo. |
| GAP-T11 | Productos relacionados | Prioridad: (1) misma marca Y categoria, (2) misma categoria con especies compartidas, (3) aleatorios de la misma categoria. Max 4. |
| GAP-T12 | Imagenes multiples por producto | Hasta 6 imagenes. Primera = principal. Orden con drag-and-drop en el panel. |
| GAP-T13 | Exportacion CSV de mensajes | Todos los campos visibles. UTF-8 con BOM. Respeta filtros activos. |

---

## Matriz de Trazabilidad

| Epica | Features | Criterios | Gaps |
|---|---|---|---|
| Epica 1: Navegacion Global y Estructura | 5 features | REQ-001 a REQ-041 (41) | 0 (resueltos) |
| Epica 2: Pagina de Inicio (Home) | 6 features | REQ-042 a REQ-077 (36) | 0 (resueltos) |
| Epica 3: Catalogo de Productos | 4 features | REQ-078 a REQ-105 + REQ-264a a REQ-264j (28 + 10 = 38) | 0 (GAP-B14 resuelto: SI catalogo general) |
| Epica 4: Detalle de Producto | 4 features | REQ-106 a REQ-142 (37) | 0 (GAP-B06 resuelto: fichas no obligatorias, boton dinamico) |
| Epica 5: Pagina de Marcas | 2 features | REQ-143 a REQ-154 (12) | 0 (GAP-B02 resuelto: placeholders para demo) |
| Epica 6: Pagina Nosotros | 4 features | REQ-155 a REQ-173c (19 + 3 = 22) | 0 (GAP-B07/B08/B11 resueltos) |
| Epica 7: Distribuidores | 2 features | REQ-174 a REQ-192 (19) | 0 (resueltos) |
| Epica 8: Pagina de Contacto | 2 features | REQ-193 a REQ-205 (13) | 0 (GAP-B05/B10 resueltos) |
| Epica 9: Panel - Dashboard | 3 features | REQ-206 a REQ-223 (18) | 0 (resueltos) |
| Epica 10: Panel - Productos | 3 features | REQ-224 a REQ-258 (35) | 0 (GAP-B09 resuelto: no carga masiva) |
| Epica 11: Panel - Marcas | 2 features | REQ-259 a REQ-267 (9) | 0 (resueltos) |
| Epica 12: Panel - Categorias | 1 feature | REQ-268 a REQ-274 (7) | 0 (GAP-B13 resuelto: especies demo, administrables) |
| Epica 13: Panel - Home | 3 features | REQ-275 a REQ-283 (9) | 0 (resueltos) |
| Epica 14: Panel - Contenido Estatico | 1 feature | REQ-284 a REQ-288 (5) | 0 (resueltos) |
| Epica 15: Panel - Mensajes | 2 features | REQ-289 a REQ-302 (14) | 0 (GAP-B05 resuelto: correo unico) |
| Epica 16: Panel - Configuracion | 1 feature | REQ-303 a REQ-307 (5) | 0 (GAP-B07/B12 resueltos) |
| Epica 17: Panel - Autenticacion Azure Entra ID | 1 feature | REQ-308 a REQ-317 (10) | 0 (GAP-B03/B04 resueltos: Azure Entra ID, un solo rol) |
| Epica 18: Panel - Equipo de Liderazgo | 1 feature | REQ-318 a REQ-321e (9) | 0 (GAP-B01 resuelto: solo HESA, no grupo. Epica reemplazada: gestion equipo liderazgo) |
| Requisitos No Funcionales | 6 categorias | NFR-001 a NFR-032 (32) | 0 (GAP-T01 a GAP-T13 resueltos) |
| **Total** | **47 features** | **339 criterios funcionales + 32 NFR = 371 total** | **0 gaps pendientes (27 resueltos)** |

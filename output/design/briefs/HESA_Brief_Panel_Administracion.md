# Brief para Agentes: Panel de Administracion HESA

Documento de referencia para agentes de IA encargados del diseno y desarrollo del panel de administracion del sitio web de HESA (Herrera y Elizondo S.A.).

Este brief es complementario al brief principal del sitio publico (HESA_Brief_Agentes.md). Ambos documentos deben leerse en conjunto.

---

## ANTES DE COMENZAR: INSTRUCCION OBLIGATORIA

**DEBES visitar la plantilla de referencia ANTES de escribir una sola linea de codigo o tomar cualquier decision de diseno.** Las descripciones en este documento son una guia, pero NO reemplazan la experiencia de ver la plantilla en vivo. Los detalles visuales (espaciados, proporciones de cards, comportamiento de tablas, microinteracciones) solo se entienden navegando la referencia real. Si te saltas este paso, el resultado sera un panel generico tipo CRUD que no cumple con lo que necesitamos.

**Referencia principal de diseno del panel (OBLIGATORIO navegar TODAS estas paginas):**
- Dashboard con cards de resumen y graficos: https://dashlytemplate.webflow.io/dashboards/products
- Dashboard con cards de categorias y progreso: https://dashlytemplate.webflow.io/dashboards/tasks
- Tabla limpia con badges de estado y acciones: https://dashlytemplate.webflow.io/features/table
- Listado con toggle Table view / Card view: https://dashlytemplate.webflow.io/features/companies (HAZ CLIC en "Card view" para ver ambas vistas)
- Contactos con avatares: https://dashlytemplate.webflow.io/features/contacts
- Board Kanban con columnas: https://dashlytemplate.webflow.io/features/board
- Cards de proyecto con iconos y progreso: https://dashlytemplate.webflow.io/features/projects
- Settings con tabs y formularios: https://dashlytemplate.webflow.io/settings/v3

Al navegar Dashly, presta atencion especifica a: la proporcion entre el sidebar y el area de contenido, el tamano y padding de las cards, como se ven los badges de estado (colores, border-radius, tamano de texto), la cantidad de espacio blanco dentro de cada card y entre cards, la tipografia de los headers de tabla (uppercase, gris, pequena), y la estructura de los formularios en Settings (labels arriba del campo, secciones separadas con subtitulos).

**NO procedas con el desarrollo sin haber visitado todas estas paginas.** Cada una demuestra un patron especifico que se usa en el panel de HESA, y la descripcion textual de este brief complementa lo que veras, pero nunca lo sustituye.

---

## 1. CONTEXTO Y FILOSOFIA DEL PANEL

### Quien va a usar este panel

Las personas que administran el panel son del equipo comercial de HESA. Trabajan en soporte comercial, manejan precios, productos y relacion con vendedores. NO son personal tecnico. No tienen conocimientos avanzados de desarrollo web. Su dia a dia es atender vendedores, gestionar catalogos y manejar informacion de productos.

HESA tambien tiene una empresa tercerizada que les apoya con temas tecnicos si fuera necesario, pero el objetivo es que el panel sea tan sencillo que no la necesiten para el uso diario.

### Por que importa tanto la calidad de este panel

El cliente dijo expresamente que lo mas importante para ellos es que la pagina sea facil de administrar. Un sitio web anterior que tuvieron fracaso precisamente porque era dificil de mantener y se desactualizo. Un sitio desactualizado es un arma de doble filo: si un producto no esta, el cliente piensa que no esta disponible cuando podria estarlo. Por lo tanto, el panel NO es un componente secundario; es tan importante como el sitio publico.

### Principio fundamental: separar flujos en pantallas diferentes

REGLA CRITICA PARA LOS AGENTES: Cada accion principal debe tener su propia pantalla. No amontonar multiples formularios, tablas o acciones en una sola vista. Si una pantalla tiene scroll excesivo o requiere que el usuario piense "donde esta lo que necesito", esta mal disenada. Los flujos deben ser:

1. Una pantalla para VER (listados, dashboards)
2. Una pantalla separada para CREAR/EDITAR (formularios)
3. Una pantalla separada para el DETALLE (ver toda la informacion de un elemento)

Nunca combinar estas tres funciones en una sola pantalla.

---

## 2. REFERENCIA DE DISENO: DASHLY TEMPLATE

**URL base:** https://dashlytemplate.webflow.io/

**RECORDATORIO:** Si no has visitado TODAS las paginas listadas en la seccion "ANTES DE COMENZAR", hazlo AHORA antes de seguir leyendo. Las descripciones que siguen asumen que ya navegaste cada pagina de Dashly y entiendes visualmente lo que se describe. En particular, asegurate de haber hecho clic en el toggle "Card view" en /features/companies para ver como se ven las cards de empresas (ese es el patron principal para productos y marcas de HESA).

Esta plantilla define el estandar visual y de interaccion del panel de HESA. Los agentes deben estudiar todas las paginas de esta plantilla y replicar sus patrones. A continuacion se detallan los patrones clave extraidos de cada seccion.

### 2.1 Estructura general del layout

**Referencia:** Todas las paginas de Dashly.

El panel tiene tres zonas permanentes:

**Zona 1 - Sidebar lateral izquierdo (fijo):**
- Logo de HESA en la parte superior
- Navegacion principal con iconos + texto para cada modulo
- Los items del menu tienen un icono a la izquierda y el nombre del modulo a la derecha
- Chevron (>) para indicar submenus expandibles
- Separador visual entre la navegacion principal (modulos de contenido) y la navegacion secundaria (configuracion)
- El item activo se destaca con fondo azul suave y texto azul HESA
- Ancho fijo: aproximadamente 260-280px
- Fondo blanco con borde derecho sutil

**Zona 2 - Header superior (fijo):**
- Nombre de la seccion actual a la izquierda (texto grande, bold)
- Barra de busqueda global al centro
- A la derecha: icono de notificaciones (campana con badge de conteo), avatar del usuario con nombre y dropdown de "Account settings"
- Fondo blanco con borde inferior sutil
- Altura fija: aproximadamente 64-72px

**Zona 3 - Area de contenido principal:**
- Todo el espacio restante
- Fondo gris muy claro (#F7F8FA o similar)
- Padding generoso en todos los lados (24-32px)
- Aqui es donde vive el contenido de cada pantalla: cards, tablas, formularios, etc.
- Scroll vertical solo en esta zona (sidebar y header permanecen fijos)

### 2.2 Patron: Cards de resumen (Dashboard)

**Referencia:** dashlytemplate.webflow.io/dashboards/products y /dashboards/tasks

Las cards de resumen son bloques rectangulares con fondo blanco, border-radius de 12-16px, y sombra muy sutil. Dentro de cada card:

- Icono decorativo en la esquina superior izquierda (dentro de un circulo con fondo de color suave)
- Titulo de la metrica o modulo
- Dato principal grande (numero, conteo, porcentaje)
- Indicador de cambio o progreso (barra de progreso verde, flecha de tendencia)
- Menu de tres puntos (...) en la esquina superior derecha para acciones contextuales

**Uso en HESA:** Estas cards son ideales para el dashboard principal del panel:
- "Productos activos" (total de productos publicados)
- "Mensajes nuevos" (consultas sin atender)
- "Marcas registradas" (total de marcas en el sistema)
- "Productos destacados" (cantidad de productos en el carrusel del home)

### 2.3 Patron: Cards de contenido (vista principal de productos y marcas)

**Referencia:** dashlytemplate.webflow.io/features/companies en modo "Card view" y /features/projects

REGLA CRITICA: Para productos y marcas, la vista por defecto SIEMPRE debe ser CARDS, no listas/tablas. Las listas son apropiadas para datos tabulares puros (mensajes de contacto, logs), pero los productos y marcas son entidades visuales que se comprenden mejor con cards.

Cada card de producto debe mostrar:
- Imagen del producto (cuadrada o 4:3) en la parte superior de la card
- Nombre del producto (bold)
- Marca (texto secundario gris, o badge)
- Categoria (badge con color: azul para farmacos, verde para alimentos, gris para equipos)
- Estado: badge "Activo" (verde) o "Inactivo" (gris)
- Menu de tres puntos (...) para acciones: Editar, Ver en sitio, Desactivar/Activar, Eliminar

Cada card de marca debe mostrar:
- Logo de la marca (centrado, fondo neutro)
- Nombre de la marca (bold)
- Pais de origen (con icono de ubicacion)
- Badges de categorias que maneja
- Conteo de productos asociados

Las cards se organizan en grid: 3 columnas en pantallas grandes, 2 en medianas.

**Toggle de vista (Table view / Card view):**
Como se ve en Dashly en /features/companies, ofrecer un toggle para alternar entre "Card view" (defecto) y "Table view" (para cuando el usuario necesita ver muchos datos de forma compacta). El toggle son dos botones tipo pill, uno activo (fondo azul) y otro inactivo (fondo blanco con borde).

### 2.4 Patron: Tablas limpias

**Referencia:** dashlytemplate.webflow.io/features/table y /features/contacts

Las tablas se usan SOLO cuando los datos son tabulares por naturaleza y la representacion visual no agrega valor. En el caso de HESA, tablas son apropiadas para:
- Mensajes de contacto recibidos
- Historial de acciones
- Exportacion de datos

Caracteristicas de las tablas de Dashly que se deben copiar:
- Headers de columna en UPPERCASE, tamano pequeno (12-13px), color gris medio, con icono de ordenamiento (flechas arriba/abajo)
- Filas con fondo blanco, separadas por bordes horizontales muy sutiles (1px, gris clarisimo)
- Filas con hover: fondo gris muy suave
- Celdas con padding vertical generoso (16-20px) para que no se sienta apretado
- Avatar o icono al inicio de la fila cuando la entidad es una persona o empresa
- Badges de estado con colores: verde ("Paid"/"Activo"), rojo/naranja ("Unpaid"/"Pendiente"), gris ("Inactivo")
- Acciones al final de cada fila: iconos de ver (ojo), editar (lapiz), eliminar (papelera)
- Paginacion: "1 - 10 of 640" con flechas de navegacion, alineado a la derecha
- Checkbox de seleccion al inicio de cada fila para acciones masivas

### 2.5 Patron: Formularios (crear/editar)

**Referencia:** dashlytemplate.webflow.io/settings/v3

Los formularios son pantallas dedicadas (no modals, no inline). Cada formulario debe:

- Tener un titulo claro en la parte superior: "Crear producto" o "Editar: [Nombre del producto]"
- Organizar los campos en secciones logicas con subtitulos (bold, 18-20px) y descripcion corta debajo del subtitulo (gris, 14px)
- Usar layout de dos columnas para campos cortos (nombre + marca, categoria + especie) y una columna para campos largos (descripcion, notas)
- Labels visibles ARRIBA del campo (no dentro del campo como placeholder)
- Campos con fondo blanco, borde gris claro (1px), border-radius de 8-10px, padding interno generoso
- Separadores horizontales sutiles entre secciones
- Boton principal "Guardar" en azul HESA, alineado a la derecha o al final del formulario
- Boton secundario "Cancelar" en gris outline, al lado del boton principal
- Zona de carga de imagen con area de drag-and-drop: borde punteado, icono de nube/upload, texto "Arrastra una imagen o haz clic para seleccionar"
- Zona de carga de PDF (ficha tecnica) con el mismo patron
- Los campos obligatorios se marcan con asterisco rojo (*)

**Secciones del formulario de productos (ejemplo):**

Seccion 1: "Informacion basica"
- Nombre del producto (input texto)
- Marca (dropdown con busqueda)
- Categoria principal (dropdown: Farmaco / Alimento / Equipo)
- Estado (toggle switch: Activo / Inactivo)

Seccion 2: "Clasificacion y filtros"
- Especie(s) de destino (multi-select con checkboxes)
- Familia farmaceutica (dropdown, solo si la categoria es Farmaco)
- Etapa de vida (dropdown, solo si la categoria es Alimento)
- Tipo de equipo (dropdown, solo si la categoria es Equipo)
- Empresa del grupo que factura (dropdown, opcional)

Seccion 3: "Descripcion y contenido"
- Descripcion general (textarea)
- Formula / Composicion (textarea, solo si farmaco)
- Numero de registro sanitario (input texto, solo si farmaco)
- Indicaciones de uso (textarea, solo si farmaco)
- Ingredientes principales (textarea, solo si alimento)
- Informacion nutricional (textarea, solo si alimento)
- Especificaciones tecnicas (textarea, solo si equipo)
- Presentaciones disponibles (input tipo tag/chips: el usuario escribe y presiona enter para agregar cada presentacion)

Seccion 4: "Imagen y ficha tecnica"
- Imagen del producto (drag-and-drop, con preview de la imagen cargada)
- Ficha tecnica PDF (drag-and-drop, con nombre del archivo cargado)

Seccion 5: "Idiomas"
- Toggle o tabs para alternar entre Espanol e Ingles
- Los campos de texto (nombre, descripcion, indicaciones) se duplican para cada idioma

IMPORTANTE SOBRE CAMPOS CONDICIONALES: Los campos especificos de cada tipo de producto (farmaco, alimento, equipo) deben mostrarse u ocultarse dinamicamente segun la categoria seleccionada. Si el usuario selecciona "Farmaco", aparecen los campos de formula, registro sanitario e indicaciones. Si selecciona "Alimento", aparecen etapa de vida e ingredientes. Si selecciona "Equipo", aparecen especificaciones tecnicas. Esto evita que el formulario se sienta largo e intimidante.

### 2.6 Patron: Tabs de navegacion horizontal

**Referencia:** dashlytemplate.webflow.io/settings/v3 (tabs Account / Team / Billing / Notifications / API)

Cuando una pantalla necesita mostrar diferentes aspectos de un mismo modulo, usar tabs horizontales tipo pill en la parte superior del contenido. Cada tab tiene un icono + texto. El tab activo tiene fondo azul y texto blanco. Los tabs inactivos tienen fondo blanco con borde y texto gris.

**Uso en HESA:**
- En Settings: "Informacion del sitio" / "Textos del Home" / "Textos de Nosotros" / "Textos de Distribuidores"
- En Mensajes: "Todos" / "Sin leer" / "Atendidos"
- En el formulario de producto: "Espanol" / "Ingles" para los campos de contenido bilingue

### 2.7 Patron: Cards de categoria con icono y progreso

**Referencia:** dashlytemplate.webflow.io/features/projects y /dashboards/tasks

Las cards de categoria del dashboard de Tasks son ideales para representar los modulos del panel HESA. Cada card tiene:
- Icono grande en un circulo con fondo de color suave (cada modulo con su color)
- Nombre del modulo (bold, 18-20px)
- Descripcion corta (gris, 14px)
- Dato de progreso o conteo (barra de progreso o numero)
- Menu de tres puntos (...) para acciones rapidas

**Uso en HESA:** El dashboard principal puede mostrar cards de acceso rapido a cada modulo:
- Card "Farmacos" con icono de medicamento, conteo de productos, color azul
- Card "Alimentos" con icono de plato/comida, conteo de productos, color verde
- Card "Equipos" con icono de herramienta, conteo de productos, color gris
- Card "Mensajes" con icono de sobre, conteo de mensajes sin leer, color naranja

### 2.8 Patron: Columnas Kanban (para mensajes de contacto)

**Referencia:** dashlytemplate.webflow.io/features/board

El board tipo Kanban muestra cards organizadas en columnas. Cada columna tiene un titulo en uppercase y un conteo. Las cards dentro de cada columna tienen: badge de tipo, titulo, descripcion corta, y metadata.

**Uso en HESA:** Los mensajes de contacto pueden mostrarse en formato Kanban:
- Columna "Nuevos" (sin leer)
- Columna "En proceso" (leidos, en atencion)
- Columna "Atendidos" (resueltos)

El usuario puede arrastrar una card de una columna a otra para cambiar su estado. Esto es mas visual e intuitivo que cambiar un dropdown de estado en una tabla.

### 2.9 Patron: Busqueda global

**Referencia:** Barra de busqueda en el header de todas las paginas de Dashly.

La busqueda global en el header debe buscar en: productos (por nombre), marcas (por nombre), mensajes (por nombre del contacto o contenido). Los resultados se muestran en un dropdown debajo del campo de busqueda, agrupados por tipo (Productos, Marcas, Mensajes), con icono y nombre de cada resultado.

### 2.10 Microinteracciones y estados

- **Hover en cards:** Elevacion de sombra sutil + borde mas visible. Transicion 0.2s.
- **Hover en filas de tabla:** Fondo gris muy suave. Transicion 0.15s.
- **Click en toggle (Table/Card view):** Transicion animada del contenido (fade).
- **Apertura de dropdowns:** Slide-down suave, 0.2s.
- **Carga de imagen:** Preview inmediato con barra de progreso.
- **Guardado exitoso:** Toast notification en la esquina superior derecha. Fondo verde, texto blanco, icono de check. Desaparece despues de 3 segundos.
- **Error de validacion:** Borde del campo en rojo, mensaje de error debajo del campo en texto rojo pequeno. Aparece inmediatamente al detectar el error (no esperar al submit).
- **Confirmacion de eliminacion:** Modal centrado con fondo overlay oscuro. Titulo "Estas seguro?", descripcion del impacto, boton "Eliminar" en rojo y boton "Cancelar" en gris.
- **Badge de notificacion:** Circulo rojo con numero blanco sobre el icono de campana. Animacion de pulse sutil al recibir nueva notificacion.

---

## 3. PALETA DE COLORES DEL PANEL

| Color | Codigo | Uso |
|---|---|---|
| Azul HESA | #008DC9 | Sidebar activo, botones principales, links, tabs activos |
| Azul suave (fondo) | #EBF5FF | Fondo del item activo en sidebar, fondo de badges azules |
| Verde exito | #22C55E | Badges "Activo", toast de exito, indicadores positivos |
| Verde suave (fondo) | #DCFCE7 | Fondo de badges de alimentos, fondo de estados exitosos |
| Rojo error | #EF4444 | Badges "Inactivo", errores de validacion, boton eliminar |
| Rojo suave (fondo) | #FEE2E2 | Fondo de badges de error, fondo de alertas |
| Naranja atencion | #F59E0B | Badges "Pendiente", indicadores de mensajes sin leer |
| Naranja suave (fondo) | #FEF3C7 | Fondo de badges de atencion |
| Gris oscuro (texto) | #1F2937 | Titulos, texto principal |
| Gris medio (texto) | #6B7280 | Texto secundario, descriptions, placeholders |
| Gris claro (bordes) | #E5E7EB | Bordes de campos, separadores de tabla, divisores |
| Gris muy claro (fondos) | #F7F8FA | Fondo del area de contenido principal |
| Blanco | #FFFFFF | Fondo de cards, fondo de sidebar, fondo de campos de formulario |

---

## 4. PANTALLAS DEL PANEL

### 4.1 Dashboard (pantalla de inicio)

**Proposito:** Vista general rapida del estado del sitio. Es lo primero que el usuario ve al iniciar sesion.

**Contenido:**

**Fila superior - Cards de resumen (4 columnas):**
- Card 1: "Total de productos" con icono de caja, numero grande, badge "X activos"
- Card 2: "Mensajes nuevos" con icono de sobre, numero grande con badge naranja si hay pendientes
- Card 3: "Marcas registradas" con icono de etiqueta, numero grande
- Card 4: "Productos destacados" con icono de estrella, numero grande de "X en carrusel del home"

**Fila intermedia - Cards de acceso rapido por categoria (3 columnas):**
Siguiendo el patron de Projects de Dashly:
- Card "Farmacos": icono de capsula en circulo azul, nombre "Farmacos", "X productos activos", barra de progreso mostrando proporcion del total
- Card "Alimentos": icono de plato en circulo verde, nombre "Alimentos", "X productos activos"
- Card "Equipos": icono de herramienta en circulo gris, nombre "Equipos", "X productos activos"

Cada card es clickable y lleva al listado filtrado de esa categoria.

**Fila inferior - Dos columnas:**
- Columna izquierda: "Ultimos mensajes" (mini-tabla con los 5 mensajes mas recientes: nombre, tipo, fecha, estado). Link "Ver todos" en la esquina superior derecha de la card.
- Columna derecha: "Actividad reciente" (lista de las ultimas acciones realizadas en el panel: "Se creo producto X", "Se edito marca Y", "Se atendio mensaje de Z"). Cada item con icono, texto y timestamp.

---

### 4.2 Productos - Listado

**Proposito:** Ver, buscar y gestionar todos los productos del catalogo.

**Pantalla: Listado de productos**

**Barra de herramientas superior:**
- Titulo: "Productos" (grande, bold)
- Subtitulo: "Gestiona el catalogo de productos del sitio web"
- Boton principal: "+ Crear producto" (azul HESA, esquina superior derecha, con icono de +)

**Barra de filtros (debajo del titulo):**
- Busqueda por nombre (input con icono de lupa)
- Filtro por categoria (dropdown: Todos / Farmacos / Alimentos / Equipos)
- Filtro por marca (dropdown con busqueda)
- Filtro por estado (dropdown: Todos / Activos / Inactivos)
- Toggle de vista: "Card view" (defecto) / "Table view"

**Vista Card (defecto):**
Grid de cards de productos (3 columnas). Cada card muestra:
- Imagen del producto (arriba, proporcion cuadrada, fondo gris claro si no hay imagen)
- Nombre del producto (bold, 16px)
- Marca (texto gris, 14px)
- Badge de categoria (color segun tipo: azul "Farmaco", verde "Alimento", gris "Equipo")
- Badge de estado (verde "Activo" o gris "Inactivo")
- Menu de tres puntos (...): Editar, Ver en sitio, Duplicar, Desactivar, Eliminar

**Vista Table (alternativa):**
Tabla con columnas: checkbox, Imagen (miniatura 40x40), Nombre, Marca, Categoria (badge), Especie (badges), Estado (badge), Acciones (editar/eliminar)

**Paginacion:** Al final, "Mostrando 1-24 de X productos" con controles de pagina.

**Estado vacio:** Si no hay productos, mostrar ilustracion simple + mensaje "No hay productos aun" + boton "Crear tu primer producto".

---

### 4.3 Productos - Crear / Editar

**Proposito:** Formulario dedicado para crear un nuevo producto o editar uno existente. Es una pantalla completa separada del listado.

**Pantalla: Formulario de producto**

**Header del formulario:**
- Breadcrumb: "Productos > Crear producto" o "Productos > Editar: [Nombre]"
- Titulo: "Crear producto" o "Editar producto"
- Botones de accion (esquina superior derecha): "Cancelar" (gris outline) y "Guardar producto" (azul HESA)

**Seccion 1: Informacion basica**
- Subtitulo: "Informacion basica"
- Descripcion: "Datos principales del producto"
- Campos (2 columnas):
  - Nombre del producto (ES) *
  - Nombre del producto (EN)
  - Marca * (dropdown con busqueda)
  - Empresa del grupo (dropdown, opcional)
- Campo (1 columna):
  - Categoria * (selector visual con 3 opciones tipo card pequena: Farmaco con icono de capsula, Alimento con icono de plato, Equipo con icono de herramienta. La opcion seleccionada tiene borde azul HESA)

**Seccion 2: Clasificacion** (los campos cambian segun la categoria seleccionada arriba)
- Subtitulo: "Clasificacion y filtros"
- Descripcion: "Estos datos permiten que los usuarios filtren y encuentren el producto en el catalogo"

Si categoria = Farmaco:
- Especie(s) de destino * (multi-select con checkboxes visuales: Caninos, Felinos, Bovinos, Equinos, Aves, Porcinos, Otros)
- Familia farmaceutica * (dropdown: Antibioticos, Desparasitantes, Vitaminas, Antiinflamatorios, Suplementos, Otros)

Si categoria = Alimento:
- Especie de destino * (multi-select)
- Etapa de vida (dropdown: Cachorro/Kitten, Adulto, Senior, Todas las etapas)

Si categoria = Equipo:
- Tipo de equipo * (dropdown)

Siempre visible:
- Presentaciones disponibles (input tipo tags/chips)
- Estado * (toggle switch con label: "Producto visible en el sitio web")

**Seccion 3: Descripcion y contenido tecnico**
- Subtitulo: "Descripcion"
- Tabs de idioma: "Espanol" / "Ingles" (tipo pills como en Settings de Dashly)

Dentro de cada tab:
- Descripcion general (textarea, 4 lineas)

Campos adicionales segun categoria (fuera de los tabs de idioma, o dentro si el contenido es bilingue):

Si Farmaco:
- Formula / Composicion (textarea)
- Numero de registro sanitario (input texto)
- Indicaciones de uso (textarea)

Si Alimento:
- Ingredientes principales (textarea)
- Informacion nutricional (textarea, opcional)

Si Equipo:
- Especificaciones tecnicas (textarea)
- Garantia (input texto, opcional)

**Seccion 4: Imagen y documentos**
- Subtitulo: "Imagen y ficha tecnica"
- Descripcion: "La imagen se mostrara en el catalogo y en el detalle del producto"
- Zona de imagen: Drag-and-drop grande (200x200px minimo), con preview de la imagen cargada. Si ya hay imagen, mostrarla con boton "Cambiar imagen" y "Eliminar"
- Zona de PDF: Drag-and-drop para ficha tecnica. Si ya hay PDF, mostrar nombre del archivo, tamano, y botones "Descargar" y "Eliminar"

**Seccion 5: Acciones finales**
- Separador horizontal
- Boton "Cancelar" (gris outline, a la izquierda)
- Boton "Guardar producto" (azul HESA, a la derecha)
- Si estamos editando, agregar boton "Eliminar producto" (rojo outline) en el extremo izquierdo, separado de los otros dos botones

---

### 4.4 Productos - Detalle (vista de solo lectura)

**Proposito:** Ver toda la informacion de un producto sin entrar en modo edicion. Util para verificar como se ve la informacion antes de publicarla.

**Pantalla: Detalle de producto**

- Breadcrumb: "Productos > [Nombre del producto]"
- Layout de dos columnas:
  - Izquierda: Imagen del producto (grande), boton "Ver en el sitio web" (link externo)
  - Derecha: Toda la informacion organizada en bloques con labels en gris y valores en negro. Badges de categoria, especie, estado.
- Boton "Editar producto" (azul HESA, esquina superior derecha)
- Link "Descargar ficha tecnica" si hay PDF adjunto

---

### 4.5 Marcas - Listado

**Proposito:** Ver y gestionar todas las marcas registradas.

**Pantalla: Listado de marcas**

**Barra de herramientas superior:**
- Titulo: "Marcas"
- Subtitulo: "Gestiona las marcas que HESA representa"
- Boton: "+ Agregar marca" (azul HESA)

**Vista (Card view por defecto):**
Grid de cards (3 columnas). Cada card de marca:
- Logo de la marca (centrado, con fondo gris muy claro, area de 80x80px)
- Nombre de la marca (bold)
- Pais de origen (con icono de ubicacion, gris)
- Badges de categorias que maneja (Farmacos, Alimentos, Equipos)
- Conteo: "X productos"
- Menu de tres puntos (...): Editar, Ver productos de esta marca, Eliminar

**Toggle a Table view** disponible, con columnas: Logo (miniatura), Nombre, Pais, Categorias (badges), Productos (conteo), Acciones.

---

### 4.6 Marcas - Crear / Editar

**Pantalla: Formulario de marca**

Formulario mas corto que el de productos. Una sola seccion:

- Logo de la marca (drag-and-drop, preview circular o cuadrado con border-radius)
- Nombre de la marca * (input texto)
- Pais de origen * (dropdown con lista de paises)
- Categorias que maneja * (multi-select visual con checkboxes: Farmacos, Alimentos, Equipos)
- Descripcion (ES) (textarea, 3 lineas)
- Descripcion (EN) (textarea, 3 lineas)
- Botones: "Cancelar" y "Guardar marca"

---

### 4.7 Categorias - Gestion

**Proposito:** Administrar las categorias principales y sus subcategorias/filtros.

**Pantalla: Gestion de categorias**

Esta pantalla muestra las tres categorias principales (Farmacos, Alimentos, Equipos) como cards grandes expandibles. Dentro de cada card, se ven las subcategorias/filtros como una lista editable:

- Card "Farmacos":
  - Subseccion "Familias farmaceuticas": Lista de tags editables (Antibioticos, Desparasitantes, etc.) con boton "+" para agregar nueva y "x" para eliminar
  - Subseccion "Especies": Lista de tags editables

- Card "Alimentos":
  - Subseccion "Etapas de vida": Lista de tags editables
  - Subseccion "Especies": Lista de tags editables

- Card "Equipos":
  - Subseccion "Tipos de equipo": Lista de tags editables

Cada tag es un chip/pill editable. Al hacer clic en el "+", aparece un input inline para escribir el nombre y confirmar.

---

### 4.8 Contenido del Home - Gestion

**Proposito:** Administrar los elementos del home del sitio publico.

**Pantalla: Gestion del Home**

**Tabs superiores:** "Hero" / "Productos destacados" / "Marcas destacadas"

**Tab Hero:**
- Preview de la imagen actual del hero (grande)
- Boton "Cambiar imagen"
- Campos de texto del hero:
  - Tag superior (ES/EN): input texto
  - Headline (ES/EN): input texto
  - Subtitulo (ES/EN): input texto
  - Texto del CTA primario (ES/EN): input texto
  - Texto del CTA secundario (ES/EN): input texto
- Boton "Guardar cambios"

**Tab Productos destacados:**
- Titulo: "Productos que aparecen en el carrusel del Home"
- Descripcion: "Selecciona los productos que quieres destacar. Arrastra para reordenar."
- Lista de productos actualmente destacados (cards pequenas horizontales: miniatura + nombre + marca + boton "X" para remover)
- Boton "+ Agregar producto" que abre un modal de busqueda/seleccion:
  - El modal muestra una lista de todos los productos activos
  - Busqueda por nombre
  - Filtro por categoria
  - Cada producto tiene un checkbox para seleccionarlo
  - Boton "Agregar seleccionados"
- Drag-and-drop para reordenar los productos destacados

**Tab Marcas destacadas:**
- Mismo patron que Productos destacados, pero para seleccionar que logos de marca aparecen en la seccion de marcas del Home

---

### 4.9 Contenido estatico - Gestion

**Proposito:** Editar los textos de las paginas estaticas del sitio (Nosotros, Distribuidores, Contacto).

**Pantalla: Contenido estatico**

**Tabs superiores:** "Nosotros" / "Distribuidores" / "Contacto" / "Politicas comerciales"

Cada tab muestra un formulario con los campos de texto de esa pagina, organizados por seccion. Cada campo tiene version ES e EN (usando sub-tabs o campos duplicados).

Los campos son: titulos, subtitulos, parrafos de texto, y en algunos casos imagenes.

No es un editor WYSIWYG complejo. Son campos de texto simples y textareas. La estructura de la pagina esta definida por el diseno; el usuario solo cambia el contenido de texto.

---

### 4.10 Mensajes de contacto

**Proposito:** Ver, gestionar y responder a las consultas recibidas a traves de los formularios del sitio.

**Pantalla: Mensajes**

**Dos vistas disponibles (toggle):**

**Vista Kanban (defecto):**
Tres columnas estilo Board de Dashly:
- Columna "Nuevos" (con conteo y badge naranja)
- Columna "En proceso"
- Columna "Atendidos"

Cada card de mensaje:
- Badge de tipo (color): "Informacion de productos" (azul), "Condiciones comerciales" (verde), "Soporte" (naranja), "Fabricante" (morado), "Otro" (gris)
- Nombre del contacto (bold)
- Correo electronico (gris, 14px)
- Primeras 2 lineas del mensaje (truncado)
- Fecha de recepcion (gris, 12px)
- Si tiene producto de interes: mini-badge con nombre del producto

Drag-and-drop para mover mensajes entre columnas.

**Vista Table (alternativa):**
Tabla con columnas: Nombre, Correo, Telefono, Tipo (badge), Producto (si aplica), Fecha, Estado (badge), Acciones (ver/eliminar).

**Acciones adicionales:**
- Boton "Exportar CSV" en la barra de herramientas
- Filtro por tipo de consulta
- Filtro por estado
- Busqueda por nombre o correo

**Pantalla: Detalle de mensaje (al hacer clic en un mensaje):**
- Pantalla completa con toda la informacion del mensaje
- Datos del contacto (nombre, correo, telefono) en una card lateral
- Contenido completo del mensaje
- Producto de interes (si aplica, con link al producto en el panel)
- Estado (dropdown para cambiar)
- Notas internas (textarea para que el equipo agregue notas sobre el seguimiento)
- Boton "Marcar como atendido"
- Timestamp de cuando se recibio

---

### 4.11 Configuracion

**Proposito:** Ajustes generales del sitio y del panel.

**Pantalla: Configuracion**

**Tabs superiores** (estilo Settings de Dashly): "General" / "Contacto" / "Redes sociales" / "SEO"

**Tab General:**
- Logo del sitio (drag-and-drop, preview)
- Nombre de la empresa
- Selector de idioma por defecto del sitio

**Tab Contacto:**
- Telefono principal
- Correo electronico general
- Direccion fisica
- Horario de atencion
- Numero de WhatsApp para boton flotante

**Tab Redes sociales:**
- URL de Facebook
- URL de Instagram
- Otros (campos opcionales)

**Tab SEO:**
- Meta titulo general del sitio (ES/EN)
- Meta descripcion general del sitio (ES/EN)
- Imagen para compartir en redes (OG Image)

---

## 5. NAVEGACION DEL SIDEBAR

La navegacion lateral debe estar organizada asi:

```
[Logo HESA]

--- Navegacion principal ---

[icono dashboard] Dashboard
[icono caja] Productos          >
[icono etiqueta] Marcas         >
[icono carpeta] Categorias
[icono estrella] Home            >
[icono pagina] Contenido        >
[icono sobre] Mensajes          [badge de conteo]

--- Separador ---

[icono engranaje] Configuracion  >
```

Los items con ">" tienen submenu expandible:
- Productos: Todos los productos / Farmacos / Alimentos / Equipos
- Marcas: Todas las marcas
- Home: Hero / Productos destacados / Marcas destacadas
- Contenido: Nosotros / Distribuidores / Contacto / Politicas comerciales
- Configuracion: General / Contacto / Redes sociales / SEO

El item activo tiene fondo azul suave (#EBF5FF) y texto azul HESA (#008DC9) con icono en azul. Los items inactivos tienen texto gris oscuro e icono gris.

---

## 6. PRINCIPIOS DE DISENO PARA AGENTES

### Lo que SI deben hacer

1. **Cards sobre listas, siempre que sea posible.** Productos = cards con imagen. Marcas = cards con logo. Solo usar tablas para datos puramente tabulares (mensajes, historial).

2. **Una accion por pantalla.** La pantalla de listado es para VER y BUSCAR. La pantalla de formulario es para CREAR o EDITAR. No mezclar.

3. **Espacio, espacio, espacio.** Padding de 24-32px en el area de contenido. Gap de 20-24px entre cards. Padding de 16-20px dentro de las cards. Margenes generosos entre secciones de formulario.

4. **Iconos en todo.** Cada modulo del sidebar tiene icono. Cada card de resumen tiene icono. Los badges de categoria tienen color. Los botones de accion tienen icono. Los campos de busqueda tienen icono de lupa. Esto hace que el panel se sienta pulido y profesional.

5. **Badges de color para estados y categorias.** Nunca mostrar un estado como texto plano. Siempre usar badges con color: verde para activo/atendido, naranja para pendiente, rojo para error/inactivo, azul para farmaco, verde para alimento, gris para equipo.

6. **Confirmaciones para acciones destructivas.** Eliminar un producto siempre muestra un modal de confirmacion. Desactivar un producto muestra toast de confirmacion con opcion de "Deshacer".

7. **Feedback visual inmediato.** Al guardar, toast verde. Al haber error, borde rojo en el campo. Al cargar imagen, preview inmediato. Al cambiar estado de mensaje (drag-and-drop), animacion suave.

8. **Responsive si, pero desktop-first.** El panel se usa principalmente en desktop. En tablet debe funcionar con sidebar colapsable. En mobile, sidebar se convierte en hamburger menu.

### Lo que NO deben hacer

1. **No usar listas planas para productos.** Una lista de "Producto 1, Producto 2, Producto 3" sin imagen es inaceptable. Los productos son entidades visuales; merecen cards con imagen.

2. **No amontonar acciones en una pantalla.** Si el usuario puede crear, editar, ver listado, y configurar filtros en una misma pantalla, esta mal.

3. **No usar modals para formularios largos.** Los modals son para confirmaciones y selecciones rapidas. El formulario de crear/editar producto es una pantalla completa.

4. **No dejar formularios largos sin secciones.** Un formulario de 20 campos sin separadores es intimidante. Secciones con subtitulo + descripcion hacen que se sienta manejable.

5. **No mostrar campos que no aplican.** Si el producto es un Alimento, los campos de "Registro sanitario" y "Formula farmaceutica" NO deben aparecer. Campos condicionales segun categoria.

6. **No asumir que el usuario sabe.** Cada seccion del formulario tiene un subtitulo explicativo. Los campos con formato especial tienen placeholder de ejemplo. Los botones dicen exactamente lo que hacen ("Guardar producto", no solo "Guardar").

7. **No olvidar los estados vacios.** Cada listado debe tener un estado vacio disehado: ilustracion simple + mensaje + CTA para crear el primer elemento.

---

## 7. CHECKLIST DE VERIFICACION DEL PANEL

Antes de considerar completa cualquier pantalla del panel:

- [ ] La pantalla tiene un solo proposito claro (ver, crear, editar, o configurar)?
- [ ] Los productos y marcas se muestran como cards con imagen/logo, no como listas planas?
- [ ] Los formularios estan organizados en secciones con subtitulos?
- [ ] Los campos condicionales se muestran/ocultan segun la categoria seleccionada?
- [ ] Hay suficiente espacio entre elementos (padding, gap, margin)?
- [ ] Todos los estados tienen badge con color (no texto plano)?
- [ ] Los iconos acompanan a los elementos de navegacion, cards de resumen, y badges?
- [ ] Las acciones destructivas tienen confirmacion?
- [ ] Los estados vacios estan disenados (no solo un mensaje de texto)?
- [ ] La pantalla se siente como una herramienta hecha a la medida, no como un CRUD generico?
- [ ] El flujo de navegacion es claro: Listado > Crear/Editar > Detalle?
- [ ] El toggle Card view / Table view esta disponible en listados de productos y marcas?
- [ ] Los toast notifications aparecen despues de guardar, eliminar, o cambiar estado?
- [ ] El panel refleja la misma calidad visual que el sitio publico?

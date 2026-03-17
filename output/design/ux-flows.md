# UX Flows — HESA (Herrera y Elizondo S.A.)

**Generado por**: UX Flow Designer
**Fecha**: 2026-03-17
**Version**: 1.0
**Fuentes**: design-distribution.md, visual-analysis.md, requirements.md, architecture.md
**Total pantallas documentadas**: 25 (10 sitio publico + 15 panel admin)
**Total flujos de usuario**: 8 (5 criticos + 3 complementarios)
**DEMO-xxx cubiertos**: 40 de 45 (como principal o soporte)

---

## 1. Mapa de Navegacion

### 1.1 Sitio Publico

```
[Header Sticky — presente en todas las paginas]
  Logo HESA (izq) ──> /es/
  Menu (centro/der):
    Inicio ──> /es/
    Catalogo ──> /es/catalogo
      └─ Submenu (hover desktop / tap mobile):
         Farmacos ──> /es/catalogo/farmacos
         Alimentos ──> /es/catalogo/alimentos
         Equipos ──> /es/catalogo/equipos
    Marcas ──> /es/marcas
    Nosotros ──> /es/nosotros
    Distribuidores ──> /es/distribuidores
    Contacto ──> /es/contacto
  Iconos utilidad (der):
    Lupa ──> Search Overlay (full-width)
    Selector idioma (ES/EN) ──> cambia prefijo /es/ <-> /en/

[Footer — presente en todas las paginas]
  Logo HESA + tagline
  Nav rapida: Home, Catalogo, Marcas, Nosotros, Distribuidores, Contacto
  Contacto: tel, email, direccion, horario
  Redes sociales: Facebook, Instagram
  Selector idioma ES/EN
  Copyright (c) 2026

[WhatsApp FAB — presente en todas las paginas]
  Esquina inferior derecha ──> api.whatsapp.com con mensaje pre-configurado
```

**Arbol de rutas publicas:**

```
/
├── /es/                                         (Home)
│   ├── /es/catalogo                             (Catalogo General — todos los productos)
│   │   ├── /es/catalogo/farmacos                (Catalogo Farmacos)
│   │   ├── /es/catalogo/alimentos               (Catalogo Alimentos)
│   │   ├── /es/catalogo/equipos                 (Catalogo Equipos)
│   │   ├── /es/catalogo/farmacos/[slug]         (Detalle producto farmaco)
│   │   ├── /es/catalogo/alimentos/[slug]        (Detalle producto alimento)
│   │   └── /es/catalogo/equipos/[slug]          (Detalle producto equipo)
│   ├── /es/marcas                               (Listado de Marcas)
│   │   └── /es/marcas/[slug]                    (Marca individual)
│   ├── /es/nosotros                             (Pagina Nosotros)
│   ├── /es/distribuidores                       (Pagina Distribuidores)
│   ├── /es/contacto                             (Pagina Contacto)
│   └── /es/busqueda?q=[termino]                 (Resultados busqueda)
│
├── /en/                                         (Home EN)
│   ├── /en/catalog                              (General Catalog)
│   │   ├── /en/catalog/pharmaceuticals          (Pharma Catalog)
│   │   ├── /en/catalog/food                     (Food Catalog)
│   │   ├── /en/catalog/equipment                (Equipment Catalog)
│   │   ├── /en/catalog/pharmaceuticals/[slug]   (Product detail)
│   │   ├── /en/catalog/food/[slug]              (Product detail)
│   │   └── /en/catalog/equipment/[slug]         (Product detail)
│   ├── /en/brands                               (Brand listing)
│   │   └── /en/brands/[slug]                    (Brand page)
│   ├── /en/about                                (About page)
│   ├── /en/distributors                         (Distributors page)
│   ├── /en/contact                              (Contact page)
│   └── /en/search?q=[term]                      (Search results)
│
└── / (raiz) ──> redirige a /es/ o /en/ segun idioma del navegador
```

### 1.2 Panel de Administracion

```
[Sidebar fijo 272px — presente en todas las pantallas post-login]
  Logo HESA (top)
  ─────────────────
  Dashboard                    ──> /admin/dashboard
  Productos                    ──> /admin/productos
    └─ Todos                   ──> /admin/productos
    └─ Farmacos                ──> /admin/productos?categoria=farmacos
    └─ Alimentos               ──> /admin/productos?categoria=alimentos
    └─ Equipos                 ──> /admin/productos?categoria=equipos
  Marcas                       ──> /admin/marcas
  Categorias                   ──> /admin/categorias
  Home                         ──> /admin/home
    └─ Hero                    ──> /admin/home/hero
    └─ Productos destacados    ──> /admin/home/productos-destacados
    └─ Marcas destacadas       ──> /admin/home/marcas-destacadas
  Contenido                    ──> /admin/contenido
    └─ Nosotros                ──> /admin/contenido/nosotros
    └─ Equipo de Liderazgo     ──> /admin/contenido/equipo
    └─ Distribuidores          ──> /admin/contenido/distribuidores
    └─ Contacto                ──> /admin/contenido/contacto
    └─ Politicas comerciales   ──> /admin/contenido/politicas
  Mensajes (badge: 3)          ──> /admin/mensajes
  Configuracion                ──> /admin/configuracion
    └─ General                 ──> /admin/configuracion/general
    └─ Contacto                ──> /admin/configuracion/contacto
    └─ Redes sociales          ──> /admin/configuracion/redes
    └─ SEO                     ──> /admin/configuracion/seo

[Header panel 68px — presente en todas las pantallas post-login]
  Titulo seccion (izq)
  Search bar global (centro)
  Notificaciones campana + badge (der)
  Avatar + nombre usuario + dropdown (der)
    └─ Cerrar sesion
```

**Arbol de rutas del panel:**

```
/admin/
├── /admin/login                              (Login Azure Entra ID)
├── /admin/dashboard                          (Dashboard principal)
├── /admin/productos                          (Listado productos — card/table)
│   ├── /admin/productos/crear                (Formulario crear producto)
│   ├── /admin/productos/:id                  (Detalle producto solo lectura)
│   └── /admin/productos/:id/editar           (Formulario editar producto)
├── /admin/marcas                             (Listado marcas — card/table)
│   ├── /admin/marcas/crear                   (Formulario crear marca)
│   └── /admin/marcas/:id/editar              (Formulario editar marca)
├── /admin/categorias                         (Categorias con tags editables)
├── /admin/home                               (Gestion Home — tabs)
│   ├── /admin/home/hero                      (Editor hero)
│   ├── /admin/home/productos-destacados      (Selector productos destacados)
│   └── /admin/home/marcas-destacadas         (Selector marcas destacadas)
├── /admin/contenido                          (Contenido estatico — tabs)
│   ├── /admin/contenido/nosotros             (Editor Nosotros)
│   ├── /admin/contenido/equipo               (Gestion Equipo Liderazgo)
│   ├── /admin/contenido/distribuidores       (Editor Distribuidores)
│   ├── /admin/contenido/contacto             (Editor Contacto)
│   └── /admin/contenido/politicas            (Editor Politicas comerciales)
├── /admin/mensajes                           (Mensajes — kanban/tabla)
│   └── /admin/mensajes/:id                   (Detalle mensaje)
└── /admin/configuracion                      (Configuracion — tabs)
    ├── /admin/configuracion/general          (General)
    ├── /admin/configuracion/contacto         (Contacto)
    ├── /admin/configuracion/redes            (Redes sociales)
    └── /admin/configuracion/seo              (SEO)
```

---

## 2. Flujos de Usuario

### Flujo 1 (CRITICO): Visitante busca producto y solicita informacion

**Persona**: Cliente local (veterinaria, pet shop, groomer)
**Objetivo**: Encontrar un producto especifico y solicitar informacion comercial
**Entrada**: Home del sitio publico

```
1. Visitante aterriza en /es/ (Home)
   └─ Ve el header sticky con lupa de busqueda

2. Clic en icono lupa del header
   └─ Se abre search overlay full-width con fondo oscuro semi-transparente
   └─ Input grande centrado (font 20px), cursor auto-focus
   └─ Estado: Esperando input

3. Escribe "amoxicilina" (min 3 caracteres para activar predicciones)
   └─ Dropdown de predicciones aparece debajo del input
   └─ Resultados agrupados: "Productos (3)" y "Marcas (1)"
   └─ Cada resultado: thumbnail 40x40 + nombre + tipo badge
   └─ Si no hay resultados: "No se encontraron resultados para 'amoxicilina'"
      con link "Ver catalogo completo"

4. Clic en resultado "Amoxicilina 250ml — Zoofarma" (o presiona Enter)
   └─ Navega a /es/catalogo/farmacos/amoxicilina-250ml
   └─ Search overlay se cierra

5. Pagina Detalle de Producto carga
   └─ Skeleton screen: 2 columnas (izq bloque gris, der lineas animadas)
   └─ Contenido carga: galeria izq (55%) + info der (45%)
   └─ Breadcrumb: Inicio > Catalogo > Farmacos > Amoxicilina 250ml
   └─ Galeria: thumbnails verticales + imagen principal
   └─ Info: nombre bold 32px, marca "Zoofarma" con link,
     badges especie (Caninos, Bovinos),
     pills presentaciones (100ml, 250ml, 500ml),
     composicion, registro sanitario, indicaciones

6. Visitante revisa la informacion, ve los CTAs:
   └─ Boton primario: "Solicitar informacion" (#008DC9)
   └─ Boton secundario: "Consultar por WhatsApp" (verde)
   └─ Boton outline: "Descargar ficha tecnica" (solo si hay PDF)

7. Clic en "Solicitar informacion"
   └─ Navega a /es/contacto?producto=amoxicilina-250ml
   └─ Campo "Producto de interes" llega pre-llenado con "Amoxicilina 250ml"

8. Completa formulario de contacto:
   └─ Nombre*, Correo electronico*, Telefono, Tipo de consulta* (dropdown),
     Producto de interes (pre-llenado), Mensaje*
   └─ Validacion inline en blur: campos obligatorios, formato email
   └─ Errores: texto rojo bajo el campo con descripcion del error

9. Clic en "Enviar consulta"
   └─ Boton se deshabilita, muestra spinner
   └─ Si exito: mensaje de confirmacion "Gracias por tu consulta.
     Nos pondremos en contacto pronto." + campos se limpian
   └─ Si error: mensaje de error "No pudimos enviar tu mensaje.
     Intenta de nuevo." + datos del formulario se mantienen + boton retry

10. Alternativa — Paso 6b: Clic en "Consultar por WhatsApp"
    └─ Abre WhatsApp (web o app) con mensaje pre-configurado:
      "Hola, me interesa el producto Amoxicilina 250ml de Zoofarma.
       Me gustaria recibir informacion."
```

**Flujo alternativo — Sticky bar:**
```
6a. Visitante hace scroll hacia abajo pasada la seccion de info principal
    └─ Barra sticky aparece en top (desktop) / bottom (mobile)
    └─ Muestra: thumbnail + nombre + marca + boton "Solicitar informacion"
    └─ Clic en "Solicitar informacion" -> mismo paso 7
    └─ Si hace scroll hacia arriba y la info principal vuelve a ser visible,
       la barra sticky desaparece
```

---

### Flujo 2 (CRITICO): Fabricante internacional evalua a HESA como distribuidor

**Persona**: Ejecutivo de fabrica de farmacos veterinarios en Asia
**Objetivo**: Evaluar a HESA como distribuidor potencial en Costa Rica
**Entrada**: Busqueda Google "veterinary distributor Costa Rica"

```
1. Fabricante aterriza en /en/ (Home EN)
   └─ Detecta idioma ingles del navegador, o usa selector EN
   └─ Hero: "37 Years of Veterinary Excellence in Costa Rica"
   └─ Ve CTA secundario: "Partner with us"

2. Clic en "Partner with us"
   └─ Navega a /en/distributors

3. Pagina Distribuidores carga en ingles:
   └─ Hero: "Partner with HESA — Your Gateway to Costa Rica's
     Veterinary Market" + CTA "Start the Conversation"
   └─ Seccion "Why Choose HESA": grid 3x2 con 6 beneficios
     (37 years, national coverage, exclusive veterinary focus,
      established infrastructure, strong relationships, regulatory knowledge)
   └─ Logo wall: marcas que confian en HESA (grayscale, hover color)
   └─ Timeline: 4 pasos del proceso de partnership
     1. Initial Contact → 2. Product Evaluation →
     3. Terms Negotiation → 4. Distribution Launch
   └─ Formulario de fabricante al final

4. Revisa la seccion de beneficios y logos (validacion social)
   └─ Scroll natural, animaciones fade-in al entrar viewport
   └─ Timeline se anima secuencialmente al scroll

5. Llega al formulario de fabricante:
   └─ Campos: Company Name*, Country of Origin*, Contact Name*,
     Email*, Phone, Product Types, Message*, Terms checkbox
   └─ Labels y placeholders en ingles

6. Completa el formulario y enviar:
   └─ Validacion inline en blur (campos obligatorios, formato email)
   └─ Boton "Send Inquiry" se deshabilita post-clic, spinner
   └─ Exito: "Thank you for your interest. We'll be in touch shortly."
   └─ Error: "Something went wrong. Please try again." + datos mantenidos

7. Mensaje se almacena en panel como tipo "Fabricante" (badge morado)
   └─ Notificacion email a hola@linkdesign.cr
```

---

### Flujo 3 (CRITICO): Admin crea un producto nuevo

**Persona**: Administrador del sitio (hola@linkdesign.cr)
**Objetivo**: Agregar un nuevo farmaco veterinario al catalogo
**Entrada**: URL directa /admin/ o bookmark

```
1. Admin navega a /admin/
   └─ Si no hay sesion activa: redirige a /admin/login
   └─ Pantalla login: logo HESA centrado + boton "Iniciar sesion con Microsoft"
   └─ Boton con icono Microsoft, fondo blanco, borde gris

2. Clic en "Iniciar sesion con Microsoft"
   └─ Redirige al flujo de Azure Entra ID (pagina Microsoft)
   └─ Spinner de carga mientras se redirige
   └─ Si autenticacion exitosa: redirige a /admin/dashboard
   └─ Si acceso denegado: "No tienes acceso al panel de administracion.
     Contacta al administrador." + boton "Reintentar"

3. Dashboard carga:
   └─ Skeleton: 4 cards shimmer + 3 cards shimmer + 2 columnas shimmer
   └─ Contenido: 4 cards resumen (Total Productos: 47, Mensajes Nuevos: 3,
     Marcas: 12, Productos Destacados: 6)
   └─ 3 cards categoria (Farmacos: 28, Alimentos: 14, Equipos: 5)
   └─ Ultimos mensajes (5) + Actividad reciente

4. Navega a Productos en el sidebar
   └─ Sidebar: item "Productos" se destaca (fondo #EBF5FF, texto #008DC9)
   └─ Carga listado productos en card view (default)

5. Clic en boton "+ Crear producto" (esquina superior derecha, azul)
   └─ Navega a /admin/productos/crear
   └─ Breadcrumb: "Productos > Crear producto"

6. Formulario de creacion — 5 secciones:

   Seccion 1: "Informacion basica"
   └─ Subtitulo bold 18px + descripcion gris 14px + separador
   └─ Campos: Nombre (ES)*, Nombre (EN), Marca* (dropdown con busqueda),
     Categoria* (3 cards mini seleccionables: Farmaco/Alimento/Equipo)
   └─ Selecciona "Farmaco" → campos condicionales aparecen en Seccion 2

   Seccion 2: "Clasificacion y filtros"
   └─ Subtitulo + descripcion + separador
   └─ Campos condicionales (Farmaco seleccionado):
     Especie(s) de destino* (multi-select: Caninos, Felinos, Bovinos...),
     Familia farmaceutica* (dropdown: Antibioticos, Desparasitantes...)
   └─ Campos siempre visibles:
     Presentaciones (tag input: "100ml" + "250ml" + "+"),
     Estado (toggle switch "Producto visible en el sitio web")

   Seccion 3: "Descripcion y contenido"
   └─ Subtitulo + descripcion + separador
   └─ Tabs pill ES/EN para campos bilingues
   └─ Campos (tab ES activo): Descripcion general (textarea),
     Formula/composicion (textarea), Registro sanitario (input),
     Indicaciones de uso (textarea)
   └─ Cambia a tab EN: mismos campos vacios para traduccion

   Seccion 4: "Imagen y ficha tecnica"
   └─ Subtitulo + descripcion + separador
   └─ Zona drag-drop imagenes: "Arrastra imagenes aqui o haz clic para seleccionar"
     (hasta 6 imagenes, primera = principal)
   └─ Preview inmediato de imagenes subidas con boton "Eliminar"
   └─ Zona drag-drop PDF: "Arrastra ficha tecnica PDF aqui"
   └─ Preview nombre archivo + tamano si hay PDF cargado

   Seccion 5: "Configuracion de publicacion"
   └─ Subtitulo + descripcion + separador
   └─ Toggle "Producto visible en el sitio web" (on/off)
   └─ Nota informativa: "El producto sera visible en el catalogo publico
     solo si esta activo y tiene al menos una imagen cargada."

7. Llena todos los campos obligatorios y clic "Guardar producto"
   └─ Validacion pre-guardado: campos obligatorios vacios se marcan en rojo
     con error inline
   └─ Si hay errores: scroll automatico al primer campo con error
   └─ Si todo valido: boton muestra spinner, texto cambia a "Guardando..."
   └─ Exito: toast verde esquina sup-der "Producto guardado correctamente" (3s)
     + redirige a /admin/productos (listado)
   └─ Error: toast rojo "Error al guardar el producto. Intenta de nuevo."
     + formulario mantiene datos

8. En el listado, el nuevo producto aparece como card:
   └─ Imagen + nombre bold + marca gris + badge "Farmaco" azul
     + badge "Activo" verde + menu 3 puntos
```

**Flujos alternativos desde el formulario:**
```
7a. Clic en "Cancelar"
    └─ Si hay cambios sin guardar: modal "Tienes cambios sin guardar.
       Deseas salir sin guardar?"
       └─ "Salir sin guardar" → vuelve al listado
       └─ "Seguir editando" → cierra modal, vuelve al formulario

7b. Clic en "Eliminar producto" (solo en modo edicion)
    └─ Modal de confirmacion: "Estas seguro de eliminar [Nombre del producto]?
       Esta accion no se puede deshacer."
       └─ "Cancelar" → cierra modal
       └─ "Eliminar" → boton rojo, spinner, toast "Producto eliminado"
         + redirige al listado
```

---

### Flujo 4 (IMPORTANTE): Visitante navega catalogo por categoria con filtros

**Persona**: Veterinario buscando desparasitante para caninos
**Objetivo**: Encontrar farmacos antiparasitarios para perros
**Entrada**: Home del sitio

```
1. En Home, ve los bloques de categorias
   └─ Bloque "Farmacos Veterinarios" con fondo #E8F4FD
   └─ Descripcion + 3 beneficios con iconos verdes
   └─ CTA: "Ver farmacos"

2. Clic en "Ver farmacos"
   └─ Navega a /es/catalogo/farmacos

3. Pagina catalogo Farmacos carga:
   └─ Breadcrumb: Inicio > Catalogo > Farmacos
   └─ Titulo: "Farmacos Veterinarios" + contador "42 productos"
   └─ Barra de filtros horizontal: Marca (dropdown), Especie (dropdown),
     Familia farmaceutica (dropdown)
   └─ Grid 3 cols desktop con product cards
   └─ Paginacion inferior: "Mostrando 1-24 de 42 productos"

4. Selecciona filtro Especie: "Caninos"
   └─ Productos se actualizan inmediatamente (sin boton "Aplicar")
   └─ Pill activo aparece: "Caninos x" debajo de la barra de filtros
   └─ Contador actualizado: "28 de 42 productos"
   └─ Paginacion resetea a pagina 1

5. Selecciona filtro Familia: "Desparasitantes"
   └─ Segundo pill activo: "Desparasitantes x"
   └─ Contador: "8 de 42 productos"
   └─ URL actualizada: /es/catalogo/farmacos?especie=caninos&familia=desparasitantes
   └─ Boton "Limpiar filtros" visible

6. Ve las cards de productos filtrados
   └─ Cada card: imagen (fondo #F5F7FA, aspect 1:1), nombre bold 16px,
     marca gris 14px, badge especie
   └─ Hover: scale(1.02) + sombra + boton "Ver producto" aparece

7. Clic en card de producto
   └─ Navega a /es/catalogo/farmacos/[slug-producto]
   └─ Detalle del producto con toda la informacion

8. Si ningun producto coincide con filtros:
   └─ Grid vacio con mensaje centrado:
     "No se encontraron productos con estos filtros"
   └─ Sugerencia: "Intenta limpiar algunos filtros"
   └─ Boton "Limpiar filtros"

9. En mobile (< 768px):
   └─ Filtros se ocultan, aparece boton "Filtrar" con icono
   └─ Clic en "Filtrar" abre drawer desde abajo con todos los filtros
   └─ Boton "Aplicar filtros" al fondo del drawer
   └─ Grid cambia a 1-2 columnas
```

---

### Flujo 5 (IMPORTANTE): Admin gestiona mensajes con kanban

**Persona**: Administrador del sitio
**Objetivo**: Revisar mensajes nuevos y actualizar su estado
**Entrada**: Dashboard del panel

```
1. En dashboard, ve seccion "Ultimos mensajes" con badge "3 nuevos"
   └─ Lista de 5 mensajes recientes con nombre, tipo, fecha, estado
   └─ Link "Ver todos" al final

2. Clic en "Ver todos" o "Mensajes" en sidebar
   └─ Navega a /admin/mensajes
   └─ Badge del sidebar "3" (mensajes nuevos)

3. Vista Kanban carga (default):
   └─ 3 columnas equidistantes:
     NUEVOS (3) | EN PROCESO (1) | ATENDIDOS (8)
   └─ Header cada columna: texto UPPERCASE + conteo entre parentesis
   └─ Cards en cada columna:
     badge tipo (color), nombre bold, email gris, preview 2 lineas, fecha

4. Arrastra (drag) card de "NUEVOS" a "EN PROCESO"
   └─ Card se eleva visualmente (sombra elevated)
   └─ Columna destino se resalta (borde azul claro)
   └─ Drop: card se inserta, conteos se actualizan (NUEVOS: 2, EN PROCESO: 2)
   └─ Toast: "Mensaje de [Nombre] movido a En Proceso"
   └─ Badge del sidebar se actualiza: "2"

5. Clic en una card para ver detalle
   └─ Navega a /admin/mensajes/:id
   └─ Layout: card lateral datos contacto (nombre, correo, telefono)
     + contenido completo del mensaje + producto de interes (si aplica)
   └─ Dropdown estado: Nuevo / En proceso / Atendido
   └─ Textarea "Notas internas" para seguimiento
   └─ Boton "Marcar como atendido" (azul)
   └─ Boton "Eliminar" (rojo outline) — requiere confirmacion

6. Agrega nota interna:
   └─ Escribe "Llamado el 17/03. Cliente interesado, enviar cotizacion."
   └─ Nota se guarda automaticamente (o con boton "Guardar nota")

7. Clic en "Marcar como atendido"
   └─ Estado cambia a "Atendido"
   └─ Toast: "Mensaje marcado como atendido"
   └─ Redirige al listado de mensajes (kanban)
   └─ Card ahora aparece en columna "ATENDIDOS"

8. Toggle a vista tabla:
   └─ Clic en toggle pill "Table view"
   └─ Tabla con columnas: NOMBRE, CORREO, TELEFONO, TIPO (badge),
     PRODUCTO, FECHA, ESTADO (badge), ACCIONES (ver/eliminar)
   └─ Headers UPPERCASE 12-13px #6B7280
   └─ Filtros: tipo de consulta, estado, busqueda por nombre/correo
   └─ Boton "Exportar CSV" descarga mensajes filtrados

9. En mobile (< 768px):
   └─ Kanban: columnas apiladas verticalmente
   └─ Tabla: filas transformadas a stacked cards
```

---

### Flujo 6 (COMPLEMENTARIO): Visitante explora catalogo general

**Persona**: Visitante sin categoria definida en mente
**Objetivo**: Explorar el catalogo completo de HESA
**Entrada**: Header del sitio — clic en "Catalogo"

```
1. Clic en "Catalogo" en header (enlace directo, no submenu)
   └─ Navega a /es/catalogo

2. Pagina Catalogo General carga:
   └─ Breadcrumb: Inicio > Catalogo
   └─ Titulo: "Catalogo de Productos" + contador "312 productos"
   └─ Barra de filtros: Categoria (Todos/Farmacos/Alimentos/Equipos),
     Marca, Especie + filtros secundarios segun categoria
   └─ Grid 3 cols con todas las product cards
   └─ Paginacion: "Mostrando 1-24 de 312 productos"

3. Selecciona filtro Categoria: "Alimentos"
   └─ Filtros secundarios se adaptan: aparece "Etapa de vida",
     desaparece "Familia farmaceutica"
   └─ Pill activo: "Alimentos x"
   └─ Contador: "87 de 312 productos"

4. Selecciona filtro Etapa de vida: "Cachorro/Kitten"
   └─ Pills: "Alimentos x" + "Cachorro/Kitten x"
   └─ Contador: "23 de 312 productos"

5. Navega entre paginas con controles de paginacion
   └─ Clic en pagina 2: scroll automatico al inicio del grid
   └─ Paginacion mantiene filtros activos
   └─ URL: /es/catalogo?categoria=alimentos&etapa=cachorro&pagina=2
```

---

### Flujo 7 (COMPLEMENTARIO): Admin gestiona contenido del Home

**Persona**: Administrador del sitio
**Objetivo**: Actualizar el hero del home y reordenar productos destacados
**Entrada**: Panel admin, sidebar > Home

```
1. En sidebar, expande "Home" (clic en chevron)
   └─ Submenu: Hero, Productos destacados, Marcas destacadas

2. Clic en "Hero"
   └─ Navega a /admin/home/hero
   └─ Preview de la imagen actual del hero
   └─ Campos editables con tabs ES/EN:
     Tag superior (ES: "DESDE 1989" / EN: "SINCE 1989")
     Headline (ES: "Tu aliado veterinario..." / EN: "Your veterinary partner...")
     Subtitulo (ES/EN)
     CTA primario texto (ES: "Explorar catalogo" / EN: "Explore Catalog")
     CTA secundario texto (ES: "Distribuya con nosotros" / EN: "Partner with us")

3. Edita el headline, cambia la imagen hero:
   └─ Clic en "Cambiar imagen" sobre el preview
   └─ Selector de archivo se abre
   └─ Imagen se sube con barra de progreso
   └─ Preview se actualiza con la nueva imagen

4. Clic en "Guardar cambios"
   └─ Spinner en boton
   └─ Toast verde: "Hero actualizado correctamente"
   └─ Cambios reflejados en el sitio publico

5. Navega a "Productos destacados" en sidebar
   └─ Lista de cards horizontales de productos actualmente destacados
   └─ Cada card: miniatura + nombre + marca + boton "X" para remover
   └─ Drag handles para reordenar (icono de 6 puntos)

6. Clic en "+ Agregar producto"
   └─ Modal de seleccion: busqueda por nombre, filtro por categoria,
     lista de productos activos con checkboxes
   └─ Selecciona 2 productos, clic "Agregar"
   └─ Productos aparecen al final de la lista

7. Reordena arrastrando cards con drag-and-drop
   └─ Card arrastrada se eleva (sombra elevated)
   └─ Posicion final se actualiza visualmente

8. Clic en "Guardar orden"
   └─ Toast: "Productos destacados actualizados"
   └─ Carrusel del home se actualiza con el nuevo orden
```

---

### Flujo 8 (COMPLEMENTARIO): Admin edita un producto existente

**Persona**: Administrador del sitio
**Objetivo**: Actualizar informacion de un producto existente
**Entrada**: Panel admin, listado de productos

```
1. En listado de productos (card view):
   └─ Localiza el producto por nombre o usando busqueda
   └─ Clic en menu 3 puntos de la card → "Editar"
   └─ O clic en la card → detalle solo lectura → boton "Editar producto"
   └─ Navega a /admin/productos/:id/editar

2. Formulario carga con datos existentes:
   └─ Breadcrumb: "Productos > Editar: Amoxicilina 250ml"
   └─ 5 secciones con datos pre-llenados
   └─ Imagen(es) actuales con preview
   └─ PDF actual (si existe) con nombre y tamano

3. Modifica la descripcion en ingles:
   └─ En Seccion 3, cambia a tab "EN"
   └─ Edita el campo "Description"

4. Agrega una nueva imagen:
   └─ En Seccion 4, arrastra imagen adicional a la zona de drop
   └─ Preview aparece junto a las imagenes existentes
   └─ Puede reordenar imagenes con drag-drop (primera = principal)

5. Clic en "Guardar cambios"
   └─ Spinner + toast exito → redirige al listado
   └─ O toast error → formulario mantiene datos

6. Flujo alternativo — cambiar de categoria:
   └─ Selecciona categoria diferente (ej: de "Farmaco" a "Alimento")
   └─ Campos condicionales cambian dinamicamente
   └─ Campos previos de farmaco desaparecen, aparecen campos de alimento
   └─ Datos de campos eliminados se pierden (confirmacion no requerida
     hasta guardar)
```

---

## 3. Pantallas del Sitio Publico

### 3.1 Pantalla: Home

**Ruta**: /es/ | /en/
**Layout**: Full-width vertical con 7 secciones apiladas, max-width 1280px para contenido interno, spacing 96px entre secciones (desktop) / 64px (mobile)
**DEMO**: DEMO-004, DEMO-005, DEMO-006, DEMO-007, DEMO-008, DEMO-009

#### Secciones del Home

**Seccion 1 — Hero (100vh)**
- Layout: Full viewport (100vh). Imagen de fondo a sangre completa con overlay gradient de izquierda (rgba(0,0,0,0.45) a transparente). Texto posicionado en tercio izquierdo.
- Contenido:
  - Tag superior: "DESDE 1989" (uppercase, 13px Inter Semibold 600, letter-spacing 0.08em, color #50B92A)
  - Headline: "Tu aliado veterinario de confianza en Costa Rica" (56px Inter Extrabold 800, letter-spacing -0.02em, blanco)
  - Subtitulo: "Distribuimos farmacos, alimentos y equipos veterinarios para profesionales que exigen calidad" (18px Inter Regular 400, blanco, max-width 560px)
  - CTA primario: "Explorar catalogo" (boton #008DC9, texto blanco, border-radius 8px, padding 16px 32px)
  - CTA secundario: "Distribuya con nosotros" (boton outline blanco, texto blanco, border-radius 8px)
- Imagen: Profesional veterinario en accion (B2B, no mascota tierna)

**Seccion 2 — Bloques de Categorias**
- Layout: 3 bloques full-width con fondo de color diferenciado, border-radius 24px, padding 72px. Cada bloque tiene layout 50/50 (texto + imagen) alternando posicion.
- Contenido bloque 1 (Farmacos, fondo #E8F4FD):
  - Titulo: "Farmacos Veterinarios" (42px Inter Bold 700)
  - Parrafo descriptivo: "Contamos con una linea completa de farmacos veterinarios de las mejores marcas internacionales para el tratamiento y prevencion de enfermedades en todas las especies."
  - 3 beneficios con iconos verdes #50B92A: "Antibioticos y antiparasitarios de ultima generacion", "Formulas aprobadas por SENASA", "Asesoramiento tecnico especializado"
  - CTA: "Ver farmacos" (boton outline #008DC9)
  - Imagen derecha: producto farmacologico profesional
- Contenido bloque 2 (Alimentos, fondo #EDF7E8): imagen izquierda, texto derecha
  - Titulo: "Alimentos para Animales"
  - Parrafo: "Ofrecemos las mejores marcas de nutricion animal para perros, gatos y otras especies, cubriendo todas las etapas de vida con formulas premium."
  - 3 beneficios: "Marcas premium internacionales", "Nutricion especializada por etapa de vida", "Lineas terapeuticas y de prescripcion"
  - CTA: "Ver alimentos"
- Contenido bloque 3 (Equipos, fondo #F0F2F5): texto izquierda, imagen derecha
  - Titulo: "Equipos Veterinarios"
  - Parrafo: "Equipamiento profesional para clinicas y hospitales veterinarios, desde instrumental quirurgico hasta equipos de diagnostico de alta precision."
  - 3 beneficios: "Equipos de diagnostico avanzado", "Instrumental quirurgico certificado", "Soporte tecnico y capacitacion"
  - CTA: "Ver equipos"
- Animacion: fade-in al scroll (Intersection Observer, cubic-bezier(0.4, 0, 0.2, 1))

**Seccion 3 — Marcas Destacadas**
- Layout: titulo centrado + fila de 6-8 logos + link "Ver todas"
- Contenido:
  - Titulo: "Representamos las mejores marcas del mundo" (42px Inter Bold 700, centrado)
  - Logos: 6-8 logos de marcas en escala de grises, hover a color (transition 0.3s), ~120px ancho cada uno, alineados al centro vertical
  - Link: "Ver todas las marcas ->" (texto #008DC9, underline en hover)
- Cada logo es un enlace a la pagina individual de la marca

**Seccion 4 — Propuesta de Valor**
- Layout: fondo #F5F7FA, 4 bloques en fila horizontal
- Contenido (4 datos clave):
  - Bloque 1: icono calendario (verde #50B92A lineal) + "37+" (48px Inter Bold, #1F2937) + "Anos de experiencia en el sector veterinario" (14px Inter Regular, #6B7280)
  - Bloque 2: icono mapa + "100%" + "Cobertura nacional con agentes propios"
  - Bloque 3: icono escudo + "50+" + "Colaboradores dedicados al sector veterinario"
  - Bloque 4: icono globo + "20+" + "Marcas internacionales de primer nivel"
- Animacion: count-up al entrar viewport (numeros animados de 0 al valor final)

**Seccion 5 — Productos Destacados (Carrusel)**
- Layout: titulo + carrusel horizontal + controles
- Contenido:
  - Titulo: "Productos Destacados" (42px Inter Bold 700)
  - Carrusel: 4 cards visibles desktop, 2 tablet, 1 mobile (swipe)
  - Card: imagen cuadrada (1:1 o 4:5, fondo #F5F7FA), nombre bold 16px, marca gris 14px, boton "Ver producto" outline #008DC9 (aparece en hover)
  - Flechas: circulares dark, bordes del carrusel
  - Dots: estilo pill (activo = rectangulo, inactivos = circulos)
- Edge case: si no hay productos destacados configurados, toda la seccion se oculta (no se renderiza)

**Seccion 6 — CTA Fabricantes**
- Layout: full-width fondo #008DC9, padding 80px vertical
- Contenido:
  - Titulo: "Busca un distribuidor en Costa Rica?" (36px Inter Bold 700, blanco)
  - Parrafo: "Con 37 anos de experiencia y cobertura nacional, somos su socio ideal para distribuir productos veterinarios en Costa Rica." (18px, blanco)
  - CTA: "Quiero ser Distribuidor" (boton fondo blanco, texto #008DC9, border-radius 8px)

**Seccion 7 — Footer**
- Layout: fondo #005A85, 4 columnas, logo HESA grande como cierre
- Contenido documentado en componente Footer (Component Designer)

#### Componentes

| Componente | Tipo | Responsabilidad |
|---|---|---|
| hero | Smart | Carga datos hero desde API, renderiza imagen + texto + CTAs |
| category-blocks | Smart | Carga contenido de categorias, renderiza 3 bloques con animacion scroll |
| brand-logos-row | Smart | Carga marcas destacadas desde API, renderiza logos grayscale |
| value-proposition | Dumb | Recibe 4 datos, renderiza con count-up animation |
| featured-products-carousel | Smart | Carga productos destacados, renderiza carrusel con controles |
| manufacturer-cta | Dumb | Renderiza banner CTA estatico |
| header | Smart | Maneja navegacion, sticky, busqueda, idioma, hamburger mobile |
| footer | Dumb | Renderiza footer con nav, contacto, redes, idioma |
| whatsapp-fab | Dumb | Boton flotante WhatsApp |
| search-overlay | Smart | Busqueda global con predicciones |

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Carga | API cargando datos de hero, productos, marcas | Skeleton screens: hero con bloque gris animado, cards con shimmer rectangulares, logos con rectangulos grises |
| Exito | Todo el contenido cargado correctamente | Todas las secciones visibles con contenido real, animaciones activas |
| Error | Fallo en API (error de red o servidor) | Secciones individuales muestran mensaje "No pudimos cargar esta seccion" con boton "Reintentar". Las secciones que cargaron correctamente permanecen visibles |
| Vacio parcial (carrusel) | No hay productos destacados configurados | Seccion de carrusel completa se oculta (REQ-073). Resto del home funciona normal |
| Vacio parcial (marcas) | No hay marcas destacadas configuradas | Seccion de marcas se oculta. Resto del home funciona normal |

#### Contenido y Copy (ES)
- Tag hero: "DESDE 1989"
- Headline hero: "Tu aliado veterinario de confianza en Costa Rica"
- Subtitulo hero: "Distribuimos farmacos, alimentos y equipos veterinarios para profesionales que exigen calidad"
- CTA primario hero: "Explorar catalogo"
- CTA secundario hero: "Distribuya con nosotros"
- Titulo marcas: "Representamos las mejores marcas del mundo"
- Titulo propuesta: "Por que elegir HESA"
- Titulo productos: "Productos Destacados"
- Titulo CTA fabricantes: "Busca un distribuidor en Costa Rica?"

#### Contenido y Copy (EN)
- Tag hero: "SINCE 1989"
- Headline hero: "Your Trusted Veterinary Partner in Costa Rica"
- Subtitulo hero: "We distribute pharmaceuticals, food and veterinary equipment for professionals who demand quality"
- CTA primario hero: "Explore Catalog"
- CTA secundario hero: "Partner with us"
- Titulo marcas: "We represent the world's best brands"
- Titulo propuesta: "Why Choose HESA"
- Titulo productos: "Featured Products"
- Titulo CTA fabricantes: "Looking for a distributor in Costa Rica?"

#### Responsive

| Breakpoint | Cambios |
|---|---|
| Desktop (1280px+) | Layout completo como descrito. Hero 100vh. Bloques 50/50. 4 stats en fila. Carrusel 4 cards. |
| Tablet (768-1279px) | Hero: texto centrado, CTAs stacked. Bloques: stack vertical imagen arriba. Stats: grid 2x2. Carrusel: 2 cards. |
| Mobile (< 768px) | Hero: texto centrado, font-size 32px min, CTAs full-width stacked. Bloques: stack vertical, padding 48px. Stats: 1 columna. Carrusel: 1 card con swipe. Footer: acordeones colapsables. CTA fabricantes: padding 48px, texto centrado. |

---

### 3.2 Pantalla: Catalogo General

**Ruta**: /es/catalogo | /en/catalog
**Layout**: Header sticky + breadcrumb + titulo con contador + barra filtros horizontal + grid productos + paginacion + footer. Contenido max-width 1280px centrado.
**DEMO**: DEMO-010

#### Componentes

| Componente | Tipo | Responsabilidad |
|---|---|---|
| breadcrumb | Dumb | Muestra Inicio > Catalogo |
| filter-bar | Smart | Dropdowns de filtros, pills activos, actualizacion dinamica |
| product-card | Dumb | Renderiza card individual de producto |
| product-grid | Smart | Maneja grid responsive de product cards |
| pagination | Smart | Controles de paginacion, contador "Mostrando X de Y" |

#### Layout detallado
- Breadcrumb: "Inicio > Catalogo" (14px, gris, separadores ">")
- Titulo: "Catalogo de Productos" (42px Inter Bold 700, #1F2937)
- Contador: "312 productos" (16px, #6B7280, alineado a la derecha del titulo)
- Descripcion: "Explora nuestra linea completa de farmacos, alimentos y equipos veterinarios de las mejores marcas internacionales" (16px, #6B7280, 1 linea)
- Barra de filtros: Categoria (dropdown: Todos/Farmacos/Alimentos/Equipos), Marca (dropdown), Especie (dropdown), + filtros condicionales segun categoria seleccionada
- Pills de filtros activos: debajo de la barra, cada pill con "x" para remover
- Boton "Limpiar filtros": aparece cuando hay al menos 1 filtro activo
- Grid: 3 cols desktop (gap 28px), 2 cols tablet (gap 20px), 1-2 cols mobile (gap 20px)
- Paginacion inferior: "Mostrando 1-24 de 312 productos" + numeros de pagina + flechas

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Carga | Esperando datos de la API | Skeleton: 12 cards con rectangulo gris animado (imagen) + 2 lineas shimmer (texto). Filtros deshabilitados con shimmer. |
| Exito | Productos cargados | Grid de cards con contenido real. Filtros funcionales. Paginacion activa. |
| Error | Fallo en API | Mensaje centrado: "No pudimos cargar los productos. Intenta de nuevo." + boton "Reintentar" (#008DC9). Sin grid. |
| Vacio | 0 productos en la base de datos | Mensaje centrado: "Aun no hay productos en el catalogo" + ilustracion SVG gris suave + "Vuelve pronto para ver nuestro catalogo completo" |
| Filtros sin resultados | Combinacion de filtros no produce resultados | Grid vacio con mensaje: "No se encontraron productos con estos filtros" + "Intenta limpiar algunos filtros" + boton "Limpiar filtros" |
| Muchos datos | Mas de 24 productos | Paginacion activa: "Mostrando 1-24 de 312 productos" con controles de pagina. Al cambiar pagina, scroll al inicio del grid. |

#### Contenido y Copy
- Titulo ES: "Catalogo de Productos"
- Titulo EN: "Product Catalog"
- Subtitulo ES: "Explora nuestra linea completa de farmacos, alimentos y equipos veterinarios de las mejores marcas internacionales"
- Subtitulo EN: "Explore our complete line of veterinary pharmaceuticals, food and equipment from the best international brands"
- Filtro categoria: "Categoria" / "Category"
- Filtro marca: "Marca" / "Brand"
- Filtro especie: "Especie" / "Species"
- Limpiar filtros: "Limpiar filtros" / "Clear filters"

#### Responsive

| Breakpoint | Cambios |
|---|---|
| Desktop (1280px+) | Grid 3 cols. Filtros horizontales visibles. Paginacion completa. |
| Tablet (768-1279px) | Grid 2 cols. Filtros horizontales condensados. |
| Mobile (< 768px) | Grid 1-2 cols. Filtros colapsados en boton "Filtrar" que abre drawer inferior. Paginacion compacta (flechas + "1/13"). |

---

### 3.3 Pantalla: Catalogo por Categoria (Farmacos / Alimentos / Equipos)

**Ruta**: /es/catalogo/farmacos | /es/catalogo/alimentos | /es/catalogo/equipos
**Layout**: Identico al catalogo general pero con filtros contextualizados a la categoria
**DEMO**: DEMO-011

#### Diferencias con Catalogo General
- Breadcrumb: "Inicio > Catalogo > [Categoria]" (en vez de solo "Inicio > Catalogo")
- Titulo: "Farmacos Veterinarios" / "Alimentos para Animales" / "Equipos Veterinarios"
- Sin filtro de "Categoria" (ya se esta en una categoria especifica)
- Filtros especificos:
  - Farmacos: Marca, Especie, Familia farmaceutica
  - Alimentos: Marca, Especie, Etapa de vida
  - Equipos: Marca, Tipo de equipo
- Descripcion corta editable desde panel en ES/EN

#### Estados de UI
Identicos al catalogo general, pero contextualizados a la categoria:
- Vacio: "No hay [farmacos/alimentos/equipos] disponibles actualmente"
- Filtros sin resultados: "No se encontraron [farmacos/alimentos/equipos] con estos filtros"

---

### 3.4 Pantalla: Detalle de Producto

**Ruta**: /es/catalogo/[categoria]/[slug] | /en/catalog/[category]/[slug]
**Layout**: Breadcrumb + 2 columnas (55% galeria izq + 45% info der) + barra sticky + storytelling (opcional) + productos relacionados + footer
**DEMO**: DEMO-014, DEMO-016

#### Layout detallado

**Zona superior — Breadcrumb:**
- "Inicio > Catalogo > Farmacos > Amoxicilina 250ml" (14px, gris, clickable)

**Zona principal — 2 columnas:**

Columna izquierda (55%) — Galeria:
- Thumbnails verticales (columna lateral): 60x60px, borde 1px #E5E7EB, seleccionado = borde 2px #008DC9
- Imagen principal: ~600px ancho, fondo #F5F7FA, zoom on hover / lightbox on click
- Si solo hay 1 imagen: sin thumbnails, solo imagen principal
- Si no hay imagen: placeholder con icono de la categoria + nombre de marca (fondo #F5F7FA)

Columna derecha (45%) — Informacion:
- Nombre: bold 32-36px Inter Bold 700, #1F2937
- Marca: "por Zoofarma" (16px, #008DC9, link a pagina de marca)
- Badges especie: pills con icono + texto en franja #F5F7FA (ej: icono perro + "Caninos", icono gato + "Felinos")
- Campos condicionales por categoria:
  - Farmaco: formula/composicion, registro sanitario SENASA, indicaciones de uso, presentaciones (pills seleccionables)
  - Alimento: especie, etapa de vida, presentaciones/tamanos, ingredientes principales, informacion nutricional
  - Equipo: especificaciones tecnicas, usos recomendados, garantia
- Presentaciones: pills con border-radius 25px, borde #E5E7EB, seleccionado = fondo #E8F4FD borde #008DC9. Ej: "100ml" | "250ml" | "500ml"
- CTAs (stacked verticalmente, full-width de la columna):
  1. "Solicitar informacion" — boton primario #008DC9, texto blanco, height 50px
  2. "Consultar por WhatsApp" — boton verde #25D366, icono WhatsApp + texto blanco
  3. "Descargar ficha tecnica" — boton outline #008DC9, icono PDF (SOLO si hay PDF cargado; si no hay, no se renderiza)
- Si campos especificos estan vacios, la seccion no se renderiza (no genera areas en blanco)

**Zona sticky — Barra de producto:**
- Aparece al scroll pasada la zona principal
- Desktop: barra top sticky, fondo #005A85, thumbnail 40px + nombre bold blanco + marca regular blanco + boton "Solicitar informacion" #008DC9
- Mobile: barra bottom sticky, fondo blanco + borde top 1px #E5E7EB, nombre + boton "Solicitar informacion" full-width
- Desaparece al volver arriba cuando zona principal es visible
- No causa salto de layout (no altera el flow del documento)

**Zona storytelling (opcional):**
- Bloques de contenido img + texto (estilo T&P Patron #2)
- Administrables desde el panel
- Si no hay bloques configurados, la seccion no aparece
- Bilingue ES/EN

**Zona productos relacionados:**
- Titulo: "Tambien te puede interesar" (36px Inter Bold 700)
- 3-4 cards de productos de la misma categoria/marca
- Mismas cards que el catalogo
- En mobile: carrusel horizontal con swipe
- Si el producto es el unico de su categoria/marca: seccion no se muestra o muestra productos de la misma categoria general

#### Componentes

| Componente | Tipo | Responsabilidad |
|---|---|---|
| breadcrumb | Dumb | Navegacion jerarquica |
| product-gallery | Smart | Maneja thumbnails, imagen principal, zoom/lightbox, estados |
| product-info | Smart | Renderiza info condicional por categoria, CTAs |
| species-badges | Dumb | Badges/pills de especie con icono |
| presentation-pills | Dumb | Pills seleccionables de presentaciones |
| sticky-bar | Smart | Aparece/desaparece con Intersection Observer |
| product-storytelling | Smart | Carga bloques storytelling desde API si existen |
| related-products | Smart | Carga productos relacionados, renderiza carrusel/grid |

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Carga | Esperando datos del producto | Skeleton: columna izq con rectangulo gris grande + 3 rectangulos pequenos. Columna der con 5 lineas shimmer de diferentes anchos + 2 botones shimmer |
| Exito | Producto cargado correctamente | Todo el contenido visible con datos reales |
| Error (404) | Producto no encontrado (slug invalido) | Pagina 404 estilizada: ilustracion, "Este producto no esta disponible", boton "Volver al catalogo" |
| Sin imagen | Producto sin imagen cargada | Placeholder: fondo #F5F7FA con icono de categoria centrado + nombre de marca en texto |
| Imagen unica | Solo 1 imagen cargada | Sin columna de thumbnails, solo imagen principal grande |
| Sin ficha PDF | Producto sin ficha tecnica | Boton "Descargar ficha tecnica" no se renderiza (no espacio vacio, no boton deshabilitado) |
| Campos vacios | Campos opcionales sin contenido | Secciones correspondientes no se renderizan, sin areas en blanco |

#### Contenido y Copy
- CTA primario ES: "Solicitar informacion"
- CTA primario EN: "Request Information"
- CTA WhatsApp ES: "Consultar por WhatsApp"
- CTA WhatsApp EN: "Ask via WhatsApp"
- CTA PDF ES: "Descargar ficha tecnica"
- CTA PDF EN: "Download Data Sheet"
- Relacionados ES: "Tambien te puede interesar"
- Relacionados EN: "You may also like"
- 404 ES: "Este producto no esta disponible"
- 404 EN: "This product is not available"

#### Responsive

| Breakpoint | Cambios |
|---|---|
| Desktop (1280px+) | 2 columnas 55/45. Thumbnails verticales. Sticky bar top. |
| Tablet (768-1279px) | 2 columnas 50/50. Thumbnails horizontales debajo de imagen principal. |
| Mobile (< 768px) | 1 columna: galeria arriba (swipe horizontal entre imagenes), info debajo. CTAs full-width. Sticky bar bottom. Productos relacionados en carrusel horizontal. |

---

### 3.5 Pantalla: Listado de Marcas

**Ruta**: /es/marcas | /en/brands
**Layout**: Breadcrumb + titulo + parrafo introductorio + grid de brand cards
**DEMO**: DEMO-018

#### Layout detallado
- Breadcrumb: "Inicio > Marcas"
- Titulo: "Marcas que representamos" (42px Inter Bold 700)
- Parrafo: "Trabajamos con las marcas mas reconocidas del sector veterinario a nivel mundial, ofreciendo a nuestros clientes productos de la mas alta calidad respaldados por anos de investigacion y desarrollo." (16px, #6B7280)
- Grid: 3-4 cols desktop, 2 cols tablet, 1-2 cols mobile
- Cada card:
  - Logo centrado (80x80px, fondo #F5F7FA)
  - Nombre bold 18px
  - Pais de origen (14px, #6B7280, con icono bandera)
  - Badges de categorias: pills color (Farmaco=#E8F4FD azul, Alimento=#EDF7E8 verde, Equipo=#F0F2F5 gris)
  - Hover: scale(1.02) + sombra 0 4px 12px
  - Clickable: navega a pagina individual de marca

#### Componentes

| Componente | Tipo | Responsabilidad |
|---|---|---|
| brand-card | Dumb | Renderiza card individual de marca |
| brand-grid | Smart | Maneja grid responsive y carga datos |

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Carga | Esperando datos de marcas | Skeleton: 6 cards con circulo gris (logo) + 2 lineas shimmer + 3 rectangulos pequenos (badges) |
| Exito | Marcas cargadas | Grid de cards con logos, nombres, paises y badges |
| Error | Fallo en API | Mensaje centrado: "No pudimos cargar las marcas" + boton "Reintentar" |

#### Contenido y Copy
- Titulo ES: "Marcas que representamos"
- Titulo EN: "Brands We Represent"
- Subtitulo ES: "Trabajamos con las marcas mas reconocidas del sector veterinario a nivel mundial, ofreciendo a nuestros clientes productos de la mas alta calidad respaldados por anos de investigacion y desarrollo."
- Subtitulo EN: "We work with the most recognized brands in the veterinary industry worldwide, offering our clients the highest quality products backed by years of research and development."

#### Responsive

| Breakpoint | Cambios |
|---|---|
| Desktop (1280px+) | Grid 3-4 cols, gap 28px |
| Tablet (768-1279px) | Grid 2 cols, gap 20px |
| Mobile (< 768px) | Grid 1-2 cols, gap 20px |

---

### 3.6 Pantalla: Pagina Individual de Marca

**Ruta**: /es/marcas/[slug] | /en/brands/[slug]
**Layout**: Breadcrumb + header de marca (logo + info) + grid productos filtrable
**DEMO**: DEMO-019

#### Layout detallado
- Breadcrumb: "Inicio > Marcas > [Nombre de la Marca]"
- Header de marca:
  - Logo grande (160x160px, fondo blanco, borde 1px #E5E7EB, border-radius 16px)
  - Nombre bold 36px Inter Bold 700
  - Pais de origen (16px, #6B7280, con icono bandera)
  - Badges de categorias que maneja
  - Descripcion detallada (16px, #6B7280, max 3 parrafos)
- Separador: linea 1px #E5E7EB, margin 48px vertical
- Grid de productos de la marca:
  - Titulo: "Productos de [Nombre Marca]" (28px Inter Bold 700)
  - Filtros: mismos filtros aplicables que el catalogo, pero contextualizados a esta marca
  - Grid de product cards identico al catalogo
  - Paginacion si hay mas de 24 productos

#### Componentes

| Componente | Tipo | Responsabilidad |
|---|---|---|
| brand-header | Smart | Carga datos de la marca y renderiza header |
| product-grid | Smart | Carga productos de la marca, filtros, paginacion |
| filter-bar | Smart | Filtros contextualizados a la marca |

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Carga | Esperando datos | Skeleton: logo circulo gris + 3 lineas shimmer + grid de cards skeleton |
| Exito | Marca y productos cargados | Header completo + grid de productos |
| Error (404) | Marca no encontrada | Pagina 404: "Esta marca no esta disponible" + boton "Ver todas las marcas" |
| Sin productos | Marca sin productos asociados | Header de marca visible + mensaje: "Esta marca aun no tiene productos publicados en nuestro catalogo" + boton "Volver a marcas" |

#### Responsive

| Breakpoint | Cambios |
|---|---|
| Desktop (1280px+) | Header con logo grande + info al lado. Grid 3 cols. |
| Tablet (768-1279px) | Header stack: logo centrado + info debajo. Grid 2 cols. |
| Mobile (< 768px) | Header stack vertical centrado. Grid 1-2 cols. Filtros en drawer. |

---

### 3.7 Pantalla: Nosotros

**Ruta**: /es/nosotros | /en/about
**Layout**: Hero 50-60vh + historia (bloques narrativos alternados) + numeros clave + cobertura con mapa + equipo liderazgo + politicas comerciales + footer
**DEMO**: DEMO-020

#### Secciones

**Hero (50-60vh):**
- Imagen corporativa de fondo con overlay gradient
- Titulo: "37 anos de experiencia veterinaria" (56px Inter Extrabold 800, blanco)
- Subtitulo: "Una empresa familiar de segunda generacion dedicada a llevar lo mejor del mundo veterinario a Costa Rica" (18px, blanco)

**Historia de HESA:**
- Layout: bloques narrativos alternados (texto izq + imagen der, luego imagen izq + texto der)
- Contenido: empresa familiar de segunda generacion, 37 anos de trayectoria, evolucion, valores, exclusividad del sector veterinario
- Fade-in al scroll

**Numeros Clave:**
- Layout: 4 bloques horizontales, fondo #F5F7FA
- Datos: "37+" anos, "50+" colaboradores, "18-20" agentes de ventas, "Cobertura Nacional"
- Count-up animation al entrar viewport (48-64px Inter Bold)

**Cobertura y Distribucion:**
- Layout: 2 columnas (texto izq + mapa der)
- Texto: informacion sobre agentes propios, flotilla de entrega, cobertura GAM + rural + encomienda. NO menciona expansion a Centroamerica
- Mapa: SVG de Costa Rica estilizado en tono #E8F4FD con puntos de cobertura en #008DC9
- Leyenda: GAM (entrega directa), Rural (agentes quincenal), Alejada (encomienda)

**Equipo de Liderazgo:**
- Layout: grid 3 cols desktop, 2 tablet, 1 mobile
- Cards: foto circular (120x120px), nombre bold 18px, cargo 14px gris
- 6 placeholders ficticios (fotos profesionales de banco, nombres y cargos realistas)
- Si 0 miembros: seccion completa no se renderiza

**Politicas Comerciales:**
- Layout: seccion con cards o bloques con icono + titulo + descripcion
- Contenido:
  - Credito: "Condiciones de credito flexibles adaptadas a su negocio"
  - Entrega GAM: "Entrega directa 24-48 horas en el Gran Area Metropolitana"
  - Entrega rural: "Cobertura nacional con agentes propios visitando cada quincena"
  - Entrega alejada: "Servicio de encomienda para zonas de dificil acceso"
- CTA: "Solicitar condiciones comerciales personalizadas" -> navega a contacto

#### Componentes

| Componente | Tipo | Responsabilidad |
|---|---|---|
| about-hero | Smart | Carga textos configurables, renderiza hero |
| company-story | Smart | Carga bloques narrativos, renderiza alternados |
| key-numbers | Dumb | Renderiza 4 bloques con count-up animation |
| coverage-map | Smart | Carga datos cobertura, renderiza SVG mapa + texto |
| leadership-team | Smart | Carga miembros del equipo, renderiza grid |
| team-member-card | Dumb | Foto circular + nombre + cargo |
| commercial-policies | Smart | Carga contenido politicas, renderiza cards |

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Carga | Esperando datos | Skeleton: hero con bloque gris, bloques narrativos con shimmer, numeros con rectangulos, grid de circulos grises |
| Exito | Contenido cargado | Todas las secciones visibles con contenido real y animaciones |
| Sin equipo | 0 miembros en equipo | Seccion de equipo de liderazgo completa se oculta |

#### Responsive

| Breakpoint | Cambios |
|---|---|
| Desktop (1280px+) | Hero 50-60vh. Historia alternada 2 cols. Numeros 4 cols. Mapa 2 cols. Equipo 3 cols. |
| Tablet (768-1279px) | Historia stack. Numeros 2x2. Mapa stack. Equipo 2 cols. |
| Mobile (< 768px) | Hero 40vh. Historia stack. Numeros 1 col. Mapa stack vertical. Equipo 1 col. Politicas stack. |

---

### 3.8 Pantalla: Distribuidores

**Ruta**: /es/distribuidores | /en/distributors
**Layout**: Hero B2B 50-60vh + beneficios grid + logo wall + timeline + formulario fabricantes
**DEMO**: DEMO-021

#### Secciones

**Hero B2B (50-60vh):**
- Titulo ES: "Distribuya con nosotros"
- Titulo EN: "Partner with HESA"
- Subtitulo ES: "Sea parte de la red de distribucion veterinaria mas solida de Costa Rica"
- Subtitulo EN: "Join Costa Rica's strongest veterinary distribution network"
- CTA: "Iniciar conversacion" / "Start the Conversation" -> scroll a formulario

**Beneficios (grid 3x2):**
- Titulo: "Por que elegir HESA" / "Why Choose HESA"
- 6 cards con icono circular #008DC9 + titulo bold + descripcion:
  1. "37 anos de experiencia" / "37 years of experience"
  2. "Cobertura nacional con flotilla propia" / "National coverage with own fleet"
  3. "Exclusivos del sector veterinario" / "Exclusively veterinary sector"
  4. "Infraestructura establecida" / "Established infrastructure"
  5. "Relaciones solidas con clientes" / "Strong client relationships"
  6. "Conocimiento regulatorio local" / "Local regulatory expertise"

**Logo Wall:**
- Titulo: "Marcas que confian en nosotros" / "Brands That Trust Us"
- Logos en escala de grises, hover a color
- Mismas marcas que en el home

**Timeline (4 pasos):**
- Titulo: "Proceso de partnership" / "Partnership Process"
- Desktop: timeline horizontal con circulos numerados + linea conectora
- 4 pasos:
  1. "Contacto inicial" / "Initial Contact" — icono sobre, descripcion
  2. "Evaluacion de productos" / "Product Evaluation" — icono lupa
  3. "Negociacion de terminos" / "Terms Negotiation" — icono documento
  4. "Inicio de distribucion" / "Distribution Launch" — icono cohete
- Animacion secuencial al scroll (cada paso aparece 0.2s despues del anterior)

**Formulario de fabricante:**
- Layout: 2 cols en desktop (info izq + formulario der), 1 col mobile
- Info izquierda: foto corporativa + "Estamos listos para ser su socio en Costa Rica. Completene el formulario y nuestro equipo se pondra en contacto."
- Formulario: Nombre empresa*, Pais origen*, Nombre contacto*, Email*, Telefono, Tipo de productos (dropdown), Mensaje*, Checkbox terminos
- Boton: "Enviar consulta" / "Send Inquiry"

#### Componentes

| Componente | Tipo | Responsabilidad |
|---|---|---|
| distributor-hero | Smart | Carga textos, renderiza hero |
| benefits-grid | Dumb | Renderiza 6 cards de beneficios |
| brand-wall | Smart | Carga marcas, renderiza logos |
| partnership-timeline | Dumb | Renderiza timeline con animacion scroll |
| manufacturer-form | Smart | Maneja formulario, validacion, envio, confirmacion |

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Carga | Esperando datos | Skeleton: hero gris + grid de cards shimmer + logos shimmer + timeline shimmer + formulario shimmer |
| Exito | Contenido cargado | Todas las secciones visibles con contenido y animaciones |
| Formulario enviado | Envio exitoso | Mensaje de confirmacion en lugar del formulario: "Gracias por su interes. Nos pondremos en contacto pronto." / "Thank you for your interest. We'll be in touch shortly." |
| Formulario error | Fallo al enviar | Mensaje de error sobre el formulario: "No pudimos enviar tu mensaje. Intenta de nuevo." Datos del formulario se mantienen. Boton retry visible. |

#### Responsive

| Breakpoint | Cambios |
|---|---|
| Desktop (1280px+) | Hero 50-60vh. Beneficios 3x2. Timeline horizontal. Formulario 2 cols. |
| Tablet (768-1279px) | Beneficios 2x3. Timeline horizontal compacto. Formulario 1 col. |
| Mobile (< 768px) | Hero 40vh. Beneficios 1 col. Timeline vertical. Formulario 1 col full-width. |

---

### 3.9 Pantalla: Contacto

**Ruta**: /es/contacto | /en/contact
**Layout**: Titulo + 2 columnas (info contacto izq + formulario der)
**DEMO**: DEMO-022

#### Layout detallado

**Titulo de pagina:**
- "Contactenos" / "Contact Us" (42px Inter Bold 700)
- Subtitulo: "Estamos aqui para ayudarle. Contactenos por el medio que prefiera." (16px, #6B7280)

**Columna izquierda — Informacion de contacto:**
- Telefono: icono + "+506 2260-9020" (link tel:)
- Correo: icono + email configurable (link mailto:)
- Direccion: icono + "Calle 2, av 12. Heredia, Costa Rica"
- Horario: icono + placeholder editable desde panel
- Redes sociales: iconos Facebook + Instagram (links a nuevas pestanas)
- NO hay mapa de Google embebido (REQ-195)

**Columna derecha — Formulario:**
- Campos:
  - Tipo de consulta* (dropdown: Informacion de productos, Condiciones comerciales, Soporte, Otro)
  - Nombre*
  - Correo electronico*
  - Telefono
  - Producto de interes (campo de texto, pre-llenado si viene de detalle de producto)
  - Mensaje* (textarea)
- Validacion: inline en blur, campos obligatorios con asterisco rojo
- Boton: "Enviar consulta" / "Send Inquiry" (#008DC9, full-width del formulario)
- Proteccion anti-spam: honeypot + reCAPTCHA v3 invisible

#### Componentes

| Componente | Tipo | Responsabilidad |
|---|---|---|
| contact-info | Smart | Carga datos de contacto desde configuracion |
| contact-form | Smart | Maneja formulario, validacion, pre-fill, envio |

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Carga | Esperando datos de contacto | Skeleton: columna izq con 5 lineas shimmer + columna der con formulario shimmer |
| Exito | Pagina cargada | Info contacto + formulario funcional |
| Pre-fill producto | Usuario viene de detalle de producto | Campo "Producto de interes" pre-llenado con nombre del producto (readonly o editable). Parametro ?producto=[slug] en URL |
| Formulario enviado | Envio exitoso | Mensaje de confirmacion reemplaza formulario: "Gracias por tu consulta. Nos pondremos en contacto pronto." con icono check verde |
| Formulario error | Fallo al enviar | Mensaje rojo sobre el formulario: "No pudimos enviar tu mensaje. Intenta de nuevo." Datos mantenidos. Boton retry. |

#### Responsive

| Breakpoint | Cambios |
|---|---|
| Desktop (1280px+) | 2 columnas: info izq (40%) + formulario der (60%) |
| Tablet (768-1279px) | 2 columnas: info izq (35%) + formulario der (65%) |
| Mobile (< 768px) | 1 columna: info contacto arriba (apilada) + formulario debajo (full-width) |

---

### 3.10 Pantalla: Resultados de Busqueda

**Ruta**: /es/busqueda?q=[termino] | /en/search?q=[term]
**Layout**: Breadcrumb + titulo con termino + resultados agrupados por tipo
**DEMO**: DEMO-023 (soporte)

#### Layout detallado
- Breadcrumb: "Inicio > Busqueda"
- Titulo: "Resultados para '[termino]'" (36px Inter Bold 700)
- Resultados agrupados:
  - "Productos (X)" — grid de product cards (mismas que catalogo)
  - "Marcas (X)" — grid de brand cards (mismas que listado marcas)
- Si muchos resultados: max 8 productos + max 4 marcas con link "Ver todos los productos para '[termino]'" que filtra el catalogo

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Carga | Buscando | Indicador de carga centrado: spinner + "Buscando..." |
| Exito | Resultados encontrados | Productos y marcas agrupados con sus cards |
| Sin resultados | 0 resultados | Mensaje centrado: "No se encontraron resultados para '[termino]'" + sugerencias: "Intenta con terminos mas generales" + link "Explorar catalogo completo" |

---

## 4. Pantallas del Panel de Administracion

### 4.1 Pantalla: Login

**Ruta**: /admin/login
**Layout**: Centrado vertical y horizontal, sin sidebar ni header del panel. Fondo #F7F8FA
**DEMO**: DEMO-024

#### Layout detallado
- Card centrada (max-width 420px, fondo blanco, border-radius 16px, sombra elevated)
- Logo HESA centrado (120px ancho)
- Titulo: "Panel de Administracion" (24px Inter Bold 700, #1F2937)
- Subtitulo: "Inicia sesion con tu cuenta de Microsoft" (14px, #6B7280)
- Boton: icono Microsoft + "Iniciar sesion con Microsoft" (fondo blanco, borde #E5E7EB, border-radius 10px, height 48px, hover fondo #F5F7FA)
- Nota: "Solo usuarios autorizados. Contacta al administrador para solicitar acceso." (12px, #6B7280)

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Default | Pagina de login | Logo + boton Microsoft |
| Cargando | Post-clic en boton Microsoft | Boton deshabilitado + spinner dentro del boton + texto "Redirigiendo..." |
| Error acceso | Usuario sin permisos en Azure | Mensaje rojo bajo el boton: "No tienes acceso al panel de administracion. Contacta al administrador." + boton "Reintentar" |
| Error red | Fallo de conexion | Mensaje: "Error de conexion. Verifica tu internet e intenta de nuevo." |

#### Responsive

| Breakpoint | Cambios |
|---|---|
| Desktop | Card centrada 420px |
| Mobile (< 768px) | Card full-width con padding 20px lateral |

---

### 4.2 Pantalla: Dashboard

**Ruta**: /admin/dashboard
**Layout**: Sidebar 272px + header 68px + area contenido (padding 32px, fondo #F7F8FA). 3 filas de contenido.
**DEMO**: DEMO-027

#### Layout detallado

**Fila 1 — Cards de resumen (4 cards horizontales):**
- Card 1: "Total Productos" — icono caja en circulo #EBF5FF, numero grande "47" (28px Inter Bold), label 14px gris
- Card 2: "Mensajes Nuevos" — icono sobre en circulo #FEF3C7, numero "3" + badge naranja si hay sin leer
- Card 3: "Marcas Activas" — icono estrella en circulo #DCFCE7, numero "12"
- Card 4: "Productos Destacados" — icono corazon en circulo #EBF5FF, numero "6"
- Cards: fondo blanco, border-radius 16px, sombra 0 1px 3px rgba(0,0,0,0.08), padding 20px

**Fila 2 — Cards de categoria (3 cards):**
- Card Farmacos: icono jeringa en circulo #EBF5FF, "Farmacos" bold 16px, barra de progreso azul, "28 productos activos" gris 14px
- Card Alimentos: icono plato en circulo #DCFCE7, barra verde, "14 productos activos"
- Card Equipos: icono herramienta en circulo #F0F2F5, barra gris, "5 productos activos"
- Cada card clickable -> navega al listado filtrado por categoria

**Fila 3 — 2 columnas (60% + 40%):**
- Columna izquierda: "Ultimos mensajes"
  - 5 mensajes recientes en filas: nombre bold + badge tipo (color) + fecha gris + badge estado
  - Link "Ver todos" al final -> /admin/mensajes
- Columna derecha: "Actividad reciente"
  - Log de acciones: "Se creo el producto 'Amoxicilina 250ml'" + timestamp relativo ("hace 2 horas")
  - Icono tipo accion (crear=verde, editar=azul, eliminar=rojo)
  - Scroll vertical si hay muchas entradas

#### Componentes

| Componente | Tipo | Responsabilidad |
|---|---|---|
| summary-card | Dumb | Renderiza icono circulo + numero + label |
| category-card-admin | Dumb | Renderiza icono + nombre + barra progreso + conteo |
| recent-messages-list | Smart | Carga ultimos 5 mensajes, renderiza lista |
| activity-log | Smart | Carga actividad reciente, renderiza log |

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Carga | Esperando datos | Skeleton: 4 cards shimmer (fila 1) + 3 cards shimmer (fila 2) + 2 columnas shimmer (fila 3) |
| Exito | Datos cargados | Todas las cards con numeros reales. Lista mensajes y actividad populada. |
| Error parcial | Un componente falla | La card o seccion que fallo muestra "Error al cargar" con boton "Reintentar". Las demas siguen visibles (REQ-211). |

#### Responsive

| Breakpoint | Cambios |
|---|---|
| Desktop (>= 1280px) | Sidebar 272px. Fila 1: 4 cards en fila. Fila 2: 3 cards. Fila 3: 2 cols 60/40. |
| Tablet (1024-1279px) | Sidebar colapsada (iconos 72px). Fila 1: 2x2. Fila 2: 3 cards. Fila 3: 1 col stacked. |
| Tablet (768-1023px) | Sidebar colapsada, expand on click. Fila 1: 2x2. Fila 2: 1 col. Fila 3: 1 col. |
| Mobile (< 768px) | Sin sidebar (hamburger). Fila 1: 1 col. Fila 2: 1 col. Fila 3: 1 col. |

---

### 4.3 Pantalla: Productos — Listado

**Ruta**: /admin/productos
**Layout**: Sidebar + header + area contenido con toolbar + filtros + toggle vista + grid/tabla + paginacion
**DEMO**: DEMO-028

#### Layout detallado

**Toolbar:**
- Titulo: "Productos" (24px Inter Bold)
- Subtitulo: "Gestiona el catalogo de productos del sitio" (14px, #6B7280)
- Boton: "+ Crear producto" (#008DC9, texto blanco, der) -> /admin/productos/crear

**Filtros:**
- Busqueda por nombre (input con icono lupa)
- Dropdown Categoria: Todos / Farmacos / Alimentos / Equipos
- Dropdown Marca: todas las marcas registradas
- Dropdown Estado: Todos / Activos / Inactivos
- Pills de filtros activos con "x"

**Toggle Vista:**
- Pill "Card view" (icono grid, default activo #008DC9)
- Pill "Table view" (icono lista, inactivo outline gris)

**Card View (default):**
- Grid 3 cols: cards con imagen (cuadrada, fondo #F5F7FA), nombre bold 16px, marca regular 14px gris, badge categoria (pill color: Farmaco=#EBF5FF texto #008DC9, Alimento=#DCFCE7 texto #22C55E, Equipo=#F0F2F5 texto #6B7280), badge estado (Activo=fondo #DCFCE7 texto #22C55E, Inactivo=fondo #FEE2E2 texto #EF4444), menu 3 puntos
- Menu 3 puntos: Editar, Ver en sitio, Duplicar, Desactivar/Activar, Eliminar
- Card hover: sombra 0 4px 12px rgba(0,0,0,0.12) + borde mas visible, transicion 0.2s

**Table View:**
- Headers UPPERCASE 12-13px #6B7280 con iconos sort
- Columnas: checkbox, imagen miniatura 40x40, NOMBRE, MARCA, CATEGORIA (badge), ESPECIE (badges), ESTADO (badge), ACCIONES (iconos editar + eliminar)
- Filas 48-56px, separadores 1px #E5E7EB
- Hover fila: fondo gris #F5F7FA (transicion 0.15s)
- Mobile: transformacion a stacked cards

**Paginacion:**
- "Mostrando 1-24 de 47 productos" + numeros + flechas

#### Componentes

| Componente | Tipo | Responsabilidad |
|---|---|---|
| product-list-toolbar | Smart | Busqueda, filtros, toggle, boton crear |
| view-toggle | Dumb | Toggle pill Card/Table |
| product-card-admin | Dumb | Card individual con badges y menu |
| data-table | Smart | Tabla con headers, sort, acciones |
| pagination | Smart | Controles paginacion + contador |
| empty-state | Dumb | Ilustracion + mensaje + CTA |

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Carga | Esperando datos | Skeleton: toolbar visible + 6 cards shimmer (card view) o 8 filas shimmer (table view) |
| Exito card view | Productos cargados, card view | Grid 3 cols con cards completas |
| Exito table view | Productos cargados, table view | Tabla con filas, badges, acciones |
| Vacio | 0 productos | Ilustracion SVG gris/azul + "No hay productos aun" (20px bold) + "Agrega tu primer producto para comenzar a construir tu catalogo" (14px gris) + boton "+ Crear tu primer producto" (#008DC9) |
| Muchos datos | Mas de 24 productos | Paginacion activa: "Mostrando 1-24 de 47 productos" |
| Filtros sin resultados | Filtros activos sin match | Mensaje: "No se encontraron productos con estos filtros" + boton "Limpiar filtros" |

#### Responsive

| Breakpoint | Cambios |
|---|---|
| Desktop (>= 1280px) | Sidebar 272px. Grid 3 cols. Tabla completa. |
| Tablet (1024-1279px) | Sidebar iconos. Grid 2 cols. Tabla completa. |
| Tablet (768-1023px) | Sidebar colapsada. Grid 2 cols. Tabla con scroll horizontal. |
| Mobile (< 768px) | Hamburger. Grid 1 col. Tabla transformada a stacked cards. |

---

### 4.4 Pantalla: Productos — Crear/Editar

**Ruta**: /admin/productos/crear | /admin/productos/:id/editar
**Layout**: Sidebar + header + area contenido con formulario en pantalla completa (NO modal, anti-patron #14). 5 secciones con subtitulo + descripcion + separador.
**DEMO**: DEMO-029

#### Layout detallado

**Breadcrumb:**
- Crear: "Productos > Crear producto"
- Editar: "Productos > Editar: [Nombre del producto]"

**Botones superiores (sticky alineados a la derecha):**
- "Cancelar" (outline gris) — si cambios sin guardar: modal confirmacion
- "Guardar producto" / "Guardar cambios" (#008DC9, texto blanco)
- "Eliminar producto" (outline rojo, solo en modo editar) — modal confirmacion

**Seccion 1: "Informacion basica"**
- Subtitulo: "Informacion basica" (18px Inter Bold, #1F2937)
- Descripcion: "Datos principales del producto" (14px, #6B7280)
- Separador: 1px #E5E7EB
- Campos (grid 2 cols para campos cortos):
  - Nombre (ES)* — input texto, label arriba
  - Nombre (EN) — input texto
  - Marca* — dropdown con busqueda (search-select)
  - Categoria* — 3 cards mini seleccionables (Farmaco con icono jeringa + fondo #EBF5FF, Alimento con icono plato + fondo #DCFCE7, Equipo con icono herramienta + fondo #F0F2F5). Card seleccionada tiene borde 2px #008DC9
- Campos: borde 1px #E5E7EB, border-radius 10px, height 44px, label Semibold 13px arriba

**Seccion 2: "Clasificacion y filtros"**
- Subtitulo: "Clasificacion y filtros"
- Descripcion: "Configura la clasificacion del producto para los filtros del catalogo"
- Separador
- Campos condicionales segun categoria seleccionada:
  - Si Farmaco: Especie(s) de destino* (multi-select con pills), Familia farmaceutica* (dropdown)
  - Si Alimento: Especie(s) de destino* (multi-select), Etapa de vida (dropdown: Cachorro/Kitten, Adulto, Senior, Todas las etapas)
  - Si Equipo: Tipo de equipo* (dropdown)
- Siempre visibles: Presentaciones (tag-input: chips + "+" para agregar), Estado (toggle switch)
- Transicion suave al cambiar categoria: campos aparecen/desaparecen con fade

**Seccion 3: "Descripcion y contenido"**
- Subtitulo: "Descripcion y contenido"
- Descripcion: "Textos descriptivos del producto en ambos idiomas"
- Separador
- Tabs pill ES/EN (activo #008DC9, inactivo outline gris)
- Campos condicionales por categoria (con tab activo):
  - Farmaco: Descripcion general (textarea), Formula/composicion (textarea), Registro sanitario (input), Indicaciones de uso (textarea)
  - Alimento: Descripcion (textarea), Ingredientes principales (textarea), Informacion nutricional (textarea)
  - Equipo: Descripcion (textarea), Especificaciones tecnicas (textarea), Garantia (input)
- Textareas: min-height 120px, auto-expand, borde y border-radius como inputs

**Seccion 4: "Imagen y ficha tecnica"**
- Subtitulo: "Imagen y ficha tecnica"
- Descripcion: "Sube las imagenes del producto (max 6) y la ficha tecnica PDF"
- Separador
- Zona imagenes:
  - Drop zone: borde dashed 2px #E5E7EB, border-radius 10px, padding 40px, icono upload centrado, texto "Arrastra imagenes aqui o haz clic para seleccionar" (14px gris)
  - Drag-over: borde cambia a #008DC9, fondo #E8F4FD
  - Imagenes subidas: grid de previews cuadradas (120x120) con boton "X" para eliminar y drag-handle para reordenar. Primera = imagen principal (badge "Principal")
  - Progress bar durante upload
- Zona PDF:
  - Drop zone similar pero mas compacta
  - Si hay PDF: muestra nombre archivo + tamano + botones "Descargar" y "Eliminar"

**Seccion 5: "Configuracion de publicacion"**
- Subtitulo: "Configuracion de publicacion"
- Descripcion: "Controla la visibilidad del producto en el sitio web"
- Separador
- Toggle: "Producto visible en el sitio web" (switch con label)
- Nota informativa: card con icono info #F59E0B + "El producto sera visible en el catalogo publico solo si esta activo y tiene al menos una imagen cargada."

#### Componentes

| Componente | Tipo | Responsabilidad |
|---|---|---|
| product-form | Smart | Maneja formulario completo, validacion, envio, estados |
| form-field | Dumb | Input con label, error inline, border-radius 10px |
| bilingual-input | Smart | Tabs ES/EN para campos texto bilingues |
| search-select | Smart | Dropdown con busqueda para Marca |
| tag-input | Dumb | Chips/pills con "x" y "+" para presentaciones |
| image-uploader | Smart | Drag-drop, preview, reorden, eliminar imagenes |
| pdf-uploader | Smart | Drag-drop, preview nombre/tamano, descargar/eliminar |
| confirm-modal | Dumb | Modal confirmacion para eliminar/salir sin guardar |
| toast | Dumb | Notificacion exito/error esquina sup-der |

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Formulario vacio | Crear nuevo producto | Campos vacios, categoria sin seleccionar, zonas de upload vacias |
| Formulario cargado | Editar producto existente | Campos pre-llenados, imagenes con preview, PDF con nombre |
| Campos condicionales | Cambio de categoria | Animacion fade: campos de categoria anterior desaparecen, nuevos aparecen |
| Validacion errores | Intentar guardar sin campos obligatorios | Campos invalidos: borde rojo #EF4444, mensaje error 12px rojo debajo del campo. Scroll automatico al primer campo con error |
| Guardando | Post-clic guardar, sin errores | Boton "Guardar" deshabilitado + spinner interno + texto "Guardando..." |
| Exito | Guardado correctamente | Toast verde "Producto guardado correctamente" (3s) + redirige al listado |
| Error guardado | Fallo al guardar | Toast rojo "Error al guardar el producto. Intenta de nuevo." Formulario mantiene datos |
| Confirmar eliminar | Clic en "Eliminar producto" | Modal: "Estas seguro de eliminar [Nombre]? Esta accion no se puede deshacer." Botones "Cancelar" (gris) + "Eliminar" (rojo) |
| Cambios sin guardar | Clic en "Cancelar" con cambios pendientes | Modal: "Tienes cambios sin guardar. Deseas salir?" Botones "Salir sin guardar" + "Seguir editando" |

#### Responsive

| Breakpoint | Cambios |
|---|---|
| Desktop (>= 1280px) | Sidebar 272px. Formulario con grid 2 cols campos cortos. |
| Tablet (1024-1279px) | Sidebar iconos. Formulario full-width, grid 2 cols se mantiene. |
| Mobile (< 768px) | Hamburger. Formulario 1 col, todos los campos full-width. Botones superiores sticky bottom. |

---

### 4.5 Pantalla: Productos — Detalle (Solo Lectura)

**Ruta**: /admin/productos/:id
**Layout**: Sidebar + header + area contenido con breadcrumb + 2 columnas (imagen izq + info der en bloques)
**DEMO**: DEMO-030

#### Layout detallado
- Breadcrumb: "Productos > [Nombre del producto]"
- Boton superior derecha: "Editar producto" (#008DC9) -> /admin/productos/:id/editar

**Columna izquierda (40%):**
- Imagen principal del producto (grande, fondo #F5F7FA, border-radius 12px)
- Si multiples imagenes: thumbnails debajo
- Boton "Ver en el sitio web" (outline #008DC9) -> abre nueva pestana con el producto en sitio publico
- Boton "Desactivar" o "Activar" (rojo outline / verde outline)

**Columna derecha (60%):**
- Bloques de informacion con labels:
  - Badge estado (Activo verde / Inactivo rojo) + Badge categoria (color)
  - Nombre: bold 24px
  - Marca: texto con link
  - Especie(s): badges/pills
  - Presentaciones: pills
  - Campos condicionales por categoria en solo lectura
  - Descripcion completa
  - Ficha tecnica: link "Descargar ficha tecnica" (solo si hay PDF)

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Carga | Esperando datos | Skeleton: imagen gris izq + bloques shimmer der |
| Exito | Producto cargado | 2 columnas con datos completos en solo lectura |
| Sin PDF | Producto sin ficha tecnica | Link de descarga no se muestra |
| Sin imagen | Producto sin imagen | Placeholder con icono categoria |

---

### 4.6 Pantalla: Marcas — Listado

**Ruta**: /admin/marcas
**Layout**: Sidebar + header + area contenido con toolbar + toggle vista + grid/tabla + paginacion
**DEMO**: DEMO-031

#### Layout detallado
- Toolbar: titulo "Marcas" + boton "+ Agregar marca"
- Toggle vista: Card view (default) / Table view
- Card view: grid 3 cols, cards con logo 80x80 centrado + nombre bold + pais (icono) + badges categorias (pills color) + conteo "X productos" + menu 3 puntos (Editar, Ver productos, Eliminar)
- Table view: headers UPPERCASE, columnas: logo miniatura, NOMBRE, PAIS, CATEGORIAS (badges), PRODUCTOS (conteo), ACCIONES

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Carga | Esperando datos | Skeleton: 6 cards con circulo gris + lineas shimmer |
| Exito card view | Marcas cargadas | Grid de cards con logos y badges |
| Exito table view | Marcas cargadas | Tabla con filas, badges, conteos |
| Vacio | 0 marcas | Ilustracion SVG + "No hay marcas registradas" + "Agrega tu primera marca para empezar" + boton "+ Crear marca" |

#### Responsive

| Breakpoint | Cambios |
|---|---|
| Desktop (>= 1280px) | Sidebar 272px. Grid 3 cols. |
| Tablet (1024-1279px) | Sidebar iconos. Grid 2 cols. |
| Mobile (< 768px) | Hamburger. Grid 1 col. Tabla stacked. |

---

### 4.7 Pantalla: Marcas — Crear/Editar

**Ruta**: /admin/marcas/crear | /admin/marcas/:id/editar
**Layout**: Sidebar + header + area contenido con formulario corto (1 seccion principal)
**DEMO**: DEMO-032

#### Layout detallado
- Breadcrumb: "Marcas > Crear marca" o "Marcas > Editar: [Nombre]"
- Formulario (seccion unica):
  - Subtitulo: "Informacion de la marca" (18px Bold)
  - Descripcion: "Datos de la marca que se mostraran en el sitio" (14px gris)
  - Separador
  - Logo: zona drag-drop con preview circular 80x80
  - Nombre*: input texto
  - Pais de origen*: dropdown con busqueda de paises
  - Categorias que maneja*: multi-select checkboxes (Farmacos, Alimentos, Equipos)
  - Descripcion (ES): textarea
  - Descripcion (EN): textarea (o tabs bilingues)
- Botones: "Cancelar" (gris) + "Guardar marca" (#008DC9)
- En edicion: "Eliminar marca" (rojo outline)

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Formulario vacio | Crear nueva marca | Campos vacios, zona logo vacia |
| Formulario cargado | Editar marca existente | Campos pre-llenados, logo con preview |
| Validacion errores | Campos obligatorios faltantes | Bordes rojos, mensajes error inline |
| Guardando | Post-clic guardar | Spinner en boton |
| Exito | Guardado | Toast verde + redirige a listado |
| Eliminar con advertencia | Marca tiene productos | Modal: "Esta marca tiene X productos asociados. Eliminar la marca no eliminara los productos. Deseas continuar?" |

---

### 4.8 Pantalla: Categorias

**Ruta**: /admin/categorias
**Layout**: Sidebar + header + area contenido con 3 cards expandibles
**DEMO**: DEMO-033

#### Layout detallado
- Titulo: "Categorias" (24px Bold)
- Subtitulo: "Gestiona las subcategorias y valores de filtro para cada tipo de producto" (14px gris)

**3 cards expandibles:**

Card 1 — Farmacos:
- Header: icono jeringa en circulo #EBF5FF + "Farmacos" bold + chevron expand/collapse
- Expandido:
  - Subseccion "Familias farmaceuticas": fila de chips/pills (Antibioticos, Desparasitantes, Vitaminas, etc.) cada uno con "x" para eliminar + boton "+" para agregar (input inline)
  - Subseccion "Especies": fila de chips (Caninos, Felinos, Bovinos, etc.) + "+"

Card 2 — Alimentos:
- Subseccion "Etapas de vida": chips (Cachorro/Kitten, Adulto, Senior) + "+"
- Subseccion "Especies": chips compartidos con Farmacos + "+"

Card 3 — Equipos:
- Subseccion "Tipos de equipo": chips (Diagnostico, Quirurgico, Laboratorio, etc.) + "+"

**Interacciones:**
- Clic en "+" abre input inline con boton confirmar
- Clic en "x" de un chip:
  - Si no hay productos usando ese valor: elimina inmediatamente
  - Si hay productos usando ese valor: modal advertencia "Este valor esta en uso por X productos. Al eliminarlo, estos productos perderan esta clasificacion. Continuar?"
- Guardar: toast "Categorias actualizadas"

#### Componentes

| Componente | Tipo | Responsabilidad |
|---|---|---|
| category-card-expandable | Smart | Card expandible con subsecciones de tags |
| tag-input | Dumb | Chips con "x" + "+" inline |
| confirm-modal | Dumb | Advertencia de productos afectados |

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Carga | Esperando datos | Skeleton: 3 cards con header shimmer |
| Exito | Datos cargados | 3 cards con chips editables |
| Agregar tag | Input inline activo | Input con borde #008DC9, boton "Agregar" |
| Eliminar tag con productos | Tag en uso | Modal advertencia con conteo productos afectados |

---

### 4.9 Pantalla: Home — Hero

**Ruta**: /admin/home/hero
**Layout**: Sidebar + header + area contenido con preview de imagen + formulario de campos ES/EN
**DEMO**: DEMO-034

#### Layout detallado
- Titulo seccion: "Gestion del Hero" (en el header del panel)
- Tabs pill: Hero (activo) | Productos Destacados | Marcas Destacadas

**Preview imagen:**
- Imagen actual del hero en preview (aspect-ratio 16:9, max-width 100%, border-radius 12px)
- Boton "Cambiar imagen" sobre la imagen (overlay hover)
- Barra de progreso durante upload

**Campos editables (tabs ES/EN):**
- Tab ES (activo por default):
  - Tag superior*: "DESDE 1989"
  - Headline*: "Tu aliado veterinario de confianza en Costa Rica"
  - Subtitulo*: textarea
  - CTA primario texto*: "Explorar catalogo"
  - CTA secundario texto*: "Distribuya con nosotros"
- Tab EN:
  - Mismos campos en ingles

**Botones:**
- "Guardar cambios" (#008DC9) -> toast exito + cambios reflejados en sitio publico

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Carga | Esperando datos | Skeleton: rectangulo gris (preview) + formulario shimmer |
| Exito | Datos cargados | Preview imagen + campos editables pre-llenados |
| Subiendo imagen | Upload en progreso | Barra de progreso sobre la zona de preview |
| Guardado | Post-guardar exitoso | Toast verde "Hero actualizado correctamente" |

---

### 4.10 Pantalla: Home — Productos Destacados

**Ruta**: /admin/home/productos-destacados
**Layout**: Sidebar + header + area contenido con lista de productos seleccionados + boton agregar
**DEMO**: DEMO-035

#### Layout detallado
- Tabs pill: Hero | Productos Destacados (activo) | Marcas Destacadas
- Lista de cards horizontales de productos destacados:
  - Cada card: drag-handle (6 puntos) + miniatura 48x48 + nombre bold + marca gris + boton "X" para remover
  - Drag-and-drop para reordenar
- Boton "+ Agregar producto":
  - Abre modal de seleccion:
    - Busqueda por nombre (input con lupa)
    - Filtro por categoria (dropdown)
    - Lista de productos activos con checkboxes
    - Boton "Agregar seleccionados"
- Boton "Guardar orden" (#008DC9)

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Carga | Esperando datos | Skeleton: 4 filas shimmer |
| Exito | Productos destacados cargados | Lista de cards horizontales con drag-handles |
| Vacio | Sin productos destacados | Mensaje: "No hay productos destacados. La seccion no se mostrara en el home." + boton "+ Agregar productos" |
| Modal seleccion | Buscando productos | Modal con lista scrollable, checkboxes, busqueda |
| Reordenando | Arrastrando card | Card elevada con sombra, posicion fantasma en destino |
| Guardado | Post-guardar | Toast "Productos destacados actualizados" |

---

### 4.11 Pantalla: Home — Marcas Destacadas

**Ruta**: /admin/home/marcas-destacadas
**Layout**: Identico al patron de Productos Destacados pero para marcas
**DEMO**: DEMO-036

- Tabs pill: Hero | Productos Destacados | Marcas Destacadas (activo)
- Lista de cards horizontales con logos de marcas seleccionadas
- Modal de seleccion de marcas (similar al de productos)
- Drag-and-drop para reordenar
- Mismos estados que Productos Destacados

---

### 4.12 Pantalla: Contenido Estatico

**Ruta**: /admin/contenido/nosotros | distribuidores | contacto | politicas
**Layout**: Sidebar + header + area contenido con tabs pill + formularios ES/EN por seccion
**DEMO**: DEMO-037

#### Layout detallado
- Tabs pill: Nosotros (activo) | Distribuidores | Contacto | Politicas comerciales
- Cada tab muestra formulario con campos organizados por seccion de la pagina
- Cada campo tiene version ES e EN (tabs bilingues o campos lado a lado)

**Tab Nosotros:**
- Seccion "Hero": Titulo (ES/EN), Subtitulo (ES/EN), Imagen hero (drag-drop)
- Seccion "Historia": Contenido narrativo (ES/EN, textarea grande)
- Seccion "Numeros clave": 4 bloques editables (numero, label ES/EN, icono)
- Seccion "Cobertura": Texto cobertura (ES/EN, textarea)

**Tab Distribuidores:**
- Seccion "Hero": Titulo (ES/EN), Subtitulo (ES/EN), Imagen (drag-drop)
- Seccion "Beneficios": 6 campos (titulo ES/EN, descripcion ES/EN por beneficio)
- Seccion "Timeline": 4 pasos (titulo ES/EN, descripcion ES/EN por paso)

**Tab Contacto:**
- Seccion "Texto introductorio": Titulo (ES/EN), Subtitulo (ES/EN)

**Tab Politicas comerciales:**
- Seccion "Contenido": Texto completo politicas (ES/EN, textarea grande)

**Boton por tab:** "Guardar cambios" (#008DC9) -> toast exito

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Carga | Esperando datos | Tabs visibles + formulario shimmer |
| Exito | Datos cargados | Campos pre-llenados con contenido actual |
| Guardado | Post-guardar | Toast verde "Contenido actualizado correctamente" |
| Error | Fallo al guardar | Toast rojo "Error al guardar. Intenta de nuevo." |

---

### 4.13 Pantalla: Equipo de Liderazgo

**Ruta**: /admin/contenido/equipo
**Layout**: Sidebar + header + area contenido con grid de miembros + boton agregar
**DEMO**: DEMO-038

#### Layout detallado
- Titulo: "Equipo de Liderazgo" (24px Bold)
- Subtitulo: "Gestiona los miembros del equipo que se muestran en la pagina Nosotros" (14px gris)
- Boton "+ Agregar miembro" (der, #008DC9)

**Grid de miembros (3 cols desktop, 2 tablet, 1 mobile):**
- Cada card:
  - Foto circular 100x100 (o placeholder gris si no hay foto)
  - Nombre bold 16px
  - Cargo 14px gris
  - Botones: "Editar" (icono lapiz) + "Eliminar" (icono basura)
  - Drag-handle (6 puntos) para reordenar
- 6 miembros pre-cargados con placeholders ficticios inicialmente

**Agregar/Editar miembro (formulario inline o pantalla dedicada):**
- Foto: drag-drop con preview circular
- Nombre (ES)*: input
- Nombre (EN): input
- Cargo (ES)*: input
- Cargo (EN): input
- Boton "Guardar" + "Cancelar"

#### Componentes

| Componente | Tipo | Responsabilidad |
|---|---|---|
| team-grid | Smart | Carga miembros, maneja reorden |
| team-member-card-admin | Dumb | Card con foto, nombre, cargo, botones |
| team-form | Smart | Formulario agregar/editar miembro |

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Carga | Esperando datos | Skeleton: 6 cards con circulo gris + lineas shimmer |
| Exito | Miembros cargados | Grid con fotos, nombres y cargos. Drag-handles visibles |
| Vacio | 0 miembros (todos eliminados) | Ilustracion SVG + "No hay miembros del equipo" + "La seccion de equipo no se mostrara en el sitio" + boton "+ Agregar miembro" |
| Eliminar | Clic en eliminar | Modal: "Estas seguro de eliminar a [Nombre]?" + "Cancelar" + "Eliminar" |
| Reordenando | Drag-drop activo | Card elevada con sombra |
| Guardado | Post-guardar | Toast "Equipo actualizado correctamente" |

---

### 4.14 Pantalla: Mensajes — Listado

**Ruta**: /admin/mensajes
**Layout**: Sidebar + header + area contenido con toolbar + toggle kanban/tabla + contenido
**DEMO**: DEMO-039

#### Layout detallado

**Toolbar:**
- Titulo: "Mensajes" (24px Bold)
- Toggle vista: Kanban (default) / Tabla
- Filtros: tipo de consulta (dropdown), estado (dropdown), busqueda por nombre/correo
- Boton "Exportar CSV" (outline, icono descarga)

**Vista Kanban (default):**
- 3 columnas equidistantes:
  - NUEVOS (3) — header UPPERCASE 12px #6B7280 + conteo
  - EN PROCESO (1) — header UPPERCASE + conteo
  - ATENDIDOS (8) — header UPPERCASE + conteo
- Cards en cada columna:
  - Badge tipo (pill color): Informacion=#EBF5FF azul, Comercial=#DCFCE7 verde, Soporte=#FEF3C7 naranja, Fabricante=#EDE9FE morado, Otro=#F0F2F5 gris
  - Nombre contacto bold 15px
  - Correo electronico 13px gris
  - Preview mensaje: 2 lineas truncadas 13px
  - Fecha: "Hace 2 horas" o "15 mar 2026" (12px gris)
  - Mini-badge producto si aplica (12px)
- Drag-and-drop entre columnas (cambio de estado)
- Click en card -> navega a detalle
- SIN avatares (HESA no tiene usuarios asignados)

**Vista Tabla:**
- Headers UPPERCASE: NOMBRE, CORREO, TELEFONO, TIPO (badge), PRODUCTO, FECHA, ESTADO (badge), ACCIONES (ver/eliminar)
- Badges estado: Nuevo=#FEF3C7 naranja, En proceso=#EBF5FF azul, Atendido=#DCFCE7 verde
- Iconos accion: ojo (ver detalle) + basura (eliminar con confirmacion)
- Hover fila: fondo gris suave

#### Componentes

| Componente | Tipo | Responsabilidad |
|---|---|---|
| kanban-board | Smart | Maneja 3 columnas, drag-drop, conteos |
| message-card-kanban | Dumb | Card individual con badge, nombre, preview |
| data-table | Smart | Tabla con headers, badges, paginacion |
| view-toggle | Dumb | Toggle Kanban/Tabla |

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Carga | Esperando datos | Skeleton kanban: 3 columnas con header shimmer + 2-3 cards shimmer por columna |
| Exito kanban | Mensajes cargados | 3 columnas con cards, conteos actualizados |
| Exito tabla | Mensajes cargados | Tabla con filas, badges, paginacion |
| Vacio | 0 mensajes | Ilustracion SVG + "No hay mensajes aun" + "Los mensajes del formulario de contacto apareceran aqui" |
| Vacio por columna | Columna kanban sin cards | Mensaje sutil en la columna: "Sin mensajes" (texto gris, centrado) |
| Drag-drop | Arrastrando card | Card elevada con sombra elevated, columna destino con borde #008DC9 |

#### Responsive

| Breakpoint | Cambios |
|---|---|
| Desktop (>= 1280px) | Sidebar 272px. Kanban 3 cols equidistantes. Tabla completa. |
| Tablet (1024-1279px) | Sidebar iconos. Kanban 3 cols comprimidas. Tabla con scroll. |
| Mobile (< 768px) | Hamburger. Kanban: columnas apiladas verticalmente. Tabla: stacked cards. |

---

### 4.15 Pantalla: Mensajes — Detalle

**Ruta**: /admin/mensajes/:id
**Layout**: Sidebar + header + area contenido con card datos contacto + contenido mensaje + notas internas + acciones
**DEMO**: DEMO-040

#### Layout detallado
- Breadcrumb: "Mensajes > Detalle de mensaje"
- Boton "Volver a mensajes" (icono flecha izq, texto link)

**Layout 2 columnas (30% lateral + 70% contenido):**

Columna izquierda — Card datos contacto:
- Card fondo blanco, border-radius 16px, sombra sutil, padding 20px
- Nombre bold 18px
- Correo: icono + email (link mailto:)
- Telefono: icono + numero (link tel:) o "No proporcionado"
- Tipo de consulta: badge color (pill)
- Producto de interes: nombre + link al producto en panel (si aplica)
- Fecha recibido: "15 de marzo de 2026, 14:32" (14px gris)

Columna derecha — Contenido y acciones:
- Estado actual: dropdown (Nuevo / En proceso / Atendido) con cambio inmediato
- Contenido del mensaje: texto completo, fondo #F5F7FA, padding 24px, border-radius 12px
- Notas internas:
  - Titulo: "Notas internas" (16px Bold)
  - Textarea con contenido existente (si hay)
  - Boton "Guardar nota" (outline #008DC9)
- Acciones:
  - Boton "Marcar como atendido" (#008DC9, solo si no esta en Atendido) -> cambia estado + toast + redirige a listado
  - Boton "Eliminar mensaje" (rojo outline) -> modal confirmacion

#### Componentes

| Componente | Tipo | Responsabilidad |
|---|---|---|
| message-contact-card | Dumb | Card lateral con datos del contacto |
| message-content | Dumb | Bloque de contenido del mensaje |
| message-notes | Smart | Textarea notas internas con guardado |
| status-dropdown | Smart | Dropdown cambio de estado con actualizacion |

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Carga | Esperando datos | Skeleton: card lateral shimmer + contenido shimmer |
| Exito | Mensaje cargado | Datos contacto + mensaje completo + notas |
| Cambio estado | Dropdown seleccionado | Estado se actualiza, toast "Estado actualizado a [Nuevo estado]" |
| Nota guardada | Post-guardar nota | Toast "Nota guardada" |
| Eliminar | Clic eliminar | Modal: "Eliminar este mensaje? Esta accion no se puede deshacer." |

#### Responsive

| Breakpoint | Cambios |
|---|---|
| Desktop (>= 1280px) | 2 cols: card lateral 30% + contenido 70% |
| Mobile (< 768px) | 1 col: card datos arriba + contenido debajo + notas + acciones |

---

### 4.16 Pantalla: Configuracion

**Ruta**: /admin/configuracion
**Layout**: Sidebar + header + area contenido con 4 tabs pill + formularios organizados
**DEMO**: DEMO-041

#### Layout detallado
- Tabs pill: General (activo) | Contacto | Redes sociales | SEO
- Cada tab con icono + texto, activo #008DC9, inactivo outline gris

**Tab General:**
- Seccion "Informacion de la empresa":
  - Logo del sitio: zona drag-drop con preview
  - Nombre de la empresa: input (pre-llenado "HESA — Herrera y Elizondo S.A.")
  - Slogan (ES/EN): tabs bilingues
  - Idioma por defecto: dropdown (Espanol / Ingles)

**Tab Contacto:**
- Seccion "Datos de contacto":
  - Telefono principal: input (+506 2260-9020)
  - Correo electronico: input (hola@linkdesign.cr)
  - Direccion fisica: textarea (Calle 2, av 12. Heredia, Costa Rica)
  - Horario de atencion: input (placeholder editable)
  - Numero WhatsApp: input (para boton flotante)

**Tab Redes sociales:**
- Seccion "Perfiles de redes sociales":
  - URL Facebook: input
  - URL Instagram: input
  - Campos opcionales para otras redes

**Tab SEO:**
- Seccion "Optimizacion para motores de busqueda":
  - Meta titulo general (ES/EN): tabs bilingues
  - Meta descripcion general (ES/EN): tabs bilingues, textarea
  - OG Image: drag-drop con preview

**Boton por tab:** "Guardar cambios" (#008DC9)

#### Estados de UI

| Estado | Descripcion | Indicador visual |
|---|---|---|
| Carga | Esperando datos | Tabs visibles + formulario shimmer |
| Exito | Datos cargados | Campos pre-llenados con configuracion actual |
| Guardado | Post-guardar | Toast verde "Configuracion guardada correctamente" |
| Error | Fallo | Toast rojo "Error al guardar. Intenta de nuevo." |

#### Responsive

| Breakpoint | Cambios |
|---|---|
| Desktop (>= 1280px) | Sidebar 272px. Tabs en fila horizontal. |
| Tablet (768-1023px) | Sidebar colapsada. Tabs en fila. |
| Mobile (< 768px) | Hamburger. Tabs en 2 filas (2+2). Campos full-width. |

---

## 5. Sistema Bilingue — Patron de Navegacion

**DEMO**: DEMO-042

### URLs y Slugs

| Pagina | URL ES | URL EN |
|---|---|---|
| Home | /es/ | /en/ |
| Catalogo General | /es/catalogo | /en/catalog |
| Catalogo Farmacos | /es/catalogo/farmacos | /en/catalog/pharmaceuticals |
| Catalogo Alimentos | /es/catalogo/alimentos | /en/catalog/food |
| Catalogo Equipos | /es/catalogo/equipos | /en/catalog/equipment |
| Detalle Producto | /es/catalogo/[cat]/[slug-es] | /en/catalog/[cat-en]/[slug-en] |
| Marcas | /es/marcas | /en/brands |
| Marca Individual | /es/marcas/[slug] | /en/brands/[slug] |
| Nosotros | /es/nosotros | /en/about |
| Distribuidores | /es/distribuidores | /en/distributors |
| Contacto | /es/contacto | /en/contact |
| Busqueda | /es/busqueda?q= | /en/search?q= |

### Comportamiento del selector de idioma
1. Primera visita: detecta idioma del navegador. Si ES -> /es/. Si EN -> /en/. Default: /es/.
2. Cambio de idioma: mantiene al usuario en la misma pagina, solo cambia el idioma del contenido y la URL.
   Ejemplo: /es/catalogo/farmacos/amoxicilina -> /en/catalog/pharmaceuticals/amoxicillin
3. Fallback: si un producto no tiene traduccion EN, se muestra en ES con indicador visual "Traduccion no disponible" (badge naranja sutil).
4. hreflang: cada pagina tiene etiquetas hreflang que conectan las versiones ES y EN.

---

## 6. Responsive Strategy Completa

**DEMO**: DEMO-043

### Sitio Publico (mobile-first, 375px base)

| Breakpoint | Dispositivo | Cambios principales |
|---|---|---|
| 375px (base) | Mobile | 1 columna. Hamburger menu. CTAs full-width. Footer acordeones. Filtros en drawer. Grid 1-2 cols. Sticky bar bottom. Font hero 32px. |
| 768px | Tablet | 2 columnas donde aplique. Menu condensado o hamburger. Grid 2 cols. Bloques stack vertical. Carrusel 2 cards. |
| 1024px | Laptop | Header completo con menu. Grid 3 cols. Detalle producto 2 cols. Bloques 50/50. Timeline horizontal. |
| 1280px | Desktop | Layout completo como diseno. Max-width 1280px centrado. Padding lateral 40px. Hero 100vh. |
| 1440px+ | Wide | Mismo que 1280px pero con mas whitespace lateral. |

### Panel Admin (desktop-first, 1280px base)

| Breakpoint | Dispositivo | Cambios principales |
|---|---|---|
| >= 1280px | Desktop | Sidebar 272px + contenido. Cards 3 cols. Tablas completas. Kanban 3 cols. |
| 1024-1279px | Tablet landscape | Sidebar colapsable (solo iconos ~72px). Cards 2 cols. Tablas completas. Kanban 3 cols comprimidas. |
| 768-1023px | Tablet portrait | Sidebar colapsada por defecto, expand on click. Cards 2 cols. Tablas con scroll. Kanban cols comprimidas. |
| < 768px | Mobile | Sin sidebar (hamburger menu). Cards 1 col. Tablas transformadas a stacked cards (labels UPPERCASE izq + valores der). Kanban columnas apiladas verticalmente. Formularios 1 col. Tabs en 2 filas. |

---

## 7. Paginas Especiales

### 7.1 Pagina 404 (No Encontrada)

**Ruta**: Cualquier URL invalida
**Layout**: Centrado vertical y horizontal

- Ilustracion SVG profesional (tono #E8F4FD y #008DC9, ~250px)
- Titulo: "Pagina no encontrada" / "Page Not Found" (36px Bold)
- Descripcion: "Lo sentimos, la pagina que buscas no existe o ha sido movida." (16px gris)
- Boton primario: "Volver al inicio" / "Back to Home" (#008DC9)
- Boton secundario: "Explorar catalogo" / "Explore Catalog" (outline)

### 7.2 Pagina de Error del Servidor (500)

**Ruta**: Error interno
**Layout**: Centrado vertical y horizontal

- Ilustracion SVG profesional (tono gris/naranja)
- Titulo: "Algo salio mal" / "Something went wrong"
- Descripcion: "Estamos trabajando para solucionarlo. Intenta de nuevo en unos minutos."
- Boton: "Reintentar" / "Try Again"

---

## 8. Patron de Busqueda Global — Sitio Publico

**DEMO**: DEMO-023 (soporte)

### Comportamiento del Search Overlay

1. **Activacion**: Clic en icono lupa del header
2. **Overlay**: Fondo oscuro semi-transparente (rgba(0,0,0,0.5)), input centrado en zona superior
3. **Input**: font-size 20px, placeholder "Buscar productos, marcas...", auto-focus, sin borde (solo underline sutil)
4. **Predicciones**: Dropdown debajo del input tras 3+ caracteres
   - Agrupados: "Productos (max 5)" + "Marcas (max 5)"
   - Cada resultado: thumbnail 40x40 + nombre bold + tipo badge (gris)
   - Keyboard navigable: flechas arriba/abajo + Enter para seleccionar
5. **Sin resultados**: "No se encontraron resultados para '[termino]'" + link "Ver catalogo completo"
6. **Seleccion**: Clic o Enter -> navega a la pagina del producto/marca, overlay se cierra
7. **Cierre**: Clic fuera del overlay, tecla Escape, o icono X
8. **Mobile**: overlay full-screen en vez de overlay parcial

---

## 9. Gaps de UX Descubiertos

| # | Gap | Impacto | Recomendacion |
|---|---|---|---|
| GAP-UX01 | Los requirements no definen estados de carga (skeleton) para ninguna pantalla | Todas las pantallas, ambas apps | Definidos en este documento: skeleton screens con shimmer animation para cada pantalla, mismas dimensiones que contenido real |
| GAP-UX02 | No hay definicion de que pasa si el token de Azure Entra ID expira mientras el admin esta usando el panel | REQ-311 | Interceptor detecta 401, muestra modal "Tu sesion ha expirado. Inicia sesion nuevamente." con boton que redirige al login de Azure |
| GAP-UX03 | No se define el comportamiento cuando el admin edita contenido y otro admin edita lo mismo (concurrencia) | Toda la gestion de contenido | Para v1: "last write wins" sin deteccion de conflictos. Documentar como limitacion conocida. Para v2: agregar timestamps de ultima edicion visibles |
| GAP-UX04 | Los requirements no definen flujo de duplicar producto (REQ-228 solo lo lista como opcion de menu) | REQ-228 | Duplicar: copia todos los campos del producto a un formulario de creacion nuevo con nombre "[Original] (copia)". El admin puede editar antes de guardar |
| GAP-UX05 | No se define el comportamiento del search overlay en mobile cuando el teclado virtual cubre la pantalla | REQ-035 a REQ-041 | En mobile: el search overlay es full-screen. El input queda en la parte superior. Los resultados se muestran debajo y son scrolleables sobre el teclado |
| GAP-UX06 | No hay definicion de confirmacion al cambiar estado de un mensaje desde el dropdown (REQ-298), solo al usar drag-drop | REQ-298 | Cambio de estado via dropdown: actualizacion inmediata (sin confirmacion) + toast confirmacion "Estado actualizado a [estado]". Solo acciones destructivas (eliminar) requieren modal |
| GAP-UX07 | REQ-296 define color "morado" para mensajes de tipo "Fabricante" pero no hay morado en la paleta prescrita | REQ-296 | Usar #7C3AED (purple-600) con fondo suave #EDE9FE. Es el unico color fuera de paleta, justificado por la necesidad de diferenciar 5 tipos de mensaje |
| GAP-UX08 | No hay definicion de que pasa con los filtros del catalogo cuando el usuario usa el boton "atras" del navegador | REQ-099 | Los filtros activos se reflejan en la URL (query params). Al usar "atras", los filtros se restauran desde la URL. Comportamiento nativo del navegador con history state |
| GAP-UX09 | No se define el limite de caracteres para el preview de mensajes en el kanban ni en la tabla | REQ-291 | Kanban: max 80 caracteres (2 lineas truncadas con "..."). Tabla: max 60 caracteres (1 linea truncada). |
| GAP-UX10 | REQ-169 dice mapa SVG de Costa Rica pero no define si debe ser interactivo o solo visual | REQ-169 a REQ-171 | Solo visual (ilustrativo). SVG estatico en tono #E8F4FD con puntos #008DC9 para cobertura. No interactivo, no clickable. Complementado con texto descriptivo |
| GAP-UX11 | No hay definicion del comportamiento de la seccion de storytelling cuando el producto tiene contenido parcial (texto sin imagen o viceversa) | REQ-135 a REQ-137 | Si un bloque de storytelling tiene texto pero no imagen: renderizar solo texto full-width. Si tiene imagen pero no texto: no renderizar el bloque. Ambos campos deben estar presentes para el layout 50/50 |
| GAP-UX12 | No hay pantalla de "Ver en sitio" para productos inactivos desde el panel | REQ-228 | Si el producto esta inactivo: el boton "Ver en sitio" muestra tooltip "El producto no es visible en el sitio publico porque esta inactivo" y no es clickable (disabled) |

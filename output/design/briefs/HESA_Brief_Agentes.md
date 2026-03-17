# Brief para Agentes: Sitio Web HESA (Herrera y Elizondo S.A.)

Documento de referencia para agentes de IA encargados del diseno y desarrollo del sitio web corporativo y catalogo de productos de HESA.

---

## ANTES DE COMENZAR: INSTRUCCION OBLIGATORIA

**DEBES visitar los siguientes sitios web ANTES de escribir una sola linea de codigo o tomar cualquier decision de diseno.** Las descripciones en este documento son una guia, pero NO reemplazan la experiencia de ver los sitios en vivo. Los detalles visuales (espaciados exactos, proporciones, transiciones, calidad fotografica, sensacion general de uso) solo se entienden navegando los sitios reales. Si te saltas este paso, el resultado sera generico e incorrecto.

**Referencia principal de diseno (OBLIGATORIO navegar todas las paginas):**
- Home: https://www.tuftandpaw.com/
- Pagina de coleccion/catalogo: https://www.tuftandpaw.com/collections/cat-litter
- Pagina de detalle de producto: https://www.tuftandpaw.com/products/really-great-cat-litter
- Navegar tambien: /collections/cat-food, /collections/cat-furniture y al menos 2 productos diferentes

Al navegar Tuft and Paw, presta atencion especifica a: el tamano real de la tipografia del hero, la cantidad de espacio en blanco entre secciones, como se siente el hover en las cards de producto, la barra sticky que aparece al hacer scroll en la pagina de producto, los bloques de color (verde menta, rosa) que usan para storytelling, y el footer con el logo grande como cierre de marca.

**Sitios de la competencia (OBLIGATORIO visitar para entender que NO hacer):**
- Competidor principal (Monteco global): https://grupomonteco.com/
- Competidor principal (Monteco Costa Rica): https://montecocr.com/
- Competidor (VETIM): https://www.vetimsa.com/
- Competidor (Belina): https://www.belinanutricion.com/

Al navegar la competencia, observa el nivel de diseno que tienen: layouts genericos, poco espacio entre elementos, tipografia sin personalidad, cards de producto basicas. ESO es lo que debemos superar ampliamente. El sitio de HESA debe sentirse de una categoria completamente diferente.

**NO procedas con el desarrollo sin haber visitado todos estos sitios.** La descripcion textual de este brief complementa lo que veras en los sitios, pero nunca lo sustituye.

---

## 1. CONTEXTO DEL PROYECTO

### Quien es HESA

NOTA IMPORTANTE SOBRE ESTRUCTURA DE GRUPO: HESA es parte de un grupo de cuatro empresas que funcionan como una sola operacion. El sitio web es unicamente para HESA (Herrera y Elizondo S.A.), pero los productos pueden provenir de cualquiera de las cuatro entidades del grupo. En el catalogo, esto se puede manejar con un tag, badge o indicador sutil (por ejemplo, "Facturado por: [nombre de empresa del grupo]") en cada producto, administrable desde el panel. No se necesitan cuatro sitios; es un solo sitio, un solo catalogo, pero con la posibilidad de identificar la entidad que factura cada producto si fuera necesario.

Herrera y Elizondo S.A. (HESA) es una empresa familiar costarricense de segunda generacion con 37 anos en el mercado. Se dedica a la importacion y distribucion de farmacos veterinarios, alimentos para animales y equipos veterinarios. Opera exclusivamente en el sector veterinario (no quimicos, no agroquimicos, no juguetes). Tiene mas de 50 colaboradores en planta, 18-20 agentes de ventas propios que cubren todo el territorio nacional con visitas quincenales, y flotilla propia de entrega. No utiliza subdistribuidores; todos los agentes son empleados directos de la empresa.

HESA representa marcas internacionales de forma exclusiva en la mayoria de los casos. Todos los productos son importados (no hay marcas nacionales). La empresa esta en proceso de expansion a Centroamerica a traves de una operacion de zona franca, negociando principalmente con fabricantes de China y otros paises de Asia.

### Que debe lograr este sitio web

El sitio debe cumplir dos funciones criticas de forma simultanea:

**Funcion 1 - Catalogo de productos para clientes locales:** Veterinarias, pet shops, groomers, agroservicios y grandes almacenes necesitan consultar que productos distribuye HESA, buscar por especie, por marca, por familia farmaceutica. NO es una tienda en linea. No hay precios, no hay inventario visible, no hay carrito de compras, no hay checkout, no hay registro de usuarios. Es un catalogo informativo profesional donde el cliente encuentra el producto que busca y luego contacta a HESA por los canales tradicionales (telefono, WhatsApp, formulario).

**Funcion 2 - Presencia corporativa para fabricantes internacionales:** Fabricantes de Asia, Europa y America que estan evaluando a HESA como distribuidor necesitan ver: cuantos anos lleva HESA en el mercado, que tan buena es su penetracion, si cubren todo el pais con agentes propios, si son exclusivos del sector veterinario, que otras marcas ya confian en ellos. Esta seccion debe funcionar como un pitch comercial convincente. Los fabricantes ven el sitio web como validacion de que HESA es una empresa real, seria y con capacidad de distribucion. Esta pagina debe estar optimizada especialmente en su version en ingles.

### Por que importa la calidad visual

HESA compite con empresas como Monteco (grupomonteco.com / montecocr.com), VETIM (vetimsa.com) y Belina (belinanutricion.com). Todos estos sitios tienen un nivel de diseno funcional pero comun: layouts genericos, estetica corporativa convencional, poca atencion al detalle visual. El sitio de HESA debe superar significativamente a todos estos competidores. No basta con ser "bonito"; debe transmitir que HESA es una empresa de primer nivel, moderna, confiable y con estandares internacionales. La calidad visual del sitio es una declaracion de posicionamiento.

---

## 2. REFERENCIA DE DISENO PRINCIPAL: TUFT AND PAW

**URL:** https://www.tuftandpaw.com/

**RECORDATORIO:** Si no has visitado este sitio aun, hazlo AHORA antes de seguir leyendo. Navega el home completo (scroll hasta el footer), entra a /collections/cat-litter, y entra a al menos un producto. Las descripciones que siguen asumen que ya viste el sitio y entiendes visualmente lo que se describe.

Este es el estandar visual y de experiencia de usuario que debe guiar todo el diseno del sitio de HESA. A continuacion se detallan los patrones especificos que los agentes deben replicar y adaptar.

### 2.1 Filosofia de diseno general

Tuft and Paw transmite premium a traves de la simplicidad. No es un sitio recargado; es un sitio donde cada elemento tiene espacio para respirar. Los agentes deben interiorizar estos principios:

- **Espacio en blanco generoso.** Entre secciones hay amplios margenes. Las cards de productos no estan apretadas. Los textos no estan pegados a los bordes. El espacio vacio es tan importante como el contenido.
- **Tipografia como elemento de diseno.** Los titulos son grandes, bold, con personalidad. No son titulos genericos de 24px; son declaraciones visuales de 48-64px que anclan cada seccion. La jerarquia tipografica es muy clara: titulo grande, subtitulo ligero, cuerpo de texto en gris suave.
- **Colores usados con intencion.** Tuft and Paw no pinta todo de un solo color. Usa bloques de color (verde menta, rosa pastel, lila, azul cielo) para crear secciones diferenciadas que rompen la monotonia del scroll. Cada bloque de color tiene una personalidad y un proposito narrativo.
- **Fotografia de alta calidad.** Cada imagen cuenta una historia. No son fotos de stock genericas; son composiciones con contexto, ambiente, e iluminacion profesional. En el caso de HESA, la fotografia debe comunicar profesionalismo veterinario, no ternura de mascotas para consumidor final.

### 2.2 Patrones especificos a copiar

#### Hero principal (Home)

En Tuft and Paw, el hero ocupa el 100% del viewport. Tiene un headline enorme en tipografia bold blanca, un subtitulo corto, un CTA con boton de fondo oscuro, y una imagen/composicion fotografica que ocupa la mayor parte del espacio. El texto esta posicionado a la izquierda, la imagen a la derecha o como fondo. Un tag pequeno ("NEW FORMULA") aparece arriba del titulo principal en tipografia uppercase mas pequena.

**Adaptacion para HESA:** El hero debe tener la misma estructura pero con tono B2B profesional. El headline podria comunicar los 37 anos de trayectoria o la propuesta de valor principal. La imagen no debe ser "tierna" ni orientada a consumidor final; debe ser profesional y del sector veterinario. Dos CTAs: uno hacia el catalogo (principal) y otro hacia la seccion de distribuidores/fabricantes (secundario).

#### Secciones de storytelling con bloques de color

Debajo del hero, Tuft and Paw presenta secciones con fondo de color suave (verde menta, rosa) que contienen: titulo grande a la izquierda, parrafo descriptivo, lista de beneficios con iconos de check, un CTA, y una imagen/fotografia a la derecha. Estas secciones tienen bordes redondeados (border-radius generoso, aproximadamente 20-30px) y padding interno amplio.

**Adaptacion para HESA:** Usar estos bloques coloreados para presentar las tres categorias principales (Farmacos, Alimentos, Equipos). Cada bloque tiene un color distinto derivado de la paleta de HESA (variaciones suaves del azul #008DC9 y verde #50B92A: azul claro, verde menta, gris azulado). Cada bloque explica brevemente la categoria y tiene CTA hacia el catalogo filtrado.

#### Carrusel de productos destacados ("Most-loved")

Tuft and Paw tiene un carrusel horizontal con cards de productos. Cada card tiene: imagen cuadrada con fondo gris claro neutro, titulo del producto en bold, descripcion corta de 1-2 lineas, y un boton "SHOP" de fondo oscuro (navy). Los controles del carrusel son flechas circulares con indicadores de pagina (dots).

**Adaptacion para HESA:** Usar este patron para "Productos destacados" o "Nuevos productos". Las cards no muestran precio (HESA no muestra precios). En lugar del boton "SHOP", usar "Ver producto" o "Mas informacion". Mantener exactamente el mismo estilo visual: imagen limpia, fondo neutro, tipografia bold, boton oscuro.

#### Barra sticky de producto

En la pagina de detalle de producto, al hacer scroll hacia abajo, aparece una barra fija (sticky) en la parte superior con: miniatura del producto, nombre, variante seleccionada y boton de accion principal. Esta barra permite al usuario actuar sin tener que volver arriba.

**Adaptacion para HESA:** La barra sticky debe mostrar: miniatura, nombre del producto, marca, y boton "Solicitar informacion" o "Contactar por WhatsApp". Esto es fundamental para la conversion en mobile.

#### Pagina de detalle de producto

Layout de dos columnas: galeria de imagenes a la izquierda (con miniaturas verticales clicables + imagen principal grande), informacion del producto a la derecha. La informacion incluye: nombre grande, badges de beneficios con iconos (en una franja gris clara redondeada), opciones de variante (botones seleccionables tipo pill/pastilla), y descripcion. Debajo de la seccion principal, secciones de storytelling con bloques de color que profundizan en los beneficios del producto con imagen + texto alternados. Al final, seccion de FAQ expandible y productos relacionados.

**Adaptacion para HESA:** Mantener el layout de dos columnas. La galeria funciona igual. A la derecha: nombre del producto, marca (con link a pagina de la marca), badges de especie(s) de destino con iconos, presentaciones disponibles (pills seleccionables), descripcion general, y boton prominente "Solicitar informacion". Debajo, mostrar informacion tecnica del producto (formula/composicion, registro sanitario, indicaciones) y boton para descargar ficha tecnica PDF. Seccion de productos relacionados al final.

#### Navegacion y header

Header limpio con: logo a la izquierda, categorias principales centradas o a la derecha, y iconos utilitarios (busqueda, cuenta, carrito). En HESA no hay carrito ni cuenta, asi que los iconos serian: busqueda y selector de idioma (ES/EN). La navegacion es minimalista, sin mega-menus complejos.

#### Footer

Tuft and Paw cierra con un footer que tiene: logo grande de marca como statement visual sobre fondo de color (azul cielo), links de navegacion arriba del logo, y un diseno que es mas un cierre de marca que una lista de links. Es elegante y memorable.

**Adaptacion para HESA:** Footer con fondo azul HESA oscuro, logo de HESA, navegacion completa (Catalogo, Marcas, Nosotros, Distribuidores, Contacto), informacion de contacto, redes sociales, selector de idioma, y copyright.

### 2.3 Animaciones y microinteracciones a replicar

- **Hover en cards de producto:** Elevacion sutil (shadow increase) y escala minima (transform: scale 1.02). Transicion suave de 0.3s.
- **Transiciones entre secciones:** Las secciones con fondo de color aparecen con fade-in suave al hacer scroll (intersection observer). No son animaciones agresivas; son apariciones naturales.
- **Galeria de producto:** Al hacer clic en una miniatura, la imagen principal cambia con transicion suave (fade o slide).
- **Barra sticky:** Aparece con slide-down al pasar el punto de la seccion de informacion principal. Desaparece al volver arriba.
- **Botones:** Hover state con cambio de color de fondo (transicion 0.2s). Los CTAs principales cambian de oscuro a mas oscuro o invierten colores.
- **Links del menu:** Underline animado al hacer hover (de izquierda a derecha).
- **Scroll suave:** Todo el sitio debe tener smooth scrolling al navegar entre secciones.

---

## 3. PALETA DE COLORES Y TIPOGRAFIA

### Colores

| Color | Codigo | Uso |
|---|---|---|
| Azul HESA (primario) | #008DC9 | CTAs principales, enlaces, header activo, elementos destacados |
| Verde HESA (secundario) | #50B92A | Iconografia de beneficios, badges, acentos secundarios |
| Blanco | #FFFFFF | Fondo principal, texto sobre fondos oscuros |
| Gris muy claro | #F5F7FA | Fondos de secciones alternas, fondos de cards |
| Gris medio | #6B7280 | Texto secundario, descripciones, subtitulos |
| Gris oscuro | #1F2937 | Texto principal, titulos |
| Azul oscuro | #005A85 | Fondo del footer, hover states de botones azules |
| Azul claro suave | #E8F4FD | Bloques de color tipo Tuft and Paw (seccion farmaco) |
| Verde claro suave | #EDF7E8 | Bloques de color tipo Tuft and Paw (seccion alimentos) |
| Gris azulado suave | #F0F2F5 | Bloques de color tipo Tuft and Paw (seccion equipos) |

### Tipografia

Buscar una combinacion de fuentes sans-serif modernas similares a las de Tuft and Paw. Recomendaciones:

- **Headlines/Titulos:** Inter, DM Sans, o similar. Peso Bold (700) o Extrabold (800). Tamanos grandes: 48-64px en desktop para titulos de seccion, 36-48px para subtitulos de pagina.
- **Cuerpo de texto:** La misma familia en peso Regular (400) o Medium (500). Tamano 16-18px. Interlineado generoso (1.6-1.7).
- **Labels y metadata:** Peso Medium (500) o Semibold (600). Tamano 12-14px. Uppercase con letter-spacing amplio para tags como "FARMACOS", "NUEVO PRODUCTO".
- **Jerarquia clara:** La diferencia entre un titulo y el cuerpo de texto debe ser evidente de inmediato. No usar tamanos intermedios que confundan la jerarquia.

---

## 4. ESTRUCTURA DE PAGINAS Y SECCIONES

### Mapa del sitio

```
Inicio (Home)
  Catalogo
    Farmacos (listado con filtros)
    Alimentos (listado con filtros)
    Equipos (listado con filtros)
    [Detalle de producto]
  Marcas
    [Pagina individual por marca]
  Nosotros
  Distribuidores (para fabricantes internacionales)
  Contacto
```

### Requisitos bilingue

Todo el sitio debe existir en espanol e ingles. URLs diferenciadas (/es/ y /en/). Selector de idioma visible en header y footer. Todo el contenido debe ser administrable en ambos idiomas desde el panel. La pagina de "Distribuidores" es especialmente critica en ingles porque es la puerta de entrada para fabricantes de Asia.

---

## 5. PAGINA: INICIO (HOME)

### Seccion 5.1: Hero principal

**Referencia visual:** tuftandpaw.com, primera seccion visible. Hero full-width con headline enorme, subtitulo, CTAs, e imagen profesional.

**Lo que debe contener:**
- Tag superior en uppercase pequeno (tipo "DESDE 1989" o "37 ANOS DE TRAYECTORIA")
- Headline grande que comunique la propuesta de valor central de HESA como distribuidor lider del sector veterinario en Costa Rica
- Subtitulo corto que mencione farmacos, alimentos y equipos
- CTA primario: boton con fondo azul HESA hacia el catalogo. Texto: "Explorar catalogo" o similar
- CTA secundario: boton outline o de menor jerarquia visual hacia la pagina de distribuidores. Texto: "Distribuya con nosotros" (en ingles: "Partner with us")
- Imagen o composicion visual profesional del sector veterinario. NO fotos tiernas de mascotas. Si, imagenes de profesionales veterinarios, productos farmaceuticos, laboratorio, o logistica.

**Diseno:** Fondo claro (blanco o gris muy suave), texto oscuro, imagen a la derecha. Ocupar el 100% del viewport inicial. Tipografia del headline minimo 48px en desktop, 32px en mobile.

### Seccion 5.2: Categorias principales

**Referencia visual:** Los bloques de storytelling con fondo de color de Tuft and Paw (la seccion verde menta de "Meet Really Great Cat Litter" y la seccion rosa de "Dig into Really Great Cat Food").

**Lo que debe contener:**
Tres bloques, cada uno con un color de fondo suave diferente. Cada bloque presenta una de las tres categorias principales:

1. **Farmacos** (fondo azul claro suave #E8F4FD)
   - Titulo grande: "Farmacos veterinarios"
   - Parrafo corto describiendo que HESA distribuye antibioticos, desparasitantes, vitaminas, antiinflamatorios, etc. de marcas internacionales reconocidas
   - 3 beneficios con iconos de check (tipo los de Tuft and Paw): "Registro sanitario vigente", "Marcas exclusivas", "Asesoria tecnica"
   - CTA: "Ver farmacos"
   - Imagen profesional a la derecha

2. **Alimentos** (fondo verde claro suave #EDF7E8)
   - Titulo grande: "Alimentos para animales"
   - Parrafo corto
   - 3 beneficios con iconos
   - CTA: "Ver alimentos"
   - Imagen a la izquierda (alternar)

3. **Equipos** (fondo gris azulado suave #F0F2F5)
   - Titulo grande: "Equipos veterinarios"
   - Parrafo corto
   - 3 beneficios con iconos
   - CTA: "Ver equipos"
   - Imagen a la derecha

**Diseno:** Cada bloque tiene border-radius generoso (20-30px), padding interno amplio (60-80px), y layout de dos columnas (texto + imagen). Los bloques alternan la posicion de texto e imagen (izquierda-derecha, derecha-izquierda). Animacion: fade-in al entrar en viewport.

### Seccion 5.3: Marcas que representamos

**Lo que debe contener:**
- Titulo de seccion: "Marcas que distribuimos" o "Representamos las mejores marcas del mundo"
- Logos de las marcas principales en una grilla o fila horizontal
- Maximo 6-8 logos visibles, con link "Ver todas las marcas"

**Diseno:** Fondo blanco. Logos en escala de grises con transicion a color en hover. Espaciado generoso entre logos. Los logos deben tener un tamano consistente y estar alineados al centro vertical.

### Seccion 5.4: Propuesta de valor / Por que HESA

**Referencia visual:** Seccion de beneficios con iconos al estilo de los checkmarks de Tuft and Paw pero en formato grid horizontal.

**Lo que debe contener:**
4 bloques en fila horizontal, cada uno con:
- Icono lineal en verde HESA (#50B92A)
- Numero o dato destacado (grande, bold)
- Texto descriptivo corto

Los 4 bloques:
1. "37 anos" / "en el mercado costarricense"
2. "Cobertura nacional" / "con agentes propios en todas las zonas"
3. "100% veterinario" / "exclusivos del sector veterinario"
4. "Credito flexible" / "condiciones comerciales adaptadas a cada cliente"

**Diseno:** Fondo gris muy claro. 4 columnas en desktop, 2x2 en tablet, 1 columna en mobile. Iconos lineales, no solidos. Los numeros deben ser grandes (36-48px) y los textos descriptivos pequenos (14-16px).

### Seccion 5.5: Productos nuevos o destacados

**Lo que debe contener:**
- Titulo de seccion: "Nuevos productos" o "Productos destacados"
- Carrusel horizontal de cards de productos (exactamente como la seccion "Most-loved" de Tuft and Paw)
- Cada card: imagen con fondo neutro, nombre del producto, descripcion de 1-2 lineas, boton "Ver producto"
- Controles: flechas circulares + indicadores de pagina (dots)

**Por que es importante:** HESA continuamente trae productos nuevos y lanza lineas diferentes al mercado. Necesitan un mecanismo visible en el home para destacar estos lanzamientos. Esta seccion debe ser 100% administrable desde el panel: el equipo de HESA debe poder seleccionar que productos aparecen aqui en cualquier momento, rotarlos facilmente, y decidir si destacar farmacos, alimentos o lo que necesiten en cada temporada.

**Diseno:** Identico al carrusel "Most-loved" de Tuft and Paw. Cards con sombra sutil, imagen cuadrada con fondo gris claro, tipografia bold para nombre, boton oscuro (azul HESA). Carrusel con animacion suave de slide.

### Seccion 5.6: CTA para fabricantes

**Lo que debe contener:**
- Titulo directo: "Busca un distribuidor en Costa Rica y Centroamerica?" (ES) / "Looking for a distributor in Costa Rica and Central America?" (EN)
- Parrafo corto sobre la capacidad de distribucion regional de HESA y la expansion en curso
- CTA: "Conozca nuestra propuesta" / "Learn about our proposal"

**Diseno:** Fondo azul HESA (#008DC9) full-width. Texto en blanco. Boton CTA en blanco con texto azul (colores invertidos). Esta seccion debe destacar visualmente como una interrupcion del flujo normal del scroll. Debe sentirse como un banner importante, no como otra seccion generica.

### Seccion 5.7: Footer

**Lo que debe contener:**
- Logo de HESA
- Navegacion: Catalogo (Farmacos, Alimentos, Equipos), Marcas, Nosotros, Distribuidores, Contacto
- Contacto: telefono (+506 2260-9020), correo, direccion (Calle 2, av 12. Heredia, Costa Rica)
- Redes sociales: Facebook, Instagram
- Selector de idioma (ES/EN)
- Copyright

**Diseno:** Fondo azul oscuro HESA (#005A85) o gris muy oscuro. Texto en blanco/gris claro. Layout de 4 columnas en desktop. El footer debe ser limpio y completo pero no excesivamente alto. Inspirarse en la elegancia del cierre de Tuft and Paw donde el logo grande funciona como statement de marca.

---

## 6. PAGINA: CATALOGO (Listado de productos)

Esta pagina se replica para Farmacos, Alimentos y Equipos. Cada una tiene los mismos componentes pero con filtros especificos a su categoria.

### Seccion 6.1: Header de categoria

**Lo que debe contener:**
- Breadcrumb de navegacion (Inicio > Catalogo > Farmacos)
- Titulo de la categoria (grande, bold)
- Descripcion corta (1-2 lineas, gris medio)
- Contador de productos ("42 productos")

**Diseno:** Fondo blanco. Titulo alineado a la izquierda. Inspirado en la pagina de coleccion de Tuft and Paw (tuftandpaw.com/collections/cat-litter) que muestra el titulo "Cat Litter" en bold grande con el conteo de productos a la derecha.

### Seccion 6.2: Sistema de filtros

**Filtros disponibles por categoria:**

**Farmacos:**
- Por marca
- Por especie (Caninos, Felinos, Bovinos, Equinos, Aves, Porcinos, etc.)
- Por familia farmaceutica (Antibioticos, Desparasitantes, Vitaminas, Antiinflamatorios, Suplementos, etc.)

**Alimentos:**
- Por marca
- Por especie
- Por etapa de vida (Cachorro/Kitten, Adulto, Senior)

**Equipos:**
- Por marca
- Por tipo de equipo

**Diseno:** Filtros en barra horizontal superior (no sidebar lateral) para maximizar el espacio del grid de productos. Cada filtro es un dropdown que se expande al hacer clic. Filtros activos se muestran como pills/badges debajo de la barra con boton "X" para remover. Boton "Limpiar filtros" visible cuando hay filtros activos. En mobile, los filtros se colapsan en un boton "Filtrar" que abre un drawer/modal.

### Seccion 6.3: Grid de productos

**Lo que debe contener cada card:**
- Imagen del producto (proporcion cuadrada o 4:3, fondo gris claro neutro)
- Nombre del producto
- Marca (texto secundario o badge)
- Icono(s) de especie de destino
- NO precio
- NO inventario/disponibilidad

**Diseno:** Grid de 3 columnas en desktop, 2 en tablet, 1-2 en mobile. Cards con fondo blanco, borde muy sutil o shadow minima. En hover: elevacion de shadow y escala minima (igual que Tuft and Paw). Imagenes deben mantener proporcion consistente. El nombre del producto en bold, la marca debajo en gris. Espacio generoso entre cards (gap de 24-32px).

### Seccion 6.4: Paginacion

Paginacion numerica simple, centrada. O alternativamente, boton "Cargar mas" con indicador de "Mostrando X de Y productos".

---

## 7. PAGINA: DETALLE DE PRODUCTO

### Seccion 7.1: Informacion principal

**Referencia visual:** tuftandpaw.com/products/really-great-cat-litter. Layout dos columnas. Galeria a la izquierda con miniaturas verticales. Informacion a la derecha.

**Columna izquierda - Galeria:**
- Miniaturas verticales clicables a la izquierda de la imagen principal
- Imagen principal grande con posibilidad de zoom en hover o lightbox
- Si hay video, incluir miniatura con icono de play

**Columna derecha - Informacion:**
- Nombre del producto (titulo grande, bold)
- Marca (con link a pagina de la marca)
- Franja de badges/iconos de beneficios sobre fondo gris claro con border-radius (exactamente como Tuft and Paw muestra "Low-Tracking", "Flushable", "99% Dust-Free")
- Para HESA estos badges serian los iconos de especie de destino (Caninos, Felinos, etc.)

**Informacion tecnica segun tipo de producto:**

Para Farmacos:
- Especie(s) de destino (con iconos)
- Formula / Composicion general
- Numero de registro sanitario
- Indicaciones de uso
- Presentaciones disponibles (como pills seleccionables, al estilo de "Unscented / Lavender / OdorStop" de Tuft and Paw)

Para Alimentos:
- Especie de destino
- Etapa de vida
- Presentaciones/tamanos disponibles (pills seleccionables)
- Ingredientes principales
- Informacion nutricional si aplica

Para Equipos:
- Especificaciones tecnicas
- Usos recomendados
- Garantia si aplica

**CTA principal:** Boton prominente azul HESA "Solicitar informacion". Al hacer clic, abre formulario o redirige a contacto con el producto pre-seleccionado.

**CTA secundario:** Icono de WhatsApp + "Consultar por WhatsApp"

**Boton de descarga:** "Descargar ficha tecnica (PDF)" con icono de documento.

### Seccion 7.2: Barra sticky

Al hacer scroll pasado la seccion principal, aparece una barra fija superior con:
- Miniatura del producto
- Nombre del producto
- Marca
- Boton "Solicitar informacion"

Inspirada directamente en la barra sticky de Tuft and Paw que muestra nombre, variante, precio y "ADD TO CART".

### Seccion 7.3: Storytelling del producto (opcional, si hay contenido)

Debajo de la seccion principal, bloques de color (como los de la home de Tuft and Paw) que profundizan en beneficios o caracteristicas del producto con imagen + texto alternados. Esto puede ser administrable desde el panel para productos que HESA quiera destacar especialmente.

### Seccion 7.4: Productos relacionados

Seccion "Tambien te puede interesar" con 3-4 cards de productos de la misma categoria o marca. Carrusel en mobile, grid estatico en desktop. Mismas cards que en el listado del catalogo.

---

## 8. PAGINA: MARCAS

### Seccion 8.1: Introduccion

**Lo que debe contener:**
- Titulo: "Marcas que representamos"
- Parrafo introductorio sobre la relacion de HESA con sus proveedores y la exclusividad de la mayoria de las marcas

### Seccion 8.2: Grid de marcas

**Lo que debe contener cada card:**
- Logo de la marca (centrado)
- Nombre de la marca
- Pais de origen
- Categorias que maneja (badges: "Farmacos", "Alimentos", "Equipos")
- Link a pagina individual

**Diseno:** Grid de 3-4 columnas. Cards con fondo blanco, borde sutil, logo centrado, informacion debajo. Hover con elevacion. Misma estetica premium que el resto del sitio.

### Seccion 8.3: Pagina individual de marca

**Lo que debe contener:**
- Logo grande de la marca
- Descripcion de la marca (quienes son, de donde son)
- Pais de origen
- Categorias de productos
- Grid de todos los productos de esa marca (con los mismos filtros que el catalogo general)

---

## 9. PAGINA: NOSOTROS

### Seccion 9.1: Hero

- Titulo: "Sobre HESA" o "37 anos distribuyendo salud animal"
- Imagen profesional de las instalaciones o del equipo
- Hero mas contenido que el de home (no full-viewport, sino 50-60vh)

### Seccion 9.2: Historia

Bloques de texto con imagen alternando izquierda-derecha (patron de Tuft and Paw). Contar:
- Empresa familiar de segunda generacion
- 37 anos en el mercado
- Evolucion del negocio
- Valores de la empresa
- Exclusividad del sector veterinario

### Seccion 9.3: Numeros clave

**Datos a destacar (numeros grandes, animados al entrar en viewport):**
- 37+ anos en el mercado
- 50+ colaboradores
- 18-20 agentes de ventas propios
- Cobertura nacional completa
- X marcas internacionales representadas

**Diseno:** Fondo de color suave. Numeros grandes (48-64px) en bold con animacion de conteo (count-up animation) al entrar en viewport. Texto descriptivo debajo de cada numero.

### Seccion 9.4: Cobertura y distribucion

- Mapa estilizado de Costa Rica mostrando cobertura
- Informacion sobre agentes propios (no subdistribuidores)
- Flotilla propia de entrega
- Mencion de expansion a Centroamerica

### Seccion 9.5: Equipo de liderazgo (opcional)

Grid de fotos profesionales con nombre y cargo. Solo si HESA provee las fotos.

---

## 10. PAGINA: DISTRIBUIDORES (Para fabricantes)

Esta pagina es critica para el negocio. Debe funcionar como un pitch comercial profesional, especialmente en su version en ingles.

### Seccion 10.1: Hero

- Titulo: "Partner with HESA" (EN) / "Distribuya con nosotros" (ES)
- Subtitulo sobre distribucion en Costa Rica y Centroamerica
- CTA hacia formulario de contacto de distribuidores
- Imagen profesional de operacion logistica

**Diseno:** Hero impactante, tono B2B ejecutivo. Fondo claro con imagen de alta calidad. Tipografia grande y confiada.

### Seccion 10.2: Por que elegir HESA

Grid de 6 beneficios con iconos (tipo la seccion de beneficios de Tuft and Paw pero en grid 3x2):

1. 37 anos de experiencia
2. Cobertura nacional con agentes propios
3. Exclusivos del sector veterinario
4. Infraestructura de distribucion establecida
5. Relaciones solidas con clientes
6. Expansion a Centroamerica en proceso

### Seccion 10.3: Marcas que ya confian en nosotros

Logo wall de las marcas actuales. Mensaje implicito: "Estas marcas ya trabajan con nosotros, usted tambien deberia."

### Seccion 10.4: Proceso de partnership

Timeline visual de 4 pasos:
1. Contacto inicial
2. Evaluacion de productos
3. Negociacion de terminos
4. Inicio de distribucion

**Diseno:** Timeline horizontal en desktop, vertical en mobile. Iconos circulares numerados. Linea de conexion entre pasos. Animacion secuencial al entrar en viewport.

### Seccion 10.5: Formulario de contacto para fabricantes

Campos:
- Nombre de la empresa
- Pais de origen
- Nombre del contacto
- Correo electronico
- Telefono
- Tipo de productos
- Mensaje
- Checkbox de terminos

**Diseno:** Formulario limpio, campos con labels visibles, boton de envio en azul HESA. Validacion en tiempo real.

---

## 11. SECCION DE POLITICAS COMERCIALES

El cliente menciono expresamente que seria muy bueno tener un apartado de politicas comerciales, ya que las condiciones de credito y los tiempos de entrega son de las primeras cosas que preguntan los clientes nuevos.

Esta seccion puede implementarse de dos formas: como pagina independiente, o como seccion destacada dentro de la pagina de Contacto o de Nosotros. Se recomienda que sea parte de la pagina de Nosotros, en una seccion propia visible y bien posicionada.

**Lo que debe contener:**
- Informacion general sobre plazos de credito (sin montos especificos, ya que varian por cliente, pero si mencionando que HESA ofrece condiciones flexibles)
- Tiempos de entrega segun zona (Gran Area Metropolitana vs zonas rurales vs zonas alejadas que se envian por encomienda)
- Cobertura de entrega: explicar que HESA tiene flotilla propia y agentes en todas las zonas, y que para zonas muy alejadas se utiliza servicio de encomienda para agilizar
- Frecuencia de visitas de los agentes (quincenal)
- CTA de contacto para solicitar condiciones comerciales personalizadas

**Diseno:** Seccion con fondo gris claro, iconos lineales para cada punto (reloj para tiempos, mapa para cobertura, documento para credito, calendario para visitas), layout limpio con texto breve. No debe parecer un documento legal; debe ser informativo y accesible.

---

## 12. PAGINA: CONTACTO

### Seccion 12.1: Informacion de contacto

Layout dos columnas: informacion a la izquierda, formulario a la derecha.

Informacion:
- Telefono: +506 2260-9020
- Correo electronico general
- Direccion: Calle 2, av 12. Heredia, Costa Rica
- Horario de atencion
- Redes sociales
- Mapa de Google embebido (opcional)

### Seccion 12.2: Formulario general

Campos:
- Nombre
- Correo electronico
- Telefono
- Tipo de consulta (dropdown: Informacion de productos, Condiciones comerciales, Soporte, Otro)
- Producto de interes (opcional, pre-llenado si viene desde detalle de producto)
- Mensaje

### Seccion 12.3: WhatsApp flotante

Boton flotante de WhatsApp presente en TODAS las paginas del sitio. Posicion fija en esquina inferior derecha. Color verde de WhatsApp. Al hacer clic, abre WhatsApp con mensaje pre-configurado.

---

## 13. PANEL DE ADMINISTRACION

El panel debe ser intuitivo para personal sin conocimientos tecnicos. Las personas que lo van a usar son del equipo comercial de HESA, acostumbradas a trabajar con productos y catalogos pero no con herramientas de desarrollo web.

### Modulos requeridos

1. **Gestion de productos:** Crear, editar, eliminar. Campos segun tipo (farmaco, alimento, equipo). Subir imagen. Subir PDF de ficha tecnica. Asignar categorias, filtros, marca. Activar/desactivar producto.

2. **Gestion de categorias:** Crear categorias y subcategorias. Editar nombre y descripcion. Ordenar.

3. **Gestion de marcas:** Crear, editar, eliminar. Subir logo. Agregar descripcion y pais de origen.

4. **Gestion de portada y productos destacados:** Cambiar imagen del hero. Editar textos principales. Seleccionar que productos aparecen en el carrusel de "Productos destacados / Nuevos productos" del home. Poder rotar estos productos facilmente segun lanzamientos o campanas temporales. Esto es critico porque HESA continuamente lanza productos nuevos y necesita destacarlos rapidamente.

5. **Mensajes de contacto:** Ver mensajes recibidos. Filtrar por tipo. Marcar como leido/atendido. Exportar a CSV.

6. **Contenido estatico:** Editar textos de Nosotros, Distribuidores, Contacto.

**Diseno del panel:** Interfaz limpia, navegacion lateral, formularios con campos bien etiquetados, botones de accion visibles, confirmaciones para acciones destructivas.

---

## 14. CONSIDERACIONES TECNICAS

### SEO
- Meta titulos y descripciones editables por pagina
- URLs amigables en espanol
- Sitemap XML automatico
- Schema markup para productos y organizacion

### Rendimiento
- Imagenes optimizadas automaticamente (WebP, lazy loading)
- Cache de paginas
- Core Web Vitals optimizados (LCP, FID, CLS)

### Responsive
- Mobile-first. El sitio debe verse impecable en movil.
- Breakpoints: 375px (mobile), 768px (tablet), 1024px (laptop), 1280px (desktop), 1440px+ (wide)

### Formularios
- Notificacion por correo al equipo de HESA
- Copia en panel de administracion
- Proteccion contra spam (captcha invisible o honeypot)

### Integraciones
- Google Analytics
- Facebook Pixel (si requerido)
- WhatsApp Business API para boton flotante

---

## 15. LO QUE NO DEBE TENER EL SITIO

Para evitar confusiones, estos elementos NO deben existir en ningun lugar del sitio:

- Precios de productos
- Informacion de inventario o disponibilidad de stock
- Carrito de compras
- Checkout o pasarela de pago
- Registro de usuarios o login de clientes
- Seccion de ofertas o descuentos
- Resenas o calificaciones de usuarios
- Blog (no esta en el alcance de este proyecto)
- Chat en vivo (solo WhatsApp)

---

## 16. RESUMEN DE PRINCIPIOS PARA LOS AGENTES

Al disenar y desarrollar cada seccion de este sitio, los agentes deben tener presentes estos principios:

1. **La referencia es Tuft and Paw.** Ante cualquier duda de diseno, visitar tuftandpaw.com y copiar el patron visual que corresponda. El nivel de calidad visual de Tuft and Paw es el piso minimo.

2. **Espacio en blanco, siempre.** Si se siente apretado, agregar mas espacio. Mas padding, mas margin, mas gap. Nunca tener miedo de dejar espacio vacio.

3. **Tipografia como protagonista.** Los titulos deben ser grandes y con personalidad. La jerarquia debe ser evidente de un vistazo.

4. **Bloques de color para romper monotonia.** Usar las variaciones suaves de la paleta para crear secciones diferenciadas al estilo de Tuft and Paw.

5. **Cada imagen importa.** No usar placeholders genericos de stock. Cada imagen debe sentirse curada y profesional.

6. **Mobile first, premium siempre.** El sitio debe verse tan premium en un telefono como en un monitor de 27 pulgadas.

7. **B2B profesional, no B2C emocional.** El tono visual es de confianza, solidez y experiencia. No es "tierno", no es "divertido". Es serio, limpio y confiable.

8. **Superar a la competencia.** Los sitios de Monteco, VETIM y Belina son el piso que NO debemos alcanzar. Debemos estar muy por encima. Si algo que disenan se parece a lo que ya tiene la competencia, hay que replantearlo.

---

## 17. CHECKLIST DE VERIFICACION

Antes de considerar completa cualquier pagina o seccion, verificar:

- [ ] El diseno se siente premium y no generico?
- [ ] Hay suficiente espacio en blanco entre elementos?
- [ ] La tipografia tiene jerarquia clara (titulo grande, subtitulo, cuerpo)?
- [ ] Los colores corresponden a la paleta definida?
- [ ] Las animaciones son sutiles y profesionales (no agresivas)?
- [ ] El diseho funciona en mobile?
- [ ] La seccion tiene un equivalente visual en Tuft and Paw que se esta copiando correctamente?
- [ ] No se estan mostrando precios, inventario, carrito u otros elementos prohibidos?
- [ ] Los textos estan en espanol e ingles?
- [ ] El nivel visual supera claramente lo que tienen Monteco, VETIM y Belina?

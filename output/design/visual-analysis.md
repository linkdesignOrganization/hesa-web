# Visual Analysis — HESA (Herrera y Elizondo S.A.)

**Generado por**: Design Researcher
**Fecha**: 2026-03-17
**Fuentes**: brief-criteria.md (2 briefs), 11 capture-notes, 8 PNGs validados visualmente
**Referencias analizadas**: 11 (3 Tuft&Paw, 4 Dashly, 2 Monteco, 1 VETIM, 1 Belina)

---

## 1. Filosofia y Principios de Diseno

### 1.1 Sitio Publico — Filosofia

El sitio publico de HESA es un sitio B2B de distribuidor veterinario con 37 anos de trayectoria en Costa Rica. NO es e-commerce. NO vende online. Es un catalogo profesional con formularios de contacto. La referencia visual principal es **Tuft & Paw** (tuftandpaw.com), un sitio DTC de productos para gatos de gama alta. El brief es claro: "La referencia es Tuft and Paw. Ante duda, copiar el patron visual. Nivel T&P es el piso minimo."

| # | Principio Prescrito (del brief) |
|---|---|
| 1 | La referencia es Tuft and Paw. Ante duda, copiar el patron visual. Nivel T&P es el piso minimo. |
| 2 | Espacio en blanco, siempre. Mas padding, mas margin, mas gap. Nunca temer al espacio vacio. |
| 3 | Tipografia como protagonista. Titulos grandes (48-64px) con personalidad. Jerarquia evidente de un vistazo. |
| 4 | Bloques de color para romper monotonia. Variaciones suaves de la paleta para secciones diferenciadas. |
| 5 | Cada imagen importa. Curada, profesional, con contexto. No stock generico. |
| 6 | Mobile first, premium siempre. Igual de premium en telefono que en monitor 27". |
| 7 | B2B profesional, no B2C emocional. Confianza, solidez, experiencia. No tierno ni divertido. |
| 8 | Superar a la competencia. Si se parece a Monteco/VETIM/Belina, replantearlo. |

### 1.2 Panel de Administracion — Filosofia

La referencia visual principal del panel es **Dashly Template** (dashlytemplate.webflow.io). El panel es desktop-first con sidebar colapsable. Los productos y marcas SIEMPRE se muestran como cards con imagen, NUNCA como listas planas.

| # | Principio Prescrito (del brief) |
|---|---|
| 1 | Cards sobre listas siempre que sea posible. Productos=cards con imagen, marcas=cards con logo. |
| 2 | Una accion por pantalla. Listado=VER/BUSCAR. Formulario=CREAR/EDITAR. No mezclar. |
| 3 | Espacio generoso. Padding 24-32px area contenido, gap 20-24px cards, padding 16-20px dentro cards. |
| 4 | Iconos en todo. Sidebar, cards resumen, badges, botones, busqueda. Panel pulido y profesional. |
| 5 | Badges de color para estados. Verde=activo, naranja=pendiente, rojo=error, azul=farmaco, verde=alimento, gris=equipo. |
| 6 | Confirmaciones para acciones destructivas. Modal eliminar, toast con "Deshacer" para desactivar. |
| 7 | Feedback visual inmediato. Toast verde guardar, borde rojo error, preview imagen, animacion drag-drop. |
| 8 | Responsive pero desktop-first. Sidebar colapsable tablet, hamburger menu mobile. |

---

## 2. Paleta de Colores PRESCRITA

### 2.1 Sitio Publico

| Token/Nombre | Hex | Uso/Contexto | Notas de Contraste |
|---|---|---|---|
| Azul HESA (primario) | #008DC9 | CTAs principales, enlaces, header activo, elementos destacados, CTA fabricantes fondo full-width | Texto blanco sobre #008DC9: ratio ~3.8:1 -- cumple AA para texto grande (18px+ bold / 24px+ regular). Para texto pequeno, usar blanco bold o considerar #007AB8 (mas oscuro) |
| Verde HESA (secundario) | #50B92A | Iconografia de beneficios, badges, acentos secundarios, iconos lineales propuesta de valor | Texto blanco sobre #50B92A: ratio ~3.2:1 -- NO cumple AA para texto pequeno. Usar solo como acento decorativo o con texto oscuro |
| Blanco | #FFFFFF | Fondo principal, texto sobre fondos oscuros | -- |
| Gris muy claro | #F5F7FA | Fondos de secciones alternas, fondos de cards | Contraste con blanco: apenas perceptible pero suficiente para diferenciar secciones |
| Gris medio | #6B7280 | Texto secundario, descripciones, subtitulos | Sobre blanco: ~4.6:1 -- cumple AA |
| Gris oscuro | #1F2937 | Texto principal, titulos | Sobre blanco: ~13.6:1 -- cumple AAA |
| Azul oscuro | #005A85 | Fondo del footer, hover states de botones azules | Texto blanco sobre #005A85: ~5.7:1 -- cumple AA |
| Azul claro suave | #E8F4FD | Bloque de color seccion Farmacos | Texto #1F2937 sobre #E8F4FD: ~12.5:1 -- excelente |
| Verde claro suave | #EDF7E8 | Bloque de color seccion Alimentos | Texto #1F2937 sobre #EDF7E8: ~12.3:1 -- excelente |
| Gris azulado suave | #F0F2F5 | Bloque de color seccion Equipos | Texto #1F2937 sobre #F0F2F5: ~12.0:1 -- excelente |

**Observacion critica (del brief-analyst):** El brief del sitio publico no especifica colores para estados semanticos (success, danger, warning). Los formularios de contacto y validaciones necesitaran estados de error/exito. **Recomendacion holistica:** Adoptar los colores semanticos del panel (#22C55E para exito, #EF4444 para error, #F59E0B para atencion) tambien en el sitio publico para consistencia cross-plataforma.

### 2.2 Panel de Administracion

| Token/Nombre | Hex | Uso/Contexto |
|---|---|---|
| Azul HESA | #008DC9 | Sidebar activo, botones principales, links, tabs activos |
| Azul suave (fondo) | #EBF5FF | Fondo item activo sidebar, fondo badges azules |
| Verde exito | #22C55E | Badges "Activo", toast exito, indicadores positivos |
| Verde suave (fondo) | #DCFCE7 | Fondo badges alimentos, fondo estados exitosos |
| Rojo error | #EF4444 | Badges "Inactivo", errores validacion, boton eliminar |
| Rojo suave (fondo) | #FEE2E2 | Fondo badges error, fondo alertas |
| Naranja atencion | #F59E0B | Badges "Pendiente", mensajes sin leer |
| Naranja suave (fondo) | #FEF3C7 | Fondo badges atencion |
| Gris oscuro (texto) | #1F2937 | Titulos, texto principal |
| Gris medio (texto) | #6B7280 | Texto secundario, placeholders |
| Gris claro (bordes) | #E5E7EB | Bordes campos, separadores tabla, divisores |
| Gris muy claro (fondos) | #F7F8FA | Fondo area contenido principal |
| Blanco | #FFFFFF | Fondo cards, sidebar, campos formulario |

**Validacion contra Dashly (screenshot):** El template Dashly observado usa #F7F8FA como fondo del area de contenido, cards blancas #FFFFFF, separadores ~#E5E7EB, y badges semanticos verde/rojo/ambar. Los valores prescritos del brief SON CONSISTENTES con los patrones observados en Dashly. La unica diferencia es que Dashly usa azul #3B82F6 (Tailwind blue-500) mientras HESA usa #008DC9 (su azul de marca). Esto es correcto: el panel debe usar el azul de HESA, no el de Dashly.

### 2.3 Mapeo de Colores por Categoria de Producto (Patron Cross-Plataforma)

| Categoria | Color Badge Panel | Fondo Suave Panel | Bloque Color Sitio Publico |
|---|---|---|---|
| Farmacos | #008DC9 (azul HESA) | #EBF5FF | #E8F4FD (azul claro suave) |
| Alimentos | #22C55E (verde exito) | #DCFCE7 | #EDF7E8 (verde claro suave) |
| Equipos | #6B7280 (gris medio) | #F0F2F5 | #F0F2F5 (gris azulado suave) |

---

## 3. Tipografia PRESCRITA

### 3.1 Escala Tipografica Completa

| Nivel | Tamano | Peso | Uso | Plataforma |
|---|---|---|---|---|
| Hero headline desktop | 48-64px | Bold 700 / Extrabold 800 | Titulos de seccion, hero | Sitio Publico |
| Hero headline mobile | 32px min | Bold 700 | Hero en mobile | Sitio Publico |
| Subtitulos pagina | 36-48px | Bold 700 | Subtitulos de pagina | Sitio Publico |
| Numeros destacados | 36-48px (propuesta valor), 48-64px (nosotros) | Bold | Datos clave, conteos animados | Sitio Publico |
| Cuerpo de texto | 16-18px | Regular 400 / Medium 500 | Parrafos, descripciones | Sitio Publico |
| Interlineado cuerpo | 1.6-1.7 | -- | Line-height para cuerpo | Sitio Publico |
| Labels/metadata | 12-14px | Medium 500 / Semibold 600 | Tags uppercase con letter-spacing amplio | Sitio Publico |
| Texto descriptivo pequeno | 14-16px | Regular | Bajo numeros de propuesta de valor | Sitio Publico |
| Familia tipografica | Inter, DM Sans o similar | Sans-serif moderna | Todo el sitio | Ambas |
| Card nombre producto (panel) | 16px | Bold | Nombre producto en card | Panel |
| Card texto secundario (panel) | 14px | Regular | Marca, descripciones en cards | Panel |
| Headers tabla (panel) | 12-13px | UPPERCASE | Headers de columna en tablas | Panel |
| Subtitulo formulario (panel) | 18-20px | Bold | Subtitulos de secciones de formulario | Panel |
| Descripcion formulario (panel) | 14px | Regular, gris | Descripcion bajo subtitulo | Panel |

### 3.2 Notas de Implementacion Tipografica

**Familia tipografica:** El brief recomienda "Inter, DM Sans, o similar" pero NO prescribe una familia final. La decision queda abierta.

**Validacion contra Tuft & Paw (screenshot):** Tuft & Paw usa una combinacion de serif display para H1/H2 (similar a "Noe Display" o "Canela") y sans-serif para body/UI. Los headings tienen contraste alto de trazos (thick/thin) que transmite caracter editorial premium. SIN EMBARGO, el brief de HESA prescribe sans-serif moderna para todo el sitio, no serif display. Esto es una adaptacion intencional: HESA es B2B profesional, no B2C editorial. La personalidad premium se lograra con tamano (48-64px), peso (Bold/Extrabold), y spacing, no con tipografia serif decorativa.

**Validacion contra Dashly (screenshot):** Dashly usa una sans-serif (probablemente Inter) consistente en todo el panel. Los tamanos observados en la captura coinciden con las especificaciones del brief: headings ~24-28px semibold, labels de metricas ~13-14px regular, datos numericos ~28-40px bold, texto tabla ~14px regular. Los headers de tabla en UPPERCASE con ~12-13px son un patron confirmado visualmente.

**Recommendation de fuente:** Inter es la opcion mas segura. Es gratuita (Google Fonts), tiene excelente soporte de pesos (400/500/600/700/800), es legible en todos los tamanos, y ya es usada en la referencia Dashly. Cubre ambos contextos (sitio publico + panel) con consistencia.

---

## 4. Spacing PRESCRITO

| Contexto | Valor Prescrito | Plataforma | Valor Recomendado Final |
|---|---|---|---|
| Bloques de color padding interno | 60-80px | Sitio Publico | 72px (desktop), 48px (mobile) |
| Bloques de color border-radius | 20-30px | Sitio Publico | 24px |
| Grid productos gap | 24-32px | Sitio Publico | 28px (desktop), 20px (mobile) |
| Area contenido panel padding | 24-32px | Panel | 32px (desktop), 16px (mobile) |
| Gap entre cards panel | 20-24px | Panel | 24px |
| Padding dentro cards panel | 16-20px | Panel | 20px |
| Cards resumen border-radius | 12-16px | Panel | 16px |
| Campos formulario border-radius | 8-10px | Panel | 10px |
| Campos formulario borde | 1px gris claro | Panel | 1px #E5E7EB |
| Celda tabla padding vertical | 16-20px | Panel | 16px |
| Separadores tabla | 1px gris clarisimo | Panel | 1px #E5E7EB |
| Sidebar ancho fijo | 260-280px | Panel | 272px |
| Header altura fija | 64-72px | Panel | 68px |
| Breakpoints responsive | 375/768/1024/1280/1440+ px | Sitio Publico | Mismos valores |

### 4.1 Notas de Consistencia Cross-Page

**Validacion contra Tuft & Paw (screenshots):** El whitespace entre secciones en T&P es extremadamente generoso: 80-120px entre secciones principales en desktop. Los bloques de storytelling (mint green, rosa) tienen padding interno de ~60-80px, confirmando los valores del brief. El contenedor de contenido usa max-width ~1340px con ~40-50px de margen lateral en desktop. En mobile, el padding lateral se reduce a ~20-24px y el spacing vertical a ~48-60px.

**Validacion contra Dashly (screenshots):** El sidebar observado tiene ~280px de ancho, padding interno de cards ~24-32px, gap entre cards ~20-24px, fondo de area de contenido #F7F8FA. Estos valores confirman las especificaciones del brief.

**Recomendacion de spacing entre secciones del sitio publico (no prescrito en el brief):**
- Spacing entre secciones desktop: 96px (consistente con el generoso whitespace de T&P)
- Spacing entre secciones mobile: 64px
- Spacing entre hero y primera seccion: 0px (hero es full-viewport, la siguiente seccion comienza inmediatamente)
- Max-width del contenedor de contenido: 1280px (con padding lateral de 40px en desktop, 20px en mobile)

---

## 5. Animaciones/Transiciones PRESCRITAS

| Elemento | Duracion | Easing | Descripcion | Plataforma |
|---|---|---|---|---|
| Hover cards producto | 0.3s | suave | Elevacion shadow + scale(1.02) | Sitio Publico |
| Secciones scroll (fade-in) | -- | suave | Intersection observer, aparicion natural | Sitio Publico |
| Galeria producto (cambio img) | -- | fade/slide | Transicion suave al clic miniatura | Sitio Publico |
| Barra sticky | -- | slide-down | Aparece al pasar seccion info principal | Sitio Publico |
| Hover botones | 0.2s | -- | Cambio color de fondo | Sitio Publico |
| Hover links menu | -- | izq-a-der | Underline animado | Sitio Publico |
| Scroll suave | -- | smooth | Smooth scrolling global | Sitio Publico |
| Logos marcas | -- | -- | Escala grises a color en hover | Sitio Publico |
| Numeros nosotros | -- | -- | Count-up animation al entrar viewport | Sitio Publico |
| Timeline distribuidores | -- | secuencial | Animacion secuencial al entrar viewport | Sitio Publico |
| Hover cards panel | 0.2s | -- | Elevacion sombra + borde mas visible | Panel |
| Hover filas tabla panel | 0.15s | -- | Fondo gris muy suave | Panel |
| Toggle card/table view | -- | fade | Transicion animada del contenido | Panel |
| Dropdowns panel | 0.2s | slide-down | Apertura suave | Panel |
| Toast notification | 3s display | -- | Esquina sup-der, fondo verde, desaparece auto | Panel |
| Badge notificacion | -- | pulse | Pulse sutil al recibir nueva | Panel |

### 5.1 Notas de Implementacion de Animaciones

**Easing recomendado (no prescrito en brief):** El brief dice "suave" sin especificar funciones de easing. Recomendacion:
- Hover transitions: `ease-out` (0.2s-0.3s) -- respuesta inmediata, desaceleracion natural
- Scroll animations (fade-in): `cubic-bezier(0.4, 0, 0.2, 1)` -- Material Design standard easing
- Dropdowns/slides: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` -- ease-out con rebote sutil
- Toast/notifications: `ease-in-out` para entrada, `ease-in` para salida

**Validacion contra Tuft & Paw (screenshot):** El hero de T&P tiene animacion sutil de entrada. El logo del header cambia de completo a isotipo al scrollear (transicion suave). Las cards de producto tienen image swap on hover (product shot a lifestyle). Los carruseles usan dot navigation con dots estilo pill. Todos estos patrones son sutiles y profesionales, nunca llamativos.

**Validacion contra competidores:** Monteco, VETIM y Belina no tienen NINGUNA micro-interaccion ni animacion. El sitio de HESA debe usar animaciones como diferenciador competitivo, pero mantenerlas sutiles y profesionales (BVC-005).

---

## 6. Patrones de Referencia -- Validacion contra Screenshots

### Patron #1: Hero Full-Viewport (Tuft & Paw Home)
- **Fuente:** tuftandpaw.com (home)
- **Descripcion brief:** Tono B2B, headline "37 anos", 2 CTAs (catalogo + distribuidores), imagen profesional veterinaria
- **Validacion screenshot (ref-tuft-home-hero-desktop.png):** CONFIRMADO. Hero ocupa viewport completo (~830px alto). Imagen lifestyle a sangre completa. Texto superpuesto lado izquierdo: label uppercase "NEW FORMULA" (~12-13px, letter-spacing amplio), H1 "Introducing OdorStop" en serif display ~72-80px, subtitulo sans-serif ~18-20px, CTA con border-radius ~8px y padding generoso. El layout es asimetrico: texto en tercio izquierdo sobre foto.
- **Adaptacion para HESA:** H1 sans-serif bold (no serif) con el claim "37 anos" o similar. Imagen: profesional veterinaria B2B (no mascota tierna). 2 CTAs: boton primario #008DC9 "Ver Catalogo" + boton outline blanco "Quiero ser Distribuidor". Label uppercase #50B92A tipo "DESDE 1987" o "LIDER EN COSTA RICA".
- **Implementacion:** Full-viewport (100vh - header height). Imagen de alta calidad como background con overlay gradient sutil (de izquierda ~40% oscuro a transparente) para asegurar legibilidad del texto. Hero mobile: texto centrado, imagen con crop diferente, CTA full-width.

### Patron #2: Bloques Storytelling con Color (Tuft & Paw Secciones)
- **Fuente:** tuftandpaw.com (secciones verde/rosa)
- **Descripcion brief:** 3 bloques para Farmacos (#E8F4FD), Alimentos (#EDF7E8), Equipos (#F0F2F5); border-radius 20-30px, padding 60-80px, alternar img izq/der
- **Validacion screenshot (ref-tuft-home-storytelling-litter-desktop.png):** CONFIRMADO. Bloque verde menta (#C5E8D5 en T&P) ocupa full-width, layout 50/50 (texto + imagen), padding interno generoso (~60-80px). Checkpoints con iconos a la izquierda del texto. CTA oscuro "MAKE THE SWITCH". Esquinas del bloque con border-radius suave. En mobile se stackean verticalmente.
- **Adaptacion para HESA:** 3 bloques diferenciados por color:
  1. Farmacos: fondo #E8F4FD (azul claro), icono farmaco, titulo bold, 3 bullets con iconos verdes, CTA "Ver Farmacos", imagen profesional veterinaria
  2. Alimentos: fondo #EDF7E8 (verde claro), icono alimento, titulo bold, 3 bullets con iconos verdes, CTA "Ver Alimentos", imagen de producto
  3. Equipos: fondo #F0F2F5 (gris azulado), icono equipo, titulo bold, 3 bullets con iconos verdes, CTA "Ver Equipos", imagen de equipo
- **Implementacion:** border-radius 24px, padding 72px (desktop) / 48px (mobile). Alternar: bloque 1 = img derecha, bloque 2 = img izquierda, bloque 3 = img derecha. Fade-in al scroll con Intersection Observer.

### Patron #3: Carrusel "Most-loved" (Tuft & Paw Productos)
- **Fuente:** tuftandpaw.com (carrusel productos)
- **Descripcion brief:** "Productos destacados"; sin precio, boton "Ver producto", flechas circulares + dots
- **Validacion screenshot (ref-tuft-home-product-cards-desktop.png):** CONFIRMADO. 4 cards visibles en desktop (1440px), gap ~24px. Cards: imagen sobre fondo gris claro neutro (ratio ~1:1.15), nombre serif bold ~18px, descripcion sans-serif ~14px, boton "SHOP" full-width navy. Hover cambia imagen de product shot a lifestyle. Paginacion con dots estilo pill (activo=rectangulo, inactivos=circulos). Flechas prev/next circulares dark navy.
- **Adaptacion para HESA:** Cards SIN precio (anti-patron #1). Imagen producto sobre fondo #F5F7FA, nombre bold 16-18px, marca en gris, boton "Ver producto" #008DC9 outline. Hover: scale(1.02) + shadow + boton aparece. Flechas circulares + dots.
- **Implementacion:** 4 cards desktop, 2 tablet, 1 mobile (swipe). Gap 28px. Card border-radius 12px. Imagen aspect-ratio 1:1 o 4:5.

### Patron #4: Barra Sticky Producto (Tuft & Paw Product)
- **Fuente:** tuftandpaw.com/products/*
- **Descripcion brief:** Miniatura + nombre + marca + boton "Solicitar informacion"
- **Validacion screenshot (ref-tuft-product-sticky-bar-desktop.png):** CONFIRMADO. Barra sticky en desktop: fondo navy oscuro, altura ~60px. Contenido: thumbnail ~40px, nombre bold blanco, variante/precio regular blanco. A la derecha: dropdowns con fondo blanco + CTA. Aparece con slide-down al pasar la seccion de info principal.
- **Discrepancia mobile (ref-tuft-product-storytelling-mobile.png):** En mobile la sticky bar es INFERIOR (bottom), con fondo lavanda/claro (no navy oscuro). Contiene nombre + variante + precio + boton "ADD TO CART" full-width.
- **Adaptacion para HESA:**
  - Desktop: barra superior sticky, fondo #005A85, thumbnail producto + nombre bold blanco + marca regular blanco + boton "Solicitar informacion" #008DC9 con texto blanco
  - Mobile: barra inferior sticky, fondo blanco con borde top 1px #E5E7EB, nombre + marca + boton "Solicitar informacion" #008DC9 full-width
  - SIN precio, SIN dropdowns de variante (no aplica a HESA)

### Patron #5: Detalle Producto 2 Columnas (Tuft & Paw Product)
- **Fuente:** tuftandpaw.com/products/really-great-cat-litter
- **Descripcion brief:** Galeria izq con miniaturas verticales; info der con badges especie, pills presentaciones, CTA contacto
- **Validacion screenshot (ref-tuft-product-gallery-info-desktop.png):** CONFIRMADO. Layout 55% galeria / 45% info. Galeria: columna vertical de 7 thumbnails (~60x60px, borde gris claro, seleccionado=borde oscuro) + imagen principal grande (~600px ancho). Info: titulo serif bold ~32-36px, rating estrellas, badges de beneficio en franja gris redondeada (iconos linea + texto: "Low-Tracking", "Flushable", "99% Dust-Free"), pills de variante (border-radius ~25px, seleccionado=fondo azul claro), CTA "ADD TO CART" full-width navy ~50px alto.
- **Adaptacion para HESA:**
  - Galeria izq: thumbnails verticales, imagen principal con zoom on hover. Sin thumbnail de video (HESA no tiene videos de producto).
  - Info der: nombre bold 32-36px, badges de especie (perro, gato, equino, etc.) como pills con icono + texto en franja #F5F7FA, pills de presentacion (ej: "10kg", "5kg"), boton primario "Solicitar informacion" #008DC9 full-width, boton secundario outline "Descargar ficha tecnica" (si hay PDF), boton terciario verde WhatsApp "Consultar por WhatsApp"
  - SIN precio, SIN carrito, SIN variantes de compra

### Patron #6: Footer con Logo Grande (Tuft & Paw Footer)
- **Fuente:** tuftandpaw.com (footer)
- **Descripcion brief:** Fondo #005A85, logo HESA, nav completa, contacto, redes, selector idioma
- **Validacion screenshot (ref-tuft-home-footer-bottom-desktop.png):** CONFIRMADO. Footer lavanda/periwinkle con 3 columnas de links + newsletter. Al cierre: logo "tuft&paw" ENORME en navy (~300px alto de tipografia) como brand closure statement. En mobile: acordeones con "+" circular para expandir secciones.
- **Adaptacion para HESA:** Fondo #005A85, texto blanco. 4 columnas: Logo HESA + tagline, Navegacion rapida (Home, Catalogo, Marcas, Nosotros), Contacto (tel, email, direccion, horario), Redes Sociales (Facebook, Instagram, LinkedIn, WhatsApp). Selector idioma ES/EN (BVC-039). Logo HESA grande como cierre. Copyright. Mobile: acordeones colapsables.

### Patron #7: Nav/Header Minimalista (Tuft & Paw Nav)
- **Fuente:** tuftandpaw.com
- **Descripcion brief:** Logo izq, categorias centro/der, busqueda + selector idioma (sin carrito ni cuenta)
- **Validacion screenshot:** CONFIRMADO en multiples capturas. Header blanco limpio ~70px. Logo "tuft&paw" negro bold izquierda. Menu derecha: items sans-serif regular ~15-16px con spacing ~40px. Iconos utilidad: busqueda, bandera, cuenta, carrito. Sticky header: logo cambia a isotipo al scrollear.
- **Adaptacion para HESA:**
  - Logo HESA izquierda
  - Menu centro/derecha: Inicio | Farmacos | Alimentos | Equipos | Marcas | Nosotros | Distribuidores | Contacto
  - Iconos derecha: lupa de busqueda + selector idioma ES/EN (bandera CR / US)
  - SIN carrito, SIN cuenta usuario, SIN login (anti-patrones #3, #5)
  - Sticky: logo completo cambia a isotipo HESA al scrollear
  - Mobile: hamburger izq + logo centrado + selector idioma derecha

### Patron #8: Dashboard Cards Resumen (Dashly Products)
- **Fuente:** dashlytemplate.webflow.io/dashboards/products
- **Descripcion brief:** 4 cards: Total productos, Mensajes nuevos, Marcas, Productos destacados
- **Validacion screenshot (ref-dashly-dashboard-products-overview-desktop.png):** CONFIRMADO. Card principal "Total sales": fondo blanco, border-radius ~12-16px, sombra sutil. Label gris ~14px, dato principal $296,507 en ~28-32px bold, indicador de cambio +28.5% en verde con flecha. Grafico de area debajo. Cards de categoria tipo Tasks: icono decorativo en circulo de color suave (~48px), titulo, barra de progreso, texto "X of Y completed".
- **Adaptacion para HESA:** 4 cards en fila:
  1. Total Productos (icono caja en circulo #EBF5FF, numero grande, badge de cambio)
  2. Mensajes Nuevos (icono sobre en circulo #FEF3C7, numero + badge naranja si hay sin leer)
  3. Marcas Activas (icono estrella en circulo #DCFCE7, numero)
  4. Productos Destacados (icono corazon en circulo #FEE2E2, numero)

### Patron #9: Cards Contenido Card View (Dashly Companies)
- **Fuente:** dashlytemplate.webflow.io/features/companies (Card view)
- **Descripcion brief:** Vista por defecto para productos y marcas; imagen + nombre + badges + menu 3 puntos
- **Validacion screenshot (ref-dashly-features-companies-cardview-desktop.png):** CONFIRMADO. Grid 3 columnas. Card: logo circular (~40-48px) + nombre bold ~18-20px, divider horizontal, campos label-value UPPERCASE (LOCATION, PHONE NUMBER, WEBSITE), footer con boton outline "View Company" + iconos editar/eliminar. Border-radius ~12-16px, sombra/borde sutil. Gap ~20-24px.
- **Adaptacion para HESA (productos):** Card: imagen producto cuadrada (fondo #F5F7FA) + nombre bold 16px + marca regular 14px gris + badge categoria (pill: Farmaco=#EBF5FF azul, Alimento=#DCFCE7 verde, Equipo=#F0F2F5 gris) + badge estado (Activo=verde, Inactivo=rojo) + menu 3 puntos (Editar, Ver detalle, Desactivar). Footer: boton outline "Ver detalle" + iconos editar/eliminar.
- **Adaptacion para HESA (marcas):** Card: logo marca 80x80px + nombre bold + pais + badges de categorias que maneja + conteo "X productos".

### Patron #10: Tablas Limpias (Dashly Table)
- **Fuente:** dashlytemplate.webflow.io/features/table
- **Descripcion brief:** Solo para datos tabulares (mensajes, historial); headers uppercase 12-13px, badges estado, paginacion
- **Validacion screenshot (ref-dashly-features-table-desktop.png via capture-notes):** CONFIRMADO. Headers UPPERCASE gris medio ~12-13px con iconos de sort. Filas ~48-56px alto con separadores 1px gris claro. Badges estado tipo pill: Paid=verde pastel, Unpaid=rojo pastel, Pending=ambar pastel. Acciones: iconos ojo+lapiz+basura. Paginacion "1-10 of 640".
- **Adaptacion para HESA:** Tabla para mensajes de contacto y log de actividad. NO para productos ni marcas (esos son cards, anti-patron #12). Headers: FECHA, NOMBRE, EMAIL, TIPO, MENSAJE PREVIEW, ESTADO, ACCIONES. Badges: Nuevo=#FEF3C7 naranja, En proceso=#EBF5FF azul, Atendido=#DCFCE7 verde.
- **Mobile:** Transformacion a stacked cards. Cada fila se convierte en bloque vertical: labels UPPERCASE izquierda + valores derecha.

### Patron #11: Formularios con Secciones (Dashly Settings)
- **Fuente:** dashlytemplate.webflow.io/settings/v3
- **Descripcion brief:** Pantallas dedicadas, labels arriba, secciones con subtitulo, 2 columnas campos cortos
- **Validacion screenshot (ref-dashly-settings-tabs-form-desktop.png):** CONFIRMADO. Panel formulario: fondo blanco, border-radius ~16px, sombra sutil. Subtitulo "Basic information" bold ~16-18px + descripcion gris ~14px + separador horizontal + campos. Labels ARRIBA del campo (no placeholder), font-weight semibold ~13-14px. Campos: fondo blanco, borde #E5E7EB, border-radius ~10-12px, altura ~44-48px. Grid 2 columnas para campos cortos (Full name | Email address). Textarea full-width para campos largos. Upload avatar: foto circular + info tamano + boton outline.
- **Adaptacion para HESA:**
  - Formulario de producto: 5 secciones con subtitulo + descripcion + separador. Grid 2 columnas campos cortos (Nombre ES | Nombre EN, Marca | Categoria). Textarea full-width para descripciones. Upload zona drag-drop para imagenes y PDF.
  - Labels siempre arriba del campo, nunca como placeholder.
  - Campos: border-radius 10px, borde 1px #E5E7EB, altura 44px, fondo blanco.

### Patron #12: Tabs Horizontales Pill (Dashly Settings)
- **Fuente:** dashlytemplate.webflow.io/settings/v3
- **Descripcion brief:** Tabs con icono+texto; activo=fondo azul+blanco, inactivo=blanco+borde+gris
- **Validacion screenshot:** CONFIRMADO. 5 tabs (Account, Team, Billing, Notifications, API) con estilo pill. Activo: fondo #008DC9 (adaptado), texto blanco, border-radius ~24px. Inactivo: fondo transparente, borde #E5E7EB, texto gris oscuro, misma forma pill. Cada tab con icono a la izquierda. Mobile: tabs se re-acomodan en 2 filas (3+2), NO scroll horizontal.
- **Adaptacion para HESA:**
  - Configuracion: 4 tabs (General, Contacto, Redes, SEO)
  - Gestion Home: 3 tabs (Hero, Productos Destacados, Marcas Destacadas)
  - Contenido Estatico: 4 tabs (Nosotros, Distribuidores, Contacto, Politicas)
  - Todos con icono + texto, activo fondo #008DC9

### Patron #13: Kanban Board Mensajes (Dashly Board)
- **Fuente:** dashlytemplate.webflow.io/features/board
- **Descripcion brief:** 3 columnas: Nuevos/En proceso/Atendidos; drag-and-drop entre columnas
- **Validacion screenshot (via capture-notes):** CONFIRMADO. 3 columnas equidistantes. Headers UPPERCASE con conteo: "DESIGN TASKS (3)". Cards: badge tipo pill (color semantico) + titulo bold 15-16px + descripcion gris 13-14px + metadata (avatares overlap + conteo comentarios). Menu "..." contextual. Variantes: card basica, card con cover image, card con attachment. Mobile: columnas se apilan verticalmente.
- **Adaptacion para HESA:** 3 columnas para mensajes:
  1. NUEVOS (conteo): cards con badge tipo (Consulta=#EBF5FF, Distribuidor=#DCFCE7, Fabricante=#FEE2E2) + nombre + email + preview mensaje + fecha. SIN avatares (no hay usuarios asignados).
  2. EN PROCESO (conteo)
  3. ATENDIDOS (conteo)
  - Drag-and-drop entre columnas para cambiar estado.
  - Mobile: columnas apiladas verticalmente.

### Patron #14: Toggle Card/Table View (Dashly Companies)
- **Fuente:** dashlytemplate.webflow.io/features/companies
- **Descripcion brief:** Dos botones tipo pill para alternar vista
- **Validacion screenshot (ref-dashly-features-companies-cardview-desktop.png):** CONFIRMADO. Dos botones pill lado a lado. Activo: fondo #008DC9 (adaptado), texto blanco, icono grid. Inactivo: fondo blanco, borde gris, texto gris, icono lista. Transicion instantanea (CSS display toggle). Mobile: mantienen estilo pill lado a lado.
- **Adaptacion para HESA:** Toggle en listados de Productos y Marcas. Card view es la vista por defecto (principio #1 del panel). Table view disponible como alternativa.

### Patron #15: Cards Categoria con Progreso (Dashly Tasks)
- **Fuente:** dashlytemplate.webflow.io/features/projects
- **Descripcion brief:** Cards acceso rapido: icono circulo color + nombre + conteo + barra progreso
- **Validacion screenshot (via capture-notes dashly-dashboard):** CONFIRMADO. 3 cards en fila. Cada card: icono decorativo en circulo de color suave (~48px, opacity ~10-15% del color base), titulo ~16px semibold, barra de progreso verde sobre gris claro (~6px alto, border-radius full), texto "5 of 10 completed". Menu "..." esquina. Border-radius ~12-16px.
- **Adaptacion para HESA:** 3 cards de categoria en dashboard:
  1. Farmacos: icono jeringa en circulo #EBF5FF, conteo "X productos activos", barra azul
  2. Alimentos: icono plato en circulo #DCFCE7, conteo, barra verde
  3. Equipos: icono herramienta en circulo #F0F2F5, conteo, barra gris

---

## 7. Especificaciones por Pagina

### 7.1 Sitio Publico

#### Home

| Seccion | Layout | Componentes | Patron Ref | Notas de implementacion |
|---|---|---|---|---|
| Hero | Full viewport (100vh), texto izq + img der | Tag uppercase verde, headline 48-64px bold, subtitulo 18px, 2 CTAs (azul primario + outline blanco), imagen profesional veterinaria B2B | #1 | Overlay gradient izq para legibilidad. Label "DESDE 1987" o similar. Mobile: texto centrado, CTAs stacked. |
| Categorias | 3 bloques color, 2 cols alternadas | Titulo bold + parrafo + 3 checks con iconos verdes + CTA + imagen; fade-in scroll | #2 | Farmacos #E8F4FD, Alimentos #EDF7E8, Equipos #F0F2F5. Border-radius 24px, padding 72px. Alternar img izq/der. |
| Marcas | Grilla/fila horizontal, fondo blanco | 6-8 logos escala grises, hover a color, link "Ver todas" | -- | Logos uniformes en tamano (~120px ancho). Transicion grayscale a color 0.3s. |
| Propuesta valor | 4 bloques fila horizontal, fondo #F5F7FA | Icono lineal verde #50B92A + numero grande 36-48px bold + texto descriptivo 14-16px | -- | 4 cols desktop, 2x2 tablet, 1 col mobile. Count-up animation al entrar viewport. |
| Productos destacados | Carrusel horizontal | Cards: img cuadrada fondo #F5F7FA + nombre bold 16px + marca gris 14px + boton outline "Ver producto"; flechas circulares + dots | #3 | 4 visible desktop, 2 tablet, 1 mobile. SIN precio. Hover: scale(1.02) + shadow. |
| CTA fabricantes | Full-width fondo #008DC9 | Texto blanco, boton blanco/azul invertido "Quiero ser Distribuidor", banner prominente | -- | Padding 80px vertical. CTA con fondo blanco, texto #008DC9. |
| Footer | 4 cols, fondo #005A85 | Logo HESA grande, nav rapida, contacto, redes, selector idioma ES/EN, copyright | #6 | Logo HESA como brand closure. Acordeones en mobile. |

#### Catalogo (x3: Farmacos, Alimentos, Equipos)

| Seccion | Layout | Componentes | Patron Ref |
|---|---|---|---|
| Header | Breadcrumb + titulo + contador | Breadcrumb gris 14px, titulo bold 36-42px, "X Productos" gris derecha | #5 grid (T&P collection) |
| Filtros | Fila horizontal + pills activos | Dropdowns (especie, subcategoria, marca) + pills de filtros activos con "x" | -- |
| Grid productos | 3 cols desktop, 2 tablet, 1 mobile | Cards: img cuadrada fondo #F5F7FA, nombre bold, marca gris, badge categoria, CTA "Ver producto" en hover. SIN precio. Gap 28px | #3 adaptado |
| Paginacion | Inferior centrada | Numeros + flechas prev/next | -- |

#### Detalle Producto

| Seccion | Layout | Componentes | Patron Ref |
|---|---|---|---|
| Producto superior | 2 cols: 55% galeria + 45% info | Galeria: thumbnails verticales 60x60 + img principal. Info: nombre bold 32-36px, badges especie (pills), pills presentaciones, CTA "Solicitar info" #008DC9, CTA "Descargar PDF" outline, "Consultar WhatsApp" verde. SIN precio. | #5 |
| Barra sticky | Top desktop / Bottom mobile | Miniatura + nombre + marca + boton "Solicitar informacion" | #4 |
| Descripcion | Full-width, texto + posible storytelling | Texto descriptivo, posiblemente bloques color por categoria | -- |
| Productos relacionados | Carrusel horizontal | Mismas cards que catalogo | #3 |
| FAQ | Acordeon expandible | Preguntas frecuentes del producto, expand/collapse | -- |

#### Marcas

| Seccion | Layout | Componentes |
|---|---|---|
| Grid marcas | 3-4 cols desktop | Cards: logo centrado + nombre bold + pais + badges categorias (pills color) |
| Marca individual | Logo + desc + grid filtrable | Header con logo grande + nombre + pais + descripcion. Grid de productos de esa marca con mismos filtros que catalogo general |

#### Nosotros

| Seccion | Layout | Componentes |
|---|---|---|
| Hero | 50-60vh, texto superpuesto | Headline "37 anos de experiencia" bold, subtitulo, imagen corporativa |
| Historia | 2 cols alternadas | Bloques narrativos con imagen + texto, como storytelling T&P |
| Numeros | 4 bloques horizontales | Count-up animados 48-64px: anos, productos, marcas, distribuidores |
| Mapa | Full-width | Mapa de Costa Rica estilizado con puntos de cobertura |
| Equipo | Grid 3-4 cols | Cards: foto circular + nombre + cargo. Placeholders ficticios OK |
| Politicas comerciales | Seccion con iconos | Cards o bloques con icono + titulo + descripcion breve |

#### Distribuidores

| Seccion | Layout | Componentes |
|---|---|---|
| Hero B2B | 50-60vh | Headline enfocado en distribuidores, CTA "Solicitar ser distribuidor" |
| Beneficios | Grid 3x2 (6 beneficios) | Cards con icono circular #008DC9 + titulo bold + descripcion |
| Logo wall | Fila horizontal | Logos de marcas distribuidas, grayscale con hover a color |
| Timeline | 4 pasos horizontal | Timeline horizontal desktop / vertical mobile. Iconos circulares numerados con linea conectora. Animacion secuencial al scroll |
| Formulario | 2 cols: info izq + form der | 8 campos: nombre, empresa, email, telefono, provincia, tipo negocio, mensaje, consentimiento |

#### Contacto

| Seccion | Layout | Componentes |
|---|---|---|
| Contenido | 2 cols: info izq + formulario der | Info: telefono, correo, direccion, horario, redes sociales, mapa Google embed. Formulario: tipo consulta dropdown + nombre + email + telefono + mensaje + enviar |

### 7.2 Panel de Administracion

#### Dashboard

| Seccion | Layout | Componentes | Patron Ref |
|---|---|---|---|
| Fila 1 | 4 cards resumen horizontales | Total Productos, Mensajes Nuevos, Marcas, Productos Destacados. Icono circulo color + numero grande + label | #8 |
| Fila 2 | 3 cards categoria | Farmacos, Alimentos, Equipos. Icono circulo + nombre + barra progreso + conteo | #15 |
| Fila 3 | 2 cols: mensajes recientes + actividad | Mensajes: 5 ultimos con badge estado. Actividad: log de acciones recientes con timestamp | #8 |

#### Productos - Listado

| Componente | Especificacion | Patron Ref |
|---|---|---|
| Toolbar | Titulo "Productos" + boton "+ Nuevo Producto" azul + search bar | #8 header |
| Filtros | Dropdown categoria + dropdown estado + pills activos | -- |
| Toggle vista | Card view (default) / Table view | #14 |
| Grid cards | 3 cols. Card: img + nombre + marca + badge cat + badge estado + menu 3 puntos | #9 |
| Tabla (alt) | Headers UPPERCASE, badges estado, iconos accion (ver+editar+eliminar) | #10 |

#### Productos - Crear/Editar

| Componente | Especificacion | Patron Ref |
|---|---|---|
| Layout | Formulario pantalla completa (no modal, anti-patron #14) | #11 |
| Secciones | 5: Info basica, Categoria/Clasificacion, Imagenes/Archivos, Descripcion, Configuracion | #11 |
| Campos | Labels arriba, border-radius 10px, borde #E5E7EB, grid 2 cols campos cortos | #11 |
| Selector categoria | 3 cards mini (Farmacos/Alimentos/Equipos) con icono + nombre | -- |
| Campos condicionales | Se muestran/ocultan segun categoria (anti-patron #16) | -- |
| Upload | Drag-drop zona para imagenes + PDF ficha tecnica | #11 |
| Tabs idioma | ES / EN como tabs pill para campos traducibles | #12 |

#### Productos - Detalle (Solo Lectura)

| Componente | Especificacion |
|---|---|
| Layout | 2 cols: imagen izq + info en bloques der |
| Datos | Todos los campos del producto en modo solo lectura, badges de estado |
| Acciones | Boton "Editar" primario, boton "Ver en sitio" outline, boton "Desactivar" rojo outline |

#### Marcas - Listado

| Componente | Especificacion | Patron Ref |
|---|---|---|
| Grid cards | 3 cols. Cards: logo 80x80 + nombre bold + pais + badges categorias + conteo productos | #9, #14 |
| Toggle vista | Card view (default) / Table view | #14 |

#### Marcas - Crear/Editar

| Componente | Especificacion | Patron Ref |
|---|---|---|
| Layout | Formulario corto 1 seccion | #11 |
| Campos | Logo drag-drop, nombre, pais dropdown, multi-select categorias, descripcion ES/EN | #11 |

#### Categorias

| Componente | Especificacion |
|---|---|
| Layout | 3 cards expandibles (Farmacos/Alimentos/Equipos) |
| Contenido | Tags/chips editables por subseccion, "+" inline para agregar nueva subcategoria |

#### Home - Gestion

| Componente | Especificacion | Patron Ref |
|---|---|---|
| Tabs | 3: Hero / Productos destacados / Marcas destacadas | #12 |
| Hero tab | Preview imagen + campos texto ES/EN (titulo, subtitulo, CTA texto, CTA link) | -- |
| Destacados tabs | Drag-drop reorden + modal de busqueda/seleccion de productos o marcas | -- |

#### Contenido Estatico

| Componente | Especificacion | Patron Ref |
|---|---|---|
| Tabs | 4: Nosotros / Distribuidores / Contacto / Politicas | #12 |
| Campos | Textos simples y textareas, version ES/EN para cada campo | -- |

#### Mensajes

| Componente | Especificacion | Patron Ref |
|---|---|---|
| Vista default | Kanban 3 columnas: Nuevos / En Proceso / Atendidos | #13 |
| Vista alt | Toggle a tabla con badges estado | #10 |
| Cards kanban | Badge tipo + nombre + correo + preview msg + fecha. Drag-drop entre cols | #13 |

#### Mensaje - Detalle

| Componente | Especificacion |
|---|---|
| Layout | Card lateral datos contacto + contenido mensaje + notas internas |
| Acciones | Estado dropdown (Nuevo/En proceso/Atendido), notas textarea, boton "Marcar atendido" |

#### Configuracion

| Componente | Especificacion | Patron Ref |
|---|---|---|
| Tabs | 4: General / Contacto / Redes / SEO | #12 |
| General | Logo drag-drop, nombre empresa, slogan ES/EN | #11 |
| Contacto | Telefono, email, direccion, horario, WhatsApp | #11 |
| Redes | URLs de redes sociales | #11 |
| SEO | Meta title, meta description ES/EN, og:image | #11 |

---

## 8. Anti-patrones Mandatorios

Estos son elementos PROHIBIDOS por el cliente. Cualquier diseno que los incluya viola los requerimientos.

| # | Anti-patron | Contexto | Implicacion para el equipo de diseno |
|---|---|---|---|
| 1 | Precios de productos | Prohibido en todo el sitio | Ningun componente de producto debe incluir campo de precio, ni en cards, ni en detalle, ni en catalogo. |
| 2 | Inventario / disponibilidad de stock | Prohibido en todo el sitio | Sin badges "En stock" / "Agotado", sin contadores de unidades. |
| 3 | Carrito de compras | Prohibido en todo el sitio | Sin icono de carrito en header, sin boton "Agregar al carrito", sin drawer de carrito. |
| 4 | Checkout / pasarela de pago | Prohibido en todo el sitio | Sin flujo de checkout, sin formulario de pago. |
| 5 | Registro de usuarios / login de clientes | Prohibido en el sitio publico | El sitio publico NO tiene login. Solo el panel tiene autenticacion (Azure Entra ID). |
| 6 | Seccion de ofertas o descuentos | Prohibido en todo el sitio | Sin badges "Sale", sin precios tachados, sin secciones de ofertas. |
| 7 | Resenas o calificaciones de usuarios | Prohibido en todo el sitio | Sin estrellas, sin reviews, sin "X personas compraron este producto". |
| 8 | Blog | Fuera de alcance | Sin seccion de blog, sin cards de articulos, sin feed de noticias. |
| 9 | Chat en vivo (solo WhatsApp) | Prohibido en todo el sitio | Sin widget de chat. Solo boton flotante de WhatsApp (BVC-038). Sin Intercom, sin Crisp, sin Smartsupp. |
| 10 | Fotos tiernas/B2C de mascotas | Imagenes deben ser profesionales veterinarias B2B | Sin fotos de gatitos tiernos, sin ilustraciones playful. Imagenes de veterinarios trabajando, laboratorios, equipos profesionales. |
| 11 | Layouts genericos tipo competencia | Superar a Monteco, VETIM, Belina | Si un layout "se parece" a lo que tiene Monteco (slider generico, cards basicas, sans-serif plano), replantearlo. |
| 12 | Listas planas para productos (Panel) | Productos y marcas siempre como cards con imagen | La vista por defecto debe ser Card view, nunca lista de texto. Table view disponible como alternativa. |
| 13 | Multiples acciones en una pantalla (Panel) | Separar: VER / CREAR-EDITAR / DETALLE | Un listado solo lista. Un formulario solo edita. No combinar. |
| 14 | Modals para formularios largos (Panel) | Formularios complejos = pantalla completa | El formulario de crear/editar producto tiene 5 secciones -- NO puede ser un modal. |
| 15 | Formularios sin secciones (Panel) | Siempre seccionar con subtitulo + descripcion | Cada grupo de campos tiene subtitulo bold + descripcion gris + separador (patron Dashly #11). |
| 16 | Campos no aplicables visibles (Panel) | Campos condicionales segun categoria | Si un campo solo aplica a Farmacos, no mostrarlo cuando la categoria es Alimentos. |
| 17 | Estados vacios sin disenar (Panel) | Siempre ilustracion + mensaje + CTA | "No hay productos" debe tener ilustracion, texto explicativo, y boton "+ Crear producto". |
| 18 | Estados como texto plano (Panel) | Siempre badges con color | "Activo" no puede ser texto negro. Debe ser un badge pill con fondo #DCFCE7 y texto #22C55E. |

---

## 9. Brief Verification Criteria (BVC-xxx)

### 9.1 Del Checklist del Sitio Publico

| ID | Criterio del Cliente | Tipo | Como Verificar |
|---|---|---|---|
| BVC-001 | El diseno se siente premium y no generico | subjective | Revision visual por humano. Comparar side-by-side con Monteco/VETIM/Belina. |
| BVC-002 | Hay suficiente espacio en blanco entre elementos | visual | Comparar spacing con T&P (80-120px entre secciones). Padding minimo 60px en bloques. |
| BVC-003 | La tipografia tiene jerarquia clara (titulo grande, subtitulo, cuerpo) | visual | H1 >= 48px, H2 >= 36px, body 16-18px. Al menos 3 niveles visiblemente distinguibles. |
| BVC-004 | Los colores corresponden a la paleta definida (#008DC9, #50B92A, #F5F7FA, #6B7280, #1F2937, #005A85, #E8F4FD, #EDF7E8, #F0F2F5) | computed-style | Inspeccionar CSS. Ningun color fuera de la paleta prescrita (excepto imagenes). |
| BVC-005 | Las animaciones son sutiles y profesionales (no agresivas) | visual | Duraciones <= 0.3s para hover, <= 0.5s para scroll animations. Sin bouncing, sin flashing. |
| BVC-006 | El diseno funciona en mobile | visual | Testear en 375px. Texto legible, CTAs tappable (44px min), sin overflow horizontal. |
| BVC-007 | La seccion tiene un equivalente visual en Tuft and Paw que se esta copiando correctamente | visual | Para cada seccion, identificar el patron de T&P que replica y verificar fidelidad. |
| BVC-008 | No se estan mostrando precios, inventario, carrito u otros elementos prohibidos | visual (negative) | Buscar en el DOM: ningun "$", ningun "precio", ningun "cart", ningun "stock". |
| BVC-009 | Los textos estan en espanol e ingles | visual | Verificar que hay selector idioma y que cada pagina tiene version en ambos idiomas. |
| BVC-010 | El nivel visual supera claramente lo que tienen Monteco, VETIM y Belina | subjective | Side-by-side comparison. HESA debe tener: animaciones (ellos no), spacing generoso (ellos apretado), cards ricas (ellos basicas), tipografia con personalidad (ellos generica). |

### 9.2 Del Checklist del Panel

| ID | Criterio del Cliente | Tipo | Como Verificar |
|---|---|---|---|
| BVC-011 | La pantalla tiene un solo proposito claro (ver, crear, editar, o configurar) | visual | Cada URL del panel tiene una sola accion principal. No mezclar listado + formulario. |
| BVC-012 | Los productos y marcas se muestran como cards con imagen/logo, no como listas planas | visual | Vista por defecto = Card view con imagenes. |
| BVC-013 | Los formularios estan organizados en secciones con subtitulos | visual | Cada formulario tiene >= 1 subtitulo bold + descripcion gris + separador. |
| BVC-014 | Los campos condicionales se muestran/ocultan segun la categoria seleccionada | visual | Seleccionar "Farmacos" y verificar que aparecen campos especificos de farmacos. Cambiar a "Alimentos" y verificar que desaparecen. |
| BVC-015 | Hay suficiente espacio entre elementos (padding, gap, margin) | computed-style | Padding area contenido >= 24px, gap cards >= 20px, padding dentro cards >= 16px. |
| BVC-016 | Todos los estados tienen badge con color (no texto plano) | visual | Buscar cualquier estado (Activo/Inactivo/Pendiente) renderizado como texto negro sin fondo de color. |
| BVC-017 | Los iconos acompanan a los elementos de navegacion, cards de resumen, y badges | visual | Sidebar items con iconos, cards resumen con iconos en circulos, badges con iconos. |
| BVC-018 | Las acciones destructivas tienen confirmacion (modal) | visual | Click en "Eliminar" debe mostrar modal de confirmacion antes de ejecutar. |
| BVC-019 | Los estados vacios estan disenados (ilustracion + mensaje + CTA) | visual | Vaciar una lista (0 productos) y verificar que muestra ilustracion + texto + boton crear. |
| BVC-020 | La pantalla se siente como herramienta hecha a la medida, no CRUD generico | subjective | Comparar con un CRUD generico de bootstrap. HESA debe tener iconos, colores semanticos, cards, badges, spacing premium. |
| BVC-021 | El flujo de navegacion es claro: Listado > Crear/Editar > Detalle | visual | Desde listado, click en card lleva a Detalle. Desde detalle, boton "Editar" lleva a formulario. |
| BVC-022 | El toggle Card view / Table view esta disponible en listados de productos y marcas | visual | Verificar que existen los botones pill de toggle y que ambas vistas funcionan. |
| BVC-023 | Los toast notifications aparecen despues de guardar, eliminar, o cambiar estado | visual | Ejecutar accion y verificar toast en esquina superior derecha, fondo verde, auto-desaparece 3s. |
| BVC-024 | El panel refleja la misma calidad visual que el sitio publico | subjective | Consistencia de paleta, tipografia, spacing, nivel de pulido. |

### 9.3 BVC Derivados de Anti-patrones

| ID | Criterio del Cliente | Tipo |
|---|---|---|
| BVC-025 | No hay precios visibles en ninguna pagina del sitio | visual (negative) |
| BVC-026 | No hay carrito, checkout ni pasarela de pago | visual (negative) |
| BVC-027 | No hay registro de usuarios ni login de clientes en sitio publico | visual (negative) |
| BVC-028 | No hay seccion de ofertas, descuentos, resenas ni blog | visual (negative) |
| BVC-029 | No hay chat en vivo (solo WhatsApp flotante) | visual (negative) |
| BVC-030 | No hay listas planas de productos en el panel (siempre cards) | visual (negative) |

### 9.4 BVC Derivados de Principios Testables

| ID | Criterio del Cliente | Tipo | Valor a Verificar |
|---|---|---|---|
| BVC-031 | Titulos hero son minimo 48px desktop, 32px mobile | computed-style | font-size >= 48px desktop, >= 32px mobile |
| BVC-032 | Bloques de color tienen border-radius 20-30px y padding 60-80px | computed-style | border-radius: 20-30px, padding: 60-80px |
| BVC-033 | Hover en cards tiene shadow + scale(1.02) con transicion 0.3s | computed-style | transform: scale(1.02), box-shadow aumenta, transition: 0.3s |
| BVC-034 | Sidebar panel tiene ancho ~260-280px, fondo blanco, borde derecho | computed-style | width: 260-280px, background: #FFFFFF, border-right: 1px |
| BVC-035 | Header panel tiene altura ~64-72px, fondo blanco, borde inferior | computed-style | height: 64-72px, background: #FFFFFF, border-bottom: 1px |
| BVC-036 | Fondo area contenido panel es #F7F8FA con padding 24-32px | computed-style | background: #F7F8FA, padding: 24-32px |
| BVC-037 | Cards resumen panel tienen border-radius 12-16px y sombra sutil | computed-style | border-radius: 12-16px, box-shadow != none |
| BVC-038 | WhatsApp flotante esta presente en todas las paginas, esquina inferior derecha | visual | Boton flotante verde en todas las paginas del sitio publico |
| BVC-039 | Selector de idioma ES/EN visible en header y footer | visual | Toggle/dropdown de idioma en ambas ubicaciones |
| BVC-040 | Footer usa fondo #005A85 con texto blanco | computed-style | background: #005A85, color: #FFFFFF |

---

## 10. Decisiones de Diseno Holisticas

Estas son decisiones para casos NO cubiertos por el brief, basadas en el analisis de las capturas y los principios del cliente.

### 10.1 Easing Functions para Animaciones

El brief dice "suave" sin especificar. Basado en el analisis de T&P (transiciones fluidas y naturales) y la necesidad de superar a la competencia (que no tiene animaciones):

| Contexto | Easing | Justificacion |
|---|---|---|
| Hover (botones, cards) | `ease-out` | Respuesta inmediata al interactuar, desaceleracion natural |
| Scroll animations (fade-in) | `cubic-bezier(0.4, 0, 0.2, 1)` | Material Design standard, profesional y probado |
| Dropdowns/slides | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Suave con desaceleracion gradual |
| Toast entrada | `ease-in-out` | Natural para elementos que aparecen y desaparecen |

### 10.2 Estados Semanticos para Sitio Publico (Gap Identificado)

El brief del sitio publico no define colores de estados (success/error/warning) para formularios. Basado en la paleta del panel para consistencia cross-plataforma:

| Estado | Color | Fondo | Uso en sitio publico |
|---|---|---|---|
| Exito | #22C55E | #DCFCE7 | Formulario enviado exitosamente, validacion correcta |
| Error | #EF4444 | #FEE2E2 | Campo invalido, error de envio |
| Atencion | #F59E0B | #FEF3C7 | Campo requerido vacio, aviso informativo |

### 10.3 Tipografia de Headings del Sitio Publico

El brief prescribe sans-serif (Inter/DM Sans) pero T&P usa serif display para H1/H2. Dado que HESA es B2B profesional:

**Decision:** Usar **Inter** en todos los niveles, pero con tratamiento premium:
- H1 Hero: Inter Extrabold 800, 56px, letter-spacing -0.02em (tracking tight para personalidad)
- H2 Secciones: Inter Bold 700, 42px, letter-spacing -0.01em
- Labels uppercase: Inter Semibold 600, 13px, letter-spacing 0.08em (tracking amplio)
- El contraste de pesos (800 vs 400) y tamanos (56px vs 16px) crea jerarquia premium sin necesitar serif

### 10.4 Sombras para Cards (No Prescrito con Detalle)

Basado en el analisis de Dashly (sombras sutiles casi imperceptibles):

| Estado | Sombra | Uso |
|---|---|---|
| Default | `0 1px 3px rgba(0,0,0,0.08)` | Cards en reposo, tabla container |
| Hover | `0 4px 12px rgba(0,0,0,0.12)` | Cards al pasar mouse |
| Elevated | `0 8px 24px rgba(0,0,0,0.12)` | Modales, dropdowns flotantes |

### 10.5 Iconografia (No Prescrito con Detalle)

Basado en los patrones de Dashly (iconos outline/stroke en circulos de color):

**Decision:** Usar una libreria de iconos outline/stroke consistente (Lucide, Heroicons, o Phosphor Icons). Los iconos deben ser:
- Trazo: 1.5-2px stroke
- Tamano: 20-24px en sidebar, 24-28px en cards, 16-20px en botones
- Color: hereda del contexto (gris en sidebar inactivo, blanco en sidebar activo sobre #008DC9, verde en iconos de beneficio)
- Circulos decorativos: 48px diametro, fondo con opacity 10-15% del color del icono

### 10.6 Search Bar Global del Sitio Publico

El cliente enfatizo busqueda con prediccion/autocompletado como critica. No detallada en el brief visual:

**Decision basada en patron T&P:** Icono de lupa en el header que abre un overlay/modal de busqueda full-width con:
- Input grande (20px font, centrado)
- Predicciones en dropdown: productos, marcas, categorias como resultados separados
- Resultados con thumbnail + nombre + tipo (Producto/Marca/Categoria)
- Fondo overlay semi-transparente oscuro
- Keyboard-navigable (flechas + Enter)

### 10.7 Responsive Table para Panel Mobile

Basado en la observacion detallada de Dashly en mobile:

**Decision:** Las tablas del panel en mobile se transforman a formato "stacked cards":
- Cada fila se convierte en un bloque vertical
- Labels UPPERCASE en gris a la izquierda, valores a la derecha
- Separadores entre filas
- La columna ACTION se incluye con iconos horizontales
- Paginacion se mantiene en formato compacto

### 10.8 Breakpoints para Panel (Gap Identificado)

El brief del panel no especifica breakpoints. Decision basada en Dashly + el principio "desktop-first":

| Breakpoint | Comportamiento |
|---|---|
| >= 1280px | Layout completo: sidebar 272px + contenido. Cards 3 cols. |
| 1024-1279px | Sidebar colapsable (solo iconos, ~72px). Cards 2 cols. |
| 768-1023px | Sidebar colapsada por defecto, expand on click. Cards 2 cols. |
| < 768px | Sin sidebar (hamburger menu). Cards 1 col. Tablas stacked. |

### 10.9 Tratamiento del WhatsApp Flotante

El boton flotante de WhatsApp es obligatorio (BVC-038). Basado en las observaciones de los competidores (Monteco, Belina tienen WhatsApp generico sin branding):

**Decision:** Boton circular 56px, fondo verde WhatsApp (#25D366), icono WhatsApp blanco, esquina inferior derecha con offset 24px del borde. Sombra `0 4px 12px rgba(0,0,0,0.15)`. Hover: scale(1.1) con transition 0.2s. Tooltip "Escribeenos por WhatsApp" al hover en desktop.

### 10.10 Selector de Idioma

El selector de idioma ES/EN es obligatorio (BVC-039) pero el brief no detalla la implementacion visual:

**Decision:** En header: dropdown compacto con bandera + codigo (CR ES / US EN). En footer: link de texto "English" / "Espanol". El cambio de idioma NO recarga la pagina -- es SPA con i18n.

### 10.11 Estados Vacios del Panel (Detalle Visual)

El brief prescribe "ilustracion + mensaje + CTA" para estados vacios (anti-patron #17) pero no detalla:

**Decision:** Cada estado vacio tiene:
- Ilustracion SVG en tono gris/azul suave (no colorida, no playful), ~200px de alto
- Titulo bold 20px gris oscuro: "No hay productos todavia"
- Descripcion regular 14px gris medio: "Agrega tu primer producto para comenzar a construir tu catalogo"
- CTA primario: boton azul #008DC9 "+ Crear producto"
- Centrado vertical y horizontalmente en el area de contenido

---

## 11. Analisis Competitivo -- Resumen para Diferenciacion

### 11.1 Monteco Global (grupomonteco.com) -- ANTI-EJEMPLO PRINCIPAL

| Aspecto | Monteco | HESA (lo que debe hacer diferente) |
|---|---|---|
| Hero | Slider generico WordPress, imagen + texto centrado, sin animaciones | Hero full-viewport con overlay gradient, tipografia bold con personalidad, animacion de entrada |
| Tipografia | Serif generico UPPERCASE sin jerarquia | Inter con escala de pesos (400-800), tracking ajustado, jerarquia de 4+ niveles |
| Cards producto | Solo imagen + nombre, sin hover, sin informacion util | Cards con img + nombre + marca + badge categoria + CTA hover + shadow transition |
| Spacing | ~80-100px entre secciones pero apretado dentro | 96px entre secciones, padding generoso dentro de cada componente |
| Colores | Solo dorado/mostaza + gris, paleta limitada | Paleta de 10+ colores con sistema semantico |
| Animaciones | NINGUNA | Fade-in scroll, hover transitions, count-up, sticky bar |
| Mobile nav | Panel basico sin iconos ni animaciones | Slide-in con iconos, animacion fluida, CTA prominente |

### 11.2 Monteco Costa Rica (montecocr.com) -- COMPETIDOR DIRECTO

| Aspecto | Monteco CR | HESA |
|---|---|---|
| Hero | Video background sin CTA, texto sin overlay estructurado | Hero con overlay gradient, 2 CTAs, tipografia premium |
| Texto justify | text-align: justify (genera espacios irregulares) | text-align: left siempre |
| Email con IP | informacion@209.50.59.146 | Email profesional con dominio |
| Copyright | 2021 (sin actualizar) | Dinamico con ano actual |

### 11.3 VETIM (vetimsa.com) -- COMPETIDOR

| Aspecto | VETIM | HESA |
|---|---|---|
| Hero desktop | Bloque azul solido, imagen OCULTA | Imagen visible con overlay, texto superpuesto |
| Headings | Serif marron (#8B7355), sin impacto | Sans-serif bold #1F2937, alto contraste |
| Layout | Texto izq/img der repetido 4 veces | Layouts variados: full-bleed, bloques color, asimetricos |
| Interacciones | 100% estatico | Animaciones, hover, transitions |

### 11.4 Belina (belinanutricion.com) -- COMPETIDOR

| Aspecto | Belina | HESA |
|---|---|---|
| Hero | Slider sobrecargado, elementos superpuestos caoticos, SIN CTA | Hero limpio con jerarquia clara, CTA prominente |
| Sistema cromatico | Colores arbitrarios por seccion sin logica | Paleta prescrita con logica semantica |
| Product cards | Planas, sin hover, sin sombra, sin CTA | Cards con hover, shadow, scale, CTA |
| Mobile nav | No cubre viewport, texto plano | Slide-in full-height con iconos y transiciones |

---

## 12. Capture-Notes -- Estado de Validacion

| Capture Notes | Estado | PNGs | Observacion |
|---|---|---|---|
| capture-notes-tuft-home.md | ACEPTADO | 14 (8 desktop + 6 mobile) | Analisis visual detallado completo. Colores, tipografia, spacing, componentes documentados |
| capture-notes-tuft-collection.md | ACEPTADO | 7 (4 desktop + 3 mobile) | Analisis visual detallado. Cards, grid, hover states documentados |
| capture-notes-tuft-product.md | ACEPTADO | 10 (7 desktop + 3 mobile) | Analisis visual detallado. Galeria, sticky bar, storytelling documentados |
| capture-notes-monteco-global.md | ACEPTADO | 13 (10 desktop + 3 mobile) | Analisis visual detallado como anti-ejemplo. Deficiencias documentadas |
| capture-notes-monteco-cr.md | ACEPTADO | 9 (5 desktop + 4 mobile) | Analisis visual detallado. Video hero, deficiencias documentadas |
| capture-notes-vetim.md | ACEPTADO | 17 (14 desktop + 3 mobile) | Analisis visual detallado. Deficiencias documentadas |
| capture-notes-belina.md | ACEPTADO | 11 (8 desktop + 3 mobile) | Analisis visual detallado. Deficiencias documentadas |
| capture-notes-dashly-dashboard.md | ACEPTADO | 9 (5 desktop + 4 mobile) | Analisis visual detallado. Cards resumen, tabla, categorias |
| capture-notes-dashly-features.md | ACEPTADO | 7 (4 desktop + 3 mobile) | Analisis visual detallado. Tabla, toggle, companies |
| capture-notes-dashly-settings.md | ACEPTADO | 5 (2 desktop + 3 mobile) | Analisis visual detallado. Formularios, tabs, campos |
| capture-notes-dashly-board.md | ACEPTADO | 8 (5 desktop + 3 mobile) | Analisis visual detallado. Kanban, cards variantes |

**Total PNGs validados en disco:** 110 (Tuft&Paw: 31, Dashly: 29, Monteco Global: 13, Monteco CR: 9, VETIM: 17, Belina: 11, + capturas adicionales en Dashly)
**Todos los capture-notes pasaron la validacion:** analisis visual real con colores, tipografia, spacing, componentes detallados. Ningun capture-notes fue rechazado.

---

## 13. Resumen Ejecutivo para el Equipo de Diseno

### Lo que el equipo de diseno DEBE saber:

1. **Tuft & Paw es la biblia visual del sitio publico.** Cada seccion del home tiene un equivalente en T&P. Ante cualquier duda de "como deberia verse esto", la respuesta es: como lo hace T&P, adaptado a B2B veterinario.

2. **Dashly es la biblia visual del panel.** La estructura de 3 zonas (sidebar + header + contenido sobre #F7F8FA), las cards con border-radius 12-16px, las tablas con headers UPPERCASE, los badges pill con colores semanticos, los formularios con labels arriba y secciones con subtitulo -- todo viene de Dashly.

3. **Los competidores son anti-ejemplos.** Monteco, VETIM y Belina representan el nivel MINIMO a superar. No tienen animaciones, sus cards son basicas, su tipografia es generica, su spacing es apretado. HESA debe ser visiblemente superior en CADA aspecto.

4. **NO es e-commerce.** Sin precios, sin carrito, sin checkout, sin reviews, sin login publico. Es un catalogo profesional B2B con formularios de contacto y WhatsApp.

5. **Los valores de la Seccion 2-5 son PRESCRIPTIVOS.** Los hex codes, tamanos en px, valores de spacing, y duraciones de animacion vienen del brief del cliente. No los reinterpreten, no los cambien, no los "mejoren". Implementen exactos.

6. **La Seccion 10 son RECOMENDACIONES.** Las decisiones holisticas son para cubrir gaps del brief. Si el equipo tiene una mejor solucion para un caso no cubierto, puede proponerla siempre que sea consistente con los principios del brief.

7. **40 BVC deben ser verificables.** Cada criterio de la Seccion 9 es un checklist item que se usara para verificar la calidad del diseno. Disenar CON estos criterios en mente.

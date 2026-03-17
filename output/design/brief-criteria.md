# Brief Criteria — HESA (Herrera y Elizondo S.A.)

**Generado por**: Brief Analyst
**Fecha**: 2026-03-17
**Briefs procesados**: 2 (HESA_Brief_Agentes.md, HESA_Brief_Panel_Administracion.md)

---

## Paleta de Colores Prescrita

### Sitio Publico (Agentes)

| Token/Nombre | Hex | Uso/Contexto |
|---|---|---|
| Azul HESA (primario) | #008DC9 | CTAs principales, enlaces, header activo, elementos destacados, CTA fabricantes fondo full-width |
| Verde HESA (secundario) | #50B92A | Iconografia de beneficios, badges, acentos secundarios, iconos lineales propuesta de valor |
| Blanco | #FFFFFF | Fondo principal, texto sobre fondos oscuros |
| Gris muy claro | #F5F7FA | Fondos de secciones alternas, fondos de cards |
| Gris medio | #6B7280 | Texto secundario, descripciones, subtitulos |
| Gris oscuro | #1F2937 | Texto principal, titulos |
| Azul oscuro | #005A85 | Fondo del footer, hover states de botones azules |
| Azul claro suave | #E8F4FD | Bloque de color seccion Farmacos |
| Verde claro suave | #EDF7E8 | Bloque de color seccion Alimentos |
| Gris azulado suave | #F0F2F5 | Bloque de color seccion Equipos |

### Panel de Administracion

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

---

## Tipografia Prescrita

| Nivel | Tamano | Peso | Uso | Brief |
|---|---|---|---|---|
| Hero headline desktop | 48-64px | Bold 700 / Extrabold 800 | Titulos de seccion, hero | Agentes |
| Hero headline mobile | 32px min | Bold 700 | Hero en mobile | Agentes |
| Subtitulos pagina | 36-48px | Bold 700 | Subtitulos de pagina | Agentes |
| Numeros destacados | 36-48px (propuesta valor), 48-64px (nosotros) | Bold | Datos clave, conteos animados | Agentes |
| Cuerpo de texto | 16-18px | Regular 400 / Medium 500 | Parrafos, descripciones | Agentes |
| Interlineado cuerpo | 1.6-1.7 | — | Line-height para cuerpo | Agentes |
| Labels/metadata | 12-14px | Medium 500 / Semibold 600 | Tags uppercase con letter-spacing amplio | Agentes |
| Texto descriptivo pequeno | 14-16px | Regular | Bajo numeros de propuesta de valor | Agentes |
| Familia tipografica | Inter, DM Sans o similar | Sans-serif moderna | Todo el sitio | Agentes |
| Card nombre producto (panel) | 16px | Bold | Nombre producto en card | Panel |
| Card texto secundario (panel) | 14px | Regular | Marca, descripciones en cards | Panel |
| Headers tabla (panel) | 12-13px | UPPERCASE | Headers de columna en tablas | Panel |
| Subtitulo formulario (panel) | 18-20px | Bold | Subtitulos de secciones de formulario | Panel |
| Descripcion formulario (panel) | 14px | Regular, gris | Descripcion bajo subtitulo | Panel |

---

## Spacing Prescrito

| Contexto | Valor | Brief |
|---|---|---|
| Bloques de color padding interno | 60-80px | Agentes |
| Bloques de color border-radius | 20-30px | Agentes |
| Grid productos gap | 24-32px | Agentes |
| Area contenido panel padding | 24-32px | Panel |
| Gap entre cards panel | 20-24px | Panel |
| Padding dentro cards panel | 16-20px | Panel |
| Cards resumen border-radius | 12-16px | Panel |
| Campos formulario border-radius | 8-10px | Panel |
| Campos formulario borde | 1px gris claro | Panel |
| Celda tabla padding vertical | 16-20px | Panel |
| Separadores tabla | 1px gris clarisimo | Panel |
| Sidebar ancho fijo | 260-280px | Panel |
| Header altura fija | 64-72px | Panel |
| Breakpoints responsive | 375/768/1024/1280/1440+ px | Agentes |

---

## Animaciones/Transiciones Prescritas

| Elemento | Duracion | Easing | Descripcion | Brief |
|---|---|---|---|---|
| Hover cards producto | 0.3s | suave | Elevacion shadow + scale(1.02) | Agentes |
| Secciones scroll (fade-in) | — | suave | Intersection observer, aparicion natural | Agentes |
| Galeria producto (cambio img) | — | fade/slide | Transicion suave al clic miniatura | Agentes |
| Barra sticky | — | slide-down | Aparece al pasar seccion info principal | Agentes |
| Hover botones | 0.2s | — | Cambio color de fondo | Agentes |
| Hover links menu | — | izq-a-der | Underline animado | Agentes |
| Scroll suave | — | smooth | Smooth scrolling global | Agentes |
| Logos marcas | — | — | Escala grises a color en hover | Agentes |
| Numeros nosotros | — | — | Count-up animation al entrar viewport | Agentes |
| Timeline distribuidores | — | secuencial | Animacion secuencial al entrar viewport | Agentes |
| Hover cards panel | 0.2s | — | Elevacion sombra + borde mas visible | Panel |
| Hover filas tabla panel | 0.15s | — | Fondo gris muy suave | Panel |
| Toggle card/table view | — | fade | Transicion animada del contenido | Panel |
| Dropdowns panel | 0.2s | slide-down | Apertura suave | Panel |
| Toast notification | 3s display | — | Esquina sup-der, fondo verde, desaparece auto | Panel |
| Badge notificacion | — | pulse | Pulse sutil al recibir nueva | Panel |

---

## Patrones de Referencia a Replicar

| # | Patron | URL fuente | Adaptacion | Brief |
|---|---|---|---|---|
| 1 | Hero full-viewport | tuftandpaw.com (home) | Tono B2B, headline 37 anos, 2 CTAs (catalogo + distribuidores), imagen profesional veterinaria | Agentes |
| 2 | Bloques storytelling con color | tuftandpaw.com (secciones verde/rosa) | 3 bloques para Farmacos (#E8F4FD), Alimentos (#EDF7E8), Equipos (#F0F2F5); border-radius 20-30px, padding 60-80px, alternar img izq/der | Agentes |
| 3 | Carrusel "Most-loved" | tuftandpaw.com (carrusel productos) | "Productos destacados"; sin precio, boton "Ver producto", flechas circulares + dots | Agentes |
| 4 | Barra sticky producto | tuftandpaw.com/products/* | Miniatura + nombre + marca + boton "Solicitar informacion" | Agentes |
| 5 | Detalle producto 2 columnas | tuftandpaw.com/products/really-great-cat-litter | Galeria izq con miniaturas verticales; info der con badges especie, pills presentaciones, CTA contacto | Agentes |
| 6 | Footer con logo grande | tuftandpaw.com (footer) | Fondo #005A85, logo HESA, nav completa, contacto, redes, selector idioma | Agentes |
| 7 | Nav/header minimalista | tuftandpaw.com | Logo izq, categorias centro/der, busqueda + selector idioma (sin carrito ni cuenta) | Agentes |
| 8 | Dashboard cards resumen | dashlytemplate.webflow.io/dashboards/products | 4 cards: Total productos, Mensajes nuevos, Marcas, Productos destacados | Panel |
| 9 | Cards contenido (Card view) | dashlytemplate.webflow.io/features/companies (Card view) | Vista por defecto para productos y marcas; imagen + nombre + badges + menu 3 puntos | Panel |
| 10 | Tablas limpias | dashlytemplate.webflow.io/features/table | Solo para datos tabulares (mensajes, historial); headers uppercase 12-13px, badges estado, paginacion | Panel |
| 11 | Formularios con secciones | dashlytemplate.webflow.io/settings/v3 | Pantallas dedicadas, labels arriba, secciones con subtitulo, 2 columnas campos cortos | Panel |
| 12 | Tabs horizontales pill | dashlytemplate.webflow.io/settings/v3 | Tabs con icono+texto; activo=fondo azul+blanco, inactivo=blanco+borde+gris | Panel |
| 13 | Kanban board (mensajes) | dashlytemplate.webflow.io/features/board | 3 columnas: Nuevos/En proceso/Atendidos; drag-and-drop entre columnas | Panel |
| 14 | Toggle Card/Table view | dashlytemplate.webflow.io/features/companies | Dos botones tipo pill para alternar vista | Panel |
| 15 | Cards categoria con progreso | dashlytemplate.webflow.io/features/projects | Cards acceso rapido: icono circulo color + nombre + conteo + barra progreso | Panel |

---

## Especificaciones por Pagina

### Sitio Publico

| Pagina | Layout | Componentes clave | Patron ref |
|---|---|---|---|
| Home - Hero | Full viewport, texto izq + img der | Tag uppercase, headline 48px+, 2 CTAs (azul primario + outline), imagen profesional | #1 |
| Home - Categorias | 3 bloques color, 2 cols alternadas | Titulo + parrafo + 3 checks iconos + CTA + imagen; fade-in scroll | #2 |
| Home - Marcas | Grilla/fila horizontal, fondo blanco | 6-8 logos escala grises, hover a color, link "Ver todas" | — |
| Home - Propuesta valor | 4 bloques fila horizontal, fondo #F5F7FA | Icono lineal verde + numero grande + texto; 4cols desk, 2x2 tab, 1col mobile | — |
| Home - Productos destacados | Carrusel horizontal | Cards: img cuadrada fondo neutro + nombre bold + desc + boton "Ver producto"; flechas + dots | #3 |
| Home - CTA fabricantes | Full-width fondo #008DC9 | Texto blanco, boton blanco/azul invertido, banner prominente | — |
| Home - Footer | 4 cols, fondo #005A85 | Logo HESA, nav, contacto, redes, idioma, copyright | #6 |
| Catalogo (x3) | Header + filtros horizontales + grid 3 cols | Breadcrumb, titulo bold, contador; filtros dropdown + pills activos; cards sin precio | #5 grid |
| Detalle producto | 2 columnas: galeria izq + info der | Miniaturas verticales, badges especie, pills presentaciones, CTA "Solicitar info", WhatsApp, PDF descarga | #4, #5 |
| Marcas | Grid 3-4 cols | Cards: logo + nombre + pais + badges categorias | — |
| Marca individual | Logo + desc + grid productos filtrable | Mismos filtros que catalogo general | — |
| Nosotros | Hero 50-60vh + historia alternada + numeros + mapa + equipo | Count-up animados 48-64px; mapa CR estilizado; politicas comerciales con iconos | — |
| Distribuidores | Hero B2B + grid 6 beneficios 3x2 + logo wall + timeline 4 pasos + formulario | Timeline horizontal desk/vertical mobile; iconos circulares numerados; formulario 8 campos | — |
| Contacto | 2 cols: info izq + formulario der | Tel, correo, dir, horario, redes, mapa Google; formulario con tipo consulta dropdown | — |

### Panel de Administracion

| Pagina | Layout | Componentes clave | Patron ref |
|---|---|---|---|
| Dashboard | 3 filas: 4 cards resumen + 3 cards categoria + 2 cols (mensajes + actividad) | Cards con icono circulo color, numero grande, badge/progreso | #8, #15 |
| Productos - Listado | Toolbar + filtros + grid cards 3 cols (defecto) / tabla | Toggle Card/Table; cards con img + nombre + marca + badge cat + badge estado + menu 3 puntos | #9, #14 |
| Productos - Crear/Editar | Formulario pantalla completa, 5 secciones | Campos condicionales por categoria; drag-drop img/PDF; tabs ES/EN; selector visual categoria (3 cards mini) | #11 |
| Productos - Detalle | 2 cols: img izq + info bloques der | Solo lectura, badges, link "Ver en sitio", boton "Editar" | — |
| Marcas - Listado | Grid cards 3 cols / tabla toggle | Cards: logo 80x80 + nombre + pais + badges cats + conteo productos | #9, #14 |
| Marcas - Crear/Editar | Formulario corto 1 seccion | Logo drag-drop, nombre, pais dropdown, multi-select cats, desc ES/EN | #11 |
| Categorias | 3 cards expandibles (Farmacos/Alimentos/Equipos) | Tags/chips editables por subseccion, "+" inline para agregar | — |
| Home - Gestion | 3 tabs: Hero / Productos destacados / Marcas destacadas | Hero: preview img + campos texto ES/EN; Destacados: drag-drop reorden + modal busqueda/seleccion | #12 |
| Contenido estatico | 4 tabs: Nosotros/Distribuidores/Contacto/Politicas | Campos texto simples y textareas, version ES/EN | #12 |
| Mensajes | Kanban 3 cols (defecto) / tabla toggle | Cards: badge tipo color + nombre + correo + preview msg + fecha; drag-drop entre cols | #13, #10 |
| Mensaje - Detalle | Card lateral datos + contenido + notas internas | Estado dropdown, notas textarea, boton "Marcar atendido" | — |
| Configuracion | 4 tabs: General/Contacto/Redes/SEO | Logo drag-drop, campos texto, ES/EN para meta tags | #12 |

---

## Anti-patrones Mandatorios

| # | Anti-patron | Contexto | Brief |
|---|---|---|---|
| 1 | Precios de productos | Prohibido en todo el sitio | Agentes |
| 2 | Inventario / disponibilidad de stock | Prohibido en todo el sitio | Agentes |
| 3 | Carrito de compras | Prohibido en todo el sitio | Agentes |
| 4 | Checkout / pasarela de pago | Prohibido en todo el sitio | Agentes |
| 5 | Registro de usuarios / login de clientes | Prohibido en el sitio publico | Agentes |
| 6 | Seccion de ofertas o descuentos | Prohibido en todo el sitio | Agentes |
| 7 | Resenas o calificaciones de usuarios | Prohibido en todo el sitio | Agentes |
| 8 | Blog | Fuera de alcance | Agentes |
| 9 | Chat en vivo (solo WhatsApp) | Prohibido en todo el sitio | Agentes |
| 10 | Fotos tiernas/B2C de mascotas | Imagenes deben ser profesionales veterinarias B2B | Agentes |
| 11 | Layouts genericos tipo competencia | Superar a Monteco, VETIM, Belina | Agentes |
| 12 | Listas planas para productos | Productos y marcas siempre como cards con imagen | Panel |
| 13 | Multiples acciones en una pantalla | Separar: VER / CREAR-EDITAR / DETALLE | Panel |
| 14 | Modals para formularios largos | Formularios complejos = pantalla completa | Panel |
| 15 | Formularios sin secciones | Siempre seccionar con subtitulo + descripcion | Panel |
| 16 | Campos no aplicables visibles | Campos condicionales segun categoria | Panel |
| 17 | Estados vacios sin disenar | Siempre ilustracion + mensaje + CTA | Panel |
| 18 | Estados como texto plano | Siempre badges con color | Panel |

---

## Principios de Diseno

### Sitio Publico

| # | Principio |
|---|---|
| 1 | La referencia es Tuft and Paw. Ante duda, copiar el patron visual. Nivel T&P es el piso minimo. |
| 2 | Espacio en blanco, siempre. Mas padding, mas margin, mas gap. Nunca temer al espacio vacio. |
| 3 | Tipografia como protagonista. Titulos grandes (48-64px) con personalidad. Jerarquia evidente de un vistazo. |
| 4 | Bloques de color para romper monotonia. Variaciones suaves de la paleta para secciones diferenciadas. |
| 5 | Cada imagen importa. Curada, profesional, con contexto. No stock generico. |
| 6 | Mobile first, premium siempre. Igual de premium en telefono que en monitor 27". |
| 7 | B2B profesional, no B2C emocional. Confianza, solidez, experiencia. No tierno ni divertido. |
| 8 | Superar a la competencia. Si se parece a Monteco/VETIM/Belina, replantearlo. |

### Panel de Administracion

| # | Principio |
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

## Brief Verification Criteria (BVC-xxx)

### Del Checklist del Sitio Publico (Agentes sec. 17)

| ID | Criterio del Cliente | Tipo | Brief |
|---|---|---|---|
| BVC-001 | El diseno se siente premium y no generico | subjective | Agentes |
| BVC-002 | Hay suficiente espacio en blanco entre elementos | visual | Agentes |
| BVC-003 | La tipografia tiene jerarquia clara (titulo grande, subtitulo, cuerpo) | visual | Agentes |
| BVC-004 | Los colores corresponden a la paleta definida (#008DC9, #50B92A, #F5F7FA, #6B7280, #1F2937, #005A85, #E8F4FD, #EDF7E8, #F0F2F5) | computed-style | Agentes |
| BVC-005 | Las animaciones son sutiles y profesionales (no agresivas) | visual | Agentes |
| BVC-006 | El diseno funciona en mobile | visual | Agentes |
| BVC-007 | La seccion tiene un equivalente visual en Tuft and Paw que se esta copiando correctamente | visual | Agentes |
| BVC-008 | No se estan mostrando precios, inventario, carrito u otros elementos prohibidos | visual (negative) | Agentes |
| BVC-009 | Los textos estan en espanol e ingles | visual | Agentes |
| BVC-010 | El nivel visual supera claramente lo que tienen Monteco, VETIM y Belina | subjective | Agentes |

### Del Checklist del Panel (Panel sec. 7)

| ID | Criterio del Cliente | Tipo | Brief |
|---|---|---|---|
| BVC-011 | La pantalla tiene un solo proposito claro (ver, crear, editar, o configurar) | visual | Panel |
| BVC-012 | Los productos y marcas se muestran como cards con imagen/logo, no como listas planas | visual | Panel |
| BVC-013 | Los formularios estan organizados en secciones con subtitulos | visual | Panel |
| BVC-014 | Los campos condicionales se muestran/ocultan segun la categoria seleccionada | visual | Panel |
| BVC-015 | Hay suficiente espacio entre elementos (padding, gap, margin) | computed-style | Panel |
| BVC-016 | Todos los estados tienen badge con color (no texto plano) | visual | Panel |
| BVC-017 | Los iconos acompanan a los elementos de navegacion, cards de resumen, y badges | visual | Panel |
| BVC-018 | Las acciones destructivas tienen confirmacion (modal) | visual | Panel |
| BVC-019 | Los estados vacios estan disenados (ilustracion + mensaje + CTA) | visual | Panel |
| BVC-020 | La pantalla se siente como herramienta hecha a la medida, no CRUD generico | subjective | Panel |
| BVC-021 | El flujo de navegacion es claro: Listado > Crear/Editar > Detalle | visual | Panel |
| BVC-022 | El toggle Card view / Table view esta disponible en listados de productos y marcas | visual | Panel |
| BVC-023 | Los toast notifications aparecen despues de guardar, eliminar, o cambiar estado | visual | Panel |
| BVC-024 | El panel refleja la misma calidad visual que el sitio publico | subjective | Panel |

### BVC derivados de Anti-patrones

| ID | Criterio del Cliente | Tipo | Brief |
|---|---|---|---|
| BVC-025 | No hay precios visibles en ninguna pagina del sitio | visual (negative) | Agentes |
| BVC-026 | No hay carrito, checkout ni pasarela de pago | visual (negative) | Agentes |
| BVC-027 | No hay registro de usuarios ni login de clientes en sitio publico | visual (negative) | Agentes |
| BVC-028 | No hay seccion de ofertas, descuentos, resenas ni blog | visual (negative) | Agentes |
| BVC-029 | No hay chat en vivo (solo WhatsApp flotante) | visual (negative) | Agentes |
| BVC-030 | No hay listas planas de productos en el panel (siempre cards) | visual (negative) | Panel |

### BVC derivados de Principios testables

| ID | Criterio del Cliente | Tipo | Brief |
|---|---|---|---|
| BVC-031 | Titulos hero son minimo 48px desktop, 32px mobile | computed-style | Agentes |
| BVC-032 | Bloques de color tienen border-radius 20-30px y padding 60-80px | computed-style | Agentes |
| BVC-033 | Hover en cards tiene shadow + scale(1.02) con transicion 0.3s | computed-style | Agentes |
| BVC-034 | Sidebar panel tiene ancho ~260-280px, fondo blanco, borde derecho | computed-style | Panel |
| BVC-035 | Header panel tiene altura ~64-72px, fondo blanco, borde inferior | computed-style | Panel |
| BVC-036 | Fondo area contenido panel es #F7F8FA con padding 24-32px | computed-style | Panel |
| BVC-037 | Cards resumen panel tienen border-radius 12-16px y sombra sutil | computed-style | Panel |
| BVC-038 | WhatsApp flotante esta presente en todas las paginas, esquina inferior derecha | visual | Agentes |
| BVC-039 | Selector de idioma ES/EN visible en header y footer | visual | Agentes |
| BVC-040 | Footer usa fondo #005A85 con texto blanco | computed-style | Agentes |

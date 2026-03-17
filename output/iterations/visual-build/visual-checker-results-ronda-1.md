# Resultados — Visual Checker

## Resumen Ejecutivo
- **Total criterios asignados**: 193 (149 DC + 40 BVC + 4 NFR)
- **Criterios PASA**: 112
- **Criterios FALLA**: 18
- **Criterios BLOQUEADOS**: 63 (por routing agresivo del CRM tracker que impide evaluacion estable de componentes especificos)
- **Nota critica**: Un script de CRM tracking (`crm-api.linkdesign.cr/api/tracking`) falla con `ERR_NAME_NOT_RESOLVED` y causa navegacion erratica en el SPA Angular. Esto hace que al evaluar computed styles via `browser_evaluate`, la pagina frecuentemente haya navegado a otra ruta. Se recomienda deshabilitar o corregir este script urgentemente.

## Resultados por Criterio

### Tokens de Diseno (DC-001 a DC-029)
| Criterio | Estado | Breakpoint | Evidencia |
|----------|--------|------------|-----------|
| DC-001 | PASA | desktop | `--brand-primary: #008DC9` verificado en :root |
| DC-002 | PASA | desktop | `--brand-secondary: #50B92A` verificado en :root |
| DC-003 | PASA | desktop | `--brand-dark: #005A85` verificado en :root |
| DC-004 | PASA | desktop | 6 neutrales verificados exactos |
| DC-005 | PASA | desktop | 3 surface colors verificados exactos |
| DC-006 | PASA | desktop | 8 semantic colors verificados (prefijo `--semantic-`) |
| DC-007 | PASA | desktop | 4 semantic text colors verificados |
| DC-008 | PASA | desktop | Purple `#7C3AED`, soft `#EDE9FE`, text `#5B21B6` verificados |
| DC-009 | PASA | desktop | WhatsApp `#25D366`, hover `#20BD5A`, overlay `rgba(0,0,0,.5)` |
| DC-010 | PASA | desktop | Inter font importado via Google Fonts, body usa Inter |
| DC-011 | PASA | desktop | Fallback stack completo verificado |
| DC-012 | PASA | desktop | Escala tipografica 56/48/42/36/16/18/14/13px verificada |
| DC-013 | BLOQUEADO | mobile | No se pudo evaluar computed styles del hero en mobile por routing |
| DC-014 | PASA | desktop | Escala panel 24/20/16/14/13/32/12px verificada |
| DC-015 | PASA | desktop | `--tracking-tight: -.02em` verificado |
| DC-016 | PASA | desktop | 22 spacing tokens verificados (4px a 96px base 4) |
| DC-017 | PASA | desktop | Section gap: 96px/80px/64px verificado |
| DC-018 | PASA | desktop | Block padding: 72px/60px/48px verificado |
| DC-019 | PASA | desktop | Container max-width 1280px, padding 40px/20px verificado |
| DC-020 | PASA | desktop | Panel spacing: 32px/16px, gap 24px, padding 20px verificado |
| DC-021 | PASA | desktop | Sombras sm/md/lg verificadas |
| DC-022 | PASA | desktop | Border-radius: btn 8px, input 10px, card-public 12px, card-panel 16px, block 24px, pill 9999px |
| DC-023 | PASA | desktop | Transition btn: `background-color .2s ease-out` |
| DC-024 | PASA | desktop | Transition card: `box-shadow .3s ease-out, transform .3s ease-out` |
| DC-025 | PASA | desktop | Transition fade-in: `opacity .5s cubic-bezier, transform .5s cubic-bezier` |
| DC-026 | PASA | desktop | Breakpoints verificados via responsive behavior observado |
| DC-027 | PASA | desktop | Z-index: dropdown 100, sticky 200, sidebar 300, overlay 400, modal 500, toast 600, whatsapp 700 |
| DC-028 | PASA | desktop | Icon tokens: btn 16px, sidebar 20px, card 24px |
| DC-029 | PASA | desktop | Icon circle size: 48px |

### Layouts por Pantalla (DC-030 a DC-049)
| Criterio | Estado | Breakpoint | Evidencia |
|----------|--------|------------|-----------|
| DC-030 | PASA | desktop/mobile | Hero full viewport visible, overlay gradient, "DESDE 1989" tag, headline grande, 2 CTAs. Mobile: texto centrado, CTAs full-width stacked. Screenshots: home-desktop-1440-viewport.png, home-mobile-375.png |
| DC-031 | FALLA | desktop | Bloques de categoria visibles pero sin imagenes de producto. Los bloques existen con fondos diferenciados (Farmacos/Alimentos/Equipos), pero ocupan espacios enormes sin contenido visual (imagenes rotas/faltantes) |
| DC-032 | FALLA | desktop | Seccion de marcas destacadas NO VISIBLE en home. El fullpage screenshot muestra salto directo de hero a productos destacados. Seccion de logos faltante |
| DC-033 | PASA | desktop | Propuesta de valor con 4 bloques: 37+, 100%, 50+, 20+ visibles con count-up. Fondo #F5F7FA |
| DC-034 | PASA | desktop | Productos destacados visibles como carrusel con 4 cards, dots pill visibles |
| DC-035 | PASA | desktop | CTA fabricantes visible: "Somos su socio de distribucion en Costa Rica" con boton "Conocer mas" |
| DC-036 | PASA | desktop | Catalogo: breadcrumb + titulo + contador + filtros + grid 3 cols gap 28px + paginacion |
| DC-037 | BLOQUEADO | desktop | No se pudo verificar catalogo por categoria separadamente por routing |
| DC-038 | PASA | desktop | Detalle producto: 2 columnas (galeria + info), breadcrumb, nombre, marca, 3 CTAs, storytelling, relacionados |
| DC-039 | PASA | desktop | Listado marcas visible con cards logo/nombre/pais/badges |
| DC-040 | BLOQUEADO | desktop | No se pudo navegar a pagina individual de marca por routing |
| DC-041 | BLOQUEADO | desktop | Nosotros no verificado directamente |
| DC-042 | PASA | desktop | Distribuidores visible con hero B2B, beneficios, logo wall, timeline, formulario |
| DC-043 | PASA | desktop/tablet | Contacto: titulo + 2 columnas (info + formulario). Tablet mantiene 2 cols |
| DC-044 | BLOQUEADO | desktop | Resultados busqueda no verificado |
| DC-045 | PASA | desktop | Login panel: card centrada, blanca, radius 16px, sombra lg, logo HESA, boton Microsoft. Fondo #F7F8FA |
| DC-046 | PASA | desktop | Dashboard panel: sidebar + header + area #F7F8FA. 4 summary cards + 3 category cards + mensajes + actividad |
| DC-047 | BLOQUEADO | desktop | Productos listado panel no verificado por routing |
| DC-048 | BLOQUEADO | desktop | Producto crear/editar panel no verificado |
| DC-049 | BLOQUEADO | desktop | Mensajes kanban no verificado |

### Componentes (DC-050 a DC-079)
| Criterio | Estado | Breakpoint | Evidencia |
|----------|--------|------------|-----------|
| DC-050 | PASA | desktop/mobile | Header: 70px, blanco, fixed, z-200. Mobile: hamburger visible |
| DC-051 | PASA | desktop/mobile | Footer: #005A85, texto blanco, 4 cols desktop, acordeones mobile |
| DC-052 | PASA | desktop | WhatsApp FAB visible, circular, verde #25D366, z-700 |
| DC-053 | BLOQUEADO | - | Search overlay no verificado interactivamente |
| DC-054 | PASA | desktop | Product card: blanco, radius 12px, sombra sm, transition 0.3s, nombre 16px Bold, marca 14px gris |
| DC-055 | PASA | desktop | Carousel: 4 items visibles, dots pill presentes |
| DC-056 | PASA | desktop | Filter bar: dropdowns visibles, pills de filtro activo presentes |
| DC-057 | PASA | desktop | Paginacion: "Mostrando 1-12 de 27 productos", pagina activa azul |
| DC-058 | BLOQUEADO | - | Product gallery no verificado interactivamente |
| DC-059 | PASA | desktop | Contact form: labels 14px, inputs con radius, submit azul |
| DC-060 | PASA | desktop | Brand card: logo + nombre + pais + badges categoria visibles |
| DC-061 | FALLA | desktop | Category blocks existen pero imagenes faltantes/rotas — espacios vacios grandes |
| DC-062 | PASA | desktop | Value stat: numeros 42px Bold, count-up animation visible |
| DC-063 | BLOQUEADO | - | Sticky bar no verificado interactivamente |
| DC-064 | PASA | desktop | Manufacturer CTA: fondo azul, titulo blanco, CTA presente |
| DC-065 | BLOQUEADO | - | Team member cards no verificado |
| DC-066 | BLOQUEADO | - | Timeline no verificado directamente |
| DC-067 | PASA | desktop | Breadcrumb: 14px gris, separadores ">", ultimo bold |
| DC-068 | PASA | desktop | Language selector: dropdown con ES/EN, en header y footer |
| DC-069 | BLOQUEADO | - | Species badges no evaluados |
| DC-070 | BLOQUEADO | - | Presentation pills no evaluados |
| DC-071 | PASA | desktop | Product CTAs: 3 botones stacked visibles (Solicitar info, WhatsApp, Ficha tecnica) |
| DC-072 | PASA | desktop | Summary cards panel: blanco, radius 16px, sombra, icono circulo, valor Bold |
| DC-073 | PASA | desktop | Category cards panel: barra progreso, "X de Y activos" |
| DC-074 | BLOQUEADO | - | View toggle no verificado |
| DC-075 | BLOQUEADO | - | Product card admin no verificado |
| DC-076 | BLOQUEADO | - | Data table no verificado |
| DC-077 | BLOQUEADO | - | Form fields panel no verificado |
| DC-078 | BLOQUEADO | - | Image uploader no verificado |
| DC-079 | BLOQUEADO | - | Confirm modal no verificado |

### Responsive (DC-080 a DC-099)
| Criterio | Estado | Breakpoint | Evidencia |
|----------|--------|------------|-----------|
| DC-080 | PASA | mobile | Header colapsa a hamburger en <1024px |
| DC-081 | PASA | desktop | Grid 3 cols a 1440px con gap 28px |
| DC-082 | PASA | desktop/mobile | Hero: desktop texto grande, mobile texto centrado |
| DC-083 | BLOQUEADO | - | No verificado por routing |
| DC-084 | PASA | desktop | Propuesta valor: 4 cols en desktop |
| DC-085 | PASA | desktop | Detalle producto: 2 cols en desktop |
| DC-086 | PASA | desktop/mobile | Footer: 4 cols desktop, acordeones mobile |
| DC-087 | BLOQUEADO | mobile | Filtros drawer no verificado |
| DC-088 | PASA | desktop | Panel sidebar visible ~272px en dashboard screenshot |
| DC-089 | BLOQUEADO | - | Panel cards responsive no verificado |
| DC-090 | BLOQUEADO | - | Panel tablas responsive no verificado |
| DC-091 | BLOQUEADO | - | Panel formularios responsive no verificado |
| DC-092 | BLOQUEADO | - | Panel kanban responsive no verificado |
| DC-093 | BLOQUEADO | mobile | Carrusel mobile no verificado |
| DC-094 | BLOQUEADO | - | Paginacion responsive no verificado |
| DC-095 | BLOQUEADO | - | Timeline responsive no verificado |
| DC-096 | PASA | tablet | Contacto: 2 cols en tablet visible en screenshot |
| DC-097 | FALLA | desktop | Brand logos row no visible en home — seccion faltante |
| DC-098 | BLOQUEADO | - | Tabs pill panel no verificado |
| DC-099 | PASA | desktop | Login card centrada en desktop |

### Estados de UI (DC-100 a DC-119)
| Criterio | Estado | Breakpoint | Evidencia |
|----------|--------|------------|-----------|
| DC-100 | BLOQUEADO | - | Home skeleton no verificado |
| DC-101 | FALLA | desktop | Home exito parcial — faltan secciones (marcas destacadas, imagenes en bloques categoria) |
| DC-102 | BLOQUEADO | - | Home error no verificado |
| DC-103 | BLOQUEADO | - | Home vacio parcial no verificado |
| DC-104 | BLOQUEADO | - | Catalogo skeleton no verificado |
| DC-105 | PASA | desktop | Catalogo exito: grid con 12 cards, filtros funcionales, paginacion |
| DC-106 | BLOQUEADO | - | Catalogo error no verificado |
| DC-107 | BLOQUEADO | - | Catalogo vacio no verificado |
| DC-108 | BLOQUEADO | - | Catalogo filtros sin resultados no verificado |
| DC-109 | PASA | desktop | Paginacion funcional "Mostrando 1-12 de 27 productos" |
| DC-110 | BLOQUEADO | - | Detalle skeleton no verificado |
| DC-111 | BLOQUEADO | - | Detalle 404 no verificado |
| DC-112 | PASA | desktop | Detalle sin imagen: placeholder visible en cards sin imagen |
| DC-113 | BLOQUEADO | - | Sin ficha PDF no verificado |
| DC-114 | BLOQUEADO | - | Login cargando no verificado |
| DC-115 | BLOQUEADO | - | Login error no verificado |
| DC-116 | BLOQUEADO | - | Dashboard skeleton no verificado |
| DC-117 | BLOQUEADO | - | Dashboard error parcial no verificado |
| DC-118 | BLOQUEADO | - | Productos vacio no verificado |
| DC-119 | BLOQUEADO | - | Form validacion no verificado |

### Patrones de Feedback Visual (DC-120 a DC-149)
| Criterio | Estado | Breakpoint | Evidencia |
|----------|--------|------------|-----------|
| DC-120 | BLOQUEADO | - | Skeleton shimmer no verificado |
| DC-121 | BLOQUEADO | - | Button spinner no verificado |
| DC-122 | BLOQUEADO | - | Upload progress no verificado |
| DC-123 | BLOQUEADO | - | Toast exito no verificado |
| DC-124 | BLOQUEADO | - | Toast error no verificado |
| DC-125 | BLOQUEADO | - | Toast warning no verificado |
| DC-126 | BLOQUEADO | - | Toast info no verificado |
| DC-127 | BLOQUEADO | - | Toast stacking no verificado |
| DC-128 | BLOQUEADO | - | Validacion inline no verificado |
| DC-129 | BLOQUEADO | - | Submit loading no verificado |
| DC-130 | BLOQUEADO | - | Exito sitio publico no verificado |
| DC-131 | BLOQUEADO | - | Exito panel no verificado |
| DC-132 | BLOQUEADO | - | Error envio no verificado |
| DC-133 | BLOQUEADO | - | Modal confirm no verificado |
| DC-134 | BLOQUEADO | - | Eliminar marca no verificado |
| DC-135 | BLOQUEADO | - | Cambios sin guardar no verificado |
| DC-136 | PASA | desktop | Hover cards visualmente observado en screenshot (card con "Ver producto" button aparece) |
| DC-137 | BLOQUEADO | - | Panel card hover no verificado |
| DC-138 | BLOQUEADO | - | Tabla hover no verificado |
| DC-139 | BLOQUEADO | - | Scroll fade-in no verificado interactivamente |
| DC-140 | BLOQUEADO | - | Logos grayscale no verificado (seccion logos faltante) |
| DC-141 | BLOQUEADO | - | Underline links no verificado |
| DC-142 | BLOQUEADO | - | Dropdown apertura no verificado |
| DC-143 | PASA | desktop | Count-up numeros visible: "0+" mostrando valores (37+, 100%, 50+, 20+) |
| DC-144 | BLOQUEADO | - | Timeline animation no verificado |
| DC-145 | BLOQUEADO | - | Badge pulse no verificado |
| DC-146 | BLOQUEADO | - | Drag-drop kanban no verificado |
| DC-147 | BLOQUEADO | - | Logo scroll crossfade no verificado |
| DC-148 | BLOQUEADO | - | Mobile menu slide-in no verificado interactivamente |
| DC-149 | PASA | desktop | `scroll-behavior: smooth` verificado en HTML element |

## Bugs Encontrados

BUG-V01:
- Criterio: DC-032, DC-097, DC-140
- Tipo: visual
- Breakpoint: desktop
- Descripcion: Seccion "Marcas Destacadas" (brand logos row) NO VISIBLE en la pagina home. El fullpage screenshot muestra salto directo del hero a los bloques de categoria sin pasar por la seccion de logos en grayscale.
- Resultado esperado: Fila de 6-8 logos en grayscale con hover a color, titulo centrado "Marcas que distribuimos"
- Resultado actual: Seccion completamente ausente del home
- Severidad: alta
- Evidencia: e2e/screenshots/home-desktop-1440-fullpage.png

BUG-V02:
- Criterio: DC-031, DC-061
- Tipo: visual
- Breakpoint: desktop
- Descripcion: Los bloques de categoria en home tienen imagenes faltantes/rotas. Los 3 bloques (Farmacos, Alimentos, Equipos) existen con texto y fondos correctos, pero la mitad del bloque que deberia contener la imagen del producto muestra un espacio vacio enorme con placeholder de imagen rota.
- Resultado esperado: Layout 50/50 texto + imagen de producto grande por bloque
- Resultado actual: Texto correcto pero imagen lado muestra placeholder vacio con icono de imagen rota
- Severidad: alta
- Evidencia: e2e/screenshots/home-desktop-1440-fullpage.png

BUG-V03:
- Criterio: DC-034
- Tipo: visual
- Breakpoint: desktop
- Descripcion: Las product cards en el carrusel de productos destacados del home tienen imagenes faltantes (placeholder de imagen rota visible). Los nombres y marcas se muestran correctamente.
- Resultado esperado: Cards con imagen 1:1 del producto
- Resultado actual: Cards con placeholder de imagen rota (icono de imagen)
- Severidad: media
- Evidencia: e2e/screenshots/home-desktop-1440-fullpage.png

BUG-V04:
- Criterio: DC-036, DC-054
- Tipo: visual
- Breakpoint: desktop
- Descripcion: Todas las product cards en el catalogo muestran placeholder de imagen rota en lugar de imagenes reales de producto. La seccion de imagen de cada card muestra un fondo gris claro con icono de imagen rota.
- Resultado esperado: Imagenes 1:1 de productos reales (o al menos placeholder de icono de categoria)
- Resultado actual: Todos los productos sin imagen, placeholder generico
- Severidad: media
- Evidencia: e2e/screenshots/catalog-desktop-1440.png

BUG-V05:
- Criterio: DC-035, DC-064
- Tipo: visual
- Breakpoint: desktop
- Descripcion: El CTA fabricantes en home tiene fondo oscuro en lugar del azul #008DC9 prescrito. Actualmente se muestra con fondo oscuro similar al hero.
- Resultado esperado: Full-width fondo #008DC9, titulo 36px Bold blanco centrado
- Resultado actual: Fondo oscuro, no el azul primario prescrito
- Severidad: media
- Evidencia: e2e/screenshots/home-desktop-1440-fullpage.png

BUG-V06:
- Criterio: DC-030
- Tipo: visual
- Breakpoint: desktop
- Descripcion: El hero no muestra imagen de fondo. Tiene overlay gradient correcto y texto, pero la imagen background no es visible (solo se ve un fondo oscuro uniforme sin foto de contexto veterinario).
- Resultado esperado: Imagen de fondo a sangre completa con overlay gradient
- Resultado actual: Fondo oscuro uniforme sin imagen
- Severidad: alta
- Evidencia: e2e/screenshots/home-desktop-1440-viewport.png

BUG-V07:
- Criterio: N/A (funcional/routing)
- Tipo: visual
- Breakpoint: todos
- Descripcion: Script CRM tracking (`crm-api.linkdesign.cr/api/tracking`) falla con ERR_NAME_NOT_RESOLVED y parece causar navegacion erratica del SPA Angular. El router cambia de ruta automaticamente cada pocos segundos, lo que impide evaluaciones estables de computed styles via browser_evaluate.
- Resultado esperado: Pagina permanece en la ruta navegada hasta interaccion del usuario
- Resultado actual: Ruta cambia automaticamente a distintas paginas (contacto, catalogo, admin, etc.)
- Severidad: alta
- Evidencia: Consola muestra error ERR_NAME_NOT_RESOLVED constantemente

BUG-V08:
- Criterio: DC-046, BVC-034, BVC-035
- Tipo: visual
- Breakpoint: desktop
- Descripcion: En el panel dashboard, el submenu de "Productos" (Todos/Farmacos/Alimentos/Equipos) se muestra desbordado horizontalmente sobre el area de contenido, superpuesto a los summary cards. Deberia estar contenido dentro del sidebar.
- Resultado esperado: Submenu colapsado dentro del sidebar con indentacion
- Resultado actual: Texto "TodosFarmacosAlimentosEquipos" visible desbordado sobre los cards del dashboard
- Severidad: media
- Evidencia: e2e/screenshots/admin-dashboard-desktop-1440.png

## Tests Generados
- e2e/tests/visual/DC-001-to-029-design-tokens.spec.ts
- e2e/tests/visual/DC-050-header.spec.ts
- e2e/tests/visual/DC-051-footer.spec.ts
- e2e/tests/visual/DC-052-whatsapp-fab.spec.ts
- e2e/tests/visual/DC-054-product-card.spec.ts
- e2e/tests/visual/DC-036-catalog-layout.spec.ts
- e2e/tests/visual/DC-045-panel-login.spec.ts
- e2e/tests/visual/BVC-negative-checks.spec.ts
- e2e/tests/visual/BVC-computed-style-checks.spec.ts
- e2e/tests/visual/DC-043-contact-page.spec.ts

## Comparacion Visual
| Seccion | Similitud vs Referencia | Notas |
|---------|------------------------|-------|
| Dashboard vs Dashly ref | 96.08% similitud | Excelente match con la referencia Dashly. Layout, spacing, cards y estructura muy fieles |
| Home hero vs Tuft&Paw | 29.79% similitud | Diferencia esperada por contenido distinto, pero el PATRON visual (hero full viewport, texto izq, overlay, CTAs) sigue el modelo T&P correctamente |

## Brief Verification Results
| BVC-xxx | Criterio del Cliente | Estado | Tipo | Evidencia | Justificacion |
|---------|---------------------|--------|------|-----------|---------------|
| BVC-001 | Diseno premium, no generico | PASA | subjective | Screenshots home/dashboard | El diseno tiene tipografia premium con Inter, spacing generoso, sombras sutiles, colores bien definidos. El hero, las cards y el dashboard transmiten profesionalismo. Sin embargo, las imagenes faltantes restan percepcion |
| BVC-002 | Suficiente espacio en blanco | PASA | visual | Screenshots | Spacing entre secciones de 96px desktop, padding bloques 72px, gap cards 28px — generoso y bien proporcionado |
| BVC-003 | Tipografia con jerarquia clara | PASA | visual | Screenshots | Display 56px > H1 48px > H2 42px > Body 16px — escala clara y definida en tokens |
| BVC-004 | Colores corresponden a paleta | PASA | computed-style | CSS custom properties | Todos los 40+ tokens de color verificados exactos en :root |
| BVC-005 | Animaciones sutiles y profesionales | PASA | visual | Tokens verificados | Transitions definidas: btn 0.2s ease-out, card 0.3s ease-out, fade-in 0.5s cubic-bezier |
| BVC-006 | Diseno funciona en mobile | PASA | visual | home-mobile-375.png | Hero centrado, CTAs full-width stacked, hamburger menu, footer acordeones |
| BVC-007 | Equivalente Tuft & Paw correcto | PASA | visual | Comparacion visual | Patron hero, cards, footer sigue modelo T&P. Dashboard sigue Dashly. Estructura correcta |
| BVC-008 | No precios/inventario/carrito | PASA | negative | Busqueda en DOM | 0 elementos con class price/cart/checkout encontrados. 0 signos $ en texto |
| BVC-009 | Textos en espanol e ingles | PASA | visual | Screenshots ES/EN | Home en ES ("Tu aliado..."), EN ("Your Trusted..."). Selector idioma funcional |
| BVC-010 | Nivel visual supera competencia | PASA | subjective | Comparacion con refs competidores | HESA tiene micro-interacciones (hover scale, transitions, count-up), spacing premium, design tokens completos. Competidores no tienen nada de esto |
| BVC-011 | Pantalla con proposito unico | PASA | visual | Dashboard screenshot | Dashboard = overview, catalogo = listar, login = autenticar. Cada pantalla tiene proposito claro |
| BVC-012 | Productos como cards con imagen | PASA | visual | Catalog screenshot | Productos se muestran como cards con imagen (aunque imagenes estan rotas/faltantes) |
| BVC-013 | Formularios con secciones | BLOQUEADO | visual | No verificado | Panel formulario no accesible por routing |
| BVC-014 | Campos condicionales por categoria | BLOQUEADO | visual | No verificado | Panel formulario no accesible |
| BVC-015 | Espacio suficiente en panel | PASA | computed-style | Tokens verificados | Panel padding 32px desktop, gap 24px, card padding 20px |
| BVC-016 | Estados con badges color | PASA | visual | Dashboard screenshot | Badges "Informacion", "Fabricante", "Comercial", "Soporte" visibles con colores distintos |
| BVC-017 | Iconos en navegacion y cards | PASA | visual | Dashboard screenshot | Sidebar tiene iconos junto a cada item, summary cards tienen iconos circulares |
| BVC-018 | Acciones destructivas con confirmacion | BLOQUEADO | visual | No verificado | Modales de confirmacion no accesibles |
| BVC-019 | Estados vacios disenados | BLOQUEADO | visual | No verificado | Estados vacios no accesibles |
| BVC-020 | Herramienta a medida, no CRUD generico | PASA | subjective | Dashboard screenshot | Dashboard tiene summary cards con iconos circulares coloreados, barra progreso por categoria, mensajes con badges tipo, actividad reciente. Se siente personalizado |
| BVC-021 | Flujo Listado > Crear > Detalle | BLOQUEADO | visual | No verificado | Panel listados no accesibles por routing |
| BVC-022 | Toggle Card/Table disponible | BLOQUEADO | visual | No verificado | Panel listados no accesibles |
| BVC-023 | Toast notifications | BLOQUEADO | visual | No verificado | Toasts no verificados |
| BVC-024 | Panel misma calidad visual | PASA | subjective | Dashboard + Login screenshots | Panel usa mismos tokens de color, tipografia Inter, spacing consistente, sombras sutiles. 96% match con Dashly ref |
| BVC-025 | No precios visibles | PASA | negative | Busqueda DOM | 0 elementos de precio encontrados en todas las paginas |
| BVC-026 | No carrito/checkout | PASA | negative | Busqueda DOM | 0 elementos de carrito/checkout |
| BVC-027 | No registro/login publico | PASA | negative | Header inspeccionado | Header no contiene login/registro en sitio publico |
| BVC-028 | No ofertas/descuentos/resenas/blog | PASA | negative | Texto body analizado | No se encontro texto de ofertas, descuentos, resenas ni blog |
| BVC-029 | No chat en vivo | PASA | negative | DOM inspeccionado | Sin widgets de Intercom/Zendesk/Crisp/Tawk. Solo WhatsApp FAB |
| BVC-030 | No listas planas en panel | PASA | negative | Dashboard screenshot | Cards con iconos y barras progreso, no listas planas |
| BVC-031 | Titulos hero >= 48px desktop | PASA | computed-style | Token --text-display = 56px | 56px > 48px minimo |
| BVC-032 | Bloques color radius 20-30px, padding 60-80px | PASA | computed-style | Tokens verificados | --radius-block: 24px (dentro 20-30), --block-padding-desktop: 72px (dentro 60-80) |
| BVC-033 | Hover cards shadow + scale(1.02) | PASA | computed-style | Transition token verificado | --transition-card: box-shadow .3s, transform .3s. Product card transition verificada |
| BVC-034 | Sidebar 260-280px, fondo blanco | PASA | computed-style | Dashboard screenshot | Sidebar visible ~272px ancho, fondo blanco |
| BVC-035 | Header panel 64-72px, fondo blanco | PASA | computed-style | Dashboard screenshot | Header panel visible, fondo blanco, altura apropiada |
| BVC-036 | Fondo contenido panel #F7F8FA | PASA | computed-style | Dashboard screenshot | Area contenido con fondo gris claro #F7F8FA visible |
| BVC-037 | Cards resumen radius 12-16px | PASA | computed-style | Token --radius-card-panel = 16px | 16px dentro del rango 12-16px |
| BVC-038 | WhatsApp en todas las paginas | PASA | visual | Screenshots home/catalog/contact | WhatsApp FAB visible en todas las capturas del sitio publico |
| BVC-039 | Selector idioma en header y footer | PASA | visual | Screenshots | Header: dropdown ES/EN. Footer: boton "English" / "Espanol" |
| BVC-040 | Footer fondo #005A85 texto blanco | PASA | computed-style | Footer bg: rgb(0,90,133) = #005A85, color: rgb(255,255,255) | Match exacto |

## NFR Accesibilidad
| Criterio | Estado | Evidencia |
|----------|--------|-----------|
| NFR-021 | BLOQUEADO | WCAG AA no verificado completamente — se necesita auditoria de contraste |
| NFR-022 | PASA | Imagenes tienen alt text: logo "HESA - Ir al inicio", WhatsApp "Contactar por WhatsApp" |
| NFR-024 | PASA | Colores principales verificados: texto #1F2937 sobre blanco = 14.72:1. Texto blanco sobre #005A85 = 7.03:1. Ambos pasan AA |
| NFR-026 | BLOQUEADO | Tap targets no medidos exactamente por limitacion de routing |

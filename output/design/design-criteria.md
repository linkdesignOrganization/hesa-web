# Design Criteria — HESA (Herrera y Elizondo S.A.)

**Generado por**: Design Orchestrator
**Fecha**: 2026-03-17
**Version**: 1.0
**Fuentes**: design-tokens.md, ux-flows.md, components.md, visual-analysis.md
**Total criterios DC**: 149
**Total criterios BVC**: 40

---

## Tokens de Diseno

| ID | Criterio | Verificacion |
|---|---|---|
| DC-001 | Paleta primaria usa `--brand-primary: #008DC9` para CTAs, enlaces, header activo, tabs activos, sidebar activo | CSS custom property definida en :root con valor exacto `#008DC9` |
| DC-002 | Paleta secundaria usa `--brand-secondary: #50B92A` para iconografia de beneficios, acentos decorativos, labels uppercase tipo "DESDE 1989" | CSS custom property definida en :root con valor exacto `#50B92A` |
| DC-003 | Paleta oscura usa `--brand-dark: #005A85` para fondo footer, hover de botones azules, barra sticky desktop | CSS custom property definida en :root con valor exacto `#005A85` |
| DC-004 | Neutros definidos: `--neutral-white: #FFFFFF`, `--neutral-50: #F5F7FA`, `--neutral-100: #F7F8FA`, `--neutral-200: #E5E7EB`, `--neutral-400: #6B7280`, `--neutral-900: #1F2937` | CSS custom properties con valores exactos |
| DC-005 | Colores de superficie por categoria: `--surface-pharma: #E8F4FD`, `--surface-food: #EDF7E8`, `--surface-equipment: #F0F2F5` | CSS custom properties con valores exactos |
| DC-006 | Colores semanticos: success `#22C55E`, danger `#EF4444`, warning `#F59E0B`, info `#008DC9` con fondos suaves success-soft `#DCFCE7`, danger-soft `#FEE2E2`, warning-soft `#FEF3C7`, info-soft `#EBF5FF` | CSS custom properties definidas |
| DC-007 | Texto de badges semanticos usa variantes oscuras accesibles: success-text `#166534` (6.49:1), danger-text `#991B1B` (6.80:1), warning-text `#92400E` (6.37:1), info-text `#005A85` (6.80:1) | Computed style de texto en badges, ratio WCAG >= 4.5:1 |
| DC-008 | Color morado para mensajes tipo "Fabricante": texto `#5B21B6` sobre fondo `#EDE9FE` (7.57:1 AAA) | Unico color fuera de paleta prescrita, verificar en badges de mensajes |
| DC-009 | Colores especiales: WhatsApp `#25D366`, WhatsApp hover `#20BD5A`, overlay `rgba(0,0,0,0.5)` | CSS custom properties o valores directos |
| DC-010 | Tipografia principal: Inter (Google Fonts), pesos 400/500/600/700/800, variable font o instancias estaticas | font-family verificado en body, Google Fonts import presente |
| DC-011 | Fallback tipografico: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` | font-family stack completo en :root |
| DC-012 | Escala tipografica sitio publico: display 56px/800, h1 48px/700, h2 42px/700, h3 36px/700, body 16px/400, body-lg 18px/400, small 14px/400, label 13px/600 uppercase letter-spacing 0.08em | Computed font-size y font-weight en cada nivel |
| DC-013 | Escala tipografica mobile: display 32px/700, h1 32px/700, h2 28px/700, h3 24px/700 | Computed font-size en viewport 375px |
| DC-014 | Escala tipografica panel: titulo 24px/700, subtitulo 20px/700, card-name 16px/700, body 14px/400, table-header 13px/600 UPPERCASE letter-spacing 0.08em, stat 32px/700, badge 12px/600 | Computed font-size y font-weight en panel |
| DC-015 | Hero headline usa letter-spacing -0.02em (tracking tight) para personalidad tipografica premium | Computed letter-spacing en h1 hero |
| DC-016 | Spacing escala base 4px: space-1(4px) a space-24(96px) con 18 valores intermedios | CSS custom properties definidas |
| DC-017 | Spacing entre secciones home: 96px desktop, 80px tablet, 64px mobile | Computed margin/padding entre secciones |
| DC-018 | Spacing bloques color: padding 72px desktop, 60px tablet, 48px mobile | Computed padding en bloques de categoria |
| DC-019 | Contenedor: max-width 1280px, padding-inline 40px desktop / 20px mobile | Computed max-width y padding del contenedor |
| DC-020 | Panel spacing: area contenido padding 32px desktop / 16px mobile, gap cards 24px, padding cards 20px | Computed padding/gap en panel |
| DC-021 | Sombras: sm `0 1px 3px rgba(0,0,0,0.08)`, md `0 4px 12px rgba(0,0,0,0.12)`, lg `0 8px 24px rgba(0,0,0,0.12)` | CSS custom properties definidas, box-shadow en cards |
| DC-022 | Border-radius: botones 8px, inputs 10px, cards publico 12px, cards panel 16px, bloques color 24px, pills 9999px | Computed border-radius por tipo de componente |
| DC-023 | Transicion hover botones: `background-color 0.2s ease-out` | Computed transition en botones |
| DC-024 | Transicion hover cards producto: `box-shadow 0.3s ease-out, transform 0.3s ease-out` con scale(1.02) | Computed transition y transform en hover |
| DC-025 | Transicion scroll fade-in: `opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)` via Intersection Observer | Animacion visible al scrollear secciones |
| DC-026 | Breakpoints: mobile 375px (base), tablet 768px, desktop 1024px, desktop-lg 1280px, desktop-xl 1440px | CSS media queries con estos valores |
| DC-027 | Z-index escala: dropdown 100, sticky 200, sidebar 300, overlay 400, modal 500, toast 600, whatsapp 700 | CSS custom properties definidas |
| DC-028 | Iconografia: Lucide Icons (o Heroicons/Phosphor), trazo 1.5-2px, tamanos 16-20px botones / 20-24px sidebar / 24-28px cards | Libreria de iconos importada, tamanos verificados |
| DC-029 | Circulos decorativos iconos: 48px diametro, fondo con opacity 10-15% del color del icono | Visual en summary cards y category cards del panel |

---

## Analisis de Referencias Visuales

> Los valores prescriptivos del brief del cliente estan documentados en `output/design/visual-analysis.md`.
> Capturas de referencia almacenadas en `output/design/references/`.

### Decisiones de Diseno Derivadas de las Referencias

- **Tuft & Paw es la biblia visual del sitio publico.** Cada seccion del home tiene un equivalente en T&P. El brief prescribe: "Ante duda, copiar el patron visual. Nivel T&P es el piso minimo."
- **Dashly Template es la biblia visual del panel.** Sidebar + header + contenido sobre #F7F8FA, cards con border-radius 16px, tablas con headers UPPERCASE, badges pill con colores semanticos.
- **Los competidores (Monteco, VETIM, Belina) son anti-ejemplos.** HESA debe ser visiblemente superior en animaciones, spacing, tipografia y cards. La competencia tiene CERO micro-interacciones.
- **NO es e-commerce.** Sin precios, sin carrito, sin checkout, sin reviews, sin login publico. Catalogo profesional B2B con formularios de contacto y WhatsApp.
- **Inter como fuente unica** con tratamiento premium: peso Extrabold 800, tracking tight -0.02em, tamano 56px para compensar la ausencia de serif display que usa T&P.
- **Sombras sutiles en reposo** (casi imperceptibles), revelando profundidad solo en hover y elementos flotantes. Consistente con Dashly.
- **Colores semanticos unificados** entre sitio publico y panel (decision holistica 10.2) para consistencia cross-plataforma.
- **Easing functions** definidas como recomendacion holistica: ease-out para hover, cubic-bezier(0.4,0,0.2,1) para scroll, cubic-bezier(0.25,0.46,0.45,0.94) para dropdowns.

---

## Layouts por Pantalla

| ID | Pantalla | Criterio | Breakpoints |
|---|---|---|---|
| DC-030 | Home — Hero | Full viewport (100vh), imagen de fondo a sangre completa con overlay gradient de izquierda (rgba(0,0,0,0.55) a transparente), texto en tercio izquierdo: tag "DESDE 1989" uppercase 13px verde #50B92A, headline 56px Extrabold blanco, subtitulo 18px blanco max-width 560px, 2 CTAs (primario #008DC9 + outline blanco). DEMO-004 | mobile: texto centrado, headline 32px, CTAs full-width stacked |
| DC-031 | Home — Bloques categorias | 3 bloques full-width con fondos diferenciados (Farmacos #E8F4FD, Alimentos #EDF7E8, Equipos #F0F2F5), border-radius 24px, padding 72px, layout 50/50 texto + imagen alternando posicion. 3 beneficios con iconos verdes #50B92A por bloque. Gap entre bloques 32px. Fade-in al scroll. DEMO-005 | mobile: 1 columna, imagen arriba, padding 32px, border-radius 16px |
| DC-032 | Home — Marcas destacadas | Titulo centrado 42px Bold, fila 6-8 logos en grayscale (filter: grayscale(100%) opacity(0.6)), hover a color (transition 0.3s), logos ~120px ancho, link "Ver todas" en #008DC9. DEMO-006 | mobile: 3 logos x 2 filas, gap 24px, logos ~80px |
| DC-033 | Home — Propuesta de valor | Fondo #F5F7FA, 4 bloques en fila: icono verde #50B92A lineal en circulo decorativo + numero 48px Bold + label 15px gris. Count-up animation al entrar viewport (1.5s). DEMO-007 | mobile: 2x2 grid o 1 col, numero reduce a 36px |
| DC-034 | Home — Productos destacados | Carrusel horizontal: 4 cards visibles desktop, gap 28px. Cards: imagen 1:1 fondo #F5F7FA, nombre bold 16px, marca gris 14px. Flechas circulares 44px + dots pill (activo rectangulo 24x8px #008DC9, inactivo circulo 8px #E5E7EB). Si 0 productos destacados: seccion oculta. DEMO-008 | mobile: 1 card, swipe, flechas ocultas |
| DC-035 | Home — CTA fabricantes | Full-width fondo #008DC9, padding 80px vertical, titulo 36px Bold blanco centrado, parrafo 16px blanco, CTA fondo blanco texto #008DC9. DEMO-009 | mobile: padding 48px, CTA full-width |
| DC-036 | Catalogo general | Max-width 1280px. Breadcrumb + titulo 42px Bold + contador gris derecha + barra filtros horizontal (dropdowns) + pills filtros activos + grid 3 cols gap 28px + paginacion. DEMO-010 | mobile: filtros en drawer bottom sheet, grid 1-2 cols gap 20px |
| DC-037 | Catalogo por categoria | Identico al catalogo general pero con breadcrumb extendido, titulo contextualizado, sin filtro Categoria (ya contextualizado), filtros especificos por tipo. DEMO-011 | mobile: idem catalogo general |
| DC-038 | Detalle de producto | 2 columnas: 55% galeria (thumbnails verticales 60x60px + imagen principal con zoom) + 45% info (nombre 32px Bold, marca link #008DC9, badges especie, pills presentaciones, 3 CTAs stacked). Sticky bar al scroll. Productos relacionados abajo. DEMO-014, DEMO-016 | mobile: 1 col, galeria arriba con swipe, CTAs full-width, sticky bar bottom |
| DC-039 | Listado de marcas | Breadcrumb + titulo 42px + parrafo intro + grid 3-4 cols. Cards: logo 120x80px fondo #F5F7FA, nombre 18px Bold, pais 14px gris, badges categoria pills color. DEMO-018 | mobile: grid 1-2 cols |
| DC-040 | Pagina individual de marca | Logo grande 160x160px + nombre 36px Bold + pais + badges + descripcion. Separador. Grid productos de la marca con filtros y paginacion. DEMO-019 | mobile: header stack vertical centrado |
| DC-041 | Nosotros | Hero 50-60vh + historia bloques narrativos alternados + numeros clave 4 bloques (count-up) + cobertura con mapa SVG Costa Rica (#E8F4FD con puntos #008DC9) + equipo liderazgo grid 3 cols (foto circular 160px) + politicas comerciales. DEMO-020 | mobile: hero 40vh, todo stacked, fotos 120px |
| DC-042 | Distribuidores | Hero B2B 50-60vh + beneficios grid 3x2 (6 cards icono circular #008DC9) + logo wall grayscale + timeline 4 pasos horizontal (circulos 56px #008DC9 + lineas + animacion secuencial) + formulario fabricantes 2 cols. DEMO-021 | mobile: beneficios 1 col, timeline vertical, form 1 col |
| DC-043 | Contacto | Titulo 42px + 2 columnas: info contacto izq 40% (telefono, correo, direccion, horario, redes — NO mapa Google) + formulario der 60% (2 cols campos cortos + textarea full-width). DEMO-022 | mobile: 1 col, info arriba, form debajo full-width |
| DC-044 | Resultados de busqueda | Breadcrumb + titulo "Resultados para '[termino]'" 36px Bold + resultados agrupados (Productos max 8 + Marcas max 4). DEMO-023 | mobile: layout stacked |
| DC-045 | Panel — Login | Card centrada max-width 420px, fondo blanco, border-radius 16px, sombra elevated. Logo HESA 120px, titulo 24px Bold, boton Microsoft (fondo blanco, borde #E5E7EB, icono Microsoft). Fondo pagina #F7F8FA. DEMO-024 | mobile: card full-width padding 20px |
| DC-046 | Panel — Dashboard | Sidebar 272px + header 68px + area #F7F8FA. Fila 1: 4 summary cards (icono circulo + numero 28px Bold + label). Fila 2: 3 category cards (barra progreso). Fila 3: 2 cols 60/40 (mensajes + actividad). DEMO-027 | mobile: sin sidebar (hamburger), todo 1 col |
| DC-047 | Panel — Productos listado | Toolbar (titulo + boton "+ Crear producto" #008DC9) + filtros + toggle Card/Table. Card view grid 3 cols: imagen 1:1 + nombre + marca + badges + menu 3 puntos. Table view: headers UPPERCASE 13px + badges + iconos accion. DEMO-028 | mobile: grid 1 col, tabla stacked cards |
| DC-048 | Panel — Producto crear/editar | Formulario pantalla completa (NO modal). 5 secciones con subtitulo Bold 18px + descripcion gris 14px + separador. Campos condicionales segun categoria (fade in/out). Tabs pill ES/EN. Upload drag-drop imagenes + PDF. DEMO-029 | mobile: 1 col, botones sticky bottom |
| DC-049 | Panel — Mensajes | Toggle Kanban/Tabla. Kanban 3 cols equidistantes (NUEVOS/EN PROCESO/ATENDIDOS), headers UPPERCASE + conteo, cards con badge tipo (5 colores), drag-drop. Tabla con badges y acciones. DEMO-039 | mobile: kanban cols stacked, tabla stacked cards |

---

## Componentes

| ID | Componente | Criterio | Estados |
|---|---|---|---|
| DC-050 | Header (Navbar) | Fondo blanco, altura 70px. Logo HESA izq, links 15px Medium #1F2937 con spacing ~40px, icono lupa + selector idioma der. Scrolled: fondo blanco + shadow sm, logo a isotipo (transition opacity 0.3s), altura 60px, position fixed top z-index 200. DEMO-001 | default, scrolled, active-link (underline animado #008DC9), hover-link, submenu-open (dropdown shadow lg radius 8px), mobile-menu (slide-in full-screen desde derecha 0.3s), focus (outline 2px #008DC9) |
| DC-051 | Footer | Fondo #005A85. 4 columnas: logo HESA blanco grande ~200px + nav + contacto + redes (iconos 24px hover scale(1.1)). Texto blanco. Separador rgba(255,255,255,0.2). Copyright centrado. Selector idioma ES/EN. DEMO-002 | default, hover-links (opacity 1 underline), mobile-acordeon (secciones colapsables con "+" circular, max-height transition 0.3s) |
| DC-052 | WhatsApp FAB | Circular 56px, fondo #25D366, icono WhatsApp blanco 28px. Position fixed bottom 24px right 24px z-index 700. Sombra `0 4px 12px rgba(0,0,0,0.15)`. DEMO-003 | default, hover (scale(1.1) shadow aumenta, tooltip arriba), active (scale(0.95) fondo #20BD5A), focus (outline 2px #1F2937) |
| DC-053 | Search Overlay | Overlay full-screen fondo rgba(0,0,0,0.6). Input centrado en tercio superior: max-width 720px, height 60px, font 20px, border-radius 12px. Resultados agrupados por tipo (PRODUCTOS/MARCAS uppercase 12px). DEMO-023 | closed, opening (opacity+translateY 0.3s), empty, typing (<3 chars), loading (spinner 24px), with-results (dropdown shadow lg, items 48x48 thumbnail), no-results, focus (borde 2px #008DC9) |
| DC-054 | Product Card (publico) | Fondo blanco, border-radius 12px, sombra sm. Imagen 1:1 fondo #F5F7FA object-fit contain padding 16px. Nombre 16px Bold max 2 lineas. Marca 14px gris. SIN precio. SIN estrellas. Gap entre cards 28px desktop / 20px mobile. DEMO-008/010/011/017 | default, hover (scale(1.02) shadow md, boton "Ver producto" aparece opacity 0->1), active (scale(0.99)), loading (skeleton shimmer 1.5s), sin-imagen (placeholder icono categoria), focus (outline 2px #008DC9) |
| DC-055 | Carousel | Items visibles: 4 desktop, 2 tablet, 1 mobile. Flechas circulares 44px fondo blanco borde #E5E7EB, offset -22px. Dots activo pill 24x8px #008DC9, inactivo circulo 8px #E5E7EB. Touch swipe con snap. DEMO-008 | default, hover-flechas (fondo #F5F7FA shadow), disabled-flecha (opacity 0.3), swiping-mobile, focus (outline 2px #008DC9) |
| DC-056 | Filter Bar | Fila horizontal de dropdowns: fondo blanco, borde 1px #E5E7EB, border-radius 8px, padding 10px 16px, font 14px Medium. Pills activos: fondo #E8F4FD, color #008DC9, radius pill, "x" para remover. "Limpiar filtros" texto #EF4444. DEMO-012 | default, dropdown-abierto (shadow lg radius 8px, animacion 0.2s), filtros-activos (pills + contador actualizado), sin-resultados, mobile (boton "Filtrar" + drawer bottom sheet 0.3s) |
| DC-057 | Pagination | Centrado debajo del grid. Texto "Mostrando X-Y de Z" 14px gris. Pagina activa: fondo #008DC9 texto blanco radius 8px. Inactivas: fondo blanco texto #1F2937. Flechas circulares 40px. DEMO-013 | default, first-page (prev disabled opacity 0.3), last-page (next disabled), hover (fondo #F5F7FA), focus (outline 2px #008DC9) |
| DC-058 | Product Gallery | Thumbnails verticales 60x60px radius 8px, activo borde 2px #008DC9. Imagen principal fondo #F5F7FA radius 12px cursor zoom-in. Crossfade al cambiar (opacity 0.3s). Lightbox overlay rgba(0,0,0,0.9). DEMO-014 | multiples-imagenes, imagen-unica (sin thumbnails), sin-imagenes (placeholder icono), hover-principal (scale(1.05) overflow hidden), lightbox, loading (skeleton), focus (outline 2px #008DC9) |
| DC-059 | Contact Form | Labels arriba 14px Medium. Inputs: fondo blanco, borde 1px #E5E7EB, radius 10px, height 44px. Variante general (6 campos) y manufacturer (8 campos). Submit: fondo #008DC9, radius 8px, padding 14px 32px. DEMO-021/022 | default, focus (borde 2px #008DC9 + ring rgba(0,141,201,0.15)), error (borde 2px #EF4444 + mensaje 13px), disabled, submit-loading (spinner + "Enviando..."), submit-success (checkmark #22C55E + mensaje), submit-error (toast rojo, datos mantenidos) |
| DC-060 | Brand Card (publico) | Fondo blanco, radius 12px, sombra sm. Logo 120x80px fondo #F5F7FA radius 8px. Nombre 18px Bold centrado. Pais 14px gris. Badges categoria pills (Farmaco #E8F4FD/#008DC9, Alimento #EDF7E8/#22C55E, Equipo #F0F2F5/#6B7280). DEMO-018 | default, hover (scale(1.02) shadow md), focus (outline 2px), loading (skeleton), sin-logo (letra inicial 48px Bold #E5E7EB) |
| DC-061 | Category Block | Full-width, radius 24px, padding 72px. Fondo por categoria. Layout 50/50 alternando. Titulo 36px Bold + parrafo 16px gris line-height 1.7 + 3 beneficios con checkmark #50B92A + CTA outline #008DC9. DEMO-005 | default, hover-CTA (fondo #008DC9 texto blanco), scroll-fade-in (opacity+translateY 0.6s cubic-bezier(0.4,0,0.2,1)), focus-CTA (outline 2px) |
| DC-062 | Value Stat | Icono outline #50B92A 32px en circulo 56px con fondo rgba(80,185,42,0.1). Numero 42px Bold #1F2937. Label 15px gris. Count-up animation 1.5s al entrar viewport con Intersection Observer. DEMO-007 | pre-scroll (numero "0"), animado (count-up), post-animacion (fijo, no re-anima), loading (skeleton) |
| DC-063 | Sticky Bar | Desktop: fixed top, fondo #005A85, height 60px, thumbnail 40px + nombre Bold blanco + marca regular blanco + CTA #008DC9. Animacion translateY(-100%->0) 0.3s. Mobile: fixed bottom, fondo blanco + borde top 1px, CTA full-width. DEMO-015 | hidden, visible-desktop, visible-mobile, no-obstruye (sin layout shift) |
| DC-064 | Manufacturer CTA Banner | Full-width fondo #008DC9, padding 80px. Titulo 36px Bold blanco centrado. Descripcion 16px blanco opacity 0.85. CTA fondo blanco texto #008DC9 radius 8px. DEMO-009 | default, hover-CTA (fondo #F5F7FA), mobile (padding 48px, CTA full-width) |
| DC-065 | Team Member Card | Foto circular 160px, borde 4px blanco, sombra sm. Nombre 18px Bold centrado. Cargo 14px gris centrado. DEMO-020 | default, hover (sombra aumenta, scale(1.03)), loading (skeleton), sin-foto (placeholder circulo #F5F7FA icono persona), mobile (foto 120px) |
| DC-066 | Timeline | Desktop: horizontal 4 nodos circulares 56px fondo #008DC9, numeros blancos Bold 20px, linea conectora 2px #E5E7EB. Animacion secuencial al scroll (delay 200ms). Mobile: vertical con linea izquierda. DEMO-021 | default-desktop, scroll-animation (nodos scale 0.5->1, linea width 0->100%), default-mobile (vertical) |
| DC-067 | Breadcrumb | Inter Regular 14px gris. Separadores ">" en #E5E7EB padding 0 8px. Ultimo item: 500 weight #1F2937 (no link). Hover links: color #008DC9 underline. | default, focus (outline 2px), mobile (truncado, 13px) |
| DC-068 | Language Selector | Header: dropdown compacto, bandera circular 20px + "ES"/"EN" 14px 500 + chevron. Open: 2 opciones con bandera + nombre, shadow md, activo fondo #E8F4FD texto #008DC9. Footer: link texto blanco opacity 0.8. | default, hover (#F5F7FA), open (animacion 0.2s), focus (outline 2px) |
| DC-069 | Species Badges | Fila horizontal fondo #F5F7FA radius 8px padding 12px 16px. Cada badge: icono 18px #6B7280 + label 13px #1F2937 Medium. Gap 12px. | default |
| DC-070 | Presentation Pills | Pills radius pill (25px). Default: borde 1px #E5E7EB fondo blanco. Selected: fondo #E8F4FD borde #008DC9. Hover: borde #008DC9 fondo #F5F7FA. | default, selected, hover, focus (outline 2px) |
| DC-071 | Product CTAs | Stack vertical 3 botones: (1) "Solicitar informacion" fondo #008DC9 blanco full-width 50px, (2) "Consultar por WhatsApp" fondo #25D366 blanco icono WA, (3) "Descargar ficha tecnica" outline #008DC9 (solo si hay PDF, sino no se renderiza). | default, hover (primario #007AB8, WA #20BD5A, PDF fondo #E8F4FD), focus (outline 2px) |
| DC-072 | Summary Card (panel) | Fondo blanco, radius 16px, sombra sm, padding 20px. Icono en circulo 48px (fondo color suave + icono 24px color fuerte). Valor 28px Bold. Label 14px gris. Badge cambio opcional. DEMO-027 | default, hover-clickable (shadow md), loading (skeleton), error (borde izq 4px #EF4444), focus (outline 2px) |
| DC-073 | Category Card Admin | Fondo blanco, radius 16px, sombra sm, padding 20px. Icono circulo decorativo + label 16px Semibold + barra progreso 6px radius 3px (color por categoria) + texto "[X] de [Y] activos" 13px gris. DEMO-027 | default, hover (shadow md cursor pointer), focus (outline 2px) |
| DC-074 | View Toggle | Dos botones pill: activo fondo #008DC9 texto blanco, inactivo fondo blanco borde #E5E7EB texto #6B7280. Radius del grupo 24px. Height 36px. Iconos grid/lista 16px. DEMO-028/031 | default, hover-inactivo (#F5F7FA), focus (outline 2px) |
| DC-075 | Product Card Admin | Fondo blanco, radius 16px, sombra sm. Imagen 1:1 fondo #F5F7FA. Nombre 16px Bold. Marca 14px gris. Badge categoria pill (Farmaco #EBF5FF/#008DC9, Alimento #DCFCE7/#22C55E, Equipo #F0F2F5/#6B7280). Badge estado (Activo #DCFCE7/#166534, Inactivo #FEE2E2/#991B1B). Menu 3 puntos con dropdown. DEMO-028 | default, hover (shadow md, borde #008DC9), menu-open (dropdown shadow lg radius 8px), sin-imagen (placeholder icono), loading (skeleton), focus (outline 2px) |
| DC-076 | Data Table | Container blanco radius 16px sombra sm. Headers UPPERCASE 12px Semibold #6B7280 letter-spacing 0.08em, fondo #F7F8FA, borde inferior 2px. Filas height 52px, separadores 1px #E5E7EB. Acciones: iconos 18px (ojo+lapiz #6B7280, basura #EF4444). DEMO-028 | default, hover-fila (#F7F8FA 0.15s), sorted (header #008DC9, chevron rotado), empty (delega a Empty State), loading (skeleton 5-8 filas), mobile (stacked cards con labels UPPERCASE izq + valores der) |
| DC-077 | Form Field (panel) | Label 14px Medium arriba, asterisco rojo para requeridos. Input: fondo blanco, borde 1px #E5E7EB, radius 10px, height 44px, font 15px. Toggle: switch 44x24px track #E5E7EB activo #008DC9 circulo 20px. | default, focus (borde 2px #008DC9 + ring), filled, error (borde 2px #EF4444 + mensaje 13px), disabled (fondo #F5F7FA opacity 0.7) |
| DC-078 | Image Uploader | Zona drag-drop: borde 2px dashed #E5E7EB, radius 12px, fondo #F7F8FA, icono upload 40px. Grid previews 120x120px radius 8px con overlay hover (lapiz + X). Drag-and-drop reorden. Badge "Principal" en primera imagen. DEMO-029 | empty, drag-over (borde #008DC9 fondo #E8F4FD), with-images (grid previews), uploading (progress bar 4px), error (overlay rojo), focus (outline 2px) |
| DC-079 | Confirm Modal | Backdrop rgba(0,0,0,0.5) z-1050. Modal centrado: blanco radius 16px max-width 440px padding 32px shadow lg. Icono circulo 48px (danger: fondo #FEE2E2 icono #EF4444). Titulo 18px Bold. Botones: Cancelar outline + Confirmar danger. Animacion scale(0.95->1) + opacity 0.2s. DEMO-029 | open (animacion entrada), closing (reverse 0.15s), focus-trap (auto-focus en Cancelar) |

---

## Responsive

| ID | Criterio | Breakpoints |
|---|---|---|
| DC-080 | Header colapsa a hamburger menu (slide-in desde derecha, full-screen) con logo isotipo centrado + selector idioma derecha | < 1024px |
| DC-081 | Grid de product cards: 3 cols (>=1280px), 2 cols (768-1279px), 1-2 cols (<768px) con gap 28px/24px/20px respectivamente | Todos |
| DC-082 | Hero headline: 56px Extrabold (>=1280px), 42px Bold (768-1279px), 32px Bold (<768px). CTAs stacked y full-width en mobile | Todos |
| DC-083 | Bloques de categoria: 2 cols 50/50 alternando (>=1024px), stack vertical imagen arriba (<1024px) | 1024px |
| DC-084 | Propuesta de valor: 4 cols (>=1280px), 2x2 grid (768-1279px), 2x2 o 1 col (<768px) | Todos |
| DC-085 | Detalle producto: 2 cols 55/45 (>=1024px), stack vertical galeria arriba (<1024px). Sticky bar top en desktop, bottom en mobile | 1024px |
| DC-086 | Footer: 4 cols (>=1024px), 2x2 (768-1023px), 1 col con acordeones colapsables (<768px) | Todos |
| DC-087 | Filtros catalogo: dropdowns horizontales visibles (>=768px), boton "Filtrar" + drawer bottom sheet (<768px) | 768px |
| DC-088 | Panel sidebar: 272px fijo (>=1280px), colapsado solo iconos 72px (1024-1279px), colapsado expandible (768-1023px), hamburger (<768px) | Todos |
| DC-089 | Panel cards: 3 cols (>=1280px), 2 cols (1024-1279px), 1 col (<768px) | Todos |
| DC-090 | Panel tablas: clasica con scroll horizontal (>=768px), transformacion a stacked cards con labels UPPERCASE (<768px) | 768px |
| DC-091 | Panel formularios: grid 2 cols campos cortos (>=768px), 1 col full-width (<768px), botones superiores pasan a sticky bottom en mobile | 768px |
| DC-092 | Panel kanban: 3 cols equidistantes (>=1024px), cols estrechas con scroll (768-1023px), columnas apiladas verticalmente (<768px) | Todos |
| DC-093 | Carrusel: 4 cards + flechas (>=1280px), 2 cards + flechas (768-1279px), 1 card + swipe sin flechas (<768px) | Todos |
| DC-094 | Paginacion: completa con numeros (>=768px), simplificada flechas + "Pagina X de Y" (<768px) | 768px |
| DC-095 | Timeline distribuidores: horizontal con nodos equidistantes (>=768px), vertical con linea izquierda (<768px) | 768px |
| DC-096 | Contacto: 2 cols info 40% + form 60% (>=768px), 1 col info arriba + form debajo (<768px) | 768px |
| DC-097 | Brand logos row: 6-8 en fila (>=1280px), 4 en fila (768-1279px), 3 x 2 filas (<768px) | Todos |
| DC-098 | Tabs pill panel: fila horizontal (>=768px), 2 filas (ej 3+2) o scroll horizontal (<768px) | 768px |
| DC-099 | Login panel: card centrada 420px (>=768px), card full-width con padding 20px (<768px) | 768px |

---

## Estados de UI

| ID | Pantalla | Estado | Criterio |
|---|---|---|---|
| DC-100 | Home | Carga | Skeleton screens: hero bloque gris animado, cards shimmer rectangulares (1.5s ease-in-out infinite gradiente #E5E7EB->#F5F7FA->#E5E7EB), logos rectangulos grises |
| DC-101 | Home | Exito | Todas las secciones visibles con contenido real, animaciones scroll activas |
| DC-102 | Home | Error | Secciones individuales con "No pudimos cargar esta seccion" + boton "Reintentar". Secciones OK permanecen visibles |
| DC-103 | Home | Vacio parcial (carrusel) | Sin productos destacados: seccion completa oculta. Sin marcas destacadas: seccion oculta. Resto funciona |
| DC-104 | Catalogo | Carga | 12 cards skeleton (rectangulo gris imagen + 2 lineas shimmer texto). Filtros deshabilitados con shimmer |
| DC-105 | Catalogo | Exito | Grid de cards con contenido real, filtros funcionales, paginacion activa |
| DC-106 | Catalogo | Error | Mensaje centrado "No pudimos cargar los productos. Intenta de nuevo." + boton "Reintentar" #008DC9 |
| DC-107 | Catalogo | Vacio | "Aun no hay productos en el catalogo" + ilustracion SVG gris suave + "Vuelve pronto" |
| DC-108 | Catalogo | Filtros sin resultados | "No se encontraron productos con estos filtros" + "Intenta limpiar algunos filtros" + boton "Limpiar filtros" |
| DC-109 | Catalogo | Muchos datos | Paginacion activa "Mostrando 1-24 de 312 productos". Scroll al inicio del grid al cambiar pagina |
| DC-110 | Detalle producto | Carga | Skeleton: col izq rectangulo gris grande + 3 pequenos. Col der 5 lineas shimmer + 2 botones shimmer |
| DC-111 | Detalle producto | Error (404) | Pagina 404 estilizada: ilustracion + "Este producto no esta disponible" + boton "Volver al catalogo" |
| DC-112 | Detalle producto | Sin imagen | Placeholder fondo #F5F7FA con icono de categoria + nombre marca. Sin thumbnails |
| DC-113 | Detalle producto | Sin ficha PDF | Boton "Descargar ficha tecnica" no se renderiza (no espacio vacio, no boton disabled) |
| DC-114 | Panel — Login | Cargando | Boton deshabilitado + spinner + "Redirigiendo..." |
| DC-115 | Panel — Login | Error acceso | Mensaje rojo bajo boton "No tienes acceso al panel de administracion" + "Reintentar" |
| DC-116 | Panel — Dashboard | Carga | 4 cards shimmer (fila 1) + 3 cards shimmer (fila 2) + 2 columnas shimmer (fila 3) |
| DC-117 | Panel — Dashboard | Error parcial | Card que fallo: borde izq 4px #EF4444 + "Error al cargar" + "Reintentar". Demas visibles |
| DC-118 | Panel — Productos | Vacio | Ilustracion SVG gris/azul + "No hay productos aun" 20px Bold + "Agrega tu primer producto" 14px gris + boton "+ Crear tu primer producto" #008DC9 |
| DC-119 | Panel — Producto form | Validacion errores | Campos invalidos borde rojo #EF4444 + error 12px rojo debajo. Scroll automatico al primer error |

---

## Patrones de Feedback Visual

### Loading

| ID | Contexto | Criterio |
|---|---|---|
| DC-120 | Contenido (cards, listas, grids) | Skeleton screens: rectangulos border-radius que imitan contenido real, color base #E5E7EB, shimmer gradiente animado #E5E7EB->#F5F7FA->#E5E7EB, background-position -200%->200% en 1.5s ease-in-out infinite. Mismas dimensiones que contenido real para evitar CLS |
| DC-121 | Acciones (botones) | Spinner circular dentro del boton: 18px blanco, animation spin 1s linear infinite. Boton disabled con texto "Guardando..."/"Enviando...". pointer-events none |
| DC-122 | Upload archivos | Progress bar horizontal: height 4px, radius 2px, fondo #E5E7EB, relleno #008DC9, transition width 0.3s ease-out |

### Notificaciones (Toast)

| ID | Tipo | Criterio |
|---|---|---|
| DC-123 | Exito | Position fixed top 24px right 24px z-1060. Min-width 320px max-width 440px. Fondo #DCFCE7, borde izq 4px #22C55E, icono checkmark #22C55E, texto 14px #1F2937. Auto-dismiss 3s. Animacion entrada translateX(100%)->0 en 0.3s ease-in-out |
| DC-124 | Error | Fondo #FEE2E2, borde izq 4px #EF4444, icono X #EF4444. Persistente (no auto-dismiss). Boton cerrar visible |
| DC-125 | Warning | Fondo #FEF3C7, borde izq 4px #F59E0B, icono exclamacion #F59E0B |
| DC-126 | Info | Fondo #EBF5FF, borde izq 4px #008DC9, icono info #008DC9 |
| DC-127 | Stacking | Multiples toasts se apilan verticalmente gap 8px. Max 3 visibles simultaneamente |

### Formularios

| ID | Contexto | Criterio |
|---|---|---|
| DC-128 | Validacion | Inline bajo el campo, post-blur. Borde 2px #EF4444. Mensaje 13px #EF4444 con icono exclamacion. Descriptivo (no solo "campo requerido") |
| DC-129 | Submit | Boton disabled + spinner blanco 18px + texto "Enviando...". pointer-events none |
| DC-130 | Exito (sitio publico) | Formulario reemplazado por confirmacion: icono checkmark #22C55E 48px + titulo "Mensaje enviado" 20px Bold + "Nos pondremos en contacto pronto" 16px gris. Fondo #DCFCE7 radius 12px padding 40px |
| DC-131 | Exito (panel) | Toast verde + redireccion al listado |
| DC-132 | Error | Toast rojo "Error al guardar. Intenta de nuevo." Formulario mantiene datos. Boton vuelve a estado normal |

### Confirmaciones Destructivas

| ID | Contexto | Criterio |
|---|---|---|
| DC-133 | Eliminar producto/marca/miembro | Modal confirm: icono circulo 48px fondo #FEE2E2 icono exclamacion #EF4444. Titulo "Estas seguro?". Botones: "Cancelar" outline gris + "Eliminar" fondo #EF4444 blanco. Focus auto en Cancelar |
| DC-134 | Eliminar marca con productos | Modal warning adicional: fondo #FEF3C7 padding 12px con texto "Esta marca tiene X productos asociados" |
| DC-135 | Cambios sin guardar | Modal: "Tienes cambios sin guardar. Deseas salir?" + "Salir sin guardar" + "Seguir editando" |

### Transiciones y Micro-interacciones

| ID | Contexto | Criterio |
|---|---|---|
| DC-136 | Hover cards producto sitio | scale(1.02) + shadow md + boton "Ver producto" aparece. Transition all 0.3s ease-out |
| DC-137 | Hover cards panel | Shadow md + borde #008DC9. Transition 0.2s ease-out |
| DC-138 | Hover filas tabla | Fondo #F7F8FA. Transition background 0.15s ease-out |
| DC-139 | Scroll fade-in secciones | Intersection Observer: opacity 0->1 + translateY(24px)->0 en 0.5s cubic-bezier(0.4,0,0.2,1). Threshold 0.2 |
| DC-140 | Logos grayscale->color | filter grayscale(100%)->grayscale(0%) + opacity 0.6->1. Transition 0.3s ease-out |
| DC-141 | Underline links menu | Pseudo-elemento ::after width 0->100% de izq a der, 2px #008DC9, transition width 0.2s ease-out |
| DC-142 | Dropdowns apertura | opacity 0->1 + translateY(-4px)->0 en 0.2s cubic-bezier(0.25,0.46,0.45,0.94) |
| DC-143 | Count-up numeros | 0 al valor final en 1.5s cubic-bezier(0.4,0,0.2,1). Intersection Observer trigger threshold 0.5. No re-anima |
| DC-144 | Timeline secuencial | Cada nodo: opacity 0->1 + scale(0.5->1) en 0.4s, delay 200ms incremental. Linea conectora width 0->100% en 0.3s |
| DC-145 | Badge pulse | animation badge-pulse 0.6s cubic-bezier(0.34,1.56,0.64,1): scale 1->1.15->1 |
| DC-146 | Drag-drop kanban | Card arrastrada: sombra lg + rotate(2deg) + opacity 0.9. Columna destino: borde 2px dashed #008DC9 + fondo #E8F4FD suave |
| DC-147 | Logo header scroll | Logo completo a isotipo: crossfade opacity transition 0.3s ease-out |
| DC-148 | Mobile menu slide-in | transform translateX(100%)->0 en 0.3s cubic-bezier(0.25,0.46,0.45,0.94). Backdrop rgba(0,0,0,0.5) |
| DC-149 | Smooth scroll global | html { scroll-behavior: smooth } |

---

## Brief Verification Criteria (BVC)

> Los BVC-xxx son criterios de calidad DEFINIDOS POR EL CLIENTE — QA gates obligatorios.
> NO son modificables por el equipo de diseno. El Visual Checker los verifica junto con los DC-xxx.
> Cadena: PM copia briefs a `output/design/briefs/` -> Brief Analyst extrae en `brief-criteria.md` -> Design Researcher sintetiza en `visual-analysis.md` -> Design Orchestrator incorpora aqui.

### Brief: Sitio Publico

| ID | Criterio del Cliente | Tipo de Verificacion | DC-xxx Relacionado |
|----|---------------------|---------------------|-------------------|
| BVC-001 | El diseno se siente premium y no generico | subjective | DC-030, DC-031, DC-054, DC-136 |
| BVC-002 | Hay suficiente espacio en blanco entre elementos | visual | DC-017, DC-018, DC-019 |
| BVC-003 | La tipografia tiene jerarquia clara (titulo grande, subtitulo, cuerpo) | visual | DC-012, DC-013, DC-015 |
| BVC-004 | Los colores corresponden a la paleta definida (#008DC9, #50B92A, #F5F7FA, #6B7280, #1F2937, #005A85, #E8F4FD, #EDF7E8, #F0F2F5) | computed-style | DC-001, DC-002, DC-003, DC-004, DC-005 |
| BVC-005 | Las animaciones son sutiles y profesionales (no agresivas) | visual | DC-023, DC-024, DC-025, DC-136, DC-139 |
| BVC-006 | El diseno funciona en mobile | visual | DC-082, DC-083, DC-086, DC-087 |
| BVC-007 | La seccion tiene un equivalente visual en Tuft and Paw que se esta copiando correctamente | visual | DC-030, DC-031, DC-034, DC-038, DC-051, DC-063 |
| BVC-008 | No se estan mostrando precios, inventario, carrito u otros elementos prohibidos | visual (negative) | DC-054, DC-071 |
| BVC-009 | Los textos estan en espanol e ingles | visual | DC-068 |
| BVC-010 | El nivel visual supera claramente lo que tienen Monteco, VETIM y Belina | subjective | DC-024, DC-025, DC-136, DC-139, DC-140, DC-143 |

### Brief: Panel de Administracion

| ID | Criterio del Cliente | Tipo de Verificacion | DC-xxx Relacionado |
|----|---------------------|---------------------|-------------------|
| BVC-011 | La pantalla tiene un solo proposito claro (ver, crear, editar, o configurar) | visual | DC-047, DC-048, DC-049 |
| BVC-012 | Los productos y marcas se muestran como cards con imagen/logo, no como listas planas | visual | DC-075, DC-074 |
| BVC-013 | Los formularios estan organizados en secciones con subtitulos | visual | DC-048, DC-077 |
| BVC-014 | Los campos condicionales se muestran/ocultan segun la categoria seleccionada | visual | DC-048 |
| BVC-015 | Hay suficiente espacio entre elementos (padding, gap, margin) | computed-style | DC-020, DC-072, DC-073 |
| BVC-016 | Todos los estados tienen badge con color (no texto plano) | visual | DC-007, DC-075 |
| BVC-017 | Los iconos acompanan a los elementos de navegacion, cards de resumen, y badges | visual | DC-028, DC-072, DC-073 |
| BVC-018 | Las acciones destructivas tienen confirmacion (modal) | visual | DC-079, DC-133 |
| BVC-019 | Los estados vacios estan disenados (ilustracion + mensaje + CTA) | visual | DC-118 |
| BVC-020 | La pantalla se siente como herramienta hecha a la medida, no CRUD generico | subjective | DC-072, DC-073, DC-075, DC-079, DC-137 |
| BVC-021 | El flujo de navegacion es claro: Listado > Crear/Editar > Detalle | visual | DC-047, DC-048 |
| BVC-022 | El toggle Card view / Table view esta disponible en listados de productos y marcas | visual | DC-074 |
| BVC-023 | Los toast notifications aparecen despues de guardar, eliminar, o cambiar estado | visual | DC-123, DC-124 |
| BVC-024 | El panel refleja la misma calidad visual que el sitio publico | subjective | DC-001, DC-010, DC-022, DC-137 |

### BVC Derivados de Anti-patrones

| ID | Criterio del Cliente | Tipo de Verificacion | DC-xxx Relacionado |
|----|---------------------|---------------------|-------------------|
| BVC-025 | No hay precios visibles en ninguna pagina del sitio | visual (negative) | DC-054, DC-071 |
| BVC-026 | No hay carrito, checkout ni pasarela de pago | visual (negative) | DC-050 |
| BVC-027 | No hay registro de usuarios ni login de clientes en sitio publico | visual (negative) | DC-050 |
| BVC-028 | No hay seccion de ofertas, descuentos, resenas ni blog | visual (negative) | DC-054 |
| BVC-029 | No hay chat en vivo (solo WhatsApp flotante) | visual (negative) | DC-052 |
| BVC-030 | No hay listas planas de productos en el panel (siempre cards) | visual (negative) | DC-075, DC-074 |

### BVC Derivados de Principios Testables

| ID | Criterio del Cliente | Tipo de Verificacion | Valor a Verificar | DC-xxx Relacionado |
|----|---------------------|---------------------|-------------------|-------------------|
| BVC-031 | Titulos hero son minimo 48px desktop, 32px mobile | computed-style | font-size >= 48px desktop, >= 32px mobile | DC-012, DC-013 |
| BVC-032 | Bloques de color tienen border-radius 20-30px y padding 60-80px | computed-style | border-radius: 24px, padding: 72px desktop | DC-022, DC-018 |
| BVC-033 | Hover en cards tiene shadow + scale(1.02) con transicion 0.3s | computed-style | transform: scale(1.02), box-shadow, transition: 0.3s | DC-024, DC-136 |
| BVC-034 | Sidebar panel tiene ancho ~260-280px, fondo blanco, borde derecho | computed-style | width: 272px, background: #FFFFFF, border-right: 1px | DC-088 |
| BVC-035 | Header panel tiene altura ~64-72px, fondo blanco, borde inferior | computed-style | height: 68px, background: #FFFFFF, border-bottom: 1px | DC-046 |
| BVC-036 | Fondo area contenido panel es #F7F8FA con padding 24-32px | computed-style | background: #F7F8FA, padding: 32px desktop | DC-020 |
| BVC-037 | Cards resumen panel tienen border-radius 12-16px y sombra sutil | computed-style | border-radius: 16px, box-shadow != none | DC-072 |
| BVC-038 | WhatsApp flotante esta presente en todas las paginas, esquina inferior derecha | visual | Boton flotante verde en todas las paginas del sitio publico | DC-052 |
| BVC-039 | Selector de idioma ES/EN visible en header y footer | visual | Toggle/dropdown de idioma en ambas ubicaciones | DC-068 |
| BVC-040 | Footer usa fondo #005A85 con texto blanco | computed-style | background: #005A85, color: #FFFFFF | DC-051 |

---

## Gaps de Diseno Descubiertos

| # | Gap | Impacto en requirements | Recomendacion |
|---|---|---|---|
| GAP-D01 | Los requirements no definen estados de carga (skeleton/loading) para ninguna pantalla | Todas las pantallas, ambas apps | Definidos en ux-flows.md: skeleton screens con shimmer para cada pantalla |
| GAP-D02 | No hay definicion de que pasa si token Azure Entra ID expira durante uso del panel | REQ-311 | Modal no-dismissable "Tu sesion ha expirado" + boton re-login |
| GAP-D03 | Pills de presentaciones de producto sin spec visual | REQ-114, REQ-115 | Pills toggle radius 25px, borde #E5E7EB, seleccionado fondo #E8F4FD borde #008DC9 |
| GAP-D04 | Color "morado" para tipo Fabricante no esta en paleta prescrita | REQ-296 | #7C3AED con fondo #EDE9FE, texto oscuro #5B21B6 (7.57:1 AAA). Unica excepcion a la paleta |
| GAP-D05 | No se define comportamiento de "Duplicar producto" (solo se lista en menu) | REQ-228 | Copia todos los campos a formulario de creacion con nombre "[Original] (copia)" |
| GAP-D06 | No se define concurrencia de edicion entre admins | Toda gestion de contenido | v1: "last write wins". v2: timestamps de edicion visibles |
| GAP-D07 | No se define comportamiento de filtros catalogo con boton "atras" del navegador | REQ-099 | Filtros se restauran desde URL query params con history state nativo |
| GAP-D08 | No se define longitud maxima de preview mensajes en kanban ni tabla | REQ-291 | Kanban: max 80 chars (2 lineas). Tabla: max 60 chars (1 linea) |
| GAP-D09 | Mapa SVG de Costa Rica sin especificacion visual detallada | REQ-169 a REQ-171 | SVG estatico tono #E8F4FD con puntos #008DC9, leyenda GAM/rural/encomienda. No interactivo |
| GAP-D10 | Boton "Ver en sitio" para productos inactivos sin definir | REQ-228 | Deshabilitar con tooltip "El producto no es visible en el sitio publico porque esta inactivo" |
| GAP-D11 | Storytelling producto con contenido parcial (texto sin imagen) | REQ-135 a REQ-137 | Texto sin imagen = full-width. Imagen sin texto = no renderizar bloque |
| GAP-D12 | Admin sidebar no tiene componente detallado en components.md | DEMO-025 | Sidebar es layout component liderado por ux-flows. Items activos usan patron de DC-028 (nav activo sidebar) |

---

## Cobertura DEMO-xxx

### Verificacion: cada DEMO-xxx visual tiene al menos un DC-xxx

| DEMO | DC-xxx Principales | Estado |
|---|---|---|
| DEMO-001 | DC-050, DC-080, DC-141, DC-147 | Cubierto |
| DEMO-002 | DC-051, DC-086 | Cubierto |
| DEMO-003 | DC-052 | Cubierto |
| DEMO-004 | DC-030, DC-082 | Cubierto |
| DEMO-005 | DC-031, DC-061, DC-083 | Cubierto |
| DEMO-006 | DC-032, DC-097, DC-140 | Cubierto |
| DEMO-007 | DC-033, DC-062, DC-084, DC-143 | Cubierto |
| DEMO-008 | DC-034, DC-054, DC-055, DC-093 | Cubierto |
| DEMO-009 | DC-035, DC-064 | Cubierto |
| DEMO-010 | DC-036, DC-054, DC-081 | Cubierto |
| DEMO-011 | DC-037, DC-054, DC-081 | Cubierto |
| DEMO-012 | DC-056, DC-087 | Cubierto |
| DEMO-013 | DC-057, DC-094 | Cubierto |
| DEMO-014 | DC-038, DC-058, DC-067, DC-069, DC-070, DC-071, DC-085 | Cubierto |
| DEMO-015 | DC-063 | Cubierto |
| DEMO-016 | DC-038 | Cubierto |
| DEMO-017 | DC-054 | Cubierto |
| DEMO-018 | DC-039, DC-060 | Cubierto |
| DEMO-019 | DC-040 | Cubierto |
| DEMO-020 | DC-041, DC-065 | Cubierto |
| DEMO-021 | DC-042, DC-059, DC-066 | Cubierto |
| DEMO-022 | DC-043, DC-059, DC-096 | Cubierto |
| DEMO-023 | DC-044, DC-053 | Cubierto |
| DEMO-024 | DC-045, DC-099, DC-114, DC-115 | Cubierto |
| DEMO-025 | DC-088 | Cubierto |
| DEMO-026 | DC-046 | Cubierto |
| DEMO-027 | DC-046, DC-072, DC-073, DC-116, DC-117 | Cubierto |
| DEMO-028 | DC-047, DC-074, DC-075, DC-076, DC-089, DC-090, DC-118 | Cubierto |
| DEMO-029 | DC-048, DC-077, DC-078, DC-079, DC-091, DC-119, DC-121, DC-123, DC-131, DC-133 | Cubierto |
| DEMO-030 | DC-038 (reutiliza layout detalle) | Cubierto |
| DEMO-031 | DC-060, DC-074, DC-076 | Cubierto |
| DEMO-032 | DC-048, DC-077, DC-078 | Cubierto |
| DEMO-033 | DC-077 (tag input es variante de form field) | Cubierto |
| DEMO-034 | DC-048, DC-077, DC-078 | Cubierto |
| DEMO-035 | DC-079 (modal seleccion) | Cubierto |
| DEMO-036 | DC-079 (modal seleccion) | Cubierto |
| DEMO-037 | DC-048, DC-098 | Cubierto |
| DEMO-038 | DC-065, DC-077, DC-078 | Cubierto |
| DEMO-039 | DC-049, DC-074, DC-076, DC-092, DC-146 | Cubierto |
| DEMO-040 | DC-077 | Cubierto |
| DEMO-041 | DC-048, DC-077, DC-098 | Cubierto |
| DEMO-042 | DC-068 | Cubierto |
| DEMO-043 | DC-080 a DC-099 (todos los responsive) | Cubierto |
| DEMO-044 | DC-001 a DC-029 (todos los tokens) | Cubierto |
| DEMO-045 | N/A (CRM tracking es estructural, no visual) | No aplica |

**Resultado**: 44 de 45 DEMO-xxx visuales tienen al menos un DC-xxx. DEMO-045 (CRM tracking) es estructural sin componente visual.

### Verificacion BVC-xxx a DC-xxx

Todos los 40 BVC-xxx tienen al menos un DC-xxx relacionado para trazabilidad (ver columna "DC-xxx Relacionado" en la seccion BVC arriba).

# Componentes -- HESA (Herrera y Elizondo S.A.)

**Generado por**: Component Designer
**Fecha**: 2026-03-17
**Version**: 1.0
**Total componentes**: 34 (18 sitio publico + 16 panel)
**Fuentes**: visual-analysis.md (patrones prescritos), requirements.md (371 criterios), design-distribution.md (asignacion), architecture.md (estructura de modulos)

---

## Indice de Componentes

### Sitio Publico (18)
1. Header (Navbar)
2. Footer
3. WhatsApp FAB
4. Language Selector
5. Search Overlay
6. Product Card
7. Carousel
8. Breadcrumb
9. Filter Bar
10. Pagination
11. Product Gallery
12. Contact Form
13. Brand Card
14. Category Block
15. Value Stat
16. Brand Logos Row
17. Team Member Card
18. Timeline

### Panel de Administracion (16)
1. Summary Card
2. Category Card Admin
3. View Toggle
4. Product Card Admin
5. Data Table
6. Brand Card Admin
7. Form Field
8. Image Uploader
9. PDF Uploader
10. Tag Input
11. Confirm Modal
12. Toast Notification
13. Kanban Board
14. Tabs Pill
15. Bilingual Input
16. Empty State

### Componentes Compartidos / Patrones de Feedback
- Status Badge (panel)
- Search Select (panel)
- Sticky Bar (sitio publico)
- Manufacturer CTA Banner (sitio publico)
- Product CTAs (sitio publico)
- Species Badges (sitio publico)
- Presentation Pills (sitio publico)

---

## PARTE 1: COMPONENTES DEL SITIO PUBLICO

---

### 1. Componente: Header (Navbar)

**Cubre**: REQ-001 a REQ-012, DEMO-001
**Patron de referencia**: T&P Patron #7 (Nav minimalista)
**Bootstrap base**: `navbar`, `navbar-expand-lg`, `container`

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `logo` | `{ full: string, isotipo: string }` | Si | URL del logo completo y del isotipo para estado scrolled |
| `menuItems` | `MenuItem[]` | Si | Array de items de navegacion con label, url, submenu opcional |
| `currentLang` | `'es' \| 'en'` | Si | Idioma activo |
| `currentRoute` | `string` | Si | Ruta activa para estado `active` en links |
| `isScrolled` | `boolean` | No | Indica si el usuario hizo scroll (controlado internamente via signal) |

```typescript
interface MenuItem {
  label: string;
  url: string;
  isActive: boolean;
  submenu?: MenuItem[]; // Para "Catalogo" con Farmacos/Alimentos/Equipos
}
```

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onSearchOpen` | `void` | Abre el Search Overlay |
| `onLanguageChange` | `'es' \| 'en'` | Cambia idioma activo |
| `onMenuToggle` | `boolean` | Abre/cierra hamburger menu en mobile |
| `onNavigate` | `string` | Navega a la ruta indicada |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default (top)** | Fondo blanco, logo completo HESA a la izquierda, links de texto #1F2937 a la derecha separados por ~40px, icono lupa + selector idioma en extremo derecho. Altura: 70px. Borde inferior: ninguno (transparente sobre hero) o 1px #E5E7EB (sobre paginas internas). |
| **Scrolled (sticky)** | Fondo blanco con `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`. Logo cambia de completo a isotipo HESA con transicion `opacity 0.3s ease-out`. Altura reduce a 60px. `position: fixed; top: 0; z-index: 1000`. Transicion de background y shadow: `0.3s ease-out`. |
| **Active link** | Link de la seccion actual: color #008DC9, underline animado con `width 0 -> 100%` de izquierda a derecha, `transition: 0.2s ease-out`. (REQ-007) |
| **Hover link** | Underline animado izquierda a derecha con color #008DC9, `transition: 0.2s ease-out`. Cambio de color de texto: #1F2937 -> #008DC9. |
| **Submenu open (desktop)** | Dropdown bajo "Catalogo" con fondo blanco, `box-shadow: 0 8px 24px rgba(0,0,0,0.12)`, `border-radius: 8px`, padding 12px 0. Items: Farmacos, Alimentos, Equipos con icono + texto. Aparece al hover, se mantiene mientras el cursor esta sobre el dropdown. Animacion entrada: `opacity 0 -> 1, translateY(-8px) -> 0` en `0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)`. |
| **Mobile menu open** | Overlay full-screen con fondo blanco. Slide-in desde la derecha: `transform: translateX(100%) -> translateX(0)` en `0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)`. Backdrop: `rgba(0,0,0,0.5)` con `opacity 0 -> 1` en `0.2s`. Links centrados verticalmente, font-size 20px, font-weight 600, spacing 24px entre items. Submenu "Catalogo" se expande al tap con chevron rotando 0 -> 90deg. Boton cerrar (X) en esquina superior derecha, 44x44px area de toque. |
| **Focus (keyboard)** | Outline: `2px solid #008DC9`, `outline-offset: 2px` en todos los links y botones interactivos. |

#### Responsive
| Breakpoint | Comportamiento |
|---|---|
| **Desktop (>= 1024px)** | Layout completo: logo izquierda, links centro-derecha (Catalogo con submenu hover, Marcas, Nosotros, Distribuidores, Contacto), iconos derecha (lupa + idioma). |
| **Tablet (768px - 1023px)** | Hamburger menu izquierda + logo centrado + selector idioma derecha. Al tap en hamburger: drawer slide-in con todos los links. |
| **Mobile (< 768px)** | Mismo que tablet. Logo reduce a isotipo. Links de nav en drawer full-screen. CTAs no visibles en header. |

#### Accesibilidad
- `role="navigation"`, `aria-label="Navegacion principal"` (ES) / `"Main navigation"` (EN)
- Hamburger: `aria-expanded="true/false"`, `aria-controls="mobile-menu"`, `aria-label="Abrir menu"`
- Submenu: `aria-haspopup="true"`, `aria-expanded="true/false"`
- Todos los links: navegables con Tab. Submenu: Enter para abrir, Escape para cerrar, flechas arriba/abajo para navegar items
- Focus visible con outline `2px solid #008DC9` en todos los elementos interactivos
- Tap targets minimo 44x44px en mobile (REQ-025, NFR-026)

#### Premium Details
- Logo completo -> isotipo al scroll: crossfade con `opacity` transition `0.3s ease-out`, no un salto abrupto
- Underline animado en links: pseudo-elemento `::after` con `width: 0 -> 100%`, `transition: width 0.2s ease-out`, `background: #008DC9`, `height: 2px`, `bottom: -4px`
- Submenu items con padding 12px 24px, hover: fondo #F5F7FA con `transition: background 0.15s ease-out`
- Mobile menu: items aparecen en stagger con `animation-delay` incremental de 50ms por item (sutil, no exagerado)

---

### 2. Componente: Footer

**Cubre**: REQ-013 a REQ-020, DEMO-002
**Patron de referencia**: T&P Patron #6 (Footer con logo grande)
**Bootstrap base**: `container`, `row`, `col`

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `logo` | `string` | Si | URL del logo HESA (version blanca/clara para fondo oscuro) |
| `navLinks` | `FooterLink[]` | Si | Links de navegacion del footer |
| `contactInfo` | `ContactInfo` | Si | Telefono, email, direccion, horario |
| `socialLinks` | `SocialLink[]` | Si | Facebook, Instagram con URLs |
| `currentLang` | `'es' \| 'en'` | Si | Idioma activo |
| `currentYear` | `number` | Si | Ano para copyright (dinamico) |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onLanguageChange` | `'es' \| 'en'` | Cambia idioma desde footer |
| `onNavigate` | `string` | Navega a la ruta indicada |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Fondo #005A85. Texto blanco #FFFFFF. 4 columnas: (1) Logo HESA grande + tagline "37 anos distribuyendo salud animal", (2) Navegacion rapida: Inicio, Catalogo, Marcas, Nosotros, Distribuidores, Contacto, (3) Contacto: telefono, email, direccion, horario, (4) Redes sociales: iconos 24px con hover opacity 0.7 -> 1. Separador horizontal 1px `rgba(255,255,255,0.2)` entre columnas y copyright. Copyright: "HESA 2026. Todos los derechos reservados." centrado. Selector idioma: "Espanol / English" como link de texto. Padding: 64px vertical desktop. |
| **Hover links** | Color: blanco con opacity 1, underline aparece con `transition: opacity 0.2s ease-out`. |
| **Hover social icons** | `transform: scale(1.1)`, `transition: 0.2s ease-out`. |
| **Mobile acordeon** | Secciones colapsables con titulo + icono "+" circular. Al tap: contenido se expande con `max-height` transition `0.3s ease-out`, icono rota "+" -> "x" a 45deg. Solo la seccion activa esta abierta a la vez. |

#### Responsive
| Breakpoint | Comportamiento |
|---|---|
| **Desktop (>= 1024px)** | 4 columnas equidistantes. Logo HESA grande como brand closure al fondo (~200px de ancho). |
| **Tablet (768px - 1023px)** | 2x2 grid de columnas. Logo centrado. |
| **Mobile (< 768px)** | 1 columna. Secciones como acordeones colapsables con "+" circular. Logo centrado arriba. Copyright al final. Padding: 40px vertical. |

#### Accesibilidad
- `role="contentinfo"`, `aria-label="Pie de pagina"` / `"Footer"`
- Links de redes sociales: `aria-label="Facebook"`, `target="_blank"`, `rel="noopener noreferrer"`
- Acordeones mobile: `aria-expanded="true/false"`, `aria-controls="footer-section-[id]"`
- Contraste: texto blanco sobre #005A85 = ratio ~5.7:1 (cumple AA)

#### Premium Details
- Logo HESA como "brand closure" al estilo T&P: logo grande en blanco, opacity 0.9, centrado al fondo del footer
- Links de navegacion con letter-spacing 0.02em, font-weight 500, font-size 15px
- Separadores con `rgba(255,255,255,0.15)` para sutileza
- Acordeon mobile con animacion suave de expand/collapse, no toggle instantaneo

---

### 3. Componente: WhatsApp FAB

**Cubre**: REQ-021 a REQ-026, DEMO-003
**Decision holistica**: 10.9

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `phoneNumber` | `string` | Si | Numero de WhatsApp configurado desde panel |
| `defaultMessage` | `string` | No | Mensaje pre-configurado con contexto de pagina |
| `currentPage` | `string` | No | Pagina actual para contexto del mensaje |
| `tooltipText` | `string` | No | Texto del tooltip hover. Default: "Escribenos por WhatsApp" |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onClick` | `void` | Abre WhatsApp con mensaje pre-configurado |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Boton circular 56px. Fondo #25D366 (verde WhatsApp). Icono WhatsApp blanco 28px centrado. Posicion: `fixed`, `bottom: 24px`, `right: 24px`, `z-index: 999`. Sombra: `0 4px 12px rgba(0,0,0,0.15)`. |
| **Hover** | `transform: scale(1.1)`, `transition: 0.2s ease-out`. Sombra: `0 8px 24px rgba(0,0,0,0.2)`. Tooltip aparece arriba del boton: fondo #1F2937, texto blanco 13px, border-radius 6px, padding 8px 12px, `opacity 0 -> 1` en `0.2s`. |
| **Active (pressed)** | `transform: scale(0.95)`. Fondo: #20BD5A (ligeramente mas oscuro). |
| **Focus** | Outline: `2px solid #1F2937`, `outline-offset: 3px`. |

#### Responsive
| Breakpoint | Comportamiento |
|---|---|
| **Desktop** | Posicion `bottom: 24px`, `right: 24px`. Tooltip visible al hover. |
| **Mobile** | Posicion `bottom: 20px`, `right: 20px`. Tamano: 56px (cumple 44px minimo, REQ-025). Sin tooltip (tap directo). No interfiere con sticky bar de producto (REQ-026): cuando sticky bar esta visible, FAB sube `bottom: 80px` en mobile. |

#### Accesibilidad
- `role="button"`, `aria-label="Contactar por WhatsApp"` / `"Contact via WhatsApp"`
- `tabindex="0"`, navegable con Tab + Enter
- Area de toque: 56px > 44px minimo (NFR-026)

---

### 4. Componente: Language Selector

**Cubre**: REQ-004, REQ-017, REQ-034, BVC-039
**Decision holistica**: 10.10

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `currentLang` | `'es' \| 'en'` | Si | Idioma activo |
| `variant` | `'header' \| 'footer'` | Si | Variante visual |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onLanguageChange` | `'es' \| 'en'` | Cambia idioma |

#### Estados Visuales

**Variante Header:**
| Estado | Descripcion Visual |
|---|---|
| **Default** | Dropdown compacto: bandera circular 20px + codigo "ES" o "EN" en font-weight 500, font-size 14px, color #1F2937. Chevron 12px a la derecha. Padding: 6px 10px. Border-radius: 6px. |
| **Hover** | Fondo #F5F7FA, `transition: 0.15s ease-out`. |
| **Open** | Dropdown con 2 opciones: bandera CR + "Espanol" y bandera US + "English". Fondo blanco, `box-shadow: 0 4px 12px rgba(0,0,0,0.12)`, border-radius: 8px. Opcion activa: fondo #E8F4FD, texto #008DC9. Animacion: `opacity 0 -> 1, translateY(-4px) -> 0` en `0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)`. |
| **Focus** | Outline: `2px solid #008DC9`, `outline-offset: 2px`. |

**Variante Footer:**
| Estado | Descripcion Visual |
|---|---|
| **Default** | Texto link: "English" (si idioma actual es ES) o "Espanol" (si es EN). Color blanco, opacity 0.8. Font-size: 14px. |
| **Hover** | Opacity 1, underline. |

#### Responsive
- Header: siempre visible en todos los breakpoints. En mobile se posiciona a la derecha del header junto a hamburger.
- Footer: siempre visible como link de texto.

#### Accesibilidad
- `role="listbox"`, `aria-label="Seleccionar idioma"` / `"Select language"`
- Opciones: `role="option"`, `aria-selected="true/false"`
- Keyboard: Enter/Space para abrir, flechas para navegar, Enter para seleccionar, Escape para cerrar

---

### 5. Componente: Search Overlay

**Cubre**: REQ-035 a REQ-041, DEMO-023
**Decision holistica**: 10.6
**Patron de referencia**: T&P search overlay

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `isOpen` | `boolean` | Si | Estado abierto/cerrado |
| `currentLang` | `'es' \| 'en'` | Si | Idioma de busqueda |
| `minChars` | `number` | No | Minimo de caracteres para buscar (default: 3) |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onClose` | `void` | Cierra el overlay |
| `onSearch` | `string` | Termino de busqueda |
| `onResultClick` | `{ type: 'product' \| 'brand', id: string, slug: string }` | Navega al resultado |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Closed** | No visible. |
| **Opening** | Overlay full-screen con fondo `rgba(0,0,0,0.6)`. Animacion: `opacity 0 -> 1` en `0.2s ease-out`. Contenido (input + resultados) desciende desde arriba: `translateY(-20px) -> 0` en `0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)`. |
| **Open - Empty** | Input centrado en tercio superior: fondo blanco, border-radius 12px, height 60px, font-size 20px, font-weight 400, color #1F2937. Placeholder: "Buscar productos, marcas..." en gris #6B7280. Icono lupa gris 24px a la izquierda del input. Icono "X" para cerrar: esquina superior derecha, 44x44px, color blanco. Max-width del input: 720px. |
| **Open - Typing (< 3 chars)** | Input con texto, sin resultados aun. Texto debajo: "Escribe al menos 3 caracteres" en 14px #6B7280 italic. |
| **Open - Loading** | Spinner de 24px debajo del input, color #008DC9, `animation: spin 1s linear infinite`. |
| **Open - With Results** | Dropdown de resultados debajo del input. Fondo blanco, border-radius 12px, `box-shadow: 0 8px 24px rgba(0,0,0,0.12)`, max-height 480px, overflow-y auto. Secciones separadas por label UPPERCASE 12px #6B7280 (letter-spacing 0.08em): "PRODUCTOS" y "MARCAS". Max 5 items por seccion. Cada item: thumbnail 48x48px (border-radius 8px) + nombre bold 16px #1F2937 + tipo/marca regular 14px #6B7280. Hover item: fondo #F5F7FA, `transition: 0.1s`. Item activo (keyboard): fondo #E8F4FD, borde izquierdo 3px #008DC9. |
| **Open - No Results** | Mensaje centrado: "No se encontraron resultados para '[termino]'" en 16px #6B7280. Link "Ver catalogo completo" en #008DC9 underline. |
| **Focus** | Input: borde 2px #008DC9 (en lugar del borde gris default). |

#### Responsive
| Breakpoint | Comportamiento |
|---|---|
| **Desktop** | Overlay con input en tercio superior, max-width 720px centrado. Resultados en dropdown debajo. |
| **Mobile** | Overlay full-screen. Input full-width con padding 20px lateral. Resultados en scroll vertical. Boton cerrar 44x44px visible. |

#### Accesibilidad
- `role="search"`, `aria-label="Busqueda global"`
- Input: `aria-autocomplete="list"`, `aria-controls="search-results"`, `aria-activedescendant` para item seleccionado por keyboard
- Resultados: `role="listbox"`, items: `role="option"`
- Keyboard: flechas arriba/abajo para navegar resultados, Enter para seleccionar, Escape para cerrar overlay
- Focus trap: Tab cicla dentro del overlay (input -> resultados -> cerrar -> input)
- Busqueda case-insensitive y normalizada de acentos (REQ-041)

---

### 6. Componente: Product Card (Sitio Publico)

**Cubre**: REQ-082 a REQ-084, REQ-067, REQ-070, DEMO-008, DEMO-010, DEMO-011, DEMO-017
**Patron de referencia**: T&P Patron #3 (Carrusel "Most-loved")

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `product` | `ProductCardData` | Si | Datos del producto |
| `variant` | `'grid' \| 'carousel'` | No | Variante visual (default: 'grid') |
| `currentLang` | `'es' \| 'en'` | Si | Idioma activo |

```typescript
interface ProductCardData {
  id: string;
  slug: string;
  image: string | null;          // URL imagen principal
  name: string;                   // Nombre en idioma actual
  brandName: string;              // Nombre de la marca
  brandSlug: string;
  categorySlug: string;           // farmacos | alimentos | equipos
  speciesBadges?: SpeciesBadge[]; // Badges de especie (opcional en card)
}
```

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onClick` | `string` | Navega al detalle del producto (slug) |
| `onCtaClick` | `string` | Navega al detalle (variante carousel con boton "Ver producto") |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Card con fondo blanco. Border-radius: 12px. Sombra: `0 1px 3px rgba(0,0,0,0.08)`. Imagen: aspect-ratio 1:1 sobre fondo #F5F7FA, object-fit contain, padding interno 16px para que el producto no toque bordes. Nombre: Inter Bold 16px #1F2937, max 2 lineas con text-overflow ellipsis. Marca: Inter Regular 14px #6B7280, 1 linea. SIN precio (anti-patron #1). SIN estrellas (anti-patron #7). Padding contenido texto: 16px. Gap entre cards: 28px desktop, 20px mobile. |
| **Hover** | `transform: scale(1.02)`. Sombra: `0 4px 12px rgba(0,0,0,0.12)`. `transition: all 0.3s ease-out`. Boton "Ver producto" aparece con `opacity 0 -> 1` en `0.2s ease-out`: outline #008DC9, border-radius 8px, padding 10px 20px, font-size 14px, font-weight 600, centrado debajo del texto. |
| **Active (pressed)** | `transform: scale(0.99)`. |
| **Loading (skeleton)** | Rectangulo animado con shimmer: imagen placeholder gris #E5E7EB (aspect-ratio 1:1), titulo placeholder 60% ancho, subtitulo placeholder 40% ancho. Shimmer animation: gradiente lineal `#E5E7EB -> #F5F7FA -> #E5E7EB` moviéndose de izquierda a derecha en `1.5s ease-in-out infinite`. |
| **Sin imagen** | Placeholder: fondo #F5F7FA con icono de categoria centrado (jeringa para farmaco, plato para alimento, herramienta para equipo) en #E5E7EB, tamano 48px. Nombre de marca debajo del icono en #6B7280 14px. |
| **Focus** | Outline: `2px solid #008DC9`, `outline-offset: 2px`, border-radius: 14px. |

**Variante `carousel`**: Identica pero con boton "Ver producto" siempre visible (no solo en hover) en estilo outline #008DC9, full-width del area de contenido.

#### Responsive
| Breakpoint | Comportamiento |
|---|---|
| **Desktop (>= 1024px)** | Grid 3 columnas, gap 28px. Card ancho ~380px. |
| **Tablet (768px - 1023px)** | Grid 2 columnas, gap 20px. |
| **Mobile (< 768px)** | Grid 2 columnas (compact) o 1 columna (full). Gap 16px. Hover effects deshabilitados (no hover en touch). Boton "Ver producto" siempre visible. |

#### Accesibilidad
- Entire card es clickable: `<a>` envolvente con `aria-label="Ver [nombre del producto]"`
- Imagen: `alt="[nombre del producto] - [marca]"` en idioma activo (NFR-022)
- Focus visible con outline
- Sin precio ni e-commerce (anti-patrones #1, #3)

---

### 7. Componente: Carousel

**Cubre**: REQ-069, REQ-072, DEMO-008
**Patron de referencia**: T&P Patron #3 (dots pill + flechas circulares)

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `items` | `TemplateRef[]` | Si | Items a renderizar (product cards u otros) |
| `visibleDesktop` | `number` | No | Items visibles en desktop (default: 4) |
| `visibleTablet` | `number` | No | Items visibles en tablet (default: 2) |
| `visibleMobile` | `number` | No | Items visibles en mobile (default: 1) |
| `gap` | `number` | No | Gap entre items en px (default: 28) |
| `autoplay` | `boolean` | No | Autoplay (default: false) |
| `loop` | `boolean` | No | Loop infinito (default: false) |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onSlideChange` | `number` | Indice del slide actual |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Contenedor horizontal con items visibles. Flechas circulares prev/next: circulos 44px, fondo blanco, borde 1px #E5E7EB, icono chevron 16px #1F2937, posicion absolute centrada verticalmente, offset -22px de los bordes del carousel. Dots de paginacion: centrados debajo del carousel, margin-top 24px. Dot activo: rectangulo pill 24px x 8px, border-radius 4px, fondo #008DC9. Dots inactivos: circulos 8px, fondo #E5E7EB. Gap entre dots: 8px. Transicion entre dots: `width 0.3s ease-out`. |
| **Hover flechas** | Fondo: #F5F7FA. Sombra: `0 2px 8px rgba(0,0,0,0.1)`. `transition: 0.2s ease-out`. |
| **Disabled flecha** | Cuando esta en primer/ultimo slide (sin loop): `opacity: 0.3`, `cursor: default`, sin hover effect. |
| **Swiping (mobile)** | Touch gesture: `touch-action: pan-y` para permitir scroll vertical. Slide con `translateX` siguiendo el dedo. Snap al soltar con `transition: transform 0.3s ease-out`. Indicadores de swipe: no hay (es nativo e intuitivo). |
| **Focus flechas** | Outline: `2px solid #008DC9`, `outline-offset: 2px`. |

#### Responsive
| Breakpoint | Comportamiento |
|---|---|
| **Desktop** | Flechas visibles a los lados. Dots debajo. Items segun `visibleDesktop`. |
| **Tablet** | Flechas mas pequenas (36px). Items segun `visibleTablet`. |
| **Mobile** | Flechas ocultas. Swipe habilitado (REQ-072). Dots visibles. Items segun `visibleMobile`. |

#### Accesibilidad
- `role="region"`, `aria-label="Carrusel de productos"` / `"Product carousel"`
- `aria-roledescription="carousel"`
- Flechas: `aria-label="Slide anterior"` / `"Siguiente slide"`
- Dots: `role="tablist"`, cada dot: `role="tab"`, `aria-selected="true/false"`, `aria-label="Ir al slide [n]"`
- Keyboard: flechas izquierda/derecha para navegar slides

---

### 8. Componente: Breadcrumb

**Cubre**: REQ-078, REQ-106, REQ-149, REQ-234, REQ-255
**Bootstrap base**: `breadcrumb`

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `items` | `BreadcrumbItem[]` | Si | Array de items con label y url |
| `currentLang` | `'es' \| 'en'` | Si | Idioma activo |

```typescript
interface BreadcrumbItem {
  label: string;
  url?: string; // Ultimo item no tiene url (es la pagina actual)
}
```

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Inter Regular 14px #6B7280. Separadores: ">" en #E5E7EB, padding 0 8px. Ultimo item: font-weight 500, color #1F2937 (no es link). Links intermedios: hover con color #008DC9 y underline. |
| **Focus** | Links con outline `2px solid #008DC9`. |

#### Responsive
- Texto se trunca en mobile si es muy largo: ellipsis con max-width en items intermedios.
- Font-size 13px en mobile.

#### Accesibilidad
- `<nav aria-label="Breadcrumb">`, lista `<ol>` con items `<li>`
- Ultimo item: `aria-current="page"`

---

### 9. Componente: Filter Bar

**Cubre**: REQ-088 a REQ-100, DEMO-012
**Patron**: Filtros modernos (chips/dropdowns, NO sidebar 2010)

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `filters` | `FilterConfig[]` | Si | Configuracion de filtros disponibles |
| `activeFilters` | `ActiveFilter[]` | Si | Filtros actualmente activos |
| `resultCount` | `number` | Si | Cantidad de resultados con filtros aplicados |
| `totalCount` | `number` | Si | Cantidad total sin filtros |
| `currentLang` | `'es' \| 'en'` | Si | Idioma activo |
| `category` | `'farmacos' \| 'alimentos' \| 'equipos' \| 'all'` | Si | Categoria actual (determina filtros visibles) |

```typescript
interface FilterConfig {
  key: string;              // 'marca', 'especie', 'familia', 'etapa_vida', 'tipo_equipo', 'categoria'
  label: string;
  type: 'dropdown' | 'multi-select';
  options: FilterOption[];
  visibleForCategories: string[]; // Que categorias muestran este filtro
}

interface FilterOption {
  value: string;
  label: string;
  count?: number; // Cantidad de productos con esta opcion
}

interface ActiveFilter {
  key: string;
  value: string;
  label: string;
}
```

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onFilterChange` | `ActiveFilter[]` | Array de filtros activos actualizado |
| `onFilterRemove` | `ActiveFilter` | Remueve un filtro individual |
| `onClearAll` | `void` | Limpia todos los filtros |
| `onMobileOpen` | `void` | Abre drawer de filtros en mobile |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default (sin filtros)** | Fila horizontal de dropdowns. Cada dropdown: fondo blanco, borde 1px #E5E7EB, border-radius 8px, padding 10px 16px, font-size 14px, font-weight 500, color #1F2937, chevron derecha #6B7280. Gap entre dropdowns: 12px. Contador de resultados a la derecha: "[X] productos" en 14px #6B7280. |
| **Dropdown abierto** | Lista de opciones debajo del dropdown: fondo blanco, `box-shadow: 0 8px 24px rgba(0,0,0,0.12)`, border-radius 8px, max-height 320px, overflow-y auto. Cada opcion: padding 10px 16px, hover fondo #F5F7FA. Checkmark a la izquierda de opcion seleccionada en #008DC9. Animacion apertura: `opacity 0 -> 1, translateY(-4px) -> 0` en `0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)`. |
| **Con filtros activos** | Debajo de la fila de dropdowns: fila de pills activos. Cada pill: fondo #E8F4FD, color #008DC9, border-radius 20px, padding 6px 12px, font-size 13px, font-weight 500. Icono "x" 14px a la derecha del label, hover: fondo #008DC9 con texto blanco. Gap entre pills: 8px. Boton "Limpiar filtros" (REQ-094): texto #EF4444, font-size 13px, sin fondo, hover underline. Aparece solo cuando hay >= 1 filtro activo. Contador actualizado: "Mostrando [X] de [Y] productos" (REQ-098). |
| **Sin resultados** | Mensaje centrado en area de grid: "No se encontraron productos con estos filtros" en 16px #6B7280. Boton "Limpiar filtros" en outline #008DC9 debajo (REQ-097). |
| **Hover dropdown** | Borde: #008DC9 1px. Fondo: blanco. |
| **Focus** | Outline: `2px solid #008DC9`, `outline-offset: 2px`. |
| **Mobile** | Dropdowns ocultos. Boton "Filtrar" fijo: fondo blanco, borde 1px #E5E7EB, border-radius 8px, icono filtro + "Filtrar" + badge con conteo de filtros activos si > 0. Badge: circulo 20px fondo #008DC9 texto blanco. |
| **Mobile drawer** | Sheet/drawer desde abajo (bottom sheet): fondo blanco, border-radius-top 16px, max-height 80vh, padding 24px. Handle bar gris centrada arriba (40px x 4px, border-radius 2px). Titulo "Filtros" bold 18px. Cada filtro como seccion con label bold 14px + opciones como checkboxes/chips. Botones footer: "Limpiar" outline + "Ver [X] resultados" primario #008DC9 full-width. Backdrop: `rgba(0,0,0,0.5)`. Animacion: `translateY(100%) -> 0` en `0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)`. |

#### Responsive
| Breakpoint | Comportamiento |
|---|---|
| **Desktop (>= 1024px)** | Dropdowns horizontales + pills activos debajo. |
| **Tablet (768px - 1023px)** | Dropdowns se ajustan en 2 filas si no caben. |
| **Mobile (< 768px)** | Boton "Filtrar" + drawer bottom sheet (REQ-096). Pills activos visibles como fila scrollable horizontal. |

#### Accesibilidad
- Dropdowns: `role="listbox"`, opciones: `role="option"`, `aria-selected`
- Pills activos: `role="list"`, cada pill: boton con `aria-label="Remover filtro: [nombre]"`
- Mobile drawer: `role="dialog"`, `aria-modal="true"`, focus trap
- Filtros actualizan resultados inmediatamente sin boton "Aplicar" (REQ-092)
- URL refleja filtros activos via query params (REQ-099)

---

### 10. Componente: Pagination

**Cubre**: REQ-101 a REQ-105, DEMO-013
**Bootstrap base**: `pagination`

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `currentPage` | `number` | Si | Pagina actual |
| `totalItems` | `number` | Si | Total de items |
| `itemsPerPage` | `number` | No | Items por pagina (default: 24) |
| `currentLang` | `'es' \| 'en'` | Si | Idioma activo |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onPageChange` | `number` | Nueva pagina seleccionada |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Centrado debajo del grid. Texto superior: "Mostrando [X]-[Y] de [Z] productos" en 14px #6B7280 (REQ-102). Controles: flechas prev/next (circulos 40px, fondo blanco, borde #E5E7EB, icono chevron) + numeros de pagina. Pagina activa: fondo #008DC9, texto blanco, border-radius 8px. Paginas inactivas: fondo blanco, texto #1F2937, hover fondo #F5F7FA. Elipsis "..." entre rangos. Max 7 items visibles: << 1 ... 4 **5** 6 ... 12 >>. |
| **First page** | Flecha prev deshabilitada: `opacity: 0.3`, cursor default. |
| **Last page** | Flecha next deshabilitada. |
| **Hover** | Paginas inactivas: fondo #F5F7FA. Flechas: fondo #F5F7FA. `transition: 0.15s ease-out`. |
| **Focus** | Outline `2px solid #008DC9` en cada boton. |

#### Responsive
| Breakpoint | Comportamiento |
|---|---|
| **Desktop** | Controles completos con numeros. |
| **Mobile** | Simplificado: flechas prev/next + "Pagina X de Y" centrado. Sin numeros individuales. |

#### Accesibilidad
- `<nav aria-label="Paginacion">`
- Cada boton: `aria-label="Ir a pagina [n]"`, pagina activa: `aria-current="page"`
- Flechas: `aria-label="Pagina anterior"` / `"Pagina siguiente"`, `aria-disabled="true"` cuando no aplica
- Navegable con Tab + Enter (REQ-103)
- Scroll al inicio del grid al cambiar pagina (REQ-104)

---

### 11. Componente: Product Gallery

**Cubre**: REQ-107 a REQ-109, REQ-127, REQ-128, DEMO-014
**Patron de referencia**: T&P Patron #5 (galeria con thumbnails verticales)

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `images` | `string[]` | Si | URLs de imagenes |
| `productName` | `string` | Si | Nombre del producto (para alt text) |
| `brandName` | `string` | Si | Nombre de la marca (para alt text y placeholder) |
| `category` | `string` | Si | Categoria (para icono placeholder) |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onImageChange` | `number` | Indice de imagen seleccionada |
| `onZoom` | `string` | Abre lightbox/zoom con URL de imagen |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default (multiples imagenes)** | Layout horizontal: thumbnails verticales a la izquierda (columna 60px ancho) + imagen principal a la derecha. Thumbnails: 60x60px, border-radius 8px, borde 2px transparent, gap 8px vertical. Thumbnail activo: borde 2px #008DC9. Thumbnail hover: borde 2px #E5E7EB. Imagen principal: max-width 100%, aspect-ratio auto, fondo #F5F7FA, border-radius 12px, cursor zoom-in. |
| **Imagen unica** | Sin columna de thumbnails (REQ-127). Solo imagen principal centrada. |
| **Sin imagenes** | Placeholder: fondo #F5F7FA, border-radius 12px, icono de categoria centrado (48px, color #E5E7EB), texto debajo: "[Marca]" en 16px #6B7280. |
| **Hover imagen principal** | Cursor: zoom-in. Imagen con subtle zoom: `transform: scale(1.05)` dentro de overflow hidden. `transition: transform 0.5s ease-out`. |
| **Lightbox abierto** | Overlay full-screen fondo `rgba(0,0,0,0.9)`. Imagen centrada max 90vw x 90vh. Boton cerrar "X" blanco esquina superior derecha 44x44px. Flechas prev/next si hay multiples imagenes. `animation: fadeIn 0.2s ease-out`. |
| **Thumbnail cambio** | Imagen principal hace crossfade: `opacity 1 -> 0 -> 1` en `0.3s ease-out`. |
| **Loading** | Skeleton shimmer en area de imagen principal + thumbnails. |
| **Focus** | Thumbnails y boton zoom: outline `2px solid #008DC9`. |

#### Responsive
| Breakpoint | Comportamiento |
|---|---|
| **Desktop** | Thumbnails verticales izquierda (60px col) + imagen principal derecha. Ocupa 55% del ancho de la pagina de detalle. |
| **Mobile** | Thumbnails horizontales debajo de la imagen principal (fila scrollable). Imagen principal full-width. Swipe para cambiar imagen. |

#### Accesibilidad
- Imagen principal: `alt="[productName] - imagen [n] de [total]"`
- Thumbnails: `role="tablist"`, cada thumbnail: `role="tab"`, `aria-selected`, `aria-label="Ver imagen [n]"`
- Lightbox: `role="dialog"`, `aria-modal="true"`, focus trap, Escape para cerrar
- Keyboard: flechas izquierda/derecha para cambiar thumbnail

---

### 12. Componente: Contact Form

**Cubre**: REQ-182 a REQ-192 (fabricantes), REQ-197 a REQ-205 (general), DEMO-021, DEMO-022
**Bootstrap base**: `form-control`, `form-label`, `form-select`, `btn`

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `variant` | `'general' \| 'manufacturer'` | Si | Tipo de formulario |
| `currentLang` | `'es' \| 'en'` | Si | Idioma activo |
| `prefillProduct` | `string \| null` | No | Producto pre-seleccionado (REQ-198) |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onSubmit` | `FormData` | Datos del formulario |
| `onSuccess` | `void` | Envio exitoso |
| `onError` | `string` | Mensaje de error |

#### Campos por Variante

**Variante `general`** (REQ-197):
1. Nombre* (text)
2. Correo electronico* (email)
3. Telefono (tel)
4. Tipo de consulta* (select: Informacion de productos, Condiciones comerciales, Soporte, Otro)
5. Producto de interes (text, pre-fill si viene de detalle)
6. Mensaje* (textarea)

**Variante `manufacturer`** (REQ-182):
1. Nombre de la empresa* (text)
2. Pais de origen* (select)
3. Nombre del contacto* (text)
4. Correo electronico* (email)
5. Telefono (tel)
6. Tipo de productos (text)
7. Mensaje* (textarea)
8. Checkbox de aceptacion de terminos*

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Campos con label arriba (Inter Medium 14px #1F2937, campo requerido: asterisco rojo `*` despues del label). Input: fondo blanco, borde 1px #E5E7EB, border-radius 10px, height 44px, font-size 16px, padding 12px 16px. Textarea: height 120px. Layout: 2 columnas para campos cortos en desktop (nombre + email, telefono + tipo), full-width para textarea. Gap entre campos: 20px. Boton submit: fondo #008DC9, color blanco, border-radius 8px, padding 14px 32px, font-weight 600, font-size 16px, full-width en mobile. |
| **Focus campo** | Borde: 2px #008DC9. `box-shadow: 0 0 0 3px rgba(0,141,201,0.15)`. Label: color #008DC9. `transition: border 0.15s ease-out`. |
| **Filled** | Borde: 1px #E5E7EB (vuelve a default). Texto: #1F2937. |
| **Error** | Borde: 2px #EF4444. Mensaje error debajo del campo: Inter Regular 13px #EF4444, con icono exclamacion 14px a la izquierda. Ej: "El correo electronico no es valido" (no solo "campo requerido"). Validacion post-blur (REQ-185, REQ-247). |
| **Disabled** | Fondo: #F5F7FA. Texto: #6B7280. Cursor: not-allowed. |
| **Submit loading** | Boton: fondo #007AB8 (ligeramente mas oscuro), spinner blanco 18px a la izquierda del texto "Enviando...", `pointer-events: none` (REQ-190, REQ-203). |
| **Submit success** | Formulario reemplazado por mensaje de confirmacion: icono checkmark verde #22C55E 48px, titulo bold 20px "Mensaje enviado", descripcion 16px #6B7280 "Nos pondremos en contacto pronto." Fondo suave #DCFCE7 con border-radius 12px, padding 40px (REQ-186, REQ-200). Campos se limpian. |
| **Submit error** | Toast rojo en esquina superior derecha (delegado al componente Toast). Formulario mantiene datos ingresados (REQ-204). Boton vuelve a estado default con texto "Reintentar envio". |
| **Hover boton submit** | Fondo: #007AB8 (hover oscuro). `transition: 0.2s ease-out`. |

#### Responsive
| Breakpoint | Comportamiento |
|---|---|
| **Desktop** | 2 columnas para campos cortos, textarea full-width. |
| **Mobile** | 1 columna, todos los campos stacked. Boton submit full-width. |

#### Accesibilidad
- Labels asociados con `for`/`id` a cada campo
- Campos requeridos: `aria-required="true"`, asterisco visual
- Errores: `aria-describedby="[field]-error"`, `aria-invalid="true"`, errores anunciados a screen readers
- Submit button: `aria-disabled="true"` cuando esta enviando
- Proteccion anti-spam con honeypot (campo oculto con `aria-hidden="true"`)
- Tab order logico: campos en orden -> submit

---

### 13. Componente: Brand Card (Sitio Publico)

**Cubre**: REQ-145 a REQ-146, DEMO-018
**Patron de referencia**: Derivado de T&P Patron #3

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `brand` | `BrandCardData` | Si | Datos de la marca |
| `currentLang` | `'es' \| 'en'` | Si | Idioma activo |

```typescript
interface BrandCardData {
  id: string;
  slug: string;
  logo: string | null;
  name: string;
  country: string;
  categoryBadges: CategoryBadge[]; // Farmacos, Alimentos, Equipos
}

interface CategoryBadge {
  category: 'farmacos' | 'alimentos' | 'equipos';
  label: string;
}
```

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Card fondo blanco, border-radius 12px, sombra `0 1px 3px rgba(0,0,0,0.08)`. Logo centrado: 120x80px, object-fit contain, fondo #F5F7FA, border-radius 8px, padding 16px. Nombre: Inter Bold 18px #1F2937, centrado. Pais: Inter Regular 14px #6B7280, centrado, con icono bandera o globo 14px. Badges de categorias: fila centrada, gap 6px. Badge Farmacos: fondo #E8F4FD, texto #008DC9, border-radius 12px, padding 4px 10px, font-size 12px, font-weight 500. Badge Alimentos: fondo #EDF7E8, texto #22C55E. Badge Equipos: fondo #F0F2F5, texto #6B7280. Padding card: 24px. |
| **Hover** | `transform: scale(1.02)`. Sombra: `0 4px 12px rgba(0,0,0,0.12)`. `transition: all 0.3s ease-out`. |
| **Focus** | Outline: `2px solid #008DC9`, `outline-offset: 2px`. |
| **Loading** | Skeleton shimmer: logo placeholder, titulo placeholder, badges placeholder. |
| **Sin logo** | Placeholder: fondo #F5F7FA, letra inicial del nombre en 48px bold #E5E7EB centrada. |

#### Responsive
| Breakpoint | Comportamiento |
|---|---|
| **Desktop** | Grid 3-4 columnas. |
| **Tablet** | Grid 2 columnas. |
| **Mobile** | Grid 1-2 columnas. |

#### Accesibilidad
- Card clickable: `<a>` con `aria-label="Ver marca [nombre]"`
- Logo: `alt="Logo de [nombre]"`
- Badges: texto semantico legible (no solo color)

---

### 14. Componente: Category Block

**Cubre**: REQ-051 a REQ-056, DEMO-005
**Patron de referencia**: T&P Patron #2 (Bloques storytelling con color)

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `category` | `'farmacos' \| 'alimentos' \| 'equipos'` | Si | Categoria |
| `title` | `string` | Si | Titulo del bloque |
| `description` | `string` | Si | Parrafo descriptivo |
| `benefits` | `{ icon: string, text: string }[]` | Si | 3 beneficios con iconos |
| `ctaText` | `string` | Si | Texto del CTA |
| `ctaUrl` | `string` | Si | URL del CTA |
| `image` | `string` | Si | URL de la imagen |
| `imagePosition` | `'left' \| 'right'` | Si | Posicion de la imagen (alternancia) |
| `currentLang` | `'es' \| 'en'` | Si | Idioma activo |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onCtaClick` | `string` | Navega al catalogo filtrado |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Bloque full-width. Border-radius: 24px. Padding: 72px desktop, 48px mobile. Fondo por categoria: Farmacos=#E8F4FD, Alimentos=#EDF7E8, Equipos=#F0F2F5. Layout 50/50: texto (titulo Inter Bold 36px #1F2937 + parrafo 16px #6B7280 line-height 1.7 + 3 beneficios con icono checkmark #50B92A 20px + texto 15px #1F2937 cada uno, gap 12px) y imagen (border-radius 16px, object-fit cover, max-height 400px). CTA: boton outline #008DC9, border-radius 8px, padding 12px 28px, font-weight 600, margin-top 24px. Alternancia: bloque 1 imagen derecha, bloque 2 imagen izquierda, bloque 3 imagen derecha (REQ-054). Gap entre bloques: 32px. |
| **Hover CTA** | Fondo #008DC9, texto blanco. `transition: 0.2s ease-out`. |
| **Scroll fade-in** | Bloque aparece al entrar en viewport con Intersection Observer. Animacion: `opacity 0 -> 1, translateY(30px) -> 0` en `0.6s cubic-bezier(0.4, 0, 0.2, 1)`. Threshold: 0.2 (cuando el 20% del bloque es visible). |
| **Loading** | Skeleton del bloque: forma redondeada con shimmer, mismas dimensiones. |
| **Focus CTA** | Outline `2px solid #008DC9`, `outline-offset: 2px`. |

#### Responsive
| Breakpoint | Comportamiento |
|---|---|
| **Desktop (>= 1024px)** | 2 columnas 50/50. Imagen y texto lado a lado con alternancia. |
| **Tablet (768px - 1023px)** | 2 columnas pero mas compactas: 45/55. Padding: 48px. |
| **Mobile (< 768px)** | 1 columna. Imagen arriba, texto debajo (REQ-055). Padding: 32px. Border-radius: 16px. |

#### Accesibilidad
- Imagen: `alt` descriptivo del contexto (no generico)
- Iconos de beneficios: decorativos (`aria-hidden="true"`), texto provee contexto
- CTA: texto descriptivo "Ver Farmacos" (no "Ver mas")
- Contrastes: texto #1F2937 sobre fondos claros = ~12:1 (excelente)

---

### 15. Componente: Value Stat

**Cubre**: REQ-062 a REQ-065, DEMO-007
**Patron de referencia**: Count-up animado

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `icon` | `string` | Si | Nombre del icono (Lucide/Heroicons) |
| `number` | `string` | Si | Numero/dato destacado (ej: "37+", "100%") |
| `numericValue` | `number \| null` | No | Valor numerico para count-up (null si no aplica) |
| `suffix` | `string` | No | Sufijo ("+", "%", etc.) |
| `label` | `string` | Si | Texto descriptivo |
| `currentLang` | `'es' \| 'en'` | Si | Idioma activo |

#### Eventos / Outputs
Ninguno (componente de presentacion).

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default (pre-scroll)** | Numero: "0" (pre-animacion). Icono: outline/stroke #50B92A, 32px, en circulo decorativo de 56px con fondo `rgba(80, 185, 42, 0.1)`. Numero: Inter Bold 42px #1F2937. Label: Inter Regular 15px #6B7280, max 2 lineas. Centrado verticalmente. Padding: 24px. |
| **Animado (in-viewport)** | Numero hace count-up de 0 al valor final en `1.5s cubic-bezier(0.4, 0, 0.2, 1)`. Sufijo aparece al final. Intersection Observer trigger con threshold 0.5. |
| **Post-animacion** | Numero fijo en su valor final. No re-anima al re-entrar viewport. |
| **Loading** | Skeleton: circulo placeholder + linea numero + linea label. |

#### Responsive
| Breakpoint | Comportamiento |
|---|---|
| **Desktop** | 4 en fila horizontal, fondo #F5F7FA. Seccion full-width con padding 80px vertical. |
| **Tablet** | 2x2 grid. |
| **Mobile** | 2x2 grid o 1 columna. Numero reduce a 36px. |

#### Accesibilidad
- Icono: `aria-hidden="true"` (decorativo, el label provee contexto)
- Numero: `aria-label="[valor completo] [label]"` para screen readers que no ven la animacion

---

### 16. Componente: Brand Logos Row

**Cubre**: REQ-057 a REQ-061, DEMO-006
**Patron de referencia**: T&P logos grayscale

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `brands` | `{ logo: string, name: string, slug: string }[]` | Si | Marcas destacadas (max 6-8) |
| `title` | `string` | Si | Titulo de la seccion |
| `viewAllText` | `string` | Si | Texto del link "Ver todas" |
| `viewAllUrl` | `string` | Si | URL del link |
| `currentLang` | `'es' \| 'en'` | Si | Idioma activo |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onBrandClick` | `string` | Navega a pagina individual de la marca |
| `onViewAllClick` | `void` | Navega a listado de marcas |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Titulo centrado: Inter Bold 36px #1F2937. Debajo: fila horizontal de logos centrada, gap 48px, cada logo ~120px de ancho, height auto. Logos en escala de grises: `filter: grayscale(100%) opacity(0.6)`. Link "Ver todas las marcas" centrado debajo: Inter Medium 15px #008DC9, hover underline. Padding seccion: 64px vertical. Fondo: blanco. |
| **Hover logo** | `filter: grayscale(0%) opacity(1)` (color completo). `transition: filter 0.3s ease-out`. |
| **Focus logo** | Outline `2px solid #008DC9`, `outline-offset: 4px`. |
| **Loading** | Skeleton: rectangulos grises placeholder donde iran los logos. |

#### Responsive
| Breakpoint | Comportamiento |
|---|---|
| **Desktop** | 6-8 logos en fila, gap 48px. |
| **Tablet** | 4 logos en fila, gap 32px. Segundo fila si > 4. |
| **Mobile** | 3 logos en fila x 2 filas, gap 24px. Logos reducen a ~80px de ancho. |

#### Accesibilidad
- Cada logo: `<a>` con `alt="Logo de [nombre de marca]"`, `aria-label="Ver productos de [nombre]"`
- Fila: `role="list"`, logos: `role="listitem"`

---

### 17. Componente: Team Member Card

**Cubre**: REQ-172 a REQ-173c, DEMO-020

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `member` | `{ photo: string, name: string, title: string }` | Si | Datos del miembro |
| `currentLang` | `'es' \| 'en'` | Si | Idioma activo |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Foto circular: 160px diametro, `object-fit: cover`, borde 4px blanco, sombra `0 2px 8px rgba(0,0,0,0.1)`. Nombre: Inter Bold 18px #1F2937, centrado, margin-top 16px. Cargo: Inter Regular 14px #6B7280, centrado. |
| **Hover** | Foto: sombra aumenta a `0 4px 16px rgba(0,0,0,0.15)`, `transition: 0.3s ease-out`. Subtle scale: `transform: scale(1.03)`. |
| **Loading** | Skeleton: circulo gris shimmer + lineas de texto placeholder. |
| **Sin foto** | Placeholder: circulo fondo #F5F7FA con icono persona 48px #E5E7EB centrado. |

#### Responsive
| Breakpoint | Comportamiento |
|---|---|
| **Desktop** | Grid 3 columnas, gap 40px. |
| **Tablet** | Grid 2 columnas. |
| **Mobile** | Grid 1 columna (REQ-173c). Foto reduce a 120px. |

#### Accesibilidad
- Foto: `alt="Foto de [nombre], [cargo]"`
- Card no interactiva (solo presentacion), no necesita role de boton

---

### 18. Componente: Timeline

**Cubre**: REQ-177 a REQ-178, DEMO-021

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `steps` | `{ number: number, title: string, description: string, icon: string }[]` | Si | Pasos del timeline (4 pasos) |
| `currentLang` | `'es' \| 'en'` | Si | Idioma activo |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default (desktop)** | Horizontal: 4 nodos equidistantes conectados por linea. Nodo: circulo 56px, fondo #008DC9, numero blanco bold 20px. Linea conectora: 2px #E5E7EB entre nodos, centrada verticalmente. Debajo de cada nodo: titulo Inter Bold 16px #1F2937 + descripcion 14px #6B7280, centrado, max-width 200px. |
| **Scroll animation** | Al entrar viewport, cada nodo aparece secuencialmente con delay incremental de 200ms. Animacion: `opacity 0 -> 1, scale(0.5) -> scale(1)` en `0.4s cubic-bezier(0.4, 0, 0.2, 1)`. Linea conectora crece de izquierda a derecha: `width 0 -> 100%` en `0.3s ease-out`, delay despues del nodo correspondiente. |
| **Default (mobile)** | Vertical: nodos apilados con linea vertical a la izquierda. Nodo: circulo 48px, linea vertical 2px #E5E7EB. Texto a la derecha del nodo, alineado a la izquierda. |
| **Loading** | Skeleton horizontal/vertical segun breakpoint. |

#### Responsive
| Breakpoint | Comportamiento |
|---|---|
| **Desktop (>= 768px)** | Horizontal con nodos equidistantes (REQ-178). |
| **Mobile (< 768px)** | Vertical con nodos a la izquierda y texto a la derecha (REQ-178). |

#### Accesibilidad
- `role="list"`, cada paso: `role="listitem"`
- Numeros en nodos: `aria-label="Paso [n]: [titulo]"`

---

### Componente Adicional: Sticky Bar (Sitio Publico)

**Cubre**: REQ-130 a REQ-134, DEMO-015
**Patron de referencia**: T&P Patron #4

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `product` | `{ image: string, name: string, brandName: string }` | Si | Datos del producto |
| `isVisible` | `boolean` | Si | Controlado por Intersection Observer |
| `ctaText` | `string` | Si | Texto del CTA |
| `ctaUrl` | `string` | Si | URL de contacto |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Hidden** | No visible. `transform: translateY(-100%)` (desktop) o `translateY(100%)` (mobile). |
| **Visible (desktop)** | `position: fixed; top: 0; z-index: 998`. Fondo #005A85. Altura 60px. Contenido: thumbnail 40px border-radius 6px + nombre Inter Bold 16px blanco + marca Inter Regular 14px `rgba(255,255,255,0.7)` + boton "Solicitar informacion" fondo #008DC9 border-radius 6px padding 8px 20px. Animacion entrada: `translateY(-100%) -> 0` en `0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)`. Sombra: `0 2px 8px rgba(0,0,0,0.15)`. |
| **Visible (mobile)** | `position: fixed; bottom: 0; z-index: 998`. Fondo blanco. Borde-top: 1px #E5E7EB. Altura 64px. Contenido: nombre Inter Bold 14px #1F2937 truncado + marca 12px #6B7280 + boton "Solicitar info" fondo #008DC9 full-width restante. Padding: 12px 20px. Animacion entrada: `translateY(100%) -> 0` en `0.3s`. Sombra: `0 -2px 8px rgba(0,0,0,0.1)`. |
| **No obstruye** | No causa salto de layout (REQ-134): aparece sobre el contenido, no lo empuja. |

#### Accesibilidad
- `role="complementary"`, `aria-label="Barra de accion del producto"`
- CTA: `aria-label="Solicitar informacion sobre [nombre del producto]"`
- Contraste: texto blanco sobre #005A85 = ~5.7:1 (cumple AA)

---

### Componente Adicional: Manufacturer CTA Banner

**Cubre**: REQ-074 a REQ-077, DEMO-009

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `title` | `string` | Si | Titulo del banner |
| `description` | `string` | Si | Texto descriptivo |
| `ctaText` | `string` | Si | Texto del boton |
| `ctaUrl` | `string` | Si | URL a Distribuidores |
| `currentLang` | `'es' \| 'en'` | Si | Idioma activo |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Full-width. Fondo #008DC9. Padding 80px vertical. Contenido centrado max-width 800px. Titulo: Inter Bold 36px blanco. Descripcion: 16px `rgba(255,255,255,0.85)`, line-height 1.7, margin-top 16px. CTA: fondo blanco, texto #008DC9, border-radius 8px, padding 14px 32px, font-weight 600, margin-top 32px. `transition: all 0.2s ease-out`. |
| **Hover CTA** | Fondo: #F5F7FA. `box-shadow: 0 4px 12px rgba(0,0,0,0.15)`. |
| **Mobile** | Padding 48px 20px. Titulo: 28px. CTA: full-width. |

#### Accesibilidad
- Contraste: texto blanco sobre #008DC9 = ~3.8:1 (cumple AA para texto grande 36px bold). Descripcion a 16px usar `rgba(255,255,255,0.85)` minimo -> verificar con #007AB8 si necesario.

---

### Componente Adicional: Species Badges

**Cubre**: REQ-112

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `species` | `{ key: string, label: string, icon: string }[]` | Si | Especies de destino |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Fila horizontal de badges en franja fondo #F5F7FA, border-radius 8px, padding 12px 16px. Cada badge: icono 18px #6B7280 + label 13px #1F2937, font-weight 500. Gap entre badges: 12px. |

---

### Componente Adicional: Presentation Pills

**Cubre**: REQ-114 a REQ-116
**Gap resuelto**: GAP-D03 (pills toggle, no checkboxes)

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `presentations` | `{ value: string, label: string }[]` | Si | Presentaciones disponibles |
| `selectedValue` | `string \| null` | No | Presentacion seleccionada |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onSelect` | `string` | Presentacion seleccionada |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default (unselected)** | Pill: borde 1px #E5E7EB, fondo blanco, border-radius 25px, padding 8px 16px, font-size 14px, font-weight 500, color #1F2937. |
| **Selected** | Fondo #E8F4FD. Borde 1px #008DC9. Color #008DC9. |
| **Hover (unselected)** | Borde #008DC9 1px, fondo #F5F7FA. `transition: 0.15s ease-out`. |
| **Focus** | Outline `2px solid #008DC9`, `outline-offset: 2px`. |

#### Accesibilidad
- `role="radiogroup"`, `aria-label="Presentaciones disponibles"`
- Cada pill: `role="radio"`, `aria-checked="true/false"`
- Keyboard: Tab para entrar al grupo, flechas para navegar, Space/Enter para seleccionar

---

### Componente Adicional: Product CTAs

**Cubre**: REQ-117 a REQ-120

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `productName` | `string` | Si | Nombre del producto |
| `contactUrl` | `string` | Si | URL formulario contacto |
| `whatsappNumber` | `string` | Si | Numero WhatsApp |
| `pdfUrl` | `string \| null` | No | URL ficha tecnica (null si no hay) |
| `currentLang` | `'es' \| 'en'` | Si | Idioma activo |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Stack vertical de 3 botones (max 2 si no hay PDF): (1) Primario "Solicitar informacion": fondo #008DC9, texto blanco, border-radius 8px, padding 14px 0, full-width, font-weight 600, 16px. (2) "Consultar por WhatsApp": fondo #25D366, texto blanco, icono WhatsApp 18px a la izquierda, mismas dimensiones. (3) "Descargar ficha tecnica": outline #008DC9, texto #008DC9, icono documento 18px (solo si `pdfUrl` no es null, REQ-119/120). Gap: 12px. |
| **Hover** | Primario: fondo #007AB8. WhatsApp: fondo #20BD5A. PDF: fondo #E8F4FD. `transition: 0.2s ease-out`. |
| **Focus** | Outline `2px solid #1F2937`, `outline-offset: 2px`. |

#### Accesibilidad
- Cada boton: `aria-label` descriptivo incluyendo nombre del producto
- Boton PDF: `aria-label="Descargar ficha tecnica de [producto] en PDF"`

---

## PARTE 2: COMPONENTES DEL PANEL DE ADMINISTRACION

---

### 1. Componente: Summary Card (Panel)

**Cubre**: REQ-206 a REQ-207, DEMO-027
**Patron de referencia**: Dashly Patron #8

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `icon` | `string` | Si | Nombre del icono |
| `iconBgColor` | `string` | Si | Color de fondo del circulo del icono (ej: #EBF5FF) |
| `iconColor` | `string` | Si | Color del icono (ej: #008DC9) |
| `value` | `number \| string` | Si | Numero/dato principal |
| `label` | `string` | Si | Label descriptivo |
| `badge` | `{ text: string, color: 'success' \| 'warning' \| 'danger' } \| null` | No | Badge de cambio (ej: "+3 nuevos") |
| `isClickable` | `boolean` | No | Si es clickable (cards de categoria) |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onClick` | `void` | Click en la card (si `isClickable`) |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Card fondo blanco. Border-radius: 16px. Sombra: `0 1px 3px rgba(0,0,0,0.08)`. Padding: 20px. Icono: circulo 48px con fondo de color suave (ej: #EBF5FF) + icono 24px en color fuerte (ej: #008DC9), centrado. Label: Inter Regular 14px #6B7280, arriba o debajo del icono. Valor: Inter Bold 28px #1F2937. Badge (si hay): pill 12px, border-radius 12px, padding 2px 8px, colores semanticos. Layout: icono izq + contenido der, o icono arriba + contenido debajo. |
| **Hover (si clickable)** | Sombra: `0 4px 12px rgba(0,0,0,0.12)`. Cursor pointer. `transition: 0.2s ease-out`. |
| **Loading** | Skeleton: circulo + linea numero + linea label. |
| **Error** | Card con borde izquierdo 4px #EF4444. Contenido: icono exclamacion + "Error al cargar" + boton "Reintentar" link (REQ-211). |
| **Focus** | Outline `2px solid #008DC9`, `outline-offset: 2px`. |

#### Responsive
| Breakpoint | Comportamiento |
|---|---|
| **Desktop (>= 1280px)** | 4 en fila. |
| **Tablet (768px - 1279px)** | 2x2 grid. |
| **Mobile (< 768px)** | 2x2 grid compacto. Padding reduce a 16px. |

---

### 2. Componente: Category Card Admin

**Cubre**: REQ-207, REQ-208, DEMO-027
**Patron de referencia**: Dashly Patron #15

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `category` | `'farmacos' \| 'alimentos' \| 'equipos'` | Si | Categoria |
| `icon` | `string` | Si | Nombre del icono |
| `iconBgColor` | `string` | Si | Color fondo circulo |
| `iconColor` | `string` | Si | Color icono |
| `barColor` | `string` | Si | Color de la barra de progreso |
| `activeCount` | `number` | Si | Productos activos |
| `totalCount` | `number` | Si | Total productos |
| `label` | `string` | Si | Nombre de la categoria |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onClick` | `string` | Navega al listado filtrado por categoria |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Card fondo blanco, border-radius 16px, sombra `0 1px 3px rgba(0,0,0,0.08)`, padding 20px. Icono en circulo decorativo 48px (fondo suave + icono color fuerte). Label: Inter Semibold 16px #1F2937. Barra de progreso: altura 6px, border-radius 3px, fondo #E5E7EB. Relleno: color segun categoria (Farmacos #008DC9, Alimentos #22C55E, Equipos #6B7280), ancho = (activeCount/totalCount * 100)%. Texto debajo: "[activeCount] de [totalCount] activos" en 13px #6B7280. |
| **Hover** | Sombra `0 4px 12px rgba(0,0,0,0.12)`. Cursor pointer. `transition: 0.2s ease-out`. |
| **Focus** | Outline `2px solid #008DC9`. |

#### Responsive
- 3 en fila desktop, 3 en fila tablet, 1 columna mobile.

---

### 3. Componente: View Toggle

**Cubre**: REQ-226, DEMO-028, DEMO-031
**Patron de referencia**: Dashly Patron #14

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `activeView` | `'card' \| 'table'` | Si | Vista activa (default: 'card') |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onViewChange` | `'card' \| 'table'` | Cambia vista |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Dos botones pill lado a lado. Activo: fondo #008DC9, texto blanco, icono (grid para card / lista para table) 16px. Inactivo: fondo blanco, borde 1px #E5E7EB, texto #6B7280. Border-radius del grupo: 24px. Height: 36px. Padding por boton: 8px 16px. `transition: background 0.2s ease-out`. |
| **Hover inactivo** | Fondo #F5F7FA. |
| **Focus** | Outline `2px solid #008DC9` en el boton enfocado. |

#### Accesibilidad
- `role="tablist"`, cada boton: `role="tab"`, `aria-selected="true/false"`
- `aria-label="Cambiar vista"` / `"Toggle view"`

---

### 4. Componente: Product Card Admin

**Cubre**: REQ-227 a REQ-229, DEMO-028
**Patron de referencia**: Dashly Patron #9

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `product` | `AdminProductCardData` | Si | Datos del producto |

```typescript
interface AdminProductCardData {
  id: string;
  image: string | null;
  name: string;
  brandName: string;
  category: 'farmacos' | 'alimentos' | 'equipos';
  categoryLabel: string;
  status: 'active' | 'inactive';
  statusLabel: string;
}
```

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onEdit` | `string` | Navega a editar producto |
| `onView` | `string` | Navega a detalle |
| `onViewSite` | `string` | Abre producto en sitio publico |
| `onDuplicate` | `string` | Duplica el producto |
| `onToggleStatus` | `string` | Activa/desactiva producto |
| `onDelete` | `string` | Solicita eliminar (abre confirm modal) |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Card fondo blanco. Border-radius: 16px. Sombra: `0 1px 3px rgba(0,0,0,0.08)`. Imagen: aspect-ratio 1:1, fondo #F5F7FA, object-fit contain, padding 12px, border-radius-top 16px. Contenido: padding 16px. Nombre: Inter Bold 16px #1F2937, max 2 lineas. Marca: Inter Regular 14px #6B7280. Badges en fila: badge categoria (pill, colores segun tipo: Farmaco fondo #EBF5FF texto #008DC9, Alimento fondo #DCFCE7 texto #22C55E, Equipo fondo #F0F2F5 texto #6B7280, border-radius 12px, padding 3px 10px, font-size 12px, font-weight 500) + badge estado (Activo: fondo #DCFCE7 texto #22C55E, Inactivo: fondo #FEE2E2 texto #EF4444, misma forma). Menu 3 puntos: boton 32px en esquina superior derecha de la imagen, fondo `rgba(255,255,255,0.9)`, border-radius 6px. |
| **Hover** | Sombra: `0 4px 12px rgba(0,0,0,0.12)`. Borde mas visible: 1px #E5E7EB -> 1px #008DC9. `transition: 0.2s ease-out`. |
| **Menu 3 puntos abierto** | Dropdown: fondo blanco, sombra `0 8px 24px rgba(0,0,0,0.12)`, border-radius 8px, min-width 180px. Items: padding 10px 16px, icono 16px + texto 14px. Hover item: fondo #F5F7FA. "Eliminar": texto #EF4444, icono trash #EF4444. Items: Editar, Ver detalle, Ver en sitio, Duplicar, Desactivar/Activar, Eliminar (REQ-228). Separador antes de "Eliminar": 1px #E5E7EB. |
| **Sin imagen** | Placeholder: fondo #F5F7FA, icono de categoria centrado 40px #E5E7EB (REQ-233). |
| **Loading** | Skeleton shimmer completo. |
| **Focus** | Outline `2px solid #008DC9`. |

#### Responsive
| Breakpoint | Comportamiento |
|---|---|
| **Desktop (>= 1280px)** | Grid 3 columnas, gap 24px (REQ-230). |
| **Tablet (1024px - 1279px)** | Grid 2 columnas. |
| **Mobile (< 768px)** | Grid 1 columna. |

#### Accesibilidad
- Card: `role="article"`, `aria-label="Producto: [nombre]"`
- Menu 3 puntos: `aria-haspopup="true"`, `aria-expanded`, dropdown: `role="menu"`, items: `role="menuitem"`
- Badges: texto leible (no solo color, anti-patron #18)
- Keyboard: Tab para navegar cards, Enter para abrir detalle, menu 3 puntos con Enter/Space

---

### 5. Componente: Data Table

**Cubre**: REQ-229, REQ-293, DEMO-028
**Patron de referencia**: Dashly Patron #10
**Bootstrap base**: `table`, `table-hover`

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `columns` | `TableColumn[]` | Si | Definicion de columnas |
| `data` | `any[]` | Si | Datos de las filas |
| `sortable` | `boolean` | No | Habilitar sort (default: true) |
| `selectable` | `boolean` | No | Habilitar checkboxes |
| `pagination` | `{ page: number, total: number, perPage: number }` | No | Configuracion de paginacion |
| `actions` | `TableAction[]` | No | Acciones por fila |

```typescript
interface TableColumn {
  key: string;
  label: string;         // Texto del header
  type: 'text' | 'image' | 'badge' | 'badges' | 'date' | 'actions';
  sortable?: boolean;
  width?: string;
}

interface TableAction {
  icon: string;
  label: string;
  action: string;
  variant?: 'default' | 'danger';
}
```

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onSort` | `{ column: string, direction: 'asc' \| 'desc' }` | Cambia orden |
| `onRowClick` | `any` | Click en fila |
| `onAction` | `{ action: string, item: any }` | Accion ejecutada |
| `onPageChange` | `number` | Cambio de pagina |
| `onSelectionChange` | `any[]` | Items seleccionados |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Contenedor: fondo blanco, border-radius 16px, sombra `0 1px 3px rgba(0,0,0,0.08)`, overflow hidden. Headers: UPPERCASE Inter Semibold 12px #6B7280, letter-spacing 0.08em, padding 14px 16px, fondo #F7F8FA, borde inferior 2px #E5E7EB. Iconos sort: chevron gris 12px a la derecha del label. Filas: height 52px, padding 12px 16px, borde inferior 1px #E5E7EB. Texto: Inter Regular 14px #1F2937. Texto secundario: 14px #6B7280. Imagen miniatura: 40x40px, border-radius 6px, fondo #F5F7FA. Badges: pills con colores semanticos (mismo patron que Product Card Admin). Acciones: iconos 18px (ojo #6B7280, lapiz #6B7280, basura #EF4444), gap 8px, hover: fondo #F5F7FA border-radius 4px. Paginacion footer: padding 12px 16px, "Mostrando 1-24 de [total]" a la izquierda + controles pagina a la derecha. |
| **Hover fila** | Fondo: #F7F8FA. `transition: background 0.15s ease-out`. |
| **Sorted column** | Header: color #008DC9. Icono sort: chevron rotado para indicar asc/desc. |
| **Empty** | Delega al componente Empty State. |
| **Loading** | Skeleton: header fijo + 5-8 filas con shimmer. |
| **Focus** | Fila enfocada: outline `2px solid #008DC9` (inset). |

#### Responsive
| Breakpoint | Comportamiento |
|---|---|
| **Desktop** | Tabla clasica con scroll horizontal si necesario. |
| **Mobile (< 768px)** | Transformacion a stacked cards (Decision holistica 10.7): cada fila = bloque vertical. Labels UPPERCASE gris izquierda + valores derecha. Separador entre filas. Acciones como iconos horizontales al final de cada bloque. |

#### Accesibilidad
- `<table role="table">`, `<thead>`, `<tbody>`, `<th scope="col">`
- Sort: `aria-sort="ascending"` / `"descending"` / `"none"`
- Checkboxes: `aria-label="Seleccionar [nombre]"`
- Acciones: `aria-label="[accion] [nombre del item]"`

---

### 6. Componente: Brand Card Admin

**Cubre**: REQ-260, DEMO-031
**Patron de referencia**: Dashly Patron #9 adaptado

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `brand` | `AdminBrandCardData` | Si | Datos de la marca |

```typescript
interface AdminBrandCardData {
  id: string;
  logo: string | null;
  name: string;
  country: string;
  categoryBadges: { category: string, label: string }[];
  productCount: number;
}
```

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onEdit` | `string` | Navega a editar marca |
| `onViewProducts` | `string` | Navega a productos de esta marca |
| `onDelete` | `string` | Solicita eliminar |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Card fondo blanco, border-radius 16px, sombra `0 1px 3px rgba(0,0,0,0.08)`, padding 20px. Logo: 80x80px, object-fit contain, fondo #F5F7FA, border-radius 8px, centrado arriba. Nombre: Inter Bold 16px #1F2937, centrado. Pais: Inter Regular 14px #6B7280, icono globo 14px. Badges categorias: fila centrada (mismos colores que product card admin). Conteo: "[X] productos" en 13px #6B7280. Menu 3 puntos: esquina superior derecha (Editar, Ver productos, Eliminar). |
| **Hover** | Sombra `0 4px 12px rgba(0,0,0,0.12)`, `transition: 0.2s ease-out`. |
| **Sin logo** | Placeholder: letra inicial del nombre en 36px bold #E5E7EB centrada sobre fondo #F5F7FA. |
| **Focus** | Outline `2px solid #008DC9`. |

---

### 7. Componente: Form Field

**Cubre**: REQ-246 a REQ-249
**Patron de referencia**: Dashly Patron #11
**Bootstrap base**: `form-control`, `form-label`, `form-select`, `form-check`

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `type` | `'text' \| 'email' \| 'tel' \| 'number' \| 'textarea' \| 'select' \| 'toggle' \| 'checkbox'` | Si | Tipo de campo |
| `label` | `string` | Si | Label del campo |
| `placeholder` | `string` | No | Placeholder |
| `value` | `any` | Si | Valor actual |
| `required` | `boolean` | No | Campo requerido |
| `error` | `string \| null` | No | Mensaje de error |
| `disabled` | `boolean` | No | Campo deshabilitado |
| `options` | `{ value: string, label: string }[]` | No | Opciones para select |
| `hint` | `string` | No | Texto de ayuda debajo del campo |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onChange` | `any` | Valor cambiado |
| `onBlur` | `void` | Campo pierde foco (trigger validacion) |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Label: Inter Medium 14px #1F2937, margin-bottom 6px. Asterisco rojo `*` para requeridos. Input: fondo blanco, borde 1px #E5E7EB, border-radius 10px, height 44px, padding 0 14px, font-size 15px #1F2937. Textarea: height 120px, padding 12px 14px. Select: mismas dimensiones + chevron derecha. Toggle: switch 44x24px, track gris #E5E7EB, activo #008DC9, circulo blanco 20px. Hint: 13px #6B7280, margin-top 4px. |
| **Focus** | Borde: 2px #008DC9. `box-shadow: 0 0 0 3px rgba(0,141,201,0.15)`. `transition: 0.15s ease-out`. |
| **Filled** | Borde: 1px #E5E7EB. Texto: #1F2937. |
| **Error** | Borde: 2px #EF4444. Label: color #EF4444. Mensaje error debajo: Inter Regular 13px #EF4444, icono exclamacion 14px. `aria-describedby` apuntando al mensaje de error. |
| **Disabled** | Fondo: #F5F7FA. Texto: #6B7280. Borde: 1px #E5E7EB. `cursor: not-allowed`. `opacity: 0.7`. |
| **Loading** | Spinner dentro del input a la derecha, 16px #008DC9. |

#### Accesibilidad
- Label asociado via `for`/`id`
- `aria-required="true"` para campos requeridos
- `aria-invalid="true"` + `aria-describedby="[id]-error"` en estado error
- Toggle: `role="switch"`, `aria-checked="true/false"`
- Height minima 44px para toque (NFR-026)

---

### 8. Componente: Image Uploader

**Cubre**: REQ-243 a REQ-244, REQ-254
**Patron de referencia**: Dashly Patron #11 (upload section)

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `currentImages` | `string[]` | No | URLs de imagenes actuales |
| `maxImages` | `number` | No | Maximo de imagenes (default: 10) |
| `label` | `string` | Si | Label de la seccion |
| `required` | `boolean` | No | Si es requerido |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onUpload` | `File[]` | Archivos seleccionados |
| `onChange` | `string` | Cambiar imagen existente |
| `onRemove` | `string` | Eliminar imagen |
| `onReorder` | `string[]` | Nuevo orden de imagenes |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Empty (sin imagenes)** | Zona drag-drop: borde 2px dashed #E5E7EB, border-radius 12px, fondo #F7F8FA, padding 40px, centrado. Icono upload 40px #6B7280. Texto: "Arrastra imagenes aqui o haz clic para seleccionar" en 14px #6B7280. Subtexto: "PNG, JPG, WebP. Max 5MB por imagen" en 12px #6B7280. |
| **Drag over** | Borde: 2px dashed #008DC9. Fondo: #E8F4FD. `transition: 0.15s ease-out`. |
| **With images** | Grid de previews: thumbnails 120x120px, border-radius 8px, gap 12px. Cada thumbnail: image cover + overlay hover con icono cambiar (lapiz) + eliminar (X rojo) en `rgba(0,0,0,0.5)`. Orden drag-and-drop: cursor grab. Boton "+ Agregar mas" al final del grid: borde dashed, icono "+". Imagen principal marcada con badge "Principal" en esquina superior izquierda. |
| **Uploading** | Progress bar debajo del thumbnail: height 4px, fondo #E5E7EB, relleno #008DC9, animacion de ancho 0% -> 100%. |
| **Error** | Thumbnail con overlay rojo suave. Mensaje: "Error al subir. Reintentar" en 12px #EF4444. |
| **Focus** | Outline `2px solid #008DC9` en la zona drag-drop y en cada thumbnail. |

#### Accesibilidad
- Zona drag-drop: `role="button"`, `aria-label="Subir imagenes"`
- Input file oculto: `aria-hidden="true"`, activado por click en la zona
- Thumbnails: `alt` descriptivo, botones de accion con `aria-label`
- Drag-and-drop: tambien posible con botones "Mover arriba/abajo" para keyboard users

---

### 9. Componente: PDF Uploader

**Cubre**: REQ-243, REQ-245

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `currentFile` | `{ name: string, size: string, url: string } \| null` | No | Archivo actual |
| `label` | `string` | Si | Label de la seccion |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onUpload` | `File` | Archivo seleccionado |
| `onDownload` | `void` | Descargar archivo actual |
| `onRemove` | `void` | Eliminar archivo |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Empty** | Zona drag-drop similar a Image Uploader pero con icono documento. Texto: "Arrastra un PDF aqui". Subtexto: "PDF. Max 10MB". Borde dashed, fondo #F7F8FA. |
| **With file** | Card horizontal: icono PDF rojo 40px + nombre archivo bold 14px + tamano Regular 13px #6B7280. Botones: "Descargar" outline #008DC9 + "Eliminar" outline #EF4444. Border-radius 10px, borde 1px #E5E7EB, padding 16px. |
| **Drag over** | Borde 2px dashed #008DC9, fondo #E8F4FD. |
| **Uploading** | Progress bar. |
| **Error** | Mensaje de error rojo. |

#### Accesibilidad
- Zona drag-drop: `role="button"`, `aria-label="Subir ficha tecnica PDF"`
- Input file: `accept=".pdf"`

---

### 10. Componente: Tag Input

**Cubre**: REQ-272, DEMO-033
**Patron**: Chips/pills editables

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `tags` | `string[]` | Si | Tags actuales |
| `label` | `string` | Si | Label del grupo |
| `placeholder` | `string` | No | Placeholder del input de agregar |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onAdd` | `string` | Agregar tag |
| `onRemove` | `string` | Remover tag (dispara confirm si hay productos asociados) |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Contenedor con borde 1px #E5E7EB, border-radius 10px, padding 8px 12px, min-height 44px. Tags como pills: fondo #F5F7FA, border-radius 16px, padding 4px 12px, font-size 13px #1F2937, font-weight 500. Boton "x" 14px #6B7280 a la derecha de cada tag, hover: #EF4444. Gap entre tags: 8px. Boton "+" al final: circulo 28px, borde 1px dashed #E5E7EB, icono "+" 14px #6B7280. Hover "+": fondo #F5F7FA. |
| **Adding** | Input inline aparece al click en "+": sin borde visible, font-size 13px, auto-focus. Enter para confirmar, Escape para cancelar. |
| **Hover tag** | Boton "x" se vuelve mas visible (opacity 0.5 -> 1). |
| **Focus container** | Outline `2px solid #008DC9` en el contenedor. |

#### Accesibilidad
- Contenedor: `role="listbox"`, `aria-label="[label]"`
- Cada tag: `role="option"`, boton "x": `aria-label="Remover [tag]"`
- Boton "+": `aria-label="Agregar nuevo [label]"`
- Input: `aria-label="Nombre del nuevo [label]"`

---

### 11. Componente: Confirm Modal

**Cubre**: REQ-250, REQ-267, REQ-302, DEMO-029
**Bootstrap base**: `modal`

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `isOpen` | `boolean` | Si | Estado abierto/cerrado |
| `title` | `string` | Si | Titulo del modal |
| `message` | `string` | Si | Mensaje descriptivo |
| `warningMessage` | `string \| null` | No | Advertencia adicional (ej: "Esta marca tiene X productos asociados") |
| `confirmText` | `string` | No | Texto del boton confirmar (default: "Eliminar") |
| `cancelText` | `string` | No | Texto del boton cancelar (default: "Cancelar") |
| `variant` | `'danger' \| 'warning' \| 'info'` | No | Variante visual (default: 'danger') |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onConfirm` | `void` | Accion confirmada |
| `onCancel` | `void` | Accion cancelada |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Open** | Backdrop: `rgba(0,0,0,0.5)`, `z-index: 1050`. Modal centrado: fondo blanco, border-radius 16px, max-width 440px, padding 32px, `box-shadow: 0 8px 24px rgba(0,0,0,0.12)`. Animacion entrada: `opacity 0 -> 1, scale(0.95) -> scale(1)` en `0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)`. Icono: circulo 48px con icono exclamacion. Danger: fondo #FEE2E2, icono #EF4444. Warning: fondo #FEF3C7, icono #F59E0B. Titulo: Inter Bold 18px #1F2937, margin-top 16px. Mensaje: Inter Regular 14px #6B7280, margin-top 8px. Warning message: fondo #FEF3C7, border-radius 8px, padding 12px, 13px #1F2937, icono warning 14px, margin-top 12px. Botones: fila horizontal, gap 12px, margin-top 24px. Cancelar: outline #E5E7EB, texto #6B7280, border-radius 8px, padding 10px 24px. Confirmar (danger): fondo #EF4444, texto blanco, border-radius 8px, padding 10px 24px. |
| **Closing** | Animacion salida: `opacity 1 -> 0, scale(1) -> scale(0.95)` en `0.15s ease-in`. |
| **Focus** | Focus trap dentro del modal. Focus auto en boton "Cancelar" al abrir. |

#### Accesibilidad
- `role="alertdialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"`, `aria-describedby="modal-message"`
- Focus trap: Tab cicla entre botones (Cancelar, Confirmar)
- Escape para cerrar (equivale a Cancelar)
- Auto-focus en boton "Cancelar" (no en "Eliminar" para prevenir acciones accidentales)

---

### 12. Componente: Toast Notification

**Cubre**: REQ-248 a REQ-249, DEMO-029
**Patron de referencia**: Dashly (toast esquina sup-der)

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `message` | `string` | Si | Mensaje del toast |
| `variant` | `'success' \| 'error' \| 'warning' \| 'info'` | Si | Tipo de toast |
| `duration` | `number` | No | Duracion en ms (default: 3000 para success, 0 para error = persistente) |
| `action` | `{ label: string, callback: () => void } \| null` | No | Accion opcional (ej: "Deshacer") |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onDismiss` | `void` | Toast cerrado |
| `onAction` | `void` | Accion ejecutada |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Entering** | Posicion: `fixed`, `top: 24px`, `right: 24px`, `z-index: 1060`. Min-width: 320px, max-width: 440px. Border-radius: 12px. Padding: 16px 20px. Sombra: `0 8px 24px rgba(0,0,0,0.12)`. Animacion entrada: `translateX(100%) -> 0, opacity 0 -> 1` en `0.3s ease-in-out`. Icono 20px + mensaje Inter Regular 14px + boton cerrar "X" 16px. |
| **Success** | Fondo #DCFCE7. Borde izquierdo 4px #22C55E. Icono checkmark #22C55E. Texto #1F2937. Auto-dismiss 3s. |
| **Error** | Fondo #FEE2E2. Borde izquierdo 4px #EF4444. Icono X circulo #EF4444. Texto #1F2937. Persistente (no auto-dismiss). Boton cerrar visible. |
| **Warning** | Fondo #FEF3C7. Borde izquierdo 4px #F59E0B. Icono exclamacion #F59E0B. Texto #1F2937. |
| **Info** | Fondo #EBF5FF. Borde izquierdo 4px #008DC9. Icono info #008DC9. Texto #1F2937. |
| **With action** | Boton de accion: texto #008DC9, font-weight 600, sin fondo, padding 4px 8px, a la derecha del mensaje. |
| **Dismissing** | Animacion salida: `translateX(0) -> translateX(100%), opacity 1 -> 0` en `0.2s ease-in`. |
| **Stacked** | Multiples toasts se apilan verticalmente con gap 8px. Maximo 3 visibles simultaneamente. |

#### Accesibilidad
- `role="alert"`, `aria-live="polite"` (success/info) o `aria-live="assertive"` (error/warning)
- Boton cerrar: `aria-label="Cerrar notificacion"`
- Progress bar visual para auto-dismiss: barra de progreso debajo del toast, `width: 100% -> 0%` en `duration`ms, colores segun variante

---

### 13. Componente: Kanban Board

**Cubre**: REQ-289 a REQ-292, DEMO-039
**Patron de referencia**: Dashly Patron #13

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `columns` | `KanbanColumn[]` | Si | Columnas del board |
| `onCardMove` | `(cardId: string, fromColumn: string, toColumn: string) => void` | Si | Callback de movimiento |

```typescript
interface KanbanColumn {
  id: string;               // 'new' | 'in_progress' | 'resolved'
  title: string;             // 'NUEVOS' | 'EN PROCESO' | 'ATENDIDOS'
  count: number;
  cards: KanbanCard[];
}

interface KanbanCard {
  id: string;
  typeBadge: { label: string, bgColor: string, textColor: string };
  contactName: string;
  contactEmail: string;
  messagePreview: string;  // Max 2 lineas
  date: string;
  productName?: string;     // Si aplica
}
```

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onCardClick` | `string` | Navega a detalle del mensaje |
| `onCardDrop` | `{ cardId: string, fromColumn: string, toColumn: string }` | Card movida |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | 3 columnas equidistantes, gap 24px. Header columna: UPPERCASE Inter Semibold 12px #6B7280, letter-spacing 0.08em + conteo en parentesis "(3)". Fondo columna: #F7F8FA, border-radius 12px, padding 16px. Cards dentro: fondo blanco, border-radius 12px, sombra `0 1px 3px rgba(0,0,0,0.08)`, padding 16px, margin-bottom 12px. Badge tipo: pill border-radius 12px, padding 3px 10px, font-size 12px. Colores por tipo (REQ-296): Informacion fondo #EBF5FF texto #008DC9, Comercial fondo #DCFCE7 texto #22C55E, Soporte fondo #FEF3C7 texto #F59E0B, Fabricante fondo #EDE9FE texto #7C3AED, Otro fondo #F0F2F5 texto #6B7280. Nombre: Inter Bold 14px #1F2937. Email: 13px #6B7280. Preview: 13px #6B7280, max 2 lineas, text-overflow ellipsis. Fecha: 12px #6B7280 esquina inferior derecha. Product badge: pill outline 12px si aplica. SIN avatares (no hay usuarios asignados). |
| **Dragging** | Card levantada: sombra `0 8px 24px rgba(0,0,0,0.15)`, `transform: rotate(2deg)`, `opacity: 0.9`. Columna destino: borde 2px dashed #008DC9, fondo #E8F4FD suave. Placeholder en posicion original: borde 2px dashed #E5E7EB, fondo transparent. |
| **Drop** | Card se posiciona con `transition: all 0.2s ease-out`. Efecto ripple sutil en columna destino. |
| **Empty column** | Texto centrado: "No hay mensajes [estado]" en 14px #6B7280 italic. |
| **Hover card** | Sombra: `0 4px 12px rgba(0,0,0,0.12)`. `transition: 0.15s ease-out`. Cursor pointer. |
| **Loading** | Skeleton: 3 columnas con 2-3 cards skeleton cada una. |
| **Focus** | Card enfocada: outline `2px solid #008DC9`. |

#### Responsive
| Breakpoint | Comportamiento |
|---|---|
| **Desktop (>= 1024px)** | 3 columnas lado a lado, drag-and-drop activo. |
| **Tablet (768px - 1023px)** | 3 columnas mas estrechas, scroll horizontal si necesario. |
| **Mobile (< 768px)** | Columnas apiladas verticalmente. Drag-and-drop reemplazado por dropdown de cambio de estado en cada card. |

#### Accesibilidad
- Columnas: `role="list"`, `aria-label="Mensajes [estado]"`
- Cards: `role="listitem"`, `aria-label="Mensaje de [nombre] - [tipo]"`
- Drag-and-drop: alternativa keyboard con `aria-grabbed`, `aria-dropeffect` + instrucciones via `aria-describedby`
- En mobile: dropdown de estado con `role="listbox"` como alternativa a drag

---

### 14. Componente: Tabs Pill

**Cubre**: REQ-284, REQ-303, DEMO-037, DEMO-041
**Patron de referencia**: Dashly Patron #12

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `tabs` | `{ id: string, label: string, icon: string, badge?: number }[]` | Si | Tabs disponibles |
| `activeTab` | `string` | Si | Tab activa |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onTabChange` | `string` | Tab seleccionada |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Fila horizontal de pills, gap 8px. Activa: fondo #008DC9, texto blanco, border-radius 24px, padding 8px 20px, icono 16px blanco a la izquierda, font-size 14px, font-weight 500. Inactiva: fondo transparente, borde 1px #E5E7EB, texto #6B7280, icono 16px #6B7280, misma forma. `transition: all 0.2s ease-out`. |
| **Hover inactiva** | Fondo #F5F7FA. Texto #1F2937. |
| **With badge** | Badge numerico: circulo 18px, fondo #EF4444, texto blanco 11px bold, a la derecha del label. Solo en tab de Mensajes. |
| **Focus** | Outline `2px solid #008DC9`, `outline-offset: 2px`. |

#### Responsive
| Breakpoint | Comportamiento |
|---|---|
| **Desktop** | Fila horizontal. |
| **Mobile** | Si muchas tabs: 2 filas (ej: 3+2) o scroll horizontal. Mantienen estilo pill en ambos breakpoints. |

#### Accesibilidad
- `role="tablist"`, cada tab: `role="tab"`, `aria-selected="true/false"`, `aria-controls="panel-[id]"`
- Keyboard: flechas izquierda/derecha para navegar tabs, Enter/Space para activar
- Panel contenido: `role="tabpanel"`, `aria-labelledby="tab-[id]"`

---

### 15. Componente: Bilingual Input

**Cubre**: REQ-241, DEMO-029

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `label` | `string` | Si | Label del campo |
| `valueEs` | `string` | Si | Valor en espanol |
| `valueEn` | `string` | Si | Valor en ingles |
| `type` | `'text' \| 'textarea'` | No | Tipo de campo (default: 'text') |
| `required` | `boolean` | No | Campo requerido |
| `errorEs` | `string \| null` | No | Error para campo ES |
| `errorEn` | `string \| null` | No | Error para campo EN |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onChangeEs` | `string` | Valor ES cambiado |
| `onChangeEn` | `string` | Valor EN cambiado |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Label arriba. Mini tabs ES/EN debajo del label: dos botones 28px height, border-radius 6px, activo fondo #008DC9 texto blanco, inactivo fondo #F5F7FA texto #6B7280. Campo de input/textarea debajo de las tabs. Al cambiar tab, el contenido del campo cambia al idioma seleccionado con transicion sutil (crossfade 0.15s). Indicador visual si un idioma esta vacio: dot naranja 6px al lado de la tab. |
| **Focus** | Tabs y campo siguen patrones de Form Field. |
| **Error** | Error especifico del idioma activo debajo del campo. |

#### Accesibilidad
- Tabs ES/EN: `role="tablist"`, `aria-label="Seleccionar idioma del campo"`
- Campo: label incluye indicador de idioma para screen readers

---

### 16. Componente: Empty State

**Cubre**: REQ-232, REQ-263, REQ-321e, DEMO-028
**Decision holistica**: 10.11

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `illustration` | `string` | Si | SVG de ilustracion |
| `title` | `string` | Si | Titulo descriptivo |
| `description` | `string` | Si | Mensaje explicativo |
| `ctaText` | `string` | No | Texto del boton CTA |
| `ctaIcon` | `string` | No | Icono del CTA (ej: "+") |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onCtaClick` | `void` | CTA clickeado |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default** | Centrado vertical y horizontalmente en el area de contenido. Ilustracion SVG: ~200px de alto, tonos gris/azul suave (no colorida, no playful), estilo profesional. Titulo: Inter Bold 20px #1F2937, margin-top 24px. Descripcion: Inter Regular 14px #6B7280, max-width 400px, centrada, margin-top 8px. CTA: boton fondo #008DC9, texto blanco, border-radius 8px, padding 10px 24px, icono "+" a la izquierda, margin-top 20px. |
| **Hover CTA** | Fondo #007AB8. `transition: 0.2s ease-out`. |
| **Focus CTA** | Outline `2px solid #1F2937`, `outline-offset: 2px`. |

#### Instancias Predefinidas
| Contexto | Titulo | Descripcion | CTA |
|---|---|---|---|
| Productos (panel) | "No hay productos todavia" | "Agrega tu primer producto para comenzar a construir tu catalogo" | "+ Crear producto" |
| Marcas (panel) | "No hay marcas registradas" | "Agrega las marcas que HESA distribuye" | "+ Agregar marca" |
| Mensajes (panel) | "No hay mensajes nuevos" | "Los mensajes de contacto del sitio apareceran aqui" | (sin CTA) |
| Equipo (panel) | "No hay miembros del equipo" | "Agrega miembros del equipo de liderazgo" | "+ Agregar miembro" |
| Catalogo (sitio publico) | "No hay productos en esta categoria" | "Pronto agregaremos productos. Mientras tanto, explora otras categorias." | "Ver catalogo completo" |
| Filtros sin resultados | "No se encontraron productos" | "Intenta con otros filtros o limpia los filtros actuales" | "Limpiar filtros" |

#### Accesibilidad
- Ilustracion: `alt=""` (decorativa), `aria-hidden="true"`
- Titulo y descripcion leibles por screen readers
- CTA: `aria-label` descriptivo

---

### Componente Adicional: Status Badge (Panel)

**Cubre**: REQ-227 (badges estado), anti-patron #18

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `label` | `string` | Si | Texto del badge |
| `variant` | `'active' \| 'inactive' \| 'new' \| 'in_progress' \| 'resolved' \| 'category_pharma' \| 'category_food' \| 'category_equip' \| 'msg_info' \| 'msg_commercial' \| 'msg_support' \| 'msg_manufacturer' \| 'msg_other'` | Si | Variante visual |
| `size` | `'sm' \| 'md'` | No | Tamano (default: 'sm') |

#### Variantes de Color
| Variante | Fondo | Texto |
|---|---|---|
| `active` | #DCFCE7 | #22C55E |
| `inactive` | #FEE2E2 | #EF4444 |
| `new` | #FEF3C7 | #F59E0B |
| `in_progress` | #EBF5FF | #008DC9 |
| `resolved` | #DCFCE7 | #22C55E |
| `category_pharma` | #EBF5FF | #008DC9 |
| `category_food` | #DCFCE7 | #22C55E |
| `category_equip` | #F0F2F5 | #6B7280 |
| `msg_info` | #EBF5FF | #008DC9 |
| `msg_commercial` | #DCFCE7 | #22C55E |
| `msg_support` | #FEF3C7 | #F59E0B |
| `msg_manufacturer` | #EDE9FE | #7C3AED |
| `msg_other` | #F0F2F5 | #6B7280 |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **sm** | Border-radius: 12px. Padding: 3px 10px. Font-size: 12px. Font-weight: 500. |
| **md** | Border-radius: 14px. Padding: 4px 12px. Font-size: 13px. Font-weight: 600. |

#### Accesibilidad
- Informacion NO solo por color: texto legible siempre presente
- Contraste de texto sobre fondo suave: verificado > 4.5:1 en todos los casos

---

### Componente Adicional: Search Select (Panel)

**Cubre**: REQ-235

#### Props / Inputs
| Prop | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `label` | `string` | Si | Label del campo |
| `options` | `{ value: string, label: string, sublabel?: string }[]` | Si | Opciones disponibles |
| `value` | `string \| null` | Si | Valor seleccionado |
| `placeholder` | `string` | No | Placeholder |
| `required` | `boolean` | No | Campo requerido |
| `error` | `string \| null` | No | Mensaje de error |

#### Eventos / Outputs
| Evento | Payload | Descripcion |
|---|---|---|
| `onChange` | `string` | Valor seleccionado |

#### Estados Visuales
| Estado | Descripcion Visual |
|---|---|
| **Default (closed)** | Aspecto identico a Form Field tipo select: borde 1px #E5E7EB, border-radius 10px, height 44px, chevron derecha. |
| **Open** | Dropdown con input de busqueda arriba: padding 8px, border-bottom 1px #E5E7EB. Lista filtrada debajo: max-height 240px, overflow-y auto. Cada opcion: padding 10px 16px, hover fondo #F5F7FA. Opcion seleccionada: fondo #E8F4FD, checkmark #008DC9 a la derecha. |
| **Searching** | Lista se filtra en tiempo real conforme se escribe. "Sin resultados" si no hay match. |
| **Focus** | Borde 2px #008DC9, sombra focus. |

#### Accesibilidad
- `role="combobox"`, `aria-expanded`, `aria-controls`
- Lista: `role="listbox"`, opciones: `role="option"`, `aria-selected`
- Keyboard: flechas para navegar, Enter para seleccionar, Escape para cerrar

---

## PARTE 3: PATRONES DE FEEDBACK VISUAL

---

### Patron: Loading States

#### Skeleton Screens (contenido)
- Usados para: cards, listas, grids, secciones de pagina
- Forma: rectangulos con border-radius que imitan la forma del contenido real
- Color base: #E5E7EB
- Shimmer: gradiente lineal animado `#E5E7EB -> #F5F7FA -> #E5E7EB`, movimiento de izquierda a derecha
- Animacion: `background-position: -200% 0 -> 200% 0` en `1.5s ease-in-out infinite`
- Dimensiones: mismas que el contenido real para evitar layout shift (CLS)

#### Spinners (acciones)
- Usados para: botones de submit, carga de datos individuales
- Estilo: circulo con borde parcial, `animation: spin 1s linear infinite`
- Tamano: 18px en botones, 24px standalone, 40px pagina completa
- Color: blanco en botones con fondo, #008DC9 standalone

#### Progress Bars (procesos largos)
- Usados para: upload de archivos
- Estilo: barra horizontal, height 4px, border-radius 2px
- Fondo: #E5E7EB. Relleno: #008DC9 para neutral, #22C55E para exito, #EF4444 para error
- Animacion: ancho crece con `transition: width 0.3s ease-out`

---

### Patron: Transiciones y Animaciones

| Elemento | Propiedad | Duracion | Easing | Notas |
|---|---|---|---|---|
| Hover botones | background, color | 0.2s | ease-out | BVC-005 |
| Hover cards | transform, box-shadow | 0.3s | ease-out | scale(1.02) + shadow, BVC-033 |
| Hover links menu | underline width | 0.2s | ease-out | Izquierda a derecha |
| Hover filas tabla | background | 0.15s | ease-out | Fondo gris suave |
| Dropdowns apertura | opacity, transform | 0.2s | cubic-bezier(0.25, 0.46, 0.45, 0.94) | translateY + opacity |
| Modal apertura | opacity, transform | 0.2s | cubic-bezier(0.25, 0.46, 0.45, 0.94) | scale(0.95->1) + opacity |
| Modal cierre | opacity, transform | 0.15s | ease-in | Mas rapido que apertura |
| Toast entrada | transform, opacity | 0.3s | ease-in-out | translateX(100%->0) |
| Toast salida | transform, opacity | 0.2s | ease-in | translateX(0->100%) |
| Scroll fade-in | opacity, transform | 0.6s | cubic-bezier(0.4, 0, 0.2, 1) | Intersection Observer |
| Sticky bar | transform | 0.3s | cubic-bezier(0.25, 0.46, 0.45, 0.94) | translateY |
| Count-up numeros | -- | 1.5s | cubic-bezier(0.4, 0, 0.2, 1) | Animacion JS |
| Timeline secuencial | opacity, transform | 0.4s per step | cubic-bezier(0.4, 0, 0.2, 1) | delay 200ms incremental |
| Logos grayscale->color | filter | 0.3s | ease-out | grayscale(100%->0%) |
| Mobile menu slide | transform | 0.3s | cubic-bezier(0.25, 0.46, 0.45, 0.94) | translateX(100%->0) |
| Acordeon expand | max-height | 0.3s | ease-out | Footer mobile |
| Badge pulse | transform, opacity | 2s | ease-in-out | Pulse sutil al recibir notificacion nueva |

---

### Patron: Empty States (Sitio Publico)

| Contexto | Titulo | Descripcion | CTA |
|---|---|---|---|
| Catalogo sin productos | "No hay productos en esta categoria" | "Estamos trabajando en agregar nuevos productos. Explora otras categorias mientras tanto." | "Ver catalogo completo" (link) |
| Filtros sin resultados | "No se encontraron productos con estos filtros" | "Intenta con diferentes combinaciones de filtros." | "Limpiar filtros" (boton outline) |
| Busqueda sin resultados | "No se encontraron resultados para '[termino]'" | "Verifica la ortografia o intenta con otro termino." | "Ver catalogo completo" (link) |
| Marca sin productos | "Esta marca no tiene productos disponibles actualmente" | "Pronto agregaremos mas productos de [marca]." | "Ver otras marcas" (link) |
| Carrusel vacio | (seccion no se muestra, REQ-073) | -- | -- |

Diseno: texto centrado con padding generoso (80px vertical), icono o ilustracion sutil en tono #E5E7EB (40px), mensaje en 16px #6B7280, CTA en #008DC9. Mas sobrio que los empty states del panel (sin ilustracion SVG grande, solo icono + texto).

---

## PARTE 4: REGLAS DE USO DE MARCA

---

### Logo HESA
- **Header**: Logo completo HESA a la izquierda. Al scroll: transiciona a isotipo. Tamano: ~140px ancho (completo), ~40px (isotipo).
- **Footer**: Logo HESA en version blanca/clara, grande como "brand closure" (~200px ancho) centrado en la seccion inferior del footer.
- **Panel sidebar**: Logo HESA en la parte superior del sidebar (~180px ancho). En sidebar colapsado: solo isotipo (~32px).
- **Login panel**: Logo HESA centrado sobre fondo blanco, ~200px ancho.
- **Favicon**: Isotipo HESA en 32x32px y 16x16px.

### Colores de Marca
- **Primario #008DC9**: CTAs, links, estados activos, header elements, botones principales, tabs activas, badges de farmaco.
- **Secundario #50B92A**: Iconos de beneficios, checkmarks, acentos decorativos. NUNCA como fondo para texto blanco pequeno (ratio 3.2:1 no cumple AA).
- **Oscuro #005A85**: Footer background, hover states de botones azules. Texto blanco sobre este fondo cumple AA (5.7:1).
- **Neutros**: #1F2937 (texto principal), #6B7280 (texto secundario), #E5E7EB (bordes), #F5F7FA (fondos claros), #F7F8FA (fondo panel).

### Iconografia
- **Libreria**: Lucide Icons, Heroicons, o Phosphor Icons (una sola, consistente en todo el proyecto)
- **Estilo**: Outline/stroke, 1.5-2px trazo
- **Tamanos**: 16-20px en botones, 20-24px en sidebar/nav, 24-28px en cards
- **Circulos decorativos**: 48px diametro, fondo con 10-15% opacity del color del icono
- **Color**: hereda contexto (gris inactivo, blanco sobre fondo oscuro, azul/verde en contextos semanticos)

### Imagenes
- **Productos**: Fotos profesionales de producto sobre fondo neutro. Importadas desde catalogo real de HESA. Aspect-ratio 1:1 en cards, libre en detalle.
- **Hero**: Imagen profesional veterinaria B2B (veterinario trabajando, laboratorio, equipo profesional). NO mascotas tiernas B2C (anti-patron #10).
- **Marcas**: Logos oficiales de cada marca en formato PNG/SVG con fondo transparente.
- **Equipo**: Fotos profesionales de estudio. Inicialmente: placeholders de banco de fotos profesionales con nombres/cargos ficticios (REQ-173a).
- **Placeholder sin imagen**: Fondo #F5F7FA con icono de la categoria correspondiente en #E5E7EB. No "imagen rota" ni icono generico.
- **Lazy loading**: Todas las imagenes con lazy loading nativo (`loading="lazy"`). Blur-up con imagen de baja resolucion como placeholder.

---

## PARTE 5: COBERTURA DEMO-xxx

| DEMO | Componente(s) Principal(es) | Estado |
|---|---|---|
| DEMO-001 | Header | Cubierto (Seccion 1) |
| DEMO-002 | Footer | Cubierto (Seccion 2) |
| DEMO-003 | WhatsApp FAB | Cubierto (Seccion 3) |
| DEMO-005 | Category Block | Cubierto (Seccion 14) |
| DEMO-006 | Brand Logos Row | Cubierto (Seccion 16) |
| DEMO-007 | Value Stat | Cubierto (Seccion 15) |
| DEMO-008 | Carousel + Product Card | Cubierto (Secciones 6, 7) |
| DEMO-009 | Manufacturer CTA Banner | Cubierto (Componente adicional) |
| DEMO-012 | Filter Bar | Cubierto (Seccion 9) |
| DEMO-013 | Pagination | Cubierto (Seccion 10) |
| DEMO-015 | Sticky Bar | Cubierto (Componente adicional) |
| DEMO-017 | Product Card (related) | Cubierto (Seccion 6, variante grid) |
| DEMO-023 | Search Overlay | Cubierto (Seccion 5) |
| DEMO-025 | Sidebar (soporte) | Cubierto via Tabs Pill, Summary Card |
| DEMO-026 | Admin Header (soporte) | Cubierto via Search Select |
| DEMO-027 | Summary Card + Category Card Admin | Cubierto (Secciones panel 1, 2) |
| DEMO-028 | Product Card Admin + Data Table + View Toggle + Empty State | Cubierto (Secciones panel 3-5, 16) |
| DEMO-029 | Form Field + Confirm Modal + Toast + Bilingual Input | Cubierto (Secciones panel 7, 11, 12, 15) |
| DEMO-031 | Brand Card Admin + View Toggle | Cubierto (Secciones panel 3, 6) |
| DEMO-033 | Tag Input | Cubierto (Seccion panel 10) |
| DEMO-039 | Kanban Board | Cubierto (Seccion panel 13) |
| DEMO-037 | Tabs Pill | Cubierto (Seccion panel 14) |
| DEMO-041 | Tabs Pill | Cubierto (Seccion panel 14) |
| DEMO-043 | Responsive behaviors en todos los componentes | Cubierto (responsive en cada componente) |

**Componentes de soporte para DEMOs liderados por UX Flow Designer**: Product Card (DEMO-010, DEMO-011, DEMO-014, DEMO-018, DEMO-019), Contact Form (DEMO-021, DEMO-022), Team Member Card (DEMO-020), Timeline (DEMO-021), Breadcrumb (DEMO-014), Product Gallery (DEMO-014), Presentation Pills (DEMO-014), Species Badges (DEMO-014), Product CTAs (DEMO-014), Sticky Bar (DEMO-015), Form Field + Image/PDF Uploader (DEMO-029, DEMO-034, DEMO-035, DEMO-038), Status Badge (DEMO-028, DEMO-039), Data Table (DEMO-039), Empty State (DEMO-028, DEMO-031, DEMO-033).

---

## PARTE 6: NOTAS DE IMPLEMENTACION BOOTSTRAP 5

### Componentes Bootstrap Base a Customizar
| Componente Bootstrap | Componente HESA | Customizacion |
|---|---|---|
| `navbar` | Header | `$navbar-padding-y`, sticky behavior, submenu hover |
| `card` | Product Card, Brand Card, Summary Card | `$card-border-radius: 12px (publico) / 16px (panel)`, `$card-box-shadow` |
| `btn` | Botones globales | `$btn-border-radius: 8px`, `$btn-padding-y: 12px`, custom hover transitions |
| `form-control` | Form Field | `$input-border-radius: 10px`, `$input-height: 44px`, custom focus ring |
| `modal` | Confirm Modal | `$modal-content-border-radius: 16px`, custom animation |
| `toast` | Toast Notification | `$toast-border-radius: 12px`, custom positioning and animation |
| `dropdown-menu` | Filter dropdowns, menus | `$dropdown-border-radius: 8px`, custom shadow |
| `badge` | Status Badge, category badges | Custom pill shapes with background-opacity patterns |
| `breadcrumb` | Breadcrumb | Custom separator and spacing |
| `pagination` | Pagination | Custom active state and sizing |
| `table` | Data Table | Custom header styling, row hover, mobile stacking |
| `offcanvas` | Mobile menu, filter drawer | Custom width and animation |

### Variables CSS Bootstrap a Customizar
```scss
// _variables.scss
$primary: #008DC9;
$secondary: #50B92A;
$success: #22C55E;
$danger: #EF4444;
$warning: #F59E0B;
$info: #008DC9;
$dark: #1F2937;
$light: #F5F7FA;

$body-color: #1F2937;
$body-bg: #FFFFFF;

$font-family-sans-serif: 'Inter', system-ui, -apple-system, sans-serif;
$font-size-base: 1rem; // 16px

$border-radius: 8px;
$border-radius-sm: 6px;
$border-radius-lg: 12px;
$border-radius-xl: 16px;
$border-radius-pill: 25px;

$box-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
$box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
$box-shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

$input-border-color: #E5E7EB;
$input-border-radius: 10px;
$input-focus-border-color: #008DC9;
$input-focus-box-shadow: 0 0 0 3px rgba(0, 141, 201, 0.15);
$input-height: 44px;

$card-border-width: 0;
$card-border-radius: 16px;
$card-box-shadow: $box-shadow-sm;

$navbar-padding-y: 0;
$navbar-brand-padding-y: 0;
```

### Regla: Bootstrap Primero, Custom Despues
- Usar clases utilitarias de Bootstrap para layout (`container`, `row`, `col-*`), spacing (`p-*`, `m-*`, `g-*`), display (`d-flex`, `d-none`, `d-md-block`)
- Extender con CSS custom properties (design tokens) para colores semanticos, sombras, transiciones que no estan en Bootstrap
- NO sobreescribir estilos base de Bootstrap -- customizar via variables SCSS

---

## Gaps y Decisiones Tomadas

| # | Gap | Decision | Impacto |
|---|---|---|---|
| GAP-D03 | Pills de presentaciones sin spec visual | Pills toggle: border-radius 25px, borde #E5E7EB, seleccionado fondo #E8F4FD borde #008DC9 | REQ-114, REQ-115 |
| GAP-D04 | Color "morado" para tipo Fabricante no esta en paleta | #7C3AED (purple-600) con fondo #EDE9FE. Unico color fuera de paleta, justificado por necesidad de 5 tipos diferenciados | REQ-296 |
| GAP-NEW-01 | Mapa de Costa Rica sin spec visual | SVG estilizado en tono #E8F4FD con puntos de cobertura #008DC9, leyenda GAM/rural/encomienda | REQ-169-171 |
| GAP-NEW-02 | Admin sidebar no tiene componente detallado aqui | Sidebar es layout component liderado por UX Flow Designer. Los items activos usan Status Badge logic. | DEMO-025 |

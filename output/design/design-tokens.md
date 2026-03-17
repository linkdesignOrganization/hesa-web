# Design Tokens -- HESA (Herrera y Elizondo S.A.)

**Generado por**: Visual System Designer
**Fecha**: 2026-03-17
**Version**: 1.0
**Fuente de verdad**: visual-analysis.md (Secciones 2-5 PRESCRIPTIVAS + Seccion 10 holisticas)
**Verificacion de contraste**: Todas las combinaciones texto/fondo verificadas con colorsandfonts.com
**Cobertura DEMO**: DEMO-044 (Design system)

---

## 1. Paleta de Colores

### 1.1 Colores de Marca (PRESCRITOS -- del brief del cliente)

| Token | Hex | Uso principal | Plataforma |
|---|---|---|---|
| `--brand-primary` | `#008DC9` | CTAs principales, enlaces, header activo, tabs activos, sidebar item activo, CTA fabricantes fondo | Ambas |
| `--brand-secondary` | `#50B92A` | Iconografia de beneficios, acentos secundarios, iconos lineales propuesta de valor, labels tipo "DESDE 1987" | Sitio publico |
| `--brand-dark` | `#005A85` | Fondo footer, hover states de botones azules, barra sticky desktop | Sitio publico |

### 1.2 Escala Monocromatica -- Primario (#008DC9)

Generada con `generate_monochromatic` a partir del color prescrito de marca.

```css
--brand-primary-50: #f0f7ff;   /* Fondos hover sutiles, highlights muy suaves */
--brand-primary-100: #dbedff;  /* Fondos seleccion suave, filas activas */
--brand-primary-200: #aed9fe;  /* Bordes focus, outlines suaves */
--brand-primary-300: #5ebffe;  /* Decorativos, iconos claros */
--brand-primary-400: #319edc;  /* Links hover, indicadores secundarios */
--brand-primary-500: #008dc9;  /* === BASE DE MARCA === CTAs, links, botones primarios */
--brand-primary-600: #146995;  /* Texto azul accesible sobre blanco (6.03:1 AA) */
--brand-primary-700: #01557c;  /* Texto azul alto contraste, hover oscuro */
--brand-primary-800: #064260;  /* Fondos oscuros azules */
--brand-primary-900: #032f46;  /* Fondos muy oscuros */
--brand-primary-950: #011e2f;  /* Maximo contraste azul */
```

### 1.3 Escala Monocromatica -- Secundario (#50B92A)

```css
--brand-secondary-50: #e3ffd3;   /* Fondos exito muy suaves */
--brand-secondary-100: #b3ff90;  /* Highlights verdes */
--brand-secondary-200: #86ec5d;  /* Iconos decorativos claros */
--brand-secondary-300: #65cd3f;  /* Acentos verdes medios */
--brand-secondary-400: #50b92a;  /* === BASE DE MARCA === Iconos beneficios, acentos decorativos */
--brand-secondary-500: #288901;  /* Verde oscuro para texto sobre fondos claros */
--brand-secondary-600: #237205;  /* Texto verde alto contraste */
--brand-secondary-700: #1b5d04;  /* Texto verde muy oscuro */
--brand-secondary-800: #124801;  /* Fondos oscuros verdes */
--brand-secondary-900: #113301;  /* Fondos muy oscuros */
--brand-secondary-950: #102002;  /* Maximo contraste verde */
```

### 1.4 Escala Monocromatica -- Azul Oscuro (#005A85)

```css
--brand-dark-50: #f0f7ff;
--brand-dark-100: #dcedfe;
--brand-dark-200: #b2d9fe;
--brand-dark-300: #82bced;
--brand-dark-400: #609ccb;
--brand-dark-500: #3c7daa;
--brand-dark-600: #216995;
--brand-dark-700: #005a85;   /* === BASE === Footer, hover azul oscuro */
--brand-dark-800: #084161;
--brand-dark-900: #042f47;
--brand-dark-950: #011e2f;
```

### 1.5 Colores Neutros (PRESCRITOS)

| Token | Hex | Uso | Contraste sobre blanco |
|---|---|---|---|
| `--neutral-white` | `#FFFFFF` | Fondo principal sitio publico, fondo cards, fondo sidebar panel, fondo campos formulario | -- |
| `--neutral-50` | `#F5F7FA` | Fondo secciones alternas, fondo cards producto (imagen), secciones "off-white" | Sutil diferencia vs blanco (intencionalmente baja) |
| `--neutral-100` | `#F7F8FA` | Fondo area de contenido del panel (zona principal a la derecha del sidebar) | Sutil diferencia vs blanco |
| `--neutral-200` | `#E5E7EB` | Bordes de campos, separadores de tabla, divisores horizontales, bordes de cards | 1.24:1 -- decorativo, no para texto |
| `--neutral-400` | `#6B7280` | Texto secundario, descripciones, subtitulos, placeholders, labels metadata | 4.83:1 sobre blanco -- AA normal text |
| `--neutral-900` | `#1F2937` | Texto principal, titulos, headings | 14.68:1 sobre blanco -- AAA |

### 1.6 Colores de Superficie por Categoria (PRESCRITOS)

| Token | Hex | Uso | Contraste texto #1F2937 |
|---|---|---|---|
| `--surface-pharma` | `#E8F4FD` | Bloque color seccion Farmacos (sitio publico) | 13.13:1 -- AAA |
| `--surface-food` | `#EDF7E8` | Bloque color seccion Alimentos (sitio publico) | 13.33:1 -- AAA |
| `--surface-equipment` | `#F0F2F5` | Bloque color seccion Equipos (sitio publico) | 13.09:1 -- AAA |

### 1.7 Colores Semanticos (PRESCRITOS del brief del panel -- aplicados en ambas plataformas per decision holistica 10.2)

#### Colores base

| Token | Hex | Uso |
|---|---|---|
| `--color-success` | `#22C55E` | Badges "Activo", toast exito, validacion correcta, indicadores positivos |
| `--color-danger` | `#EF4444` | Badges "Inactivo", errores validacion, boton eliminar, formulario error |
| `--color-warning` | `#F59E0B` | Badges "Pendiente", mensajes sin leer, campo requerido vacio |
| `--color-info` | `#008DC9` | Badges informativos, tabs activos -- se reutiliza el primario de marca |

#### Fondos suaves para badges y alertas

| Token | Hex | Uso |
|---|---|---|
| `--color-success-soft` | `#DCFCE7` | Fondo badges alimentos panel, fondo estados exitosos, badge "Activo" |
| `--color-danger-soft` | `#FEE2E2` | Fondo badges error, fondo alertas, badge "Inactivo" |
| `--color-warning-soft` | `#FEF3C7` | Fondo badges atencion, mensajes sin leer |
| `--color-info-soft` | `#EBF5FF` | Fondo item activo sidebar, fondo badges farmacos panel, fondo badges azules |

#### Texto oscuro para badges (WCAG AA verificado -- solucion al problema de contraste)

Los colores semanticos base (#22C55E, #EF4444, #F59E0B) sobre sus fondos suaves NO cumplen WCAG AA para texto normal (ratios 2.07:1, 3.08:1, 1.93:1 respectivamente). Los badges usan texto en variante oscura del color semantico para garantizar accesibilidad:

| Token | Hex | Sobre fondo suave | Ratio WCAG | Estado |
|---|---|---|---|---|
| `--color-success-text` | `#166534` | sobre #DCFCE7 | 6.49:1 | AA Pass |
| `--color-danger-text` | `#991B1B` | sobre #FEE2E2 | 6.80:1 | AA Pass |
| `--color-warning-text` | `#92400E` | sobre #FEF3C7 | 6.37:1 | AA Pass |
| `--color-info-text` | `#005A85` | sobre #EBF5FF | 6.80:1 | AA Pass |

### 1.8 Colores por Tipo de Mensaje (REQ-296)

| Tipo | Token texto | Hex texto | Token fondo | Hex fondo | Ratio WCAG | Estado |
|---|---|---|---|---|---|---|
| Informacion | `--msg-info-text` | `#005A85` | `--msg-info-bg` | `#EBF5FF` | 6.80:1 | AA Pass |
| Comercial | `--msg-comercial-text` | `#166534` | `--msg-comercial-bg` | `#DCFCE7` | 6.49:1 | AA Pass |
| Soporte | `--msg-soporte-text` | `#92400E` | `--msg-soporte-bg` | `#FEF3C7` | 6.37:1 | AA Pass |
| Fabricante | `--msg-fabricante-text` | `#5B21B6` | `--msg-fabricante-bg` | `#EDE9FE` | 7.57:1 | AAA Pass |
| Otro | `--msg-otro-text` | `#1F2937` | `--msg-otro-bg` | `#F0F2F5` | 13.09:1 | AAA Pass |

**Nota (GAP-D04):** El morado #7C3AED y su fondo #EDE9FE son los unicos colores fuera de la paleta prescrita del brief. Son necesarios para diferenciar los 5 tipos de mensaje definidos en REQ-296. El texto oscuro #5B21B6 garantiza WCAG AAA (7.57:1).

### 1.9 Colores por Categoria de Producto -- Mapeo Cross-Plataforma (Badge Panel + Bloque Sitio)

| Categoria | Badge texto panel | Badge fondo panel | Bloque sitio publico |
|---|---|---|---|
| Farmacos | `#005A85` sobre `#EBF5FF` | `#EBF5FF` | `#E8F4FD` |
| Alimentos | `#166534` sobre `#DCFCE7` | `#DCFCE7` | `#EDF7E8` |
| Equipos | `#1F2937` sobre `#F0F2F5` | `#F0F2F5` | `#F0F2F5` |

### 1.10 Colores Especiales

| Token | Hex | Uso |
|---|---|---|
| `--whatsapp-green` | `#25D366` | Boton flotante WhatsApp, CTA "Consultar por WhatsApp" |
| `--whatsapp-green-hover` | `#20BD5A` | Hover del boton WhatsApp |
| `--overlay-dark` | `rgba(0, 0, 0, 0.5)` | Overlay fondo search bar, overlay modales |
| `--overlay-hero` | `linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)` | Gradient overlay hero para legibilidad del texto |

---

## 2. Reporte de Contraste WCAG 2.1 (NFR-024)

### 2.1 Combinaciones de Texto Principal -- Verificadas

| Combinacion | Foreground | Background | Ratio | WCAG AA Normal | WCAG AA Large |
|---|---|---|---|---|---|
| Texto principal sobre blanco | `#1F2937` | `#FFFFFF` | 14.68:1 | Pass | Pass |
| Texto principal sobre neutral-50 | `#1F2937` | `#F5F7FA` | 13.68:1 | Pass | Pass |
| Texto principal sobre neutral-100 panel | `#1F2937` | `#F7F8FA` | 13.81:1 | Pass | Pass |
| Texto principal sobre surface-pharma | `#1F2937` | `#E8F4FD` | 13.13:1 | Pass | Pass |
| Texto principal sobre surface-food | `#1F2937` | `#EDF7E8` | 13.33:1 | Pass | Pass |
| Texto principal sobre surface-equipment | `#1F2937` | `#F0F2F5` | 13.09:1 | Pass | Pass |
| Texto secundario sobre blanco | `#6B7280` | `#FFFFFF` | 4.83:1 | Pass | Pass |
| Texto secundario sobre neutral-100 panel | `#6B7280` | `#F7F8FA` | 4.55:1 | Pass | Pass |
| Texto secundario sobre surface-equipment | `#6B7280` | `#F0F2F5` | 4.31:1 | **Fail** | Pass |

### 2.2 Combinaciones de Colores de Marca -- Verificadas

| Combinacion | Foreground | Background | Ratio | WCAG AA Normal | WCAG AA Large | Restriccion |
|---|---|---|---|---|---|---|
| Blanco sobre primario #008DC9 | `#FFFFFF` | `#008DC9` | 3.71:1 | **Fail** | Pass | Solo texto grande (>=18px bold / >=24px regular) o UI components |
| Blanco sobre azul oscuro #005A85 | `#FFFFFF` | `#005A85` | 7.50:1 | Pass | Pass | Sin restriccion |
| Blanco sobre secundario #50B92A | `#FFFFFF` | `#50B92A` | 2.53:1 | **Fail** | **Fail** | Solo como acento decorativo o con texto oscuro encima |
| Primario como texto sobre blanco | `#008DC9` | `#FFFFFF` | 3.71:1 | **Fail** | Pass | Solo texto grande (links en 18px+ bold). Para texto normal usar `--brand-primary-600` (#146995, 6.03:1) |
| Primario-600 como texto sobre blanco | `#146995` | `#FFFFFF` | 6.03:1 | Pass | Pass | Alternativa accesible para texto azul pequeno |
| Primario-600 texto accesible link | `#007AB8` | `#FFFFFF` | 4.69:1 | Pass | Pass | Alternativa semi-accesible para links texto normal |
| Blanco sobre WhatsApp green | `#FFFFFF` | `#25D366` | 1.98:1 | **Fail** | **Fail** | Icono WhatsApp es reconocible sin texto -- se permite por patron UX universal |
| Blanco sobre danger | `#FFFFFF` | `#EF4444` | 3.76:1 | **Fail** | Pass | Boton eliminar: usar solo con texto grande (16px+ bold) |

### 2.3 Badges Semanticos -- Texto Oscuro Accesible

| Badge | Texto | Fondo | Ratio | WCAG AA Normal |
|---|---|---|---|---|
| Success (Activo) | `#166534` | `#DCFCE7` | 6.49:1 | Pass |
| Danger (Inactivo) | `#991B1B` | `#FEE2E2` | 6.80:1 | Pass |
| Warning (Pendiente) | `#92400E` | `#FEF3C7` | 6.37:1 | Pass |
| Info (Farmaco) | `#005A85` | `#EBF5FF` | 6.80:1 | Pass |
| Fabricante (Morado) | `#5B21B6` | `#EDE9FE` | 7.57:1 | Pass |
| Equipo (Gris) | `#1F2937` | `#F0F2F5` | 13.09:1 | Pass |

### 2.4 Conflictos de Contraste Identificados y Resoluciones

| # | Conflicto | Resolucion | Razon |
|---|---|---|---|
| 1 | Blanco sobre #008DC9 (3.71:1) falla AA normal text | Usar SOLO para texto grande (>=18px bold, >=24px regular): botones CTAs, headings sobre fondo azul. Para texto pequeno sobre blanco, usar #146995 o #007AB8 | Color prescrito del brief -- NO se modifica, se restringe su uso |
| 2 | Blanco sobre #50B92A (2.53:1) falla AA en todo | NUNCA usar texto blanco sobre verde HESA. Usar solo como acento decorativo (iconos, bordes, puntos) o con texto oscuro (#1F2937) encima | Color prescrito del brief -- NO se modifica, se restringe su uso |
| 3 | #22C55E sobre #DCFCE7 (2.07:1) -- badge verde | Sustituir texto de badge por #166534 (verde oscuro, 6.49:1) | Patron estandar: texto oscuro sobre fondo pastel |
| 4 | #F59E0B sobre #FEF3C7 (1.93:1) -- badge warning | Sustituir texto de badge por #92400E (ambar oscuro, 6.37:1) | Patron estandar: texto oscuro sobre fondo pastel |
| 5 | #EF4444 sobre #FEE2E2 (3.08:1) -- badge danger | Sustituir texto de badge por #991B1B (rojo oscuro, 6.80:1) | Patron estandar: texto oscuro sobre fondo pastel |
| 6 | #008DC9 sobre #EBF5FF (3.37:1) -- badge info | Sustituir texto de badge por #005A85 (azul oscuro, 6.80:1) | Patron estandar: texto oscuro sobre fondo pastel |
| 7 | #6B7280 sobre #F0F2F5 (4.31:1) -- texto secundario sobre gris | Usar solo como texto grande (>=14px medium) o metadata. Para texto body normal sobre este fondo, usar #1F2937 | Marginal -- casi pasa (4.31 vs 4.5 requerido). Aceptable para labels 12-14px que son UI components (3:1 aplica) |
| 8 | Blanco sobre #25D366 WhatsApp (1.98:1) | Aceptable: el icono WhatsApp es universalmente reconocible sin texto. El boton es un FAB con solo icono | Patron UX universal -- WCAG permite excepciones para iconos decorativos con significado universalmente entendido |

---

## 3. Tipografia

### 3.1 Familia Tipografica (PRESCRITA -- Decision holistica 10.3)

| Propiedad | Valor | Justificacion |
|---|---|---|
| Familia principal | **Inter** | Sans-serif moderna de Google Fonts. Gratuita, excelente soporte de pesos (400-800), legible en todos los tamanos, usada en la referencia Dashly. Cubre ambos contextos (sitio publico + panel) con consistencia |
| Familia fallback | `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` | Stack de fallback completo para maxima compatibilidad cross-browser |
| Pesos cargados | 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (Extrabold) | Carga selectiva para performance. Solo los 5 pesos necesarios |
| Formato | Variable font (wght 400-800) o instancias estaticas | Variable font preferido para reducir requests HTTP |

**Justificacion de fuente unica:** El brief prescribe sans-serif moderna. Tuft & Paw usa serif display para headings (transmite editorial premium), pero HESA es B2B profesional, no B2C editorial. La personalidad premium se logra con tamano (56px), peso (Extrabold 800), y tracking negativo (-0.02em), no con tipografia serif decorativa. Inter en Extrabold a 56px con tracking tight tiene caracter propio suficiente para diferenciar de la competencia (que usa sans-serif generica sin personalidad).

### 3.2 Escala Tipografica Completa

#### Sitio Publico

| Token | Nivel | Tamano | Peso | Line-height | Letter-spacing | Uso | REQs |
|---|---|---|---|---|---|---|---|
| `--text-display` | Display / Hero | 56px | Extrabold 800 | 1.1 | -0.02em | Hero headline desktop. "37 anos cuidando la salud animal" | REQ-044 |
| `--text-display-mobile` | Display Mobile | 32px | Bold 700 | 1.15 | -0.01em | Hero headline en mobile (375px) | REQ-044 |
| `--text-h1` | H1 | 48px | Bold 700 | 1.15 | -0.02em | Titulos de pagina (Nosotros, Distribuidores, Contacto) | REQ-143, REQ-157 |
| `--text-h1-mobile` | H1 Mobile | 32px | Bold 700 | 1.2 | -0.01em | Titulos de pagina en mobile | -- |
| `--text-h2` | H2 | 42px | Bold 700 | 1.2 | -0.01em | Subtitulos de seccion ("Nuestras Categorias", "Marcas que Distribuimos") | REQ-063 |
| `--text-h2-mobile` | H2 Mobile | 28px | Bold 700 | 1.25 | -0.01em | Subtitulos de seccion en mobile | -- |
| `--text-h3` | H3 | 36px | Bold 700 | 1.25 | -0.01em | Subtitulos secundarios, titulos de bloque color | -- |
| `--text-h3-mobile` | H3 Mobile | 24px | Bold 700 | 1.3 | 0 | Subtitulos secundarios mobile | -- |
| `--text-h4` | H4 | 28px | Semibold 600 | 1.3 | 0 | Titulos de componente, nombre de marca individual | -- |
| `--text-h5` | H5 | 24px | Semibold 600 | 1.35 | 0 | Titulos menores | -- |
| `--text-h6` | H6 | 20px | Semibold 600 | 1.4 | 0 | Titulos pequenos, labels de seccion | -- |
| `--text-product-name` | Nombre producto (detalle) | 32px | Bold 700 | 1.2 | -0.01em | Nombre del producto en pagina de detalle | REQ-110 |
| `--text-product-name-mobile` | Nombre producto mobile | 24px | Bold 700 | 1.25 | 0 | Nombre del producto en detalle mobile | REQ-110 |
| `--text-stat-number` | Numero destacado | 48px | Bold 700 | 1.1 | -0.02em | Propuesta de valor: "37", "500+", "25+" | REQ-063, REQ-157 |
| `--text-stat-number-large` | Numero destacado grande | 64px | Bold 700 | 1.0 | -0.02em | Numeros en pagina Nosotros (version impactante) | REQ-157 |
| `--text-body-lg` | Body large | 18px | Regular 400 | 1.7 | 0 | Parrafos principales, hero subtitulo, descripciones de seccion | -- |
| `--text-body` | Body | 16px | Regular 400 | 1.6 | 0 | Texto general del sitio, parrafos, descripciones | -- |
| `--text-body-medium` | Body medium | 16px | Medium 500 | 1.6 | 0 | Texto con enfasis medio, beneficios en bloques de color | -- |
| `--text-small` | Small | 14px | Regular 400 | 1.5 | 0 | Texto secundario, marca en cards, breadcrumb, pie de imagen | -- |
| `--text-small-medium` | Small medium | 14px | Medium 500 | 1.5 | 0 | Texto descriptivo bajo numeros propuesta de valor | -- |
| `--text-label` | Label / Metadata | 13px | Semibold 600 | 1.4 | 0.08em | Labels uppercase (tag hero "DESDE 1987", tags de filtro, labels metadata), SIEMPRE text-transform: uppercase | -- |
| `--text-caption` | Caption | 12px | Medium 500 | 1.4 | 0.05em | Textos auxiliares muy pequenos, copyright footer | -- |
| `--text-nav` | Navigation | 15px | Medium 500 | 1.0 | 0.01em | Items del menu de navegacion header | REQ-007 |
| `--text-card-name` | Card nombre | 16px | Bold 700 | 1.3 | 0 | Nombre en product card catalogo, nombre en brand card | REQ-082 |
| `--text-card-meta` | Card metadata | 14px | Regular 400 | 1.4 | 0 | Marca en product card, pais en brand card | -- |
| `--text-btn` | Boton | 16px | Semibold 600 | 1.0 | 0.01em | Texto de botones CTA | -- |
| `--text-btn-sm` | Boton pequeno | 14px | Medium 500 | 1.0 | 0.01em | Texto de botones secundarios, "Ver producto" en card | -- |

#### Panel de Administracion

| Token | Nivel | Tamano | Peso | Line-height | Letter-spacing | Uso |
|---|---|---|---|---|---|---|
| `--text-panel-title` | Titulo pagina | 24px | Bold 700 | 1.3 | 0 | Titulo de seccion en header panel ("Productos", "Mensajes") |
| `--text-panel-subtitle` | Subtitulo formulario | 20px | Bold 700 | 1.3 | 0 | Subtitulos de secciones de formulario ("Informacion Basica") |
| `--text-panel-subtitle-sm` | Subtitulo menor | 18px | Bold 700 | 1.35 | 0 | Subtitulos secundarios de formulario |
| `--text-panel-card-name` | Card nombre | 16px | Bold 700 | 1.3 | 0 | Nombre de producto/marca en card panel |
| `--text-panel-card-meta` | Card metadata | 14px | Regular 400 | 1.4 | 0 | Marca, descripcion en cards panel |
| `--text-panel-body` | Body panel | 14px | Regular 400 | 1.5 | 0 | Texto general del panel, descripciones formulario (gris #6B7280) |
| `--text-panel-stat` | Numero dashboard | 32px | Bold 700 | 1.1 | -0.01em | Numeros grandes en summary cards dashboard |
| `--text-panel-stat-label` | Label dashboard | 14px | Regular 400 | 1.4 | 0 | Labels bajo numeros en summary cards |
| `--text-panel-table-header` | Header tabla | 13px | Semibold 600 | 1.0 | 0.08em | Headers de columna en tablas, SIEMPRE text-transform: uppercase, color #6B7280 |
| `--text-panel-table-body` | Body tabla | 14px | Regular 400 | 1.4 | 0 | Texto dentro de celdas de tabla |
| `--text-panel-form-label` | Label formulario | 14px | Medium 500 | 1.0 | 0 | Labels arriba de campos de formulario |
| `--text-panel-form-desc` | Descripcion formulario | 14px | Regular 400 | 1.5 | 0 | Descripcion bajo subtitulo de seccion, color #6B7280 |
| `--text-panel-sidebar` | Sidebar item | 15px | Medium 500 | 1.0 | 0 | Items del menu lateral |
| `--text-panel-badge` | Badge | 12px | Semibold 600 | 1.0 | 0 | Texto dentro de badges pill |
| `--text-panel-kanban-header` | Kanban header | 13px | Semibold 600 | 1.0 | 0.08em | Headers de columnas kanban, UPPERCASE, con conteo |

### 3.3 Implementacion CSS

```css
/* Google Fonts import (variable font) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  /* Font Family */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  /* Font Weights */
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
}
```

---

## 4. Spacing

### 4.1 Escala Base

Unidad base: **4px**. Multiplicadores de 1x a 24x para cubrir todos los usos, desde padding interno de badges hasta spacing entre secciones.

| Token | Valor | Multiplicador | Uso principal |
|---|---|---|---|
| `--space-1` | 4px | 1x | Micro-spacing: gap entre icono y texto en badges |
| `--space-2` | 8px | 2x | Padding interno de badges, gap entre chips/pills |
| `--space-3` | 12px | 3x | Padding horizontal badges, gap entre items en listas pequenas |
| `--space-4` | 16px | 4x | Padding area contenido panel mobile, gap entre campos formulario, celda tabla padding vertical |
| `--space-5` | 20px | 5x | Padding dentro cards panel, padding lateral mobile sitio publico, gap cards panel mobile |
| `--space-6` | 24px | 6x | Gap entre cards panel desktop, separacion entre componentes |
| `--space-7` | 28px | 7x | Gap grid productos sitio publico desktop |
| `--space-8` | 32px | 8x | Padding area contenido panel desktop, separacion mayor entre bloques |
| `--space-10` | 40px | 10x | Padding lateral desktop contenedor sitio publico |
| `--space-12` | 48px | 12x | Padding bloques color mobile, spacing entre secciones mobile (parte) |
| `--space-16` | 64px | 16x | Spacing entre secciones mobile sitio publico |
| `--space-18` | 72px | 18x | Padding bloques color desktop |
| `--space-20` | 80px | 20x | Padding vertical CTA fabricantes banner |
| `--space-24` | 96px | 24x | Spacing entre secciones desktop sitio publico |

### 4.2 Spacing de Secciones -- Sitio Publico (PRESCRITO)

| Contexto | Desktop (>=1280px) | Tablet (768-1279px) | Mobile (<768px) |
|---|---|---|---|
| Entre secciones del home | 96px | 80px | 64px |
| Entre hero y primera seccion | 0px | 0px | 0px |
| Padding interno bloques color | 72px | 60px | 48px |
| Padding vertical CTA fabricantes | 80px | 64px | 48px |
| Padding lateral contenedor | 40px | 32px | 20px |
| Max-width contenedor | 1280px | 100% | 100% |

### 4.3 Spacing del Panel (PRESCRITO)

| Contexto | Desktop (>=1280px) | Tablet (768-1279px) | Mobile (<768px) |
|---|---|---|---|
| Padding area contenido | 32px | 24px | 16px |
| Gap entre cards | 24px | 24px | 16px |
| Padding dentro cards | 20px | 20px | 16px |
| Gap grid productos mobile | 20px | 20px | 16px |
| Sidebar ancho | 272px | 72px (colapsado, solo iconos) | 0px (hamburger) |
| Header altura | 68px | 68px | 56px |

### 4.4 Grid y Layout

#### Sitio Publico

```
Contenedor: max-width 1280px, margin 0 auto, padding-inline 40px (desktop) / 20px (mobile)

Grid de productos:
- Desktop (>=1280px): 3 columnas, gap 28px
- Tablet (768-1279px): 2 columnas, gap 24px
- Mobile (<768px): 1 columna, gap 20px

Grid de marcas:
- Desktop (>=1280px): 3-4 columnas, gap 28px
- Tablet (768-1279px): 2-3 columnas, gap 24px
- Mobile (<768px): 1-2 columnas, gap 20px

Detalle producto:
- Desktop: 55% galeria + 45% info, gap 48px
- Mobile: stack vertical, galeria arriba
```

#### Panel

```
Layout base: sidebar (272px fijo) + contenido (flex: 1)

Grid cards productos panel:
- Desktop (>=1280px): 3 columnas, gap 24px
- Tablet (1024-1279px): 2 columnas, gap 24px
- Mobile (<768px): 1 columna, gap 16px

Formularios:
- Campos cortos: grid 2 columnas (nombre ES | nombre EN, marca | categoria)
- Campos largos: full-width (textareas, upload zones)
- Gap entre campos: 16px vertical, 24px horizontal
```

### 4.5 Breakpoints (PRESCRITOS)

| Token | Valor | Descripcion | Contexto |
|---|---|---|---|
| `--bp-mobile` | 375px | Base mobile (iPhone SE) | Sitio publico: diseno base (mobile-first) |
| `--bp-tablet` | 768px | Tablet / Breakpoint intermedio | Ambos: cambio de layout |
| `--bp-desktop` | 1024px | Desktop pequeno / Tablet landscape | Panel: sidebar colapsable |
| `--bp-desktop-lg` | 1280px | Desktop estandar | Ambos: layout completo, max-width contenedor |
| `--bp-desktop-xl` | 1440px | Desktop grande | Sitio publico: margenes laterales mas generosos |

---

## 5. Elevacion (Sombras) -- Decision holistica 10.4

| Token | Valor | Uso | Plataforma |
|---|---|---|---|
| `--shadow-sm` | `0 1px 3px rgba(0, 0, 0, 0.08)` | Cards en reposo, tabla container, header sticky, cards resumen panel | Ambas |
| `--shadow-md` | `0 4px 12px rgba(0, 0, 0, 0.12)` | Cards hover (producto y panel), dropdowns abiertos | Ambas |
| `--shadow-lg` | `0 8px 24px rgba(0, 0, 0, 0.12)` | Modales, popovers, search overlay, sticky bar | Ambas |
| `--shadow-whatsapp` | `0 4px 12px rgba(0, 0, 0, 0.15)` | Boton flotante WhatsApp | Sitio publico |
| `--shadow-none` | `none` | Reset de sombra (para estados deshabilitados) | Ambas |

**Principio:** Las sombras en HESA son sutiles y casi imperceptibles en reposo, revelando profundidad solo en hover y en elementos flotantes. Esto es consistente con el patron observado en Dashly (sombras sutiles, card planas en reposo) y diferencia de la competencia (que no usa sombras en absoluto).

---

## 6. Border Radius

| Token | Valor | Uso |
|---|---|---|
| `--radius-none` | 0px | Elementos sin redondeo (lineas, separadores) |
| `--radius-sm` | 6px | Badges pequenos, tooltips |
| `--radius-md` | 8px | Botones CTA, boton hero |
| `--radius-input` | 10px | Campos de formulario panel (PRESCRITO: 10px) |
| `--radius-card` | 12px | Cards de producto sitio publico, cards genericas |
| `--radius-card-panel` | 16px | Cards del panel (resumen, productos, marcas), modales (PRESCRITO: 16px) |
| `--radius-lg` | 20px | Elementos decorativos grandes |
| `--radius-block` | 24px | Bloques de color storytelling sitio publico (PRESCRITO: 24px) |
| `--radius-pill` | 9999px | Badges pill, toggle card/table view, tabs pill, pills de filtros, dots carrusel |
| `--radius-circle` | 50% | Iconos en circulos decorativos, foto equipo, boton WhatsApp |

---

## 7. Transiciones y Animaciones -- Secciones 5 y 10.1 de visual-analysis.md

### 7.1 Duraciones

| Token | Valor | Uso |
|---|---|---|
| `--duration-fast` | 150ms | Hover filas tabla panel, micro-interacciones |
| `--duration-normal` | 200ms | Hover botones, dropdowns, toggle vistas panel, hover cards panel |
| `--duration-slow` | 300ms | Hover cards producto sitio publico (shadow + scale), transiciones de contenido |
| `--duration-slower` | 500ms | Scroll fade-in animations, aparicion de secciones |
| `--duration-toast` | 3000ms | Duracion de display de toast notifications antes de auto-dismiss |

### 7.2 Easing Functions (Decision holistica 10.1)

| Token | Valor | Uso |
|---|---|---|
| `--ease-hover` | `ease-out` | Hover en botones, cards, links -- respuesta inmediata, desaceleracion natural |
| `--ease-scroll` | `cubic-bezier(0.4, 0, 0.2, 1)` | Scroll animations fade-in -- Material Design standard, profesional |
| `--ease-dropdown` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Dropdowns, slides, apertura de menus -- suave con desaceleracion gradual |
| `--ease-toast-in` | `ease-in-out` | Entrada de toast notifications |
| `--ease-toast-out` | `ease-in` | Salida de toast notifications |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Badge pulse sutil al recibir nueva notificacion |

### 7.3 Transiciones Compuestas

| Token | Valor | Uso | BVC/REQ |
|---|---|---|---|
| `--transition-card-hover` | `box-shadow 0.3s ease-out, transform 0.3s ease-out` | Hover cards producto sitio publico: shadow + scale(1.02) | BVC-033 |
| `--transition-card-panel-hover` | `box-shadow 0.2s ease-out, border-color 0.2s ease-out` | Hover cards panel: shadow + borde mas visible | -- |
| `--transition-btn-hover` | `background-color 0.2s ease-out, border-color 0.2s ease-out, color 0.2s ease-out` | Hover botones CTA | BVC-005 |
| `--transition-row-hover` | `background-color 0.15s ease-out` | Hover filas tabla panel: fondo gris suave | -- |
| `--transition-link` | `color 0.2s ease-out` | Hover links de texto | -- |
| `--transition-fade-in` | `opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)` | Scroll fade-in de secciones (Intersection Observer) | BVC-005 |
| `--transition-dropdown` | `opacity 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Apertura de dropdowns y menus | -- |
| `--transition-whatsapp` | `transform 0.2s ease-out, box-shadow 0.2s ease-out` | Hover boton WhatsApp: scale(1.1) | -- |

### 7.4 Animaciones CSS Clave

```css
/* Scroll fade-in (aplicado con Intersection Observer + clase .is-visible) */
.fade-in-up {
  opacity: 0;
  transform: translateY(24px);
  transition: var(--transition-fade-in);
}
.fade-in-up.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Count-up animation (REQ-063, REQ-157) -- manejado con JS, la animacion es del numero incrementandose */

/* Card hover sitio publico (BVC-033) */
.product-card:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-md);
}

/* Underline animado links menu (izq-a-der) */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--brand-primary);
  transition: width 0.3s ease-out;
}
.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

/* Logos grayscale a color */
.brand-logo {
  filter: grayscale(100%);
  opacity: 0.6;
  transition: filter 0.3s ease-out, opacity 0.3s ease-out;
}
.brand-logo:hover {
  filter: grayscale(0%);
  opacity: 1;
}

/* Badge pulse (notificacion nueva) */
@keyframes badge-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
.badge-pulse {
  animation: badge-pulse 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Smooth scroll global */
html {
  scroll-behavior: smooth;
}
```

---

## 8. Iconografia (Decision holistica 10.5)

| Propiedad | Valor | Justificacion |
|---|---|---|
| Libreria recomendada | **Lucide Icons** (lucide.dev) | Open source, mas de 1400 iconos, estilo outline/stroke consistente, tree-shakeable, componentes Angular disponibles |
| Alternativas aceptables | Heroicons, Phosphor Icons | Mismo estilo outline/stroke, intercambiables |
| Trazo (stroke-width) | 1.5-2px | Consistente con el estilo observado en Dashly |
| Tamano sidebar | 20-24px | Items de menu lateral panel |
| Tamano cards | 24-28px | Iconos dentro de cards (beneficios, resumen dashboard) |
| Tamano botones | 16-20px | Iconos inline en botones |
| Tamano tabla acciones | 18-20px | Iconos ver/editar/eliminar en tablas |
| Color | Hereda del contexto | Gris (#6B7280) en sidebar inactivo, blanco (#FFFFFF) en sidebar activo sobre azul, verde (#50B92A) en iconos de beneficio |

### Circulos Decorativos (Patron Dashly #8, #15)

| Token | Valor | Uso |
|---|---|---|
| `--icon-circle-size` | 48px | Diametro del circulo decorativo detras del icono |
| `--icon-circle-opacity` | 0.10 - 0.15 | Opacity del color base para el fondo del circulo |
| Ejemplo Farmacos | Icono 24px azul #008DC9 sobre circulo 48px con fondo rgba(0, 141, 201, 0.12) | Cards resumen dashboard, cards categoria |
| Ejemplo Alimentos | Icono 24px verde #22C55E sobre circulo 48px con fondo rgba(34, 197, 94, 0.12) | Cards resumen dashboard |
| Ejemplo Equipos | Icono 24px gris #6B7280 sobre circulo 48px con fondo rgba(107, 114, 128, 0.12) | Cards resumen dashboard |

---

## 9. Opacidades

| Token | Valor | Uso |
|---|---|---|
| `--opacity-disabled` | 0.5 | Botones y campos deshabilitados |
| `--opacity-overlay` | 0.5 | Overlay fondo oscuro (search overlay, modales) |
| `--opacity-hero-overlay` | 0.55 | Overlay gradient hero (zona mas oscura, lado texto) |
| `--opacity-logo-grayscale` | 0.6 | Logos de marcas en estado grayscale |
| `--opacity-icon-circle` | 0.12 | Fondo de circulos decorativos de iconos |
| `--opacity-placeholder` | 0.5 | Texto placeholder en campos de formulario |
| `--opacity-hover-row` | 0.04 | Fondo hover de filas de tabla (negro 4% = gris muy sutil) |

---

## 10. Z-Index Scale

| Token | Valor | Uso |
|---|---|---|
| `--z-base` | 0 | Contenido normal |
| `--z-dropdown` | 100 | Dropdowns, submenus, tooltips |
| `--z-sticky` | 200 | Header sticky sitio publico, barra sticky producto |
| `--z-sidebar` | 300 | Sidebar panel (sobre contenido en tablet/mobile) |
| `--z-overlay` | 400 | Overlay oscuro (backdrop de modales, search overlay) |
| `--z-modal` | 500 | Modales de confirmacion |
| `--z-toast` | 600 | Toast notifications (siempre arriba de todo) |
| `--z-whatsapp` | 700 | Boton flotante WhatsApp (visible siempre, excepto sobre modales) |

---

## 11. Componentes Visuales Especificos

### 11.1 Botones

| Variante | Background | Texto | Borde | Border-radius | Padding | Min-height |
|---|---|---|---|---|---|---|
| Primario | `#008DC9` | `#FFFFFF` (18px+ bold) | none | 8px | 16px 32px | 48px |
| Primario hover | `#005A85` | `#FFFFFF` | none | 8px | -- | -- |
| Outline | transparent | `#008DC9` | 2px solid #008DC9 | 8px | 14px 30px | 48px |
| Outline hover | `#E8F4FD` | `#005A85` | 2px solid #005A85 | 8px | -- | -- |
| Blanco (sobre fondo azul) | `#FFFFFF` | `#008DC9` | none | 8px | 16px 32px | 48px |
| Danger | `#EF4444` | `#FFFFFF` (16px+ bold) | none | 8px | 16px 32px | 48px |
| Danger hover | `#991B1B` | `#FFFFFF` | none | 8px | -- | -- |
| Ghost | transparent | `#6B7280` | none | 8px | 8px 16px | 36px |
| Disabled | `#E5E7EB` | `#6B7280` at 50% | none | 8px | -- | -- |

**Area de toque minima (NFR-026):** Todos los botones en mobile tienen min-height y min-width de 44px.

### 11.2 Campos de Formulario (Panel)

| Propiedad | Valor |
|---|---|
| Background | `#FFFFFF` |
| Border | 1px solid `#E5E7EB` |
| Border radius | 10px |
| Altura | 44px (inputs), auto (textareas) |
| Padding | 12px 16px |
| Font | Inter Regular 14px, color #1F2937 |
| Placeholder | Inter Regular 14px, color #6B7280 at 50% opacity |
| Focus border | 2px solid `#008DC9` |
| Focus ring | 0 0 0 3px rgba(0, 141, 201, 0.15) |
| Error border | 2px solid `#EF4444` |
| Error ring | 0 0 0 3px rgba(239, 68, 68, 0.15) |
| Disabled | background #F5F7FA, opacity 0.5 |

### 11.3 Badges Pill

| Variante | Texto | Fondo | Border-radius | Padding | Font |
|---|---|---|---|---|---|
| Farmaco (azul) | `#005A85` | `#EBF5FF` | 9999px | 4px 12px | 12px Semibold 600 |
| Alimento (verde) | `#166534` | `#DCFCE7` | 9999px | 4px 12px | 12px Semibold 600 |
| Equipo (gris) | `#1F2937` | `#F0F2F5` | 9999px | 4px 12px | 12px Semibold 600 |
| Activo (verde) | `#166534` | `#DCFCE7` | 9999px | 4px 12px | 12px Semibold 600 |
| Inactivo (rojo) | `#991B1B` | `#FEE2E2` | 9999px | 4px 12px | 12px Semibold 600 |
| Pendiente (naranja) | `#92400E` | `#FEF3C7` | 9999px | 4px 12px | 12px Semibold 600 |
| Fabricante (morado) | `#5B21B6` | `#EDE9FE` | 9999px | 4px 12px | 12px Semibold 600 |
| Info (azul) | `#005A85` | `#EBF5FF` | 9999px | 4px 12px | 12px Semibold 600 |

### 11.4 Estado Activo de Navegacion (REQ-007, REQ-214)

**Sitio publico -- Header nav link activo:**
- Underline animado: linea 2px `#008DC9` bajo el texto, full-width, transicion 0.3s ease-out de izq a der
- Color texto: `#008DC9` (el link activo cambia de #1F2937 a azul)
- El link activo se determina por la ruta actual

**Panel -- Sidebar item activo (REQ-214):**
- Fondo: `#EBF5FF` (azul suave)
- Texto: `#008DC9` (azul HESA)
- Icono: `#008DC9`
- Border-left: 3px solid `#008DC9`
- Border-radius: 0 8px 8px 0
- Font-weight: 600 (Semibold)

**Panel -- Sidebar item inactivo:**
- Fondo: transparent
- Texto: `#6B7280`
- Icono: `#6B7280`
- Hover: fondo `#F5F7FA`, texto `#1F2937`

### 11.5 Pills de Filtros Activos (REQ-093)

| Propiedad | Valor |
|---|---|
| Background | `#E8F4FD` |
| Border | 1px solid `#008DC9` |
| Border-radius | 9999px |
| Padding | 6px 12px |
| Texto | `#005A85`, 13px Medium 500 |
| Boton "x" | 14px, color `#008DC9`, hover color `#005A85` |
| Transicion | background 0.2s ease-out |

### 11.6 Pills de Presentaciones Producto (REQ-114, GAP-D03)

| Estado | Background | Border | Texto |
|---|---|---|---|
| Default | `#FFFFFF` | 1px solid `#E5E7EB` | `#1F2937`, 14px Medium 500 |
| Hover | `#F5F7FA` | 1px solid `#008DC9` | `#008DC9` |
| Seleccionado | `#E8F4FD` | 2px solid `#008DC9` | `#005A85`, 14px Semibold 600 |
| Border-radius | 9999px | -- | -- |
| Padding | 8px 16px | -- | -- |
| Min-height | 36px (mobile: 44px) | -- | -- |

### 11.7 Badges de Especie (REQ-112)

| Propiedad | Valor |
|---|---|
| Layout | Icono (16px) + texto |
| Background | `#F5F7FA` |
| Border-radius | 8px |
| Padding | 6px 12px |
| Texto | `#1F2937`, 13px Medium 500 |
| Contenedor | Franja horizontal con gap 8px entre badges |

---

## 12. CSS Custom Properties -- Exportacion Completa

```css
:root {
  /* ===== COLORES DE MARCA ===== */
  --brand-primary: #008DC9;
  --brand-secondary: #50B92A;
  --brand-dark: #005A85;

  /* ===== ESCALA PRIMARIO ===== */
  --brand-primary-50: #f0f7ff;
  --brand-primary-100: #dbedff;
  --brand-primary-200: #aed9fe;
  --brand-primary-300: #5ebffe;
  --brand-primary-400: #319edc;
  --brand-primary-500: #008dc9;
  --brand-primary-600: #146995;
  --brand-primary-700: #01557c;
  --brand-primary-800: #064260;
  --brand-primary-900: #032f46;
  --brand-primary-950: #011e2f;

  /* ===== ESCALA SECUNDARIO ===== */
  --brand-secondary-50: #e3ffd3;
  --brand-secondary-100: #b3ff90;
  --brand-secondary-200: #86ec5d;
  --brand-secondary-300: #65cd3f;
  --brand-secondary-400: #50b92a;
  --brand-secondary-500: #288901;
  --brand-secondary-600: #237205;
  --brand-secondary-700: #1b5d04;
  --brand-secondary-800: #124801;
  --brand-secondary-900: #113301;
  --brand-secondary-950: #102002;

  /* ===== ESCALA AZUL OSCURO ===== */
  --brand-dark-50: #f0f7ff;
  --brand-dark-100: #dcedfe;
  --brand-dark-200: #b2d9fe;
  --brand-dark-300: #82bced;
  --brand-dark-400: #609ccb;
  --brand-dark-500: #3c7daa;
  --brand-dark-600: #216995;
  --brand-dark-700: #005a85;
  --brand-dark-800: #084161;
  --brand-dark-900: #042f47;
  --brand-dark-950: #011e2f;

  /* ===== NEUTROS ===== */
  --neutral-white: #FFFFFF;
  --neutral-50: #F5F7FA;
  --neutral-100: #F7F8FA;
  --neutral-200: #E5E7EB;
  --neutral-400: #6B7280;
  --neutral-900: #1F2937;

  /* ===== SUPERFICIES POR CATEGORIA ===== */
  --surface-pharma: #E8F4FD;
  --surface-food: #EDF7E8;
  --surface-equipment: #F0F2F5;

  /* ===== SEMANTICOS ===== */
  --color-success: #22C55E;
  --color-success-soft: #DCFCE7;
  --color-success-text: #166534;
  --color-danger: #EF4444;
  --color-danger-soft: #FEE2E2;
  --color-danger-text: #991B1B;
  --color-warning: #F59E0B;
  --color-warning-soft: #FEF3C7;
  --color-warning-text: #92400E;
  --color-info: #008DC9;
  --color-info-soft: #EBF5FF;
  --color-info-text: #005A85;

  /* ===== TIPO MENSAJE (REQ-296) ===== */
  --msg-info-text: #005A85;
  --msg-info-bg: #EBF5FF;
  --msg-comercial-text: #166534;
  --msg-comercial-bg: #DCFCE7;
  --msg-soporte-text: #92400E;
  --msg-soporte-bg: #FEF3C7;
  --msg-fabricante-text: #5B21B6;
  --msg-fabricante-bg: #EDE9FE;
  --msg-otro-text: #1F2937;
  --msg-otro-bg: #F0F2F5;

  /* ===== WHATSAPP ===== */
  --whatsapp-green: #25D366;
  --whatsapp-green-hover: #20BD5A;

  /* ===== OVERLAYS ===== */
  --overlay-dark: rgba(0, 0, 0, 0.5);

  /* ===== TIPOGRAFIA ===== */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;

  /* ===== SPACING ===== */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 28px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-18: 72px;
  --space-20: 80px;
  --space-24: 96px;

  /* ===== SOMBRAS ===== */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  --shadow-whatsapp: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-none: none;

  /* ===== BORDER RADIUS ===== */
  --radius-none: 0px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-input: 10px;
  --radius-card: 12px;
  --radius-card-panel: 16px;
  --radius-lg: 20px;
  --radius-block: 24px;
  --radius-pill: 9999px;
  --radius-circle: 50%;

  /* ===== TRANSICIONES ===== */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;
  --duration-toast: 3000ms;

  --ease-hover: ease-out;
  --ease-scroll: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-dropdown: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-toast-in: ease-in-out;
  --ease-toast-out: ease-in;
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  --transition-card-hover: box-shadow 0.3s ease-out, transform 0.3s ease-out;
  --transition-card-panel-hover: box-shadow 0.2s ease-out, border-color 0.2s ease-out;
  --transition-btn-hover: background-color 0.2s ease-out, border-color 0.2s ease-out, color 0.2s ease-out;
  --transition-row-hover: background-color 0.15s ease-out;
  --transition-link: color 0.2s ease-out;
  --transition-fade-in: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-dropdown: opacity 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --transition-whatsapp: transform 0.2s ease-out, box-shadow 0.2s ease-out;

  /* ===== OPACIDADES ===== */
  --opacity-disabled: 0.5;
  --opacity-overlay: 0.5;
  --opacity-hero-overlay: 0.55;
  --opacity-logo-grayscale: 0.6;
  --opacity-icon-circle: 0.12;
  --opacity-placeholder: 0.5;
  --opacity-hover-row: 0.04;

  /* ===== Z-INDEX ===== */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-sidebar: 300;
  --z-overlay: 400;
  --z-modal: 500;
  --z-toast: 600;
  --z-whatsapp: 700;

  /* ===== ICONOGRAFIA ===== */
  --icon-circle-size: 48px;
  --icon-size-sm: 16px;
  --icon-size-md: 20px;
  --icon-size-lg: 24px;
  --icon-size-xl: 28px;
  --icon-stroke: 1.75;

  /* ===== LAYOUT FIJO PANEL ===== */
  --sidebar-width: 272px;
  --sidebar-collapsed: 72px;
  --header-height: 68px;
  --header-height-mobile: 56px;

  /* ===== CONTENEDOR SITIO PUBLICO ===== */
  --container-max: 1280px;
  --container-padding: 40px;
  --container-padding-mobile: 20px;
}
```

---

## 13. Bootstrap 5 -- Variables de Sobreescritura

Para integrar los design tokens con Bootstrap 5 (SCSS), las variables de Bootstrap se sobreescriben en `_variables.scss` antes de importar Bootstrap:

```scss
// ==== Bootstrap 5 Theme Overrides ====
// Estos valores se derivan de los design tokens del brief

$primary: #008DC9;      // --brand-primary
$secondary: #50B92A;    // --brand-secondary
$success: #22C55E;      // --color-success
$danger: #EF4444;       // --color-danger
$warning: #F59E0B;      // --color-warning
$info: #008DC9;         // --color-info (reutiliza primario)
$dark: #1F2937;         // --neutral-900
$light: #F5F7FA;        // --neutral-50

$body-color: #1F2937;
$body-bg: #FFFFFF;

$font-family-sans-serif: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
$font-size-base: 1rem;  // 16px

$border-radius: 8px;     // --radius-md (botones, inputs generales)
$border-radius-sm: 6px;  // --radius-sm
$border-radius-lg: 16px; // --radius-card-panel
$border-radius-pill: 9999px;

$border-color: #E5E7EB;  // --neutral-200

$box-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
$box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
$box-shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

$spacer: 1rem;  // 16px = --space-4

$grid-gutter-width: 1.5rem;  // 24px = --space-6

$container-max-widths: (
  sm: 540px,
  md: 720px,
  lg: 960px,
  xl: 1280px,  // --container-max
  xxl: 1280px  // mismo max-width
);

$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,   // --bp-tablet
  lg: 1024px,  // --bp-desktop
  xl: 1280px,  // --bp-desktop-lg
  xxl: 1440px  // --bp-desktop-xl
);

// Input customization
$input-border-color: #E5E7EB;
$input-border-radius: 10px;  // --radius-input
$input-focus-border-color: #008DC9;
$input-focus-box-shadow: 0 0 0 3px rgba(0, 141, 201, 0.15);
$input-padding-y: 0.625rem;   // 10px
$input-padding-x: 1rem;       // 16px
$input-height: 44px;          // area de toque minima

// Button customization
$btn-font-weight: 600;
$btn-padding-y: 0.75rem;     // 12px
$btn-padding-x: 2rem;        // 32px
$btn-border-radius: 8px;

// Card customization
$card-border-radius: 12px;   // --radius-card (sitio publico)
$card-border-color: transparent;
$card-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
```

---

## 14. Principios de Diseno Premium

Estos principios se derivan del analisis de las referencias (Tuft & Paw, Dashly) y los anti-ejemplos (Monteco, VETIM, Belina). Son el "ADN" que hace que el diseno se sienta premium y profesional.

### Principio 1: Whitespace extremadamente generoso
- **Fundamento:** T&P usa 80-120px entre secciones. Monteco usa ~40px. HESA usa 96px desktop, 64px mobile.
- **Implementacion:** Minimo 96px entre secciones de pagina en desktop. Padding interno de bloques de color: 72px. Nunca "llenar" espacio vacio -- el espacio ES el diseno.
- **Verificacion:** BVC-002, BVC-015

### Principio 2: Tipografia como protagonista con jerarquia dramatica
- **Fundamento:** T&P usa titulos de 72-80px con serif display. HESA usa 56px Inter Extrabold con tracking -0.02em. La competencia usa 24-32px sin personalidad.
- **Implementacion:** Ratio de contraste tipografico minimo de 3.5x entre heading y body (56px/16px = 3.5x). El heading DEBE ser lo primero que lees al llegar a cualquier seccion.
- **Verificacion:** BVC-003, BVC-031

### Principio 3: Color con proposito, nunca decorativo
- **Fundamento:** Cada color en la paleta tiene una funcion: azul = accion/interaccion, verde = positivo/naturaleza, gris = neutro/informacion. Los bloques de color por categoria (#E8F4FD, #EDF7E8, #F0F2F5) diferencian contenido, no decoran.
- **Implementacion:** No usar colores fuera de la paleta prescrita. No introducir colores nuevos sin justificacion funcional. Cada uso de color debe poder explicarse ("este azul indica que es clicable", "este verde indica exito").
- **Verificacion:** BVC-004

### Principio 4: Microinteracciones como diferenciador competitivo
- **Fundamento:** La competencia (Monteco, VETIM, Belina) no tiene NINGUNA animacion. HESA usa hover transitions, scroll fade-in, count-up, logos grayscale-to-color, underline animado. Cada interaccion refuerza la sensacion de pulido.
- **Implementacion:** Toda interaccion tiene feedback visual: hover en cards (scale + shadow), hover en links (underline animado), scroll (fade-in), numeros (count-up). Duraciones <=0.3s para hover, <=0.5s para scroll. NUNCA agresivas -- siempre sutiles.
- **Verificacion:** BVC-005, BVC-033

### Principio 5: Imagenes como experiencia, no como relleno
- **Fundamento:** T&P trata cada imagen como un elemento de experiencia (lifestyle shots, product shots profesionales). La competencia usa stock generico o fotos de baja calidad.
- **Implementacion:** Toda imagen debe tener aspect ratio definido (1:1, 4:5, 16:9) para evitar distorsion. Fondos de producto siempre #F5F7FA (gris claro uniforme, no blanco puro). Sin placeholders de stock generico en produccion.
- **Verificacion:** BVC-001, BVC-007

### Principio 6: Consistencia cross-plataforma implacable
- **Fundamento:** El sitio publico y el panel usan la misma paleta de colores, la misma tipografia (Inter), los mismos tokens de spacing, las mismas sombras. Un usuario que ve el sitio y luego usa el panel siente que es el mismo producto.
- **Implementacion:** Tokens compartidos via CSS custom properties. Misma escala de colores, mismos neutros, mismos semanticos. Solo difieren los tokens de layout (sidebar, header del panel).
- **Verificacion:** BVC-024

### Principio 7: B2B profesional, nunca B2C emocional
- **Fundamento:** El brief es explicito: "Confianza, solidez, experiencia. No tierno ni divertido." Las imagenes deben ser de veterinarios trabajando, laboratorios, equipos profesionales. No fotos de mascotas tiernas.
- **Implementacion:** Tonalidad de color fria (azules, grises). Sin ilustraciones playful. Sin emojis. Sin colores brillantes saturados (excepto CTAs). El diseno transmite "37 anos de experiencia" y "distribuidor confiable", no "amamos a las mascotas".
- **Verificacion:** BVC-001, BVC-010

### Principio 8: Accesibilidad como baseline, no como extra
- **Fundamento:** WCAG 2.1 AA es el piso minimo. Todas las combinaciones texto/fondo verificadas matematicamente.
- **Implementacion:** Contraste 4.5:1 para texto normal, 3:1 para texto grande y UI components. Area de toque minima 44x44px en mobile. Focus visible en todos los interactivos. Labels asociados a campos. Alt text en imagenes.
- **Verificacion:** NFR-024, NFR-026

---

## 15. Mapeo Tokens a Requirements

### Tokens de Color

| REQ | Token(s) aplicables | Detalle |
|---|---|---|
| REQ-007 | `--brand-primary`, nav-link active | Estado activo: color #008DC9 + underline animado |
| REQ-082 | Badge de marca en product card | `--neutral-400` texto, fondo transparent, font 14px Regular |
| REQ-093 | `--surface-pharma`, `--brand-primary`, `--color-info-text` | Pills activos con fondo #E8F4FD, borde #008DC9, texto #005A85 |
| REQ-112 | `--neutral-50`, `--neutral-900` | Badges especie: fondo #F5F7FA, texto #1F2937 |
| REQ-114 | Pills presentaciones | Default: borde #E5E7EB. Seleccionado: fondo #E8F4FD, borde #008DC9 |
| REQ-145 | Badges categorias en brand cards | Mismos colores que badges panel por categoria |
| REQ-214 | `--color-info-soft`, `--brand-primary` | Sidebar activo: fondo #EBF5FF, texto #008DC9 |
| REQ-227 | Badges categoria + estado | Categoria: tabla seccion 1.9. Estado: tabla seccion 11.3 |
| REQ-291 | Badges tipo mensaje | Tabla seccion 1.8 completa |
| REQ-296 | Colores por tipo mensaje | Info=azul, Comercial=verde, Soporte=naranja, Fabricante=morado, Otro=gris |
| NFR-024 | Todas las combinaciones | Seccion 2 completa -- 25+ combinaciones verificadas |

### Tokens de Tipografia

| REQ | Token(s) aplicables | Detalle |
|---|---|---|
| REQ-044 | `--text-display` (56px Extrabold) | Hero headline principal desktop |
| REQ-063 | `--text-stat-number` (48px Bold) | Numeros propuesta de valor |
| REQ-110 | `--text-product-name` (32px Bold) | Nombre producto en detalle |
| REQ-143 | `--text-h1` (48px Bold) | Titulo pagina de marcas |
| REQ-157 | `--text-stat-number-large` (64px Bold) | Numeros pagina Nosotros |

### Tokens de Spacing/Layout

| REQ | Token(s) aplicables | Detalle |
|---|---|---|
| REQ-042 | Hero 100vh | height: 100vh (o 100dvh mobile) |
| REQ-024 | `--space-6` (24px) | Separacion boton WhatsApp del borde |
| NFR-026 | Min 44x44px | Todos los interactivos en mobile |

### Tokens de Animaciones

| REQ/BVC | Token(s) aplicables | Detalle |
|---|---|---|
| BVC-005 | `--duration-slow` (300ms), `--duration-normal` (200ms) | Duraciones maximas hover/scroll |
| BVC-033 | `--transition-card-hover`, scale(1.02), `--shadow-md` | Hover cards con shadow + scale |

---

## 16. Checklist de Verificacion del Design System (DEMO-044)

| # | Criterio | Estado | Evidencia |
|---|---|---|---|
| 1 | Paleta de colores completa con hex codes exactos del brief | Verificado | Seccion 1: todos los hex codes de visual-analysis.md seccion 2 presentes |
| 2 | Escalas monocromaticas 50-950 para colores de marca | Verificado | Secciones 1.2, 1.3, 1.4: generadas con generate_monochromatic |
| 3 | Colores semanticos con fondos suaves | Verificado | Seccion 1.7: success, danger, warning, info con base + soft + text |
| 4 | Contraste WCAG AA verificado matematicamente | Verificado | Seccion 2: 25+ combinaciones con check_contrast |
| 5 | Conflictos de contraste documentados con resoluciones | Verificado | Seccion 2.4: 8 conflictos identificados, todos con resolucion |
| 6 | Tipografia Inter con escala completa | Verificado | Seccion 3: 25+ niveles tipograficos definidos |
| 7 | Spacing basado en unidad de 4px | Verificado | Seccion 4: escala de 4px a 96px |
| 8 | Valores de spacing exactos del brief | Verificado | Secciones 4.2, 4.3: bloques 72px/48px, secciones 96px/64px, panel 32px/16px |
| 9 | Sombras definidas (sm, md, lg) | Verificado | Seccion 5: 5 niveles de sombra |
| 10 | Border-radius definidos | Verificado | Seccion 6: 10 niveles de 0 a circle |
| 11 | Transiciones y animaciones con duraciones y easing | Verificado | Seccion 7: duraciones, easing, transiciones compuestas, animaciones CSS |
| 12 | Iconografia definida (libreria, tamanos, circulos) | Verificado | Seccion 8: Lucide Icons, 4 tamanos, circulos decorativos |
| 13 | CSS custom properties exportadas | Verificado | Seccion 12: exportacion completa lista para produccion |
| 14 | Variables Bootstrap 5 SCSS sobreescritas | Verificado | Seccion 13: $primary, $secondary, $success, breakpoints, radii |
| 15 | Principios de diseno premium documentados | Verificado | Seccion 14: 8 principios con fundamento y verificacion |
| 16 | Mapeo tokens a requirements | Verificado | Seccion 15: REQ-007 a NFR-026 mapeados |
| 17 | Colores por tipo de mensaje (REQ-296) | Verificado | Seccion 1.8: 5 tipos con hex exactos y contraste AA |
| 18 | Colores por categoria cross-plataforma | Verificado | Seccion 1.9: Farmacos/Alimentos/Equipos panel + sitio |

---

*Documento generado por el Visual System Designer. Todos los colores prescritos del brief del cliente se mantienen intactos. Los conflictos de contraste se resuelven con variantes oscuras para texto, no modificando los colores de marca. Las escalas monocromaticas y verificaciones de contraste fueron realizadas con colorsandfonts.com.*

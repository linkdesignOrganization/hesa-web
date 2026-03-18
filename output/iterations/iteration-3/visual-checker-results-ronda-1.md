# Resultados -- Visual Checker

## Resultados por Criterio

| Criterio | Estado | Breakpoint | Evidencia |
|----------|--------|------------|-----------|
| REQ-024 | PASA | desktop | e2e/screenshots/REQ-024-home-desktop.png, e2e/screenshots/REQ-024-catalog-desktop.png |
| REQ-025 | PASA | mobile/tablet/desktop | CSS analysis: 56x56px at all breakpoints (>= 44x44px), e2e/screenshots/REQ-025-mobile-viewport.png |
| REQ-026 | FALLA | mobile | CSS analysis: sticky bar (bottom:0, z-index:998) covers FAB (bottom:20px, z-index:700) on mobile, e2e/screenshots/REQ-026-product-detail-desktop.png |
| REQ-191 | PASA | desktop | e2e/screenshots/REQ-191-manufacturer-error-state.png |
| NFR-030 | PASA | desktop | Source code inspection: injectFBPixel() in app.component.ts, fbPixelEnabled flag in site-config |

## Bugs Encontrados

BUG-V01:
- Criterio: REQ-026
- Tipo: responsive
- Breakpoint: mobile (<1024px)
- Descripcion: En mobile, la sticky bar del detalle de producto (position:fixed, bottom:0, z-index:998, height:64px) se superpone con el WhatsApp FAB (position:fixed, bottom:20px, z-index:700, height:56px). Cuando ambos estan visibles (scroll en product detail), el sticky bar cubre parcialmente el FAB porque tiene un z-index mayor (998 vs 700) y ambos estan en la zona inferior del viewport. El FAB ocupa y=736 a y=792, y la sticky bar ocupa y=748 a y=812 (viewport 812px), resultando en 44px de overlap vertical.
- Esperado: El FAB deberia desplazarse hacia arriba cuando la sticky bar esta visible en mobile (ej: bottom: 84px cuando sticky-bar--visible esta activo), o tener un z-index superior al sticky bar.
- Actual: El FAB permanece en bottom:20px y es cubierto por la sticky bar.
- Severidad: alta
- Evidencia: CSS analisis en whatsapp-fab.component.scss (lineas 5-26) y product-detail.component.scss (lineas 368-467). No hay logica de ajuste de posicion del FAB cuando la sticky bar es visible.

BUG-V02:
- Criterio: N/A (observacion durante testing)
- Tipo: visual
- Breakpoint: todos
- Descripcion: El SPA presenta un comportamiento de redireccion erratica durante la navegacion. Al navegar a /es/catalogo/farmacos/amoxicilina-veterinaria, la pagina carga brevemente pero luego redirige a /es/contacto o /es/distribuidores. Esto ocurrio de forma intermitente durante el testing, complicando la verificacion de REQ-026 en producto detalle.
- Esperado: Las rutas de producto detalle deberian permanecer estables tras la carga.
- Actual: Redireccion aleatoria a otras paginas despues de la carga lazy del componente.
- Severidad: alta
- Evidencia: Observado durante multiples intentos de navegacion a rutas de producto detalle. El titulo de pagina cambia de "Producto | HESA" a "Contacto | HESA" sin interaccion del usuario.

## Tests Generados
- e2e/tests/visual/REQ-024-whatsapp-fab-positioning.spec.ts
- e2e/tests/visual/REQ-025-whatsapp-fab-touch-target.spec.ts
- e2e/tests/visual/REQ-026-whatsapp-fab-sticky-bar.spec.ts (solo desktop, mobile FALLA)
- e2e/tests/visual/REQ-191-manufacturer-form-error.spec.ts
- e2e/tests/visual/NFR-030-fb-pixel-prepared.spec.ts

## Comparacion Visual
| Seccion | Similitud vs Referencia | Notas |
|---------|------------------------|-------|
| WhatsApp FAB | N/A | Sin referencia visual especifica disponible para comparar. FAB cumple DC-052: circular 56px, fondo #25D366, icono blanco 28px, position fixed bottom 24px right 24px, z-index 700, sombra 0 4px 12px rgba(0,0,0,0.15) |
| Manufacturer form error | N/A | Error state implementado segun DC-059/DC-132: mensaje de error visible, datos mantenidos, boton vuelve a estado normal |

## Detalle de Verificaciones

### REQ-024 - WhatsApp FAB no obstruye contenido
- **Desktop (1400px)**: FAB position:fixed, bottom:24px, right:24px, z-index:700, 56x56px. Evaluacion de overlap contra todos los elementos interactivos: 0 overlaps. Submit button del formulario de contacto tiene 475px de separacion horizontal.
- **Catalogo**: FAB no tapa paginacion (paginacion centrada, FAB en esquina inferior derecha).
- **Contacto**: Submit button en col izq, FAB en esquina der. Sin overlap.

### REQ-025 - Touch target >= 44x44px
- FAB es 56x56px en TODOS los breakpoints. CSS no tiene media query que reduzca el tamano.
- Solo cambia bottom/right de 24px a 20px en mobile (< 768px).
- 56px > 44px = PASA.

### REQ-026 - FAB no interfiere con sticky bar
- **Desktop**: Sticky bar: position:fixed, top:0, z-index:998. FAB: bottom:24px, z-index:700. Extremos opuestos del viewport = sin interferencia. PASA.
- **Mobile**: Sticky bar: bottom:0, height:64px, z-index:998. FAB: bottom:20px, height:56px, z-index:700. Overlap de 44px. Sticky bar cubre FAB. FALLA.

### REQ-191 - Error en formulario fabricante
- Al bloquear la API, el formulario muestra "No pudimos enviar tu mensaje. Intenta de nuevo." debajo del boton submit.
- Toast de error tambien aparece: "No se pudo conectar con el servidor. Verifica tu conexion."
- Datos del formulario se mantienen intactos.
- Boton submit vuelve a estado habilitado, permitiendo reintentar.
- PASA.

### NFR-030 - FB Pixel preparado pero no activo
- No hay scripts de FB Pixel cargados en el DOM.
- No hay llamadas de red a facebook.com.
- window.fbq es undefined.
- Codigo de inyeccion existe en app.component.ts (metodo injectFBPixel).
- Activacion condicional via config.fbPixelEnabled && config.fbPixelId.
- Panel admin tiene UI para configurar FB Pixel ID y activar/desactivar.
- Modelo de base de datos tiene fbPixelEnabled: false por defecto.
- PASA.

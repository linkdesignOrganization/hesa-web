# Plan de Distribucion — QA Team

## Contexto de Testing
- Iteracion: 3
- Ronda: 1
- URL del sitio desplegado: https://gray-field-02ba8410f.2.azurestaticapps.net
- URL del backend: https://hesa-api.azurewebsites.net
- Total criterios esta iteracion: 56
- Criterios nuevos a testear (publicos): 31
- Criterios N/A (admin auth requerida - Entra ID): 25
- Criterios a re-testear (fallaron en ronda anterior): 0

## Criterios N/A — Admin Panel (Entra ID requerido)

Los siguientes 25 criterios requieren acceso autenticado al panel de administracion via Azure Entra ID. El codigo existe pero no se puede verificar sin credenciales de Entra ID. Se marcan N/A:

### Dashboard (REQ-206 a REQ-211) — 6 criterios N/A
- REQ-206: Dashboard 4 cards resumen (productos, mensajes, marcas, destacados)
- REQ-207: Dashboard 3 cards acceso rapido por categoria
- REQ-208: Cards de categoria clickables navegan a listado filtrado
- REQ-209: Seccion "Ultimos mensajes" (5 recientes + "Ver todos")
- REQ-210: Seccion "Actividad reciente" (acciones CRUD)
- REQ-211: Datos del dashboard cargan independientemente (error handling)

### Mensajes — Kanban y Tabla (REQ-289 a REQ-296) — 8 criterios N/A
- REQ-289: Toggle entre vista Kanban y Table
- REQ-290: Vista Kanban tres columnas con conteo
- REQ-291: Card de mensaje con badge tipo, nombre, correo, mensaje truncado, fecha
- REQ-292: Drag-and-drop entre columnas para cambiar estado
- REQ-293: Vista Table con columnas completas
- REQ-294: Filtros por tipo, estado, busqueda
- REQ-295: Exportar CSV de mensajes filtrados
- REQ-296: Colores por tipo de consulta

### Mensajes — Detalle (REQ-297 a REQ-302) — 6 criterios N/A
- REQ-297: Pantalla detalle con datos contacto, mensaje completo, producto
- REQ-298: Dropdown cambiar estado del mensaje
- REQ-299: Textarea notas internas
- REQ-300: Boton "Marcar como atendido"
- REQ-301: Timestamp de recepcion
- REQ-302: Boton eliminar con confirmacion

### Configuracion (REQ-303 a REQ-307) — 5 criterios N/A
- REQ-303: Tab General (logo, nombre empresa, idioma defecto)
- REQ-304: Tab Contacto (telefono, correo, direccion, horario, WhatsApp)
- REQ-305: Tab Redes sociales (Facebook, Instagram, otras)
- REQ-306: Tab SEO (meta titulo/descripcion ES/EN, OG image)
- REQ-307: Al guardar se muestra toast y cambios aplican al sitio publico

## Pre-flight Check (OBLIGATORIO antes de testing)

Basado en lecciones de iteraciones anteriores (SPA routing, deploy verification):
1. Verificar deep linking funciona: navegar directamente a `/es/contacto`, `/en/distributors`, `/es/catalogo`
2. Verificar API responde: `GET /api/public/site-config/contacto` retorna datos
3. Verificar WhatsApp FAB visible en home
4. Verificar formularios de contacto renderizan (page loads sin errores JS criticos)
5. Si cualquiera falla -> reportar BLOQUEADO al PM inmediatamente

---

## Asignacion: Flow Tester -> e2e/tests/flow/

### Criterios asignados (15 criterios)

**Formulario de contacto general (5 criterios):**
- REQ-197: Formulario incluye campos: Nombre*, Correo*, Telefono, Tipo de consulta* (dropdown), Producto de interes (opcional), Mensaje*
- REQ-198: Pre-llenado de "Producto de interes" cuando se llega desde detalle de producto via "Solicitar informacion"
- REQ-200: Envio exitoso muestra confirmacion y limpia campos
- REQ-201: Envio genera notificacion por email a correo configurable y almacena mensaje en panel
- REQ-205: Labels y mensajes del formulario en idioma seleccionado (ES/EN)

**Formulario de fabricantes (5 criterios):**
- REQ-182: Formulario incluye campos: Empresa*, Pais*, Contacto*, Correo*, Telefono, Tipo de productos, Mensaje*, Checkbox terminos
- REQ-186: Envio exitoso muestra mensaje confirmacion
- REQ-187: Envio genera notificacion por email y almacena como tipo "Fabricante"
- REQ-188: Mensaje se almacena como tipo "Fabricante"
- REQ-192: Labels y placeholders en idioma seleccionado (ES/EN)

**WhatsApp FAB configurabilidad (3 criterios):**
- REQ-021: Boton flotante WhatsApp visible en esquina inferior derecha en TODAS las paginas
- REQ-022: Click abre WhatsApp web/app con mensaje pre-configurado que incluye contexto de pagina actual
- REQ-023: El numero de WhatsApp viene del API site_config (configurable desde panel) — verificar via API GET /api/public/site-config/contacto

**Open Graph tags (1 criterio):**
- NFR-029: OG tags implementados (og:title, og:description, og:image, og:url) para compartir en Facebook/LinkedIn

**GA4 preparado (1 criterio):**
- NFR-027: Codigo de GA4 existe en el sitio pero NO esta activo (no hay script de GA cargado). Verificar que el codigo esta preparado para activarse via configuracion

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- API base: https://hesa-api.azurewebsites.net

**Flujos E2E prioritarios:**
1. **Flujo contacto general E2E**: Navegar a /es/contacto -> llenar formulario -> submit -> verificar confirmacion -> verificar API almaceno mensaje (GET /api/admin/messages sin auth retorna 401, verificar via el response del POST /api/public/contact)
2. **Flujo contacto desde producto**: Ir a detalle de producto -> click "Solicitar informacion" -> verificar campo "Producto de interes" pre-llenado con nombre del producto -> submit
3. **Flujo fabricantes E2E**: Navegar a /es/distribuidores o /en/distributors -> llenar formulario fabricante -> submit -> verificar confirmacion
4. **Flujo WhatsApp multi-pagina**: Verificar WhatsApp FAB en Home, Catalogo, Detalle producto, Marcas, Nosotros, Distribuidores, Contacto. Click en cada pagina debe abrir WhatsApp con mensaje que incluye contexto de la pagina actual
5. **Flujo i18n formularios**: Llenar formulario en ES, cambiar a EN, verificar labels cambian. Llenar en EN y submit
6. **OG Tags**: Verificar meta tags og: en el HTML de la pagina principal y al menos 2 paginas internas

**Verificacion de email:** El POST a /api/public/contact o /api/public/contact/manufacturer deberia retornar HTTP 200/201 con confirmacion. No podemos verificar que el email llego, pero si que el endpoint responde exitosamente. Verificar via `browser_navigate` + network response o `browser_evaluate` con fetch

**Generacion de .spec.ts:** Generar archivos en `e2e/tests/flow/` para cada flujo. Los tests deben:
- Usar la URL desplegada, no localhost
- Esperar carga de pagina con waitForSelector antes de interactuar
- Verificar la respuesta del POST de formulario (interceptar network o verificar UI de confirmacion)
- Grabar GIF de cada flujo principal

---

## Asignacion: Edge Case Tester -> e2e/tests/edge-case/

### Criterios asignados (11 criterios)

**Validacion formulario general (3 criterios):**
- REQ-199: Campos obligatorios se validan antes de envio con mensajes de error claros
- REQ-203: Boton de envio previene envios dobles (se deshabilita tras clic, muestra spinner)
- REQ-204: Si envio falla, mensaje de error con opcion de reintentar SIN perder datos ingresados

**Validacion formulario fabricantes (4 criterios):**
- REQ-183: Campos obligatorios (*) se validan antes del envio
- REQ-184: Campo correo valida formato de email valido
- REQ-185: Validacion en tiempo real al blur (salir de campo) — indicador valido/error
- REQ-190: Boton envio se deshabilita tras primer clic, muestra indicador de carga

**Anti-spam y seguridad (2 criterios):**
- REQ-189: Formulario fabricantes tiene proteccion anti-spam (honeypot o captcha invisible)
- REQ-202: Formulario general tiene proteccion anti-spam (honeypot o captcha invisible)

**NFR seguridad (2 criterios):**
- NFR-016: Formularios publicos tienen proteccion anti-spam (captcha invisible o honeypot)
- NFR-017: Inputs de formularios se sanitizan contra XSS e inyeccion

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- API base: https://hesa-api.azurewebsites.net

**Edge cases anticipados:**
1. **Envio con campos vacios**: Submit sin llenar ningun campo -> verificar mensajes de error en cada campo obligatorio
2. **Email invalido**: Probar emails mal formados (sin @, sin dominio, con espacios, con caracteres especiales)
3. **Blur validation**: Tab a traves de campos obligatorios sin llenar -> verificar error aparece al salir de cada campo
4. **Doble clic en submit**: Click rapido 2 veces en el boton de envio -> verificar que solo se envia una vez (boton se deshabilita)
5. **Error de red simulado**: Desconectar API o enviar a endpoint inexistente -> verificar mensaje de error y que datos no se pierden
6. **XSS injection**: Enviar `<script>alert('xss')</script>` en campo de mensaje y nombre -> verificar que se sanitiza (no se ejecuta JS)
7. **SQL/NoSQL injection**: Enviar `{"$gt":""}` o `'; DROP TABLE;--` en campos -> verificar sanitizacion
8. **Honeypot detection**: Verificar que existe un campo oculto (honeypot) o captcha invisible en ambos formularios. Si es honeypot, llenar el campo oculto y verificar que el envio falla o se rechaza silenciosamente
9. **Campos extra-largos**: Enviar mensaje de 10,000+ caracteres -> verificar manejo correcto (truncado, error, o aceptado)
10. **Caracteres especiales**: Enviar emoji, caracteres Unicode, HTML entities en campos de texto
11. **REQ-191 (fabricante) error handling**: Interceptar response del API para simular error -> verificar mensaje de error con opcion reintentar

**Nota sobre NFR-016 vs REQ-189/REQ-202:** NFR-016 es el requisito general que cubre ambos formularios. REQ-189 y REQ-202 son la aplicacion especifica a cada formulario. Si honeypot/captcha se verifica en uno, aplica al NFR tambien.

**Nota sobre NFR-017:** Verificar via:
1. Enviar payload XSS en campos del formulario de contacto (POST /api/public/contact)
2. Verificar que el response no contiene el script inyectado
3. Si hay acceso, verificar que el mensaje almacenado tiene el contenido sanitizado
4. Intentar inyeccion via campos del formulario de fabricantes tambien
5. Usar `browser_evaluate` para verificar que no hay `<script>` tags inyectados en el DOM

**Generacion de .spec.ts:** Generar archivos en `e2e/tests/edge-case/` para cada grupo de edge cases. Grabar GIF de los flujos de validacion.

---

## Asignacion: Visual Checker -> e2e/tests/visual/

### Criterios asignados (5 criterios)

**WhatsApp FAB visual (3 criterios):**
- REQ-024: Boton flotante no obstruye contenido principal ni CTAs; posicionado con separacion adecuada del borde
- REQ-025: En mobile, area de toque del boton >= 44x44px
- REQ-026: Boton flotante no interfiere con barra sticky del detalle de producto

**Error handling formulario fabricante (1 criterio):**
- REQ-191: Si envio falla, se muestra mensaje de error con opcion de reintentar

**FB Pixel preparado (1 criterio):**
- NFR-030: Codigo de Facebook Pixel existe pero NO esta activo. Verificar que el mecanismo esta preparado para activarse via configuracion

### Instrucciones especificas
- URL base: https://gray-field-02ba8410f.2.azurestaticapps.net
- API base: https://hesa-api.azurewebsites.net
- Breakpoints: mobile (<768px), tablet (768-991px), desktop (>=992px)

**Verificaciones visuales:**
1. **REQ-024 — WhatsApp no obstruye contenido:**
   - Desktop: verificar que el FAB tiene position:fixed, bottom y right con al menos 16px de separacion
   - Verificar z-index no cubre modales ni dropdowns activos
   - Verificar que en pagina de contacto no tapa el boton submit del formulario
   - Verificar que en catalogo no tapa la paginacion

2. **REQ-025 — Touch target mobile:**
   - Viewport 375px: medir dimensiones del boton WhatsApp con `browser_evaluate` -> `getBoundingClientRect()`
   - Verificar width >= 44px Y height >= 44px
   - Verificar que el area clickable real (incluyendo padding) es >= 44x44

3. **REQ-026 — No interfiere con sticky bar:**
   - Navegar a un detalle de producto
   - Hacer scroll down para activar la sticky bar
   - Verificar que WhatsApp FAB no se superpone con la sticky bar
   - Verificar en mobile Y desktop

4. **REQ-191 — Error en formulario fabricante:**
   - Bloquear network al API o enviar a endpoint invalido
   - Verificar que aparece mensaje de error visible con opcion de reintentar
   - Verificar estilo del mensaje de error (colores, iconografia, posicion)

5. **NFR-030 — FB Pixel preparado:**
   - Verificar que NO hay script de FB Pixel cargado activamente (no debe haber llamadas a facebook.com)
   - Verificar via `browser_evaluate` o inspeccion del source code que existe logica condicional para inyectar FB Pixel cuando se active
   - Verificar que el mecanismo de activacion es via configuracion (site_config)

**Generacion de .spec.ts:** Generar archivos en `e2e/tests/visual/`. Grabar GIF del WhatsApp FAB en distintos breakpoints.

---

## Regresion Automatizada (pre-QA)

- Resultado de `npx playwright test e2e/tests/`: 486 passed, 0 failed
- No hay regression-results.md formal en iteration-3 (PM reporto 486 tests passed)
- Criterios verificados por automatizacion de iteraciones previas: todos los criterios de Fase 4 + Iter 1 + Iter 2 pasan regresion
- Criterios con regresion detectada: ninguno

**NOTA:** Los 486 tests de regresion cubren criterios de iteraciones ANTERIORES (Fase 4 visual build + Iter 1 + Iter 2). Los criterios NUEVOS de Iteracion 3 no tienen tests automatizados aun — los sub-testers deben generarlos.

## Criterios Pendientes de Testing Manual

- Total criterios que requieren sub-testers esta ronda: 31
- Criterios FALLARON en ronda anterior: 0 (primera ronda)
- Criterios DESBLOQUEADOS: 0 (primera ronda)
- Criterios nuevos sin test automatizado: 31

### Resumen de distribucion

| Sub-tester | Criterios asignados | Foco |
|---|---|---|
| Flow Tester | 15 | Flujos E2E de formularios, WhatsApp FAB en todas las paginas, OG tags, GA4, i18n |
| Edge Case Tester | 11 | Validacion de inputs, anti-spam, doble envio, XSS/injection, error handling |
| Visual Checker | 5 | WhatsApp posicionamiento/touch target/sticky interference, FB Pixel, error visual |

### Cobertura total
| Estado | Cantidad | Porcentaje |
|---|---|---|
| Testing manual (sub-testers) | 31 | 55.4% |
| N/A (admin auth Entra ID) | 25 | 44.6% |
| **Total Iteracion 3** | **56** | **100%** |

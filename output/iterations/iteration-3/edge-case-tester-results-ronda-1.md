# Resultados -- Edge Case Tester

## Resultados por Criterio
| Criterio | Estado | Input/Condicion | Evidencia |
|----------|--------|-----------------|-----------|
| REQ-199 | PASA | Submit vacio: 4 campos obligatorios muestran error. Blur en campo vacio muestra error al salir. | evidence-REQ-199-empty-submit-general.png (browser screenshot) |
| REQ-203 | PASA | Boton submit tiene [disabled]="formState() === 'submitting'" + spinner "Enviando..." durante envio | Code review: contact-form.component.html L110-114 |
| REQ-204 | PASA | Error state muestra "No pudimos enviar tu mensaje. Intenta de nuevo." Interaccion con campo resetea formState de 'error' a 'idle' permitiendo reintento sin perder datos | Code review: contact-form.component.ts L99-102, L237-240; template L124-128 |
| REQ-183 | PASA | Submit vacio: 5 campos obligatorios muestran error (empresa, pais, contacto, email, mensaje) | evidence-REQ-183-empty-submit-manufacturer.png (browser screenshot) |
| REQ-184 | PASA | Email "test@" muestra "Formato de email invalido" en blur. API rechaza "test@", "@test.com", "test", "test @test.com" con HTTP 400 | Browser verified + API curl tests |
| REQ-185 | PASA | Blur en campo vacio de empresa muestra error al pasar a contacto. Blur en contacto vacio muestra error al pasar a email. Campos reciben clase form-control--error | Browser verified |
| REQ-190 | PASA | Mismo componente ContactFormComponent con misma logica [disabled] y spinner. Boton "Enviar consulta" se deshabilita cuando formState === 'submitting' | Code review: contact-form.component.html L110-114 (aplica a ambas variantes) |
| REQ-189 | PASA | Campo honeypot (name="website") existe oculto (position:absolute, left:-9999px). Backend devuelve HTTP 200 sin ID cuando honeypot esta lleno (silent reject). Submission real devuelve HTTP 201 con ID | API test: POST con website="spam" -> 200 sin id; POST sin website -> 201 con id |
| REQ-202 | PASA | Mismo honeypot que REQ-189, aplicado al formulario general. Campo oculto name="website" presente. Backend verifica req.body.website y silently accepts | Code review + API test |
| NFR-016 | PASA | Ambos formularios tienen: (1) Honeypot oculto name="website", (2) Rate limiting por IP (5 requests/60s via middleware + 30s via custom check), (3) API devuelve 429 en exceso de requests | API test: 5+ requests rapidos -> 429 "Too many requests" |
| NFR-017 | PASA | Backend sanitiza: (1) HTML tags strippeados via regex, (2) script tags eliminados, (3) event handlers (onXXX=) eliminados, (4) javascript: URIs eliminados, (5) Keys con $ prefix eliminados (NoSQL), (6) __proto__/constructor/prototype bloqueados (prototype pollution), (7) Control chars eliminados. Frontend sanitiza control chars en submit() | Code review: validate.middleware.ts + contact.routes.ts. API test: XSS en name -> stripped -> empty -> 400 |

## Bugs Encontrados

No se encontraron bugs en los 11 criterios asignados. Todos los criterios pasan.

**Observacion menor (no es bug, es una nota):**
- La funcion sanitize() del frontend (contact-form.component.ts L93-96) solo elimina control characters, NO elimina HTML tags. La sanitizacion HTML completa se hace exclusivamente en el backend (validate.middleware.ts). Esto es adecuado porque el rendering de Angular ya escapa HTML por defecto, pero si los datos se renderizaran fuera de Angular (por ejemplo, en emails), la sanitizacion del backend es critica.

## Tests Generados
- e2e/tests/edge-case/REQ-199-empty-form-validation-general.spec.ts
- e2e/tests/edge-case/REQ-183-empty-form-validation-manufacturer.spec.ts
- e2e/tests/edge-case/REQ-184-email-validation.spec.ts
- e2e/tests/edge-case/REQ-185-blur-validation-manufacturer.spec.ts
- e2e/tests/edge-case/REQ-203-double-submit-prevention.spec.ts
- e2e/tests/edge-case/REQ-204-error-recovery.spec.ts
- e2e/tests/edge-case/REQ-189-REQ-202-honeypot-antispam.spec.ts
- e2e/tests/edge-case/NFR-016-antispam-rate-limiting.spec.ts
- e2e/tests/edge-case/NFR-017-xss-injection-sanitization.spec.ts
- e2e/tests/edge-case/api-edge-cases.sh

## Detalle de Pruebas Realizadas

### REQ-199: Validacion campos obligatorios formulario general
- Submit vacio: verificado en browser, muestra error en Nombre, Correo, Tipo de consulta, Mensaje
- Blur en nombre vacio: verificado, muestra "Este campo es obligatorio"
- API rechaza body vacio con HTTP 400 y errores detallados por campo

### REQ-203 / REQ-190: Prevencion envio doble
- Template usa [disabled]="formState() === 'submitting'" en el boton submit
- Spinner con texto "Enviando..." / "Sending..." aparece durante el estado submitting
- formState.set('submitting') se ejecuta antes del await a la API
- Aplica identicamente a ambas variantes (general y manufacturer) del componente

### REQ-204: Error recovery sin perder datos
- Catch block setea formState.set('error')
- Template muestra "No pudimos enviar tu mensaje. Intenta de nuevo."
- validateField() resetea formState de 'error' a 'idle' al interactuar con cualquier campo
- Los datos del formulario permanecen intactos (ngModel binding no se limpia en error)

### REQ-183 / REQ-185: Validacion formulario fabricantes
- Submit vacio: 5 errores (empresa, pais, contacto, email, mensaje)
- Blur: verificado en empresa y contacto, muestra error al salir del campo vacio
- API rechaza body vacio con 400 y errores detallados

### REQ-184: Validacion formato email
- Frontend regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
- Backend regex identico
- Verificados rechazos para: "test@", "@test.com", "test", "test @test.com"
- Blur muestra "Formato de email invalido" en browser

### REQ-189 / REQ-202 / NFR-016: Anti-spam
- Honeypot: input[name="website"] oculto con position:absolute left:-9999px
- Backend: if (req.body.website) -> silent accept (200 sin id)
- Rate limit middleware: 5 requests / 60s por IP
- Rate limit custom: 30s entre submissions por IP
- API devuelve 429 "Too many requests. Please try again later."

### NFR-017: Sanitizacion contra XSS e inyeccion
- Backend sanitizeString(): strip script tags, event handlers, HTML tags, javascript:, data:text/html, vbscript:, null bytes
- Backend sanitizeObject(): strip keys con $ prefix (MongoDB operators), __proto__, constructor, prototype
- Verificado via API: "<script>alert(1)</script>" en name -> stripped -> empty -> 400
- Verificado via API: payload embebido "John <script> Doe" -> stripped -> "John  Doe" -> accepted 201
- Verificado via API: SQL injection "'OR 1=1; DROP TABLE;--" -> accepted as text (MongoDB no ejecuta SQL)
- Frontend sanitize(): strip control characters (no HTML - Angular escapa por defecto)

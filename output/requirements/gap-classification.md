# Clasificacion de Gaps — HESA Sitio Web y Panel de Administracion

**Generado por**: Business Analyst
**Fecha**: 2026-03-17
**Version**: 2.0 (todos los gaps resueltos)
**Total gaps**: 27 (14 de negocio + 13 tecnicos) — **TODOS RESUELTOS**

---

## PREGUNTAS PARA EL CLIENTE

> Estas preguntas requieren decision del cliente antes de implementar. Cada una incluye opciones sugeridas y una recomendacion del equipo.

### 1. Cuales son las cuatro empresas del grupo HESA?

**Contexto**: El sitio incluye un campo opcional "Empresa del grupo" en cada producto para indicar que empresa factura. Necesitamos los nombres exactos de las cuatro empresas para configurar ese dropdown.

**Opciones**:
- A) El cliente provee la lista de las 4 empresas (nombre legal o comercial de cada una)
- B) Se configura solo "HESA" inicialmente y se agregan las demas desde el panel despues
- C) Otro

**Recomendacion del equipo**: A -- es un dato simple que evita retrabajos.

---

### 2. Que marcas distribuye HESA actualmente y cuales son sus paises de origen?

**Contexto**: La carga inicial del catalogo necesita las marcas completas. Los PDFs del cliente sugieren al menos 6+ marcas (HESA propia, Zoofarma, IMV, SEM, Pronature, 1st Choice, Belina/NutriSource), pero podria haber mas. Necesitamos: nombre de la marca, pais de origen, logo (si lo tienen), y a que categorias pertenece (Farmacos, Alimentos, Equipos).

**Opciones**:
- A) El cliente provee listado completo de marcas con logo, pais y categoria
- B) Se inician con las marcas identificadas en los catalogos PDF y se completan despues
- C) Otro

**Recomendacion del equipo**: A -- la seccion de marcas es critica para ambas audiencias (clientes locales y fabricantes internacionales).

---

### 3. Se requiere funcionalidad de recuperacion de contrasena para el panel de administracion?

**Contexto**: El panel sera usado por personal no tecnico del equipo comercial. Si un usuario olvida su contrasena, necesita un mecanismo para recuperarla sin intervencion tecnica.

**Opciones**:
- A) Si, recuperacion por correo electronico (el usuario recibe un link temporal para crear nueva contrasena)
- B) No, el administrador principal resetea contrasenas manualmente desde su cuenta
- C) Otro

**Recomendacion del equipo**: A -- reduce dependencia de soporte tecnico y es estandar en cualquier sistema con login.

---

### 4. Cuantos usuarios del panel necesitan inicialmente y con que roles?

**Contexto**: El brief menciona que el equipo comercial administrara el sitio. Necesitamos saber si todos los usuarios tienen los mismos permisos o hay roles diferenciados (ej: alguien que solo pueda editar productos pero no eliminar, o solo ver mensajes).

**Opciones**:
- A) Un solo nivel de acceso (administrador) para todos los usuarios -- todos pueden hacer todo
- B) Dos niveles: administrador (acceso total) y editor (solo puede gestionar productos, marcas y responder mensajes, pero no configuracion ni usuarios)
- C) Otro

**Recomendacion del equipo**: A para la primera version -- simplifica el desarrollo. Se puede agregar roles en una fase posterior si es necesario.

---

### 5. El correo electronico de recepcion de formularios de contacto es uno solo o varia segun el tipo de consulta?

**Contexto**: El sitio tiene dos formularios: uno general (pagina de Contacto) y uno para fabricantes (pagina de Distribuidores). Es comun que empresas B2B dirijan los mensajes de fabricantes a un correo diferente que las consultas de clientes locales.

**Opciones**:
- A) Un solo correo para todos los formularios (ej: info@hesa.cr)
- B) Correos diferentes por tipo: un correo para consultas generales (ej: ventas@hesa.cr) y otro para fabricantes (ej: partners@hesa.cr)
- C) Otro

**Recomendacion del equipo**: B -- permite que el equipo correcto reciba directamente las consultas relevantes sin filtrar manualmente.

---

### 6. Las fichas tecnicas PDF ya estan disponibles? En que idiomas?

**Contexto**: El detalle de producto incluye un boton "Descargar ficha tecnica (PDF)". Necesitamos saber si HESA ya tiene estos PDFs listos para carga inicial, y si existen versiones en ingles (importante para fabricantes internacionales que evaluan los productos).

**Opciones**:
- A) Si, existen en espanol y se cargan desde el inicio
- B) Existen en espanol; las versiones en ingles se crearian despues
- C) No existen aun; se crearian gradualmente despues del lanzamiento
- D) Otro

**Recomendacion del equipo**: No hay recomendacion especifica -- depende del material disponible. La funcionalidad estara lista para recibir PDFs en cualquier momento.

---

### 7. Que informacion de horario de atencion debe mostrarse en la pagina de Contacto?

**Contexto**: La pagina de Contacto incluye "horario de atencion" como dato mostrado. Necesitamos el horario real de HESA para la carga inicial del sitio.

**Opciones**:
- A) El cliente provee el horario exacto (ej: "Lunes a Viernes 8:00am - 5:00pm, Sabado 8:00am - 12:00md")
- B) Se pone un placeholder editable desde el panel y el cliente lo completa despues
- C) Otro

**Recomendacion del equipo**: A -- es un dato que el cliente conoce inmediatamente y evita lanzar con informacion incompleta.

---

### 8. La expansion a Centroamerica debe mencionarse como proyectada o como activa en el sitio?

**Contexto**: La transcripcion de discovery menciona que HESA espera tener la operacion de zona franca operando a finales de 2026. El contenido del sitio (especialmente la pagina de Distribuidores y Nosotros) debe reflejar el estado correcto para no generar expectativas falsas en fabricantes internacionales.

**Opciones**:
- A) Mencionarla como "expansion en proceso" o "proximamente" (transparente sobre el estado actual)
- B) Mencionarla como capacidad activa ("Costa Rica y Centroamerica") sin diferenciar estado
- C) No mencionarla hasta que este completamente activa
- D) Otro

**Recomendacion del equipo**: A -- genera interes en fabricantes sin prometer algo que aun no esta operativo. Se puede actualizar el texto desde el panel cuando la operacion este activa.

---

### 9. Se requiere carga masiva inicial de productos (importacion desde Excel/CSV)?

**Contexto**: El cliente menciono que el catalogo actual esta en Word. La carga manual de ~100-300+ productos (farmacos, alimentos y equipos) uno por uno seria un proceso muy lento y propenso a errores. Una importacion masiva desde Excel aceleraria significativamente el lanzamiento.

**Opciones**:
- A) Si, se desarrolla importacion desde Excel/CSV como funcionalidad permanente del panel (el equipo puede importar productos cuando quiera)
- B) Si, pero como proceso unico de migracion interna que el equipo de desarrollo ejecuta una vez (no es funcionalidad del panel)
- C) No, se cargan manualmente uno por uno desde el panel
- D) Otro

**Recomendacion del equipo**: B -- ahorra tiempo de lanzamiento sin agregar complejidad permanente al panel. El equipo de desarrollo procesa el Excel una vez y carga los datos.

---

### 10. Se necesita un mapa interactivo de Google en la pagina de Contacto o basta con la direccion de texto?

**Contexto**: El brief menciona el mapa como opcional. Un mapa de Google Maps embebido requiere una API key con costo potencial, puede afectar performance (carga JavaScript adicional), pero facilita que los visitantes ubiquen la oficina de HESA.

**Opciones**:
- A) Si, mapa interactivo de Google Maps embebido (con zoom, navegacion, etc.)
- B) Si, pero como imagen estatica del mapa (sin carga adicional de JavaScript, mismo efecto visual)
- C) No, solo la direccion de texto es suficiente
- D) Otro

**Recomendacion del equipo**: B -- ofrece el beneficio visual sin el impacto en performance ni costo de API. Se puede reemplazar por mapa interactivo despues si es necesario.

---

### 11. Las fotos del equipo de liderazgo estan disponibles o se omite la seccion?

**Contexto**: La pagina de Nosotros incluye una seccion condicional de "Equipo de Liderazgo" con foto, nombre y cargo de los lideres de HESA. La seccion solo se muestra si hay fotos cargadas.

**Opciones**:
- A) Si, HESA provee fotos profesionales y datos (nombre, cargo) de los lideres
- B) No, se omite la seccion completamente
- C) Se deja la funcionalidad lista en el panel para activarse cuando haya fotos disponibles (la seccion no se muestra en el sitio hasta que se carguen)
- D) Otro

**Recomendacion del equipo**: C -- la funcionalidad se construye de todas formas (es minima), y HESA puede activarla cuando tenga las fotos listas.

---

### 12. Se necesita Facebook Pixel ademas de Google Analytics?

**Contexto**: Google Analytics (GA4) se incluye por defecto para tracking de visitas y comportamiento. Facebook Pixel permite crear audiencias personalizadas y hacer retargeting con anuncios en Facebook/Instagram, pero requiere una cuenta de Facebook Business activa.

**Opciones**:
- A) Si, ambos: Google Analytics (GA4) + Facebook Pixel
- B) Solo Google Analytics (GA4)
- C) Otro

**Recomendacion del equipo**: A -- si HESA usa o planea usar publicidad en redes sociales, el Pixel es fundamental. Si no, B es suficiente.

---

### 13. La lista de especies de destino es la correcta o faltan algunas?

**Contexto**: Los filtros del catalogo y la clasificacion de productos usan "Especie de destino". La lista identificada hasta ahora es: Caninos, Felinos, Bovinos, Equinos, Aves, Porcinos, Peces, Conejos. Sin embargo, HESA podria manejar productos para otras especies.

**Opciones**:
- A) El cliente confirma la lista completa y definitiva de especies
- B) Se usan las identificadas (Caninos, Felinos, Bovinos, Equinos, Aves, Porcinos, Peces, Conejos) y se pueden agregar mas desde el panel de categorias
- C) Otro

**Recomendacion del equipo**: B -- las especies son administrables desde el panel (Epica 12), asi que el equipo de HESA puede agregar nuevas en cualquier momento sin intervencion tecnica.

---

### 14. El sitio necesita una pagina de catalogo unificada (todos los productos) ademas de las paginas por categoria?

**Contexto**: Actualmente el sitio tiene Catalogo > Farmacos, Catalogo > Alimentos, Catalogo > Equipos como paginas separadas. Pero podria ser util que al hacer clic en "Catalogo" en la navegacion se muestre una pagina con TODOS los productos (con filtro de categoria como opcion adicional), facilitando la busqueda transversal.

**Opciones**:
- A) Si, pagina de catalogo general (/es/catalogo con todos los productos + filtro por categoria) Y paginas individuales por categoria
- B) No, solo las paginas por categoria (Farmacos, Alimentos, Equipos) -- el link "Catalogo" en la navegacion solo despliega el submenu
- C) Otro

**Recomendacion del equipo**: A -- una pagina unificada mejora la experiencia cuando el usuario no sabe en que categoria buscar, y es valiosa para SEO (pagina de alto nivel que enlaza a las subcategorias).

---

## DECISIONES TECNICAS TOMADAS

> Estos gaps fueron resueltos internamente por el equipo con defaults razonables. No requieren decision del cliente.

### DT-01: Estrategia de paginacion del catalogo

**Gap**: El catalogo podria tener 300+ productos. Se necesita definir el tipo de paginacion.
**Decision**: Paginacion offset-based con 24 productos por pagina.
**Justificacion**: Simple de implementar, suficiente para el volumen esperado (~300-500 productos). Scroll infinito fue descartado porque perjudica SEO (los buscadores no pueden indexar contenido cargado dinamicamente) y dificulta compartir enlaces a paginas especificas del catalogo.

### DT-02: Formato de URLs bilingues

**Gap**: Se necesita definir como se estructuran las URLs para el sitio bilingue.
**Decision**: Prefijo de idioma (/es/, /en/) con slugs traducidos en cada idioma.
**Justificacion**: Es la estrategia recomendada por Google para SEO multiidioma. Cada pagina tiene su par hreflang. Ejemplos: `/es/catalogo/farmacos` y `/en/catalog/pharmaceuticals`. Esto permite indexacion independiente por idioma y URLs legibles para el usuario.

### DT-03: Estrategia de almacenamiento de imagenes

**Gap**: Las imagenes de productos, marcas y contenido necesitan almacenamiento optimizado y servicio eficiente.
**Decision**: Azure Blob Storage con CDN. Procesamiento automatico al subir: redimensionado a multiples tamanos (thumbnail 200px, card 400px, detalle 800px, full 1200px) y conversion a formato WebP.
**Justificacion**: Azure Blob Storage es el servicio nativo de archivos en Azure (stack del proyecto). El CDN garantiza tiempos de carga rapidos desde cualquier ubicacion. Los multiples tamanos evitan servir imagenes pesadas en contextos que no lo requieren (ej: un thumbnail de 200px en el listado no necesita cargar la imagen full de 1200px).

### DT-04: Estrategia de cache

**Gap**: El catalogo es contenido que cambia con poca frecuencia. Se necesita una estrategia de cache para performance.
**Decision**: Cache agresivo en paginas publicas (TTL de 1 hora) con invalidacion al publicar cambios desde el panel. CDN cache para assets estaticos (imagenes, CSS, JS) con TTL largo.
**Justificacion**: El catalogo de HESA cambia raramente (productos nuevos se agregan cada semanas/meses). Un cache de 1 hora con invalidacion manual ofrece balance entre performance y frescura del contenido.

### DT-05: Motor de busqueda del sitio publico

**Gap**: La busqueda predictiva del sitio necesita un motor eficiente para sugerencias en tiempo real.
**Decision**: Busqueda full-text sobre la base de datos (text indexes) para el volumen actual (~300-500 productos). Busqueda case-insensitive con normalizacion de acentos.
**Justificacion**: Para el volumen de productos de HESA, una busqueda full-text nativa es suficiente y no agrega complejidad ni costo de un servicio externo. Si el volumen escala significativamente, se puede migrar a un servicio especializado (Azure Cognitive Search) sin cambiar la interfaz de usuario.

### DT-06: Estrategia de notificaciones por email de formularios

**Gap**: Los formularios del sitio envian notificaciones al equipo de HESA. Se necesita definir el servicio y la estrategia.
**Decision**: Servicio de email transaccional (SendGrid o Azure Communication Services). Templates HTML simples con los datos del formulario. Cola de reintentos para fallos de envio (hasta 3 reintentos con backoff exponencial).
**Justificacion**: Los servicios de email transaccional garantizan alta entregabilidad (no caen en spam) y permiten tracking de entrega. Los reintentos aseguran que no se pierdan notificaciones por fallos temporales de red.

### DT-07: Estrategia de pre-renderizado para SEO

**Gap**: El framework frontend (SPA) por defecto no es amigable para SEO sin renderizado del lado del servidor.
**Decision**: Server-Side Rendering (SSR) para las paginas publicas del sitio. El panel de administracion no necesita SSR (es una app interna, no indexable).
**Justificacion**: SSR garantiza que los buscadores (Google, Bing) indexen el contenido completo de cada pagina, incluyendo productos, marcas y textos bilingues. Sin SSR, las paginas publicas podrian no ser indexadas correctamente, perjudicando el posicionamiento.

### DT-08: Tamano maximo de archivos subidos

**Gap**: Se necesita definir limites de tamano y formatos aceptados para uploads desde el panel.
**Decision**: Imagenes: maximo 5MB por archivo, formatos aceptados JPG, PNG, WebP. PDFs (fichas tecnicas): maximo 10MB. Las imagenes se comprimen y redimensionan automaticamente al subir.
**Justificacion**: 5MB es generoso para fotos de productos profesionales (incluso de alta resolucion). 10MB cubre fichas tecnicas con graficos. La compresion automatica garantiza que el sitio publico no sirva archivos pesados sin importar lo que suba el usuario.

### DT-09: Estrategia de backup de datos

**Gap**: La base de datos y los archivos necesitan respaldo ante perdida o corrupcion de datos.
**Decision**: Backup automatico diario de la base de datos (los servicios gestionados de Azure incluyen backup continuo integrado). Blob Storage con geo-redundancia (RA-GRS) para archivos.
**Justificacion**: Los backups automaticos son transparentes y no requieren intervencion. La geo-redundancia de Blob Storage garantiza que las imagenes y PDFs sobrevivan incluso a una falla regional de Azure.

### DT-10: Proteccion anti-spam de formularios

**Gap**: Los formularios publicos necesitan proteccion contra spam sin afectar la experiencia del usuario.
**Decision**: Tres capas de proteccion: (1) Honeypot fields como primera linea (campos invisibles que solo los bots llenan), (2) Rate limiting por IP (maximo 5 envios por hora por IP), (3) reCAPTCHA v3 invisible como respaldo si el spam persiste.
**Justificacion**: El honeypot detiene el ~90% de bots sin ningun impacto en UX (el usuario no ve nada). El rate limiting previene abuso automatizado. reCAPTCHA v3 se activa invisiblemente solo si las otras capas no son suficientes, evitando la friccion de un captcha visible.

### DT-11: Generacion de productos relacionados

**Gap**: El detalle de producto muestra "Tambien te puede interesar". Se necesita definir el algoritmo de seleccion.
**Decision**: Algoritmo de prioridad: (1) productos de la misma marca Y categoria, (2) productos de la misma categoria con especies compartidas, (3) productos aleatorios de la misma categoria. Maximo 4 productos relacionados. Excluir el producto actual de los resultados.
**Justificacion**: Priorizar marca + categoria genera coherencia (el usuario que ve un farmaco de Zoofarma probablemente quiere ver otros farmacos de Zoofarma). Las especies compartidas como segundo criterio refina la relevancia. El fallback aleatorio garantiza que siempre haya contenido.

### DT-12: Manejo de imagenes multiples por producto para galeria

**Gap**: El detalle de producto tiene galeria con miniaturas. Se necesita definir como se administran.
**Decision**: Cada producto soporta hasta 6 imagenes. La primera imagen subida es la imagen principal (usada en cards del catalogo y miniaturas). El orden de imagenes se gestiona con drag-and-drop en el formulario del panel. El administrador puede marcar cualquier imagen como principal.
**Justificacion**: 6 imagenes cubren los angulos necesarios de un producto (frente, atras, detalle, uso, empaque, contexto). El drag-and-drop es intuitivo para personal no tecnico. Limitar a 6 evita abuso de almacenamiento y mantiene la galeria manejable.

### DT-13: Exportacion CSV de mensajes

**Gap**: La funcionalidad de "Exportar CSV" en la gestion de mensajes necesita definir que campos se incluyen.
**Decision**: Exportar todos los campos visibles: nombre del contacto, correo electronico, telefono, tipo de consulta, producto de interes (si aplica), mensaje completo, fecha de recepcion, estado actual, notas internas. Encoding UTF-8 con BOM para compatibilidad con Excel. El export respeta los filtros activos (si hay filtros aplicados, solo exporta los mensajes filtrados).
**Justificacion**: UTF-8 con BOM resuelve el problema comun de caracteres latinos (acentos, enes) que se ven mal en Excel sin BOM. Exportar todos los campos da maximo utilidad. Respetar filtros permite exportaciones parciales (ej: solo mensajes de fabricantes, solo mensajes nuevos).

---

## Resumen

| Tipo | Cantidad | Estado |
|---|---|---|
| Preguntas para el cliente (gaps de negocio) | 14 | **RESUELTOS** (respuestas incorporadas) |
| Decisiones tecnicas tomadas | 13 | **RESUELTOS** (decisiones confirmadas) |
| **Total de gaps** | **27** | **TODOS RESUELTOS** |

---

## RESPUESTAS DEL CLIENTE (incorporadas 2026-03-17)

1. **GAP-B01 (Empresas del grupo)**: Solo HESA se menciona en todo el sitio. Eliminado el dropdown de empresa facturadora. Eliminada la Epica 18 original.
2. **GAP-B02 (Marcas)**: Placeholders para el demo. Datos reales desde el panel cuando este listo.
3. **GAP-B03 (Autenticacion)**: Azure Entra ID. NADA de contrasenas en el panel. Admins se agregan desde Azure. Correo inicial: hola@linkdesign.cr.
4. **GAP-B04 (Roles)**: Un solo nivel admin. Sin gestion de usuarios en el panel.
5. **GAP-B05 (Correos formularios)**: Todos a hola@linkdesign.cr. Correo configurable desde panel.
6. **GAP-B06 (Fichas tecnicas)**: No obligatorias. Boton "Ver ficha tecnica" DINAMICO (solo si hay ficha).
7. **GAP-B07 (Horario)**: Placeholder editable desde el panel.
8. **GAP-B08 (Centroamerica)**: NO mencionar en el sitio.
9. **GAP-B09 (Carga masiva)**: NO. Todo manual desde el panel.
10. **GAP-B10 (Mapa)**: Solo direccion de texto, sin mapa.
11. **GAP-B11 (Equipo liderazgo)**: 6 personas con info ficticia. Gestion desde panel. Funcionalidad de equipo agregada al panel.
12. **GAP-B12 (Analytics)**: NO activos por ahora. Funcionalidad lista para activarse cuando configuren las cuentas.
13. **GAP-B13 (Especies)**: Solo para demo, administrables desde panel.
14. **GAP-B14 (Catalogo general)**: SI, pagina general + por categoria. AMBAS con filtros. Search bar global con prediccion/autocompletado.

**Comentario adicional del cliente**: El sitio debe ser premium. Navegacion excelente, funcionalidades utiles, y SUPERAR la competencia de HESA.

### Feedback de: business-analyst
- El input del cliente no define las cuatro empresas del grupo HESA — solo menciona que son cuatro pero no da nombres, lo cual impacta la configuracion del dropdown de empresa facturadora por producto
- La transcripcion de discovery no especifica correos de destino para los formularios de contacto ni si se diferencian por tipo de consulta (fabricante vs cliente local)
- El catalogo de productos mock solo incluye alimentos (marca Belina/NutriSource/Dukan/etc.) pero HESA tambien distribuye farmacos y equipos: no hay datos mock ni estructura para estas dos categorias criticas
- Los PDFs de catalogos (HESA, Zoofarma, IMV, SEM, Pronature, 1st Choice) no pudieron ser leidos por limitaciones del sistema (pdftoppm no disponible en Windows) — contienen informacion valiosa sobre marcas, estructura de catalogo real y tipos de productos que no se pudo extraer
- El cliente no definio horarios de atencion, correo electronico general, ni el numero exacto de WhatsApp para el boton flotante
- No hay claridad sobre si HESA tiene fotos profesionales para las secciones de equipo de liderazgo, hero, y paginas estaticas — sin fotos reales el sitio dependeria de stock
- La transcripcion menciona que el catalogo esta en Word pero no se proporciono ese archivo para analisis de la estructura actual de datos de productos
- El brief define la seccion de Politicas Comerciales como posiblemente dentro de Nosotros o como pagina independiente — necesita decision pero se resolvio como seccion dentro de Nosotros en los requirements
- No se definio un mecanismo de recuperacion de contrasena para el panel, siendo critico para usuarios no tecnicos
- La lista de especies de destino no esta confirmada exhaustivamente — los catalogos muestran perros, gatos, caballos, peces, conejos, pero el brief menciona tambien bovinos, equinos, aves, porcinos

### Feedback de: business-analyst (clasificacion de gaps)
- La clasificacion de gaps fue directa: los 14 gaps de negocio requieren datos o decisiones que solo el cliente tiene (nombres de empresas, marcas, correos, horarios, fotos) y los 13 gaps tecnicos son decisiones de implementacion con defaults razonables
- Patron recurrente: la mayoria de gaps de negocio se deben a datos operativos que el cliente no incluyo en el brief de discovery (horarios, correos, listado de marcas, nombres de empresas del grupo) — en futuros proyectos, incluir un checklist de "datos operativos minimos" en el template de discovery para reducir gaps de este tipo
- Varios gaps de negocio (GAP-B06 fichas PDF, GAP-B11 fotos de liderazgo) dependen de si el cliente tiene material grafico listo — patron comun en proyectos de sitio web corporativo donde el contenido real llega tarde

### Feedback de: business-analyst (incorporacion de respuestas)
- La respuesta del cliente sobre Azure Entra ID fue inesperada — la recomendacion original asumia autenticacion propia con contrasenas. En proyectos enterprise o con clientes que usan Microsoft/Azure, preguntar sobre el proveedor de identidad preferido en la fase de discovery para evitar reescrituras completas del modulo de autenticacion
- El cliente elimino completamente el concepto de "grupo de empresas" — solo HESA se menciona. Esto simplifica significativamente el modelo de datos (no hay campo empresa facturadora por producto) pero requirio eliminar una epica completa y reestructurar el formulario de producto
- Patron importante: el cliente cambio la seccion "Equipo de liderazgo" de opcional/condicional a obligatoria con placeholders ficticios. Esto genero una nueva epica en el panel (gestion de miembros del equipo). Las features que parecen opcionales o condicionales pueden convertirse en features de primera clase cuando el cliente decide incluirlas con datos placeholder
- El cliente fue enfatico en "NO mencionar Centroamerica" — esto impacto 4 criterios diferentes en 3 epicas (Nosotros, Distribuidores, Mapa de Cobertura). Los gaps de contenido sensible al negocio (planes futuros, expansiones) pueden tener alto impacto transversal
- El requerimiento de "search bar global con prediccion/autocompletado" fue reforzado por el cliente como critico. Ya existia en los requirements (Feature 1.5) pero la respuesta del cliente lo eleva a prioridad maxima. Los clientes que dicen "superar a la competencia" tienden a priorizar funcionalidades de busqueda y navegacion
- La respuesta "NO Google Analytics ni Facebook Pixel por ahora" requiere un patron de "funcionalidad lista pero no activa" — disenar como configuracion activable (variable de entorno o campo en panel) en lugar de hardcodear IDs. Patron util para integraciones de terceros que dependen de cuentas externas del cliente

### Feedback de: brief-analyst
- El brief del sitio publico no especifica colores para estados semanticos (success, danger, warning) — el panel si los define (#22C55E, #EF4444, #F59E0B) pero el sitio publico no tiene equivalentes para validacion de formularios o estados de envio
- El brief del sitio publico no prescribe easing functions especificas (ease, ease-in-out, cubic-bezier) para las animaciones — solo dice "suave", lo cual deja ambiguedad para implementacion
- Los dos briefs definen colores primarios compartidos (#008DC9, #1F2937, #6B7280) pero el panel agrega colores semanticos (#22C55E, #EF4444, #F59E0B) y fondos (#EBF5FF, #DCFCE7, #FEE2E2, #FEF3C7) que no existen en el brief del sitio publico — considerar unificar o documentar que son paletas separadas
- El brief del panel no incluye breakpoints responsive para mobile — solo dice "desktop-first" y "sidebar colapsable en tablet / hamburger en mobile" sin valores de breakpoint especificos
- El brief del sitio publico menciona "Inter, DM Sans, o similar" como recomendaciones pero no prescribe una familia tipografica final — esto queda como decision del Design Researcher
- El brief del panel no especifica tipografia — se asume herencia del sitio publico pero no esta documentado explicitamente
- Ambos briefs prescriben espacio generoso pero con rangos (ej. 60-80px padding, 24-32px gap, 20-30px border-radius) en vez de valores exactos — el Design Researcher debera definir valores finales dentro de estos rangos
- La seccion de "Politicas Comerciales" aparece como contenido dentro de Nosotros en el brief del sitio pero como tab "Politicas comerciales" en contenido estatico del panel — consistencia correcta pero vale verificar que el panel administre correctamente esta subseccion

### Feedback de: site-capturer
- Tuft & Paw (tuftandpaw.com) tiene multiples overlays que bloquean interacciones: popup de PostScript marketing ("Win $500"), cookie consent, messenger widget (Richpanel), y geo-location selector. El geo-popup se resuelve con "Shop now", el PostScript popup con "Dismiss popup" dentro de un iframe. El cookie banner queda bloqueado por el Richpanel widget y no se pudo cerrar via click directo
- El sitio usa lazy loading agresivo para imagenes en las secciones de scroll. Las capturas de secciones inferiores requieren wait_for de al menos 1-2 segundos despues de cada scroll para asegurar que las imagenes esten renderizadas
- En desktop 1440px, la navegacion cambia de logo completo "tuft&paw" a solo isotipo (gato negro) al scrollear, requiriendo captura adicional si se quiere documentar ambos estados
- El footer de Tuft & Paw no muestra el logo gigante en mobile (o queda oculto debajo del cookie banner persistente), a diferencia de desktop donde es claramente visible. Vale verificar en una sesion limpia sin cookie banner

### Feedback de: site-capturer
- La pagina de coleccion /collections/cat-litter de Tuft & Paw tiene el Richpanel messenger widget bloqueando el click del cookie banner (z-index conflict). Se pudo cerrar el PostScript popup ("Win $500") desde su iframe pero el cookie banner quedo visible en todas las capturas. En futuras sesiones, intentar remover el cookie banner via JavaScript en lugar de click
- La pagina de coleccion muestra "2 Products" en el conteo pero renderiza 3 cards de producto (Unscented, Lavender, OdorStop). Posible discrepancia de inventario o logica de variantes
- El item "Sale" de la navegacion desktop NO aparece en la navegacion mobile hamburger -- solo muestra Litter, Food, Furniture. Detalle relevante para documentar diferencias de navegacion entre breakpoints
- El hover state del card de producto revela un boton "ADD TO CART" superpuesto sobre la imagen. No se observo shadow elevation ni scale change en el hover, contrario a lo mencionado en las notas del brief. El efecto principal es la aparicion/desaparicion del boton CTA

### Feedback de: site-capturer
- La pagina de producto de Tuft & Paw tiene un Richpanel messenger widget (chat bubble) que intercepta clicks del cookie consent banner -- el cookie banner quedo visible en todas las capturas. Para futuras sesiones, considerar remover el widget via JavaScript antes de capturar
- La barra sticky de producto se comporta diferente en desktop vs mobile: en desktop aparece en la parte SUPERIOR con fondo navy oscuro y dropdowns de variante; en mobile aparece en la parte INFERIOR con fondo lavanda claro y sin dropdowns (solo nombre, variante, precio y boton CTA). Esta diferencia de comportamiento es un patron de diseno importante a documentar
- La pagina tiene una estructura de storytelling muy larga (~15+ secciones) entre el producto y el footer: secciones de color, comparacion de variantes, videos sociales, reviews, Instagram, FAQ. Esto requiere multiples scrolls (8000+ pixels) para capturar todo el contenido, se recomienda priorizar las secciones mas relevantes segun las notas

### Feedback de: site-capturer
- grupomonteco.com tiene un dialog de Cookie Notice que requiere click en "Aceptar" para cerrar. Ademas abre una pestaña de WhatsApp Web automaticamente al cargar, lo que genera una tab adicional que no interfiere pero queda abierta
- El sitio de Monteco usa lazy loading en contadores estadisticos: al scrollear hacia la seccion de contadores, los numeros se animan desde 0 hasta su valor final (+550, +20, 25, +300). Se requiere esperar al menos 1 segundo despues del scroll para que los numeros terminen de animar y capturar los valores finales correctos
- El slider del hero rota automaticamente entre las diferentes lineas de negocio. Cada captura mostrara una linea diferente dependiendo del timing -- documentar que el hero es un slider rotativo, no una sola imagen estatica

### Feedback de: site-capturer
- montecocr.com usa un video background en el hero que tarda ~3 segundos en cargar el primer frame. La primera captura del hero salio completamente oscura; se requiere un wait_for de al menos 3 segundos despues de navegar para que el video renderice su primer frame visible
- El sitio tiene un search overlay que se activa con el icono de busqueda (ref e13/e14), y el hamburger menu es un img separado (ref e17). Ambos estan en el mismo contenedor, lo que puede causar clicks erroneos si no se usa el ref correcto
- El widget de chat Smartsupp aparece como iframe en la esquina inferior-derecha y un boton flotante de WhatsApp en la inferior-izquierda. Ambos son plugins genericos sin personalizacion de marca
- El email de contacto en el footer usa una IP en lugar de dominio (informacion@209.50.59.146), senalando infraestructura web descuidada

### Feedback de: site-capturer
- vetimsa.com carga limpiamente sin popups, cookie banners ni overlays bloqueantes. La unica tab adicional que se abre automaticamente es WhatsApp Web (igual que Monteco), lo cual no interfiere con la captura
- El hero de VETIM en desktop oculta completamente la imagen detras del bloque azul solido -- solo en mobile se ve la foto (nina+cachorro). Esto es un caso interesante de diseno responsive donde mobile tiene mejor presentacion visual que desktop
- El sitio no tiene sticky header ni scroll animations -- es completamente estatico. Todas las secciones se capturan sin necesidad de esperar animaciones o transiciones
- La pagina de "Animales de Compania" funciona como catalogo/productos pero no tiene cards de producto individuales: usa tabs con texto descriptivo y un carousel de imagenes por categoria. No es un catalogo e-commerce sino una presentacion informativa por linea de producto
- El menu mobile es un slide-in panel que cubre ~75% del ancho de pantalla desde la derecha, con un boton "xCERRAR" en la parte superior con fondo azul celeste. El boton de cerrar usa un link con href="#" y texto "Cerrar"

### Feedback de: site-capturer
- belinanutricion.com abre automaticamente una tab de WhatsApp Web al cargar, generando una tab adicional que no interfiere con la captura pero queda abierta en la sesion del navegador
- El hero del sitio de Belina es un slider que rota automaticamente entre varias composiciones de productos/mascotas. Cada captura mostrara un slide diferente dependiendo del timing
- La pagina de productos (/balance-perros/) carga sin overlays ni popups y no usa lazy loading agresivo -- las imagenes de producto cargan inmediatamente. Captura directa sin necesidad de waits especiales
- El dropdown de la navegacion "Catalogo" en desktop se mantiene abierto si se llega a la pagina via hash link (#lassecciones). Para capturar la seccion de catalogo sin dropdown abierto, es necesario renavegar directamente al hash en lugar de hacer click en el nav link
- El menu hamburger mobile de Belina no cubre todo el viewport -- el contenido de la pagina sigue visible debajo del menu, lo cual es un anti-patron de UX notable para documentar como referencia negativa

### Feedback de: architect
- GAP-A04 es el gap mas critico: Azure Static Web Apps tiene limitaciones significativas para SSR de Angular. La recomendacion es usar Azure App Service para el sitio publico (Express sirve SSR + API juntos) y Static Web Apps solo para el panel admin (SPA pura). Esto cambia la estrategia de deploy original — DevOps debe provisionar App Service para el sitio publico desde FASE 3.5, no Static Web Apps
- REQ-253 y NFR-002 mencionan AVIF como formato de optimizacion de imagenes pero AVIF tiene soporte de navegador ~87% y procesamiento 5-10x mas lento que WebP con sharp. La recomendacion es WebP + JPEG fallback sin AVIF por ahora. Si el BA o el cliente insisten en AVIF, el costo de procesamiento en el backend aumenta considerablemente
- Los requirements no definen que sucede cuando un admin cambia contenido desde el panel: no hay preview antes de publicar, no hay versionado de contenido, no hay borrador vs publicado para paginas estaticas. Todos los cambios se aplican inmediatamente al sitio publico (REQ-277, REQ-281, REQ-287, REQ-307, REQ-321d). Esto es aceptable para v1 pero vale documentar como limitacion conocida
- REQ-210 pide "actividad reciente" en el dashboard pero no especifica retention policy — cuantos dias de actividad se almacenan? Sin limite, la coleccion activity_logs crece indefinidamente. Recomendacion: TTL de 90 dias en activity_logs
- La busqueda global del panel (REQ-220) y la busqueda del sitio publico (REQ-035) son dos funcionalidades distintas con implementaciones diferentes. El panel busca en productos + marcas + mensajes (por nombre de contacto). El sitio publico busca en productos + marcas (por multiples campos). No hay ambiguedad funcional pero vale clarificar que son dos endpoints separados
- Los 371 criterios cubren 47 features en 18 epicas. La descomposicion en 4 iteraciones funcionales (post-demo) es razonable: Iteracion 1 cubre el nucleo (catalogo + CRUD + auth), Iteracion 2 cubre contenido administrable, Iteracion 3 cubre formularios + mensajes + config, Iteracion 4 cubre performance + accesibilidad + pulido. Cada iteracion es desplegable independientemente

### Feedback de: site-capturer
- dashlytemplate.webflow.io carga limpiamente sin popups, cookie banners ni overlays bloqueantes. La unica interferencia es un badge flotante de Webflow/BRIX Templates en la esquina inferior derecha que aparece en algunas capturas pero no bloquea contenido critico
- El sidebar del template Dashly se mantiene fijo durante el scroll vertical del contenido -- es un sidebar sticky con altura 100vh. Esto permite capturar el sidebar en cualquier punto de scroll sin necesidad de volver al top
- La tabla de productos en mobile se transforma a un layout stacked label-value en lugar de usar scroll horizontal. Los labels de columna aparecen en color violeta/azul a la izquierda con valores a la derecha. Este patron de responsive table es relevante para el panel de HESA
- Los iconos decorativos en circulos de color suave son un patron consistente en todo el template: aparecen en las cards de categorias de tareas (Design/Development/Marketing) y en las metricas de Tasks Reports (Completed/Incomplete/Overdue). El circulo usa un background con ~10-15% de opacity del color del icono

### Feedback de: site-capturer
- La pagina /features/table de Dashly muestra un patron interesante de responsive table: en desktop es una tabla clasica con columnas, pero en mobile cada fila se transforma en un bloque vertical stacked con labels UPPERCASE a la izquierda y valores a la derecha. La fila de ACTION se incluye explicitamente en mobile mostrando los 3 iconos, mientras que en desktop la columna de acciones no tiene header visible
- La pagina /features/companies tiene un toggle funcional Table/Card view implementado como tabs nativas (role="tab"). El click en "Card view" (ref e118) funciona directamente sin necesidad de waits adicionales -- la transicion es instantanea via CSS/display toggle
- Las dos tablas (invoices y companies) usan un numero diferente de iconos de accion: invoices tiene 3 (ojo+lapiz+basura) y companies tiene 2 (lapiz+basura). Este detalle muestra que las acciones son contextuales al tipo de dato, no un patron fijo
- El badge flotante de BRIX Templates/Webflow en la esquina inferior derecha sigue apareciendo en todas las capturas. No bloquea contenido critico pero puede confundir al Design Researcher -- vale anotar que es un badge del template demo, no parte del diseno

### Feedback de: site-capturer
- La pagina /settings/v3 de Dashly carga limpiamente sin interferencias adicionales mas alla del badge flotante de BRIX Templates en la esquina inferior derecha
- El formulario de settings no tiene un boton "Cancel" visible junto al boton "Save changes" -- las notas del brief mencionan "cancelar en gris outline" pero este patron no se observa en la referencia. Posiblemente el brief describe un ideal deseado y no lo que la referencia tiene exactamente
- Los tabs de settings en mobile se re-acomodan en 2 filas (3+2) en lugar de scroll horizontal, lo cual es un patron de adaptacion responsive notable. Los tabs mantienen su estilo pill en ambos breakpoints
- El layout de formulario en desktop usa un grid de 2 columnas para campos cortos (Full name | Email address, Phone number | Role, Location | Website) y full-width para campos largos (About biography). En mobile colapsa todo a 1 columna

### Feedback de: site-capturer
- La pagina /features/board de Dashly carga limpiamente sin interferencias adicionales mas alla del badge flotante de BRIX Templates en la esquina inferior derecha
- El board Kanban en mobile apila las columnas verticalmente (Design Tasks > Development Tasks > Marketing Tasks) en lugar de usar scroll horizontal. Cada columna ocupa el 100% del ancho y todas las cards se muestran secuencialmente. Este patron de responsive Kanban es relevante para evaluar si HESA prefiere scroll horizontal o stacking vertical en mobile
- Las cards del board tienen multiples variantes: basica (badge+titulo+desc+avatars+comments), con cover image, y con attachment link. Las 3 variantes comparten la misma estructura base y se diferencian por elementos opcionales en la parte superior (image) o inferior (attachment)
- El element screenshot (browser_take_screenshot con ref) funciono correctamente para aislar cards individuales, permitiendo close-ups sin necesidad de zoom o crop manual

### Feedback de: design-researcher
- El brief del sitio publico no define easing functions especificas para animaciones — solo dice "suave". El visual-analysis.md incluye recomendaciones holisticas (cubic-bezier values) pero estos no son prescriptivos del cliente. El equipo de diseno puede ajustarlos si tiene mejor criterio.
- El brief no define colores de estados semanticos (success/error/warning) para el sitio publico — solo el panel los tiene. El visual-analysis.md unifica adoptando los colores del panel (#22C55E, #EF4444, #F59E0B) para el sitio publico tambien, pero esta es una decision del Design Researcher, no del cliente.
- Los capture-notes de Tuft & Paw reportan que el hover de cards de producto NO tiene shadow elevation ni scale change (solo aparece un boton CTA superpuesto), mientras que el brief prescribe "elevacion shadow + scale(1.02)". Esta discrepancia indica que el brief describe un IDEAL deseado, no necesariamente lo que T&P hace exactamente. El equipo de diseno debe implementar lo que el brief prescribe (shadow + scale), no lo que T&P hace literalmente.
- Los capture-notes de Dashly muestran que el formulario de settings NO tiene boton "Cancel" visible, pero el brief del panel menciona "cancelar en gris outline". Otra instancia donde el brief describe un ideal, no lo que la referencia hace exactamente. Implementar lo del brief.
- El brief del panel no especifica breakpoints responsive — el visual-analysis.md propone 1280/1024/768 como breakpoints basados en el comportamiento observado de Dashly, pero estos no son prescriptivos.
- Tuft & Paw usa una tipografia serif display para H1/H2 que le da caracter editorial premium, pero el brief de HESA prescribe sans-serif (Inter/DM Sans). La personalidad tipografica de HESA dependera del tratamiento (peso 800, tracking tight, tamano 56px+) en lugar de la familia tipografica. Esto es una adaptacion intencional: B2B profesional vs B2C editorial.
- Los 4 competidores (Monteco Global, Monteco CR, VETIM, Belina) comparten un patron comun: CERO animaciones, CERO micro-interacciones, tipografia generica, spacing apretado. La barra de diferenciacion visual de HESA es baja — cualquier implementacion que incluya animaciones de scroll, hover transitions, y tipografia con personalidad ya superara a toda la competencia.
- Los capture-notes fueron de excelente calidad: todos incluyen analisis visual detallado con estimaciones de colores hex, tamanos px, pesos tipograficos, y spacing. Ningun capture-notes fue rechazado. El trabajo de los site-capturers fue exhaustivo y confiable.
- El total de PNGs capturados (110+) es mas que suficiente para validar todos los patrones de referencia. La cobertura desktop+mobile por cada URL fue consistente.

### Feedback de: design-orchestrator
- El visual-analysis.md es de calidad excepcional: 785 lineas con paleta prescrita completa, tipografia con escala detallada, spacing con valores finales, 15 patrones de referencia validados contra screenshots, 40 BVC, 18 anti-patrones, 11 decisiones holisticas documentadas. Es el input mas completo que un design orchestrator puede recibir.
- GAP-D04 descubierto: REQ-296 define un color "morado" para mensajes de tipo "Fabricante" pero no hay morado en la paleta prescrita. Se recomienda #7C3AED (purple-600) como unico color fuera de paleta, justificado por la necesidad de diferenciar 5 tipos de mensaje.
- Los requirements no definen estados de carga (loading/skeleton) para ninguna pantalla — solo estados vacios. El UX Flow Designer debe definir skeletons para cada pantalla del sitio publico y del panel. Esto es un gap recurrente en requirements: especifican que pasa cuando no hay datos pero no que pasa mientras se cargan.
- La cantidad de pantallas (10 publicas + 15 del panel) con todos sus estados genera un scope de diseno amplio. Los 45 DEMO-xxx del Architect son exhaustivos y cubren cada pantalla mencionada en requirements. La distribucion entre 3 sub-designers es equilibrada pero el UX Flow Designer tiene la carga mas pesada por la cantidad de pantallas que debe documentar.
- El proyecto tiene dos aplicaciones con filosofias opuestas (mobile-first vs desktop-first) que comparten tokens pero no comparten componentes. Esto requiere que el Visual System Designer defina tokens que funcionen bien en ambos contextos sin crear duplicados innecesarios.

### Feedback de: visual-system-designer
- Los colores de marca del cliente (#008DC9 y #50B92A) tienen bajo contraste con texto blanco: #008DC9 a 3.71:1 solo pasa AA para texto grande (>=18px bold / >=24px regular), y #50B92A a 2.53:1 NO pasa AA en ningun nivel. Se documentaron restricciones de uso claras en lugar de cambiar los colores prescritos. Para texto pequeno azul sobre blanco, se recomienda usar la variante #146995 (6.03:1) o #007AB8 (4.69:1).
- Los badges semanticos (success/danger/warning/info) con sus colores base sobre fondos suaves fallan WCAG AA completamente (ratios de 1.93:1 a 3.37:1). Se resolvio definiendo variantes de texto oscuro (#166534, #991B1B, #92400E, #005A85) que garantizan 6.37:1 a 6.80:1 -- patron estandar de texto oscuro sobre fondo pastel.
- Las referencias usan spacing generoso (T&P 80-120px entre secciones, Dashly 24-32px gaps internos) -- se refleja en los tokens con 96px entre secciones desktop y 64px mobile. Esto es 2-3x mas que lo que usa la competencia (Monteco ~40px).
- La tipografia Inter como fuente unica (sin serif display para headings como hace T&P) requiere compensacion con peso Extrabold 800, tracking negativo -0.02em, y tamano 56px para lograr personalidad tipografica comparable. Sin esta combinacion especifica, Inter a 48px Bold se siente generica.
- El morado para tipo de mensaje "Fabricante" (REQ-296) es el unico color fuera de la paleta prescrita del brief. Se eligio #7C3AED (purple-600 de Tailwind) con texto oscuro #5B21B6 sobre fondo #EDE9FE, verificado a 7.57:1 (AAA). Esta excepcion es necesaria para diferenciar 5 tipos de mensaje.
- El texto secundario #6B7280 sobre fondo #F0F2F5 (bloque equipos) da ratio 4.31:1, marginalmente debajo de AA para texto normal (4.5:1). Es aceptable para labels UPPERCASE 12-14px que califican como UI components (umbral 3:1), pero para texto body normal en esos fondos, usar siempre #1F2937.
- Los tokens de z-index requieren coordinacion cuidadosa entre WhatsApp FAB (z-700), toast (z-600), modales (z-500), sidebar panel (z-300) y sticky header (z-200). Sin una escala definida, conflictos de z-index son inevitables en implementacion.
- La escala monocromatica generada posiciona el color base de #50B92A en shade 400 (no en 500 como es convencional). Esto ocurre porque #50B92A es un verde bastante saturado y claro. El equipo de implementacion debe usar el token --brand-secondary-400 como el verde de marca, no --brand-secondary-500.

### Feedback de: ux-flow-designer
- Los requirements no definen estados de carga (skeleton/loading) para ninguna pantalla del sitio publico ni del panel — solo especifican estados vacios. Se definieron skeleton screens para las 25 pantallas en ux-flows.md con patron shimmer animation y mismas dimensiones que el contenido real
- No hay definicion en requirements de que pasa si el token de Azure Entra ID expira mientras el admin trabaja en el panel (REQ-311 dice "se solicita re-autenticacion automaticamente" pero no define la experiencia visual). Se recomienda modal no-dismissable con boton de re-login
- Los requirements listan "Duplicar" como opcion en el menu de 3 puntos del producto (REQ-228) pero no definen el flujo: que campos se copian, como se nombra la copia, si lleva a un formulario nuevo o crea directamente. Se definio como "copia todos los campos a formulario de creacion con nombre '[Original] (copia)'"
- No hay definicion de concurrencia para la edicion de contenido: si dos admins editan el hero simultaneamente, no hay deteccion de conflictos. Para v1 se recomienda "last write wins" documentado como limitacion conocida
- REQ-296 define 5 tipos de mensaje con colores pero "Fabricante" usa "morado" que no existe en la paleta prescrita. Se adopto #7C3AED con fondo #EDE9FE como unica excepcion a la paleta, consistente con la decision del Visual System Designer
- Los filtros del catalogo se reflejan en la URL (REQ-099) pero no se define que pasa al usar el boton "atras" del navegador. Se definio que los filtros se restauran desde query params con history state nativo
- REQ-169 (mapa de Costa Rica) dice "elemento visual/grafico (no mapa interactivo)" pero no define el estilo visual. Se definio como SVG estatico en tono #E8F4FD con puntos #008DC9 y leyenda de zonas GAM/rural/encomienda
- No se define el comportamiento del boton "Ver en sitio" para productos inactivos en el panel (REQ-228). Se recomienda deshabilitar con tooltip explicativo
- El preview de mensajes en el kanban (REQ-291) no define longitud maxima de caracteres. Se definio max 80 chars (2 lineas truncadas) para kanban y max 60 chars para tabla
- Los bloques de storytelling de producto (REQ-135) no definen que pasa con contenido parcial (texto sin imagen). Se definio: texto sin imagen = full-width, imagen sin texto = no renderizar bloque
- La pantalla de Categorias del panel no tiene representacion de "error al guardar" en los requirements — se agrego toast de error con datos mantenidos
- El flujo de cambio de categoria en el formulario de producto deberia advertir sobre perdida de datos en campos condicionales, pero no hay requerimiento para ello. Se recomienda evaluarlo para v2

### Feedback de: design-orchestrator (consolidacion)
- Los 3 archivos intermedios (design-tokens.md, ux-flows.md, components.md) estaban completos y de alta calidad. Ningun sub-designer faltante.
- El Visual System Designer produjo un archivo excepcionalmente detallado (700+ lineas) con escalas monocromaticas, reporte de contraste WCAG exhaustivo, y CSS custom properties listas para implementacion. La calidad supera expectativas.
- El UX Flow Designer cubrio las 25 pantallas (10 publico + 15 panel) con todos los estados de UI (carga, exito, error, vacio, muchos datos). Destaca que resolvio 12 gaps de UX no cubiertos por requirements, especialmente estados de carga que los requirements omitieron completamente.
- El Component Designer documento 34 componentes reutilizables con props/inputs, eventos, estados visuales, responsive y accesibilidad. La estructura es directamente utilizable por el UI Developer.
- La consolidacion genero 149 criterios DC-xxx + 40 BVC-xxx, cubriendo los 45 DEMO-xxx del Architect (44 visuales + 1 estructural no visual). Cobertura completa verificada.
- Cada BVC-xxx tiene al menos un DC-xxx relacionado para trazabilidad bidireccional.
- Se consolidaron 12 gaps de diseno de los 3 sub-designers. Los gaps mas criticos son: GAP-D01 (skeletons no definidos en requirements), GAP-D04 (morado fuera de paleta) y GAP-D06 (concurrencia de edicion).
- El contraste de colores de marca (#008DC9 a 3.71:1 y #50B92A a 2.53:1) fue bien manejado por el Visual System Designer con restricciones de uso documentadas, pero el UI Developer debe ser cuidadoso de no usar texto blanco pequeno sobre estos colores.
- Patron recurrente observado: los requirements no definen estados intermedios (loading, error parcial, transiciones). Los sub-designers tuvieron que inventar estos estados. En proyectos futuros, el BA deberia incluir un checklist de estados de UI como parte del template de requirements.

### Feedback de: component-designer
- GAP-D03 (pills de presentaciones) se resolvio con patron toggle pills (border-radius 25px, seleccionado con fondo #E8F4FD y borde #008DC9). El patron es consistente con T&P Patron #5 validado en las capturas. Este gap deberia haberse cubierto en el brief original.
- GAP-D04 (color morado para tipo Fabricante) se implemento con #7C3AED (purple-600) y fondo #EDE9FE. Es el unico color fuera de la paleta prescrita del brief. En futuros proyectos con multiples tipos semanticos (5+), el brief deberia definir la paleta completa de colores por tipo, no asumir que 4 colores base cubren todos los casos.
- El contraste de texto blanco sobre #008DC9 (ratio ~3.8:1) impacta al Manufacturer CTA Banner donde el titulo es bold 36px (cumple AA para texto grande) pero la descripcion a 16px regular NO cumple. Se recomienda usar blanco puro con font-weight 500 minimo o considerar #007AB8 como fondo alternativo para bloques con texto pequeno blanco.
- Los 34 componentes reutilizables (18 publico + 16 panel) NO comparten codigo entre aplicaciones, pero SI comparten tokens visuales. Esto es intencional (architecture.md define dos apps independientes) pero genera duplicacion de patrones como badges, botones y campos de formulario. Un shared design tokens package seria beneficioso.
- La transformacion de tabla a stacked cards en mobile (Decision holistica 10.7) es critica para la usabilidad del panel en dispositivos moviles. Requiere CSS especifico con display block en tr y td con data-label attributes para labels UPPERCASE. Esto no es trivial con Bootstrap tables nativo y puede requerir un approach custom.
- Los anti-patrones del brief (#1 a #18) estan verificados en los 34 componentes: ningun componente incluye precios, carrito, estrellas, login publico, listas planas para productos, ni estados como texto plano. Los 18 anti-patrones estan cubiertos.
- El sitio publico no tiene bot IA ni chat (anti-patron #9 prohibe chat en vivo, solo WhatsApp flotante). Esto simplifica significativamente la capa de interaccion pero puede limitar la experiencia de busqueda de productos. El Search Overlay con prediccion compensa parcialmente.
- Las imagenes de productos son criticas para la calidad visual de las Product Cards. Sin imagenes reales de alta calidad, el sitio se vera significativamente menos premium que T&P. El cliente deberia priorizar la fotografia de productos como prerequisito del lanzamiento.
- El Form Field del panel y el Contact Form del sitio publico comparten el mismo patron visual (labels arriba, border-radius 10px, borde #E5E7EB, height 44px, focus ring #008DC9) pero son componentes separados en dos aplicaciones. Documentar como patron compartido en design tokens para consistencia.

### Feedback de: architect (ux-criteria)
- Los requirements no definen comportamiento offline para ninguna pantalla del panel — si el admin pierde conexion a internet mientras trabaja, no hay estrategia de retry ni almacenamiento local. Para v1 esto es aceptable (panel siempre requiere conexion) pero deberia documentarse como limitacion
- El flujo de "Duplicar producto" aparece como opcion del menu 3 puntos (REQ-228) pero ningun flujo de usuario define el comportamiento completo: que campos se copian, si las imagenes se copian o no, nombre por defecto de la copia. Se resolvio en GAP-UX02 del ux-criteria.md pero deberia haberse definido en requirements
- Los ux-flows.md definen estados de carga (skeleton) para todas las pantallas, pero los requirements originales no mencionan ni un solo estado de carga. Este es un patron recurrente: los requirements definen que pasa con datos y sin datos, pero nunca que pasa MIENTRAS se cargan los datos. Incluir checklist de estados de UI (loading, success, error, empty, many-data) en el template de requirements
- La concurrencia de edicion en el panel (dos admins editando el mismo contenido) no esta abordada en ningun documento excepto como gap. Para v1 con un solo admin activo esto no es problema, pero si HESA agrega mas administradores en el futuro, "last write wins" puede causar perdida de datos silenciosa
- DEMO-016 (storytelling de producto) es un criterio de demo con baja visibilidad — es opcional, depende de que el producto tenga bloques configurados, y no aparece en ningun flujo critico. Podria omitirse en la demo si el scope visual es ajustado, pero se incluyo por completitud

### Feedback de: plan-verifier
- Los requirements no definen estados de carga (skeleton/loading) para ninguna pantalla — este gap fue correctamente resuelto por el UX Flow Designer y Design Orchestrator, pero deberia ser un checklist obligatorio del BA template en futuros proyectos
- DEMO-045 (CRM tracking) es el unico DEMO-xxx sin REQ-xxx formal del BA. Funciona como feature estructural aprobada por el PM, pero carece de criterios de aceptacion formales. En futuros proyectos, cualquier feature estructural deberia tener al menos un REQ-xxx para trazabilidad completa
- La cobertura de los 371 requirements es exhaustiva — cada REQ tiene DEMO en arquitectura y DC/UX en diseno. La cadena de trazabilidad REQ->DEMO->DC/UX es solida
- El contraste de color de marca (#008DC9 a 3.71:1) es una limitacion inherente que esta bien documentada con restricciones de uso, pero debera verificarse cuidadosamente en la fase de implementacion visual (paso 4a-verify)
- La calidad de los 4 documentos del plan es excepcional: 371 REQ numerados, 45 DEMO con origen REQ, 149 DC con valores exactos, 117 UX con origen DEMO, 40 BVC con DC relacionado. La trazabilidad bidireccional es completa

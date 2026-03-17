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

### Feedback de: devops
- La Azure subscription CEFSA-prod tiene 13 Static Web Apps en tier Free, excediendo el limite de 10 -- nuevos SWA deben usar tier Standard ($9/mes) o se deben eliminar SWAs inactivos del Free tier para liberar cuota
- El proyecto Angular 19 genera build output en `dist/hesa-web/browser/` (no en `dist/hesa-web/` directamente). El CI/CD debe apuntar a la subcarpeta `browser/` como output location para Azure SWA. Si el Developer agrega SSR en el futuro, la estructura de output cambiara y el workflow necesitara actualizacion
- El `staticwebapp.config.json` debe copiarse al directorio de output durante el build (no se incluye automaticamente). El workflow de GitHub Actions tiene un paso explicito para esto
- El architect recomienda en GAP-A04 usar App Service para el sitio publico (SSR) y SWA solo para el panel admin. Para la demo (sin SSR), SWA funciona perfectamente. Cuando se implemente SSR en iteraciones posteriores, se necesitara re-evaluar la estrategia de deploy del sitio publico


### Feedback de: ui-developer
- El design-criteria.md no especifica el estado visual del boton "Filtrar" en mobile cuando hay filtros activos (solo dice badge con conteo) -- se implemento con circulo azul 20px con numero blanco
- Los DC-xxx no definen un color de fondo para el hero del sitio publico cuando no hay imagen cargada -- se uso --neutral-900 como fallback con overlay gradient
- El contraste de texto blanco sobre --brand-primary (#008DC9) a 3.8:1 efectivamente limita su uso a texto grande (18px+ bold). En CTAs y badges pequenos se deberia considerar usar --brand-dark (#005A85) para cumplir AA en todo tamano
- La escala monocromatica de colores (--brand-primary-50 a --brand-primary-900) definida en design-tokens.md no fue incluida en los DC-xxx como custom properties requeridas -- se implementaron solo los tokens core definidos en DC-001 a DC-029
- El DC-048 requiere campos condicionales segun categoria con "fade in/out" pero no especifica que campos son condicionales para cada categoria -- se implemento el formulario base sin logi de campos condicionales (eso es funcionalidad, no cascara visual)
- Angular 19 usa @use en lugar de @import para Sass -- el scaffold inicial del proyecto generaba @import deprecado en styles.scss. Se migro a @use para eliminar deprecation warnings
- Los budget limits de angular.json (4kB por component style) son insuficientes para componentes con multiples estados y breakpoints responsive como el header, dashboard y product-detail -- se aumento a 6kB warning / 12kB error
- El DC-029 define circulos decorativos de iconos como 48px pero el DC-062 los define como 56px para Value Stat -- hay inconsistencia entre el token generico y la especificacion del componente. Se uso 48px para panel (DC-029) y 56px para Value Stat (DC-062)
- GAP-D12 (sidebar del panel no detallado en components.md) se resolvio como layout component dentro del AdminLayoutComponent con patron de sidebar activo consistente con DC-088
- No hay imagenes placeholder reales disponibles en el proyecto (carpeta public/ solo tiene favicon.ico). Se usaron SVG inline como placeholders para todas las imagenes de productos, marcas, equipo y heroes

### Feedback de: plan-verifier
- El UI Developer no implemento templates visuales para estados de error y vacio en catalogo (DC-106, DC-107) ni la pagina 404 estilizada (DC-111) ni el empty state del panel de productos (DC-118). Estos son shells visuales que deben existir independientemente de la logica funcional
- El carrusel de productos destacados (DC-055) se implemento como grid CSS en lugar de un carrusel real con flechas circulares 44px y swipe. Las flechas son componente visual, no logica
- La tabla del panel en mobile (DC-090) simplemente se oculta con display:none en lugar de transformarse a stacked cards con labels UPPERCASE, lo cual deja a los usuarios mobile sin acceso a la vista tabla
- El image uploader (DC-122) carece de la progress bar visual (4px radius 2px) que deberia estar como componente CSS listo, aunque la animacion sea funcional
- El formulario de contacto publico (DC-130) no tiene el template visual de confirmacion post-submit (checkmark verde 48px + "Mensaje enviado" + fondo #DCFCE7), que es una pieza visual, no logica
- Los estados de pre-animacion para count-up (DC-143) y timeline secuencial (DC-144) no existen -- los numeros arrancan en su valor final y los nodos son siempre visibles, lo cual requiere CSS initial state para que la animacion funcional pueda activarlos
- El kanban (DC-146) no tiene los estilos CSS para drag-drop visual (card arrastrada con sombra lg + rotate(2deg) + opacity 0.9, y columna destino con borde 2px dashed #008DC9 + fondo #E8F4FD). Estos son CSS puro, no logica de drag
- El summary-card del dashboard (DC-117) no tiene la variante visual de error (borde izq 4px #EF4444 + mensaje "Error al cargar" + boton "Reintentar")

### Feedback de: ui-developer (post-verification fix)
- Los 4 criterios sin cobertura (DC-106, DC-107, DC-111, DC-118) y 10 parciales fueron todos shells visuales que deberian haberse incluido en la implementacion inicial. Patron recurrente: los estados de error y vacio no son "logica funcional" sino templates HTML+CSS que deben existir como cascara visual desde el paso 4a
- La distincion entre "visual shell" y "logica funcional" deberia estar mas clara en las instrucciones del rol: templates con style="display:none" son visuales, la logica que los muestra/oculta es funcional
- La tabla mobile stacked (DC-090) requiere HTML duplicado entre desktop table y mobile cards porque CSS-only transforms de table a stacked cards son fragiles en Angular con component encapsulation. El approach de dual rendering (display:none toggle) es mas confiable
- El design-criteria.md prescribe carousel con swipe touch (DC-055) pero swipe es inherentemente funcional (requiere touch event listeners). Solo las flechas circulares y dots son visuales. El criterio deberia separar "flechas visibles" de "swipe funcional"
- Los estados pre-animacion (DC-143 count-up, DC-144 timeline secuencial) requieren que el HTML empiece con valores visualmente diferentes (numeros en "0", nodos invisibles) y el CSS tenga las transiciones definidas. El Developer en paso 4b solo necesita agregar IntersectionObserver para togglear la clase CSS
- RouterLink faltaba como import en componentes standalone que usaban routerLink en templates (home, products-list, product-detail). Angular 19 standalone requiere imports explicitos de directivas de router

### Feedback de: plan-verifier (ronda 2 - paso 4a-verify)
- Los 14 gaps reportados en ronda 1 fueron corregidos exhaustivamente. El UI Developer implemento todos los shells visuales faltantes con calidad consistente
- Patron positivo observado: todos los estados de error/vacio usan style="display:none" como shell con role="alert" o role="status" para accesibilidad, listos para ser activados en paso 4b
- Las ilustraciones SVG para estados vacios (DC-107, DC-111, DC-118) usan tokens del design system (--neutral-50, --neutral-200, --surface-pharma, --brand-primary) en lugar de colores hardcoded, lo cual es correcto
- La solucion de tabla mobile stacked (DC-090) usa dual rendering (tabla desktop + cards mobile con display toggle) en lugar de CSS transforms, lo cual es mas robusto con Angular encapsulation
- Los estados pre-animacion (DC-143 count-up con valor "0", DC-144 timeline con --pre-animation) estan correctamente implementados como CSS puro con transition-delay via custom properties, dejando solo el trigger de IntersectionObserver para paso 4b
- El carousel (DC-055) implemento flechas circulares 44px con todas las variantes (hover, disabled, focus) y ocultamiento correcto en mobile. Touch swipe queda para paso 4b como funcionalidad
- Recomendacion para futuros proyectos: incluir explicitamente en el checklist del UI Developer "implementar TODOS los shells visuales de estados UI (error, vacio, carga) aunque sean hidden" para evitar la necesidad de ronda 2

### Feedback de: developer
- El ux-criteria.md especifica rutas con patron `/:lang/catalogo/[categoria]/[slug]` pero no define como manejar colisiones si un producto tiene el mismo slug en dos categorias distintas. En la demo con mock data no es problema pero en produccion debe garantizarse unicidad de slug por idioma
- El UX-060 pide 48 productos pero la distribucion sugerida (~28 farmacos, ~14 alimentos, ~6 equipos) deja los equipos con muy pocos items para demostrar funcionalidad de filtros y paginacion. Se crearon 6 equipos con tipos variados (Diagnostico, Quirurgico, Laboratorio, Instrumental) pero la paginacion no se puede demostrar con solo 6 items
- El ux-criteria.md no define que pasa con los formularios de admin (producto, marca, contenido) al recargar la pagina durante una edicion en progreso. En la demo todo es mock sin persistencia, pero en iteraciones reales se necesita definir si se usa localStorage como draft o simplemente se pierden los datos
- La seccion de storytelling del producto (UX-031b) requiere bloques opcionales con imagen+texto pero no especifica el tamano maximo de texto ni si soporta formato rich-text o solo texto plano. Se implemento como texto plano
- El CRM tracking (UX-114) envia eventos a un endpoint que no existe en la demo. Los errores de red se capturan silenciosamente (por diseno) pero en console se ven warnings de fetch failed que pueden confundir al cliente durante la presentacion
- Los filtros adaptativos del catalogo (UX-076) requieren que al cambiar categoria los filtros secundarios cambien dinamicamente. Esto funciona correctamente en la pagina de catalogo por categoria pero en el catalogo general la adaptacion de filtros al seleccionar una categoria es mas limitada porque el dropdown de filtros es generico
- El ux-flows.md describe la galeria de producto con "zoom on hover / lightbox on click" (UX-079) pero esto requiere una libreria de terceros o implementacion custom significativa. En la demo se implementaron thumbnails clickeables sin lightbox ni zoom
- El design-criteria.md y el ux-criteria.md tienen referencias cruzadas complejas (DC-xxx + UX-xxx) pero no existe un mapeo explicito de "cual DC corresponde a cual UX para cada componente". El developer debe cruzar manualmente ambos documentos lo cual es propenso a omisiones

### Feedback de: plan-verifier (paso 4b-verify)
- El Developer implemento correctamente los flujos criticos (UX-013 busqueda+solicitud, UX-014 fabricante evalua HESA) con navegacion funcional completa y datos mock realistas. La calidad de los flujos principales es alta
- El CRM tracking (UX-114, UX-115) esta completamente implementado con todos los comportamientos definidos: open, page-view, scroll thresholds, heartbeat, CTA tracking, batching, sendBeacon, flush en visibility/beforeunload, exclusion del panel admin. Implementacion ejemplar
- Los IntersectionObserver para animaciones de scroll (UX-087 count-up, UX-088 fade-in, UX-093 timeline secuencial) NO fueron implementados por el Developer. El UI Developer dejo los estados pre-animacion CSS preparados (DC-143, DC-144) pero el Developer debio agregar los observers para activarlos. El resultado es que los numeros de propuesta de valor muestran "0" permanentemente y las secciones con fade-in-section pueden estar invisibles
- El BrandLogosRowComponent tiene datos hardcoded en lugar de usar MockDataService, y los enlaces <a> no tienen routerLink funcional. Esto rompe el flujo Home -> Marca individual (UX-086). Es una inconsistencia: todos los demas componentes usan MockDataService correctamente
- Los filtros del catalogo (UX-076) no sincronizan con query params del URL, lo cual impide compartir URLs filtradas y pierde el estado al usar boton atras del navegador. Esto contradice explicitamente el criterio "URL actualizada con query params de filtros activos"
- Los filtros en mobile (UX-077) no tienen drawer desde abajo -- se muestran igual que en desktop. Esto impacta la usabilidad mobile significativamente ya que los dropdowns de filtro ocupan mucho espacio horizontal
- El ManufacturerCtaComponent y el TimelineComponent tienen textos hardcoded en espanol sin i18n. Esto rompe la experiencia bilingue para visitantes en /en/. Patron: componentes simples sin inyeccion de I18nService
- El header del panel admin (UX-011) no tiene icono de notificaciones con badge ni dropdown de usuario con opcion "cerrar sesion". Solo muestra avatar + nombre estático
- La distincion entre "shell visual" y "funcionalidad de demo" esta bien delineada en la ux-criteria.md para los flujos 3-8 (shell), pero algunos criterios dentro de esos flujos (como campos condicionales UX-044, cambios sin guardar UX-045) son ambiguos: el criterio los describe como funcionalidad pero el flujo padre esta marcado como "shell". Recomendacion para futuros proyectos: marcar explicitamente cada sub-criterio como "shell" o "funcional" independientemente del flujo padre
- El mock data service es de calidad excepcional: 48 productos realistas con nombres del sector veterinario costarricense, 12 marcas con paises y categorias correctas, 12 mensajes variados, 6 miembros del equipo, datos de configuracion completos. La variedad y realismo superan expectativas

### Feedback de: developer
- Los UI Developer dejaron comentarios HTML tipo "count-up triggered by IntersectionObserver in step 4b" y "IntersectionObserver in step 4b adds .timeline--animated" sin implementar la logica JS correspondiente. Esto crea una dependencia implicita no documentada en el ux-criteria.md. Recomendacion: incluir en el design-criteria o ux-criteria un criterio explicito de tipo "El developer debe implementar IntersectionObserver para las siguientes clases CSS: .fade-in-section, .timeline--pre-animation, .value-stat--pre-scroll"
- El ToastService tiene la firma show(type, message) pero otros componentes existentes usan show(message, type). Esto causa errores de compilacion silenciosos si el developer asume el orden convencional (message, type). Recomendacion: usar los metodos convenience (success, error, warning, info) en vez del generico show() para evitar ambiguedad
- La verificacion 4b (plan-verifier) fue muy util para identificar gaps funcionales. El formato de reporte con secciones "Gaps CRITICOS" vs "Gaps PARCIALES aceptables" agiliza la priorizacion. Sugerencia: que el reporte incluya la ruta del archivo/componente afectado para cada gap, no solo el UX-xxx
- El BrandLogosRowComponent original tenia datos hardcoded en vez de usar el MockDataService ya disponible. Esto es un patron recurrente en componentes simples: cuando el UI Developer crea un componente visual, hardcodea datos placeholder en vez de inyectar el servicio de datos. Recomendacion para el UI Developer: siempre inyectar MockDataService y usar datos reales, incluso para componentes visuales simples
- Los filtros adaptativos en el catalogo general (UX-016) requieren logica de clearing de filtros secundarios al cambiar categoria. Sin esta logica, seleccionar "Farmacos" y filtrar por "Familia: Antibioticos" y luego cambiar a "Alimentos" dejaria el filtro de familia activo pero invisible y sin resultados

### Feedback de: plan-verifier (ronda 2, 4b-verify)
- El developer corrigio 17 de 18 gaps en una sola ronda. Patron positivo: las correcciones fueron exhaustivas y no introdujeron scope creep ni regresiones en criterios previamente cubiertos
- UX-079 (galeria producto lightbox/swipe) es el unico gap residual. El criterio UX pide zoom on hover + lightbox on click + swipe mobile, pero la implementacion solo tiene zoom on hover (scale 1.05 via CSS). Lightbox y swipe son features complementarias que no bloquean la demo pero deberian planificarse para una iteracion futura
- El patron de IntersectionObserver se repite en 4 componentes (ValueStat, HomeComponent fade-in, DistributorsComponent fade-in, DistributorsComponent timeline). Seria beneficioso un servicio compartido o directiva Angular reutilizable para evitar duplicacion de codigo de observer
- El dashboard paso de carga sincrona a asincrona correctamente, incluyendo skeleton y error state. Sin embargo, la carga es un solo bloque (todo o nada); el criterio UX-041 pide "error parcial" donde secciones individuales puedan fallar. Esto es aceptable para la fase visual demo pero deberia tenerse en cuenta en la implementacion funcional
- La implementacion del kanban drag-and-drop usa la API nativa HTML5 DnD, que no funciona en mobile touch. Para la fase visual demo esto es aceptable, pero en produccion se necesitara una libreria de DnD con soporte touch (ej: CDK DragDrop de Angular)

### Feedback de: developer (security review)
- Las rutas admin no tenian ningun guard de autenticacion — cualquier usuario podia acceder a /admin/dashboard directamente. Esto es critico incluso en fase demo porque el deploy es publico en Azure SWA. Se agrego authGuard + AuthService mock
- El formulario de contacto no tenia limites de longitud en ningun campo ni rate limiting. Un atacante podia enviar payloads de megabytes o hacer spam masivo. Se agregaron maxlength HTML + validacion JS + rate limiting de 30s
- Los inputs de busqueda (overlay y search results) no sanitizaban caracteres de control. Aunque Angular auto-escapa en interpolacion, los control characters podrian causar problemas en futuras integraciones con APIs/DB
- staticwebapp.config.json no tenia Content-Security-Policy ni Strict-Transport-Security. Estos headers son la primera linea de defensa contra XSS e intercepciones en produccion
- Las dependencias tenian 6 vulnerabilidades high severity (serialize-javascript RCE + tar path traversal). Aunque son dev-only dependencies, un atacante con acceso al CI/CD podria explotarlas. Se resolvieron con npm overrides
- El architecture.md deberia incluir una seccion explicita de "Security Requirements" para cada iteracion, especificando que guards, validaciones y headers son obligatorios desde el inicio
- Los requirements no especifican politica de rate limiting para el formulario de contacto. Este es un edge case comun que deberia estar documentado para evitar que se implemente de formas inconsistentes

### Feedback de: qa-orchestrator
- El volumen de criterios visuales es muy alto (149 DC + 40 BVC = 189 criterios solo para Visual Checker) lo cual puede generar reportes superficiales si el sub-tester no prioriza correctamente. Se establecio estrategia de priorizacion: tokens primero (automatizables via browser_evaluate), luego layouts, luego componentes, luego BVC
- Los design-criteria.md mezclan criterios verificables por computed-style (colores exactos, font-size, spacing) con criterios subjetivos (BVC-001 "se siente premium", BVC-010 "supera competencia"). Los subjetivos requieren criterio humano del Visual Checker y son mas propensos a discrepancia entre rondas
- Los UX-criteria dividen los flujos en 3 niveles (CRITICO, IMPORTANTE, COMPLEMENTARIO) pero no hay priorizacion equivalente para los DC-xxx — todos tienen el mismo peso. Esto dificulta decidir que re-testear primero si hay regresiones
- Los mock data requirements (UX-060 a UX-074b) son 16 criterios separados pero todos son verificables en una sola sesion de exploracion. Seria mas eficiente si estuvieran agrupados como un unico criterio con sub-items
- No hay definicion clara de que constituye "equivalente visual a Tuft & Paw" (BVC-007) — el sub-tester deberia tener acceso a capturas de referencia en output/design/references/ para comparar
- Los NFR de performance (NFR-001, NFR-003, NFR-005) son dificiles de testear contra una demo con mock data porque no hay backend real — los tiempos de carga reflejan solo el bundle Angular, no la carga real de datos. Resultados seran optimistas respecto a produccion

### Feedback de: edge-case-tester
- La interaccion con formularios (contacto, distribuidores) presenta navegacion inesperada al usar selectOption en comboboxes o hacer click en submit — posiblemente un bug de routing en Angular donde el evento del form trigger un cambio de ruta
- La pagina /es/distribuidores mezcla idiomas: headings en ingles y contenido de cards en espanol, indicando que la internacionalizacion no esta completamente implementada para esta pagina
- La API de CRM tracking (crm-api.linkdesign.cr) retorna ERR_NAME_NOT_RESOLVED en todas las paginas, generando errores de consola constantes que podrian afectar performance y confundir debugging
- La session del panel admin se pierde al navegar directamente por URL (ej: escribir /admin/productos en la barra de direcciones). Solo funciona navegando via clicks en el sidebar. Esto indica que la persistencia de session via Angular routing no esta implementada correctamente
- El filtro de Marca en el catalogo no se adapta al seleccionar una categoria — sigue mostrando todas las marcas incluyendo las que no aplican a la categoria seleccionada (ej: Heine/IMV/Welch Allyn aparecen al filtrar por Farmacos)
- Los headers de seguridad estan excelentemente configurados: CSP, X-Frame-Options DENY, HSTS con preload, Permissions-Policy, Referrer-Policy strict-origin-when-cross-origin
- Los formularios incluyen campos honeypot para anti-spam, lo cual es buena practica
- La sanitizacion XSS funciona correctamente tanto en search overlay como en campos de formulario — no se ejecutan scripts inyectados

### Feedback de: visual-checker
- CRITICO: El script CRM tracking (crm-api.linkdesign.cr/api/tracking) causa ERR_NAME_NOT_RESOLVED en cada pagina y parece provocar navegacion erratica del router Angular. El SPA cambia de ruta automaticamente cada pocos segundos sin interaccion del usuario, lo que impide testing estable. Deshabilitar o corregir urgentemente.
- Las imagenes de productos estan ausentes en TODA la aplicacion: hero sin foto de fondo, bloques de categoria sin imagenes, product cards sin fotos, product detail sin galeria. Solo se muestran placeholders de imagen rota. Esto afecta severamente la percepcion visual del sitio.
- La seccion de "Marcas Destacadas" (brand logos row con grayscale + hover color) NO existe en el home. El fullpage muestra salto directo del hero a bloques de categoria sin logos de marcas.
- El CTA de fabricantes en home tiene fondo oscuro en lugar del azul #008DC9 prescrito en design-criteria.md
- El design token system esta COMPLETAMENTE implementado: 40+ CSS custom properties en :root, todos con valores exactos al design-criteria.md. Esto es excelente calidad de implementacion.
- El panel dashboard tiene 96% similitud visual con la referencia Dashly — match excepcional.
- El submenu de "Productos" en el sidebar del panel se desborda horizontalmente sobre el area de contenido del dashboard.
- Los tokens de tipografia, spacing, radius, sombras, z-index y transiciones estan perfectamente definidos. La base del design system es solida.
- El footer cumple al 100%: fondo #005A85, texto blanco, 4 columnas desktop, acordeones mobile con "+", copyright, selector idioma
- La ausencia de imagenes hace que el home parezca incompleto y no premium — una vez se agreguen imagenes reales el sitio mejorara drasticamente en percepcion visual

### Feedback de: flow-tester
- El SPA routing en Angular tiene un problema critico de deep linking: las rutas /es/catalogo/farmacos, /es/marcas, /es/nosotros, /es/catalogo/[cat]/[slug] y la mayoria de rutas publicas no funcionan cuando se accede via URL directa (refresh o deep link). Solo funcionan mediante navegacion interna del SPA (click en links). Esto afecta SEO, compartir URLs, y bookmarks. Probable causa: configuracion de fallback routing en Azure Static Web Apps (staticwebapp.config.json) o falta de wildcard rewrite rules para el SPA.
- Las rutas del panel admin (excepto /admin y /admin/login) tambien fallan via deep link directo, redirigiendo al home publico o a una ruta publica incorrecta.
- La pagina de Distribuidores (/es/distribuidores) mezcla idiomas: el hero y formulario estan en ingles ("Become Our Distribution Partner", "Start Your Partnership") mientras los beneficios y footer estan en espanol. Parece que las traducciones del componente de distribuidores no estan conectadas al sistema de i18n.
- El dashboard del admin panel muestra "48 Productos" pero el catalogo publico dice "47 productos". La discrepancia se debe a 1 producto inactivo (Flunixin Meglumine). Esto es probablemente comportamiento intencional pero deberia documentarse.
- El carrusel de productos destacados en home muestra 4 productos pero el dashboard dice "6 Destacados". Los 2 productos adicionales no son visibles (posiblemente estan fuera del viewport y requieren scroll/swipe pero los botones prev/next no los revelan).
- El resize de viewport mientras se esta en el panel admin causa una redireccion a una ruta publica (/es/contacto), perdiendo el contexto del admin panel. Esto indica un conflicto entre el routing del sitio publico y el routing del panel admin cuando el layout cambia.
- Los productos en el catalogo publico usan imagenes placeholder (iconos de imagen) en lugar de imagenes reales, lo cual dificulta la evaluacion del flujo visual de navegacion de catalogo.
- El formulario de contacto incluye un honeypot field (textbox oculto sin label) antes del formulario visible, implementando correctamente la proteccion anti-spam.
- La navegacion del header publico tiene un submenu desplegable para Catalogo con las 3 subcategorias, lo cual es una buena implementacion del UX requerido.
- El CRM tracking endpoint (crm-api.linkdesign.cr/api/tracking) falla con ERR_NAME_NOT_RESOLVED en cada pagina, generando errores en consola. Este endpoint deberia configurarse correctamente o deshabilitarse en el entorno de demo.

### Feedback de: qa-orchestrator (consolidacion ronda 1)
- El deep linking roto en Azure SWA es el bloqueador principal: 101 de 317 criterios (32%) quedaron BLOQUEADOS porque no se pueden navegar las rutas por URL directa. El architecture.md o devops deberian haber especificado la configuracion de navigationFallback en staticwebapp.config.json como requisito critico del deploy
- El script CRM tracking (crm-api.linkdesign.cr) causa navegacion erratica del router Angular, multiplicando el impacto del problema de routing. El architecture deberia especificar que scripts de terceros deben tener manejo de errores que no afecte la estabilidad del router
- Las imagenes mock de productos, hero y bloques de categoria estan rotas/faltantes. El developer deberia verificar que las URLs de imagenes en los mock data apuntan a assets reales incluidos en el build, o usar un servicio de placeholder como picsum.photos
- La pagina de Distribuidores tiene traducciones incompletas: hero y formulario en ingles hardcoded, beneficios en espanol. El sistema de i18n no esta conectado a todos los componentes de la pagina
- Los sub-testers no grabaron GIFs en esta ronda, solo screenshots. Para Ronda 2 es obligatorio que graben GIFs de los flujos principales
- El 17% de criterios (55) son N/A porque corresponden a estados de loading, error y vacio que requieren condiciones especificas no reproducibles en demo con mock data. El plan de testing deberia anticipar que estos estados solo pueden verificarse con herramientas de intercepcion de red (ej: Playwright route interception)
- El panel admin tiene 13 criterios de interacciones avanzadas (drag-drop, formularios, modales) BLOQUEADOS porque la session se pierde al navegar por URL. Esto es efecto del BUG-001 (routing) pero tambien indica que el panel no tiene persistencia de session robusta
- El submenu de Productos en el sidebar del panel desborda horizontalmente sobre el area de contenido. Esto indica un problema de CSS overflow en el componente sidebar

### Feedback de: developer
- El UI Developer dejo la pagina de Distribuidores con textos hardcoded en ingles (hero, titulos de seccion, timeline, formulario) mientras que las cards de beneficios estaban en espanol. Esto causaba BUG-008. Todo contenido visible debe pasar por el servicio i18n desde el inicio
- El CrmTrackingService original no tenia manejo de errores robusto: sendBeacon y fetch fallaban con ERR_NAME_NOT_RESOLVED y los errores se propagaban al router Angular, causando navegacion erratica (BUG-002 y BUG-012). Servicios de terceros deben siempre ejecutarse fuera de NgZone y con circuit breaker
- Las imagenes de productos, categorias y hero usaban nombres de archivo placeholder ('placeholder-1', 'placeholder-hero.jpg') que no existian en el directorio public/. En la fase de construccion visual, todos los assets referenciados deben existir o usar SVG inline como fallback
- El sidebar del panel admin no tenia estilos CSS para submenu, sublinks ni chevrons (BUG-010) — los selectores estaban en el HTML pero faltaban las reglas SCSS correspondientes
- El orden de secciones en home.component.html no coincidia con el design-criteria: Brand Logos estaba despues de Category Blocks en lugar de entre Hero y Category Blocks (BUG-005)
- El staticwebapp.config.json tenia un patron de exclusion demasiado amplio ("/*.js") en navigationFallback que potencialmente excluia archivos JS necesarios para el SPA routing. Cambiado a "/assets/*" que es mas seguro
- La propiedad uniqueBrands del catalogo no filtraba marcas por categoria seleccionada (BUG-011), mostrando marcas de equipos cuando se filtraba por farmacos. Los filtros cruzados deben implementarse desde la primera version funcional

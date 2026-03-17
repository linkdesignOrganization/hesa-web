# Pending Feedback
> Los agentes appendan su feedback aqui. El Feedback Curator lo procesa en paso 4j/5i/R5.

### Feedback de: feedback-curator
- El developer acumula la mayor cantidad de feedback (13 entradas nuevas) — refleja su rol central pero tambien indica que otros agentes (BA, architect) deberian definir mejor los criterios upstream para reducir descubrimientos en implementacion
- El architect no genera feedback sobre su propio trabajo — todo el feedback del architect es sobre gaps en requirements o documentacion de otros. Posible gap en auto-reflexion
- La regresion automatizada nunca se ejecuto en 4 rondas de QA a pesar de ser gate obligatorio — el PM y QA necesitan enforcement mas estricto
- El 60%+ del feedback de site-capturers, visual-system-designer, ux-flow-designer y component-designer es especifico del proyecto HESA y no genera principios generales reutilizables — esto es esperado para agentes stateless pero vale monitorear que no se acumule feedback sin procesar
- El feedback del cliente (3 entradas) fue de alto impacto: cambio la clasificacion de resultados del QA (elimino PASA parcial), refuerzo la regresion automatizada, y definio expectativas de demo. El feedback del cliente debe procesarse siempre con prioridad maxima (weight 10)
- La design-researcher no recibe feedback de aprendizaje de ningun agente — su output fue alabado como excelente pero no hay principios nuevos que agregar. Monitorear en futuros proyectos si esto cambia

### Feedback de: devops
- Los environment files del proyecto (environment.ts, environment.prod.ts) solo tenian `production: boolean` sin ningun endpoint, clientId, ni configuracion cloud. Para proyectos con backend + auth, estos archivos deben poblarse con la configuracion correcta desde FASE 3.5-INFRA para que el developer pueda empezar Iteracion 1 sin bloqueos
- No existia archivo `.env` ni `.env.example` en el repositorio. El developer necesita un .env.example commiteado como referencia para saber que variables de entorno configurar, y el .env real (gitignored) con las credenciales para desarrollo local
- La arquitectura define Azure CDN sobre Blob Storage pero para el volumen esperado (<1000 productos, audiencia CR + evaluadores internacionales), el endpoint directo de Blob Storage es suficiente para empezar. CDN se agrega cuando se tenga custom domain o se identifique un problema de latencia real
- Cosmos DB Serverless es la eleccion correcta para este volumen — evita el costo de RU provisionadas y escala automaticamente. El developer debe tener en cuenta que Serverless tiene cold-start (~1s primera conexion despues de inactividad)
- Azure Communication Services queda provisionado con dominio integrado (*.communication.azure.com). Para produccion real, el cliente deberia verificar un dominio propio para mejor deliverability de emails

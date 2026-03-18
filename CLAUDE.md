# HESA WEB — Contexto del Proyecto

## Negocio
- **Cliente**: HESA (Herrera y Elizondo S.A.) — empresa familiar costarricense, 2da generacion, 37 anos en el mercado
- **Sector**: Importacion y distribucion de farmacos veterinarios, alimentos para animales y equipos veterinarios
- **Grupo**: 4 empresas operando como una sola; el sitio es solo para HESA pero productos pueden venir de cualquier entidad del grupo
- **Equipo**: 50+ colaboradores en planta, 18-20 agentes de ventas propios, flotilla propia de entrega
- **Cobertura**: Todo Costa Rica con visitas quincenales. Expansion a Centroamerica en proceso (zona franca)
- **Exclusividad**: La mayoria de marcas que distribuyen son exclusivas. 100% sector veterinario

## Proposito del Sitio
1. **Catalogo informativo** para clientes locales (veterinarias, pet shops, groomers, agroservicios). NO es e-commerce: sin precios, sin inventario, sin carrito, sin registro de usuarios
2. **Presencia corporativa** para fabricantes internacionales (Asia, Europa, America) evaluando a HESA como distribuidor — funciona como pitch comercial

## Requerimientos Clave
- Bilingue: Espanol + Ingles (pagina de distribuidores critica en ingles)
- Panel de administracion facil para personal no tecnico (equipo comercial)
- ~96 productos mock con imagenes ya disponibles
- Referencia visual sitio publico: tuftandpaw.com (premium, espacio en blanco, tipografia grande)
- Referencia visual panel admin: dashlytemplate.webflow.io (cards, tablas limpias, formularios)
- Competencia a superar: Monteco, VETIM, Belina

## Decisiones del Cliente (Fase 2)
- Solo HESA en todo el sitio, no se mencionan las demas empresas del grupo
- Auth con Azure Entra ID, admin inicial: hola@linkdesign.cr
- Un solo nivel admin, nuevos admins via portal Azure
- Fichas tecnicas PDF opcionales por producto (boton dinamico)
- NO mencionar expansion a Centroamerica
- NO Google Analytics ni Facebook Pixel por ahora
- Seccion equipo liderazgo con 6 personas placeholder
- Search bar global con prediccion/autocompletado
- Catalogo general + por categorias, ambos con filtros

## Arquitectura (Fase 3)
- **Modulos**: Public (catalogo, corporativo, contacto), Admin (productos, marcas, categorias, contenido, mensajes, config), Shared (auth, API, i18n)
- **Fases**: Demo visual (45 DEMO-xxx) + 4 iteraciones
  - Iter 1: Backend API + CRUD productos/marcas/categorias + conectar frontend
  - Iter 2: Catalogo avanzado (filtros, busqueda, paginacion) + panel contenido/mensajes + i18n
  - Iter 3: Auth Entra ID + gestion equipo + politicas comerciales + SEO + contacto funcional
  - Iter 4: Optimizacion rendimiento + seguridad + accesibilidad + polish final
- **Design System**: Inter font, paleta HESA (#008DC9 azul, #50B92A verde), tokens CSS custom properties sobre Bootstrap 5
- **Criterios**: 149 DC-xxx (visual) + 40 BVC-xxx (brief) + 117 UX-xxx (funcional)

## Stack Tecnologico
- Frontend: Angular + Bootstrap 5
- Backend: Node.js + Express
- Base de datos: MongoDB (Azure Cosmos DB)
- Auth: Azure Entra ID (MSAL)
- Deploy frontend: Azure Static Web Apps
- Deploy backend: Azure App Service
- CI/CD: GitHub Actions
- Iconografia: Lucide Icons

## Deployment (Fase 6)
- **Sitio publico**: https://gray-field-02ba8410f.2.azurestaticapps.net
- **Panel admin**: https://gray-field-02ba8410f.2.azurestaticapps.net/admin
- **API Backend**: https://hesa-api.azurewebsites.net
- **Blob Storage**: https://hesastorage.blob.core.windows.net
- **CI/CD**: Push a master → deploy automatico (frontend ~2min, backend ~1.5min)
- **Auth admin**: Azure Entra ID, correo inicial: hola@linkdesign.cr
- **BD**: Panel limpio — solo categorias/filtros. Sin datos placeholder.
- **Tests**: 645+ tests automatizados Playwright

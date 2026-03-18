# Infrastructure Setup — HESA Web

**Fase**: 3.5-INFRA (Cloud Infrastructure Setup)
**Ultima actualizacion**: 2026-03-17

---

## Resumen de Recursos Azure (HESA-RG)

| Servicio | Nombre | Location | Proposito |
|---|---|---|---|
| Static Web Apps | `hesa-web` | East US 2 | Frontend Angular (sitio publico + panel admin) |
| Cosmos DB (MongoDB) | `hesa-db` | East US 2 | Base de datos principal |
| Storage Account | `hesastorage` | East US 2 | Imagenes y PDFs (Blob Storage) |
| App Service | `hesa-api` | East US 2 | Backend API Node.js/Express |
| App Service Plan | `hesa-api-plan` | East US 2 | Plan Linux B1 para el backend |
| Communication Services | `hesa-comm` | Global (US) | Email transaccional |
| Entra ID App Registration | `HESA Admin Panel` | Tenant-level | Autenticacion del panel admin |

**Subscription**: CEFSA-prod (`4bdfcf40-ec56-4258-92e9-6f31b977a808`)
**Tenant ID**: `566e7def-c2ee-49b7-91e5-b045805f416a`

---

## Azure Static Web Apps (Frontend)

| Campo | Valor |
|---|---|
| Nombre del recurso | `hesa-web` |
| Resource Group | `HESA-RG` |
| Location | East US 2 |
| SKU | Standard |
| URL del sitio | https://gray-field-02ba8410f.2.azurestaticapps.net |

### Notas
- El sitio usa `staticwebapp.config.json` en la raiz del proyecto para configurar: navigation fallback (SPA routing), headers de seguridad (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy), y MIME types
- El archivo `staticwebapp.config.json` se copia al output (`dist/hesa-web/browser/`) durante el CI/CD build

---

## Azure Cosmos DB (API for MongoDB)

| Campo | Valor |
|---|---|
| Nombre del recurso | `hesa-db` |
| API | MongoDB 7.0 |
| Capacidad | Serverless |
| Consistency | Session |
| Backup | Continuous (PITR 7 dias) |
| Database name | `hesa` |
| Endpoint | `hesa-db.mongo.cosmos.azure.com:10255` |

### Collections

| Collection | Proposito |
|---|---|
| `products` | Catalogo de productos |
| `brands` | Marcas que distribuye HESA |
| `categories` | Categorias (Farmacos, Alimentos, Equipos) con familias/especies/etapas |
| `messages` | Mensajes de formularios de contacto |
| `team_members` | Equipo de liderazgo |
| `page_contents` | Contenido de paginas estaticas (Nosotros, Distribuidores, Contacto, Politicas) |
| `home_config` | Configuracion del hero, productos destacados, marcas destacadas |
| `site_config` | Configuracion general del sitio (contacto, redes, SEO) |
| `activity_logs` | Log de actividades CRUD del panel admin |

### Connection String (env var)
```
COSMOS_CONNECTION_STRING=mongodb://hesa-db:<key>@hesa-db.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@hesa-db@
COSMOS_DB_NAME=hesa
```

---

## Azure Blob Storage

| Campo | Valor |
|---|---|
| Storage Account | `hesastorage` |
| SKU | Standard_RAGRS (geo-redundante) |
| Blob endpoint | https://hesastorage.blob.core.windows.net/ |
| Access tier | Hot |
| TLS minimo | 1.2 |

### Containers

| Container | Acceso | Proposito |
|---|---|---|
| `images` | Blob (publico) | Imagenes de productos, marcas, equipo, hero, paginas |
| `documents` | Private | Fichas tecnicas PDF |

### Connection String (env var)
```
BLOB_CONNECTION_STRING=DefaultEndpointsProtocol=https;EndpointSuffix=core.windows.net;AccountName=hesastorage;AccountKey=<key>;BlobEndpoint=https://hesastorage.blob.core.windows.net/
BLOB_CONTAINER_IMAGES=images
BLOB_CONTAINER_DOCUMENTS=documents
BLOB_CDN_URL=https://hesastorage.blob.core.windows.net
```

### Nota sobre CDN
La arquitectura define Azure CDN sobre Blob Storage. Para esta fase se usa directamente el endpoint de Blob Storage (`BLOB_CDN_URL`). Cuando se configure un custom domain (cdn.hesa.cr) o se necesite caching avanzado, se agrega un perfil CDN y se actualiza `BLOB_CDN_URL` en las env vars.

---

## Azure App Service (Backend API)

| Campo | Valor |
|---|---|
| Nombre del recurso | `hesa-api` |
| App Service Plan | `hesa-api-plan` (Linux, B1) |
| Runtime | Node.js 20 LTS |
| URL | https://hesa-api.azurewebsites.net |
| Always On | Habilitado |
| FTPS | Deshabilitado |
| TLS minimo | 1.2 |
| HTTP/2 | Habilitado |

### CORS configurado
- `http://localhost:4200` (desarrollo local)
- `https://gray-field-02ba8410f.2.azurestaticapps.net` (SWA)

### Application Settings (env vars en produccion)
Todas las variables de entorno estan configuradas en App Service > Configuration > Application Settings:

| Variable | Valor |
|---|---|
| `NODE_ENV` | production |
| `PORT` | 8080 |
| `COSMOS_CONNECTION_STRING` | (connection string de Cosmos DB) |
| `COSMOS_DB_NAME` | hesa |
| `BLOB_CONNECTION_STRING` | (connection string de Storage) |
| `BLOB_CONTAINER_IMAGES` | images |
| `BLOB_CONTAINER_DOCUMENTS` | documents |
| `BLOB_CDN_URL` | https://hesastorage.blob.core.windows.net |
| `ENTRA_TENANT_ID` | 566e7def-c2ee-49b7-91e5-b045805f416a |
| `ENTRA_CLIENT_ID` | b18eec6f-d578-4525-bcdb-9dd6f33c0527 |
| `EMAIL_CONNECTION_STRING` | (connection string de Communication Services) |
| `EMAIL_SENDER` | DoNotReply@hesa-comm.unitedstates.communication.azure.com |
| `EMAIL_NOTIFICATION_TO` | hola@linkdesign.cr |
| `CORS_ORIGINS` | http://localhost:4200,https://gray-field-02ba8410f.2.azurestaticapps.net |

### Startup Command
```
node dist/app.js
```

---

## Cosmos DB — Indexes (Importante)

Cosmos DB MongoDB API **NO indexa automaticamente** todos los campos como MongoDB nativo. Cualquier campo usado en `.sort()` DEBE tener un indice explicito, de lo contrario Cosmos retorna error `BadValue: The index path corresponding to the specified order-by item is excluded`.

### Indexes creados manualmente (ademas de los definidos en Mongoose schemas)

| Collection | Index | Proposito |
|---|---|---|
| `products` | `{ "$**": 1 }` (wildcard) | Cobertura general para queries futuras |
| `products` | `{ createdAt: -1 }` | Sort en listados de productos |
| `brands` | `{ "$**": 1 }` (wildcard) | Cobertura general para queries futuras |
| `brands` | `{ name: 1 }` | Sort en listado de marcas |
| `brands` | `{ createdAt: -1 }` | Sort por fecha |
| `categories` | `{ "$**": 1 }` (wildcard) | Cobertura general |
| `activity_logs` | `{ createdAt: -1 }` | Sort en log de actividades |
| `activity_logs` | `{ "$**": 1 }` (wildcard) | Cobertura general |

**Regla para desarrolladores:** Al agregar un nuevo `.sort()` o `.find()` con campos no indexados, verificar que existe un indice en Cosmos DB. Los wildcard indexes cubren la mayoria de casos pero puede haber edge cases.

---

## Azure Entra ID (App Registration)

| Campo | Valor |
|---|---|
| Display Name | `HESA Admin Panel` |
| Application (client) ID | `b18eec6f-d578-4525-bcdb-9dd6f33c0527` |
| Object ID | `5eb7305c-4e11-4183-8293-7421f58e05c5` |
| Tenant ID | `566e7def-c2ee-49b7-91e5-b045805f416a` |
| Sign-in audience | Single tenant (AzureADMyOrg) |
| Platform | SPA (Single-page application) |
| Auth flow | Authorization Code + PKCE |

### Redirect URIs (SPA)
- `http://localhost:4200` (desarrollo local)
- `https://gray-field-02ba8410f.2.azurestaticapps.net` (produccion/SWA)

### API Permissions
| Permission | Type | Status |
|---|---|---|
| Microsoft Graph > User.Read | Delegated | Admin consent granted |

### Notas
- Implicit grant esta DESHABILITADO (se usa PKCE para SPAs, mas seguro)
- Service Principal creado (Object ID: `f1f66645-72b6-42e4-870b-b1b828f51567`)
- Para agregar admins: asignar usuarios desde Azure Portal > Enterprise Applications > HESA Admin Panel > Users and groups
- Admin inicial: `hola@linkdesign.cr`

---

## Azure Communication Services (Email)

| Campo | Valor |
|---|---|
| Nombre del recurso | `hesa-comm` |
| Host | hesa-comm.unitedstates.communication.azure.com |
| Data location | United States |

### Connection String (env var)
```
EMAIL_CONNECTION_STRING=endpoint=https://hesa-comm.unitedstates.communication.azure.com/;accesskey=<key>
EMAIL_SENDER=DoNotReply@hesa-comm.unitedstates.communication.azure.com
EMAIL_NOTIFICATION_TO=hola@linkdesign.cr
```

### Nota sobre Email Domain
Para desarrollo se usa el dominio integrado (`*.communication.azure.com`). Para produccion, se puede verificar un dominio custom (ej: `noreply@hesa.cr`) desde Azure Portal > Communication Services > Domains.

---

## CI/CD (GitHub Actions)

| Campo | Valor |
|---|---|
| Repositorio | https://github.com/linkdesigncr/hesa-web (private) |
| Rama principal | `master` |

### Frontend (Static Web Apps)

| Campo | Valor |
|---|---|
| Workflow file | `.github/workflows/azure-static-web-apps.yml` |
| Trigger | Push a `master` o PR contra `master` |
| Secret requerido | `AZURE_STATIC_WEB_APPS_API_TOKEN` |

**Pipeline:**
1. Push a `master` dispara el workflow
2. Checkout del codigo + setup Node.js 22 con cache de npm
3. `npm ci` instala dependencias
4. `npx ng build --configuration=production` genera build optimizado en `dist/hesa-web/browser/`
5. Se copia `staticwebapp.config.json` al directorio de output
6. `Azure/static-web-apps-deploy@v1` sube el contenido a Azure SWA
7. Para PRs: se crean staging environments automaticamente; al cerrar el PR se limpian

### Backend (App Service)

| Campo | Valor |
|---|---|
| Workflow file | `.github/workflows/azure-api-deploy.yml` |
| Trigger | Push a `master` que modifique archivos en `api/` |
| Secret requerido | `AZURE_API_PUBLISH_PROFILE` |

**Pipeline:**
1. Push a `master` con cambios en `api/` dispara el workflow (tambien se puede lanzar manualmente con `gh workflow run azure-api-deploy.yml`)
2. Checkout del codigo + setup Node.js 20 con cache de npm
3. `npm ci` instala TODAS las dependencias (incluyendo devDeps para TypeScript build)
4. `npm run build` compila TypeScript a `dist/`
5. Se crea un paquete de deploy limpio con `dist/`, `package.json`, `package-lock.json` y solo `node_modules` de produccion
6. `azure/webapps-deploy@v3` despliega el paquete al App Service
7. App Service ejecuta `node dist/app.js` (startup command configurado)

**IMPORTANTE:** El App Service requiere SCM basic auth habilitado para que el publish profile funcione. Si se deshabilita, el deploy fallara con "Publish profile is invalid".

### GitHub Secrets configurados

| Secret | Proposito |
|---|---|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Deploy token para SWA |
| `AZURE_API_PUBLISH_PROFILE` | Publish profile para App Service |

### Tiempo estimado de deploy
- Frontend (SWA): ~1-2 minutos
- Backend (App Service): ~2-3 minutos

### Como verificar estado del deploy
```bash
# Ver ultimos workflow runs
gh run list --limit 3

# Ver detalle de un run especifico
gh run view <run-id>

# Ver logs de un run
gh run view <run-id> --log

# Verificar que el sitio frontend responde
curl -I https://gray-field-02ba8410f.2.azurestaticapps.net

# Verificar que el API responde
curl -I https://hesa-api.azurewebsites.net
```

---

## Environment Files para Desarrollo Local

### Frontend (Angular)
Los archivos de entorno estan en `src/environments/`:
- `environment.ts` — desarrollo local (apiUrl: `http://localhost:3000/api`)
- `environment.prod.ts` — produccion (apiUrl: `https://hesa-api.azurewebsites.net/api`)

Ambos contienen: `apiUrl`, `entra` (clientId, tenantId, redirectUri, authority, scopes), `blobStorageUrl`, `blobContainerImages`, `blobContainerDocuments`.

### Backend (Node.js)
El archivo `.env` en la raiz del proyecto contiene todas las connection strings y secrets para desarrollo local. Esta en `.gitignore` y nunca se commitea.

Referencia: `.env.example` tiene la plantilla con todas las variables requeridas.

Variables clave:
| Variable | Proposito |
|---|---|
| `COSMOS_CONNECTION_STRING` | Connection string de Cosmos DB MongoDB |
| `COSMOS_DB_NAME` | Nombre de la base de datos (`hesa`) |
| `BLOB_CONNECTION_STRING` | Connection string de Storage Account |
| `BLOB_CONTAINER_IMAGES` | Nombre del container de imagenes (`images`) |
| `BLOB_CONTAINER_DOCUMENTS` | Nombre del container de documentos (`documents`) |
| `BLOB_CDN_URL` | URL base para imagenes publicas |
| `ENTRA_TENANT_ID` | Tenant ID de Azure AD |
| `ENTRA_CLIENT_ID` | Client ID de la App Registration |
| `EMAIL_CONNECTION_STRING` | Connection string de Communication Services |
| `EMAIL_SENDER` | Email remitente para notificaciones |
| `EMAIL_NOTIFICATION_TO` | Email destino para notificaciones |
| `CORS_ORIGINS` | Origenes permitidos (comma-separated) |

---

## Servicios pendientes (opcionales)

| Servicio | Cuando provisionarlo |
|---|---|
| Azure CDN | Cuando se necesite caching avanzado o custom domain para assets. Por ahora se usa Blob Storage directo |
| Custom domain para SWA | Cuando el cliente tenga el dominio hesa.cr listo |
| Custom domain para App Service | Cuando el cliente tenga el dominio api.hesa.cr listo |
| Email domain verification | Cuando se quiera enviar emails desde un dominio propio en vez de *.communication.azure.com |

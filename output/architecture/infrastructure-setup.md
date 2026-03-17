# Infrastructure Setup — HESA Web

**Fase**: 3.5 (Demo Deploy Setup)
**Ultima actualizacion**: 2026-03-17

---

## Azure Static Web Apps (Frontend)

| Campo | Valor |
|---|---|
| Nombre del recurso | `hesa-web` |
| Resource Group | `HESA-RG` |
| Location | East US 2 |
| SKU | Standard |
| URL del sitio | https://gray-field-02ba8410f.2.azurestaticapps.net |
| Subscription | CEFSA-prod (`4bdfcf40-ec56-4258-92e9-6f31b977a808`) |

### Notas
- El sitio usa `staticwebapp.config.json` en la raiz del proyecto para configurar: navigation fallback (SPA routing), headers de seguridad (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy), y MIME types
- El archivo `staticwebapp.config.json` se copia al output (`dist/hesa-web/browser/`) durante el CI/CD build

---

## CI/CD (GitHub Actions)

| Campo | Valor |
|---|---|
| Repositorio | https://github.com/linkdesigncr/hesa-web (private) |
| Rama principal | `master` |
| Workflow file | `.github/workflows/azure-static-web-apps.yml` |
| Trigger | Push a `master` o Pull Request contra `master` |
| Secret requerido | `AZURE_STATIC_WEB_APPS_API_TOKEN` (configurado en GitHub repo secrets) |

### Como funciona el pipeline
1. Push a `master` dispara el workflow
2. Checkout del codigo + setup Node.js 22 con cache de npm
3. `npm ci` instala dependencias
4. `npx ng build --configuration=production` genera build optimizado en `dist/hesa-web/browser/`
5. Se copia `staticwebapp.config.json` al directorio de output
6. `Azure/static-web-apps-deploy@v1` sube el contenido de `dist/hesa-web/browser/` a Azure SWA
7. Para PRs: se crean staging environments automaticamente; al cerrar el PR se limpian

### Tiempo estimado de deploy
- Build + deploy completo: ~1-2 minutos
- Solo deploy (skip build): ~30 segundos

### Como verificar estado del deploy
```bash
# Ver ultimo workflow run
gh run list --limit 1

# Ver detalle de un run especifico
gh run view <run-id>

# Ver logs de un run
gh run view <run-id> --log

# Verificar que el sitio responde
curl -I https://gray-field-02ba8410f.2.azurestaticapps.net
```

---

## Servicios NO provisionados (pendientes para FASE 3.5-INFRA)

Los siguientes servicios se provisionaran despues de que el cliente apruebe la demo:

- **Azure Entra ID** — App Registration para autenticacion del panel admin
- **Azure Cosmos DB** — Base de datos (API for MongoDB) para productos, marcas, etc.
- **Azure Blob Storage** — Almacenamiento de imagenes y PDFs
- **Azure App Service** — Backend Node.js/Express (API)
- **Azure Communication Services** — Email para formularios de contacto
- **Azure CDN** — Servir assets optimizados desde Blob Storage

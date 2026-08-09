---
name: hesa-frontend-on-app-service
description: "hesa-web frontend migrated from Static Web App to App Service (hesa-web.azurewebsites.net), deployed via OIDC; SWA decommissioned (Fase 5 done 2026-05-31)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 2db9377d-a62d-499f-82f9-4aa6e52b1370
---

El frontend `hesa-web` se migró de **Azure Static Web App → App Service** (2026-05-31, commit `8ce7df2`).
- Host: **https://hesa-web.azurewebsites.net** (admin en `/admin`, login MSAL verificado OK). El SWA viejo (`gray-field-02ba8410f.2.azurestaticapps.net`, RG `HESA-RG`) fue **decomisionado** (Fase 5): gray-field ahora da 404.
- App Service en plan B3 Linux `ASP-WebSite-b6c1` (RG `WebSite`). Sirve con `server.js` zero-dep que replica `staticwebapp.config.json` (CSP completo, SPA fallback 404→index 200, redirect 301 `/sitemap.xml`→hesa-api, cache immutable, gzip). `WEBSITE_RUN_FROM_PACKAGE=1`, sin `WEBSITES_PORT`.
- Deploy: workflow `azure-appservice-hesaweb.yml` por **OIDC** (SP `github-actions-hesaweb-deploy` = clientId `77e0644f-...`, Website Contributor scoped a `/sites/hesa-web`; repo vars `AZURE_CLIENT_ID/TENANT_ID/SUBSCRIPTION_ID`). Push a master dispara este workflow.
- `environment.prod.ts` redirectUri → `https://hesa-web.azurewebsites.net/admin/login`, registrado en app reg Entra `b18eec6f` (redirect URIs ahora: hesa-web x2 + localhost x2).

**Fase 5 completada (2026-05-31):** SWA borrado por ID, workflow `azure-static-web-apps.yml` + secret `AZURE_STATIC_WEB_APPS_API_TOKEN` removidos, redirect URIs de gray-field quitados de Entra. En `HESA-RG` quedan intactos `hesa-coming-soon`, `hesa-db`, `hesastorage`, `hesa-comm`. Pendiente opcional: actualizar URLs viejas en `CLAUDE.md` y `seo.service.ts` (`baseUrl`). Ver [[hesa-api-platform-cors]].

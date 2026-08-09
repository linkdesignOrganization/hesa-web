---
name: plan-migracion-hesa-web
description: Plan listo (NO ejecutado) para migrar hesa-web de Static Web App a App Service — decisiones y datos clave
metadata: 
  node_type: memory
  type: project
  originSessionId: 9a0b3a63-3a57-4b7a-a465-e4fe04084f6b
---

Plan homólogo al de UGA ([[migracion-appservice-uga]]) para migrar **`hesa-web`** (SWA Standard, RG `HESA-RG`, repo `linkdesignOrganization/hesa-web` branch **`master`**, público) a **App Service** en el plan B3 `ASP-WebSite-b6c1` (RG `WebSite`). Plan escrito 2026-05-30 en `C:\Users\Roberth Castillo\Desktop\HESA\WEB\PLAN-migracion-app-service.md`. **NO ejecutado todavía.**

**Decisiones del cliente (2026-05-30):** (1) **Solo migrar hosting** — `hesa-web` no tiene dominio custom (usa el host de Azure `gray-field-02ba8410f.2.azurestaticapps.net`; el dominio `hesa.co.cr` pertenece a otro SWA `hesa-coming-soon`, NO se toca). Nueva URL pública: `hesa-web.azurewebsites.net`. **SIN cutover de DNS.** (2) **OIDC** para deploy (repo sin secrets/vars OIDC → sin colisión).

**Particularidades vs UGA:** frontend en la RAÍZ (monorepo con `api/`), Angular 19, build `npx ng build --configuration=production` → `dist/hesa-web/browser`. `package-lock.json` SÍ sincronizado (→ `npm ci` directo, a diferencia de UGA). `staticwebapp.config.json` con **CSP completo + `responseOverrides 404→index 200` + redirect 301 `/sitemap.xml` al backend** (el server.js debe replicarlos). API absoluta `https://hesa-api.azurewebsites.net/api` (sin proxy). `main.ts` sin redirect canónico. Backend `hesa-api` ya en App Service (publish-profile, NO se toca).

**Punto delicado:** el `redirectUri` de MSAL (`src/environments/environment.prod.ts` + app reg Entra `b18eec6f-d578-4525-bcdb-9dd6f33c0527`, tenant `566e7def-…`) apunta al host viejo del SWA → hay que actualizarlo a `https://hesa-web.azurewebsites.net/admin/login` o el admin login se rompe. **Riesgo:** el plan B3 ya hospeda 13 apps (vigilar RAM). **Limpieza opcional:** `seo.service.ts` usa `baseUrl https://www.hesa.cr` (dominio inexistente — bug).

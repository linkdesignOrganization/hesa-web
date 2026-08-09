---
name: hesa-api-platform-cors
description: "hesa-api enforces CORS at the App Service platform level (az webapp cors), NOT effectively via the CORS_ORIGINS env var"
metadata: 
  node_type: memory
  type: project
  originSessionId: 2db9377d-a62d-499f-82f9-4aa6e52b1370
---

`hesa-api` (App Service, RG `WebSite`) rechaza orígenes desconocidos en el preflight con `400 The origin '<x>' is not allowed.`. Ese 400 lo emite el **CORS a nivel de plataforma de App Service** (`az webapp cors show/add`), que intercepta en la capa frontend (ARR) ANTES del código Express. El app setting `CORS_ORIGINS` que lee el código (cors npm) NO levanta ese bloqueo, y reiniciar el app NO ayuda.

**Why:** perdí tiempo asumiendo que bastaba con la variable `CORS_ORIGINS` (Riesgo 2 del plan de migración) — el mecanismo real es el CORS de plataforma.

**How to apply:** para permitir un origin nuevo en hesa-api: `az webapp cors add -n hesa-api -g WebSite --allowed-origins "<origin>"` (aditivo, propaga en ~30-60s, sin redeploy). Verificar con `curl -X OPTIONS -H "Origin: <x>" -H "Access-Control-Request-Method: GET"` esperando 200 + ACAO. Lista actual: localhost:4200, gray-field SWA, hesa-web.azurewebsites.net. Relevante si algún día se añade el dominio `hesa.co.cr`. Ver [[hesa-frontend-on-app-service]].

---
name: Azure CLI disponible
description: El usuario tiene Azure CLI instalado y autenticado contra la suscripción de HESA — utilizarlo para diagnóstico y validación, no solo el portal web
type: project
originSessionId: fc2ffa73-1406-41c1-a70f-a59603e66bbf
---
El entorno del usuario tiene `az` CLI disponible y autenticado contra los recursos de HESA (Cosmos DB `hesa`, Static Web App `gray-field-02ba8410f`, App Service `hesa-api`, Storage `hesastorage`, Entra ID).

**Why:** Permite verificar el estado real de Azure sin depender del Portal web (más rápido en terminal, scripteable, queryable con JMESPath).

**How to apply:**
- Para validar despliegues: `az staticwebapp list --output table`, `az webapp list --output table`.
- Para inspeccionar Blob Storage tras subir imágenes: `az storage blob list --account-name hesastorage --container-name images --prefix products/`.
- Para revisar logs del backend: `az webapp log tail --name hesa-api --resource-group <rg>`.
- Para queries a Cosmos DB MongoDB: usar la connection string del `.env` con `mongosh` (no `az` directo para datos, pero sí `az cosmosdb show` para meta).
- Antes de proponer "abrir el portal de Azure" como solución, considerar si un comando `az` resuelve el caso más rápido.

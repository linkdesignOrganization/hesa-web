---
name: deploy-workflow-selective-commits
description: Subir a producción en HESA = commit selectivo + push a master (auto-deploy); el working tree suele tener WIP concurrente del usuario
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 09df5125-7da0-4a76-a5d1-2600ae940b9b
---

En HESA, "subir a producción" significa commit + push a `master`, que dispara auto-deploy por GitHub Actions (workflow frontend en paths `src/**`+`public/**`; backend en `api/**`). El usuario pide subir un feature a la vez ("solo esto que hiciste"; "sube todo lo que hemos hecho" = solo MI trabajo pendiente, no su WIP).

**Why:** El usuario trabaja en el MISMO working tree en paralelo: commitea y edita archivos mientras yo trabajo. El working tree casi siempre mezcla mis cambios + su WIP sin commitear (ej. taxonomías en `categories`/`product-form`, que mantuvo sin commitear una sesión entera mientras sí commiteaba lo demás) + untracked (`tmp-*.png`, `LOGOS/`, etc.). Un `git add -A` subiría su WIP a medias a producción.

**How to apply:** SIEMPRE commit selectivo (`git add <archivos del feature>`), nunca `git add -A`/`commit -am`. Antes de commitear: `git diff` de los archivos compartidos (`app.ts`, `app.routes.ts`, `api.service.ts`, `admin-layout`) para confirmar que solo tienen MIS cambios, y `git diff --cached --name-only` con guard para que no se cuele WIP ajeno. Validar `npx ng build --configuration=production` (frontend) y `npm run build` (backend tsc) antes del push — capturar el exit real de tsc, no el de un pipe a `tail`. Tras push, monitorear con `gh run watch <id> --exit-status`. No tocar `api/dist/` (gitignored; lo recompila el CI). Tras deploy verde, App Service tarda ~30-60s en reiniciar antes de servir; un endpoint puede devolver HTML de error transitorio. Ver [[project_hesa_architecture]].

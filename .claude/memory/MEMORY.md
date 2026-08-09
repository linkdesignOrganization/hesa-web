# Memory Index

- [feedback_regression_mandatory.md](feedback_regression_mandatory.md) — Regresión automatizada obligatoria en TODA ronda QA, incluyendo Fase 4
- [feedback_no_partial_results.md](feedback_no_partial_results.md) — PASA parcial no es aceptable, solo PASA/FALLA/N-A
- [feedback_panel_no_placeholders.md](feedback_panel_no_placeholders.md) — Panel admin vacío al finalizar, solo conservar Categorías y Filtros
- [azure_cli_available.md](azure_cli_available.md) — Azure CLI (`az`) está instalado y autenticado: usarlo para diagnóstico antes de sugerir el portal
- [hesa_frontend_app_service.md](hesa_frontend_app_service.md) — hesa-web migrado de SWA → App Service (hesa-web.azurewebsites.net), deploy por OIDC; SWA decomisionado (Fase 5 hecha 2026-05-31)
- [hesa_api_platform_cors.md](hesa_api_platform_cors.md) — CORS de hesa-api es a nivel de plataforma App Service (`az webapp cors`), no por la env `CORS_ORIGINS`
- [Acceso admin (Entra B2B)](admin-access-entra-b2b.md) — cómo se otorga acceso a /admin; no hay allowlist en código, se invita Guest en Entra ID
- [Correos admin HESA](hesa-admin-emails.md) — cuentas con acceso al panel admin y su estado
- [feedback_backdrop_filter.md](feedback_backdrop_filter.md) - CSS animations with opacity/transform break backdrop-filter on child elements
- [feedback_deploy_workflow.md](feedback_deploy_workflow.md) - Subir a prod = commit selectivo + push a master; cuidado con el WIP concurrente del usuario en el working tree
- [feedback_icons.md](feedback_icons.md) - Only use Google Material Symbols or Bootstrap Icons — no inline SVGs or other icon libraries
- [project_hesa_architecture.md](project_hesa_architecture.md) - Complete HESA project architecture: Angular 19 + Express monorepo on Azure with Cosmos DB, Blob Storage, and Entra ID auth

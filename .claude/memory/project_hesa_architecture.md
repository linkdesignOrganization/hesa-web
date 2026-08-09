---
name: hesa-project-architecture
description: Complete architecture overview of HESA (Herrera y Elizondo S.A.) - Angular 19 frontend + Node.js/Express backend deployed on Azure
metadata: 
  node_type: memory
  type: project
  originSessionId: 09df5125-7da0-4a76-a5d1-2600ae940b9b
---

HESA is a corporate website + admin panel for Herrera y Elizondo S.A., a veterinary pharmaceutical distribution company in Costa Rica.

**Why:** This is a production system for a real company (37+ years in business). The project is managed by linkdesignOrganization (Link Design agency).

**How to apply:** All changes must consider bilingual (ES/EN) support, Azure deployment constraints, and the monorepo structure.

## Repository
- Monorepo: `linkdesignorganization/hesa-web` (GitHub)
- Local path: `/Users/roberthcastillo/Desktop/HESA/WEB`
- Frontend: Angular 19 at root
- Backend: Node.js/Express at `/api`
- Branch: `master`

## Azure Infrastructure (HESA-RG, East US 2)
| Service | Resource | Details |
|---------|----------|---------|
| App Service (frontend) | hesa-web | Linux Node 22, servidor estático zero-dep `server.js`, hesa-web.azurewebsites.net. MIGRADO desde Static Web Apps el 2026-05-31 (SWA decomisionado) |
| App Service | hesa-api | Linux, B1 Basic plan, hesa-api.azurewebsites.net |
| Cosmos DB | hesa-db | MongoDB API, Session consistency |
| Blob Storage | hesastorage | Standard_RAGRS, Hot tier, containers: images, documents |
| Communication Services | hesa-comm | US region, email notifications |
| Entra ID App | HESA Admin Panel | Tenant: 566e7def-c2ee-49b7-91e5-b045805f416a |

## Database Collections (Cosmos DB - hesa)
products, brands, categories, messages, team_members, home_config, site_config, page_contents, activity_logs

## Key URLs
- Frontend: https://hesa-web.azurewebsites.net (App Service; antes SWA gray-field-02ba8410f, ya decomisionado)
- API: https://hesa-api.azurewebsites.net/api
- Storage: https://hesastorage.blob.core.windows.net
- Target domain: https://www.hesa.cr

## Tech Stack
- Frontend: Angular 19.2, Bootstrap 5, MSAL for auth, Playwright 989+ e2e tests
- Backend: Express, Mongoose, Sharp (image processing), Azure SDKs
- Auth: Azure Entra ID (SSO via Microsoft)
- CI/CD: GitHub Actions → Azure (auto-deploy on push to master)

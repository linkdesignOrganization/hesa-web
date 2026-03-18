# Project Tracker
> **PM = Orquestador puro. NUNCA tocar codigo, builds, tests ni reportes tecnicos.**
> **NUNCA diferir criterios. NUNCA preguntar al cliente si desea diferir. Ciclo de bugs = automatico hasta 0 fallos.**
> **ANTES de cada ronda QA 2+: ejecutar `npx playwright test e2e/tests/` — es BLOQUEANTE, no lanzar QA sin regresion.**
> Codigo/bugs → Developer | Testing → QA | Deploy → DevOps | Requirements → BA | Arquitectura → Architect | Visual Research → Design Researcher | UI/UX → Design Orchestrator

## Estado Actual
**FASE 5 — Iteracion 1: Fundacion Backend + Catalogo Funcional** (en progreso)

## Design Briefs
- Detectados: `input/design-briefs/HESA_Brief_Agentes.md` (sitio publico) + `HESA_Brief_Panel_Administracion.md` (panel admin)
- FASE 3.0 completada con design briefs como fuente de diseno

## Checklist de Fases

### FASE 1 — Descubrimiento
- [x] Business Analyst genera requirements.md (295 criterios, 27 gaps)

### FASE 2 — Filtrado de Preguntas
- [x] BA clasifica gaps (14 negocio, 13 tecnicos)
- [x] PM relaya preguntas al cliente
- [x] BA incorpora respuestas (371 criterios, 0 gaps)
- [x] Gate: 0 gaps abiertos ✓

### FASE 3.0 — Investigacion Visual
- [x] 3.0a: Preparar briefs y URLs (12 URLs identificadas)
- [x] 3.0b: Site-capturers secuencial (12/12 completadas, 113 PNGs)
- [x] 3.0c: Verificacion final (113 PNGs, 11 capture-notes)
- [x] 3.0d: Brief Analyst (brief-criteria.md, 41 BVC-xxx)
- [x] 3.0e: Design Researcher (visual-analysis.md, 784 lineas)
- [x] 3.0f: Verificar resultado ✓

### FASE 3 — Planificacion
- [x] 3a: Architect genera architecture.md (45 DEMO, 4 iteraciones)
- [x] 3b-plan: Design Orchestrator genera plan (3 sub-designers, 34 componentes)
- [x] 3b-sub: Sub-designers en paralelo (tokens 1079L, ux-flows 2190L, components 1991L)
- [x] 3b-consolidate: DO consolida design-criteria.md (149 DC-xxx + 40 BVC-xxx)
- [x] 3c: Architect 2da invocacion → ux-criteria.md (117 UX-xxx)
- [x] 3d: Plan-verifier APROBADO + cliente APROBADO ✓

### FASE 3.5 — Setup de Deploy para Demo
- [x] DevOps: git init + Azure SWA + CI/CD (URL: gray-field-02ba8410f.2.azurestaticapps.net)

### FASE 4 — Construccion Visual
- [x] 4a: UI Developer — cascara visual
- [x] 4a-verify: Verificacion post-UI Developer (PASA, 14 gaps corregidos en R2)
- [x] 4b: Developer — funcionalidad de demo
- [x] 4b-verify: Verificacion post-Developer (PASA, 18 gaps corregidos en R2)
- [x] 4c: Simplify (9 mejoras aplicadas)
- [x] 4d: Security Review (auth guard, input sanitization, CSP, 0 vulns)
- [x] 4e: Pre-QA Deploy (sitio desplegado, HTTP 200)
- [x] 4e-regress: Skip (no hay tests previos, primera ronda)
- [x] 4f-plan: QA Orchestrator genera plan (317 criterios)
- [x] 4f-sub: Sub-testers en paralelo (33 specs, 3 resultados)
- [x] 4f-consolidate: QA consolida qa-report.md (R1: 13 bugs, 101 bloqueados)
- [x] 4f: QA completado (4 rondas, 317/317 criterios, 0 bloqueados, LISTO_PARA_DEMO)
- [x] 4f-verify: Verificacion post-QA (PASA, 317/317 definitivos: 263 PASA + 54 N/A, 0 parciales, 291 specs)
- [x] 4g: Demo para el cliente
- [x] 4h: Feedback del cliente (panel sin placeholders al final, solo categorias/filtros)
- [x] 4i: Recopilar feedback
- [x] 4j: Distribucion y mantenimiento de feedback (521 entradas, 9 memorias)
- [x] 4k: Commit de fase visual

### FASE 3.5-INFRA — Setup de Infraestructura Cloud
- [x] DevOps: Entra ID + Cosmos DB + App Service + Blob Storage + Comms + CI/CD backend

### FASE 5 — Iteracion 1: Fundacion Backend + Catalogo Funcional
- [x] 5a: Developer implementa (API + MSAL + frontend conectado)
- [x] 5a-verify: Verificacion post-Developer (PASA, 45 gaps corregidos en R2)
- [x] 5b: Simplify (N+1 queries, dedup uploads, extracted helpers)
- [x] 5c: Security Review (NoSQL injection, XSS, rate limiting, file validation, 0 vulns)
- [x] 5d: Pre-QA Deploy (desplegado)
- [x] 5d-regress: Regresion automatizada (259 passed, 0 failed, 12.9m)
- [ ] 5e-plan: QA genera plan
- [ ] 5e-sub: Sub-testers en paralelo
- [ ] 5e-consolidate: QA consolida
- [ ] 5e-verify: Verificacion post-QA
- [ ] 5f: Demo para el cliente
- [ ] 5g: Feedback del cliente
- [ ] 5h: Recopilar feedback
- [ ] 5i: Distribucion y mantenimiento de feedback
- [ ] 5j: Commit de iteracion

### FASE 5 — Iteracion 2: Home Administrable + Contenido Estatico + Equipo
- [ ] 5a: Developer implementa
- [ ] 5a-verify: Verificacion post-Developer
- [ ] 5b: Simplify
- [ ] 5c: Security Review
- [ ] 5d: Pre-QA Deploy
- [ ] 5d-regress: Regresion automatizada pre-QA
- [ ] 5e-plan: QA genera plan
- [ ] 5e-sub: Sub-testers en paralelo
- [ ] 5e-consolidate: QA consolida
- [ ] 5e-verify: Verificacion post-QA
- [ ] 5f: Demo para el cliente
- [ ] 5g: Feedback del cliente
- [ ] 5h: Recopilar feedback
- [ ] 5i: Distribucion y mantenimiento de feedback
- [ ] 5j: Commit de iteracion

### FASE 5 — Iteracion 3: Formularios + Mensajes + Configuracion + Dashboard
- [ ] 5a: Developer implementa
- [ ] 5a-verify: Verificacion post-Developer
- [ ] 5b: Simplify
- [ ] 5c: Security Review
- [ ] 5d: Pre-QA Deploy
- [ ] 5d-regress: Regresion automatizada pre-QA
- [ ] 5e-plan: QA genera plan
- [ ] 5e-sub: Sub-testers en paralelo
- [ ] 5e-consolidate: QA consolida
- [ ] 5e-verify: Verificacion post-QA
- [ ] 5f: Demo para el cliente
- [ ] 5g: Feedback del cliente
- [ ] 5h: Recopilar feedback
- [ ] 5i: Distribucion y mantenimiento de feedback
- [ ] 5j: Commit de iteracion

### FASE 5 — Iteracion 4: Performance, Accesibilidad y Pulido Final
- [ ] 5a: Developer implementa
- [ ] 5a-verify: Verificacion post-Developer
- [ ] 5b: Simplify
- [ ] 5c: Security Review
- [ ] 5d: Pre-QA Deploy
- [ ] 5d-regress: Regresion automatizada pre-QA
- [ ] 5e-plan: QA genera plan
- [ ] 5e-sub: Sub-testers en paralelo
- [ ] 5e-consolidate: QA consolida
- [ ] 5e-verify: Verificacion post-QA
- [ ] 5f: Demo para el cliente
- [ ] 5g: Feedback del cliente
- [ ] 5h: Recopilar feedback
- [ ] 5i: Distribucion y mantenimiento de feedback
- [ ] 5j: Commit de iteracion

### FASE 6 — Deployment
- [ ] 6a: Deploy a produccion
- [ ] 6a-verify: Auditoria de cambios de deployment
- [ ] 6b-plan: QA genera plan de regresion produccion
- [ ] 6b-sub: Sub-testers regresion produccion
- [ ] 6b-consolidate: QA consolida resultados produccion
- [ ] 6c: Resolucion de fallos
- [ ] 6d: Cierre

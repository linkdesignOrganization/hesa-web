# Project Tracker
> **PM = Orquestador puro. NUNCA tocar codigo, builds, tests ni reportes tecnicos.**
> **NUNCA diferir criterios. NUNCA preguntar al cliente si desea diferir. Ciclo de bugs = automatico hasta 0 fallos.**
> **ANTES de cada ronda QA 2+: ejecutar `npx playwright test e2e/tests/` — es BLOQUEANTE, no lanzar QA sin regresion.**
> Codigo/bugs → Developer | Testing → QA | Deploy → DevOps | Requirements → BA | Arquitectura → Architect | Visual Research → Design Researcher | UI/UX → Design Orchestrator

## Estado Actual
**FASE 3.5 — Setup de Deploy para Demo** (en progreso)

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
- [ ] DevOps: git init + Azure SWA + CI/CD

### FASE 4 — Construccion Visual
- [ ] 4a: UI Developer — cascara visual
- [ ] 4a-verify: Verificacion post-UI Developer
- [ ] 4b: Developer — funcionalidad de demo
- [ ] 4b-verify: Verificacion post-Developer
- [ ] 4c: Simplify
- [ ] 4d: Security Review
- [ ] 4e: Pre-QA Deploy
- [ ] 4e-regress: Regresion automatizada pre-QA
- [ ] 4f-plan: QA Orchestrator genera plan
- [ ] 4f-sub: Sub-testers en paralelo
- [ ] 4f-consolidate: QA consolida qa-report.md
- [ ] 4f-verify: Verificacion post-QA
- [ ] 4g: Demo para el cliente
- [ ] 4h: Feedback del cliente
- [ ] 4i: Recopilar feedback
- [ ] 4j: Distribucion y mantenimiento de feedback
- [ ] 4k: Commit de fase visual

### FASE 3.5-INFRA — Setup de Infraestructura Cloud
- [ ] DevOps: Entra ID + Cosmos DB + App Service + env config

### FASE 5 — Iteracion 1: Fundacion Backend + Catalogo Funcional
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

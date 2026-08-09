---
name: Regresión obligatoria en TODA ronda QA
description: Ejecutar npx playwright test e2e/tests/ como paso BLOQUEANTE antes de cada ronda QA, incluyendo Fase 4 (construcción visual). No saltar aunque sea la primera ronda de tests generados.
type: feedback
---

Ejecutar regresión automatizada (`npx playwright test e2e/tests/`) como paso BLOQUEANTE antes de CADA ronda de QA, sin excepciones.

**Why:** El cliente corrigió que la regresión debe ejecutarse incluso en la Fase 4 (construcción visual), no solo en Fase 5. El PM saltó las regresiones en R1→R4 argumentando "primera ronda de tests" y "no hay tests previos", pero los tests se generan en R1 y deben ejecutarse como regresión en R2+.

**How to apply:** Después de cada deploy (paso B del checklist), SIEMPRE ejecutar `npx playwright test e2e/tests/` antes de lanzar sub-testers. Si falla, Developer corrige → re-deploy → re-regresión hasta 0 fallos. No hay excepción ni skip.

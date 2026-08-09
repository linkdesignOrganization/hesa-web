---
name: No aceptar criterios con resultado parcial
description: PASA parcial no es aceptable. Todo criterio debe ser PASA completo, FALLA (se corrige), o N/A (con justificación). No existe estado intermedio.
type: feedback
---

Los criterios con resultado "PASA parcial" NO son aceptables. Todo criterio debe tener un resultado definitivo: PASA, FALLA, o N/A.

**Why:** El cliente indicó explícitamente que resultados parciales no son aceptables. Un criterio parcial significa que algo no se verificó completamente, lo cual es equivalente a no haberlo verificado.

**How to apply:** En QA consolidación, si un sub-tester reporta "PASA parcial", el QA debe clasificarlo como FALLA y asignarlo para corrección + re-test. No avanzar a demo con criterios parciales. Al consolidar, los únicos estados válidos son: PASA, FALLA, N/A (justificado).

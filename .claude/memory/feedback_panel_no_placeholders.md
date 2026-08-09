---
name: Panel admin sin datos placeholder al finalizar
description: Al terminar el proyecto, el panel de administración debe estar vacío excepto Categorías y Filtros. Sin productos, marcas, mensajes, equipo ni contenido placeholder.
type: feedback
---

Al finalizar el proyecto, el panel de administración NO debe tener datos placeholder. Solo conservar Categorías y Filtros (especies, familias farmacéuticas, etapas de vida, tipos de equipo). Todo lo demás vacío: 0 productos, 0 marcas, 0 mensajes, 0 equipo de liderazgo, contenido estático vacío.

**Why:** El cliente quiere que el panel esté limpio para que ellos carguen la información real. Los placeholders solo existen durante el demo.

**How to apply:** En el paso de deployment (Fase 6) o al final de la última iteración, limpiar mock data del panel dejando solo categorías/filtros. Los empty states de cada sección deben estar bien diseñados porque serán lo primero que el cliente vea.

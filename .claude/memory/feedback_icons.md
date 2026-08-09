---
name: Icon library preference
description: Only use Google Material Symbols or Bootstrap Icons — no inline SVGs or other icon libraries
type: feedback
---

Use ONLY Google Material Symbols (already loaded via CDN in index.html) for icons. If a needed icon doesn't exist there, use Bootstrap Icons as second option. Never use custom inline SVGs, Lucide, Feather, Heroicons, or any other icon source.

**Why:** User wants consistent icon style across the project. Material Symbols are already loaded for the admin panel so they're available everywhere.

**How to apply:** When adding any icon to any component (public or shared), use `<span class="material-symbols-outlined">icon_name</span>` instead of inline `<svg>`. For Bootstrap Icons fallback, load via CDN if not already present.

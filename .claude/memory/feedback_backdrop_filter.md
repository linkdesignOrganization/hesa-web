---
name: backdrop-filter breaks with animations
description: CSS animations with opacity/transform create stacking contexts that block backdrop-filter blur
type: feedback
---

Never apply CSS animations (opacity, transform, top) on parent elements of children that use backdrop-filter. The animation creates a stacking context that prevents the blur from seeing through to the background.

**Why:** Discovered when hero slide-in animation (opacity:0 → 1 + top:30px → 0) completely broke the frosted-white glass effect on child elements (stats card, tag pills, badges).

**How to apply:** If an element or its children need backdrop-filter, do NOT animate that element with opacity, transform, or top/left. Use a different approach for entrance animations (e.g., animate a wrapper that doesn't contain glass elements, or skip the animation).

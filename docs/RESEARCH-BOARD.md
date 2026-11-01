# RESEARCH BOARD & VISUAL ART DIRECTION
**Project:** Small Living 2026  
**Document ID:** RES-001-VISUAL  
**Date:** 2026-11-01  
**Status:** APPROVED

---

## 1. Real-World E-Commerce & Interior Spatial References

| Reference | Domain / URL | Observed Real Pattern | Key Limitation / Anti-Pattern to Avoid | Decision (Adopt / Adapt / Reject) |
|---|---|---|---|---|
| **IKEA** | `https://www.ikea.com/` | **Shop-the-Room hotspots & spatial storytelling:** Contextual photography with pinpoint markers linking directly to item SKUs; dimension filters; modular combinations. | Heavy corporate branding; complex mega-site footprint; overwhelming generic product menus. | **ADAPT:** Adopt hotspot interactive pins, room breakdown stories, and dimension-led browsing; reject corporate clutter. |
| **MUJI** | `https://www.muji.com/` | **Material restraint & compact living clarity:** Neutral tones, warm paper/timber textures, strict grid alignment, compact product organizers organized by shelf depth and drawer height. | Can feel stark or austere; sparse interaction feedback; lack of interactive spatial simulation. | **ADAPT:** Adopt Japandi neutral palette (Warm Stone, Oat, Muted Sage, Walnut), clean typography, and space-saving organization taxonomies. |
| **Yamazaki Home** | `https://theyamazakihome.com/` | **Problem-first discovery & lifestyle photography:** Products categorized by spatial problems ("No-Drill", "Under-Bed", "Narrow Kitchen", "Magnetic Organizers"); clear dimension overlays (H x W x D). | Limited dynamic cart bundles; static product pages without fit validation. | **ADAPT:** Adopt problem-led navigation ("Không khoan tường", "Phòng trọ hẹp", "Tận dụng góc chết") and prominent dimensional badges. |
| **Baymard Institute** | `https://baymard.com/` | **E-Commerce UX benchmarks:** Sticky add-to-cart on mobile, clear facet chips with instant removal, explicit empty & error states, 44px touch targets, zero ambiguous icons. | Abstract guidelines without visual aesthetics. | **ADOPT:** Follow all Baymard UX best practices for catalog filtering, PDP hierarchy, cart transparency, and checkout form ergonomics. |
| **IKEA Kreativ / Room Planners** | `https://www.ikea.com/global/en/home-design/` | **Dual 2D Plan & 3D Spatial Visualizer:** Top-down grid for dimensional placement with collision boundaries + WebGL 3D perspective with orbit camera. | High barrier to entry on mobile; heavy WebGL assets causing crash on low-end hardware. | **ADAPT:** Implement clean 2D Canvas planner with millimeter snap/collision + client-only lazy 3D WebGL viewer with guaranteed 2D fallback. |

---

## 2. Selected Art Direction: Warm Contemporary Functional Living (Japandi)

Small Living rejects the generic "AI Bento / Dark Purple Gradient / SaaS Neon Glow" aesthetic. The design language evokes tactile living materials, calm Japanese-Scandinavian ergonomics, and precision architectural measurement.

### 2.1. Color Palette Tokens

```css
:root {
  /* Warm Foundations */
  --color-stone-50:  #FAF8F5; /* Warm Rice / Page Background */
  --color-stone-100: #F3EFEA; /* Oat Muted Surface */
  --color-stone-200: #E7E0D6; /* Border Subtle */
  --color-stone-300: #D3C7B7; /* Border Strong / Grid Lines */
  --color-stone-600: #786C5E; /* Text Muted */
  --color-stone-900: #29241E; /* Deep Charcoal / Primary Text */

  /* Japandi Accents */
  --color-walnut:    #5A4033; /* Deep Walnut Wood Accent */
  --color-sage:      #5B7065; /* Muted Botanical Sage */
  --color-sage-light:#EBF0ED; /* Sage Badge Background */
  --color-terracotta:#B85D43; /* Warm Terracotta / Sale & Focus */
  --color-terracotta-light: #F9EBE7;

  /* Semantic Feedback */
  --color-success:   #2E6F40; /* Forest Green */
  --color-warning:   #B87A1E; /* Warm Amber */
  --color-error:     #A83232; /* Brick Red */
}
```

### 2.2. Spatial Measurement & Typography Rules

1. **Vietnamese First-Class Typography:** Inter or Plus Jakarta Sans paired with clean serif editorial accents (e.g. Playfair or Fraunces) for room story titles.
2. **Dimension Badges:** Always displayed in standardized millimeters (`mm`) with optional centimeter/meter conversion readouts (e.g. `800 × 350 × 1400 mm`).
3. **No-Drill Indicator:** High-visibility badge (`Không cần khoan tường`) with magnetic/tension icon to immediately reassure renters.
4. **Fit Status Badges:**
   - `VỪA VẶN HOÀN TOÀN` (Forest Green)
   - `CẦN CHÚ Ý KHOẢNG TRỐNG` (Amber)
   - `KHÔNG ĐỦ DIỆN TÍCH` (Brick Red)
   - `CHƯA ĐỦ THÔNG SỐ PHÒNG` (Muted Stone)


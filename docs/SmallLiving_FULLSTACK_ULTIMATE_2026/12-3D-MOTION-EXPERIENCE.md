# 12 — PURPOSEFUL 3D + MOTION: IMPLEMENTATION REQUIREMENTS

## Real 3D, not decorative gimmick
Use 3D only where spatial information matters: mini room planner, selected product 3D model view, maybe room discovery preview. Other pages remain polished 2D editorial retail. Do not fill all sections with WebGL canvases, rotating logos, parallax backgrounds or immersive game-style navigation.

## Rendering architecture
Preferred on React19: `three` + `@react-three/fiber@9` + `@react-three/drei` (verify installed stable/peers). Client-only Canvas with dynamic imports where appropriate; no Canvas/WebGL in server rendering. One shared canonical scene data model for 2D and 3D; unit mm↔meters explicit and tested. Use instancing or primitive geometry for repetitive objects, GLB models for hero products only; ensure geometry model scales match declared product footprint. Canvas lifecycle cleanup, dispose textures and geometry, avoid memory leaks.

## Functional minimum for 3D planner
- Room boundaries/walls/floor generated from user dimensions; show grid and measuring aids with selected units.
- Camera orbit, pan, zoom, reset view and top-down switch. Keyboard/accessible buttons for non-pointer actions.
- Select product from DB demo catalog; add to room; move/rotate 90 degrees (or axis handles); constrain within bounds and detect collisions based on footprint.
- Highlight selected item, read dimension and type, list conflicting objects; reposition via numeric form for precise entry; save scene and load it after login/reload.
- Switch 2D↔3D with persisted IDs/coords/rotations and consistent fit result. Test with two products and changes to room size.
- Light/texture tasteful and physically plausible, not photoreal promise. All downloaded 3D models sourced/licensed; do not portray a generic model as an exact branded product.

## 3D performance & resilience
- Lazy load 3D only when user opens preview/planner; static product catalog never imports full Three bundle.
- Set sensible DPR cap and antialias policy, compressed GLB/texture budgets, preview loading skeleton, adaptive quality, visibility pause; monitor frame timings and memory on mid-tier device.
- If no WebGL/slow device/motion preference: still deliver **fully working 2D planner** and accessible measurements/controls. Canvas is enhancement, not gatekeeper.
- Prevent canvas content from blocking scrolling/touch gestures on mobile unless deliberately entering planner interaction mode; provide exit and reset.

## Motion interaction taxonomy
1. `Navigation`: sticky header size change minimal; mega menu/drawer 150–250ms and predictable focus management.
2. `Product discovery`: hover swap of real product images where available; image gallery crossfade and shared-element effect where supported; no fade-up on every grid card.
3. `State transitions`: cart add feedback, updated quantity, filter results, compare panel, dialogs/accordion, toast/success; durations ~150–300ms subject to purpose.
4. `3D`: orbit controls and smooth camera transitions **triggered by user**, not permanent idle rotation; prefers-reduced-motion disables fancy camera flyovers.
5. `Loading`: skeleton approximates final layout without fake waits, no unavoidable splash screen.

Use CSS for simple hover/transitions; Motion for layout/gesture presence; React Bits only if one precisely suitable effect, inspected source and license. No conflicting Framer Motion+GSAP+Motion stack by default. Respect `prefers-reduced-motion`, accessibility and input latency. Test mobile and browser screenshots/video short evidence where supported.

## Actual acceptance
Product 3D preview can open/close without crashing server/hydration. Planner 3D supports place, select, rotate, move, collision feedback, save/reload. Turn off WebGL -> 2D workflow still usable. DevTools network shows Three chunk is not loaded on unrelated pages. No console errors/leaks across repeated openings.

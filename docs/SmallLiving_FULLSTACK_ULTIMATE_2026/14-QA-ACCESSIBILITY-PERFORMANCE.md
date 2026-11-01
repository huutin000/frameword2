# 14 — QA AUTOMATION, VISUAL QUALITY, ACCESSIBILITY, SECURITY & PERFORMANCE

## Quality gates after every vertical slice
- `lint`, `typecheck`, `test`, `build`, Playwright relevant suite; report exit code, executed test count and environment.
- Verify actual browser interactions and database changes; GET 200 or passing build alone is insufficient.
- Screenshot major User/Admin pages in desktop 1440, tablet 768, mobile 390/375/320; check console, hydration, overflow, image load, focus, keyboard and touchscreen.
- Supabase local test migrations/schema/seed, RLS allow/deny matrix; if no local stack (memory/docker), use isolated sandbox and explain limits.

## Test pyramid
**Unit:** `SpaceFit`, dimension transforms, price/discount calculation, valid order state transitions, variant rules, 2D placement, collision logic, product filtering, cart state, asset fallback.
**Integration:** product CRUD/query, admin publication cache invalidation, stock changes, order transaction + idempotency, promo limits, RLS policies, saved room ownership and scene serialization.
**E2E Playwright:** User home/category/filter→PDP→cart→demo checkout→order; Admin login→publish/edit→public reflect; Admin process order→User timeline; no admin access for user; login/logout; Room Profile→Fit→Bundle; Planner place→save→reload→2D↔3D; fallback without WebGL.

## Accessibility
Use semantic HTML, labels for inputs, proper roles in complex controls, skip link and focus management, keyboard traps for dialogs, `aria-live` for toasts/fit warnings, no drag-only essential function, touch-friendly controls, visible focus, text contrast, reduced motion, form feedback. Use axe/Playwright accessibility scanning where feasible, with manual keyboard checks.

## Performance
Test at least fast desktop and throttled mobile; target metrics as guidance (not fabricated measured results): LCP <=2.5s, CLS <=0.1, INP <=200ms on representative real-like environment; report actual tool methodology and limitations. Don't artificially gate UI on large 3D; `next/image`, chunk splits, lazy-load Canvas, size texture downloads. Measure JS bundle, 3D chunk weight, model poly count and memory in report; avoid assuming performance from code style.

## Visual QA workflow
Before/after screenshots for every major page. Check hierarchy, typography, image fidelity, product density, responsive breakpoints, filter interaction, readable tables, 3D z-index/controls, empty/load/error, error modals. Iterate until screenshot review clear; don't claim design quality solely from lint.

## Security
No production keys or sensitive console logs. Use negative tests for RLS/auth; input validation on server, price and stock verified server-side, idempotency, upload MIME/size allowlist, no insecure external scripts/components. Inspect packages/sources and report high-impact CVEs accurately. Logs must not leak personal info or tokens.

## QA report fields
`feature | test id | command | environment | evidence path | result PASS/FAIL/BLOCKED/NOT RUN | issue | fix/owner`. `DONE` only when code+functional+visual evidence exists. Unimplemented high-scope features remain clearly PARTIAL/NOT STARTED even if a static screen exists.

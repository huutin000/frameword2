# 34 — DELIVERY GOVERNANCE, SCOPE, OWNERSHIP & RISK CONTROLS

## Change boundaries

User grants broad ability to rebuild project **code** but not authority to destroy data or incur costs. Agent must act without interrupting for every safe file edit, but stop before any high-risk action:

**Allowed autonomously**: read repo, audit, create new branch/worktree when possible, add new source in isolated folder, design/refactor code, test locally, run lint/typecheck/build, download public documented free assets under license review, add project-local deps with verified licenses (if no cost), write docs, create local migrations and seeds not applied remotely, screenshots and browser tests.

**Requires approval**: deleting/overwriting old source or uncommitted edits, force-push, deploy, production env/remote DB changes, resetting database including linked/staging if destructive, purchase/subscription, login to third-party paid API, changes to global claude-kit / Antigravity config/permissions, email/SMS or live financial transactions, public share/private data exports.

## Work breakdown, not output spam

- Maintain one `docs/IMPLEMENTATION-ROADMAP.md` with dependencies, risks and acceptance. Each milestone should deliver a vertical slice in usable state.
- Reuse existing agents: architect for design & dependencies, implementer for code, security for threat model, QA/Playwright for verification, reviewer for final challenge. Don't create 10 new agents or global skills.
- Build module-first, no uncontrolled dependency sprawl: at most one main UI kit, one animation engine, one DB/auth system, one E2E framework.
- Track debt as evidence-backed decisions; no premature microservices/multi-tenant subscription/payment infrastructure.

## Completion communication

At each milestone, output a short evidence report:

| Field | Required content |
|---|---|
| Scope | User stories and acceptance IDs touched |
| Implemented | paths, key changes, data schema changes |
| Quality | command, exit code, test counts, screenshots/traces |
| Security | relevant negative tests, RLS checks |
| Performance | metrics measured and test conditions |
| Known issues | severity, reproduction, owner/follow-up |
| Rollback | commit/checkpoint, restore command, DB safety |
| Next | prioritized milestone according to dependency graph |

No "100% complete" with P0/P1/P2/P3 incomplete. No simulated E2E proof (screenshot is visual evidence, not business state). No work scheduled in background outside actual agent tools. If access to a source/MCP unavailable, mark not available and use supported local alternative.

## Demo and ethics

Website clearly states demonstration, fake money and no goods shipped. Use synthetic users/addresses and licensed images/models. No AI-generated photos; logo vector may be created originally by design code. If a real-world manufacturer asset has unclear license, do not download/commit; use honest neutral illustrations. No fake purchase incentives, fabricated product safety claims, testimonials or statistics.

## Requirements precedence when decisions conflict

1. data/secrets/users safe
2. real functional correctness and authZ
3. testable acceptance criteria
4. updated stable-version official docs
5. maintainable architecture and speed
6. visual polish and creative motion
7. optional extras (gimmicks)

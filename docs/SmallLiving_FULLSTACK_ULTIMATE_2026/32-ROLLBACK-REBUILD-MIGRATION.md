# 32 — SAFE REBUILD FROM LEGACY CODE WITHOUT DESTROYING USER WORK

## Before touching code

- `pwd`, `git rev-parse --show-toplevel`, `git status --short`, `git branch --show-current`; confirm Windows Git Bash path and CWD. Note multiple prior `git status` failures due to wrong directory.
- Inspect staged/unstaged/untracked files, `package.json`, lockfile and environment, supabase connection targets (without exposing tokens). Build/run/tests baseline; record all failures.
- If uncommitted changes exist, avoid overriding. Suggest a local backup or worktree/branch; do not stash/drop without explicit permission.
- Inventory routes, components, reusable data models, tests, assets with license; identify secrets/PII and protect them.

## Evaluate options, write decision

| Option | Benefits | Risks | Choose when |
|---|---|---|---|
| Incremental migration | preserves functionality | legacy CSS/version coupling | core logic healthy and tests sufficient |
| Parallel `frontend-v2` or new `apps/web` | isolated clean architecture, simpler rollback | integration/migration costs | Next14/Bootstrap/data domain substantially outdated |
| New branch/worktree | changes traceable, easy diff | branch can still override files if careless | Git safe and credentials/setup known |

Create `docs/REBUILD-DECISION.md` (current state evidence, chosen option, rejected options, migration plan, route compatibility map, DB plan, rollback, risks).

## New architecture default: modular monolith

```text
repo/
├─ app or src/app/                     # Next.js route groups (storefront), (auth), admin, API
├─ features/                            # catalog, search, checkout, orders, accounts, space-planner...
├─ components/ui/                       # shadcn primitives + a few shared brand components
├─ lib/                                 # supabase client/server, authZ, constants, commerce, utils
├─ db/ or supabase/                     # migrations/seeds/local config
├─ public/assets/                       # licensed images, models, brand icons
├─ tests/                               # unit, integration, e2e, fixtures
├─ docs/                                # architecture, demo guide, decision records, asset license
└─ .agents/ (optional project-scoped)   # specific agent skills/MCP only if allowed
```

Don't create empty layers. Put components near feature; no god files. Root/special layouts obey Next16. Avoid file duplication through barrel chains. No shared singleton server state between requests. No uncontrolled Next route changes.

## Database migration safety

- Prefer new isolated local Supabase. If legacy Supabase project exists, do not drop/alter it; script schema export in read-only mode first.
- Demo DB names separate, app env vars per workspace, protect service keys. Do not run migrations on remote without explicit approval.
- Migrate only appropriate old data (probably electronics products should be replaced by licensed Small Living fixtures); don't drag over old images/logo/account records.

## Checkpoint strategy

Create a milestone checkpoint with Git commit/diff or backup after lint/build/tests. Each step has dependency list, quick rollback, outcomes. No `git clean -fd`, `git reset --hard`, `git push --force`, `rm -rf old_project` or linked DB reset. Use explicit approval for destructive actions.

## Cutover checklist

- New app routes and all critical flows pass, old routes either redirect with documented behavior or intentionally replaced as portfolio demo.
- No retained CellphoneS marks, leaks of legacy secrets, hidden old import aliases or ignored JS scripts.
- Source of truth DB seeded; no stale mock order dashboard; new favicon/metadata.
- README quick start and scripts, customer+admin demo flows, rollback steps. Only then recommend archiving old code in a reversible way; never delete silently.

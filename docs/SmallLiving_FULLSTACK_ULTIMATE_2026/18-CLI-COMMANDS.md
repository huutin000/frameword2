# 18 — CLI QUICK REFERENCE (WINDOWS 11 / GIT BASH)

> For the most up-to-date Skills/MCP guidance, **prefer `29-SKILLS-MCP-INSTALL-CHECKLIST.md`**. These commands are examples for the **Agent to evaluate and execute in appropriate sequence**, not one massive install script. Do not copy whole block and run blindly. All installs require internet and may change files. Preserve current repo and lockfile; never run remote DB commands in production.

## 0. Confirm location & baseline
```bash
pwd
git rev-parse --show-toplevel
git status --short
node -v
npm -v
npm ls --depth=0
npm outdated
npm audit --omit=dev
```
If git status fails, fix CWD/worktree first. Avoid printing `.env` values or committing secrets. `npm outdated` and `npm audit` can have nonzero exit status for findings.

## 1. Inspect current stable versions (do not confuse with canary)
```bash
npm view next version
npm view react version
npm view react-dom version
npm view tailwindcss version
npm view @supabase/supabase-js version
npm view @supabase/ssr version
npm view @react-three/fiber version
npm view @react-three/fiber peerDependencies --json
npm view @react-three/drei version
npm view motion version
```
Then pin/test versions and lockfile. Check Next16 Node >=20.9, React19 and R3F9 pairing. Do not use prerelease tags by default.

## 2. New app route (only in isolated folder/branch, not over existing frontend)
```bash
# Example scaffold, run in a safe parent folder:
npx create-next-app@latest frontend-v2 --typescript --eslint --tailwind --app --src-dir
cd frontend-v2
npx shadcn@latest init
# Only chosen UI primitives:
npx shadcn@latest add button dialog sheet tabs skeleton tooltip
npm install @supabase/supabase-js @supabase/ssr zod motion lucide-react
# Add 3D only when its milestone starts:
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```
Check `npx create-next-app` actual output: don't nest `frontend-v2` twice, don't duplicate packages built in scaffold. Next16 new app may already have many dependencies; `npm ls` before every install. TypeScript and Tailwind chosen per approved architecture decision.

## 3. Agent skills + MCP tools
```bash
npx skills add https://github.com/anthropics/skills --skill frontend-design
npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines
# Optional if not already available:
npx skills add shadcn/ui
npx @21st-dev/cli install-skill
npx motion-ai
# Optional global 21st CLI, requires account login:
npm i -g @21st-dev/cli
21st login
21st search "product gallery"
# For shadcn MCP in supported client (Claude Code example):
npx shadcn@latest mcp init --client claude
```
**Antigravity differs from Claude**: add MCP server via IDE settings; project `.mcp.json` example in `03-SKILLS-MCP-SETUP.md`. Next DevTools MCP server command: `npx -y next-devtools-mcp@latest`. 21st MCP hosted URL `https://21st.dev/api/mcp` needs secure auth. Do not commit keys.

## 4. Tests and local database
```bash
# Test tool choice after checking existing dependencies:
npm init playwright@latest
npx playwright --version
npx playwright test
# For Supabase CLI if local Docker stack is feasible:
npm install --save-dev supabase
npx supabase init
npx supabase start
# DESTRUCTIVE TO LOCAL DATABASE - run only with approval for local reset:
# npx supabase db reset
# RLS tests after Supabase initialized:
npx supabase test db
```
Do NOT run `supabase db reset --linked` or `supabase db push` on remote without explicit scoped approval. Docker local Supabase can need ~7GB RAM; plan resource usage on 16GB machine.

## 5. Standard new app checks
```bash
npx eslint .
npx tsc --noEmit
npm run build
npm test
npx playwright test
```
Adjust scripts to project. **Never use `next lint` with Next 16.** Record actual exit code/log output for every gate. CI should run lint/typecheck/test/build independently.

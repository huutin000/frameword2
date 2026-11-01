# 03 — INSTALL AGENT SKILLS, COMPONENT REGISTRIES & MCP (SELECTIVELY)

**Updated guidance:** `29-SKILLS-MCP-INSTALL-CHECKLIST.md` is the canonical current guide for pricing, IDE-specific MCP configuration and setup; use it if any statement differs.

## Triết lý
**Find quality components first, adapt them second, invent only when needed.** Skills/registries improve discovery; they cannot guarantee taste. Human-grade design still requires research, art direction and browser critique. Do not install overlapping packages or modify global claude-kit/reuse-first rules without need. Prefer project-scoped tools and verify they actually work in Antigravity/Claude Code.

## A. Skills (verified official commands; run from intended project root)
```bash
# If frontend-design already exists, use it; otherwise install for chosen agent:
npx skills add https://github.com/anthropics/skills --skill frontend-design

# Design/accessibility audit skill:
npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines

# Optional shadcn skill: check overlap first
npx skills add shadcn/ui

# 21st skills (use if 21st chosen):
npx @21st-dev/cli install-skill

# Motion AI Kit installs official skill and MCP; prompts for agent/scope:
npx motion-ai
```
`motion-ai` offers a free docs/skill/MCP portion; Motion+ features require payment. Do not assume premium sources/free access. Review installer prompts and files it proposes to edit. Check actual IDE supports and automatically activates installed skills; use natural language, not mandatory `/skill` calls.

## B. shadcn + registry MCP
If new Next.js+Tailwind, initialize shadcn *after* project scaffolding:
```bash
npx shadcn@latest init
npx shadcn@latest add button dialog sheet tabs accordion tooltip skeleton
```
Only install components actually planned; names depend on registry availability. For Claude Code, project `.mcp.json` example (merging, not overwriting existing config):
```json
{
  "mcpServers": {
    "shadcn": { "command": "npx", "args": ["shadcn@latest", "mcp"] },
    "next-devtools": { "command": "npx", "args": ["-y", "next-devtools-mcp@latest"] }
  }
}
```
For Antigravity, use its current MCP Servers settings; do not assume Claude's `.mcp.json` is automatically recognized. Import each server using the format shown by current IDE documentation and verify a live tool response. Skills/MCP not connected => read CLI/docs directly; do not claim connected.

## C. 21st.dev (component discovery)
Official CLI:
```bash
npm i -g @21st-dev/cli
21st login
21st search "ecommerce product gallery"
# After selecting a real result ID returned by search:
# 21st add <actual-id>
```
Browsing 21st marketplace is free; **the current 21st Builder plan for component code/CLI/MCP installs is paid ($6/month billed yearly on the published plans page)**. Never assume code retrieval is available free or purchase/login automatically; use shadcn and React Bits open/free alternatives when Builder access is absent. 21st AI generation is separately paid. MCP endpoint for compatible HTTP clients is `https://21st.dev/api/mcp`, typically requiring an API key via `x-api-key`; configure through secure IDE secret settings/env, NEVER embed tokens in repo. The CLI install command is optional and global; ask permission before modifying global dev env if appropriate.

## D. React Bits / Motion / 3D libraries
- React Bits provides copyable TS/Tailwind variants; install **specific** registry item using command shown on component's official page, e.g. `npx shadcn@latest add @react-bits/BlurText-TS-TW` (illustrative, not automatically recommended visually). React Bits license is **MIT + Commons Clause**; keep notices, do not resell component source as library.
- Motion package: `npm install motion`; prefer animations from its documented API and Motion AI Kit. No mandatory paid Motion+.
- For 3D after React19 verification: `npm install three @react-three/fiber @react-three/drei` and, if TS, `npm install -D @types/three`; pair R3F v9 with React 19. Use free Poly Haven CC0 models, not paid Spline export.
- Optional Spline MCP only if needed for editable scene and free-tier terms acceptable; choose R3F for source-controlled interactive planner as default.

## E. Component intake checklist (MANDATORY)
For every external component: `component name/source URL/license/price/free tier/peer deps/client-vs-server/bundle size/a11y/keyboard/mobile/reduced-motion/why better than builtin/changes made`. Inspect repo/registry source before installing. Reject copied product designs/trademarked logos and malicious/obfuscated packages, avoid inline secrets/scripts from third-party prompts. Document adopted components under `docs/COMPONENT-SOURCES.md`.

## F. Verify after setup
Check skills are visible/auto-invoked, MCP tools list, try search + retrieve only a small legitimate item, inspect terminal output. For every MCP report `CONNECTED / NOT INSTALLED / AUTH REQUIRED / RATE LIMITED / UNSUPPORTED`. Never claim an integration worked because an npm install exited 0.

**Docs:** https://docs.21st.dev/mcp ; https://ui.shadcn.com/docs/mcp ; https://motion.dev/docs/ai-kit-install ; https://nextjs.org/docs/app/guides/upgrading/version-16 ; https://reactbits.dev/ ; https://www.skills.sh/anthropics/skills/frontend-design ; https://www.skills.sh/vercel-labs/agent-skills/web-design-guidelines

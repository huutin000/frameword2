# 23 — SECURITY THREAT MODEL & NEGATIVE TESTING (OWASP ASVS)

Use OWASP ASVS 5.0.0 where applicable. Portfolio ≠ permission to ignore security; all accounts and money are demo but authorization, session, data integrity and server boundaries must be real.

## Threat surfaces and mitigations

| Surface | Attack / bug | Required guard & negative test |
|---|---|---|
| Auth/session | forged/expired cookie, login redirect abuse | SSR correct cookie refresh, safe redirect allowlist, session revalidation on server |
| Authorization | customer reaches `/admin` API by handcrafted request | server role check + RLS rejection, test direct API/RPC |
| IDOR | user A accesses B address/order/scene/export | owner predicates at DB and server, negative tests |
| Role escalation | client sets `role=admin`/edits `user_roles` | deny client mutation, privileged transition only trusted server |
| Prices | client sends lower SKU price/discount | reselect authoritative server price; tamper test |
| Stock | parallel checkout oversells | DB atomicity/locking, concurrency test |
| Replay | double-submit order/payment/refund | idempotency scope/unique key; same key result once |
| Promotion abuse | code re-use after max usage/expiry | atomic redemption count, scoped eligibility, negative cases |
| Injection | search, filter, SQL and XSS via rich text | typed validation, parameterized queries, sanitize/escape previews |
| CSRF | privileged mutation from foreign origin | server action origin/session protection; avoid unsafe GET mutations |
| SSRF | malicious image URL/media import | allowlisted domains and no raw server fetch of user-provided arbitrary URL |
| Upload | SVG/script/polyglot, oversize image or 3D zip | allowlist MIME+magic bytes, max size/pixels, storage policies, safe serving |
| Tokens | service role key in browser/console/source map | env separation, server-only import, secret scan, tests |
| Spam | search/login/review/support abuse | rate limits or throttling where warranted; human-friendly UX |
| Mass assignment | mutation sets order owner/status/total | explicit server-defined allowed fields |
| Open redirect | `next` query query injection | internal-only redirect allowlist |
| Privacy | reports expose synthetic account contacts | use minimum data, filtered CSV, auth and log retention |
| 3D assets | GLTF link or huge mesh hangs client | license manifest, size cap, scene budget, safe parse and lazy load |

## Authentication and permission contract

- AuthN, session, authZ are separate; neither protected UI route nor RLS alone suffices for all paths.
- Use tested Supabase auth SSR patterns; cache-private data safely (`no-store` where necessary); never cache user's private data across requests.
- Passwords not stored in app tables; restrict role changes to authorized admin server mutation with audit; user can't pass owner ID freely.
- No hardcoded shared admin password in public deployment. Local demo users may be provisioned by documented script; credentials not committed in deployable code.
- All security-critical APIs use Zod/schema validation or equivalent plus expected server type rules. Error messages shouldn't leak SQL or secrets.

## Verification cases to automate

1. Anonymous cannot query private tables, hidden product drafts, admin endpoint or private object store.
2. Customer A cannot read/edit B's order, saved room, address, ticket, review moderation or receipt.
3. Staff cannot change roles, catalog prices if unauthorized or create promotion beyond scope.
4. Client changing `price`, `total`, `stock`, `coupon_max_usage`, `role`, `owner` has no effect or receives rejection.
5. Cross-request stores/sessions remain isolated; no state leak during SSR.
6. Two identical orders in parallel yield one; two stock-consuming orders never reduce stock below zero.
7. Upload rejects file extension/MIME mismatch and oversize, does not execute scripts.
8. Broken/malicious URL redirects stay internal; XSS payload renders inert in review/support/admin preview.
9. Expired cookies/session on private admin page returns login/error, not cached content.
10. Test rate limiting/throttle without intentionally DoS external infrastructure; only local/test environment.
11. Security headers and CSP applied compatibly with Next.js images/3D; check actual browser console.
12. Demo reset route cannot be reached from public frontend or production.

## Process

Threat modeling at design; validate npm audit advisories by affected version and actual app usage. Treat scanner warnings as hypotheses until triaged. No live pen-testing against third-party sites, no secrets logged, no production data movement. Produce `docs/SECURITY-REPORT.md` with finding, evidence, impact, status, fix, retest. ASVS documentation: https://asvs.owasp.org/ .

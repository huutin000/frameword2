# 01 — REPOSITORY FORENSIC AUDIT & REBUILD DECISION

## A. Khám phá code thật
Xác minh repo root, branch, `git status --short`, tracked/untracked files, trạng thái migrations, `package.json`, lockfile, Node/npm, scripts, Next App Router root layouts, Supabase SSR client, Redux store, data fetching, auth, RLS, file assets và test reports. Nếu lệnh Git fail: kiểm tra CWD, worktree/rename path, không tự `git init` hoặc reset repo. Chụp baseline và liệt kê user changes có sẵn.

Chạy **chỉ các lệnh đọc/kiểm tra** trước: `git rev-parse --show-toplevel`, `git status --short`, `node -v`, `npm -v`, `npm ls --depth=0`, `npm outdated`, `npm audit --omit=dev` (exit!=0 không tự nghĩa là tool crash), lint/test/build hiện hữu nếu khả thi. Đọc nội dung và usage trước khi xóa file cũ.

## B. Architecture & security baseline
- Auth routes/callbacks, server vs client modules, route collisions, `server.js` script entrypoint, Redux/localStorage SSR, duplicate forms, API/data dependency graph.
- Supabase project mode: local/hosted, schema, migrations, RLS, grants, storage policies, keys. Không truy cập remote tài khoản hoặc nhận dữ liệu nhạy cảm nếu không cần.
- Tests existing: coverage *thực tế* chứ không dựa số tests; truy cập `/`, `/cart`, `/admin` HTTP 200 không thay thế browser flows.
- Perf: bundle size, external scripts/CSS, fonts, image sizes, file count, dependency overlap, known CVEs.
- UX: các trang cần bảo toàn, các thành phần cũ không đáng giữ, danh sách routes cũ cần alias/redirect.

## C. Decision matrix
Đánh giá 3 phương án từ repo thực: 1) incremental refactor; 2) hybrid migration (giữ server/schema, viết lại frontend); 3) parallel clean rebuild. Chấm theo security risk, ability to preserve value, scope changes, cost, maintainability, rollback, testability, workload. **Không mặc định rewrite** chỉ vì được phép.

Nếu chọn rebuild: `frontend-v2/` hoặc worktree/branch cách ly; chỉ chuyển các module được audit; tạo dữ liệu DB seed mới; không xóa `frontend/` cũ; giữ `/admin` và routes quan trọng qua routing plan; hậu kiểm trước cutover. Nếu chọn in-place migration: chia commits/batches, test trước mỗi boundary, giữ import alias và redirects có giới hạn.

## D. Deliverables
`reports/AUDIT.md` bảng `Finding | File:line | Confirmed/Potential/Unverified | Severity | Fix`; `reports/REBUILD-DECISION.md`; `reports/MIGRATION-MAP.md` mô tả `old→new` cho routes/models/assets; baseline log `lint/test/build/E2E`; permission inventory. Chỉ yêu cầu phê duyệt khi một bước irreversible, data destructive, remote DB, publish/deploy/push hoặc breaking auth/public contracts.

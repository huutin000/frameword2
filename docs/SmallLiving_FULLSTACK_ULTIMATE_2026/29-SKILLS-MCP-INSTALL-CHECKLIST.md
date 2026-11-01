# 29 — ANTIGRAVITY / CLAUDE CODE: VERIFIED SKILLS, MCP, COMPONENT REGISTRIES

> Các lệnh là tài liệu hướng dẫn để **Agent kiểm tra rồi chạy theo nhu cầu** trên Git Bash tại dự án. Không phải script cài đặt hàng loạt. Kiểm tra `npx`, Node, Git, network, policy tổ chức, current skills/plugins và giấy phép. Chỉ sử dụng bản free / open source; tài khoản hay API token phải do người dùng chủ động cấp. Source links ở cuối.

## 0. Inventory First — không cài trùng

1. Đọc project `.agents/skills/`, `.agents/mcp_config.json`, `.claude/skills/`, `.mcp.json`, `components.json`, `package.json` và config global chỉ ở chế độ read-only.
2. Kiểm tra Claude Code có `claude-kit`, `reuse-first`, `frontend-design` hay MCP tương đương chưa. Kiểm tra Antigravity MCP Store. Không chép tất cả skill từ Claude sang Antigravity nếu chúng trùng chức năng.
3. Chỉ chọn: **frontend-design**, **web-design-guidelines**, **shadcn registry/MCP**, **một giải pháp search components (21st)**, **Motion AI Kit khi cần**, **Next DevTools MCP sau khi Next16 chạy**. Có thể chọn 3D tool khi triển khai planner. Không bật 15 MCP cùng lúc gây tool bloat.
4. Không tải/cài remote skill bằng cách chạy script chưa đọc. Review `SKILL.md`, nguồn repo, scripts/permissions, quyền ghi file và data egress. Không cấp quyền gọi shell toàn phần cho MCP không tin cậy.

## 1. Agent Skills — chọn theo nhu cầu

```bash
# frontend-design: nguồn chính thức
npx skills add https://github.com/anthropics/skills --skill frontend-design

# Web accessibility / layout review; không trùng nhiệm vụ sáng tạo art direction
npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines

# shadcn/ui design/component registry instructions
npx skills add shadcn/ui

# 21st.dev skills: tìm / đánh giá / tích hợp component có source
npx @21st-dev/cli install-skill

# Motion official free AI Kit: chỉ khi chọn Motion
npx motion-ai
```

**Ghi chú:** Các lệnh trên có thể hỏi chọn scope/agent. Chọn project-local và `antigravity` hoặc `claude-code` khi CLI hỗ trợ; agent kiểm tra `--help` thay vì đoán flags. Với kỹ năng chỉ cần cho Antigravity, ví dụ cú pháp nguồn Google có `--agent=antigravity`:

```bash
npx skills add google/skills --skill retrieving-developer-knowledge --agent=antigravity
```

Không bắt buộc dùng Google Developer Knowledge MCP/skill nếu Next.js/Supabase docs web đã đủ.

## 2. shadcn UI + MCP

Trên bản rebuild Next16/Tailwind4, sau khi tạo app và xác minh `package.json`:

```bash
npx shadcn@latest init
npx shadcn@latest info
npx shadcn@latest add button dialog sheet drawer tabs select table skeleton sonner
```

Không cần add tất cả component trên nếu không dùng. Thêm MCP bằng ứng dụng IDE MCP Store hoặc project config:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@latest", "mcp"]
    }
  }
}
```

Với Claude Code: ví dụ trên đặt `.mcp.json` ở project root theo docs shadcn. Với Antigravity IDE: vào Agent panel → `...` → `MCP Servers` → `Manage MCP Servers` → `View raw config`, ưu tiên project `.agents/mcp_config.json` nếu ứng dụng đang dùng scope đó; sau khi thêm thì **restart/reload** và kiểm tra tool connected. Không ghi đè các servers cũ, phải merge JSON. `npx shadcn@latest mcp init` có thể sinh config cho supported editor, không giả định nó hỗ trợ Antigravity trực tiếp nếu không thấy trong menu.

## 3. Next.js DevTools MCP

Chỉ sau khi app Next16+ chạy:

```json
{
  "mcpServers": {
    "next-devtools": {
      "command": "npx",
      "args": ["-y", "next-devtools-mcp@latest"]
    }
  }
}
```

**Merge** config với `shadcn`; không thay toàn bộ file. Chạy `npm run dev` rồi hỏi Agent liệt kê routes, runtime errors, build errors và page metadata từ MCP. Nếu không connected, ghi `BLOCKED/NOT CONNECTED`, dùng logs/browser thay thế; không tuyên bố MCP đã hoạt động.

## 4. 21st.dev — thư viện component để REUSE

Official CLI:

```bash
npm i -g @21st-dev/cli
21st login
21st search "ecommerce product gallery"
# Chỉ install sau khi đánh giá code/license:
# 21st add owner/component-name
```

Hoặc dùng `npx @21st-dev/cli install-skill`. **Login chỉ do người dùng chủ động thao tác**, tránh đưa token/API key vào prompt, files hoặc logs. Theo trang plans hiện tại, **browsing 21st miễn phí nhưng Builder component retrieval / CLI / MCP installs có thể cần gói trả phí ($6/tháng khi thanh toán năm)**; 21st AI là gói riêng có phí. Nếu chưa có quyền truy cập trả phí, chỉ dùng để tham khảo và chuyển sang shadcn/ui, React Bits free hoặc thư viện OSS khác. Không tự mua/gia hạn. Không cài cùng component trùng với shadcn nếu shadcn đã đủ tốt.

## 5. Motion + React Bits

```bash
# Motion free AI Kit: chọn project/agent khi installer hỏi
npx motion-ai
```

Free Motion AI Kit hỗ trợ tra documentation/examples; `Motion+` là có phí, **không cài `--plus`**. Dùng CSS transitions cho hành vi đơn giản, Motion khi cần layout transitions, tabs, image transitions. Với React Bits: **sử dụng phần free/open-source đã xác minh** từ https://reactbits.dev/; không cài React Bits Pro/Agent Kit trả phí; không dùng animation gallery chỉ vì đẹp.

## 6. 3D toolchain (chỉ khi milestone planner)

```bash
# Trên React 19 và R3F stable tương thích
npm install three @react-three/fiber@^9 @react-three/drei
npm install -D @types/three
```

Agent phải kiểm tra peer deps stable và Next dynamic import. R3F v10 alpha (nếu vẫn alpha) không dùng mặc định. Với asset, ưu tiên Poly Haven CC0; `3D viewer` không cần Spline MCP nếu đang có R3F.

## 7. Supabase / tests / basic commands

```bash
npm install -D supabase
npx supabase init
# Docker Desktop phải chạy, đây là local stack khá nặng
npx supabase start

npm init playwright@latest
npx playwright install chromium

# Kiểm tra project thực tế trước khi chạy các lệnh dưới
npm run lint
npm run typecheck
npm test
npm run build
```

Không chạy `npx supabase db reset --linked` (xóa dữ liệu remote). Chỉ local database reset sau khi xác minh endpoint và scope. Tùy RAM 16GB, có thể dùng một project Supabase sandbox riêng nếu Docker nặng, nhưng remote destructive migration phải xin phép.

## 8. Workflow UI Component-First cho Agent

**For each screen:** (A) tìm 3 UI patterns thực tế → (B) search shadcn / 21st (nếu available) → (C) review source/license/deps/keyboard/a11y → (D) chọn 1 base tốt nhất hoặc CSS native → (E) integrate with app tokens/product schema → (F) customize visual direction, responsive/mobile → (G) E2E interactions + screenshot → (H) a11y/perf check. Không copy nguyên design/logo/trademark/paid component và không gọi `generate` 21st AI nếu trả phí.

### Đề xuất mapping

- Header/nav: shadcn NavigationMenu + custom category UX.
- Filters/Sort mobile: Sheet/Drawer + accessible Checkbox/Select.
- Product gallery: component source từ registry, tùy chỉnh product photos thật.
- Cart/Checkout: shadcn form primitives, server actions/business logic tự triển khai.
- Admin: TanStack Table khi có bảng phức tạp, shadcn Dialog/Form/Alert/Toast/Chart.
- Motion: CSS/Motion cho product transitions và interactive tabs; React Bits free cho một số reveal có kiểm chứng.
- 3D: R3F + Drei, dữ liệu geometry từ app DB; không dùng 3D background vô nghĩa.

## Sources verified 01/11/2026

- https://www.skills.sh/anthropics/skills/frontend-design
- https://github.com/vercel-labs/agent-skills
- https://ui.shadcn.com/docs/mcp
- https://ui.shadcn.com/docs/new
- https://docs.21st.dev/mcp
- https://21st.dev/pricing
- https://motion.dev/docs/ai-kit-install
- https://nextjs.org/docs/app/guides/mcp
- https://antigravity.google/docs/ide-mcp
- https://antigravity.google/docs/customization-discovery
- https://r3f.docs.pmnd.rs/getting-started/introduction
- https://supabase.com/docs/guides/local-development
- https://playwright.dev/docs/intro

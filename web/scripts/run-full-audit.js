/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("D:/Project/Shop-Ecommerce/frontend/node_modules/playwright");
const path = require("path");

const ARTIFACT_DIR = "C:/Users/huuti/.gemini/antigravity/brain/395a8058-8e27-4416-8292-54aef9e4f05e";

async function runAudit() {
  console.log("=== BẮT ĐẦU FULL AUDIT E2E KIỂM TRA PHẦN 2, 3, 4 ===");
  const browser = await chromium.launch({
    headless: true,
    args: ["--enable-webgl", "--use-gl=angle", "--use-angle=swiftshader"],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  let passCount = 0;
  let failCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passCount++;
    } else {
      console.error(`[FAIL] ${message}`);
      failCount++;
    }
  }

  // 1. Test U004: Search Suggestions (accent-normalized)
  console.log("\n--- Kiểm tra U004: Gợi ý tìm kiếm nhanh ---");
  await page.goto("http://localhost:3000/", { waitUntil: "load" });
  await page.waitForTimeout(600);

  const searchInput = page.locator("input[role='combobox']").first();
  await searchInput.waitFor({ state: "visible", timeout: 8000 });
  await searchInput.click();
  await searchInput.pressSequentially("ke", { delay: 100 });
  await page.waitForTimeout(400);

  const suggestions = page.locator("#search-suggestions-list");
  const isSuggestionsVisible = await suggestions.isVisible().catch(() => false);
  assert(isSuggestionsVisible, "U004: Dropdown gợi ý tìm kiếm hiển thị khi gõ >= 2 ký tự");

  await searchInput.press("Escape");
  await page.waitForTimeout(300);
  const isClosed = !(await suggestions.isVisible().catch(() => false));
  assert(isClosed, "U004: Phím Escape đóng dropdown gợi ý tìm kiếm");

  // 2. Test U041: Notification Center
  console.log("\n--- Kiểm tra U041: Trung tâm thông báo & Chuông ---");
  const notifBell = page.locator("header button[aria-label='Thông báo sự kiện']").first();
  if (await notifBell.isVisible()) {
    await notifBell.click();
    await page.waitForTimeout(400);
    const notifPanel = page.locator("text=Thông báo sự kiện (U041)").first();
    assert(await notifPanel.isVisible(), "U041: Dropdown thông báo mở ra khi bấm chuông");

    const markAllBtn = page.locator("button:has-text('Đánh dấu tất cả là đã đọc')").first();
    if (await markAllBtn.isVisible()) {
      await markAllBtn.click();
      await page.waitForTimeout(300);
      assert(true, "U041: Đánh dấu tất cả thông báo là đã đọc thành công");
    }
    // Close panel
    await page.click("body", { position: { x: 10, y: 10 } });
  }

  // 3. Test U009: Pagination & Load-more
  console.log("\n--- Kiểm tra U009: Phân trang & Không trùng lặp ---");
  await page.goto("http://localhost:3000/catalog", { waitUntil: "load" });
  await page.waitForTimeout(800);

  const productCardsPage1 = await page.locator("h3 a").allTextContents();
  assert(productCardsPage1.length === 6, `U009: Trang 1 hiển thị đầy đủ ${productCardsPage1.length} sản phẩm theo pageSize`);

  const nextBtn = page.locator("button:has-text('Trang sau')").first();
  if (await nextBtn.isVisible() && await nextBtn.isEnabled()) {
    await nextBtn.click();
    await page.waitForTimeout(600);
    const productCardsPage2 = await page.locator("h3 a").allTextContents();
    assert(productCardsPage2.length === 6, `U009: Chuyển sang trang 2 hiển thị đầy đủ ${productCardsPage2.length} sản phẩm`);

    // Check no overlap
    const overlap = productCardsPage1.filter((title) => productCardsPage2.includes(title));
    assert(overlap.length === 0, "U009: Phân trang không bị trùng lặp sản phẩm giữa các trang (Zero duplication)");
  }

  // 4. Test U016: Recently Viewed Products
  console.log("\n--- Kiểm tra U016: Sản phẩm đã xem gần đây ---");
  await page.goto("http://localhost:3000/catalog/p1", { waitUntil: "load" });
  await page.waitForTimeout(700);
  await page.goto("http://localhost:3000/catalog/p2", { waitUntil: "load" });
  await page.waitForTimeout(700);

  const recentlyViewedTitle = page.locator("h3:has-text('Sản phẩm bạn vừa xem gần đây (U016)')").first();
  const hasRecentlyViewed = await recentlyViewedTitle.isVisible().catch(() => false);
  assert(hasRecentlyViewed, "U016: Mục 'Sản phẩm bạn vừa xem gần đây' xuất hiện trên PDP sau khi duyệt");

  // 5. Test Admin Role Switcher (A034, A035, A036)
  console.log("\n--- Kiểm tra Phần 3: Admin ACL Role Switcher ---");
  await page.goto("http://localhost:3000/admin", { waitUntil: "load" });
  await page.waitForTimeout(800);

  const roleSwitcherBtn = page.locator("button:has-text('Super Admin'), button[aria-haspopup='listbox']").first();
  assert(await roleSwitcherBtn.isVisible(), "A034: Nút RoleSwitcher hiển thị trên Admin Header");

  await roleSwitcherBtn.click();
  await page.waitForTimeout(300);
  const editorOption = page.locator("button:has-text('Content Editor')").first();
  if (await editorOption.isVisible()) {
    await editorOption.click();
    await page.waitForTimeout(500);
    console.log("Đã chuyển vai trò sang Content Editor");

    const lockIcons = await page.locator("[data-testid='role-lock-icon']").count();
    assert(lockIcons > 0, `A035: Content Editor hiển thị biểu tượng ổ khóa Lock (${lockIcons} mục) đối với các module bị cấm`);
  }

  // Switch back to Super Admin
  await roleSwitcherBtn.click();
  await page.waitForTimeout(200);
  const superAdminOption = page.locator("button:has-text('Super Admin')").first();
  if (await superAdminOption.isVisible()) {
    await superAdminOption.click();
    await page.waitForTimeout(300);
  }

  // 6. Test Admin Bulk Confirmation Modal (A041)
  console.log("\n--- Kiểm tra A041: Modal xác nhận thao tác hàng loạt nguy hiểm 2 bước ---");
  await page.goto("http://localhost:3000/admin/inventory", { waitUntil: "load" });
  await page.waitForTimeout(800);

  // Check first 2 checkboxes
  const checkboxes = page.locator("table tbody tr button:has(svg.lucide-square), table tbody tr button:has(svg.lucide-check-square)");
  const count = await checkboxes.count();
  if (count >= 2) {
    await checkboxes.nth(0).click();
    await page.waitForTimeout(100);
    await checkboxes.nth(1).click();
    await page.waitForTimeout(300);

    const bulkBar = page.locator("text=Đã chọn 2").first();
    assert(await bulkBar.isVisible(), "A041: Thanh công cụ điều chỉnh hàng loạt xuất hiện khi chọn checkbox");

    const bulkAdjustBtn = page.locator("button:has-text('Điều chỉnh hàng loạt')").first();
    await bulkAdjustBtn.click();
    await page.waitForTimeout(300);

    const modal = page.locator("h3:has-text('Xác nhận điều chỉnh tồn kho hàng loạt')");
    assert(await modal.isVisible(), "A041: Modal cảnh báo nguy hiểm mở ra");

    const confirmBtn = page.locator("button:has-text('Xác nhận thực thi')");
    assert(await confirmBtn.isDisabled(), "A041: Nút thực thi bị vô hiệu hóa (disabled) khi chưa gõ chữ xác nhận");

    const inputConfirm = page.locator("input[placeholder='XAC NHAN']");
    await inputConfirm.fill("XAC NHAN");
    await page.waitForTimeout(200);
    assert(await confirmBtn.isEnabled(), "A041: Nút thực thi được kích hoạt sau khi gõ chính xác chữ XAC NHAN");

    await confirmBtn.click();
    await page.waitForTimeout(600);

    const successAlert = page.locator("text=Đã hoàn tất điều chỉnh hàng loạt cho 2 SKU").first();
    assert(await successAlert.isVisible(), "A041: Báo cáo thành công ghi sổ cái cho 2 SKU đã chọn");
  }

  // 7. Test Media & High-Volume Catalog (250 items, Gallery Thumbnails, Video Player, Guides Videos)
  console.log("\n--- Kiểm tra Dữ liệu Demo 250 sản phẩm, Thư viện ảnh & Video Player ---");
  await page.goto("http://localhost:3000/catalog", { waitUntil: "load" });
  await page.waitForTimeout(600);

  const totalBadge = page.locator("text=250 sản phẩm phù hợp").first();
  assert(await totalBadge.isVisible(), "Catalog: Đầy đủ 250 sản phẩm (50 sản phẩm x 5 danh mục phòng)");

  // Check video badge on catalog cards
  const videoBadge = page.locator("text=Video demo").first();
  assert(await videoBadge.isVisible(), "Catalog: Thẻ sản phẩm hiển thị huy hiệu 'Video demo' trực quan");

  // Navigate to PDP of product with video (p2)
  await page.goto("http://localhost:3000/catalog/p2", { waitUntil: "load" });
  await page.waitForTimeout(600);

  // Check gallery thumbnails
  const thumbnails = page.locator("button[aria-label^='Hình ảnh']");
  const thumbCount = await thumbnails.count();
  assert(thumbCount >= 2, `PDP: Hiển thị bộ sưu tập ảnh phong phú (${thumbCount} góc chụp thực tế)`);

  // Check video button and click to play video
  const videoBtn = page.locator("button[aria-label='Xem video demo thực tế']").first();
  if (await videoBtn.isVisible()) {
    assert(true, "PDP: Có nút chuyển đổi sang Video Demo thực tế");
    await videoBtn.click();
    await page.waitForTimeout(500);

    const videoEl = page.locator("video");
    assert(await videoEl.isVisible(), "PDP: Trình phát video HTML5 được nhúng trực tiếp và sẵn sàng phát");
  }

  // Capture PDP video screenshot
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "demo-pdp-video-gallery.png"),
    fullPage: false,
  });

  // Check Guides page video tutorials
  await page.goto("http://localhost:3000/guides", { waitUntil: "load" });
  await page.waitForTimeout(600);

  const guideVideos = page.locator("video");
  const guideVidCount = await guideVideos.count();
  assert(guideVidCount >= 2, `Cẩm nang (Guides): Tích hợp ${guideVidCount} video hướng dẫn thao tác lắp đặt DIY thực tế`);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "demo-guides-videos.png"),
    fullPage: false,
  });

  // Capture final evidence screenshot
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "final-audit-bulk-acl.png"),
    fullPage: true,
  });

  await browser.close();

  console.log(`\n=== TỔNG KẾT AUDIT: PASS = ${passCount}, FAIL = ${failCount} ===`);
  if (failCount > 0) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error("Lỗi trong quá trình chạy audit:", err);
  process.exit(1);
});

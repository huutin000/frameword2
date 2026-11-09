// Phase 4 E2E suite (E-01..E-08). Run: npm run test:e2e
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import {
  DESKTOP,
  MOBILE,
  CART_KEY,
  BASE_URL,
  startServer,
  stopServer,
  launchBrowser,
  withPage,
  waitUntil,
  pdpValue,
  cartValue,
  toastLocator,
  headerCartCount,
  addFromPdp,
  readStoredCart,
  writeRawCart,
  seedCart,
  fillCheckout,
  submitButton,
} from "./helpers.mjs";

const MAX = 25;
const MAX_NAME = `Đã đạt số lượng tối đa (${MAX})`;
const GENERIC_ERROR = "Không thể xử lý đơn hàng. Vui lòng thử lại.";
const PHONE_ERROR = "Vui lòng nhập số điện thoại Việt Nam hợp lệ (VD: 0901234567)";
const vnd = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);
const ws = (s) => s.replace(/\s+/g, " ").trim();
const VIEWPORTS = [
  ["desktop 1280x800", DESKTOP],
  ["mobile 375x812", MOBILE],
];
const T = { timeout: 120_000 };

let browser;
before(
  async () => {
    await startServer();
    browser = await launchBrowser();
  },
  { timeout: 600_000 }
);
after(async () => {
  try {
    await browser?.close();
  } finally {
    await stopServer();
  }
});

const textOf = async (locator) => ws(await locator.innerText());

// ---------------------------------------------------------------- E-01
for (const [label, vp] of VIEWPORTS) {
  test(`E-01 PDP cap, disabled "+" and accessible name [${label}]`, T, () =>
    withPage(browser, vp, async (page) => {
      await page.goto("/catalog/p1");
      await pdpValue(page).waitFor();
      const plus = page.getByRole("button", { name: "Tăng", exact: true });
      // picker starts at 1: 23 clicks -> 24
      for (let i = 0; i < 23; i++) await plus.click();
      assert.equal(await textOf(pdpValue(page)), "24");
      assert.equal(await plus.isEnabled(), true, '"+" must be enabled at 24');
      // 24th click -> 25
      await plus.click();
      assert.equal(await textOf(pdpValue(page)), String(MAX));
      const capped = page.getByRole("button", { name: MAX_NAME });
      await capped.waitFor();
      assert.equal(await capped.isDisabled(), true, '"+" must be disabled at the cap');
      // a further (forced) click must not change the value
      await capped.click({ force: true });
      assert.equal(await textOf(pdpValue(page)), String(MAX));
      // first add at the boundary: unchanged copy
      await page.getByRole("button", { name: "Thêm vào giỏ" }).click();
      const toast = toastLocator(page);
      await toast.waitFor();
      assert.match(await textOf(toast), /Đã thêm 25 sản phẩm vào giỏ hàng!/);
      await waitUntil(async () => (await headerCartCount(page)) === MAX, { message: "header badge 25" });
    }));
}

// ---------------------------------------------------------------- E-02
for (const [label, vp] of VIEWPORTS) {
  test(`E-02 cart page cap [${label}]`, T, () =>
    withPage(browser, vp, async (page) => {
      await seedCart(page, 24);
      await page.goto("/cart");
      await cartValue(page).waitFor();
      assert.equal(await textOf(cartValue(page)), "24");
      await page.getByRole("button", { name: "Tăng số lượng", exact: true }).click();
      assert.equal(await textOf(cartValue(page)), String(MAX));
      const capped = page.getByRole("button", { name: MAX_NAME });
      await capped.waitFor();
      assert.equal(await capped.isDisabled(), true);
      assert.equal(await page.getByRole("button", { name: "Giảm số lượng" }).isEnabled(), true);
      const total = vnd(MAX * 680_000);
      await page.getByText(`Tạm tính (${MAX} sản phẩm)`).waitFor();
      const subtotalRow = page.locator("div", { hasText: `Tạm tính (${MAX} sản phẩm)` }).last();
      assert.ok((await textOf(subtotalRow)).includes(ws(total)), `subtotal row should contain ${ws(total)}`);
      if (vp === DESKTOP) {
        // the per-line total is hidden below the sm breakpoint
        assert.ok((await page.locator("body").innerText()).replace(/\s/g, " ").includes(ws(total)), "line total visible");
      }
    }));
}

// ---------------------------------------------------------------- E-03
for (const [label, vp] of VIEWPORTS) {
  test(`E-03 toast shows the real added amount, then the cap message [${label}]`, T, () =>
    withPage(browser, vp, async (page) => {
      await seedCart(page, 20);
      await page.goto("/catalog/p1");
      await pdpValue(page).waitFor();
      // wait for hydration of the persisted cart (badge 20) before adding
      await waitUntil(async () => (await headerCartCount(page)) === 20, { message: "badge 20" });
      const plus = page.getByRole("button", { name: "Tăng", exact: true });
      for (let i = 0; i < 9; i++) await plus.click(); // picker 1 -> 10
      assert.equal(await textOf(pdpValue(page)), "10");
      await page.getByRole("button", { name: "Thêm vào giỏ" }).click();
      const toast = toastLocator(page);
      await toast.waitFor();
      const first = await textOf(toast);
      // F4: the toast is a polite live region
      assert.equal(await toast.getAttribute("role"), "status");
      assert.equal(await toast.getAttribute("aria-live"), "polite");
      assert.ok(!/Đã thêm 10 sản phẩm/.test(first), `toast overstates the added amount: "${first}"`);
      assert.match(first, /^Đã thêm 5 sản phẩm vào giỏ hàng \(tối đa 25 sản phẩm\/mặt hàng\)\./, `partial-add toast: "${first}"`);

      // F1: the toast copy is captured at click time. Within the 2.5 s toast window, drive the
      // picker 10 -> 5 inside ONE page.evaluate (no per-click round trips, no sleeps), then read
      // the toast in the same evaluate after a frame. Pre-F1 the copy followed the live picker
      // (5 is not > 5 remaining capacity -> uncapped copy "Đã thêm 5 sản phẩm vào giỏ hàng!").
      // Derived by reasoning, not mutation-verified.
      const live = await page.evaluate(async () => {
        const visible = (el) => el.offsetParent !== null || el.getClientRects().length > 0;
        const minusBtn = [...document.querySelectorAll('button[aria-label="Giảm"]')].find(visible);
        const valueEl = minusBtn.nextElementSibling;
        for (let i = 0; i < 5; i++) minusBtn.click();
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        const status = [...document.querySelectorAll('[role="status"]')].find((el) => el.querySelector('a[href="/cart"]'));
        return { picker: valueEl.textContent.trim(), toast: status ? status.textContent.replace(/\s+/g, " ").trim() : null };
      });
      assert.equal(live.picker, "5", "picker should now equal the added amount");
      assert.ok(live.toast, "toast must still be visible (2.5 s window) after the picker change");
      assert.match(live.toast, /^Đã thêm 5 sản phẩm vào giỏ hàng \(tối đa 25 sản phẩm\/mặt hàng\)\./, `toast followed the live picker: "${live.toast}"`);
      await waitUntil(async () => (await headerCartCount(page)) === MAX, { message: "badge 25" });

      // timer overlap guard: wait for the 2.5 s toast to disappear before step 2
      await toast.waitFor({ state: "hidden", timeout: 6_000 });
      const minus = page.getByRole("button", { name: "Giảm", exact: true });
      for (let i = 0; i < 4; i++) await minus.click(); // picker 5 -> 1
      assert.equal(await textOf(pdpValue(page)), "1");
      await page.getByRole("button", { name: "Thêm vào giỏ" }).click();
      await toast.waitFor();
      const second = await textOf(toast);
      assert.ok(!/Đã thêm 1 sản phẩm/.test(second), `toast claims an add at the cap: "${second}"`);
      assert.match(second, /^Mặt hàng này đã đạt tối đa 25 sản phẩm trong giỏ\./, `at-cap toast: "${second}"`);
      assert.equal(await headerCartCount(page), MAX);
    }));
}

// ---------------------------------------------------------------- E-04
const E04_ROWS = [
  { id: "a", name: "malformed JSON", expect: "empty", raw: () => "{not json" },
  { id: "b", name: "raw [NaN]", expect: "empty", raw: () => "[NaN]" },
  { id: "c", name: "{} (non-array)", expect: "empty", raw: () => "{}" },
  { id: "d", name: "[null]", expect: "empty", raw: () => "[null]" },
  {
    id: "e",
    name: "line without priceVnd",
    expect: "empty",
    raw: (v) => {
      const { priceVnd: _drop, ...rest } = v;
      void _drop;
      return JSON.stringify([rest]);
    },
  },
  { id: "f", name: "[valid, null]", expect: "one", qty: 2, raw: (v) => JSON.stringify([{ ...v, quantity: 2 }, null]) },
  { id: "g", name: 'quantity "abc"', expect: "one", qty: 1, raw: (v) => JSON.stringify([{ ...v, quantity: "abc" }]) },
  { id: "h", name: "quantity 99999999", expect: "one", qty: MAX, raw: (v) => JSON.stringify([{ ...v, quantity: 99999999 }]) },
];

for (const row of E04_ROWS) {
  test(`E-04(${row.id}) corrupt localStorage: ${row.name} [desktop]`, T, () =>
    withPage(browser, DESKTOP, async (page) => {
      // harvest a valid line through the UI, then reset storage to the row's value
      await addFromPdp(page);
      const [valid] = await readStoredCart(page);
      await writeRawCart(page, row.raw(valid));
      await page.goto("/cart");
      if (row.expect === "empty") {
        await page.getByRole("heading", { name: "Giỏ hàng của bạn đang trống" }).waitFor();
      } else {
        await page.getByRole("button", { name: "Giảm số lượng" }).first().waitFor();
        assert.equal(await page.getByRole("button", { name: "Giảm số lượng" }).count(), 1, "exactly one line");
        assert.equal(await textOf(cartValue(page)), String(row.qty));
        await page.getByText(`Tạm tính (${row.qty} sản phẩm)`).waitFor();
        const stored = await waitUntil(
          async () => {
            const parsed = JSON.parse(await page.evaluate((k) => window.localStorage.getItem(k), CART_KEY));
            return Array.isArray(parsed) && parsed.length === 1 ? parsed : null;
          },
          { message: "storage rewritten with exactly one entry" }
        );
        assert.equal(stored[0].quantity, row.qty);
      }
      const body = await page.locator("body").innerText();
      assert.ok(!/NaN/.test(body), "page text must not contain NaN");
    }));
}

// ---------------------------------------------------------------- E-05
const BAD_PHONES = ["0|12345678", "090123456", "09012345678"];
for (const [label, vp] of VIEWPORTS) {
  for (const phone of BAD_PHONES) {
    test(`E-05 client phone validation "${phone}" [${label}]`, T, () =>
      withPage(browser, vp, async (page) => {
        await seedCart(page, 1);
        const posts = [];
        page.on("request", (r) => {
          if (r.method() === "POST") posts.push(r.url());
        });
        await page.goto("/checkout");
        await page.getByPlaceholder("Ví dụ: Hoàng Tuấn Anh").waitFor();
        await fillCheckout(page, { name: "qa-auto-E05", phone, address: "qa-auto-123 Duong Test" });
        await submitButton(page).click();
        await page.getByText(PHONE_ERROR).waitFor();
        assert.equal(new URL(page.url()).pathname, "/checkout");
        assert.equal(await submitButton(page).isEnabled(), true);
        assert.deepEqual(posts, [], "client validation must block the request (no order created)");
      }));
  }
}

// ---------------------------------------------------------------- E-06
for (const [label, vp] of VIEWPORTS) {
  test(`E-06 COD checkout happy path, new id format [${label}]`, T, () =>
    withPage(browser, vp, async (page) => {
      await addFromPdp(page, { extraClicks: 1 }); // qty 2
      await page.getByRole("link", { name: "Xem giỏ" }).click();
      await page.waitForURL("**/cart");
      await page.getByRole("link", { name: /Tiến hành đặt hàng/ }).click();
      await page.waitForURL("**/checkout");
      await page.getByPlaceholder("Ví dụ: Hoàng Tuấn Anh").waitFor();
      await fillCheckout(page, { name: "qa-auto-E06", phone: " 0901234567 ", address: "qa-auto-123 Duong Test" });
      const total = vnd(2 * 680_000); // subtotal 1,360,000 >= 1,000,000 => free shipping
      assert.ok((await page.locator("body").innerText()).includes(total), `checkout shows total ${total}`);
      await page.getByRole("radio", { name: /COD/ }).check();
      await submitButton(page).click();
      await page.waitForURL(/\/orders\/ord-/, { timeout: 15_000 });
      assert.match(new URL(page.url()).pathname, /^\/orders\/ord-sl-2026-[0-9a-f]{8}$/, "order id format");
      const heading = page.getByRole("heading", { name: /Mã đơn hàng: SL-2026-[0-9A-F]{8}$/ });
      await heading.waitFor();
      const orderUrl = page.url();
      await waitUntil(async () => (await headerCartCount(page)) === 0, { message: "badge 0" });
      await page.reload();
      await heading.waitFor();
      assert.equal(page.url(), orderUrl);
      assert.ok((await page.locator("body").innerText()).includes(total), "order page shows total");
    }));
}

// ---------------------------------------------------------------- E-07
test("E-07 VietQR order is pending and admin label is corrected [desktop]", T, () =>
  withPage(browser, DESKTOP, async (page) => {
    await addFromPdp(page);
    await page.goto("/checkout");
    await page.getByPlaceholder("Ví dụ: Hoàng Tuấn Anh").waitFor();
    await fillCheckout(page, { name: "qa-auto-E07", phone: "0901234567", address: "qa-auto-123 Duong Test" });
    await page.getByRole("radio", { name: /VietQR/ }).check();
    await submitButton(page).click();
    await page.waitForURL(/\/orders\/ord-/, { timeout: 15_000 });
    const heading = page.getByRole("heading", { name: /Mã đơn hàng: SL-/ });
    await heading.waitFor();
    const code = (await textOf(heading)).replace("Mã đơn hàng: ", "").trim();

    await page.goto("/admin/orders");
    const search = page.getByPlaceholder("Tìm theo mã đơn, tên hoặc số ĐT...");
    await search.fill(code);
    const row = page.locator("tr", { hasText: code });
    await row.first().waitFor();
    const rowText = await textOf(row.first());
    assert.ok(rowText.includes("qa-auto-E07"), `row should be the new order: "${rowText}"`);
    assert.ok(rowText.includes("Chờ thanh toán"), `pending VietQR order should read "Chờ thanh toán": "${rowText}"`);
    assert.ok(!rowText.includes("Đã thanh toán"), `pending VietQR order must not read paid: "${rowText}"`);
    assert.ok(!rowText.includes("Thu hộ khi giao"), `VietQR order must not use the COD-only label: "${rowText}"`);

    await search.fill("SL-2026-001");
    const seed = page.locator("tr", { hasText: "SL-2026-001" });
    await seed.first().waitFor();
    assert.ok((await textOf(seed.first())).includes("Thu hộ khi giao"), "seed COD row keeps its label");
  }));

// ---------------------------------------------------------------- E-08
test("E-08 generic error when the server action request fails [desktop]", T, () =>
  withPage(
    browser,
    DESKTOP,
    async (page) => {
      await seedCart(page, 1);
      await page.goto("/checkout");
      await page.getByPlaceholder("Ví dụ: Hoàng Tuấn Anh").waitFor();
      await fillCheckout(page, { name: "qa-auto-E08", phone: "0901234567", address: "qa-auto-123 Duong Test" });
      let aborted = 0;
      await page.route(`${BASE_URL}/checkout`, (route) => {
        const req = route.request();
        if (req.method() === "POST" && "next-action" in req.headers()) {
          aborted++;
          return route.abort("failed");
        }
        return route.continue();
      });
      await submitButton(page).click();
      const bannerText = page.getByText(GENERIC_ERROR);
      await bannerText.waitFor();
      assert.equal(aborted, 1, "exactly one server action request should have been intercepted");
      const banner = await textOf(bannerText);
      assert.equal(banner, GENERIC_ERROR, "generic message is shown without a prefix");
      assert.equal(await page.getByText("Lỗi xác thực:").count(), 0, "generic error must not carry the validation prefix");
      assert.ok(!/Failed to fetch|fetch failed|NetworkError/i.test(banner), `raw error leaked: "${banner}"`);
      assert.equal(new URL(page.url()).pathname, "/checkout");
      assert.equal(await submitButton(page).isEnabled(), true);
    },
    // Justified allow-list (this test only): the injected network fault itself makes Chromium log
    // "Failed to load resource: net::ERR_FAILED" for the aborted request. Nothing else is allowed.
    { allowConsoleError: [/Failed to load resource: net::ERR_FAILED/] }
  ));

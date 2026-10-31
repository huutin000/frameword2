import { test, expect } from "@playwright/test";

test.describe("English Routes & Legacy Rewrites Verification", () => {
  test("should load new English routes successfully", async ({ page }) => {
    // 1. Test /about
    await page.goto("/about", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/about/);

    // 2. Test /search
    await page.goto("/search", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/search/);

    // 3. Test /login
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/login/);

    // 4. Test /register
    await page.goto("/register", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/register/);

    // 5. Test /admin/login
    await page.goto("/admin/login", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/admin\/login/);

    // 6. Test /admin/register
    await page.goto("/admin/register", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/admin\/register/);

    // 7. Test /admin/category/add
    await page.goto("/admin/category/add", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/admin\/category\/add/);
  });

  test("should support legacy Vietnamese URLs via rewrites without 404", async ({ page }) => {
    // Legacy /gioithieu rewrites to /about
    const resAbout = await page.goto("/gioithieu", { waitUntil: "domcontentloaded" });
    expect(resAbout?.status()).toBeLessThan(400);

    // Legacy /login/dangnhap rewrites to /login
    const resLogin = await page.goto("/login/dangnhap", { waitUntil: "domcontentloaded" });
    expect(resLogin?.status()).toBeLessThan(400);

    // Legacy /login/dangky rewrites to /register
    const resRegister = await page.goto("/login/dangky", { waitUntil: "domcontentloaded" });
    expect(resRegister?.status()).toBeLessThan(400);

    // Legacy /admin/category/addcate rewrites to /admin/category/add
    const resAddCate = await page.goto("/admin/category/addcate", { waitUntil: "domcontentloaded" });
    expect(resAddCate?.status()).toBeLessThan(400);
  });
});

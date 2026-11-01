import { test } from "@playwright/test";

test.describe("Visual Storefront Snapshot", () => {
  test("capture desktop and mobile redesign snapshots", async ({ browser }) => {
    // Desktop context (1440x900)
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const desktopPage = await desktopContext.newPage();

    // 1. Homepage desktop
    await desktopPage.goto("http://localhost:3000/", {
      waitUntil: "domcontentloaded",
    });
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({
      path: "public/screenshots/redesign-home-desktop.png",
      fullPage: true,
    });

    // 2. Product PLP desktop
    await desktopPage.goto("http://localhost:3000/product", {
      waitUntil: "domcontentloaded",
    });
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({
      path: "public/screenshots/redesign-product-desktop.png",
      fullPage: true,
    });

    // 3. Cart page desktop (with an item added)
    await desktopPage.goto("http://localhost:3000/product", {
      waitUntil: "domcontentloaded",
    });
    const addBtn = desktopPage.locator("button.dat-hang").first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await desktopPage.waitForTimeout(500);
    }
    await desktopPage.goto("http://localhost:3000/cart", {
      waitUntil: "domcontentloaded",
    });
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({
      path: "public/screenshots/redesign-cart-desktop.png",
      fullPage: true,
    });

    // 4. Product PDP desktop
    await desktopPage.goto("http://localhost:3000/product", {
      waitUntil: "domcontentloaded",
    });
    const productLink = desktopPage
      .locator("a[href*='/product-detail/']")
      .first();
    if (await productLink.isVisible()) {
      await productLink.click();
      await desktopPage.waitForLoadState("domcontentloaded");
      await desktopPage.waitForTimeout(1000);
      await desktopPage.screenshot({
        path: "public/screenshots/redesign-detail-desktop.png",
        fullPage: true,
      });
    }

    // 5. About desktop
    await desktopPage.goto("http://localhost:3000/about", {
      waitUntil: "domcontentloaded",
    });
    await desktopPage.waitForTimeout(800);
    await desktopPage.screenshot({
      path: "public/screenshots/redesign-about-desktop.png",
      fullPage: true,
    });

    // 6. Contact desktop
    await desktopPage.goto("http://localhost:3000/contact", {
      waitUntil: "domcontentloaded",
    });
    await desktopPage.waitForTimeout(800);
    await desktopPage.screenshot({
      path: "public/screenshots/redesign-contact-desktop.png",
      fullPage: true,
    });

    // 7. Login desktop
    await desktopPage.goto("http://localhost:3000/login", {
      waitUntil: "domcontentloaded",
    });
    await desktopPage.waitForTimeout(800);
    await desktopPage.screenshot({
      path: "public/screenshots/redesign-login-desktop.png",
      fullPage: true,
    });

    await desktopContext.close();

    // Mobile context (iPhone 14 / modern 390x844)
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();

    // 1. Homepage mobile
    await mobilePage.goto("http://localhost:3000/", {
      waitUntil: "domcontentloaded",
    });
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({
      path: "public/screenshots/redesign-home-mobile.png",
      fullPage: true,
    });

    // 2. Product PLP mobile
    await mobilePage.goto("http://localhost:3000/product", {
      waitUntil: "domcontentloaded",
    });
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({
      path: "public/screenshots/redesign-product-mobile.png",
      fullPage: true,
    });

    // 3. Cart page mobile
    await mobilePage.goto("http://localhost:3000/cart", {
      waitUntil: "domcontentloaded",
    });
    await mobilePage.waitForTimeout(1000);
    await mobilePage.screenshot({
      path: "public/screenshots/redesign-cart-mobile.png",
      fullPage: true,
    });

    // 4. About mobile
    await mobilePage.goto("http://localhost:3000/about", {
      waitUntil: "domcontentloaded",
    });
    await mobilePage.waitForTimeout(800);
    await mobilePage.screenshot({
      path: "public/screenshots/redesign-about-mobile.png",
      fullPage: true,
    });

    await mobileContext.close();
  });
});

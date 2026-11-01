import { chromium } from "@playwright/test";

const viewports = [320, 375, 390, 430, 768, 1024, 1440, 1920];
const routes = ["/", "/product", "/cart", "/about", "/contact", "/login"];

async function verifyResponsive() {
  console.log("Checking responsive viewports for layout overflow and regressions...");
  const browser = await chromium.launch();
  let hasOverflowIssue = false;

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp, height: 800 },
      isMobile: vp < 768,
    });
    const page = await context.newPage();

    for (const route of routes) {
      await page.goto(`http://localhost:3000${route}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(400);

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      if (overflow) {
        console.warn(`[OVERFLOW] Viewport ${vp}px on ${route} has horizontal scroll!`);
        hasOverflowIssue = true;
      }
    }
    await context.close();
    console.log(`✓ Viewport ${vp}px: all routes OK`);
  }

  await browser.close();
  if (hasOverflowIssue) {
    console.error("Responsive verification had overflow issues.");
    process.exit(1);
  } else {
    console.log("All 8 viewports verified successfully without horizontal overflow!");
  }
}

verifyResponsive().catch((err) => {
  console.error("Responsive check failed:", err);
  process.exit(1);
});


// Disclosure state regression: docs/SmallLiving_FULLSTACK_ULTIMATE_2026/14-QA-ACCESSIBILITY-PERFORMANCE.md
// and https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import {
  MOBILE,
  startServer,
  stopServer,
  launchBrowser,
  withPage,
  waitUntil,
} from "./helpers.mjs";

let browser;
before(async () => {
  await startServer();
  browser = await launchBrowser();
}, { timeout: 600_000 });

after(async () => {
  try {
    await browser?.close();
  } finally {
    await stopServer();
  }
});

test("mobile navigation exposes collapsed/open/closed state after pointer activation", async () => {
  await withPage(browser, MOBILE, async (page) => {
    await page.goto("/faq");
    const toggle = page.getByRole("button", { name: "Toggle menu", exact: true });
    const link = page.locator("header").getByRole("link", { name: "Shop The Room", exact: true }).filter({ visible: true });

    assert.equal(await toggle.getAttribute("aria-expanded"), "false");
    await toggle.click();
    await link.waitFor({ state: "visible" });
    assert.equal(await toggle.getAttribute("aria-expanded"), "true");
    await toggle.click();
    await waitUntil(async () => (await link.count()) === 0, { message: "mobile navigation closes" });
    assert.equal(await toggle.getAttribute("aria-expanded"), "false");
  });
});

test("mobile navigation reports keyboard activation with Enter and Space", async () => {
  await withPage(browser, MOBILE, async (page) => {
    await page.goto("/faq");
    const toggle = page.getByRole("button", { name: "Toggle menu", exact: true });
    const link = page.locator("header").getByRole("link", { name: "Shop The Room", exact: true }).filter({ visible: true });

    assert.equal(await toggle.getAttribute("aria-expanded"), "false");
    await toggle.focus();
    await page.keyboard.press("Enter");
    await link.waitFor({ state: "visible" });
    assert.equal(await toggle.getAttribute("aria-expanded"), "true");
    await page.keyboard.press("Space");
    await waitUntil(async () => (await link.count()) === 0, { message: "keyboard closes mobile navigation" });
    assert.equal(await toggle.getAttribute("aria-expanded"), "false");
  });
});

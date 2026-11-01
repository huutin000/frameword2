import { chromium } from "file:///D:/Project/Shop-Ecommerce/frontend/node_modules/@playwright/test/index.mjs";
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve("public/screenshots");
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function capture() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  console.log("Capturing Home...");
  await page.goto("http://localhost:3005/", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(OUT_DIR, "m1-home.png"), fullPage: false });

  console.log("Capturing Catalog...");
  await page.goto("http://localhost:3005/catalog", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(OUT_DIR, "m1-catalog.png"), fullPage: false });

  console.log("Capturing Admin...");
  await page.goto("http://localhost:3005/admin", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(OUT_DIR, "m1-admin.png"), fullPage: false });

  console.log("Capturing Planner...");
  await page.goto("http://localhost:3005/planner", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(OUT_DIR, "m1-planner.png"), fullPage: false });

  // Mobile viewport capture
  console.log("Capturing Mobile Home...");
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("http://localhost:3005/", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(OUT_DIR, "m1-home-mobile.png"), fullPage: false });

  await browser.close();
  console.log("Done! Screenshots saved to", OUT_DIR);
}

capture().catch((err) => {
  console.error("Error capturing screenshots:", err);
  process.exit(1);
});

const { chromium } = require('playwright');
const path = require("path");

const ARTIFACT_DIR = "C:/Users/huuti/.gemini/antigravity/brain/395a8058-8e27-4416-8292-54aef9e4f05e";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  console.log("1. Capturing Room Profile (/room-profile)...");
  await page.goto("http://localhost:3000/room-profile", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m5-room-profile.png"), fullPage: true });

  console.log("2. Capturing Solutions Gallery (/solutions)...");
  await page.goto("http://localhost:3000/solutions", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m5-solutions.png"), fullPage: true });

  console.log("3. Capturing Solution Detail Builder (/solutions/combo-phong-tro-12m)...");
  await page.goto("http://localhost:3000/solutions/combo-phong-tro-12m", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m5-solution-detail.png"), fullPage: true });

  console.log("4. Capturing Shop The Room Hotspots (/shop-the-room)...");
  await page.goto("http://localhost:3000/shop-the-room", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m5-shop-the-room.png"), fullPage: true });

  console.log("5. Capturing 2D Room Planner (/planner)...");
  await page.goto("http://localhost:3000/planner", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m6-planner-2d.png"), fullPage: true });

  console.log("6. Capturing PDP SpaceFit Card (/catalog/p1)...");
  await page.goto("http://localhost:3000/catalog/p1", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m5-pdp-spacefit.png"), fullPage: true });

  console.log("7. Capturing Admin Solutions (/admin/solutions)...");
  await page.goto("http://localhost:3000/admin/solutions", { waitUntil: "load" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m5-admin-solutions.png"), fullPage: true });

  console.log("All M5 & M6 screenshots captured successfully!");
  await browser.close();
}

main().catch((err) => {
  console.error("Error capturing screenshots:", err);
  process.exit(1);
});

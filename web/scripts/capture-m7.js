const { chromium } = require('D:/Project/Shop-Ecommerce/frontend/node_modules/playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/huuti/.gemini/antigravity/brain/395a8058-8e27-4416-8292-54aef9e4f05e';

async function main() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader'],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  console.log("1. Navigating to Planner (/planner)...");
  await page.goto("http://localhost:3000/planner", { waitUntil: "load" });
  await page.waitForTimeout(1000);

  console.log("2. Switching to 3D WebGL Viewport...");
  const btn3D = page.locator('button:has-text("Phối cảnh 3D WebGL")').first();
  await btn3D.click();
  await page.waitForTimeout(2500); // Allow Three.js canvas to initialize and render

  console.log("3. Capturing M7 3D Room Planner screenshot...");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "m7-planner-3d.png"), fullPage: true });

  console.log("4. Navigating to PDP (/catalog/p1)...");
  await page.goto("http://localhost:3000/catalog/p1", { waitUntil: "load" });
  await page.waitForTimeout(1000);

  console.log("5. Opening 3D Model Modal...");
  const btnModel3D = page.locator('button:has-text("Xem Mô Hình 3D")');
  if (await btnModel3D.isVisible()) {
    await btnModel3D.click();
    await page.waitForTimeout(2000);
    console.log("6. Capturing PDP 3D Modal screenshot...");
    await page.screenshot({ path: path.join(ARTIFACT_DIR, "m7-pdp-3d-modal.png"), fullPage: true });
  }

  console.log("All M7 screenshots captured successfully!");
  await browser.close();
}

main().catch((err) => {
  console.error("Error capturing M7 screenshots:", err);
  process.exit(1);
});

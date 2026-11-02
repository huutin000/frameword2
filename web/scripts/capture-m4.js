const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/huuti/.gemini/antigravity/brain/395a8058-8e27-4416-8292-54aef9e4f05e';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  console.log('1. Capturing Wishlist...');
  await page.goto('http://localhost:3000/catalog/p1', { waitUntil: 'domcontentloaded', timeout: 15000 });
  // Click save to wishlist button on PDP
  const saveBtn = page.getByRole('button', { name: /Lưu vào yêu thích/i });
  if (await saveBtn.isVisible()) {
    await saveBtn.click();
    await page.waitForTimeout(400);
  }
  await page.goto('http://localhost:3000/wishlist', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'm4-wishlist.png'), fullPage: false });

  console.log('2. Capturing Compare View...');
  // Add p1 to compare
  const compBtn = page.getByRole('button', { name: /So sánh thông số/i });
  if (await compBtn.isVisible()) {
    await compBtn.click();
    await page.waitForTimeout(400);
  }
  await page.goto('http://localhost:3000/catalog/p2', { waitUntil: 'domcontentloaded', timeout: 15000 });
  const compBtn2 = page.getByRole('button', { name: /So sánh thông số/i });
  if (await compBtn2.isVisible()) {
    await compBtn2.click();
    await page.waitForTimeout(400);
  }
  await page.goto('http://localhost:3000/compare', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'm4-compare.png'), fullPage: false });

  console.log('3. Capturing Admin Categories...');
  await page.goto('http://localhost:3000/admin/categories', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'm4-admin-categories.png'), fullPage: false });

  console.log('4. Capturing Admin Inventory...');
  await page.goto('http://localhost:3000/admin/inventory', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'm4-admin-inventory.png'), fullPage: false });

  console.log('5. Capturing Admin Promotions...');
  await page.goto('http://localhost:3000/admin/promotions', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'm4-admin-promotions.png'), fullPage: false });

  console.log('6. Capturing Admin Audit Logs...');
  await page.goto('http://localhost:3000/admin/audit-logs', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'm4-admin-audit-logs.png'), fullPage: false });

  console.log('7. Capturing Guides...');
  await page.goto('http://localhost:3000/guides', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'm4-guides.png'), fullPage: false });

  console.log('8. Capturing FAQ...');
  await page.goto('http://localhost:3000/faq', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'm4-faq.png'), fullPage: false });

  await browser.close();
  console.log('All M4 screenshots captured successfully!');
}

main().catch(console.error);


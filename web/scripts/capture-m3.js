const { chromium } = require('D:/Project/Shop-Ecommerce/frontend/node_modules/playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/huuti/.gemini/antigravity/brain/395a8058-8e27-4416-8292-54aef9e4f05e';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  console.log('1. Capturing PDP...');
  await page.goto('http://localhost:3000/catalog/p1', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'm3-pdp.png'), fullPage: false });

  console.log('2. Adding to cart on PDP & capturing Cart View...');
  const addBtn = page.getByRole('button', { name: /Thêm vào giỏ/i });
  if (await addBtn.isVisible()) {
    await addBtn.click();
    await page.waitForTimeout(500);
  }
  await page.goto('http://localhost:3000/cart', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'm3-cart.png'), fullPage: false });

  console.log('3. Capturing Checkout...');
  await page.goto('http://localhost:3000/checkout', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'm3-checkout.png'), fullPage: false });

  console.log('4. Capturing Order Tracking & Timeline...');
  await page.goto('http://localhost:3000/orders/ord-seed-01', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'm3-order-tracking.png'), fullPage: false });

  console.log('5. Capturing Admin Products...');
  await page.goto('http://localhost:3000/admin/products', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'm3-admin-products.png'), fullPage: false });

  console.log('6. Capturing Admin Orders...');
  await page.goto('http://localhost:3000/admin/orders', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'm3-admin-orders.png'), fullPage: false });

  console.log('7. Capturing Admin Order Detail with State Machine...');
  await page.goto('http://localhost:3000/admin/orders/ord-seed-01', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'm3-admin-order-detail.png'), fullPage: false });

  await browser.close();
  console.log('All M3 screenshots captured successfully!');
}

main().catch(console.error);

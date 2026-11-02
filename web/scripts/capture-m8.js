/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("playwright");
const path = require("path");

const ARTIFACT_DIR = "C:/Users/huuti/.gemini/antigravity/brain/395a8058-8e27-4416-8292-54aef9e4f05e";

const VIEWS = [
  { url: "http://localhost:3000/account", filename: "m8-customer-account.png", desc: "Customer Account Dashboard" },
  { url: "http://localhost:3000/login", filename: "m8-login.png", desc: "Customer Login" },
  { url: "http://localhost:3000/catalog/p1", filename: "m8-pdp-reviews.png", desc: "PDP Reviews Section" },
  { url: "http://localhost:3000/contact", filename: "m8-contact-tickets.png", desc: "Contact Support Form" },
  { url: "http://localhost:3000/admin/customers", filename: "m8-admin-customers.png", desc: "Admin Customer Management" },
  { url: "http://localhost:3000/admin/reviews", filename: "m8-admin-reviews.png", desc: "Admin Reviews Moderation" },
  { url: "http://localhost:3000/admin/support", filename: "m8-admin-support.png", desc: "Admin Support Inquiries" },
  { url: "http://localhost:3000/admin/spacefit-reports", filename: "m8-admin-spacefit.png", desc: "Admin SpaceFit Reports" },
];

async function main() {
  const browser = await chromium.launch({
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  for (const v of VIEWS) {
    console.log(`Capturing ${v.desc} at ${v.url}...`);
    await page.goto(v.url, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, v.filename),
      fullPage: true,
    });
    console.log(`Saved ${v.filename}`);
  }

  await browser.close();
  console.log("All Milestone 8 screenshots captured successfully!");
}

main().catch((err) => {
  console.error("Error capturing screenshots:", err);
  process.exit(1);
});


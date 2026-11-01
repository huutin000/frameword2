import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

async function generate() {
  console.log("Launching browser to render PNG brand assets...");
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const ogSvgPath = path.join(rootDir, "public", "brand", "og-koviqo.svg");
  const markSvgPath = path.join(rootDir, "public", "brand", "koviqo-mark.svg");
  const iconSvgPath = path.join(rootDir, "app", "icon.svg");

  const ogSvg = fs.readFileSync(ogSvgPath, "utf-8");
  const iconSvg = fs.readFileSync(iconSvgPath, "utf-8");

  // 1. Render OG Image 1200x630
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;overflow:hidden;background:#0b0f19;">${ogSvg}</body></html>`);
  const ogBuffer = await page.screenshot({ type: "png" });
  fs.writeFileSync(path.join(rootDir, "public", "brand", "og-koviqo.png"), ogBuffer);
  fs.writeFileSync(path.join(rootDir, "public", "og-image.png"), ogBuffer);
  console.log("✓ Generated public/brand/og-koviqo.png and public/og-image.png (1200x630)");

  // 2. Render Apple Touch Icon 180x180
  await page.setViewportSize({ width: 180, height: 180 });
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#0b0f19;">
    <div style="width:180px;height:180px;">${iconSvg}</div>
  </body></html>`);
  const appleBuffer = await page.screenshot({ type: "png" });
  fs.writeFileSync(path.join(rootDir, "app", "apple-icon.png"), appleBuffer);
  fs.writeFileSync(path.join(rootDir, "public", "brand", "apple-touch-icon.png"), appleBuffer);
  console.log("✓ Generated app/apple-icon.png (180x180)");

  // 3. Render 192x192 & 512x512 PWA icons
  await page.setViewportSize({ width: 192, height: 192 });
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#0b0f19;">
    <div style="width:192px;height:192px;">${iconSvg}</div>
  </body></html>`);
  const icon192Buffer = await page.screenshot({ type: "png" });
  fs.writeFileSync(path.join(rootDir, "public", "brand", "icon-192.png"), icon192Buffer);

  await page.setViewportSize({ width: 512, height: 512 });
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#0b0f19;">
    <div style="width:512px;height:512px;">${iconSvg}</div>
  </body></html>`);
  const icon512Buffer = await page.screenshot({ type: "png" });
  fs.writeFileSync(path.join(rootDir, "public", "brand", "icon-512.png"), icon512Buffer);
  console.log("✓ Generated 192x192 and 512x512 brand icons");

  // 4. Render 32x32 icon.png
  await page.setViewportSize({ width: 32, height: 32 });
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#0b0f19;">
    <div style="width:32px;height:32px;">${iconSvg}</div>
  </body></html>`);
  const icon32Buffer = await page.screenshot({ type: "png" });
  fs.writeFileSync(path.join(rootDir, "app", "icon.png"), icon32Buffer);
  fs.writeFileSync(path.join(rootDir, "app", "favicon.ico"), icon32Buffer);
  fs.writeFileSync(path.join(rootDir, "public", "favicon.ico"), icon32Buffer);
  console.log("✓ Generated app/icon.png, app/favicon.ico, public/favicon.ico");

  await browser.close();
  console.log("All brand assets successfully generated!");
}

generate().catch((err) => {
  console.error("Error generating brand assets:", err);
  process.exit(1);
});


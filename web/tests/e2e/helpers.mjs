// E2E helpers: local production server lifecycle, browser launch, console guard.
// Runner: node:test. Library: the already-installed `playwright` package (no @playwright/test).
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import pw from "playwright";

const { chromium } = pw;

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const WEB_DIR = path.resolve(HERE, "..", "..");
const APP_DIR = WEB_DIR; // always build/serve web/ in place
export const PORT = 3100;
export const HOST = "127.0.0.1";
export const BASE_URL = `http://${HOST}:${PORT}`;
export const CART_KEY = "small_living_cart_v1";

export const DESKTOP = { width: 1280, height: 800 };
export const MOBILE = { width: 375, height: 812 };

const BROWSER_CANDIDATES = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
];

// 1x1 transparent PNG, served for every next/image request so remote product images
// (unsplash) never hit the network and never create console noise.
const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64"
);

// Kills the server tree, but only while the child is still running: after it exited, its PID may
// have been reused by an unrelated process (taskkill /T /F or kill(-pid) would hit that one).
export function killTree(child) {
  if (!child?.pid) return;
  if (child.exitCode !== null || child.signalCode !== null) return;
  if (process.platform === "win32") {
    try {
      const res = spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { stdio: "ignore" });
      if (res.error || res.status !== 0) {
        child.kill("SIGKILL");
      }
    } catch {
      try {
        child.kill("SIGKILL");
      } catch {
        // ignore already terminated
      }
    }
  } else {
    try {
      // the child is spawned detached on POSIX, so -pid is its own process group
      process.kill(-child.pid, "SIGKILL");
    } catch {
      try {
        child.kill("SIGKILL");
      } catch {
        // ignore already terminated
      }
    }
  }
}

function newestMtime(target) {
  let newest = 0;
  const stack = [target];
  while (stack.length) {
    const current = stack.pop();
    if (!existsSync(current)) continue;
    const st = statSync(current);
    if (st.isDirectory()) {
      for (const name of readdirSync(current)) stack.push(path.join(current, name));
    } else if (st.mtimeMs > newest) {
      newest = st.mtimeMs;
    }
  }
  return newest;
}

function buildIsStale() {
  const buildId = path.join(APP_DIR, ".next", "BUILD_ID");
  if (!existsSync(buildId)) return true;
  const builtAt = statSync(buildId).mtimeMs;
  const sources = ["src", "public", "next.config.ts", "package.json"].map((p) => path.join(APP_DIR, p));
  return sources.some((s) => newestMtime(s) > builtAt);
}

function portInUse() {
  return new Promise((resolve) => {
    const socket = net.connect({ port: PORT, host: HOST });
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
  });
}

let server = null;
const serverLog = [];

function cleanupServer() {
  if (server) {
    killTree(server);
    server = null;
  }
}

// Safety net: kill the tree even if the test process dies abnormally or receives termination signals.
process.on("exit", cleanupServer);
process.once("SIGINT", () => {
  cleanupServer();
  process.exit(130);
});
process.once("SIGTERM", () => {
  cleanupServer();
  process.exit(143);
});

export async function startServer() {
  assert.equal(await portInUse(), false, `port ${PORT} is already in use; refusing to reuse it`);
  const nextBin = path.join(WEB_DIR, "node_modules", "next", "dist", "bin", "next");

  if (buildIsStale()) {
    console.log("[e2e] .next missing or older than sources: running `next build`");
    // same as `npm run build` ("next build"), invoked directly
    const build = spawnSync(process.execPath, [nextBin, "build"], { cwd: APP_DIR, encoding: "utf8" });
    if (build.status !== 0) {
      throw new Error(`next build failed (exit ${build.status})\n${build.stdout}\n${build.stderr}`);
    }
  } else {
    console.log("[e2e] .next is up to date; skipping build");
  }

  server = spawn(process.execPath, [nextBin, "start", "-p", String(PORT), "-H", HOST], {
    cwd: APP_DIR,
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
    // POSIX: own process group so killTree can signal the whole tree; Windows uses taskkill /T
    detached: process.platform !== "win32",
  });
  server.stdout.on("data", (d) => serverLog.push(String(d)));
  server.stderr.on("data", (d) => serverLog.push(String(d)));

  const deadline = Date.now() + 90_000;
  let lastError = "";
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`next start exited early: ${serverLog.join("")}`);
    try {
      const res = await fetch(`${BASE_URL}/`);
      if (res.ok) return;
      lastError = `HTTP ${res.status}`;
    } catch (err) {
      lastError = String(err);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`server not ready within 90s (${lastError})\n${serverLog.join("")}`);
}

export async function stopServer() {
  cleanupServer();
  // wait until the port is released
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline && (await portInUse())) {
    await new Promise((r) => setTimeout(r, 200));
  }
  // a server that survived the kill must fail the run, not leak silently
  assert.equal(await portInUse(), false, `port ${PORT} is still bound after stopServer`);
}

export function getServerLog() {
  return serverLog.join("");
}

export async function launchBrowser() {
  const executablePath = BROWSER_CANDIDATES.find((p) => existsSync(p));
  assert.ok(executablePath, "no system Edge/Chrome found");
  return chromium.launch({ executablePath, headless: true });
}

/**
 * Runs `fn(page, ctx)` in a fresh BrowserContext (fresh localStorage) with the G-01 guard:
 * any console `error` or `pageerror` fails the test. `allowConsoleError` is an explicit,
 * per-test regex list (documented at the call site).
 */
export async function withPage(browser, viewport, fn, { allowConsoleError = [] } = {}) {
  const context = await browser.newContext({ viewport, baseURL: BASE_URL });
  const page = await context.newPage();
  page.setDefaultTimeout(10_000);
  const problems = [];
  page.on("pageerror", (err) => problems.push(`pageerror: ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (allowConsoleError.some((re) => re.test(text))) return;
    problems.push(`console.error: ${text}`);
  });
  await page.route("**/_next/image**", (route) =>
    route.fulfill({ status: 200, contentType: "image/png", body: PNG_1X1 })
  );
  try {
    await fn(page, context);
  } finally {
    await context.close();
  }
  assert.deepEqual(problems, [], `G-01: console/page errors were reported:\n${problems.join("\n")}`);
}

/** Poll until `fn` returns a truthy value (no fixed sleeps). */
export async function waitUntil(fn, { timeout = 10_000, interval = 100, message = "condition" } = {}) {
  const deadline = Date.now() + timeout;
  let last;
  while (Date.now() < deadline) {
    last = await fn();
    if (last) return last;
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error(`timed out waiting for ${message} (last value: ${JSON.stringify(last)})`);
}

// ---- page-level helpers -------------------------------------------------------------

// `visible: true`: during streaming SSR the page content briefly exists twice (hidden stream
// container + inserted DOM), so a plain locator can violate strict mode right after navigation.
export const pdpValue = (page) => page.locator('button[aria-label="Giảm"] + span').filter({ visible: true });
export const cartValue = (page) => page.locator('button[aria-label="Giảm số lượng"] + span').filter({ visible: true });

export function toastLocator(page) {
  // innermost div that contains the "Xem giỏ" link = the toast container
  return page.locator("div", { has: page.getByRole("link", { name: "Xem giỏ" }) }).last();
}

export async function headerCartCount(page) {
  const text = await page.locator('header a[href="/cart"]').innerText();
  const match = text.match(/(\d+)\s*$/);
  return match ? Number(match[1]) : NaN;
}

export async function addFromPdp(page, { extraClicks = 0 } = {}) {
  await page.goto("/catalog/p1");
  await pdpValue(page).waitFor();
  for (let i = 0; i < extraClicks; i++) {
    await page.getByRole("button", { name: "Tăng", exact: true }).click();
  }
  await page.getByRole("button", { name: "Thêm vào giỏ" }).click();
  await toastLocator(page).waitFor();
}

export async function readStoredCart(page) {
  return waitUntil(
    async () => {
      const raw = await page.evaluate((k) => window.localStorage.getItem(k), CART_KEY);
      return raw && raw !== "[]" ? JSON.parse(raw) : null;
    },
    { message: "cart persisted to localStorage" }
  );
}

export async function writeRawCart(page, raw) {
  await page.evaluate(([k, v]) => window.localStorage.setItem(k, v), [CART_KEY, raw]);
}

/** Add p1 once through the UI, harvest the stored line, rewrite it with `quantity`, return the line. */
export async function seedCart(page, quantity) {
  await addFromPdp(page);
  const [line] = await readStoredCart(page);
  assert.ok(line && line.productId === "p1", "seeded line should be p1");
  line.quantity = quantity;
  await writeRawCart(page, JSON.stringify([line]));
  return line;
}

export async function fillCheckout(page, { name, phone, address }) {
  await page.getByPlaceholder("Ví dụ: Hoàng Tuấn Anh").fill(name);
  await page.getByPlaceholder("0912 345 678").fill(phone);
  await page.getByPlaceholder("VD: Phòng 302, Ngõ 45 phố Nguyễn Khang...").fill(address);
}

export const submitButton = (page) => page.getByRole("button", { name: /Hoàn tất đặt hàng|Đang khởi tạo/ });

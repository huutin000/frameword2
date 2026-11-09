// E2E Process Lifecycle Reliability tests (L-01..L-10). Run: npm run test:e2e
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import net from "node:net";
import { killTree, stopServer } from "./helpers.mjs";

// L-01: killTree null/undefined safety
test("L-01 killTree safely handles null, undefined, and empty child objects", () => {
  assert.doesNotThrow(() => killTree(null));
  assert.doesNotThrow(() => killTree(undefined));
  assert.doesNotThrow(() => killTree({}));
  assert.doesNotThrow(() => killTree({ pid: 0 }));
});

// L-02: killTree skips already exited child to prevent PID collision
test("L-02 killTree skips already exited child process (exitCode or signalCode set)", () => {
  const dummyChild = { pid: 999999, exitCode: 0, signalCode: null };
  assert.doesNotThrow(() => killTree(dummyChild));

  const signaledChild = { pid: 999999, exitCode: null, signalCode: "SIGTERM" };
  assert.doesNotThrow(() => killTree(signaledChild));
});

// L-03: killTree terminates an active spawned child process
test("L-03 killTree terminates an active spawned child process", async () => {
  const child = spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], {
    stdio: "ignore",
    windowsHide: true,
    detached: process.platform !== "win32",
  });
  assert.ok(child.pid, "spawned child must have a valid pid");
  assert.equal(child.exitCode, null, "child must be running before kill");

  killTree(child);

  await new Promise((resolve) => {
    if (child.exitCode !== null || child.signalCode !== null) return resolve();
    child.once("exit", resolve);
    setTimeout(resolve, 3000);
  });

  const isDead = child.exitCode !== null || child.signalCode !== null;
  assert.equal(isDead, true, "child must be terminated by killTree");
});

// L-04: killTree POSIX path handles ESRCH without throwing unhandled exception
test("L-04 killTree POSIX branch handles dead process / ESRCH gracefully", () => {
  const origPlatform = process.platform;
  const origKill = process.kill;
  try {
    // Mock non-win32 platform to exercise POSIX branch
    Object.defineProperty(process, "platform", { value: "linux", configurable: true });

    let killGroupCalled = false;
    let fallbackKillCalled = false;
    process.kill = (pid, sig) => {
      if (pid < 0) {
        killGroupCalled = true;
        const err = new Error("kill ESRCH");
        err.code = "ESRCH";
        throw err;
      }
      return origKill.call(process, pid, sig);
    };

    const mockChild = {
      pid: 12345,
      exitCode: null,
      signalCode: null,
      kill: () => {
        fallbackKillCalled = true;
        const err = new Error("kill ESRCH");
        err.code = "ESRCH";
        throw err;
      },
    };

    assert.doesNotThrow(() => killTree(mockChild));
    assert.equal(killGroupCalled, true, "POSIX branch must attempt process.kill(-pid)");
    assert.equal(fallbackKillCalled, true, "POSIX branch must fallback to child.kill on ESRCH");
  } finally {
    Object.defineProperty(process, "platform", { value: origPlatform, configurable: true });
    process.kill = origKill;
  }
});

// L-05: stopServer is idempotent when called with no running server
test("L-05 stopServer is idempotent when called without a running server", async () => {
  await assert.doesNotReject(async () => {
    await stopServer();
    await stopServer();
  });
});

// L-06: killTree taskkill exception safety on Windows
test("L-06 killTree handles taskkill/spawnSync failure gracefully", () => {
  const origPlatform = process.platform;
  try {
    Object.defineProperty(process, "platform", { value: "win32", configurable: true });
    const mockChild = {
      pid: 99999999, // Non-existent PID
      exitCode: null,
      signalCode: null,
      kill: () => true,
    };
    // Should not throw even if taskkill exits with error status
    assert.doesNotThrow(() => killTree(mockChild));
  } finally {
    Object.defineProperty(process, "platform", { value: origPlatform, configurable: true });
  }
});

// L-07: signal listener count remains stable across stopServer calls
test("L-07 signal listeners count remains stable across stopServer calls", async () => {
  const sigintCountBefore = process.listenerCount("SIGINT");
  const sigtermCountBefore = process.listenerCount("SIGTERM");
  const exitCountBefore = process.listenerCount("exit");

  await stopServer();
  await stopServer();

  assert.equal(process.listenerCount("SIGINT"), sigintCountBefore, "SIGINT listener count must not increase");
  assert.equal(process.listenerCount("SIGTERM"), sigtermCountBefore, "SIGTERM listener count must not increase");
  assert.equal(process.listenerCount("exit"), exitCountBefore, "exit listener count must not increase");
});

// L-08: SIGINT child process teardown on safe ephemeral port (process dead & port free)
test("L-08 SIGINT child process teardown kills background worker and frees port", async () => {
  const harnessCode = `
const net = require("node:net");
const { spawn, spawnSync } = require("node:child_process");

const server = net.createServer((c) => c.end("ok"));
server.listen(0, "127.0.0.1", () => {
  const port = server.address().port;
  const bgWorker = spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], {
    stdio: "ignore",
    windowsHide: true,
  });

  function cleanup() {
    if (bgWorker && bgWorker.exitCode === null && bgWorker.signalCode === null) {
      if (process.platform === "win32") {
        try {
          const res = spawnSync("taskkill", ["/PID", String(bgWorker.pid), "/T", "/F"], { stdio: "ignore" });
          if (res.error || res.status !== 0) bgWorker.kill("SIGKILL");
        } catch {
          try { bgWorker.kill("SIGKILL"); } catch {}
        }
      } else {
        try { process.kill(-bgWorker.pid, "SIGKILL"); } catch {
          try { bgWorker.kill("SIGKILL"); } catch {}
        }
      }
    }
    try { server.close(); } catch {}
  }

  process.once("SIGINT", () => {
    cleanup();
    process.exit(130);
  });

  process.stdin.on("data", (d) => {
    if (d.toString().trim() === "TRIGGER_SIGINT") {
      process.emit("SIGINT");
    }
  });

  console.log(JSON.stringify({ port, bgPid: bgWorker.pid }));
});
`;

  const child = spawn(process.execPath, ["-e", harnessCode], {
    stdio: ["pipe", "pipe", "inherit"],
  });

  const { port, bgPid, exitCode } = await new Promise((resolve, reject) => {
    let output = "";
    const timer = setTimeout(() => {
      try { child.kill("SIGKILL"); } catch {}
      reject(new Error("Timeout waiting for harness to initialize"));
    }, 10_000);

    child.stdout.on("data", (d) => {
      output += d.toString();
      if (output.includes("bgPid")) {
        const data = JSON.parse(output.trim());
        assert.ok(process.kill(data.bgPid, 0), "background worker must be alive before SIGINT");

        child.stdin.write("TRIGGER_SIGINT\n");

        child.on("exit", (code) => {
          clearTimeout(timer);
          resolve({ port: data.port, bgPid: data.bgPid, exitCode: code });
        });
      }
    });
  });

  assert.equal(exitCode, 130, "harness process must exit with code 130 on SIGINT");

  // Verify background worker PID is actually dead (not just checking port)
  let workerIsDead = false;
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    try {
      process.kill(bgPid, 0);
      await new Promise((r) => setTimeout(r, 100));
    } catch (e) {
      if (e.code === "ESRCH") {
        workerIsDead = true;
        break;
      }
    }
  }
  assert.equal(workerIsDead, true, "background worker process must be terminated (ESRCH)");

  // Verify ephemeral port is released
  const portReleased = await new Promise((resolve) => {
    const sock = net.connect({ port, host: "127.0.0.1" });
    sock.once("connect", () => {
      sock.destroy();
      resolve(false);
    });
    sock.once("error", () => resolve(true));
  });
  assert.equal(portReleased, true, "ephemeral port must be released after SIGINT cleanup");
});

// L-09: SIGTERM signal dispatch triggers graceful cleanup and exits with code 143
test("L-09 SIGTERM signal dispatch triggers graceful cleanup and exits with code 143", async () => {
  const harnessCode = `
const { spawn, spawnSync } = require("node:child_process");

const bgWorker = spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], {
  stdio: "ignore",
  windowsHide: true,
});

function cleanup() {
  if (bgWorker && bgWorker.exitCode === null && bgWorker.signalCode === null) {
    if (process.platform === "win32") {
      try {
        const res = spawnSync("taskkill", ["/PID", String(bgWorker.pid), "/T", "/F"], { stdio: "ignore" });
        if (res.error || res.status !== 0) bgWorker.kill("SIGKILL");
      } catch {
        try { bgWorker.kill("SIGKILL"); } catch {}
      }
    } else {
      try { process.kill(-bgWorker.pid, "SIGKILL"); } catch {
        try { bgWorker.kill("SIGKILL"); } catch {}
      }
    }
  }
}

process.once("SIGTERM", () => {
  cleanup();
  process.exit(143);
});

process.stdin.on("data", (d) => {
  if (d.toString().trim() === "TRIGGER_SIGTERM") {
    process.emit("SIGTERM");
  }
});

console.log(JSON.stringify({ bgPid: bgWorker.pid }));
`;

  const child = spawn(process.execPath, ["-e", harnessCode], {
    stdio: ["pipe", "pipe", "inherit"],
  });

  const { bgPid, exitCode } = await new Promise((resolve, reject) => {
    let output = "";
    const timer = setTimeout(() => {
      try { child.kill("SIGKILL"); } catch {}
      reject(new Error("Timeout waiting for harness to initialize"));
    }, 10_000);

    child.stdout.on("data", (d) => {
      output += d.toString();
      if (output.includes("bgPid")) {
        const data = JSON.parse(output.trim());
        assert.ok(process.kill(data.bgPid, 0), "background worker must be alive before SIGTERM");

        child.stdin.write("TRIGGER_SIGTERM\n");

        child.on("exit", (code) => {
          clearTimeout(timer);
          resolve({ bgPid: data.bgPid, exitCode: code });
        });
      }
    });
  });

  assert.equal(exitCode, 143, "harness process must exit with code 143 on SIGTERM");

  let workerIsDead = false;
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    try {
      process.kill(bgPid, 0);
      await new Promise((r) => setTimeout(r, 100));
    } catch (e) {
      if (e.code === "ESRCH") {
        workerIsDead = true;
        break;
      }
    }
  }
  assert.equal(workerIsDead, true, "background worker process must be terminated (ESRCH)");
});

// L-10: killTree and stopServer idempotency and process death verification
test("L-10 killTree and stopServer are idempotent and confirm process termination", async () => {
  const child = spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], {
    stdio: "ignore",
    windowsHide: true,
    detached: process.platform !== "win32",
  });
  const pid = child.pid;
  assert.ok(process.kill(pid, 0), "process must be running initially");

  // First kill
  killTree(child);

  await new Promise((resolve) => {
    if (child.exitCode !== null || child.signalCode !== null) return resolve();
    child.once("exit", resolve);
    setTimeout(resolve, 3000);
  });

  // Verify PID is dead
  let isDead = false;
  try {
    process.kill(pid, 0);
  } catch (e) {
    if (e.code === "ESRCH") isDead = true;
  }
  assert.equal(isDead, true, "process must be dead after killTree (ESRCH)");

  // Second kill on already dead child must not throw or fail
  assert.doesNotThrow(() => killTree(child));
  assert.doesNotThrow(() => killTree(child));

  // Repeated stopServer calls must be idempotent
  await assert.doesNotReject(async () => {
    await stopServer();
    await stopServer();
  });
});

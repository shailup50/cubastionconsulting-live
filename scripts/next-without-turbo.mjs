import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const args = process.argv.slice(2);

const child = spawn(process.execPath, [nextBin, ...args], {
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_DISABLE_TURBOPACK: "1",
    ...(args[0] === "start" ? { NODE_ENV: "production" } : {}),
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

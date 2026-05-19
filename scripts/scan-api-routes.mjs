import fs from "fs";
import path from "path";

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name === "route.js") acc.push(p);
  }
  return acc;
}

const routes = walk(path.join(process.cwd(), "app/api"));
for (const f of routes.sort()) {
  const rel = f.replace(/\\/g, "/").replace("app/api", "/api");
  const url = rel.replace("/route.js", "").replace(/\[([^\]]+)\]/g, "{$1}");
  const content = fs.readFileSync(f, "utf8");
  const methods = [
    ...content.matchAll(/export async function (GET|POST|PUT|PATCH|DELETE)/g),
  ].map((m) => m[1]);
  console.log(`${methods.join(",").padEnd(20)} ${url}`);
}

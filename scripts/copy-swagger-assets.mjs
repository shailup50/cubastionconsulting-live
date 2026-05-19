import fs from "fs";
import path from "path";

const sourceDir = path.join(process.cwd(), "node_modules", "swagger-ui-dist");
const targetDir = path.join(process.cwd(), "public", "swagger-ui");

const files = ["swagger-ui-bundle.js", "swagger-ui.css"];

if (!fs.existsSync(sourceDir)) {
  console.warn("[copy-swagger-assets] swagger-ui-dist not installed, skipping.");
  process.exit(0);
}

fs.mkdirSync(targetDir, { recursive: true });

for (const file of files) {
  fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file));
}

console.log("[copy-swagger-assets] Swagger UI assets copied to public/swagger-ui/");

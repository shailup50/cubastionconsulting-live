import { createServer } from "http";
import { parse } from "url";
import next from "next";

// 🔥 Force disable turbopack (IMPORTANT)
process.env.NEXT_DISABLE_TURBOPACK = "1";

const port = parseInt("3005", 10);
const dev = process.env.NODE_ENV !== "production";

// ✅ Disable turbo explicitly
const app = next({
  dev,
  turbo: false,
});

const handle = app.getRequestHandler();

if (dev) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port);

  console.log(
    `> Server listening at http://localhost:${port} as ${dev ? "development" : process.env.NODE_ENV}`,
  );
});

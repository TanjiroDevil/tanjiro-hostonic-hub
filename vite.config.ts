import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createRequire } from "module";
import { componentTagger } from "lovable-tagger";
import type { IncomingMessage, ServerResponse } from "http";

// ---------------------------------------------------------------------------
// Dev-only API middleware: makes `/api/*` work locally by routing every
// request through the same single dispatcher we deploy to prod
// (`api/[...slug].js`). This way one codebase = same behaviour in dev & prod,
// and we only ship ONE serverless function (Vercel Hobby has 12-fn limit).
// ---------------------------------------------------------------------------
function apiDevPlugin() {
  const nodeRequire = createRequire(import.meta.url);
  const dispatcherPath = path.resolve(__dirname, "api/[...slug].js");

  return {
    name: "tanjiro-api-dev",
    configureServer(server: { middlewares: { use: (fn: (req: IncomingMessage, res: ServerResponse, next: () => void) => void) => void } }) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || "";
        if (!url.startsWith("/api/") && url !== "/api") return next();

        try {
          // Hot-reload plugins / dispatcher on every dev request
          for (const k of Object.keys(nodeRequire.cache)) {
            if (k === dispatcherPath || k.includes(`${path.sep}plugins${path.sep}`)) {
              delete nodeRequire.cache[k];
            }
          }
          const handler = nodeRequire(dispatcherPath) as (
            req: IncomingMessage,
            res: ServerResponse
          ) => Promise<void>;

          // Buffer body for POST requests
          if (req.method === "POST" || req.method === "PUT") {
            const chunks: Buffer[] = [];
            for await (const c of req) chunks.push(c as Buffer);
            const raw = Buffer.concat(chunks).toString("utf8");
            try {
              (req as IncomingMessage & { body: unknown }).body = raw ? JSON.parse(raw) : {};
            } catch {
              (req as IncomingMessage & { body: unknown }).body = raw;
            }
          }

          // Build req.query + slug
          const u = new URL(url, "http://localhost");
          const query: Record<string, string | string[]> = Object.fromEntries(
            u.searchParams.entries()
          );
          const parts = u.pathname.replace(/^\/+|\/+$/g, "").split("/");
          if (parts[0] === "api") parts.shift();
          query.slug = parts;
          (req as IncomingMessage & { query: typeof query }).query = query;

          // Express-like res shim
          const shim = res as ServerResponse & {
            status: (code: number) => typeof shim;
            json: (obj: unknown) => typeof shim;
            send: (data: unknown) => typeof shim;
          };
          shim.status = (code: number) => {
            res.statusCode = code;
            return shim;
          };
          shim.json = (obj: unknown) => {
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify(obj, null, 2));
            return shim;
          };
          shim.send = (data: unknown) => {
            if (typeof data === "string") {
              res.end(data);
            } else {
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify(data));
            }
            return shim;
          };

          await handler(req, res);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          const message = err instanceof Error ? err.message : String(err);
          res.end(JSON.stringify({ success: false, error: "DEV_MIDDLEWARE", message }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },
  plugins: [
    apiDevPlugin(),
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
}));

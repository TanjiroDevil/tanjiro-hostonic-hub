/*
 * Unified API Dispatcher
 * ----------------------
 * لماذا دالة واحدة؟ خطة Vercel Hobby محدودة بـ 12 serverless functions.
 * بدل أن يحتل كل endpoint دالة مستقلة، نوجّه كل طلبات /api/* لهذه الدالة
 * التي تبني registry داخلي للـ plugins (مرة واحدة عند الـ cold start)
 * ثم توجّه الطلب يدوياً إلى الـ handler المناسب من /plugins.
 */

const fs = require("fs");
const path = require("path");

const PLUGINS_DIR = path.join(process.cwd(), "plugins");

let REGISTRY = null;
let BOOT_TIME = Date.now();

function loadRegistry({ fresh = false } = {}) {
  if (REGISTRY && !fresh) return REGISTRY;

  const registry = {};
  if (!fs.existsSync(PLUGINS_DIR)) {
    REGISTRY = registry;
    return registry;
  }

  const categories = fs
    .readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  for (const cat of categories) {
    const catPath = path.join(PLUGINS_DIR, cat.name);
    const files = fs.readdirSync(catPath).filter((f) => f.endsWith(".js"));
    registry[cat.name] = {};

    for (const file of files) {
      const full = path.join(catPath, file);
      const name = file.replace(/\.js$/, "");
      try {
        if (fresh) delete require.cache[require.resolve(full)];
        const mod = require(full);
        if (!mod || typeof mod.handler !== "function") continue;
        registry[cat.name][name] = {
          name,
          category: cat.name,
          method: mod.method || "GET",
          description: mod.description || "",
          parameters: Array.isArray(mod.parameters) ? mod.parameters : [],
          path: `/api/${cat.name}/${name}`,
          handler: mod.handler,
        };
      } catch (err) {
        console.error(`[dispatcher] failed to load ${full}:`, err.message);
      }
    }
  }

  REGISTRY = registry;
  return registry;
}

function publicList(registry) {
  const out = {};
  for (const [cat, items] of Object.entries(registry)) {
    out[cat] = Object.values(items).map((p) => ({
      name: p.name,
      category: p.category,
      method: p.method,
      description: p.description,
      parameters: p.parameters,
      path: p.path,
    }));
  }
  return out;
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("X-Powered-By", "Tanjiro-Engine");
}

function parseSlug(req) {
  // Vercel: req.query.slug = ['ai','gemini']
  if (req.query && req.query.slug) {
    return Array.isArray(req.query.slug)
      ? req.query.slug
      : String(req.query.slug).split("/");
  }
  // Fallback: from URL
  try {
    const u = new URL(req.url, "http://x");
    const parts = u.pathname.replace(/^\/+|\/+$/g, "").split("/");
    if (parts[0] === "api") parts.shift();
    return parts;
  } catch {
    return [];
  }
}

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    return res.end();
  }

  // In development we always reload to pick up plugin changes
  const isDev = process.env.NODE_ENV !== "production";
  const registry = loadRegistry({ fresh: true });

  const slug = parseSlug(req).filter(Boolean);

  // /api/list
  if (slug.length === 1 && slug[0] === "list") {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.statusCode = 200;
    return res.end(
      JSON.stringify(
        {
          success: true,
          totalEndpoints: Object.values(registry).reduce(
            (n, c) => n + Object.keys(c).length,
            0
          ),
          categories: publicList(registry),
        },
        null,
        2
      )
    );
  }

  // /api/system-info
  if (slug.length === 1 && slug[0] === "system-info") {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.statusCode = 200;
    const mem = process.memoryUsage();
    return res.end(
      JSON.stringify(
        {
          success: true,
          node: process.version,
          platform: process.platform,
          uptimeSec: Math.round((Date.now() - BOOT_TIME) / 1000),
          processUptimeSec: Math.round(process.uptime()),
          memory: {
            rssMB: +(mem.rss / 1024 / 1024).toFixed(2),
            heapUsedMB: +(mem.heapUsed / 1024 / 1024).toFixed(2),
            heapTotalMB: +(mem.heapTotal / 1024 / 1024).toFixed(2),
          },
          totalEndpoints: Object.values(registry).reduce(
            (n, c) => n + Object.keys(c).length,
            0
          ),
        },
        null,
        2
      )
    );
  }

  // /api/{category}/{name}
  if (slug.length >= 2) {
    const [category, name] = slug;
    const ep = registry[category] && registry[category][name];
    if (!ep) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      return res.end(
        JSON.stringify({
          success: false,
          error: "ENDPOINT_NOT_FOUND",
          message: `No endpoint registered at /api/${category}/${name}`,
        })
      );
    }

    try {
      // Normalize req.query for plugins
      if (!req.query || typeof req.query !== "object") {
        try {
          const u = new URL(req.url, "http://x");
          req.query = Object.fromEntries(u.searchParams.entries());
        } catch {
          req.query = {};
        }
      }
      return await ep.handler(req, res);
    } catch (err) {
      console.error(`[dispatcher] handler error /${category}/${name}:`, err);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      return res.end(
        JSON.stringify({
          success: false,
          error: "HANDLER_ERROR",
          message: err && err.message ? err.message : String(err),
        })
      );
    }
  }

  // Root /api → welcome
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.end(
    JSON.stringify(
      {
        success: true,
        message: "Tanjiro Unified API",
        endpoints: ["/api/list", "/api/system-info", "/api/{category}/{name}"],
      },
      null,
      2
    )
  );
};

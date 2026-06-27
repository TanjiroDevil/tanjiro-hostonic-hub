import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, Copy, Check, Loader2, Code2, Server, Zap } from "lucide-react";
import { toast } from "sonner";
import { FALLBACK_CATALOG, type ApiCatalog, type ApiEndpoint } from "../data/api-catalog";

interface TestState {
  loading: boolean;
  status: number | null;
  durationMs: number | null;
  response: unknown;
  url: string;
}

const initialTestState: TestState = {
  loading: false,
  status: null,
  durationMs: null,
  response: null,
  url: "",
};

function buildUrl(endpoint: ApiEndpoint, values: Record<string, string>): string {
  const params = new URLSearchParams();
  for (const p of endpoint.parameters) {
    const v = values[p.name];
    if (v && v.trim()) params.set(p.name, v.trim());
  }
  const qs = params.toString();
  return qs ? `${endpoint.path}?${qs}` : endpoint.path;
}

function syntaxHighlight(json: string): string {
  return json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("(\\u[\dA-Fa-f]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
      (match: string) => {
        let cls = "text-amber-300"; // number
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? "text-sky-300" : "text-emerald-300";
        } else if (/true|false/.test(match)) {
          cls = "text-pink-300";
        } else if (/null/.test(match)) {
          cls = "text-rose-300";
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
}

function EndpointCard({ endpoint }: { endpoint: ApiEndpoint }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [state, setState] = useState<TestState>(initialTestState);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedRes, setCopiedRes] = useState(false);

  const url = useMemo(() => buildUrl(endpoint, values), [endpoint, values]);

  const run = async () => {
    const missing = endpoint.parameters
      .filter((p) => p.required && !(values[p.name] && values[p.name].trim()))
      .map((p) => p.name);
    if (missing.length) {
      toast.error(`الحقول المطلوبة: ${missing.join(", ")}`);
      return;
    }
    setState({ ...initialTestState, loading: true, url });
    const t0 = performance.now();
    try {
      const r = await fetch(url, { method: endpoint.method });
      const t1 = performance.now();
      const txt = await r.text();
      let parsed: unknown = txt;
      try {
        parsed = JSON.parse(txt);
      } catch {
        /* keep raw */
      }
      setState({
        loading: false,
        status: r.status,
        durationMs: Math.round(t1 - t0),
        response: parsed,
        url,
      });
    } catch (err) {
      setState({
        loading: false,
        status: 0,
        durationMs: Math.round(performance.now() - t0),
        response: { error: err instanceof Error ? err.message : String(err) },
        url,
      });
    }
  };

  const copy = async (text: string, which: "url" | "res") => {
    try {
      await navigator.clipboard.writeText(text);
      if (which === "url") {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 1500);
      } else {
        setCopiedRes(true);
        setTimeout(() => setCopiedRes(false), 1500);
      }
      toast.success("تم النسخ");
    } catch {
      toast.error("فشل النسخ");
    }
  };

  const statusColor =
    state.status === null
      ? "text-gray-400"
      : state.status >= 200 && state.status < 300
      ? "text-emerald-400"
      : "text-rose-400";

  const formattedResponse =
    state.response === null
      ? ""
      : typeof state.response === "string"
      ? state.response
      : JSON.stringify(state.response, null, 2);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl overflow-hidden"
    >
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {endpoint.method}
            </span>
            <code className="text-blue-300 text-sm font-mono truncate">{endpoint.path}</code>
          </div>
          {endpoint.description && (
            <p className="text-gray-400 text-sm mt-2">{endpoint.description}</p>
          )}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-semibold transition-colors"
        >
          <Play className="w-4 h-4" />
          Test
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-t border-gray-700/50 p-5 space-y-4 bg-black/20"
        >
          {endpoint.parameters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {endpoint.parameters.map((p) => (
                <div key={p.name}>
                  <label className="block text-xs text-gray-300 mb-1">
                    <span className="font-mono text-blue-300">{p.name}</span>
                    {p.required && <span className="text-rose-400 ml-1">*</span>}
                    {p.description && (
                      <span className="text-gray-500 ml-2">{p.description}</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={values[p.name] || ""}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [p.name]: e.target.value }))
                    }
                    placeholder={p.name}
                    className="w-full px-3 py-2 rounded-lg bg-gray-900/70 border border-gray-700 text-gray-100 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">لا توجد معاملات لهذا الـ endpoint.</p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={run}
              disabled={state.loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-sm font-semibold"
            >
              {state.loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Run
            </button>
            <button
              onClick={() => copy(window.location.origin + url, "url")}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs"
            >
              {copiedUrl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              Copy URL
            </button>
            {state.response !== null && (
              <button
                onClick={() => copy(formattedResponse, "res")}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs"
              >
                {copiedRes ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                Copy Response
              </button>
            )}
            <code className="text-gray-500 text-xs font-mono truncate ml-auto">{url}</code>
          </div>

          {(state.status !== null || state.loading) && (
            <div className="rounded-xl border border-gray-700/60 bg-black/40 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-700/60 text-xs">
                <span className={`font-bold ${statusColor}`}>
                  {state.status === null ? "..." : state.status}
                </span>
                {state.durationMs !== null && (
                  <span className="text-gray-400">{state.durationMs} ms</span>
                )}
              </div>
              <pre
                className="text-xs p-4 overflow-x-auto max-h-96 font-mono text-gray-200"
                dangerouslySetInnerHTML={{
                  __html: state.loading
                    ? '<span class="text-gray-400">جاري التنفيذ...</span>'
                    : syntaxHighlight(formattedResponse || '""'),
                }}
              />
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export function DocsPage() {
  const [catalog, setCatalog] = useState<ApiCatalog>(FALLBACK_CATALOG);
  const [total, setTotal] = useState<number>(
    Object.values(FALLBACK_CATALOG).reduce((n, c) => n + c.length, 0)
  );
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState<string>("all");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/list");
        if (!r.ok) throw new Error("list failed");
        const data = (await r.json()) as { categories: ApiCatalog; totalEndpoints: number };
        if (!cancelled && data?.categories) {
          setCatalog(data.categories);
          setTotal(data.totalEndpoints);
        }
      } catch {
        // fallback already set
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = Object.keys(catalog);
  const visible: [string, ApiEndpoint[]][] =
    activeCat === "all"
      ? Object.entries(catalog)
      : Object.entries(catalog).filter(([c]) => c === activeCat);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs mb-4">
            <Server className="w-3 h-3" />
            Unified Dispatcher · One Serverless Function
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            API <span className="text-blue-400">Documentation</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            استكشف واختبر جميع الـ endpoints مباشرة من المتصفح.
          </p>
          <div className="flex items-center justify-center gap-3 mt-5 text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-800/60 border border-gray-700 text-gray-300">
              <Code2 className="w-3.5 h-3.5" /> {total} endpoint{total === 1 ? "" : "s"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-800/60 border border-gray-700 text-gray-300">
              <Zap className="w-3.5 h-3.5" /> {categories.length} categories
            </span>
            {loading && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-800/60 border border-gray-700 text-gray-400">
                <Loader2 className="w-3 h-3 animate-spin" /> loading…
              </span>
            )}
          </div>
        </motion.div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setActiveCat("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              activeCat === "all"
                ? "bg-blue-500/20 border-blue-500/50 text-blue-200"
                : "bg-gray-800/60 border-gray-700 text-gray-300 hover:bg-gray-700/60"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors capitalize ${
                activeCat === c
                  ? "bg-blue-500/20 border-blue-500/50 text-blue-200"
                  : "bg-gray-800/60 border-gray-700 text-gray-300 hover:bg-gray-700/60"
              }`}
            >
              {c} ({catalog[c]?.length || 0})
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {visible.map(([cat, items]) => (
            <section key={cat}>
              <h2 className="text-xl font-bold text-white capitalize mb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                {cat}
                <span className="text-xs text-gray-500 font-normal">({items.length})</span>
              </h2>
              <div className="space-y-3">
                {items.map((ep) => (
                  <EndpointCard key={`${ep.category}/${ep.name}`} endpoint={ep} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DocsPage;

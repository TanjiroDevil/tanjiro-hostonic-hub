const axios = require("axios");

class SaanviAI {
  constructor() {
    this.url = "https://ai.riple.org/";
    this.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    };
  }

  async chat(text) {
    const r = await axios.post(
      this.url,
      { messages: [{ content: text, role: "user" }] },
      { headers: this.headers, responseType: "stream", timeout: 30000 }
    );
    return new Promise((resolve, reject) => {
      let full = "";
      let done = false;
      r.data.on("data", (chunk) => {
        const lines = chunk.toString().split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const s = line.slice(6).trim();
          if (s === "[DONE]") {
            if (!done) { done = true; resolve(full.trim()); }
            return;
          }
          try {
            const c = JSON.parse(s)?.choices?.[0]?.delta?.content;
            if (c) full += c;
          } catch {}
        }
      });
      r.data.on("end", () => { if (!done) { done = true; resolve(full.trim()); } });
      r.data.on("error", (e) => { if (!done) { done = true; reject(e); } });
    });
  }
}

module.exports = {
  description: "Saanvi AI chat (streaming aggregated).",
  method: "GET",
  parameters: [{ name: "q", required: true, description: "النص." }],
  handler: async (req, res) => {
    const q = req.query || {};
    const text = q.q || q.text || q.prompt;
    if (!text) return res.status(200).json({ status: "active", usage: "/api/ai/saanvi?q=hi" });
    try {
      const answer = await new SaanviAI().chat(text);
      return res.status(200).json({ status: true, results: { answer } });
    } catch (e) {
      return res.status(500).json({ status: false, error: "SAANVI_ERROR", message: e.message });
    }
  },
};

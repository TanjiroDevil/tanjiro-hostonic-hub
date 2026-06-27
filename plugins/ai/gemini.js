const axios = require("axios");

class GeminiAPI {
  constructor() {
    this.baseUrl =
      "https://us-central1-infinite-chain-295909.cloudfunctions.net/gemini-proxy-staging-v1";
    this.headers = {
      "accept": "*/*",
      "content-type": "application/json",
      "user-agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
    };
  }

  async getData(imageUrl) {
    try {
      const r = await axios.get(imageUrl.trim(), {
        responseType: "arraybuffer",
        timeout: 25000,
      });
      return {
        inline_data: {
          mime_type: r.headers["content-type"] || "image/jpeg",
          data: Buffer.from(r.data, "binary").toString("base64"),
        },
      };
    } catch {
      return null;
    }
  }

  async chat({ prompt, imageUrl = null }) {
    const parts = [];
    if (imageUrl) {
      const urls = Array.isArray(imageUrl) ? imageUrl : [imageUrl];
      for (const url of urls) {
        if (url) {
          const p = await this.getData(url);
          if (p) parts.push(p);
        }
      }
    }
    parts.push({ text: prompt });
    const r = await axios.post(
      this.baseUrl,
      { contents: [{ parts }] },
      { headers: this.headers, timeout: 30000 }
    );
    return r.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  }
}

module.exports = {
  description: "Gemini AI chat (يدعم prompt + imageUrl اختياري).",
  method: "GET",
  parameters: [
    { name: "prompt", required: true, description: "النص المطلوب من النموذج." },
    { name: "imageUrl", required: false, description: "رابط صورة (أو قائمة مفصولة بفواصل)." },
  ],
  handler: async (req, res) => {
    const q = req.query || {};
    let { prompt, imageUrl } = q;
    if (!prompt) {
      return res.status(200).json({
        api: "Gemini AI Chat",
        status: "online",
        usage: "/api/ai/gemini?prompt=hello",
      });
    }
    try {
      if (typeof imageUrl === "string" && imageUrl.includes(","))
        imageUrl = imageUrl.split(",");
      const out = await new GeminiAPI().chat({ prompt, imageUrl });
      if (!out) throw new Error("Empty response from Gemini");
      return res.status(200).json({ status: "success", response: out });
    } catch (e) {
      return res.status(500).json({ status: "error", message: e.message });
    }
  },
};

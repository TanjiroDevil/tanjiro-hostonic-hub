const axios = require("axios");
const cheerio = require("cheerio");
const FormData = require("form-data");

class ChatGPT4O {
  constructor() {
    this.getHeaders = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    };
  }
  rand(n) {
    const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let s = "";
    for (let i = 0; i < n; i++) s += c.charAt(Math.floor(Math.random() * c.length));
    return s;
  }
  async getNonce() {
    const { data } = await axios.get("https://chatgpt4o.one/", { headers: this.getHeaders });
    const $ = cheerio.load(data);
    return $("div.wpaicg-chat-shortcode").attr("data-nonce") || null;
  }
  async chat(msg) {
    const nonce = await this.getNonce();
    if (!nonce) throw new Error("Failed to get nonce");
    const fd = new FormData();
    fd.append("_wpnonce", nonce);
    fd.append("post_id", 11);
    fd.append("url", "https://chatgpt4o.one/");
    fd.append("action", "wpaicg_chat_shortcode_message");
    fd.append("message", msg);
    fd.append("bot_id", 0);
    fd.append("chatbot_identity", "shortcode");
    fd.append("wpaicg_chat_history", JSON.stringify([]));
    fd.append("wpaicg_chat_client_id", this.rand(10));
    const { data } = await axios.post(
      "https://chatgpt4o.one/wp-admin/admin-ajax.php",
      fd,
      {
        headers: {
          ...fd.getHeaders(),
          Origin: "https://chatgpt4o.one",
          Referer: "https://chatgpt4o.one/",
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );
    return data;
  }
}

module.exports = {
  description: "ChatGPT-4o proxy (chatgpt4o.one scraper).",
  method: "GET",
  parameters: [{ name: "q", required: true, description: "السؤال." }],
  handler: async (req, res) => {
    const q = req.query || {};
    const prompt = q.q || q.prompt || q.text;
    if (!prompt) return res.status(200).json({ status: "active", usage: "/api/ai/gpt4?q=hi" });
    try {
      const out = await new ChatGPT4O().chat(prompt);
      return res.status(200).json({ status: true, results: out });
    } catch (e) {
      return res.status(500).json({ status: false, error: "GPT_ERROR", message: e.message });
    }
  },
};

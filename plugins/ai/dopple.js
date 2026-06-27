const axios = require("axios");

class DoppleScraper {
  constructor() {
    this.url = "https://beta.dopple.ai/api/messages/send";
    this.headers = {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
      Referer: "https://beta.dopple.ai/messages",
    };
  }

  async chat(prompt) {
    const r = await axios.post(
      this.url,
      {
        streamMode: "none",
        chatId: "632cef078c294913b5b4653869eca845",
        folder: "",
        images: false,
        username: "mn0uvp2fhv",
        persona_name: "DoppleAI",
        id: "46db0561-cb3e-43d9-8f50-40b3e3c84713",
        userQuery: `Answer in Arabic: ${prompt}`,
      },
      { headers: this.headers, timeout: 25000 }
    );
    if (!r.data || !r.data.response) throw new Error("Empty response from DoppleAI");
    return String(r.data.response).replace(/\(.*?\)/g, "").trim();
  }
}

module.exports = {
  description: "DoppleAI chat scraper.",
  method: "GET",
  parameters: [{ name: "q", required: true, description: "السؤال أو الرسالة." }],
  handler: async (req, res) => {
    const q = req.query || {};
    const prompt = q.q || q.prompt || q.text;
    if (!prompt)
      return res.status(200).json({
        status: "active",
        engine: "DoppleAI",
        usage: "/api/ai/dopple?q=hello",
      });
    try {
      const answer = await new DoppleScraper().chat(prompt);
      return res.status(200).json({ status: true, results: { answer } });
    } catch (e) {
      return res.status(500).json({ status: false, error: "DOPPLE_ERROR", message: e.message });
    }
  },
};

const axios = require("axios");

class OpenAI {
  constructor() {
    this.endpoint =
      "https://yw85opafq6.execute-api.us-east-1.amazonaws.com/default/boss_mode_15aug";
    this.headers = {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 11; Infinix) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.0.0 Mobile Safari/537.36",
      Referer: "https://www.ai4chat.co/pages/riddle-generator",
    };
  }
  async chat(prompt) {
    const r = await axios.get(this.endpoint, {
      params: { text: prompt, country: "Europe", user_id: "Av0SkyG00D" },
      headers: this.headers,
      timeout: 15000,
    });
    if (r.status !== 200) throw new Error("Failed AI fetch");
    return r.data;
  }
}

module.exports = {
  description: "AI4Chat OpenAI proxy.",
  method: "GET",
  parameters: [{ name: "q", required: true, description: "السؤال." }],
  handler: async (req, res) => {
    const q = req.query || {};
    const prompt = q.q || q.prompt || q.text;
    if (!prompt)
      return res.status(200).json({ status: "active", usage: "/api/ai/openai?q=hi" });
    try {
      const answer = await new OpenAI().chat(prompt);
      return res.status(200).json({ status: true, results: { answer } });
    } catch (e) {
      return res.status(500).json({ status: false, error: "AI_ERROR", message: e.message });
    }
  },
};

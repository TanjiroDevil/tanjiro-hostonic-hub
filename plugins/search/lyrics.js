const axios = require("axios");
const https = require("https");

class LyricsScraper {
  constructor() {
    this.baseUrl = "https://lrclib.net/api/search";
    this.headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "application/json",
      "lrclib-client": "LRCLIB-Web-Client",
    };
  }
  clean(raw) {
    if (!raw) return null;
    return String(raw)
      .replace(/\[?\d{1,2}:\d{2}(?:[:.]\d{1,3})?\]?/g, "")
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/\r/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
  async fetch(query) {
    const r = await axios.get(this.baseUrl, {
      params: { q: query },
      headers: this.headers,
      timeout: 15000,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });
    const results = r.data;
    if (!results || !results.length) throw new Error("Lyrics not found");
    const s = results[0];
    const cleaned = this.clean(s.plainLyrics || s.syncedLyrics || s.lyrics);
    if (!cleaned) throw new Error("Lyrics empty");
    return {
      status: true,
      title: s.trackName,
      artist: s.artistName,
      lyrics: cleaned,
      thumbnail: s.albumArtUrl || null,
    };
  }
}

module.exports = {
  description: "البحث عن كلمات الأغاني عبر LRCLIB.",
  method: "GET",
  parameters: [{ name: "q", required: true, description: "اسم الأغنية أو الفنان." }],
  handler: async (req, res) => {
    const q = req.query || {};
    const query = q.q || q.query;
    if (!query)
      return res.status(200).json({ status: "active", usage: "/api/search/lyrics?q=Perfect" });
    try {
      const data = await new LyricsScraper().fetch(query);
      return res.status(200).json({ results: data });
    } catch (e) {
      return res.status(500).json({ status: false, error: "Scraper Error", message: e.message });
    }
  },
};

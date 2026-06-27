const axios = require("axios");

class TikTokSearcher {
  constructor() {
    this.apiUrl = "https://tikwm.com/api/feed/search";
    this.headers = {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Cookie: "current_language=en",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
    };
  }
  async search(query) {
    const params = new URLSearchParams({ keywords: query, count: "10", cursor: "0", HD: "1" });
    const r = await axios.post(this.apiUrl, params, { headers: this.headers, timeout: 15000 });
    const videos = r.data?.data?.videos || [];
    if (!videos.length) throw new Error("لم يتم العثور على فيديوهات.");
    return videos.map((v) => ({
      title: v.title,
      thumbnail: v.cover,
      author: { username: v.author.unique_id, nickname: v.author.nickname, avatar: v.author.avatar },
      links: {
        video: `https://www.tiktok.com/@${v.author.unique_id}/video/${v.video_id}`,
        no_watermark: v.play,
        watermark: v.wmplay,
        music: v.music,
      },
      stats: {
        views: v.play_count,
        likes: v.digg_count,
        comments: v.comment_count || 0,
        shares: v.share_count || 0,
      },
      created_at: new Date(v.create_time * 1000).toISOString(),
    }));
  }
}

module.exports = {
  description: "البحث عن فيديوهات TikTok.",
  method: "GET",
  parameters: [{ name: "q", required: true, description: "الكلمة المفتاحية." }],
  handler: async (req, res) => {
    const q = req.query || {};
    const query = q.q || q.query;
    if (!query)
      return res.status(200).json({ status: "active", usage: "/api/search/tiktok?q=cats" });
    try {
      const results = await new TikTokSearcher().search(query);
      return res.status(200).json({ status: true, results });
    } catch (e) {
      return res.status(500).json({ status: false, error: "SEARCH_ERROR", message: e.message });
    }
  },
};

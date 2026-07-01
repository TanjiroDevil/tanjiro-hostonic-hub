// Spotify track search using anonymous token from open.spotify.com
const axios = require("axios");

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAnonToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) return cachedToken;
  const r = await axios.get(
    "https://open.spotify.com/get_access_token?reason=transport&productType=web_player",
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        Accept: "application/json",
      },
      timeout: 15000,
    }
  );
  cachedToken = r.data.accessToken;
  tokenExpiresAt = r.data.accessTokenExpirationTimestampMs || Date.now() + 30 * 60_000;
  return cachedToken;
}

module.exports = {
  description: "Spotify tracks search (name/artist).",
  method: "GET",
  parameters: [
    { name: "q", required: true, description: "كلمة البحث (اسم الأغنية)." },
    { name: "artist", required: false, description: "اسم الفنان لتضييق النتائج." },
    { name: "limit", required: false, description: "عدد النتائج (1-50). الافتراضي 10." },
  ],
  handler: async (req, res) => {
    const q = (req.query && (req.query.q || req.query.query)) || "";
    const artist = (req.query && req.query.artist) || "";
    const limit = Math.min(Math.max(parseInt(req.query?.limit || "10", 10) || 10, 1), 50);
    if (!q || !q.trim()) {
      return res.status(200).json({
        title: "Spotify Search",
        status: "Online",
        usage: "/api/search/spot?q=NAME&artist=OPTIONAL&limit=10",
      });
    }
    try {
      const token = await getAnonToken();
      let query = q.trim();
      if (artist && artist.trim()) query += ` artist:${artist.trim()}`;
      const r = await axios.get("https://api.spotify.com/v1/search", {
        params: { q: query, type: "track", limit },
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000,
      });
      const items = r.data?.tracks?.items || [];
      const tracks = items.map((t) => ({
        id: t.id,
        name: t.name,
        artist: (t.artists || []).map((a) => a.name).join(", "),
        url: t.external_urls?.spotify || `https://open.spotify.com/track/${t.id}`,
        image: t.album?.images?.[0]?.url || "",
        duration_ms: t.duration_ms || 0,
      }));
      return res.status(200).json({
        status: "success",
        total_results: r.data?.tracks?.total || tracks.length,
        tracks,
        dev: "Tanjiro ✨",
      });
    } catch (e) {
      return res.status(500).json({
        status: "error",
        message: e.message || String(e),
      });
    }
  },
};

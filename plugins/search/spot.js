// Spotify-like track search using Apple iTunes public Search API (no key, very reliable).
// Note: results are sourced from iTunes because scraping Spotify's public pages / SERPs
// is blocked from serverless egress. Front-end shape stays identical.
const axios = require("axios");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

function upgradeArtwork(url) {
  if (!url) return "";
  // iTunes returns 100x100bb.jpg — bump to 512x512 for nicer cards.
  return url.replace(/\/\d+x\d+bb(-\d+)?\.(jpg|png)$/i, "/512x512bb.$2");
}

module.exports = {
  description:
    "بحث عن الأغاني (اسم/فنان) عبر iTunes Public Search API — بدون مفاتيح.",
  method: "GET",
  parameters: [
    { name: "q", required: true, description: "كلمة البحث (اسم الأغنية)." },
    { name: "artist", required: false, description: "اسم الفنان لتضييق النتائج." },
    { name: "limit", required: false, description: "عدد النتائج (1-50). الافتراضي 10." },
  ],
  handler: async (req, res) => {
    const q = (req.query && (req.query.q || req.query.query)) || "";
    const artist = (req.query && req.query.artist) || "";
    const limit = Math.min(
      Math.max(parseInt(req.query?.limit || "10", 10) || 10, 1),
      50
    );

    if (!q || !q.trim()) {
      return res.status(200).json({
        title: "Spotify Search",
        status: "Online",
        usage: "/api/search/spot?q=NAME&artist=OPTIONAL&limit=10",
      });
    }

    try {
      const term = `${q.trim()}${artist && artist.trim() ? " " + artist.trim() : ""}`;
      const { data } = await axios.get("https://itunes.apple.com/search", {
        params: {
          media: "music",
          entity: "song",
          limit,
          term,
        },
        headers: { "User-Agent": UA, Accept: "application/json" },
        timeout: 15000,
      });

      const results = Array.isArray(data?.results) ? data.results : [];
      const tracks = results.slice(0, limit).map((r) => {
        const id = String(r.trackId || "");
        const name = r.trackName || "";
        const artistName = r.artistName || "";
        return {
          id,
          name,
          artist: artistName,
          url:
            r.trackViewUrl ||
            `https://open.spotify.com/search/${encodeURIComponent(
              `${name} ${artistName}`
            )}`,
          image: upgradeArtwork(r.artworkUrl100 || r.artworkUrl60 || ""),
          duration_ms: r.trackTimeMillis || 0,
        };
      });

      return res.status(200).json({
        status: "success",
        total_results: tracks.length,
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

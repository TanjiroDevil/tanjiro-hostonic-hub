// Spotify track search (no token) — DuckDuckGo → open.spotify.com/track/{id} → OG metadata
const axios = require("axios");

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

function pick(re, html) {
  const m = html.match(re);
  return m ? m[1] : "";
}

async function fetchTrack(id) {
  try {
    const { data: html } = await axios.get(
      `https://open.spotify.com/embed/track/${id}`,
      {
        headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
        timeout: 15000,
      }
    );
    // Embed page contains an inline JSON blob with track metadata.
    const nameMatch = html.match(/"name":"([^"]+)","uri":"spotify:track:/);
    const artistsMatch = html.match(/"artists":\[([^\]]+)\]/);
    const durationMatch = html.match(/"duration":(\d+)/);
    const coverMatch = html.match(/"url":"(https:\/\/(?:i\.scdn\.co|image-cdn[^"/]*\.spotifycdn\.com)\/image\/[^"]+)"/);
    if (!nameMatch) return null;
    const artistNames = [];
    if (artistsMatch) {
      const re = /"name":"([^"]+)"/g;
      let m;
      while ((m = re.exec(artistsMatch[1])) !== null) artistNames.push(m[1]);
    }
    return {
      id,
      name: nameMatch[1],
      artist: artistNames.join(", "),
      url: `https://open.spotify.com/track/${id}`,
      image: coverMatch ? coverMatch[1] : "",
      duration_ms: durationMatch ? parseInt(durationMatch[1], 10) : 0,
    };
  } catch {
    return null;
  }
}

module.exports = {
  description: "Spotify tracks search (name/artist) via public search — no API keys.",
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
      const query = `${q.trim()}${artist && artist.trim() ? " " + artist.trim() : ""}`;
      const searchUrl = `https://search.yahoo.com/search?p=${encodeURIComponent(
        query + " site:open.spotify.com/track"
      )}&n=${Math.min(limit * 3, 50)}`;
      const { data: sHtml } = await axios.get(searchUrl, {
        headers: {
          "User-Agent": UA,
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
        },
        timeout: 20000,
        maxRedirects: 5,
      });
      const ids = [];
      const seen = new Set();
      const re = /open\.spotify\.com(?:%2[fF]|\/)track(?:%2[fF]|\/)([a-zA-Z0-9]{22})/g;
      let m;
      while ((m = re.exec(sHtml)) !== null) {
        if (!seen.has(m[1])) {
          seen.add(m[1]);
          ids.push(m[1]);
          if (ids.length >= limit) break;
        }
      }
      if (ids.length === 0) {
        return res.status(200).json({
          status: "success",
          total_results: 0,
          tracks: [],
          dev: "Tanjiro ✨",
        });
      }
      const tracks = (await Promise.all(ids.map(fetchTrack))).filter(Boolean);
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

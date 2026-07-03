// Spotify → SaveTube MP3 downloader (CommonJS for unified dispatcher)
const axios = require("axios");
const crypto = require("crypto");

class SaveTubeEngine {
  constructor() {
    this.ky = "C5D58EF67A7584E4A29F6C35BBC4EB12";
    this.m =
      /^((?:https?:)?\/\/)?((?:www|m|music)\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?(?:v\/)?(?:shorts\/)?([a-zA-Z0-9_-]{11})/;
    this.is = axios.create({
      headers: {
        "content-type": "application/json",
        origin: "https://yt.savetube.me",
        "user-agent": "Mozilla/5.0 (Android 15; Mobile)",
      },
      timeout: 20000,
    });
  }

  async decrypt(enc) {
    const buf = Buffer.from(enc, "base64");
    const key = Buffer.from(this.ky, "hex");
    const iv = buf.slice(0, 16);
    const data = buf.slice(16);
    const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return JSON.parse(decrypted.toString());
  }

  async getCdn() {
    const res = await this.is.get("https://media.savetube.vip/api/random-cdn");
    return { status: true, data: res.data.cdn };
  }

  async getDownloadUrl(youtubeUrl) {
    const id = youtubeUrl.match(this.m)?.[3];
    if (!id) throw new Error("رابط يوتيوب غير صالح");
    const cdn = await this.getCdn();
    const info = await this.is.post(`https://${cdn.data}/v2/info`, {
      url: `https://www.youtube.com/watch?v=${id}`,
    });
    const dec = await this.decrypt(info.data.data);
    const dl = await this.is.post(`https://${cdn.data}/download`, {
      id,
      downloadType: "audio",
      quality: "128",
      key: dec.key,
    });
    return dl.data.data.downloadUrl;
  }
}

const UA_DL =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

async function findYouTubeId(query) {
  // 1) Direct YouTube results page (works from serverless IPs).
  try {
    const yt = await axios.get(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      {
        headers: {
          "User-Agent": UA_DL,
          "Accept-Language": "en-US,en;q=0.9",
        },
        timeout: 15000,
      }
    );
    const m = yt.data.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
    if (m) return m[1];
  } catch {}
  // 2) Fallback: Yahoo SERP.
  try {
    const y = await axios.get(
      `https://search.yahoo.com/search?p=${encodeURIComponent(
        query + " site:youtube.com"
      )}&n=10`,
      {
        headers: { "User-Agent": UA_DL, "Accept-Language": "en-US,en;q=0.9" },
        timeout: 15000,
      }
    );
    const m = y.data.match(
      /(?:watch%3[fF]v%3[dD]|watch\?v=)([a-zA-Z0-9_-]{11})/
    );
    if (m) return m[1];
  } catch {}
  return "";
}

async function metadataFromSpotify(trackId) {
  try {
    const r = await axios.get(
      `https://open.spotify.com/embed/track/${trackId}`,
      {
        headers: { "User-Agent": UA_DL, "Accept-Language": "en-US,en;q=0.9" },
        timeout: 15000,
      }
    );
    const html = r.data;
    const nameMatch = html.match(/"name":"([^"]+)","uri":"spotify:track:/);
    const artistsMatch = html.match(/"artists":\[([^\]]+)\]/);
    const coverMatch = html.match(
      /"url":"(https:\/\/(?:i\.scdn\.co|image-cdn[^"/]*\.spotifycdn\.com)\/image\/[^"]+)"/
    );
    if (!nameMatch) return null;
    const artistNames = [];
    if (artistsMatch) {
      const re = /"name":"([^"]+)"/g;
      let mm;
      while ((mm = re.exec(artistsMatch[1])) !== null) artistNames.push(mm[1]);
    }
    return {
      title: nameMatch[1],
      artist: artistNames.join(", "),
      cover: coverMatch ? coverMatch[1] : "",
    };
  } catch {
    return null;
  }
}

module.exports = {
  description:
    "تحميل أغنية كـ MP3 عبر محرك SaveTube. يقبل title+artist (مفضّل) أو رابط/ID أغنية Spotify.",
  method: "GET",
  parameters: [
    { name: "title", required: false, description: "اسم الأغنية." },
    { name: "artist", required: false, description: "اسم الفنان." },
    { name: "url", required: false, description: "رابط أو ID أغنية Spotify." },
  ],
  handler: async (req, res) => {
    let queryParams = req.query || {};
    if (req.url && Object.keys(queryParams).length === 0) {
      try {
        const urlObj = new URL(
          req.url,
          `http://${req.headers?.host || "localhost"}`
        );
        queryParams = Object.fromEntries(urlObj.searchParams.entries());
      } catch (e) {}
    }
    let body = req.body || {};
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {}
    }

    const title = (queryParams.title || body.title || "").toString().trim();
    const artist = (queryParams.artist || body.artist || "").toString().trim();
    const trackUrl = (
      queryParams.url ||
      body.url ||
      queryParams.id ||
      body.id ||
      ""
    )
      .toString()
      .trim();

    if (!title && !trackUrl) {
      return res.status(200).json({
        title: "Spotify SaveTube MP3 Downloader API",
        status: "Online ✅",
        usage: "?title=NAME&artist=OPTIONAL   أو   ?url=SPOTIFY_URL",
        dev: "Tanjiro ✨",
      });
    }

    try {
      let finalTitle = title;
      let finalArtist = artist;
      let cover = "";

      if (!finalTitle && trackUrl) {
        const idMatch = trackUrl.match(/track[/:]([a-zA-Z0-9]{22})/);
        const trackId = idMatch
          ? idMatch[1]
          : /^[a-zA-Z0-9]{22}$/.test(trackUrl)
          ? trackUrl
          : "";
        if (!trackId) {
          return res.status(400).json({
            status: "error",
            message: "أدخل title أو رابط/ID أغنية Spotify صالح.",
          });
        }
        const meta = await metadataFromSpotify(trackId);
        if (!meta) {
          return res.status(400).json({
            status: "error",
            message: "فشل استخراج بيانات الأغنية من Spotify.",
          });
        }
        finalTitle = meta.title;
        finalArtist = meta.artist;
        cover = meta.cover;
      }

      const searchQuery = `${finalTitle} ${finalArtist} audio`.trim();
      const videoId = await findYouTubeId(searchQuery);
      if (!videoId) {
        return res
          .status(404)
          .json({ status: "error", message: "الأغنية غير متاحة حالياً." });
      }

      const youtubeVideoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const st = new SaveTubeEngine();
      const finalMp3Url = await st.getDownloadUrl(youtubeVideoUrl);
      if (!finalMp3Url) throw new Error("فشل توليد رابط التحميل.");

      return res.status(200).json({
        status: "success",
        title: finalTitle,
        artist: finalArtist,
        image: cover,
        youtube_source: youtubeVideoUrl,
        download_url: finalMp3Url,
        dev: "Tanjiro ✨",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.message || String(error) });
    }
  },
};

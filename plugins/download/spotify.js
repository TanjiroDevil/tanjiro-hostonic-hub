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

module.exports = {
  description:
    "تحميل أغنية Spotify كـ MP3 عبر محرك SaveTube (يدعم رابط الأغنية أو الـ ID).",
  method: "GET",
  parameters: [
    { name: "url", required: true, description: "رابط أو ID أغنية Spotify." },
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

    const trackUrl =
      queryParams.url || body.url || queryParams.id || body.id;

    if (!trackUrl || String(trackUrl).trim().length === 0) {
      return res.status(200).json({
        title: "Spotify SaveTube MP3 Downloader API",
        status: "Online ✅",
        usage: "?url=SPOTIFY_URL",
        dev: "Tanjiro ✨",
      });
    }

    try {
      let targetUrl = String(trackUrl).trim();
      let trackId = "";
      const idMatch = targetUrl.match(/track[/:]([a-zA-Z0-9]{22})/);
      if (idMatch) {
        trackId = idMatch[1];
      } else if (/^[a-zA-Z0-9]{22}$/.test(targetUrl)) {
        trackId = targetUrl;
      }
      if (!trackId) {
        return res.status(400).json({
          status: "error",
          message: "رابط أو ID أغنية Spotify غير صالح.",
        });
      }

      const UA =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

      // Use embed page (reliable, no auth) to extract metadata
      const embedRes = await axios.get(
        `https://open.spotify.com/embed/track/${trackId}`,
        {
          headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
          timeout: 15000,
        }
      );
      const htmlText = embedRes.data;
      const nameMatch = htmlText.match(/"name":"([^"]+)","uri":"spotify:track:/);
      const artistsMatch = htmlText.match(/"artists":\[([^\]]+)\]/);
      const coverMatch = htmlText.match(
        /"url":"(https:\/\/(?:i\.scdn\.co|image-cdn[^"/]*\.spotifycdn\.com)\/image\/[^"]+)"/
      );

      if (!nameMatch) {
        return res
          .status(400)
          .json({ status: "error", message: "فشل استخراج بيانات الأغنية." });
      }

      const title = nameMatch[1];
      const artistNames = [];
      if (artistsMatch) {
        const re = /"name":"([^"]+)"/g;
        let mm;
        while ((mm = re.exec(artistsMatch[1])) !== null) artistNames.push(mm[1]);
      }
      const artist = artistNames.join(", ");
      const cover = coverMatch ? coverMatch[1] : "";

      // Find YouTube video via Yahoo (DDG returns 403/429 often)
      const searchQuery = `${title} ${artist} audio`;
      const ytSearchRes = await axios.get(
        `https://search.yahoo.com/search?p=${encodeURIComponent(
          searchQuery + " site:youtube.com"
        )}&n=10`,
        {
          headers: {
            "User-Agent": UA,
            Accept: "text/html,application/xhtml+xml",
            "Accept-Language": "en-US,en;q=0.9",
          },
          timeout: 15000,
        }
      );
      const ytHtml = ytSearchRes.data;
      const ytUrlMatch = ytHtml.match(/(?:watch%3[fF]v%3[dD]|watch\?v=)([a-zA-Z0-9_-]{11})/);
      if (!ytUrlMatch) {
        return res
          .status(404)
          .json({ status: "error", message: "الأغنية غير متاحة حالياً." });
      }

      const youtubeVideoUrl = `https://www.youtube.com/watch?v=${ytUrlMatch[1]}`;
      const st = new SaveTubeEngine();
      const finalMp3Url = await st.getDownloadUrl(youtubeVideoUrl);
      if (!finalMp3Url) throw new Error("فشل توليد رابط التحميل.");

      return res.status(200).json({
        status: "success",
        title,
        artist,
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

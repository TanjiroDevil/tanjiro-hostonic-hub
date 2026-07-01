// Spotify → SaveTube MP3 download engine (CommonJS for dispatcher)
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
    return res.data.cdn;
  }

  async getDownloadUrl(youtubeUrl) {
    const id = youtubeUrl.match(this.m)?.[3];
    if (!id) throw new Error("رابط يوتيوب غير صالح");
    const cdn = await this.getCdn();
    const info = await this.is.post(`https://${cdn}/v2/info`, {
      url: `https://www.youtube.com/watch?v=${id}`,
    });
    const dec = await this.decrypt(info.data.data);
    const dl = await this.is.post(`https://${cdn}/download`, {
      id,
      downloadType: "audio",
      quality: "128",
      key: dec.key,
    });
    return dl.data.data.downloadUrl;
  }
}

module.exports = {
  description: "تحميل أغنية Spotify كـ MP3 عبر محرك SaveTube.",
  method: "GET",
  parameters: [
    { name: "url", required: true, description: "رابط أو ID أغنية Spotify." },
    { name: "proxy", required: false, description: "true لبثّ الملف مباشرة." },
    { name: "mp3url", required: false, description: "رابط MP3 للبث (مع proxy=true)." },
    { name: "name", required: false, description: "اسم الملف عند البث." },
  ],
  handler: async (req, res) => {
    const q = req.query || {};

    // Proxy stream: pipe MP3 as an attachment to force download
    if ((q.proxy === "true" || q.proxy === true) && q.mp3url) {
      try {
        const upstream = await axios({
          method: "get",
          url: decodeURIComponent(q.mp3url),
          responseType: "stream",
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        });
        const name = q.name ? `${decodeURIComponent(q.name)}.mp3` : "track.mp3";
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${encodeURIComponent(name)}"`
        );
        return upstream.data.pipe(res);
      } catch (e) {
        return res
          .status(500)
          .json({ status: "error", message: "فشل بثّ ملف الصوت.", detail: e.message });
      }
    }

    const trackUrl = q.url || q.id;
    if (!trackUrl || !String(trackUrl).trim()) {
      return res.status(200).json({
        title: "Spotify SaveTube Stream Engine",
        status: "Online ✅",
        usage: "/api/download/spotify?url=SPOTIFY_TRACK_URL_OR_ID",
      });
    }

    try {
      let target = String(trackUrl).trim();
      if (!/^https?:\/\//i.test(target)) {
        target = `https://open.spotify.com/track/${target}`;
      }

      const html = (await axios.get(target, { timeout: 15000 })).data;
      const titleMatch = html.match(/(?<=:title" content=")(.*?)(?=")/gm);
      const authorMatch = html.match(/(?<=:description" content=")(.*?)(?= · )/gm);
      const coverMatch = html.match(/(?<=:image" content=")(.*?)(?=")/gm);
      if (!titleMatch || !authorMatch) {
        return res
          .status(400)
          .json({ status: "error", message: "فشل استخراج بيانات الأغنية." });
      }
      const title = titleMatch[0];
      const artist = authorMatch[0];
      const cover = coverMatch ? coverMatch[0] : "";

      const searchQuery = encodeURIComponent(`${title} ${artist} audio`);
      const ddg = await axios.get(
        `https://html.duckduckgo.com/html/?q=${searchQuery}+site%3Ayoutube.com`,
        { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }, timeout: 15000 }
      );
      const ytMatch = ddg.data.match(/watch\?v=[a-zA-Z0-9_-]{11}/);
      if (!ytMatch) {
        return res
          .status(404)
          .json({ status: "error", message: "الأغنية غير متاحة حالياً للتحميل السريع." });
      }
      const youtubeVideoUrl = `https://www.youtube.com/${ytMatch[0]}`;

      const st = new SaveTubeEngine();
      const rawMp3Url = await st.getDownloadUrl(youtubeVideoUrl);
      if (!rawMp3Url) throw new Error("فشل توليد الرابط المباشر.");

      const host = req.headers?.host || "localhost";
      const proto =
        (req.headers && (req.headers["x-forwarded-proto"] || "")) ||
        (host.startsWith("localhost") ? "http" : "https");
      const proxyDownloadUrl = `${proto}://${host}/api/download/spotify?proxy=true&name=${encodeURIComponent(
        title
      )}&mp3url=${encodeURIComponent(rawMp3Url)}`;

      return res.status(200).json({
        status: "success",
        title,
        artist,
        image: cover,
        youtube_source: youtubeVideoUrl,
        download_url: proxyDownloadUrl,
        dev: "Tanjiro ✨",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: error.message || String(error) });
    }
  },
};

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

function normalizeText(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&amp;/g, "&")
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function parseDurationSeconds(value) {
  const text = String(value || "").toLowerCase();
  const colon = text.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (colon) {
    const a = Number(colon[1]);
    const b = Number(colon[2]);
    const c = colon[3] ? Number(colon[3]) : 0;
    return colon[3] ? a * 3600 + b * 60 + c : a * 60 + b;
  }
  let total = 0;
  const hours = text.match(/(\d+)\s*hour/);
  const minutes = text.match(/(\d+)\s*minute/);
  const seconds = text.match(/(\d+)\s*second/);
  if (hours) total += Number(hours[1]) * 3600;
  if (minutes) total += Number(minutes[1]) * 60;
  if (seconds) total += Number(seconds[1]);
  return total || 0;
}

function readTextNode(node) {
  if (!node) return "";
  if (typeof node.simpleText === "string") return node.simpleText;
  if (Array.isArray(node.runs)) return node.runs.map((r) => r.text || "").join("");
  return "";
}

function extractJsonObject(source, openBraceIndex) {
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = openBraceIndex; i < source.length; i++) {
    const ch = source[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return source.slice(openBraceIndex, i + 1);
    }
  }
  return "";
}

function extractYouTubeCandidates(html) {
  const candidates = [];
  const seen = new Set();
  const marker = '"videoRenderer":';
  let cursor = 0;

  while (candidates.length < 25) {
    const markerIndex = html.indexOf(marker, cursor);
    if (markerIndex === -1) break;
    const openBrace = html.indexOf("{", markerIndex + marker.length);
    if (openBrace === -1) break;
    cursor = openBrace + 1;

    const raw = extractJsonObject(html, openBrace);
    if (!raw) continue;

    try {
      const item = JSON.parse(raw);
      const id = item.videoId;
      if (!id || seen.has(id)) continue;
      seen.add(id);

      const title = readTextNode(item.title);
      const channel =
        readTextNode(item.ownerText) ||
        readTextNode(item.longBylineText) ||
        readTextNode(item.shortBylineText);
      const durationLabel =
        readTextNode(item.lengthText) ||
        item.lengthText?.accessibility?.accessibilityData?.label ||
        "";

      if (!title) continue;
      candidates.push({
        id,
        title,
        channel,
        durationSeconds: parseDurationSeconds(durationLabel),
      });
    } catch {}
  }

  return candidates;
}

function scoreYouTubeCandidate(candidate, title, artist, durationMs) {
  const targetTitle = normalizeText(title);
  const targetArtist = normalizeText(artist);
  const haystack = normalizeText(`${candidate.title} ${candidate.channel}`);
  const titleOnly = normalizeText(candidate.title);
  let score = 0;

  if (targetTitle && titleOnly.includes(targetTitle)) score += 45;
  if (targetArtist && haystack.includes(targetArtist)) score += 30;

  for (const token of targetTitle.split(" ").filter((t) => t.length > 2)) {
    if (titleOnly.includes(token)) score += 7;
  }
  for (const token of targetArtist.split(" ").filter((t) => t.length > 2)) {
    if (haystack.includes(token)) score += 8;
  }

  if (/official audio|audio official/.test(haystack)) score += 28;
  else if (/\baudio\b/.test(haystack)) score += 16;
  if (/official visuali[sz]er|visuali[sz]er/.test(haystack)) score += 10;
  if (/lyrics?|lyric video/.test(haystack)) score += 6;
  if (targetArtist && haystack.includes(`${targetArtist} topic`)) score += 24;
  if (/vevo|official/.test(haystack)) score += 8;

  const targetDuration = Math.round((Number(durationMs) || 0) / 1000);
  if (targetDuration > 0 && candidate.durationSeconds > 0) {
    const diff = Math.abs(candidate.durationSeconds - targetDuration);
    if (diff <= 3) score += 35;
    else if (diff <= 8) score += 24;
    else if (diff <= 20) score += 12;
    else if (diff > 60) score -= 30;
  }

  const unwanted = [
    "cover",
    "karaoke",
    "instrumental",
    "reaction",
    "sped up",
    "nightcore",
    "slowed",
    "remix",
    "live",
    "1 hour",
    "loop",
  ];
  for (const word of unwanted) {
    if (haystack.includes(word) && !targetTitle.includes(word)) score -= 18;
  }
  if (candidate.durationSeconds > 900) score -= 35;

  return score;
}

async function searchYouTubeCandidates(searchQuery) {
  try {
    const yt = await axios.get(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`,
      {
        headers: {
          "User-Agent": UA_DL,
          "Accept-Language": "en-US,en;q=0.9",
        },
        timeout: 15000,
      }
    );
    const candidates = extractYouTubeCandidates(yt.data);
    if (candidates.length) return candidates;
  } catch {}
  return [];
}

async function findYouTubeId(title, artist, durationMs) {
  const queries = [
    `${artist} ${title} official audio`,
    `${artist} ${title} audio`,
    `${title} ${artist}`,
  ]
    .map((q) => q.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  for (const searchQuery of queries) {
    const candidates = await searchYouTubeCandidates(searchQuery);
    if (!candidates.length) continue;
    candidates.sort(
      (a, b) =>
        scoreYouTubeCandidate(b, title, artist, durationMs) -
        scoreYouTubeCandidate(a, title, artist, durationMs)
    );
    if (candidates[0]?.id) return candidates[0].id;
  }

  // Fallback: Yahoo SERP.
  try {
    const query = `${artist} ${title} audio site:youtube.com/watch`.trim();
    const y = await axios.get(
      `https://search.yahoo.com/search?p=${encodeURIComponent(
        query
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

function safeFilename(value) {
  return String(value || "spotify-track")
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120) || "spotify-track";
}

async function streamMp3(downloadUrl, res, filename) {
  const upstream = await axios.get(downloadUrl, {
    responseType: "stream",
    headers: {
      "User-Agent": UA_DL,
      Accept: "audio/mpeg,audio/*,*/*",
    },
    timeout: 30000,
    maxRedirects: 5,
  });

  const safe = safeFilename(filename);
  res.statusCode = 200;
  res.setHeader("Content-Type", upstream.headers["content-type"] || "audio/mpeg");
  if (upstream.headers["content-length"]) {
    res.setHeader("Content-Length", upstream.headers["content-length"]);
  }
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${safe}.mp3"; filename*=UTF-8''${encodeURIComponent(safe)}.mp3`
  );
  res.setHeader("Cache-Control", "no-store");
  return upstream.data.pipe(res);
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
    { name: "duration_ms", required: false, description: "مدة الأغنية للمطابقة الدقيقة." },
    { name: "format", required: false, description: "استخدم blob لإرجاع ملف MP3 مباشرة." },
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
    const durationMs = Number(
      queryParams.duration_ms || queryParams.duration || body.duration_ms || body.duration || 0
    );
    const wantsBlob = ["blob", "audio", "mp3", "download"].includes(
      (queryParams.format || queryParams.response || body.format || "")
        .toString()
        .toLowerCase()
    );
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

      const videoId = await findYouTubeId(finalTitle, finalArtist, durationMs);
      if (!videoId) {
        return res
          .status(404)
          .json({ status: "error", message: "الأغنية غير متاحة حالياً." });
      }

      const youtubeVideoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const st = new SaveTubeEngine();
      const finalMp3Url = await st.getDownloadUrl(youtubeVideoUrl);
      if (!finalMp3Url) throw new Error("فشل توليد رابط التحميل.");

      if (wantsBlob) {
        return streamMp3(
          finalMp3Url,
          res,
          `${finalTitle}${finalArtist ? " - " + finalArtist : ""}`
        );
      }

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

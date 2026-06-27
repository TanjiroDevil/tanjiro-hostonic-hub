const axios = require("axios");
const qs = require("qs");

function decodeSnapsave(data) {
  try {
    const parts = data.split("}(")[1].split("))")[0].split(",");
    const h = parts[0].trim().replace(/"/g, "");
    const u = parseInt(parts[1]);
    const n = parts[2].trim().replace(/"/g, "");
    const t = parseInt(parts[3]);
    const e = parseInt(parts[4]);
    void u;

    const _0xe76c = (d, eA, fA) => {
      const g = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split("");
      const hh = g.slice(0, eA);
      const ii = g.slice(0, fA);
      let j = d.split("").reverse().reduce((a, b, c) => {
        if (hh.indexOf(b) !== -1) return (a += hh.indexOf(b) * Math.pow(eA, c));
        return a;
      }, 0);
      let k = "";
      while (j > 0) {
        k = ii[j % fA] + k;
        j = (j - (j % fA)) / fA;
      }
      return k || "0";
    };

    let result = "";
    for (let i = 0, len = h.length; i < len; i++) {
      let s = "";
      while (h[i] !== n[e]) {
        s += h[i];
        i++;
      }
      for (let j = 0; j < n.length; j++) s = s.replace(new RegExp(n[j], "g"), j);
      result += String.fromCharCode(_0xe76c(s, e, 10) - t);
    }
    return decodeURIComponent(escape(result));
  } catch {
    return "";
  }
}

class SnapsaveAPI {
  constructor() {
    this.baseUrl = "https://snapsave.app/action.php?lang=ar";
    this.headers = {
      accept: "*/*",
      "content-type": "application/x-www-form-urlencoded",
      referer: "https://snapsave.app/",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    };
  }
  async download(videoUrl) {
    const r = await axios.post(this.baseUrl, qs.stringify({ url: videoUrl }), {
      headers: this.headers,
    });
    const html = decodeSnapsave(r.data);
    if (!html) throw new Error("Failed to decode response");
    const linkRegex = /href=\\?"(https?:\/\/[^\\"\s]+)\\?"/g;
    const qualityRegex = />(\d{3,4}p\s*(?:\(HD\))?|Render|تحميل)<\/a>/g;
    const links = [...html.matchAll(linkRegex)].map((m) => m[1].replace(/\\/g, ""));
    const qualities = [...html.matchAll(qualityRegex)].map((m) => m[1]);
    const out = [];
    links.forEach((link, i) => {
      if (link.includes("token=") || link.includes("rapidcdn"))
        out.push({ quality: qualities[i] || "Download", url: link });
    });
    return {
      title: "SnapTube Video Downloader",
      results: out.filter((v, i, a) => a.findIndex((t) => t.url === v.url) === i),
    };
  }
}

module.exports = {
  description: "Snaptube downloader (Facebook/Instagram/TikTok).",
  method: "GET",
  parameters: [{ name: "url", required: true, description: "رابط الفيديو." }],
  handler: async (req, res) => {
    const url = (req.query && req.query.url) || (req.body && req.body.url);
    if (!url)
      return res.status(200).json({
        title: "Snaptube Video Downloader",
        status: "Online",
        usage: "/api/download/snap?url=LINK",
      });
    try {
      const out = await new SnapsaveAPI().download(url);
      return res.status(200).json({ status: "success", ...out });
    } catch (e) {
      return res.status(400).json({ status: "error", message: e.message });
    }
  },
};

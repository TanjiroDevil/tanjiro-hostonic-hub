// Uses global fetch (Node 18+).

async function youtubeV2(url, format) {
  const data = new URLSearchParams();
  data.append("url", url);
  data.append("format", format);
  data.append("lang", "en");
  data.append("subscribed", "false");

  const r = await fetch("https://s57.notube.net/recover_weight.php", {
    method: "POST",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Origin: "https://notube.net",
      Referer: "https://notube.net/",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: data,
  });
  const json = await r.json();
  if (json.error || !json.url_mp4_youtube)
    throw new Error(json.error || "Failed to extract download URL.");
  return {
    title: json.titre_mp4
      ? decodeURIComponent(String(json.titre_mp4).replace(/\+/g, " "))
      : "Youtube Video",
    format,
    download: json.url_mp4_youtube,
  };
}

module.exports = {
  description: "YouTube downloader (mp3/mp4 via Notube).",
  method: "GET",
  parameters: [
    { name: "mp3url", required: false, description: "رابط فيديو يوتيوب لتحويله إلى MP3." },
    { name: "mp4url", required: false, description: "رابط فيديو يوتيوب لتحويله إلى MP4." },
  ],
  handler: async (req, res) => {
    const q = req.query || {};
    const { mp3url, mp4url } = q;
    let videoUrl = "";
    let format = "";
    if (mp3url) { videoUrl = mp3url; format = "mp3"; }
    else if (mp4url) { videoUrl = mp4url; format = "mp4"; }
    if (!videoUrl)
      return res.status(200).json({
        status: "Online",
        usage: { audio: "?mp3url=LINK", video: "?mp4url=LINK" },
      });
    try {
      const result = await youtubeV2(videoUrl, format);
      return res.status(200).json({
        status: true,
        result: { type: format === "mp4" ? "Video (MP4)" : "Audio (MP3)", ...result },
      });
    } catch (e) {
      return res.status(500).json({ status: false, error: e.message });
    }
  },
};

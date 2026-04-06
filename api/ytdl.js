import fetch from 'node-fetch';

/**
 * دالة جلب البيانات من NoTube
 */
async function youtubeV2(url, format) {
  const data = new URLSearchParams();
  data.append('url', url);
  data.append('format', format);
  data.append('lang', 'en');
  data.append('subscribed', 'false');

  const options = {
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Origin': 'https://notube.net',
      'Referer': 'https://notube.net/',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: data
  };

  try {
    const response = await fetch('https://s57.notube.net/recover_weight.php', options);
    const json = await response.json();

    if (json.error || !json.url_mp4_youtube) {
      throw new Error(json.error || "فشل في استخراج الرابط من المصدر.");
    }

    return {
      title: json.titre_mp4 ? decodeURIComponent(json.titre_mp4.replace(/\+/g, ' ')) : 'Youtube Video',
      format: format,
      download: json.url_mp4_youtube,

      Creator: "TanjiroDev 🖤✨"
    };
  } catch (error) {
    throw new Error("خطأ في السكربت: " + error.message);
  }
}

export default async function handler(req, res) {
  // --- منطق التوافقية لاستخراج الباراميترز ---
  let queryParams = {};
  if (req.query) {
    queryParams = req.query;
  } else if (req.url) {
    try {
      const urlObj = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
      queryParams = Object.fromEntries(urlObj.searchParams.entries());
    } catch (e) { queryParams = {}; }
  }

  // تحديد الباراميترز المطلوبة
  const { mp3url, mp4url } = queryParams;

  const commonHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8'
  };

  const sendResponse = (statusCode, payload) => {
    const bodyString = JSON.stringify(payload, null, 4);
    if (res && typeof res.status === 'function') {
      Object.entries(commonHeaders).forEach(([k, v]) => res.setHeader(k, v));
      return res.status(statusCode).send(bodyString);
    }
    return new Response(bodyString, { status: statusCode, headers: commonHeaders });
  };
  // --- نهاية التوافقية ---

  // فحص أي باراميتر تم استخدامه
  let videoUrl = "";
  let format = "";

  if (mp3url) {
    videoUrl = mp3url;
    format = "mp3";
  } else if (mp4url) {
    videoUrl = mp4url;
    format = "mp4";
  }

  // إذا لم يتم إرسال أي منهما
  if (!videoUrl) {
    return sendResponse(200, { 
      status: "Online ✅",
      Creator: "TanjiroDev",
      instruction: "استخدم mp3url للصوت أو mp4url للفيديو",
      usage: {
        audio: "?mp3url=LINK",
        video: "?mp4url=LINK"
      }
    });
  }

  try {
    const result = await youtubeV2(videoUrl, format);
    return sendResponse(200, {
      status: true,
      result: {
        type: format === "mp4" ? "Video (MP4)" : "Audio (MP3)",
        ...result
      }
    });
  } catch (error) {
    return sendResponse(500, { status: false, error: error.message });
  }
}

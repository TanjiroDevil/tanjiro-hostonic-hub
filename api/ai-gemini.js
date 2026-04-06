import axios from "axios";

class GeminiAPI {
  constructor() {
    this.baseUrl = "https://us-central1-infinite-chain-295909.cloudfunctions.net/gemini-proxy-staging-v1";
    this.headers = {
      "accept": "*/*",
      "content-type": "application/json",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
    };
  }

  async getData(imageUrl) {
    try {
      const response = await axios.get(imageUrl.trim(), { 
          responseType: "arraybuffer",
          timeout: 25000 
      });
      // استخدام Buffer.from متوافق مع معظم بيئات Node.js
      return {
        inline_data: {
          mime_type: response.headers["content-type"] || "image/jpeg",
          data: Buffer.from(response.data, "binary").toString("base64"),
        },
      };
    } catch (e) {
      return null;
    }
  }

  async chat({ prompt, imageUrl = null }) {
    const parts = [];
    
    if (imageUrl) {
      const urls = Array.isArray(imageUrl) ? imageUrl : [imageUrl];
      for (const url of urls) {
        if (url) {
          const imagePart = await this.getData(url);
          if (imagePart) parts.push(imagePart);
        }
      }
    }

    parts.push({ text: prompt });
    const body = { contents: [{ parts }] };

    try {
      const response = await axios.post(this.baseUrl, body, { 
        headers: this.headers,
        timeout: 30000 
      });
      return response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default async function handler(req, res) {
    // 1. استخراج البيانات بطريقة مرنة (Vercel vs Netlify)
    let body = {};
    try {
        if (req.body) {
            body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        }
    } catch (e) { body = {}; }

    let prompt, imageUrl;
    
    if (req.query && (req.query.prompt || req.query.imageUrl)) {
        prompt = req.query.prompt;
        imageUrl = req.query.imageUrl;
    } else {
        try {
            const fullUrl = req.url.startsWith('http') ? req.url : `http://localhost${req.url}`;
            const urlObj = new URL(fullUrl);
            prompt = urlObj.searchParams.get('prompt');
            imageUrl = urlObj.searchParams.get('imageUrl');
        } catch (e) {
            prompt = null;
            imageUrl = null;
        }
    }

    // الأولوية للـ body إذا وجد (لطلبات POST)
    prompt = prompt || body.prompt;
    imageUrl = imageUrl || body.imageUrl;

    const commonHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Powered-By': 'Tanjiro-Engine'
    };

    // دالة الاستجابة الموحدة
    const sendResponse = (statusCode, payload) => {
        const bodyString = JSON.stringify(payload, null, 4);

        if (res && typeof res.status === 'function') {
            Object.entries(commonHeaders).forEach(([k, v]) => res.setHeader(k, v));
            return res.status(statusCode).send(bodyString);
        }

        return new Response(bodyString, {
            status: statusCode,
            headers: commonHeaders
        });
    };

    // معالجة OPTIONS لطلبات CORS
    if (req.method === 'OPTIONS') {
        return sendResponse(200, { message: "ok" });
    }

    if (!prompt) {
        return sendResponse(200, {
            api: "Gemini AI Chat",
            status: "Online 🙂✨",
            dev: "Tanjiro ✨",
            usage: {
                example: "?prompt=مرحبا",
                query: ["prompt", "imageUrl"]
            }
        });
    }

    try {
        if (imageUrl && typeof imageUrl === "string" && imageUrl.includes(',')) {
            imageUrl = imageUrl.split(',');
        }

        const gemini = new GeminiAPI();
        const output = await gemini.chat({ prompt, imageUrl });

        if (!output) throw new Error("لم يتم الحصول على استجابة من Gemini");

        return sendResponse(200, {
            status: "success",
            response: output,
            dev: "Tanjiro ✨"
        });

    } catch (error) {
        const isImageError = imageUrl ? " (قد يكون السبب عدم دعم الصور في البروكسي)" : "";
        return sendResponse(500, {
            status: "error",
            message: error.message + isImageError
        });
    }
}

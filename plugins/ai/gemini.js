const axios = require("axios");

class GeminiAPI {
  constructor() {
    // تحديث الرابط الجديد للسكراب بناءً على طلب الـ Request الحديث
    this.baseUrl = "https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=boq_assistant-bard-web-server_20260630.21_p0&f.sid=-680358786181734346&hl=ar&_reqid=5485115&rt=c";
    
    // تحديث الـ headers والـ Cookie والـ User-Agent بشكل مطابق تماماً للبيانات الجديدة
    this.headers = {
      "accept": "*/*",
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
      "x-same-domain": "1",
      "x-requested-with": "mark.via.gp",
      "sec-fetch-site": "same-origin",
      "sec-fetch-mode": "cors",
      "sec-fetch-dest": "empty",
      "origin": "https://gemini.google.com",
      "referer": "https://gemini.google.com/",
      "cookie": "SID=g.a000-wiA2AotHGmJYIsy4GAFY5ShvBV_D_W6SetgOjrj_toxuJZkx5R3ewsyloTZEdXTR1ickgACgYKARcSARASFQHGX2MiNdPDS72dnjARRYSQibIq3hoVAUF8yKptNNhSxgWWy1Gyqosg3npC0076; __Secure-1PSID=g.a000-wiA2AotHGmJYIsy4GAFY5ShvBV_D_W6SetgOjrj_toxuJZkbMm-OHW9Noa6W2c9lUJ8OAACgYKAR0SARASFQHGX2MiYl3FFVCXM76s52dRNUMcehoVAUF8yKqXhjTOx7Ngz-7KHms1wUYQ0076; __Secure-3PSID=g.a000-wiA2AotHGmJYIsy4GAFY5ShvBV_D_W6SetgOjrj_toxuJZkh7woWtjYqb4UeSlh6NELSAACgYKAdUSARASFQHGX2MiaEPKaQ4fN51J982DhsfHzxoVAUF8yKoHfl7tvx4ZjVKiUF96SbwY0076; HSID=Aw001d8t8vgA2J_VN; SSID=AREr3VjurTyje_sL7; APISID=sXY5WUNtYIqiKm0V/AOebW_K9wUchYTfpk; SAPISID=nBnpkSXZLeXOMjfa/AvWFLH8mc9d4YfgDD; __Secure-1PAPISID=nBnpkSXZLeXOMjfa/AvWFLH8mc9d4YfgDD; __Secure-3PAPISID=nBnpkSXZLeXOMjfa/AvWFLH8mc9d4YfgDD; SEARCH_SAMESITE=CgQInKEB; AEC=AdJVEauB5AQWsliy5HW9c69g_dkiKpWIP7WitEGlp1RD8nBvBS9AyiPYyhk; __Secure-BUCKET=CJcF; COMPASS=gemini-pd=CjwACWuJV93jFYb_b6k1ZbZc5AVi75OXfwVJx6huPFdJgLZgT-iphNSBtyIyTho-2Gurv4U86El7hPmdVFUQq7ug0gYaZgAJa4lXFm_97iE_VVuV5cFYGuo6Er-YYK9rrKfF5glAxwKtOeX7hrT4HDF-7kC1ZOPQRd-hRr_dLqt-r-EXTp5mrnqEt_MNNmY0Ie9rE5-kUdIkTOrltkBCGTxCEdktWprYk4bC4CABMAE; __Secure-STRP=ANmZwa3vXxfWs6sBJvBOqKjor6tWWqVeuY2zwIdfvXJ4rxqyrA2Q-szaDtvA9dsHXmTa9lTGKcabzRuENRiIJm4ZKDcngyE9Rg; NID=532=MXQBSG0Scjq2gcONtDTYIGU_quZSZ6-Gvo81XddvW5lSYBOAyUMRnYgbXaZWQwW86-ytzXvDj-dWj5C-TVvTrv1fxXhybB0uopGTy5Uotj_y4f2M_2JA_p114qjxAqFuoFcJmBpGpls1f9nnbm848xwc45fIq0EJTE7qIB_87VDRnGnzaA0Yd6hBqgTP5YBIF0sjSHKRjRwBh_AXViUv6vJYcJcFA1xOqjSZl89oJy_EwNyBplLk21kwl3dpK8EzIcR6L34NJu7XnbUbWOt2dSHPPSS3H5dC-H6UX0k_RvUse5jPFi-Sp50wXaOcSzEF59jI2Ovd68uyy8BRU-QMfE8Kp4kfoOqk95ZGFgc4XAn4X8D96DnZYiXzUv7yjZlTpQ1dU-RtUjFEHJxodUzeVMnnvNgLVgLhe5PooqaFttJKQtKkEUT3HLn_cOdowL5ALqXKJuCP-WfJCKTaJ2-c6P9-mQB8nj9D4EMloHQhzwC69jKDMiaAOYL51INpK4jziDlZ84TLru5ChPm6OCzQ6ngRwuksg0-kmhUHFXevGJ6ZRp9NaDiwWBLkZqCbBbbCLyHx10CSE9NZNtRieJR_1XLJ7V4-Yoy8FChU2XS3x1Y0WRyrtJpm_yL3yDKfAv-qK90b6QKauv8ROtEAv0x8Trqkj6xU-pLovidGNTYOhxNdtKejqhGz2rTzB3Q-V9N188rDdmkfF2bqSIP-jWG7oWE; __Secure-1PSIDTS=sidts-CjIByojQU3eIOBN9y4CvEQnn5XN4PUna7p_DDAanPVdpn8xFx236CPhn_v4pENgIMYR9pBAA; __Secure-3PSIDTS=sidts-CjIByojQU3eIOBN9y4CvEQnn5XN4PUna7p_DDAanPVdpn8xFx236CPhn_v4pENgIMYR9pBAA; SIDCC=AKEyXzUVbKyJkFozKnzveree83NhfWEpY1_k24XLMQOse-l-YnRtytp4-iGqRGPjC4eWJSsg; __Secure-1PSIDCC=AKEyXzUC_1aOgAESXcnT3gL3wek8CNX3umX42Fndp-xFTWVevT5fYmt9pmDgWfaltQ0tHfof; __Secure-3PSIDCC=AKEyXzUjeGidFLW6DY6nN6YTyAGKYYDus70JaFMAGPjG1Z4QyqZNBIO8taS6TwWbEgrv706Q"
    };
  }

  async getData(imageUrl) {
    try {
      const response = await axios.get(imageUrl.trim(), { 
          responseType: "arraybuffer",
          timeout: 25000 
      });
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
    const textPrompt = prompt; 
    
    const fReq = [
      null,
      `[["${textPrompt}",0,null,null,null,null,0],["ar"],["","","","","","",null,null,null,""],"a7bc880d6879feb592edda0804560d4d",null,[1],1,null,null,1,0,null,null,null,null,null,[[0]],0,null,null,null,null,null,null,null,null,1,null,null,[4],null,null,null,null,null,null,null,null,null,null,[1],null,null,null,null,null,null,null,null,null,null,null,0,null,null,null,null,null,"5A19C9BC-3532-4CEE-A6FA-446D8E2F7AB1",null,[1],null,null,null,null,null,null,2,null,null,null,null,null,null,null,null,null,null,1,1,null,null,null,null,null,null,null,null,null,null,0]`
    ];

    const body = new URLSearchParams();
    body.append("f.req", JSON.stringify(fReq));
    body.append("at", "AD1_LW4RuU2PkoEbdLlABQkoIVJd:1783024689512");

    try {
      const response = await axios.post(this.baseUrl, body, { 
        headers: this.headers,
        timeout: 30000 
      });

      const rawData = response.data;
      const match = rawData.match(/\["rc_.*?",\["(.*?)"\]/);
      if (match && match[1]) {
         return match[1].replace(/\\n/g, '\n');
      }
      
      return rawData;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

async function handler(req, res) {
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

    prompt = prompt || body.prompt;
    imageUrl = imageUrl || body.imageUrl;

    const commonHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Powered-By': 'Tanjiro-Engine'
    };

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

module.exports = handler;
      

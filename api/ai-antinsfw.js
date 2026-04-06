import axios from 'axios';

export default async function handler(req, res) {
    // --- قسم معالجة التوافقية (Vercel & Netlify) ---
    let queryParams = {};
    if (req.query) {
        queryParams = req.query;
    } else if (req.url) {
        try {
            const urlObj = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
            queryParams = Object.fromEntries(urlObj.searchParams.entries());
        } catch (e) { queryParams = {}; }
    }

    let body = {};
    if (req.body) {
        try {
            body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        } catch (e) { body = {}; }
    }

    const imageUrl = queryParams.imageUrl || body.imageUrl;

    const commonHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'X-Powered-By': 'Tanjiro-Engine',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Content-Type-Options': 'nosniff'
    };

    const sendResponse = (statusCode, payload) => {
        const bodyString = JSON.stringify(payload, null, 4);
        if (res && typeof res.status === 'function') {
            Object.entries(commonHeaders).forEach(([k, v]) => res.setHeader(k, v));
            return res.status(statusCode).send(bodyString);
        }
        return new Response(bodyString, { status: statusCode, headers: commonHeaders });
    };
    // --- نهاية قسم التوافقية ---

    if (req.method === 'OPTIONS') return sendResponse(200, { ok: true });

    if (imageUrl) {
        try {
            const imageResponse = await axios.get(imageUrl.trim(), {
                responseType: 'arraybuffer',
                timeout: 15000,
                maxContentLength: 5 * 1024 * 1024,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'image/*'
                }
            });

            const contentType = imageResponse.headers['content-type'];
            if (!contentType || !contentType.startsWith('image/')) {
                throw new Error(`الرابط لا يشير إلى صورة صالحة 🙂`);
            }

            // تحويل الصورة إلى Base64 (يعمل في كلا المنصتين باستخدام Buffer)
            const base64Image = Buffer.from(imageResponse.data).toString('base64');
            const dataUrl = `data:${contentType};base64,${base64Image}`;

            const nyckelResponse = await axios.post(
                'https://www.nyckel.com/v1/functions/o2f0jzcdyut2qxhu/invoke',
                { data: dataUrl },
                { 
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 15000 
                }
            );

            let labelName = nyckelResponse.data.labelName.toLowerCase();
            const translatedLabel = labelName === 'porn' ? 'محتوى غير لائق ⚠️' : 
                                  labelName === 'safe' ? 'محتوى آمن ✅' : labelName;

            const responseData = {
                status: "success",
                prediction: translatedLabel,
                accuracy: (nyckelResponse.data.confidence * 100).toFixed(2) + "%",
                format: contentType.split('/')[1],
                dev: "Tanjiro ✨"
            };

            return sendResponse(200, responseData);

        } catch (error) {
            let errorMessage = error.message;
            if (error.code === 'ECONNABORTED') errorMessage = "استغرق جلب الصورة وقتاً طويلاً جداً (Timeout) ⏱️";
            
            return sendResponse(400, {
                status: "error",
                message: errorMessage
            });
        }
    }

    // واجهة الترحيب
    return sendResponse(200, {
        api: "Tanjiro NSFW Detector",
        status: "Online 🙂✨",
        usage: `${req.headers?.host || 'api'}/api/ai/antinsfw?imageUrl=LINK`
    });
}

import axios from "axios";

// 1. Logic Class (يبقى كما هو بدون تغيير في المنطق)
class OpenAI {
    constructor() {
        this.endpoint = "https://yw85opafq6.execute-api.us-east-1.amazonaws.com/default/boss_mode_15aug";
        this.headers = {
            "User-Agent": "Mozilla/5.0 (Linux; Android 11; Infinix) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.0.0 Mobile Safari/537.36",
            "Referer": "https://www.ai4chat.co/pages/riddle-generator"
        };
    }

    async chat(prompt) {
        try {
            const response = await axios.get(this.endpoint, {
                params: {
                    text: prompt,
                    country: "Europe",
                    user_id: "Av0SkyG00D"
                },
                headers: this.headers,
                timeout: 15000 
            });

            if (response.status !== 200) throw new Error("Failed to fetch data from AI provider.");

            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

// 2. API Handler (المحول المتوافق مع المنصتين)
export default async function handler(req, res) {
    // --- قسم معالجة المدخلات والترويسات (التوافقية) ---
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

    const inputs = { ...queryParams, ...body };
    const query = inputs.q || inputs.prompt || inputs.text;

    const commonHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'X-Powered-By': 'Tanjiro-Engine',
        'Content-Type': 'application/json; charset=utf-8'
    };

    const sendResponse = (statusCode, payload) => {
        const bodyString = JSON.stringify(payload, null, 4);
        // التحقق من البيئة (Vercel)
        if (res && typeof res.status === 'function') {
            Object.entries(commonHeaders).forEach(([k, v]) => res.setHeader(k, v));
            return res.status(statusCode).send(bodyString);
        }
        // التحقق من البيئة (Netlify)
        return new Response(bodyString, { status: statusCode, headers: commonHeaders });
    };
    // --- نهاية قسم التوافقية ---

    const ai = new OpenAI();

    if (!query) {
        return sendResponse(200, {
            status: "active",
            info: "OpenAi API By TanjiroDev ✨🖤",
            engine: "Tanjiro-Engine (AI)",
            usage: {
                endpoint: "/api/ai/openai",
                parameters: ["q", "prompt"],
                example: "/api/ai/openai?q=مرحباً"
            }
        });
    }

    try {
        const result = await ai.chat(query);
        
        return sendResponse(200, {
            status: true,
            creator: "TanjiroDev ✨🖤",
            results: {
                answer: result
            }
        });

    } catch (error) {
        return sendResponse(500, {
            status: false,
            creator: "TanjiroDev ✨🖤",
            error: "AI_ERROR",
            message: error.message
        });
    }
}

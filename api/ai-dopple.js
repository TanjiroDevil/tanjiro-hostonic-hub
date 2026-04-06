import axios from "axios";

// 1. Logic Class (يبقى كما هو بدون تغيير في المنطق)
class DoppleScraper {
    constructor() {
        this.url = "https://beta.dopple.ai/api/messages/send";
        this.headers = {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
            "Referer": "https://beta.dopple.ai/messages",
        };
    }

    async chat(prompt) {
        try {
            const arabicPrompt = `Answer in Arabic: ${prompt}`;

            const response = await axios.post(this.url, {
                streamMode: "none",
                chatId: "632cef078c294913b5b4653869eca845",
                folder: "",
                images: false,
                username: "mn0uvp2fhv",
                persona_name: "DoppleAI",
                id: "46db0561-cb3e-43d9-8f50-40b3e3c84713",
                userQuery: arabicPrompt,
            }, {
                headers: this.headers,
                timeout: 25000
            });

            if (!response.data || !response.data.response) {
                throw new Error("Empty response from DoppleAI");
            }

            let result = response.data.response;
            result = result.replace(/\(.*?\)/g, '').trim();

            return result;
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            throw new Error(errorMsg);
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
            // استخراج المعاملات من الرابط يدوياً لضمان عملها في Netlify
            const urlObj = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
            queryParams = Object.fromEntries(urlObj.searchParams.entries());
        } catch (e) { queryParams = {}; }
    }

    let body = {};
    if (req.body) {
        try {
            // Netlify قد يرسل الـ body كنص، لذا نقوم بتحويله
            body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        } catch (e) { body = {}; }
    }

    const inputs = { ...queryParams, ...body };
    const prompt = inputs.q || inputs.prompt || inputs.text;

    const commonHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'X-Powered-By': 'Tanjiro-Engine',
        'Content-Type': 'application/json; charset=utf-8'
    };

    const sendResponse = (statusCode, payload) => {
        const bodyString = JSON.stringify(payload, null, 4);
        
        // التحقق مما إذا كان البيئة تدعم نظام Express/Vercel
        if (res && typeof res.status === 'function') {
            Object.entries(commonHeaders).forEach(([k, v]) => res.setHeader(k, v));
            return res.status(statusCode).send(bodyString);
        }
        
        // نظام Netlify Modern
        return new Response(bodyString, { 
            status: statusCode, 
            headers: commonHeaders 
        });
    };
    // --- نهاية قسم التوافقية ---

    const scraper = new DoppleScraper();

    if (!prompt) {
        return sendResponse(200, {
            status: "active",
            creator: "TanjiroDev ✨🖤",
            engine: "DoppleAI API Chat By Tanjiro",
            usage: {
                endpoint: "/api/ai/dopple",
                parameters: ["q", "prompt"],
                example: "/api/ai/dopple?q=كيف حالك؟"
            }
        });
    }

    try {
        const result = await scraper.chat(prompt);
        
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
            error: "DOPPLE_ERROR",
            message: error.message
        });
    }
}

import axios from "axios";

// 1. Logic Class (بدون تغيير في المنطق الأصلي)
class SaanviAI {
    constructor() {
        this.url = "https://ai.riple.org/";
        this.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        };
    }

    async chat(text) {
        try {
            const payload = {
                messages: [{ content: text, role: "user" }],
            };

            const response = await axios.post(this.url, payload, {
                headers: this.headers,
                responseType: "stream",
                timeout: 30000 
            });

            return new Promise((resolve, reject) => {
                let fullResponse = "";
                let isResolved = false;

                response.data.on("data", (chunk) => {
                    const lines = chunk.toString().split("\n");

                    for (let line of lines) {
                        if (line.startsWith("data: ")) {
                            let jsonString = line.slice(6).trim();

                            if (jsonString === "[DONE]") {
                                if (!isResolved) {
                                    isResolved = true;
                                    resolve(fullResponse.trim());
                                }
                                return;
                            }

                            try {
                                const parsedData = JSON.parse(jsonString);
                                const content = parsedData?.choices?.[0]?.delta?.content;
                                if (content) fullResponse += content;
                            } catch (err) {
                                // تجاهل أخطاء الـ JSON البسيطة
                            }
                        }
                    }
                });

                response.data.on("end", () => {
                    if (!isResolved) {
                        isResolved = true;
                        resolve(fullResponse.trim());
                    }
                });

                response.data.on("error", (err) => {
                    if (!isResolved) {
                        isResolved = true;
                        reject(err);
                    }
                });
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

// 2. API Handler (المحول المتوافق)
export default async function handler(req, res) {
    // --- قسم معالجة التوافقية ---
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
    const text = inputs.q || inputs.text || inputs.prompt;

    const commonHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'X-Powered-By': 'Tanjiro-Engine',
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
    // --- نهاية قسم التوافقية ---

    const ai = new SaanviAI();

    if (!text) {
        return sendResponse(200, {
            status: "active",
            Dev: "TanjiroDev ✨🖤",
            engine: "Saanvi-AI API For News",
            usage: {
                endpoint: "/api/ai/saanvi",
                parameters: ["q", "text"],
                example: "/api/ai/saanvi?q=من أنت؟"
            }
        });
    }

    try {
        const result = await ai.chat(text);
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
            error: "SAANVI_ERROR",
            message: error.message
        });
    }
}

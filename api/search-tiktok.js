import axios from 'axios';

// 1. Logic Class (يبقى كما هو لضمان استقرار السكراب)
class TikTokSearcher {
    constructor() {
        this.apiUrl = "https://tikwm.com/api/feed/search";
        this.headers = {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Cookie": "current_language=en",
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
        };
    }

    async search(query) {
        try {
            const params = new URLSearchParams({
                keywords: query,
                count: 10,
                cursor: 0,
                HD: 1,
            });

            const response = await axios.post(this.apiUrl, params, {
                headers: this.headers,
                timeout: 15000
            });

            const result = response.data;
            const videos = result.data?.videos || [];

            if (videos.length === 0) {
                throw new Error("لم يتم العثور على فيديوهات لهذا البحث.");
            }

            return videos.map((v) => ({
                title: v.title,
                thumbnail: v.cover,
                author: {
                    username: v.author.unique_id,
                    nickname: v.author.nickname,
                    avatar: v.author.avatar
                },
                links: {
                    video: `https://www.tiktok.com/@${v.author.unique_id}/video/${v.video_id}`,
                    no_watermark: v.play,
                    watermark: v.wmplay,
                    music: v.music
                },
                stats: {
                    views: v.play_count,
                    likes: v.digg_count,
                    comments: v.comment_count || 0,
                    shares: v.share_count || 0,
                    downloads: v.download_count || 0
                },
                created_at: new Date(v.create_time * 1000).toLocaleString('ar-EG')
            }));
        } catch (error) {
            throw new Error(`TikTok Error: ${error.message}`);
        }
    }
}

// 2. API Handler (المحول المتوافق مع المنصتين)
export default async function handler(req, res) {
    // --- قسم معالجة التوافقية (التلقائي) ---
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
    const query = inputs.q || inputs.query;

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

    const searcher = new TikTokSearcher();

    if (!query) {
        return sendResponse(200, {
            status: "active",
            creator: "TanjiroDev ✨🖤",
            engine: "TikTok-Search (Tanjiro-Engine)",
            usage: {
                endpoint: "/api/search/tiktok",
                parameters: ["q", "query"],
                example: "/api/search/tiktok?q=funny cats"
            }
        });
    }

    try {
        const results = await searcher.search(query);
        return sendResponse(200, {
            status: true,
            creator: "TanjiroDev ✨🖤",
            results: results
        });
    } catch (error) {
        return sendResponse(500, {
            status: false,
            creator: "TanjiroDev ✨🖤",
            error: "SEARCH_ERROR",
            message: error.message
        });
    }
}

import axios from "axios";
import qs from "qs";

// دالة فك التشفير المحسنة (تبقى كما هي لضمان عمل السكراب)
function decodeSnapsave(data) {
    try {
        const parts = data.split('}(')[1].split('))')[0].split(',');
        const h = parts[0].trim().replace(/"/g, '');
        const u = parseInt(parts[1]);
        const n = parts[2].trim().replace(/"/g, '');
        const t = parseInt(parts[3]);
        const e = parseInt(parts[4]);
        const r = parseInt(parts[5]);

        const _0xe76c = (d, e, f) => {
            var g = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split("");
            var h = g.slice(0, e);
            var i = g.slice(0, f);
            var j = d.split("").reverse().reduce(function(a, b, c) {
                if (h.indexOf(b) !== -1) return a += h.indexOf(b) * (Math.pow(e, c));
            }, 0);
            var k = "";
            while (j > 0) {
                k = i[j % f] + k;
                j = (j - (j % f)) / f;
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
    } catch (e) {
        return "";
    }
}

class SnapsaveAPI {
    constructor() {
        this.baseUrl = "https://snapsave.app/action.php?lang=ar";
        this.headers = {
            "accept": "*/*",
            "content-type": "application/x-www-form-urlencoded",
            "referer": "https://snapsave.app/",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
        };
    }

    async download(videoUrl) {
        try {
            const response = await axios.post(this.baseUrl, qs.stringify({ url: videoUrl }), { headers: this.headers });
            const decodedHtml = decodeSnapsave(response.data);
            
            if (!decodedHtml) throw new Error("فشل فك تشفير البيانات");

            const videoLinks = [];
            const linkRegex = /href=\\?"(https?:\/\/[^\\"\s]+)\\?"/g;
            const qualityRegex = />(\d{3,4}p\s*(?:\(HD\))?|Render|تحميل)<\/a>/g;
            
            let links = [...decodedHtml.matchAll(linkRegex)].map(m => m[1].replace(/\\/g, ''));
            let qualities = [...decodedHtml.matchAll(qualityRegex)].map(m => m[1]);

            links.forEach((link, index) => {
                if (link.includes('token=') || link.includes('rapidcdn')) {
                    videoLinks.push({
                        quality: qualities[index] || "Download",
                        url: link
                    });
                }
            });

            const uniqueResults = videoLinks.filter((v, i, a) => a.findIndex(t => t.url === v.url) === i);

            return {
                title: "SnapTube Video Downloader",
                results: uniqueResults
            };
        } catch (error) {
            throw new Error(`خطأ في الاستخراج: ${error.message}`);
        }
    }
}

export default async function handler(req, res) {
    // --- منطق التوافقية الشامل ---
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

    const videoUrl = queryParams.url || body.url;

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
    // --- نهاية منطق التوافقية ---

    if (!videoUrl) {
        return sendResponse(200, { 
            title: "Snaptube Video Downloader", 
            status: "Online ✅", 
            usage: "?url=LINK", 
            Developer: "Tanjiro ✨" 
        });
    }

    try {
        const snapsave = new SnapsaveAPI();
        const result = await snapsave.download(videoUrl);
        return sendResponse(200, { status: "success", ...result, dev: "Tanjiro ✨" });
    } catch (error) {
        return sendResponse(400, { status: "error", message: error.message });
    }
}

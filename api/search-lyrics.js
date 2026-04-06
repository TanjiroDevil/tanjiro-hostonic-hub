import axios from 'axios';

class LyricsScraper {
    constructor() {
        this.baseUrl = 'https://lrclib.net/api/search';
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json',
            'lrclib-client': 'LRCLIB-Web-Client'
        };
    }

    cleanLyrics(raw) {
        if (!raw) return null;
        return String(raw)
            .replace(/\[?\d{1,2}:\d{2}(?:[:.]\d{1,3})?\]?/g, '') 
            .replace(/<\/?[^>]+(>|$)/g, '') 
            .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
            .replace(/\r/g, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }

    async fetchLyrics(query) {
        try {
            const response = await axios.get(this.baseUrl, {
                params: { q: query },
                headers: this.headers,
                timeout: 15000,
                // هذا السطر مهم جداً لـ Netlify لتجنب مشاكل الـ SSL/TLS في بعض الأحيان
                httpsAgent: new (await import('https')).Agent({ rejectUnauthorized: false })
            });

            const results = response.data;
            if (!results || !Array.isArray(results) || results.length === 0) {
                throw new Error(`Lyrics not found`);
            }

            const song = results[0];
            const rawLyrics = song.plainLyrics || song.syncedLyrics || song.lyrics || null;
            const cleaned = this.cleanLyrics(rawLyrics);

            if (!cleaned) throw new Error("Lyrics content is empty.");

            return {
                status: true,
                title: song.trackName,
                artist: song.artistName,
                lyrics: cleaned,
                thumbnail: song.albumArtUrl || null
            };
        } catch (error) {
            // تحسين رسالة الخطأ لتكون أوضح
            throw new Error(error.response?.data?.message || error.message);
        }
    }
}

export default async function handler(req, res) {
    const scraper = new LyricsScraper();
    
    // طريقة احترافية لاستخراج الـ Query تدعم النظامين
    let searchQuery = null;
    try {
        if (req.query && (req.query.q || req.query.query)) {
            searchQuery = req.query.q || req.query.query;
        } else {
            const fullUrl = req.url.startsWith('http') ? req.url : `http://localhost${req.url}`;
            const urlObj = new URL(fullUrl);
            searchQuery = urlObj.searchParams.get('q') || urlObj.searchParams.get('query');
        }
    } catch (e) {
        searchQuery = null;
    }

    const commonHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Powered-By': 'Tanjiro-Engine'
    };

    const sendResponse = (statusCode, payload) => {
        const bodyString = JSON.stringify(payload, null, 4);

        // بيئة Vercel / Node traditional
        if (res && typeof res.status === 'function') {
            Object.entries(commonHeaders).forEach(([k, v]) => res.setHeader(k, v));
            return res.status(statusCode).send(bodyString);
        }

        // بيئة Netlify Modern (Response Object)
        return new Response(bodyString, {
            status: statusCode,
            headers: commonHeaders
        });
    };

    if (!searchQuery) {
        return sendResponse(200, {
            status: "active",
            creator: "Tanjiro",
            example: "/api/search/lyrics?q=Perfect"
        });
    }

    try {
        const data = await scraper.fetchLyrics(searchQuery);
        return sendResponse(200, { creator: "Tanjiro", results: data });
    } catch (error) {
        return sendResponse(500, { 
            status: false, 
            error: "Scraper Error",
            message: error.message 
        });
    }
}

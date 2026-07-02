const https = require('https');
const querystring = require('querystring');

class GeminiAPI {
    constructor() {
        this.host = "gemini.google.com";
        this.path = "/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=boq_assistant-bard-web-server_20260630.21_p0&f.sid=8436398543548529905&hl=ar&_reqid=5000358&rt=c";
    }

    async chat(prompt) {
        return new Promise((resolve, reject) => {
            const fReq = [null, `[["${prompt}",0,null,null,null,null,0],["ar"],["c_eecab65b6b01f307","r_e561932c6c0431cd","rc_89b131582f7cb2aa",null,null,null,null,null,null,""],"!MzClMFTNAAYUchJwNHJCGXraMkqMoNs7AEABEArZ1M2QrOYcbk3YCa3vEWUXxIzPgoIIECuMX1lRmzFzu0Q6DfePcJNKJPd3n-BkLD-yNWDzp81gDaCxpVfaAgAAAYFSAAAAlGgBB34ARJAt335UgnG7Vr0W5Gv_EpKXWl4I9xlm5khanSIc2dgWk00jSTIxW0eQDoLBK3tUSdtoHL0Hj4NVx2V1P_lxVqH2MD9UmQVIF1Qdp8zVC9KJLcHqpNJwMampEQ8aolXl1jov9g1flI__xhv0Fx8NWx15UUeWaCKPG34KuzwH-WQsP9lce1YgPxy2WsMhCcIxZkXrGD2IlLVyAkX3LoXNYDfrL6ihOe3Rtclu0P9KnVMqEa2s61KnZZVwer-ZpQNjHDcx6nw2eonCad9sAcTkFXU3w-WUtxPjIhicywP6WwKIdTTVnSA9cFhqwcyK2PSknY6qMfjl43wq8hZStTn712N0JOi51G2s8BXavr-AovOAjsp2633z_J1h9iYABZF_2XVCkNbGD_AH4ryg63nZh0Szgj0IMvUcouX_1_Z0MbPUN9BBtqtlOS2prmeUsFH2-PHJxcIwPvDPaXbNqHZK0orFDdZ-41yJv7S-2ryyA97ZYlc4Yjc-aT5gTM8Zg1RI4zpxa6tZa5lKpJsJUqaNr_HwRkMjl06ojLKT8haK42FTus6D0s4vFaRKrSXvV1Wl-DnMbiANnauU2ZFvb1h7PeK0ejZIKoOTxthbokpL6ikJLkvvyGydiNFPWBNjtu7XJSANSXLmCBGaTv4A4S5pS9XX_bLQGMtegBgoXiFoU_vKHoMDlLZ2BrdlT-b-aHlWOeVMW_Q66LgqHwjhq2TD620FQWOfENuhZJXj3tsuapQ4E9U_steD8lsKI8N-ziP6h-8EaLJ7kRcO6n-Myk0PAowGZ5WosCH-35jlPcuMCGSm6pd3pR0ZihY7HUM2Iec8vG51PvhPpuCSGcGVR6t3F-k1_YPVX6Dp-CM73POmA82Rur4mOrqdffwLcnccJ7q7rcF6ZnjJBXbXNoly52UarDPgQ1WISI_vxlgQY4bwMrlqAQQ_ssLw3fvgE7dU3e-odvLltsP5K-LmrzqD1DIDsuz9qsp8GAYADnssj_N8s18FfshjHduIpKn6aXpR2UllyOEx9F1-TSY-x2p99zqj0PZxVMfmsgIQpwCJ9jYe25dL4_DorqZ6IkymV3p0hYOTINTAXUdzOTYsJYlrp8VY2Tm_jg5_rl08-Xhe8gEuw_sImRAOVZRXCrw1R85-SqlntqxRbp3_1SjrNHykjV6Qgmrtb39cSHtb8wFWhJbqBg1dqAYQshzgR7VJCtCfy3zEdP23mAb0dgq776_Zj5mCYDn-3TBgB46DdtaxC5Ka3odfl3i4n83FUIuO-49-x62696g1PUylAhuU-uW9dMXyAEAMfSQks93Ym8BXwlbI5zw0vJ8tOoyuyt1KspOYB5TMY8tgpRjjV2ALq8-FL_6evmO1qULap3u6CQ9oj0JGPrBsP__qapjVZ5uAk35ilEq7z29NTPkNS0ReRovIUy3jhqKTsikHU8nk8iUKp_8Mdiatq4FiMdi4vniaqepxUpMvqV4BLvB3H0LpSTrVdhO7QmOxlFlqjNeH1ehseM-3J7upRudkLmBuzlQ3JuFYUf5EiTaKmiJ-ybn0mIAMV55xtL98ePboWtABA6Rxxqw-tqV_CUXIjgdl2Ng1NSStdpxITY5vDgz6UqGQpB-0DdB5_MCmnHG7eW2Cj5MQKDuHmAYK_1wFOY_rh8rg1AMCiUOkSSqQAgKzhOBNlCzPPTDZs5Wl6rK1FakttVcpt0M_D3PU44BL0IUJTgJNonWLXXTrIx5Rs-CCo0IYnskjbpjLNT45xdEMn5SpdFtbZEc7ef8RGJZVkPN0rpRMYmadRXLeHWx7cGO4pxKcSx_SxAsRkQDjtvAF-g6c6kfJQSR5t94p6JjuZRB0l2G9rXM5qAkiDMB1UGasU-dfGp7aLhhqrByQw2kb3Ctmg4lHFjLDumM",null,[1],1,null,null,1,0,null,null,null,null,null,[[1]],0,null,null,null,null,null,null,null,null,1,null,null,[4],null,null,null,null,null,null,null,null,null,null,[1],null,null,null,null,null,null,null,null,null,null,null,0,null,null,null,null,null,"CD5E1B30-0159-4554-9E52-58C4B59164C9",null,[1],null,null,null,null,null,null,0,2,null,null,null,null,null,null,null,null,null,null,1,1,null,null,null,null,null,null,null,null,null,null,0]`];
            const postData = querystring.stringify({ 'f.req': JSON.stringify(fReq), 'at': 'AD1_LW7-ykRJHHakn9J5HG54ejJz:1783026355300' });

            const options = {
                hostname: this.host,
                path: this.path,
                method: 'POST',
                headers: {
                    'Host': 'gemini.google.com',
                    'Connection': 'keep-alive',
                    'Content-Length': Buffer.byteLength(postData),
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'X-Same-Domain': '1',
                    'X-Requested-With': 'mark.via.gp',
                    'Origin': 'https://gemini.google.com',
                    'Referer': 'https://gemini.google.com/',
                    'Cookie': 'SID=g.a000-wiA2AotHGmJYIsy4GAFY5ShvBV_D_W6SetgOjrj_toxuJZkx5R3ewsyloTZEdXTR1ickgACgYKARcSARASFQHGX2MiNdPDS72dnjARRYSQibIq3hoVAUF8yKptNNhSxgWWy1Gyqosg3npC0076; __Secure-1PSID=g.a000-wiA2AotHGmJYIsy4GAFY5ShvBV_D_W6SetgOjrj_toxuJZkbMm-OHW9Noa6W2c9lUJ8OAACgYKAR0SARASFQHGX2MiYl3FFVCXM76s52dRNUMcehoVAUF8yKqXhjTOx7Ngz-7KHms1wUYQ0076; __Secure-3PSID=g.a000-wiA2AotHGmJYIsy4GAFY5ShvBV_D_W6SetgOjrj_toxuJZkh7woWtjYqb4UeSlh6NELSAACgYKAdUSARASFQHGX2MiaEPKaQ4fN51J982DhsfHzxoVAUF8yKoHfl7tvx4ZjVKiUF96SbwY0076; HSID=Aw001d8t8vgA2J_VN; SSID=AREr3VjurTyje_sL7; APISID=sXY5WUNtYIqiKm0V/AOebW_K9wUchYTfpk; SAPISID=nBnpkSXZLeXOMjfa/AvWFLH8mc9d4YfgDD; __Secure-1PAPISID=nBnpkSXZLeXOMjfa/AvWFLH8mc9d4YfgDD; __Secure-3PAPISID=nBnpkSXZLeXOMjfa/AvWFLH8mc9d4YfgDD; SEARCH_SAMESITE=CgQInKEB; AEC=AdJVEauB5AQWsliy5HW9c69g_dkiKpWIP7WitEGlp1RD8nBvBS9AyiPYyhk; __Secure-BUCKET=CJcF; NID=532=MXQBSG0Scjq2gcONtDTYIGU_quZSZ6-Gvo81XddvW5lSYBOAyUMRnYgbXaZWQwW86-ytzXvDj-dWj5C-TVvTrv1fxXhybB0uopGTy5Uotj_y4f2M_2JA_p114qjxAqFuoFcJmBpGpls1f9nnbm848xwc45fIq0EJTE7qIB_87VDRnGnzaA0Yd6hBqgTP5YBIF0sjSHKRjRwBh_AXViUv6vJYcJcFA1xOqjSZl89oJy_EwNyBplLk21kwl3dpK8EzIcR6L34NJu7XnbUbWOt2dSHPPSS3H5dC-H6UX0k_RvUse5jPFi-Sp50wXaOcSzEF59jI2Ovd68uyy8BRU-QMfE8Kp4kfoOqk95ZGFgc4XAn4X8D96DnZYiXzUv7yjZlTpQ1dU-RtUjFEHJxodUzeVMnnvNgLVgLhe5PooqaFttJKQtKkEUT3HLn_cOdowL5ALqXKJuCP-WfJCKTaJ2-c6P9-mQB8nj9D4EMloHQhzwC69jKDMiaAOYL51INpK4jziDlZ84TLru5ChPm6OCzQ6ngRwuksg0-kmhUHFXevGJ6ZRp9NaDiwWBLkZqCbBbbCLyHx10CSE9NZNtRieJR_1XLJ7V4-Yoy8FChU2XS3x1Y0WRyrtJpm_yL3yDKfAv-qK90b6QKauv8ROtEAv0x8Trqkj6xU-pLovidGNTYOhxNdtKejqhGz2rTzB3Q-V9N188rDdmkfF2bqSIP-jWG7oWE; __Secure-1PSIDTS=sidts-CjIByojQU3eIOBN9y4CvEQnn5XN4PUna7p_DDAanPVdpn8xFx236CPhn_v4pENgIMYR9pBAA; __Secure-3PSIDTS=sidts-CjIByojQU3eIOBN9y4CvEQnn5XN4PUna7p_DDAanPVdpn8xFx236CPhn_v4pENgIMYR9pBAA; COMPASS=gemini-pd=CjwACWuJV93jFYb_b6k1ZbZc5AVi75OXfwVJx6huPFdJgLZgT-iphNSBtyIyTho-2Gurv4U86El7hPmdVFUQq7ug0gYaZgAJa4lXFm_97iE_VVuV5cFYGuo6Er-YYK9rrKfF5glAxwKtOeX7hrT4HDF-7kC1ZOPQRd-hRr_dLqt-r-EXTp5mrnqEt_MNNmY0Ie9rE5-kUdIkTOrltkBCGTxCEdktWprYk4bC4CABMAE:gemini-hl=CkkACWuJV4Jq7gXnYGXm-CCWRGf1MNczIJ0yMsen8R98zb0fdd_v1HDcw_-Y0Gxw7WZu_GGVl89NUAGecp6EG6tM_DjudIlkdiK-EPe7oNIGGnMACWuJV3xvz59jsxi9mul6VYk5p1qMRe2aFbrvIi9gr2auynp_TGDdLVUBDjASlMBpIZncSguccbk9d7EYuUTV5qAudLd15uKokBP26UM2XF1vAKtAWM-toKw6Bi7sjYqu6qut0R7Uu6yU-P3IEdSjXrMqIAEwAQ; SIDCC=AKEyXzXFjGojvYY2thatgmarbmH-ClhCowiyPOxLTE2of-a_bUWOODnT0n2im6gAZg9zODwF; __Secure-1PSIDCC=AKEyXzULLGA-zbijJtt8FuWHGWPbwMT24pIV6x3D9wJHN91Xk-hE_HiK9nEaPUC-szHD8agp; __Secure-3PSIDCC=AKEyXzWIiu_ufwQ2qZY1Ke246nxyTgnMmeHnTZNG7UIf911rtBuGrfOijj1YgXT-EQce7mga',
                    'x-goog-ext-73010989-jspb': '[0]',
                    'x-goog-ext-525001261-jspb': '[1,null,null,null,"fbb127bbb056c959",null,null,0,[4,5,6,8],null,null,1,null,null,1,1,"5671213A-FE20-43B4-9C42-56E5C483A663"]',
                    'x-goog-ext-525005358-jspb': '["CD5E1B30-0159-4554-9E52-58C4B59164C9",1]',
                    'x-goog-ext-73010990-jspb': '[0,0,0]',
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br, zstd',
                    'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7'
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    const matches = [...data.matchAll(/\["rc_.*?",\["(.*?)"\]/g)];
                    if (matches.length > 0) {
                        resolve(matches[matches.length - 1][1].replace(/\\n/g, '\n'));
                    } else {
                        reject(new Error("Could not parse response"));
                    }
                });
            });

            req.on('error', (e) => reject(e));
            req.write(postData);
            req.end();
        });
    }
}

module.exports = {
    description: "Gemini AI Chat",
    method: "GET",
    parameters: [{ name: "prompt", required: true, description: "النص المطلوب." }],
    handler: async (req, res) => {
        const prompt = req.query.prompt;
        if (!prompt) return res.status(200).json({ status: "active", usage: "/api/ai/gemini?prompt=مرحبا" });
        try {
            const answer = await new GeminiAPI().chat(prompt);
            return res.status(200).json({ status: true, response: answer });
        } catch (e) {
            return res.status(500).json({ status: false, error: "GEMINI_ERROR", message: e.message });
        }
    },
};

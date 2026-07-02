const axios = require("axios");

class GeminiAPI {
  constructor() {
    this.baseUrl = "https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=boq_assistant-bard-web-server_20260630.21_p0&f.sid=-680358786181734346&hl=ar&_reqid=5485115&rt=c";
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

  async chat({ prompt }) {
    const fReq = [null, `[["${prompt}",0,null,null,null,null,0],["ar"],["","","","","","",null,null,null,""],"a7bc880d6879feb592edda0804560d4d",null,[1],1,null,null,1,0,null,null,null,null,null,[[0]],0,null,null,null,null,null,null,null,null,1,null,null,[4],null,null,null,null,null,null,null,null,null,null,[1],null,null,null,null,null,null,null,null,null,null,null,0,null,null,null,null,null,"5A19C9BC-3532-4CEE-A6FA-446D8E2F7AB1",null,[1],null,null,null,null,null,null,2,null,null,null,null,null,null,null,null,null,null,1,1,null,null,null,null,null,null,null,null,null,null,0]`];
    const body = new URLSearchParams();
    body.append("f.req", JSON.stringify(fReq));
    body.append("at", "AD1_LW4RuU2PkoEbdLlABQkoIVJd:1783024689512");

    const response = await axios.post(this.baseUrl, body, { headers: this.headers, timeout: 30000 });
    const match = response.data.match(/\["rc_.*?",\["(.*?)"\]/);
    return match && match[1] ? match[1].replace(/\\n/g, '\n') : "Error: Could not parse response.";
  }
}

module.exports = {
  description: "Gemini AI Chat",
  method: "GET",
  parameters: [{ name: "prompt", required: true, description: "النص المطلوب." }],
  handler: async (req, res) => {
    const prompt = req.query.prompt;
    if (!prompt) {
      return res.status(200).json({ status: "active", usage: "/api/ai/gemini?prompt=مرحبا" });
    }
    try {
      const answer = await new GeminiAPI().chat({ prompt });
      return res.status(200).json({ status: true, response: answer });
    } catch (e) {
      return res.status(500).json({ status: false, error: "GEMINI_ERROR", message: e.message });
    }
  },
};

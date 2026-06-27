const axios = require('axios');

module.exports.handler = async (req, res) => {
  try {
    const prompt = req.query.prompt;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'يرجى كتابة السؤال في معامل prompt'
      });
    }

    const headers = {
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      'origin': 'https://monica.im',
      'pragma': 'no-cache',
      'priority': 'u=1, i',
      'referer': 'https://monica.im/',
      'sec-ch-ua': '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
      'x-client-id': '5841e73e-0cf7-4da0-b44d-0271eb577558',
      'x-client-locale': 'en',
      'x-client-type': 'web',
      'x-client-version': '5.4.3',
      'x-from-channel': 'NA',
      'x-product-name': 'Monica',
      'x-time-zone': 'America/Los_Angeles;420',
      // كوكيز الجلسة الجديدة الخاصة بك لـ Llama
      'cookie': '_fwb=99iF5qq7XGPdRa03APqW9k.1781109592534; _twpid=tw.1781109592567.557714779376247011; _gcl_au=1.1.1455621523.1781109594; _ga=GA1.1.579200272.1781109594; _fbp=fb.1.1781109597011.36186411662560727; _clck=vf25n5%5E2%5Eg6s%5E0%5E2352; session_id=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3ODExMTAzODcsImlzcyI6Im1vbmljYSIsInVzZXJfaWQiOjIwMjU2NjQyOSwidXNlcl9uYW1lIjoiXHUwNjQ1XHUwNjMyXHUwNjQ1XHUwNjQ0IFpJUCIsImp0aSI6IjE2MWFhOTk2Nzc1ZDQ3OGZhNjdmMzI2MDVkZGVkNjRjIiwiY2xpZW50X3R5cGUiOiJ3ZWIifQ.od7wxB_gbf0e3cOP4-pe3rtrv7I98WHFOcYx4ULCcUk; _rdt_uuid=1781110349107.446dc179-c7d3-4fd4-a4a7-782b6c1c0f2c; _ga_E249CNSDCV=GS2.1.s1781109593$o1$g1$t1781110399$j5$l0$h0; _uetsid=0429a79064eb11f1a9e95f84082cfb5c; _uetvid=042a6e7064eb11f190459f2acc82ec06; _ga_JDZPETSM4F=GS2.1.s1781109594$o1$g1$t1781111780$j60$l0$h0; _clsk=1av0opk%5E1781111780953%5E20%5E0%5Ev.clarity.ms%2Fcollect; _ga_RJYZXDEM8N=GS2.1.s1781109593$o1$g1$t1781111781$j59$l0$h642804756'
    };

    const bodyData = {
      task_uid: "task:1ab4817a-2ca7-4dbf-80e0-c7f394800446",
      bot_uid: "monica",
      data: {
        conversation_id: "conv:0428923d-25bf-4419-9d0f-ab70fa1ee2e7",
        items: [
          {
            item_id: "msg:91b578c9-57e7-472b-97a6-e6d320e65141",
            conversation_id: "conv:0428923d-25bf-4419-9d0f-ab70fa1ee2e7",
            item_type: "reply",
            summary: "__RENDER_BOT_WELCOME_MSG__",
            data: { type: "text", content: "__RENDER_BOT_WELCOME_MSG__" }
          },
          {
            conversation_id: "conv:0428923d-25bf-4419-9d0f-ab70fa1ee2e7",
            item_id: "msg:821778d6-8596-43e7-bce7-7aa1a37120aa",
            item_type: "question",
            summary: prompt,
            parent_item_id: "msg:91b578c9-57e7-472b-97a6-e6d320e65141",
            data: {
              type: "text",
              content: prompt,
              quote_content: "",
              chat_model: "llama_3_3_70b", // توجيه الموديل الداخلي لـ Llama
              max_token: 0,
              is_incognito: false
            }
          }
        ],
        pre_generated_reply_id: "msg:07bb5d8b-2010-4ec0-a7f8-617da066bb58",
        pre_parent_item_id: "msg:821778d6-8596-43e7-bce7-7aa1a37120aa",
        origin: "https://monica.im/home/chat/Monica/monica",
        origin_page_title: "Chat - Monica",
        trigger_by: "auto",
        use_model: "llama-3.3-70b", // تحديد الموديل الرئيسي المطلوب
        is_incognito: false,
        use_new_memory: true,
        use_memory_suggestion: true
      },
      language: "auto",
      locale: "en",
      task_type: "chat_with_custom_bot",
      tool_data: {
        sys_skill_list: [
          { uid: "web_access", enable: false },
          { uid: "draw_image", enable: false },
          { uid: "book_calendar", enable: false },
          { uid: "code_interpreter", enable: false },
          { uid: "artifacts", enable: true }
        ]
      },
      ai_resp_language: "English"
    };

    // طلب الداتا مع تفعيل الـ stream لاستقبال الحزم بذكاء وتجنب تجمد الرد
    const apiRes = await axios.post('https://api.monica.im/api/custom_bot/chat', bodyData, {
      headers,
      responseType: 'stream',
      timeout: 45000
    });

    let fullReply = "";

    await new Promise((resolve, reject) => {
      apiRes.data.on('data', (chunk) => {
        const payload = chunk.toString();
        const lines = payload.split('\n');

        for (let line of lines) {
          if (!line.trim() || !line.startsWith('data:')) continue;
          try {
            const jsonStr = line.replace('data:', '').trim();
            const parsed = JSON.parse(jsonStr);
            // التقاط الكلمات الصافية القادمة من البث اللحظي
            if (parsed.text) {
              fullReply += parsed.text;
            }
          } catch (e) {
            // تخطي السطور المكسورة أثناء عملية البث
          }
        }
      });

      apiRes.data.on('end', () => resolve());
      apiRes.data.on('error', (err) => reject(err));
    });

    if (!fullReply.trim()) {
      return res.status(502).json({
        success: false,
        error: 'انتهت صلاحية الجلسة أو لم يتم استلام رد من Llama'
      });
    }

    // الرد النهائي المجمع بدقة وخالٍ من الأكواد الزائدة
    return res.json({
      success: true,
      creator: 'By Arab Top Dev',
      model: 'Llama 3.3 70B',
      reply: fullReply.trim()
    });

  } catch (error) {
    console.error('Monica Llama API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'حدث خطأ داخلي أثناء استدعاء نموذج Llama'
    });
  }
};

module.exports.description = 'محادثات متكاملة وسريعة مع نموذج Llama 3.3 70B القوي عبر سورس Monica';
module.exports.parameters = ['prompt'];
module.exports.method = 'GET';

// --- normalized export so this file works as a direct Vercel/Netlify serverless function ---
(() => {
  const _h = module.exports.handler;
  if (typeof _h === 'function') {
    const _desc = module.exports.description;
    const _params = module.exports.parameters;
    const _method = module.exports.method;
    module.exports = _h;
    module.exports.handler = _h;
    if (_desc !== undefined) module.exports.description = _desc;
    if (_params !== undefined) module.exports.parameters = _params;
    if (_method !== undefined) module.exports.method = _method;
  }
})();

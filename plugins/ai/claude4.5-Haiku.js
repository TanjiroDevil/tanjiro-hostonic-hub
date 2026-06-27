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
      'cookie': '_fwb=99iF5qq7XGPdRa03APqW9k.1781109592534; _twpid=tw.1781109592567.557714779376247011; _gcl_au=1.1.1455621523.1781109594; _ga=GA1.1.579200272.1781109594; _fbp=fb.1.1781109597011.36186411662560727; _clck=vf25n5%5E2%5Eg6s%5E0%5E2352; session_id=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3ODExMTAzODcsImlzcyI6Im1vbmljYSIsInVzZXJfaWQiOjIwMjU2NjQyOSwidXNlcl9uYW1lIjoiXHUwNjQ1XHUwNjMyXHUwNjQ1XHUwNjQ0IFpJUCIsImp0aSI6IjE2MWFhOTk2Nzc1ZDQ3OGZhNjdmMzI2MDVkZGVkNjRjIiwiY2xpZW50X3R5cGUiOiJ3ZWIifQ.od7wxB_gbf0e3cOP4-pe3rtrv7I98WHFOcYx4ULCcUk; _rdt_uuid=1781110349107.446dc179-c7d3-4fd4-a4a7-782b6c1c0f2c; _ga_E249CNSDCV=GS2.1.s1781109593$o1$g1$t1781110399$j5$l0$h0; oauth_session=eyJyZWRpcmVjdF91cmwiOiAiaHR0cHM6Ly9tb25pY2EuaW0vYXV0aC1sYW5kaW5nP2Zyb209d2ViJmNoYW5uZWw9b2ZmaWNpYWxfd2Vic2l0ZSZyZWRpcmVjdFRvPWh0dHBzJTNBJTJGJTJGbW9uaWNhLmltJTJGaG9tZSUzRmNoYW5uZWwlM0RvZmZpY2lhbF93ZWJzaXRlIiwgImp0aSI6ICIxNjFhYTk5Njc3NWQ0NzhmYTY3ZjMyNjA1ZGRlZDY0YyIsICJ0cmFjZV9pZCI6ICI1MDU5ZDgzNTFkZTU5ODRiNDllMDNhM2M3YmFhMjNmOSIsICJzdGF0ZSI6ICJ1T3pEQ0dMc09jZnd0U2U3dzEzVmFuNXdzTGNTUFMiLCAiY19kIjogIjEiLCAicmVmZXIiOiAiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8iLCAiZmlyc3FfZW50cnkiOiAiaHR0cHM6Ly9tb25pY2EuaW0vIiwgImZpcnN0X2Zyb21fcGxhdGZvcm0iOiAid2ViIiwgImZyb21fcHJvZHVjdCI6ICJtb25pY2EiLCAibG9jYWxlIjogImVuIiwgImJyb3dzZXJfbmFtZSI6ICJjaHJvbWUiLCAib3NfbmFtZSI6ICJ3aW5kb3dzIiwgIm9zX3ZlcnNpb24iOiAidW5rbm93biIsICJjbGllbnRfaWQiOiAiNTg0MWU3M2UtMGNmNy00ZGEwLWI0NGQtMDI3MWViNTc3NTU4IiwgImNsaWVudF90eXBlIjogIndlYiIsICJnb29nbGVfYWNjZXNzX3Rva2VuIjogInlhMjkuYTBBVDNvTlo5MFFOcUd2MEJMMmFEekpQRkZrcW5OU0JPMWJTaWd5SGxHeF9pZjFuLVRjNW94RG9ZRHNfN2dvbzI0dnJEMEd4NTFQbU5qYWNULTB6aGFLbUVwUW80TDhmWFdvcFU3Y3BReXdnX0RYc3dnNExfTjRUWFFkcHNOUDkxSl9zZVFCcmJ6UE53cVlvZ1pWNHJjMmZjR1hLM2x5eExFU3ZQbGVwZHdvSWhXZHRlZTVVRmdBRktLVmVXQk5zeUF1dkk5V3hrYUNnWUtBWFlTQVJZU0ZRSEdYMk1pcjB5UDA1VGRnN0YxZ2p2eGUtMEF3dzAyMDYifQ==.aimWlA.rmaeJrM_mvmhq1Z2GKMmOBSo8Zw; _uetsid=0429a79064eb11f1a9e95f84082cfb5c; _uetvid=042a6e7064eb11f190459f2acc82ec06; _ga_JDZPETSM4F=GS2.1.s1781109594$o1$g1$t1781110585$j60$l0$h0; _ga_RJYZXDEM8N=GS2.1.s1781109593$o1$g1$t1781110586$j59$l0$h642804756; _clsk=1av0opk%5E1781110587046%5E9%5E0%5Ev.clarity.ms%2Fcollect'
    };

    const bodyData = {
      task_uid: "task:47097816-404e-4618-9f16-c3e60cc44bbf",
      bot_uid: "claude_4_5_haiku",
      data: {
        conversation_id: "conv:b8b4bfce-a172-45cd-8d0c-ad4c7a3321fd",
        items: [
          {
            item_id: "msg:f968445d-927a-462d-9c2c-ba79532c9236",
            conversation_id: "conv:b8b4bfce-a172-45cd-8d0c-ad4c7a3321fd",
            item_type: "reply",
            summary: "__RENDER_BOT_WELCOME_MSG__",
            data: { type: "text", content: "__RENDER_BOT_WELCOME_MSG__" }
          },
          {
            conversation_id: "conv:b8b4bfce-a172-45cd-8d0c-ad4c7a3321fd",
            item_id: "msg:5b211615-17e5-4a58-aa86-ac70be2777a8",
            item_type: "question",
            summary: prompt,
            parent_item_id: "msg:f968445d-927a-462d-9c2c-ba79532c9236",
            data: {
              type: "text",
              content: prompt,
              quote_content: "",
              max_token: 0,
              is_incognito: false
            }
          }
        ],
        pre_generated_reply_id: "msg:61c11e30-fc75-4061-b6f4-b12d84afe698",
        pre_parent_item_id: "msg:5b211615-17e5-4a58-aa86-ac70be2777a8",
        origin: "https://monica.im/home/chat/Claude%204.6%20Sonnet/claude_4_6_sonnet",
        origin_page_title: "Claude 4.6 Sonnet - Monica Bots",
        trigger_by: "auto",
        use_model: "claude-haiku-4-5",
        is_incognito: false,
        use_new_memory: true,
        use_memory_suggestion: true
      },
      language: "auto",
      locale: "en",
      task_type: "chat",
      tool_data: { sys_skill_list: [] },
      ai_resp_language: "English"
    };

    // طلب الداتا كـ Stream من أجل استقبال القطع وتفكيكها بأمان
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
            // تجميع النص فقط وتجاهل الاقتراحات (follow_suggestions) في النهاية
            if (parsed.text) {
              fullReply += parsed.text;
            }
          } catch (e) {
            // تخطي السطور غير المكتملة أثناء التمرير
          }
        }
      });

      apiRes.data.on('end', () => resolve());
      apiRes.data.on('error', (err) => reject(err));
    });

    if (!fullReply.trim()) {
      return res.status(502).json({
        success: false,
        error: 'انتهت الجلسة أو لم نتمكن من جلب رد من النموذج.'
      });
    }

    // الرد النهائي الصافي والمستقر 100%
    return res.json({
      success: true,
      creator: 'By Arab Top Dev',
      model: 'Claude 4.5 Haiku',
      reply: fullReply.trim()
    });

  } catch (error) {
    console.error('Monica Claude API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'حدث خطأ داخلي في السيرفر'
    });
  }
};

module.exports.description = 'محادثات ذكية ومستقرة مع نموذج Claude 4.5 المحدث عبر Monica لقسم الـ AI';
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

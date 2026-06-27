const axios = require('axios');

module.exports.handler = async (req, res) => {
  try {
    const prompt = req.query.prompt;

    // التحقق من وجود السؤال
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'يرجى كتابة السؤال في معامل prompt'
      });
    }

    // الـ Headers المتطابقة تماماً مع متصفحك لحماية الجلسة وتخطي الـ Limit
    const headers = {
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      'origin': 'https://notegpt.io',
      'pragma': 'no-cache',
      'priority': 'u=1, i',
      'referer': 'https://notegpt.io/ai-chat',
      'sec-ch-ua': '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
      // كوكيز حسابك الشخصي الحصري
      'cookie': 'sbox-guid=MTc4MTA5NDI0MXwyNTh8ODk1NTUzMDUw; anonymous_user_id=211039d8-5ef3-4755-9ae4-a6a8bf5f7515; _gid=GA1.2.1433969832.1781094244; _ga=GA1.2.17709580.1781094240; crisp-client%2Fsession%2F02aa9b53-fc37-4ca7-954d-7a99fb3393de=session_284e10df-5aee-4b02-b1ca-b5fb40d18930; crisp-client%2Fsocket%2F02aa9b53-fc37-4ca7-954d-7a99fb3393de=0; g_state={"i_l":0,"i_ll":1781102815833,"i_e":{"enable_itp_optimization":0},"i_et":1781094245814}; last_login=02c560166a860d8963cd32168893f2dc848eab7a077c024ca3b8185b62691c13a%3A2%3A%7Bi%3A0%3Bs%3A10%3A%22last_login%22%3Bi%3A1%3Bi%3A3%3B%7D; ZFSESSID=drn3bbfqup1eht9o4th2cpef92; _identity=a8a4588a43b6e9110ac14044c0711e86e78745e3f644767cb6c816337f567fe6a%3A2%3A%7Bi%3A0%3Bs%3A9%3A%22_identity%22%3Bi%3A1%3Bs%3A24%3A%22%5B%2224292643%22%2Cnull%2C259200%5D%22%3B%7D; _ga_PFX3BRW5RQ=GS2.1.s1781102811$o2$g1$t1781102839$j32$l0$h1174319984'
    };

    // إرسال الطلب لـ NoteGPT مع تمرير موديل DeepSeek الجديد
    const apiRes = await axios.post('https://notegpt.io/api/v2/chat/stream', {
      message: prompt,
      language: "auto",
      model: "deepseek-v4-flash", // الموديل المطلوب لـ ديب سيك
      tone: "default",
      length: "moderate",
      conversation_id: "d064d8b3-fd13-4da9-8206-18d449c3bdff", // الآيدي الجديد الخاص بالموديل
      image_urls: [],
      chat_mode: "standard"
    }, { headers, timeout: 30000 });

    let fullReply = "";
    
    // معالجة الـ Stream النصي وتفكيك الأسطر القادمة من السيرفر
    const lines = apiRes.data.split('\n');
    for (let line of lines) {
      if (!line.trim() || !line.startsWith('data:')) continue;
      try {
        const jsonStr = line.replace('data:', '').trim();
        const parsed = JSON.parse(jsonStr);
        
        if (parsed.text) {
          fullReply += parsed.text;
        }
      } catch (e) {
        // تخطي الأسطر غير المكتملة أو الفارغة برمجياً
      }
    }

    if (!fullReply) {
      return res.status(502).json({
        success: false,
        error: 'لم نتمكن من تلقي رد من نموذج DeepSeek، يرجى المحاولة مجدداً.'
      });
    }

    // إرجاع الإجابة النهائية بصيغة JSON نظيفة للموقع والمودال
    return res.json({
      success: true,
      model_used: 'deepseek-v4',
      reply: fullReply.trim()
    });

  } catch (error) {
    console.error('DeepSeek Scraping Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'حدث خطأ في السيرفر أثناء جلب بيانات DeepSeek'
    });
  }
};

// إعدادات التصدير الذكية للوحة التحكم
module.exports.description = 'إجابات برمجية ومنطقية فائقة السرعة مع نموذج DeepSeek V4 الفلاشي اللانهائي';
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

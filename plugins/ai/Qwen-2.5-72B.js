const axios = require('axios');

module.exports.handler = async (req, res) => {
  try {
    const prompt = req.query.prompt;

    // التحقق من وجود السؤال داخل الـ query
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'يرجى كتابة السؤال في معامل prompt'
      });
    }

    // الـ Headers المحدثة لتخطي حماية السيرفر لنموذج كوين
    const headers = {
      'accept': '*/*',
      'accept-language': 'ar-SD',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      'origin': 'https://chatgpt.org',
      'pragma': 'no-cache',
      'referer': 'https://chatgpt.org/qwen/chat', // تعديل مسار التشغيل لـ Qwen
      'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
      'x-csrf-token': 'PBftLta0DhWVvjju0MeUzPF2jtfQSsrm71Go2Nr7',
      'cookie': '_ga=GA1.1.283082279.1781286245; XSRF-TOKEN=eyJpdiI6ImJCMmFEVFlBQ0FqdjVnbnVXTUtROWc9PSIsInZhbHVlIjoiMDFIZEl4WmhYdzJ1cDlDV2VscDFGUlFVR0FrVnpIeEQ0OEJXVDkwREdPZGRGMjJISERocm5nazhvUmUrcTNsMXRIM3c5VEswdGttSThuSGh0Sm9oUEQ5RmVBalMrK0V3L09XMnpIU2lSMDFKcTVZYUg5RlVaVW1ZamNqOTJpWm8iLCJtYWMiOiI5ZDdmMDFjMzVmNDFkN2Y0ZGM3M2FhNzNiNWIwODFjMDllMTkwZmE3YTdkMzM3YWViNTE5NTMyZDA3MjgzZTc4In0%3D; chatgptorg_session=eyJpdiI6InJ6UWNZYzRUVmVGRGsvZ29VZWVXK3c9PSIsInZhbHVlIjoiTDQrUElNeHIwYTFsbkFlL0VHbktRVEplRlZrYzBZMXc2WThzS3BESnhxdkdjY1NHcStIMWRZbjFxOHd2bG5LNUpsT08yWGdTS3RJNTJONUZPWEpJSEhzWE1FMmNTTkJHbm9WSmkzZnRCWjh1VXd5S2wvTlhTeS9WYmVwZExYV24iLCJtYWMiOiJjNmE0NzMzMjg3ZGY0ZmQ1N2I2MTI4ZDM0ZDdjMjhiOWJjNThkZmU0YjJkMTlkZmQ0NjAzYzJmZDUzZTg5NDUzIn0%3D'
    };

    // إرسال الطلب الخام للحصول على الـ Stream كاملاً كـ Text مع موديل كوين المحدد
    const apiRes = await axios.post('https://chatgpt.org/api/chat', {
      model: "qwen/qwen-2.5-72b-instruct", // موديل كوين المطلوب
      messages: [
        { role: "user", content: prompt }
      ]
    }, { headers, timeout: 25000, responseType: 'text' });

    let fullReply = "";
    
    // تفكيك داتا البث القادمة من السيرفر وتجميع الـ content
    const lines = apiRes.data.split('\n');
    for (let line of lines) {
      if (!line.trim() || !line.startsWith('data:')) continue;
      
      try {
        const jsonStr = line.replace('data:', '').trim();
        if (jsonStr === '[DONE]') continue;

        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content || '';
        fullReply += content;
      } catch (e) {
        // تجاهل الأسطر غير المكتملة في نهاية البث
      }
    }

    if (!fullReply.trim()) {
      return res.status(502).json({
        success: false,
        error: 'فشل تجميع الرد من نموذج Qwen، يرجى تحديث الكوكيز لاحقاً.'
      });
    }

    // إرسال النتيجة النهائية النظيفة للوحة تحكم Nezuko
    return res.json({
      success: true,
      model_used: 'qwen-2.5-72b-instruct',
      reply: fullReply.trim()
    });

  } catch (error) {
    console.error('Qwen AI Scraping Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'حدث خطأ في السيرفر أثناء معالجة طلب كوين'
    });
  }
};

// إعدادات التصدير المخصصة للوحتك الذكية (Nezuko Control Panel)
module.exports.description = 'إجابات ذكية وموسعة باستخدام نموذج Qwen-2.5-72B المتطور من شركة Alibaba';
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

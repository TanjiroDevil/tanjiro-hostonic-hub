const axios = require("axios");

module.exports = {
  description: "Anti-NSFW image classifier (Nyckel).",
  method: "GET",
  parameters: [
    { name: "imageUrl", required: true, description: "رابط الصورة المراد فحصها." },
  ],
  handler: async (req, res) => {
    const imageUrl = (req.query && req.query.imageUrl) || (req.body && req.body.imageUrl);
    if (!imageUrl)
      return res.status(200).json({
        api: "NSFW Detector",
        status: "online",
        usage: "/api/ai/antinsfw?imageUrl=LINK",
      });
    try {
      const imgRes = await axios.get(imageUrl.trim(), {
        responseType: "arraybuffer",
        timeout: 15000,
        maxContentLength: 5 * 1024 * 1024,
        headers: { "User-Agent": "Mozilla/5.0", Accept: "image/*" },
      });
      const ct = imgRes.headers["content-type"];
      if (!ct || !ct.startsWith("image/")) throw new Error("URL is not an image");
      const b64 = Buffer.from(imgRes.data).toString("base64");
      const nyck = await axios.post(
        "https://www.nyckel.com/v1/functions/o2f0jzcdyut2qxhu/invoke",
        { data: `data:${ct};base64,${b64}` },
        { headers: { "Content-Type": "application/json" }, timeout: 15000 }
      );
      const label = String(nyck.data.labelName || "").toLowerCase();
      return res.status(200).json({
        status: "success",
        prediction:
          label === "porn" ? "محتوى غير لائق ⚠️" : label === "safe" ? "محتوى آمن ✅" : label,
        accuracy: (nyck.data.confidence * 100).toFixed(2) + "%",
        format: ct.split("/")[1],
      });
    } catch (e) {
      return res.status(400).json({ status: "error", message: e.message });
    }
  },
};

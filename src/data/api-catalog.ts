// Fallback catalog used by /docs if `/api/list` is unreachable.
export interface ApiParameter {
  name: string;
  required: boolean;
  description?: string;
}

export interface ApiEndpoint {
  name: string;
  category: string;
  method: string;
  description?: string;
  parameters: ApiParameter[];
  path: string;
}

export type ApiCatalog = Record<string, ApiEndpoint[]>;

export const FALLBACK_CATALOG: ApiCatalog = {
  ai: [
    { name: "gemini", category: "ai", method: "GET", description: "Gemini AI chat.", path: "/api/ai/gemini",
      parameters: [
        { name: "prompt", required: true, description: "النص المطلوب." },
        { name: "imageUrl", required: false, description: "رابط صورة اختياري." },
      ] },
    { name: "dopple", category: "ai", method: "GET", description: "DoppleAI chat.", path: "/api/ai/dopple",
      parameters: [{ name: "q", required: true, description: "السؤال." }] },
    { name: "openai", category: "ai", method: "GET", description: "OpenAI proxy.", path: "/api/ai/openai",
      parameters: [{ name: "q", required: true, description: "السؤال." }] },
    { name: "saanvi", category: "ai", method: "GET", description: "Saanvi AI.", path: "/api/ai/saanvi",
      parameters: [{ name: "q", required: true, description: "السؤال." }] },
    { name: "gpt4", category: "ai", method: "GET", description: "ChatGPT-4o scraper.", path: "/api/ai/gpt4",
      parameters: [{ name: "q", required: true, description: "السؤال." }] },
    { name: "antinsfw", category: "ai", method: "GET", description: "NSFW detector.", path: "/api/ai/antinsfw",
      parameters: [{ name: "imageUrl", required: true, description: "رابط الصورة." }] },
  ],
  search: [
    { name: "lyrics", category: "search", method: "GET", description: "بحث كلمات الأغاني.", path: "/api/search/lyrics",
      parameters: [{ name: "q", required: true, description: "اسم الأغنية." }] },
    { name: "tiktok", category: "search", method: "GET", description: "بحث فيديوهات TikTok.", path: "/api/search/tiktok",
      parameters: [{ name: "q", required: true, description: "كلمة البحث." }] },
  ],
  download: [
    { name: "snap", category: "download", method: "GET", description: "Snaptube downloader.", path: "/api/download/snap",
      parameters: [{ name: "url", required: true, description: "رابط الفيديو." }] },
    { name: "ytdl", category: "download", method: "GET", description: "YouTube downloader.", path: "/api/download/ytdl",
      parameters: [
        { name: "mp3url", required: false, description: "رابط للتحويل MP3." },
        { name: "mp4url", required: false, description: "رابط للتحويل MP4." },
      ] },
  ],
};

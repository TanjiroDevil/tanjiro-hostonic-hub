import React from 'react';
import { Music } from 'lucide-react';
import { VideoDownloader } from '../components/VideoDownloader';

export function TikTokDownloadPage() {
  return (
    <VideoDownloader
      platform="tiktok"
      pageKey="tiktok-download"
      brandName="TikTok"
      tagline="حمّل فيديوهات تيك توك بدون علامة مائية وبجودة عالية."
      description="انسخ رابط الفيديو من TikTok والصقه هنا للحصول على نسخة نظيفة."
      placeholder="https://www.tiktok.com/@user/video/..."
      icon={Music}
      gradient="from-pink-500 via-fuchsia-500 to-cyan-500"
      accent="border-pink-500/30"
      ring="focus:ring-pink-500/50 focus:border-pink-500/50"
      glow="shadow-pink-500/30"
      filePrefix="tiktok-video"
    />
  );
}

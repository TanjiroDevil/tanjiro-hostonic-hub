import React from 'react';
import { Instagram } from 'lucide-react';
import { VideoDownloader } from '../components/VideoDownloader';

export function InstagramDownloadPage() {
  return (
    <VideoDownloader
      platform="instagram"
      pageKey="instagram-download"
      brandName="Instagram"
      tagline="حمّل ريلز إنستغرام، الفيديوهات، والقصص بضغطة واحدة."
      description="انسخ رابط الريل أو المنشور والصقه هنا."
      placeholder="https://www.instagram.com/reel/..."
      icon={Instagram}
      gradient="from-pink-500 via-fuchsia-500 to-purple-600"
      accent="border-pink-500/30"
      ring="focus:ring-pink-500/50 focus:border-pink-500/50"
      glow="shadow-pink-500/30"
      filePrefix="instagram-reel"
    />
  );
}

import React from 'react';
import { Facebook } from 'lucide-react';
import { VideoDownloader } from '../components/VideoDownloader';

export function FacebookDownloadPage() {
  return (
    <VideoDownloader
      platform="facebook"
      pageKey="facebook-download"
      brandName="Facebook"
      tagline="حمّل فيديوهات فيسبوك بجودة عالية وبدون إعلانات."
      description="يدعم منشورات الفيديو، الريلز، والقصص العامة."
      placeholder="https://www.facebook.com/..."
      icon={Facebook}
      gradient="from-blue-500 to-blue-700"
      accent="border-blue-500/30"
      ring="focus:ring-blue-500/50 focus:border-blue-500/50"
      glow="shadow-blue-500/30"
      filePrefix="facebook-video"
    />
  );
}

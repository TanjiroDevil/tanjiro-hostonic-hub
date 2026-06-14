import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Music2,
  Youtube,
  Instagram,
  Ghost,
  Music,
  Video,
  ArrowRight,
  Sparkles,
  Download as DownloadIcon,
} from 'lucide-react';
import { SectionBackground } from '../components/SectionBackground';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  path?: string;
  gradient: string;
  glow: string;
  available: boolean;
  badge?: string;
}

const services: Service[] = [
  {
    id: 'spotify',
    name: 'Spotify',
    description: 'ابحث عن أي أغنية وحمّلها بجودة عالية مباشرة من Spotify.',
    icon: Music2,
    path: '/spotify-search',
    gradient: 'from-emerald-500 to-green-700',
    glow: 'shadow-emerald-500/40',
    available: true,
    badge: 'متاح الآن',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'تحميل الفيديوهات والمقاطع الصوتية من يوتيوب بجودات متعددة.',
    icon: Youtube,
    gradient: 'from-red-500 to-rose-700',
    glow: 'shadow-red-500/40',
    available: false,
    badge: 'قريباً',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    description: 'حمّل فيديوهات تيك توك بدون علامة مائية وبسرعة فائقة.',
    icon: Music,
    gradient: 'from-pink-500 via-fuchsia-500 to-cyan-500',
    glow: 'shadow-pink-500/40',
    available: false,
    badge: 'قريباً',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'تحميل الريلز والصور والقصص من إنستغرام بكل سهولة.',
    icon: Instagram,
    gradient: 'from-purple-500 via-pink-500 to-orange-500',
    glow: 'shadow-pink-500/40',
    available: false,
    badge: 'قريباً',
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    description: 'احفظ سنابات وقصص سناب شات بضغطة واحدة.',
    icon: Ghost,
    gradient: 'from-yellow-400 to-amber-500',
    glow: 'shadow-yellow-500/40',
    available: false,
    badge: 'قريباً',
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    description: 'تحميل الفيديوهات والصور من منصة X بأعلى جودة متوفرة.',
    icon: Video,
    gradient: 'from-slate-700 to-slate-900',
    glow: 'shadow-slate-500/40',
    available: false,
    badge: 'قريباً',
  },
];

export function DownloadsHubPage() {
  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      <SectionBackground />

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm mb-6 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span>مركز خدمات التحميل</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            حمّل من أي مكان،
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              بضغطة واحدة
            </span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            مجموعة متكاملة من أدوات التحميل من أشهر المنصات. سريعة، آمنة، ومجانية بالكامل.
          </p>
        </motion.div>

        {/* Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-16"
        >
          {[
            { value: '1+', label: 'خدمة متاحة' },
            { value: '5+', label: 'خدمة قادمة' },
            { value: '∞', label: 'تحميلات مجانية' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-gray-900/40 backdrop-blur-md border border-gray-700/40 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-400 text-xs md:text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            const CardInner = (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={service.available ? { y: -6, scale: 1.02 } : {}}
                className={`group relative h-full bg-gray-900/50 backdrop-blur-md border border-gray-700/50 rounded-3xl p-6 overflow-hidden transition-all duration-300 ${
                  service.available
                    ? `cursor-pointer hover:border-transparent hover:shadow-2xl ${service.glow}`
                    : 'opacity-70 cursor-not-allowed'
                }`}
              >
                {/* Gradient glow on hover */}
                {service.available && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />
                )}

                {/* Badge */}
                {service.badge && (
                  <div
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                      service.available
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-gray-700/60 text-gray-300 border border-gray-600/50'
                    }`}
                  >
                    {service.badge}
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} mb-5 shadow-lg ${
                    service.available ? 'group-hover:scale-110 group-hover:rotate-3' : ''
                  } transition-transform duration-300`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-2">{service.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 min-h-[3rem]">
                  {service.description}
                </p>

                {/* CTA */}
                <div
                  className={`flex items-center gap-2 text-sm font-semibold ${
                    service.available
                      ? 'text-white group-hover:gap-3 transition-all'
                      : 'text-gray-500'
                  }`}
                >
                  {service.available ? (
                    <>
                      <span>ابدأ التحميل الآن</span>
                      <ArrowRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    </>
                  ) : (
                    <>
                      <DownloadIcon className="h-4 w-4" />
                      <span>سيتم إضافتها قريباً</span>
                    </>
                  )}
                </div>
              </motion.div>
            );

            return service.available && service.path ? (
              <Link key={service.id} to={service.path} className="block h-full">
                {CardInner}
              </Link>
            ) : (
              <div key={service.id} className="h-full">
                {CardInner}
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 text-gray-500 text-sm"
        >
          المزيد من الخدمات في الطريق إليك ✨
        </motion.div>
      </div>
    </div>
  );
}

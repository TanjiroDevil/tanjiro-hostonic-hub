import React, { useState, FormEvent } from 'react';
import { Link2, Download, Loader2, Check, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { SectionBackground } from './SectionBackground';

interface ResultItem {
  quality: string;
  url: string;
}

interface ApiResponse {
  status: string;
  title: string;
  results: ResultItem[];
  message?: string;
}

export interface VideoDownloaderProps {
  platform: 'facebook' | 'instagram';
  brandName: string;
  tagline: string;
  description: string;
  placeholder: string;
  icon: React.ElementType;
  gradient: string;
  accent: string;
  ring: string;
  glow: string;
  filePrefix: string;
  pageKey: string;
}

export function VideoDownloader({
  platform,
  brandName,
  tagline,
  description,
  placeholder,
  icon: Icon,
  gradient,
  accent,
  ring,
  glow,
  filePrefix,
  pageKey,
}: VideoDownloaderProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [downloading, setDownloading] = useState<Record<number, 'loading' | 'done'>>({});
  const [isPreparing, setIsPreparing] = useState(false);

  const handleFetch = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    setResults([]);
    setTitle('');

    try {
      const res = await fetch(
        `https://tanjirodev.online/api/down-snap?url=${encodeURIComponent(url.trim())}`,
      );
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data: ApiResponse = await res.json();

      if (data.status !== 'success' || !data.results || data.results.length === 0) {
        throw new Error(data.message || 'تعذر استخراج الفيديو من هذا الرابط');
      }

      setResults(data.results);
      setTitle(data.title || brandName);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'فشل جلب البيانات';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (item: ResultItem, idx: number) => {
    if (downloading[idx]) return;
    setDownloading((p) => ({ ...p, [idx]: 'loading' }));
    setIsPreparing(true);
    const loadingToast = toast.loading('جاري تحضير الفيديو...');
    try {
      const safeName = `${filePrefix}-${Date.now()}.mp4`;
      const a = document.createElement('a');
      a.href = item.url;
      a.download = safeName;
      a.rel = 'noopener noreferrer';
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast.dismiss(loadingToast);
      toast.success('بدأ التحميل ✨');
      setDownloading((p) => ({ ...p, [idx]: 'done' }));
      setTimeout(() => {
        setDownloading((p) => {
          const n = { ...p };
          delete n[idx];
          return n;
        });
      }, 2500);
    } catch {
      toast.dismiss(loadingToast);
      toast.error('عذراً، تعذر بدء التحميل');
      setDownloading((p) => {
        const n = { ...p };
        delete n[idx];
        return n;
      });
    } finally {
      setIsPreparing(false);
    }
  };

  return (
    <div className="min-h-screen relative" data-page={pageKey} dir="rtl">
      <SectionBackground />

      <section className="relative container mx-auto px-4 pt-24 pb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} bg-opacity-20 border ${accent} mb-6 shadow-lg ${glow}`}
          >
            <Icon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {brandName}{' '}
            <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              Downloader
            </span>
          </h1>
          <p className="text-gray-400 text-lg">{tagline}</p>
          <p className="text-gray-500 text-sm mt-2">{description}</p>
        </motion.div>

        {/* URL Form */}
        <motion.form
          onSubmit={handleFetch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 max-w-3xl mx-auto bg-gray-900/40 backdrop-blur-md border border-gray-700/40 rounded-2xl p-5 shadow-xl"
        >
          <label className="block text-sm text-gray-300 mb-2">رابط الفيديو</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Link2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={placeholder}
                className={`w-full bg-gray-950/60 border border-gray-700/50 text-white placeholder-gray-500 rounded-lg pr-10 pl-3 py-3 focus:outline-none focus:ring-2 ${ring} transition-all text-sm`}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r ${gradient} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg transition-all shadow-lg ${glow}`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري الجلب...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  استخراج
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            الصق رابط منشور أو فيديو {brandName} العام ثم اضغط استخراج.
          </p>
        </motion.form>
      </section>

      {/* Results */}
      <section className="relative container mx-auto px-4 pb-24">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 mb-6 flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        {searched && !loading && !error && results.length === 0 && (
          <div className="max-w-3xl mx-auto text-center text-gray-400 py-12">
            لم يتم العثور على نتائج. جرّب رابطاً آخر.
          </div>
        )}

        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-gray-900/40 backdrop-blur-md border border-gray-700/40 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-white font-semibold truncate">{title}</h2>
                  <p className="text-gray-400 text-xs">
                    {results.length} {results.length === 1 ? 'رابط متاح' : 'روابط متاحة'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {results.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-3 p-4 bg-gray-950/50 border border-gray-800/60 rounded-xl hover:border-gray-700 transition-all"
                    >
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${gradient} text-white shadow-md`}
                      >
                        {item.quality}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-300 text-sm truncate" title={item.url}>
                          فيديو جاهز للتحميل
                        </p>
                      </div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors p-2"
                        aria-label="فتح في تبويب جديد"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDownload(item, idx)}
                        disabled={!!downloading[idx]}
                        className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r ${gradient} hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-all shadow-md ${glow} active:scale-[0.98]`}
                      >
                        {downloading[idx] === 'loading' ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>جاري...</span>
                          </>
                        ) : downloading[idx] === 'done' ? (
                          <>
                            <Check className="h-4 w-4" />
                            <span>تم</span>
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            <span>تحميل</span>
                          </>
                        )}
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      <AnimatePresence>
        {isPreparing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/70 backdrop-blur-md"
            aria-live="polite"
            role="status"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className={`relative flex flex-col items-center gap-5 px-8 py-7 rounded-2xl bg-gray-900/80 border ${accent} shadow-2xl ${glow}`}
            >
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-gray-700/50" />
                <motion.div
                  className={`absolute inset-0 rounded-full border-4 border-transparent`}
                  style={{ borderTopColor: 'white', borderRightColor: 'rgba(255,255,255,0.6)' }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-white font-semibold text-base">جاري تحضير الفيديو</p>
                <p className="text-gray-400 text-xs mt-1">يرجى الانتظار لحظات...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

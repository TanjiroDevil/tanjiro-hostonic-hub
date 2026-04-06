import React, { useState, useEffect } from 'react';
import { Download, Zap, Gamepad2, Image, Search, Wrench, Copy, ExternalLink, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionBackground } from '../components/SectionBackground';

interface Endpoint {
  id: string;
  endpoint_name: string;
  method: string;
  path: string;
}

interface APICategory {
  id: string;
  category_name: string;
  category_description: string;
  icon_name: string;
  endpoints?: Endpoint[];
}

interface CopiedState {
  [key: string]: boolean;
}

const STORAGE_KEY = 'tanjirodeveloper_apis';

const iconMap: { [key: string]: React.ElementType } = {
  'Download': Download,
  'Zap': Zap,
  'Gamepad2': Gamepad2,
  'Image': Image,
  'Search': Search,
  'Wrench': Wrench,
};

const DEFAULT_APIS: APICategory[] = [
  {
    id: '1',
    category_name: 'Downloader',
    category_description: 'Download and extract content from various sources with ease',
    icon_name: 'Download',
    endpoints: [
      { id: '1-1', endpoint_name: 'Instagram Posts', method: 'GET', path: '/api/downloader/snaptube?url=' },
      { id: '1-2', endpoint_name: 'TikTok Videos', method: 'GET', path: '/api/downloader/snaptube?url=' },
      { id: '1-3', endpoint_name: 'YouTube Videos', method: 'GET', path: '/api/download/youtube' },
      { id: '1-4', endpoint_name: 'Twitter Media', method: 'GET', path: '/api/download/twitter' },
    ]
  },
  {
    id: '2',
    category_name: 'AI',
    category_description: 'Leverage advanced AI models for intelligent processing',
    icon_name: 'Zap',
    endpoints: [
      { id: '2-1', endpoint_name: 'ChatGPT-4o', method: 'POST', path: '/api/ai/gpt4o' },
      { id: '2-2', endpoint_name: 'Gemini', method: 'POST', path: '/api/ai/gemini' },
      { id: '2-3', endpoint_name: 'Image Analysis', method: 'POST', path: '/api/ai/analyze-image' },
      { id: '2-4', endpoint_name: 'Text Generation', method: 'POST', path: '/api/ai/generate' },
      { id: '2-5', endpoint_name: 'Sentiment Analysis', method: 'POST', path: '/api/ai/sentiment' },
    ]
  },
  {
    id: '3',
    category_name: 'Games',
    category_description: 'Game data, statistics, and integration endpoints',
    icon_name: 'Gamepad2',
    endpoints: [
      { id: '3-1', endpoint_name: 'Game Info', method: 'GET', path: '/api/games/info' },
      { id: '3-2', endpoint_name: 'Leaderboard', method: 'GET', path: '/api/games/leaderboard' },
      { id: '3-3', endpoint_name: 'Player Stats', method: 'GET', path: '/api/games/player-stats' },
      { id: '3-4', endpoint_name: 'Match History', method: 'GET', path: '/api/games/matches' },
    ]
  },
  {
    id: '4',
    category_name: 'Images',
    category_description: 'Image processing, transformation, and enhancement tools',
    icon_name: 'Image',
    endpoints: [
      { id: '4-1', endpoint_name: 'Image Resize', method: 'POST', path: '/api/images/resize' },
      { id: '4-2', endpoint_name: 'Image Filter', method: 'POST', path: '/api/images/filter' },
      { id: '4-3', endpoint_name: 'Image Compress', method: 'POST', path: '/api/images/compress' },
      { id: '4-4', endpoint_name: 'Image OCR', method: 'POST', path: '/api/images/ocr' },
    ]
  },
  {
    id: '5',
    category_name: 'Search',
    category_description: 'Powerful search and information retrieval APIs',
    icon_name: 'Search',
    endpoints: [
      { id: '5-1', endpoint_name: 'Web Search', method: 'GET', path: '/api/search/web' },
      { id: '5-2', endpoint_name: 'Image Search', method: 'GET', path: '/api/search/images' },
      { id: '5-3', endpoint_name: 'Video Search', method: 'GET', path: '/api/search/videos' },
      { id: '5-4', endpoint_name: 'News Search', method: 'GET', path: '/api/search/news' },
    ]
  },
  {
    id: '6',
    category_name: 'Tools',
    category_description: 'Utility and conversion tools for common tasks',
    icon_name: 'Wrench',
    endpoints: [
      { id: '6-1', endpoint_name: 'Unit Converter', method: 'GET', path: '/api/tools/convert' },
      { id: '6-2', endpoint_name: 'QR Code Generator', method: 'POST', path: '/api/tools/qr-code' },
      { id: '6-3', endpoint_name: 'URL Shortener', method: 'POST', path: '/api/tools/shorten-url' },
      { id: '6-4', endpoint_name: 'Base64 Encoder', method: 'POST', path: '/api/tools/encode' },
    ]
  },
];

export function APIsPage() {
  const [apiCategories, setApiCategories] = useState<APICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedStates, setCopiedStates] = useState<CopiedState>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAPIs();

    const handleApisUpdated = (event: any) => {
      setApiCategories(event.detail);
    };

    window.addEventListener('apisUpdated', handleApisUpdated);

    return () => {
      window.removeEventListener('apisUpdated', handleApisUpdated);
    };
  }, []);

  const loadAPIs = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setApiCategories(JSON.parse(stored));
      } else {
        setApiCategories(DEFAULT_APIS);
      }
    } catch (error) {
      console.error('Error loading APIs:', error);
      setApiCategories(DEFAULT_APIS);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-20 text-center relative overflow-hidden">
        <SectionBackground />
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <Zap className="h-10 w-10 text-blue-500" />
            <h1 className="text-4xl font-bold text-white ml-3">TanjiroDev APIs</h1>
          </div>
          <h2 className="text-5xl font-bold text-white mb-6">
            Welcome to TanjiroDev APIs
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Powerful, developer-friendly APIs for downloaders, AI, games, images, search, and utility tools.
            Integrate seamlessly and scale your applications with ease.
          </p>
          <a
            href="https://wa.me/967772350066"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get API Key <ChevronRight className="h-5 w-5" />
          </a>
        </div>
      </header>

      {/* API Categories Accordion */}
      <section className="container mx-auto px-4 py-16 relative overflow-hidden">
        <SectionBackground />
        <div className="relative z-10 max-w-4xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Browse All APIs</h2>
          <AnimatePresence mode="popLayout">
            {apiCategories.map((category) => {
              const IconComponent = iconMap[category.icon_name] || Zap;
              const isExpanded = expandedCategories.has(category.id);

              return (
                <motion.div
                  key={category.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800/40 backdrop-blur-sm rounded-lg border border-gray-700/50 overflow-hidden shadow-lg hover:border-blue-500/50 transition-colors duration-300"
                >
                  {/* Category Header - Accordion Toggle */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full px-6 py-5 flex items-center justify-between bg-gradient-to-r from-gray-800/20 to-transparent hover:from-gray-800/40 hover:to-transparent transition-colors duration-300 group"
                  >
                    <div className="flex items-center gap-4 flex-1 text-left">
                      <div className="bg-blue-500/20 p-2.5 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                        <IconComponent className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                          {category.category_name}
                        </h3>
                        <p className="text-gray-400 text-xs mt-0.5">{category.category_description}</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-4"
                    >
                      <ChevronDown className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    </motion.div>
                  </button>

                  {/* Endpoints - Animated Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-700/30"
                      >
                        <div className="p-6 space-y-3 bg-gray-900/20">
                          {category.endpoints && category.endpoints.length > 0 ? (
                            category.endpoints.map((endpoint, idx) => {
                              const endpointId = `${category.id}-${idx}`;
                              const methodColors: { [key: string]: string } = {
                                'GET': 'bg-green-500/20 text-green-400 border border-green-500/30',
                                'POST': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
                                'PUT': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
                                'DELETE': 'bg-red-500/20 text-red-400 border border-red-500/30',
                              };

                              return (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                                  className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/40 hover:border-blue-500/40 hover:bg-gray-800/60 transition-all duration-300 group/item"
                                >
                                  <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <span className={`${methodColors[endpoint.method]} px-2.5 py-1 rounded text-xs font-mono font-bold whitespace-nowrap`}>
                                        {endpoint.method}
                                      </span>
                                      <span className="text-gray-200 text-sm font-medium truncate hover:text-blue-300 transition-colors">
                                        {endpoint.endpoint_name}
                                      </span>
                                    </div>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => copyToClipboard(endpoint.path, endpointId)}
                                      className="text-gray-500 hover:text-blue-400 transition-colors flex-shrink-0"
                                      title="Copy endpoint"
                                    >
                                      {copiedStates[endpointId] ? (
                                        <span className="text-xs text-green-400 font-semibold">Copied!</span>
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </motion.button>
                                  </div>
                                  <code className="text-gray-400 text-xs font-mono block bg-gray-950/40 px-3 py-2 rounded border border-gray-700/30 break-all hover:border-blue-500/30 transition-colors">
                                    {endpoint.path}
                                  </code>
                                </motion.div>
                              );
                            })
                          ) : (
                            <p className="text-gray-400 text-sm text-center py-4">No endpoints available</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {apiCategories.length === 0 && (
            <div className="relative z-10 text-center py-12">
              <p className="text-gray-400 text-lg">No API categories available yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Code Example Section */}
      <section className="container mx-auto px-4 py-16 relative overflow-hidden">
        <SectionBackground />
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Quick Start Guide</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* JavaScript Example */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="bg-gray-900/50 px-6 py-4 border-b border-gray-700/30 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-gray-400 text-sm font-mono">javascript</span>
              </div>
              <div className="p-6">
                <pre className="text-gray-300 text-sm overflow-x-auto font-mono leading-relaxed">
                  <code>{`const apiKey = 'your-api-key';

fetch('/api/download/instagram', {
  method: 'GET',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  },
  params: {
    url: 'instagram-post-url'
  }
})
.then(res => res.json())
.then(data => console.log(data))`}</code>
                </pre>
              </div>
            </div>

            {/* Python Example */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="bg-gray-900/50 px-6 py-4 border-b border-gray-700/30 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-gray-400 text-sm font-mono">python</span>
              </div>
              <div className="p-6">
                <pre className="text-gray-300 text-sm overflow-x-auto font-mono leading-relaxed">
                  <code>{`import requests

api_key = 'your-api-key'
headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

response = requests.get(
    '/api/download/instagram',
    headers=headers,
    params={'url': 'instagram-post-url'}
)

print(response.json())`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication Section */}
      <section className="container mx-auto px-4 py-16 relative overflow-hidden">
        <SectionBackground />
        <div className="relative z-10 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8">
          <h2 className="text-3xl font-bold text-white mb-6">Authentication</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3 font-mono">Headers</h3>
              <div className="bg-gray-900/50 rounded-lg p-4 text-sm">
                <code className="text-gray-300 font-mono">
                  Authorization: Bearer YOUR_API_KEY
                </code>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3 font-mono">Rate Limits</h3>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• 1000 requests/hour</li>
                <li>• 10000 requests/day</li>
                <li>• Burst: 100 req/min</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-3 font-mono">Status Codes</h3>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• 200 - Success</li>
                <li>• 401 - Unauthorized</li>
                <li>• 429 - Rate limited</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 relative overflow-hidden">
        <SectionBackground />
        <div className="relative z-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers using TanjiroDev APIs to power their applications.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/967772350066"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Request API Access <ExternalLink className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 border border-blue-500 text-blue-400 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-500/10 transition-colors"
            >
              View Documentation <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';

interface Endpoint {
  id: string;
  endpoint_name: string;
  method: string;
  path: string;
}

interface API {
  id: string;
  category_name: string;
  category_description: string;
  icon_name: string;
  endpoints?: Endpoint[];
}

const STORAGE_KEY = 'tanjirodeveloper_apis';
const DEFAULT_APIS: API[] = [
  {
    id: '1',
    category_name: 'Downloader',
    category_description: 'Download and extract content from various sources with ease',
    icon_name: 'Download',
    endpoints: [
      { id: '1-1', endpoint_name: 'Instagram Posts', method: 'GET', path: '/api/download/instagram' },
      { id: '1-2', endpoint_name: 'TikTok Videos', method: 'GET', path: '/api/download/tiktok' },
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
      { id: '2-1', endpoint_name: 'Chat Completion', method: 'POST', path: '/api/ai/chat' },
      { id: '2-2', endpoint_name: 'Image Analysis', method: 'POST', path: '/api/ai/analyze-image' },
      { id: '2-3', endpoint_name: 'Text Generation', method: 'POST', path: '/api/ai/generate' },
      { id: '2-4', endpoint_name: 'Sentiment Analysis', method: 'POST', path: '/api/ai/sentiment' },
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

export function AdminAPIs() {
  const [apis, setApis] = useState<API[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingApi, setEditingApi] = useState<API | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedApi, setExpandedApi] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    category_name: '',
    category_description: '',
    icon_name: 'Zap',
  });

  const [newEndpoint, setNewEndpoint] = useState({
    endpoint_name: '',
    method: 'GET',
    path: '',
  });

  const iconOptions = [
    'Download', 'Zap', 'Gamepad2', 'Image', 'Search', 'Wrench'
  ];

  useEffect(() => {
    loadAPIs();
  }, []);

  const loadAPIs = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setApis(JSON.parse(stored));
      } else {
        setApis(DEFAULT_APIS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_APIS));
      }
    } catch (error) {
      console.error('Error loading APIs:', error);
      setApis(DEFAULT_APIS);
    } finally {
      setLoading(false);
    }
  };

  const saveAPIs = (updatedApis: API[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedApis));
      setApis(updatedApis);
      window.dispatchEvent(new CustomEvent('apisUpdated', { detail: updatedApis }));
    } catch (error) {
      console.error('Error saving APIs:', error);
      alert('Error saving APIs');
    }
  };

  const handleAddAPI = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category_name || !formData.category_description) {
      alert('Please fill in all fields');
      return;
    }

    const updatedApis = [...apis];

    if (editingApi) {
      const index = updatedApis.findIndex(a => a.id === editingApi.id);
      if (index !== -1) {
        updatedApis[index] = {
          ...editingApi,
          category_name: formData.category_name,
          category_description: formData.category_description,
          icon_name: formData.icon_name,
        };
      }
    } else {
      const newId = Math.max(...apis.map(a => parseInt(a.id)), 0) + 1;
      updatedApis.push({
        id: newId.toString(),
        category_name: formData.category_name,
        category_description: formData.category_description,
        icon_name: formData.icon_name,
        endpoints: [],
      });
    }

    saveAPIs(updatedApis);
    setFormData({ category_name: '', category_description: '', icon_name: 'Zap' });
    setEditingApi(null);
    setShowForm(false);
  };

  const handleDeleteAPI = (apiId: string) => {
    if (window.confirm('Are you sure you want to delete this API and all its endpoints?')) {
      const updatedApis = apis.filter(a => a.id !== apiId);
      saveAPIs(updatedApis);
    }
  };

  const handleAddEndpoint = (apiId: string) => {
    if (!newEndpoint.endpoint_name || !newEndpoint.path) {
      alert('Please fill in all endpoint fields');
      return;
    }

    const updatedApis = apis.map(api => {
      if (api.id === apiId) {
        const endpointId = `${apiId}-${(api.endpoints?.length || 0) + 1}`;
        return {
          ...api,
          endpoints: [
            ...(api.endpoints || []),
            {
              id: endpointId,
              ...newEndpoint,
            }
          ]
        };
      }
      return api;
    });

    saveAPIs(updatedApis);
    setNewEndpoint({ endpoint_name: '', method: 'GET', path: '' });
  };

  const handleDeleteEndpoint = (apiId: string, endpointId: string) => {
    if (window.confirm('Are you sure you want to delete this endpoint?')) {
      const updatedApis = apis.map(api => {
        if (api.id === apiId) {
          return {
            ...api,
            endpoints: (api.endpoints || []).filter(ep => ep.id !== endpointId)
          };
        }
        return api;
      });
      saveAPIs(updatedApis);
    }
  };

  const handleEditAPI = (api: API) => {
    setEditingApi(api);
    setFormData({
      category_name: api.category_name,
      category_description: api.category_description,
      icon_name: api.icon_name,
    });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingApi(null);
    setFormData({ category_name: '', category_description: '', icon_name: 'Zap' });
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">API Management</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            handleCancelEdit();
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add API Category
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 animate-fadeIn">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingApi ? 'Edit API Category' : 'Create New API Category'}
          </h2>
          <form onSubmit={handleAddAPI} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.category_name}
                  onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                  placeholder="e.g., Downloader"
                  className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Icon Name
                </label>
                <select
                  value={formData.icon_name}
                  onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                  className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category Description
              </label>
              <textarea
                value={formData.category_description}
                onChange={(e) => setFormData({ ...formData, category_description: e.target.value })}
                placeholder="Describe what this API category does..."
                className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                rows={3}
                required
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Check className="h-4 w-4" />
                {editingApi ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* APIs List */}
      <div className="space-y-4">
        {apis.length === 0 ? (
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 text-center">
            <p className="text-gray-400">No API categories yet. Create one to get started!</p>
          </div>
        ) : (
          apis.map((api) => (
            <div
              key={api.id}
              className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-blue-500/30 transition-colors duration-300"
            >
              {/* API Header */}
              <div className="p-6 bg-gradient-to-r from-gray-800/20 to-transparent flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">{api.category_name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{api.category_description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditAPI(api)}
                    className="text-blue-500 hover:text-blue-400 transition-colors p-2 hover:bg-blue-500/10 rounded"
                    title="Edit"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAPI(api.id)}
                    className="text-red-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Endpoints Section */}
              <div className="border-t border-gray-700/30 p-6">
                <button
                  onClick={() => setExpandedApi(expandedApi === api.id ? null : api.id)}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-4 font-medium"
                >
                  <span className="text-sm">
                    {expandedApi === api.id ? '▼' : '▶'} Endpoints ({api.endpoints?.length || 0})
                  </span>
                </button>

                {expandedApi === api.id && (
                  <div className="space-y-4 mt-4 animate-fadeIn">
                    {/* Endpoints List */}
                    {api.endpoints && api.endpoints.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {api.endpoints.map(endpoint => (
                          <div
                            key={endpoint.id}
                            className="bg-gray-900/50 rounded-lg p-3 flex items-center justify-between border border-gray-700/30 hover:border-blue-500/30 transition-all duration-200"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <span className={`px-2 py-1 rounded text-xs font-mono font-bold whitespace-nowrap ${
                                endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                                endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                                endpoint.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {endpoint.method}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-gray-300 text-sm">{endpoint.endpoint_name}</p>
                                <code className="text-gray-500 text-xs font-mono block truncate">{endpoint.path}</code>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteEndpoint(api.id, endpoint.id)}
                              className="text-red-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded flex-shrink-0"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Endpoint Form */}
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
                      <h4 className="text-sm font-semibold text-white mb-3">Add Endpoint</h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <input
                              type="text"
                              placeholder="Endpoint name"
                              value={newEndpoint.endpoint_name}
                              onChange={(e) => setNewEndpoint({ ...newEndpoint, endpoint_name: e.target.value })}
                              className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                          </div>
                          <div>
                            <select
                              value={newEndpoint.method}
                              onChange={(e) => setNewEndpoint({ ...newEndpoint, method: e.target.value })}
                              className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                            >
                              <option value="GET">GET</option>
                              <option value="POST">POST</option>
                              <option value="PUT">PUT</option>
                              <option value="DELETE">DELETE</option>
                            </select>
                          </div>
                          <div className="flex gap-1">
                            <input
                              type="text"
                              placeholder="/api/..."
                              value={newEndpoint.path}
                              onChange={(e) => setNewEndpoint({ ...newEndpoint, path: e.target.value })}
                              className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <button
                              onClick={() => handleAddEndpoint(api.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors flex items-center gap-1"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
